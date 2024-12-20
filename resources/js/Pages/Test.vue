<script setup>
import FlipCard from "@/Components/FlipCard.vue";
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

// let hanzi_list = ref(props.hanzi_list_data);

let hanzi_list = ref({
    words: [
        {
            character: "块",
            pinyin: "kuài",
            meaning: "piece",
            meaning_thai: "ชิ้น",
        },
        { character: "好", pinyin: "hǎo", meaning: "good", meaning_thai: "ดี" },
        {
            character: "人",
            pinyin: "rén",
            meaning: "person",
            meaning_thai: "คน",
        },
        {
            character: "我",
            pinyin: "wǒ",
            meaning: "I, me",
            meaning_thai: "ฉัน",
        },
        { character: "你", pinyin: "nǐ", meaning: "you", meaning_thai: "คุณ" },
        {
            character: "他",
            pinyin: "tā",
            meaning: "he, him",
            meaning_thai: "เขา (ชาย)",
        },
        {
            character: "她",
            pinyin: "tā",
            meaning: "she, her",
            meaning_thai: "เธอ (หญิง)",
        },
        {
            character: "们",
            pinyin: "men",
            meaning: "plural marker",
            meaning_thai: "พวก",
        },
        {
            character: "这",
            pinyin: "zhè",
            meaning: "this",
            meaning_thai: "นี้",
        },
        {
            character: "那",
            pinyin: "nà",
            meaning: "that",
            meaning_thai: "นั้น",
        },
        {
            character: "哪",
            pinyin: "nǎ",
            meaning: "which",
            meaning_thai: "ไหน",
        },
        { character: "来", pinyin: "lái", meaning: "come", meaning_thai: "มา" },
        { character: "去", pinyin: "qù", meaning: "go", meaning_thai: "ไป" },
        {
            character: "在",
            pinyin: "zài",
            meaning: "at, in",
            meaning_thai: "อยู่",
        },
        { character: "和", pinyin: "hé", meaning: "and", meaning_thai: "และ" },
        {
            character: "说",
            pinyin: "shuō",
            meaning: "speak, say",
            meaning_thai: "พูด",
        },
        { character: "吃", pinyin: "chī", meaning: "eat", meaning_thai: "กิน" },
    ],
});

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
    const halfLength = Math.ceil(hanzi_list.value.words.length / 2);
    return hanzi_list.value.words.slice(0, halfLength);
});

const rightWords = computed(() => {
    const halfLength = Math.ceil(hanzi_list.value.words.length / 2);
    return hanzi_list.value.words.slice(halfLength);
});

const flip_card = (word) => {
    setTimeout(() => {
        playSound(word.character)
    }, 500);
};

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
                radicalColor: "#B71F1F",
                padding: 3,
            }
        );
    });
});

onBeforeUnmount(() => {
    stopPlayback();
});
</script>

<template>
    <Head title="Flip Card" />

    <div
        class="flex flex-wrap gap-3 py-14 px-6 mx-auto max-w-screen-xl sm:px-8 md:px-12 lg:px-16 xl:px-24"
    >
        <FlipCard
            :width="200"
            :height="150"
            v-for="(word, index) in hanzi_list.words"
            :key="word"
            @click="flip_card(word)"
        >
            <template v-slot:front>
                <div
                    :id="`hanzi_${word.character}`"
                    class="w-32 h-32 mx-auto my-auto flex justify-center items-center cursor-pointer"
                ></div>
            </template>
            <template v-slot:back>
                <div
                    class="flex flex-col gap-y-2 justify-center items-center h-full w-full"
                >
                    <div class="font-bold text-6xl">
                        {{ word.pinyin }}
                    </div>
                    <div>
                        {{ word.meaning_thai }}
                    </div>
                </div>
            </template>
        </FlipCard>
    </div>
</template>

<style scoped></style>
