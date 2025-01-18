<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusUpdate;
use App\Models\Game;
use App\Models\Party;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Controllers\GameController;

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
            ->where('party_id', 2) // Filter games with party_id = 2
            ->orderBy('id', 'desc')
            ->get();


        $parties = Party::with([
            'members',
            'members.user',
        ])
            ->withCount('members')
            ->get();

        $gameController = new GameController();
        $readyPlayers = $gameController->fetchReadyPlayersByPartyID(2);

        return Inertia::render('Party', [
            'parties' => $parties,
            'games' => $games,
            'readyPlayers' => $readyPlayers
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
            ->where('party_id', 2) // Filter games with party_id = 2
            ->orderBy('id', 'desc')
            ->get();



        $parties = Party::with([
            'members',
            'members.user',
        ])
            ->withCount('members')
            ->get();


        $gameController = new GameController();
        $readyPlayers = $gameController->fetchReadyPlayersByPartyID(2);

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
