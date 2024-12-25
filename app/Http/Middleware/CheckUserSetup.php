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

        // Check if the user is logged in and has missing personal data
        // if ($user && (!$user->badminton_rank_id || !$user->gender || !$user->date_of_birth)) {
        if ($user && (!$user->badminton_rank_id)) {
            // Redirect to the first setup page
            return redirect()->route('user.setup');
        }

        return $next($request);
    }
}
