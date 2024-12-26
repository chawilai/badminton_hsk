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
        $games = Game::with(['gamePlayers.user', 'shuttlecocks']) // Added 'shuttlecocks' to the eager loading array
            ->withCount('gamePlayers') // Continue counting the number of game players
            ->orderBy('id', 'desc') // Keep the order by id in descending order
            ->get();

        $parties = Party::withCount('members')->get();

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
