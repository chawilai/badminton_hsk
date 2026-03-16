<script setup>
import { computed } from 'vue';
import AppLayoutClassic from './AppLayoutClassic.vue';
import BadmintonLayout from './BadmintonLayout.vue';
import { useBadmintonLayout } from '@/layout/composables/badmintonLayout';

const { currentTemplate } = useBadmintonLayout();

// Read from localStorage directly for initial render (before initTheme runs)
const storedTemplate = localStorage.getItem('badminton-template');
if (storedTemplate) {
    currentTemplate.value = storedTemplate;
}

const activeLayout = computed(() => {
    return currentTemplate.value === 'classic' ? AppLayoutClassic : BadmintonLayout;
});
</script>

<template>
    <component :is="activeLayout">
        <template #header>
            <slot name="header" />
        </template>
        <slot />
    </component>
</template>
