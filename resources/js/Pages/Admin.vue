<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { Head, Link, usePage } from "@inertiajs/vue3";
import { onMounted } from "vue";
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";

const { t } = useLocale();
const toast = useToast();
const page = usePage();

const props = defineProps({
  stats: { type: Object, default: () => ({}) },
  recentFeedbacks: { type: Array, default: () => [] },
});

const menuItems = [
  {
    icon: '🏟️',
    label: 'จัดการสนาม',
    desc: 'เพิ่ม แก้ไข ลบสนามแบดมินตัน',
    href: '/courts',
    badge: props.stats.totalCourts,
    badgeClass: 'badge-info',
  },
  {
    icon: '💬',
    label: 'ข้อเสนอแนะ',
    desc: 'ดูความคิดเห็น แจ้งปัญหา ขอฟีเจอร์',
    href: '/admin/feedbacks',
    badge: props.stats.pendingFeedbacks,
    badgeClass: 'badge-warning',
  },
  {
    icon: '👥',
    label: 'ผู้ใช้งาน',
    desc: `ผู้ใช้ทั้งหมด ${props.stats.totalUsers} คน`,
    href: null,
    comingSoon: true,
  },
  {
    icon: '🎉',
    label: 'ปาร์ตี้',
    desc: `ปาร์ตี้ทั้งหมด ${props.stats.totalParties} รายการ`,
    href: null,
    comingSoon: true,
  },
  {
    icon: '⚙️',
    label: 'ตั้งค่าระบบ',
    desc: 'ตั้งค่าทั่วไป ธีม การแจ้งเตือน',
    href: null,
    comingSoon: true,
  },
];

const typeIcon = (type) => {
  const map = { feedback: '💬', feature_request: '💡', bug_report: '🐛' };
  return map[type] || '💬';
};

const typeLabel = (type) => {
  const map = { feedback: 'ข้อเสนอแนะ', feature_request: 'ขอฟีเจอร์', bug_report: 'แจ้งปัญหา' };
  return map[type] || type;
};

const statusBadgeClass = (status) => {
  const map = { pending: 'badge-warning', reviewed: 'badge-info', resolved: 'badge-success', closed: 'badge-ghost' };
  return map[status] || 'badge-ghost';
};

const statusLabel = (status) => {
  const map = { pending: 'รอตรวจสอบ', reviewed: 'กำลังพิจารณา', resolved: 'แก้ไขแล้ว', closed: 'ปิดแล้ว' };
  return map[status] || status;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${day} ${months[d.getMonth()]}`;
};

onMounted(() => {
  if (page.props.flash?.success) {
    toast.add({ severity: 'success', summary: page.props.flash.success, life: 3000 });
  }
});
</script>

<template>
  <Head title="Admin" />

  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <span class="text-2xl">⚙️</span>
          </div>
          <div>
            <div class="text-lg font-bold text-base-content m-0">Admin Panel</div>
            <p class="text-xs text-base-content/50 m-0 mt-0.5">จัดการระบบ</p>
          </div>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-4 gap-2">
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-lg font-black text-primary">{{ stats.totalUsers }}</div>
          <div class="text-[9px] text-base-content/50">ผู้ใช้</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-lg font-black text-info">{{ stats.totalParties }}</div>
          <div class="text-[9px] text-base-content/50">ปาร์ตี้</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-lg font-black text-secondary">{{ stats.totalCourts }}</div>
          <div class="text-[9px] text-base-content/50">สนาม</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-lg font-black text-warning">{{ stats.pendingFeedbacks }}</div>
          <div class="text-[9px] text-base-content/50">รอตรวจ</div>
        </div>
      </div>

      <!-- Menu Items -->
      <div class="space-y-2">
        <div class="text-sm font-bold text-base-content">เมนูจัดการ</div>

        <template v-for="item in menuItems" :key="item.label">
          <Link
            v-if="item.href"
            :href="item.href"
            class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
          >
            <span class="text-2xl">{{ item.icon }}</span>
            <div class="flex-1">
              <div class="text-sm font-bold text-base-content">{{ item.label }}</div>
              <div class="text-[10px] text-base-content/50">{{ item.desc }}</div>
            </div>
            <span v-if="item.badge" class="badge badge-sm" :class="item.badgeClass">{{ item.badge }}</span>
            <svg class="w-4 h-4 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
          </Link>

          <div
            v-else
            class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 opacity-50"
          >
            <span class="text-2xl">{{ item.icon }}</span>
            <div class="flex-1">
              <div class="text-sm font-bold text-base-content">{{ item.label }}</div>
              <div class="text-[10px] text-base-content/50">{{ item.desc }}</div>
            </div>
            <span class="badge badge-xs badge-ghost">เร็วๆ นี้</span>
          </div>
        </template>
      </div>

      <!-- Recent Feedbacks -->
      <div v-if="recentFeedbacks.length > 0" class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="text-sm font-bold text-base-content">ข้อเสนอแนะล่าสุด</div>
          <Link href="/admin/feedbacks" class="text-xs text-primary no-underline">ดูทั้งหมด →</Link>
        </div>
        <div
          v-for="fb in recentFeedbacks"
          :key="fb.id"
          class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-start gap-3"
        >
          <span class="text-lg mt-0.5">{{ typeIcon(fb.type) }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-bold text-base-content truncate">{{ fb.subject }}</div>
            <div class="text-[10px] text-base-content/50 line-clamp-1">{{ fb.description }}</div>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] text-base-content/40">{{ fb.user?.name }} · {{ formatDate(fb.created_at) }}</span>
              <span class="badge badge-xs" :class="statusBadgeClass(fb.status)">{{ statusLabel(fb.status) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
