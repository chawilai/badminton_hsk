<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserSetup
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    protected $except = [
        'pdpa-consent',
        'setup',
        'login',
        'login/*',
        'logout',
        'register',
    ];

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Skip for excluded paths
        if ($this->shouldSkip($request)) {
            return $next($request);
        }

        if ($user) {
            // Check PDPA consent first
            if (!$user->pdpa_consented_at) {
                return redirect()->route('pdpa.consent');
            }

            // Then check setup
            if (!$user->badminton_rank_id) {
                return redirect()->route('user.setup');
            }
        }

        return $next($request);
    }

    protected function shouldSkip(Request $request): bool
    {
        foreach ($this->except as $pattern) {
            if ($request->is($pattern)) {
                return true;
            }
        }

        return false;
    }
}
