<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\Party;
use App\Models\PartyMember;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user()->load('badmintonRank');
        $userId = $user->id;

        // Party stats
        $partiesJoined = PartyMember::where('user_id', $userId)->count();
        $courtsVisited = PartyMember::where('user_id', $userId)
            ->join('parties', 'party_members.party_id', '=', 'parties.id')
            ->distinct('parties.court_id')
            ->count('parties.court_id');

        // Game stats
        $totalGames = GamePlayer::where('user_id', $userId)
            ->whereHas('game', fn($q) => $q->where('status', 'finished'))
            ->count();

        $gamesWon = GamePlayer::where('user_id', $userId)
            ->whereHas('game', function ($q) {
                $q->where('status', 'finished')
                    ->whereHas('gameSets', fn($sq) => $sq->whereNotNull('winning_team'));
            })
            ->get()
            ->filter(function ($gp) {
                $game = $gp->game()->with('gameSets')->first();
                if (!$game) return false;
                $t1Wins = $game->gameSets->where('winning_team', 'team1')->count();
                $t2Wins = $game->gameSets->where('winning_team', 'team2')->count();
                $winner = $t1Wins > $t2Wins ? 'team1' : ($t2Wins > $t1Wins ? 'team2' : null);
                return $winner === $gp->team;
            })
            ->count();

        $gamesLost = $totalGames - $gamesWon;

        // Total play time (seconds)
        $totalPlaySeconds = 0;
        GamePlayer::where('user_id', $userId)
            ->join('games', 'game_players.game_id', '=', 'games.id')
            ->where('games.status', 'finished')
            ->whereNotNull('games.game_start_date')
            ->whereNotNull('games.game_end_date')
            ->select('games.game_start_date', 'games.game_end_date')
            ->each(function ($row) use (&$totalPlaySeconds) {
                $start = strtotime($row->game_start_date);
                $end = strtotime($row->game_end_date);
                if ($start && $end && $end > $start) {
                    $totalPlaySeconds += ($end - $start);
                }
            });

        // Most played with (teammate)
        $mostPlayedWith = DB::table('game_players as gp1')
            ->join('game_players as gp2', function ($join) {
                $join->on('gp1.game_id', '=', 'gp2.game_id')
                    ->on('gp1.team', '=', 'gp2.team')
                    ->on('gp1.user_id', '!=', 'gp2.user_id');
            })
            ->join('games', 'gp1.game_id', '=', 'games.id')
            ->join('users', 'gp2.user_id', '=', 'users.id')
            ->where('gp1.user_id', $userId)
            ->where('games.status', 'finished')
            ->select('users.id', 'users.name', 'users.avatar', DB::raw('COUNT(*) as count'))
            ->groupBy('users.id', 'users.name', 'users.avatar')
            ->orderByDesc('count')
            ->first();

        // Most win with (teammate in winning games)
        $mostWinWith = null;
        // Simplified: get from game_players where team = winning team majority
        // We'll compute this in frontend instead for accuracy

        // Recent parties (last 10)
        $recentParties = Party::whereHas('members', fn($q) => $q->where('user_id', $userId))
            ->with('court')
            ->withCount(['games', 'members'])
            ->orderByDesc('play_date')
            ->limit(10)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'court_name' => $p->court?->name ?? '-',
                'play_date' => $p->play_date,
                'start_time' => $p->start_time,
                'status' => $p->status,
                'games_count' => $p->games_count,
                'members_count' => $p->members_count,
            ]);

        // Recent games (last 20)
        $recentGames = Game::whereHas('gamePlayers', fn($q) => $q->where('user_id', $userId))
            ->where('status', 'finished')
            ->with(['gamePlayers.user', 'gameSets', 'party.court'])
            ->orderByDesc('game_end_date')
            ->limit(20)
            ->get()
            ->map(function ($game) use ($userId) {
                $myTeam = $game->gamePlayers->firstWhere('user_id', $userId)?->team;
                $t1Wins = $game->gameSets->where('winning_team', 'team1')->count();
                $t2Wins = $game->gameSets->where('winning_team', 'team2')->count();
                $winner = $t1Wins > $t2Wins ? 'team1' : ($t2Wins > $t1Wins ? 'team2' : null);
                $won = $winner && $winner === $myTeam;

                return [
                    'id' => $game->id,
                    'court_name' => $game->party?->court?->name ?? '-',
                    'play_date' => $game->party?->play_date,
                    'won' => $won,
                    'my_team' => $myTeam,
                    'score' => $game->gameSets->map(fn($s) => "{$s->team1_score}-{$s->team2_score}")->join(', '),
                    'teammates' => $game->gamePlayers->where('team', $myTeam)->where('user_id', '!=', $userId)
                        ->map(fn($p) => ['name' => $p->user?->name, 'avatar' => $p->user?->avatar])->values(),
                    'opponents' => $game->gamePlayers->where('team', '!=', $myTeam)->where('team', '!=', null)
                        ->map(fn($p) => ['name' => $p->user?->name, 'avatar' => $p->user?->avatar])->values(),
                    'duration_seconds' => $game->game_start_date && $game->game_end_date
                        ? max(0, strtotime($game->game_end_date) - strtotime($game->game_start_date))
                        : 0,
                ];
            });

        return Inertia::render('Profile', [
            'profileUser' => $user,
            'stats' => [
                'partiesJoined' => $partiesJoined,
                'courtsVisited' => $courtsVisited,
                'totalGames' => $totalGames,
                'gamesWon' => $gamesWon,
                'gamesLost' => $gamesLost,
                'winRate' => $totalGames > 0 ? round(($gamesWon / $totalGames) * 100) : 0,
                'totalPlaySeconds' => (int) $totalPlaySeconds,
                'mostPlayedWith' => $mostPlayedWith,
            ],
            'recentParties' => $recentParties,
            'recentGames' => $recentGames,
        ]);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
