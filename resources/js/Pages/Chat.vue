<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { ref, onMounted, nextTick, watch, onUnmounted, computed } from "vue";
import { Head, usePage } from "@inertiajs/vue3";
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();
import { Realtime } from "ably";

const page = usePage();
const currentUserId = page.props.auth.user.id;
const ablyKey = page.props.ably_key;

const chatList = ref(page.props.chats || []);
const selectedChatId = ref(page.props.selected_chat_id || null);
const messages = ref([]);
const newMessage = ref("");
const messagesContainer = ref(null);
const showSidebar = ref(true);
const showNewChatModal = ref(false);
const searchUser = ref("");
const availableUsers = ref(page.props.users || []);
const loadingMessages = ref(false);

let ably = null;
let currentChannel = null;

const filteredUsers = computed(() => {
  if (!searchUser.value.trim()) return availableUsers.value;
  const q = searchUser.value.toLowerCase();
  return availableUsers.value.filter(u => u.name.toLowerCase().includes(q));
});

const selectedChat = computed(() => chatList.value.find(c => c.id === selectedChatId.value));

const isMyMessage = (msg) => msg.sender_id === currentUserId;

const showSenderName = (index) => {
  if (index === 0) return true;
  return messages.value[index - 1].sender_id !== messages.value[index].sender_id;
};

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  if (diff < 86400000) return formatTime(dateStr);
  if (diff < 172800000) return t('chat.yesterday');
  return d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

const fetchMessages = async (chatId) => {
  if (!chatId) return;
  loadingMessages.value = true;
  try {
    const response = await axios.post(`/chat/messages`, { chat_id: chatId });
    messages.value = response.data;
    scrollToBottom();
  } finally {
    loadingMessages.value = false;
  }
};

const subscribeToChat = (chatId) => {
  if (currentChannel) {
    currentChannel.unsubscribe();
    currentChannel.detach();
  }
  if (!ably || !chatId) return;

  currentChannel = ably.channels.get(`chat.${chatId}`);
  currentChannel.subscribe("message", (message) => {
    if (message.data.sender_id === currentUserId) return;
    messages.value.push(message.data);
    scrollToBottom();
    updateChatListLastMessage(chatId, message.data);
  });
};

const updateChatListLastMessage = (chatId, msg) => {
  const chat = chatList.value.find(c => c.id === chatId);
  if (chat) {
    chat.last_message = msg.content;
    chat.last_message_at = msg.created_at;
    chat.last_sender_name = msg.sender?.name;
  }
};

const selectChat = (chatId) => {
  selectedChatId.value = chatId;
  fetchMessages(chatId);
  subscribeToChat(chatId);
  markAsRead(chatId);
  // Clear unread count locally
  const chat = chatList.value.find(c => c.id === chatId);
  if (chat) chat.unread_count = 0;
  if (window.innerWidth < 768) {
    showSidebar.value = false;
  }
};

const markAsRead = async (chatId) => {
  try {
    await axios.post(`/chat/${chatId}/read`);
  } catch (e) {}
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedChatId.value) return;

  const content = newMessage.value;
  newMessage.value = "";

  const optimisticMsg = {
    id: Date.now(),
    chat_id: selectedChatId.value,
    sender_id: currentUserId,
    content: content,
    created_at: new Date().toISOString(),
    sender: page.props.auth.user,
  };
  messages.value.push(optimisticMsg);
  scrollToBottom();
  updateChatListLastMessage(selectedChatId.value, optimisticMsg);

  try {
    await axios.post(`/chat/${selectedChatId.value}/send-message`, {
      sender_id: currentUserId,
      content: content,
    });
  } catch (err) {
    messages.value = messages.value.filter(m => m.id !== optimisticMsg.id);
  }
};

const startChatWith = async (user) => {
  try {
    const response = await axios.post('/chat/create', {
      user_ids: [currentUserId, user.id],
      is_group: false,
      name: null,
    });

    const chatId = response.data.chat_id;
    showNewChatModal.value = false;
    searchUser.value = "";

    if (!chatList.value.find(c => c.id === chatId)) {
      chatList.value.unshift({
        id: chatId,
        name: user.name,
        avatar: user.avatar,
        is_group: false,
        last_message: null,
        last_message_at: null,
        last_sender_name: null,
        participants_count: 2,
      });
    }

    selectChat(chatId);
  } catch (err) {
    console.error('Failed to create chat:', err);
  }
};

const backToList = () => {
  showSidebar.value = true;
};

watch(messages, () => scrollToBottom(), { deep: true });

onMounted(() => {
  ably = new Realtime({
    key: ablyKey,
    clientId: `${currentUserId}`,
  });

  if (selectedChatId.value) {
    fetchMessages(selectedChatId.value);
    subscribeToChat(selectedChatId.value);
    if (window.innerWidth < 768) {
      showSidebar.value = false;
    }
  }
});

onUnmounted(() => {
  if (currentChannel) {
    currentChannel.unsubscribe();
    currentChannel.detach();
  }
  if (ably) {
    ably.close();
  }
});
</script>

<template>
  <Head :title="t('chat.title')" />

  <AppLayout>
    <div class="flex h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] bg-base-100 rounded-2xl border border-base-300 shadow-xs overflow-hidden -mx-1 sm:mx-0">

      <!-- Sidebar: Chat List -->
      <div
        class="border-r border-base-300 flex flex-col shrink-0 bg-base-100"
        :class="showSidebar ? 'w-full md:w-80' : 'hidden md:flex md:w-80'"
      >
        <div class="px-4 py-3 border-b border-base-300 flex items-center justify-between shrink-0">
          <h2 class="text-base font-bold text-base-content m-0">{{ t('chat.title') }}</h2>
          <button
            @click="showNewChatModal = true"
            class="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors text-sm"
          >+</button>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="chatList.length === 0" class="flex flex-col items-center justify-center h-full text-center px-4">
            <span class="text-3xl mb-2">💬</span>
            <p class="text-sm text-base-content/50 m-0">{{ t('chat.noChats') }}</p>
          </div>

          <div
            v-for="chat in chatList"
            :key="chat.id"
            class="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-base-200 transition-colors border-b border-base-200/50"
            :class="selectedChatId === chat.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''"
            @click="selectChat(chat.id)"
          >
            <UserAvatar :src="chat.avatar" :name="chat.name" size="md" rounded="full" class="shrink-0" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-base-content truncate">{{ chat.name }}</span>
                <span class="text-[10px] text-base-content/40 shrink-0 ml-2">{{ formatDate(chat.last_message_at) }}</span>
              </div>
              <p class="text-xs text-base-content/50 m-0 mt-0.5 truncate">
                <template v-if="chat.last_message">
                  <span v-if="chat.is_group" class="text-base-content/60">{{ chat.last_sender_name?.split(' ')[0] }}: </span>
                  {{ chat.last_message }}
                </template>
                <template v-else>
                  <span class="italic">{{ t('chat.noMessages') }}</span>
                </template>
              </p>
            </div>
            <div class="flex flex-col items-end gap-1 shrink-0">
              <span v-if="chat.is_group" class="badge badge-xs badge-ghost">{{ chat.participants_count }}</span>
              <span
                v-if="chat.unread_count > 0"
                class="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold leading-none"
              >{{ chat.unread_count > 99 ? '99+' : chat.unread_count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Chat Area -->
      <div
        class="flex-1 flex flex-col min-w-0"
        :class="showSidebar ? 'hidden md:flex' : 'flex'"
      >
        <div v-if="!selectedChatId" class="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div class="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <span class="text-4xl">💬</span>
          </div>
          <h3 class="text-lg font-bold text-base-content m-0 mb-1">{{ t('chat.selectChat') }}</h3>
          <p class="text-sm text-base-content/50 m-0">{{ t('chat.selectChatDesc') }}</p>
        </div>

        <template v-else>
          <!-- Chat Header -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-base-300 shrink-0 bg-base-200/50">
            <button
              @click="backToList"
              class="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-base-200 border-0 cursor-pointer text-base-content/60 hover:bg-base-300 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <UserAvatar :src="selectedChat?.avatar" :name="selectedChat?.name" size="md" rounded="full" class="shrink-0" />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-bold text-base-content m-0 truncate">{{ selectedChat?.name }}</h3>
              <p class="text-[10px] text-base-content/50 m-0">{{ messages.length }} {{ t('chat.messages') }}</p>
            </div>
          </div>

          <!-- Messages -->
          <div ref="messagesContainer" class="flex-1 overflow-y-auto py-4 px-4 space-y-3 min-h-0 bg-base-200/30">
            <div v-if="loadingMessages" class="flex items-center justify-center h-full">
              <span class="loading loading-spinner loading-md text-primary"></span>
            </div>

            <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-center">
              <span class="text-3xl mb-2">👋</span>
              <p class="text-sm text-base-content/50 m-0">{{ t('chat.startChat') }}</p>
            </div>

            <div
              v-for="(msg, index) in messages"
              :key="msg.id || index"
              class="flex gap-2"
              :class="isMyMessage(msg) ? 'flex-row-reverse' : 'flex-row'"
            >
              <div v-if="!isMyMessage(msg)" class="shrink-0 self-end">
                <UserAvatar :src="msg.sender?.avatar" :name="msg.sender?.name" size="sm" rounded="full" />
              </div>
              <div class="max-w-[75%]">
                <p
                  v-if="!isMyMessage(msg) && showSenderName(index)"
                  class="text-[10px] text-base-content/50 m-0 mb-0.5 ml-1"
                >{{ msg.sender?.name || 'Unknown' }}</p>
                <div
                  class="px-3 py-2 text-sm leading-relaxed"
                  :class="isMyMessage(msg)
                    ? 'bg-primary text-white rounded-2xl rounded-br-md'
                    : 'bg-base-100 text-base-content border border-base-300 rounded-2xl rounded-bl-md'"
                >{{ msg.content }}</div>
                <p
                  class="text-[10px] text-base-content/40 m-0 mt-0.5"
                  :class="isMyMessage(msg) ? 'text-right mr-1' : 'ml-1'"
                >{{ formatTime(msg.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Input -->
          <div class="shrink-0 px-4 py-3 border-t border-base-300 bg-base-100">
            <div class="flex items-center gap-2">
              <input
                v-model="newMessage"
                @keyup.enter="sendMessage"
                type="text"
                :placeholder="t('chat.typePlaceholder')"
                class="flex-1 px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden transition-all"
              />
              <button
                @click="sendMessage"
                :disabled="!newMessage.trim()"
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary hover:bg-primary/80 text-white border-0 cursor-pointer transition-colors shrink-0 active:scale-[0.95] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- New Chat Modal -->
    <dialog class="modal" :class="{ 'modal-open': showNewChatModal }">
      <div class="modal-box max-w-sm p-0">
        <div class="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 class="text-base font-bold text-base-content m-0">{{ t('chat.newChat') }}</h3>
          <button @click="showNewChatModal = false; searchUser = ''" class="w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors">
            <span class="text-base-content/60 text-sm">✕</span>
          </button>
        </div>
        <div class="px-4 pb-2">
          <input
            v-model="searchUser"
            type="text"
            :placeholder="t('chat.searchUser')"
            class="w-full px-3 py-2 rounded-lg border border-base-300 bg-base-100 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-hidden"
          />
        </div>
        <div class="max-h-80 overflow-y-auto px-2 pb-4">
          <div v-if="filteredUsers.length === 0" class="text-center py-6 text-sm text-base-content/50">{{ t('chat.noUsers') }}</div>
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"
            @click="startChatWith(user)"
          >
            <UserAvatar :src="user.avatar" :name="user.name" size="sm" rounded="full" />
            <span class="text-sm font-medium text-base-content truncate">{{ user.name }}</span>
          </div>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showNewChatModal = false; searchUser = ''">close</button>
      </form>
    </dialog>
  </AppLayout>
</template>
