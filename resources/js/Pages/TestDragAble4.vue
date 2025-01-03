<script setup>
import { ref, reactive, onBeforeUnmount } from "vue";

const draggedItem = ref(null); // Currently dragged item
const dropZoneActive = ref(false); // Hover state for drop zone
const isDragging = ref(false); // Tracks whether dragging is in progress
const dragPosition = reactive({ x: 0, y: 0 }); // Position of the dragging feedback

// Handles the start of drag (touch or mouse)
const handleDragStart = (event, item) => {
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
    // Touch event
    const touch = event.touches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    // Mouse event
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
  }

  isDragging.value = false;
  dropZoneActive.value = false;
  draggedItem.value = null;

  // Remove global listeners after drag ends
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
      :style="{ left: `${dragPosition.x}px`, top: `${dragPosition.y}px` }"
    >
      {{ draggedItem?.value?.title }}
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
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
