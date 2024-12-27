<template>
  <div class="drag-drop-container">
    <!-- Ready Area -->
    <div
      class="ready-area"
      :class="{ highlight: isHoveringOverReady }"
      @dragover.prevent
      @dragenter="hoverReadyArea(true)"
      @dragleave="hoverReadyArea(false)"
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

// Slots in the game area (initially empty)
const gameSlots = ref([null, null, null, null]);

// Dragging state
const draggedPlayer = ref(null);
const draggedIndex = ref(null);
const draggedFrom = ref(null);

// Hover states
const hoveredSlot = ref(null);
const isHoveringOverReady = ref(false);

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
function hoverReadyArea(isHovering) {
  isHoveringOverReady.value = isHovering;
  console.log(isHoveringOverReady.value);
}

// Handle drop into game slots
function drop(slotIndex) {
  if (!draggedPlayer.value) return;

  // If dragging from the ready area
  if (draggedFrom.value === "ready") {
    const previousPlayer = gameSlots.value[slotIndex];
    gameSlots.value[slotIndex] = draggedPlayer.value;
    readyPlayers.value.splice(draggedIndex.value, 1);

    // Move existing player back to the ready area if the slot was occupied
    if (previousPlayer) {
      readyPlayers.value.push(previousPlayer);
    }
  } else if (draggedFrom.value === "slot") {
    // Swap players if dragging from another slot
    const previousPlayer = gameSlots.value[slotIndex];
    gameSlots.value[slotIndex] = draggedPlayer.value;
    gameSlots.value[draggedIndex.value] = previousPlayer;
  }

  // Clear dragging state
  clearDragState();
  hoverSlot(null);
}

// Handle drop back to the ready area
function dropToReadyArea() {
  if (!draggedPlayer.value || draggedFrom.value !== "slot") return;

  readyPlayers.value.push(draggedPlayer.value);
  gameSlots.value[draggedIndex.value] = null;

  // Clear dragging state
  clearDragState();
  hoverReadyArea(false);
}

// Add player to the first available slot via double-click
function addPlayerToFirstAvailableSlot(readyIndex) {
  const firstEmptySlotIndex = gameSlots.value.findIndex((slot) => !slot);
  if (firstEmptySlotIndex === -1) {
    alert("All slots are full.");
    return;
  }

  // Add the player to the first available slot
  gameSlots.value[firstEmptySlotIndex] = readyPlayers.value[readyIndex];
  readyPlayers.value.splice(readyIndex, 1);
}

// Remove player from slot via double-click
function removePlayerFromSlot(slotIndex) {
  const playerInSlot = gameSlots.value[slotIndex];
  if (!playerInSlot) return;

  // Move the player back to the ready area and clear the slot
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
.game-area {
  width: 45%;
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
  background-color: #007bff; /* Blue background for ready area boxes */
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  cursor: grab;
  user-select: none;
}

.ready-area .box {
  background-color: #007bff; /* Ensures boxes in the ready area have a blue background */
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
  cursor: grab;
}

.highlight {
  background-color: #ffeeba;
}

.ready-area {
  padding: 10px;
  border: 2px dashed #ccc;
  border-radius: 5px;
}

.ready-area.highlight {
  background-color: #d1ecf1;
}
</style>
