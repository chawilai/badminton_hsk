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
      <h3>Ready Area ({{ readyPlayers.length }})</h3>
      <div class="area">
        <div
          v-for="(player, index) in readyPlayers"
          :key="player.id"
          class="box"
          draggable="true"
          @dragstart="dragStart(player, index, 'ready')"
          @dblclick="addPlayerToFirstAvailableSlot(player, 'ready', index)"
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
      <h3>Break Area ({{ breakPlayers.length }})</h3>
      <div class="area">
        <div
          v-for="(player, index) in breakPlayers"
          :key="player.id"
          class="box"
          draggable="true"
          @dragstart="dragStart(player, index, 'break')"
          @dblclick="addPlayerToFirstAvailableSlot(player, 'break', index)"
        >
          {{ player.label }}
        </div>
      </div>
    </div>

    <!-- Game Slots -->
    <div class="game-area">
      <h3>
        Game Slots ({{ gameSlots.filter((slot) => slot !== null).length }}/
        {{ gameSlots.length }})
        <button @click="emptyGameSlots" class="empty-button">Empty Game</button>
      </h3>
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
    origin: "ready", // Track the origin for returning players
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

// Add player to the first available game slot
function addPlayerToFirstAvailableSlot(player, fromArea, index) {
  const firstEmptySlotIndex = gameSlots.value.findIndex((slot) => !slot);
  if (firstEmptySlotIndex === -1) {
    alert("All game slots are full.");
    return;
  }

  // Add player to the first empty slot
  gameSlots.value[firstEmptySlotIndex] = { ...player, origin: fromArea };

  // Remove player from the original area
  if (fromArea === "ready") {
    readyPlayers.value.splice(index, 1);
  } else if (fromArea === "break") {
    breakPlayers.value.splice(index, 1);
  }
}

// Remove player from a game slot and return to the original area
function removePlayerFromSlot(slotIndex) {
  const playerInSlot = gameSlots.value[slotIndex];
  if (!playerInSlot) return;

  if (playerInSlot.origin === "ready") {
    readyPlayers.value.push(playerInSlot);
  } else if (playerInSlot.origin === "break") {
    breakPlayers.value.push(playerInSlot);
  }

  // Clear the slot
  gameSlots.value[slotIndex] = null;
}

// Handle drop into game slots
function drop(slotIndex) {
  if (!draggedPlayer.value) return;

  const previousPlayer = gameSlots.value[slotIndex];
  if (draggedFrom.value === "ready") {
    gameSlots.value[slotIndex] = draggedPlayer.value;
    readyPlayers.value.splice(draggedIndex.value, 1);
  } else if (draggedFrom.value === "break") {
    gameSlots.value[slotIndex] = draggedPlayer.value;
    breakPlayers.value.splice(draggedIndex.value, 1);
  } else if (draggedFrom.value === "slot") {
    gameSlots.value[slotIndex] = draggedPlayer.value;
    gameSlots.value[draggedIndex.value] = previousPlayer;
  }

  if (previousPlayer) {
    if (previousPlayer.origin === "ready") {
      readyPlayers.value.push(previousPlayer);
    } else if (previousPlayer.origin === "break") {
      breakPlayers.value.push(previousPlayer);
    }
  }

  clearDragState();
  hoverSlot(null);
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

// Empty all game slots and return players to their original areas
function emptyGameSlots() {
  gameSlots.value.forEach((player, index) => {
    if (player) {
      if (player.origin === "ready") {
        readyPlayers.value.push(player);
      } else if (player.origin === "break") {
        breakPlayers.value.push(player);
      }
      gameSlots.value[index] = null;
    }
  });
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

.empty-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.empty-button:hover {
  background-color: #c82333;
}
</style>
