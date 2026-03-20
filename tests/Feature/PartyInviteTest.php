<?php

use App\Models\Court;
use App\Models\Party;
use App\Models\PartyMember;
use App\Models\User;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->user = User::factory()->create();
    $this->court = Court::factory()->create();
    $this->party = Party::create([
        'creator_id' => $this->owner->id,
        'court_id' => $this->court->id,
        'play_date' => now()->addDay()->format('Y-m-d'),
        'play_hours' => 2,
        'max_players' => 10,
        'start_time' => '19:00:00',
        'end_time' => '21:00:00',
        'status' => 'Open',
        'is_private' => true,
    ]);
});

test('owner can generate invite link', function () {
    $this->actingAs($this->owner)
        ->postJson("/party/{$this->party->id}/generate-invite")
        ->assertOk()
        ->assertJsonStructure(['invite_url', 'token']);

    expect($this->party->fresh()->invite_token)->not->toBeNull();
});

test('non-owner cannot generate invite link', function () {
    $this->actingAs($this->user)
        ->postJson("/party/{$this->party->id}/generate-invite")
        ->assertForbidden();
});

test('owner can set passcode', function () {
    $this->actingAs($this->owner)
        ->post("/party/{$this->party->id}/set-passcode", ['passcode' => '1234'])
        ->assertRedirect();

    expect($this->party->fresh()->invite_passcode)->toBe('1234');
});

test('passcode must be exactly 4 digits', function () {
    $this->actingAs($this->owner)
        ->post("/party/{$this->party->id}/set-passcode", ['passcode' => '12'])
        ->assertSessionHasErrors('passcode');

    $this->actingAs($this->owner)
        ->post("/party/{$this->party->id}/set-passcode", ['passcode' => 'abcd'])
        ->assertSessionHasErrors('passcode');

    $this->actingAs($this->owner)
        ->post("/party/{$this->party->id}/set-passcode", ['passcode' => '123456'])
        ->assertSessionHasErrors('passcode');
});

test('user can view invite preview with valid token', function () {
    $token = $this->party->generateInviteToken();

    $this->actingAs($this->user)
        ->get("/party/{$this->party->id}/invite/{$token}")
        ->assertOk();
});

test('user gets redirected with invalid token', function () {
    $this->actingAs($this->user)
        ->get("/party/{$this->party->id}/invite/invalid-token")
        ->assertRedirect('/party-lists');
});

test('user can verify correct passcode', function () {
    $this->party->update(['invite_passcode' => '5678']);

    $this->actingAs($this->user)
        ->postJson("/party/{$this->party->id}/verify-passcode", ['passcode' => '5678'])
        ->assertOk()
        ->assertJsonStructure(['redirect']);
});

test('user gets error with wrong passcode', function () {
    $this->party->update(['invite_passcode' => '5678']);

    $this->actingAs($this->user)
        ->postJson("/party/{$this->party->id}/verify-passcode", ['passcode' => '0000'])
        ->assertStatus(422);
});

test('user can confirm join from invite', function () {
    $this->actingAs($this->user)
        ->post("/party/{$this->party->id}/confirm-join")
        ->assertRedirect();

    $this->assertDatabaseHas('party_members', [
        'party_id' => $this->party->id,
        'user_id' => $this->user->id,
        'status' => 'Confirmed',
    ]);
});

test('user cannot join full party from invite', function () {
    $this->party->update(['max_players' => 1]);

    $this->actingAs($this->user)
        ->post("/party/{$this->party->id}/confirm-join")
        ->assertRedirect();

    $this->assertDatabaseMissing('party_members', [
        'party_id' => $this->party->id,
        'user_id' => $this->user->id,
    ]);
});

test('already member redirects to party from invite preview', function () {
    $token = $this->party->generateInviteToken();

    // Owner is already a member (from booted())
    $this->actingAs($this->owner)
        ->get("/party/{$this->party->id}/invite/{$token}")
        ->assertRedirect("/party/{$this->party->id}");
});
