<script setup>
import OrganicLayout from "@/Layouts/OrganicLayout.vue";
import DeleteUserForm from "./Partials/DeleteUserForm.vue";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm.vue";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm.vue";
import { Head } from "@inertiajs/vue3";

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});
</script>

<template>
    <Head title="Profile" />

    <OrganicLayout>
        <template #header>
            <h2
                class="tw-font-semibold tw-text-xl tw-text-gray-800 dark:text-gray-200 tw-leading-tight"
            >
                Profile
            </h2>
        </template>

        <div class="tw-py-12">
            <div class="tw-max-w-7xl tw-mx-auto sm:px-6 lg:px-8 tw-space-y-6">
                <div class="tw-flex tw-flex-wrap tw-gap-2 tw-justify-center">
                    <div
                        class="sm:flex-1 tw-w-full tw-max-w-96 tw-p-4 sm:p-8 tw-bg-white dark:bg-gray-800 sm:rounded-lg tw-shadow-md hover:tw-shadow-xl tw-bg-white/40 hover:tw-bg-white/80 tw-backdrop-blur-md"
                    >
                        <UpdateProfileInformationForm
                            :must-verify-email="mustVerifyEmail"
                            :status="status"
                            class="tw-max-w-xl"
                        />
                    </div>

                    <div
                        v-if="false"
                        class="sm:flex-1 tw-w-full tw-max-w-96 tw-p-4 sm:p-8 tw-bg-white dark:bg-gray-800 sm:rounded-lg tw-shadow-md hover:tw-shadow-xl tw-bg-white/40 hover:tw-bg-white/80 tw-backdrop-blur-md"
                    >
                        <UpdatePasswordForm class="tw-max-w-xl"/>
                    </div>

                    <div
                        v-if="false"
                        class="sm:flex-1 tw-w-full tw-p-4 sm:p-8 tw-bg-white dark:bg-gray-800 sm:rounded-lg tw-shadow-md hover:tw-shadow-xl tw-bg-white/40 hover:tw-bg-white/80 tw-backdrop-blur-md"
                    >
                        <DeleteUserForm class="tw-max-w-xl" />
                    </div>
                </div>
            </div>
        </div>
    </OrganicLayout>
</template>
