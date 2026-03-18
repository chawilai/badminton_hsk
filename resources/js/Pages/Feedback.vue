<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { Head, usePage, useForm } from "@inertiajs/vue3";
import { ref, computed, onMounted } from "vue";
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";

const { t } = useLocale();
const toast = useToast();
const page = usePage();

const props = defineProps({
  myFeedbacks: { type: Array, default: () => [] },
});

const types = [
  { key: 'feedback', icon: '💬', color: 'bg-info/15 border-info' },
  { key: 'feature_request', icon: '💡', color: 'bg-warning/15 border-warning' },
  { key: 'bug_report', icon: '🐛', color: 'bg-error/15 border-error' },
];

const form = useForm({
  type: 'feedback',
  subject: '',
  description: '',
  screenshot: null,
});

const previewUrl = ref(null);
const expandedId = ref(null);
const toggleExpand = (id) => { expandedId.value = expandedId.value === id ? null : id; };

const isValid = computed(() => form.type && form.subject.trim() && form.description.trim());

const subjectPlaceholder = computed(() => t('feedback.subjectPlaceholder_' + form.type));
const descriptionPlaceholder = computed(() => t('feedback.descPlaceholder_' + form.type));

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    form.screenshot = file;
    previewUrl.value = URL.createObjectURL(file);
  }
};

const removeScreenshot = () => {
  form.screenshot = null;
  previewUrl.value = null;
};

const submitFeedback = () => {
  if (form.processing || !isValid.value) return;

  form.post('/feedback', {
    forceFormData: true,
    onSuccess: () => {
      form.reset();
      previewUrl.value = null;
      toast.add({ severity: 'success', summary: t('feedback.successMessage'), life: 3000 });
    },
  });
};

const typeIcon = (type) => {
  const map = { feedback: '💬', feature_request: '💡', bug_report: '🐛' };
  return map[type] || '💬';
};

const typeIconBg = (type) => {
  const map = {
    feedback: 'bg-info/15',
    feature_request: 'bg-warning/15',
    bug_report: 'bg-error/15',
  };
  return map[type] || 'bg-base-200';
};

const statusBadgeClass = (status) => {
  const map = {
    pending: 'badge-warning',
    reviewed: 'badge-info',
    resolved: 'badge-success',
    closed: 'badge-ghost',
  };
  return map[status] || 'badge-ghost';
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
  <Head :title="t('feedback.title')" />

  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="bg-gradient-to-br from-info/10 to-info/5 rounded-2xl p-5 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-info/10 rounded-2xl mb-3">
          <span class="text-3xl">💬</span>
        </div>
        <div class="text-lg font-bold text-base-content m-0">{{ t('feedback.title') }}</div>
        <p class="text-xs text-base-content/50 m-0 mt-1">{{ t('feedback.subtitle') }}</p>
      </div>

      <!-- Type Selector -->
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="tp in types"
          :key="tp.key"
          @click="form.type = tp.key"
          class="rounded-xl border-2 p-3 text-center cursor-pointer transition-all active:scale-[0.97]"
          :class="form.type === tp.key
            ? tp.color + ' scale-[1.02]'
            : 'bg-base-100 border-base-300 hover:border-base-content/20'"
        >
          <span class="text-2xl block mb-1">{{ tp.icon }}</span>
          <span class="text-[10px] font-semibold text-base-content">{{ t('feedback.type_' + tp.key) }}</span>
        </button>
      </div>

      <!-- Form -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3">
        <!-- Subject -->
        <div>
          <label class="text-xs font-semibold text-base-content mb-1 block">{{ t('feedback.subject') }} *</label>
          <input
            v-model="form.subject"
            type="text"
            class="input input-bordered input-sm w-full"
            :placeholder="subjectPlaceholder"
            maxlength="255"
          />
          <p v-if="form.errors.subject" class="text-[10px] text-error mt-0.5 m-0">{{ form.errors.subject }}</p>
        </div>

        <!-- Description -->
        <div>
          <label class="text-xs font-semibold text-base-content mb-1 block">{{ t('feedback.description') }} *</label>
          <textarea
            v-model="form.description"
            rows="5"
            class="textarea textarea-bordered w-full text-sm"
            :placeholder="descriptionPlaceholder"
            maxlength="5000"
          ></textarea>
          <div class="flex items-center justify-between mt-0.5">
            <p v-if="form.errors.description" class="text-[10px] text-error m-0">{{ form.errors.description }}</p>
            <span class="text-[10px] text-base-content/40 ml-auto">{{ form.description.length }}/5000</span>
          </div>
        </div>

        <!-- Screenshot -->
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-xs font-semibold text-base-content">{{ t('feedback.screenshot') }}</label>
            <span class="text-[10px] text-base-content/40">{{ t('feedback.optional') }}</span>
          </div>
          <input
            type="file"
            accept="image/*"
            class="file-input file-input-bordered file-input-sm w-full"
            @change="onFileChange"
          />
          <div v-if="previewUrl" class="mt-2 relative inline-block">
            <img :src="previewUrl" class="w-32 h-32 object-cover rounded-lg border border-base-300" />
            <button
              @click="removeScreenshot"
              class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-error text-white text-[10px] flex items-center justify-center border-0 cursor-pointer"
            >&times;</button>
          </div>
          <p v-if="form.errors.screenshot" class="text-[10px] text-error mt-0.5 m-0">{{ form.errors.screenshot }}</p>
        </div>

        <!-- Submit -->
        <button
          @click="submitFeedback"
          :disabled="form.processing || !isValid"
          class="w-full h-10 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all active:scale-[0.98] bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="form.processing" class="loading loading-spinner loading-xs"></span>
          {{ form.processing ? t('feedback.submitting') : t('feedback.submit') }}
        </button>
      </div>

      <!-- My Submissions -->
      <div v-if="myFeedbacks.length > 0" class="space-y-2">
        <div class="text-sm font-bold text-base-content">{{ t('feedback.mySubmissions') }}</div>
        <div
          v-for="fb in myFeedbacks"
          :key="fb.id"
          class="bg-base-100 rounded-xl border border-base-300 overflow-hidden"
        >
          <!-- Header (clickable) -->
          <div class="p-3 flex items-center gap-3 cursor-pointer hover:bg-base-200/50 transition-colors" @click="toggleExpand(fb.id)">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="typeIconBg(fb.type)">
              <span class="text-sm">{{ typeIcon(fb.type) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-base-content truncate">{{ fb.subject }}</div>
              <div class="text-[10px] text-base-content/50">{{ formatDate(fb.created_at) }}</div>
            </div>
            <span class="badge badge-xs" :class="statusBadgeClass(fb.status)">
              {{ t('feedback.status_' + fb.status) }}
            </span>
            <span v-if="fb.replies?.length" class="text-[9px] text-primary font-bold">{{ fb.replies.length }} ตอบกลับ</span>
            <svg class="w-3 h-3 text-base-content/30 transition-transform shrink-0" :class="{ 'rotate-180': expandedId === fb.id }" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </div>

          <!-- Expanded -->
          <div v-if="expandedId === fb.id" class="border-t border-base-200 p-3 space-y-2 bg-base-200/30">
            <!-- Original message -->
            <div class="bg-base-100 rounded-lg p-2.5">
              <p class="text-xs text-base-content/80 m-0 whitespace-pre-wrap">{{ fb.description }}</p>
            </div>

            <!-- Replies -->
            <div v-if="fb.replies?.length > 0" class="space-y-1.5">
              <div
                v-for="reply in fb.replies"
                :key="reply.id"
                class="rounded-lg p-2.5 flex items-start gap-2"
                :class="reply.is_admin ? 'bg-primary/10 ml-4' : 'bg-base-100'"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-1.5">
                    <span v-if="reply.is_admin" class="px-1 py-0.5 rounded text-[8px] font-bold bg-primary/20 text-primary">ADMIN</span>
                    <span class="text-[10px] font-bold text-base-content">{{ reply.user?.name }}</span>
                    <span class="text-[9px] text-base-content/30">{{ formatDate(reply.created_at) }}</span>
                  </div>
                  <p class="text-xs text-base-content/80 m-0 mt-0.5 whitespace-pre-wrap">{{ reply.message }}</p>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-2">
              <span class="text-[10px] text-base-content/40">ยังไม่มีการตอบกลับ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
