<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import Main from "@/Layouts/Main.vue";
import { Head } from "@inertiajs/vue3";

import tts2 from "@/tts.js";

let props = defineProps({
    hsk1: {
        type: Array,
    },
});

let shouldStop = ref(false);
let playingWord = ref("");
let currentPlaybackId = ref(0);

let hsk1_lists = computed(() => {
    return props.hsk1.map((item) => item.hanzi);
});

let isPlaying = (word_check) => {
    return word_check == playingWord.value;
};

let playSound = (input) => {
    const tts = new tts2();

    currentPlaybackId.value++;
    const playbackId = currentPlaybackId.value;
    shouldStop.value = false;

    tts.rate(0.8); // 1.2 (0.1-10)
    tts.volume(0.5); // 0.5 (0-1)
    tts.pitch(1); // 1 (0.1-2) gooe 0.8 - 2

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

onBeforeUnmount(() => {
    stopPlayback();
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
                <div class="tw-flex">
                    <button
                        @click="playSound(hsk1_lists)"
                        class="tw-border tw-border-gray-400 tw-py-3 tw-px-4 tw-rounded-xl tw-bg-green-700 tw-text-white"
                    >
                        All
                    </button>
                    <button
                        @click="stopPlayback()"
                        class="tw-border tw-border-gray-400 tw-py-3 tw-px-4 tw-rounded-xl tw-bg-red-300 tw-text-white"
                    >
                        Stop
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>hanzi</th>
                            <th>pinyin</th>
                            <th>sound</th>
                            <th>thai</th>
                            <th>english</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(word, index) in props.hsk1"
                            :key="index"
                            :class="{ 'tw-bg-green-300': isPlaying(word.hanzi) }"
                        >
                            <td>{{ index + 1 }}</td>
                            <td>{{ word.hanzi }}</td>
                            <td>{{ word.pinyin }}</td>
                            <td>
                                <span
                                    @click="playSound(word.hanzi)"
                                    class="tw-cursor-pointer tw-border tw-border-gray-200 tw-rounded-xl tw-text-white tw-bg-blue-700 tw-py-px tw-px-2"
                                    >Play</span
                                >
                            </td>
                            <td>{{ word.meaning_thai }}</td>
                            <td>{{ word.meaning_english }}</td>
                        </tr>
                    </tbody>
                </table>
                <label>你想去哪里？</label>
                <button
                    @click="playSound('你想去哪里？')"
                    class="tw-border tw-border-gray-400 tw-py-3 tw-px-4 tw-rounded-xl tw-bg-green-700 tw-text-white"
                >
                    Speak
                </button>
                <label>请等我一下。</label>
                <button
                    @click="playSound('请等我一下。')"
                    class="tw-border tw-border-gray-400 tw-py-3 tw-px-4 tw-rounded-xl tw-bg-green-700 tw-text-white"
                >
                    Speak
                </button>
                <label>我们可以一起去。</label>
                <button
                    @click="playSound('我们可以一起去。')"
                    class="tw-border tw-border-gray-400 tw-py-3 tw-px-4 tw-rounded-xl tw-bg-green-700 tw-text-white"
                >
                    Speak
                </button>
            </div>
        </div>
    </Main>
</template>
