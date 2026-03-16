<script setup>
import { onMounted } from 'vue';
import { usePage } from '@inertiajs/vue3';
import BadmintonTopbar from './BadmintonTopbar.vue';
import BadmintonBottomNav from './BadmintonBottomNav.vue';
import { useBadmintonLayout } from '@/layout/composables/badmintonLayout';
import DaisyToast from '@/Components/DaisyToast.vue';
import DaisyConfirmDialog from '@/Components/DaisyConfirmDialog.vue';

const { initTheme } = useBadmintonLayout();
const page = usePage();

onMounted(() => {
    initTheme();
});
</script>

<template>
    <div class="badminton-layout min-h-screen bg-base-200 text-base-content">
        <BadmintonTopbar />

        <main class="pb-20 lg:pb-6 pt-4 px-4 lg:px-8 max-w-5xl mx-auto">
            <transition name="page-fade" mode="out-in">
                <div :key="page.url">
                    <slot />
                </div>
            </transition>
        </main>

        <BadmintonBottomNav />

        <DaisyToast />
        <DaisyConfirmDialog />
    </div>
</template>
