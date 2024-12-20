<script setup>
import ApplicationLogo from '@/Components/ApplicationLogo.vue';
import { Link } from '@inertiajs/vue3';
import warrior_logo from "@/../images/warrior_logo.png";

</script>

<template>
    <div class="min-h-screen flex flex-col items-center pt-20 bg-gradient-to-br from-transparent to-red-100">
        <div>
            <Link href="/">
                <!-- <ApplicationLogo class="w-20 h-20 fill-current text-gray-500" /> -->
                <img class="w-44 h-auto" :src="warrior_logo" alt="" />
            </Link>
        </div>

        <div
            class="sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 overflow-hidden sm:rounded-lg shadow-md hover:shadow-xl bg-white/40 hover:bg-white/80 backdrop-blur-md"
        >
            <slot />
        </div>
    </div>
</template>
