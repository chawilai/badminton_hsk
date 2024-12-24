<script setup>
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Link } from '@inertiajs/vue3';
import warrior_logo from "@/../images/warrior_logo.png";
</script>

<template>
    <div class="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-pt-20 tw-bg-gradient-to-br tw-from-transparent tw-to-red-100">
        <div>
            <Link href="/">
                <!-- <ApplicationLogo class="tw-w-20 tw-h-20 tw-fill-current tw-text-gray-500" /> -->
                <img class="tw-w-44 tw-h-auto" :src="warrior_logo" alt="" />
            </Link>
        </div>

        <div
            class="sm:tw-max-w-md tw-mt-6 tw-px-6 tw-py-4 tw-bg-white dark:tw-bg-gray-800 tw-overflow-hidden sm:tw-rounded-lg tw-shadow-md hover:tw-shadow-xl tw-bg-white/40 hover:tw-bg-white/80 tw-backdrop-blur-md"
        >
            <slot />
        </div>
    </div>
</template>
