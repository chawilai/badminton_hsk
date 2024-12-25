<script setup>
import { ref, onMounted } from "vue";
import { Link, usePage, router } from "@inertiajs/vue3";
import ScreenIndicator from "@/Components/ScreenIndicator.vue";

import Dropdown from "@/Components/Dropdown.vue";
import DropdownLink from "@/Components/DropdownLink.vue";

import HamburgerIcon from "@/../icons/hamburger.svg";
// import warrior_logo from "@/../images/warrior_logo.png";
import badminton_party from "@/../assets/images/badminton_party_no_bg.png";

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
        title: "สร้าง/หาปาร์ตี้",
        component: "WarriorHSKTextbook",
        url: "/warrior_textbook",
        disabled: true,
        active: false,
    },
    {
        title: "ข้อมูลสนามแบต",
        component: "WarriorHSKTextbook",
        url: "/warrior_textbook",
        disabled: true,
        active: false,
    },
    // {
    //     title: "แบบเรียน HSK",
    //     component: "WarriorHSKTextbook",
    //     url: "/warrior_textbook",
    //     disabled: true,
    //     active: false,
    // },
    // {
    //     title: "แบบฝึกหัด HSK",
    //     component: "WarriorHSKWorkbook",
    //     url: "/warrior_workbook",
    //     disabled: true,
    //     active: false,
    // },
    // {
    //     title: "ฝึกคำศัพท์",
    //     component: "WarriorHSKWords",
    //     url: "/chinese_words",
    //     disabled: false,
    //     active: false,
    // },
    // {
    //     title: "เขียนจีน (Hànzì)",
    //     component: "WarriorWriteHanzi",
    //     url: "/warrior_writehanzi",
    //     disabled: false,
    //     active: false,
    // },
    // {
    //     title: "การ์ดคำ",
    //     component: "WarriorFlipCard",
    //     url: "/warrior_flip_card",
    //     disabled: false,
    //     active: false,
    // },
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
    class="tw-w-full tw-min-h-screen tw-font-sans tw-text-gray-900 tw-bg-gradient-to-br tw-from-transparent tw-to-red-100"
    :class="sidebarOpen ? 'tw-overflow-hidden tw-h-screen' : ''"
>
        <!-- <ScreenIndicator /> -->

        <nav
            class="tw-flex tw-justify-between tw-items-center tw-py-8 tw-px-6 tw-mx-auto tw-max-w-screen-xl lg:tw-px-12 lg:tw-px-16 xl:px-24"
        >
            <a
                href="/warrior_home"
                class="tw-text-2xl tw-font-bold tw-tracking-wide tw-text-red-600"
            >
                <div class="tw-flex tw-justify-center tw-items-center">
                    <img class="tw-w-20 tw-h-auto" :src="badminton_party" alt="" />
                    <span>HSK</span>
                    <span class="tw-text-black">Warrior</span>
                </div>
            </a>
            <div
                class="tw-inset-0 tw-transition-all tw-bg-white/70 tw-backdrop-blur-xl tw-z-20 tw-flex-col tw-items-center tw-justify-center tw-space-y-8 lg:tw-static lg:tw-bg-transparent lg:tw-flex lg:tw-space-y-0 lg:tw-flex-row lg:tw-space-x-14"
                :class="sidebarOpen ? 'tw-fixed tw-flex' : 'tw-hidden'"
            >
                <ul
                    class="tw-flex tw-flex-col lg:tw-flex-row tw-items-center tw-space-y-6 lg:tw-space-y-0 lg:tw-space-x-6 lg:-tw-tw-x-8"
                >
                    <li
                        v-for="menu in menus"
                        class="tw-text-lg lg:tw-text-base tw-font-medium tw-group"
                    >
                        <Link
                            @click="sidebarOpen = false"
                            as="a"
                            preserve-scroll
                            :href="menu.url"
                            class="tw-relative tw-flex tw-items-center tw-justify-center tw-w-full tw-h-16 tw-px-1 tw-text-base tw-text-gray-900 tw-text-opacity-100 tw-transition-all tw-duration-300 tw-rounded tw-outline-none tw-cursor-pointer tw-group lg:tw-w-auto lg:tw-h-auto lg:tw-inline-block lg:hover:-tw-rotate-3 tw-active:ring-0 tw-active:outline-none"
                        >
                            <span
                                class="tw-relative tw-z-20 tw-whitespace-nowrap"
                                :class="{
                                    'tw-text-red':
                                        menu.component === page.component,
                                }"
                                >{{ menu.title }}</span
                            >
                            <span
                                class="tw-absolute tw-bottom-0 tw-left-0 tw-z-10 tw-w-0 tw-h-2 tw-transition-all tw-duration-300 tw-ease-out tw-skew-x-12 group-hover:tw-w-full tw-bg-red-400"
                            ></span>
                        </Link>
                    </li>
                </ul>
                <Link
                    v-if="!page.props.auth.user"
                    @click="sidebarOpen = false"
                    role="button"
                    href="/login"
                    class="tw-flex tw-justify-center tw-items-center tw-px-7 tw-py-2 hover:-tw-rotate-3 tw-transition-all tw-ease-out tw-duration-300 tw-text-base tw-font-semibold tw-leading-7 tw-text-white tw-bg-red tw-border tw-border-red tw-rounded-lg focus:tw-outline-red focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-sky-500 hover:tw-bg-transparent hover:tw-text-red sm:tw-w-auto hover:tw-scale-[1.01] focus:tw-bg-transparent focus:tw-text-red hover:tw-shadow-hsk tw-whitespace-nowrap"
                >
                    เริ่มผจญภัย
                </Link>
                <!-- <Link
                    v-if="page.props.auth.user"
                    role="a"
                    href="/profile"
                    class="tw-flex tw-flex-col tw-justify-center tw-items-center"
                >
                    <img
                        class="tw-w-14 tw-h-auto tw-rounded-full"
                        :src="page.props.auth.user.avatar"
                        alt=""
                    />
                    <span
                        class="tw-font-bold"
                        v-text="page.props.auth.user.name"
                    ></span>
                </Link> -->
                <Dropdown
                    align="right"
                    width="48"
                    v-if="page.props.auth.user"
                    contentClasses="sm:tw-rounded-lg tw-shadow-md hover:tw-tw-shadow-xl tw-bg-white/90 hover:tw-bg-white tw-backdrop-blur-xl"
                >
                    <template #trigger>
                        <div
                            class="tw-flex tw-flex-col tw-justify-center tw-items-center tw-cursor-pointer"
                        >
                            <img
                                class="tw-w-14 tw-h-auto tw-rounded-full"
                                :src="page.props.auth.user.avatar"
                                alt=""
                            />
                            <span
                                class="tw-font-bold"
                                v-text="page.props.auth.user.name"
                            ></span>
                        </div>
                    </template>

                    <template #content>
                        <DropdownLink :href="route('profile.edit')">
                            <i class="pi pi-user"></i
                            ><span class="tw-ml-2">โปรไฟล์</span>
                        </DropdownLink>
                        <DropdownLink
                            :href="route('logout')"
                            method="post"
                            as="button"
                        >
                            <i class="pi pi-sign-out"></i
                            ><span class="tw-ml-2">Log Out</span>
                        </DropdownLink>
                    </template>
                </Dropdown>
            </div>

            <button
                @click="sidebarOpen = !sidebarOpen"
                class="tw-block lg:tw-hidden tw-relative tw-z-30"
            >
                <HamburgerIcon
                    class="tw-w-8 tw-h-8 tw-fill-current tw-text-gray-900"
                />
            </button>
        </nav>

        <slot />

        <!-- flowbit -->

        <!-- <slot name="content2"></slot> -->

        <div class="tw-container tw-mx-auto tw-px-5" v-if="false">
            <form>
                <div class="tw-grid tw-gap-6 tw-mb-6 lg:tw-grid-cols-2">
                    <div>
                        <label
                            for="first_name"
                            class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-white"
                        >First name</label>
                        <input
                            type="text"
                            id="first_name"
                            class="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                            placeholder="John"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="last_name"
                            class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-white"
                        >Last name</label>
                        <input
                            type="text"
                            id="last_name"
                            class="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                            placeholder="Doe"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="company"
                            class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-white"
                        >Company</label>
                        <input
                            type="text"
                            id="company"
                            class="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                            placeholder="Flowbite"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="phone"
                            class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-white"
                        >Phone number</label>
                        <input
                            type="tel"
                            id="phone"
                            class="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                            placeholder="123-45-678"
                            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="website"
                            class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-white"
                        >Website URL</label>
                        <input
                            type="url"
                            id="website"
                            class="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                            placeholder="flowbite.com"
                            required
                        />
                    </div>
                    <div>
                        <label
                            for="visitors"
                            class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-white"
                        >Unique visitors (per month)</label>
                        <input
                            type="number"
                            id="visitors"
                            class="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                            placeholder=""
                            required
                        />
                    </div>
                </div>
                <div class="tw-mb-6">
                    <label
                        for="email"
                        class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-white"
                    >Email address</label>
                    <input
                        type="email"
                        id="email"
                        class="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                        placeholder="john.doe@company.com"
                        required
                    />
                </div>
                <div class="tw-mb-6">
                    <label
                        for="password"
                        class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-white"
                    >Password</label>
                    <input
                        type="password"
                        id="password"
                        class="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                        placeholder="•••••••••"
                        required
                    />
                </div>
                <div class="tw-mb-6">
                    <label
                        for="confirm_password"
                        class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-white"
                    >Confirm password</label>
                    <input
                        type="password"
                        id="confirm_password"
                        class="tw-bg-gray-50 tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-blue-500 focus:tw-border-blue-500 tw-block tw-w-full tw-p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:tw-ring-blue-500 dark:focus:tw-border-blue-500"
                        placeholder="•••••••••"
                        required
                    />
                </div>
                <div class="tw-flex tw-items-start tw-mb-6">
                    <div class="tw-flex tw-items-center tw-h-5">
                        <input
                            id="remember"
                            type="checkbox"
                            value=""
                            class="tw-w-4 tw-h-4 tw-border tw-border-gray-300 tw-rounded tw-bg-gray-50 focus:tw-ring-3 focus:tw-ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800"
                            required
                        />
                    </div>
                    <label
                        for="remember"
                        class="tw-ml-2 tw-text-sm tw-font-medium tw-text-gray-900 dark:text-gray-300"
                    >I agree with the
                    <a
                        href="#"
                        class="tw-text-blue-600 hover:tw-underline dark:text-blue-500"
                    >terms and conditions</a>.</label>
                </div>
                <button
                    type="submit"
                    class="tw-text-white tw-bg-blue-700 hover:tw-bg-blue-800 focus:tw-ring-4 focus:tw-outline-none focus:tw-ring-blue-300 tw-font-medium tw-rounded-lg tw-text-sm tw-w-full sm:tw-w-auto tw-px-5 tw-py-2.5 tw-text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:tw-ring-blue-800"
                >
                    Submit
                </button>
            </form>
        </div>

        <!-- flowbit -->
        <hr class="tw-my-5" v-if="false" />
        <!-- flowbit table -->
        <div class="tw-container tw-mx-auto tw-px-5" v-if="false">
            <div class="tw-relative tw-overflow-x-auto sm:tw-rounded-lg">
                <table class="tw-w-full tw-text-sm tw-text-left tw-rtl:text-right tw-text-gray-500 dark:text-gray-400">
                    <thead class="tw-text-xs tw-text-gray-700 tw-uppercase tw-bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="tw-p-4">
                                <div class="tw-flex tw-items-center">
                                    <input id="checkbox-all-search" type="checkbox" class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                    <label for="checkbox-all-search" class="tw-sr-only">checkbox</label>
                                </div>
                            </th>
                            <th scope="col" class="tw-px-6 tw-py-3">Product name</th>
                            <th scope="col" class="tw-px-6 tw-py-3">Color</th>
                            <th scope="col" class="tw-px-6 tw-py-3">Category</th>
                            <th scope="col" class="tw-px-6 tw-py-3">Price</th>
                            <th scope="col" class="tw-px-6 tw-py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            class="tw-bg-white tw-border-b dark:bg-gray-800 dark:border-gray-700 hover:tw-bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="tw-w-4 tw-p-4">
                                <div class="tw-flex tw-items-center">
                                    <input
                                        id="checkbox-table-search-1"
                                        type="checkbox"
                                        class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-1"
                                        class="tw-sr-only"
                                    >checkbox</label>
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900 tw-whitespace-nowrap dark:text-white"
                            >
                                Apple MacBook Pro 17"
                            </th>
                            <td class="tw-px-6 tw-py-4">Silver</td>
                            <td class="tw-px-6 tw-py-4">Laptop</td>
                            <td class="tw-px-6 tw-py-4">$2999</td>
                            <td class="tw-px-6 tw-py-4">
                                <a
                                    href="#"
                                    class="tw-font-medium tw-text-blue-600 dark:text-blue-500 hover:tw-underline"
                                >Edit</a>
                            </td>
                        </tr>

                        <tr
                            class="tw-bg-white tw-border-b dark:bg-gray-800 dark:border-gray-700 hover:tw-bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="tw-w-4 tw-p-4">
                                <div class="tw-flex tw-items-center">
                                    <input
                                        id="checkbox-table-search-2"
                                        type="checkbox"
                                        class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-2"
                                        class="tw-sr-only"
                                    >checkbox</label>
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900 tw-whitespace-nowrap dark:text-white"
                            >
                                Microsoft Surface Pro
                            </th>
                            <td class="tw-px-6 tw-py-4">White</td>
                            <td class="tw-px-6 tw-py-4">Laptop PC</td>
                            <td class="tw-px-6 tw-py-4">$1999</td>
                            <td class="tw-px-6 tw-py-4">
                                <a
                                    href="#"
                                    class="tw-font-medium tw-text-blue-600 dark:text-blue-500 hover:tw-underline"
                                >Edit</a>
                            </td>
                        </tr>

                        <tr
                            class="tw-bg-white tw-border-b dark:bg-gray-800 dark:border-gray-700 hover:tw-bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="tw-w-4 tw-p-4">
                                <div class="tw-flex tw-items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="tw-sr-only"
                                    >checkbox</label>
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900 tw-whitespace-nowrap dark:text-white"
                            >
                                Magic Mouse 2
                            </th>
                            <td class="tw-px-6 tw-py-4">Black</td>
                            <td class="tw-px-6 tw-py-4">Accessories</td>
                            <td class="tw-px-6 tw-py-4">$99</td>
                            <td class="tw-px-6 tw-py-4">
                                <a
                                    href="#"
                                    class="tw-font-medium tw-text-blue-600 dark:text-blue-500 hover:tw-underline"
                                >Edit</a>
                            </td>
                        </tr>

                        <tr
                            class="tw-bg-white tw-border-b dark:bg-gray-800 dark:border-gray-700 hover:tw-bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="tw-w-4 tw-p-4">
                                <div class="tw-flex tw-items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="tw-sr-only"
                                    >checkbox</label>
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900 tw-whitespace-nowrap dark:text-white"
                            >
                                Apple Watch
                            </th>
                            <td class="tw-px-6 tw-py-4">Black</td>
                            <td class="tw-px-6 tw-py-4">Watches</td>
                            <td class="tw-px-6 tw-py-4">$199</td>
                            <td class="tw-px-6 tw-py-4">
                                <a
                                    href="#"
                                    class="tw-font-medium tw-text-blue-600 dark:text-blue-500 hover:tw-underline"
                                >Edit</a>
                            </td>
                        </tr>

                        <tr
                            class="tw-bg-white tw-border-b dark:bg-gray-800 dark:border-gray-700 hover:tw-bg-gray-50 dark:hover:bg-gray-600"
                        >
                            <td class="tw-w-4 tw-p-4">
                                <div class="tw-flex tw-items-center">
                                    <input
                                        id="checkbox-table-search-3"
                                        type="checkbox"
                                        class="tw-w-4 tw-h-4 tw-text-blue-600 tw-bg-gray-100 tw-border-gray-300 tw-rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label
                                        for="checkbox-table-search-3"
                                        class="tw-sr-only"
                                    >checkbox</label>
                                </div>
                            </td>
                            <th
                                scope="row"
                                class="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900 tw-whitespace-nowrap dark:text-white"
                            >
                                Apple iMac
                            </th>
                            <td class="tw-px-6 tw-py-4">Silver</td>
                            <td class="tw-px-6 tw-py-4">PC</td>
                            <td class="tw-px-6 tw-py-4">$2999</td>
                            <td class="tw-px-6 tw-py-4">
                                <a
                                    href="#"
                                    class="tw-font-medium tw-text-blue-600 dark:text-blue-500 hover:tw-underline"
                                >Edit</a>
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
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:tw-ring-blue-500 dark:focus:tw-ring-blue-600 dark:ring-offset-gray-800 dark:focus:tw-ring-offset-gray-800 focus:tw-ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                <nav class="tw-flex tw-items-center tw-flex-column tw-flex-wrap lg:tw-flex-row tw-justify-between tw-pt-4 tw-mb-4" aria-label="Table navigation">
                    <span class="tw-text-sm tw-font-normal tw-text-gray-500 dark:text-gray-400 tw-mb-4 lg:tw-mb-0 tw-block tw-w-full lg:tw-inline lg:tw-w-auto">
                        Showing <span class="tw-font-semibold tw-text-gray-900 dark:text-white">1-10</span> of <span class="tw-font-semibold tw-text-gray-900 dark:text-white">1000</span>
                    </span>
                    <ul class="tw-inline-flex -tw-space-x-px tw-rtl:space-x-reverse tw-text-sm tw-h-8">
                        <li>
                            <a href="#" class="tw-flex tw-items-center tw-justify-center tw-px-3 tw-h-8 tw-ms-0 tw-leading-tight tw-text-gray-500 tw-bg-white tw-border tw-border-gray-300 tw-rounded-s-lg hover:tw-bg-gray-100 hover:tw-text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Previous</a>
                        </li>
                        <li>
                            <a href="#" class="tw-flex tw-items-center tw-justify-center tw-px-3 tw-h-8 tw-leading-tight tw-text-gray-500 tw-bg-white tw-border tw-border-gray-300 hover:tw-bg-gray-100 hover:tw-text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                        </li>
                        <li>
                            <a href="#" class="tw-flex tw-items-center tw-justify-center tw-px-3 tw-h-8 tw-leading-tight tw-text-gray-500 tw-bg-white tw-border tw-border-gray-300 hover:tw-bg-gray-100 hover:tw-text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                        </li>
                        <li>
                            <a href="#" aria-current="page" class="tw-flex tw-items-center tw-justify-center tw-px-3 tw-h-8 tw-text-blue-600 tw-border tw-border-gray-300 tw-bg-blue-50 hover:tw-bg-blue-100 hover:tw-text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                        </li>
                        <li>
                            <a href="#" class="tw-flex tw-items-center tw-justify-center tw-px-3 tw-h-8 tw-leading-tight tw-text-gray-500 tw-bg-white tw-border tw-border-gray-300 hover:tw-bg-gray-100 hover:tw-text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">4</a>
                        </li>
                        <li>
                            <a href="#" class="tw-flex tw-items-center tw-justify-center tw-px-3 tw-h-8 tw-leading-tight tw-text-gray-500 tw-bg-white tw-border tw-border-gray-300 hover:tw-bg-gray-100 hover:tw-text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">5</a>
                        </li>
                        <li>
                            <a href="#" class="tw-flex tw-items-center tw-justify-center tw-px-3 tw-h-8 tw-leading-tight tw-text-gray-500 tw-bg-white tw-border tw-border-gray-300 tw-rounded-e-lg hover:tw-bg-gray-100 hover:tw-text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">Next</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- flowbit table -->
    </div>
</template>
