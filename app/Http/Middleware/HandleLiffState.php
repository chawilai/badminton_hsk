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
     * When LIFF opens a URL like https://liff.line.me/{LIFF_ID}/some-path,
     * LINE redirects to the endpoint URL with ?liff.state=%2Fsome-path.
     * This middleware extracts the path and redirects to the correct page.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $liffState = $request->query('liff.state');

        if ($liffState) {
            $path = urldecode($liffState);

            // Ensure path starts with /
            if (!str_starts_with($path, '/')) {
                $path = '/' . $path;
            }

            // If we're already on the correct path, strip liff.state and continue
            if ($request->getPathInfo() === $path) {
                // Remove liff.state from query and redirect clean
                $query = $request->query();
                unset($query['liff_state'], $query['liff.state']);

                if (empty($query)) {
                    return redirect($path);
                }

                return redirect($path . '?' . http_build_query($query));
            }

            // Redirect to the path specified in liff.state
            $query = $request->query();
            unset($query['liff_state'], $query['liff.state']);

            $url = $path;
            if (!empty($query)) {
                $url .= '?' . http_build_query($query);
            }

            return redirect($url);
        }

        return $next($request);
    }
}
