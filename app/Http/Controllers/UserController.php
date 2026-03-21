<?php

namespace App\Http\Controllers;

use App\Models\BadmintonRank;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function showPdpaConsent()
    {
        return Inertia::render('PdpaConsent');
    }

    public function acceptPdpaConsent(Request $request)
    {
        $request->user()->update(['pdpa_consented_at' => now()]);

        // If user still needs setup, go to setup, otherwise go to party-lists
        if (!$request->user()->badminton_rank_id) {
            return redirect()->route('user.setup');
        }

        return redirect('/party-lists');
    }

    public function showSetupForm()
    {
        $ranks = BadmintonRank::all()->groupBy('education_group_rank');

        return Inertia::render('UserSetup', [
            'rankGroups' => $ranks,
        ]);
    }

    public function updateSetup(Request $request)
    {
        $request->validate([
            'badminton_rank_id' => 'required|integer',
            'gender' => 'required|string',
            'date_of_birth' => 'required|date',
        ]);

        $user = $request->user();
        $user->update($request->only('badminton_rank_id', 'gender', 'date_of_birth'));

        return redirect('/party-lists'); // Redirect back to /party after setup
    }
}
