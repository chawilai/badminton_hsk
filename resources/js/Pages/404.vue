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
            class="relative z-10 w-full pt-10 flex flex-col items-center justify-center gap-y-4"
        >
            <img
                class="w-72 md:w-96 h-auto hover:scale-110 duration-300"
                src="@/../images/img/object/page_not_found.png"
                alt=""
            />
            <h1 class="text-4xl font-sans font-extrabold">Page Not Found</h1>

            <Link
                href="/warrior_home"
                class="flex justify-center items-center w-auto h-16 px-7 py-2 text-xl font-bold hover:-rotate-3 transition-all ease-out duration-300 leading-7 text-white bg-red border border-red rounded-lg focus:outline-red focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 hover:bg-transparent hover:text-red sm:w-auto hover:scale-[1.01] focus:bg-transparent focus:text-red hover:shadow-hsk whitespace-nowrap"
            >
                กลับหน้าหลัก
            </Link>
        </div>
    </OrganicLayout>
</template>
