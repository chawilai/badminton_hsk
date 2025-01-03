import { ref, reactive } from "vue";

export function useDragDrop() {
  const dropZones = reactive({
    Playing: [{ id: 1, title: "Item A" }],
    Ready: [{ id: 2, title: "Item B" }, { id: 3, title: "Item C" }],
    Break: [{ id: 4, title: "Item D" }],
    Finish: [],
  });

  const draggedItem = ref(null);
  const draggedFrom = ref("");
  const dropZoneActive = ref("");
  const isDragging = ref(false);
  const hoveredItem = ref(null); // Tracks the hovered item

  const handleDragStart = (event, item, zone) => {
    draggedItem.value = item;
    draggedFrom.value = zone;
    isDragging.value = true;
    if (event.type === "touchstart") {
      event.preventDefault();
    }
  };

  const handleDragOver = (event, zone) => {
    if (!isDragging.value) return;
    dropZoneActive.value = zone;
    if (["touchmove", "dragover"].includes(event.type)) {
      event.preventDefault();
    }
  };

  const handleItemHover = (item) => {
    hoveredItem.value = item;
    console.log("Hovered item:", item);
  };

  const handleItemLeave = () => {
    hoveredItem.value = null;
  };

  const handleDrop = () => {
    if (!draggedItem.value || !dropZoneActive.value) return;

    const fromZone = dropZones[draggedFrom.value];
    const itemIndex = fromZone.findIndex((i) => i.id === draggedItem.value.id);
    if (itemIndex > -1) {
      fromZone.splice(itemIndex, 1);
    }

    const toZone = dropZones[dropZoneActive.value];
    toZone.push(draggedItem.value);

    resetDragState();
  };

  const resetDragState = () => {
    draggedItem.value = null;
    draggedFrom.value = "";
    dropZoneActive.value = "";
    isDragging.value = false;
    hoveredItem.value = null;
  };

  return {
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
  };
}
