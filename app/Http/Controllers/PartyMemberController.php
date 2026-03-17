<?php

namespace App\Http\Controllers;

use App\Models\PartyMember;
use Illuminate\Http\Request;

class PartyMemberController extends Controller
{
    public function updateName(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'display_name' => 'nullable|string|max:255',
        ]);

        // Find the party member
        $partyMember = PartyMember::findOrFail($id);

        // Update the display name
        $partyMember->update([
            'display_name' => $request->input('display_name') === '' ? null : $request->input('display_name'),
        ]);

        return back()->with('response', [
            'message' => 'Display name updated successfully.',
            'party_member' => $partyMember,
        ]);
    }

    public function updateGameStatus(Request $request, $id)
    {
        $request->validate([
            'game_status' => 'required|in:ready,break',
        ]);

        $partyMember = PartyMember::findOrFail($id);
        $partyMember->update([
            'game_status' => $request->input('game_status'),
        ]);

        return back()->with('success', 'สถานะอัพเดทแล้ว');
    }
}
