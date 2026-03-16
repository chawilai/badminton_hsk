<script setup>
import GuestLayout from "@/Layouts/GuestLayout.vue";
import InputError from "@/Components/InputError.vue";
import { Head, useForm } from "@inertiajs/vue3";

defineProps({ status: { type: String } });

const form = useForm({ email: "" });

const submit = () => { form.post(route("password.email")); };
</script>

<template>
    <GuestLayout>
        <Head title="Forgot Password" />

        <div class="tw-text-center tw-mb-6">
            <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-14 tw-h-14 tw-bg-court-100 tw-rounded-2xl tw-mb-3">
                <i class="pi pi-lock tw-text-2xl tw-text-court-600"></i>
            </div>
            <h1 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-m-0">ลืมรหัสผ่าน</h1>
            <p class="tw-text-sm tw-text-gray-500 tw-mt-2 tw-m-0">ป้อน Email ที่ลงทะเบียนไว้ ท่านจะได้รับ Email เพื่อตั้งรหัสใหม่</p>
        </div>

        <div v-if="status" class="tw-mb-4 tw-p-3 tw-rounded-xl tw-bg-court-50 tw-text-court-700 tw-text-sm tw-text-center">{{ status }}</div>

        <form @submit.prevent="submit" class="tw-space-y-4">
            <div>
                <label for="email" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Email</label>
                <input id="email" type="email" v-model="form.email" required autofocus autocomplete="username" placeholder="your@email.com"
                    class="tw-w-full tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white tw-text-gray-900 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all" />
                <InputError class="tw-mt-1" :message="form.errors.email" />
            </div>

            <button type="submit" :disabled="form.processing"
                class="tw-w-full tw-py-2.5 tw-px-4 tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-font-semibold tw-rounded-xl tw-border-0 tw-transition-all tw-cursor-pointer active:tw-scale-[0.98] tw-shadow-sm disabled:tw-opacity-50 tw-text-sm">
                ส่งลิงก์ตั้งรหัสผ่านใหม่
            </button>
        </form>
    </GuestLayout>
</template>
