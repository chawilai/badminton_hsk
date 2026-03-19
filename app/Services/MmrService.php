<?php

namespace App\Services;

use App\Models\Game;
use App\Models\LevelUpNotification;
use App\Models\MmrHistory;
use App\Models\MmrLevel;
use App\Models\User;

class MmrService
{
    /**
     * Quiz question weights: Q1=1.0, Q2=0.8, Q3=0.7, Q4=0.8, Q5=0.7, Q6=1.0, Q7=0.5
     */
    private const QUIZ_WEIGHTS = [1.0, 0.8, 0.7, 0.8, 0.7, 1.0, 0.5];

    /**
     * Calculate starting MMR from quiz answers.
     *
     * @param array $answers Array of 7 integers (0-10)
     * @return int Starting MMR (200-2200)
     */
    public static function calculateStartingMmr(array $answers): int
    {
        $weightedSum = 0;

        foreach ($answers as $index => $answer) {
            $weight = self::QUIZ_WEIGHTS[$index] ?? 0;
            $weightedSum += $answer * $weight;
        }

        // Max possible weighted sum: 10 * (1.0 + 0.8 + 0.7 + 0.8 + 0.7 + 1.0 + 0.5) = 55.0
        $normalized = $weightedSum / 55.0;
        $startingMmr = (int) round(200 + $normalized * 2000);

        return max(200, min(2200, $startingMmr));
    }

    /**
     * Adjust MMR for all players after a game finishes.
     *
     * Enhanced ELO with:
     * - Score margin bonus (ชนะขาด = ได้เยอะ)
     * - Win streak bonus (smurf detection - ชนะรัวๆ ขึ้นไว)
     * - Dynamic K-factor (calibration → stable)
     * - Upset bonus (ชนะคนเก่งกว่า = ได้เยอะ)
     *
     * @param Game $game
     * @return void
     */
    public static function adjustMmr(Game $game): void
    {
        $game->load('gamePlayers.user', 'gameSets');

        // Get players grouped by team
        $team1Players = $game->gamePlayers->where('team', 'team1');
        $team2Players = $game->gamePlayers->where('team', 'team2');

        if ($team1Players->isEmpty() || $team2Players->isEmpty()) {
            return;
        }

        // Calculate team average MMR
        $team1AvgMmr = (int) round($team1Players->avg(fn($gp) => $gp->user->mmr));
        $team2AvgMmr = (int) round($team2Players->avg(fn($gp) => $gp->user->mmr));

        // Determine winner from game sets
        $team1Wins = $game->gameSets->where('winning_team', 'team1')->count();
        $team2Wins = $game->gameSets->where('winning_team', 'team2')->count();

        // Calculate score margin (how dominant the win was)
        $scoreMargin = self::calculateScoreMargin($game);

        // Determine result for each team
        if ($team1Wins > $team2Wins) {
            $team1Result = 'win';
            $team2Result = 'loss';
            $team1Score = 1.0;
            $team2Score = 0.0;
        } elseif ($team2Wins > $team1Wins) {
            $team1Result = 'loss';
            $team2Result = 'win';
            $team1Score = 0.0;
            $team2Score = 1.0;
        } else {
            $team1Result = 'draw';
            $team2Result = 'draw';
            $team1Score = 0.5;
            $team2Score = 0.5;
        }

        // ELO expected score calculation
        $expectedTeam1 = 1.0 / (1.0 + pow(10, ($team2AvgMmr - $team1AvgMmr) / 400.0));
        $expectedTeam2 = 1.0 - $expectedTeam1;

        // Process team 1 players
        foreach ($team1Players as $gamePlayer) {
            self::updatePlayerMmr(
                $gamePlayer->user, $game,
                $team1Score, $expectedTeam1, $team1Result,
                $team1AvgMmr, $team2AvgMmr, $scoreMargin
            );
        }

        // Process team 2 players
        foreach ($team2Players as $gamePlayer) {
            self::updatePlayerMmr(
                $gamePlayer->user, $game,
                $team2Score, $expectedTeam2, $team2Result,
                $team2AvgMmr, $team1AvgMmr, $scoreMargin
            );
        }
    }

    /**
     * Calculate score margin multiplier from game sets.
     *
     * Examples:
     *   21-5  → margin ~0.76 → multiplier ~1.38
     *   21-19 → margin ~0.05 → multiplier ~1.02
     *   21-15 → margin ~0.29 → multiplier ~1.14
     *
     * @return float Score margin ratio (0.0 - 1.0)
     */
    private static function calculateScoreMargin(Game $game): float
    {
        $totalMargin = 0;
        $setCount = 0;

        foreach ($game->gameSets as $set) {
            if ($set->winning_team) {
                $diff = abs($set->team1_score - $set->team2_score);
                $maxScore = max($set->team1_score, $set->team2_score, 1);
                $totalMargin += $diff / $maxScore;
                $setCount++;
            }
        }

        return $setCount > 0 ? $totalMargin / $setCount : 0.0;
    }

    /**
     * Get dynamic K-factor based on player experience.
     *
     * Calibration (0-10 games):  K = 50  → ขึ้น/ลงเร็ว หา rank ที่เหมาะสม
     * Early (11-30 games):       K = 35  → ยังปรับได้
     * Stable (31+ games):        K = 25  → ค่อยๆ ปรับ
     */
    private static function getKFactor(User $user): int
    {
        $gamesPlayed = $user->mmr_games_played;

        if ($gamesPlayed <= 10) return 50;  // Calibration
        if ($gamesPlayed <= 30) return 35;  // Early
        return 25;                           // Stable
    }

    /**
     * Get win streak bonus multiplier.
     *
     * 3 wins in a row: 1.1x
     * 5 wins in a row: 1.2x
     * 7+ wins in a row: 1.3x (smurf = ขึ้นเร็วมาก)
     */
    private static function getStreakMultiplier(User $user): float
    {
        $recentResults = MmrHistory::where('user_id', $user->id)
            ->orderByDesc('id')
            ->limit(7)
            ->pluck('result')
            ->toArray();

        $streak = 0;
        foreach ($recentResults as $result) {
            if ($result === 'win') {
                $streak++;
            } else {
                break;
            }
        }

        if ($streak >= 7) return 1.3;
        if ($streak >= 5) return 1.2;
        if ($streak >= 3) return 1.1;
        return 1.0;
    }

    /**
     * Update a single player's MMR after a game.
     *
     * Formula:
     *   base_change = K × (actual - expected)           ← ELO พื้นฐาน
     *   margin_mult = 1.0 + (scoreMargin × 0.5)         ← ชนะขาด = ได้เยอะ
     *   streak_mult = 1.0 ~ 1.3                          ← ชนะรัวๆ = smurf detection
     *   final_change = base_change × margin_mult × streak_mult
     *
     * ตัวอย่าง:
     *   ชนะคนเก่งกว่า 200 MMR, สกอร์ 21-5, streak 5 เกม:
     *     expected ≈ 0.24 → base = 50 × (1.0 - 0.24) = +38
     *     margin = 1.38 → streak = 1.2
     *     final = 38 × 1.38 × 1.2 = +63 MMR!
     *
     *   ชนะคนอ่อนกว่า 200 MMR, สกอร์ 21-19:
     *     expected ≈ 0.76 → base = 25 × (1.0 - 0.76) = +6
     *     margin = 1.02 → streak = 1.0
     *     final = 6 × 1.02 × 1.0 = +6 MMR (แทบไม่ขึ้น)
     *
     *   แพ้คนอ่อนกว่า 200 MMR:
     *     expected ≈ 0.76 → base = 25 × (0.0 - 0.76) = -19 MMR (เสียเยอะ!)
     */
    private static function updatePlayerMmr(
        User $user,
        Game $game,
        float $actualScore,
        float $expectedScore,
        string $result,
        int $teamAvgMmr,
        int $opponentAvgMmr,
        float $scoreMargin
    ): void {
        $kFactor = self::getKFactor($user);
        $isCalibration = $user->mmr_games_played < 10;

        // Base ELO change
        $baseChange = $kFactor * ($actualScore - $expectedScore);

        // Score margin multiplier (only boost wins, not losses)
        $marginMultiplier = 1.0;
        if ($result === 'win') {
            $marginMultiplier = 1.0 + ($scoreMargin * 0.5);
        }

        // Streak multiplier (only for wins)
        $streakMultiplier = 1.0;
        if ($result === 'win') {
            $streakMultiplier = self::getStreakMultiplier($user);
        }

        // Final change
        $mmrBefore = $user->mmr;
        $mmrChange = (int) round($baseChange * $marginMultiplier * $streakMultiplier);
        $mmrAfter = max(0, min(3000, $mmrBefore + $mmrChange));

        // Create history record
        MmrHistory::create([
            'user_id' => $user->id,
            'game_id' => $game->id,
            'mmr_before' => $mmrBefore,
            'mmr_after' => $mmrAfter,
            'mmr_change' => $mmrChange,
            'result' => $result,
            'team_avg_mmr' => $teamAvgMmr,
            'opponent_avg_mmr' => $opponentAvgMmr,
            'is_calibration' => $isCalibration,
        ]);

        // Check level change before updating
        $oldLevel = self::getLevelForMmr($mmrBefore);
        $newLevel = self::getLevelForMmr($mmrAfter);

        // Update user
        $user->update([
            'mmr' => $mmrAfter,
            'mmr_games_played' => $user->mmr_games_played + 1,
            'mmr_calibrated' => ($user->mmr_games_played + 1) >= 10 ? true : $user->mmr_calibrated,
        ]);

        // Create level up/down notification if level changed
        if ($oldLevel && $newLevel && $oldLevel->level !== $newLevel->level) {
            LevelUpNotification::create([
                'user_id' => $user->id,
                'old_level' => $oldLevel->level,
                'new_level' => $newLevel->level,
                'old_tier_th' => $oldLevel->name_th,
                'new_tier_th' => $newLevel->name_th,
                'new_tier_color' => $newLevel->tier_color,
                'mmr_before' => $mmrBefore,
                'mmr_after' => $mmrAfter,
            ]);
        }
    }

    /**
     * Get the MmrLevel for a given MMR value.
     */
    public static function getLevelForMmr(int $mmr): ?MmrLevel
    {
        return MmrLevel::where('min_mmr', '<=', $mmr)
            ->where('max_mmr', '>=', $mmr)
            ->first();
    }
}
