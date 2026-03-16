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

        <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3">
                <i class="pi pi-key text-2xl text-court-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-base-content m-0">ตั้งรหัสผ่านใหม่</h1>
        </div>

        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <label for="email" class="block text-sm font-medium text-base-content/80 mb-1">Email</label>
                <input id="email" type="email" v-model="form.email" required autofocus autocomplete="username"
                    class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" />
                <InputError class="mt-1" :message="form.errors.email" />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-base-content/80 mb-1">Password</label>
                <input id="password" type="password" v-model="form.password" required autocomplete="new-password" placeholder="********"
                    class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" />
                <InputError class="mt-1" :message="form.errors.password" />
            </div>

            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-base-content/80 mb-1">Confirm Password</label>
                <input id="password_confirmation" type="password" v-model="form.password_confirmation" required autocomplete="new-password" placeholder="********"
                    class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" />
                <InputError class="mt-1" :message="form.errors.password_confirmation" />
            </div>

            <button type="submit" :disabled="form.processing"
                class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all cursor-pointer active:scale-[0.98] shadow-xs disabled:opacity-50 text-sm">
                ตั้งรหัสผ่านใหม่
            </button>
        </form>
    </GuestLayout>
</template>
