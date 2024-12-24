<script setup>
import { onMounted } from "vue";
import Main from "@/Layouts/Main.vue";
import { Head } from "@inertiajs/vue3";
import Typewriter from "typewriter-effect/dist/core";
import HanziWriter from "hanzi-writer";

import warrior_exam from "/resources/images/warrior_exam.png";

let writeHanzi = (id, letter, option = null) => {
    return HanziWriter.create(id, letter, {
        // width: 100,
        // height: 100,
        // padding: 5,
        // strokeColor: '#EE00FF',

        character: null, // (The character to be rendered must be provided by the user)
        width: 50, // 300, // (Default width of the rendering area in pixels)
        height: 50, // 300, // (Default height of the rendering area in pixels)
        padding: 0, // 20, // (Padding around the character in pixels)
        strokeColor: "#555", // (Color of the strokes)
        showOutline: true, // (Whether to show the outline of the character)
        strokeAnimationSpeed: 1, // 1 (Multiplier for the speed of stroke animations)
        delayBetweenStrokes: 200, // 1000 (Delay between stroke animations in milliseconds)
        radicalColor: "#168F16", // null (Color for radical strokes, if any)

        // // highlightColor: null, // (Color for highlighting strokes)
        // outlineColor: '#DDD', // (Color for the outline of strokes)
        // drawingWidth: 2, // (Width of the drawing strokes)
        // drawingColor: '#333', // (Color of the drawing strokes)
        // showCharacter: true, // (Whether to show the character itself)
        // showHintAfterMisses: 3, // (Number of misses before showing a hint)
        // highlightOnComplete: true, // (Whether to highlight the character on completion)
        // drawingFadeDuration: 400, // (Duration for fading out drawing strokes in milliseconds)
        // animationDuration: 200, // (Default animation duration in milliseconds)
        // strokeOrder: true, // (Whether to show stroke order animations)
        // strokeOrderSpeed: 2, // (Speed multiplier for stroke order animations)
        // strokeOrderColors: null, // (Colors for the stroke order)
    });
};

let typeWords = (el_id, text_arr = []) => {
    let typewriter = new Typewriter(document.getElementById(el_id), {
        loop: true, // false,
        delay: 50, // 50,
        deleteSpeed: 30, // 50,
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

    writeHanzi("hanzi", "我").loopCharacterAnimation();
    writeHanzi("hanzi2", "爱").loopCharacterAnimation();
    writeHanzi("hanzi3", "学").loopCharacterAnimation();
    writeHanzi("hanzi4", "习").loopCharacterAnimation();
    writeHanzi("hanzi5", "中").loopCharacterAnimation();
    writeHanzi("hanzi6", "文").loopCharacterAnimation();

    // // writer.animateCharacter();
    // // writer.loopCharacterAnimation();
});
</script>

<template>
    <Head title="Home" />

    <Main>
        <div
            class="tw-flex tw-flex-col-reverse tw-items-center tw-justify-center md:tw-flex-row"
        >
            <div
                class="tw-relative tw-z-10 -tw-mt-48 tw-flex tw-flex-col tw-items-center tw-justify-center tw-min-h-screen tw-pb-5 md:-tw-mt-48 md:tw-pt-48 md:tw-py-24 xl:tw-pb-0"
            >
                <div class="tw-z-30 tw-w-full tw-text-center tw-mt-14">
                    <p
                        class="tw-flex tw-items-center tw-justify-center tw-w-full tw-h-10 tw-px-4 tw-text-xs tw-font-medium tw-text-white md:tw-h-8 sm:tw-text-sm tw-bg-gradient-to-br tw-from-red-500 md:tw-w-auto tw-to-red-400 md:tw-rounded-full"
                    >
                        🚀🇨🇳 ผจญภัยในดินแดนมังกร ฝึกฝนจนเป็นจอมยุทธ! 🇹🇭💪
                    </p>
                </div>
                <div
                    class="tw-relative tw-px-6 tw-mx-auto md:tw-px-8 tw-max-w-7xl"
                >
                    <div class="tw-max-w-3xl tw-mx-auto tw-text-center">
                        <h1
                            class="tw-mt-5 tw-text-3xl tw-font-bold tw-text-gray-900"
                        >
                            เรียนภาษาจีนสุดสนุกด้วย <br />
                        </h1>
                        <div
                            class="tw-text-5xl tw-font-bold tw-mt-5 tw-text-transparent tw-bg-gradient-to-r tw-bg-clip-text tw-from-red-500 tw-to-gray-900"
                        >
                            HSK Warrior
                        </div>
                        <p
                            class="tw-mx-auto tw-mt-6 tw-text-base tw-leading-7 tw-text-gray-600 sm:tw-max-w-md"
                        >
                            สนุกกับการเรียนรู้ภาษาจีน ด้วยตนเอง ผ่านแบบเรียน
                            แบบฝึกหัด และเกมสนุกๆ พร้อมบันทึกประวัติการฝึกฝน
                            เพิ่มระดับเลเวลของคุณ จนเป็นนักรบที่แข็งแกร่ง
                        </p>
                        <div
                            id="service_typing"
                            class="tw-mt-5 tw-text-2xl tw-text-center tw-text-green-600"
                        ></div>

                        <div
                            class="tw-flex tw-items-center tw-justify-center tw-mt-14"
                        >
                            <div id="hanzi" class="tw-w-14 tw-h-auto"></div>
                            <div id="hanzi2" class="tw-w-14 tw-h-auto"></div>
                            <div id="hanzi3" class="tw-w-14 tw-h-auto"></div>
                            <div id="hanzi4" class="tw-w-14 tw-h-auto"></div>
                            <div id="hanzi5" class="tw-w-14 tw-h-auto"></div>
                            <div id="hanzi6" class="tw-w-14 tw-h-auto"></div>
                        </div>

                        <div
                            class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-gap-2 md:tw-flex-row"
                        >
                            <div
                                class="tw-relative tw-inline-flex tw-w-full tw-mt-10 tw-group sm:tw-w-auto"
                            >
                                <div
                                    class="tw-absolute tw-duration-1000 tw-transitiona-all tw-opacity-70 -tw-inset-px tw-bg-gradient-to-r tw-from-sky-400 tw-via-blue-400 tw-to-teal-400 tw-rounded-xl tw-blur-lg tw-group-hover:tw-opacity-100 tw-group-hover:-tw-inset-1 tw-group-hover:tw-duration-200 tw-animate-tilt"
                                ></div>
                                <a
                                    href="#login"
                                    class="tw-relative sm:tw-w-auto tw-w-full hover:-tw-rotate-3 tw-transition-all tw-ease-out tw-duration-300 tw-inline-flex tw-items-center tw-justify-center tw-px-8 tw-py-4 tw-text-lg tw-font-bold tw-text-white tw-duration-200 tw-bg-gray-900 hover:bg-red-500 hover:tw-scale-[1.01] tw-rounded-xl focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-sky-500"
                                    role="button"
                                    ><span class="tw-mr-2"
                                        >เข้าสู่ระบบ HSK Warrior</span
                                    ></a
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="tw-w-96 tw-mt-14 bg-gredreen-500 md:-tw-mt-10 md:tw-block"
            >
                <img
                    :src="warrior_exam"
                    alt=""
                    class="tw-w-full tw-animate-up-down"
                />
            </div>
        </div>
    </Main>
</template>
