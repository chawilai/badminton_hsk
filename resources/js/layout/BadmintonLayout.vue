<script setup>
import { onMounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import BadmintonTopbar from './BadmintonTopbar.vue';
import BadmintonBottomNav from './BadmintonBottomNav.vue';
import { useBadmintonLayout } from '@/layout/composables/badmintonLayout';

const { isDarkMode, initTheme } = useBadmintonLayout();
const page = usePage();

onMounted(() => {
    initTheme();
});
</script>

<template>
    <div class="badminton-layout dark-transition tw-min-h-screen tw-bg-gray-50 dark:tw-bg-court-950 tw-text-gray-900 dark:tw-text-gray-100">
        <BadmintonTopbar />

        <main class="tw-pb-20 lg:tw-pb-6 tw-pt-4 tw-px-4 lg:tw-px-8 tw-max-w-5xl tw-mx-auto">
            <transition name="page-fade" mode="out-in">
                <div :key="page.url">
                    <slot />
                </div>
            </transition>
        </main>

        <BadmintonBottomNav />

        <Toast />
    </div>
</template>
