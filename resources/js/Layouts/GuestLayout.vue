<script setup>
import { Link } from "@inertiajs/vue3";
import badminton_party from "@/../assets/images/badminton_party_no_bg.png";
</script>

<template>
    <div class="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-4 tw-py-8 tw-bg-gradient-to-br tw-from-court-50 tw-via-white tw-to-court-100">
        <!-- Background decoration -->
        <div class="tw-fixed tw-inset-0 tw-overflow-hidden tw-pointer-events-none">
            <div class="tw-absolute tw--top-40 tw--right-40 tw-w-80 tw-h-80 tw-bg-court-200/30 tw-rounded-full tw-blur-3xl"></div>
            <div class="tw-absolute tw--bottom-40 tw--left-40 tw-w-80 tw-h-80 tw-bg-court-300/20 tw-rounded-full tw-blur-3xl"></div>
        </div>

        <!-- Logo -->
        <div class="tw-relative tw-z-10 tw-mb-6 tw-animate-fade-in">
            <Link href="/">
                <img class="tw-w-48 tw-h-auto tw-drop-shadow-lg" :src="badminton_party" alt="Badminton Party" />
            </Link>
        </div>

        <!-- Card -->
        <div class="tw-relative tw-z-10 tw-w-full tw-max-w-md tw-animate-slide-up">
            <div class="tw-bg-white/70 tw-backdrop-blur-xl tw-rounded-2xl tw-shadow-lg tw-border tw-border-white/50 tw-p-8 tw-transition-shadow hover:tw-shadow-xl">
                <slot />
            </div>
        </div>
    </div>
</template>
