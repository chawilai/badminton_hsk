<script setup>
import { Head, router } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import AppLayout from '@/layout/AppLayout.vue';
import { useLocale } from '@/composables/useLocale';

const { locale, toggleLocale } = useLocale();
const agreed = ref(false);
const isSubmitting = ref(false);

const content = computed(() => {
  if (locale.value === 'en') {
    return {
      title: 'Privacy Policy & Data Protection',
      subtitle: 'Personal Data Protection Act (PDPA)',
      intro: 'Badminton Party values your privacy. Before using our service, please review and accept our data protection policy.',
      aboutTitle: 'About Badminton Party',
      aboutDesc: 'Badminton Party is a badminton session management platform where you can create parties, invite players, manage games with team assignments, track scores, and monitor shuttlecock usage.',
      sections: [
        {
          icon: '📋',
          title: 'Data We Collect',
          items: [
            { label: 'Account Information', desc: 'Name, email, profile picture (from LINE, Google, or Apple login)' },
            { label: 'Profile Data', desc: 'Gender, date of birth, phone number, address (subdistrict/district/province)' },
            { label: 'Game Data', desc: 'Match history, scores, win/loss records, MMR rating, skill assessments' },
            { label: 'Communication Data', desc: 'Chat messages within parties, feedback submissions' },
            { label: 'Usage Data', desc: 'Play time, party participation, court visit history' },
          ],
        },
        {
          icon: '🎯',
          title: 'Purpose of Data Collection',
          items: [
            { label: 'Service Operation', desc: 'To create and manage badminton parties, games, and player matching' },
            { label: 'Skill Assessment', desc: 'To calculate MMR ratings and provide skill analysis via radar charts' },
            { label: 'Statistics', desc: 'To display play history, win rates, calories burned, and performance trends' },
            { label: 'Communication', desc: 'To send notifications via LINE OA about party updates and invitations' },
            { label: 'Service Improvement', desc: 'To analyze usage patterns and improve the platform experience' },
          ],
        },
        {
          icon: '🔒',
          title: 'Data Protection',
          items: [
            { label: 'Security', desc: 'Your data is encrypted and stored securely on protected servers' },
            { label: 'No Sale of Data', desc: 'We never sell or share your personal data with third parties for marketing' },
            { label: 'Third-Party Login', desc: 'We only receive basic profile data from LINE, Google, or Apple — we do not access your private messages or contacts' },
            { label: 'SMS/Email Verification', desc: 'Phone numbers and emails are used solely for identity verification' },
          ],
        },
        {
          icon: '⚖️',
          title: 'Your Rights',
          items: [
            { label: 'Access', desc: 'You can view all your personal data through your profile page' },
            { label: 'Correction', desc: 'You can update or correct your personal information at any time' },
            { label: 'Deletion', desc: 'You can request deletion of your account and associated data' },
            { label: 'Withdrawal', desc: 'You can withdraw consent at any time by contacting the administrator' },
          ],
        },
      ],
      contactTitle: 'Contact Us',
      contactDesc: 'If you have questions about data protection or wish to exercise your rights, please contact us through the feedback section in the app.',
      checkboxLabel: 'I have read and agree to the Privacy Policy and consent to the collection and use of my personal data as described above.',
      acceptBtn: 'Accept & Continue',
    };
  }

  return {
    title: 'นโยบายคุ้มครองข้อมูลส่วนบุคคล',
    subtitle: 'พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)',
    intro: 'Badminton Party ให้ความสำคัญกับความเป็นส่วนตัวของคุณ กรุณาอ่านและยอมรับนโยบายคุ้มครองข้อมูลก่อนเริ่มใช้งาน',
    aboutTitle: 'เกี่ยวกับ Badminton Party',
    aboutDesc: 'Badminton Party เป็นแพลตฟอร์มจัดการก๊วนแบดมินตัน สร้างปาร์ตี้ เชิญผู้เล่น จัดเกมแบ่งทีม บันทึกคะแนน และติดตามการใช้ลูกขนไก่',
    sections: [
      {
        icon: '📋',
        title: 'ข้อมูลที่เราเก็บรวบรวม',
        items: [
          { label: 'ข้อมูลบัญชี', desc: 'ชื่อ, อีเมล, รูปโปรไฟล์ (จากการเข้าสู่ระบบผ่าน LINE, Google หรือ Apple)' },
          { label: 'ข้อมูลโปรไฟล์', desc: 'เพศ, วันเกิด, เบอร์โทรศัพท์, ที่อยู่ (ตำบล/อำเภอ/จังหวัด)' },
          { label: 'ข้อมูลเกม', desc: 'ประวัติการแข่ง, คะแนน, สถิติชนะ/แพ้, คะแนน MMR, ผลประเมินทักษะ' },
          { label: 'ข้อมูลการสื่อสาร', desc: 'ข้อความแชทในปาร์ตี้, ข้อเสนอแนะ/แจ้งปัญหา' },
          { label: 'ข้อมูลการใช้งาน', desc: 'เวลาเล่น, การเข้าร่วมปาร์ตี้, ประวัติการใช้สนาม' },
        ],
      },
      {
        icon: '🎯',
        title: 'วัตถุประสงค์ในการเก็บข้อมูล',
        items: [
          { label: 'การให้บริการ', desc: 'เพื่อสร้างและจัดการปาร์ตี้แบดมินตัน, เกม และการจับคู่ผู้เล่น' },
          { label: 'ประเมินทักษะ', desc: 'เพื่อคำนวณคะแนน MMR และแสดงผลวิเคราะห์ทักษะเป็นกราฟเรดาร์' },
          { label: 'สถิติ', desc: 'เพื่อแสดงประวัติการเล่น, อัตราชนะ, แคลอรี่ที่เผาผลาญ และแนวโน้มผลงาน' },
          { label: 'การสื่อสาร', desc: 'เพื่อส่งแจ้งเตือนผ่าน LINE OA เกี่ยวกับอัปเดตปาร์ตี้และคำเชิญ' },
          { label: 'ปรับปรุงบริการ', desc: 'เพื่อวิเคราะห์รูปแบบการใช้งานและปรับปรุงแพลตฟอร์ม' },
        ],
      },
      {
        icon: '🔒',
        title: 'การคุ้มครองข้อมูล',
        items: [
          { label: 'ความปลอดภัย', desc: 'ข้อมูลของคุณถูกเข้ารหัสและจัดเก็บอย่างปลอดภัยบนเซิร์ฟเวอร์ที่ได้รับการป้องกัน' },
          { label: 'ไม่ขายข้อมูล', desc: 'เราไม่เคยขายหรือแบ่งปันข้อมูลส่วนบุคคลของคุณกับบุคคลภายนอกเพื่อการตลาด' },
          { label: 'การเข้าสู่ระบบผ่านบุคคลที่สาม', desc: 'เรารับเฉพาะข้อมูลโปรไฟล์พื้นฐานจาก LINE, Google หรือ Apple — เราไม่เข้าถึงข้อความส่วนตัวหรือรายชื่อผู้ติดต่อของคุณ' },
          { label: 'การยืนยัน SMS/อีเมล', desc: 'เบอร์โทรศัพท์และอีเมลใช้เพื่อการยืนยันตัวตนเท่านั้น' },
        ],
      },
      {
        icon: '⚖️',
        title: 'สิทธิ์ของคุณ',
        items: [
          { label: 'เข้าถึง', desc: 'คุณสามารถดูข้อมูลส่วนบุคคลทั้งหมดผ่านหน้าโปรไฟล์' },
          { label: 'แก้ไข', desc: 'คุณสามารถอัปเดตหรือแก้ไขข้อมูลส่วนบุคคลได้ตลอดเวลา' },
          { label: 'ลบข้อมูล', desc: 'คุณสามารถขอลบบัญชีและข้อมูลที่เกี่ยวข้องได้' },
          { label: 'ถอนความยินยอม', desc: 'คุณสามารถถอนความยินยอมได้ตลอดเวลาโดยติดต่อผู้ดูแลระบบ' },
        ],
      },
    ],
    contactTitle: 'ติดต่อเรา',
    contactDesc: 'หากมีคำถามเกี่ยวกับการคุ้มครองข้อมูลหรือต้องการใช้สิทธิ์ของคุณ กรุณาติดต่อผ่านส่วนแจ้งปัญหา/ข้อเสนอแนะในแอป',
    checkboxLabel: 'ข้าพเจ้าได้อ่านและยอมรับนโยบายคุ้มครองข้อมูลส่วนบุคคล และยินยอมให้เก็บรวบรวมและใช้ข้อมูลส่วนบุคคลตามที่ระบุข้างต้น',
    acceptBtn: 'ยอมรับและดำเนินการต่อ',
  };
});

const submit = () => {
  if (!agreed.value || isSubmitting.value) return;
  isSubmitting.value = true;
  router.post('/pdpa-consent', {}, {
    onFinish: () => { isSubmitting.value = false; },
  });
};
</script>

<template>
  <Head :title="content.title" />
  <AppLayout>
    <div class="space-y-4 pb-4">

      <!-- Header -->
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center">
        <div class="text-4xl mb-2">🛡️</div>
        <h1 class="text-lg font-bold text-base-content m-0">{{ content.title }}</h1>
        <p class="text-xs text-base-content/50 mt-1 m-0">{{ content.subtitle }}</p>
        <!-- Language toggle -->
        <button @click="toggleLocale"
          class="mt-2 px-3 py-1 rounded-lg bg-base-content/10 text-[11px] text-base-content/60 border-0 cursor-pointer hover:bg-base-content/20 transition-colors">
          {{ locale === 'th' ? '🇬🇧 English' : '🇹🇭 ภาษาไทย' }}
        </button>
      </div>

      <!-- Intro -->
      <div class="bg-base-100 rounded-2xl border border-base-300 p-4">
        <p class="text-sm text-base-content/70 m-0 leading-relaxed">{{ content.intro }}</p>
      </div>

      <!-- About -->
      <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200 flex items-center gap-2">
          <span class="text-lg">🏸</span>
          <h2 class="text-sm font-bold text-base-content m-0">{{ content.aboutTitle }}</h2>
        </div>
        <div class="p-4">
          <p class="text-sm text-base-content/70 m-0 leading-relaxed">{{ content.aboutDesc }}</p>
        </div>
      </div>

      <!-- Sections -->
      <div v-for="(section, si) in content.sections" :key="si"
        class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
        <div class="px-4 py-3 border-b border-base-200 flex items-center gap-2">
          <span class="text-lg">{{ section.icon }}</span>
          <h2 class="text-sm font-bold text-base-content m-0">{{ section.title }}</h2>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="(item, ii) in section.items" :key="ii"
            class="flex gap-3">
            <div class="w-1.5 rounded-full bg-primary/30 shrink-0 mt-1"></div>
            <div>
              <div class="text-xs font-bold text-base-content">{{ item.label }}</div>
              <div class="text-xs text-base-content/60 mt-0.5 leading-relaxed">{{ item.desc }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="bg-base-100 rounded-2xl border border-base-300 p-4 flex items-start gap-3">
        <span class="text-lg">📧</span>
        <div>
          <div class="text-xs font-bold text-base-content">{{ content.contactTitle }}</div>
          <div class="text-xs text-base-content/60 mt-0.5 leading-relaxed">{{ content.contactDesc }}</div>
        </div>
      </div>

      <!-- Consent checkbox + Submit -->
      <div class="bg-base-100 rounded-2xl border-2 border-primary/30 p-4 space-y-4">
        <label class="flex items-start gap-3 cursor-pointer">
          <input v-model="agreed" type="checkbox"
            class="checkbox checkbox-primary mt-0.5 shrink-0" />
          <span class="text-xs text-base-content leading-relaxed font-medium">{{ content.checkboxLabel }}</span>
        </label>

        <button @click="submit" :disabled="!agreed || isSubmitting"
          class="w-full py-3 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          :class="agreed ? 'bg-primary text-primary-content hover:bg-primary/80' : 'bg-base-300 text-base-content/40'">
          <span v-if="isSubmitting" class="loading loading-spinner loading-xs mr-1"></span>
          {{ content.acceptBtn }}
        </button>
      </div>

    </div>
  </AppLayout>
</template>
