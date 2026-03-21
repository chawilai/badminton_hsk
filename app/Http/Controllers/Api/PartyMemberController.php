<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GamePlayer;
use App\Models\PartyMember;
use Ably\AblyRest;
use Illuminate\Http\Request;

class PartyMemberController extends Controller
{
    private function broadcastPartyUpdate($partyId, $event = 'member.updated', $data = [])
    {
        try {
            $ably = new AblyRest(config('broadcasting.connections.ably.key'));
            $channel = $ably->channels->get("party.{$partyId}");
            $channel->publish($event, array_merge([
                'party_id' => $partyId,
                'timestamp' => now()->toISOString(),
                'user_id' => auth()->id(),
            ], $data));
        } catch (\Exception $e) {}
    }

    public function updateName(Request $request, $id)
    {
        $request->validate(['display_name' => 'nullable|string|max:255']);

        $partyMember = PartyMember::findOrFail($id);
        $partyMember->update([
            'display_name' => $request->input('display_name') === '' ? null : $request->input('display_name'),
        ]);

        $this->broadcastPartyUpdate($partyMember->party_id, 'member.nameUpdated');

        return response()->json(['message' => 'อัพเดทชื่อเรียบร้อย', 'party_member' => $partyMember]);
    }

    public function updateGameStatus(Request $request, $id)
    {
        $request->validate(['game_status' => 'required|in:ready,break']);

        $partyMember = PartyMember::findOrFail($id);
        $partyMember->update(['game_status' => $request->input('game_status')]);

        $statusLabel = $request->input('game_status') === 'ready' ? 'พร้อมเล่น' : 'พักผ่อน';
        $this->broadcastPartyUpdate($partyMember->party_id, 'member.statusChanged', ['message' => "เปลี่ยนสถานะเป็น {$statusLabel}"]);

        return response()->json(['message' => 'สถานะอัพเดทแล้ว']);
    }

    public function kickMember(Request $request, $id)
    {
        $partyMember = PartyMember::with('party')->findOrFail($id);
        $party = $partyMember->party;

        if ($party->creator_id !== auth()->id()) {
            return response()->json(['message' => 'เฉพาะ Host เท่านั้นที่ลบผู้เล่นได้'], 403);
        }

        if ($partyMember->user_id === auth()->id()) {
            return response()->json(['message' => 'ไม่สามารถลบตัวเองออกได้'], 422);
        }

        $hasPlayedGame = GamePlayer::where('user_id', $partyMember->user_id)
            ->whereHas('game', fn($q) => $q->where('party_id', $party->id))
            ->exists();

        if ($hasPlayedGame) {
            return response()->json(['message' => 'ไม่สามารถลบผู้เล่นที่เคยเล่นเกมในปาร์ตี้นี้แล้วได้'], 422);
        }

        $memberName = $partyMember->display_name ?? $partyMember->user?->name ?? 'ผู้เล่น';
        $partyMember->delete();

        if ($party->status !== 'Over') {
            $memberCount = $party->members()->count();
            $party->update(['status' => $memberCount >= $party->max_players ? 'Full' : 'Open']);
        }

        $this->broadcastPartyUpdate($party->id, 'member.kicked', ['message' => "ลบ {$memberName} ออกจากปาร์ตี้"]);

        return response()->json(['message' => "ลบ {$memberName} ออกจากปาร์ตี้แล้ว"]);
    }

    public function leaveParty(Request $request, $id)
    {
        $partyMember = PartyMember::with('party')->findOrFail($id);
        $party = $partyMember->party;

        if ($partyMember->user_id !== auth()->id()) {
            return response()->json(['message' => 'ไม่สามารถดำเนินการได้'], 403);
        }

        if ($party->creator_id === auth()->id()) {
            return response()->json(['message' => 'Host ไม่สามารถออกจากปาร์ตี้ได้'], 422);
        }

        $hasPlayedGame = GamePlayer::where('user_id', auth()->id())
            ->whereHas('game', fn($q) => $q->where('party_id', $party->id))
            ->exists();

        if ($hasPlayedGame) {
            return response()->json(['message' => 'ไม่สามารถออกได้เพราะคุณเคยเล่นเกมในปาร์ตี้นี้แล้ว'], 422);
        }

        $memberName = $partyMember->display_name ?? auth()->user()->name ?? 'ผู้เล่น';
        $partyMember->delete();

        if ($party->status !== 'Over') {
            $memberCount = $party->members()->count();
            $party->update(['status' => $memberCount >= $party->max_players ? 'Full' : 'Open']);
        }

        $this->broadcastPartyUpdate($party->id, 'member.left', ['user_name' => $memberName, 'message' => 'ออกจากปาร์ตี้']);

        return response()->json(['message' => 'ออกจากปาร์ตี้แล้ว']);
    }
}
