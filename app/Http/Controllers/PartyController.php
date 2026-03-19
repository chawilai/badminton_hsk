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
use App\Models\Friendship;
use App\Services\LinePushService;
use App\Services\PartyCostService;
use Inertia\Inertia;

class PartyController extends Controller
{
    public function index(Request $request)
    {

        return redirect('/party-lists');

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
            'court',
        ])
            ->withCount('members')
            ->findOrFail($id);

        // Fetch ready, playing, and break players for the party
        $gameController = new GameController();
        $readyPlayers = $gameController->fetchReadyPlayersByPartyID($id);
        $playingPlayers = $gameController->fetchPlayingPlayersByPartyID($id);

        // Break players: party members with game_status = 'break'
        $breakPlayers = PartyMember::with(['user.badmintonRank', 'user'])
            ->where('party_id', $id)
            ->where('game_status', 'break')
            ->get()
            ->map(function ($player) {
                return [
                    'user_id' => $player->user->id,
                    'party_member_id' => $player->id,
                    'name' => $player->user->name,
                    'display_name' => $player->display_name ?? $player->user->name,
                    'avatar' => $player->user->avatar,
                    'badminton_level' => $player->user->badmintonRank->id ?? 0,
                    'badminton_rank' => $player->user->badmintonRank->education_rank ?? '',
                    'game_status' => 'break',
                    'finished_games_count' => 0,
                    'waiting_time' => 0,
                    'current_game' => null,
                ];
            });

        $friendshipMap = [];
        $userId = auth()->id();
        $membersUserIds = $party->members->pluck('user_id')->filter(fn($mid) => $mid !== $userId);
        $friendships = Friendship::where(fn($q) =>
            $q->where(fn($q2) => $q2->where('sender_id', $userId)->whereIn('receiver_id', $membersUserIds))
              ->orWhere(fn($q2) => $q2->where('receiver_id', $userId)->whereIn('sender_id', $membersUserIds))
        )->get();
        foreach ($friendships as $f) {
            $otherId = $f->sender_id === $userId ? $f->receiver_id : $f->sender_id;
            $status = 'accepted';
            if ($f->status === 'pending') {
                $status = $f->sender_id === $userId ? 'pending_sent' : 'pending_received';
            }
            $friendshipMap[$otherId] = [
                'status' => $status,
                'friendship_id' => $f->id,
            ];
        }

        $costSummary = PartyCostService::calculate($party);

        return Inertia::render('Party', [
            'party' => $party,
            'games' => $games,
            'readyPlayers' => $readyPlayers,
            'playingPlayers' => $playingPlayers,
            'breakPlayers' => $breakPlayers,
            'ably_key' => env('ABLY_KEY'),
            'friendshipMap' => $friendshipMap,
            'costSummary' => $costSummary,
        ]);
    }

    public function store(Request $request)
    {
        $hasBooking = $request->boolean('has_booking', true);

        $rules = [
            'name' => 'nullable|string|max:255',
            'default_game_type' => 'nullable|in:double,quadruple',
            'play_date' => 'required|date',
            'max_players' => 'required|integer|min:1',
            'court_id' => 'required|integer',
            'cost_type' => 'nullable|in:free,per_person,split_equal',
            'cost_amount' => 'nullable|numeric|min:0',
            'shuttlecock_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:2000',
            'invite_passcode' => 'nullable|string|regex:/^\d{4}$/',
            'member_ids' => 'nullable|array',
            'member_ids.*' => 'integer|exists:users,id',
        ];

        if ($hasBooking) {
            $rules['court_bookings'] = 'required|array';
            $rules['court_bookings.*.court_field_number'] = 'required|integer|min:1';
            $rules['court_bookings.*.start_time'] = 'required';
            $rules['court_bookings.*.end_time'] = 'required';
        } else {
            $rules['start_time'] = 'required';
            $rules['end_time'] = 'required';
        }

        $validated = $request->validate($rules);

        $play_date = Carbon::parse($validated['play_date'])->toDateString();

        if ($hasBooking) {
            $start_time = collect($validated['court_bookings'])->min('start_time');
            $end_time = collect($validated['court_bookings'])->max('end_time');
        } else {
            $start_time = $validated['start_time'];
            $end_time = $validated['end_time'];
        }

        $play_hours = Carbon::parse($start_time)->diffInHours(Carbon::parse($end_time));

        $party = Party::create([
            'name' => $validated['name'] ?? null,
            'default_game_type' => $validated['default_game_type'] ?? 'quadruple',
            'court_id' => $validated['court_id'],
            'play_date' => $play_date,
            'play_hours' => $play_hours,
            'max_players' => $validated['max_players'],
            'start_time' => $start_time,
            'end_time' => $end_time,
            'creator_id' => auth()->id(),
            'is_private' => $request->boolean('is_private'),
            'cost_type' => $validated['cost_type'] ?? 'free',
            'cost_amount' => $validated['cost_amount'] ?? null,
            'shuttlecock_cost' => $validated['shuttlecock_cost'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'invite_passcode' => $validated['invite_passcode'] ?? null,
        ]);

        if ($hasBooking) {
            foreach ($validated['court_bookings'] as $booking) {
                PartyCourtBooking::create([
                    'party_id' => $party->id,
                    'court_id' => $validated['court_id'],
                    'court_field_number' => $booking['court_field_number'],
                    'start_time' => $booking['start_time'],
                    'end_time' => $booking['end_time'],
                ]);
            }
        }

        // Add selected members from template (host already added by booted())
        $memberIds = $validated['member_ids'] ?? [];
        foreach ($memberIds as $userId) {
            if ($userId == auth()->id()) continue; // Skip host

            PartyMember::create([
                'party_id' => $party->id,
                'user_id' => $userId,
                'role' => 'Member',
                'status' => 'Confirmed',
                'game_status' => 'ready',
                'confirm_date' => now(),
            ]);
        }

        return back()->with('success', 'Party created successfully!');
    }

    /**
     * Duplicate a party with settings + members from original.
     */
    public function duplicate(Request $request, Party $party)
    {
        $validated = $request->validate([
            'play_date' => 'required|date',
            'member_ids' => 'array',
            'member_ids.*' => 'integer|exists:users,id',
        ]);

        $party->load(['courtBookings', 'members']);

        // Create new party with same settings
        $newParty = Party::create([
            'name' => $party->name,
            'default_game_type' => $party->default_game_type,
            'court_id' => $party->court_id,
            'play_date' => $validated['play_date'],
            'play_hours' => $party->play_hours,
            'max_players' => $party->max_players,
            'start_time' => $party->start_time,
            'end_time' => $party->end_time,
            'creator_id' => auth()->id(),
            'is_private' => $party->is_private,
            'cost_type' => $party->cost_type,
            'cost_amount' => $party->cost_amount,
            'shuttlecock_cost' => $party->shuttlecock_cost,
            'notes' => $party->notes,
        ]);

        // Copy court bookings
        foreach ($party->courtBookings as $booking) {
            PartyCourtBooking::create([
                'party_id' => $newParty->id,
                'court_id' => $booking->court_id,
                'court_field_number' => $booking->court_field_number,
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
            ]);
        }

        // Add selected members (host already added by booted())
        $memberIds = $validated['member_ids'] ?? [];
        foreach ($memberIds as $userId) {
            if ($userId == auth()->id()) continue; // Skip host (already added)

            PartyMember::create([
                'party_id' => $newParty->id,
                'user_id' => $userId,
                'role' => 'Member',
                'status' => 'Confirmed',
                'game_status' => 'ready',
                'confirm_date' => now(),
            ]);
        }

        return redirect("/party/{$newParty->id}")->with('success', 'สร้างปาร์ตี้ใหม่จากปาร์ตี้เดิมเรียบร้อย!');
    }

    public function update(Request $request, Party $party)
    {
        // Only owner can edit
        if ($party->creator_id !== auth()->id()) {
            abort(403, 'Only the party owner can edit.');
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'default_game_type' => 'nullable|in:double,quadruple',
            'play_date' => 'required|date',
            'max_players' => 'required|integer|min:1',
            'court_id' => 'required|integer',
            'is_private' => 'boolean',
            'cost_type' => 'nullable|in:free,per_person,split_equal',
            'cost_amount' => 'nullable|numeric|min:0',
            'shuttlecock_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:2000',
            'status' => 'nullable|in:Open,Full,Over',
        ]);

        $oldStatus = $party->status;

        $party->update([
            'name' => $validated['name'] ?? $party->name,
            'default_game_type' => $validated['default_game_type'] ?? $party->default_game_type,
            'play_date' => $validated['play_date'],
            'max_players' => $validated['max_players'],
            'court_id' => $validated['court_id'],
            'is_private' => $request->boolean('is_private'),
            'cost_type' => $validated['cost_type'] ?? $party->cost_type,
            'cost_amount' => $validated['cost_amount'] ?? $party->cost_amount,
            'shuttlecock_cost' => $validated['shuttlecock_cost'] ?? $party->shuttlecock_cost,
            'notes' => $validated['notes'] ?? $party->notes,
            'status' => $validated['status'] ?? $party->status,
        ]);

        // Send party summary via LINE when party ends
        if ($oldStatus !== 'Over' && $party->status === 'Over') {
            $this->sendPartySummary($party);
        }

        return back()->with('success', 'Party updated successfully!');
    }

    public function joinParty(Request $request)
    {
        $validated = $request->validate([
            'party_id' => 'required|exists:parties,id',
        ]);

        $partyId = $validated['party_id'];
        $userId = auth()->id();

        // Retrieve the party
        $party = Party::findOrFail($partyId);

        // Check if the user is already a member of the party
        $isAlreadyMember = PartyMember::where('party_id', $partyId)
            ->where('user_id', $userId)
            ->exists();

        if ($isAlreadyMember) {
            return response()->json([
                'message' => 'คุณเป็นสมาชิกของปาร์ตี้นี้อยู่แล้ว',
            ], 400);
        }

        // Check the last party hosted by the same host (creator_id) where the user joined
        $lastDisplayName = PartyMember::join('parties', 'party_members.party_id', '=', 'parties.id')
            ->where('party_members.user_id', $userId)
            ->where('parties.creator_id', $party->creator_id) // Same host
            ->whereNotNull('party_members.display_name') // Ensure the display name exists
            ->orderByDesc('party_members.created_at') // Most recent join
            ->value('party_members.display_name'); // Get the display name

        // Add the user as a member of the party
        PartyMember::create([
            'party_id' => $partyId,
            'user_id' => $userId,
            'role' => 'member',
            'status' => 'Requesting',
            'request_date' => now(),
            'display_name' => $lastDisplayName ?? null, // Set the previous display name if available
        ]);

        // Broadcast join notification
        try {
            $ably = new \Ably\AblyRest(env('ABLY_KEY'));
            $channel = $ably->channels->get("party.{$partyId}");
            $channel->publish('member.joined', [
                'party_id' => $partyId,
                'user_id' => $userId,
                'user_name' => auth()->user()->name,
                'message' => 'เข้าร่วมปาร์ตี้',
            ]);
        } catch (\Exception $e) {}

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

    /**
     * End party with settlement details and send personalized LINE push to each member.
     */
    public function endParty(Request $request, Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            abort(403, 'Only the party owner can end the party.');
        }

        $validated = $request->validate([
            'court_cost_per_hour' => 'numeric|min:0',
            'play_hours' => 'numeric|min:0',
            'shuttlecock_cost_per_unit' => 'numeric|min:0',
            'shuttlecock_used' => 'integer|min:0',
            'total_cost' => 'numeric|min:0',
            'settlements' => 'required|array',
            'settlements.*.user_id' => 'required|integer',
            'settlements.*.amount' => 'required|numeric|min:0',
        ]);

        // Update party cost fields & status
        $party->update([
            'cost_amount' => $validated['court_cost_per_hour'],
            'play_hours' => $validated['play_hours'],
            'shuttlecock_cost' => $validated['shuttlecock_cost_per_unit'],
            'status' => 'Over',
            'party_end_date' => now(),
        ]);

        // Send personalized LINE push to each member
        $party->load(['members.user', 'games.gameSets', 'games.gamePlayers.user', 'court']);
        $partyName = $party->name ?: $party->court?->name ?: 'Party';
        $appUrl = config('app.url', '');
        $service = new LinePushService();

        $finishedGames = $party->games->where('status', 'finished');
        $settlementMap = collect($validated['settlements'])->keyBy('user_id');

        foreach ($party->members as $member) {
            if (!$member->user) continue;

            $userId = $member->user_id;
            $settlement = $settlementMap[$userId] ?? null;
            $amount = $settlement ? ceil($settlement['amount']) : 0;

            // Player stats: sets, time, calories
            $setsWon = 0;
            $setsLost = 0;
            $gamesPlayed = 0;
            $totalPlaySeconds = 0;
            foreach ($finishedGames as $game) {
                $gp = $game->gamePlayers->firstWhere('user_id', $userId);
                if (!$gp) continue;
                $gamesPlayed++;

                // Count per set
                foreach ($game->gameSets as $set) {
                    if (!$set->winning_team) continue;
                    if ($set->winning_team === $gp->team) $setsWon++;
                    else $setsLost++;
                }

                // Play duration
                if ($game->game_start_date && $game->game_end_date) {
                    $dur = max(0, strtotime($game->game_end_date) - strtotime($game->game_start_date));
                    $totalPlaySeconds += $dur;
                }
            }

            $totalSets = $setsWon + $setsLost;
            $playMinutes = round($totalPlaySeconds / 60);
            $calories = round(($totalPlaySeconds / 60) * 7); // ~7 kcal/min badminton

            $lines = [];
            $lines[] = "สนาม: {$party->court?->name}";
            $lines[] = "เล่น: {$validated['play_hours']} ชม. · {$party->members->count()} คน";
            $lines[] = "";
            $lines[] = "🏸 {$gamesPlayed} เกม · {$totalSets} เซ็ต ({$setsWon}W/{$setsLost}L)";
            $lines[] = "⏱️ เวลาเล่นจริง: {$playMinutes} นาที";
            $lines[] = "🔥 เผาผลาญ: ~{$calories} kcal";
            if ($amount > 0) {
                $lines[] = "";
                $lines[] = "💰 ค่าใช้จ่ายของคุณ: ฿" . number_format($amount);
            }

            $service->sendPush(
                $member->user,
                'game_result',
                "📊 สรุป {$partyName}",
                implode("\n", $lines),
                [
                    'party_id' => $party->id,
                    'action_url' => $appUrl . '/party/' . $party->id,
                    'action_label' => 'ดูรายละเอียดปาร์ตี้',
                ]
            );
        }

        return back()->with('success', 'จบปาร์ตี้เรียบร้อย! ส่งสรุปเข้า LINE แล้ว');
    }

    /**
     * Send party summary via LINE when party status changes to Over (from edit).
     */
    private function sendPartySummary(Party $party): void
    {
        $party->load(['members.user', 'games.shuttlecocks', 'games.gameSets', 'games.gamePlayers.user', 'court']);

        $summary = PartyCostService::calculate($party);
        $message = PartyCostService::buildSummaryMessage($party, $summary);
        $partyName = $party->name ?: $party->court?->name ?: 'Party';
        $appUrl = config('app.url', '');

        $service = new LinePushService();

        foreach ($party->members as $member) {
            if ($member->user) {
                $service->sendPush(
                    $member->user,
                    'game_result',
                    "📊 สรุป {$partyName}",
                    $message,
                    [
                        'party_id' => $party->id,
                        'action_url' => $appUrl . '/party/' . $party->id,
                        'action_label' => 'ดูรายละเอียดปาร์ตี้',
                    ]
                );
            }
        }
    }

    // ===== Invite System =====

    public function generateInviteLink(Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            abort(403);
        }

        $token = $party->generateInviteToken();
        $url = config('app.url') . "/party/{$party->id}/invite/{$token}";

        return response()->json(['invite_url' => $url, 'token' => $token]);
    }

    public function setPasscode(Request $request, Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'passcode' => 'required|string|regex:/^\d{4}$/',
        ]);

        $party->update(['invite_passcode' => $request->passcode]);

        return back()->with('success', 'ตั้งรหัสเข้าร่วมเรียบร้อย');
    }

    public function verifyPasscode(Request $request, Party $party)
    {
        $request->validate(['passcode' => 'required|string']);

        if ($request->passcode !== $party->invite_passcode) {
            return response()->json(['message' => 'รหัสเข้าร่วมไม่ถูกต้อง'], 422);
        }

        session()->put("invite_verified_{$party->id}", true);

        return response()->json(['redirect' => "/party/{$party->id}/invite-preview"]);
    }

    public function showInvitePreview(Request $request, $id, $token = null)
    {
        $party = Party::with(['court', 'members.user'])
            ->withCount('members')
            ->findOrFail($id);

        // Validate access: either valid token or passcode-verified session
        if ($token) {
            if (!$party->invite_token || $party->invite_token !== $token) {
                abort(404, 'ลิงก์เชิญไม่ถูกต้อง');
            }
        } else {
            if (!session()->has("invite_verified_{$id}")) {
                abort(403, 'กรุณายืนยันรหัสเข้าร่วมก่อน');
            }
        }

        // Already a member? redirect to party
        $isMember = $party->members->contains('user_id', auth()->id());
        if ($isMember) {
            return redirect("/party/{$id}")->with('success', 'คุณเป็นสมาชิกอยู่แล้ว');
        }

        return Inertia::render('PartyInvitePreview', [
            'party' => $party,
            'members' => $party->members,
            'isFull' => $party->members_count >= $party->max_players,
        ]);
    }

    public function confirmJoinFromInvite(Request $request, Party $party)
    {
        $userId = auth()->id();

        // Already member?
        if (PartyMember::where('party_id', $party->id)->where('user_id', $userId)->exists()) {
            return redirect("/party/{$party->id}")->with('success', 'คุณเป็นสมาชิกอยู่แล้ว');
        }

        // Full?
        $memberCount = PartyMember::where('party_id', $party->id)->count();
        if ($memberCount >= $party->max_players) {
            return back()->with('error', 'ปาร์ตี้เต็มแล้ว');
        }

        PartyMember::create([
            'party_id' => $party->id,
            'user_id' => $userId,
            'role' => 'Member',
            'status' => 'Confirmed',
            'game_status' => 'ready',
            'confirm_date' => now(),
        ]);

        return redirect("/party/{$party->id}")->with('success', 'เข้าร่วมปาร์ตี้เรียบร้อย!');
    }
}
