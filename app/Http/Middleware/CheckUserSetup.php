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
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

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
}
