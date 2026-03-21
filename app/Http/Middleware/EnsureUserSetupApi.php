<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserSetupApi
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user) {
            if (!$user->pdpa_consented_at) {
                return response()->json([
                    'error' => 'pdpa_consent_required',
                    'message' => 'กรุณายอมรับนโยบายความเป็นส่วนตัว',
                ], 403);
            }

            if (!$user->badminton_rank_id) {
                return response()->json([
                    'error' => 'setup_required',
                    'message' => 'กรุณาตั้งค่าโปรไฟล์ก่อนใช้งาน',
                ], 403);
            }
        }

        return $next($request);
    }
}
