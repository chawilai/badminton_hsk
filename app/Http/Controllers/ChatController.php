<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\ChatParticipant;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Ably\AblyRest;

class ChatController extends Controller
{
    public function showChat(Request $request)
    {
        $userId = auth()->id();

        // Get all chats the user participates in
        $chats = Chat::whereHas('participants', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        })
            ->with(['participants.user', 'messages' => function ($q) {
                $q->latest()->limit(1);
            }, 'messages.sender'])
            ->get()
            ->map(function ($chat) use ($userId) {
                $lastMessage = $chat->messages->first();
                $otherParticipant = $chat->participants->firstWhere('user_id', '!=', $userId);
                $myParticipant = $chat->participants->firstWhere('user_id', $userId);

                // Count unread messages for this chat
                $unreadQuery = Message::where('chat_id', $chat->id)
                    ->where('sender_id', '!=', $userId);
                if ($myParticipant?->last_read_at) {
                    $unreadQuery->where('created_at', '>', $myParticipant->last_read_at);
                }
                $unreadCount = $unreadQuery->count();

                return [
                    'id' => $chat->id,
                    'name' => $chat->is_group ? $chat->name : ($otherParticipant?->user?->name ?? 'Unknown'),
                    'avatar' => $chat->is_group ? null : $otherParticipant?->user?->avatar,
                    'is_group' => $chat->is_group,
                    'last_message' => $lastMessage?->content,
                    'last_message_at' => $lastMessage?->created_at,
                    'last_sender_name' => $lastMessage?->sender?->name,
                    'participants_count' => $chat->participants->count(),
                    'unread_count' => $unreadCount,
                ];
            })
            ->sortByDesc('last_message_at')
            ->values();

        // Selected chat
        $chatId = $request->chatId;

        // Users available for new chat (friends only)
        $friendIds = $request->user()->friendIds();
        $users = User::whereIn('id', $friendIds)
            ->select('id', 'name', 'avatar')
            ->orderBy('name')
            ->get();

        return Inertia::render('Chat', [
            'chats' => $chats,
            'selected_chat_id' => $chatId ? (int) $chatId : null,
            'ably_key' => config('broadcasting.connections.ably.key'),
            'users' => $users,
        ]);
    }

    public function createChat(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array|min:2',
            'is_group' => 'required|boolean',
            'name' => 'nullable|string',
        ]);

        $userId = auth()->id();

        // For 1-on-1 chat, check if one already exists
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
            ChatParticipant::create([
                'chat_id' => $chat->id,
                'user_id' => $uid,
            ]);
        }

        return response()->json(['chat_id' => $chat->id]);
    }

    public function getMessages(Request $request)
    {
        $messages = Message::where('chat_id', $request->chat_id)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        // Get other participants' last_read_at for read receipts
        $userId = auth()->id();
        $readReceipts = ChatParticipant::where('chat_id', $request->chat_id)
            ->where('user_id', '!=', $userId)
            ->pluck('last_read_at', 'user_id');

        return response()->json([
            'messages' => $messages,
            'read_receipts' => $readReceipts,
        ]);
    }

    public function sendMessage(Request $request, $chat_id)
    {
        $validated = $request->validate([
            'sender_id' => 'required|integer',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'chat_id' => $chat_id,
            'sender_id' => $validated['sender_id'],
            'content' => $validated['content'],
        ]);

        // Load sender for broadcasting
        $message->load('sender');

        // Publish to Ably
        $ably = new AblyRest(config('broadcasting.connections.ably.key'));
        $channel = $ably->channels->get("chat.{$chat_id}");
        $channel->publish('message', $message->toArray());

        return response()->json($message);
    }

    public function markAsRead($chat_id)
    {
        $now = now();
        ChatParticipant::where('chat_id', $chat_id)
            ->where('user_id', auth()->id())
            ->update(['last_read_at' => $now]);

        // Broadcast read receipt to other participants
        try {
            $ably = new AblyRest(config('broadcasting.connections.ably.key'));
            $channel = $ably->channels->get("chat.{$chat_id}");
            $channel->publish('read', [
                'user_id' => auth()->id(),
                'read_at' => $now->toISOString(),
            ]);
        } catch (\Exception $e) {
            // Silently fail - read receipts are not critical
        }

        return response()->json(['ok' => true]);
    }

    public static function getUnreadCount($userId): int
    {
        $participants = ChatParticipant::where('user_id', $userId)->get();
        $total = 0;

        foreach ($participants as $p) {
            $query = Message::where('chat_id', $p->chat_id)
                ->where('sender_id', '!=', $userId);

            if ($p->last_read_at) {
                $query->where('created_at', '>', $p->last_read_at);
            }

            $total += $query->count();
        }

        return $total;
    }
}
