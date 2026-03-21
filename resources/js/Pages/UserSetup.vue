<script setup>
import { Head, router, usePage } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import AppLayout from '@/layout/AppLayout.vue';
import { useLocale } from '@/composables/useLocale';

const { locale, toggleLocale } = useLocale();
const props = defineProps({ rankGroups: Object });

const form = ref({
  badminton_rank_id: null,
  gender: '',
  date_of_birth: '',
});
const isSubmitting = ref(false);
const errors = ref({});

const content = computed(() => {
  if (locale.value === 'en') {
    return {
      title: 'Player Setup',
      subtitle: 'Tell us about yourself to get started',
      rankLabel: 'Badminton Skill Level',
      rankPlaceholder: 'Select your skill level',
      genderLabel: 'Gender',
      genderPlaceholder: 'Select gender',
      genderOptions: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
      ],
      dobLabel: 'Date of Birth',
      submitBtn: 'Start Playing',
      rankGroups: {
        'อนุบาล': 'Beginner',
        'ประถมต้น': 'Early Intermediate',
        'ประถมปลาย': 'Late Intermediate',
        'มัธยมต้น': 'Advanced (Lower)',
        'มัธยมปลาย': 'Advanced (Upper)',
        'ปริญญาตรี': 'Expert',
        'ปริญญาโท': 'Master',
        'ปริญญาเอก': 'Elite',
      },
    };
  }
  return {
    title: 'ตั้งค่าผู้เล่น',
    subtitle: 'บอกเราเกี่ยวกับตัวคุณเพื่อเริ่มใช้งาน',
    rankLabel: 'ระดับฝีมือแบดมินตัน',
    rankPlaceholder: 'เลือกระดับฝีมือ',
    genderLabel: 'เพศ',
    genderPlaceholder: 'เลือกเพศ',
    genderOptions: [
      { value: 'male', label: 'ชาย' },
      { value: 'female', label: 'หญิง' },
    ],
    dobLabel: 'วันเกิด',
    submitBtn: 'เริ่มเล่น',
    rankGroups: {
      'อนุบาล': 'อนุบาล',
      'ประถมต้น': 'ประถมต้น',
      'ประถมปลาย': 'ประถมปลาย',
      'มัธยมต้น': 'มัธยมต้น',
      'มัธยมปลาย': 'มัธยมปลาย',
      'ปริญญาตรี': 'ปริญญาตรี',
      'ปริญญาโท': 'ปริญญาโท',
      'ปริญญาเอก': 'ปริญญาเอก',
    },
  };
});

const isValid = computed(() => {
  return form.value.badminton_rank_id && form.value.gender && form.value.date_of_birth;
});

const submit = () => {
  if (!isValid.value || isSubmitting.value) return;
  isSubmitting.value = true;
  errors.value = {};

  router.post('/setup', form.value, {
    onError: (errs) => {
      errors.value = errs;
    },
    onFinish: () => {
      isSubmitting.value = false;
    },
  });
};
</script>

<template>
  <Head :title="content.title" />
  <AppLayout>
    <div class="space-y-4 pb-4">

      <!-- Header -->
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center">
        <div class="text-4xl mb-2">🏸</div>
        <h1 class="text-lg font-bold text-base-content m-0">{{ content.title }}</h1>
        <p class="text-xs text-base-content/50 mt-1 m-0">{{ content.subtitle }}</p>
        <button @click="toggleLocale"
          class="mt-2 px-3 py-1 rounded-lg bg-base-content/10 text-[11px] text-base-content/60 border-0 cursor-pointer hover:bg-base-content/20 transition-colors">
          {{ locale === 'th' ? '🇬🇧 English' : '🇹🇭 ภาษาไทย' }}
        </button>
      </div>

      <!-- Badminton Rank -->
      <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200 flex items-center gap-2">
          <span class="text-base">🎯</span>
          <div class="text-sm font-bold text-base-content m-0">{{ content.rankLabel }}</div>
        </div>
        <div class="p-4">
          <select v-model="form.badminton_rank_id"
            class="select select-bordered w-full"
            :class="{ 'select-error': errors.badminton_rank_id }">
            <option :value="null" disabled>{{ content.rankPlaceholder }}</option>
            <optgroup v-for="(ranks, groupName) in rankGroups" :key="groupName"
              :label="content.rankGroups[groupName] || groupName">
              <option v-for="rank in ranks" :key="rank.id" :value="rank.id">
                {{ rank.education_rank }} ({{ rank.general_rank }})
              </option>
            </optgroup>
          </select>
          <p v-if="errors.badminton_rank_id" class="text-error text-xs mt-1">{{ errors.badminton_rank_id }}</p>
        </div>
      </div>

      <!-- Gender -->
      <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200 flex items-center gap-2">
          <span class="text-base">👤</span>
          <div class="text-sm font-bold text-base-content m-0">{{ content.genderLabel }}</div>
        </div>
        <div class="p-4">
          <div class="flex gap-3">
            <label v-for="opt in content.genderOptions" :key="opt.value"
              class="flex-1 cursor-pointer">
              <input type="radio" v-model="form.gender" :value="opt.value" class="hidden peer" />
              <div class="text-center py-3 rounded-xl border-2 transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary font-semibold text-sm"
                :class="form.gender === opt.value ? 'border-primary bg-primary/10 text-primary' : 'border-base-300 text-base-content/60'">
                {{ opt.value === 'male' ? '♂' : '♀' }} {{ opt.label }}
              </div>
            </label>
          </div>
          <p v-if="errors.gender" class="text-error text-xs mt-1">{{ errors.gender }}</p>
        </div>
      </div>

      <!-- Date of Birth -->
      <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200 flex items-center gap-2">
          <span class="text-base">🎂</span>
          <div class="text-sm font-bold text-base-content m-0">{{ content.dobLabel }}</div>
        </div>
        <div class="p-4">
          <input type="date" v-model="form.date_of_birth"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.date_of_birth }"
            max="2020-01-01" />
          <p v-if="errors.date_of_birth" class="text-error text-xs mt-1">{{ errors.date_of_birth }}</p>
        </div>
      </div>

      <!-- Submit -->
      <div class="pt-2">
        <button @click="submit" :disabled="!isValid || isSubmitting"
          class="w-full py-3 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          :class="isValid ? 'bg-primary text-primary-content hover:bg-primary/80' : 'bg-base-300 text-base-content/40'">
          <span v-if="isSubmitting" class="loading loading-spinner loading-xs mr-1"></span>
          🏸 {{ content.submitBtn }}
        </button>
      </div>

    </div>
  </AppLayout>
</template>
