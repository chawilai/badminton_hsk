<?php

namespace App\Services;

use App\Models\Party;

class PartyCostService
{
    /**
     * Calculate cost summary for a party.
     */
    public static function calculate(Party $party): array
    {
        $party->loadMissing(['members.user', 'games.shuttlecocks', 'games.gameSets', 'games.gamePlayers.user', 'court']);

        $memberCount = $party->members->count();
        if ($memberCount === 0) $memberCount = 1;

        // Shuttlecock calculation
        $totalShuttlecocks = 0;
        foreach ($party->games as $game) {
            foreach ($game->shuttlecocks as $sc) {
                $totalShuttlecocks += $sc->quantity; // initial/additional positive, returned negative
            }
        }
        $shuttlecockUsed = max(0, $totalShuttlecocks);

        // Court cost
        $courtCostTotal = 0;
        $playHours = $party->play_hours ?: 0;
        $courtPricePerHour = $party->court?->play_price ?? 0;

        // Cost calculation based on cost_type
        $costType = $party->cost_type ?? 'free';
        $shuttlecockCostPerUnit = $party->shuttlecock_cost ?? 0;
        $shuttlecockCostTotal = $shuttlecockCostPerUnit * $shuttlecockUsed;

        $perPerson = 0;
        $totalCost = 0;

        switch ($costType) {
            case 'per_person':
                // Fixed entry fee per person + shuttlecock split
                $perPerson = ($party->cost_amount ?? 0) + ($shuttlecockCostTotal / $memberCount);
                $totalCost = $perPerson * $memberCount;
                break;

            case 'split_equal':
                // Court cost + shuttlecock cost, split equally
                $courtCostTotal = ($party->cost_amount ?? $courtPricePerHour) * $playHours;
                $totalCost = $courtCostTotal + $shuttlecockCostTotal;
                $perPerson = $totalCost / $memberCount;
                break;

            case 'free':
            default:
                $totalCost = 0;
                $perPerson = 0;
                break;
        }

        // Game results summary
        $finishedGames = $party->games->where('status', 'finished');
        $gameResults = [];
        foreach ($finishedGames as $game) {
            $t1Wins = $game->gameSets->where('winning_team', 'team1')->count();
            $t2Wins = $game->gameSets->where('winning_team', 'team2')->count();
            $winner = $t1Wins > $t2Wins ? 'team1' : ($t2Wins > $t1Wins ? 'team2' : null);

            $team1 = $game->gamePlayers->where('team', 'team1')->pluck('user.name')->filter()->join(', ');
            $team2 = $game->gamePlayers->where('team', 'team2')->pluck('user.name')->filter()->join(', ');

            $scores = $game->gameSets->map(fn($s) => "{$s->team1_score}-{$s->team2_score}")->join(', ');

            $gameResults[] = [
                'game_id' => $game->id,
                'team1' => $team1,
                'team2' => $team2,
                'scores' => $scores,
                'winner' => $winner,
                'winner_names' => $winner ? ($winner === 'team1' ? $team1 : $team2) : null,
            ];
        }

        // Player stats
        $playerStats = [];
        foreach ($party->members as $member) {
            $userId = $member->user_id;
            $wins = 0;
            $losses = 0;

            foreach ($finishedGames as $game) {
                $gp = $game->gamePlayers->firstWhere('user_id', $userId);
                if (!$gp) continue;

                $t1Wins = $game->gameSets->where('winning_team', 'team1')->count();
                $t2Wins = $game->gameSets->where('winning_team', 'team2')->count();
                $winner = $t1Wins > $t2Wins ? 'team1' : ($t2Wins > $t1Wins ? 'team2' : null);

                if ($winner === $gp->team) $wins++;
                elseif ($winner) $losses++;
            }

            $playerStats[] = [
                'user_id' => $userId,
                'name' => $member->display_name ?: $member->user?->name,
                'games' => $wins + $losses,
                'wins' => $wins,
                'losses' => $losses,
            ];
        }

        // Sort by wins desc
        usort($playerStats, fn($a, $b) => $b['wins'] <=> $a['wins']);

        return [
            'cost_type' => $costType,
            'court_name' => $party->court?->name ?? '-',
            'play_hours' => $playHours,
            'member_count' => $memberCount,
            'court_cost_total' => round($courtCostTotal, 2),
            'shuttlecock_used' => $shuttlecockUsed,
            'shuttlecock_cost_per_unit' => $shuttlecockCostPerUnit,
            'shuttlecock_cost_total' => round($shuttlecockCostTotal, 2),
            'total_cost' => round($totalCost, 2),
            'per_person' => round($perPerson, 2),
            'total_games' => $finishedGames->count(),
            'game_results' => $gameResults,
            'player_stats' => $playerStats,
        ];
    }

    /**
     * Build a LINE push message from cost summary.
     */
    public static function buildSummaryMessage(Party $party, array $summary): string
    {
        $partyName = $party->name ?: $party->court?->name ?: 'Party';
        $lines = [];

        $lines[] = "สนาม: {$summary['court_name']}";
        $lines[] = "เล่น: {$summary['play_hours']} ชม. · {$summary['member_count']} คน";
        $lines[] = "เกมทั้งหมด: {$summary['total_games']} เกม";

        // Top players
        if (!empty($summary['player_stats'])) {
            $lines[] = "";
            $top3 = array_slice($summary['player_stats'], 0, 3);
            $medals = ['🥇', '🥈', '🥉'];
            foreach ($top3 as $i => $ps) {
                if ($ps['games'] > 0) {
                    $medal = $medals[$i] ?? '';
                    $lines[] = "{$medal} {$ps['name']}: {$ps['wins']}W/{$ps['losses']}L";
                }
            }
        }

        // Cost
        if ($summary['cost_type'] !== 'free' && $summary['per_person'] > 0) {
            $lines[] = "";
            if ($summary['shuttlecock_used'] > 0) {
                $lines[] = "ลูกแบดใช้: {$summary['shuttlecock_used']} ลูก";
            }
            $lines[] = "ค่าใช้จ่ายรวม: ฿" . number_format($summary['total_cost']);
            $lines[] = "💰 ต่อคน: ฿" . number_format($summary['per_person']);
        }

        return implode("\n", $lines);
    }
}
