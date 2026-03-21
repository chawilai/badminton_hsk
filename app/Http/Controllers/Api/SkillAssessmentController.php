<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkillAssessmentResource;
use App\Models\SkillAssessment;
use Illuminate\Http\Request;

class SkillAssessmentController extends Controller
{
    public function show(Request $request)
    {
        $assessment = $request->user()->latestSkillAssessment;

        return response()->json([
            'assessment' => $assessment ? new SkillAssessmentResource($assessment) : null,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'serve' => 'required|integer|min:1|max:10',
            'smash' => 'required|integer|min:1|max:10',
            'clear' => 'required|integer|min:1|max:10',
            'net_play' => 'required|integer|min:1|max:10',
            'defense' => 'required|integer|min:1|max:10',
            'backhand' => 'required|integer|min:1|max:10',
            'deception' => 'required|integer|min:1|max:10',
            'footwork' => 'required|integer|min:1|max:10',
            'speed' => 'required|integer|min:1|max:10',
            'stamina' => 'required|integer|min:1|max:10',
        ]);

        $assessment = SkillAssessment::updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

        return response()->json([
            'message' => 'บันทึกผลประเมินทักษะเรียบร้อย',
            'assessment' => new SkillAssessmentResource($assessment),
        ]);
    }
}
