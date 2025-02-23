<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\ChatParticipant;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Ably\AblyRest;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
    // Create or find a chat
    public function showChat(Request $request)
    {
        $chatId = $request->chatId ?? 1;

        $chat = Chat::findOrFail($chatId);

        $ably = new AblyRest(env('ABLY_KEY'));

        $tokenRequest = $ably->auth->createTokenRequest([
            'clientId' => auth()->user()->id ?? 'guest',
        ]);

        // Ably
        $apiKey = env('ABLY_KEY');  // Ensure your API key is in your .env file

        // Basic auth credentials should be base64 encoded as username:password format
        $basicAuth = base64_encode($apiKey);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Basic ' . $basicAuth
            ])->get('https://rest.ably.io/channels');

            // // Check for successful response
            // if ($response->successful()) {
            //     return $response->json();  // Return the JSON response
            // } else {
            //     // Handle errors
            //     return response()->json(['error' => 'Failed to fetch channels'], $response->status());
            // }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        // Ably

        return Inertia::render('Chat', [
            'chat_id' => $chat->id, // Pass the chat ID
            'ably_key' => env('ABLY_KEY'),
            'ably_token' => $tokenRequest,
            'ably_channels' => $response->json(),
        ]);
    }

    // Create or find a chat
    public function createChat(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array|min:2', // Array of user IDs
            'is_group' => 'required|boolean',
            'name' => 'nullable|string',
        ]);

        $chat = Chat::create([
            'is_group' => $validated['is_group'],
            'name' => $validated['is_group'] ? $validated['name'] : null,
        ]);

        foreach ($validated['user_ids'] as $userId) {
            ChatParticipant::create([
                'chat_id' => $chat->id,
                'user_id' => $userId,
            ]);
        }

        return response()->json($chat);
    }

    // Get messages in a chat
    public function getMessages(Request $request)
    {
        $messages = Message::where('chat_id', $request->chat_id)
            ->with('sender')
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($messages);
    }

    // Send a message
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

        // Publish to Ably
        $ably = new AblyRest(env('ABLY_KEY'));
        $channel = $ably->channels->get("chat.{$chat_id}");

        $channel->publish('message', $message->toArray());

        // return response()->json($message);
    }
}
