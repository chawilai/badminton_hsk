<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Models\ChatParticipant;
use App\Models\Message;
use App\Models\User;
use Ably\AblyRest;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();

        $chats = Chat::whereHas('participants', fn($q) => $q->where('user_id', $userId))
            ->with(['participants.user', 'messages' => fn($q) => $q->latest()->limit(1), 'messages.sender'])
            ->get()
            ->map(function ($chat) use ($userId) {
                $lastMessage = $chat->messages->first();
                $otherParticipant = $chat->participants->firstWhere('user_id', '!=', $userId);
                $myParticipant = $chat->participants->firstWhere('user_id', $userId);

                $unreadQuery = Message::where('chat_id', $chat->id)->where('sender_id', '!=', $userId);
                if ($myParticipant?->last_read_at) {
                    $unreadQuery->where('created_at', '>', $myParticipant->last_read_at);
                }

                return [
                    'id' => $chat->id,
                    'name' => $chat->is_group ? $chat->name : ($otherParticipant?->user?->name ?? 'Unknown'),
                    'avatar' => $chat->is_group ? null : $otherParticipant?->user?->avatar,
                    'is_group' => $chat->is_group,
                    'last_message' => $lastMessage?->content,
                    'last_message_at' => $lastMessage?->created_at,
                    'last_sender_name' => $lastMessage?->sender?->name,
                    'unread_count' => $unreadQuery->count(),
                ];
            })
            ->sortByDesc('last_message_at')
            ->values();

        $friendIds = $request->user()->friendIds();
        $users = User::whereIn('id', $friendIds)->select('id', 'name', 'avatar')->orderBy('name')->get();

        return response()->json([
            'chats' => $chats,
            'ably_key' => config('broadcasting.connections.ably.key'),
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array|min:2',
            'is_group' => 'required|boolean',
            'name' => 'nullable|string',
        ]);

        $userId = auth()->id();

        if (!$validated['is_group'] && count($validated['user_ids']) === 2) {
            $otherUserId = collect($validated['user_ids'])->first(fn($id) => $id != $userId);
            $existingChat = Chat::where('is_group', false)
                ->whereHas('participants', fn($q) => $q->where('user_id', $userId))
                ->whereHas('participants', fn($q) => $q->where('user_id', $otherUserId))
                ->first();

            if ($existingChat) {
                return response()->json(['chat_id' => $existingChat->id]);
            }
        }

        $chat = Chat::create([
            'is_group' => $validated['is_group'],
            'name' => $validated['is_group'] ? $validated['name'] : null,
        ]);

        foreach ($validated['user_ids'] as $uid) {
            ChatParticipant::create(['chat_id' => $chat->id, 'user_id' => $uid]);
        }

        return response()->json(['chat_id' => $chat->id], 201);
    }

    public function getMessages(Request $request, $chatId)
    {
        $messages = Message::where('chat_id', $chatId)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        $userId = auth()->id();
        $readReceipts = ChatParticipant::where('chat_id', $chatId)
            ->where('user_id', '!=', $userId)
            ->pluck('last_read_at', 'user_id');

        return response()->json([
            'messages' => $messages,
            'read_receipts' => $readReceipts,
        ]);
    }

    public function sendMessage(Request $request, $chatId)
    {
        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'chat_id' => $chatId,
            'sender_id' => auth()->id(),
            'content' => $validated['content'],
        ]);

        $message->load('sender');

        try {
            $ably = new AblyRest(config('broadcasting.connections.ably.key'));
            $channel = $ably->channels->get("chat.{$chatId}");
            $channel->publish('message', $message->toArray());
        } catch (\Exception $e) {}

        return response()->json($message, 201);
    }

    public function markAsRead($chatId)
    {
        $now = now();
        ChatParticipant::where('chat_id', $chatId)
            ->where('user_id', auth()->id())
            ->update(['last_read_at' => $now]);

        try {
            $ably = new AblyRest(config('broadcasting.connections.ably.key'));
            $channel = $ably->channels->get("chat.{$chatId}");
            $channel->publish('read', ['user_id' => auth()->id(), 'read_at' => $now->toISOString()]);
        } catch (\Exception $e) {}

        return response()->json(['ok' => true]);
    }
}
