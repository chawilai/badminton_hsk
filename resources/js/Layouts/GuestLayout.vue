<script setup>
import { Link } from "@inertiajs/vue3";
import LocaleSwitcher from "@/Components/LocaleSwitcher.vue";
const badminton_party = '/icons/icon-192x192.png';
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-base-200">
        <!-- Language switcher -->
        <div class="fixed top-4 right-4 z-50">
            <LocaleSwitcher />
        </div>

        <!-- Background decoration -->
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
            <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        </div>

        <!-- Logo -->
        <div class="relative z-10 mb-6 animate-fade-in">
            <Link href="/">
                <img class="w-40 h-auto drop-shadow-lg" :src="badminton_party" alt="Badminton Party" />
            </Link>
        </div>

        <!-- Card -->
        <div class="relative z-10 w-full max-w-md animate-slide-up">
            <div class="bg-base-100 backdrop-blur-xl rounded-2xl shadow-lg border border-base-300 p-8">
                <slot />
            </div>
        </div>
    </div>
</template>
