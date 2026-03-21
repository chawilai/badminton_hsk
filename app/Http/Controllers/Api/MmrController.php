<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MmrLevelResource;
use App\Http\Resources\UserResource;
use App\Models\MmrLevel;
use App\Services\MmrService;
use Illuminate\Http\Request;

class MmrController extends Controller
{
    public function showAssessment(Request $request)
    {
        $levels = MmrLevel::orderBy('level')->get();

        return response()->json([
            'levels' => MmrLevelResource::collection($levels),
            'user' => new UserResource($request->user()),
        ]);
    }

    public function submitAssessment(Request $request)
    {
        $validated = $request->validate([
            'answers' => 'required|array',
        ]);

        $mmr = MmrService::calculateInitialMmr($validated['answers']);
        $user = $request->user();
        $user->update([
            'mmr' => $mmr,
            'mmr_quiz_completed' => true,
        ]);

        return response()->json([
            'message' => 'ประเมิน MMR เรียบร้อย',
            'mmr' => $mmr,
            'mmr_level' => $user->mmrLevel() ? new MmrLevelResource($user->mmrLevel()) : null,
        ]);
    }

    public function showResult(Request $request)
    {
        $user = $request->user();
        $mmrLevel = $user->mmrLevel();

        return response()->json([
            'user' => new UserResource($user),
            'mmr_level' => $mmrLevel ? new MmrLevelResource($mmrLevel) : null,
        ]);
    }
}
