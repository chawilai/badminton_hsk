<?php

namespace App\Http\Controllers;

use App\Models\GamePlayer;
use App\Models\PartyMember;
use Illuminate\Http\Request;
use Ably\AblyRest;

class PartyMemberController extends Controller
{
    private function broadcastPartyUpdate($partyId, $event = 'member.updated')
    {
        try {
            $ably = new AblyRest(config('broadcasting.connections.ably.key'));
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

    public function kickMember(Request $request, $id)
    {
        $partyMember = PartyMember::with('party')->findOrFail($id);
        $party = $partyMember->party;

        // Only host can kick
        if ($party->creator_id !== auth()->id()) {
            return back()->with('error', ['notHost' => 'เฉพาะ Host เท่านั้นที่ลบผู้เล่นได้']);
        }

        // Can't kick yourself
        if ($partyMember->user_id === auth()->id()) {
            return back()->with('error', ['kickSelf' => 'ไม่สามารถลบตัวเองออกได้']);
        }

        // Check if player has played any game in this party
        $hasPlayedGame = GamePlayer::where('user_id', $partyMember->user_id)
            ->whereHas('game', function ($query) use ($party) {
                $query->where('party_id', $party->id);
            })
            ->exists();

        if ($hasPlayedGame) {
            return back()->with('error', ['hasPlayed' => 'ไม่สามารถลบผู้เล่นที่เคยเล่นเกมในปาร์ตี้นี้แล้วได้']);
        }

        $memberName = $partyMember->display_name ?? $partyMember->user?->name ?? 'ผู้เล่น';
        $partyMember->delete();

        // Auto-update status
        if ($party->status !== 'Over') {
            $memberCount = $party->members()->count();
            $party->update(['status' => $memberCount >= $party->max_players ? 'Full' : 'Open']);
        }

        $this->broadcastPartyUpdate($party->id, 'member.kicked');

        return back()->with('success', "ลบ {$memberName} ออกจากปาร์ตี้แล้ว");
    }
}
