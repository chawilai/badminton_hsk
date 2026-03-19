<?php

use App\Models\User;
use App\Models\Court;
use App\Models\Party;
use App\Models\PartyMember;
use App\Models\Game;
use App\Models\GamePlayer;

beforeEach(function () {
    $this->host = User::factory()->create();
    $this->court = Court::factory()->create();
    $this->party = Party::factory()->create([
        'creator_id' => $this->host->id,
        'court_id' => $this->court->id,
        'max_players' => 12,
    ]);
});

test('host can kick member who has not played', function () {
    $member = User::factory()->create();
    $pm = PartyMember::create([
        'party_id' => $this->party->id,
        'user_id' => $member->id,
        'role' => 'Member',
        'status' => 'Confirmed',
    ]);

    $this->actingAs($this->host)
        ->delete("/party-members/{$pm->id}/kick")
        ->assertRedirect();

    $this->assertDatabaseMissing('party_members', ['id' => $pm->id]);
});

test('host cannot kick member who has played a game', function () {
    $member = User::factory()->create();
    $pm = PartyMember::create([
        'party_id' => $this->party->id,
        'user_id' => $member->id,
        'role' => 'Member',
        'status' => 'Confirmed',
    ]);

    $game = Game::factory()->create(['party_id' => $this->party->id]);
    GamePlayer::create(['game_id' => $game->id, 'user_id' => $member->id, 'team' => 'team1']);

    $this->actingAs($this->host)
        ->delete("/party-members/{$pm->id}/kick")
        ->assertSessionHas('error');

    $this->assertDatabaseHas('party_members', ['id' => $pm->id]);
});

test('non-host cannot kick members', function () {
    $member = User::factory()->create();
    $pm = PartyMember::create([
        'party_id' => $this->party->id,
        'user_id' => $member->id,
        'role' => 'Member',
        'status' => 'Confirmed',
    ]);

    $otherUser = User::factory()->create();
    $this->actingAs($otherUser)
        ->delete("/party-members/{$pm->id}/kick")
        ->assertSessionHas('error');

    $this->assertDatabaseHas('party_members', ['id' => $pm->id]);
});

test('host cannot kick themselves', function () {
    $hostMember = PartyMember::where('party_id', $this->party->id)
        ->where('user_id', $this->host->id)
        ->first();

    $this->actingAs($this->host)
        ->delete("/party-members/{$hostMember->id}/kick")
        ->assertSessionHas('error');

    $this->assertDatabaseHas('party_members', ['id' => $hostMember->id]);
});

test('kicking member auto-updates party status', function () {
    $this->party->update(['max_players' => 2]);

    $member = User::factory()->create();
    $pm = PartyMember::create([
        'party_id' => $this->party->id,
        'user_id' => $member->id,
        'role' => 'Member',
        'status' => 'Confirmed',
    ]);

    // 2 members (host + member) = Full
    $this->party->refresh();
    expect($this->party->members()->count())->toBe(2);

    $this->actingAs($this->host)
        ->delete("/party-members/{$pm->id}/kick");

    $this->party->refresh();
    expect($this->party->status)->toBe('Open');
});
