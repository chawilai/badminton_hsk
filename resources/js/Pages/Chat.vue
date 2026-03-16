<template>
    <Head title="Chat" />

    <AppLayout>
        <div class="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] bg-base-100 rounded-2xl border border-base-300 shadow-xs overflow-hidden -mx-1 sm:mx-0">
            <!-- Chat Header -->
            <div class="flex items-center gap-3 px-4 py-3 border-b border-base-300 shrink-0 bg-base-200/80">
                <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <i class="pi pi-comments text-primary"></i>
                </div>
                <div>
                    <h1 class="text-base font-bold text-base-content m-0">Chat Room</h1>
                    <p class="text-xs text-base-content/50 m-0">{{ messages.length }} messages</p>
                </div>
            </div>

            <!-- Messages Area -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto py-4 px-4 space-y-3 min-h-0 bg-base-200/50">
                <!-- Empty State -->
                <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center">
                    <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-3">
                        <span class="text-3xl">💬</span>
                    </div>
                    <p class="text-sm text-base-content/60 m-0">No messages yet. Say hello!</p>
                </div>

                <!-- Message Bubbles -->
                <div
                    v-for="(msg, index) in messages"
                    :key="index"
                    class="flex gap-2"
                    :class="isMyMessage(msg) ? 'flex-row-reverse' : 'flex-row'"
                >
                    <!-- Avatar (other person only) -->
                    <div v-if="!isMyMessage(msg)" class="shrink-0">
                        <UserAvatar :src="msg.sender?.avatar" :name="msg.sender?.name" size="sm" rounded="full" />
                    </div>

                    <!-- Bubble -->
                    <div class="max-w-[75%]">
                        <!-- Sender name (other person, show if different from prev) -->
                        <p
                            v-if="!isMyMessage(msg) && showSenderName(index)"
                            class="text-[10px] text-base-content/50 m-0 mb-0.5 ml-1"
                        >
                            {{ msg.sender?.name || 'Unknown' }}
                        </p>
                        <div
                            class="px-3 py-2 text-sm leading-relaxed"
                            :class="isMyMessage(msg)
                                ? 'bg-primary text-white rounded-2xl rounded-br-md'
                                : 'bg-base-100 text-base-content border border-base-300 rounded-2xl rounded-bl-md'"
                        >
                            {{ msg.content }}
                        </div>
                        <p
                            class="text-[10px] text-base-content/50 m-0 mt-0.5"
                            :class="isMyMessage(msg) ? 'text-right mr-1' : 'ml-1'"
                        >
                            {{ formatTime(msg.created_at) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="shrink-0 px-4 py-3 border-t border-base-300 bg-base-100">
                <div class="flex items-center gap-2">
                    <input
                        v-model="newMessage"
                        @keyup.enter="sendMessage"
                        type="text"
                        placeholder="พิมพ์ข้อความ..."
                        class="flex-1 px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden transition-all"
                    />
                    <button
                        @click="sendMessage"
                        :disabled="!newMessage.trim()"
                        class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/80 text-white border-0 cursor-pointer transition-colors shrink-0 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <i class="pi pi-send text-sm"></i>
                    </button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { ref, onMounted, nextTick, watch } from "vue";
import { Head, usePage, router } from "@inertiajs/vue3";
import { Realtime, Rest } from "ably";

const page = usePage();
const currentUserId = page.props.auth.user.id;

const messages = ref([]);
const newMessage = ref("");
const messagesContainer = ref(null);

const ablyKey = page.props.ably_key;
const chatId = page.props.chat_id;

const isMyMessage = (msg) => {
    return msg.sender_id === currentUserId;
};

const getSenderInitial = (msg) => {
    return (msg.sender?.name || '?')[0].toUpperCase();
};

const showSenderName = (index) => {
    if (index === 0) return true;
    const prev = messages.value[index - 1];
    const curr = messages.value[index];
    return prev.sender_id !== curr.sender_id;
};

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = () => {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
};

const fetchMessages = async () => {
    const response = await axios.post(`/chat/messages`, { chat_id: chatId });
    messages.value = response.data;
    scrollToBottom();
};

const sendMessage = async () => {
    if (!newMessage.value.trim()) return;

    router.post(
        `/chat/${chatId}/send-message`,
        {
            sender_id: currentUserId,
            content: newMessage.value,
        },
        {
            preserveScroll: true,
            headers: { Accept: "application/json" },
            onSuccess: () => {
                newMessage.value = "";
                scrollToBottom();
            },
            onError: () => {},
        }
    );
};

watch(messages, () => scrollToBottom(), { deep: true });

onMounted(() => {
    fetchMessages();

    const ably = new Realtime({
        key: ablyKey,
        clientId: `${currentUserId}`,
    });

    const channel = ably.channels.get(`chat.${chatId}`);

    channel.subscribe("message", (message) => {
        messages.value.push(message.data);
    });

    channel.presence.enter({ name: page.props.auth.user.name });
});
</script>
