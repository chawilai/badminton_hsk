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
    image: '/images/carousel/party-members-cartoon.jpg',
    imageLg: '/images/carousel/party-members-cartoon-lg.jpg',
    title: 'สร้างปาร์ตี้ หาเพื่อนใหม่',
    subtitle: 'ระบบสร้างปาร์ตี้อัจฉริยะ ค้นหาเพื่อนร่วมก๊วนที่มีระดับฝีมือใกล้เคียงกัน',
    cta: 'หาปาร์ตี้',
    href: '/party-lists',
  },
  {
    image: '/images/carousel/public-private-cartoon.jpg',
    imageLg: '/images/carousel/public-private-cartoon-lg.jpg',
    title: 'เข้าร่วมได้ทุกรูปแบบ',
    subtitle: 'เลือกเข้าร่วมปาร์ตี้สาธารณะ หรือสร้างห้องส่วนตัวสำหรับก๊วนของคุณเอง',
    cta: 'สร้างปาร์ตี้',
    href: '/party-create',
  },
  {
    image: '/images/carousel/auto-balance.jpg',
    imageLg: '/images/carousel/auto-balance-lg.jpg',
    title: 'ระบบจัดเกมอัตโนมัติ',
    subtitle: 'บลาลานซ์ทักษะ เกลี่ยจำนวนเกม และจัดลำดับความสำคัญให้ทุกคนสนุกเท่ากัน',
    cta: 'ดูวิธีการ',
    href: '/tutorial',
  },
  {
    image: '/images/carousel/realtime-stats.jpg',
    imageLg: '/images/carousel/realtime-stats-lg.jpg',
    title: 'ข้อมูลแบบ Real-time',
    subtitle: 'บอกระยะเวลารอ จำนวนเกมที่เล่น และจำนวนลูกขนไก่ที่ใช้ไปแบบวินาทีต่อวินาที',
    cta: 'ร่วมปาร์ตี้',
    href: '/party-lists',
  },
  {
    image: '/images/carousel/player-stats.jpg',
    imageLg: '/images/carousel/player-stats-lg.jpg',
    title: 'สถิติและประวัติการเล่น',
    subtitle: 'บันทึกทุกแมตซ์ วิเคราะห์ผลงาน และอัปเลเวลเพื่อพัฒนาฝีมืออย่างต่อเนื่อง',
    cta: 'ดูสถิติของฉัน',
    href: '/profile',
  },
  {
    image: '/images/carousel/social-friends.jpg',
    imageLg: '/images/carousel/social-friends-lg.jpg',
    title: 'สังคมแบดมินตันครบวงจร',
    subtitle: 'ระบบเพื่อน แชทพูดคุย และนัดหมายการเล่นได้สะดวกทุกที่ทุกเวลา',
    cta: 'ดูรายชื่อเพื่อน',
    href: '/friends',
  },
  {
    image: '/images/carousel/line-signup.jpg',
    imageLg: '/images/carousel/line-signup-lg.jpg',
    title: 'สมัครง่ายผ่าน LINE',
    subtitle: 'เพียงแอด LINE @badmintonparty ก็เริ่มใช้งานและรับการแจ้งเตือนได้ทันที',
    cta: 'แอดไลน์',
    href: 'https://line.me/R/ti/p/@badmintonparty',
    external: true
  },
  {
    image: '/images/carousel/free-badge.jpg',
    imageLg: '/images/carousel/free-badge-lg.jpg',
    title: 'ใช้งานฟรี! ไม่มีค่าใช้จ่าย',
    subtitle: 'ร่วมสร้างคอมมูนิตี้แบดมินตันที่สนุกและเป็นธรรมได้ฟรีวันนี้',
    cta: 'เริ่มเลย',
    href: '/register',
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
  { icon: '⚖️', title: 'Smart Matchmaking', desc: 'บาลานซ์ทีมตาม MMR และจำนวนเกมที่เล่น' },
  { icon: '📈', title: 'Performance Tracking', desc: 'วิเคราะห์ฟอร์มการเล่นและสถิติรายบุคคล' },
  { icon: '💬', title: 'Community & Connect', desc: 'เชื่อมต่อกับก๊วนแบดผ่าน Chat และ Friend System' },
];

const quickActions = [
  { icon: '🏸', label: 'หาปาร์ตี้', href: '/party-lists', color: 'bg-primary/15 text-primary' },
  { icon: '🎮', label: 'ปาร์ตี้ของฉัน', href: '/my-parties', color: 'bg-info/15 text-info' },
  { icon: '📍', label: 'สนามใกล้ฉัน', href: '/courts/map', color: 'bg-success/15 text-success' },
  { icon: '💬', label: 'แชท', href: '/chat', color: 'bg-secondary/15 text-secondary', badge: 'unreadChatCount' },
  { icon: '👤', label: 'โปรไฟล์', href: '/profile', color: 'bg-warning/15 text-warning' },
];
</script>

<template>
  <Head title="Home" />
  <AppLayout>
    <div class="space-y-6 pb-8 min-h-screen">

      <!-- Hero Carousel -->
      <div class="relative group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div
          ref="carouselRef"
          class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-[2.5rem] shadow-xl relative z-0 bg-base-200"
          style="scroll-behavior: smooth; -webkit-overflow-scrolling: touch;"
          @scroll="handleScroll"
        >
          <div
            v-for="(slide, i) in slides"
            :key="i"
            class="w-full shrink-0 snap-center relative aspect-[4/3] md:h-[420px] lg:h-[480px] overflow-hidden"
          >
            <!-- Background Image with Overlay -->
            <picture>
              <source :srcset="slide.imageLg" media="(min-width: 768px)">
              <img 
                :src="slide.image" 
                class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                alt=""
              />
            </picture>
            
            <!-- Dark gradient overlay for text readability -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>
            
            <!-- Content -->
            <div class="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div class="animate-slide-up transform transition-all duration-500">
                <h2 class="text-3xl md:text-5xl font-black mb-2 leading-tight tracking-tight" style="text-shadow: 0 2px 8px rgba(0,0,0,0.5);">{{ slide.title }}</h2>
                <p class="text-sm md:text-lg opacity-95 max-w-xl mb-6 font-medium leading-relaxed" style="text-shadow: 0 1px 4px rgba(0,0,0,0.4);">{{ slide.subtitle }}</p>
                <div class="flex items-center gap-4">
                    <component
                        :is="slide.external ? 'a' : Link"
                        :href="slide.href"
                        :target="slide.external ? '_blank' : null"
                        class="btn btn-primary border-none h-12 px-8 rounded-2xl text-sm font-black no-underline flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95"
                    >
                        {{ slide.cta }}
                        <span v-if="!slide.external">→</span>
                        <span v-else>➚</span>
                    </component>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Dots (Inside Carousel for premium look) -->
        <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          <button
            v-for="(_, i) in slides"
            :key="i"
            @click="scrollToSlide(i)"
            class="w-2 h-2 rounded-full border-0 cursor-pointer transition-all duration-300 shadow-sm"
            :class="currentSlide === i ? 'bg-primary w-8' : 'bg-white/30 backdrop-blur-md'"
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
