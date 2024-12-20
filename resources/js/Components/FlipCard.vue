<script setup>
import { ref } from "vue";

// Define props with default values and validators
const props = defineProps({
    width: {
        type: Number,
        default: 245, // default width if not provided
        validator: (value) => value > 0,
    },
    height: {
        type: Number,
        default: 395, // default height if not provided
        validator: (value) => value > 0,
    },
    word: {
        type: String,
        required: true,
    },
    isFlipped: Boolean
});

// const isFlipped = ref(false);
const emit = defineEmits(["flip"]); // Define the 'flip' event to emit
</script>

<template>
    <div
        class="flip_card"
        @click="emit('flip')"
        :class="{ flipped: props.isFlipped }"
        :style="{ width: `${props.width}px`, height: `${props.height}px` }"
    >
        <!-- Card Front Side -->
        <div class="front_card">
            <slot name="front">Default Front Content</slot>
        </div>
        <!-- Card Back Side -->
        <div class="back_card">
            <slot name="back">Default Back Content</slot>
        </div>
    </div>
</template>

<style scoped>
.flip_card {
    position: relative;
    top: 0px;
    left: 0px;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: all 0.5s ease;
    box-shadow: 0 0 0 0 green;
}
.flip_card.flipped {
    transform: rotateY(180deg);
}
.front_card,
.back_card {
    position: absolute;
    height: 100%;
    width: 100%;
    backface-visibility: hidden;
    border-radius: 20px;
    font-size: 17px;
    font-weight: bold;
    padding: 15px;
    box-sizing: border-box;
    border: 0.5px solid rgb(158, 158, 158);
    box-shadow: -3px 3px 11px rgb(158, 158, 158);
}
.front_card {
    background-color: #eee;
    color: aliceblue;
    font-family: sans-serif;
}
.back_card {
    color: #333;
    background-color: #fdd;
    transform: rotateY(180deg);
    font-family: serif;
}
</style>
