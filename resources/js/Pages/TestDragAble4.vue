<script setup>
import { ref, reactive } from "vue";

const dropZones = reactive({
  Playing: [], // Start empty
  Ready: [
    { id: 1, title: "Item A" },
    { id: 2, title: "Item B" },
    { id: 3, title: "Item C" },
  ],
  Break: [
    { id: 4, title: "Item D" },
    { id: 5, title: "Item E" },
    { id: 6, title: "Item F" },
  ],
  Finish: [{ id: 7, title: "Item G" }],
});

const originalZones = reactive({}); // Store original zones for items

const MAX_PLAYING_ITEMS = 4;

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
  moveItem(item, currentZone);
};

const handleMouseUp = (event) => {
  const currentTime = new Date().getTime();
  if (currentTime - lastTouchTime < 300) {
    // Prevent mouse events after touch
    return;
  }
  console.log("Mouse Up!");
};

const handleTouchStart = (event) => {
  lastTouchTime = new Date().getTime(); // Record touch time
};

const handleTouchEnd = (item, currentZone) => {
  tapCount++;
  if (tapCount === 1) {
    tapTimeout = setTimeout(() => {
      tapCount = 0; // Reset after single tap
    }, 300); // Timeout for detecting double tap
  } else if (tapCount === 2) {
    clearTimeout(tapTimeout);
    moveItem(item, currentZone);
    tapCount = 0; // Reset after double tap
  }
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
      return; // Prevent adding more items
    }

    // Move to Playing zone
    if (!originalZones[item.id]) {
      originalZones[item.id] = currentZone; // Store original zone
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
  const originalElement = event.target;
  const rect = originalElement.getBoundingClientRect();

  // Store the original position of the item
  originalPosition.x = rect.left;
  originalPosition.y = rect.top;

  // Clone the original element's computed styles
  const computedStyles = window.getComputedStyle(originalElement);
  dragStyles.value = {
    width: `${originalElement.offsetWidth}px`,
    height: `${originalElement.offsetHeight}px`,
    backgroundColor: computedStyles.backgroundColor,
    color: computedStyles.color,
    border: computedStyles.border,
    padding: computedStyles.padding,
    borderRadius: computedStyles.borderRadius,
    fontSize: computedStyles.fontSize,
    textAlign: computedStyles.textAlign,
    lineHeight: computedStyles.lineHeight,
    whiteSpace: computedStyles.whiteSpace || "normal",
    overflow: computedStyles.overflow || "visible",
    display: computedStyles.display,
    position: "fixed",
  };

  // Clone the text content of the original element
  dragContent.value = originalElement.textContent;

  draggedItem.value = item;
  draggedFrom.value = zone;
  isDragging.value = true;

  updateDragPosition(event);

  // Add global listeners for mouse and touch movement and release
  document.addEventListener("mousemove", handleDragMove);
  document.addEventListener("mouseup", handleDragEnd);
  document.addEventListener("touchmove", handleDragMove, { passive: false });
  document.addEventListener("touchend", handleDragEnd);

  // Prevent default scrolling on touch devices
  if (event.type === "touchstart") {
    event.preventDefault();
  }
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
        console.log("Dragged Item:", draggedItem.value);
        console.log("Hovered Item:", hoveredItem.value);
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
    // Case 1: Reordering within the same drop zone
    if (draggedFrom.value === dropZoneActive.value) {
      const [removedDraggedItem] = fromZone.splice(draggedIndex, 1);
      fromZone.push(removedDraggedItem); // Move dragged item to the end of the same zone

      console.log(`Reordered ${draggedItem.value.title} within ${draggedFrom.value}`);
    } else if (hoveredIndex > -1) {
      // Case 2: Swap within different zones
      const [removedDraggedItem] = fromZone.splice(draggedIndex, 1);

      // Step 1: Adjust hovered index for same-zone swaps if dragging to a later index
      const adjustedHoveredIndex =
        draggedFrom.value === dropZoneActive.value && hoveredIndex > draggedIndex
          ? hoveredIndex - 1
          : hoveredIndex;

      // Step 2: Replace hovered item with dragged item in the target zone
      const [removedHoveredItem] = toZone.splice(
        adjustedHoveredIndex,
        1,
        removedDraggedItem
      );

      // Step 3: Add hovered item to the original position in the original zone
      fromZone.splice(draggedIndex, 0, removedHoveredItem);

      console.log(
        `Swapped ${draggedItem.value.title} with ${hoveredItem.value.title} between ${draggedFrom.value} and ${dropZoneActive.value}`
      );
    } else {
      // Case 3: Prevent adding more items to the Playing drop zone if it's full
      if (
        dropZoneActive.value === "Playing" &&
        dropZones["Playing"].length >= MAX_PLAYING_ITEMS
      ) {
        alert("The Playing zone is full. Cannot add more items.");
        resetDragState();
        return;
      }

      // Case 4: Move to a new position in the same or different zone without swapping
      const [removedItem] = fromZone.splice(draggedIndex, 1);
      toZone.push(removedItem);

      // Store original zone if moving to a different zone
      if (fromZone !== toZone && !originalZones[removedItem.id]) {
        originalZones[removedItem.id] = draggedFrom.value;
      }

      console.log(
        `Moved ${draggedItem.value.title} from ${draggedFrom.value} to ${dropZoneActive.value}`
      );
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
  <div class="p-fluid grid grid-nogutter justify-content-center gap-2">
    <!-- Playing Zone -->
    <div
      class="col-12 md:col-6 drop-zone-playing p-card flex flex-column gap-3"
      data-zone="Playing"
      :class="{ 'drop-zone-active': dropZoneActive === 'Playing' }"
    >
      <div class="flex align-items-center justify-content-between">
        <h3 class="text-lg font-bold text-primary">Playing</h3>
        <button
          @click="releaseAllItems"
          class="w-8rem p-button p-button-danger p-button-sm"
        >
          <i class="pi pi-refresh"></i>
          <span class="ml-2">Release All</span>
        </button>
      </div>
      <div class="flex flex-wrap gap-3 justify-content-start">
        <div
          v-for="item in dropZones.Playing"
          :key="item.id"
          class="draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"
          :class="{ 'hovered-item': hoveredItem?.id === item.id }"
          :data-id="item.id"
          @mousedown.prevent="handleDragStart($event, item, 'Playing')"
          @touchstart.prevent="handleDragStart($event, item, 'Playing')"
        >
          <button
            @mousedown.stop
            @mouseup.stop="handleMouseUp"
            @touchstart.stop="handleTouchStart"
            @touchend.stop="handleTouchEnd(item, 'Playing')"
            @dblclick.stop="handleDoubleClick(item, 'Playing')"
            class="add-button"
          >
            <i class="pi pi-plus"></i>
          </button>
          <img
            :src="`https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`"
            alt="Avatar"
            class="avatar"
          />
          <span class="text-center font-medium">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <!-- Ready Zone -->
    <div
      class="col-12 md:col-3 drop-zone-ready p-card flex flex-column gap-3"
      data-zone="Ready"
      :class="{ 'drop-zone-active': dropZoneActive === 'Ready' }"
    >
      <h3 class="text-lg font-bold text-primary">Ready</h3>
      <div class="flex flex-wrap gap-3 justify-content-start">
        <div
          v-for="item in dropZones.Ready"
          :key="item.id"
          class="draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"
          :class="{ 'hovered-item': hoveredItem?.id === item.id }"
          :data-id="item.id"
          @mousedown.prevent="handleDragStart($event, item, 'Ready')"
          @touchstart.prevent="handleDragStart($event, item, 'Ready')"
        >
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
          <img
            :src="`https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`"
            alt="Avatar"
            class="avatar"
          />
          <span class="text-center font-medium">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <!-- Break Zone -->
    <div
      class="col-12 md:col-3 drop-zone-break p-card flex flex-column gap-3"
      data-zone="Break"
      :class="{ 'drop-zone-active': dropZoneActive === 'Break' }"
    >
      <h3 class="text-lg font-bold text-primary">Break</h3>
      <div class="flex flex-wrap gap-3 justify-content-start">
        <div
          v-for="item in dropZones.Break"
          :key="item.id"
          class="draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"
          :class="{ 'hovered-item': hoveredItem?.id === item.id }"
          :data-id="item.id"
          @mousedown.prevent="handleDragStart($event, item, 'Break')"
          @touchstart.prevent="handleDragStart($event, item, 'Break')"
        >
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
          <img
            :src="`https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`"
            alt="Avatar"
            class="avatar"
          />
          <span class="text-center font-medium">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <!-- Finish Zone -->
    <div
      class="col-12 md:col-3 drop-zone-finish p-card flex flex-column gap-3"
      data-zone="Finish"
      :class="{ 'drop-zone-active': dropZoneActive === 'Finish' }"
    >
      <h3 class="text-lg font-bold text-primary">Finish</h3>
      <div class="flex flex-wrap gap-3 justify-content-start">
        <div
          v-for="item in dropZones.Finish"
          :key="item.id"
          class="draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"
          :class="{ 'hovered-item': hoveredItem?.id === item.id }"
          :data-id="item.id"
          @mousedown.prevent="handleDragStart($event, item, 'Finish')"
          @touchstart.prevent="handleDragStart($event, item, 'Finish')"
        >
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
          <img
            :src="`https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`"
            alt="Avatar"
            class="avatar"
          />
          <span class="text-center font-medium">{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-zone-playing {
  border: 2px dashed var(--surface-border);
  background-color: var(--green-50);
}

.drop-zone-ready {
  border: 2px dashed var(--surface-border);
  background-color: var(--blue-50);
}

.drop-zone-break {
  border: 2px dashed var(--surface-border);
  background-color: var(--yellow-50);
}

.drop-zone-finish {
  border: 2px dashed var(--surface-border);
  background-color: var(--purple-50);
}

/* Common Styles */
.draggable-item {
  width: calc(33.33% - 12px);
  border: 1px solid var(--surface-border);
  background-color: var(--surface-a);
  border-radius: 6px;
  cursor: grab;
}
</style>
