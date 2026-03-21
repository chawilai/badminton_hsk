<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\GameController;
use App\Http\Resources\CourtResource;
use App\Http\Resources\GameResource;
use App\Http\Resources\PartyListResource;
use App\Http\Resources\PartyMemberResource;
use App\Http\Resources\PartyResource;
use App\Models\Court;
use App\Models\Friendship;
use App\Models\Game;
use App\Models\Party;
use App\Models\PartyCourtBooking;
use App\Models\PartyMember;
use App\Services\LinePushService;
use App\Services\PartyCostService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PartyController extends Controller
{
    private function broadcastPartyUpdate($partyId, $event = 'party.updated')
    {
        try {
            $ably = new \Ably\AblyRest(config('broadcasting.connections.ably.key'));
            $channel = $ably->channels->get("party.{$partyId}");
            $channel->publish($event, [
                'party_id' => $partyId,
                'timestamp' => now()->toISOString(),
                'user_id' => auth()->id(),
            ]);
        } catch (\Exception $e) {}
    }

    public function index(Request $request)
    {
        $query = Party::with(['members', 'court', 'courtBookings', 'members.user'])
            ->withCount('members')
            ->orderByDesc('play_date');

        // Filters
        if ($request->has('court_id')) {
            $query->where('court_id', $request->court_id);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('court', fn($cq) => $cq->where('name', 'like', "%{$search}%"));
            });
        }

        $perPage = min($request->input('per_page', 20), 50);
        $parties = $query->paginate($perPage);

        return response()->json([
            'parties' => PartyListResource::collection($parties),
            'courts' => CourtResource::collection(Court::all()),
            'pagination' => [
                'current_page' => $parties->currentPage(),
                'last_page' => $parties->lastPage(),
                'per_page' => $parties->perPage(),
                'total' => $parties->total(),
            ],
        ]);
    }

    public function myParties(Request $request)
    {
        $userId = auth()->id();

        $query = Party::whereHas('members', fn($q) => $q->where('user_id', $userId))
            ->with(['members', 'court', 'courtBookings', 'members.user'])
            ->withCount('members')
            ->orderByDesc('play_date');

        $perPage = min($request->input('per_page', 20), 50);
        $parties = $query->paginate($perPage);

        return response()->json([
            'parties' => PartyListResource::collection($parties),
            'courts' => CourtResource::collection(Court::all()),
            'pagination' => [
                'current_page' => $parties->currentPage(),
                'last_page' => $parties->lastPage(),
                'per_page' => $parties->perPage(),
                'total' => $parties->total(),
            ],
        ]);
    }

    public function show(Request $request, $id)
    {
        $isMember = PartyMember::where('party_id', $id)
            ->where('user_id', auth()->id())
            ->exists();

        if (!$isMember) {
            return response()->json(['message' => 'คุณไม่ได้อยู่ในปาร์ตี้นี้'], 403);
        }

        $games = Game::with(['gamePlayers.user', 'shuttlecocks', 'gameSets'])
            ->withCount('gamePlayers')
            ->with(['gamePlayers' => function ($query) use ($id) {
                $query->leftJoin('games', 'game_players.game_id', '=', 'games.id')
                    ->leftJoin('party_members', function ($join) use ($id) {
                        $join->on('game_players.user_id', '=', 'party_members.user_id')
                            ->on('party_members.party_id', '=', 'games.party_id')
                            ->where('party_members.party_id', $id);
                    })
                    ->select('game_players.*', 'party_members.display_name');
            }])
            ->where('party_id', $id)
            ->orderBy('id', 'desc')
            ->get();

        $party = Party::with(['members', 'members.user', 'court', 'courtBookings'])
            ->withCount('members')
            ->findOrFail($id);

        $gameController = new GameController();
        $readyPlayers = $gameController->fetchReadyPlayersByPartyID($id);
        $playingPlayers = $gameController->fetchPlayingPlayersByPartyID($id);

        $breakPlayers = PartyMember::with(['user.badmintonRank', 'user'])
            ->where('party_id', $id)
            ->where('game_status', 'break')
            ->whereDoesntHave('user.gamePlayers.game', function ($q) use ($id) {
                $q->where('party_id', $id)->whereIn('status', ['setting', 'listing', 'playing']);
            })
            ->get()
            ->map(fn($player) => [
                'user_id' => $player->user->id,
                'party_member_id' => $player->id,
                'name' => $player->user->name,
                'display_name' => $player->display_name ?? $player->user->name,
                'avatar' => $player->user->avatar,
                'badminton_level' => $player->user->badmintonRank->id ?? 0,
                'game_status' => 'break',
                'finished_games_count' => 0,
                'waiting_time' => 0,
                'current_game' => null,
            ]);

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
            $friendshipMap[$otherId] = ['status' => $status, 'friendship_id' => $f->id];
        }

        $costSummary = PartyCostService::calculate($party);

        return response()->json([
            'party' => new PartyResource($party),
            'games' => $games,
            'readyPlayers' => $readyPlayers,
            'playingPlayers' => $playingPlayers,
            'breakPlayers' => $breakPlayers,
            'ably_key' => config('broadcasting.connections.ably.key'),
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

        $memberIds = $validated['member_ids'] ?? [];
        foreach ($memberIds as $userId) {
            if ($userId == auth()->id()) continue;
            PartyMember::create([
                'party_id' => $party->id,
                'user_id' => $userId,
                'role' => 'Member',
                'status' => 'Confirmed',
                'game_status' => 'ready',
                'confirm_date' => now(),
            ]);
        }

        return response()->json([
            'message' => 'สร้างปาร์ตี้เรียบร้อย!',
            'party' => new PartyResource($party->load('members', 'court', 'courtBookings')),
        ], 201);
    }

    public function update(Request $request, Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            return response()->json(['message' => 'Only the party owner can edit.'], 403);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'default_game_type' => 'nullable|in:double,quadruple',
            'play_date' => 'required|date',
            'max_players' => 'required|integer|min:1',
            'court_id' => 'required|integer',
            'is_private' => 'boolean',
            'invite_passcode' => 'nullable|string|max:4',
            'cost_type' => 'nullable|in:free,per_person,split_equal',
            'cost_amount' => 'nullable|numeric|min:0',
            'shuttlecock_cost' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:2000',
            'status' => 'nullable|in:Open,Full,Over',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'court_bookings' => 'nullable|array',
            'court_bookings.*.court_field_number' => 'required|integer|min:1',
            'court_bookings.*.start_time' => 'required',
            'court_bookings.*.end_time' => 'required',
        ]);

        $updateData = [
            'name' => $validated['name'] ?? $party->name,
            'default_game_type' => $validated['default_game_type'] ?? $party->default_game_type,
            'play_date' => $validated['play_date'],
            'max_players' => $validated['max_players'],
            'court_id' => $validated['court_id'],
            'is_private' => $request->boolean('is_private'),
            'invite_passcode' => $validated['invite_passcode'] ?? $party->invite_passcode,
            'cost_type' => $validated['cost_type'] ?? $party->cost_type,
            'cost_amount' => $validated['cost_amount'] ?? $party->cost_amount,
            'shuttlecock_cost' => $validated['shuttlecock_cost'] ?? $party->shuttlecock_cost,
            'notes' => $validated['notes'] ?? $party->notes,
        ];

        if (!empty($validated['start_time']) && !empty($validated['end_time'])) {
            $updateData['start_time'] = $validated['start_time'];
            $updateData['end_time'] = $validated['end_time'];
            $start = strtotime($validated['start_time']);
            $end = strtotime($validated['end_time']);
            if ($end > $start) {
                $updateData['play_hours'] = ($end - $start) / 3600;
            }
        }

        $party->update($updateData);

        if (isset($validated['court_bookings'])) {
            $party->courtBookings()->delete();
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

        if ($party->status !== 'Over') {
            $memberCount = $party->members()->count();
            $party->update(['status' => $memberCount >= $party->max_players ? 'Full' : 'Open']);
        }

        $this->broadcastPartyUpdate($party->id, 'party.updated');

        return response()->json([
            'message' => 'อัพเดทปาร์ตี้เรียบร้อย!',
            'party' => new PartyResource($party->fresh()->load('members', 'court', 'courtBookings')),
        ]);
    }

    public function joinParty(Request $request)
    {
        $validated = $request->validate([
            'party_id' => 'required|exists:parties,id',
            'passcode' => 'nullable|string',
        ]);

        $partyId = $validated['party_id'];
        $userId = auth()->id();
        $party = Party::findOrFail($partyId);

        $isAlreadyMember = PartyMember::where('party_id', $partyId)->where('user_id', $userId)->exists();
        if ($isAlreadyMember) {
            return response()->json(['message' => 'คุณเป็นสมาชิกของปาร์ตี้นี้อยู่แล้ว', 'party_id' => $partyId], 409);
        }

        if ($party->is_private) {
            $passcode = $request->input('passcode');
            if (!$passcode || $passcode !== $party->invite_passcode) {
                return response()->json(['message' => 'รหัสเข้าร่วมไม่ถูกต้อง'], 422);
            }
        }

        $lastDisplayName = PartyMember::join('parties', 'party_members.party_id', '=', 'parties.id')
            ->where('party_members.user_id', $userId)
            ->where('parties.creator_id', $party->creator_id)
            ->whereNotNull('party_members.display_name')
            ->orderByDesc('party_members.created_at')
            ->value('party_members.display_name');

        PartyMember::create([
            'party_id' => $partyId,
            'user_id' => $userId,
            'role' => 'member',
            'status' => 'Requesting',
            'request_date' => now(),
            'display_name' => $lastDisplayName ?? null,
        ]);

        $this->broadcastPartyUpdate($partyId, 'member.joined');

        if ($party->status !== 'Over') {
            $memberCount = $party->members()->count();
            $party->update(['status' => $memberCount >= $party->max_players ? 'Full' : 'Open']);
        }

        return response()->json(['message' => 'เข้าร่วมปาร์ตี้เรียบร้อย!', 'party_id' => $partyId]);
    }

    public function endParty(Request $request, Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            return response()->json(['message' => 'Only the party owner can end the party.'], 403);
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

        $party->update([
            'cost_amount' => $validated['court_cost_per_hour'],
            'play_hours' => $validated['play_hours'],
            'shuttlecock_cost' => $validated['shuttlecock_cost_per_unit'],
            'status' => 'Over',
            'party_end_date' => now(),
        ]);

        // Send LINE summary (reuse web controller logic)
        $webController = new \App\Http\Controllers\PartyController();
        $webController->sendPartySummary($party);

        $this->broadcastPartyUpdate($party->id, 'party.ended');

        return response()->json(['message' => 'จบปาร์ตี้เรียบร้อย!']);
    }

    public function duplicate(Request $request, Party $party)
    {
        $validated = $request->validate([
            'play_date' => 'required|date',
            'member_ids' => 'array',
            'member_ids.*' => 'integer|exists:users,id',
        ]);

        $party->load(['courtBookings', 'members']);

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

        foreach ($party->courtBookings as $booking) {
            PartyCourtBooking::create([
                'party_id' => $newParty->id,
                'court_id' => $booking->court_id,
                'court_field_number' => $booking->court_field_number,
                'start_time' => $booking->start_time,
                'end_time' => $booking->end_time,
            ]);
        }

        $memberIds = $validated['member_ids'] ?? [];
        foreach ($memberIds as $userId) {
            if ($userId == auth()->id()) continue;
            PartyMember::create([
                'party_id' => $newParty->id,
                'user_id' => $userId,
                'role' => 'Member',
                'status' => 'Confirmed',
                'game_status' => 'ready',
                'confirm_date' => now(),
            ]);
        }

        return response()->json([
            'message' => 'สร้างปาร์ตี้ใหม่จากปาร์ตี้เดิมเรียบร้อย!',
            'party' => new PartyResource($newParty->load('members', 'court', 'courtBookings')),
        ], 201);
    }

    public function destroy(Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            return response()->json(['message' => 'Only the party owner can delete.'], 403);
        }

        $hasGames = Game::where('party_id', $party->id)
            ->whereIn('status', ['playing', 'finished'])
            ->exists();
        if ($hasGames) {
            return response()->json(['message' => 'ไม่สามารถลบปาร์ตี้ที่มีเกมเล่นไปแล้วได้'], 422);
        }

        $otherMembers = $party->members()->where('user_id', '!=', auth()->id())->count();
        if ($otherMembers > 0) {
            return response()->json(['message' => 'กรุณาลบสมาชิกทั้งหมดออกก่อนจึงจะลบปาร์ตี้ได้'], 422);
        }

        Game::where('party_id', $party->id)->delete();
        $party->members()->delete();
        $party->courtBookings()->delete();
        $party->delete();

        return response()->json(['message' => 'ลบปาร์ตี้เรียบร้อยแล้ว']);
    }

    // ===== Invite System =====

    public function generateInviteLink(Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $token = $party->generateInviteToken();
        $url = config('app.url') . "/party/{$party->id}/invite/{$token}";

        return response()->json(['invite_url' => $url, 'token' => $token]);
    }

    public function setPasscode(Request $request, Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate(['passcode' => 'required|string|regex:/^\d{4}$/']);
        $party->update(['invite_passcode' => $request->passcode]);

        $this->broadcastPartyUpdate($party->id, 'party.passcodeSet');

        return response()->json(['message' => 'ตั้งรหัสเข้าร่วมเรียบร้อย']);
    }

    public function verifyPasscode(Request $request, Party $party)
    {
        $request->validate(['passcode' => 'required|string']);

        if ($request->passcode !== $party->invite_passcode) {
            return response()->json(['message' => 'รหัสเข้าร่วมไม่ถูกต้อง'], 422);
        }

        return response()->json(['verified' => true, 'party_id' => $party->id]);
    }

    public function invitePreview(Request $request, $id, $token = null)
    {
        $party = Party::with(['court', 'members.user'])
            ->withCount('members')
            ->findOrFail($id);

        if ($token && (!$party->invite_token || $party->invite_token !== $token)) {
            return response()->json(['message' => 'ลิงก์เชิญไม่ถูกต้องหรือหมดอายุ'], 422);
        }

        $isMember = $party->members->contains('user_id', auth()->id());

        return response()->json([
            'party' => new PartyResource($party),
            'is_member' => $isMember,
            'is_full' => $party->members_count >= $party->max_players,
        ]);
    }

    public function confirmJoinFromInvite(Request $request, Party $party)
    {
        $userId = auth()->id();

        if (PartyMember::where('party_id', $party->id)->where('user_id', $userId)->exists()) {
            return response()->json(['message' => 'คุณเป็นสมาชิกอยู่แล้ว', 'party_id' => $party->id], 409);
        }

        $memberCount = PartyMember::where('party_id', $party->id)->count();
        if ($memberCount >= $party->max_players) {
            return response()->json(['message' => 'ปาร์ตี้เต็มแล้ว'], 422);
        }

        PartyMember::create([
            'party_id' => $party->id,
            'user_id' => $userId,
            'role' => 'Member',
            'status' => 'Confirmed',
            'game_status' => 'ready',
            'confirm_date' => now(),
        ]);

        $this->broadcastPartyUpdate($party->id, 'member.joined');

        return response()->json(['message' => 'เข้าร่วมปาร์ตี้เรียบร้อย!', 'party_id' => $party->id]);
    }

    public function getInvitableUsers(Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $currentMemberIds = PartyMember::where('party_id', $party->id)->pluck('user_id');
        $hostPartyIds = PartyMember::where('user_id', auth()->id())->pluck('party_id');

        $users = \App\Models\User::whereIn('id', function ($q) use ($hostPartyIds) {
                $q->select('user_id')->from('party_members')->whereIn('party_id', $hostPartyIds);
            })
            ->whereNotIn('id', $currentMemberIds)
            ->where('id', '!=', auth()->id())
            ->where('provider', 'line')
            ->select('id', 'name', 'avatar', 'provider')
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }

    public function sendLineInvitations(Request $request, Party $party)
    {
        if ($party->creator_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
            'message' => 'nullable|string|max:500',
        ]);

        $token = $party->generateInviteToken();
        $inviteUrl = config('app.url') . "/party/{$party->id}/invite/{$token}";
        $partyName = $party->name ?: ($party->court?->name ?: 'ปาร์ตี้แบดมินตัน');
        $hostName = auth()->user()->name;

        $linePush = new LinePushService();
        $sent = 0;
        $skipped = 0;

        foreach ($request->user_ids as $userId) {
            $user = \App\Models\User::find($userId);
            if (!$user) continue;

            $msgLines = "ปาร์ตี้: {$partyName}\nวันเล่น: {$party->play_date}\n";
            if ($party->start_time && $party->end_time) {
                $msgLines .= "เวลา: " . substr($party->start_time, 0, 5) . '-' . substr($party->end_time, 0, 5) . "\n";
            }
            if ($party->court) {
                $msgLines .= "สนาม: {$party->court->name}\n";
            }
            $msgLines .= "เชิญโดย: {$hostName}";
            if ($request->message) {
                $msgLines .= "\n\nข้อความ: {$request->message}";
            }

            $success = $linePush->sendPush($user, 'party_invite', '🎉 คุณได้รับเทียบเชิญเข้าปาร์ตี้!', $msgLines, [
                'party_id' => $party->id,
                'action_url' => $inviteUrl,
                'action_label' => 'ดูรายละเอียด & เข้าร่วม',
            ]);

            $success ? $sent++ : $skipped++;
        }

        return response()->json(['sent' => $sent, 'skipped' => $skipped, 'total' => count($request->user_ids)]);
    }

    public function setInitialShuttlecocks(Request $request, Party $party)
    {
        $request->validate(['initial_shuttlecocks' => 'required|integer|min:0']);

        if ($party->default_initial_shuttlecocks == $request->initial_shuttlecocks) {
            return response()->json(['message' => 'ค่าไม่เปลี่ยนแปลง']);
        }

        $party->default_initial_shuttlecocks = $request->initial_shuttlecocks;
        $party->save();

        $this->broadcastPartyUpdate($party->id, 'party.shuttlecockSet');

        return response()->json(['message' => 'ตั้งค่าลูกแบดเริ่มต้นเรียบร้อย']);
    }

    public function tvDashboard(Request $request, $id)
    {
        $isMember = PartyMember::where('party_id', $id)->where('user_id', auth()->id())->exists();
        if (!$isMember) {
            return response()->json(['message' => 'คุณไม่ได้อยู่ในปาร์ตี้นี้'], 403);
        }

        $party = Party::with(['court', 'courtBookings', 'members.user'])
            ->withCount('members')
            ->findOrFail($id);

        $playingGames = Game::with(['gamePlayers.user', 'gameSets'])
            ->where('party_id', $id)->where('status', 'playing')->get()
            ->map(function ($game) use ($id) {
                $game->game_number = Game::where('party_id', $id)->where('id', '<=', $game->id)->count();
                $game->gamePlayers->each(function ($gp) use ($id) {
                    $pm = PartyMember::where('party_id', $id)->where('user_id', $gp->user_id)->first();
                    $gp->display_name = $pm?->display_name ?? $gp->user?->name;
                });
                return $game;
            });

        $listingGames = Game::with(['gamePlayers.user'])
            ->where('party_id', $id)->whereIn('status', ['setting', 'listing'])->get()
            ->map(function ($game) use ($id) {
                $game->game_number = Game::where('party_id', $id)->where('id', '<=', $game->id)->count();
                $game->gamePlayers->each(function ($gp) use ($id) {
                    $pm = PartyMember::where('party_id', $id)->where('user_id', $gp->user_id)->first();
                    $gp->display_name = $pm?->display_name ?? $gp->user?->name;
                });
                return $game;
            });

        $gameController = new GameController();
        $readyPlayers = $gameController->fetchReadyPlayersByPartyID($id);

        $breakPlayers = PartyMember::with('user')
            ->where('party_id', $id)->where('game_status', 'break')
            ->whereDoesntHave('user.gamePlayers.game', fn($q) => $q->where('party_id', $id)->whereIn('status', ['setting', 'listing', 'playing']))
            ->get()
            ->map(fn($p) => [
                'user_id' => $p->user->id,
                'name' => $p->user->name,
                'display_name' => $p->display_name ?? $p->user->name,
                'avatar' => $p->user->avatar,
            ]);

        $finishedGames = Game::where('party_id', $id)->where('status', 'finished')
            ->whereNotNull('game_start_date')->whereNotNull('game_end_date')->get();

        $avgDuration = $finishedGames->count() > 0
            ? round($finishedGames->avg(fn($g) => Carbon::parse($g->game_start_date)->diffInMinutes(Carbon::parse($g->game_end_date))))
            : 15;

        return response()->json([
            'party' => new PartyResource($party),
            'playingGames' => $playingGames,
            'listingGames' => $listingGames,
            'readyPlayers' => $readyPlayers,
            'breakPlayers' => $breakPlayers,
            'avgGameDuration' => $avgDuration,
            'ably_key' => config('broadcasting.connections.ably.key'),
        ]);
    }
}
