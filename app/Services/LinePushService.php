<?php

namespace App\Services;

use App\Models\NotificationLog;
use App\Models\NotificationSetting;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LinePushService
{
    private string $channelAccessToken;
    private string $apiUrl = 'https://api.line.me/v2/bot/message/push';

    public function __construct()
    {
        $this->channelAccessToken = config('services.line.channel_access_token', '');
    }

    /**
     * Send a push message to a user via LINE OA.
     */
    public function sendPush(User $user, string $type, string $title, string $message, array $metadata = []): bool
    {
        $lineUserId = $user->provider === 'line' ? $user->provider_id : null;

        if (!$lineUserId) {
            $this->logNotification($user, $type, $title, $message, 'skipped', $metadata, 'User has no LINE account');
            return false;
        }

        // Check notification settings
        if (!$this->shouldSend($user, $type)) {
            $this->logNotification($user, $type, $title, $message, 'skipped', $metadata, 'Notification disabled by user');
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->channelAccessToken,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, [
                'to' => $lineUserId,
                'messages' => [
                    $this->buildFlexMessage($type, $title, $message),
                ],
            ]);

            if ($response->successful()) {
                $this->logNotification($user, $type, $title, $message, 'sent', $metadata);
                return true;
            }

            $errorMsg = $response->body();
            Log::warning('LINE push failed', ['user_id' => $user->id, 'status' => $response->status(), 'body' => $errorMsg]);
            $this->logNotification($user, $type, $title, $message, 'failed', $metadata, $errorMsg);
            return false;

        } catch (\Exception $e) {
            Log::error('LINE push exception', ['user_id' => $user->id, 'error' => $e->getMessage()]);
            $this->logNotification($user, $type, $title, $message, 'failed', $metadata, $e->getMessage());
            return false;
        }
    }

    /**
     * Send a simple text push message.
     */
    public function sendTextPush(User $user, string $type, string $title, string $text, array $metadata = []): bool
    {
        $lineUserId = $user->provider === 'line' ? $user->provider_id : null;

        if (!$lineUserId) {
            return false;
        }

        if (!$this->shouldSend($user, $type)) {
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->channelAccessToken,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl, [
                'to' => $lineUserId,
                'messages' => [
                    ['type' => 'text', 'text' => "{$title}\n\n{$text}"],
                ],
            ]);

            $status = $response->successful() ? 'sent' : 'failed';
            $this->logNotification($user, $type, $title, $text, $status, $metadata, $response->successful() ? null : $response->body());
            return $response->successful();

        } catch (\Exception $e) {
            Log::error('LINE push exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Send push to multiple users.
     */
    public function sendPushToMany(array $users, string $type, string $title, string $message, array $metadata = []): int
    {
        $sent = 0;
        foreach ($users as $user) {
            if ($this->sendPush($user, $type, $title, $message, $metadata)) {
                $sent++;
            }
        }
        return $sent;
    }

    /**
     * Check if notification should be sent based on user settings.
     */
    private function shouldSend(User $user, string $type): bool
    {
        $settings = NotificationSetting::firstOrCreate(
            ['user_id' => $user->id],
            ['enabled' => true]
        );

        if (!$settings->enabled) {
            return false;
        }

        // Map type to setting field
        $typeMap = [
            'party_invite' => 'party_invite',
            'party_reminder' => 'party_reminder',
            'game_start' => 'game_start',
            'game_result' => 'game_result',
            'friend_request' => 'friend_request',
            'party_member_joined' => 'party_member_joined',
        ];

        if (isset($typeMap[$type]) && isset($settings->{$typeMap[$type]})) {
            return (bool) $settings->{$typeMap[$type]};
        }

        return true; // Allow unknown types by default
    }

    /**
     * Build a Flex Message for LINE.
     */
    private function buildFlexMessage(string $type, string $title, string $message): array
    {
        $iconMap = [
            'party_invite' => '🎉',
            'party_reminder' => '⏰',
            'game_start' => '🏸',
            'game_result' => '🏆',
            'friend_request' => '👋',
            'party_member_joined' => '👥',
        ];

        $icon = $iconMap[$type] ?? '🔔';

        return [
            'type' => 'flex',
            'altText' => "{$icon} {$title}",
            'contents' => [
                'type' => 'bubble',
                'size' => 'kilo',
                'header' => [
                    'type' => 'box',
                    'layout' => 'horizontal',
                    'contents' => [
                        [
                            'type' => 'text',
                            'text' => "{$icon} {$title}",
                            'weight' => 'bold',
                            'size' => 'sm',
                            'color' => '#1a6b3c',
                        ],
                    ],
                    'paddingAll' => '15px',
                    'backgroundColor' => '#f0fdf4',
                ],
                'body' => [
                    'type' => 'box',
                    'layout' => 'vertical',
                    'contents' => [
                        [
                            'type' => 'text',
                            'text' => $message,
                            'size' => 'sm',
                            'color' => '#333333',
                            'wrap' => true,
                        ],
                    ],
                    'paddingAll' => '15px',
                ],
                'styles' => [
                    'header' => ['separator' => false],
                ],
            ],
        ];
    }

    /**
     * Log the notification.
     */
    private function logNotification(User $user, string $type, string $title, string $message, string $status, array $metadata = [], ?string $errorMessage = null): void
    {
        NotificationLog::create([
            'user_id' => $user->id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'status' => $status,
            'metadata' => $metadata ?: null,
            'sent_at' => $status === 'sent' ? now() : null,
            'error_message' => $errorMessage,
        ]);
    }
}
