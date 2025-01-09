<script setup>
import { useDragDrop } from "@/composables/useDragDrop";
import { ref, reactive, computed, onMounted } from "vue";
import AppLayout from "@/layout/AppLayout.vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";

import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";

// import Ably from "ably";
// import Echo from 'laravel-echo';

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: 'qCCD1A.jbJmHw:TuTOdTumcVtmRSP_sCQ2kxSpmP5OEVcG1UhjvuwGJVo',
//     wsHost: 'realtime.ably.io',
//     wsPort: 443,
//     wssPort: 443,
//     forceTLS: true,
//     disableStats: true,
// });

const messages = ref([]);
// const ably = new Ably.Realtime("qCCD1A.jbJmHw:TuTOdTumcVtmRSP_sCQ2kxSpmP5OEVcG1UhjvuwGJVo");

const toast = useToast();
const confirmPopup = useConfirm();

const page = usePage();

console.log(page.props.readyPlayers);

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
  convertWaitingTimeToMinutes,
} = useDragDrop();

const formattedData = computed(() =>
  page.props.readyPlayers.map((item) => ({
    id: item.user_id,
    title: shortenTitle(item.display_name),
    avatar: item.avatar,
    rank_title: item.badminton_rank,
    rank_level: item.badminton_level,
    waiting_time: item.waiting_time,
    played: item.finished_games_count,
  }))
);

const sortOrder = ref("DESC");

const sortedPlayerByGamePlayed = computed(() => {
  const players = [...formattedData.value]; // Clone to avoid modifying original array
  return players.sort((a, b) => {
    if (sortOrder.value === "ASC") {
      return a.played - b.played;
    } else {
      return b.played - a.played;
    }
  });
});

// Toggle sort order and update dropZones.Ready
const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "ASC" ? "DESC" : "ASC";
  dropZones.Ready = [...sortedPlayerByGamePlayed.value]; // Ensure value is evaluated
};

const shortenTitle = (title, maxLength = 10) => {
  if (title.length > maxLength) {
    return `${title.slice(0, maxLength)}...`;
  }
  return title;
};

const startNewGame = () => {
  router.post(
    `/games/create-game`,
    {
      party_id: 1, // Dummy party ID
      game_type: "quadruple", // Game type: 'double' or 'quadruple'
      players: dropZones.Game.map((player) => player.id), // Dummy player IDs (2 players for 'double')
      team1_start_side: "north", // Optional, defaults to 'north'
      initial_shuttlecock_game: 1, // Optional, defaults to 0
      process: "playing", // listing, playing
    },
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (res) => {
        console.log(res.props);

        dropZones.Playing = [...dropZones.Playing, ...dropZones.Game];
        dropZones.Game = [];

        toast.add({
          severity: "success",
          summary: "Game Created",
          detail: "สร้างเกม และ เริ่มเกมเรียบร้อยแล้ว.",
          life: 3000,
        });
      },
      onError: (err) => {
        if (err.notMatchType) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "จำนวนผู้เล่นไม่ตรงกับรูปแบบของเกม",
            life: 3000,
          });
        }
        if (err.existSettingGame) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "มีเกมที่กำลังตั้งค่าอยู่ก่อนแล้ว",
            life: 3000,
          });
        }
      },
    }
  );
};

const listNewGame = () => {
  router.post(
    `/games/create-game`,
    {
      party_id: 1, // Dummy party ID
      game_type: "quadruple", // Game type: 'double' or 'quadruple'
      players: dropZones.Game.map((player) => player.id), // Dummy player IDs (2 players for 'double')
      team1_start_side: "north", // Optional, defaults to 'north'
      initial_shuttlecock_game: 1, // Optional, defaults to 0
      process: "listing", // listing, playing
    },
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (res) => {
        console.log(res.props);
        // games.value = res.props.games;

        dropZones.Listing = [...dropZones.Listing, ...dropZones.Game];
        dropZones.Game = [];

        toast.add({
          severity: "success",
          summary: "Game Created",
          detail: "สร้างเกมแล้ว และ ลีสลงรายการรอเริ่ม.",
          life: 3000,
        });
      },
      onError: (err) => {
        if (err.notMatchType) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "จำนวนผู้เล่นไม่ตรงกับรูปแบบของเกม",
            life: 3000,
          });
        }
        if (err.existSettingGame) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "มีเกมที่กำลังตั้งค่าอยู่ก่อนแล้ว",
            life: 3000,
          });
        }
      },
    }
  );
};

onMounted(() => {
  toggleSortOrder();

  //   const channel = ably.channels.get("get-started");

  //   // Subscribe to messages
  //   channel.subscribe("first", (message) => {
  //     messages.value.push(message.data);
  //   });

  //   // Publish a message
  //   channel.publish("first", "Hello from Vue!", (err) => {
  //     if (err) {
  //       console.error("Error publishing message:", err);
  //     }
  //   });
});
</script>

<template>
  <Head title="Game" />

  <AppLayout>
    <div class="flex flex-column sm:flex-row justify-content-center gap-4">
      <!-- Game Zone -->
      <div
        class="col-12 sm:w-24rem h-30rem drop-zone-game p-card flex flex-column gap-3 shadow-lg"
        data-zone="Game"
        :class="{ 'drop-zone-active': dropZoneActive === 'Game' }"
      >
        <div class="flex align-items-center justify-content-between mb-3">
          <h3 class="text-lg font-bold text-primary">Game</h3>
          <div class="flex gap-1">
            <button
              @click="startNewGame"
              class="p-button p-button-primary p-button-sm rounded-full"
            >
              <i class="pi pi-play"></i>
            </button>
            <button
              @click="listNewGame"
              class="p-button p-button-warning p-button-sm rounded-full"
            >
              <i class="pi pi-list"></i>
            </button>
            <button
              @click="releaseAllItems"
              class="p-button p-button-danger p-button-sm rounded-full"
            >
              <i class="pi pi-refresh"></i>
            </button>
          </div>
        </div>
        <div
          class="game-items-gridxx flex flex-wrap justify-content-evenly bg-green-100 w-full max-w-20rem h-20rem mx-auto p-3 gap-3 border-round-xl"
        >
          <div
            v-for="item in dropZones.Game"
            :key="item.id"
            class="draggable-item flex flex-column w-7rem h-8rem align-items-center p-2 gap-1 bg-white"
            :class="{ 'hovered-item': hoveredItem?.id === item.id }"
            :data-id="item.id"
            @mousedown.prevent="handleDragStart($event, item, 'Game')"
            @touchstart.prevent="handleDragStart($event, item, 'Game')"
          >
            <!-- Subtract Button -->
            <button
              @mousedown.stop
              @mouseup.stop="handleMouseUp"
              @touchstart.stop="handleTouchStart"
              @touchend.stop="handleTouchEnd(item, 'Game')"
              @dblclick.stop="handleDoubleClick(item, 'Game')"
              :class="{
                'subtract-button': dropZones.Game.includes(item),
              }"
            >
              <i
                :class="dropZones.Game.includes(item) ? 'pi pi-minus' : 'pi pi-plus'"
              ></i>
            </button>

            <!-- Avatar -->
            <img :src="item.avatar" alt="Avatar" class="avatar" />

            <!-- Title -->
            <span class="text-center font-medium">{{ item.title }}</span>
            <span
              class="text-center absolute bottom-0 left-0 bg-red-100 border-round-lg px-1 text-xs"
              v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
            ></span>
            <span
              class="text-center absolute bottom-0 right-0 bg-blue-100 border-round-lg px-1 text-xs font-bold"
              v-text="`${item.played} เกม`"
            ></span>
            <span
              class="text-center absolute top-0 left-0 bg-green-100 border-round-lg px-1 text-xs font-bold"
              v-text="`LV: ${item.rank_level}`"
            ></span>
          </div>
        </div>
      </div>

      <!-- Ready Zone -->
      <div class="flex-1 flex flex-column justify-content-center w-full gap-3">
        <div
          class="col-12 drop-zone-ready p-2 sm:p-3 p-card flex flex-column gap-3 shadow-md"
          data-zone="Ready"
          :class="{ 'drop-zone-active': dropZoneActive === 'Ready' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Ready</h3>
          <div class="flex flex-wrap justify-content-center gap-3 sm:gap-4">
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
              <img :src="item.avatar" alt="Avatar" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 border-round-lg px-1 text-xs"
                v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 border-round-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 border-round-lg px-1 text-xs font-bold"
                v-text="`LV: ${item.rank_level}`"
              ></span>
            </div>
          </div>
        </div>

        <!-- Playing Zone -->
        <div
          class="col-12 drop-zone-xxx p-3 p-card flex flex-column gap-3 shadow-md"
          data-zone="Playing"
          :class="{ 'drop-zone-active': dropZoneActive === 'Playing' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Playing</h3>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="item in dropZones.Playing"
              :key="item.id"
              class="draggable-item flex flex-column w-7rem h-8rem align-items-center p-2 gap-1 bg-white"
              :class="{ 'hovered-item': hoveredItem?.id === item.id }"
              :data-id="item.id"
              @mousedown.prevent="handleDragStart($event, item, 'Playing')"
              @touchstart.prevent="handleDragStart($event, item, 'Playing')"
            >
              <!-- Add Button -->
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

              <!-- Avatar -->
              <img :src="item.avatar" alt="Avatar" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 border-round-lg px-1 text-xs"
                v-text="`กำลังเล่น`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 border-round-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 border-round-lg px-1 text-xs font-bold"
                v-text="`LV: ${item.rank_level}`"
              ></span>
            </div>
          </div>
        </div>

        <!-- Listing Zone -->
        <div
          class="col-12 drop-zone-listing p-3 p-card flex flex-column gap-3 shadow-md"
          data-zone="Listing"
          :class="{ 'drop-zone-active': dropZoneActive === 'Listing' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Listing</h3>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="item in dropZones.Listing"
              :key="item.id"
              class="draggable-item flex flex-column w-7rem h-8rem align-items-center p-2 gap-1 bg-white"
              :class="{ 'hovered-item': hoveredItem?.id === item.id }"
              :data-id="item.id"
              @mousedown.prevent="handleDragStart($event, item, 'Listing')"
              @touchstart.prevent="handleDragStart($event, item, 'Listing')"
            >
              <!-- Add Button -->
              <button
                @mousedown.stop
                @mouseup.stop="handleMouseUp"
                @touchstart.stop="handleTouchStart"
                @touchend.stop="handleTouchEnd(item, 'Listing')"
                @dblclick.stop="handleDoubleClick(item, 'Listing')"
                class="add-button"
              >
                <i class="pi pi-plus"></i>
              </button>

              <!-- Avatar -->
              <img :src="item.avatar" alt="Avatar" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 border-round-lg px-1 text-xs"
                v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 border-round-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 border-round-lg px-1 text-xs font-bold"
                v-text="`LV: ${item.rank_level}`"
              ></span>
            </div>
          </div>
        </div>

        <!-- Break Zone -->
        <div
          class="col-12 drop-zone-break p-3 p-card flex flex-column gap-3 shadow-md"
          data-zone="Break"
          :class="{ 'drop-zone-active': dropZoneActive === 'Break' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Break</h3>
          <div class="flex flex-wrap gap-3">
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
              <img :src="item.avatar" alt="Avatar" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 border-round-lg px-1 text-xs"
                v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 border-round-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 border-round-lg px-1 text-xs font-bold"
                v-text="`LV: ${item.rank_level}`"
              ></span>
            </div>
          </div>
        </div>

        <!-- Finish Zone -->
        <div
          class="col-12 drop-zone-finish p-3 p-card flex flex-column gap-3 shadow-md"
          data-zone="Finish"
          :class="{ 'drop-zone-active': dropZoneActive === 'Finish' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Finish</h3>
          <div class="flex flex-wrap gap-3">
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
              <img :src="item.avatar" alt="Avatar" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 border-round-lg px-1 text-xs"
                v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 border-round-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 border-round-lg px-1 text-xs font-bold"
                v-text="`LV: ${item.rank_level}`"
              ></span>
            </div>
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
      <img :src="draggedItem.avatar" alt="Dragging Avatar" class="avatar drag-avatar" />
      <span class="text-center font-medium" v-text="draggedItem.title"></span>
    </div>
  </AppLayout>
</template>

<style scoped>
/* Drop Zone Styles */
.drop-zone-game {
  border: 3px dashed var(--green-300);
  background-color: var(--green-50);
  padding: 20px;
  border-radius: 10px;
}

.drop-zone-ready {
  border: 3px dashed var(--blue-300);
  background-color: var(--blue-50);
  border-radius: 10px;
}

.drop-zone-xxx {
  border: 3px dashed var(--teal-300);
  background-color: var(--teal-50);
  border-radius: 10px;
}

.drop-zone-listing {
  border: 3px dashed var(--pink-300);
  background-color: var(--pink-50);
  border-radius: 10px;
}

.drop-zone-break {
  border: 3px dashed var(--yellow-300);
  background-color: var(--yellow-50);
  border-radius: 10px;
}

.drop-zone-finish {
  border: 3px dashed var(--purple-300);
  background-color: var(--purple-50);
  border-radius: 10px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--surface-border);
}

.game-zone {
  background-color: var(--surface-c); /* Different background for the game zone */
}

.game-items-grid {
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
}

.subtract-button:hover {
  background-color: var(--red-600); /* Darker red on hover */
  transform: scale(1.1);
}

.drop-zone-active {
  background-color: var(--cyan-100);
  border: 3px dashed var(--cyan-300);
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
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

.hovered-item {
  background-color: var(--yellow-200) !important; /* Change to your desired hover color */
  transition: background-color 0.2s ease; /* Smooth transition */
}
</style>
