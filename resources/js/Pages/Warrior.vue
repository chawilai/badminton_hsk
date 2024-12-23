<script setup>
import OrganicLayout from "@/Layouts/OrganicLayout.vue";
import { Head, Link, useForm, usePage, router } from "@inertiajs/vue3";
import { ref, onMounted } from "vue";

import Typewriter from "typewriter-effect/dist/core";

// LINE LIFF
import liff from "@line/liff";

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

    // Initialize LIFF with your LIFF ID here
    liff.init({ liffId: "2001165902-JR5Z95AG" })
        .then(() => {
            console.log("LIFF initialization successful");
            if (!liff.isLoggedIn()) {
                liff.login(); // Prompt the login if not already logged in
            }
            // Additional logic after successful initialization
            liff.getProfile()
                .then((profile) => {
                    // console.log(profile.displayName);
                    // console.log(profile.userId);
                    // console.log(profile.pictureUrl);
                    // console.log(profile.statusMessage);
                    // Here you can either display the user info in your app or send it to your backend for processing/storage

                    const userData = {
                        provider: "line",
                        userId: profile.userId, // LINE user ID
                        displayName: profile.displayName,
                        email: liff.getDecodedIDToken()?.email, // Ensure your LIFF has email permission
                        pictureUrl: profile.pictureUrl,
                    };

                    // Make an API call to your backend
                    router.post(`login/lineliff`, userData, {
                        preserveScroll: true,
                        onSuccess: (page) => {
                            console.log(page);
                        },
                    });
                })
                .catch((err) => {
                    console.error("Failed to get user profile:", err);
                });
        })
        .catch((err) => {
            console.error("LIFF Initialization failed", err);
        });
});
</script>

<template>
    <Head title="Home" />

    <div
        class="flex flex-wrap-reverse gap-y-24 justify-between py-14 px-6 mx-auto max-w-screen-xl sm:px-8 md:px-12 lg:px-16 xl:px-24"
    >
        <div class="relative z-10 md:w-1/2 w-full">
            <img
                class="absolute z-20 -top-6 right-4 md:right-14 md:-top-8 w-14 h-auto rotate-12 hover:scale-125 duration-300"
                src="@/../images/img/object/lantern_1.png"
                alt=""
            />
            <img
                class="absolute z-20 bottom-6 left-0 md:bottom-20 md:left-0 w-14 h-auto -rotate-12 hover:scale-125 duration-300"
                src="@/../images/img/object/lantern_1.png"
                alt=""
            />
            <span class="flex items-center px-1 text-xl text-red">
                <span class="font-medium">🚀🇨🇳 ฝึกฝนจนเป็นจอมยุทธ! 🇹🇭💪</span>
                <!-- <img
                        class="w-auto h-8"
                        src="@/../images/img/vegetable.png"
                        alt=""
                    /> -->
            </span>
            <h1
                class="pt-4 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-loose whitespace-nowrap"
            >
                <span class="whitespace-nowrap text-red"> HSK </span>
                <span class="whitespace-nowrap">Warrior</span><br />
                <span class="whitespace-nowrap">สนุกกับภาษาจีน</span>
            </h1>
            <p
                class="pt-8 sm:text-lg max-w-md font-normal text-gray-600 leading-relaxed"
            >
                <span class="whitespace-nowrap"
                    >ผ่านแบบเรียน แบบฝึกหัด และเกมสนุก ๆ</span
                >
                <span class="whitespace-nowrap"
                    >พร้อมบันทึกประวัติการฝึกฝน เพิ่มระดับเลเวลของคุณ</span
                >
                <span class="whitespace-nowrap">จนเป็นนักรบที่แข็งแกร่ง</span>
            </p>

            <div
                class="flex sm:ml-20 pt-4 font-sans font-semibold space-x-4 sm:space-x-6"
            >
                <div
                    id="service_typing"
                    class="mt-5 text-2xl text-center text-red"
                ></div>
            </div>

            <div class="flex sm:ml-24 pt-8 space-x-4 sm:space-x-6">
                <Link
                    role="button"
                    href="/login"
                    class="flex justify-center items-center w-full sm:w-auto h-16 px-7 py-2 text-xl font-medium hover:-rotate-3 transition-all ease-out duration-300 text-base font-semibold leading-7 text-white bg-red border border-red rounded-lg focus:outline-red focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 hover:bg-transparent hover:text-red sm:w-auto hover:scale-[1.01] focus:bg-transparent focus:text-red hover:shadow-hsk whitespace-nowrap"
                >
                    เริ่มผจญภัย
                </Link>
                <!-- <button
                        class="flex justify-center items-center w-full sm:w-auto h-13 px-8 font-medium text-gray-900 border border-gray-900 rounded-xl whitespace-nowrap hover:shadow-xl transition-shadow duration-300"
                    >
                        Explore menu
                    </button> -->
            </div>

            <div v-if="false">
                <div
                    class="flex md:hidden pt-8 justify-end space-x-1 font-bold"
                >
                    <span>Powered by</span>
                    <FuelerIcon class="w-6 h-6 text-gray-900 fill-current" />
                    <span>Fueler</span>
                </div>
            </div>
        </div>

        <div class="relative md:w-1/2 w-full flex flex-col justify-between">
            <img
                class="w-96 lg:w-full drop-shadow-2xl self-center lg:self-end animate-up-down"
                src="@/../images/warrior_exam.png"
                alt=""
            />
            <div
                class="absolute right-0 md:-right-10 lg:-right-6 -top-16 md:-top-24 lg:-top-16 flex flex-col py-5 px-7 rounded-2xl shadow-xl bg-white/40 hover:bg-white/80 backdrop-blur-md hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group/card"
            >
                <div class="flex justify-center space-x-1">
                    <div
                        class="w-13 h-13 bg-white/80 group-hover/card:border-red/80 rounded-2xl border-2 border-white object-cover overflow-hidden"
                    >
                        <img
                            src="@/../images/img/object/calculator.png"
                            alt=""
                        />
                    </div>
                    <div
                        class="w-13 h-13 bg-white/80 group-hover/card:border-red/40 rounded-2xl border-2 border-white object-cover overflow-hidden"
                    >
                        <img src="@/../images/img/object/fan_1.png" alt="" />
                    </div>
                    <div
                        class="w-13 h-13 bg-white/80 group-hover/card:border-red/40 rounded-2xl border-2 border-white object-cover overflow-hidden"
                    >
                        <img
                            src="@/../images/img/object/lantern_2.png"
                            alt=""
                        />
                    </div>
                </div>
                <div class="pt-3 font-bold">สร้างโปรไฟล์เพื่อบันทึกเลเวล</div>
                <div class="flex items-center text-gray-600 leading-relaxed">
                    <StarIcon class="w-5 h-5" />
                    <StarIcon class="w-5 h-5" />
                    <span class="pl-1">ระดับ 16 (ในจังหวัด)</span>
                </div>
            </div>
            <div
                class="absolute left-0 bottom-0 md:-bottom-6 lg:-left-16 lg:bottom-16 flex rounded-2xl shadow-xl bg-white/40 hover:bg-white/80 backdrop-blur-md hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
            >
                <div class="flex items-center gap-x-2">
                    <img
                        class="w-auto h-20 ml-3"
                        src="@/../images/img/object/object_1.png"
                        alt=""
                    />
                    <div class="pr-7 pl-2 py-5">
                        <div class="font-bold text-red">เรียนด้วย Game</div>
                        <div class="text-gray-600 leading-relaxed">
                            เพียง 10 นาทีต่อวัน 🔥
                        </div>
                    </div>
                </div>
            </div>
            <img
                class="absolute z-20 bottom-16 right-4 md:right-14 md:bottom-18 w-14 h-auto rotate-12 hover:scale-125 duration-300"
                src="@/../images/img/object/lantern_1.png"
                alt=""
            />
            <div
                class="hidden md:flex justify-end space-x-1 font-bold"
                v-if="false"
            >
                <span>Powered by</span>
                <FuelerIcon class="w-6 h-6 text-gray-900 fill-current" />
                <span>Fueler</span>
            </div>
        </div>
    </div>
</template>
