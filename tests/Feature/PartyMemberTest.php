<?php

use App\Models\Court;
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
});

test('can update party member display name', function () {
    $member = PartyMember::where('party_id', $this->party->id)
        ->where('user_id', $this->host->id)
        ->first();

    $this->actingAs($this->host)
        ->post("/party-members/{$member->id}/update-name", [
            'display_name' => 'Boss',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('party_members', [
        'id' => $member->id,
        'display_name' => 'Boss',
    ]);
});

test('can set display name to null', function () {
    $member = PartyMember::where('party_id', $this->party->id)
        ->where('user_id', $this->host->id)
        ->first();

    $member->update(['display_name' => 'Old Name']);

    $this->actingAs($this->host)
        ->post("/party-members/{$member->id}/update-name", [
            'display_name' => null,
        ])
        ->assertRedirect();

    $this->assertNull($member->fresh()->display_name);
});

test('display name max length is 255', function () {
    $member = PartyMember::where('party_id', $this->party->id)
        ->where('user_id', $this->host->id)
        ->first();

    $this->actingAs($this->host)
        ->post("/party-members/{$member->id}/update-name", [
            'display_name' => str_repeat('a', 256),
        ])
        ->assertSessionHasErrors('display_name');
});
