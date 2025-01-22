<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Chat;
use App\Models\ChatParticipant;
use App\Models\Message;

class ChatSeeder extends Seeder
{
    public function run()
    {
        // Example data for users (assuming user IDs exist)
        $users = [1, 2, 3, 4]; // Replace with actual user IDs in your database

        // Create a one-on-one chat between User 1 and User 2
        $oneOnOneChat = Chat::create([
            'is_group' => false,
            'name' => null, // No name for one-on-one chats
        ]);

        // Add participants
        ChatParticipant::create(['chat_id' => $oneOnOneChat->id, 'user_id' => $users[0]]);
        ChatParticipant::create(['chat_id' => $oneOnOneChat->id, 'user_id' => $users[1]]);

        // Add some messages
        Message::create([
            'chat_id' => $oneOnOneChat->id,
            'sender_id' => $users[0],
            'content' => 'Hello, how are you?',
        ]);
        Message::create([
            'chat_id' => $oneOnOneChat->id,
            'sender_id' => $users[1],
            'content' => 'I am good, thank you! How about you?',
        ]);

        // Create a group chat with User 1, User 3, and User 4
        $groupChat = Chat::create([
            'is_group' => true,
            'name' => 'Project Team Chat',
        ]);

        // Add participants
        ChatParticipant::create(['chat_id' => $groupChat->id, 'user_id' => $users[0]]);
        ChatParticipant::create(['chat_id' => $groupChat->id, 'user_id' => $users[2]]);
        ChatParticipant::create(['chat_id' => $groupChat->id, 'user_id' => $users[3]]);

        // Add some group messages
        Message::create([
            'chat_id' => $groupChat->id,
            'sender_id' => $users[0],
            'content' => 'Welcome to the group chat!',
        ]);
        Message::create([
            'chat_id' => $groupChat->id,
            'sender_id' => $users[2],
            'content' => 'Thanks! Glad to be here.',
        ]);
        Message::create([
            'chat_id' => $groupChat->id,
            'sender_id' => $users[3],
            'content' => 'Looking forward to collaborating with everyone!',
        ]);
    }
}
