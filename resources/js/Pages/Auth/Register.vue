<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';
import { useLocale } from '@/composables/useLocale';

const { t } = useLocale();

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
        <Head :title="t('auth.register')" />

        <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3">
                <span class="text-3xl">🏸</span>
            </div>
            <h1 class="text-2xl font-bold text-base-content m-0">{{ t('auth.register') }}</h1>
            <p class="text-sm text-base-content/60 mt-1 m-0">Badminton Party</p>
        </div>

        <form @submit.prevent="submit" class="space-y-4">
            <div>
                <label for="name" class="block text-sm font-medium text-base-content/80 mb-1">{{ t('auth.name') }}</label>
                <input id="name" type="text" v-model="form.name" required autofocus autocomplete="name" :placeholder="t('auth.namePlaceholder')"
                    class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" />
                <InputError class="mt-1" :message="form.errors.name" />
            </div>

            <div>
                <label for="email" class="block text-sm font-medium text-base-content/80 mb-1">{{ t('auth.email') }}</label>
                <input id="email" type="email" v-model="form.email" required autocomplete="username" placeholder="your@email.com"
                    class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" />
                <InputError class="mt-1" :message="form.errors.email" />
            </div>

            <div>
                <label for="password" class="block text-sm font-medium text-base-content/80 mb-1">{{ t('auth.password') }}</label>
                <input id="password" type="password" v-model="form.password" required autocomplete="new-password" placeholder="********"
                    class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" />
                <InputError class="mt-1" :message="form.errors.password" />
            </div>

            <div>
                <label for="password_confirmation" class="block text-sm font-medium text-base-content/80 mb-1">{{ t('auth.confirmPassword') }}</label>
                <input id="password_confirmation" type="password" v-model="form.password_confirmation" required autocomplete="new-password" placeholder="********"
                    class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" />
                <InputError class="mt-1" :message="form.errors.password_confirmation" />
            </div>

            <button type="submit" :disabled="form.processing"
                class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs hover:shadow-md disabled:opacity-50 text-sm">
                {{ t('auth.register') }}
            </button>

            <p class="text-center text-sm text-base-content/60 m-0">
                {{ t('auth.hasAccount') }}
                <Link :href="route('login')" class="text-court-600 hover:text-court-700 font-medium no-underline">{{ t('auth.login') }}</Link>
            </p>
        </form>
    </GuestLayout>
</template>
