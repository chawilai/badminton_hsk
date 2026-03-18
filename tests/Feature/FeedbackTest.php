<?php

use App\Models\Feedback;
use App\Models\User;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->admin = User::factory()->create();
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

// --- Admin Reply Tests ---

test('admin can reply to feedback', function () {
    $feedback = Feedback::create([
        'user_id' => $this->user->id,
        'type' => 'feedback',
        'subject' => 'Test',
        'description' => 'Test desc',
    ]);

    Http::fake();

    $this->actingAs($this->admin)
        ->post("/admin/feedbacks/{$feedback->id}/reply", [
            'message' => 'Thanks for your feedback!',
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('feedback_replies', [
        'feedback_id' => $feedback->id,
        'user_id' => $this->admin->id,
        'message' => 'Thanks for your feedback!',
        'is_admin' => true,
    ]);
});

test('admin reply auto-updates pending status to reviewed', function () {
    $feedback = Feedback::create([
        'user_id' => $this->user->id,
        'type' => 'bug_report',
        'subject' => 'Bug',
        'description' => 'Bug desc',
        'status' => 'pending',
    ]);

    Http::fake();

    $this->actingAs($this->admin)
        ->post("/admin/feedbacks/{$feedback->id}/reply", [
            'message' => 'Looking into this.',
        ]);

    expect($feedback->fresh()->status)->toBe('reviewed');
});

test('admin reply does not downgrade status from resolved', function () {
    $feedback = Feedback::create([
        'user_id' => $this->user->id,
        'type' => 'feedback',
        'subject' => 'Done',
        'description' => 'Done desc',
        'status' => 'resolved',
    ]);

    Http::fake();

    $this->actingAs($this->admin)
        ->post("/admin/feedbacks/{$feedback->id}/reply", [
            'message' => 'Follow up.',
        ]);

    expect($feedback->fresh()->status)->toBe('resolved');
});

test('reply requires message', function () {
    $feedback = Feedback::create([
        'user_id' => $this->user->id,
        'type' => 'feedback',
        'subject' => 'Test',
        'description' => 'Desc',
    ]);

    $this->actingAs($this->admin)
        ->post("/admin/feedbacks/{$feedback->id}/reply", [
            'message' => '',
        ])
        ->assertSessionHasErrors('message');
});

test('status change sends LINE push to user', function () {
    Http::fake([
        'api.line.me/*' => Http::response([], 200),
    ]);

    $lineUser = User::factory()->create([
        'provider' => 'line',
        'provider_id' => 'U1234567890',
    ]);

    $feedback = Feedback::create([
        'user_id' => $lineUser->id,
        'type' => 'feedback',
        'subject' => 'Test',
        'description' => 'Desc',
        'status' => 'pending',
    ]);

    $this->actingAs($this->admin)
        ->patch("/admin/feedbacks/{$feedback->id}/status", [
            'status' => 'resolved',
        ]);

    $this->assertDatabaseHas('notification_logs', [
        'user_id' => $lineUser->id,
        'type' => 'feedback',
        'status' => 'sent',
    ]);
});

test('user sees replies in feedback page', function () {
    $feedback = Feedback::create([
        'user_id' => $this->user->id,
        'type' => 'feedback',
        'subject' => 'Test',
        'description' => 'Desc',
    ]);

    $feedback->replies()->create([
        'user_id' => $this->admin->id,
        'message' => 'Admin reply here',
        'is_admin' => true,
    ]);

    $this->actingAs($this->user)
        ->get('/feedback')
        ->assertOk();
});
