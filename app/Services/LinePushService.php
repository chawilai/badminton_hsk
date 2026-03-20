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
     * Get LINE message quota and usage.
     * Returns: ['quota' => 300, 'used' => 282, 'remaining' => 18]
     */
    public function getQuota(): array
    {
        try {
            $headers = ['Authorization' => 'Bearer ' . $this->channelAccessToken];

            $quotaRes = Http::withHeaders($headers)
                ->get('https://api.line.me/v2/bot/message/quota');
            $usageRes = Http::withHeaders($headers)
                ->get('https://api.line.me/v2/bot/message/quota/consumption');

            $quota = $quotaRes->json('value', 0);
            $used = $usageRes->json('totalUsage', 0);

            return [
                'quota' => (int) $quota,
                'used' => (int) $used,
                'remaining' => max(0, (int) $quota - (int) $used),
            ];
        } catch (\Exception $e) {
            Log::error('LINE quota check failed', ['error' => $e->getMessage()]);
            return ['quota' => 0, 'used' => 0, 'remaining' => 0];
        }
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
                    $this->buildFlexMessage($type, $title, $message, $metadata),
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
    private function buildFlexMessage(string $type, string $title, string $message, array $metadata = []): array
    {
        $themeMap = [
            'party_invite'        => ['icon' => '🎉', 'headerBg' => '#f0fdf4', 'headerColor' => '#166534', 'accent' => '#22c55e'],
            'party_reminder'      => ['icon' => '⏰', 'headerBg' => '#fefce8', 'headerColor' => '#854d0e', 'accent' => '#eab308'],
            'game_start'          => ['icon' => '🏸', 'headerBg' => '#f0fdf4', 'headerColor' => '#166534', 'accent' => '#22c55e'],
            'game_result'         => ['icon' => '🏆', 'headerBg' => '#fef9c3', 'headerColor' => '#854d0e', 'accent' => '#f59e0b'],
            'friend_request'      => ['icon' => '👋', 'headerBg' => '#eff6ff', 'headerColor' => '#1e40af', 'accent' => '#3b82f6'],
            'party_member_joined' => ['icon' => '👥', 'headerBg' => '#f0fdf4', 'headerColor' => '#166534', 'accent' => '#22c55e'],
            'feedback'            => ['icon' => '💬', 'headerBg' => '#eff6ff', 'headerColor' => '#1e40af', 'accent' => '#3b82f6'],
        ];

        $theme = $themeMap[$type] ?? ['icon' => '🔔', 'headerBg' => '#f0fdf4', 'headerColor' => '#166534', 'accent' => '#22c55e'];

        // Build body contents
        $bodyContents = [];

        // Parse message lines into label-value pairs or plain text
        foreach (explode("\n", $message) as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            if (str_contains($line, ':') && !str_starts_with($line, 'http')) {
                [$label, $value] = array_map('trim', explode(':', $line, 2));
                $bodyContents[] = [
                    'type' => 'box',
                    'layout' => 'horizontal',
                    'contents' => [
                        ['type' => 'text', 'text' => $label, 'size' => 'xs', 'color' => '#999999', 'flex' => 0, 'weight' => 'bold'],
                        ['type' => 'text', 'text' => $value, 'size' => 'sm', 'color' => '#333333', 'flex' => 1, 'wrap' => true, 'align' => 'end'],
                    ],
                    'spacing' => 'sm',
                    'margin' => 'md',
                ];
            } else {
                $bodyContents[] = [
                    'type' => 'text',
                    'text' => $line,
                    'size' => 'sm',
                    'color' => '#333333',
                    'wrap' => true,
                    'margin' => 'md',
                ];
            }
        }

        // Separator + app branding
        $bodyContents[] = ['type' => 'separator', 'margin' => 'lg'];
        $bodyContents[] = [
            'type' => 'text',
            'text' => '🏸 Badminton Party',
            'size' => 'xxs',
            'color' => '#aaaaaa',
            'margin' => 'md',
            'align' => 'center',
        ];

        $bubble = [
            'type' => 'bubble',
            'size' => 'kilo',
            'header' => [
                'type' => 'box',
                'layout' => 'vertical',
                'contents' => [
                    [
                        'type' => 'text',
                        'text' => "{$theme['icon']} {$title}",
                        'weight' => 'bold',
                        'size' => 'md',
                        'color' => $theme['headerColor'],
                    ],
                ],
                'paddingAll' => '15px',
                'backgroundColor' => $theme['headerBg'],
            ],
            'body' => [
                'type' => 'box',
                'layout' => 'vertical',
                'contents' => $bodyContents,
                'paddingAll' => '15px',
            ],
        ];

        // Add footer with action button if URL provided
        $appUrl = config('app.url', '');
        $actionUrl = $metadata['action_url'] ?? null;
        if ($actionUrl || $appUrl) {
            $url = $actionUrl ?: ($appUrl . '/feedback');
            $bubble['footer'] = [
                'type' => 'box',
                'layout' => 'vertical',
                'contents' => [
                    [
                        'type' => 'button',
                        'action' => [
                            'type' => 'uri',
                            'label' => $metadata['action_label'] ?? 'ดูรายละเอียด',
                            'uri' => $url,
                        ],
                        'style' => 'primary',
                        'color' => $theme['accent'],
                        'height' => 'sm',
                    ],
                ],
                'paddingAll' => '12px',
            ];
        }

        return [
            'type' => 'flex',
            'altText' => "{$theme['icon']} {$title}",
            'contents' => $bubble,
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
