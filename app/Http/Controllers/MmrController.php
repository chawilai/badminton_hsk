<?php

namespace App\Http\Controllers;

use App\Models\MmrAssessment;
use App\Models\MmrLevel;
use App\Services\MmrService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MmrController extends Controller
{
    /**
     * Show the MMR assessment quiz page.
     */
    public function showAssessment()
    {
        $mmrLevels = MmrLevel::orderBy('level')->get();

        return Inertia::render('MmrAssessment', [
            'mmr_levels' => $mmrLevels,
        ]);
    }

    /**
     * Submit the MMR assessment quiz answers.
     */
    public function submitAssessment(Request $request)
    {
        $validated = $request->validate([
            'answers' => 'required|array|size:7',
            'answers.*' => 'required|integer|min:0|max:10',
        ]);

        $answers = $validated['answers'];
        $startingMmr = MmrService::calculateStartingMmr($answers);

        // Calculate raw score (sum of all answers)
        $rawScore = array_sum($answers);

        // Save assessment
        MmrAssessment::create([
            'user_id' => auth()->id(),
            'answers' => $answers,
            'raw_score' => $rawScore,
            'starting_mmr' => $startingMmr,
        ]);

        // Update user
        $user = auth()->user();
        $user->update([
            'mmr' => $startingMmr,
            'mmr_quiz_completed' => true,
        ]);

        return redirect('/mmr-result');
    }

    /**
     * Show the MMR result page after assessment.
     */
    public function showResult()
    {
        $user = auth()->user();
        $level = MmrService::getLevelForMmr($user->mmr);

        // Fallback if level not found
        if (!$level) {
            $level = (object) [
                'level' => max(1, (int) floor($user->mmr / 100) + 1),
                'name_th' => 'ระดับ ' . max(1, (int) floor($user->mmr / 100) + 1),
                'name_en' => 'Level ' . max(1, (int) floor($user->mmr / 100) + 1),
                'tier_th' => 'ไม่ระบุ',
                'tier_en' => 'Unranked',
                'tier_color' => '#A0AEC0',
                'min_mmr' => 0,
                'max_mmr' => 3000,
            ];
        }

        return Inertia::render('MmrResult', [
            'mmr' => $user->mmr,
            'level' => $level,
            'mmr_games_played' => $user->mmr_games_played,
            'mmr_calibrated' => $user->mmr_calibrated,
        ]);
    }
}
