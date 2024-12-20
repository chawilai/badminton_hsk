<script setup>
import { ref, onMounted } from "vue";
import { Link, usePage, router } from "@inertiajs/vue3";
import ScreenIndicator from "@/Components/ScreenIndicator.vue";

import Dropdown from "@/Components/Dropdown.vue";
import DropdownLink from "@/Components/DropdownLink.vue";

import HamburgerIcon from "@/../icons/hamburger.svg";
import warrior_logo from "@/../images/warrior_logo.png";

const page = usePage();

let activeMenu = ref("Home");
const showingNavigationDropdown = ref(false);

const menus = [
    {
        title: "Home",
        component: "Warrior",
        url: "/warrior_home",
        disabled: false,
        active: true,
    },
    {
        title: "แบบเรียน HSK",
        component: "WarriorHSKTextbook",
        url: "/warrior_textbook",
        disabled: true,
        active: false,
    },
    // {
    //     title: "แบบฝึกหัด HSK",
    //     component: "WarriorHSKWorkbook",
    //     url: "/warrior_workbook",
    //     disabled: true,
    //     active: false,
    // },
    {
        title: "ฝึกคำศัพท์",
        component: "WarriorHSKWords",
        url: "/chinese_words",
        disabled: false,
        active: false,
    },
    {
        title: "เขียนจีน (Hànzì)",
        component: "WarriorWriteHanzi",
        url: "/warrior_writehanzi",
        disabled: false,
        active: false,
    },
    {
        title: "การ์ดคำ",
        component: "WarriorFlipCard",
        url: "/warrior_flip_card",
        disabled: false,
        active: false,
    },
    // {"title":"ทายคำศัพท์", "component": "WarriorHome","url": "/warrior_guessingwords", "disabled": false, "active": false},
];
const sidebarOpen = ref(false);

onMounted(() => {
    router.on("navigate", () => {
        sidebarOpen.value = false;
    });
});
</script>

<template>
    <div
        class="w-full min-h-screen font-sans text-gray-900 bg-gradient-to-br from-transparent to-red-100"
        :class="sidebarOpen ? 'overflow-hidden h-screen' : ''"
    >
        <!-- <ScreenIndicator /> -->

        <nav
            class="flex justify-between items-center py-8 px-6 mx-auto max-w-screen-xl lg:px-12 lg:px-16 xl:px-24"
        >
            <a
                href="/warrior_home"
                class="text-2xl font-bold tracking-wide text-red-600"
            >
                <div class="flex justify-center items-center">
                    <img class="w-20 h-auto" :src="warrior_logo" alt="" />
                    <span>HSK</span>
                    <span class="text-black">Warrior</span>
                </div>
            </a>
            <div
                class="inset-0 transition-all bg-white/70 backdrop-blur-xl z-20 flex-col items-center justify-center space-y-8 lg:static lg:bg-transparent lg:flex lg:space-y-0 lg:space-x-8 lg:flex-row lg:space-x-14"
                :class="sidebarOpen ? 'fixed flex' : 'hidden'"
            >
                <ul
                    class="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6 lg:-x-8"
                >
                    <li
                        v-for="menu in menus"
                        class="text-lg lg:text-base font-medium group"
                    >
                        <Link
                            @click="sidebarOpen = false"
                            as="a"
                            preserve-scroll
                            :href="menu.url"
                            class="relative flex items-center justify-center w-full h-16 px-1 text-base text-gray-900 text-opacity-100 transition-all duration-300 rounded outline-none cursor-pointer group lg:w-auto lg:h-auto lg:inline-block lg:hover:-rotate-3 active:ring-0 active:outline-none"
                        >
                            <span
                                class="relative z-20 whitespace-nowrap"
                                :class="{
                                    'text-red':
                                        menu.component === page.component,
                                }"
                                >{{ menu.title }}</span
                            >
                            <span
                                class="absolute bottom-0 left-0 z-10 w-0 h-2 transition-all duration-300 ease-out skew-x-12 group-hover:w-full bg-red-400"
                            ></span>
                        </Link>
                    </li>
                </ul>
                <Link
                    v-if="!page.props.auth.user"
                    @click="sidebarOpen = false"
                    role="button"
                    href="/login"
                    class="flex justify-center items-center px-7 py-2 hover:-rotate-3 transition-all ease-out duration-300 text-base font-semibold leading-7 text-white bg-red border border-red rounded-lg focus:outline-red focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 hover:bg-transparent hover:text-red sm:w-auto hover:scale-[1.01] focus:bg-transparent focus:text-red hover:shadow-hsk whitespace-nowrap"
                >
                    เริ่มผจญภัย
                </Link>
                <!-- <Link
                    v-if="page.props.auth.user"
                    role="a"
                    href="/profile"
                    class="flex flex-col justify-center items-center"
                >
                    <img
                        class="w-14 h-auto rounded-full"
                        :src="page.props.auth.user.avatar"
                        alt=""
                    />
                    <span
                        class="font-bold"
                        v-text="page.props.auth.user.name"
                    ></span>
                </Link> -->
                <Dropdown align="right" width="48"
                v-if="page.props.auth.user"
                contentClasses="sm:rounded-lg shadow-md hover:shadow-xl bg-white/90 hover:bg-white backdrop-blur-xl"
                >
                    <template #trigger>
                        <div class="flex flex-col justify-center items-center cursor-pointer">
                            <img
                                class="w-14 h-auto rounded-full"
                                :src="page.props.auth.user.avatar"
                                alt=""
                            />
                            <span
                                class="font-bold"
                                v-text="page.props.auth.user.name"
                            ></span>
                        </div>
                    </template>

                    <template #content>
                        <DropdownLink :href="route('profile.edit')">
                            <i class="pi pi-user"></i><span class="ml-2">โปรไฟล์</span>
                        </DropdownLink>
                        <DropdownLink
                            :href="route('logout')"
                            method="post"
                            as="button"
                        >
                            <i class="pi pi-sign-out"></i><span class="ml-2">Log Out</span>
                        </DropdownLink>
                    </template>
                </Dropdown>
            </div>

            <button
                @click="sidebarOpen = !sidebarOpen"
                class="block lg:hidden relative z-30"
            >
                <HamburgerIcon class="w-8 h-8 fill-current text-gray-900" />
            </button>
        </nav>
        <slot />

        <!-- flowbit -->

        <!-- <slot name="content2"></slot> -->

        <div class="container mx-auto px-5" v-if="false">
            <form>
                <div class="grid gap-6 mb-6 lg:grid-cols-2">
                    <div>
                        <label
                            for="first_name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >First name</label
                        >
                        <input
                            type="text"
                            id="first_name"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="John"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="last_name"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Last name</label
                        >
                        <input
                            type="text"
                            id="last_name"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Doe"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="company"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Company</label
                        >
                        <input
                            type="text"
                            id="company"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Flowbite"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="phone"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Phone number</label
                        >
                        <input
                            type="tel"
                            id="phone"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="123-45-678"
                            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="website"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Website URL</label
                        >
                        <input
                            type="url"
                            id="website"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="flowbite.com"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="visitors"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >Unique visitors (per month)</label
                        >
                        <input
                            type="number"
                            id="visitors"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder=""
                            required
                        />
                    </div>
                </div>
                <div class="mb-6">
                    <label
                        for="email"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Email address</label
                    >
                    <input
                        type="email"
                        id="email"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="john.doe@company.com"
                        required
                    />
                </div>
                <div class="mb-6">
                    <label
                        for="password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Password</label
                    >
                    <input
                        type="password"
                        id="password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="•••••••••"
                        required
                    />
                </div>
                <div class="mb-6">
                    <label
                        for="confirm_password"
                        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >Confirm password</label
                    >
                    <input
                        type="password"
                        id="confirm_password"
                        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="•••••••••"
                        required
                    />
                </div>
                <div class="flex items-start mb-6">
                    <div class="flex items-center h-5">
                        <input
                            id="remember"
                            type="checkbox"
                            value=""
                            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                            required
                        />
                    </div>
                    <label
                        for="remember"
                        class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >I agree with the
                        <a
                            href="#"
                            class="text-blue-600 hover:underline dark:text-blue-500"
                            >terms and conditions</a
                        >.</label
                    >
                </div>
                <button
                    type="submit"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Submit
                </button>
            </form>
        </div>
        <!-- flowbit -->
        <hr class="my-5" v-if="false" />
        <!-- flowbit table -->
        <div class="container mx-auto px-5" v-if="false">
            <div class="relative overflow-x-auto sm:rounded-lg">
                <table
                    class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                    <thead
                        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                    >
                        <tr>
                            <th scope="col" class="p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-all-search"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-all-search"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </th>
                            <th scope="col" class="px-6 py-3">Product name</th>
                            <th scope="col" class="px-6 py-3">Color</th>
                            <th scope="col" class="px-6 py-3">Category</th>
                            <th scope="col" class="px-6 py-3">Price</th>
                            <th scope="col" class="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-1"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-1"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                Apple MacBook Pro 17"
                            </th>
                            <td class="px-6 py-4">Silver</td>
                            <td class="px-6 py-4">Laptop</td>
                            <td class="px-6 py-4">$2999</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-2"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-2"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                Microsoft Surface Pro
                            </th>
                            <td class="px-6 py-4">White</td>
                            <td class="px-6 py-4">Laptop PC</td>
                            <td class="px-6 py-4">$1999</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                Magic Mouse 2
                            </th>
                            <td class="px-6 py-4">Black</td>
                            <td class="px-6 py-4">Accessories</td>
                            <td class="px-6 py-4">$99</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                Apple Watch
                            </th>
                            <td class="px-6 py-4">Black</td>
                            <td class="px-6 py-4">Watches</td>
                            <td class="px-6 py-4">$199</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                Apple iMac
                            </th>
                            <td class="px-6 py-4">Silver</td>
                            <td class="px-6 py-4">PC</td>
                            <td class="px-6 py-4">$2999</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                Apple AirPods
                            </th>
                            <td class="px-6 py-4">White</td>
                            <td class="px-6 py-4">Accessories</td>
                            <td class="px-6 py-4">$399</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                iPad Pro
                            </th>
                            <td class="px-6 py-4">Gold</td>
                            <td class="px-6 py-4">Tablet</td>
                            <td class="px-6 py-4">$699</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                Magic Keyboard
                            </th>
                            <td class="px-6 py-4">Black</td>
                            <td class="px-6 py-4">Accessories</td>
                            <td class="px-6 py-4">$99</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                Smart Folio iPad Air
                            </th>
                            <td class="px-6 py-4">Blue</td>
                            <td class="px-6 py-4">Accessories</td>
                            <td class="px-6 py-4">$79</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="w-4 p-4">
                                <div class="flex items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="sr-only"
                                        >checkbox</label
                                    >
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                AirTag
                            </th>
                            <td class="px-6 py-4">Silver</td>
                            <td class="px-6 py-4">Accessories</td>
                            <td class="px-6 py-4">$29</td>
                            <td class="px-6 py-4">
                                <a
                                    href="#"
                                    class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                    >Edit</a
                                >
                            </td>
                        </tr>
                    </tbody>
                </table>
                <nav
                    class="flex items-center flex-column flex-wrap lg:flex-row justify-between pt-4 mb-4"
                    aria-label="Table navigation"
                >
                    <span
                        class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 lg:mb-0 block w-full lg:inline lg:w-auto"
                        >Showing
                        <span
                            class="font-semibold text-gray-900 dark:text-white"
                            >1-10</span
                        >
                        of
                        <span
                            class="font-semibold text-gray-900 dark:text-white"
                            >1000</span
                        ></span
                    >
                    <ul
                        class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8"
                    >
                        <li>
                            <a
                                href="#"
                                class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >Previous</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >1</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >2</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                aria-current="page"
                                class="flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                                >3</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >4</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >5</a
                            >
                        </li>
                        <li>
                            <a
                                href="#"
                                class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                >Next</a
                            >
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <!-- flowbit table -->
    </div>
</template>
