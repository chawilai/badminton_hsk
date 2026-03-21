<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\BadmintonRank;
use App\Models\LevelUpNotification;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Check user setup status.
     */
    public function setupStatus(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'pdpa_consented' => (bool) $user->pdpa_consented_at,
            'setup_completed' => (bool) $user->badminton_rank_id,
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Accept PDPA consent.
     */
    public function acceptPdpaConsent(Request $request)
    {
        $user = $request->user();
        $user->update(['pdpa_consented_at' => now()]);

        return response()->json([
            'message' => 'ยอมรับนโยบายความเป็นส่วนตัวแล้ว',
            'user' => new UserResource($user->fresh()),
        ]);
    }

    /**
     * Update user setup (rank, gender, date of birth).
     */
    public function updateSetup(Request $request)
    {
        $request->validate([
            'badminton_rank_id' => 'required|exists:badminton_ranks,id',
            'gender' => 'nullable|string|in:male,female,other',
            'date_of_birth' => 'nullable|date',
        ]);

        $user = $request->user();
        $user->update($request->only(['badminton_rank_id', 'gender', 'date_of_birth']));

        return response()->json([
            'message' => 'ตั้งค่าโปรไฟล์แล้ว',
            'user' => new UserResource($user->fresh()),
        ]);
    }

    /**
     * Mark level-up notification as seen.
     */
    public function levelUpSeen(Request $request, $id)
    {
        LevelUpNotification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->update(['is_seen' => true]);

        return response()->json(['message' => 'ok']);
    }

    /**
     * Thai address autocomplete.
     */
    public function thaiAddressSearch(Request $request)
    {
        $q = $request->input('q', '');
        if (mb_strlen($q) < 2) {
            return response()->json([]);
        }

        return \Illuminate\Support\Facades\DB::table('thai_address')
            ->where('district', 'LIKE', "%{$q}%")
            ->orWhere('amphoe', 'LIKE', "%{$q}%")
            ->orWhere('province', 'LIKE', "%{$q}%")
            ->limit(20)
            ->get(['district', 'amphoe', 'province', 'zipcode']);
    }
}
