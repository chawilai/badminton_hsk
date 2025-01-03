<script setup>
import { ref, reactive, onBeforeUnmount, nextTick } from "vue";

const dropZones = reactive({
  Playing: [{ id: 1, title: "Item A" }],
  Ready: [{ id: 2, title: "Item B" }, { id: 3, title: "Item C" }],
  Break: [{ id: 4, title: "Item D" }],
  Finish: [],
});

const draggedItem = ref(null); // Currently dragged item
const draggedFrom = ref(""); // Tracks the drop zone where the item was dragged from
const dropZoneActive = ref(""); // Tracks the currently active drop zone during drag
const isDragging = ref(false); // Tracks whether dragging is in progress
const dragPosition = reactive({ x: 0, y: 0 }); // Position of the dragging feedback
const dragContent = ref(""); // Stores the text content of the original draggable item
const dragStyles = ref({}); // Stores the styles of the original draggable item
const returnToOriginal = ref(false); // Tracks whether the item should return to its original position
const originalPosition = reactive({ x: 0, y: 0 }); // Stores the original position of the dragged item

// Handles the start of drag (PC: mousedown, Mobile: touchstart)
const handleDragStart = (event, item, zone) => {
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
    whiteSpace: computedStyles.whiteSpace || "normal",
    overflow: computedStyles.overflow || "visible",
    display: computedStyles.display,
    position: "fixed",
  };

  // Clone the text content of the original element
  dragContent.value = originalElement.textContent;

  draggedItem.value = item;
  draggedFrom.value = zone;
  isDragging.value = true;

  updateDragPosition(event);

  // Add global listeners for mouse and touch movement and release
  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchmove", handleDragMove, { passive: false });
  document.addEventListener("touchend", handleDragEnd);

  // Prevent default scrolling on touch devices
  if (event.type === "touchstart") {
    event.preventDefault();
  }
};

// Handles the drag move (PC: mousemove, Mobile: touchmove)
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
  const zone = Object.keys(dropZones).find((key) =>
    element?.closest(`[data-zone="${key}"]`)
  );

  dropZoneActive.value = zone || "";
};

// Handles the end of drag (PC: mouseup, Mobile: touchend)
const handleDragEnd = () => {
  if (dropZoneActive.value && draggedItem.value) {
    // Remove item from the original drop zone
    const fromZone = dropZones[draggedFrom.value];
    const itemIndex = fromZone.findIndex((i) => i.id === draggedItem.value.id);
    if (itemIndex > -1) {
      fromZone.splice(itemIndex, 1);
    }

    // Add item to the new drop zone
    const toZone = dropZones[dropZoneActive.value];
    toZone.push(draggedItem.value);
  } else {
    // Trigger return animation
    returnToOriginal.value = true;

    // Adjust the position to account for the transform offset
    dragPosition.x = originalPosition.x + parseFloat(dragStyles.value.width) / 2;
    dragPosition.y = originalPosition.y + parseFloat(dragStyles.value.height) / 2;

    // Ensure Vue updates DOM before starting animation
    nextTick(() => {
      setTimeout(() => {
        resetDragState();
      }, 300); // Match the CSS transition duration
    });

    return;
  }

  resetDragState();
};

// Resets drag state
const resetDragState = () => {
  isDragging.value = false;
  draggedItem.value = null;
  draggedFrom.value = "";
  dropZoneActive.value = "";
  dragContent.value = "";
  returnToOriginal.value = false;

  // Remove global listeners
  document.removeEventListener("mousemove", handleDragMove);
  document.removeEventListener("mouseup", handleDragEnd);
  document.removeEventListener("touchmove", handleDragMove);
  document.removeEventListener("touchend", handleDragEnd);
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
</script>

<template>
  <div class="container">
    <div
      v-for="(items, zone) in dropZones"
      :key="zone"
      class="drop-zone"
      :data-zone="zone"
      :class="{ active: dropZoneActive === zone }"
    >
      <h3>{{ zone }}</h3>
      <div
        v-for="item in items"
        :key="item.id"
        class="draggable-item"
        @mousedown.prevent="handleDragStart($event, item, zone)"
        @touchstart.prevent="handleDragStart($event, item, zone)"
      >
        {{ item.title }}
      </div>
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
  justify-content: space-around;
  padding: 20px;
}

.drop-zone {
  flex: 1;
  border: 2px dashed #ccc;
  padding: 10px;
  background-color: #f9f9f9;
  min-height: 150px;
  transition: background-color 0.3s ease;
}

.drop-zone.active {
  background-color: #d0f0c0; /* Highlight when active */
}

.draggable-item {
  padding: 10px;
  background-color: #eee;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  cursor: grab;
  user-select: none;
}

.drag-feedback {
  position: fixed;
  pointer-events: none; /* Prevent interfering with mouse/touch events */
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
