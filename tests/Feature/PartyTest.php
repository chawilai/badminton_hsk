<?php

use App\Models\Court;
use App\Models\Party;
use App\Models\PartyMember;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->court = Court::factory()->create();
});

// ==================== Party Lists ====================

test('authenticated user can view party lists', function () {
    $this->actingAs($this->user)
        ->get('/party-lists')
        ->assertOk();
});

test('unauthenticated user is redirected from party lists', function () {
    $this->get('/party-lists')
        ->assertRedirect('/login');
});

test('home page renders successfully', function () {
    $this->get('/')->assertOk();
});

// ==================== Create Party ====================

test('authenticated user can create a party', function () {
    $response = $this->actingAs($this->user)->post('/party-create', [
        'play_date' => now()->addDay()->format('Y-m-d'),
        'max_players' => 8,
        'court_id' => $this->court->id,
        'start_time' => '10:00',
        'end_time' => '12:00',
        'court_bookings' => [
            ['court_id' => $this->court->id, 'court_field_number' => 1, 'start_time' => '10:00', 'end_time' => '12:00'],
        ],
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('parties', [
        'creator_id' => $this->user->id,
        'max_players' => 8,
        'court_id' => $this->court->id,
    ]);
});

test('creating a party automatically adds creator as host member', function () {
    $this->actingAs($this->user)->post('/party-create', [
        'play_date' => now()->addDay()->format('Y-m-d'),
        'max_players' => 4,
        'court_id' => $this->court->id,
        'court_bookings' => [
            ['court_id' => $this->court->id, 'court_field_number' => 1, 'start_time' => '10:00', 'end_time' => '12:00'],
        ],
    ]);

    $party = Party::where('creator_id', $this->user->id)->first();

    $this->assertNotNull($party);
    $this->assertDatabaseHas('party_members', [
        'party_id' => $party->id,
        'user_id' => $this->user->id,
        'role' => 'Host',
        'status' => 'Confirmed',
    ]);
});

test('creating a party also creates court bookings', function () {
    $this->actingAs($this->user)->post('/party-create', [
        'play_date' => now()->addDay()->format('Y-m-d'),
        'max_players' => 4,
        'court_id' => $this->court->id,
        'start_time' => '10:00',
        'end_time' => '14:00',
        'court_bookings' => [
            ['court_id' => $this->court->id, 'court_field_number' => 1, 'start_time' => '10:00', 'end_time' => '12:00'],
            ['court_id' => $this->court->id, 'court_field_number' => 2, 'start_time' => '12:00', 'end_time' => '14:00'],
        ],
    ]);

    $party = Party::where('creator_id', $this->user->id)->first();

    $this->assertDatabaseCount('party_court_bookings', 2);
    $this->assertDatabaseHas('party_court_bookings', [
        'party_id' => $party->id,
        'court_field_number' => 1,
    ]);
});

test('create party requires play_date', function () {
    $this->actingAs($this->user)->post('/party-create', [
        'max_players' => 4,
        'court_id' => $this->court->id,
        'start_time' => '10:00',
        'end_time' => '12:00',
    ])->assertSessionHasErrors('play_date');
});

test('create party requires max_players', function () {
    $this->actingAs($this->user)->post('/party-create', [
        'play_date' => now()->addDay()->format('Y-m-d'),
        'court_id' => $this->court->id,
        'start_time' => '10:00',
        'end_time' => '12:00',
    ])->assertSessionHasErrors('max_players');
});

test('create party requires court_id', function () {
    $this->actingAs($this->user)->post('/party-create', [
        'play_date' => now()->addDay()->format('Y-m-d'),
        'max_players' => 4,
        'start_time' => '10:00',
        'end_time' => '12:00',
    ])->assertSessionHasErrors('court_id');
});

// ==================== Join Party ====================

test('user can join an existing party', function () {
    $party = Party::factory()->create([
        'creator_id' => $this->user->id,
        'court_id' => $this->court->id,
        'is_private' => false,
    ]);

    $joiner = User::factory()->create();

    $response = $this->actingAs($joiner)->post('/party-join', [
        'party_id' => $party->id,
    ]);

    $response->assertRedirect("/party/{$party->id}");
    $this->assertDatabaseHas('party_members', [
        'party_id' => $party->id,
        'user_id' => $joiner->id,
        'status' => 'Requesting',
    ]);
});

test('user cannot join private party without passcode', function () {
    $party = Party::factory()->create([
        'creator_id' => $this->user->id,
        'court_id' => $this->court->id,
        'is_private' => true,
        'invite_passcode' => '1234',
    ]);

    $joiner = User::factory()->create();

    $this->actingAs($joiner)->post('/party-join', [
        'party_id' => $party->id,
    ])->assertRedirect();

    $this->assertDatabaseMissing('party_members', [
        'party_id' => $party->id,
        'user_id' => $joiner->id,
    ]);
});

test('user can join private party with correct passcode', function () {
    $party = Party::factory()->create([
        'creator_id' => $this->user->id,
        'court_id' => $this->court->id,
        'is_private' => true,
        'invite_passcode' => '5678',
    ]);

    $joiner = User::factory()->create();

    $this->actingAs($joiner)->post('/party-join', [
        'party_id' => $party->id,
        'passcode' => '5678',
    ])->assertRedirect("/party/{$party->id}");

    $this->assertDatabaseHas('party_members', [
        'party_id' => $party->id,
        'user_id' => $joiner->id,
    ]);
});

test('user cannot join a party twice', function () {
    $party = Party::factory()->create([
        'creator_id' => $this->user->id,
        'court_id' => $this->court->id,
        'is_private' => false,
    ]);

    $joiner = User::factory()->create();

    // First join
    $this->actingAs($joiner)->post('/party-join', ['party_id' => $party->id]);

    // Second join attempt
    $response = $this->actingAs($joiner)->post('/party-join', ['party_id' => $party->id]);

    $response->assertRedirect("/party/{$party->id}");
    $response->assertSessionHas('error');
});

test('join party requires valid party_id', function () {
    $this->actingAs($this->user)->post('/party-join', [
        'party_id' => 9999,
    ])->assertSessionHasErrors('party_id');
});

// ==================== View Party ====================

test('party member can view party detail', function () {
    $party = Party::factory()->create([
        'creator_id' => $this->user->id,
        'court_id' => $this->court->id,
    ]);

    $this->actingAs($this->user)
        ->get("/party/{$party->id}")
        ->assertOk();
});

test('non-member is redirected from party detail to party lists', function () {
    $party = Party::factory()->create([
        'creator_id' => $this->user->id,
        'court_id' => $this->court->id,
    ]);

    $stranger = User::factory()->create();

    $this->actingAs($stranger)
        ->get("/party/{$party->id}")
        ->assertRedirect('/party-lists');
});

// ==================== My Parties ====================

test('user can view their own parties', function () {
    Party::factory()->create([
        'creator_id' => $this->user->id,
        'court_id' => $this->court->id,
    ]);

    $this->actingAs($this->user)
        ->get('/my-parties')
        ->assertOk();
});

// ==================== Set Initial Shuttlecocks ====================

test('can set initial shuttlecocks for party', function () {
    $party = Party::factory()->create([
        'creator_id' => $this->user->id,
        'court_id' => $this->court->id,
        'default_initial_shuttlecocks' => 0,
    ]);

    $this->actingAs($this->user)
        ->post("/parties/{$party->id}/set-party-initial-shuttlecocks", [
            'initial_shuttlecocks' => 3,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('parties', [
        'id' => $party->id,
        'default_initial_shuttlecocks' => 3,
    ]);
});

test('set initial shuttlecocks requires non-negative integer', function () {
    $party = Party::factory()->create([
        'creator_id' => $this->user->id,
        'court_id' => $this->court->id,
    ]);

    $this->actingAs($this->user)
        ->post("/parties/{$party->id}/set-party-initial-shuttlecocks", [
            'initial_shuttlecocks' => -1,
        ])
        ->assertSessionHasErrors('initial_shuttlecocks');
});
