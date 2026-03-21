<?php

namespace App\Http\Controllers;

use App\Models\LinkedAccount;
use App\Models\User;
use App\Services\AccountLinkingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Socialite;

class LinkedAccountController extends Controller
{
    protected AccountLinkingService $linkingService;

    public function __construct()
    {
        $this->linkingService = new AccountLinkingService();
    }

    /**
     * Redirect to OAuth provider for account linking.
     */
    public function redirectToLink($provider)
    {
        session(['linking_account' => true]);

        return Socialite::driver($provider)
            ->redirectUrl(config('app.url') . "/linked-accounts/link/{$provider}/callback")
            ->redirect();
    }

    /**
     * Handle OAuth callback for account linking.
     */
    public function handleLinkCallback($provider)
    {
        session()->forget('linking_account');

        try {
            $socialUser = Socialite::driver($provider)
                ->redirectUrl(config('app.url') . "/linked-accounts/link/{$provider}/callback")
                ->stateless()
                ->user();
        } catch (\Exception $e) {
            return redirect('/profile/edit')->with('error', 'ไม่สามารถเชื่อมต่อกับ ' . $provider . ' ได้');
        }

        $currentUser = auth()->user();
        $providerId = $socialUser->getId();

        // Already linked to this user?
        $existing = LinkedAccount::where('provider', $provider)
            ->where('provider_id', $providerId)
            ->first();

        if ($existing && $existing->user_id === $currentUser->id) {
            return redirect('/profile/edit')->with('info', 'บัญชีนี้เชื่อมต่ออยู่แล้ว');
        }

        // Linked to another user? → merge flow
        if ($existing) {
            $otherUser = User::find($existing->user_id);

            // Detect conflicts
            $conflicts = $this->linkingService->detectConflicts($currentUser, $otherUser);

            session([
                'merge_data' => [
                    'other_user_id' => $otherUser->id,
                    'provider' => $provider,
                    'provider_id' => $providerId,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'avatar' => $otherUser->avatar,
                        'email' => $otherUser->email,
                        'provider' => $provider,
                        'mmr' => $otherUser->mmr,
                        'gender' => $otherUser->gender,
                        'date_of_birth' => $otherUser->date_of_birth?->format('Y-m-d'),
                        'phone' => $otherUser->phone,
                    ],
                    'conflicts' => $conflicts,
                ],
            ]);

            return redirect('/linked-accounts/merge');
        }

        // Email check before linking
        $socialEmail = $socialUser->getEmail();
        $isRandomEmail = str_ends_with($currentUser->email, '@example.com');

        if ($isRandomEmail && $socialEmail) {
            // Auto-update random email to real email from provider
            $currentUser->update([
                'email' => $socialEmail,
                'email_verified_at' => now(),
            ]);
        } elseif (!$isRandomEmail && $socialEmail && $currentUser->email !== $socialEmail) {
            // Real email doesn't match provider email → block
            return redirect('/profile/edit')->with('error',
                'อีเมลในระบบ (' . $currentUser->email . ') ไม่ตรงกับอีเมล ' . $provider . ' (' . $socialEmail . ') กรุณาเปลี่ยนอีเมลให้ตรงกันก่อนเชื่อมต่อ'
            );
        }

        // Not linked anywhere → simply link
        $this->linkingService->linkAccountToUser(
            $currentUser,
            $provider,
            $providerId,
            $socialUser->getName(),
            $socialUser->getAvatar()
        );

        $msg = 'เชื่อมต่อ ' . $provider . ' เรียบร้อย';
        if ($isRandomEmail && $socialEmail) {
            $msg .= ' และอัปเดตอีเมลเป็น ' . $socialEmail . ' แล้ว';
        }
        return redirect('/profile/edit')->with('success', $msg);
    }

    /**
     * Show merge confirmation page.
     */
    public function showMergeConfirm()
    {
        $mergeData = session('merge_data');
        if (!$mergeData) {
            return redirect('/profile/edit');
        }

        $currentUser = auth()->user();

        return Inertia::render('LinkedAccounts/MergeConfirm', [
            'keepUser' => [
                'id' => $currentUser->id,
                'name' => $currentUser->name,
                'avatar' => $currentUser->avatar,
                'email' => $currentUser->email,
                'mmr' => $currentUser->mmr,
                'gender' => $currentUser->gender,
                'date_of_birth' => $currentUser->date_of_birth?->format('Y-m-d'),
                'phone' => $currentUser->phone,
            ],
            'mergeUser' => $mergeData['other_user'],
            'conflicts' => $mergeData['conflicts'],
            'provider' => $mergeData['provider'],
        ]);
    }

    /**
     * Execute merge.
     */
    public function confirmMerge(Request $request)
    {
        $mergeData = session('merge_data');
        if (!$mergeData) {
            return redirect('/profile/edit')->with('error', 'ข้อมูลหมดอายุ กรุณาลองใหม่');
        }

        $otherUser = User::find($mergeData['other_user_id']);
        if (!$otherUser) {
            session()->forget('merge_data');
            return redirect('/profile/edit')->with('error', 'ไม่พบบัญชีที่ต้องการรวม');
        }

        try {
            $this->linkingService->mergeAccounts(
                auth()->user(),
                $otherUser,
                $request->only(['name', 'avatar'])
            );
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Merge failed', ['error' => $e->getMessage()]);
            return redirect('/linked-accounts/merge')->with('error', 'รวมบัญชีไม่สำเร็จ: ' . $e->getMessage());
        }

        session()->forget('merge_data');

        return redirect('/profile/edit')->with('success', 'รวมบัญชีเรียบร้อย!');
    }

    /**
     * Unlink a provider.
     */
    public function unlink($provider)
    {
        $user = auth()->user();
        $linkedCount = $user->linkedAccounts()->count();

        if ($linkedCount <= 1) {
            return back()->with('error', 'ไม่สามารถยกเลิกการเชื่อมต่อได้ ต้องมีบัญชีเชื่อมต่ออย่างน้อย 1 บัญชี');
        }

        $user->linkedAccounts()->where('provider', $provider)->delete();

        // Clear users.provider if it matches
        if ($user->provider === $provider) {
            $remaining = $user->linkedAccounts()->first();
            $user->update([
                'provider' => $remaining?->provider,
                'provider_id' => $remaining?->provider_id,
            ]);
        }

        return back()->with('success', 'ยกเลิกการเชื่อมต่อ ' . $provider . ' แล้ว');
    }

    /**
     * Check if an email belongs to another user (for email change flow).
     */
    public function checkEmail(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $otherUser = User::where('email', $request->email)
            ->where('id', '!=', auth()->id())
            ->first();

        if (!$otherUser) {
            return response()->json(['exists' => false]);
        }

        $linkedProviders = $otherUser->linkedAccounts()->pluck('provider')->toArray();

        return response()->json([
            'exists' => true,
            'user_name' => $otherUser->name,
            'providers' => $linkedProviders,
        ]);
    }
}
