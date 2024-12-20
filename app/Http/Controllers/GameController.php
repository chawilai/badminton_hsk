<?php

namespace App\Http\Controllers;

use App\Models\ChineseWord;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function getWords()
    {
        $words = ChineseWord::all();
        return response()->json($words);
    }

    public function updateProgress(Request $request)
    {
        $user = Auth::user();
        $wordId = $request->input('word_id');
        $isCorrect = $request->input('is_correct');

        $userWord = UserWord::firstOrNew(['user_id' => $user->id, 'word_id' => $wordId]);

        // Initialize recent_attempts if not set
        if (!$userWord->recent_attempts) {
            $userWord->recent_attempts = [];
        }

        // Add the new attempt to the recent_attempts array
        $attempts = $userWord->recent_attempts;
        array_push($attempts, $isCorrect);

        // Keep only the last 5 attempts
        if (count($attempts) > 5) {
            array_shift($attempts);
        }

        $userWord->recent_attempts = $attempts;
        $userWord->status = $this->determineStatus($attempts);
        $userWord->save();

        // Add experience points for correct answers
        if ($isCorrect) {
            $user->addExperience(10, 'Learned a new word');
        }

        return response()->json(['message' => 'Progress updated']);
    }

    private function determineStatus($attempts)
    {
        $correctCount = array_sum($attempts);
        $totalAttempts = count($attempts);
        $accuracy = $correctCount / $totalAttempts;

        if ($accuracy == 1) {
            return 'learned';
        } elseif ($accuracy > 0.75) {
            return 'almost remember';
        } elseif ($accuracy >= 0.5) {
            return 'use to it';
        } else {
            return 'do not know yet';
        }
    }
}
