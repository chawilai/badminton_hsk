<script setup>
import { Head, router } from '@inertiajs/vue3';
import { ref, computed, nextTick } from 'vue';
import AppLayout from '@/layout/AppLayout.vue';
import SkillRadarChart from '@/Components/SkillRadarChart.vue';
import { useLocale } from '@/composables/useLocale';
import { getSkillLevelLabel, getSkillLevelDesc } from '@/data/skillLevelDescriptions';

const { locale } = useLocale();

const props = defineProps({
  existingSkills: { type: Object, default: null },
});

const skillDefs = [
  { key: 'serve', label: 'เสิร์ฟ', icon: '🏸', desc: 'เสิร์ฟสั้น/ยาว ความแม่นยำ เสิร์ฟหลอก' },
  { key: 'smash', label: 'สแมช', icon: '💥', desc: 'ความแรง เลือกมุม กระโดดสแมช' },
  { key: 'clear', label: 'ลูกเคลียร์', icon: '🌈', desc: 'ตีลูกยาวไปหลังคอร์ท ยกลูกจากหน้าเน็ต' },
  { key: 'net_play', label: 'เกมหน้าเน็ต', icon: '🕸️', desc: 'หยอด ตบหน้าเน็ต ไขว้ หมุนลูก' },
  { key: 'defense', label: 'เกมรับ', icon: '🛡️', desc: 'รับสแมช ดึงหลัง คืนลูกยาก' },
  { key: 'backhand', label: 'แบ็คแฮนด์', icon: '🔄', desc: 'เคลียร์ หยอด รับลูกฝั่ง backhand' },
  { key: 'deception', label: 'ลูกหลอก', icon: '🎭', desc: 'หลอกทิศทาง หลอกจังหวะ เปลี่ยนมุมวินาทีสุดท้าย' },
  { key: 'footwork', label: 'ฟุตเวิร์ค', icon: '👟', desc: 'การเคลื่อนที่ในคอร์ท ทรงตัว เข้าตีได้ทุกมุม' },
  { key: 'speed', label: 'ความเร็ว', icon: '⚡', desc: 'ความเร็วในการเคลื่อนที่ ตอบสนองไว' },
  { key: 'stamina', label: 'สตามิน่า', icon: '❤️‍🔥', desc: 'ความอึด เล่นได้หลายเกมไม่หมดแรง' },
];

const skills = ref({});
skillDefs.forEach(s => {
  skills.value[s.key] = props.existingSkills?.[s.key] || 5;
});

const currentStep = ref(0);
const showSummary = ref(false);
const isSubmitting = ref(false);
const contentEl = ref(null);

const currentSkill = computed(() => skillDefs[currentStep.value]);
const progress = computed(() => Math.round(((currentStep.value + 1) / skillDefs.length) * 100));

const scrollToTop = () => {
  nextTick(() => {
    contentEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
};

const goNext = () => {
  if (currentStep.value < skillDefs.length - 1) {
    currentStep.value++;
    scrollToTop();
  } else {
    showSummary.value = true;
    scrollToTop();
  }
};

const goPrev = () => {
  if (showSummary.value) {
    showSummary.value = false;
  } else if (currentStep.value > 0) {
    currentStep.value--;
    scrollToTop();
  }
};

const goToSkill = (index) => {
  showSummary.value = false;
  currentStep.value = index;
  scrollToTop();
};

const selectLevel = (val) => {
  skills.value[currentSkill.value.key] = val;
};

const submit = () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  router.post('/skill-assessment', { skills: skills.value }, {
    onFinish: () => { isSubmitting.value = false; },
  });
};

const levelColor = (val) => {
  if (val <= 2) return 'text-base-content/40';
  if (val <= 4) return 'text-info';
  if (val <= 6) return 'text-success';
  if (val <= 8) return 'text-warning';
  return 'text-error';
};

const levelBgColor = (val) => {
  if (val <= 2) return 'bg-base-content/5 border-base-content/10';
  if (val <= 4) return 'bg-info/5 border-info/20';
  if (val <= 6) return 'bg-success/5 border-success/20';
  if (val <= 8) return 'bg-warning/5 border-warning/20';
  return 'bg-error/5 border-error/20';
};

const selectedBgColor = (val) => {
  if (val <= 2) return 'bg-base-content/15 border-base-content/40 ring-2 ring-base-content/20';
  if (val <= 4) return 'bg-info/15 border-info ring-2 ring-info/30';
  if (val <= 6) return 'bg-success/15 border-success ring-2 ring-success/30';
  if (val <= 8) return 'bg-warning/15 border-warning ring-2 ring-warning/30';
  return 'bg-error/15 border-error ring-2 ring-error/30';
};
</script>

<template>
  <Head title="ประเมินทักษะ" />
  <AppLayout>
    <div ref="contentEl" class="space-y-3 pb-4">

      <!-- Progress bar -->
      <div v-if="!showSummary" class="bg-base-100 rounded-2xl border border-base-300 p-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-base-content">ทักษะที่ {{ currentStep + 1 }}/{{ skillDefs.length }}</span>
          <span class="text-xs text-base-content/50">{{ progress }}%</span>
        </div>
        <div class="w-full bg-base-200 rounded-full h-2.5">
          <div class="bg-primary h-2.5 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
        </div>
        <!-- Step dots -->
        <div class="flex justify-between mt-2 px-0.5">
          <button
            v-for="(skill, i) in skillDefs" :key="skill.key"
            @click="goToSkill(i)"
            class="w-7 h-7 rounded-full border-0 cursor-pointer flex items-center justify-center text-xs transition-all"
            :class="i === currentStep
              ? 'bg-primary text-primary-content font-bold scale-110'
              : i < currentStep
                ? 'bg-primary/20 text-primary'
                : 'bg-base-200 text-base-content/30'"
          >{{ i + 1 }}</button>
        </div>
      </div>

      <!-- Current skill assessment -->
      <div v-if="!showSummary" class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <!-- Skill header -->
        <div class="bg-gradient-to-br from-primary/10 to-primary/5 p-5 text-center">
          <div class="text-5xl mb-2">{{ currentSkill.icon }}</div>
          <h2 class="text-xl font-bold text-base-content m-0">{{ currentSkill.label }}</h2>
          <p class="text-sm text-base-content/50 mt-1 m-0">{{ currentSkill.desc }}</p>
        </div>

        <!-- Level options list -->
        <div class="p-3 space-y-2">
          <button
            v-for="level in 10" :key="level"
            @click="selectLevel(level)"
            class="w-full text-left p-3 rounded-xl border cursor-pointer transition-all"
            :class="skills[currentSkill.key] === level
              ? selectedBgColor(level)
              : levelBgColor(level) + ' hover:opacity-80'"
          >
            <div class="flex items-center gap-3">
              <!-- Level number -->
              <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-black text-lg"
                :class="skills[currentSkill.key] === level
                  ? 'bg-primary text-primary-content'
                  : 'bg-base-200 text-base-content/50'"
              >{{ level }}</div>
              <!-- Label + desc -->
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold" :class="levelColor(level)">
                  {{ getSkillLevelLabel(currentSkill.key, level, locale) }}
                </div>
                <div class="text-xs text-base-content/50 mt-0.5">
                  {{ getSkillLevelDesc(currentSkill.key, level) }}
                </div>
              </div>
              <!-- Check mark -->
              <div v-if="skills[currentSkill.key] === level" class="shrink-0">
                <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div v-if="!showSummary" class="flex gap-3">
        <button
          v-if="currentStep > 0"
          @click="goPrev"
          class="flex-1 py-3 rounded-xl text-sm font-bold bg-base-200 text-base-content border-0 cursor-pointer hover:bg-base-300 transition-all active:scale-[0.98]"
        >
          <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          ย้อนกลับ
        </button>
        <button
          @click="goNext"
          class="flex-1 py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98]"
        >
          {{ currentStep < skillDefs.length - 1 ? 'ถัดไป' : 'ดูสรุป' }}
          <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <!-- Summary page -->
      <template v-if="showSummary">
        <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center">
          <div class="text-4xl mb-2">🎯</div>
          <h1 class="text-lg font-bold text-base-content m-0">สรุปผลประเมินทักษะ</h1>
          <p class="text-xs text-base-content/50 mt-1 m-0">กดที่ทักษะเพื่อแก้ไขคะแนน</p>
        </div>

        <!-- Radar chart -->
        <div class="bg-base-100 rounded-2xl border border-base-300 p-4 flex justify-center">
          <SkillRadarChart :skills="skills" :size="300" />
        </div>

        <!-- All skills summary -->
        <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
          <div class="divide-y divide-base-200">
            <button
              v-for="(skill, i) in skillDefs" :key="skill.key"
              @click="goToSkill(i)"
              class="w-full text-left px-4 py-3 flex items-center gap-3 bg-transparent border-0 cursor-pointer hover:bg-base-200 transition-colors"
            >
              <span class="text-xl">{{ skill.icon }}</span>
              <div class="flex-1 min-w-0">
                <div class="text-sm font-bold text-base-content">{{ skill.label }}</div>
                <div class="text-xs text-base-content/50">{{ getSkillLevelLabel(skill.key, skills[skill.key], locale) }}</div>
              </div>
              <span class="text-2xl font-black" :class="levelColor(skills[skill.key])">{{ skills[skill.key] }}</span>
              <svg class="w-4 h-4 text-base-content/30 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-3">
          <button
            @click="goPrev"
            class="py-3 px-5 rounded-xl text-sm font-bold bg-base-200 text-base-content border-0 cursor-pointer hover:bg-base-300 transition-all active:scale-[0.98]"
          >
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            แก้ไข
          </button>
          <button
            @click="submit"
            :disabled="isSubmitting"
            class="flex-1 py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <span v-if="isSubmitting" class="loading loading-spinner loading-xs mr-1"></span>
            {{ existingSkills ? 'อัพเดทผลประเมิน' : 'บันทึกผลประเมิน' }}
          </button>
        </div>
      </template>
    </div>
  </AppLayout>
</template>
