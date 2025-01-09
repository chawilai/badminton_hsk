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
}
