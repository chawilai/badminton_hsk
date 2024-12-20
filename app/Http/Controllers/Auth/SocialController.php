<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
        return redirect()->route('home');
    }

    public function findOrCreateUser($socialUser, $provider)
    {
        // Check if the user already exists by email
        $authUser = User::where('email', $socialUser->getEmail())->first();

        if ($authUser) {
            // If the user already exists, you may want to update the provider and provider_id
            // or handle the scenario as needed.
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

        // If the user does not exist, create a new user
        return User::create([
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail() ?? Str::random(10) . '@example.com',
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'avatar' => $socialUser->getAvatar(),
            'profile_picture' => $socialUser->getAvatar(),
            'password' => Hash::make(Str::random(10)), // You might want to set a random password
        ]);
    }
}
