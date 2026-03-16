<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { ref } from "vue";
import { useToast } from "@/composables/useToast";
import { Head, Link, router } from "@inertiajs/vue3";

const toast = useToast();

const visible = ref(false);

const items = ref([
    {
        label: "Add",
        icon: "pencil",
        command: () => {
            toast.add({
                severity: "info",
                summary: "Add",
                detail: "Data Added",
            });
        },
    },
    {
        label: "Update",
        icon: "refresh",
        command: () => {
            toast.add({
                severity: "success",
                summary: "Update",
                detail: "Data Updated",
            });
        },
    },
    {
        label: "Delete",
        icon: "trash",
        command: () => {
            toast.add({
                severity: "error",
                summary: "Delete",
                detail: "Data Deleted",
            });
        },
    },
    {
        label: "Upload",
        icon: "upload",
        command: () => {
            router.visit("/fileupload");
        },
    },
    {
        label: "Vue Website",
        icon: "external-link",
        command: () => {
            window.location.href = "https://vuejs.org/";
        },
    },
]);

const sidebarSections = ref({
    favorites: true,
    application: true,
    reportsExpanded: false,
    revenueExpanded: false,
});

const toggleSection = (section) => {
    sidebarSections.value[section] = !sidebarSections.value[section];
};
</script>

<template>
    <Head title="Welcome" />

    <AppLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                First Setup
            </h2>
        </template>

        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12">
                <div class="card p-4">
                    <h5 class="text-lg font-semibold">Empty Page</h5>
                    <p>
                        Use this page to start from scratch and place your
                        custom content.
                    </p>
                </div>
            </div>

            <div class="card p-4">
            </div>

            <div class="card w-full p-4">
                <!-- Sidebar Drawer -->
                <div class="drawer">
                    <input id="sidebar-drawer" type="checkbox" class="drawer-toggle" v-model="visible" />
                    <div class="drawer-content">
                        <button class="btn btn-ghost" @click="visible = true">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                    <div class="drawer-side z-50">
                        <label for="sidebar-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
                        <div class="menu bg-base-100 text-base-content min-h-full w-80 p-0 flex flex-col h-full">
                            <div
                                class="flex items-center justify-between px-4 pt-3 shrink-0"
                            >
                                <span
                                    class="inline-flex items-center gap-2"
                                >
                                    <svg
                                        width="35"
                                        height="40"
                                        viewBox="0 0 35 40"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
                                            fill="currentColor"
                                        />
                                        <path
                                            d="M30.69 4.21L24.37 4.81L22.57 0.69L22.86 0H26.48L30.69 4.21ZM23.75 5.67L22.66 3.08L18.05 14.24V17.14H19.7H20.03H20.16H20.2L24.1 15.7L30.11 5.19L23.75 5.67ZM4.21002 4.21L10.53 4.81L12.33 0.69L12.05 0H8.43002L4.22002 4.21H4.21002ZM21.9 17.4L20.6 18.2H14.3L13 17.4L12.4 18.2L12.42 18.23L17.45 26.8L22.48 18.23L22.5 18.2L21.9 17.4ZM4.79002 5.19L10.8 15.7L14.7 17.14H14.74H15.2H16.85V14.24L12.24 3.09L11.15 5.68L4.79002 5.2V5.19Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span
                                        class="font-semibold text-2xl text-primary"
                                        >Your Logo</span
                                    >
                                </span>
                                <span>
                                    <button
                                        type="button"
                                        @click="visible = false"
                                        class="btn btn-sm btn-circle btn-outline"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </span>
                            </div>
                            <div class="overflow-y-auto">
                                <ul class="list-none p-3 m-0">
                                    <li>
                                        <div
                                            @click="toggleSection('favorites')"
                                            class="p-3 flex items-center justify-between text-gray-600 cursor-pointer hover:bg-base-200 rounded-lg"
                                        >
                                            <span class="font-medium"
                                                >FAVORITES</span
                                            >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': sidebarSections.favorites }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                        <ul
                                            v-show="sidebarSections.favorites"
                                            class="list-none p-0 m-0 overflow-hidden"
                                        >
                                            <li>
                                                <a
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                                    <span class="font-medium"
                                                        >Dashboard</span
                                                    >
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                                                    <span class="font-medium"
                                                        >Bookmarks</span
                                                    >
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    @click="toggleSection('reportsExpanded')"
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                                                    <span class="font-medium"
                                                        >Reports</span
                                                    >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto transition-transform" :class="{ 'rotate-180': sidebarSections.reportsExpanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                                </a>
                                                <ul
                                                    v-show="sidebarSections.reportsExpanded"
                                                    class="list-none py-0 pl-3 pr-0 m-0 overflow-y-hidden"
                                                >
                                                    <li>
                                                        <a
                                                            @click="toggleSection('revenueExpanded')"
                                                            class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                                                            <span
                                                                class="font-medium"
                                                                >Revenue</span
                                                            >
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ml-auto transition-transform" :class="{ 'rotate-180': sidebarSections.revenueExpanded }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                                        </a>
                                                        <ul
                                                            v-show="sidebarSections.revenueExpanded"
                                                            class="list-none py-0 pl-3 pr-0 m-0 overflow-y-hidden"
                                                        >
                                                            <li>
                                                                <a
                                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                                    <span
                                                                        class="font-medium"
                                                                        >View</span
                                                                    >
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a
                                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                                                    <span
                                                                        class="font-medium"
                                                                        >Search</span
                                                                    >
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <a
                                                            class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                                                            <span
                                                                class="font-medium"
                                                                >Expenses</span
                                                            >
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                                    <span class="font-medium"
                                                        >Team</span
                                                    >
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                                    <span class="font-medium"
                                                        >Messages</span
                                                    >
                                                    <span
                                                        class="inline-flex items-center justify-center ml-auto bg-primary text-primary-content rounded-full"
                                                        style="
                                                            min-width: 1.5rem;
                                                            height: 1.5rem;
                                                        "
                                                        >3</span
                                                    >
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    <span class="font-medium"
                                                        >Calendar</span
                                                    >
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    <span class="font-medium"
                                                        >Settings</span
                                                    >
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <ul class="list-none p-3 m-0">
                                    <li>
                                        <div
                                            @click="toggleSection('application')"
                                            class="p-3 flex items-center justify-between text-gray-600 cursor-pointer hover:bg-base-200 rounded-lg"
                                        >
                                            <span class="font-medium"
                                                >APPLICATION</span
                                            >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 transition-transform" :class="{ 'rotate-180': sidebarSections.application }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                        <ul
                                            v-show="sidebarSections.application"
                                            class="list-none p-0 m-0 overflow-hidden"
                                        >
                                            <li>
                                                <a
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                                                    <span class="font-medium"
                                                        >Projects</span
                                                    >
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                                    <span class="font-medium"
                                                        >Performance</span
                                                    >
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    class="flex items-center cursor-pointer p-3 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                    <span class="font-medium"
                                                        >Settings</span
                                                    >
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                            <div class="mt-auto">
                                <hr
                                    class="mb-3 mx-3 border-t border-base-300"
                                />
                                <a
                                    class="m-3 flex items-center cursor-pointer p-3 gap-2 rounded-lg text-gray-700 hover:bg-base-200 transition-all duration-150"
                                >
                                    <div class="avatar">
                                        <div class="w-10 rounded-full">
                                            <img src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" alt="Amy Elsner" />
                                        </div>
                                    </div>
                                    <span class="font-bold">Amy Elsner</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
</template>
