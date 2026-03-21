<?php

namespace App\Services;

use App\Models\LinkedAccount;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AccountLinkingService
{
    /**
     * Find user by linked account provider + provider_id.
     */
    public function findUserByLinkedAccount(string $provider, string $providerId): ?User
    {
        $linked = LinkedAccount::where('provider', $provider)
            ->where('provider_id', $providerId)
            ->first();

        return $linked?->user;
    }

    /**
     * Link a social account to an existing user.
     */
    public function linkAccountToUser(User $user, string $provider, string $providerId, ?string $name = null, ?string $avatar = null): LinkedAccount
    {
        return LinkedAccount::firstOrCreate(
            ['provider' => $provider, 'provider_id' => $providerId],
            [
                'user_id' => $user->id,
                'provider_name' => $name,
                'provider_avatar' => $avatar,
            ]
        );
    }

    /**
     * Find or create user from social login — replaces SocialController::findOrCreateUser().
     */
    public function findOrCreateUserFromSocial($socialUser, string $provider): User
    {
        $providerId = $socialUser->getId();
        $email = $socialUser->getEmail();
        $name = $socialUser->getName();
        $avatar = $socialUser->getAvatar();

        // 1. Check linked_accounts
        $user = $this->findUserByLinkedAccount($provider, $providerId);
        if ($user) {
            // Update avatar/name from provider
            LinkedAccount::where('provider', $provider)
                ->where('provider_id', $providerId)
                ->update(['provider_name' => $name, 'provider_avatar' => $avatar]);

            // Update random email if provider now gives a real one
            if ($email && str_ends_with($user->email, '@example.com')) {
                // Check no other user has this email
                if (!User::where('email', $email)->where('id', '!=', $user->id)->exists()) {
                    $user->update(['email' => $email]);
                }
            }

            return $user;
        }

        // 2. Check by email (if provided and not a random placeholder)
        if ($email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $this->linkAccountToUser($user, $provider, $providerId, $name, $avatar);
                // Update avatar if user doesn't have one
                if (!$user->avatar || str_contains($user->avatar, 'example.com')) {
                    $user->update(['avatar' => $avatar, 'profile_picture' => $avatar]);
                }
                return $user;
            }
        }

        // 3. Create new user
        $user = User::create([
            'name' => $name,
            'email' => $email ?? Str::random(10) . '@example.com',
            'provider' => $provider,
            'provider_id' => $providerId,
            'avatar' => $avatar,
            'profile_picture' => $avatar,
            'provider_name' => $name,
            'password' => Hash::make(Str::random(10)),
        ]);

        $this->linkAccountToUser($user, $provider, $providerId, $name, $avatar);

        return $user;
    }

    /**
     * Find or create user from LINE LIFF login.
     */
    public function findOrCreateUserFromLiff(string $providerId, string $provider, ?string $email, ?string $displayName, ?string $pictureUrl): User
    {
        // 1. Check linked_accounts
        $user = $this->findUserByLinkedAccount($provider, $providerId);
        if ($user) {
            // Update random email if LINE now gives a real one
            if ($email && str_ends_with($user->email, '@example.com')) {
                if (!User::where('email', $email)->where('id', '!=', $user->id)->exists()) {
                    $user->update(['email' => $email]);
                }
            }
            return $user;
        }

        // 2. Check by email
        if ($email) {
            $user = User::where('email', $email)->first();
            if ($user) {
                $this->linkAccountToUser($user, $provider, $providerId, $displayName, $pictureUrl);
                return $user;
            }
        }

        // 3. Create new user
        $user = User::create([
            'name' => $displayName,
            'email' => $email ?? Str::random(10) . '@example.com',
            'provider' => $provider,
            'provider_id' => $providerId,
            'avatar' => $pictureUrl,
            'profile_picture' => $pictureUrl,
            'provider_name' => $displayName,
            'password' => Hash::make(Str::random(10)),
        ]);

        $this->linkAccountToUser($user, $provider, $providerId, $displayName, $pictureUrl);

        return $user;
    }

    /**
     * Detect conflicts before merging two accounts.
     */
    public function detectConflicts(User $keepUser, User $mergeUser): array
    {
        $conflicts = [];

        // Same party membership
        $sharedParties = DB::table('party_members as pm1')
            ->join('party_members as pm2', 'pm1.party_id', '=', 'pm2.party_id')
            ->join('parties', 'pm1.party_id', '=', 'parties.id')
            ->where('pm1.user_id', $keepUser->id)
            ->where('pm2.user_id', $mergeUser->id)
            ->select('parties.id', 'parties.name', 'parties.play_date')
            ->get();

        if ($sharedParties->isNotEmpty()) {
            $conflicts[] = [
                'type' => 'same_party',
                'message' => 'ทั้ง 2 บัญชีอยู่ในปาร์ตี้เดียวกัน',
                'details' => $sharedParties->map(fn($p) => [
                    'party_id' => $p->id,
                    'name' => $p->name ?? "ปาร์ตี้ #{$p->id}",
                    'play_date' => $p->play_date,
                ])->toArray(),
            ];
        }

        // Friendship with each other
        $selfFriendship = DB::table('friendships')
            ->where(function ($q) use ($keepUser, $mergeUser) {
                $q->where('sender_id', $keepUser->id)->where('receiver_id', $mergeUser->id);
            })
            ->orWhere(function ($q) use ($keepUser, $mergeUser) {
                $q->where('sender_id', $mergeUser->id)->where('receiver_id', $keepUser->id);
            })
            ->exists();

        if ($selfFriendship) {
            $conflicts[] = [
                'type' => 'self_friendship',
                'message' => 'ทั้ง 2 บัญชีเป็นเพื่อนกันอยู่',
            ];
        }

        // Chat with each other
        $sharedChat = DB::table('chat_participants as cp1')
            ->join('chat_participants as cp2', 'cp1.chat_id', '=', 'cp2.chat_id')
            ->where('cp1.user_id', $keepUser->id)
            ->where('cp2.user_id', $mergeUser->id)
            ->exists();

        if ($sharedChat) {
            $conflicts[] = [
                'type' => 'self_chat',
                'message' => 'ทั้ง 2 บัญชีมีแชทร่วมกัน',
            ];
        }

        return $conflicts;
    }

    /**
     * Merge two accounts: move all data from $deleteUser to $keepUser, then delete $deleteUser.
     */
    public function mergeAccounts(User $keepUser, User $deleteUser, array $profileChoices = []): void
    {
        DB::transaction(function () use ($keepUser, $deleteUser, $profileChoices) {
            $keepId = $keepUser->id;
            $deleteId = $deleteUser->id;

            // Apply profile choices
            if (!empty($profileChoices['name'])) {
                $keepUser->name = $profileChoices['name'];
            }
            if (!empty($profileChoices['avatar'])) {
                $keepUser->avatar = $profileChoices['avatar'];
                $keepUser->profile_picture = $profileChoices['avatar'];
            }

            // Take higher MMR
            if ($deleteUser->mmr > $keepUser->mmr) {
                $keepUser->mmr = $deleteUser->mmr;
            }
            $keepUser->mmr_games_played = ($keepUser->mmr_games_played ?? 0) + ($deleteUser->mmr_games_played ?? 0);

            // Update random email from merged user's real email
            if (str_ends_with($keepUser->email, '@example.com') && $deleteUser->email && !str_ends_with($deleteUser->email, '@example.com')) {
                $keepUser->email = $deleteUser->email;
                $keepUser->email_verified_at = now();
            }

            // Copy profile data if keepUser is missing it
            if (!$keepUser->gender && $deleteUser->gender) $keepUser->gender = $deleteUser->gender;
            if (!$keepUser->date_of_birth && $deleteUser->date_of_birth) $keepUser->date_of_birth = $deleteUser->date_of_birth;
            if (!$keepUser->phone && $deleteUser->phone) $keepUser->phone = $deleteUser->phone;
            if (!$keepUser->province && $deleteUser->province) {
                $keepUser->subdistrict = $deleteUser->subdistrict;
                $keepUser->district = $deleteUser->district;
                $keepUser->province = $deleteUser->province;
            }
            if (!$keepUser->badminton_rank_id && $deleteUser->badminton_rank_id) {
                $keepUser->badminton_rank_id = $deleteUser->badminton_rank_id;
            }

            $keepUser->save();

            // Move linked_accounts
            LinkedAccount::where('user_id', $deleteId)->update(['user_id' => $keepId]);

            // Move party_members (skip duplicates)
            $keepPartyIds = DB::table('party_members')->where('user_id', $keepId)->pluck('party_id');
            DB::table('party_members')->where('user_id', $deleteId)
                ->whereNotIn('party_id', $keepPartyIds)
                ->update(['user_id' => $keepId]);
            DB::table('party_members')->where('user_id', $deleteId)->delete(); // cleanup duplicates

            // Move game_players (skip duplicates)
            $keepGameIds = DB::table('game_players')->where('user_id', $keepId)->pluck('game_id');
            DB::table('game_players')->where('user_id', $deleteId)
                ->whereNotIn('game_id', $keepGameIds)
                ->update(['user_id' => $keepId]);
            DB::table('game_players')->where('user_id', $deleteId)->delete();

            // Move friendships (delete self-referencing)
            DB::table('friendships')
                ->where(function ($q) use ($keepId, $deleteId) {
                    $q->where('sender_id', $keepId)->where('receiver_id', $deleteId);
                })
                ->orWhere(function ($q) use ($keepId, $deleteId) {
                    $q->where('sender_id', $deleteId)->where('receiver_id', $keepId);
                })
                ->delete();

            DB::table('friendships')->where('sender_id', $deleteId)->update(['sender_id' => $keepId]);
            DB::table('friendships')->where('receiver_id', $deleteId)->update(['receiver_id' => $keepId]);

            // Move chat_participants (skip duplicates)
            $keepChatIds = DB::table('chat_participants')->where('user_id', $keepId)->pluck('chat_id');
            DB::table('chat_participants')->where('user_id', $deleteId)
                ->whereNotIn('chat_id', $keepChatIds)
                ->update(['user_id' => $keepId]);
            DB::table('chat_participants')->where('user_id', $deleteId)->delete();

            // Move messages
            DB::table('messages')->where('sender_id', $deleteId)->update(['sender_id' => $keepId]);

            // Move other tables
            DB::table('skill_assessments')->where('user_id', $deleteId)->update(['user_id' => $keepId]);
            DB::table('mmr_history')->where('user_id', $deleteId)->update(['user_id' => $keepId]);
            DB::table('level_up_notifications')->where('user_id', $deleteId)->update(['user_id' => $keepId]);
            DB::table('feedbacks')->where('user_id', $deleteId)->update(['user_id' => $keepId]);

            // Notification settings — keep keepUser's, delete deleteUser's
            DB::table('notification_settings')->where('user_id', $deleteId)->delete();
            DB::table('notification_logs')->where('user_id', $deleteId)->update(['user_id' => $keepId]);

            // Verification codes
            DB::table('verification_codes')->where('user_id', $deleteId)->delete();

            // Access tokens
            DB::table('personal_access_tokens')
                ->where('tokenable_type', 'App\\Models\\User')
                ->where('tokenable_id', $deleteId)
                ->delete();

            // Delete old user
            $deleteUser->delete();
        });
    }
}
