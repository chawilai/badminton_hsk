<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { Head, Link, usePage } from "@inertiajs/vue3";
import { ref, onMounted, onUnmounted } from "vue";
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();
const page = usePage();
const user = page.props.auth?.user;

const slides = [
  {
    icon: '🏸',
    title: 'จัดปาร์ตี้แบดมินตัน',
    subtitle: 'สร้างปาร์ตี้ จัดเกม ลงผล ครบจบในที่เดียว',
    cta: 'หาปาร์ตี้',
    href: '/party-lists',
    gradient: 'from-primary/20 to-success/10',
  },
  {
    icon: '📊',
    title: 'ติดตามสถิติ',
    subtitle: 'ดูผลงาน Win Rate แคลอรี่ที่เผาผลาญ',
    cta: 'ดูสถิติ',
    href: '/profile',
    gradient: 'from-info/20 to-primary/10',
  },
  {
    icon: '💬',
    title: 'แชทกับเพื่อน',
    subtitle: 'คุยกับก๊วนแบด นัดเล่นได้ง่ายๆ',
    cta: 'เปิดแชท',
    href: '/chat',
    gradient: 'from-secondary/20 to-info/10',
  },
  {
    icon: '👥',
    title: 'ระบบเพื่อน',
    subtitle: 'เพิ่มเพื่อน ดูสถิติเทียบกัน',
    cta: 'ดูเพื่อน',
    href: '/friends',
    gradient: 'from-accent/20 to-warning/10',
  },
];

const currentSlide = ref(0);
const carouselRef = ref(null);
let autoScrollInterval = null;

const scrollToSlide = (index) => {
  currentSlide.value = index;
  if (carouselRef.value) {
    const slideWidth = carouselRef.value.offsetWidth;
    carouselRef.value.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
  }
};

const handleScroll = () => {
  if (carouselRef.value) {
    const slideWidth = carouselRef.value.offsetWidth;
    currentSlide.value = Math.round(carouselRef.value.scrollLeft / slideWidth);
  }
};

onMounted(() => {
  autoScrollInterval = setInterval(() => {
    const next = (currentSlide.value + 1) % slides.length;
    scrollToSlide(next);
  }, 5000);
});

onUnmounted(() => {
  if (autoScrollInterval) clearInterval(autoScrollInterval);
});

const features = [
  { icon: '🎯', title: 'จัดเกมอัตโนมัติ', desc: 'ระบบ Auto Balance จัดทีมให้สมดุลตามเลเวล' },
  { icon: '⏱️', title: 'ติดตามเวลาเล่น', desc: 'นับเวลา แคลอรี่ สถิติครบถ้วน' },
  { icon: '🔔', title: 'แจ้งเตือน Realtime', desc: 'อัพเดทเกมทันทีผ่าน WebSocket' },
];

const quickActions = [
  { icon: '🏸', label: 'หาปาร์ตี้', href: '/party-lists', color: 'bg-success/10 text-success' },
  { icon: '🎮', label: 'ปาร์ตี้ของฉัน', href: '/my-parties', color: 'bg-info/10 text-info' },
  { icon: '💬', label: 'แชท', href: '/chat', color: 'bg-secondary/10 text-secondary', badge: 'unreadChatCount' },
  { icon: '👤', label: 'โปรไฟล์', href: '/profile', color: 'bg-warning/10 text-warning' },
];
</script>

<template>
  <Head title="Home" />
  <AppLayout>
    <div class="space-y-4 pb-4">

      <!-- Hero Carousel -->
      <div class="relative">
        <div
          ref="carouselRef"
          class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl"
          style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch;"
          @scroll="handleScroll"
        >
          <div
            v-for="(slide, i) in slides"
            :key="i"
            class="w-full shrink-0 snap-center"
          >
            <div
              class="bg-gradient-to-br rounded-2xl p-6 min-h-[180px] flex flex-col justify-between"
              :class="slide.gradient"
            >
              <div>
                <span class="text-4xl mb-2 block">{{ slide.icon }}</span>
                <h2 class="text-lg font-bold text-base-content m-0 mb-1">{{ slide.title }}</h2>
                <p class="text-xs text-base-content/60 m-0">{{ slide.subtitle }}</p>
              </div>
              <Link
                :href="slide.href"
                class="self-start mt-3 h-8 px-4 rounded-lg bg-primary text-white text-xs font-semibold no-underline flex items-center gap-1 hover:bg-primary/80 transition-colors"
              >{{ slide.cta }} →</Link>
            </div>
          </div>
        </div>
        <!-- Dots -->
        <div class="flex justify-center gap-1.5 mt-2">
          <button
            v-for="(_, i) in slides"
            :key="i"
            @click="scrollToSlide(i)"
            class="w-2 h-2 rounded-full border-0 cursor-pointer transition-all"
            :class="currentSlide === i ? 'bg-primary w-5' : 'bg-base-300'"
          ></button>
        </div>
      </div>

      <!-- Quick Actions -->
      <div v-if="user" class="grid grid-cols-2 gap-2">
        <Link
          v-for="action in quickActions"
          :key="action.href"
          :href="action.href"
          class="rounded-xl p-3 flex items-center gap-2.5 no-underline transition-all hover:scale-[0.98] active:scale-[0.96] border border-base-300 bg-base-100 relative"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" :class="action.color">{{ action.icon }}</div>
          <span class="text-xs font-semibold text-base-content">{{ action.label }}</span>
          <span
            v-if="action.badge && page.props[action.badge] > 0"
            class="absolute top-2 right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold"
          >{{ page.props[action.badge] }}</span>
        </Link>
      </div>

      <!-- Guest CTA -->
      <div v-else class="bg-base-100 rounded-2xl border border-base-300 p-5 text-center">
        <span class="text-4xl block mb-2">🏸</span>
        <h2 class="text-lg font-bold text-base-content m-0 mb-1">Badminton Party</h2>
        <p class="text-xs text-base-content/60 m-0 mb-4">เข้าสู่ระบบเพื่อเริ่มใช้งาน</p>
        <div class="flex justify-center gap-2">
          <Link href="/login" class="h-9 px-5 rounded-lg bg-primary text-white text-sm font-semibold no-underline flex items-center hover:bg-primary/80 transition-colors">เข้าสู่ระบบ</Link>
          <Link href="/register" class="h-9 px-5 rounded-lg bg-base-200 text-base-content text-sm font-semibold no-underline flex items-center hover:bg-base-300 transition-colors">สมัครสมาชิก</Link>
        </div>
      </div>

      <!-- Features -->
      <div class="space-y-2">
        <h3 class="text-sm font-bold text-base-content/70 m-0 px-1">คุณสมบัติ</h3>
        <div v-for="feat in features" :key="feat.title" class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">{{ feat.icon }}</div>
          <div>
            <div class="text-xs font-bold text-base-content">{{ feat.title }}</div>
            <div class="text-[10px] text-base-content/50">{{ feat.desc }}</div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="relative overflow-hidden rounded-2xl border-2 border-primary/30 p-6 text-center bg-primary/10">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none"></div>
        <div class="relative z-10">
          <span class="text-4xl block mb-3">🏆</span>
          <h2 class="text-xl font-black text-primary m-0 mb-1">พร้อมตีแบดหรือยัง?</h2>
          <p class="text-xs text-base-content/60 m-0 mb-5">เข้าร่วมปาร์ตี้ หรือดูสถิติของคุณ</p>
          <div class="flex flex-col gap-2 max-w-xs mx-auto">
            <Link href="/party-lists" class="h-11 rounded-xl bg-primary text-primary-content text-sm font-bold no-underline flex items-center justify-center gap-2 hover:bg-primary/80 transition-all active:scale-[0.98] shadow-lg shadow-primary/30">🏸 หาปาร์ตี้เลย</Link>
            <Link href="/profile" class="h-10 rounded-xl bg-base-100 text-base-content text-sm font-semibold no-underline flex items-center justify-center gap-2 hover:bg-base-200 transition-colors border border-base-300">📊 ดูสถิติของฉัน</Link>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
