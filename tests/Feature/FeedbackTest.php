<?php

use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('authenticated user can view feedback page', function () {
    $this->actingAs($this->user)
        ->get('/feedback')
        ->assertOk();
});

test('unauthenticated user is redirected from feedback page', function () {
    $this->get('/feedback')
        ->assertRedirect('/login');
});

test('user can submit feedback', function () {
    $this->actingAs($this->user)->post('/feedback', [
        'type' => 'feedback',
        'subject' => 'Great app!',
        'description' => 'I love using this app for managing our badminton sessions.',
    ])->assertRedirect();

    $this->assertDatabaseHas('feedbacks', [
        'user_id' => $this->user->id,
        'type' => 'feedback',
        'subject' => 'Great app!',
    ]);
});

test('user can submit bug report', function () {
    $this->actingAs($this->user)->post('/feedback', [
        'type' => 'bug_report',
        'subject' => 'Score not saving',
        'description' => 'When I try to save the score, it does not persist.',
    ])->assertRedirect();

    $this->assertDatabaseHas('feedbacks', [
        'user_id' => $this->user->id,
        'type' => 'bug_report',
    ]);
});

test('user can submit feature request', function () {
    $this->actingAs($this->user)->post('/feedback', [
        'type' => 'feature_request',
        'subject' => 'Add tournament mode',
        'description' => 'It would be great to have a tournament bracket feature.',
    ])->assertRedirect();

    $this->assertDatabaseHas('feedbacks', [
        'type' => 'feature_request',
    ]);
});

test('feedback requires type, subject, and description', function () {
    $this->actingAs($this->user)->post('/feedback', [])
        ->assertSessionHasErrors(['type', 'subject', 'description']);
});

test('feedback type must be valid', function () {
    $this->actingAs($this->user)->post('/feedback', [
        'type' => 'invalid_type',
        'subject' => 'Test',
        'description' => 'Test description',
    ])->assertSessionHasErrors('type');
});

test('feedback default status is pending', function () {
    $this->actingAs($this->user)->post('/feedback', [
        'type' => 'feedback',
        'subject' => 'Test',
        'description' => 'Test description',
    ]);

    $this->assertDatabaseHas('feedbacks', [
        'user_id' => $this->user->id,
        'status' => 'pending',
    ]);
});
