<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        // Delegate to web ProfileController for stats logic
        $webController = new \App\Http\Controllers\ProfileController();
        // Get the data that would normally be passed to Inertia
        $user = $request->user()->load('latestSkillAssessment');
        $mmrLevel = $user->mmrLevel();

        // Stats calculation - replicating from web controller
        $year = $request->query('year');
        $month = $request->query('month');

        $gamesQuery = \App\Models\GamePlayer::where('user_id', $user->id)
            ->whereHas('game', function ($q) use ($year, $month) {
                $q->where('status', 'finished');
                if ($year) $q->whereYear('game_end_date', $year);
                if ($month) $q->whereMonth('game_end_date', $month);
            });

        $totalGames = $gamesQuery->count();

        $gamesWon = (clone $gamesQuery)->whereHas('game', function ($q) {
            $q->whereHas('gameSets', function ($sq) {
                $sq->whereColumn('winning_team', 'game_players.team');
            });
        })->count();

        return response()->json([
            'user' => new UserResource($user),
            'mmr_level' => $mmrLevel,
            'stats' => [
                'total_games' => $totalGames,
                'games_won' => $gamesWon,
                'games_lost' => $totalGames - $gamesWon,
                'win_rate' => $totalGames > 0 ? round(($gamesWon / $totalGames) * 100) : 0,
            ],
            'filters' => [
                'year' => $year,
                'month' => $month,
            ],
        ]);
    }

    public function edit(Request $request)
    {
        return response()->json([
            'user' => new UserResource($request->user()),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $request->user()->id,
            'gender' => 'nullable|in:male,female,other',
            'date_of_birth' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
            'subdistrict' => 'nullable|string|max:255',
            'district' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
        ]);

        $request->user()->update($validated);

        return response()->json([
            'message' => 'อัพเดทโปรไฟล์เรียบร้อย',
            'user' => new UserResource($request->user()->fresh()),
        ]);
    }

    /**
     * Upload avatar — replaces social login avatar.
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

        return response()->json([
            'message' => 'อัพโหลดรูปโปรไฟล์เรียบร้อย',
            'avatar' => $url,
            'user' => new UserResource($user->fresh()),
        ]);
    }
}
