<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FcmPushService
{
    /**
     * Send FCM push notification to a user.
     */
    public function sendPush(User $user, string $title, string $body, array $data = []): bool
    {
        if (!$user->fcm_token) {
            return false;
        }

        $serverKey = config('services.fcm.server_key');
        if (!$serverKey) {
            Log::warning('FCM server key not configured');
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'key=' . $serverKey,
                'Content-Type' => 'application/json',
            ])->post('https://fcm.googleapis.com/fcm/send', [
                'to' => $user->fcm_token,
                'notification' => [
                    'title' => $title,
                    'body' => $body,
                    'sound' => 'default',
                ],
                'data' => $data,
            ]);

            if ($response->successful()) {
                return true;
            }

            // Token is invalid or expired — clear it
            if ($response->json('results.0.error') === 'NotRegistered') {
                $user->update(['fcm_token' => null]);
            }

            Log::warning('FCM push failed', ['response' => $response->json()]);
            return false;
        } catch (\Exception $e) {
            Log::error('FCM push error', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Send FCM push to multiple users.
     */
    public function sendToMany(array $users, string $title, string $body, array $data = []): array
    {
        $sent = 0;
        $skipped = 0;

        foreach ($users as $user) {
            if ($this->sendPush($user, $title, $body, $data)) {
                $sent++;
            } else {
                $skipped++;
            }
        }

        return ['sent' => $sent, 'skipped' => $skipped];
    }
}
