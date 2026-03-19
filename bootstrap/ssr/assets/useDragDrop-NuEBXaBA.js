import { reactive, ref } from "vue";
import { u as useToast } from "./useToast-DyaFeJ92.js";
function useDragDrop() {
  const toast = useToast();
  const dropZones = reactive({
    Game: [],
    // Legacy — kept for compatibility
    Team1: [],
    Team2: [],
    Ready: [],
    Playing: [],
    Listing: [],
    Break: [
      // {
      //     id: 5,
      //     title: "Item E",
      //     avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Item E",
      // },
      // {
      //     id: 6,
      //     title: "Item F",
      //     avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Item F",
      // },
      // {
      //     id: 7,
      //     title: "Item G",
      //     avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Item G",
      // },
    ],
    Finish: [
      // {
      //     id: 8,
      //     title: "Item H",
      //     avatar: "https://api.dicebear.com/6.x/adventurer/svg?seed=Item H",
      // },
    ]
  });
  const originalZones = reactive({});
  const MAX_PLAYING_ITEMS = 4;
  const MAX_TEAM_ITEMS = 2;
  const TEAM_ZONES = ["Team1", "Team2"];
  const isActionProcessed = ref(false);
  const draggedItem = ref(null);
  const hoveredItem = ref(null);
  const draggedFrom = ref("");
  const dropZoneActive = ref("");
  const isDragging = ref(false);
  const dragPosition = reactive({ x: 0, y: 0 });
  const dragContent = ref("");
  const dragStyles = ref({});
  const returnToOriginal = ref(false);
  const originalPosition = reactive({ x: 0, y: 0 });
  let tapCount = 0;
  let tapTimeout = null;
  let lastTouchTime = 0;
  const handleClick = (item, currentZone) => {
  };
  const handleDoubleClick = (item, currentZone) => {
    if (isActionProcessed.value) return;
    isActionProcessed.value = true;
    moveItem(item, currentZone);
    setTimeout(() => isActionProcessed.value = false, 300);
  };
  const handleMouseUp = (event) => {
    const currentTime = (/* @__PURE__ */ new Date()).getTime();
    if (currentTime - lastTouchTime < 300) {
      return;
    }
  };
  const handleTouchStart = (event) => {
    lastTouchTime = (/* @__PURE__ */ new Date()).getTime();
  };
  const isDoubleTapProcessing = ref(false);
  const handleTouchEnd = (item, currentZone) => {
    if (isActionProcessed.value) return;
    isActionProcessed.value = true;
    moveItem(item, currentZone);
    setTimeout(() => isActionProcessed.value = false, 300);
  };
  const isInTeam = (itemId) => {
    return dropZones.Team1.some((p) => p.id === itemId) || dropZones.Team2.some((p) => p.id === itemId);
  };
  const totalTeamPlayers = () => dropZones.Team1.length + dropZones.Team2.length;
  const moveItem = (item, currentZone) => {
    const fromZone = dropZones[currentZone];
    if (TEAM_ZONES.includes(currentZone)) {
      const originalZone = originalZones[item.id];
      if (originalZone) {
        const isAlreadyThere = dropZones[originalZone].some((p) => p.id === item.id);
        if (isAlreadyThere) return;
        fromZone.splice(fromZone.indexOf(item), 1);
        dropZones[originalZone].push(item);
        toast.add({
          severity: "warn",
          summary: "ลบผู้เล่น",
          detail: `ลบ ${item.title} กลับไปยัง ${originalZone} แล้ว`,
          life: 1500
        });
      }
    } else if (currentZone === "Game") {
      const originalZone = originalZones[item.id];
      if (originalZone) {
        fromZone.splice(fromZone.indexOf(item), 1);
        dropZones[originalZone].push(item);
      }
    } else {
      if (totalTeamPlayers() >= MAX_PLAYING_ITEMS) {
        toast.add({
          severity: "error",
          summary: "เพิ่มผู้เล่นล้มเหลว",
          detail: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
          life: 1500
        });
        return;
      }
      if (isInTeam(item.id)) return;
      if (!originalZones[item.id]) {
        originalZones[item.id] = currentZone;
      }
      const targetTeam = dropZones.Team1.length <= dropZones.Team2.length ? "Team1" : "Team2";
      fromZone.splice(fromZone.indexOf(item), 1);
      dropZones[targetTeam].push(item);
      toast.add({
        severity: "info",
        summary: "เพิ่มผู้เล่น",
        detail: `เพิ่ม ${item.title} เข้า ${targetTeam} แล้ว`,
        life: 1500
      });
    }
    isActionProcessed.value = false;
  };
  const releaseAllItems = () => {
    for (const teamZone of TEAM_ZONES) {
      dropZones[teamZone].forEach((item) => {
        const originalZone = originalZones[item.id];
        if (originalZone) {
          dropZones[originalZone].push(item);
        }
      });
      dropZones[teamZone].splice(0, dropZones[teamZone].length);
    }
    dropZones.Game.forEach((item) => {
      const originalZone = originalZones[item.id];
      if (originalZone) {
        dropZones[originalZone].push(item);
      }
    });
    dropZones.Game.splice(0, dropZones.Game.length);
    toast.add({
      severity: "contrast",
      summary: "ล้างตารางเกม",
      detail: `ลบผู้เล่นทั้งหมดออกจากตารางเกม แล้ว`,
      life: 1500
    });
  };
  const handleDragStart = (event, item, zone) => {
    if (event.target.closest(".add-button")) {
      return;
    }
    const originalElement = event.currentTarget;
    const rect = originalElement.getBoundingClientRect();
    originalPosition.x = rect.left;
    originalPosition.y = rect.top;
    dragStyles.value = {
      width: `${originalElement.offsetWidth}px`,
      height: `${originalElement.offsetHeight}px`,
      backgroundColor: getComputedStyle(originalElement).backgroundColor,
      color: getComputedStyle(originalElement).color,
      border: getComputedStyle(originalElement).border,
      borderRadius: getComputedStyle(originalElement).borderRadius
    };
    dragContent.value = item.title;
    draggedItem.value = item;
    draggedFrom.value = zone;
    isDragging.value = true;
    if (!originalZones[item.id]) {
      originalZones[item.id] = zone;
    }
    updateDragPosition(event);
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDragMove, {
      passive: false
    });
    document.addEventListener("touchend", handleDragEnd);
  };
  const handleDragMove = (event) => {
    var _a, _b;
    if (!isDragging.value) return;
    event.preventDefault();
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
    const zone = Object.keys(dropZones).find(
      (key) => element == null ? void 0 : element.closest(`[data-zone="${key}"]`)
    );
    dropZoneActive.value = zone || "";
    const itemElement = element == null ? void 0 : element.closest(".player-card, .draggable-item");
    if (itemElement) {
      const itemId = Number(itemElement.dataset.id);
      if (((_a = draggedItem.value) == null ? void 0 : _a.id) !== itemId) {
        const allItems = Object.values(dropZones).flat();
        const newHoveredItem = allItems.find(
          (item) => item.id === itemId
        );
        if (((_b = hoveredItem.value) == null ? void 0 : _b.id) !== (newHoveredItem == null ? void 0 : newHoveredItem.id)) {
          hoveredItem.value = newHoveredItem;
          Object.keys(dropZones).find(
            (key) => dropZones[key].some(
              (item) => {
                var _a2;
                return item.id === ((_a2 = draggedItem.value) == null ? void 0 : _a2.id);
              }
            )
          );
          Object.keys(dropZones).find(
            (key) => dropZones[key].some(
              (item) => item.id === (newHoveredItem == null ? void 0 : newHoveredItem.id)
            )
          );
        }
      } else {
        hoveredItem.value = null;
      }
    } else {
      hoveredItem.value = null;
    }
  };
  const handleDragEnd = () => {
    if (!draggedItem.value) return;
    const fromZone = dropZones[draggedFrom.value];
    const toZone = dropZoneActive.value ? dropZones[dropZoneActive.value] : null;
    if (!fromZone || !toZone) {
      resetDragState();
      return;
    }
    const draggedIndex = fromZone.findIndex(
      (item) => item.id === draggedItem.value.id
    );
    const hoveredIndex = hoveredItem.value ? toZone.findIndex((item) => item.id === hoveredItem.value.id) : -1;
    if (draggedIndex > -1) {
      if (draggedFrom.value === dropZoneActive.value) {
        if (hoveredIndex > -1) {
          const temp = fromZone[draggedIndex];
          fromZone[draggedIndex] = fromZone[hoveredIndex];
          fromZone[hoveredIndex] = temp;
          toast.add({
            severity: "info",
            summary: "สลับผู้เล่น",
            detail: `สลับตำแหน่ง ${draggedItem.value.title} กับ ${hoveredItem.value.title} สำเร็จ`,
            // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
            life: 1500
          });
        }
      } else {
        if (hoveredIndex > -1) {
          const draggedName = draggedItem.value.title;
          const hoveredName = hoveredItem.value.title;
          const [removedDraggedItem] = fromZone.splice(
            draggedIndex,
            1
          );
          const [removedHoveredItem] = toZone.splice(
            hoveredIndex,
            1,
            removedDraggedItem
          );
          fromZone.splice(draggedIndex, 0, removedHoveredItem);
          if (TEAM_ZONES.includes(dropZoneActive.value) && !originalZones[removedDraggedItem.id]) {
            originalZones[removedDraggedItem.id] = draggedFrom.value;
          }
          if (TEAM_ZONES.includes(draggedFrom.value) && !originalZones[removedHoveredItem.id]) {
            originalZones[removedHoveredItem.id] = dropZoneActive.value;
          }
          toast.add({
            severity: "info",
            summary: "สลับผู้เล่น",
            detail: `สลับ ${draggedName} กับ ${hoveredName} สำเร็จ`,
            life: 1500
          });
        } else {
          if (TEAM_ZONES.includes(dropZoneActive.value) && dropZones[dropZoneActive.value].length >= MAX_TEAM_ITEMS) {
            toast.add({
              severity: "error",
              summary: "เพิ่มผู้เล่นล้มเหลว",
              detail: `${dropZoneActive.value} เต็มแล้ว (สูงสุด ${MAX_TEAM_ITEMS} คน)`,
              life: 1500
            });
            resetDragState();
            return;
          }
          if (dropZoneActive.value === "Game" && dropZones["Game"].length >= MAX_PLAYING_ITEMS) {
            toast.add({
              severity: "error",
              summary: "เพิ่มผู้เล่นล้มเหลว",
              detail: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
              life: 1500
            });
            resetDragState();
            return;
          }
          if (["Playing", "Listing"].includes(dropZoneActive.value)) {
            toast.add({
              severity: "error",
              summary: "ย้ายผู้เล่นล้มเหลว",
              detail: "ไม่สามารถย้ายผู้เล่นมา Zone นี้ได้",
              // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
              life: 1500
            });
            resetDragState();
            return;
          }
          const [removedItem] = fromZone.splice(draggedIndex, 1);
          toZone.push(removedItem);
          if (TEAM_ZONES.includes(dropZoneActive.value) && !originalZones[removedItem.id]) {
            originalZones[removedItem.id] = draggedFrom.value;
          }
          toast.add({
            severity: "info",
            summary: "ย้ายผู้เล่น",
            detail: `ย้าย ${draggedItem.value.title} จาก ${draggedFrom.value} ไป ${dropZoneActive.value} สำเร็จ`,
            life: 1500
          });
        }
      }
    }
    resetDragState();
  };
  const resetDragState = () => {
    isDragging.value = false;
    draggedItem.value = null;
    draggedFrom.value = "";
    dropZoneActive.value = "";
    dragContent.value = "";
    hoveredItem.value = null;
    returnToOriginal.value = false;
    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchmove", handleDragMove);
    document.removeEventListener("touchend", handleDragEnd);
  };
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
  const convertWaitingTimeToMinutes = (waitingTimeInSeconds) => {
    return Math.round(waitingTimeInSeconds / 60);
  };
  return {
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
    convertWaitingTimeToMinutes
  };
}
export {
  useDragDrop as u
};
