<?php

namespace App\Http\Controllers;

use App\Models\PartyMember;
use Illuminate\Http\Request;
use Ably\AblyRest;

class PartyMemberController extends Controller
{
    private function broadcastPartyUpdate($partyId, $event = 'member.updated')
    {
        try {
            $ably = new AblyRest(env('ABLY_KEY'));
            $channel = $ably->channels->get("party.{$partyId}");
            $channel->publish($event, [
                'party_id' => $partyId,
                'timestamp' => now()->toISOString(),
                'user_id' => auth()->id(),
            ]);
        } catch (\Exception $e) {}
    }

    public function updateName(Request $request, $id)
    {
        $request->validate([
            'display_name' => 'nullable|string|max:255',
        ]);

        $partyMember = PartyMember::findOrFail($id);
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

        $statusLabel = $request->input('game_status') === 'ready' ? 'พร้อมเล่น' : 'พักผ่อน';
        $this->broadcastPartyUpdate($partyMember->party_id, 'member.statusChanged', "เปลี่ยนสถานะเป็น {$statusLabel}");

        return back()->with('success', 'สถานะอัพเดทแล้ว');
    }
}
