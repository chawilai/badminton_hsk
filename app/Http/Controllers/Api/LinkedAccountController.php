<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LinkedAccount;
use App\Models\User;
use App\Services\AccountLinkingService;
use Illuminate\Http\Request;
use Socialite;

class LinkedAccountController extends Controller
{
    protected AccountLinkingService $linkingService;

    public function __construct()
    {
        $this->linkingService = new AccountLinkingService();
    }

    /**
     * List linked accounts for current user.
     */
    public function index(Request $request)
    {
        $accounts = $request->user()->linkedAccounts()
            ->select('provider', 'provider_name', 'provider_avatar', 'created_at')
            ->get();

        return response()->json(['linked_accounts' => $accounts]);
    }

    /**
     * Link a social account via access token (for Flutter).
     */
    public function link(Request $request)
    {
        $request->validate([
            'provider' => 'required|in:line,google,apple',
            'access_token' => 'required|string',
        ]);

        $provider = $request->provider;

        try {
            $socialUser = Socialite::driver($provider)->stateless()->userFromToken($request->access_token);
        } catch (\Exception $e) {
            return response()->json(['message' => 'ไม่สามารถยืนยันตัวตนได้'], 401);
        }

        $currentUser = $request->user();
        $providerId = $socialUser->getId();

        // Already linked to this user?
        $existing = LinkedAccount::where('provider', $provider)->where('provider_id', $providerId)->first();

        if ($existing && $existing->user_id === $currentUser->id) {
            return response()->json(['message' => 'เชื่อมต่ออยู่แล้ว']);
        }

        // Linked to another user → return merge preview
        if ($existing) {
            $otherUser = User::find($existing->user_id);
            $conflicts = $this->linkingService->detectConflicts($currentUser, $otherUser);

            return response()->json([
                'action' => 'merge_required',
                'other_user' => [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'avatar' => $otherUser->avatar,
                    'email' => $otherUser->email,
                    'mmr' => $otherUser->mmr,
                ],
                'conflicts' => $conflicts,
            ]);
        }

        // Simply link
        $this->linkingService->linkAccountToUser(
            $currentUser, $provider, $providerId,
            $socialUser->getName(), $socialUser->getAvatar()
        );

        return response()->json(['message' => 'เชื่อมต่อ ' . $provider . ' เรียบร้อย']);
    }

    /**
     * Unlink a provider.
     */
    public function unlink(Request $request, $provider)
    {
        $user = $request->user();

        if ($user->linkedAccounts()->count() <= 1) {
            return response()->json(['message' => 'ต้องมีบัญชีเชื่อมต่ออย่างน้อย 1 บัญชี'], 422);
        }

        $user->linkedAccounts()->where('provider', $provider)->delete();

        return response()->json(['message' => 'ยกเลิกการเชื่อมต่อ ' . $provider . ' แล้ว']);
    }

    /**
     * Check merge conflicts.
     */
    public function checkMerge(Request $request)
    {
        $request->validate(['other_user_id' => 'required|exists:users,id']);

        $otherUser = User::findOrFail($request->other_user_id);
        $conflicts = $this->linkingService->detectConflicts($request->user(), $otherUser);

        return response()->json(['conflicts' => $conflicts, 'can_merge' => empty($conflicts)]);
    }

    /**
     * Confirm merge.
     */
    public function confirmMerge(Request $request)
    {
        $request->validate(['other_user_id' => 'required|exists:users,id']);

        $otherUser = User::findOrFail($request->other_user_id);
        $conflicts = $this->linkingService->detectConflicts($request->user(), $otherUser);

        if (!empty($conflicts)) {
            return response()->json(['message' => 'ยังมีปัญหาที่ต้องแก้ไขก่อน', 'conflicts' => $conflicts], 422);
        }

        $this->linkingService->mergeAccounts(
            $request->user(),
            $otherUser,
            $request->only(['name', 'avatar'])
        );

        return response()->json(['message' => 'รวมบัญชีเรียบร้อย!']);
    }
}
