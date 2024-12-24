<script setup>
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

const passwordInput = ref(null);
const currentPasswordInput = ref(null);

const form = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const updatePassword = () => {
    form.put(route('password.update'), {
        preserveScroll: true,
        onSuccess: () => form.reset(),
        onError: () => {
            if (form.errors.password) {
                form.reset('password', 'password_confirmation');
                passwordInput.value.focus();
            }
            if (form.errors.current_password) {
                form.reset('current_password');
                currentPasswordInput.value.focus();
            }
        },
    });
};
</script>

<template>
    <section>
        <header>
            <h2 class="tw-text-lg tw-font-medium tw-text-gray-900 dark:text-gray-100">เปลี่ยน รหัสผ่าน</h2>

            <p class="tw-mt-1 tw-text-sm tw-text-gray-600 dark:text-gray-400">
                โปรดกำหนดรหัสผ่าน ให้คาดเดาได้ยาก เพื่อความปลอดภัย
            </p>
        </header>

        <form @submit.prevent="updatePassword" class="tw-mt-6 tw-space-y-6">
            <div>
                <InputLabel for="current_password" value="Current Password" />

                <TextInput
                    id="current_password"
                    ref="currentPasswordInput"
                    v-model="form.current_password"
                    type="password"
                    class="tw-mt-1 tw-block tw-w-full"
                    autocomplete="current-password"
                />

                <InputError :message="form.errors.current_password" class="tw-mt-2" />
            </div>

            <div>
                <InputLabel for="password" value="New Password" />

                <TextInput
                    id="password"
                    ref="passwordInput"
                    v-model="form.password"
                    type="password"
                    class="tw-mt-1 tw-block tw-w-full"
                    autocomplete="new-password"
                />

                <InputError :message="form.errors.password" class="tw-mt-2" />
            </div>

            <div>
                <InputLabel for="password_confirmation" value="Confirm Password" />

                <TextInput
                    id="password_confirmation"
                    v-model="form.password_confirmation"
                    type="password"
                    class="tw-mt-1 tw-block tw-w-full"
                    autocomplete="new-password"
                />

                <InputError :message="form.errors.password_confirmation" class="tw-mt-2" />
            </div>

            <div class="tw-flex tw-items-center tw-gap-4">
                <PrimaryButton :disabled="form.processing">Save</PrimaryButton>

                <Transition
                    enter-active-class="tw-transition tw-ease-in-out"
                    enter-from-class="tw-opacity-0"
                    leave-active-class="tw-transition tw-ease-in-out"
                    leave-to-class="tw-opacity-0"
                >
                    <p v-if="form.recentlySuccessful" class="tw-text-sm tw-text-gray-600 dark:text-gray-400">Saved.</p>
                </Transition>
            </div>
        </form>
    </section>
</template>

