<template>
  <div class="drag-drop-container">
    <!-- Ready Area -->
    <div
      class="ready-area"
      :class="{ highlight: isHoveringOverReady }"
      @dragover.prevent
      @dragenter="hoverReadyArea(true, $event)"
      @dragleave="hoverReadyArea(false, $event)"
      @drop="dropToReadyArea"
    >
      <h3>Ready Area</h3>
      <div class="area">
        <div
          v-for="(player, index) in readyPlayers"
          :key="player.id"
          class="box"
          draggable="true"
          @dragstart="dragStart(player, index, 'ready')"
          @dblclick="addPlayerToFirstAvailableSlot(index)"
        >
          {{ player.label }}
        </div>
      </div>
    </div>

    <!-- Break Area -->
    <div
      class="break-area"
      :class="{ highlight: isHoveringOverBreak }"
      @dragover.prevent
      @dragenter="hoverBreakArea(true, $event)"
      @dragleave="hoverBreakArea(false, $event)"
      @drop="dropToBreakArea"
    >
      <h3>Break Area</h3>
      <div class="area">
        <div
          v-for="(player, index) in breakPlayers"
          :key="player.id"
          class="box"
          draggable="true"
          @dragstart="dragStart(player, index, 'break')"
        >
          {{ player.label }}
        </div>
      </div>
    </div>

    <!-- Game Slots -->
    <div class="game-area">
      <h3>Game Slots</h3>
      <div class="slots">
        <div
          v-for="(slot, index) in gameSlots"
          :key="index"
          class="slot"
          :class="{ highlight: hoveredSlot === index }"
          @dragover.prevent
          @dragenter="hoverSlot(index)"
          @dragleave="hoverSlot(null)"
          @drop="drop(index)"
          @dblclick="removePlayerFromSlot(index)"
        >
          <div
            v-if="slot"
            class="box"
            draggable="true"
            @dragstart="dragStart(slot, index, 'slot')"
          >
            {{ slot.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Players in the ready area
const readyPlayers = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    label: `Player ${i + 1}`,
  }))
);

// Players in the break area
const breakPlayers = ref([]);

// Slots in the game area (initially empty)
const gameSlots = ref([null, null, null, null]);

// Dragging state
const draggedPlayer = ref(null);
const draggedIndex = ref(null);
const draggedFrom = ref(null);

// Hover states
const hoveredSlot = ref(null);
const isHoveringOverReady = ref(false);
const isHoveringOverBreak = ref(false);

// Handle drag start
function dragStart(player, index, from) {
  draggedPlayer.value = player;
  draggedIndex.value = index;
  draggedFrom.value = from;
}

// Handle hover over a slot
function hoverSlot(index) {
  hoveredSlot.value = index;
}

// Handle hover over the ready area
function hoverReadyArea(isHovering, event) {
  if (!isHovering) {
    const related = event.relatedTarget;
    if (related && event.currentTarget.contains(related)) {
      return;
    }
  }
  isHoveringOverReady.value = isHovering;
}

// Handle drop into game slots
function drop(slotIndex) {
  if (!draggedPlayer.value) return;

  if (draggedFrom.value === "ready") {
    const previousPlayer = gameSlots.value[slotIndex];
    gameSlots.value[slotIndex] = draggedPlayer.value;
    readyPlayers.value.splice(draggedIndex.value, 1);

    if (previousPlayer) {
      readyPlayers.value.push(previousPlayer);
    }
  } else if (draggedFrom.value === "slot") {
    const previousPlayer = gameSlots.value[slotIndex];
    gameSlots.value[slotIndex] = draggedPlayer.value;
    gameSlots.value[draggedIndex.value] = previousPlayer;
  }

  clearDragState();
  hoverSlot(null);
}

// Handle hover over the break area
function hoverBreakArea(isHovering, event) {
  if (!isHovering) {
    const related = event.relatedTarget;
    if (related && event.currentTarget.contains(related)) {
      return;
    }
  }
  isHoveringOverBreak.value = isHovering;
}

// Handle drop into ready area
function dropToReadyArea() {
  if (!draggedPlayer.value) return;

  if (draggedFrom.value === "break") {
    breakPlayers.value.splice(draggedIndex.value, 1);
    readyPlayers.value.push(draggedPlayer.value);
  } else if (draggedFrom.value === "slot") {
    gameSlots.value[draggedIndex.value] = null;
    readyPlayers.value.push(draggedPlayer.value);
  }

  clearDragState();
  isHoveringOverReady.value = false;
}

// Handle drop into break area
function dropToBreakArea() {
  if (!draggedPlayer.value || draggedFrom.value === "break") return;

  if (draggedFrom.value === "ready") {
    readyPlayers.value.splice(draggedIndex.value, 1);
    breakPlayers.value.push(draggedPlayer.value);
  } else if (draggedFrom.value === "slot") {
    gameSlots.value[draggedIndex.value] = null;
    breakPlayers.value.push(draggedPlayer.value);
  }

  clearDragState();
  isHoveringOverBreak.value = false;
}

// Add player to the first available slot via double-click
function addPlayerToFirstAvailableSlot(readyIndex) {
  const firstEmptySlotIndex = gameSlots.value.findIndex((slot) => !slot);
  if (firstEmptySlotIndex === -1) {
    alert("All slots are full.");
    return;
  }

  gameSlots.value[firstEmptySlotIndex] = readyPlayers.value[readyIndex];
  readyPlayers.value.splice(readyIndex, 1);
}

// Remove player from slot via double-click
function removePlayerFromSlot(slotIndex) {
  const playerInSlot = gameSlots.value[slotIndex];
  if (!playerInSlot) return;

  readyPlayers.value.push(playerInSlot);
  gameSlots.value[slotIndex] = null;
}

// Clear dragging state
function clearDragState() {
  draggedPlayer.value = null;
  draggedIndex.value = null;
  draggedFrom.value = null;
}
</script>

<style>
.drag-drop-container {
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.ready-area,
.break-area,
.game-area {
  width: 30%;
}

.area,
.slots {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.box {
  width: 100px;
  height: 50px;
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: grab;
  user-select: none;
}

.break-area .box {
  background-color: #dc3545;
}

.slot {
  width: 100px;
  height: 50px;
  background-color: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #ccc;
  border-radius: 5px;
}

.slot .box {
  background-color: #28a745;
}

.highlight {
  background-color: #ffeeba;
}

.ready-area,
.break-area {
  padding: 10px;
  border: 2px dashed #ccc;
  border-radius: 5px;
}

.ready-area.highlight {
  background-color: #d1ecf1;
}

.break-area.highlight {
  background-color: #f8d7da;
}
</style>
