<script setup>
import { Link } from "@inertiajs/vue3";
import badminton_party from "@/../assets/images/badminton_party_no_bg.png";
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-court-50 via-white to-court-100">
        <!-- Background decoration -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-40 -right-40 w-80 h-80 bg-court-200/30 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-court-300/20 rounded-full blur-3xl"></div>
        </div>

        <!-- Logo -->
        <div class="relative z-10 mb-6 animate-fade-in">
            <Link href="/">
                <img class="w-48 h-auto drop-shadow-lg" :src="badminton_party" alt="Badminton Party" />
            </Link>
        </div>

        <!-- Card -->
        <div class="relative z-10 w-full max-w-md animate-slide-up">
            <div class="bg-base-100/70 backdrop-blur-xl rounded-2xl shadow-lg border border-base-100/50 p-8 transition-shadow hover:shadow-xl">
                <slot />
            </div>
        </div>
    </div>
</template>
