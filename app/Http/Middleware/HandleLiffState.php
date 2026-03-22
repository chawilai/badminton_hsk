<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleLiffState
{
    /**
     * Handle liff.state query parameter from LINE LIFF redirects.
     *
     * PHP converts dots in query param names to underscores,
     * so liff.state becomes liff_state. We check both the raw
     * query string and the PHP-parsed version.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // PHP converts "liff.state" to "liff_state" automatically
        $liffState = $request->query('liff_state');

        // Also check raw query string for liff.state (in case of edge cases)
        if (!$liffState) {
            $rawQuery = $request->server('QUERY_STRING', '');
            if (preg_match('/liff\.state=([^&]+)/', $rawQuery, $matches)) {
                $liffState = urldecode($matches[1]);
            }
        }

        if ($liffState) {
            $path = urldecode($liffState);

            // Ensure path starts with /
            if (!str_starts_with($path, '/')) {
                $path = '/' . $path;
            }

            // If we're already on the correct path, strip liff.state and continue
            if ($request->getPathInfo() === $path) {
                return redirect($path);
            }

            // Redirect to the path specified in liff.state
            return redirect($path);
        }

        return $next($request);
    }
}
