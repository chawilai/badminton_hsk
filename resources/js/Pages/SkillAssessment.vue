<script setup>
import { Head, router } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import AppLayout from '@/layout/AppLayout.vue';
import SkillRadarChart from '@/Components/SkillRadarChart.vue';

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

const isSubmitting = ref(false);

const submit = () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  router.post('/skill-assessment', { skills: skills.value }, {
    onFinish: () => { isSubmitting.value = false; },
  });
};

const levelLabel = (val) => {
  if (val <= 2) return 'เริ่มต้น';
  if (val <= 4) return 'พอได้';
  if (val <= 6) return 'ปานกลาง';
  if (val <= 8) return 'ดี';
  return 'เยี่ยม';
};

const levelColor = (val) => {
  if (val <= 2) return 'text-base-content/40';
  if (val <= 4) return 'text-info';
  if (val <= 6) return 'text-success';
  if (val <= 8) return 'text-warning';
  return 'text-error';
};
</script>

<template>
  <Head title="ประเมินทักษะ" />
  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Header -->
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center">
        <div class="text-4xl mb-2">🎯</div>
        <h1 class="text-lg font-bold text-base-content m-0">ประเมินทักษะแบดมินตัน</h1>
        <p class="text-xs text-base-content/50 mt-1 m-0">ประเมินตัวเอง 10 ด้าน เพื่อดูจุดแข็งและจุดที่ควรพัฒนา</p>
      </div>

      <!-- Live preview radar chart -->
      <div class="bg-base-100 rounded-2xl border border-base-300 p-4 flex justify-center">
        <SkillRadarChart :skills="skills" :size="300" />
      </div>

      <!-- Skill sliders -->
      <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200">
          <h2 class="text-base font-bold text-base-content m-0">ให้คะแนนทักษะ (1-10)</h2>
        </div>
        <div class="divide-y divide-base-200">
          <div v-for="skill in skillDefs" :key="skill.key" class="px-4 py-3 space-y-1.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-lg">{{ skill.icon }}</span>
                <div>
                  <div class="text-sm font-semibold text-base-content">{{ skill.label }}</div>
                  <div class="text-[10px] text-base-content/40">{{ skill.desc }}</div>
                </div>
              </div>
              <div class="text-right">
                <span class="text-xl font-black" :class="levelColor(skills[skill.key])">{{ skills[skill.key] }}</span>
                <div class="text-[9px]" :class="levelColor(skills[skill.key])">{{ levelLabel(skills[skill.key]) }}</div>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              v-model.number="skills[skill.key]"
              class="range range-primary range-sm w-full"
              step="1"
            />
            <div class="flex justify-between text-[8px] text-base-content/30 px-0.5">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
              <span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Submit -->
      <button
        @click="submit"
        :disabled="isSubmitting"
        class="w-full py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50"
      >
        <span v-if="isSubmitting" class="loading loading-spinner loading-xs mr-1"></span>
        {{ existingSkills ? 'อัพเดทผลประเมิน' : 'บันทึกผลประเมิน' }}
      </button>
    </div>
  </AppLayout>
</template>
