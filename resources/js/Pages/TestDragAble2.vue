<template>
  <Draggable>
    <div class="box">Drag Me</div>
  </Draggable>
  <Draggable>
    <div
      class="box touch-area"
      @touchstart="handleInteraction"
      @click="handleInteraction"
    >
      Drop
    </div>
  </Draggable>
</template>

<script setup>
import { ref } from "vue";

const lastTap = ref(0);
const clickTimeout = ref(null);

const handleInteraction = (event) => {
  const currentTime = new Date().getTime();
  const tapInterval = currentTime - lastTap.value;

  if (tapInterval < 300 && tapInterval > 0) {
    // Double tap or double click detected
    if (event.type === "touchstart") {
      console.log("Double Tap Detected");
    } else if (event.type === "click") {
      console.log("Double Click Detected");
    }
    lastTap.value = 0; // Reset
  } else {
    lastTap.value = currentTime;

    // Single tap or click detection
    if (event.type === "touchstart") {
      console.log("Single Tap Detected");
    } else if (event.type === "click") {
      console.log("Single Click Detected");
    }

    // Clear previous timeout for click
    clearTimeout(clickTimeout.value);
    clickTimeout.value = setTimeout(() => {
      lastTap.value = 0; // Reset after timeout
    }, 300); // Timeout to differentiate single and double interaction
  }
};
</script>

<style scoped>
.touch-area {
  width: 200px;
  height: 200px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  user-select: none;
  touch-action: manipulation;
  cursor: pointer;
}
</style>
