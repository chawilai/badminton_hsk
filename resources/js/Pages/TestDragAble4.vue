<script setup>
import { useDragDrop } from "../composables/useDragDrop";

const {
  dropZones,
  draggedItem,
  draggedFrom,
  dropZoneActive,
  isDragging,
  hoveredItem,
  handleDragStart,
  handleDragOver,
  handleItemHover,
  handleItemLeave,
  handleDrop,
  resetDragState,
} = useDragDrop();
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
        :class="{ hovered: hoveredItem && hoveredItem.id === item.id }"
        draggable="true"
        @dragstart="handleDragStart($event, item, zone)"
        @touchstart="handleDragStart($event, item, zone)"
        @dragenter="handleItemHover(item)"
        @dragleave="handleItemLeave"
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
  transition: background-color 0.3s ease, transform 0.2s ease; /* Added transform */
}

h3 {
  text-align: center;
  margin-bottom: 10px;
}

.draggable-item.hovered {
  background-color: #f0d0c0;
  transform: scale(1.05); /* Slightly enlarge the item for feedback */
}
</style>
