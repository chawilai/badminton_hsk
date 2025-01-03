<script setup>
import { ref, reactive, onBeforeUnmount, nextTick } from "vue";

const draggedItem = ref(null); // Currently dragged item
const dropZoneActive = ref(false); // Hover state for drop zone
const isDragging = ref(false); // Tracks whether dragging is in progress
const dragPosition = reactive({ x: 0, y: 0 }); // Position of the dragging feedback
const dragContent = ref(""); // Stores the text content of the original draggable item
const dragStyles = ref({}); // Stores the styles of the original draggable item
const returnToOriginal = ref(false); // Tracks whether the item should return to its original position
const originalPosition = reactive({ x: 0, y: 0 }); // Stores the original position of the dragged item

// Handles the start of drag (touch or mouse)
const handleDragStart = (event, item) => {
  const originalElement = event.target;
  const rect = originalElement.getBoundingClientRect();

  // Store the original position of the item
  originalPosition.x = rect.left;
  originalPosition.y = rect.top;

  // Clone the original element's computed styles
  const computedStyles = window.getComputedStyle(originalElement);
  dragStyles.value = {
    width: `${originalElement.offsetWidth}px`,
    height: `${originalElement.offsetHeight}px`,
    backgroundColor: computedStyles.backgroundColor,
    color: computedStyles.color,
    border: computedStyles.border,
    padding: computedStyles.padding,
    borderRadius: computedStyles.borderRadius,
    fontSize: computedStyles.fontSize,
    textAlign: computedStyles.textAlign,
    lineHeight: computedStyles.lineHeight,
    verticalAlign: computedStyles.verticalAlign,
    whiteSpace: computedStyles.whiteSpace || "normal",
    overflow: computedStyles.overflow || "visible",
    display: computedStyles.display,
    position: "fixed",
  };

  // Clone the text content of the original element
  dragContent.value = originalElement.textContent;

  draggedItem.value = item;
  isDragging.value = true;

  updateDragPosition(event);

  // Add global listeners for mouse and touch movement and release
  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchmove", handleDragMove, { passive: false });
  document.addEventListener("touchend", handleDragEnd);
};

// Handles the drag move (touch or mouse)
const handleDragMove = (event) => {
  if (!isDragging.value) return;

  event.preventDefault(); // Prevent default scrolling on touch devices
  updateDragPosition(event);

  let clientX, clientY;

  if (event.touches) {
    const touch = event.touches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const element = document.elementFromPoint(clientX, clientY);

  if (element?.classList.contains("drop-zone")) {
    dropZoneActive.value = true;
  } else {
    dropZoneActive.value = false;
  }
};

// Handles the end of drag (touch or mouse)
const handleDragEnd = () => {
  if (dropZoneActive.value && draggedItem.value) {
    console.log(`Dropped item: ${draggedItem.value.title}`);
  } else {
    // Trigger return animation
    returnToOriginal.value = true;

    // Adjust the position to account for the transform offset
    dragPosition.x = originalPosition.x + parseFloat(dragStyles.value.width) / 2;
    dragPosition.y = originalPosition.y + parseFloat(dragStyles.value.height) / 2;

    // Ensure Vue updates DOM before starting animation
    nextTick(() => {
      // Remove drag feedback after animation ends
      setTimeout(() => {
        resetDragState();
      }, 300); // Match the CSS transition duration
    });

    return;
  }

  resetDragState();
};

// Resets the drag state
const resetDragState = () => {
  isDragging.value = false;
  dropZoneActive.value = false;
  draggedItem.value = null;
  dragContent.value = "";
  returnToOriginal.value = false;
};

// Updates the position of the drag feedback element
const updateDragPosition = (event) => {
  if (event.touches) {
    const touch = event.touches[0];
    dragPosition.x = touch.clientX;
    dragPosition.y = touch.clientY;
  } else {
    dragPosition.x = event.clientX;
    dragPosition.y = event.clientY;
  }
};

// Clean up listeners when the component unmounts
onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleDragMove);
  document.removeEventListener("mouseup", handleDragEnd);
  document.removeEventListener("touchmove", handleDragMove);
  document.removeEventListener("touchend", handleDragEnd);
});
</script>

<template>
  <div class="container">
    <!-- Draggable Items -->
    <div
      class="draggable-item"
      v-for="item in [{ id: 1, title: 'Item A' }, { id: 2, title: 'Item B' }]"
      :key="item.id"
      @mousedown.prevent="handleDragStart($event, item)"
      @touchstart.prevent="handleDragStart($event, item)"
    >
      {{ item.title }}
    </div>

    <!-- Drop Zone -->
    <div :class="['drop-zone', { active: dropZoneActive }]">
      Drop Zone
    </div>

    <!-- Dragging Feedback -->
    <div
      v-if="isDragging"
      class="drag-feedback"
      :style="{
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`,
        ...dragStyles,
        transition: returnToOriginal ? 'all 0.3s ease' : 'none',
      }"
    >
      {{ dragContent }}
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.draggable-item {
  padding: 10px;
  background-color: #eee;
  border: 1px solid #ddd;
  cursor: grab;
  user-select: none;
  text-align: center;
}

.drop-zone {
  flex: 1;
  height: 100px;
  border: 2px dashed #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

.drop-zone.active {
  background-color: #d0f0c0; /* Highlight when active */
}

.drag-feedback {
  position: fixed;
  pointer-events: none; /* Prevent interfering with mouse/touch events */
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
