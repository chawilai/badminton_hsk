<script setup>
import AppLayout from "@/layout/AppLayout.vue";
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

    <AppLayout>
        <template #header>
            <h2
                class="font-semibold text-xl text-base-content leading-tight"
            >
                Profile
            </h2>
        </template>

        <div class="py-12">
            <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div class="flex flex-wrap gap-2 justify-center">
                    <div
                        class="sm:flex-1 w-full max-w-96 p-4 sm:p-8 bg-base-100 sm:rounded-lg shadow-md hover:shadow-xl bg-base-100/40 hover:bg-base-100/80 backdrop-blur-md"
                    >
                        <UpdateProfileInformationForm
                            :must-verify-email="mustVerifyEmail"
                            :status="status"
                            class="max-w-xl"
                        />
                    </div>

                    <div
                        v-if="false"
                        class="sm:flex-1 w-full max-w-96 p-4 sm:p-8 bg-base-100 sm:rounded-lg shadow-md hover:shadow-xl bg-base-100/40 hover:bg-base-100/80 backdrop-blur-md"
                    >
                        <UpdatePasswordForm class="max-w-xl"/>
                    </div>

                    <div
                        v-if="false"
                        class="sm:flex-1 w-full p-4 sm:p-8 bg-base-100 sm:rounded-lg shadow-md hover:shadow-xl bg-base-100/40 hover:bg-base-100/80 backdrop-blur-md"
                    >
                        <DeleteUserForm class="max-w-xl" />
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
