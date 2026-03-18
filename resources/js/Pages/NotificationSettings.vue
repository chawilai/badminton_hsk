<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { Head, Link, router, usePage } from "@inertiajs/vue3";
import { ref, reactive, onMounted } from "vue";
import { useToast } from "@/composables/useToast";

const toast = useToast();
const page = usePage();

const props = defineProps({
  settings: { type: Object, default: () => ({}) },
  recentLogs: { type: Array, default: () => [] },
  hasLineAccount: { type: Boolean, default: false },
});

const form = reactive({
  enabled: props.settings.enabled ?? true,
  party_invite: props.settings.party_invite ?? true,
  party_reminder: props.settings.party_reminder ?? true,
  game_start: props.settings.game_start ?? true,
  game_result: props.settings.game_result ?? true,
  friend_request: props.settings.friend_request ?? true,
  party_member_joined: props.settings.party_member_joined ?? true,
});

const saving = ref(false);
const testing = ref(false);

const notifTypes = [
  { key: 'party_invite', icon: '🎉', label: 'ถูกเชิญเข้าปาร์ตี้', desc: 'เมื่อมีคนเชิญคุณเข้าร่วมปาร์ตี้' },
  { key: 'party_reminder', icon: '⏰', label: 'เตือนก่อนเล่น', desc: 'แจ้งเตือนก่อนถึงเวลาเล่น' },
  { key: 'game_start', icon: '🏸', label: 'เกมเริ่มแล้ว', desc: 'เมื่อเกมที่คุณอยู่เริ่มเล่น' },
  { key: 'game_result', icon: '🏆', label: 'ผลเกม', desc: 'สรุปผลเกมเมื่อเล่นจบ' },
  { key: 'friend_request', icon: '👋', label: 'คำขอเป็นเพื่อน', desc: 'เมื่อมีคนส่งคำขอเป็นเพื่อน' },
  { key: 'party_member_joined', icon: '👥', label: 'สมาชิกใหม่เข้าปาร์ตี้', desc: 'เมื่อมีคนเข้าร่วมปาร์ตี้ของคุณ' },
];

const saveSettings = () => {
  saving.value = true;
  router.patch('/notifications/settings', form, {
    preserveScroll: true,
    onSuccess: () => {
      toast.add({ severity: 'success', summary: 'บันทึกการตั้งค่าเรียบร้อย', life: 2000 });
    },
    onFinish: () => {
      saving.value = false;
    },
  });
};

const sendTest = () => {
  testing.value = true;
  router.post('/notifications/test', {}, {
    preserveScroll: true,
    onSuccess: () => {
      if (page.props.flash?.success) {
        toast.add({ severity: 'success', summary: page.props.flash.success, life: 3000 });
      } else if (page.props.flash?.error) {
        toast.add({ severity: 'error', summary: page.props.flash.error, life: 3000 });
      }
    },
    onFinish: () => {
      testing.value = false;
    },
  });
};

const statusIcon = (status) => {
  const map = { sent: '✅', failed: '❌', skipped: '⏭️', pending: '⏳' };
  return map[status] || '❓';
};

const typeIcon = (type) => {
  const map = { party_invite: '🎉', party_reminder: '⏰', game_start: '🏸', game_result: '🏆', friend_request: '👋', party_member_joined: '👥' };
  return map[type] || '🔔';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${months[d.getMonth()]} ${h}:${m}`;
};

onMounted(() => {
  if (page.props.flash?.success) {
    toast.add({ severity: 'success', summary: page.props.flash.success, life: 3000 });
  }
});
</script>

<template>
  <Head title="ตั้งค่าแจ้งเตือน" />

  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <Link href="/profile" class="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center no-underline hover:bg-base-300 transition-colors">
          <svg class="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <div>
          <div class="text-lg font-bold text-base-content m-0">ตั้งค่าแจ้งเตือน</div>
          <p class="text-xs text-base-content/50 m-0">แจ้งเตือนผ่าน LINE OA</p>
        </div>
      </div>

      <!-- LINE Status -->
      <div class="rounded-xl border p-3 flex items-center gap-3"
        :class="hasLineAccount ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'">
        <span class="text-2xl">{{ hasLineAccount ? '✅' : '⚠️' }}</span>
        <div class="flex-1">
          <div class="text-xs font-bold" :class="hasLineAccount ? 'text-success' : 'text-warning'">
            {{ hasLineAccount ? 'เชื่อมต่อ LINE แล้ว' : 'ยังไม่ได้เชื่อมต่อ LINE' }}
          </div>
          <div class="text-[10px] text-base-content/50">
            {{ hasLineAccount ? 'พร้อมรับแจ้งเตือนผ่าน LINE OA' : 'ต้องล็อกอินด้วย LINE เพื่อรับแจ้งเตือน' }}
          </div>
        </div>
      </div>

      <!-- Master Toggle -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl">🔔</span>
            <div>
              <div class="text-sm font-bold text-base-content">เปิดแจ้งเตือนทั้งหมด</div>
              <div class="text-[10px] text-base-content/50">เปิด/ปิดการแจ้งเตือน LINE ทุกประเภท</div>
            </div>
          </div>
          <input type="checkbox" class="toggle toggle-primary toggle-sm" v-model="form.enabled" @change="saveSettings" />
        </div>
      </div>

      <!-- Individual Settings -->
      <div v-if="form.enabled" class="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
        <div class="px-4 py-2.5 border-b border-base-200">
          <div class="text-xs font-bold text-base-content/60 uppercase tracking-wide">ประเภทแจ้งเตือน</div>
        </div>
        <div
          v-for="(nt, idx) in notifTypes"
          :key="nt.key"
          class="flex items-center justify-between px-4 py-3"
          :class="{ 'border-t border-base-200': idx > 0 }"
        >
          <div class="flex items-center gap-3">
            <span class="text-lg">{{ nt.icon }}</span>
            <div>
              <div class="text-xs font-semibold text-base-content">{{ nt.label }}</div>
              <div class="text-[10px] text-base-content/40">{{ nt.desc }}</div>
            </div>
          </div>
          <input type="checkbox" class="toggle toggle-primary toggle-xs" v-model="form[nt.key]" @change="saveSettings" />
        </div>
      </div>

      <!-- Test Button -->
      <button
        v-if="hasLineAccount"
        @click="sendTest"
        :disabled="testing || !form.enabled"
        class="w-full h-10 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all active:scale-[0.98] bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <span v-if="testing" class="loading loading-spinner loading-xs"></span>
        {{ testing ? 'กำลังส่ง...' : '🧪 ทดสอบส่งแจ้งเตือน' }}
      </button>

      <!-- Recent Logs -->
      <div v-if="recentLogs.length > 0" class="space-y-2">
        <div class="text-sm font-bold text-base-content">ประวัติแจ้งเตือน</div>
        <div
          v-for="log in recentLogs"
          :key="log.id"
          class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-start gap-3"
        >
          <span class="text-sm mt-0.5">{{ typeIcon(log.type) }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-bold text-base-content truncate">{{ log.title }}</div>
            <div class="text-[10px] text-base-content/50 line-clamp-1">{{ log.message }}</div>
            <div class="text-[10px] text-base-content/40 mt-0.5">{{ formatDate(log.created_at) }}</div>
          </div>
          <span class="text-sm shrink-0">{{ statusIcon(log.status) }}</span>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
