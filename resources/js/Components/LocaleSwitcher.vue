<script setup>
import { useLocale } from '@/composables/useLocale';
const { locale, toggleLocale } = useLocale();
</script>

<template>
  <button
    @click="toggleLocale"
    class="h-9 px-2 flex items-center justify-center rounded-lg text-base-content/60 hover:bg-base-200 transition-colors border-0 bg-transparent cursor-pointer text-xs font-bold tracking-wide"
    :title="locale === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'"
  >
    {{ locale === 'th' ? 'EN' : 'TH' }}
  </button>
</template>
