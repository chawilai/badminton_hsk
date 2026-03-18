<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { Head, usePage, router, Link } from "@inertiajs/vue3";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import { Realtime } from "ably";
import axios from "axios";

const { t } = useLocale();
const toast = useToast();
const { confirm } = useConfirm();
const page = usePage();

const props = defineProps({
  friends: { type: Array, default: () => [] },
  receivedRequests: { type: Array, default: () => [] },
  sentRequests: { type: Array, default: () => [] },
  ably_key: { type: String, default: null },
});

const activeTab = ref("friends");

const tabs = computed(() => [
  { key: "friends", label: t("friends.myFriends"), icon: "👥", count: props.friends.length },
  { key: "received", label: t("friends.received"), icon: "📥", count: props.receivedRequests.length },
  { key: "sent", label: t("friends.sent"), icon: "📤", count: props.sentRequests.length },
]);

const reloadData = () => {
  router.reload({
    preserveScroll: true,
    only: ["friends", "receivedRequests", "sentRequests"],
  });
};

// === Actions ===
const acceptRequest = async (friendshipId) => {
  try {
    await axios.post(`/friends/${friendshipId}/accept`);
    toast.add({
      severity: "success",
      summary: t("friends.accept"),
      detail: t("friends.requestAccepted"),
      life: 3000,
    });
    reloadData();
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e.response?.data?.message || "Something went wrong",
      life: 3000,
    });
  }
};

const declineRequest = async (friendshipId) => {
  try {
    await axios.delete(`/friends/${friendshipId}`);
    toast.add({
      severity: "info",
      summary: t("friends.decline"),
      detail: t("friends.decline"),
      life: 3000,
    });
    reloadData();
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e.response?.data?.message || "Something went wrong",
      life: 3000,
    });
  }
};

const cancelRequest = async (friendshipId) => {
  try {
    await axios.delete(`/friends/${friendshipId}`);
    toast.add({
      severity: "info",
      summary: t("friends.cancel"),
      detail: t("friends.cancel"),
      life: 3000,
    });
    reloadData();
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e.response?.data?.message || "Something went wrong",
      life: 3000,
    });
  }
};

const unfriend = (friendshipId, friendName) => {
  confirm({
    message: `${t("friends.unfriend")} ${friendName}?`,
    header: t("friends.unfriend"),
    accept: async () => {
      try {
        await axios.delete(`/friends/${friendshipId}`);
        toast.add({
          severity: "info",
          summary: t("friends.unfriend"),
          detail: t("friends.unfriend"),
          life: 3000,
        });
        reloadData();
      } catch (e) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: e.response?.data?.message || "Something went wrong",
          life: 3000,
        });
      }
    },
  });
};

const goToChat = async (friendUserId) => {
  try {
    const res = await axios.post('/chat/create', {
      user_ids: [page.props.auth.user.id, friendUserId],
      is_group: false,
      name: null,
    });
    router.visit(`/chat?chatId=${res.data.chat_id}`);
  } catch (e) {
    router.visit("/chat");
  }
};

// === Real-time via Ably ===
let ablyInstance = null;
let friendsChannel = null;

onMounted(() => {
  const ablyKey = props.ably_key || page.props.ably_key;
  if (ablyKey) {
    ablyInstance = new Realtime({
      key: ablyKey,
      clientId: `${page.props.auth.user.id}`,
    });

    friendsChannel = ablyInstance.channels.get(
      `friends.${page.props.auth.user.id}`
    );
    friendsChannel.subscribe(() => {
      reloadData();
    });
  }
});

onUnmounted(() => {
  if (friendsChannel) {
    friendsChannel.unsubscribe();
    friendsChannel.detach();
  }
  if (ablyInstance) {
    ablyInstance.close();
  }
});
</script>

<template>
  <Head :title="t('friends.title')" />

  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-base font-bold text-base-content m-0">
          {{ t("friends.title") }}
        </h1>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-base-200 rounded-xl">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border-0 relative"
          :class="
            activeTab === tab.key
              ? 'bg-primary text-primary-content shadow-sm'
              : 'bg-transparent text-base-content/50 hover:text-base-content hover:bg-base-300/50'
          "
          @click="activeTab = tab.key"
        >
          <span>{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span
            class="min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full text-[9px] font-bold"
            :class="
              tab.count > 0
                ? (activeTab === tab.key ? 'bg-primary-content text-primary' : 'bg-base-content/20 text-base-content/70')
                : 'bg-base-content/10 text-base-content/30'
            "
            >{{ tab.count }}</span
          >
        </button>
      </div>

      <!-- Tab: Friends List -->
      <div v-show="activeTab === 'friends'">
        <div
          v-if="friends.length === 0"
          class="text-center py-8 bg-base-100 rounded-xl border border-base-300"
        >
          <span class="text-3xl">👥</span>
          <p class="text-xs text-base-content/50 mt-2 m-0">
            {{ t("friends.noFriends") }}
          </p>
        </div>
        <div class="space-y-2">
          <div
            v-for="friend in friends"
            :key="friend.id"
            class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
          >
            <UserAvatar
              :src="friend.user?.avatar"
              :name="friend.user?.name"
              size="md"
              rounded="full"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-base-content truncate">
                {{ friend.user?.name }}
              </div>
              <div
                v-if="friend.user?.badminton_rank"
                class="text-[10px] text-base-content/50"
              >
                {{
                  friend.user.badminton_rank?.education_rank ||
                  `Lv${friend.user.badminton_rank_id}`
                }}
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                @click="goToChat(friend.user?.id)"
                class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-info/10 text-info border-0 cursor-pointer hover:bg-info/20 transition-colors"
              >
                {{ t("friends.chat") }}
              </button>
              <button
                @click="unfriend(friend.id, friend.user?.name)"
                class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors"
              >
                {{ t("friends.unfriend") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Received Requests -->
      <div v-show="activeTab === 'received'">
        <div
          v-if="receivedRequests.length === 0"
          class="text-center py-8 bg-base-100 rounded-xl border border-base-300"
        >
          <span class="text-3xl">📥</span>
          <p class="text-xs text-base-content/50 mt-2 m-0">
            {{ t("friends.noRequests") }}
          </p>
        </div>
        <div class="space-y-2">
          <div
            v-for="request in receivedRequests"
            :key="request.id"
            class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
          >
            <UserAvatar
              :src="request.sender?.avatar"
              :name="request.sender?.name"
              size="md"
              rounded="full"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-base-content truncate">
                {{ request.sender?.name }}
              </div>
              <div class="text-[10px] text-base-content/50">
                {{ t("friends.pending") }}
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                @click="acceptRequest(request.id)"
                class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-success/10 text-success border-0 cursor-pointer hover:bg-success/20 transition-colors"
              >
                {{ t("friends.accept") }}
              </button>
              <button
                @click="declineRequest(request.id)"
                class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors"
              >
                {{ t("friends.decline") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Sent Requests -->
      <div v-show="activeTab === 'sent'">
        <div
          v-if="sentRequests.length === 0"
          class="text-center py-8 bg-base-100 rounded-xl border border-base-300"
        >
          <span class="text-3xl">📤</span>
          <p class="text-xs text-base-content/50 mt-2 m-0">
            {{ t("friends.noRequests") }}
          </p>
        </div>
        <div class="space-y-2">
          <div
            v-for="request in sentRequests"
            :key="request.id"
            class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
          >
            <UserAvatar
              :src="request.receiver?.avatar"
              :name="request.receiver?.name"
              size="md"
              rounded="full"
            />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-bold text-base-content truncate">
                {{ request.receiver?.name }}
              </div>
              <div class="text-[10px] text-base-content/50">
                {{ t("friends.pending") }}
              </div>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                @click="cancelRequest(request.id)"
                class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-warning/10 text-warning border-0 cursor-pointer hover:bg-warning/20 transition-colors"
              >
                {{ t("friends.cancel") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
