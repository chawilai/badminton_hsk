<?php

namespace App\Services;

use App\Models\SmsLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ThSmsService
{
    protected string $apiToken;
    protected string $sender;

    public function __construct()
    {
        $this->apiToken = config('services.thsms.api_token');
        $this->sender = config('services.thsms.sender', 'BADMINTON');
    }

    public function sendOtp(string $phone, string $code, ?int $userId = null): bool
    {
        $message = "รหัสยืนยัน Badminton Party ของคุณคือ: {$code} (หมดอายุใน 5 นาที)";

        return $this->send($phone, $message, 'otp', $userId);
    }

    public function send(string $phone, string $message, string $purpose = 'notification', ?int $userId = null): bool
    {
        $normalizedPhone = $this->normalizePhone($phone);

        if (empty($this->apiToken)) {
            Log::warning('THSMS: API token not configured');
            $this->log($userId, $normalizedPhone, $message, $purpose, 'failed', null, 'API token not configured');
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiToken,
                'Content-Type' => 'application/json',
            ])->post('https://thsms.com/api/send-sms', [
                'sender' => $this->sender,
                'msisdn' => [$normalizedPhone],
                'message' => $message,
            ]);

            $success = $response->successful();

            $this->log(
                $userId,
                $normalizedPhone,
                $message,
                $purpose,
                $success ? 'sent' : 'failed',
                $response->status(),
                $response->body(),
            );

            if ($success) {
                Log::info('THSMS: SMS sent', ['phone' => $normalizedPhone]);
            } else {
                Log::error('THSMS: Failed to send SMS', [
                    'phone' => $normalizedPhone,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }

            return $success;
        } catch (\Exception $e) {
            Log::error('THSMS: Exception', ['error' => $e->getMessage()]);
            $this->log($userId, $normalizedPhone, $message, $purpose, 'failed', null, $e->getMessage());
            return false;
        }
    }

    protected function log(?int $userId, string $phone, string $message, string $purpose, string $status, ?int $httpStatus, ?string $responseBody): void
    {
        try {
            SmsLog::create([
                'user_id' => $userId,
                'phone' => $phone,
                'message' => $message,
                'purpose' => $purpose,
                'status' => $status,
                'http_status' => $httpStatus,
                'response_body' => $responseBody,
            ]);
        } catch (\Exception $e) {
            Log::error('SmsLog: Failed to save log', ['error' => $e->getMessage()]);
        }
    }

    protected function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($phone, '0')) {
            $phone = '66' . substr($phone, 1);
        }

        if (!str_starts_with($phone, '66')) {
            $phone = '66' . $phone;
        }

        return $phone;
    }
}
