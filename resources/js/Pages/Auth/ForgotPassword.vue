<script setup>
import GuestLayout from "@/Layouts/GuestLayout.vue";
import InputError from "@/Components/InputError.vue";
import InputLabel from "@/Components/InputLabel.vue";
import PrimaryButton from "@/Components/PrimaryButton.vue";
import TextInput from "@/Components/TextInput.vue";
import { Head, useForm } from "@inertiajs/vue3";

defineProps({
    status: {
        type: String,
    },
});

const form = useForm({
    email: "",
});

const submit = () => {
    form.post(route("password.email"));
};
</script>

<template>
    <GuestLayout>
        <Head title="Forgot Password" />

        <div class="tw-mb-4 tw-text-sm tw-text-gray-600 dark:tw-text-gray-400">
            ลืมรหัสผ่าน ไม่มีปัญหา!. ป้อน Email ที่ลงทะเบียนไว้ ท่านจะได้รับ
            Email เพื่อตั้งรหัสใหม่.
        </div>

        <div
            v-if="status"
            class="tw-mb-4 tw-font-medium tw-text-sm tw-text-green-600 dark:tw-text-green-400"
        >
            {{ status }}
        </div>

        <form @submit.prevent="submit">
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

            <div class="tw-flex tw-items-center tw-justify-end tw-mt-4">
                <PrimaryButton
                    :class="{ 'tw-opacity-25': form.processing }"
                    :disabled="form.processing"
                >
                    Email Password Reset Link
                </PrimaryButton>
            </div>
        </form>
    </GuestLayout>
</template>
