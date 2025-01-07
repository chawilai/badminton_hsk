import { ref, reactive } from "vue";

import { useToast } from "primevue/usetoast";

export function useDragDrop() {
    const toast = useToast();

    const dropZones = reactive({
        Game: [], // Start empty
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
        ],
    });

    const originalZones = reactive({}); // Store original zones for items

    const MAX_PLAYING_ITEMS = 4;

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
        // console.log("Clicked!");
    };

    const handleDoubleClick = (item, currentZone) => {
        if (isActionProcessed.value) return; // Prevent duplicate processing
        isActionProcessed.value = true;

        // console.log("Double Clicked!");
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

        // console.log("Double Tap!");
        moveItem(item, currentZone);

        // Reset the flag after the action is processed
        setTimeout(() => (isActionProcessed.value = false), 300);
    };

    const moveItem = (item, currentZone) => {
        const fromZone = dropZones[currentZone];
        const playingZone = dropZones["Game"];

        if (currentZone === "Game") {
            // Return to original zone
            const originalZone = originalZones[item.id];
            if (originalZone) {
                fromZone.splice(fromZone.indexOf(item), 1);
                dropZones[originalZone].push(item);
                // console.log(`Moved item ${item.title} back to ${originalZone}`);

                toast.add({
                    severity: "warn",
                    summary: "ลบผู้เล่น",
                    detail: `ลบ ${item.title} กลับไปยัง ${originalZone} แล้ว`,
                    // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                    life: 1500,
                });
            }
        } else {
            // Check if the Game drop zone has reached its limit
            if (playingZone.length >= MAX_PLAYING_ITEMS) {
                toast.add({
                    severity: "error",
                    summary: "เพิ่มผู้เล่นล้มเหลว",
                    detail: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                    // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                    life: 1500,
                });

                return;
            }

            // Store the original zone if not already stored
            if (!originalZones[item.id]) {
                originalZones[item.id] = currentZone;
            }

            fromZone.splice(fromZone.indexOf(item), 1);
            playingZone.push(item);

            toast.add({
                severity: "info",
                summary: "เพิ่มผู้เล่น",
                detail: `เพิ่ม ${item.title} เข้าตารางเกมแล้ว`,
                // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                life: 1500,
            });
        }
    };

    const releaseAllItems = () => {
        const playingZone = dropZones["Game"];
        playingZone.forEach((item) => {
            const originalZone = originalZones[item.id];
            if (originalZone) {
                dropZones[originalZone].push(item); // Move the item back to its original zone
            }
        });

        // Clear the Game drop zone
        playingZone.splice(0, playingZone.length);

        toast.add({
            severity: "contrast",
            summary: "ล้างตารางเกม",
            detail: `ลบผู้เล่นทั้งหมดออกจากตารางเกม แล้ว`,
            // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
            life: 1500,
        });
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
            // console.log(`Set original zone for item ${item.title}: ${zone}`);
        }

        updateDragPosition(event);

        // Add listeners for drag move and end
        document.addEventListener("mousemove", handleDragMove);
        document.addEventListener("mouseup", handleDragEnd);
        document.addEventListener("touchmove", handleDragMove, {
            passive: false,
        });
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
                const newHoveredItem = allItems.find(
                    (item) => item.id === itemId
                );

                // Log only if the hovered item changes
                if (hoveredItem.value?.id !== newHoveredItem?.id) {
                    hoveredItem.value = newHoveredItem;

                    // Find the zones for dragged and hovered items
                    const draggedZone = Object.keys(dropZones).find((key) =>
                        dropZones[key].some(
                            (item) => item.id === draggedItem.value?.id
                        )
                    );

                    const hoveredZone = Object.keys(dropZones).find((key) =>
                        dropZones[key].some(
                            (item) => item.id === newHoveredItem?.id
                        )
                    );

                    // console.log(
                    //     "Dragged Item:",
                    //     draggedItem.value,
                    //     "in zone:",
                    //     draggedZone
                    // );
                    // console.log(
                    //     "Hovered Item:",
                    //     hoveredItem.value,
                    //     "in zone:",
                    //     hoveredZone
                    // );
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
        const toZone = dropZoneActive.value
            ? dropZones[dropZoneActive.value]
            : null;

        // Ensure both fromZone and toZone are valid
        if (!fromZone || !toZone) {
            resetDragState();
            return;
        }

        // Locate indices of dragged and hovered items
        const draggedIndex = fromZone.findIndex(
            (item) => item.id === draggedItem.value.id
        );
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

                    // console.log(
                    //     `Swapped ${draggedItem.value.title} with ${hoveredItem.value.title} within ${draggedFrom.value}`
                    // );

                    toast.add({
                        severity: "info",
                        summary: "สลับผู้เล่น",
                        detail: `สลับตำแหน่ง ${draggedItem.value.title} กับ ${hoveredItem.value.title} สำเร็จ`,
                        // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                        life: 1500,
                    });
                } else {
                    // Move to the end if not hovered over an item
                    const [removedDraggedItem] = fromZone.splice(
                        draggedIndex,
                        1
                    );
                    fromZone.push(removedDraggedItem);

                    // console.log(
                    //     `Moved ${draggedItem.value.title} to the end of ${draggedFrom.value}`
                    // );

                    toast.add({
                        severity: "info",
                        summary: "ย้ายผู้เล่น",
                        detail: `ย้าย ${draggedItem.value.title} ไปยัง ${draggedFrom.value} สำเร็จ`,
                        // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                        life: 1500,
                    });
                }
            } else {
                // Case 2: Moving to a different drop zone
                if (hoveredIndex > -1) {
                    // Swap items between zones
                    const [removedDraggedItem] = fromZone.splice(
                        draggedIndex,
                        1
                    );
                    const [removedHoveredItem] = toZone.splice(
                        hoveredIndex,
                        1,
                        removedDraggedItem
                    );
                    fromZone.splice(draggedIndex, 0, removedHoveredItem); // Place the hovered item back to the dragged item's original position

                    // console.log(
                    //     `Swapped ${draggedItem.value.title} from ${draggedFrom.value} with ${hoveredItem.value.title} in ${dropZoneActive.value}`
                    // );

                    toast.add({
                        severity: "info",
                        summary: "สลับผู้เล่น",
                        detail: `สลับตำแหน่ง ${draggedItem.value.title} กับ ${hoveredItem.value.title} สำเร็จ`,
                        // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                        life: 1500,
                    });
                } else {
                    // Move to the new zone if not hovered over an item

                    // Capacity check for Game zone
                    if (
                        dropZoneActive.value === "Game" &&
                        dropZones["Game"].length >= MAX_PLAYING_ITEMS
                    ) {
                        toast.add({
                            severity: "error",
                            summary: "เพิ่มผู้เล่นล้มเหลว",
                            detail: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                            // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                            life: 1500,
                        });

                        resetDragState();
                        return; // Prevent adding the item
                    }

                    const [removedItem] = fromZone.splice(draggedIndex, 1);
                    toZone.push(removedItem);

                    // console.log(
                    //     `Moved ${draggedItem.value.title} from ${draggedFrom.value} to ${dropZoneActive.value}`
                    // );

                    console.log(dropZones.Game)

                    toast.add({
                        severity: "info",
                        summary: "ย้ายผู้เล่น",
                        detail: `ย้าย ${draggedItem.value.title} จาก ${draggedFrom.value} ไป ${dropZoneActive.value} สำเร็จ`,
                        // summary: "ผู้เล่นเต็ม ไม่สามารถเพิ่มได้อีก",
                        life: 1500,
                    });
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
        convertWaitingTimeToMinutes,
    };
}
