<script setup>
import ScreenIndicator from "@/Components/ScreenIndicator.vue";
import ChefPromote from "@/Components/ChefPromote.vue";

// Dynamically import all avatar images
const avatarImports = import.meta.glob("../../images/img/avatar-*.jpeg", {
    eager: true,
});

const avatars = ref({});

// Map the imported images to their indices
Object.keys(avatarImports).forEach((path) => {
    const match = path.match(/avatar-(\d+)\.jpeg$/);
    if (match) {
        avatars.value[match[1]] = avatarImports[path].default;
    }
});

// Function to get the avatar source by index
const getAvatarSrc = (index) => avatars.value[index] || "";

import { ref } from "vue";
import HamburgerIcon from "@/../icons/hamburger.svg";
import StarIcon from "@/../icons/star.svg";
import FuelerIcon from "@/../icons/fueler.svg";

let activeMenu = ref("Home");
const menus = ["Home", "Delivery", "Pricing", "FAQs", "Contact"];
const sidebarOpen = ref(false);
</script>

<template>
    <div
        class="w-full min-h-screen font-sans text-gray-900 bg-gradient-to-br from-transparent to-green-100"
        :class="sidebarOpen ? 'overflow-hidden h-screen' : ''"
    >
        <ScreenIndicator />

        <nav
            class="flex justify-between items-center py-8 px-6 mx-auto max-w-screen-xl md:px-12 lg:px-16 xl:px-24"
        >
            <a href="#" class="text-3xl md:text-4xl font-bold tracking-wide">
                Organ<span class="text-green">o</span>
            </a>
            <div
                class="inset-0 transition-all bg-white/70 backdrop-blur-xl z-20 flex-col items-center justify-center space-y-8 md:static md:bg-transparent md:flex md:space-y-0 md:space-x-8 md:flex-row lg:space-x-14"
                :class="sidebarOpen ? 'fixed flex' : 'hidden'"
            >
                <ul
                    class="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6 lg:md:-x-8"
                >
                    <li
                        v-for="menu in menus"
                        @click="activeMenu = menu"
                        class="text-lg md:text-base lg:text-lg font-medium group"
                        :class="{ 'text-green': activeMenu === menu }"
                    >
                        <a href="#"> {{ menu }} </a>
                        <div
                            class="h-0.5 bg-green scale-x-0 group-hover:scale-100 transition-transform origin-center rounded-full duration-300 ease-out"
                        />
                    </li>
                </ul>
                <button
                    class="flex justify-center items-center h-13 px-7 font-medium text-white bg-green rounded-xl hover:shadow-primary transition-shadow duration-300 whitespace-nowrap"
                >
                    Get started
                </button>
            </div>
            <button
                @click="sidebarOpen = !sidebarOpen"
                class="block md:hidden relative z-30"
            >
                <HamburgerIcon class="w-8 h-8 fill-current text-gray-900" />
            </button>
        </nav>

        <div
            class="flex flex-wrap-reverse gap-y-24 justify-between py-12 px-6 mx-auto max-w-screen-xl sm:px-8 md:px-12 lg:px-16 xl:px-24"
        >
            <div class="relative z-10 md:w-1/2 w-full">
                <img
                    class="absolute top-0 right-0 md:-top-4 md:-right-8 w-24 h-auto"
                    src="@/../images/img/leaf.png"
                    alt=""
                />
                <span class="flex items-center px-1 text-xl text-green">
                    <span class="font-medium">100% Organic food</span>
                    <img
                        class="w-auto h-8"
                        src="@/../images/img/vegetable.png"
                        alt=""
                    />
                </span>
                <h1
                    class="pt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight whitespace-nowrap"
                >
                    Healthy Lifestyle <br />
                    is your only <br />
                    <span class="whitespace-nowrap text-green">
                        unfair advantage
                    </span>
                </h1>
                <p
                    class="pt-8 sm:text-lg max-w-md font-normal text-gray-600 leading-relaxed"
                >
                    Choose healthy habits with Organo daily meal prepared by our
                    expert nutritionist and chef
                </p>
                <div class="flex pt-8 space-x-4 sm:space-x-6">
                    <button
                        class="flex justify-center items-center w-full sm:w-auto h-13 px-8 bg-green font-medium text-white rounded-xl whitespace-nowrap hover:shadow-primary transition-shadow duration-300"
                    >
                        Get started
                    </button>
                    <button
                        class="flex justify-center items-center w-full sm:w-auto h-13 px-8 font-medium text-gray-900 border border-gray-900 rounded-xl whitespace-nowrap hover:shadow-xl transition-shadow duration-300"
                    >
                        Explore menu
                    </button>
                </div>

                <ChefPromote />

                <div>
                    <div
                        class="flex md:hidden pt-8 justify-end space-x-1 font-bold"
                    >
                        <span>Powered by</span>
                        <FuelerIcon
                            class="w-6 h-6 text-gray-900 fill-current"
                        />
                        <span>Fueler</span>
                    </div>
                </div>
            </div>

            <div class="relative md:w-1/2 w-full flex flex-col justify-between">
                <img
                    class="w-96 lg:w-full drop-shadow-2xl self-center lg:self-end"
                    src="@/../images/img/dish.png"
                    alt=""
                />
                <div
                    class="absolute right-0 lg:-right-6 top-0 lg:top-28 flex flex-col py-5 px-7 rounded-2xl shadow-xl bg-white/80 backdrop-blur-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                >
                    <div class="flex -space-x-3">
                        <div
                            v-for="i in 3"
                            class="w-13 h-13 rounded-full border-4 border-white object-cover overflow-hidden"
                        >
                            <img :src="getAvatarSrc(i)" alt="" />
                        </div>
                    </div>
                    <div class="pt-3 font-bold">Happy customers</div>
                    <div
                        class="flex items-center text-gray-600 leading-relaxed"
                    >
                        <StarIcon class="w-5 h-5" />
                        <span class="pl-1">4.9 (+2.5k Ratings)</span>
                    </div>
                </div>
                <div
                    class="absolute left-0 bottom-0 md:bottom-32 lg:bottom-16 flex bg-white/80 rounded-2xl shadow-xl backdrop-blur-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                >
                    <img
                        class="w-auto h-20 self-end"
                        src="@/../images/img/driver.png"
                        alt=""
                    />
                    <div class="pr-7 pl-2 py-5">
                        <div class="font-bold">Fast delivery</div>
                        <div class="text-gray-600 leading-relaxed">
                            30 mins delivery 🚀
                        </div>
                    </div>
                </div>
                <div class="hidden md:flex justify-end space-x-1 font-bold">
                    <span>Powered by</span>
                    <FuelerIcon class="w-6 h-6 text-gray-900 fill-current" />
                    <span>Fueler</span>
                </div>
            </div>
        </div>
        <!-- flowbit -->
        <div class="container mx-auto px-5">
            <form>
                <div class="grid gap-6 mb-6 md:grid-cols-2">
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
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Submit
                </button>
            </form>
        </div>
        <!-- flowbit -->
        <hr class="my-5">
        <!-- flowbit table -->
        <div class="container mx-auto px-5">
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
                                    <label for="checkbox-all-search" class="sr-only"
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
                    class="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 mb-4"
                    aria-label="Table navigation"
                >
                    <span
                        class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto"
                        >Showing
                        <span class="font-semibold text-gray-900 dark:text-white"
                            >1-10</span
                        >
                        of
                        <span class="font-semibold text-gray-900 dark:text-white"
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
