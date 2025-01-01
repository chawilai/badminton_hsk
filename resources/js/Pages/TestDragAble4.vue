<script setup>
import { ref } from "vue";

const draggedItem = ref(null); // Currently dragged item
const dropZoneActive = ref(false); // Hover state for drop zone

const handleTouchStart = (event, item) => {
  draggedItem.value = item;
};

const handleTouchMove = (event) => {
  const touch = event.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);

  if (element?.classList.contains("drop-zone")) {
    dropZoneActive.value = true;
  } else {
    dropZoneActive.value = false;
  }
};

const handleTouchEnd = () => {
  if (dropZoneActive.value) {
    console.log(`Dropped item: ${draggedItem.value.title}`);
  }
  dropZoneActive.value = false;
  draggedItem.value = null;
};
</script>

<template>
  <div class="container">
    <!-- Draggable Items -->
    <div
      class="draggable-item"
      v-for="item in [{ id: 1, title: 'Item A' }, { id: 2, title: 'Item B' }]"
      :key="item.id"
      @touchstart.prevent="handleTouchStart($event, item)"
      @touchmove.prevent="handleTouchMove"
      @touchend="handleTouchEnd"
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
