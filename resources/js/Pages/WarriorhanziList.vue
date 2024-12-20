<script setup>
import Layout from "@/Layouts/OrganicLayout.vue";

import NotFound from "@/Pages/404.vue";
import { Head, Link } from "@inertiajs/vue3";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import HanziWriter from "hanzi-writer";
import tts2 from "@/tts.js";

defineOptions({ layout: Layout });

let shouldStop = ref(false);
let playingWord = ref("");
let currentPlaybackId = ref(0);

const props = defineProps({
    hanzi_list_data: Object,
});

let hanzi_list = ref(props.hanzi_list_data);

let animateHanzi = [];

let writeHanzi = (id, letter, option = null) => {
    option = option ?? {
        // width: 100,
        // height: 100,
        // padding: 5,
        // strokeColor: '#EE00FF',

        character: null, // (The character to be rendered must be provided by the user)
        width: 50, // 300, // (Default width of the rendering area in pixels)
        height: 50, // 300, // (Default height of the rendering area in pixels)
        padding: 0, // 20, // (Padding around the character in pixels)
        strokeColor: "#B71F1F", // (Color of the strokes)
        showOutline: true, // (Whether to show the outline of the character)
        strokeAnimationSpeed: 1, // 1 (Multiplier for the speed of stroke animations)
        delayBetweenStrokes: 200, // 1000 (Delay between stroke animations in milliseconds)
        radicalColor: "#B71F1F", // null (Color for radical strokes, if any)

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
    };

    return HanziWriter.create(id, letter, option);
};

let playSound = (input) => {
    const tts = new tts2();

    currentPlaybackId.value++;
    const playbackId = currentPlaybackId.value;
    shouldStop.value = false;

    tts.rate(0.1); // 1.2 (0.1-10)
    tts.volume(0.8); // 0.5 (0-1)
    tts.pitch(1.2); // 1 (0.1-2) gooe 0.8 - 2

    // Function to process a single sound
    function processSound(sound) {
        return new Promise((resolve) => {
            tts.speak2(sound);

            playingWord.value = sound;

            resolve();
        });
    }

    // Function to handle delay
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Async function to handle the array processing with delay
    async function processArray(sounds) {
        for (const sound of sounds) {
            if (shouldStop.value || playbackId !== currentPlaybackId.value) {
                break;
            }

            await processSound(sound);
            await sleep(1000);
        }
    }

    // Check if the input is an array
    if (Array.isArray(input)) {
        // Process each sound in the array with a delay
        processArray(input);
    } else {
        // Process the single sound
        processSound(input);
    }
};

let stopPlayback = () => {
    shouldStop.value = true;
};

let writeAnimate = (no) => {
    animateHanzi[no - 1].animateCharacter();
    // animateHanzi[no].loopCharacterAnimation()
};

const leftWords = computed(() => {
  const halfLength = Math.ceil(hanzi_list.value.words.length / 2)
  return hanzi_list.value.words.slice(0, halfLength)
})

const rightWords = computed(() => {
  const halfLength = Math.ceil(hanzi_list.value.words.length / 2)
  return hanzi_list.value.words.slice(halfLength)
})

onMounted(() => {
    hanzi_list.value.words.forEach((item, index) => {
        animateHanzi[index] = writeHanzi(
            `hanzi_${item.character}`,
            item.character,
            {
                width: 100,
                height: 100,
                strokeAnimationSpeed: 2,
                delayBetweenStrokes: 150,
                radicalColor: '#B71F1F',
                padding: 3,
            }
        );
    });
});

onBeforeUnmount(() => {
    stopPlayback();
});

// import StarIcon from "@/../icons/star.svg";
// import FuelerIcon from "@/../icons/fueler.svg";
// import ChefPromote from "@/Components/ChefPromote.vue";
// import warrior_exam from "@/../images/warrior_exam.png";
</script>

<template>
    <Head title="Home" />

    <div class="container mx-auto p-4">
        <!-- <div>
            <span v-text="`list_name: ${hanzi_list.list_name}`"></span>
            <span v-text="`reference: ${hanzi_list.reference}`"></span>
            <span v-text="`box_count: ${hanzi_list.box_count}`"></span>
        </div> -->

        <div class="flex gap-x-2 justify-end">

            <Link :href="`/hanzi_list_writing?reference=${hanzi_list.reference}`" as="button"
            class="mb-2 px-3 py-2 rounded-md text-red bg-white border-2 border-red hover:text-white hover:bg-red hover:border-white transition-all duration-300">
            <i class="pi pi-pen-to-square"></i>
            คัดจีน
            </Link>
            <Link :href="`/warrior_flip_card?reference=${hanzi_list.reference}`" as="button"
            class="mb-2 px-3 py-2 rounded-md text-red bg-white border-2 border-red hover:text-white hover:bg-red hover:border-white transition-all duration-300">
            <i class="pi pi-play"></i>
            การ์ดคำ
            </Link>
        </div>
        <div>
        <!-- <i class="pi pi-pencil"></i> -->

        <!-- <i class="pi pi-pen"></i> -->
        <!-- <i class="pi pi-pencil-alt"></i> -->
        <!-- <i class="pi pi-paint-brush"></i> -->
        <!-- <i class="pi pi-paint-roller"></i> -->
        <!-- <i class="pi pi-brush"></i> -->

        </div>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg flex flex-col lg:flex-row lg:gap-x-4">
            <div class="w-full">
                <table
                    class="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                    <thead
                        class="text-base text-gray-700 uppercase bg-gradient-to-br from-red-100 to-red-300 dark:bg-gray-700 dark:text-gray-400"
                    >
                        <tr>
                            <th scope="col" class="px-6 py-3 text-center w-16">
                                ลำดับ
                            </th>
                            <th scope="col" class="px-6 py-3 text-center w-52">
                                อักษร
                            </th>
                            <th scope="col" class="px-6 py-3 text-center">
                                ความหมาย
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            v-for="(word, index) in leftWords"
                            :key="word.character"
                        >
                            <td
                                class="px-6 py-4 text-center w-16"
                                v-text="index + 1"
                            ></td>

                            <th
                                scope="row"
                                class="relative w-52 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                <!-- character -->
                                <div
                                    :id="`hanzi_${word.character}`"
                                    @click="writeAnimate(index + 1), playSound(word.character)"
                                    class="w-32 h-32 mx-auto my-auto flex justify-center items-center cursor-pointer"
                                ></div>

                                <!-- radical front -->
                                <div
                                    class="absolute text-red left-3 top-1/2 transform -translate-y-1/2"
                                    v-text="word.radical"
                                >
                                </div>

                                <!-- play animate top -->
                                <div
                                    class="absolute top-3 left-1/2 transform -translate-x-1/2"
                                >
                                    <i
                                        class="pi pi-play-circle text-lg text-gray-400 cursor-pointer hover:text-red hover:font-bold hover:scale-125"
                                        @click="writeAnimate(index + 1), playSound(word.character)"
                                    ></i>
                                </div>

                                <!-- pinyin and sound bottom -->
                                <div
                                    class="flex justify-center items-center gap-x-2 absolute bottom-3 left-1/2 transform -translate-x-1/2"
                                >
                                    <span
                                        class="text-lg"
                                        v-text="word.pinyin"
                                    ></span>
                                    <span>
                                        <i
                                            class="pi pi-volume-up text-lg text-gray-400 cursor-pointer hover:text-red hover:font-bold hover:scale-125"
                                            @click="playSound(word.character)"
                                        ></i>
                                    </span>
                                </div>
                            </th>
                            <td class="px-6 py-4" v-text="word.definition"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="w-full">
                <table
                    class="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400"
                >
                    <thead
                        class="text-base text-gray-700 uppercase bg-gradient-to-br from-red-100 to-red-300 dark:bg-gray-700 dark:text-gray-400"
                    >
                        <tr>
                            <th scope="col" class="px-6 py-3 text-center w-16">
                                ลำดับ
                            </th>
                            <th scope="col" class="px-6 py-3 text-center w-52">
                                อักษร
                            </th>
                            <th scope="col" class="px-6 py-3 text-center">
                                ความหมาย
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            v-for="(word, index) in rightWords"
                            :key="word.character"
                        >
                            <td
                                class="px-6 py-4 text-center w-16"
                                v-text="index + leftWords.length + 1"
                            ></td>

                            <th
                                scope="row"
                                class="relative w-52 px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                <!-- character -->
                                <div
                                    :id="`hanzi_${word.character}`"
                                    @click="writeAnimate(index + leftWords.length + 1), playSound(word.character)"
                                    class="w-32 h-32 mx-auto my-auto flex justify-center items-center cursor-pointer"
                                ></div>

                                <!-- radical front -->
                                <div
                                    class="absolute text-red left-3 top-1/2 transform -translate-y-1/2"
                                    v-text="word.radical"
                                >
                                </div>

                                <!-- play animate top -->
                                <div
                                    class="absolute top-3 left-1/2 transform -translate-x-1/2"
                                >
                                    <i
                                        class="pi pi-play-circle text-lg text-gray-400 cursor-pointer hover:text-red hover:font-bold hover:scale-125"
                                        @click="writeAnimate(index + leftWords.length + 1), playSound(word.character)"
                                    ></i>
                                </div>

                                <!-- pinyin and sound bottom -->
                                <div
                                    class="flex justify-center items-center gap-x-2 absolute bottom-3 left-1/2 transform -translate-x-1/2"
                                >
                                    <span
                                        class="text-lg"
                                        v-text="word.pinyin"
                                    ></span>
                                    <span>
                                        <i
                                            class="pi pi-volume-up text-lg text-gray-400 cursor-pointer hover:text-red hover:font-bold hover:scale-125"
                                            @click="playSound(word.character)"
                                        ></i>
                                    </span>
                                </div>
                            </th>
                            <td class="px-6 py-4" v-text="word.definition"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
