<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserCompactResource;
use App\Models\Friendship;
use Ably\AblyRest;
use Illuminate\Http\Request;

class FriendController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $friends = Friendship::acceptedFor($userId)
            ->with(['sender', 'receiver'])
            ->get()
            ->map(function ($f) use ($userId) {
                $other = $f->sender_id === $userId ? $f->receiver : $f->sender;
                return ['id' => $f->id, 'user' => new UserCompactResource($other)];
            });

        $receivedPending = Friendship::pendingFor($userId)
            ->with('sender')
            ->get()
            ->map(fn($f) => ['id' => $f->id, 'user' => new UserCompactResource($f->sender)]);

        $sentPending = Friendship::sentBy($userId)
            ->with('receiver')
            ->get()
            ->map(fn($f) => ['id' => $f->id, 'user' => new UserCompactResource($f->receiver)]);

        return response()->json([
            'friends' => $friends,
            'receivedRequests' => $receivedPending,
            'sentRequests' => $sentPending,
            'ably_key' => config('broadcasting.connections.ably.key'),
        ]);
    }

    public function sendRequest(Request $request)
    {
        $validated = $request->validate(['receiver_id' => 'required|integer|exists:users,id']);

        $senderId = auth()->id();
        $receiverId = $validated['receiver_id'];

        if ($senderId === $receiverId) {
            return response()->json(['message' => 'ไม่สามารถเพิ่มตัวเองเป็นเพื่อนได้'], 422);
        }

        $exists = Friendship::where(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $senderId)->where('receiver_id', $receiverId);
        })->orWhere(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $receiverId)->where('receiver_id', $senderId);
        })->exists();

        if ($exists) {
            return response()->json(['message' => 'มีคำขอเป็นเพื่อนอยู่แล้ว'], 422);
        }

        $friendship = Friendship::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'status' => 'pending',
        ]);

        try {
            $ably = new AblyRest(config('broadcasting.connections.ably.key'));
            $channel = $ably->channels->get("friends.{$receiverId}");
            $channel->publish('friend-request', [
                'friendship_id' => $friendship->id,
                'sender' => auth()->user()->only(['id', 'name', 'avatar']),
                'status' => 'pending',
            ]);
        } catch (\Exception $e) {}

        return response()->json(['message' => 'ส่งคำขอเพื่อนแล้ว', 'friendship_id' => $friendship->id], 201);
    }

    public function acceptRequest(Friendship $friendship)
    {
        if ($friendship->receiver_id !== auth()->id()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $friendship->update(['status' => 'accepted']);

        try {
            $ably = new AblyRest(config('broadcasting.connections.ably.key'));
            $channel = $ably->channels->get("friends.{$friendship->sender_id}");
            $channel->publish('friend-accepted', [
                'friendship_id' => $friendship->id,
                'receiver' => auth()->user()->only(['id', 'name', 'avatar']),
                'status' => 'accepted',
            ]);
        } catch (\Exception $e) {}

        return response()->json(['message' => 'ยอมรับเป็นเพื่อนแล้ว']);
    }

    public function cancelRequest(Friendship $friendship)
    {
        $userId = auth()->id();
        if ($friendship->sender_id !== $userId && $friendship->receiver_id !== $userId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $friendship->delete();
        return response()->json(['message' => 'ลบคำขอเพื่อนแล้ว']);
    }
}
