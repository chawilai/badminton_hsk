<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AccountLinkingService;
use Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class SocialController extends Controller
{
    protected AccountLinkingService $linkingService;

    public function __construct()
    {
        $this->linkingService = new AccountLinkingService();
    }

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

    /**
     * Find or create user from social login (used by both web and API).
     */
    public function findOrCreateUser($socialUser, $provider)
    {
        return $this->linkingService->findOrCreateUserFromSocial($socialUser, $provider);
    }

    /**
     * Handle LINE LIFF login (used by both web and API).
     */
    public function checkLineLiff(Request $request)
    {
        $providerId = $request->input('userId');
        $provider = $request->input('provider', 'line');
        $email = $request->input('email');
        $displayName = $request->input('displayName');
        $pictureUrl = $request->input('pictureUrl');

        return $this->linkingService->findOrCreateUserFromLiff(
            $providerId, $provider, $email, $displayName, $pictureUrl
        );
    }

    public function handleLineLiffLogin(Request $request)
    {
        $authUser = $this->checkLineLiff($request);
        Auth::login($authUser, true);

        return redirect()->intended('/party-lists');
    }
}
