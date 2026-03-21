<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\GameController as WebGameController;
use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\GameScore;
use App\Models\GameSet;
use App\Models\Party;
use App\Models\PartyMember;
use Ably\AblyRest;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class GameController extends Controller
{
    private function getGameNumber($game)
    {
        return Game::where('party_id', $game->party_id)->where('id', '<=', $game->id)->count();
    }

    private function broadcastPartyUpdate($partyId, $event = 'game.updated', $message = null)
    {
        try {
            $ably = new AblyRest(config('broadcasting.connections.ably.key'));
            $channel = $ably->channels->get("party.{$partyId}");
            $channel->publish($event, [
                'party_id' => $partyId,
                'timestamp' => now()->toISOString(),
                'user_id' => auth()->id(),
                'user_name' => auth()->user()?->name,
                'message' => $message,
            ]);
        } catch (\Exception $e) {}
    }

    public function store(Request $request)
    {
        $request->validate([
            'party_id' => 'required|exists:parties,id',
            'game_type' => 'required|in:double,quadruple',
            'status' => 'required|in:setting,listing,playing,finished',
            'initial_shuttlecock_game' => 'sometimes|numeric|min:0',
        ]);

        $existingGameSetting = Game::where('party_id', $request->party_id)->where('status', 'setting')->exists();
        if ($existingGameSetting) {
            return response()->json(['message' => 'มีเกมที่กำลังตั้งค่าอยู่แล้ว'], 422);
        }

        $game = Game::create([
            'party_id' => $request->party_id,
            'game_type' => $request->game_type,
            'status' => $request->status,
            'game_create_date' => now(),
        ]);

        $party = Party::find($request->party_id);
        $initialShuttlecocks = $request->input('initial_shuttlecock_game', $party->default_initial_shuttlecocks);

        if ($initialShuttlecocks > 0) {
            $game->shuttlecocks()->create(['type' => 'initial', 'quantity' => $initialShuttlecocks]);
        }

        return response()->json(['message' => 'สร้างเกมเรียบร้อย', 'game' => $game->load('gamePlayers', 'gameSets', 'shuttlecocks')], 201);
    }

    public function addPlayer(Request $request, Game $game)
    {
        $request->validate([
            'party_member_id' => 'required|exists:party_members,id',
            'team' => 'required|in:team1,team2',
        ]);

        if ($game->status !== 'setting') {
            return response()->json(['message' => 'เพิ่มผู้เล่นได้เฉพาะตอนตั้งค่าเกม'], 422);
        }

        $maxPlayersPerTeam = $game->game_type === 'double' ? 1 : 2;
        $currentTeamPlayerCount = $game->gamePlayers()->where('team', $request->team)->count();
        if ($currentTeamPlayerCount >= $maxPlayersPerTeam) {
            return response()->json(['message' => "ทีมเต็มแล้ว"], 422);
        }

        $partyMember = PartyMember::findOrFail($request->party_member_id);

        $alreadyInGame = $game->gamePlayers()->where('user_id', $partyMember->user_id)->exists();
        if ($alreadyInGame) {
            return response()->json(['message' => 'ผู้เล่นคนนี้อยู่ในเกมนี้แล้ว'], 422);
        }

        $game->gamePlayers()->create(['user_id' => $partyMember->user_id, 'team' => $request->team]);

        $this->broadcastPartyUpdate($game->party_id, 'player.added');
        return response()->json(['message' => 'เพิ่มผู้เล่นเรียบร้อย']);
    }

    public function removePlayer(Request $request, Game $game)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        if (!in_array($game->status, ['setting', 'listing'])) {
            return response()->json(['message' => 'ลบผู้เล่นได้เฉพาะตอนตั้งค่าหรือลีส'], 422);
        }

        $gamePlayer = $game->gamePlayers()->where('user_id', $request->user_id)->first();
        if (!$gamePlayer) {
            return response()->json(['message' => 'ไม่พบผู้เล่นในเกมนี้'], 404);
        }

        $gamePlayer->delete();

        if ($game->status === 'listing') {
            $game->update(['status' => 'setting']);
        }

        $this->broadcastPartyUpdate($game->party_id, 'player.removed');
        return response()->json(['message' => 'ลบผู้เล่นเรียบร้อย']);
    }

    public function createGame(Request $request)
    {
        $validatedData = $request->validate([
            'party_id' => 'required|exists:parties,id',
            'game_type' => 'required|in:double,quadruple',
            'players' => 'required|array|min:2',
            'team1_start_side' => 'sometimes|in:north,south',
            'initial_shuttlecock_game' => 'sometimes|numeric|min:0',
            'process' => 'required|in:listing,playing',
            'court_number' => 'nullable|integer|min:1',
        ]);

        $requiredPlayers = $validatedData['game_type'] === 'double' ? 2 : 4;

        if (count($validatedData['players']) !== $requiredPlayers) {
            return response()->json(['message' => 'จำนวนผู้เล่นไม่ตรงกับประเภทเกม'], 422);
        }

        if (count($validatedData['players']) !== count(array_unique($validatedData['players']))) {
            return response()->json(['message' => 'ไม่สามารถเพิ่มผู้เล่นซ้ำในเกมเดียวกันได้'], 422);
        }

        $existingGameSetting = Game::where('party_id', $validatedData['party_id'])->where('status', 'setting')->exists();
        if ($existingGameSetting) {
            return response()->json(['message' => 'มีเกมที่กำลังตั้งค่าอยู่แล้ว'], 422);
        }

        $playersInPlayingGame = GamePlayer::whereIn('game_players.user_id', $validatedData['players'])
            ->join('games', 'game_players.game_id', '=', 'games.id')
            ->where('games.party_id', $validatedData['party_id'])
            ->where('games.status', $validatedData['process'])
            ->exists();

        if ($playersInPlayingGame) {
            return response()->json(['message' => 'ผู้เล่นบางคนยังอยู่ในเกมอื่น'], 422);
        }

        $gameStartDate = $validatedData['process'] === 'playing' ? now() : null;

        $game = Game::create([
            'party_id' => $validatedData['party_id'],
            'game_type' => $validatedData['game_type'],
            'court_number' => $validatedData['court_number'] ?? null,
            'status' => $validatedData['process'],
            'game_list_date' => now(),
            'game_start_date' => $gameStartDate,
            'game_create_date' => now(),
        ]);

        foreach ($validatedData['players'] as $index => $playerId) {
            $team = ($index < $requiredPlayers / 2) ? 'team1' : 'team2';
            $game->gamePlayers()->create(['user_id' => $playerId, 'team' => $team]);
        }

        $initialShuttlecocks = $request->input('initial_shuttlecock_game', 0);
        if ($initialShuttlecocks > 0) {
            $game->shuttlecocks()->create(['type' => 'initial', 'quantity' => $initialShuttlecocks]);
        }

        if ($validatedData['process'] === 'playing') {
            $team1StartSide = $validatedData['team1_start_side'] ?? 'north';
            $game->gameSets()->create([
                'set_number' => 1,
                'team1_start_side' => $team1StartSide,
                'team2_start_side' => $team1StartSide === 'north' ? 'south' : 'north',
            ]);
        }

        $this->broadcastPartyUpdate($game->party_id, 'game.created', 'สร้างเกม #' . $this->getGameNumber($game));
        return response()->json(['message' => 'สร้างเกมเรียบร้อย', 'game' => $game->load('gamePlayers.user', 'gameSets', 'shuttlecocks')], 201);
    }

    public function listGame(Request $request, Game $game)
    {
        if ($game->status !== 'setting') {
            return response()->json(['message' => 'เกมไม่ได้อยู่ในสถานะตั้งค่า'], 422);
        }

        $requiredPlayersPerTeam = $game->game_type === 'double' ? 1 : 2;
        $requiredTotalPlayers = $requiredPlayersPerTeam * 2;

        if ($game->gamePlayers()->count() < $requiredTotalPlayers) {
            return response()->json(['message' => 'ผู้เล่นไม่ครบ'], 422);
        }

        $team1Count = $game->gamePlayers()->where('team', 'team1')->count();
        $team2Count = $game->gamePlayers()->where('team', 'team2')->count();
        if ($team1Count !== $team2Count) {
            return response()->json(['message' => "จำนวนผู้เล่นไม่เท่ากัน"], 422);
        }

        $game->update(['status' => 'listing', 'game_list_date' => now()]);

        $this->broadcastPartyUpdate($game->party_id, 'game.listed', 'ลีสเกม #' . $this->getGameNumber($game));
        return response()->json(['message' => 'ลีสเกมเรียบร้อย']);
    }

    public function startGame(Request $request, Game $game)
    {
        $validatedData = $request->validate([
            'team1_start_side' => ['sometimes', Rule::in(['north', 'south'])],
            'court_number' => 'nullable|integer|min:1',
        ]);

        if ($game->status !== 'listing') {
            return response()->json(['message' => 'เกมไม่ได้อยู่ในสถานะลีส'], 422);
        }

        $team1Count = $game->gamePlayers()->where('team', 'team1')->count();
        $team2Count = $game->gamePlayers()->where('team', 'team2')->count();
        if ($team1Count !== $team2Count) {
            return response()->json(['message' => 'จำนวนผู้เล่นไม่เท่ากัน'], 422);
        }

        if (!empty($validatedData['court_number'])) {
            $game->update(['court_number' => $validatedData['court_number']]);
        }

        if (!$game->court_number) {
            return response()->json(['message' => 'กรุณาระบุเลขคอร์ทก่อนเริ่มเกม'], 422);
        }

        $playerUserIds = $game->gamePlayers->pluck('user_id')->toArray();
        $activeGamesCount = GamePlayer::whereIn('user_id', $playerUserIds)
            ->whereHas('game', fn($q) => $q->where('id', '!=', $game->id)->where('status', 'playing')->where('party_id', $game->party_id))
            ->count();

        if ($activeGamesCount > 0) {
            return response()->json(['message' => 'ผู้เล่นบางคนกำลังเล่นอยู่ในเกมอื่น'], 422);
        }

        $game->update(['status' => 'playing', 'game_start_date' => now()]);

        $team1StartSide = $validatedData['team1_start_side'] ?? 'north';
        $nextSetNumber = ($game->gameSets()->max('set_number') ?? 0) + 1;

        $game->gameSets()->create([
            'set_number' => $nextSetNumber,
            'team1_start_side' => $team1StartSide,
            'team2_start_side' => $team1StartSide === 'north' ? 'south' : 'north',
        ]);

        $this->broadcastPartyUpdate($game->party_id, 'game.started', 'เริ่มเกม #' . $this->getGameNumber($game));
        return response()->json(['message' => 'เริ่มเกมแล้ว']);
    }

    public function finishGame(Request $request, Game $game)
    {
        if ($game->status !== 'playing') {
            return response()->json(['message' => 'เกมไม่ได้อยู่ในสถานะกำลังเล่น'], 422);
        }

        $game->update(['status' => 'finished', 'game_end_date' => now()]);

        $playerUserIds = $game->gamePlayers->pluck('user_id');
        if ($game->party->is_break_aftergame) {
            PartyMember::whereIn('user_id', $playerUserIds)
                ->where('party_id', $game->party_id)
                ->update(['game_status' => 'break']);
        }

        \App\Services\MmrService::adjustMmr($game);

        $returnedShuttlecocks = $request->input('returned_shuttlecocks', 0);
        if ($returnedShuttlecocks > 0) {
            $game->shuttlecocks()->create(['type' => 'returned', 'quantity' => -$returnedShuttlecocks]);
        }

        $this->broadcastPartyUpdate($game->party_id, 'game.finished', 'จบเกม #' . $this->getGameNumber($game));
        return response()->json(['message' => 'จบเกมเรียบร้อย']);
    }

    public function deleteGame(Game $game)
    {
        if (!in_array($game->status, ['setting', 'listing'])) {
            return response()->json(['message' => 'ลบเกมได้เฉพาะสถานะตั้งค่าหรือลีส'], 422);
        }

        $partyId = $game->party_id;

        $game->gamePlayers()->delete();
        $game->gameSets()->delete();
        $game->shuttlecocks()->delete();
        GameScore::where('game_id', $game->id)->delete();
        $game->delete();

        $this->broadcastPartyUpdate($partyId, 'game.deleted', 'ลบเกม');
        return response()->json(['message' => 'ลบเกมเรียบร้อย']);
    }

    public function autoAddPlayers(Request $request, Game $game)
    {
        if ($game->status !== 'setting') {
            return response()->json(['message' => 'เพิ่มผู้เล่นได้เฉพาะตอนตั้งค่า'], 422);
        }

        $maxPlayersPerTeam = $game->game_type === 'double' ? 1 : 2;
        $totalMaxPlayers = $maxPlayersPerTeam * 2;

        if ($game->gamePlayers()->count() >= $totalMaxPlayers) {
            return response()->json(['message' => 'เกมเต็มแล้ว'], 422);
        }

        $readyMembers = PartyMember::where('party_id', $game->party_id)
            ->where('game_status', 'ready')->get()->shuffle();

        foreach ($readyMembers as $member) {
            if ($game->gamePlayers()->where('user_id', $member->user_id)->exists()) continue;

            $team1Count = $game->gamePlayers()->where('team', 'team1')->count();
            $team2Count = $game->gamePlayers()->where('team', 'team2')->count();

            if ($team1Count < $maxPlayersPerTeam) {
                $game->gamePlayers()->create(['user_id' => $member->user_id, 'team' => 'team1']);
            } elseif ($team2Count < $maxPlayersPerTeam) {
                $game->gamePlayers()->create(['user_id' => $member->user_id, 'team' => 'team2']);
            }

            if ($game->gamePlayers()->count() >= $totalMaxPlayers) break;
        }

        $this->broadcastPartyUpdate($game->party_id, 'player.autoAdded');
        return response()->json(['message' => 'เพิ่มผู้เล่นอัตโนมัติเรียบร้อย']);
    }

    public function updateGameSets(Request $request, Game $game)
    {
        $validated = $request->validate([
            'sets' => 'required|array',
            'sets.*.set_number' => 'required|integer|min:1',
            'sets.*.team1_start_side' => 'required|in:north,south',
            'sets.*.team2_start_side' => 'required|in:north,south',
            'sets.*.team1_score' => 'required|integer|min:0',
            'sets.*.team2_score' => 'required|integer|min:0',
            'sets.*.winning_team' => 'nullable|in:team1,team2',
        ]);

        $existingSets = GameSet::where('game_id', $game->id)->get();
        $sentSetNumbers = collect($validated['sets'])->pluck('set_number');

        foreach ($validated['sets'] as $set) {
            GameSet::updateOrCreate(
                ['game_id' => $game->id, 'set_number' => $set['set_number']],
                [
                    'team1_start_side' => $set['team1_start_side'],
                    'team2_start_side' => $set['team2_start_side'],
                    'team1_score' => $set['team1_score'],
                    'team2_score' => $set['team2_score'],
                    'winning_team' => $set['winning_team'],
                ]
            );
        }

        $existingSets->filter(fn($s) => !$sentSetNumbers->contains($s->set_number))->each(fn($s) => $s->delete());

        $this->broadcastPartyUpdate($game->party_id, 'score.updated', 'ลงผลเกม #' . $this->getGameNumber($game));
        return response()->json(['message' => 'อัพเดทผลเกมเรียบร้อย', 'sets' => $validated['sets']]);
    }

    public function updateCourtNumber(Request $request, Game $game)
    {
        $request->validate(['court_number' => 'required|integer|min:1']);

        if ($game->status === 'finished' && $game->court_number) {
            return response()->json(['message' => 'ไม่สามารถแก้ไขเลขคอร์ทของเกมที่จบแล้วได้'], 422);
        }

        $game->update(['court_number' => $request->court_number]);
        $this->broadcastPartyUpdate($game->party_id, 'court.updated', 'กำหนดคอร์ท ' . $request->court_number);

        return response()->json(['message' => 'อัพเดทเลขคอร์ทแล้ว']);
    }

    public function addShuttlecocks(Game $game, Request $request)
    {
        $quantity = $request->input('quantity', 1);
        $game->shuttlecocks()->create(['type' => 'additional', 'quantity' => $quantity]);

        $this->broadcastPartyUpdate($game->party_id, 'shuttle.added');
        return response()->json(['message' => 'เพิ่มลูกแบดเรียบร้อย']);
    }

    public function returnShuttlecocks(Game $game, Request $request)
    {
        $quantity = $request->input('quantity', 1);
        $currentTotal = $game->shuttlecocks()->sum('quantity');

        if ($currentTotal - $quantity < 0) {
            return response()->json(['message' => 'จำนวนลูกแบดไม่พอคืน'], 422);
        }

        $game->shuttlecocks()->create(['type' => 'returned', 'quantity' => -$quantity]);
        return response()->json(['message' => 'คืนลูกแบดเรียบร้อย']);
    }

    public function setInitialShuttlecocks(Game $game, Request $request)
    {
        $request->validate(['quantity' => 'required|integer|min:0']);

        $existing = $game->shuttlecocks()->where('type', 'initial')->first();
        if ($existing) {
            $existing->update(['quantity' => $request->quantity]);
        } else {
            $game->shuttlecocks()->create(['type' => 'initial', 'quantity' => $request->quantity]);
        }

        return response()->json(['message' => 'ตั้งค่าลูกแบดเริ่มต้นเรียบร้อย']);
    }

    public function fetchReadyPlayers(Request $request)
    {
        $request->validate(['party_id' => 'required|exists:parties,id']);

        $webController = new WebGameController();
        $players = $webController->fetchReadyPlayersByPartyID($request->party_id);

        return response()->json(['players' => $players]);
    }
}
