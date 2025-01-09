<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Party;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartyController extends Controller
{
    public function index(Request $request)
    {
        $games = Game::with([
            'gamePlayers.user',
            'shuttlecocks',
            'gameSets'
        ])
        ->withCount('gamePlayers')
        ->with(['gamePlayers' => function ($query) {
            $query->leftJoin('party_members', 'game_players.user_id', '=', 'party_members.user_id')
                  ->select('game_players.*', 'party_members.display_name');
        }])
        ->orderBy('id', 'desc')
        ->get();

        $parties = Party::with([
            'members',
            'members.user',
        ])
            ->withCount('members')
            ->get();

        return Inertia::render('Party', [
            'parties' => $parties,
            'games' => $games,
        ]);
    }

    public function setInitialShuttlecocks(Request $request, Party $party)
    {
        $request->validate([
            'initial_shuttlecocks' => 'required|integer|min:0'
        ]);

        // Check if the new value is the same as the existing value
        if ($party->default_initial_shuttlecocks == $request->initial_shuttlecocks) {
            return back()->with('info', 'No changes were made as the value is already set.');
        }

        $party->default_initial_shuttlecocks = $request->initial_shuttlecocks;
        $party->save();

        return back()->with('success', 'Initial shuttlecocks set successfully.');
    }
}
