<script setup>
import { ref, reactive } from "vue";

const dropZones = reactive({
  Playing: [], // Start empty
  Ready: [
    { id: 1, title: "Item A" },
    { id: 2, title: "Item B" },
    { id: 3, title: "Item C" },
    { id: 4, title: "Item D" },
  ],
  Break: [
    { id: 5, title: "Item E" },
    { id: 6, title: "Item F" },
    { id: 7, title: "Item G" },
  ],
  Finish: [{ id: 8, title: "Item H" }],
});

const originalZones = reactive({}); // Store original zones for items

const MAX_PLAYING_ITEMS = 4;

const errorMessage = ref("");

const isActionProcessed = ref(false); // Flag to avoid duplicate actions

const draggedItem = ref(null); // Currently dragged item
const hoveredItem = ref(null); // Currently hovered item
const draggedFrom = ref(""); // Tracks the drop zone where the item was dragged from
const dropZoneActive = ref(""); // Tracks the currently active drop zone during drag
const isDragging = ref(false); // Tracks whether dragging is in progress
const dragPosition = reactive({ x: 0, y: 0 }); // Position of the dragging feedback
const dragContent = ref(""); // Stores the text content of the original draggable item
const dragStyles = ref({}); // Stores the styles of the original draggable item
const returnToOriginal = ref(false); // Tracks whether the item should return to its original position
const originalPosition = reactive({ x: 0, y: 0 }); // Stores the original position of the dragged item

// check click/tab
let tapCount = 0; // To track the number of taps
let tapTimeout = null; // Timeout for detecting double taps
let lastTouchTime = 0; // To differentiate between touch and click events

const handleClick = (event) => {
  console.log("Clicked!");
};

const handleDoubleClick = (item, currentZone) => {
  if (isActionProcessed.value) return; // Prevent duplicate processing
  isActionProcessed.value = true;

  console.log("Double Clicked!");
  moveItem(item, currentZone);

  // Reset the flag after the action is processed
  setTimeout(() => (isActionProcessed.value = false), 300);
};

const handleMouseUp = (event) => {
  const currentTime = new Date().getTime();
  if (currentTime - lastTouchTime < 300) {
    // Prevent mouse events after touch
    return;
  }
};

const handleTouchStart = (event) => {
  lastTouchTime = new Date().getTime(); // Record touch time
};

const isDoubleTapProcessing = ref(false); // Prevent multiple executions during double-tap

const handleTouchEnd = (item, currentZone) => {
  if (isActionProcessed.value) return; // Prevent duplicate processing
  isActionProcessed.value = true;

  console.log("Double Tap!");
  moveItem(item, currentZone);

  // Reset the flag after the action is processed
  setTimeout(() => (isActionProcessed.value = false), 300);
};

const moveItem = (item, currentZone) => {
  const fromZone = dropZones[currentZone];
  const playingZone = dropZones["Playing"];

  if (currentZone === "Playing") {
    // Return to original zone
    const originalZone = originalZones[item.id];
    if (originalZone) {
      fromZone.splice(fromZone.indexOf(item), 1);
      dropZones[originalZone].push(item);
      console.log(`Moved item ${item.title} back to ${originalZone}`);
    }
  } else {
    // Check if the Playing drop zone has reached its limit
    if (playingZone.length >= MAX_PLAYING_ITEMS) {
      alert("The Playing zone can only hold up to 4 items.");
      return;
    }

    // Store the original zone if not already stored
    if (!originalZones[item.id]) {
      originalZones[item.id] = currentZone;
    }

    fromZone.splice(fromZone.indexOf(item), 1);
    playingZone.push(item);
    console.log(`Moved item ${item.title} to Playing zone`);
  }
};

const releaseAllItems = () => {
  const playingZone = dropZones["Playing"];
  playingZone.forEach((item) => {
    const originalZone = originalZones[item.id];
    if (originalZone) {
      dropZones[originalZone].push(item); // Move the item back to its original zone
    }
  });

  // Clear the Playing drop zone
  playingZone.splice(0, playingZone.length);

  console.log("All items released back to their original zones");
};

// check click/tab

// Handles the start of drag (PC: mousedown, Mobile: touchstart)
const handleDragStart = (event, item, zone) => {
  if (event.target.closest(".add-button")) {
    // Prevent drag when clicking the Add Button
    return;
  }

  const originalElement = event.currentTarget; // Use the entire container
  const rect = originalElement.getBoundingClientRect();

  // Store the original position and styles
  originalPosition.x = rect.left;
  originalPosition.y = rect.top;

  dragStyles.value = {
    width: `${originalElement.offsetWidth}px`,
    height: `${originalElement.offsetHeight}px`,
    backgroundColor: getComputedStyle(originalElement).backgroundColor,
    color: getComputedStyle(originalElement).color,
    border: getComputedStyle(originalElement).border,
    borderRadius: getComputedStyle(originalElement).borderRadius,
  };

  dragContent.value = item.title; // Set content to item title
  draggedItem.value = item;
  draggedFrom.value = zone;
  isDragging.value = true;

  // Only set the original zone if it has not been set
  if (!originalZones[item.id]) {
    originalZones[item.id] = zone; // Store original zone
    console.log(`Set original zone for item ${item.title}: ${zone}`);
  }

  updateDragPosition(event);

  // Add listeners for drag move and end
  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchmove", handleDragMove, { passive: false });
  document.addEventListener("touchend", handleDragEnd);
};

// Handles the drag move (PC: mousemove, Mobile: touchmove)
const handleDragMove = (event) => {
  if (!isDragging.value) return;

  event.preventDefault(); // Prevent default scrolling on touch devices
  updateDragPosition(event);

  let clientX, clientY;

  if (event.touches) {
    const touch = event.touches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const element = document.elementFromPoint(clientX, clientY);

  // Detect hovered drop zone
  const zone = Object.keys(dropZones).find((key) =>
    element?.closest(`[data-zone="${key}"]`)
  );
  dropZoneActive.value = zone || "";

  // Detect hovered item, excluding the dragged item
  const itemElement = element?.closest(".draggable-item");
  if (itemElement) {
    const itemId = Number(itemElement.dataset.id);

    if (draggedItem.value?.id !== itemId) {
      const allItems = Object.values(dropZones).flat();
      const newHoveredItem = allItems.find((item) => item.id === itemId);

      // Log only if the hovered item changes
      if (hoveredItem.value?.id !== newHoveredItem?.id) {
        hoveredItem.value = newHoveredItem;

        // Find the zones for dragged and hovered items
        const draggedZone = Object.keys(dropZones).find((key) =>
          dropZones[key].some((item) => item.id === draggedItem.value?.id)
        );

        const hoveredZone = Object.keys(dropZones).find((key) =>
          dropZones[key].some((item) => item.id === newHoveredItem?.id)
        );

        console.log("Dragged Item:", draggedItem.value, "in zone:", draggedZone);
        console.log("Hovered Item:", hoveredItem.value, "in zone:", hoveredZone);
      }
    } else {
      hoveredItem.value = null;
    }
  } else {
    hoveredItem.value = null;
  }
};

// Handles the end of drag (PC: mouseup, Mobile: touchend)
const handleDragEnd = () => {
  if (!draggedItem.value) return;

  const fromZone = dropZones[draggedFrom.value];
  const toZone = dropZoneActive.value ? dropZones[dropZoneActive.value] : null;

  // Ensure both fromZone and toZone are valid
  if (!fromZone || !toZone) {
    resetDragState();
    return;
  }

  // Locate indices of dragged and hovered items
  const draggedIndex = fromZone.findIndex((item) => item.id === draggedItem.value.id);
  const hoveredIndex = hoveredItem.value
    ? toZone.findIndex((item) => item.id === hoveredItem.value.id)
    : -1;

  if (draggedIndex > -1) {
    if (draggedFrom.value === dropZoneActive.value) {
      // Case 1: Reordering within the same zone
      if (hoveredIndex > -1) {
        // Swap items within the same zone
        const temp = fromZone[draggedIndex];
        fromZone[draggedIndex] = fromZone[hoveredIndex];
        fromZone[hoveredIndex] = temp;

        console.log(
          `Swapped ${draggedItem.value.title} with ${hoveredItem.value.title} within ${draggedFrom.value}`
        );
      } else {
        // Move to the end if not hovered over an item
        const [removedDraggedItem] = fromZone.splice(draggedIndex, 1);
        fromZone.push(removedDraggedItem);

        console.log(
          `Moved ${draggedItem.value.title} to the end of ${draggedFrom.value}`
        );
      }
    } else {
      // Case 2: Moving to a different drop zone
      if (hoveredIndex > -1) {
        // Swap items between zones
        const [removedDraggedItem] = fromZone.splice(draggedIndex, 1);
        const [removedHoveredItem] = toZone.splice(hoveredIndex, 1, removedDraggedItem);
        fromZone.splice(draggedIndex, 0, removedHoveredItem); // Place the hovered item back to the dragged item's original position

        console.log(
          `Swapped ${draggedItem.value.title} from ${draggedFrom.value} with ${hoveredItem.value.title} in ${dropZoneActive.value}`
        );
      } else {
        // Move to the new zone if not hovered over an item

        // Capacity check for Playing zone
        if (
          dropZoneActive.value === "Playing" &&
          dropZones["Playing"].length >= MAX_PLAYING_ITEMS
        ) {
          alert("The Playing zone is full. Cannot add more items.");
          resetDragState();
          return; // Prevent adding the item
        }

        const [removedItem] = fromZone.splice(draggedIndex, 1);
        toZone.push(removedItem);

        console.log(
          `Moved ${draggedItem.value.title} from ${draggedFrom.value} to ${dropZoneActive.value}`
        );
      }
    }
  }

  resetDragState();
};

// Resets drag state
const resetDragState = () => {
  isDragging.value = false;
  draggedItem.value = null;
  draggedFrom.value = "";
  dropZoneActive.value = "";
  dragContent.value = "";
  hoveredItem.value = null;
  returnToOriginal.value = false;

  // Remove global listeners
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
</script>

<template>
  <div class="p-fluid grid grid-nogutter justify-content-center gap-4">
    <!-- Playing Zone -->
    {{ errorMessage }}
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
      <div class="playing-items-grid">
        <div
          v-for="item in dropZones.Playing"
          :key="item.id"
          class="draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"
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
            :src="`https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`"
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
      <div class="flex flex-wrap gap-3">
        <div
          v-for="item in dropZones.Ready"
          :key="item.id"
          class="draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"
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
            :src="`https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`"
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
      <div class="flex flex-wrap gap-3">
        <div
          v-for="item in dropZones.Break"
          :key="item.id"
          class="draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"
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
            :src="`https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`"
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
      <div class="flex flex-wrap gap-3">
        <div
          v-for="item in dropZones.Finish"
          :key="item.id"
          class="draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"
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
            :src="`https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`"
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
      :src="`https://api.dicebear.com/6.x/adventurer/svg?seed=${dragContent}`"
      alt="Dragging Avatar"
      class="avatar drag-avatar"
    />
    <span class="text-center font-medium">{{ dragContent }}</span>
  </div>
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
