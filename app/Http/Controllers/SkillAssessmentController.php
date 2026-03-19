<?php

namespace App\Http\Controllers;

use App\Models\SkillAssessment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillAssessmentController extends Controller
{
    private const SKILL_KEYS = [
        'serve', 'smash', 'clear', 'net_play', 'defense',
        'backhand', 'deception', 'footwork', 'speed', 'stamina',
    ];

    public function show(Request $request)
    {
        $existing = SkillAssessment::where('user_id', $request->user()->id)
            ->latest()
            ->first();

        return Inertia::render('SkillAssessment', [
            'existingSkills' => $existing?->skills,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [];
        foreach (self::SKILL_KEYS as $key) {
            $rules["skills.{$key}"] = 'required|integer|min:1|max:10';
        }
        $rules['skills'] = 'required|array|size:10';

        $validated = $request->validate($rules);

        SkillAssessment::create([
            'user_id' => $request->user()->id,
            'skills' => $validated['skills'],
        ]);

        return redirect('/profile')->with('success', 'บันทึกผลประเมินทักษะเรียบร้อย');
    }
}
