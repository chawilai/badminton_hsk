<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePage, router } from '@inertiajs/vue3';

const page = usePage();
const notification = computed(() => page.props.levelUpNotification);
const visible = ref(false);
const isLevelUp = computed(() => notification.value && notification.value.new_level > notification.value.old_level);

onMounted(() => {
  if (notification.value) {
    setTimeout(() => { visible.value = true; }, 500);
  }
});

const dismiss = () => {
  if (notification.value) {
    router.post(`/level-up-seen/${notification.value.id}`, {}, {
      preserveScroll: true,
      preserveState: true,
    });
  }
  visible.value = false;
};
</script>

<template>
  <dialog class="modal" :class="{ 'modal-open': visible }">
    <div v-if="notification" class="modal-box max-w-sm p-0 text-center overflow-hidden">
      <!-- Header with gradient -->
      <div class="p-6 pb-4" :style="{ background: `linear-gradient(135deg, ${notification.new_tier_color}22, ${notification.new_tier_color}44)` }">
        <!-- Level up animation -->
        <div class="text-5xl mb-3 animate-bounce">
          {{ isLevelUp ? '🎉' : '📉' }}
        </div>
        <h2 class="text-lg font-black text-base-content m-0">
          {{ isLevelUp ? 'เลื่อนขั้นแล้ว!' : 'ระดับเปลี่ยน' }}
        </h2>
      </div>

      <div class="px-6 pb-6 space-y-4">
        <!-- Old → New level -->
        <div class="flex items-center justify-center gap-3">
          <div class="text-center">
            <div class="text-xs text-base-content/40 mb-1">เดิม</div>
            <div class="text-sm font-bold text-base-content/50">{{ notification.old_tier_th }}</div>
            <div class="text-xs text-base-content/30">Lv.{{ notification.old_level }}</div>
          </div>
          <div class="text-2xl">{{ isLevelUp ? '→' : '→' }}</div>
          <div class="text-center">
            <div class="text-xs font-bold mb-1" :style="{ color: notification.new_tier_color }">ใหม่</div>
            <div class="text-lg font-black" :style="{ color: notification.new_tier_color }">{{ notification.new_tier_th }}</div>
            <div class="text-xs" :style="{ color: notification.new_tier_color }">Lv.{{ notification.new_level }}</div>
          </div>
        </div>

        <!-- MMR change -->
        <div class="bg-base-200/50 rounded-xl py-2 px-4">
          <div class="text-[10px] text-base-content/40">MMR</div>
          <div class="text-lg font-black text-base-content">
            {{ notification.mmr_before }}
            <span :class="isLevelUp ? 'text-success' : 'text-error'">
              → {{ notification.mmr_after }}
            </span>
          </div>
        </div>

        <!-- Dismiss button -->
        <button
          @click="dismiss"
          class="w-full py-2.5 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all active:scale-[0.98]"
          :style="{ backgroundColor: notification.new_tier_color, color: 'white' }"
        >
          {{ isLevelUp ? 'เย้! ไปต่อ' : 'รับทราบ' }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="dismiss">close</button>
    </form>
  </dialog>
</template>
