<script setup>
import Checkbox from "@/Components/Checkbox.vue";
import GuestLayout from "@/Layouts/GuestLayout.vue";
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import { Head, Link, useForm } from "@inertiajs/vue3";

import btn_login_base from "@/../images/btn_login_base.png";
import google_login from "@/../images/google_login.png";

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: "",
    password: "",
    remember: false,
});

const submit = () => {
    form.post(route("login"), {
        onFinish: () => form.reset("password"),
    });
};

// Social media login URLs
const googleLoginUrl = route("social.login", "google");
const lineLoginUrl = route("social.login", "line");
</script>

<template>
    <GuestLayout>
        <Head title="Log in" />

        <div
            v-if="status"
            class="tw-mb-4 tw-font-medium tw-text-sm tw-text-green-600"
        >
            {{ status }}
        </div>

        <form @submit.prevent="submit" v-if="false">
            <div>
                <InputLabel for="email" value="Email" />

                <TextInput
                    id="email"
                    type="email"
                    class="tw-mt-1 tw-block tw-w-full"
                    v-model="form.email"
                    required
                    autofocus
                    autocomplete="username"
                />

                <InputError class="tw-mt-2" :message="form.errors.email" />
            </div>

            <div class="tw-mt-4">
                <InputLabel for="password" value="Password" />

                <TextInput
                    id="password"
                    type="password"
                    class="tw-mt-1 tw-block tw-w-full"
                    v-model="form.password"
                    required
                    autocomplete="current-password"
                />

                <InputError class="tw-mt-2" :message="form.errors.password" />
            </div>

            <div class="tw-block tw-mt-4">
                <label class="tw-flex tw-items-center">
                    <Checkbox name="remember" v-model:checked="form.remember" />
                    <span
                        class="tw-ms-2 tw-text-sm tw-text-gray-600 dark:tw-text-gray-400"
                        >Remember me</span
                    >
                </label>
            </div>

            <div class="tw-flex tw-items-center tw-justify-end tw-mt-4">
                <Link
                    v-if="canResetPassword"
                    :href="route('password.request')"
                    class="tw-underline tw-text-sm tw-text-gray-600 dark:tw-text-gray-400 hover:tw-text-gray-900 dark:hover:tw-text-gray-100 tw-rounded-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-indigo-500 dark:focus:tw-ring-offset-gray-800"
                >
                    ลืม Password ?
                </Link>

                <PrimaryButton
                    class="tw-ms-4"
                    :class="{ 'tw-opacity-25': form.processing }"
                    :disabled="form.processing"
                >
                    ลงชื่อเข้าใช้
                </PrimaryButton>
            </div>
        </form>

        <hr class="tw-my-4" v-if="false" />

        <h2 class="tw-text-center tw-mb-4 tw-text-xl tw-font-bold">
            เข้าสู่ระบบ
        </h2>
        <hr class="tw-my-4" />

        <div class="tw-flex tw-justify-center tw-gap-4 tw-py-4">
            <a :href="googleLoginUrl">
                <img :src="google_login" class="tw-h-10 tw-w-auto" alt="" />
            </a>
            <a :href="lineLoginUrl">
                <img :src="btn_login_base" class="tw-h-10 tw-w-auto" alt="" />
            </a>
        </div>
    </GuestLayout>
</template>

<style scoped>
.btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    color: #fff;
    border-radius: 0.375rem;
    transition: background-color 0.2s;
}

.btn-danger {
    background-color: #dc3545;
}

.btn-danger:hover {
    background-color: #c82333;
}

.btn-success {
    background-color: #28a745;
}

.btn-success:hover {
    background-color: #218838;
}

.mx-2 {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
}
</style>
