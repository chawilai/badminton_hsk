<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import { Head, useForm } from '@inertiajs/vue3';

const props = defineProps({ email: { type: String, required: true }, token: { type: String, required: true } });

const form = useForm({ token: props.token, email: props.email, password: '', password_confirmation: '' });

const submit = () => { form.post(route('password.store'), { onFinish: () => form.reset('password', 'password_confirmation') }); };
</script>

<template>
    <GuestLayout>
        <Head title="Reset Password" />

        <div class="tw-text-center tw-mb-6">
            <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-14 tw-h-14 tw-bg-court-100 tw-rounded-2xl tw-mb-3">
                <i class="pi pi-key tw-text-2xl tw-text-court-600"></i>
            </div>
            <h1 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-m-0">ตั้งรหัสผ่านใหม่</h1>
        </div>

        <form @submit.prevent="submit" class="tw-space-y-4">
            <div>
                <label for="email" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Email</label>
                <input id="email" type="email" v-model="form.email" required autofocus autocomplete="username"
                    class="tw-w-full tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white tw-text-gray-900 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all" />
                <InputError class="tw-mt-1" :message="form.errors.email" />
            </div>

            <div>
                <label for="password" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Password</label>
                <input id="password" type="password" v-model="form.password" required autocomplete="new-password" placeholder="********"
                    class="tw-w-full tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white tw-text-gray-900 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all" />
                <InputError class="tw-mt-1" :message="form.errors.password" />
            </div>

            <div>
                <label for="password_confirmation" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Confirm Password</label>
                <input id="password_confirmation" type="password" v-model="form.password_confirmation" required autocomplete="new-password" placeholder="********"
                    class="tw-w-full tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white tw-text-gray-900 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all" />
                <InputError class="tw-mt-1" :message="form.errors.password_confirmation" />
            </div>

            <button type="submit" :disabled="form.processing"
                class="tw-w-full tw-py-2.5 tw-px-4 tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-font-semibold tw-rounded-xl tw-border-0 tw-transition-all tw-cursor-pointer active:tw-scale-[0.98] tw-shadow-sm disabled:tw-opacity-50 tw-text-sm">
                ตั้งรหัสผ่านใหม่
            </button>
        </form>
    </GuestLayout>
</template>
