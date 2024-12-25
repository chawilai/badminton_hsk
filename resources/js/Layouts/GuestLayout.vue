<script setup>
import ApplicationLogo from "@/Components/ApplicationLogo.vue";
import { Link } from "@inertiajs/vue3";
import badminton_party from "@/../assets/images/badminton_party_no_bg.png";
</script>

<template>
    <div class="min-h-screen flex flex-column align-items-center pt-8 bg-red-50">
        <div>
            <Link href="/">
                <img class="w-16rem h-auto" :src="badminton_party" alt="" />
            </Link>
        </div>

        <div
            class="max-w-max mt-6 mx-3 p-8 px-6 py-4 bg-white overflow-hidden sm:border-round-lg shadow-2 hover:shadow-xl bg-white/40 hover:bg-white/80"
        >
            <slot />
        </div>
    </div>
</template>
