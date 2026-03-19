<script setup>
import { ref } from "vue";
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import axios from "axios";

const { t } = useLocale();
const toast = useToast();
const { confirm } = useConfirm();

const props = defineProps({
  userId: { type: Number, required: true },
  status: { type: String, default: null },
  friendshipId: { type: Number, default: null },
  iconOnly: { type: Boolean, default: false },
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

const confirmSendRequest = () => {
  confirm({
    header: t("friends.addFriend"),
    message: t("confirm.addFriend"),
    accept: sendRequest,
  });
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

const confirmAcceptRequest = () => {
  confirm({
    header: t("friends.accept"),
    message: t("confirm.acceptFriend"),
    accept: acceptRequest,
  });
};
</script>

<template>
  <!-- Icon-only mode -->
  <template v-if="iconOnly">
    <!-- No status: add friend icon -->
    <button v-if="!currentStatus" @click="confirmSendRequest" :disabled="loading"
      class="w-7 h-7 rounded-lg border-0 cursor-pointer flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 bg-success/10 text-success hover:bg-success/20"
      title="เพิ่มเพื่อน">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
    </button>
    <!-- Pending sent -->
    <span v-else-if="currentStatus === 'pending_sent'"
      class="w-7 h-7 rounded-lg flex items-center justify-center bg-base-200 text-base-content/30" title="รอตอบรับ">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
    </span>
    <!-- Pending received: accept -->
    <button v-else-if="currentStatus === 'pending_received'" @click="confirmAcceptRequest" :disabled="loading"
      class="w-7 h-7 rounded-lg border-0 cursor-pointer flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 bg-info/10 text-info hover:bg-info/20"
      title="ตอบรับเพื่อน">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
    </button>
    <!-- Accepted -->
    <span v-else-if="currentStatus === 'accepted'"
      class="w-7 h-7 rounded-lg flex items-center justify-center bg-success/10 text-success" title="เพื่อนแล้ว">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    </span>
  </template>

  <!-- Text mode (original) -->
  <template v-else>
    <button v-if="!currentStatus" @click="confirmSendRequest" :disabled="loading"
      class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-success/15 text-success border-0 cursor-pointer hover:bg-success/25 transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50">
      {{ loading ? "..." : t("friends.addFriend") }}
    </button>
    <span v-else-if="currentStatus === 'pending_sent'"
      class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-base-200 text-base-content/50 inline-flex items-center whitespace-nowrap">
      {{ t("friends.pending") }}
    </span>
    <button v-else-if="currentStatus === 'pending_received'" @click="confirmAcceptRequest" :disabled="loading"
      class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-info/15 text-info border-0 cursor-pointer hover:bg-info/25 transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50">
      {{ loading ? "..." : t("friends.accept") }}
    </button>
    <span v-else-if="currentStatus === 'accepted'"
      class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-success/15 text-success inline-flex items-center whitespace-nowrap">
      {{ t("friends.isFriend") }} ✓
    </span>
  </template>
</template>
