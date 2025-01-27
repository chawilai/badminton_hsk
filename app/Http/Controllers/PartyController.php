<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Party;
use App\Models\PartyMember;
use App\Models\PartyCourtBooking;
use App\Models\Court;
use Illuminate\Http\Request;
use App\Http\Controllers\GameController;
use Carbon\Carbon;
use Inertia\Inertia;

class PartyController extends Controller
{
    public function index(Request $request)
    {
        $games = Game::with([
            'gamePlayers.user',
            'shuttlecocks',
            'gameSets'
        ])
            ->withCount('gamePlayers')
            ->with(['gamePlayers' => function ($query) {
                $query->leftJoin('games', 'game_players.game_id', '=', 'games.id') // Link game_players to games
                    ->leftJoin('party_members', function ($join) {
                        $join->on('game_players.user_id', '=', 'party_members.user_id')
                            ->on('party_members.party_id', '=', 'games.party_id'); // Match the party
                    })
                    ->select('game_players.*', 'party_members.display_name'); // Select relevant fields
            }])
            ->where('party_id', $partyId)
            ->orderBy('id', 'desc')
            ->get();

        $parties = Party::with([
            'members',
            'members.user',
        ])
            ->withCount('members')
            ->get();

        $gameController = new GameController();
        $readyPlayers = $gameController->fetchReadyPlayersByPartyID($partyId);

        return Inertia::render('Party', [
            'parties' => $parties,
            'games' => $games,
            'readyPlayers' => $readyPlayers
        ]);
    }

    public function showParty(Request $request, $id)
    {

        // Check if the authenticated user is a member of the party
        $isMember = PartyMember::where('party_id', $id)
            ->where('user_id', auth()->id())
            ->exists();

        // If the user is not a member, redirect them to the home page or show a 403 error
        if (!$isMember) {
            abort(403, 'คุณไม่ได้รับสิทธิในการเข้า Party นี้.');
        }

        // Fetch games for the party
        $games = Game::with([
            'gamePlayers.user',
            'shuttlecocks',
            'gameSets'
        ])
            ->withCount('gamePlayers')
            ->with(['gamePlayers' => function ($query) use ($id) {
                $query->leftJoin('games', 'game_players.game_id', '=', 'games.id') // Link game_players to games
                    ->leftJoin('party_members', function ($join) use ($id) {
                        $join->on('game_players.user_id', '=', 'party_members.user_id')
                            ->on('party_members.party_id', '=', 'games.party_id') // Match the party
                            ->where('party_members.party_id', $id); // Ensure it matches the current party
                    })
                    ->select('game_players.*', 'party_members.display_name'); // Select relevant fields
            }])
            ->where('party_id', $id) // Filter games with the dynamic party_id
            ->orderBy('id', 'desc')
            ->get();

        // Fetch the current party and its members
        $party = Party::with([
            'members',
            'members.user',
        ])
            ->withCount('members')
            ->findOrFail($id);

        // Fetch ready players for the party
        $gameController = new GameController();
        $readyPlayers = $gameController->fetchReadyPlayersByPartyID($id);

        return Inertia::render('Party', [
            'party' => $party,
            'games' => $games,
            'readyPlayers' => $readyPlayers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'play_date' => 'required|date',
            'max_players' => 'required|integer|min:1',
            'court_id' => 'required|integer',
            'court_bookings' => 'required|array',
            'court_bookings.*.court_field_number' => 'required|integer|min:1',
            'court_bookings.*.start_time' => 'required',
            'court_bookings.*.end_time' => 'required',
        ]);

        // Extract the date part from play_date
        $play_date = Carbon::parse($validated['play_date'])->toDateString();

        // Calculate start_time and end_time from court_bookings
        $start_time = collect($validated['court_bookings'])->min('start_time');
        $end_time = collect($validated['court_bookings'])->max('end_time');

        // Calculate play_hours (difference in hours between start_time and end_time)
        $play_hours = Carbon::parse($start_time)->diffInHours(Carbon::parse($end_time));

        // Create the Party
        $party = Party::create([
            'court_id' => $validated['court_id'],
            'play_date' => $play_date,
            'play_hours' => $play_hours,
            'max_players' => $validated['max_players'],
            'start_time' => $start_time,
            'end_time' => $end_time,
            'creator_id' => auth()->id(),
        ]);
        // Add Court Bookings
        foreach ($validated['court_bookings'] as $booking) {
            PartyCourtBooking::create([
                'party_id' => $party->id,
                'court_id' => $validated['court_id'],
                'court_field_number' => $booking['court_field_number'],
                'start_time' => $booking['start_time'],
                'end_time' => $booking['end_time'],
            ]);
        }

        return back()->with('success', 'Party created successfully!');
    }

    public function joinParty(Request $request)
    {
        $validated = $request->validate([
            'party_id' => 'required|exists:parties,id',
        ]);

        $partyId = $validated['party_id'];
        $userId = auth()->id();

        // Check if the user is already a member of the party
        $isAlreadyMember = PartyMember::where('party_id', $partyId)
            ->where('user_id', $userId)
            ->exists();

        if ($isAlreadyMember) {
            return response()->json([
                'message' => 'คุณเป็นสมาชิกของปาร์ตี้นี้อยู่แล้ว',
            ], 400);
        }

        // Add the user as a member of the party
        PartyMember::create([
            'party_id' => $partyId,
            'user_id' => $userId,
            'role' => 'member',
            'status' => 'Requesting',
            'request_date' => now()
        ]);

        return back()->with('success', 'Party joined successfully!');
    }

    public function partyLists(Request $request)
    {
        $parties = Party::with([
            'members',
            'court',
            'courtBookings',
            'members.user',
        ])
            ->withCount('members')
            ->get();

        $courts = Court::all();

        return Inertia::render('PartyLists', [
            'parties' => $parties,
            'courts' => $courts,
        ]);
    }

    public function myParties(Request $request)
    {
        $userId = auth()->id();

        // Fetch parties where the authenticated user is a member
        $parties = Party::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->with([
                'members',
                'court',
                'courtBookings',
                'members.user',
            ])
            ->withCount('members')
            ->get();

        // Fetch all courts (optional)
        $courts = Court::all();

        return Inertia::render('PartyMyParties', [
            'parties' => $parties,
            'courts' => $courts,
        ]);
    }

    public function partyHome(Request $request)
    {
        $parties = Party::with([
            'members',
            'members.user',
        ])
            ->withCount('members')
            ->get();

        return Inertia::render('PartyHome', [
            'parties' => $parties,
        ]);
    }

    public function fetchPartyData(Request $request)
    {
        $games = Game::with([
            'gamePlayers.user',
            'shuttlecocks',
            'gameSets'
        ])
            ->withCount('gamePlayers')
            ->with(['gamePlayers' => function ($query) {
                $query->leftJoin('games', 'game_players.game_id', '=', 'games.id') // Link game_players to games
                    ->leftJoin('party_members', function ($join) {
                        $join->on('game_players.user_id', '=', 'party_members.user_id')
                            ->on('party_members.party_id', '=', 'games.party_id'); // Match the party
                    })
                    ->select('game_players.*', 'party_members.display_name'); // Select relevant fields
            }])
            ->where('party_id', $request->party_id)
            ->orderBy('id', 'desc')
            ->get();



        $parties = Party::with([
            'members',
            'members.user',
        ])
            ->withCount('members')
            ->get();


        $gameController = new GameController();
        $readyPlayers = $gameController->fetchReadyPlayersByPartyID($request->party_id);

        return back()->with([
            'parties' => $parties,
            'games' => $games,
            'readyPlayers' => $readyPlayers
        ]);
    }

    public function setInitialShuttlecocks(Request $request, Party $party)
    {
        $request->validate([
            'initial_shuttlecocks' => 'required|integer|min:0'
        ]);

        // Check if the new value is the same as the existing value
        if ($party->default_initial_shuttlecocks == $request->initial_shuttlecocks) {
            return back()->with('info', 'No changes were made as the value is already set.');
        }

        $party->default_initial_shuttlecocks = $request->initial_shuttlecocks;
        $party->save();

        return back()->with('success', 'Initial shuttlecocks set successfully.');
    }
}
