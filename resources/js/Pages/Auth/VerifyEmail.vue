<script setup>
import { computed } from 'vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const props = defineProps({ status: { type: String } });
const form = useForm({});
const submit = () => { form.post(route('verification.send')); };
const verificationLinkSent = computed(() => props.status === 'verification-link-sent');
</script>

<template>
    <GuestLayout>
        <Head title="Email Verification" />

        <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3">
                <i class="pi pi-envelope text-2xl text-court-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-base-content m-0">ยืนยัน Email</h1>
            <p class="text-sm text-base-content/60 mt-2 m-0">กรุณายืนยัน Email ของท่าน โดยคลิกลิงก์ที่ส่งไป ถ้ายังไม่ได้รับสามารถกดส่งใหม่ได้</p>
        </div>

        <div v-if="verificationLinkSent" class="mb-4 p-3 rounded-xl bg-court-50 text-court-700 text-sm text-center">
            ส่งลิงก์ยืนยันไปยัง Email แล้ว
        </div>

        <form @submit.prevent="submit" class="space-y-4">
            <button type="submit" :disabled="form.processing"
                class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all cursor-pointer active:scale-[0.98] shadow-xs disabled:opacity-50 text-sm">
                ส่งลิงก์ยืนยันอีกครั้ง
            </button>

            <div class="text-center">
                <Link :href="route('logout')" method="post" as="button"
                    class="text-sm text-base-content/60 hover:text-base-content/80 no-underline bg-transparent border-0 cursor-pointer font-sans">
                    ออกจากระบบ
                </Link>
            </div>
        </form>
    </GuestLayout>
</template>
