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

        <div class="tw-text-center tw-mb-6">
            <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-14 tw-h-14 tw-bg-court-100 tw-rounded-2xl tw-mb-3">
                <i class="pi pi-envelope tw-text-2xl tw-text-court-600"></i>
            </div>
            <h1 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-m-0">ยืนยัน Email</h1>
            <p class="tw-text-sm tw-text-gray-500 tw-mt-2 tw-m-0">กรุณายืนยัน Email ของท่าน โดยคลิกลิงก์ที่ส่งไป ถ้ายังไม่ได้รับสามารถกดส่งใหม่ได้</p>
        </div>

        <div v-if="verificationLinkSent" class="tw-mb-4 tw-p-3 tw-rounded-xl tw-bg-court-50 tw-text-court-700 tw-text-sm tw-text-center">
            ส่งลิงก์ยืนยันไปยัง Email แล้ว
        </div>

        <form @submit.prevent="submit" class="tw-space-y-4">
            <button type="submit" :disabled="form.processing"
                class="tw-w-full tw-py-2.5 tw-px-4 tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-font-semibold tw-rounded-xl tw-border-0 tw-transition-all tw-cursor-pointer active:tw-scale-[0.98] tw-shadow-sm disabled:tw-opacity-50 tw-text-sm">
                ส่งลิงก์ยืนยันอีกครั้ง
            </button>

            <div class="tw-text-center">
                <Link :href="route('logout')" method="post" as="button"
                    class="tw-text-sm tw-text-gray-500 hover:tw-text-gray-700 tw-no-underline tw-bg-transparent tw-border-0 tw-cursor-pointer tw-font-sans">
                    ออกจากระบบ
                </Link>
            </div>
        </form>
    </GuestLayout>
</template>
