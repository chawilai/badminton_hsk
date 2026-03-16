<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>
    <GuestLayout>
        <Head title="Register" />

        <div class="tw-text-center tw-mb-6">
            <div class="tw-inline-flex tw-items-center tw-justify-center tw-w-14 tw-h-14 tw-bg-court-100 tw-rounded-2xl tw-mb-3">
                <span class="tw-text-3xl">🏸</span>
            </div>
            <h1 class="tw-text-2xl tw-font-bold tw-text-gray-900 tw-m-0">สมัครสมาชิก</h1>
            <p class="tw-text-sm tw-text-gray-500 tw-mt-1 tw-m-0">Badminton Party</p>
        </div>

        <form @submit.prevent="submit" class="tw-space-y-4">
            <div>
                <label for="name" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Name</label>
                <input id="name" type="text" v-model="form.name" required autofocus autocomplete="name" placeholder="Your name"
                    class="tw-w-full tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-300 tw-bg-white tw-text-gray-900 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all" />
                <InputError class="tw-mt-1" :message="form.errors.name" />
            </div>

            <div>
                <label for="email" class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-1">Email</label>
                <input id="email" type="email" v-model="form.email" required autocomplete="username" placeholder="your@email.com"
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
                class="tw-w-full tw-py-2.5 tw-px-4 tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-font-semibold tw-rounded-xl tw-border-0 tw-transition-all tw-duration-200 tw-cursor-pointer active:tw-scale-[0.98] tw-shadow-sm hover:tw-shadow-md disabled:tw-opacity-50 tw-text-sm">
                สมัครสมาชิก
            </button>

            <p class="tw-text-center tw-text-sm tw-text-gray-500 tw-m-0">
                มีบัญชีอยู่แล้ว?
                <Link :href="route('login')" class="tw-text-court-600 hover:tw-text-court-700 tw-font-medium tw-no-underline">เข้าสู่ระบบ</Link>
            </p>
        </form>
    </GuestLayout>
</template>
