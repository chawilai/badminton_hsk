<script setup>
import { useDragDrop } from "@/composables/useDragDrop";
import { ref, watch, reactive, computed, onMounted } from "vue";
import AppLayout from "@/layout/AppLayout.vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";
import UserAvatar from "@/Components/UserAvatar.vue";

import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";

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
const { confirm } = useConfirm();

const page = usePage();

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
      party_id: 2, // Dummy party ID
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
      party_id: 2, // Dummy party ID
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
    <div class="flex flex-col sm:flex-row justify-center gap-4">
      <!-- Game Zone -->
      <div
        class="w-full sm:w-96 h-[30rem] drop-zone-game card flex flex-col gap-3 shadow-lg"
        data-zone="Game"
        :class="{ 'drop-zone-active': dropZoneActive === 'Game' }"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold text-primary">Game</h3>
          <div class="flex gap-1">
            <button
              @click="startNewGame"
              class="btn btn-primary btn-sm btn-circle"
            >
              &#9654;
            </button>
            <button
              @click="listNewGame"
              class="btn btn-warning btn-sm btn-circle"
            >
              &#9776;
            </button>
            <button
              @click="releaseAllItems"
              class="btn btn-error btn-sm btn-circle"
            >
              &#8635;
            </button>
          </div>
        </div>
        <div
          class="flex flex-wrap justify-evenly bg-green-100 w-full max-w-80 h-80 mx-auto p-3 gap-3 rounded-xl"
        >
          <div
            v-for="item in dropZones.Game"
            :key="item.id"
            class="draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"
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
              <span v-if="dropZones.Game.includes(item)">&#8722;</span>
              <span v-else>&#43;</span>
            </button>

            <!-- Avatar -->
            <UserAvatar :src="item.avatar" :name="item.display_name || item.title || item.name" size="xl" rounded="full" class="avatar" />

            <!-- Title -->
            <span class="text-center font-medium">{{ item.title }}</span>
            <span
              class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs"
              v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
            ></span>
            <span
              class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold"
              v-text="`${item.played} เกม`"
            ></span>
            <span
              class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold"
              v-text="`LV: ${item.rank_level}`"
            ></span>
          </div>
        </div>
      </div>

      <!-- Ready Zone -->
      <div class="flex-1 flex flex-col justify-center w-full gap-3">
        <div
          class="w-full drop-zone-ready p-2 sm:p-3 card flex flex-col gap-3 shadow-md"
          data-zone="Ready"
          :class="{ 'drop-zone-active': dropZoneActive === 'Ready' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Ready</h3>
          <div class="flex flex-wrap justify-center gap-3 sm:gap-4">
            <div
              v-for="item in dropZones.Ready"
              :key="item.id"
              class="draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"
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
                &#43;
              </button>

              <!-- Avatar -->
              <UserAvatar :src="item.avatar" :name="item.display_name || item.title || item.name" size="xl" rounded="full" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs"
                v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold"
                v-text="`LV: ${item.rank_level}`"
              ></span>
            </div>
          </div>
        </div>

        <!-- Playing Zone -->
        <div
          class="w-full drop-zone-playing p-3 card flex flex-col gap-3 shadow-md"
          data-zone="Playing"
          :class="{ 'drop-zone-active': dropZoneActive === 'Playing' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Playing</h3>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="item in dropZones.Playing"
              :key="item.id"
              class="draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"
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
                &#43;
              </button>

              <!-- Avatar -->
              <UserAvatar :src="item.avatar" :name="item.display_name || item.title || item.name" size="xl" rounded="full" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs"
                v-text="`กำลังเล่น`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold"
                v-text="`LV: ${item.rank_level}`"
              ></span>
            </div>
          </div>
        </div>

        <!-- Listing Zone -->
        <div
          class="w-full drop-zone-listing p-3 card flex flex-col gap-3 shadow-md"
          data-zone="Listing"
          :class="{ 'drop-zone-active': dropZoneActive === 'Listing' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Listing</h3>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="item in dropZones.Listing"
              :key="item.id"
              class="draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"
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
                &#43;
              </button>

              <!-- Avatar -->
              <UserAvatar :src="item.avatar" :name="item.display_name || item.title || item.name" size="xl" rounded="full" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs"
                v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold"
                v-text="`LV: ${item.rank_level}`"
              ></span>
            </div>
          </div>
        </div>

        <!-- Break Zone -->
        <div
          class="w-full drop-zone-break p-3 card flex flex-col gap-3 shadow-md"
          data-zone="Break"
          :class="{ 'drop-zone-active': dropZoneActive === 'Break' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Break</h3>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="item in dropZones.Break"
              :key="item.id"
              class="draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"
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
                &#43;
              </button>

              <!-- Avatar -->
              <UserAvatar :src="item.avatar" :name="item.display_name || item.title || item.name" size="xl" rounded="full" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs"
                v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold"
                v-text="`LV: ${item.rank_level}`"
              ></span>
            </div>
          </div>
        </div>

        <!-- Finish Zone -->
        <div
          class="w-full drop-zone-finish p-3 card flex flex-col gap-3 shadow-md"
          data-zone="Finish"
          :class="{ 'drop-zone-active': dropZoneActive === 'Finish' }"
        >
          <h3 class="text-lg font-bold text-primary mb-3">Finish</h3>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="item in dropZones.Finish"
              :key="item.id"
              class="draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"
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
                &#43;
              </button>

              <!-- Avatar -->
              <UserAvatar :src="item.avatar" :name="item.display_name || item.title || item.name" size="xl" rounded="full" class="avatar" />

              <!-- Title -->
              <span class="text-center font-medium">{{ item.title }}</span>
              <span
                class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs"
                v-text="`${convertWaitingTimeToMinutes(item.waiting_time)} นาที`"
              ></span>
              <span
                class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold"
                v-text="`${item.played} เกม`"
              ></span>
              <span
                class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold"
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
      <UserAvatar :src="draggedItem.avatar" :name="draggedItem.display_name || draggedItem.title || draggedItem.name" size="xl" rounded="full" class="avatar drag-avatar" />
      <span class="text-center font-medium" v-text="draggedItem.title"></span>
    </div>
  </AppLayout>
</template>

<style scoped>
/* Drop Zone Styles */
.drop-zone-game {
  border: 3px dashed #86efac; /* green-300 */
  background-color: #f0fdf4; /* green-50 */
  padding: 20px;
  border-radius: 10px;
}

.drop-zone-ready {
  border: 3px dashed #93c5fd; /* blue-300 */
  background-color: #eff6ff; /* blue-50 */
  border-radius: 10px;
}

.drop-zone-playing {
  border: 3px dashed #5eead4; /* teal-300 */
  background-color: #f0fdfa; /* teal-50 */
  border-radius: 10px;
}

.drop-zone-listing {
  border: 3px dashed #f9a8d4; /* pink-300 */
  background-color: #fdf2f8; /* pink-50 */
  border-radius: 10px;
}

.drop-zone-break {
  border: 3px dashed #fde047; /* yellow-300 */
  background-color: #fefce8; /* yellow-50 */
  border-radius: 10px;
}

.drop-zone-finish {
  border: 3px dashed #c4b5fd; /* purple-300 */
  background-color: #faf5ff; /* purple-50 */
  border-radius: 10px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
}

.game-zone {
  background-color: #f3f4f6;
}

.game-items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
  padding: 8px;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  min-height: 200px;
}

.draggable-item {
  position: relative;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
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
  background-color: #3b82f6; /* blue-500 */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.add-button:hover {
  background-color: #2563eb; /* blue-600 */
  transform: scale(1.1);
}

.subtract-button {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #ef4444; /* red-500 */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
}

.subtract-button:hover {
  background-color: #dc2626; /* red-600 */
  transform: scale(1.1);
}

.drop-zone-active {
  background-color: #cffafe; /* cyan-100 */
  border: 3px dashed #67e8f9; /* cyan-300 */
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
  gap: 8px;
  background-color: #ffffff;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.drag-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #3b82f6;
}

.hovered-item {
  background-color: #fef08a !important; /* yellow-200 */
  transition: background-color 0.2s ease;
}
</style>
