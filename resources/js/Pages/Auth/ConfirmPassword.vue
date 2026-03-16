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

        <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3">
                <i class="pi pi-shield text-2xl text-court-600"></i>
            </div>
            <h1 class="text-2xl font-bold text-base-content m-0">ยืนยันรหัสผ่าน</h1>
            <p class="text-sm text-base-content/60 mt-2 m-0">กรุณายืนยันรหัสผ่านก่อนดำเนินการต่อ</p>
        </div>

        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <label for="password" class="block text-sm font-medium text-base-content/80 mb-1">Password</label>
                <input id="password" type="password" v-model="form.password" required autocomplete="current-password" autofocus placeholder="********"
                    class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" />
                <InputError class="mt-1" :message="form.errors.password" />
            </div>

            <button type="submit" :disabled="form.processing"
                class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all cursor-pointer active:scale-[0.98] shadow-xs disabled:opacity-50 text-sm">
                ยืนยัน
            </button>
        </form>
    </GuestLayout>
</template>
