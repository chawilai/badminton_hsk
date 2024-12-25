<script setup>
import OrganicLayout from "@/Layouts/OrganicLayout.vue";
import { Head, Link, useForm, usePage, router } from "@inertiajs/vue3";
import { ref, onMounted } from "vue";

import Typewriter from "typewriter-effect/dist/core";

import StarIcon from "@/../icons/star.svg";
import FuelerIcon from "@/../icons/fueler.svg";

defineOptions({ layout: OrganicLayout });

// // avatar images
// const avatarImports = import.meta.glob("../../images/img/avatar-*.jpeg", {
//     eager: true,
// });

// const avatars = ref({});

// Object.keys(avatarImports).forEach((path) => {
//     const match = path.match(/avatar-(\d+)\.jpeg$/);
//     if (match) {
//         avatars.value[match[1]] = avatarImports[path].default;
//     }
// });

// const getAvatarSrc = (index) => avatars.value[index] || "";
// // avatar images

let typeWords = (el_id, text_arr = []) => {
    let typewriter = new Typewriter(document.getElementById(el_id), {
        loop: true, // false,
        delay: 100, // 50,
        deleteSpeed: 50, // 50,
        cursor: "|", // "|",
        cursorClassName: "typewriter-cursor", // "typewriter-cursor",
        autoStart: false, // false,
        strings: [], // [],
    });

    text_arr.forEach((word, index) => {
        typewriter.typeString(word).pauseFor(500).deleteAll().pauseFor(500);
    });
    typewriter.start();
};

// function speak(text) {
//     if ('speechSynthesis' in window) {
//         var msg = new SpeechSynthesisUtterance(text);
//         window.speechSynthesis.speak(msg);

//         alert('support speech synthesis.');

//     } else {
//         alert('Your browser does not support speech synthesis.');
//     }
// }

// Example usage

onMounted(() => {
    typeWords("service_typing", [
        "แบบเรียน HSK 1-6",
        "แบบฝึกหัด HSK 1-6",
        "Flash Card ทายคำ",
        "ฝึก Pīnyīn",
        "หมวดหมู่คำศัพท์",
        "ทายประโยค",
        "ฝีกเขียนจีน Hànzì",
        "แข่งกับเพื่อน",
    ]);
});
</script>

<template>
    <Head title="Home" />

    <div
        class="tw-flex tw-flex-wrap-reverse tw-gap-y-24 tw-justify-between tw-py-14 tw-px-6 tw-mx-auto tw-max-w-screen-xl sm:tw-px-8 md:tw-px-12 lg:tw-px-16 xl:tw-px-24"
    >
        <div class="tw-relative tw-z-10 md:tw-w-1/2 tw-w-full">
            <img
                class="tw-absolute tw-z-20 -tw-top-6 tw-right-4 md:tw-right-14 md:-tw-top-8 tw-w-14 tw-h-auto tw-rotate-12 hover:tw-scale-125 tw-duration-300"
                src="@/../images/img/object/lantern_1.png"
                alt=""
            />
            <img
                class="tw-absolute tw-z-20 tw-bottom-6 tw-left-0 md:tw-bottom-20 md:tw-left-0 tw-w-14 tw-h-auto -tw-rotate-12 hover:tw-scale-125 tw-duration-300"
                src="@/../images/img/object/lantern_1.png"
                alt=""
            />
            <span
                class="tw-flex tw-items-center tw-px-1 tw-text-xl tw-text-red"
            >
                <span class="tw-font-medium"
                    >🚀🇨🇳 ฝึกฝนจนเป็นจอมยุทธ! 🇹🇭💪</span
                >
            </span>
            <h1
                class="tw-pt-4 tw-text-4xl sm:tw-text-5xl lg:tw-text-6xl tw-font-bold tw-tracking-tight tw-leading-loose tw-whitespace-nowrap"
            >
                <span class="tw-whitespace-nowrap tw-text-red"> HSK </span>
                <span class="tw-whitespace-nowrap">Warrior</span><br />
                <span class="tw-whitespace-nowrap">สนุกกับภาษาจีน</span>
            </h1>
            <p
                class="tw-pt-8 sm:tw-text-lg tw-max-w-md tw-font-normal tw-text-gray-600 tw-leading-relaxed"
            >
                <span class="tw-whitespace-nowrap"
                    >ผ่านแบบเรียน แบบฝึกหัด และเกมสนุก ๆ</span
                >
                <span class="tw-whitespace-nowrap"
                    >พร้อมบันทึกประวัติการฝึกฝน เพิ่มระดับเลเวลของคุณ</span
                >
                <span class="tw-whitespace-nowrap"
                    >จนเป็นนักรบที่แข็งแกร่ง</span
                >
            </p>

            <div
                class="tw-flex sm:tw-ml-20 tw-pt-4 tw-font-sans tw-font-semibold tw-space-x-4 sm:tw-space-x-6"
            >
                <div
                    id="service_typing"
                    class="tw-mt-5 tw-text-2xl tw-text-center tw-text-red"
                ></div>
            </div>

            <div
                class="tw-flex sm:tw-ml-24 tw-pt-8 tw-space-x-4 sm:tw-space-x-6"
            >
                <Link
                    role="button"
                    href="/login"
                    class="tw-flex tw-justify-center tw-items-center tw-w-full sm:tw-w-auto tw-h-16 tw-px-7 tw-py-2 tw-text-xl tw-font-medium hover:-tw-rotate-3 tw-transition-all tw-ease-out tw-duration-300 tw-leading-7 tw-text-white tw-bg-red tw-border tw-border-red tw-rounded-lg focus:tw-outline-red focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-sky-500 hover:tw-bg-transparent hover:tw-text-red hover:tw-scale-[1.01] focus:tw-bg-transparent focus:tw-text-red hover:tw-shadow-hsk tw-whitespace-nowrap"
                >
                    เริ่มผจญภัย
                </Link>
            </div>

            <div v-if="false">
                <div
                    class="tw-flex md:tw-hidden tw-pt-8 tw-justify-end tw-space-x-1 tw-font-bold"
                >
                    <span>Powered by</span>
                    <FuelerIcon
                        class="tw-w-6 tw-h-6 tw-text-gray-900 tw-fill-current"
                    />
                    <span>Fueler</span>
                </div>
            </div>
        </div>

        <div
            class="tw-relative md:tw-w-1/2 tw-w-full tw-flex tw-flex-col tw-justify-between"
        >
            <img
                class="tw-w-96 lg:tw-w-full tw-drop-shadow-2xl tw-self-center lg:tw-self-end tw-animate-up-down"
                src="@/../images/warrior_exam.png"
                alt=""
            />
            <div
                class="tw-absolute tw-right-0 md:-tw-right-10 lg:-tw-right-6 -tw-top-16 md:-tw-top-24 lg:-tw-top-16 tw-flex tw-flex-col tw-py-5 tw-px-7 tw-rounded-2xl tw-shadow-xl tw-bg-white/40 hover:tw-bg-white/80 tw-backdrop-blur-md hover:-tw-translate-y-2 hover:tw-shadow-2xl tw-transition-all tw-duration-300 tw-group/card"
            >
                <div class="tw-flex tw-justify-center tw-space-x-1">
                    <div
                        class="tw-w-13 tw-h-13 tw-bg-white/80 tw-group-hover/card:border-red/80 tw-rounded-2xl tw-border-2 tw-border-white tw-object-cover tw-overflow-hidden"
                    >
                        <img
                            src="@/../images/img/object/calculator.png"
                            alt=""
                        />
                    </div>
                    <div
                        class="tw-w-13 tw-h-13 tw-bg-white/80 tw-group-hover/card:border-red/40 tw-rounded-2xl tw-border-2 tw-border-white tw-object-cover tw-overflow-hidden"
                    >
                        <img src="@/../images/img/object/fan_1.png" alt="" />
                    </div>
                    <div
                        class="tw-w-13 tw-h-13 tw-bg-white/80 tw-group-hover/card:border-red/40 tw-rounded-2xl tw-border-2 tw-border-white tw-object-cover tw-overflow-hidden"
                    >
                        <img
                            src="@/../images/img/object/lantern_2.png"
                            alt=""
                        />
                    </div>
                </div>
                <div class="tw-pt-3 tw-font-bold">
                    สร้างโปรไฟล์เพื่อบันทึกเลเวล
                </div>
                <div
                    class="tw-flex tw-items-center tw-text-gray-600 tw-leading-relaxed"
                >
                    <StarIcon class="tw-w-5 tw-h-5" />
                    <StarIcon class="tw-w-5 tw-h-5" />
                    <span class="tw-pl-1">ระดับ 16 (ในจังหวัด)</span>
                </div>
            </div>
            <div
                class="tw-absolute tw-left-0 tw-bottom-0 md:-tw-bottom-6 lg:-tw-left-16 lg:tw-bottom-16 tw-flex tw-rounded-2xl tw-shadow-xl tw-bg-white/40 hover:tw-bg-white/80 tw-backdrop-blur-md hover:-tw-translate-y-2 hover:tw-shadow-2xl tw-transition-all tw-duration-300"
            >
                <div class="tw-flex tw-items-center tw-gap-x-2">
                    <img
                        class="tw-w-auto tw-h-20 tw-ml-3"
                        src="@/../images/img/object/object_1.png"
                        alt=""
                    />
                    <div class="tw-pr-7 tw-pl-2 tw-py-5">
                        <div class="tw-font-bold tw-text-red">
                            เรียนด้วย Game
                        </div>
                        <div class="tw-text-gray-600 tw-leading-relaxed">
                            เพียง 10 นาทีต่อวัน 🔥
                        </div>
                    </div>
                </div>
            </div>
            <img
                class="tw-absolute tw-z-20 tw-bottom-16 tw-right-4 md:tw-right-14 md:tw-bottom-18 tw-w-14 tw-h-auto tw-rotate-12 hover:tw-scale-125 tw-duration-300"
                src="@/../images/img/object/lantern_1.png"
                alt=""
            />
            <div
                class="tw-hidden md:tw-flex tw-justify-end tw-space-x-1 tw-font-bold"
                v-if="false"
            >
                <span>Powered by</span>
                <FuelerIcon
                    class="tw-w-6 tw-h-6 tw-text-gray-900 tw-fill-current"
                />
                <span>Fueler</span>
            </div>
        </div>
    </div>
</template>
