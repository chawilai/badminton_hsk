<script setup>
import { ref, reactive } from "vue";

const dropZones = reactive({
  Playing: [{ id: 1, title: "Item A" }],
  Ready: [{ id: 2, title: "Item B" }, { id: 3, title: "Item C" }],
  Break: [{ id: 4, title: "Item D" }],
  Finish: [],
});

const draggedItem = ref(null); // Currently dragged item
const draggedFrom = ref(""); // Tracks the drop zone where the item was dragged from
const dropZoneActive = ref(""); // Tracks the currently active drop zone during drag
const isDragging = ref(false); // Tracks if dragging is happening

// Handles the start of drag (PC: dragstart, Mobile: touchstart)
const handleDragStart = (event, item, zone) => {
  draggedItem.value = item;
  draggedFrom.value = zone;
  isDragging.value = true;

  // Prevent touch device scrolling during drag
  if (event.type === "touchstart") {
    event.preventDefault();
  }
};

// Handles the drag over a drop zone (PC: dragover, Mobile: touchmove)
const handleDragOver = (event, zone) => {
  if (!isDragging.value) return;
  dropZoneActive.value = zone;

  // Prevent default behavior to allow drop
  if (event.type === "touchmove" || event.type === "dragover") {
    event.preventDefault();
  }
};

// Handles the drop on a drop zone (PC: drop, Mobile: touchend)
const handleDrop = () => {
  if (!draggedItem.value || !dropZoneActive.value) return;

  // Remove item from the original drop zone
  const fromZone = dropZones[draggedFrom.value];
  const itemIndex = fromZone.findIndex((i) => i.id === draggedItem.value.id);
  if (itemIndex > -1) {
    fromZone.splice(itemIndex, 1);
  }

  // Add item to the new drop zone
  const toZone = dropZones[dropZoneActive.value];
  toZone.push(draggedItem.value);

  // Reset drag states
  resetDragState();
};

// Resets drag state
const resetDragState = () => {
  draggedItem.value = null;
  draggedFrom.value = "";
  dropZoneActive.value = "";
  isDragging.value = false;
};
</script>

<template>
  <div class="container">
    <div
      v-for="(items, zone) in dropZones"
      :key="zone"
      class="drop-zone"
      :class="{ active: dropZoneActive === zone }"
      @dragover.prevent="handleDragOver($event, zone)"
      @drop.prevent="handleDrop"
      @touchmove="handleDragOver($event, zone)"
      @touchend="handleDrop"
    >
      <h3>{{ zone }}</h3>
      <div
        v-for="item in items"
        :key="item.id"
        class="draggable-item"
        draggable="true"
        @dragstart="handleDragStart($event, item, zone)"
        @touchstart="handleDragStart($event, item, zone)"
      >
        {{ item.title }}
      </div>
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

h3 {
  text-align: center;
  margin-bottom: 10px;
}
</style>
