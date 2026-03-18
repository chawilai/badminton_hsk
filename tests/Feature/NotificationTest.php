<?php

use App\Models\NotificationLog;
use App\Models\NotificationSetting;
use App\Models\User;
use App\Services\LinePushService;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->user = User::factory()->create([
        'provider' => 'line',
        'provider_id' => 'Ub27246e34d17f341e146a358d3baa95e',
    ]);
});

test('authenticated user can view notification settings', function () {
    $this->actingAs($this->user)
        ->get('/notifications/settings')
        ->assertOk();
});

test('unauthenticated user is redirected', function () {
    $this->get('/notifications/settings')
        ->assertRedirect('/login');
});

test('notification settings are auto-created on first visit', function () {
    $this->actingAs($this->user)
        ->get('/notifications/settings');

    $this->assertDatabaseHas('notification_settings', [
        'user_id' => $this->user->id,
        'enabled' => true,
    ]);
});

test('user can update notification settings', function () {
    $this->actingAs($this->user)
        ->patch('/notifications/settings', [
            'enabled' => true,
            'party_invite' => true,
            'party_reminder' => false,
            'game_start' => true,
            'game_result' => false,
            'friend_request' => true,
            'party_member_joined' => false,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('notification_settings', [
        'user_id' => $this->user->id,
        'party_reminder' => false,
        'game_result' => false,
        'party_member_joined' => false,
    ]);
});

test('user can disable all notifications', function () {
    $this->actingAs($this->user)
        ->patch('/notifications/settings', [
            'enabled' => false,
            'party_invite' => true,
            'party_reminder' => true,
            'game_start' => true,
            'game_result' => true,
            'friend_request' => true,
            'party_member_joined' => true,
        ])
        ->assertRedirect();

    $this->assertDatabaseHas('notification_settings', [
        'user_id' => $this->user->id,
        'enabled' => false,
    ]);
});

test('LinePushService skips user without LINE account', function () {
    $emailUser = User::factory()->create([
        'provider' => null,
        'provider_id' => null,
    ]);

    $service = new LinePushService();
    $result = $service->sendPush($emailUser, 'party_invite', 'Test', 'Test message');

    expect($result)->toBeFalse();

    $this->assertDatabaseHas('notification_logs', [
        'user_id' => $emailUser->id,
        'status' => 'skipped',
    ]);
});

test('LinePushService respects disabled settings', function () {
    NotificationSetting::create([
        'user_id' => $this->user->id,
        'enabled' => false,
    ]);

    $service = new LinePushService();
    $result = $service->sendPush($this->user, 'party_invite', 'Test', 'Test message');

    expect($result)->toBeFalse();

    $this->assertDatabaseHas('notification_logs', [
        'user_id' => $this->user->id,
        'status' => 'skipped',
        'error_message' => 'Notification disabled by user',
    ]);
});

test('LinePushService respects individual type settings', function () {
    NotificationSetting::create([
        'user_id' => $this->user->id,
        'enabled' => true,
        'game_start' => false,
    ]);

    $service = new LinePushService();
    $result = $service->sendPush($this->user, 'game_start', 'Test', 'Test message');

    expect($result)->toBeFalse();
});

test('LinePushService sends push when enabled', function () {
    Http::fake([
        'api.line.me/*' => Http::response([], 200),
    ]);

    NotificationSetting::create([
        'user_id' => $this->user->id,
        'enabled' => true,
    ]);

    $service = new LinePushService();
    $result = $service->sendPush($this->user, 'party_invite', 'ทดสอบ', 'ข้อความทดสอบ');

    expect($result)->toBeTrue();

    $this->assertDatabaseHas('notification_logs', [
        'user_id' => $this->user->id,
        'status' => 'sent',
        'type' => 'party_invite',
    ]);
});

test('LinePushService logs failed push', function () {
    Http::fake([
        'api.line.me/*' => Http::response(['message' => 'Invalid token'], 401),
    ]);

    NotificationSetting::create([
        'user_id' => $this->user->id,
        'enabled' => true,
    ]);

    $service = new LinePushService();
    $result = $service->sendPush($this->user, 'party_invite', 'Test', 'Test');

    expect($result)->toBeFalse();

    $this->assertDatabaseHas('notification_logs', [
        'user_id' => $this->user->id,
        'status' => 'failed',
    ]);
});

test('notification log stores metadata', function () {
    Http::fake([
        'api.line.me/*' => Http::response([], 200),
    ]);

    NotificationSetting::create([
        'user_id' => $this->user->id,
        'enabled' => true,
    ]);

    $service = new LinePushService();
    $service->sendPush($this->user, 'party_invite', 'Test', 'Test', ['party_id' => 1]);

    $log = NotificationLog::where('user_id', $this->user->id)->first();
    expect($log->metadata)->toBe(['party_id' => 1]);
});
