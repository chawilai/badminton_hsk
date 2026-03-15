<?php

use App\Models\Court;
use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\GameSet;
use App\Models\GameShuttlecock;
use App\Models\Party;
use App\Models\PartyMember;
use App\Models\User;

beforeEach(function () {
    $this->host = User::factory()->create();
    $this->court = Court::factory()->create();
    $this->party = Party::factory()->create([
        'creator_id' => $this->host->id,
        'court_id' => $this->court->id,
    ]);

    // Add 4 ready members (host is already a member)
    $this->players = User::factory(3)->create();
    foreach ($this->players as $player) {
        PartyMember::create([
            'party_id' => $this->party->id,
            'user_id' => $player->id,
            'role' => 'member',
            'status' => 'Confirmed',
            'game_status' => 'ready',
        ]);
    }
});

// Helper to create a game with players
function createGameWithPlayers(Party $party, array $team1UserIds, array $team2UserIds, string $status = 'setting'): Game
{
    $game = Game::create([
        'party_id' => $party->id,
        'game_type' => count($team1UserIds) === 1 ? 'double' : 'quadruple',
        'status' => $status,
    ]);

    foreach ($team1UserIds as $userId) {
        GamePlayer::create(['game_id' => $game->id, 'user_id' => $userId, 'team' => 'team1']);
    }
    foreach ($team2UserIds as $userId) {
        GamePlayer::create(['game_id' => $game->id, 'user_id' => $userId, 'team' => 'team2']);
    }

    return $game;
}

// ==================== Create Game ====================

test('can create a game for a party', function () {
    $this->actingAs($this->host)->post('/games', [
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ])->assertRedirect();

    $this->assertDatabaseHas('games', [
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ]);
});

test('can create game with initial shuttlecocks', function () {
    $this->actingAs($this->host)->post('/games', [
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
        'initial_shuttlecock_game' => 3,
    ])->assertRedirect();

    $game = Game::where('party_id', $this->party->id)->first();

    $this->assertDatabaseHas('game_shuttlecocks', [
        'game_id' => $game->id,
        'type' => 'initial',
        'quantity' => 3,
    ]);
});

test('cannot create multiple setting games for same party', function () {
    // Create first game in 'setting' status
    Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ]);

    // Try to create another
    $this->actingAs($this->host)->post('/games', [
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ])->assertRedirect();

    // Should still only have 1 setting game
    $this->assertEquals(1, Game::where('party_id', $this->party->id)->where('status', 'setting')->count());
});

// ==================== Add Player ====================

test('can add player to setting game', function () {
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ]);

    $member = PartyMember::where('party_id', $this->party->id)
        ->where('user_id', $this->players[0]->id)
        ->first();

    $this->actingAs($this->host)->post("/games/{$game->id}/add-player", [
        'party_member_id' => $member->id,
        'team' => 'team1',
    ])->assertRedirect();

    $this->assertDatabaseHas('game_players', [
        'game_id' => $game->id,
        'user_id' => $this->players[0]->id,
        'team' => 'team1',
    ]);
});

test('cannot add more than max players per team in double game', function () {
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ]);

    // Add first player to team1
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $this->players[0]->id, 'team' => 'team1']);

    // Try to add second player to team1 (max is 1 for double)
    $member = PartyMember::where('user_id', $this->players[1]->id)->first();

    $this->actingAs($this->host)->post("/games/{$game->id}/add-player", [
        'party_member_id' => $member->id,
        'team' => 'team1',
    ])->assertRedirect();

    // Should still only have 1 player in team1
    $this->assertEquals(1, GamePlayer::where('game_id', $game->id)->where('team', 'team1')->count());
});

// ==================== Remove Player ====================

test('can remove player from setting game', function () {
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ]);

    GamePlayer::create(['game_id' => $game->id, 'user_id' => $this->players[0]->id, 'team' => 'team1']);

    $this->actingAs($this->host)->post("/games/{$game->id}/remove-player", [
        'game_id' => $game->id,
        'user_id' => $this->players[0]->id,
    ])->assertRedirect();

    $this->assertDatabaseMissing('game_players', [
        'game_id' => $game->id,
        'user_id' => $this->players[0]->id,
    ]);
});

test('removing player from listing game reverts to setting', function () {
    $game = createGameWithPlayers(
        $this->party,
        [$this->host->id],
        [$this->players[0]->id],
        'listing'
    );
    $game->update(['game_list_date' => now()]);

    $this->actingAs($this->host)->post("/games/{$game->id}/remove-player", [
        'game_id' => $game->id,
        'user_id' => $this->players[0]->id,
    ])->assertRedirect();

    $this->assertEquals('setting', $game->fresh()->status);
});

// ==================== List Game ====================

test('can list a double game with 2 players', function () {
    $game = createGameWithPlayers(
        $this->party,
        [$this->host->id],
        [$this->players[0]->id]
    );

    $this->actingAs($this->host)->post("/games/{$game->id}/list", [])
        ->assertRedirect();

    $this->assertEquals('listing', $game->fresh()->status);
    $this->assertNotNull($game->fresh()->game_list_date);
});

test('cannot list a game without enough players', function () {
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ]);

    // Only add 1 player (need 2 for double)
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $this->host->id, 'team' => 'team1']);

    $this->actingAs($this->host)->post("/games/{$game->id}/list", [])
        ->assertRedirect();

    $this->assertEquals('setting', $game->fresh()->status);
});

// ==================== Start Game ====================

test('can start a listing game', function () {
    $game = createGameWithPlayers(
        $this->party,
        [$this->host->id],
        [$this->players[0]->id],
        'listing'
    );
    $game->update(['game_list_date' => now()]);

    $this->actingAs($this->host)->post("/games/{$game->id}/start", [])
        ->assertRedirect();

    $game->refresh();
    $this->assertEquals('playing', $game->status);
    $this->assertNotNull($game->game_start_date);
});

test('starting a game creates first game set', function () {
    $game = createGameWithPlayers(
        $this->party,
        [$this->host->id],
        [$this->players[0]->id],
        'listing'
    );
    $game->update(['game_list_date' => now()]);

    $this->actingAs($this->host)->post("/games/{$game->id}/start", [
        'team1_start_side' => 'north',
    ])->assertRedirect();

    $this->assertDatabaseHas('game_sets', [
        'game_id' => $game->id,
        'set_number' => 1,
    ]);
});

// ==================== Finish Game ====================

test('can finish a playing game', function () {
    $game = createGameWithPlayers(
        $this->party,
        [$this->host->id],
        [$this->players[0]->id],
        'playing'
    );
    $game->update(['game_start_date' => now()]);

    $this->actingAs($this->host)->post("/games/{$game->id}/finish", [])
        ->assertRedirect();

    $game->refresh();
    $this->assertEquals('finished', $game->status);
    $this->assertNotNull($game->game_end_date);
});

// ==================== Delete Game ====================

test('can delete a setting game', function () {
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ]);

    $this->actingAs($this->host)->post("/games/{$game->id}/delete", [])
        ->assertRedirect();

    $this->assertDatabaseMissing('games', ['id' => $game->id]);
});

test('cannot delete a playing game', function () {
    $game = createGameWithPlayers(
        $this->party,
        [$this->host->id],
        [$this->players[0]->id],
        'playing'
    );

    $this->actingAs($this->host)->post("/games/{$game->id}/delete", [])
        ->assertRedirect();

    $this->assertDatabaseHas('games', ['id' => $game->id]);
});

// ==================== Create Game (Quick) ====================

test('can create game with players in one request', function () {
    $this->actingAs($this->host)->post('/games/create-game', [
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'players' => [$this->host->id, $this->players[0]->id],
        'team1_start_side' => 'north',
        'initial_shuttlecock_game' => 2,
        'process' => 'listing',
    ])->assertRedirect();

    $game = Game::where('party_id', $this->party->id)->first();
    $this->assertNotNull($game);
    $this->assertEquals('listing', $game->status);
    $this->assertEquals(2, $game->gamePlayers()->count());
});

test('can create game and immediately start playing', function () {
    $this->actingAs($this->host)->post('/games/create-game', [
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'players' => [$this->host->id, $this->players[0]->id],
        'team1_start_side' => 'north',
        'initial_shuttlecock_game' => 0,
        'process' => 'playing',
    ])->assertRedirect();

    $game = Game::where('party_id', $this->party->id)->first();
    $this->assertEquals('playing', $game->status);
    $this->assertNotNull($game->game_start_date);
    $this->assertEquals(1, $game->gameSets()->count());
});

// ==================== Auto Add Players ====================

test('auto add fills teams from ready members', function () {
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ]);

    $this->actingAs($this->host)->post("/games/{$game->id}/auto-add-players", [])
        ->assertRedirect();

    $this->assertEquals(2, $game->gamePlayers()->count());
    $this->assertEquals(1, $game->gamePlayers()->where('team', 'team1')->count());
    $this->assertEquals(1, $game->gamePlayers()->where('team', 'team2')->count());
});

// ==================== Shuttlecocks ====================

test('can add additional shuttlecocks', function () {
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'playing',
    ]);

    $this->actingAs($this->host)
        ->from("/party/{$this->party->id}")
        ->post("/games/{$game->id}/add-shuttlecock", [
            'quantity' => 2,
        ])->assertRedirect();

    $this->assertDatabaseHas('game_shuttlecocks', [
        'game_id' => $game->id,
        'type' => 'additional',
        'quantity' => 2,
    ]);
});

test('can return shuttlecocks', function () {
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'playing',
    ]);

    // Add initial shuttlecocks first
    GameShuttlecock::create([
        'game_id' => $game->id,
        'type' => 'initial',
        'quantity' => 3,
    ]);

    $this->actingAs($this->host)
        ->from("/party/{$this->party->id}")
        ->post("/games/{$game->id}/return-shuttlecocks", [
            'quantity' => 1,
        ]);

    $this->assertDatabaseHas('game_shuttlecocks', [
        'game_id' => $game->id,
        'type' => 'returned',
        'quantity' => -1,
    ]);
});

test('cannot return more shuttlecocks than available', function () {
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'playing',
    ]);

    // Only 2 initial
    GameShuttlecock::create([
        'game_id' => $game->id,
        'type' => 'initial',
        'quantity' => 2,
    ]);

    // Try to return 5
    $this->actingAs($this->host)->post("/games/{$game->id}/return-shuttlecocks", [
        'quantity' => 5,
    ])->assertRedirect();

    // Should not have created a returned record
    $this->assertEquals(0, GameShuttlecock::where('game_id', $game->id)->where('type', 'returned')->count());
});

// ==================== Update Game Sets ====================

test('can update game sets', function () {
    $game = createGameWithPlayers(
        $this->party,
        [$this->host->id],
        [$this->players[0]->id],
        'playing'
    );

    $this->actingAs($this->host)->post("/games/{$game->id}/update-game-sets", [
        'sets' => [
            [
                'set_number' => 1,
                'team1_start_side' => 'north',
                'team2_start_side' => 'south',
                'team1_score' => 21,
                'team2_score' => 15,
                'winning_team' => 'team1',
            ],
            [
                'set_number' => 2,
                'team1_start_side' => 'south',
                'team2_start_side' => 'north',
                'team1_score' => 18,
                'team2_score' => 21,
                'winning_team' => 'team2',
            ],
        ],
    ])->assertRedirect();

    $this->assertEquals(2, GameSet::where('game_id', $game->id)->count());
    $this->assertDatabaseHas('game_sets', [
        'game_id' => $game->id,
        'set_number' => 1,
        'team1_score' => 21,
        'team2_score' => 15,
        'winning_team' => 'team1',
    ]);
});

// ==================== Game State Machine ====================

test('game follows correct state progression', function () {
    // 1. Create game (setting)
    $game = Game::create([
        'party_id' => $this->party->id,
        'game_type' => 'double',
        'status' => 'setting',
    ]);
    $this->assertEquals('setting', $game->status);

    // 2. Add players
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $this->host->id, 'team' => 'team1']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $this->players[0]->id, 'team' => 'team2']);

    // 3. List game (setting → listing)
    $this->actingAs($this->host)->post("/games/{$game->id}/list");
    $this->assertEquals('listing', $game->fresh()->status);

    // 4. Start game (listing → playing)
    $this->actingAs($this->host)->post("/games/{$game->id}/start");
    $this->assertEquals('playing', $game->fresh()->status);

    // 5. Finish game (playing → finished)
    $this->actingAs($this->host)->post("/games/{$game->id}/finish");
    $this->assertEquals('finished', $game->fresh()->status);
});
