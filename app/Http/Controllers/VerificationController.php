<?php

namespace App\Http\Controllers;

use App\Mail\VerifyEmailCode;
use App\Models\VerificationCode;
use App\Services\ThSmsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class VerificationController extends Controller
{
    /**
     * Send phone OTP via TH SMS.
     */
    public function sendPhoneOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string', 'regex:/^0[0-9]{8,9}$/'],
        ]);

        $user = $request->user();
        $phone = $request->phone;

        // Rate limit: max 1 per 60 seconds
        $recent = VerificationCode::where('user_id', $user->id)
            ->where('type', 'phone')
            ->where('created_at', '>', now()->subMinute())
            ->exists();

        if ($recent) {
            return response()->json(['message' => 'กรุณารอ 1 นาทีก่อนส่งรหัสใหม่'], 429);
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $sms = new ThSmsService();
        $sent = $sms->sendOtp($phone, $code, $user->id);

        if (!$sent) {
            return response()->json(['message' => 'ส่ง SMS ไม่สำเร็จ กรุณาลองใหม่'], 500);
        }

        VerificationCode::create([
            'user_id' => $user->id,
            'type' => 'phone',
            'target' => $phone,
            'code' => $code,
            'expires_at' => now()->addMinutes(5),
        ]);

        return response()->json(['message' => 'ส่งรหัส OTP แล้ว']);
    }

    /**
     * Verify phone OTP.
     */
    public function verifyPhone(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        $verification = VerificationCode::where('user_id', $user->id)
            ->where('type', 'phone')
            ->where('target', $request->phone)
            ->where('code', $request->code)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (!$verification) {
            return response()->json(['message' => 'รหัส OTP ไม่ถูกต้อง'], 422);
        }

        if ($verification->isExpired()) {
            return response()->json(['message' => 'รหัส OTP หมดอายุแล้ว กรุณาขอรหัสใหม่'], 422);
        }

        $verification->update(['verified_at' => now()]);

        $user->update([
            'phone' => $request->phone,
            'phone_verified_at' => now(),
        ]);

        return response()->json(['message' => 'ยืนยันเบอร์โทรสำเร็จ']);
    }

    /**
     * Send email verification code.
     */
    public function sendEmailCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        $user = $request->user();
        $email = $request->email;

        // Rate limit: max 1 per 60 seconds
        $recent = VerificationCode::where('user_id', $user->id)
            ->where('type', 'email')
            ->where('created_at', '>', now()->subMinute())
            ->exists();

        if ($recent) {
            return response()->json(['message' => 'กรุณารอ 1 นาทีก่อนส่งรหัสใหม่'], 429);
        }

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        try {
            Mail::to($email)->send(new VerifyEmailCode($code, $user->name));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Email verification failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่'], 500);
        }

        VerificationCode::create([
            'user_id' => $user->id,
            'type' => 'email',
            'target' => $email,
            'code' => $code,
            'expires_at' => now()->addMinutes(10),
        ]);

        return response()->json(['message' => 'ส่งรหัสยืนยันไปที่อีเมลแล้ว']);
    }

    /**
     * Verify email code.
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'string', 'email'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $user = $request->user();

        $verification = VerificationCode::where('user_id', $user->id)
            ->where('type', 'email')
            ->where('target', $request->email)
            ->where('code', $request->code)
            ->whereNull('verified_at')
            ->latest()
            ->first();

        if (!$verification) {
            return response()->json(['message' => 'รหัสไม่ถูกต้อง'], 422);
        }

        if ($verification->isExpired()) {
            return response()->json(['message' => 'รหัสหมดอายุแล้ว กรุณาขอรหัสใหม่'], 422);
        }

        $verification->update(['verified_at' => now()]);

        $user->update([
            'email' => $request->email,
            'email_verified_at' => now(),
        ]);

        return response()->json(['message' => 'ยืนยันอีเมลสำเร็จ']);
    }
}
