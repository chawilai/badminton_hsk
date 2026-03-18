<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { Head, Link, router, usePage } from "@inertiajs/vue3";
import { ref, computed, onMounted } from "vue";
import { useToast } from "@/composables/useToast";

const toast = useToast();
const page = usePage();

const props = defineProps({
  feedbacks: { type: Array, default: () => [] },
});

const activeFilter = ref('all');

const filters = [
  { key: 'all', label: 'ทั้งหมด' },
  { key: 'pending', label: 'รอตรวจสอบ' },
  { key: 'reviewed', label: 'พิจารณา' },
  { key: 'resolved', label: 'แก้ไขแล้ว' },
  { key: 'closed', label: 'ปิดแล้ว' },
];

const filteredFeedbacks = computed(() => {
  if (activeFilter.value === 'all') return props.feedbacks;
  return props.feedbacks.filter(fb => fb.status === activeFilter.value);
});

const typeIcon = (type) => {
  const map = { feedback: '💬', feature_request: '💡', bug_report: '🐛' };
  return map[type] || '💬';
};

const typeLabel = (type) => {
  const map = { feedback: 'ข้อเสนอแนะ', feature_request: 'ขอฟีเจอร์', bug_report: 'แจ้งปัญหา' };
  return map[type] || type;
};

const typeBadgeClass = (type) => {
  const map = { feedback: 'bg-info/15 text-info', feature_request: 'bg-warning/15 text-warning', bug_report: 'bg-error/15 text-error' };
  return map[type] || 'bg-base-200 text-base-content/60';
};

const statusBadgeClass = (status) => {
  const map = { pending: 'badge-warning', reviewed: 'badge-info', resolved: 'badge-success', closed: 'badge-ghost' };
  return map[status] || 'badge-ghost';
};

const statusLabel = (status) => {
  const map = { pending: 'รอตรวจสอบ', reviewed: 'กำลังพิจารณา', resolved: 'แก้ไขแล้ว', closed: 'ปิดแล้ว' };
  return map[status] || status;
};

const statuses = ['pending', 'reviewed', 'resolved', 'closed'];

const updateStatus = (feedbackId, newStatus) => {
  router.patch(`/admin/feedbacks/${feedbackId}/status`, { status: newStatus }, {
    preserveScroll: true,
    onSuccess: () => {
      toast.add({ severity: 'success', summary: 'อัพเดทสถานะ + แจ้ง LINE เรียบร้อย', life: 2000 });
    },
  });
};

// Reply
const replyText = ref({});
const replySubmitting = ref({});

const submitReply = (feedbackId) => {
  const msg = replyText.value[feedbackId]?.trim();
  if (!msg || replySubmitting.value[feedbackId]) return;

  replySubmitting.value[feedbackId] = true;
  router.post(`/admin/feedbacks/${feedbackId}/reply`, { message: msg }, {
    preserveScroll: true,
    onSuccess: () => {
      replyText.value[feedbackId] = '';
      toast.add({ severity: 'success', summary: 'ตอบกลับ + แจ้ง LINE เรียบร้อย', life: 2000 });
    },
    onFinish: () => {
      replySubmitting.value[feedbackId] = false;
    },
  });
};

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${months[d.getMonth()]} ${hours}:${mins}`;
};

// Expanded card
const expandedId = ref(null);
const toggleExpand = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

onMounted(() => {
  if (page.props.flash?.success) {
    toast.add({ severity: 'success', summary: page.props.flash.success, life: 3000 });
  }
});
</script>

<template>
  <Head title="Admin - Feedback" />

  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <Link href="/admin" class="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center no-underline hover:bg-base-300 transition-colors">
          <svg class="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <div>
          <div class="text-lg font-bold text-base-content m-0">ข้อเสนอแนะทั้งหมด</div>
          <p class="text-xs text-base-content/50 m-0">{{ feedbacks.length }} รายการ</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-1 overflow-x-auto pb-1">
        <button
          v-for="f in filters"
          :key="f.key"
          @click="activeFilter = f.key"
          class="px-3 py-1.5 rounded-lg text-[11px] font-semibold border-0 cursor-pointer transition-all whitespace-nowrap shrink-0"
          :class="activeFilter === f.key
            ? 'bg-primary text-white'
            : 'bg-base-200 text-base-content/60 hover:bg-base-300'"
        >
          {{ f.label }}
          <span v-if="f.key !== 'all'" class="ml-0.5 opacity-70">
            ({{ feedbacks.filter(fb => fb.status === f.key).length }})
          </span>
        </button>
      </div>

      <!-- Feedback List -->
      <div v-if="filteredFeedbacks.length > 0" class="space-y-2">
        <div
          v-for="fb in filteredFeedbacks"
          :key="fb.id"
          class="bg-base-100 rounded-xl border border-base-300 overflow-hidden"
        >
          <!-- Card header (clickable) -->
          <div class="p-3 cursor-pointer hover:bg-base-200/50 transition-colors" @click="toggleExpand(fb.id)">
            <div class="flex items-start gap-3">
              <span class="text-lg mt-0.5">{{ typeIcon(fb.type) }}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5 mb-0.5">
                  <span class="text-xs font-bold text-base-content truncate">{{ fb.subject }}</span>
                </div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="px-1.5 py-0.5 rounded text-[9px] font-bold" :class="typeBadgeClass(fb.type)">{{ typeLabel(fb.type) }}</span>
                  <span class="badge badge-xs" :class="statusBadgeClass(fb.status)">{{ statusLabel(fb.status) }}</span>
                  <span class="text-[10px] text-base-content/40">{{ formatDate(fb.created_at) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <UserAvatar :src="fb.user?.avatar" :name="fb.user?.name" size="xs" rounded="full" />
                <svg class="w-3 h-3 text-base-content/30 transition-transform" :class="{ 'rotate-180': expandedId === fb.id }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>

          <!-- Expanded detail -->
          <div v-if="expandedId === fb.id" class="border-t border-base-200 p-3 space-y-3 bg-base-200/30">
            <!-- User info -->
            <div class="flex items-center gap-2">
              <UserAvatar :src="fb.user?.avatar" :name="fb.user?.name" size="sm" rounded="full" />
              <div>
                <div class="text-xs font-bold text-base-content">{{ fb.user?.name }}</div>
                <div class="text-[10px] text-base-content/40">{{ fb.user?.email }}</div>
              </div>
            </div>

            <!-- Description -->
            <div class="bg-base-100 rounded-lg p-3">
              <div class="text-[10px] font-semibold text-base-content/50 mb-1 uppercase">รายละเอียด</div>
              <p class="text-xs text-base-content m-0 whitespace-pre-wrap">{{ fb.description }}</p>
            </div>

            <!-- Screenshot -->
            <div v-if="fb.screenshot_path" class="bg-base-100 rounded-lg p-3">
              <div class="text-[10px] font-semibold text-base-content/50 mb-1 uppercase">ภาพหน้าจอ</div>
              <img :src="'/storage/' + fb.screenshot_path" class="max-w-full rounded-lg border border-base-300" />
            </div>

            <!-- Replies -->
            <div v-if="fb.replies?.length > 0">
              <div class="text-[10px] font-semibold text-base-content/50 mb-1.5 uppercase">การสนทนา ({{ fb.replies.length }})</div>
              <div class="space-y-2">
                <div
                  v-for="reply in fb.replies"
                  :key="reply.id"
                  class="rounded-lg p-2.5 flex items-start gap-2"
                  :class="reply.is_admin ? 'bg-primary/10 ml-4' : 'bg-base-100 mr-4'"
                >
                  <UserAvatar :src="reply.user?.avatar" :name="reply.user?.name" size="xs" rounded="full" class="mt-0.5" />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="text-[10px] font-bold text-base-content">{{ reply.user?.name }}</span>
                      <span v-if="reply.is_admin" class="px-1 py-0.5 rounded text-[8px] font-bold bg-primary/20 text-primary">ADMIN</span>
                      <span class="text-[9px] text-base-content/30">{{ formatDate(reply.created_at) }}</span>
                    </div>
                    <p class="text-xs text-base-content/80 m-0 mt-0.5 whitespace-pre-wrap">{{ reply.message }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reply form -->
            <div class="bg-base-100 rounded-lg p-3">
              <div class="text-[10px] font-semibold text-base-content/50 mb-1.5 uppercase">ตอบกลับ</div>
              <div class="flex gap-2">
                <textarea
                  v-model="replyText[fb.id]"
                  rows="2"
                  class="textarea textarea-bordered textarea-sm flex-1 text-xs"
                  placeholder="พิมพ์คำตอบ..."
                  maxlength="2000"
                  @click.stop
                ></textarea>
                <button
                  @click.stop="submitReply(fb.id)"
                  :disabled="!replyText[fb.id]?.trim() || replySubmitting[fb.id]"
                  class="self-end h-8 px-3 rounded-lg text-[10px] font-semibold border-0 cursor-pointer bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.97] shrink-0"
                >
                  <span v-if="replySubmitting[fb.id]" class="loading loading-spinner loading-xs"></span>
                  <span v-else>ส่ง</span>
                </button>
              </div>
              <div class="text-[9px] text-base-content/30 mt-1">จะส่ง LINE แจ้งผู้ใช้อัตโนมัติ</div>
            </div>

            <!-- Status update -->
            <div>
              <div class="text-[10px] font-semibold text-base-content/50 mb-1.5 uppercase">เปลี่ยนสถานะ</div>
              <div class="flex gap-1.5 flex-wrap">
                <button
                  v-for="s in statuses"
                  :key="s"
                  @click.stop="updateStatus(fb.id, s)"
                  class="px-2.5 py-1 rounded-lg text-[10px] font-semibold border-0 cursor-pointer transition-all active:scale-[0.97]"
                  :class="fb.status === s
                    ? 'bg-primary text-white'
                    : 'bg-base-200 text-base-content/60 hover:bg-base-300'"
                >
                  {{ statusLabel(s) }}
                </button>
              </div>
              <div class="text-[9px] text-base-content/30 mt-1">จะส่ง LINE แจ้งผู้ใช้อัตโนมัติ</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-12 bg-base-100 rounded-xl border border-base-300">
        <span class="text-3xl">📭</span>
        <p class="text-xs text-base-content/50 mt-2 m-0">ไม่มีข้อเสนอแนะในหมวดนี้</p>
      </div>
    </div>
  </AppLayout>
</template>
