<script setup>
import { Head, Link, usePage } from '@inertiajs/vue3';
import { computed, ref, onMounted } from 'vue';
import { useLocale } from '@/composables/useLocale';
import LocaleSwitcher from '@/Components/LocaleSwitcher.vue';
import MmrBadge from '@/Components/MmrBadge.vue';

const { t, locale } = useLocale();

const props = defineProps({
  mmr: {
    type: Number,
    required: true,
  },
  level: {
    type: Object,
    default: () => ({ level: 0, name_th: '-', name_en: '-', tier_color: '#A0AEC0', tier_th: '-', tier_en: '-' }),
  },
});

const tierName = computed(() => {
  return locale.value === 'th' ? (props.level?.name_th || '-') : (props.level?.name_en || '-');
});

// Animation state
const showContent = ref(false);
const showBadge = ref(false);
const showStats = ref(false);
const showButtons = ref(false);

onMounted(() => {
  // Staggered reveal animations
  setTimeout(() => { showContent.value = true; }, 200);
  setTimeout(() => { showBadge.value = true; }, 600);
  setTimeout(() => { showStats.value = true; }, 1000);
  setTimeout(() => { showButtons.value = true; }, 1400);
});
</script>

<template>
  <Head :title="t('mmr.resultTitle')" />

  <div class="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-accent/10 flex flex-col">
    <!-- Language switcher -->
    <div class="fixed top-4 right-4 z-50">
      <LocaleSwitcher />
    </div>

    <!-- Background decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-success/5 rounded-full blur-3xl"></div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
      <div class="w-full max-w-lg text-center space-y-6">

        <!-- Celebration header -->
        <transition name="result-pop">
          <div v-if="showContent" class="space-y-2">
            <div class="text-6xl mb-2">🎉</div>
            <h1 class="text-2xl font-black text-base-content m-0">{{ t('mmr.congratulations') }}</h1>
            <p class="text-sm text-base-content/60 m-0">{{ t('mmr.readyToPlay') }}</p>
          </div>
        </transition>

        <!-- Level Badge (big) -->
        <transition name="result-scale">
          <div v-if="showBadge" class="space-y-4">
            <!-- Big level circle -->
            <div class="inline-flex flex-col items-center">
              <div
                class="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-base-100"
                :style="{ backgroundColor: level.tier_color + '20', borderColor: level.tier_color }"
              >
                <span class="text-xs font-bold uppercase tracking-wider" :style="{ color: level.tier_color }">
                  {{ t('mmr.yourLevel') }}
                </span>
                <span class="text-5xl font-black" :style="{ color: level.tier_color }">
                  {{ level.level }}
                </span>
              </div>
            </div>

            <!-- Tier name -->
            <div>
              <MmrBadge
                :level="level.level"
                :tier-name="tierName"
                :tier-color="level.tier_color"
                size="md"
              />
            </div>
          </div>
        </transition>

        <!-- MMR Score card -->
        <transition name="result-slide">
          <div v-if="showStats">
            <div class="bg-base-100/70 backdrop-blur-xl rounded-2xl border border-base-300/50 shadow-lg p-6 space-y-4">
              <!-- MMR Score -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-base-content/60">{{ t('mmr.yourMmr') }}</span>
                <span class="text-3xl font-black text-primary">{{ mmr }}</span>
              </div>

              <!-- Divider -->
              <div class="h-px bg-base-300/50"></div>

              <!-- Level info -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-base-content/60">{{ t('mmr.yourLevel') }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-base-content">Lv.{{ level.level }}</span>
                  <span
                    class="text-sm font-semibold"
                    :style="{ color: level.tier_color }"
                  >{{ tierName }}</span>
                </div>
              </div>

              <!-- Note -->
              <div class="bg-info/10 rounded-xl p-3 flex items-start gap-2">
                <svg class="w-4 h-4 text-info shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-xs text-info leading-relaxed">{{ t('mmr.levelWillAdjust') }}</span>
              </div>
            </div>
          </div>
        </transition>

        <!-- CTA Buttons -->
        <transition name="result-slide">
          <div v-if="showButtons" class="space-y-3">
            <Link
              href="/party-lists"
              class="flex items-center justify-center w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] shadow-lg hover:shadow-xl text-base gap-2"
            >
              <span>🏸</span>
              {{ t('mmr.findParty') }}
            </Link>

            <Link
              href="/profile"
              class="flex items-center justify-center w-full py-3 px-6 bg-base-200 hover:bg-base-300 text-base-content/70 font-semibold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] text-sm gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ t('mmr.viewProfile') }}
            </Link>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Pop-in animation */
.result-pop-enter-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.result-pop-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

/* Scale animation for badge */
.result-scale-enter-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.result-scale-enter-from {
  opacity: 0;
  transform: scale(0.5);
}

/* Slide-up animation */
.result-slide-enter-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.result-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
