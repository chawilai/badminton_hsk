<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { Head, router, usePage } from "@inertiajs/vue3";
import { ref, onMounted } from "vue";
import { useToast } from "@/composables/useToast";
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();
const toast = useToast();
const page = usePage();

const props = defineProps({
  party: { type: Object, required: true },
  members: { type: Array, default: () => [] },
  isFull: { type: Boolean, default: false },
});

const joining = ref(false);

const confirmJoin = () => {
  if (joining.value) return;
  joining.value = true;

  router.post(`/party/${props.party.id}/confirm-join`, {}, {
    onSuccess: () => {
      toast.add({ severity: 'success', summary: 'เข้าร่วมปาร์ตี้เรียบร้อย!', life: 3000 });
    },
    onFinish: () => {
      joining.value = false;
    },
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  const months = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
};

const costLabel = () => {
  const p = props.party;
  if (p.cost_type === 'free') return 'ฟรี';
  if (p.cost_type === 'per_person') return `฿${p.cost_amount}/คน`;
  if (p.cost_type === 'split_equal') return `หารเท่า (฿${p.cost_amount}/ชม.)`;
  return '-';
};

onMounted(() => {
  if (page.props.flash?.success) {
    toast.add({ severity: 'success', summary: page.props.flash.success, life: 3000 });
  }
});
</script>

<template>
  <Head title="เข้าร่วมปาร์ตี้" />

  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-3">
          <span class="text-3xl">🏸</span>
        </div>
        <div class="text-lg font-bold text-base-content m-0">{{ party.name || party.court?.name || 'ปาร์ตี้' }}</div>
        <p class="text-xs text-base-content/50 m-0 mt-1">คุณได้รับเชิญเข้าร่วมปาร์ตี้</p>
      </div>

      <!-- Party Details -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">🏟️ สนาม</span>
          <span class="text-sm font-medium text-base-content">{{ party.court?.name || '-' }}</span>
        </div>
        <div v-if="party.court?.address" class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">📍 ที่อยู่</span>
          <span class="text-sm font-medium text-base-content text-right max-w-[60%]">{{ party.court.address }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">📅 วันเล่น</span>
          <span class="text-sm font-medium text-base-content">{{ formatDate(party.play_date) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">⏰ เวลา</span>
          <span class="text-sm font-medium text-base-content">{{ party.start_time?.substring(0,5) }}-{{ party.end_time?.substring(0,5) }} ({{ party.play_hours }} ชม.)</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">🎮 ประเภท</span>
          <span class="text-sm font-medium text-base-content">{{ party.default_game_type === 'double' ? '1v1 เดี่ยว' : '2v2 คู่' }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">👥 ผู้เล่น</span>
          <span class="text-sm font-medium" :class="isFull ? 'text-error' : 'text-base-content'">{{ party.members_count }}/{{ party.max_players }} คน</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">💰 ค่าใช้จ่าย</span>
          <span class="text-sm font-medium text-base-content">{{ costLabel() }}</span>
        </div>
      </div>

      <!-- Notes -->
      <div v-if="party.notes" class="bg-base-100 rounded-xl border border-base-300 p-4">
        <div class="text-xs font-bold text-base-content/60 uppercase mb-1">📝 หมายเหตุ</div>
        <p class="text-sm text-base-content m-0 whitespace-pre-wrap">{{ party.notes }}</p>
      </div>

      <!-- Members List -->
      <div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200">
          <div class="text-sm font-bold text-base-content">👥 สมาชิก ({{ members.length }})</div>
        </div>
        <div class="divide-y divide-base-200">
          <div v-for="member in members" :key="member.id" class="flex items-center gap-3 px-4 py-2.5">
            <UserAvatar :src="member.user?.avatar" :name="member.user?.name" size="sm" rounded="full" />
            <div class="flex-1 min-w-0">
              <div class="text-sm font-medium text-base-content truncate">{{ member.display_name || member.user?.name }}</div>
            </div>
            <span v-if="member.role === 'Host'" class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/15 text-primary">HOST</span>
          </div>
        </div>
      </div>

      <!-- Action -->
      <div class="pt-2">
        <button
          v-if="!isFull"
          @click="confirmJoin"
          :disabled="joining"
          class="w-full h-12 rounded-xl text-base font-bold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="joining" class="loading loading-spinner loading-sm"></span>
          🏸 ยืนยันเข้าร่วม
        </button>
        <div v-else class="w-full h-12 rounded-xl text-base font-bold bg-error/10 text-error flex items-center justify-center">
          ปาร์ตี้เต็มแล้ว
        </div>
      </div>
    </div>
  </AppLayout>
</template>
