<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Ably\AblyRest;

class FriendController extends Controller
{
    /**
     * Show the friends page with friends list and pending requests.
     */
    public function index()
    {
        $userId = auth()->id();

        // Accepted friends — map to show the "other" user
        $friends = Friendship::acceptedFor($userId)
            ->with(['sender', 'receiver'])
            ->get()
            ->map(function ($f) use ($userId) {
                $other = $f->sender_id === $userId ? $f->receiver : $f->sender;
                return [
                    'id' => $f->id,
                    'user' => $other,
                ];
            });

        // Pending requests received — show sender as user
        $receivedPending = Friendship::pendingFor($userId)
            ->with('sender')
            ->get()
            ->map(fn($f) => ['id' => $f->id, 'user' => $f->sender]);

        // Pending requests sent — show receiver as user
        $sentPending = Friendship::sentBy($userId)
            ->with('receiver')
            ->get()
            ->map(fn($f) => ['id' => $f->id, 'user' => $f->receiver]);

        return Inertia::render('Friends', [
            'friends' => $friends,
            'receivedRequests' => $receivedPending,
            'sentRequests' => $sentPending,
            'ably_key' => env('ABLY_KEY'),
        ]);
    }

    /**
     * Send a friend request.
     */
    public function sendRequest(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|integer|exists:users,id',
        ]);

        $senderId = auth()->id();
        $receiverId = $validated['receiver_id'];

        // Cannot send request to self
        if ($senderId === $receiverId) {
            return back()->withErrors(['receiver_id' => 'You cannot send a friend request to yourself.']);
        }

        // Check for existing friendship in either direction
        $exists = Friendship::where(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $senderId)->where('receiver_id', $receiverId);
        })->orWhere(function ($q) use ($senderId, $receiverId) {
            $q->where('sender_id', $receiverId)->where('receiver_id', $senderId);
        })->exists();

        if ($exists) {
            return back()->withErrors(['receiver_id' => 'A friend request already exists between you and this user.']);
        }

        $friendship = Friendship::create([
            'sender_id' => $senderId,
            'receiver_id' => $receiverId,
            'status' => 'pending',
        ]);

        // Broadcast via Ably to the receiver
        try {
            $ably = new AblyRest(env('ABLY_KEY'));
            $channel = $ably->channels->get("friends.{$receiverId}");
            $channel->publish('friend-request', [
                'friendship_id' => $friendship->id,
                'sender' => auth()->user()->only(['id', 'name', 'avatar']),
                'status' => 'pending',
            ]);
        } catch (\Exception $e) {
            // Silently fail broadcasting - the request was still created
        }

        return back()->with('success', 'Friend request sent!');
    }

    /**
     * Accept a friend request.
     */
    public function acceptRequest(Friendship $friendship)
    {
        // Only the receiver can accept
        if ($friendship->receiver_id !== auth()->id()) {
            abort(403, 'You are not authorized to accept this request.');
        }

        $friendship->update(['status' => 'accepted']);

        // Broadcast via Ably to the sender
        try {
            $ably = new AblyRest(env('ABLY_KEY'));
            $channel = $ably->channels->get("friends.{$friendship->sender_id}");
            $channel->publish('friend-accepted', [
                'friendship_id' => $friendship->id,
                'receiver' => auth()->user()->only(['id', 'name', 'avatar']),
                'status' => 'accepted',
            ]);
        } catch (\Exception $e) {
            // Silently fail broadcasting - the acceptance was still saved
        }

        return back()->with('success', 'Friend request accepted!');
    }

    /**
     * Cancel or reject a friend request, or remove a friend.
     */
    public function cancelRequest(Friendship $friendship)
    {
        $userId = auth()->id();

        // Only sender or receiver can cancel/delete
        if ($friendship->sender_id !== $userId && $friendship->receiver_id !== $userId) {
            abort(403, 'You are not authorized to cancel this request.');
        }

        $friendship->delete();

        return back()->with('success', 'Friend request cancelled.');
    }
}
