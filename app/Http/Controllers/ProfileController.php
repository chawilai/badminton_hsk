<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\SkillAssessment;
use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\MmrHistory;
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

        // Available months for game history filter
        $availableMonths = Game::whereHas('gamePlayers', fn($q) => $q->where('user_id', $userId))
            ->where('games.status', 'finished')
            ->join('parties', 'games.party_id', '=', 'parties.id')
            ->whereNotNull('parties.play_date')
            ->selectRaw(DB::getDriverName() === 'sqlite'
                ? "CAST(strftime('%Y', parties.play_date) AS INTEGER) as year, CAST(strftime('%m', parties.play_date) AS INTEGER) as month"
                : 'YEAR(parties.play_date) as year, MONTH(parties.play_date) as month')
            ->groupBy('year', 'month')
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->get()
            ->map(fn($row) => ['year' => (int) $row->year, 'month' => (int) $row->month]);

        // Stats period filter: 'week', 'month', 'all' (default: month)
        $statsPeriod = $request->input('period', 'month');
        $now = now()->timezone('Asia/Bangkok');
        $periodStart = null;
        if ($statsPeriod === 'week') {
            $periodStart = $now->copy()->startOfWeek();
        } elseif ($statsPeriod === 'month') {
            $periodStart = $now->copy()->startOfMonth();
        }

        // Filtered stats by period
        $filteredGamesQuery = GamePlayer::where('user_id', $userId)
            ->join('games', 'game_players.game_id', '=', 'games.id')
            ->join('parties', 'games.party_id', '=', 'parties.id')
            ->where('games.status', 'finished');

        if ($periodStart) {
            $filteredGamesQuery->where('parties.play_date', '>=', $periodStart->toDateString());
        }

        $filteredGames = (clone $filteredGamesQuery)
            ->select('game_players.*', 'games.game_start_date', 'games.game_end_date', 'games.id as gid')
            ->get();

        $filteredTotalGames = $filteredGames->count();
        $filteredPlaySeconds = 0;
        foreach ($filteredGames as $fg) {
            $s = strtotime($fg->game_start_date);
            $e = strtotime($fg->game_end_date);
            if ($s && $e && $e > $s) {
                $filteredPlaySeconds += ($e - $s);
            }
        }

        // Filtered wins count
        $filteredGamesWon = 0;
        if ($filteredTotalGames > 0) {
            $filteredGameIds = $filteredGames->pluck('gid')->unique();
            $gamesWithSets = Game::whereIn('id', $filteredGameIds)->with('gameSets')->get()->keyBy('id');
            foreach ($filteredGames as $fg) {
                $game = $gamesWithSets[$fg->gid] ?? null;
                if (!$game) continue;
                $t1 = $game->gameSets->where('winning_team', 'team1')->count();
                $t2 = $game->gameSets->where('winning_team', 'team2')->count();
                $winner = $t1 > $t2 ? 'team1' : ($t2 > $t1 ? 'team2' : null);
                if ($winner === $fg->team) $filteredGamesWon++;
            }
        }

        // Filter games by year/month or show latest month
        $filterYear = $request->input('year');
        $filterMonth = $request->input('month');

        $recentGamesQuery = Game::whereHas('gamePlayers', fn($q) => $q->where('user_id', $userId))
            ->where('status', 'finished')
            ->with(['gamePlayers.user', 'gameSets', 'party.court']);

        if ($filterYear && $filterMonth) {
            $recentGamesQuery->whereHas('party', function ($q) use ($filterYear, $filterMonth) {
                $q->whereYear('play_date', $filterYear)
                  ->whereMonth('play_date', $filterMonth);
            });
        } else {
            // Default: show latest month if available
            if ($availableMonths->isNotEmpty()) {
                $latest = $availableMonths->first();
                $filterYear = $latest['year'];
                $filterMonth = $latest['month'];
                $recentGamesQuery->whereHas('party', function ($q) use ($filterYear, $filterMonth) {
                    $q->whereYear('play_date', $filterYear)
                      ->whereMonth('play_date', $filterMonth);
                });
            }
        }

        $recentGamesCollection = $recentGamesQuery
            ->orderByDesc('game_end_date')
            ->get();

        // Preload MMR changes for these games
        $mmrChanges = MmrHistory::where('user_id', $userId)
            ->whereIn('game_id', $recentGamesCollection->pluck('id'))
            ->pluck('mmr_change', 'game_id');

        $recentGames = $recentGamesCollection
            ->map(function ($game) use ($userId, $mmrChanges) {
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
                    'mmr_change' => $mmrChanges[$game->id] ?? null,
                ];
            });

        // MMR data
        $mmrLevel = \App\Services\MmrService::getLevelForMmr($user->mmr ?? 1000);

        return Inertia::render('Profile', [
            'profileUser' => $user,
            'mmrLevel' => $mmrLevel,
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
            'filteredStats' => [
                'totalGames' => $filteredTotalGames,
                'gamesWon' => $filteredGamesWon,
                'winRate' => $filteredTotalGames > 0 ? round(($filteredGamesWon / $filteredTotalGames) * 100) : 0,
                'totalPlaySeconds' => (int) $filteredPlaySeconds,
            ],
            'statsPeriod' => $statsPeriod,
            'recentParties' => $recentParties,
            'recentGames' => $recentGames,
            'skillAssessment' => SkillAssessment::where('user_id', $userId)->latest()->first()?->skills,
            'availableMonths' => $availableMonths,
            'filterYear' => (int) $filterYear,
            'filterMonth' => (int) $filterMonth,
        ]);
    }

    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'profileData' => [
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'phone' => $user->phone,
                'phone_verified_at' => $user->phone_verified_at,
                'gender' => $user->gender,
                'date_of_birth' => $user->date_of_birth ? \Carbon\Carbon::parse($user->date_of_birth)->format('Y-m-d') : null,
                'subdistrict' => $user->subdistrict,
                'district' => $user->district,
                'province' => $user->province,
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        $request->user()->save();

        return Redirect::route('profile.index')->with('success', 'บันทึกโปรไฟล์เรียบร้อย');
    }

    /**
     * Upload avatar (web + api).
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user = $request->user();

        // Delete old avatar file if it was a local upload
        if ($user->avatar && str_starts_with($user->avatar, '/storage/avatars/')) {
            $oldPath = str_replace('/storage/', '', $user->avatar);
            \Illuminate\Support\Facades\Storage::disk('public')->delete($oldPath);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $url = '/storage/' . $path;

        $user->update([
            'avatar' => $url,
            'profile_picture' => $url,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'อัพโหลดรูปโปรไฟล์เรียบร้อย',
                'avatar' => $url,
            ]);
        }

        return Redirect::route('profile.index')->with('success', 'อัพโหลดรูปโปรไฟล์เรียบร้อย');
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
