<template>
    <Head title="Chat" />

    <AppLayout>
        <div class="tw-flex tw-flex-col tw-h-[calc(100vh-8rem)] lg:tw-h-[calc(100vh-5rem)] tw-bg-white dark:tw-bg-court-900/80 tw-rounded-2xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-shadow-sm tw-overflow-hidden tw--mx-1 sm:tw-mx-0">
            <!-- Chat Header -->
            <div class="tw-flex tw-items-center tw-gap-3 tw-px-4 tw-py-3 tw-border-b tw-border-gray-200 dark:tw-border-court-800 tw-shrink-0 tw-bg-gray-50/80 dark:tw-bg-court-950/50">
                <div class="tw-w-10 tw-h-10 tw-bg-court-100 dark:tw-bg-court-800 tw-rounded-xl tw-flex tw-items-center tw-justify-center">
                    <i class="pi pi-comments tw-text-court-600 dark:tw-text-court-400"></i>
                </div>
                <div>
                    <h1 class="tw-text-base tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">Chat Room</h1>
                    <p class="tw-text-xs tw-text-gray-400 tw-m-0">{{ messages.length }} messages</p>
                </div>
            </div>

            <!-- Messages Area -->
            <div ref="messagesContainer" class="tw-flex-1 tw-overflow-y-auto tw-py-4 tw-px-4 tw-space-y-3 tw-min-h-0 tw-bg-gray-50/50 dark:tw-bg-court-950/30">
                <!-- Empty State -->
                <div v-if="messages.length === 0" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-full tw-text-center">
                    <div class="tw-w-16 tw-h-16 tw-bg-court-100 dark:tw-bg-court-900 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-3">
                        <span class="tw-text-3xl">💬</span>
                    </div>
                    <p class="tw-text-sm tw-text-gray-500 tw-m-0">No messages yet. Say hello!</p>
                </div>

                <!-- Message Bubbles -->
                <div
                    v-for="(msg, index) in messages"
                    :key="index"
                    class="tw-flex tw-gap-2"
                    :class="isMyMessage(msg) ? 'tw-flex-row-reverse' : 'tw-flex-row'"
                >
                    <!-- Avatar (other person only) -->
                    <div v-if="!isMyMessage(msg)" class="tw-shrink-0">
                        <UserAvatar :src="msg.sender?.avatar" :name="msg.sender?.name" size="sm" rounded="full" />
                    </div>

                    <!-- Bubble -->
                    <div class="tw-max-w-[75%]">
                        <!-- Sender name (other person, show if different from prev) -->
                        <p
                            v-if="!isMyMessage(msg) && showSenderName(index)"
                            class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-mb-0.5 tw-ml-1"
                        >
                            {{ msg.sender?.name || 'Unknown' }}
                        </p>
                        <div
                            class="tw-px-3 tw-py-2 tw-text-sm tw-leading-relaxed"
                            :class="isMyMessage(msg)
                                ? 'tw-bg-court-600 tw-text-white tw-rounded-2xl tw-rounded-br-md'
                                : 'tw-bg-white dark:tw-bg-court-900 tw-text-gray-900 dark:tw-text-gray-100 tw-border tw-border-gray-200 dark:tw-border-court-800 tw-rounded-2xl tw-rounded-bl-md'"
                        >
                            {{ msg.content }}
                        </div>
                        <p
                            class="tw-text-[10px] tw-text-gray-400 tw-m-0 tw-mt-0.5"
                            :class="isMyMessage(msg) ? 'tw-text-right tw-mr-1' : 'tw-ml-1'"
                        >
                            {{ formatTime(msg.created_at) }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="tw-shrink-0 tw-px-4 tw-py-3 tw-border-t tw-border-gray-200 dark:tw-border-court-800 tw-bg-white dark:tw-bg-court-900/80">
                <div class="tw-flex tw-items-center tw-gap-2">
                    <input
                        v-model="newMessage"
                        @keyup.enter="sendMessage"
                        type="text"
                        placeholder="พิมพ์ข้อความ..."
                        class="tw-flex-1 tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-700 tw-bg-white dark:tw-bg-court-900 tw-text-gray-900 dark:tw-text-gray-100 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all"
                    />
                    <button
                        @click="sendMessage"
                        :disabled="!newMessage.trim()"
                        class="tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-xl tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-border-0 tw-cursor-pointer tw-transition-colors tw-shrink-0 active:tw-scale-[0.95] disabled:tw-opacity-40 disabled:tw-cursor-not-allowed"
                    >
                        <i class="pi pi-send tw-text-sm"></i>
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
