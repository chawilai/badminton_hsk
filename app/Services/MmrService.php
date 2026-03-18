<?php

namespace App\Services;

use App\Models\Game;
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

        // Max possible weighted sum: 10 * (1.0 + 0.8 + 0.7 + 0.8 + 0.7 + 1.0 + 0.5) = 10 * 5.5 = 55.0
        $normalized = $weightedSum / 55.0;
        $startingMmr = (int) round(200 + $normalized * 2000);

        return max(200, min(2200, $startingMmr));
    }

    /**
     * Adjust MMR for all players after a game finishes.
     * Uses ELO-style calculation.
     *
     * K-factor: 50 if games_played <= 10, else 25.
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
                $gamePlayer->user,
                $game,
                $team1Score,
                $expectedTeam1,
                $team1Result,
                $team1AvgMmr,
                $team2AvgMmr
            );
        }

        // Process team 2 players
        foreach ($team2Players as $gamePlayer) {
            self::updatePlayerMmr(
                $gamePlayer->user,
                $game,
                $team2Score,
                $expectedTeam2,
                $team2Result,
                $team2AvgMmr,
                $team1AvgMmr
            );
        }
    }

    /**
     * Update a single player's MMR after a game.
     */
    private static function updatePlayerMmr(
        User $user,
        Game $game,
        float $actualScore,
        float $expectedScore,
        string $result,
        int $teamAvgMmr,
        int $opponentAvgMmr
    ): void {
        $kFactor = $user->mmr_games_played <= 10 ? 50 : 25;
        $isCalibration = $user->mmr_games_played < 10;

        $mmrBefore = $user->mmr;
        $mmrChange = (int) round($kFactor * ($actualScore - $expectedScore));
        $mmrAfter = max(0, $mmrBefore + $mmrChange);

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

        // Update user
        $user->update([
            'mmr' => $mmrAfter,
            'mmr_games_played' => $user->mmr_games_played + 1,
            'mmr_calibrated' => ($user->mmr_games_played + 1) >= 10 ? true : $user->mmr_calibrated,
        ]);
    }

    /**
     * Get the MmrLevel for a given MMR value.
     *
     * @param int $mmr
     * @return MmrLevel|null
     */
    public static function getLevelForMmr(int $mmr): ?MmrLevel
    {
        return MmrLevel::where('min_mmr', '<=', $mmr)
            ->where('max_mmr', '>=', $mmr)
            ->first();
    }
}
