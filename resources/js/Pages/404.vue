<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { Head, Link } from "@inertiajs/vue3";
</script>

<template>
    <Head title="404" />
    <AppLayout>
        <div class="flex flex-col items-center justify-center py-20 text-center">
            <span class="text-6xl mb-4">🏸</span>
            <h1 class="text-4xl font-bold text-base-content mb-2">404</h1>
            <p class="text-base-content/60 mb-6">ไม่พบหน้าที่ต้องการ</p>
            <Link
                href="/home"
                class="h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold no-underline flex items-center hover:bg-primary/80 transition-colors"
            >
                กลับหน้าหลัก
            </Link>
        </div>
    </AppLayout>
</template>
