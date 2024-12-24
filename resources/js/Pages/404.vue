<script setup>
// import GuestLayout from "@/Layouts/GuestLayout.vue";
import OrganicLayout from "@/Layouts/OrganicLayout.vue";
import { Head, Link } from "@inertiajs/vue3";

// defineOptions({ layout: OrganicLayout });
</script>

<template>
    <Head title="404 Page Not Found" />
    <OrganicLayout>
        <div
            class="tw-relative tw-z-10 tw-w-full tw-pt-10 tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-y-4"
        >
            <img
                class="tw-w-72 md:tw-w-96 tw-h-auto hover:tw-scale-110 tw-duration-300"
                src="@/../images/img/object/page_not_found.png"
                alt=""
            />
            <h1 class="tw-text-4xl tw-font-sans tw-font-extrabold">Page Not Found</h1>

            <Link
                href="/warrior_home"
                class="tw-flex tw-justify-center tw-items-center tw-w-auto tw-h-16 tw-px-7 tw-py-2 tw-text-xl tw-font-bold hover:-tw-rotate-3 tw-transition-all tw-ease-out tw-duration-300 tw-leading-7 tw-text-white tw-bg-red tw-border tw-border-red tw-rounded-lg focus:tw-outline-red focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-sky-500 hover:tw-bg-transparent hover:tw-text-red sm:tw-w-auto hover:tw-scale-[1.01] focus:tw-bg-transparent focus:tw-text-red hover:tw-shadow-hsk tw-whitespace-nowrap"
            >
                กลับหน้าหลัก
            </Link>
        </div>
    </OrganicLayout>
</template>

