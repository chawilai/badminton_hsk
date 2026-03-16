<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import { Head, useForm } from '@inertiajs/vue3';

const form = useForm({ password: '' });
const submit = () => { form.post(route('password.confirm'), { onFinish: () => form.reset() }); };
</script>

<template>
    <GuestLayout>
        <Head title="Confirm Password" />

        <div class="tw-text-center tw-mb-6">
            <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-14 tw-h-14 tw-bg-court-100 tw-rounded-2xl tw-mb-3">
                <i class="pi pi-shield tw-text-2xl tw-text-court-600"></i>
            </div>
            <h1 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-m-0">ยืนยันรหัสผ่าน</h1>
            <p class="tw-text-sm tw-text-gray-500 tw-mt-2 tw-m-0">กรุณายืนยันรหัสผ่านก่อนดำเนินการต่อ</p>
        </div>

        <form @submit.prevent="submit" class="tw-space-y-4">
            <div>
                <label for="password" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Password</label>
                <input id="password" type="password" v-model="form.password" required autocomplete="current-password" autofocus placeholder="********"
                    class="tw-w-full tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white tw-text-gray-900 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all" />
                <InputError class="tw-mt-1" :message="form.errors.password" />
            </div>

            <button type="submit" :disabled="form.processing"
                class="tw-w-full tw-py-2.5 tw-px-4 tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-font-semibold tw-rounded-xl tw-border-0 tw-transition-all tw-cursor-pointer active:tw-scale-[0.98] tw-shadow-sm disabled:tw-opacity-50 tw-text-sm">
                ยืนยัน
            </button>
        </form>
    </GuestLayout>
</template>
