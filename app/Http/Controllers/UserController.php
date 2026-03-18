<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function showSetupForm()
    {
        return Inertia::render('Empty', []);
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
