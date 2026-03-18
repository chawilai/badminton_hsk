<script setup>
import { useLocale } from '@/composables/useLocale';
const { locale, toggleLocale } = useLocale();
</script>

<template>
  <button
    @click="toggleLocale"
    class="h-8 px-3 flex items-center justify-center rounded-lg bg-base-100/80 text-base-content hover:bg-base-200 transition-colors border border-base-300 cursor-pointer text-xs font-bold tracking-wide backdrop-blur-sm"
    :title="locale === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'"
  >
    {{ locale === 'th' ? '🌐 EN' : '🌐 TH' }}
  </button>
</template>
