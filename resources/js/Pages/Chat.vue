<template>
    <Head title="Chat" />

    <AppLayout>
        <div>
            <h1>Chat Room</h1>
            <ul>
                <li v-for="(msg, index) in messages" :key="index">
                    <strong>{{ msg.sender_id }}:</strong> {{ msg.content }}
                </li>
            </ul>
            <input @keyup.enter="sendMessage" v-model="newMessage" />
            <button @click="sendMessage">Send</button>
        </div>
    </AppLayout>
</template>

<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { ref, onMounted } from "vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";
import { Realtime } from "ably";

const page = usePage();

const messages = ref([]);
const newMessage = ref("");

// Get the Ably key and chat ID from Inertia's shared props
const ablyKey = page.props.ably_key; // Shared Ably key
const chatId = page.props.chat_id; // Chat ID passed from the server

const logKey = (event) => {
  console.log('Key:', event.key);
  console.log('Code:', event.code);
};

const fetchMessages = async (chatId) => {
    const response = await axios.get(`/chat/${chatId}/messages`);
    messages.value = response.data;
};

// Send a message
const sendMessage = async () => {
    if (!newMessage.value) return;

    router.post(
    `/chat/${chatId}/send-message`,
    {
        sender_id: page.props.auth.user.id,
        content: newMessage.value
     },
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (response) => {
            newMessage.value = ""; // Clear input
      },
      onError: (error) => {},
    }
  );
};

// // testing
// 5. Testing
// Test Creating a Chat: Use a POST request to /chat/create with a payload like:

// json
// Copy
// Edit
// {
//     "user_ids": [1, 2],
//     "is_group": false,
//     "name": null
// }
// Test Fetching Messages: Use a GET request to /chat/{chat_id}/messages.

// Test Sending a Message: Use a POST request to /chat/{chat_id}/send-message with a payload like:

// json
// Copy
// Edit
// {
//     "sender_id": 1,
//     "content": "Hello!"
// }
// // testing

onMounted(() => {
    const ably = new Realtime(ablyKey);
    const channel = ably.channels.get(`chat.${chatId}`);

    channel.subscribe("message", (message) => {
        messages.value.push(message.data); // Add incoming message to the chat
    });
});
</script>

<style scoped></style>
