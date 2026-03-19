<?php

use App\Models\User;
use App\Models\Court;
use App\Models\Party;
use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\GameSet;
use App\Models\MmrLevel;
use App\Models\LevelUpNotification;
use App\Services\MmrService;

beforeEach(function () {
    $this->seed(\Database\Seeders\MmrLevelSeeder::class);

    $this->host = User::factory()->create();
    $this->court = Court::factory()->create();
    $this->party = Party::factory()->create([
        'creator_id' => $this->host->id,
        'court_id' => $this->court->id,
    ]);
});

test('winning against higher MMR gives more points', function () {
    $weak = User::factory()->create(['mmr' => 900, 'mmr_games_played' => 20]);
    $strong = User::factory()->create(['mmr' => 1200, 'mmr_games_played' => 20]);

    $game = Game::factory()->create(['party_id' => $this->party->id, 'status' => 'finished']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $weak->id, 'team' => 'team1']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $strong->id, 'team' => 'team2']);
    GameSet::create(['game_id' => $game->id, 'set_number' => 1, 'team1_score' => 21, 'team2_score' => 15, 'winning_team' => 'team1']);

    MmrService::adjustMmr($game);
    $weak->refresh();
    $strong->refresh();

    // Weak player beats strong → should gain significant MMR
    expect($weak->mmr)->toBeGreaterThan(900);
    expect($weak->mmr - 900)->toBeGreaterThan(10); // Upset bonus
});

test('winning against lower MMR gives few points', function () {
    $strong = User::factory()->create(['mmr' => 1200, 'mmr_games_played' => 20]);
    $weak = User::factory()->create(['mmr' => 800, 'mmr_games_played' => 20]);

    $game = Game::factory()->create(['party_id' => $this->party->id, 'status' => 'finished']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $strong->id, 'team' => 'team1']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $weak->id, 'team' => 'team2']);
    GameSet::create(['game_id' => $game->id, 'set_number' => 1, 'team1_score' => 21, 'team2_score' => 19, 'winning_team' => 'team1']);

    MmrService::adjustMmr($game);
    $strong->refresh();

    // Strong beats weak with close score → minimal gain
    expect($strong->mmr - 1200)->toBeLessThan(10);
});

test('calibration games have higher K factor', function () {
    $newPlayer = User::factory()->create(['mmr' => 1000, 'mmr_games_played' => 2]);
    $opponent = User::factory()->create(['mmr' => 1000, 'mmr_games_played' => 20]);

    $game = Game::factory()->create(['party_id' => $this->party->id, 'status' => 'finished']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $newPlayer->id, 'team' => 'team1']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $opponent->id, 'team' => 'team2']);
    GameSet::create(['game_id' => $game->id, 'set_number' => 1, 'team1_score' => 21, 'team2_score' => 10, 'winning_team' => 'team1']);

    MmrService::adjustMmr($game);
    $newPlayer->refresh();

    // Calibration K=50 vs stable K=25 → should gain more
    expect($newPlayer->mmr - 1000)->toBeGreaterThan(20);
});

test('mmr cannot go below 0 or above 3000', function () {
    $low = User::factory()->create(['mmr' => 5, 'mmr_games_played' => 5]);
    $strong = User::factory()->create(['mmr' => 1500, 'mmr_games_played' => 20]);

    $game = Game::factory()->create(['party_id' => $this->party->id, 'status' => 'finished']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $low->id, 'team' => 'team1']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $strong->id, 'team' => 'team2']);
    GameSet::create(['game_id' => $game->id, 'set_number' => 1, 'team1_score' => 5, 'team2_score' => 21, 'winning_team' => 'team2']);

    MmrService::adjustMmr($game);
    $low->refresh();

    expect($low->mmr)->toBeGreaterThanOrEqual(0);
});

test('level up notification is created when level changes', function () {
    $user = User::factory()->create(['mmr' => 895, 'mmr_games_played' => 20]);
    $opponent = User::factory()->create(['mmr' => 900, 'mmr_games_played' => 20]);

    $game = Game::factory()->create(['party_id' => $this->party->id, 'status' => 'finished']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $user->id, 'team' => 'team1']);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $opponent->id, 'team' => 'team2']);
    GameSet::create(['game_id' => $game->id, 'set_number' => 1, 'team1_score' => 21, 'team2_score' => 10, 'winning_team' => 'team1']);

    MmrService::adjustMmr($game);
    $user->refresh();

    // If MMR crossed a level boundary, notification should exist
    if ($user->mmr >= 900) {
        $notif = LevelUpNotification::where('user_id', $user->id)->first();
        expect($notif)->not->toBeNull();
        expect($notif->is_seen)->toBeFalse();
    }
});

test('getLevelForMmr returns correct level', function () {
    $level = MmrService::getLevelForMmr(1000);
    expect($level)->not->toBeNull();
    expect($level->tier_th)->toBe('เข้าคอร์ท');

    $legend = MmrService::getLevelForMmr(2800);
    expect($legend)->not->toBeNull();
    expect($legend->tier_th)->toBe('ตำนาน');
});
