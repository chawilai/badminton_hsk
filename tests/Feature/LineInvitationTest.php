<?php

use App\Models\User;
use App\Models\Court;
use App\Models\Party;
use App\Models\PartyMember;

beforeEach(function () {
    $this->host = User::factory()->create(['provider' => 'line', 'provider_id' => 'U_host_123']);
    $this->court = Court::factory()->create();
    $this->party = Party::factory()->create([
        'creator_id' => $this->host->id,
        'court_id' => $this->court->id,
        'max_players' => 12,
    ]);
});

// ==================== Get Invitable Users ====================

test('host can get invitable users', function () {
    // Create a user who was in a previous party with the host
    $pastPlayer = User::factory()->create(['provider' => 'line', 'provider_id' => 'U_past_456']);

    $otherParty = Party::factory()->create([
        'creator_id' => $this->host->id,
        'court_id' => $this->court->id,
    ]);
    PartyMember::create([
        'party_id' => $otherParty->id,
        'user_id' => $pastPlayer->id,
        'role' => 'Member',
        'status' => 'Confirmed',
    ]);

    $this->actingAs($this->host)
        ->getJson("/party/{$this->party->id}/invitable-users")
        ->assertOk()
        ->assertJsonCount(1)
        ->assertJsonFragment(['id' => $pastPlayer->id]);
});

test('invitable users excludes current party members', function () {
    $member = User::factory()->create(['provider' => 'line', 'provider_id' => 'U_member_789']);

    // Add to another party (co-player)
    $otherParty = Party::factory()->create([
        'creator_id' => $this->host->id,
        'court_id' => $this->court->id,
    ]);
    PartyMember::create([
        'party_id' => $otherParty->id,
        'user_id' => $member->id,
        'role' => 'Member',
        'status' => 'Confirmed',
    ]);

    // Also add to current party
    PartyMember::create([
        'party_id' => $this->party->id,
        'user_id' => $member->id,
        'role' => 'Member',
        'status' => 'Confirmed',
    ]);

    $this->actingAs($this->host)
        ->getJson("/party/{$this->party->id}/invitable-users")
        ->assertOk()
        ->assertJsonCount(0);
});

test('invitable users excludes non-LINE users', function () {
    $googleUser = User::factory()->create(['provider' => 'google', 'provider_id' => 'google_123']);

    $otherParty = Party::factory()->create([
        'creator_id' => $this->host->id,
        'court_id' => $this->court->id,
    ]);
    PartyMember::create([
        'party_id' => $otherParty->id,
        'user_id' => $googleUser->id,
        'role' => 'Member',
        'status' => 'Confirmed',
    ]);

    $this->actingAs($this->host)
        ->getJson("/party/{$this->party->id}/invitable-users")
        ->assertOk()
        ->assertJsonCount(0);
});

test('non-host cannot get invitable users', function () {
    $other = User::factory()->create();

    $this->actingAs($other)
        ->getJson("/party/{$this->party->id}/invitable-users")
        ->assertForbidden();
});

// ==================== Send LINE Invitations ====================

test('host can send LINE invitations', function () {
    $player = User::factory()->create(['provider' => 'line', 'provider_id' => 'U_player_001']);

    $this->actingAs($this->host)
        ->postJson("/party/{$this->party->id}/send-line-invitations", [
            'user_ids' => [$player->id],
            'message' => 'มาตีแบดกัน!',
        ])
        ->assertOk()
        ->assertJsonStructure(['sent', 'skipped', 'total']);
});

test('send invitation requires at least one user', function () {
    $this->actingAs($this->host)
        ->postJson("/party/{$this->party->id}/send-line-invitations", [
            'user_ids' => [],
            'message' => 'test',
        ])
        ->assertUnprocessable();
});

test('send invitation validates user_ids exist', function () {
    $this->actingAs($this->host)
        ->postJson("/party/{$this->party->id}/send-line-invitations", [
            'user_ids' => [99999],
        ])
        ->assertUnprocessable();
});

test('non-host cannot send LINE invitations', function () {
    $other = User::factory()->create();
    $player = User::factory()->create(['provider' => 'line', 'provider_id' => 'U_player_002']);

    $this->actingAs($other)
        ->postJson("/party/{$this->party->id}/send-line-invitations", [
            'user_ids' => [$player->id],
        ])
        ->assertForbidden();
});

test('send invitation generates invite token', function () {
    $player = User::factory()->create(['provider' => 'line', 'provider_id' => 'U_player_003']);

    expect($this->party->invite_token)->toBeNull();

    $this->actingAs($this->host)
        ->postJson("/party/{$this->party->id}/send-line-invitations", [
            'user_ids' => [$player->id],
        ])
        ->assertOk();

    expect($this->party->fresh()->invite_token)->not->toBeNull();
});
