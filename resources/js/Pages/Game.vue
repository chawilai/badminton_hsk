<script setup>
import { useDragDrop } from "@/composables/useDragDrop";
import { ref, reactive, computed } from "vue";
import AppLayout from "@/layout/AppLayout.vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";

const page = usePage();

console.log(page.props);

const {
  dropZones,
  draggedItem,
  hoveredItem,
  dropZoneActive,
  dragPosition,
  dragContent,
  dragStyles,
  isDragging,
  isDoubleTapProcessing,
  originalZones,
  MAX_PLAYING_ITEMS,
  isActionProcessed,
  draggedFrom,
  returnToOriginal,
  originalPosition,
  tapCount,
  tapTimeout,
  releaseAllItems,
  handleDragStart,
  handleDragMove,
  handleDragEnd,
  resetDragState,
  moveItem,
  handleClick,
  handleDoubleClick,
  handleMouseUp,
  handleTouchStart,
  handleTouchEnd,
} = useDragDrop();

const formattedData = computed(() =>
  page.props.readyPlayers.map((item) => ({
    id: item.user_id,
    title: item.name,
    avatar: item.avatar,
    rank_title: item.badminton_rank,
    rank_level: item.badminton_level,
  }))
);

dropZones.Ready = formattedData;
</script>

<template>
  <AppLayout>
    <div class="p-fluid grid grid-nogutter justify-content-center gap-4">
      <!-- Playing Zone -->
      <div
        class="col-12 lg:col-3 drop-zone-playing p-card flex flex-column gap-3 shadow-lg"
        data-zone="Playing"
        :class="{ 'drop-zone-active': dropZoneActive === 'Playing' }"
      >
        <div class="flex align-items-center justify-content-between mb-3">
          <h3 class="text-lg font-bold text-primary">Playing</h3>
          <button
            @click="releaseAllItems"
            class="w-8rem p-button p-button-danger p-button-sm rounded-full"
          >
            <i class="pi pi-refresh"></i>
            <span class="ml-2">Release All</span>
          </button>
        </div>
        <div class="playing-items-grid flex flex-wrap justify-content-evenly bg-green-100">
          <div
            v-for="item in dropZones.Playing"
            :key="item.id"
            class="draggable-item flex flex-column w-7rem h-8rem align-items-center p-2 gap-1 bg-white"
            :class="{ 'hovered-item': hoveredItem?.id === item.id }"
            :data-id="item.id"
            @mousedown.prevent="handleDragStart($event, item, 'Playing')"
            @touchstart.prevent="handleDragStart($event, item, 'Playing')"
          >
            <!-- Subtract Button -->
            <button
              @mousedown.stop
              @mouseup.stop="handleMouseUp"
              @touchstart.stop="handleTouchStart"
              @touchend.stop="handleTouchEnd(item, 'Playing')"
              @dblclick.stop="handleDoubleClick(item, 'Playing')"
              :class="{
                'subtract-button': dropZones.Playing.includes(item),
              }"
            >
              <i
                :class="dropZones.Playing.includes(item) ? 'pi pi-minus' : 'pi pi-plus'"
              ></i>
            </button>

            <!-- Avatar -->
            <img
              :src="item.avatar"
              alt="Avatar"
              class="avatar"
            />

            <!-- Title -->
            <span class="text-center font-medium">{{ item.title }}</span>
          </div>
        </div>
      </div>

      <!-- Ready Zone -->
      <div
        class="col-12 lg:col-3 drop-zone-ready p-card flex flex-column gap-3 shadow-md"
        data-zone="Ready"
        :class="{ 'drop-zone-active': dropZoneActive === 'Ready' }"
      >
        <h3 class="text-lg font-bold text-primary mb-3">Ready</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in dropZones.Ready"
            :key="item.id"
            class="draggable-item flex flex-column w-7rem h-8rem align-items-center p-2 gap-1 bg-white"
            :class="{ 'hovered-item': hoveredItem?.id === item.id }"
            :data-id="item.id"
            @mousedown.prevent="handleDragStart($event, item, 'Ready')"
            @touchstart.prevent="handleDragStart($event, item, 'Ready')"
          >
            <!-- Add Button -->
            <button
              @mousedown.stop
              @mouseup.stop="handleMouseUp"
              @touchstart.stop="handleTouchStart"
              @touchend.stop="handleTouchEnd(item, 'Ready')"
              @dblclick.stop="handleDoubleClick(item, 'Ready')"
              class="add-button"
            >
              <i class="pi pi-plus"></i>
            </button>

            <!-- Avatar -->
            <img
              :src="item.avatar"
              alt="Avatar"
              class="avatar"
            />

            <!-- Title -->
            <span class="text-center font-medium">{{ item.title }}</span>
          </div>
        </div>
      </div>

      <!-- Break Zone -->
      <div
        class="col-12 lg:col-3 drop-zone-break p-card flex flex-column gap-3 shadow-md"
        data-zone="Break"
        :class="{ 'drop-zone-active': dropZoneActive === 'Break' }"
      >
        <h3 class="text-lg font-bold text-primary mb-3">Break</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in dropZones.Break"
            :key="item.id"
            class="draggable-item flex flex-column w-7rem h-8rem align-items-center p-2 gap-1 bg-white"
            :class="{ 'hovered-item': hoveredItem?.id === item.id }"
            :data-id="item.id"
            @mousedown.prevent="handleDragStart($event, item, 'Break')"
            @touchstart.prevent="handleDragStart($event, item, 'Break')"
          >
            <!-- Add Button -->
            <button
              @mousedown.stop
              @mouseup.stop="handleMouseUp"
              @touchstart.stop="handleTouchStart"
              @touchend.stop="handleTouchEnd(item, 'Break')"
              @dblclick.stop="handleDoubleClick(item, 'Break')"
              class="add-button"
            >
              <i class="pi pi-plus"></i>
            </button>

            <!-- Avatar -->
            <img
              :src="item.avatar"
              alt="Avatar"
              class="avatar"
            />

            <!-- Title -->
            <span class="text-center font-medium">{{ item.title }}</span>
          </div>
        </div>
      </div>

      <!-- Finish Zone -->
      <div
        class="col-12 lg:col-3 drop-zone-finish p-card flex flex-column gap-3 shadow-md"
        data-zone="Finish"
        :class="{ 'drop-zone-active': dropZoneActive === 'Finish' }"
      >
        <h3 class="text-lg font-bold text-primary mb-3">Finish</h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="item in dropZones.Finish"
            :key="item.id"
            class="draggable-item flex flex-column w-7rem h-8rem align-items-center p-2 gap-1 bg-white"
            :class="{ 'hovered-item': hoveredItem?.id === item.id }"
            :data-id="item.id"
            @mousedown.prevent="handleDragStart($event, item, 'Finish')"
            @touchstart.prevent="handleDragStart($event, item, 'Finish')"
          >
            <!-- Add Button -->
            <button
              @mousedown.stop
              @mouseup.stop="handleMouseUp"
              @touchstart.stop="handleTouchStart"
              @touchend.stop="handleTouchEnd(item, 'Finish')"
              @dblclick.stop="handleDoubleClick(item, 'Finish')"
              class="add-button"
            >
              <i class="pi pi-plus"></i>
            </button>

            <!-- Avatar -->
            <img
              :src="item.avatar"
              alt="Avatar"
              class="avatar"
            />

            <!-- Title -->
            <span class="text-center font-medium">{{ item.title }}</span>
          </div>
        </div>
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
      <img
        :src="draggedItem.avatar"
        alt="Dragging Avatar"
        class="avatar drag-avatar"
      />
      <span class="text-center font-medium" v-text="draggedItem.title"></span>
    </div>
  </AppLayout>
</template>

<style scoped>
/* Drop Zone Styles */
.drop-zone-playing {
  border: 3px dashed var(--green-300);
  background-color: var(--green-50);
  padding: 20px;
  border-radius: 10px;
}

.drop-zone-ready {
  border: 3px dashed var(--blue-300);
  background-color: var(--blue-50);
  padding: 20px;
  border-radius: 10px;
}

.drop-zone-break {
  border: 3px dashed var(--yellow-300);
  background-color: var(--yellow-50);
  padding: 20px;
  border-radius: 10px;
}

.drop-zone-finish {
  border: 3px dashed var(--purple-300);
  background-color: var(--purple-50);
  padding: 20px;
  border-radius: 10px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--surface-border);
}

.playing-zone {
  background-color: var(--surface-c); /* Different background for the playing zone */
}

.playing-items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns */
  grid-template-rows: repeat(2, 1fr); /* 2 rows */
  gap: 16px; /* Adjust spacing between items */
  padding: 8px; /* Padding inside the grid */
  border: 2px dashed var(--surface-border);
  border-radius: 8px;
  min-height: 200px; /* Ensure minimum height */
}

.draggable-item {
  position: relative;
  background-color: var(--surface-a);
  border: 1px solid var(--surface-border);
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.draggable-item:hover {
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

.add-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--blue-500);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.add-button:hover {
  background-color: var(--blue-600);
  transform: scale(1.1);
}

.subtract-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: var(--red-500); /* Red color for subtract */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.subtract-button:hover {
  background-color: var(--red-600); /* Darker red on hover */
  transform: scale(1.1);
}

.drop-zone-active {
  background-color: var(--green-50);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.drag-feedback {
  position: fixed;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px; /* Space between avatar and text */
  background-color: var(--surface-a);
  padding: 8px 12px;
  border: 2px solid var(--surface-border);
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.drag-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--blue-500);
}
</style>
