<script setup>
import { Head, Link } from "@inertiajs/vue3";
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import HanziWriter from "hanzi-writer";
import tts2 from "@/tts.js";
import warrior_logo from "@/../images/warrior_logo.png";
import QRCode from "qrcode";
import HanziStrokeList from "@/Components/HanziStrokeList.vue";
import SignaturePad from "@/Components/SignaturePad.vue";

import { useSignaturePadStore } from "@/Stores/signaturepad";
const signaturePadStore = useSignaturePadStore();

const emit = defineEmits(["backPressed"]);

const mainUrl = `${window.location.protocol}//${window.location.hostname}${
  window.location.port ? ":" + window.location.port : ""
}`;

const props = defineProps({
  hanzi_list_data: Object,
});

const hanzi_list = ref(props.hanzi_list_data);

const url = `${mainUrl}/hanzi_list?reference=${hanzi_list.value.reference}`;

let qrImage = ref("");
let animateHanzi = [];
let shouldStop = ref(false);
let playingWord = ref("");
let currentPlaybackId = ref(0);
const hanziPerPage = 10;

const pageCount = computed(() => {
  return Math.ceil(hanzi_list.value.words.length / hanziPerPage);
});

const paginatedData = (page) => {
  const start = (page - 1) * hanziPerPage;
  const end = start + hanziPerPage;
  return hanzi_list.value.words.slice(start, end);
};

// add number to SVG
let svgElements = ref(null);
// add number to SVG

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

let printPage = () => {
  window.print();
};

let isDrawActive = (word_no) => {
  // console.log(word_no)
  return word_no === 1 ? true : false;
};

QRCode.toDataURL(url)
  .then((res) => {
    qrImage.value = res;
  })
  .catch((err) => {
    console.error(err);
  });

const handleKeydown = (event) => {
  if (event.key === "Backspace") {
    // Change the background color
    emit("back", "back");
  }
};

onBeforeUnmount(() => {
  // Remove event listener from the document
  document.removeEventListener("keydown", handleKeydown);
});

onMounted(() => {
  document.body.classList.add("A4");
  document.body.classList.add("bg-gradient-to-br");
  document.body.classList.add("from-red-100");
  document.body.classList.add("to-red-300");

  document.addEventListener("keydown", handleKeydown);

  hanzi_list.value.words.forEach((item, index) => {
    animateHanzi[index] = writeHanzi(`hanzi_${item.character}`, item.character, {
      width: 50,
      height: 50,
      strokeAnimationSpeed: 2,
      delayBetweenStrokes: 150,
      radicalColor: "#B71F1F",
      padding: 3,
    });
  });
});

onUnmounted(() => {
  document.body.classList.remove("A4");
  document.body.classList.remove("bg-gradient-to-br");
  document.body.classList.remove("from-red-100");
  document.body.classList.remove("to-red-300");
});
</script>

<template>
  <Head title="Home" />

  <section
    class="sheet p-[3mm] flex flex-col justify-between relative"
    v-for="(sheet, sheet_index) in pageCount"
  >
    <div class="w-full">
      <div class="flex justify-between gap-x-4 h-16">
        <div class="flex justify-between flex-1">
          <a href="/warrior_home" class="text-lg font-bold tracking-wide">
            <div class="flex items-center pl-3 py-3">
              <img class="w-14 h-auto" :src="warrior_logo" alt="" />
              <span class="select-none text-red">HSK</span>
              <span class="select-none text-black">Warrior</span>
            </div>
          </a>
          <div class="flex gap-x-3 items-end mr-4">
            <Link
              :href="url"
              as="button"
              class="h-8 w-16 select-none rounded-md text-sm hover:text-red hover:bg-white hover:border-red border-2 border-red text-white bg-red transition-all duration-300 print:hidden"
            >
              <i class="pi pi-chevron-left"></i>
              Back
            </Link>
            <Link
              @click="printPage()"
              href="#"
              as="button"
              class="h-8 w-16 select-none rounded-md text-sm text-red bg-white border-2 border-red hover:text-white hover:bg-red hover:border-red transition-all duration-300 print:hidden"
            >
              <i class="pi pi-print"></i>
              Print
            </Link>
          </div>
        </div>
        <img class="w-[100px] h-[100px]" :src="qrImage" alt="" />
      </div>
      <hr class="border-1 mt-4 border-red" />
    </div>
    <div class="px-5 py-4 flex-1 flex flex-col gap-y-[6px] w-full">
      <div v-for="(word, word_index) in paginatedData(sheet)">
        <div class="flex justify-between">
            <div class="flex items-center gap-x-2">
            <div
                class="text-xs pl-4 select-none"
                v-html="`${word.character} (${word.pinyin}) : ${word.definition} `"
            ></div>
            <HanziStrokeList
                :id="`hanzi_stroke_${sheet}_${word_index}`"
                :hanzi="word.character"
                frame-size="25"
                hanzi-size="23"
                frame-color="#CCC"
                frame-border="1"
                class="flex gap-x-px pb-1"
            ></HanziStrokeList>
            </div>
            <div class="flex items-end mb-1 gap-x-1 pr-5">
                <button
                v-show="signaturePadStore.activeRow.includes((sheet - 1) * 10 + word_index + 1)"
                class="print:hidden select-none text-[8px] w-10 h-4 border border-red-200 rounded-lg" type="button" @click="signaturePadStore.triggerUndo()"><i class="pi pi-undo"></i> Undo</button>
                <button
                v-show="signaturePadStore.activeRow.includes((sheet - 1) * 10 + word_index + 1)"
                class="print:hidden select-none text-[8px] w-10 h-4 border border-red-200 rounded-lg" type="button" @click="signaturePadStore.triggerClearPad()"><i class="pi pi-eraser"></i> Clear</button>
                <button
                class="print:hidden select-none text-[8px] w-10 h-4 border rounded-lg hover:bg-red hover:text-white hover:border-red"
                :class="signaturePadStore.activeRow.includes((sheet - 1) * 10 + word_index + 1) ? 'bg-red text-white bg-red' : 'bg-gray-400 text-black border-black'"
                type="button"
                @click="signaturePadStore.triggerActiveRow((sheet - 1) * 10 + word_index + 1)"><i class="pi pi-pencil"></i> Write</button>
            </div>
        </div>
        <div class="relative flex justify-start">
          <div
            class="w-15 h-15 border-t border-b border-r border-red first:border-l last:border-r"
            v-for="(box, index) in 1"
          >
            <div
              class="absolute -top-2 -left-3 w-5 h-5 text-sm bg-red select-none rounded-full text-white font-bold flex justify-center items-center"
              v-text="(sheet - 1) * 10 + word_index + 1"
              v-if="index == 0"
            ></div>
            <div
              v-if="index == 0"
              :id="`hanzi_${word.character}`"
              @click="
                writeAnimate((sheet - 1) * 10 + word_index + 1), playSound(word.character)
              "
              class="w-14 h-14 mx-auto my-auto flex justify-center items-center cursor-pointer"
            ></div>
          </div>
          <SignaturePad
            :isActive="true"
            :have-btn="false"
            canvas-class=""
            pen-color="#0037dd"
            :wrapper-class="signaturePadStore.activeRow.includes((sheet - 1) * 10 + word_index + 1) ? 'bg-gray-100' : ''"
            background-color=""
            :min-width="0.6"
            :max-width="1.2"
            :velocity-filter-weight="0"
            :dot-size="1.1"
            :throttle="10"
            :minDistance="1"
            :width="60"
            :height="60"
            border-color
            :canvasId="`drawpad_` + ((sheet - 1) * 10 + word_index + 1) + `_${index}`"
            v-for="(box, index) in 11"
          />
          <!--  -->
          <!--  -->
        </div>
      </div>
    </div>
    <hr class="border-1 border-red" />
    <div class="flex justify-between items-center">
      <div class="w-full p-3 text-xs">
        <strong
          >Copyright &copy; 2023-2024
          <a target="_blank" href="https://hskwarrior.com">HSK Warrior</a>.</strong
        >
        All rights reserved.
      </div>
      <div class="pr-5" v-html="`${sheet}/${pageCount}`"></div>
    </div>
  </section>
</template>

<style scoped>
@page {
  size: A4;
}

.sheet {
  page-break-after: always;
}

.sheet:last-of-type {
  page-break-after: auto;
}
</style>
