<script setup>
import { Link } from "@inertiajs/vue3";
// import Badge from '@/Components/Badge.vue';

import badminton_party from "@/../assets/images/badminton_party_no_bg.png";
</script>

<template>
    <div class="">
        <img
            class="tw-absolute tw-w-full"
            src="/storage/images/intersect.svg"
            alt=""
        />

        <section
            class="tw-h-auto md:tw-h-svh tw-font-sans tw-bg-gradient-to-b tw-from-gray-50 tw-to-white"
        >
            <header
                class="tw-relative tw-z-50 tw-h-24 md:tw-mt-0 md:tw-translate-y-0 tw-bg-gray-50"
            >
                <div
                    class="tw-flex tw-items-center tw-w-full tw-h-full tw-px-6 tw-mx-auto tw-max-w-7xl md:tw-px-8"
                >
                    <div
                        class="tw-relative tw-flex tw-items-center tw-justify-between tw-w-full tw-h-auto"
                    >
                        <div class="tw-flex-shrink-0">
                            <a
                                href="/"
                                class="tw-flex tw-items-center tw-justify-center tw-rounded tw-outline-none active:tw-outline-none"
                            >
                                <div
                                    class="tw-relative tw-w-12 tw-h-12 tw-mr-2"
                                >
                                    <img :src="badminton_party" alt="" />
                                </div>
                                <span
                                    class="tw-text-3xl tw-font-bold tw-text-transparent tw-bg-clip-text tw-bg-gradient-to-br tw-from-red-500 tw-to-gray-900"
                                    >HSK Warrior</span
                                >
                            </a>
                        </div>
                        <div class="tw-flex md:tw-hidden">
                            <button
                                id="open-menu"
                                onclick="document.getElementById('menu').classList.remove('tw-hidden'); document.getElementById('close-menu').classList.remove('tw-hidden'); this.classList.add('tw-hidden');"
                                type="button"
                                class="tw-text-gray-900"
                            >
                                <svg
                                    class="tw-w-7 tw-h-7"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="1.5"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </button>
                            <button
                                id="close-menu"
                                onclick="document.getElementById('menu').classList.add('tw-hidden'); document.getElementById('open-menu').classList.remove('tw-hidden'); this.classList.add('tw-hidden');"
                                type="button"
                                class="tw-hidden tw-text-gray-900"
                            >
                                <svg
                                    class="tw-w-7 tw-h-7"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clip-rule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        <div
                            id="menu"
                            class="tw-fixed tw-top-0 tw-left-0 tw-z-20 tw-flex-col tw-hidden tw-w-full tw-h-auto tw-translate-y-24 tw-shadow-sm md:tw-absolute md:tw-inset-y-0 md:tw-flex md:tw-flex-row md:tw-top-auto md:tw-translate-y-0 md:tw-h-full md:tw-w-auto tw-bg-gray-50 md:tw-shadow-none md:tw-bg-transparent md:tw-items-center md:tw-justify-center md:tw-space-x-12 md:-tw-translate-x-1/2 md:tw-left-1/2"
                        >
                            <Link
                                href="/home"
                                class="tw-relative tw-flex tw-items-center tw-justify-center tw-w-full tw-h-16 tw-px-1 tw-text-base tw-text-gray-900 tw-text-opacity-100 tw-transition-all tw-duration-300 tw-rounded tw-outline-none tw-cursor-pointer group md:tw-w-auto md:tw-h-auto md:tw-inline-block md:hover:-tw-rotate-3 active:tw-ring-0 active:tw-outline-none"
                            >
                                <span
                                    class="tw-relative tw-z-20 tw-whitespace-nowrap"
                                    >Home</span
                                >
                                <span
                                    class="tw-absolute tw-bottom-0 tw-left-0 tw-z-10 tw-w-0 tw-h-2 tw-transition-all tw-duration-300 tw-ease-out tw-skew-x-12 group-hover:tw-w-full tw-bg-red-400"
                                ></span>
                            </Link>

                            <Link
                                href="/hsk_textbook"
                                class="tw-relative tw-flex tw-items-center tw-justify-center tw-w-full tw-h-16 tw-px-1 tw-text-base tw-text-gray-900 tw-transition-all tw-duration-300 tw-rounded tw-outline-none tw-cursor-pointer tw-text-opacity-80 hover:tw-text-opacity-100 group md:tw-w-auto md:tw-h-auto md:tw-inline-block md:hover:-tw-rotate-3 active:tw-outline-none"
                            >
                                <span
                                    class="tw-relative tw-z-20 tw-whitespace-nowrap"
                                    >แบบเรียน HSK</span
                                >
                                <span
                                    class="tw-absolute tw-bottom-0 tw-left-0 tw-z-10 tw-w-0 tw-h-2 tw-transition-all tw-duration-300 tw-ease-out tw-skew-x-12 group-hover:tw-w-full tw-bg-red-400"
                                ></span>
                            </Link>

                            <Link
                                href="/hsk_workbook"
                                class="tw-relative tw-flex tw-items-center tw-justify-center tw-w-full tw-h-16 tw-px-1 tw-text-base tw-text-gray-900 tw-transition-all tw-duration-300 tw-rounded tw-outline-none tw-cursor-pointer tw-text-opacity-80 hover:tw-text-opacity-100 group md:tw-w-auto md:tw-h-auto md:tw-inline-block md:hover:-tw-rotate-3 active:tw-outline-none"
                            >
                                <span
                                    class="tw-relative tw-z-20 tw-whitespace-nowrap"
                                    >แบบฝึกหัด HSK</span
                                >
                                <span
                                    class="tw-absolute tw-bottom-0 tw-left-0 tw-z-10 tw-w-0 tw-h-2 tw-transition-all tw-duration-300 tw-ease-out tw-skew-x-12 group-hover:tw-w-full tw-bg-red-400"
                                ></span>
                            </Link>

                            <Link
                                href="/hanzi_writing"
                                class="tw-relative tw-flex tw-items-center tw-justify-center tw-w-full tw-h-16 tw-px-1 tw-text-base tw-text-gray-900 tw-transition-all tw-duration-300 tw-rounded tw-outline-none tw-cursor-pointer tw-text-opacity-80 hover:tw-text-opacity-100 group md:tw-w-auto md:tw-h-auto md:tw-inline-block md:hover:-tw-rotate-3 active:tw-outline-none"
                            >
                                <span
                                    class="tw-relative tw-z-20 tw-whitespace-nowrap"
                                    >เขียนจีน (Hànzì)</span
                                >
                                <span
                                    class="tw-absolute tw-bottom-0 tw-left-0 tw-z-10 tw-w-0 tw-h-2 tw-transition-all tw-duration-300 tw-ease-out tw-skew-x-12 group-hover:tw-w-full tw-bg-red-400"
                                ></span>
                            </Link>

                            <Link
                                href="/hanzi_sound"
                                class="tw-relative tw-flex tw-items-center tw-justify-center tw-w-full tw-h-16 tw-px-1 tw-text-base tw-text-gray-900 tw-transition-all tw-duration-300 tw-rounded tw-outline-none tw-cursor-pointer tw-text-opacity-80 hover:tw-text-opacity-100 group md:tw-w-auto md:tw-h-auto md:tw-inline-block md:hover:-tw-rotate-3 active:tw-outline-none"
                            >
                                <span
                                    class="tw-relative tw-z-20 tw-whitespace-nowrap"
                                    >ท่องศัพท์</span
                                >
                                <span
                                    class="tw-absolute tw-bottom-0 tw-left-0 tw-z-10 tw-w-0 tw-h-2 tw-transition-all tw-duration-300 tw-ease-out tw-skew-x-12 group-hover:tw-w-full tw-bg-red-400"
                                ></span>
                            </Link>

                            <Link
                                href="#login"
                                target="_blank"
                                title=""
                                class="tw-flex tw-items-center tw-justify-center tw-h-16 tw-px-5 tw-text-base tw-font-semibold tw-leading-7 tw-text-center tw-text-white tw-transition-all tw-duration-200 tw-duration-300 tw-ease-out md:tw-hidden tw-bg-red-400 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-gray-900 hover:tw-bg-red-500 hover:tw-text-white focus:tw-bg-red-500 focus:tw-text-white"
                                role="button"
                                >เข้าสู่ระบบ</Link
                            >
                        </div>

                        <div
                            class="tw-hidden md:tw-flex md:tw-items-center md:tw-justify-center"
                        >
                            <Link
                                href="#login"
                                title=""
                                class="tw-px-5 tw-py-2 hover:-tw-rotate-3 tw-transition-all tw-ease-out tw-duration-300 tw-text-base tw-font-semibold tw-leading-7 tw-text-gray-900 tw-duration-200 tw-bg-transparent tw-border tw-border-gray-200 tw-rounded-md focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-sky-500 hover:tw-bg-red-500 hover:tw-text-white sm:tw-w-auto hover:tw-scale-[1.01] focus:tw-bg-red-500 focus:tw-text-white"
                                role="button"
                                >เข้าสู่ระบบ</Link
                            >
                        </div>
                    </div>
                </div>
            </header>
            <div class="tw-overflow-x-hidden">
                <slot />
            </div>
            <!-- Powered By Tails Badge -->
            <!-- <Badge>Chawilai</Badge> -->
        </section>

        <section>
            <footer class="tw-bg-gray-100 tw-text-sm tw-py-3">
                <div
                    class="tw-container tw-mx-auto tw-flex tw-justify-between tw-items-center tw-px-4"
                >
                    <p>&copy; 2024 Chawilai. All rights reserved.</p>
                    <div>
                        <!-- <a href="#" class="hover:tw-underline">Privacy Policy</a>
                  <span class="tw-mx-2">|</span>
                  <a href="#" class="hover:tw-underline">Terms of Service</a>
                  <span class="tw-mx-2">|</span> -->
                        <a href="#" class="hover:tw-underline">Contact Us</a>
                    </div>
                </div>
            </footer>
        </section>
    </div>
</template>

<style>
html {
    scroll-behavior: smooth;
}

.bg-dots-darker {
    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
}
@media (prefers-color-scheme: dark) {
    .dark\:bg-dots-lighter {
        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
    }
}

.typewriter-cursor {
    color: black; /* Change this to your desired cursor color */
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    from,
    to {
        color: transparent;
    }
    50% {
        color: black;
    } /* Change this to match the cursor color */
}
</style>
