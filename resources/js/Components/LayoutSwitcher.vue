<script setup>
import { ref } from 'vue';
import { useBadmintonLayout } from '@/layout/composables/badmintonLayout';

const { currentTemplate, switchTemplate } = useBadmintonLayout();
const menuVisible = ref(false);

const toggleMenu = () => {
    menuVisible.value = !menuVisible.value;
};

const selectTemplate = (template) => {
    menuVisible.value = false;
    if (template !== currentTemplate.value) {
        switchTemplate(template);
    }
};
</script>

<template>
    <div class="tw-relative" @click.stop>
        <button
            @click="toggleMenu"
            class="tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-text-gray-500 dark:tw-text-gray-400 hover:tw-bg-gray-100 dark:hover:tw-bg-court-900 tw-transition-colors tw-border-0 tw-bg-transparent tw-cursor-pointer"
            title="Switch layout"
        >
            <i class="pi pi-palette tw-text-base"></i>
        </button>

        <transition name="page-fade">
            <div
                v-if="menuVisible"
                class="tw-absolute tw-right-0 tw-top-full tw-mt-2 tw-w-44 tw-bg-white dark:tw-bg-court-900 tw-rounded-xl tw-shadow-lg tw-border tw-border-gray-200 dark:tw-border-court-800 tw-py-2 tw-z-50 tw-animate-slide-up"
            >
                <button
                    @click="selectTemplate('badminton')"
                    class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2.5 tw-text-sm tw-w-full tw-border-0 tw-bg-transparent tw-cursor-pointer tw-transition-colors tw-font-sans tw-text-left"
                    :class="currentTemplate === 'badminton'
                        ? 'tw-text-court-600 dark:tw-text-court-400 tw-bg-court-50 dark:tw-bg-court-900/50'
                        : 'tw-text-gray-700 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-court-800'"
                >
                    <span class="tw-text-base">🏸</span>
                    <span>Badminton</span>
                    <i v-if="currentTemplate === 'badminton'" class="pi pi-check tw-text-xs tw-ml-auto tw-text-court-500"></i>
                </button>
                <button
                    @click="selectTemplate('classic')"
                    class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2.5 tw-text-sm tw-w-full tw-border-0 tw-bg-transparent tw-cursor-pointer tw-transition-colors tw-font-sans tw-text-left"
                    :class="currentTemplate === 'classic'
                        ? 'tw-text-court-600 dark:tw-text-court-400 tw-bg-court-50 dark:tw-bg-court-900/50'
                        : 'tw-text-gray-700 dark:tw-text-gray-300 hover:tw-bg-gray-50 dark:hover:tw-bg-court-800'"
                >
                    <i class="pi pi-th-large tw-text-base"></i>
                    <span>Classic</span>
                    <i v-if="currentTemplate === 'classic'" class="pi pi-check tw-text-xs tw-ml-auto tw-text-court-500"></i>
                </button>
            </div>
        </transition>
    </div>
</template>
