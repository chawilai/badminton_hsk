<script setup>
import { ref } from "vue";

const draggedItem = ref(null); // Currently dragged item
const dropZoneActive = ref(false); // Hover state for drop zone
const isDragging = ref(false); // Tracks whether dragging is in progress

// Handles the start of drag (touch or mouse)
const handleDragStart = (event, item) => {
  draggedItem.value = item;
  isDragging.value = true;

  // Add global listeners for mouse movement and release
  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("mouseup", handleDragEnd);
};

// Handles the drag move (touch or mouse)
const handleDragMove = (event) => {
  if (!isDragging.value) return;

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
};
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
      @touchmove.prevent="handleDragMove"
      @touchend="handleDragEnd"
    >
      {{ item.title }}
    </div>

    <!-- Drop Zone -->
    <div :class="['drop-zone', { active: dropZoneActive }]">
      Drop Zone
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
</style>
