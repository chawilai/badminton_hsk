<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class SocialController extends Controller
{
    public function redirectToProvider($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function handleProviderCallback($provider)
    {
        $socialUser = Socialite::driver($provider)->stateless()->user();
        $authUser = $this->findOrCreateUser($socialUser, $provider);
        Auth::login($authUser, true);

        return redirect()->intended('/party-lists');
    }

    public function findOrCreateUser($socialUser, $provider)
    {
        // First, check if the user exists by provider ID and provider
        $authUser = User::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($authUser) {
            // User found, return this user
            return $authUser;
        }

        // If not found by provider_id, check by email if available
        if ($email = $socialUser->getEmail()) {
            $authUser = User::where('email', $email)->first();
            if ($authUser) {
                // Update provider details if not already set
                if (!$authUser->provider || !$authUser->provider_id) {
                    $authUser->update([
                        'provider' => $provider,
                        'provider_id' => $socialUser->getId(),
                        'avatar' => $socialUser->getAvatar(),
                        'profile_picture' => $socialUser->getAvatar(),
                    ]);
                }
                return $authUser;
            }
        }

        $randomRank = \DB::table('badminton_ranks')->inRandomOrder()->value('id');

        // If the user does not exist by provider ID or email, create a new user
        $newUser = User::create([
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail() ?? Str::random(10) . '@example.com', // Handle case where email is not provided
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
            'profile_picture' => $socialUser->getAvatar(),
            'password' => Hash::make(Str::random(10)), // Set a random password
            'badminton_rank_id' => $randomRank, // Assign a random rank
        ]);

        // \DB::table('party_members')->insert([
        //     'user_id' => $newUser->id,
        //     'party_id' => 2,
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);

        return $newUser;
    }

    public function checkLineLiff(Request $request)
    {
        // Access data safely
        $providerId = $request->input('userId');
        $provider = $request->input('provider');
        $email = $request->input('email');
        $displayName = $request->input('displayName');
        $pictureUrl = $request->input('pictureUrl');

        // First, check if the user exists by provider ID and provider
        $authUser = User::where('provider', $provider)
            ->where('provider_id', $providerId)
            ->first();

        if ($authUser) {
            return $authUser;
        }

        // If not found by provider_id, check by email if available
        if ($email) {
            $authUser = User::where('email', $email)->first();
            if ($authUser) {
                // Update provider details if not already set
                if (!$authUser->provider || !$authUser->provider_id) {
                    $authUser->update([
                        'provider' => $provider,
                        'provider_id' => $providerId,
                        'avatar' => $pictureUrl,
                        'profile_picture' => $pictureUrl,
                        'provider_name' => $displayName,
                    ]);
                }
                return $authUser;
            }
        }

        $randomRank = \DB::table('badminton_ranks')->inRandomOrder()->value('id');

        // Create a new user if none exists
        $newUser = User::create([
            'name' => $displayName,
            'email' => $email ?? Str::random(10) . '@example.com', // Provide a fallback for missing email
            'provider' => $provider,
            'provider_id' => $providerId,
            'avatar' => $pictureUrl,
            'profile_picture' => $pictureUrl,
            'provider_name' => $displayName,
            'password' => Hash::make(Str::random(10)), // Securely hashing a random password
            'badminton_rank_id' => $randomRank, // Assign a random rank
        ]);

        // \DB::table('party_members')->insert([
        //     'user_id' => $newUser->id,
        //     'party_id' => 2,
        //     'created_at' => now(),
        //     'updated_at' => now(),
        // ]);

        return $newUser;
    }

    public function handleLineLiffLogin(Request $request)
    {
        $authUser = $this->checkLineLiff($request);
        Auth::login($authUser, true); // Login the user and "remember" them

        return redirect()->intended('/party-lists');
    }
}
