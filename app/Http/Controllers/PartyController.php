<?php

namespace App\Http\Controllers;

use App\Models\Party;
use Illuminate\Http\Request;

class PartyController extends Controller
{
    public function setInitialShuttlecocks(Request $request, Party $party)
{
    $request->validate([
        'initial_shuttlecocks' => 'required|integer|min:0'
    ]);

    $party->default_initial_shuttlecocks = $request->initial_shuttlecocks;
    $party->save();

    return back()->with('success', 'Initial shuttlecocks set successfully.');
}
}
