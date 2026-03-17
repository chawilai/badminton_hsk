<script setup>
import { ref } from "vue";
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import axios from "axios";

const { t } = useLocale();
const toast = useToast();

const props = defineProps({
  userId: { type: Number, required: true },
  status: { type: String, default: null }, // null, 'pending_sent', 'pending_received', 'accepted'
  friendshipId: { type: Number, default: null },
});

const loading = ref(false);
const currentStatus = ref(props.status);

const sendRequest = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    await axios.post("/friends/send", { receiver_id: props.userId });
    currentStatus.value = "pending_sent";
    toast.add({
      severity: "success",
      summary: t("friends.addFriend"),
      detail: t("friends.requestSent"),
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e.response?.data?.message || "Something went wrong",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const acceptRequest = async () => {
  if (loading.value || !props.friendshipId) return;
  loading.value = true;
  try {
    await axios.post(`/friends/${props.friendshipId}/accept`);
    currentStatus.value = "accepted";
    toast.add({
      severity: "success",
      summary: t("friends.accept"),
      detail: t("friends.requestAccepted"),
      life: 3000,
    });
  } catch (e) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: e.response?.data?.message || "Something went wrong",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <!-- No status: show Add Friend button -->
  <button
    v-if="!currentStatus"
    @click="sendRequest"
    :disabled="loading"
    class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-success/15 text-success border-0 cursor-pointer hover:bg-success/25 transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50"
  >
    {{ loading ? "..." : t("friends.addFriend") }}
  </button>

  <!-- Pending sent: show grey badge -->
  <span
    v-else-if="currentStatus === 'pending_sent'"
    class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-base-200 text-base-content/50 inline-flex items-center whitespace-nowrap"
  >
    {{ t("friends.pending") }}
  </span>

  <!-- Pending received: show Accept button -->
  <button
    v-else-if="currentStatus === 'pending_received'"
    @click="acceptRequest"
    :disabled="loading"
    class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-info/15 text-info border-0 cursor-pointer hover:bg-info/25 transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50"
  >
    {{ loading ? "..." : t("friends.accept") }}
  </button>

  <!-- Accepted: show Friend badge -->
  <span
    v-else-if="currentStatus === 'accepted'"
    class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-success/15 text-success inline-flex items-center whitespace-nowrap"
  >
    {{ t("friends.isFriend") }} ✓
  </span>
</template>
