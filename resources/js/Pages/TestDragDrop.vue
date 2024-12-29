<template>
  <div class="drag-drop-container">
    <!-- Game Area -->
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
          :data-id="'player-' + player.id"
          class="box"
          draggable="true"
          @dragstart="dragStart(player, index, 'ready')"
          @dragend="dragEnd($event)"
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

    <!-- Playing Area -->
    <div
      class="playing-area"
      :class="{ highlight: isHoveringOverPlaying }"
      @dragover.prevent
      @dragenter="hoverPlayingArea(true, $event)"
      @dragleave="hoverPlayingArea(false, $event)"
      @drop="dropToPlayingArea"
    >
      <h3>Playing Area ({{ playingPlayers.length }})</h3>
      <div class="area">
        <div
          v-for="(player, index) in playingPlayers"
          :key="player.id"
          class="box"
          draggable="true"
          @dragstart="dragStart(player, index, 'playing')"
          @dblclick="addPlayerToFirstAvailableSlot(player, 'playing', index)"
        >
          {{ player.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// Players in each area
const readyPlayers = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    label: `Player ${i + 1}`,
    origin: "ready",
  }))
);
const breakPlayers = ref([]);
const playingPlayers = ref([]);

// Game slots
const gameSlots = ref([null, null, null, null]);

// Dragging state
const draggedPlayer = ref(null);
const draggedIndex = ref(null);
const draggedFrom = ref(null);

// Hover states
const isHoveringOverReady = ref(false);
const isHoveringOverBreak = ref(false);
const isHoveringOverPlaying = ref(false);
const hoveredSlot = ref(null);

// Handle drag start
function dragStart(player, index, from) {
  draggedPlayer.value = player;
  draggedIndex.value = index;
  draggedFrom.value = from;

  // Add visual feedback
  const element = document.querySelector(`[data-id='player-${player.id}']`);
  if (element) element.classList.add("dragging");
}

function dragEnd(event) {
  // Remove the dragging class
  const draggedElement = event.target;
  if (draggedElement && draggedElement.classList.contains("dragging")) {
    draggedElement.classList.remove("dragging");
  }

  // Clear dragging state
  clearDragState();
}

// Handle drag hover for areas
function hoverReadyArea(isHovering, event) {
  handleAreaHover(isHovering, event, isHoveringOverReady);
}

function hoverBreakArea(isHovering, event) {
  handleAreaHover(isHovering, event, isHoveringOverBreak);
}

function hoverPlayingArea(isHovering, event) {
  handleAreaHover(isHovering, event, isHoveringOverPlaying);
}

function handleAreaHover(isHovering, event, hoverStateRef) {
  if (!isHovering) {
    const related = event.relatedTarget;
    if (related && event.currentTarget.contains(related)) {
      return;
    }
  }
  hoverStateRef.value = isHovering;
}

// Handle slot hover
function hoverSlot(index) {
  hoveredSlot.value = index;
}

// Handle dropping into game slots
function drop(slotIndex) {
  if (!draggedPlayer.value) return;

  const previousPlayer = gameSlots.value[slotIndex];
  if (draggedFrom.value === "ready") {
    gameSlots.value[slotIndex] = draggedPlayer.value;
    readyPlayers.value.splice(draggedIndex.value, 1);
  } else if (draggedFrom.value === "break") {
    gameSlots.value[slotIndex] = draggedPlayer.value;
    breakPlayers.value.splice(draggedIndex.value, 1);
  } else if (draggedFrom.value === "playing") {
    gameSlots.value[slotIndex] = draggedPlayer.value;
    playingPlayers.value.splice(draggedIndex.value, 1);
  } else if (draggedFrom.value === "slot") {
    gameSlots.value[slotIndex] = draggedPlayer.value;
    gameSlots.value[draggedIndex.value] = previousPlayer;
  }

  if (previousPlayer) {
    if (previousPlayer.origin === "ready") {
      readyPlayers.value.push(previousPlayer);
    } else if (previousPlayer.origin === "break") {
      breakPlayers.value.push(previousPlayer);
    } else if (previousPlayer.origin === "playing") {
      playingPlayers.value.push(previousPlayer);
    }
  }

  clearDragState();
  hoverSlot(null);
}

// Handle dropping into specific areas
function dropToReadyArea() {
  handleDropToArea("ready", readyPlayers, isHoveringOverReady);
}

function dropToBreakArea() {
  handleDropToArea("break", breakPlayers, isHoveringOverBreak);
}

function dropToPlayingArea() {
  handleDropToArea("playing", playingPlayers, isHoveringOverPlaying);
}

function handleDropToArea(areaName, areaPlayers, hoverStateRef) {
  if (!draggedPlayer.value) return;

  if (draggedFrom.value === "slot") {
    gameSlots.value[draggedIndex.value] = null;
  } else {
    const fromArea = getAreaByName(draggedFrom.value);
    fromArea.splice(draggedIndex.value, 1);
  }

  areaPlayers.value.push(draggedPlayer.value);
  clearDragState();
  hoverStateRef.value = false;
}

// Helper to get area by name
function getAreaByName(areaName) {
  switch (areaName) {
    case "ready":
      return readyPlayers.value;
    case "break":
      return breakPlayers.value;
    case "playing":
      return playingPlayers.value;
    default:
      return [];
  }
}

// Reset hover states
function resetHoverStates() {
  isHoveringOverReady.value = false;
  isHoveringOverBreak.value = false;
  isHoveringOverPlaying.value = false;
}

// Clear drag state
function clearDragState() {
  // Clear dragging state variables
  draggedPlayer.value = null;
  draggedIndex.value = null;
  draggedFrom.value = null;

  // Remove any lingering dragging classes
  document.querySelectorAll(".dragging").forEach((el) => {
    el.classList.remove("dragging");
  });

  // Reset hover states
  resetHoverStates();
}

// Empty game slots
function emptyGameSlots() {
  gameSlots.value.forEach((player, index) => {
    if (player) {
      getAreaByName(player.origin).push(player);
      gameSlots.value[index] = null;
    }
  });
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
  } else if (fromArea === "playing") {
    playingPlayers.value.splice(index, 1);
  }
}

// Remove player from a game slot and return to their original area
function removePlayerFromSlot(slotIndex) {
  const playerInSlot = gameSlots.value[slotIndex];
  if (!playerInSlot) return;

  // Return player to their original area
  if (playerInSlot.origin === "ready") {
    readyPlayers.value.push(playerInSlot);
  } else if (playerInSlot.origin === "break") {
    breakPlayers.value.push(playerInSlot);
  } else if (playerInSlot.origin === "playing") {
    playingPlayers.value.push(playerInSlot);
  }

  // Clear the slot
  gameSlots.value[slotIndex] = null;
}
</script>

<style>
.drag-drop-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (min-width: 768px) {
  .drag-drop-container {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}

.ready-area,
.break-area,
.playing-area,
.game-area {
  width: 100%;
  border: 2px dashed #ccc;
  border-radius: 5px;
  padding: 10px;
  background-color: #f9f9f9;
}

@media (min-width: 768px) {
  .ready-area,
  .break-area,
  .playing-area,
  .game-area {
    width: 48%;
  }
}

.area,
.slots {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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

.dragging {
  border: 2px solid #ff6347; /* Add a red border */
  opacity: 0.2; /* Make it semi-transparent */
}

.break-area .box {
  background-color: #dc3545;
}

.playing-area .box {
  background-color: #ffc107;
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
