<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Auth\SocialController;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules;
use Socialite;

class AuthController extends Controller
{
    /**
     * Register a new user with email/password.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'device_name' => 'required|string',
            'fcm_token' => 'nullable|string|max:512',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'fcm_token' => $request->fcm_token,
        ]);

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ], 201);
    }

    /**
     * Login with email/password.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'device_name' => 'required|string',
            'fcm_token' => 'nullable|string|max:512',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
            ], 401);
        }

        // Update FCM token if provided
        if ($request->fcm_token) {
            $user->update(['fcm_token' => $request->fcm_token]);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * Social login — accepts access token from mobile SDK (LINE, Google, Apple).
     */
    public function socialLogin(Request $request)
    {
        $request->validate([
            'provider' => 'required|string|in:line,google,apple',
            'access_token' => 'required|string',
            'device_name' => 'required|string',
            'fcm_token' => 'nullable|string|max:512',
        ]);

        $provider = $request->provider;

        try {
            $socialUser = Socialite::driver($provider)->stateless()->userFromToken($request->access_token);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'ไม่สามารถยืนยันตัวตนกับ ' . $provider . ' ได้',
                'error' => $e->getMessage(),
            ], 401);
        }

        $socialController = new SocialController();
        $user = $socialController->findOrCreateUser($socialUser, $provider);

        if ($request->fcm_token) {
            $user->update(['fcm_token' => $request->fcm_token]);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * LINE LIFF login — accepts LINE user info directly.
     */
    public function lineLiffLogin(Request $request)
    {
        $request->validate([
            'userId' => 'required|string',
            'provider' => 'required|string',
            'device_name' => 'required|string',
            'fcm_token' => 'nullable|string|max:512',
        ]);

        $socialController = new SocialController();
        $user = $socialController->checkLineLiff($request);

        if ($request->fcm_token) {
            $user->update(['fcm_token' => $request->fcm_token]);
        }

        $token = $user->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }

    /**
     * Get current authenticated user with config.
     */
    public function user(Request $request)
    {
        $user = $request->user()->load('latestSkillAssessment');

        return response()->json([
            'user' => new UserResource($user),
            'meta' => [
                'ably_key' => config('broadcasting.connections.ably.key'),
                'unread_chat_count' => \App\Http\Controllers\ChatController::getUnreadCount($user->id),
                'level_up_notification' => \App\Models\LevelUpNotification::where('user_id', $user->id)
                    ->where('is_seen', false)
                    ->first(),
            ],
        ]);
    }

    /**
     * Logout — revoke current token and clear FCM.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'ออกจากระบบแล้ว']);
    }

    /**
     * Logout from all devices.
     */
    public function logoutAll(Request $request)
    {
        $request->user()->tokens()->delete();
        $request->user()->update(['fcm_token' => null]);

        return response()->json(['message' => 'ออกจากระบบทุกอุปกรณ์แล้ว']);
    }

    /**
     * Register/update FCM token for push notifications.
     */
    public function registerDevice(Request $request)
    {
        $request->validate([
            'fcm_token' => 'required|string|max:512',
        ]);

        $request->user()->update(['fcm_token' => $request->fcm_token]);

        return response()->json(['message' => 'ลงทะเบียนอุปกรณ์แล้ว']);
    }

    /**
     * List active devices (tokens).
     */
    public function devices(Request $request)
    {
        $tokens = $request->user()->tokens()
            ->select('id', 'name', 'last_used_at', 'created_at')
            ->orderByDesc('last_used_at')
            ->get()
            ->map(fn($token) => [
                'id' => $token->id,
                'device_name' => $token->name,
                'last_used_at' => $token->last_used_at,
                'created_at' => $token->created_at,
                'is_current' => $token->id === $request->user()->currentAccessToken()->id,
            ]);

        return response()->json(['devices' => $tokens]);
    }

    /**
     * Revoke a specific device token.
     */
    public function revokeDevice(Request $request, $tokenId)
    {
        $token = $request->user()->tokens()->where('id', $tokenId)->first();

        if (!$token) {
            return response()->json(['message' => 'ไม่พบอุปกรณ์'], 404);
        }

        $token->delete();

        return response()->json(['message' => 'ลบอุปกรณ์แล้ว']);
    }

    /**
     * Refresh token — revoke current and issue new.
     */
    public function refreshToken(Request $request)
    {
        $request->validate([
            'device_name' => 'required|string',
        ]);

        $request->user()->currentAccessToken()->delete();
        $newToken = $request->user()->createToken($request->device_name)->plainTextToken;

        return response()->json([
            'token' => $newToken,
            'user' => new UserResource($request->user()),
        ]);
    }

    /**
     * Forgot password — send reset link.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว']);
        }

        return response()->json(['message' => 'ไม่พบอีเมลนี้ในระบบ'], 422);
    }

    /**
     * Reset password with token.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                // Revoke all tokens on password reset
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'รีเซ็ตรหัสผ่านเรียบร้อย']);
        }

        return response()->json(['message' => 'ลิงก์รีเซ็ตไม่ถูกต้องหรือหมดอายุ'], 422);
    }
}
