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
import { Realtime, Rest } from "ably";

const page = usePage();

const messages = ref([]);
const newMessage = ref("");

console.log(page.props)

// Get the Ably key and chat ID from Inertia's shared props
const ablyKey = page.props.ably_key;
const ablyToken = page.props.ably_token;
const chatId = page.props.chat_id;

const logKey = (event) => {
    console.log("Key:", event.key);
    console.log("Code:", event.code);
};

const fetchMessages = async () => {
    const response = await axios.post(`/chat/messages`, {chat_id: chatId});
    messages.value = response.data
};

// Send a message
const sendMessage = async () => {
    if (!newMessage.value) return;

    router.post(
        `/chat/${chatId}/send-message`,
        {
            sender_id: page.props.auth.user.id,
            content: newMessage.value,
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

onMounted(() => {

    fetchMessages()

    const ably = new Realtime({
        key: ablyKey,
        clientId: `${page.props.auth.user.id}`
    });

    const channel = ably.channels.get(`chat.${chatId}`);

    channel.subscribe("message", (message) => {
        messages.value.push(message.data); // Add incoming message to the chat
    });

    channel.presence.enter({
        name: 'John Doe'
    }); // Notify others you're online

    channel.presence.subscribe("enter", (member) => {
        console.log(`${member.clientId} joined the chat.`);
    });

    channel.presence.subscribe("leave", (member) => {
        console.log(`${member.clientId} left the chat.`);
    });

    ably.connection.on('disconnected', () => {
    console.log('You are offline.');
    });

    ably.connection.on('connected', () => {
        console.log('You are back online!');
    });
});
</script>

<style scoped></style>
