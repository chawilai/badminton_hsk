<script setup>
import { useDragDrop } from "@/composables/useDragDrop";
import { ref, watch, computed, onMounted, defineProps, defineEmits } from "vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";
import UserAvatar from "@/Components/UserAvatar.vue";

import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";

const toast = useToast();
const { confirm } = useConfirm();

let props = defineProps({
  data: {
    type: Object,
  },
});

const emit = defineEmits(["gameCreated"]);

const localData = ref({ ...props.data });

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
  localData.value.readyPlayers.map((item) => ({
    id: item.user_id,
    title: shortenTitle(item.display_name),
    avatar: item.avatar,
    rank_title: item.badminton_rank,
    rank_level: item.badminton_level,
    waiting_time: item.waiting_time,
    played: item.finished_games_count,
    current_game: item.current_game,
  }))
);

const form = ref({
  party_id: localData.value.party.id,
  game_type: "quadruple",
  players: [],
  team1_start_side: "north",
  initial_shuttlecock_game: 0,
  process: "playing",
});

const sortOrder = ref("ASC");

const sortedPlayerByGamePlayed = computed(() => {
  const players = [...formattedData.value];
  return players.sort((a, b) => {
    if (sortOrder.value === "ASC") {
      return a.played - b.played;
    } else {
      return b.played - a.played;
    }
  });
});

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "ASC" ? "DESC" : "ASC";
  dropZones.Ready = [...sortedPlayerByGamePlayed.value];
};

const shortenTitle = (title, maxLength = 14) => {
  if (title.length > maxLength) {
    return `${title.slice(0, maxLength)}...`;
  }
  return title;
};

// Team zones from drag-drop
const totalGamePlayers = computed(() => dropZones.Team1.length + dropZones.Team2.length);
const team1Level = computed(() => dropZones.Team1.reduce((sum, p) => sum + (p.rank_level || 0), 0));
const team2Level = computed(() => dropZones.Team2.reduce((sum, p) => sum + (p.rank_level || 0), 0));
const levelDiff = computed(() => Math.abs(team1Level.value - team2Level.value));
const isBalanced = computed(() => levelDiff.value <= 3);

const allGamePlayers = () => [...dropZones.Team1, ...dropZones.Team2];

// ===== Auto-balance algorithm =====
const autoSetPlayers = () => {
  // 1) Release current team players back to Ready first
  releaseAllItems();

  const ready = [...dropZones.Ready].filter(p => !p.current_game);
  if (ready.length < 4) {
    toast.add({ severity: "error", summary: "ล้มเหลว", detail: `ผู้เล่นพร้อมไม่พอ (${ready.length}/4)`, life: 3000 });
    return;
  }

  // 2) Score each player — higher = should play sooner
  //    - waiting_time (seconds): longer wait → higher priority
  //    - played (games): fewer games → higher priority
  const maxWait = Math.max(...ready.map(p => p.waiting_time || 0), 1);
  const maxPlayed = Math.max(...ready.map(p => p.played || 0), 1);

  const scored = ready.map(p => ({
    ...p,
    // Normalize 0-1: waiting (higher=better), played (lower=better)
    score: ((p.waiting_time || 0) / maxWait) * 0.5
         + (1 - (p.played || 0) / maxPlayed) * 0.5,
  }));

  // 3) Sort by score descending, pick top 4
  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, 4);

  // 4) Find the best team split (minimize level diff)
  //    With 4 players there are only 3 ways to split into 2v2
  const combos = [
    [[0, 1], [2, 3]],
    [[0, 2], [1, 3]],
    [[0, 3], [1, 2]],
  ];

  let bestSplit = combos[0];
  let bestDiff = Infinity;

  for (const [t1Idx, t2Idx] of combos) {
    const t1Lvl = t1Idx.reduce((s, i) => s + (picked[i].rank_level || 0), 0);
    const t2Lvl = t2Idx.reduce((s, i) => s + (picked[i].rank_level || 0), 0);
    const diff = Math.abs(t1Lvl - t2Lvl);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestSplit = [t1Idx, t2Idx];
    }
  }

  // 5) Move players from Ready to Team1/Team2
  const [t1Indices, t2Indices] = bestSplit;

  for (const i of t1Indices) {
    const player = picked[i];
    const idx = dropZones.Ready.findIndex(p => p.id === player.id);
    if (idx > -1) {
      const [removed] = dropZones.Ready.splice(idx, 1);
      originalZones[removed.id] = 'Ready';
      dropZones.Team1.push(removed);
    }
  }

  for (const i of t2Indices) {
    const player = picked[i];
    const idx = dropZones.Ready.findIndex(p => p.id === player.id);
    if (idx > -1) {
      const [removed] = dropZones.Ready.splice(idx, 1);
      originalZones[removed.id] = 'Ready';
      dropZones.Team2.push(removed);
    }
  }

  const t1Lvl = dropZones.Team1.reduce((s, p) => s + (p.rank_level || 0), 0);
  const t2Lvl = dropZones.Team2.reduce((s, p) => s + (p.rank_level || 0), 0);

  toast.add({
    severity: "success",
    summary: "Auto Balance",
    detail: `จัดทีมแล้ว (Lv ${t1Lvl} vs ${t2Lvl}, diff ${Math.abs(t1Lvl - t2Lvl)})`,
    life: 3000,
  });
};

const clearTeamZones = () => {
  dropZones.Team1.splice(0, dropZones.Team1.length);
  dropZones.Team2.splice(0, dropZones.Team2.length);
};

const startNewGame = () => {
  const players = allGamePlayers();
  const playerCount = players.length;
  form.value.game_type =
    playerCount === 2 ? "double" : playerCount === 4 ? "quadruple" : null;

  if (!form.value.game_type) {
    toast.add({
      severity: "error",
      summary: "ล้มเหลว",
      detail: "จำนวนผู้เล่นไม่ถูกต้อง (ต้องเป็น 2 หรือ 4 คน)",
      life: 3000,
    });
    return;
  }

  form.value.players = players.map((player) => player.id);
  form.value.process = "playing";
  router.post(`/games/create-game`, form.value, {
    preserveScroll: true,
    headers: { Accept: "application/json" },
    onSuccess: (res) => {
      dropZones.Playing = [...dropZones.Playing, ...players];
      clearTeamZones();
      form.value = { party_id: localData.value.party.id, game_type: "quadruple", players: [], team1_start_side: "north", initial_shuttlecock_game: 0, process: "playing" };
      emit("gameCreated", { action: "somethingHappened", timestamp: Date.now() });
      toast.add({ severity: "success", summary: "Game Created", detail: "สร้างเกม และ เริ่มเกมเรียบร้อยแล้ว.", life: 3000 });
    },
    onError: (err) => {
      clearTeamZones();
      if (err.notMatchType) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "จำนวนผู้เล่นไม่ตรงกับรูปแบบของเกม", life: 3000 });
      if (err.existSettingGame) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีเกมที่กำลังตั้งค่าอยู่ก่อนแล้ว", life: 3000 });
      if (err.activePlayers) toast.add({ severity: "error", summary: "ล้มเหลว", detail: err.activePlayers });
    },
  });
};

const listNewGame = () => {
  const players = allGamePlayers();
  const playerCount = players.length;
  form.value.game_type =
    playerCount === 2 ? "double" : playerCount === 4 ? "quadruple" : null;

  if (!form.value.game_type) {
    toast.add({ severity: "error", summary: "ล้มเหลว", detail: "จำนวนผู้เล่นไม่ถูกต้อง (ต้องเป็น 2 หรือ 4 คน)", life: 3000 });
    return;
  }

  form.value.players = players.map((player) => player.id);
  form.value.process = "listing";
  router.post(`/games/create-game`, form.value, {
    preserveScroll: true,
    headers: { Accept: "application/json" },
    onSuccess: (res) => {
      dropZones.Listing = [...dropZones.Listing, ...players];
      clearTeamZones();
      form.value = { party_id: localData.value.party.id, game_type: "quadruple", players: [], team1_start_side: "north", initial_shuttlecock_game: 0, process: "playing" };
      emit("gameCreated", { action: "somethingHappened", timestamp: Date.now() });
      toast.add({ severity: "success", summary: "Game Created", detail: "สร้างเกมแล้ว และ ลีสลงรายการรอเริ่ม.", life: 3000 });
    },
    onError: (err) => {
      if (err.notMatchType) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "จำนวนผู้เล่นไม่ตรงกับรูปแบบของเกม", life: 3000 });
      if (err.players) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "โปรดกำหนดผู้เล่นให้ครบถ้วน", life: 3000 });
      if (err.existSettingGame) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีเกมที่กำลังตั้งค่าอยู่ก่อนแล้ว", life: 3000 });
    },
  });
};

watch(
  () => props.data,
  (newData) => {
    localData.value = newData;
    toggleSortOrder();
  },
  { immediate: true }
);

onMounted(() => {
  toggleSortOrder();
});

const zoneConfig = {
  Game:    { label: 'Game',    color: 'emerald', borderColor: '#86efac', bgColor: '#f0fdf4' },
  Ready:   { label: 'Ready',   color: 'blue',    borderColor: '#93c5fd', bgColor: '#eff6ff' },
  Playing: { label: 'Playing', color: 'teal',    borderColor: '#5eead4', bgColor: '#f0fdfa' },
  Listing: { label: 'Listing', color: 'pink',    borderColor: '#f9a8d4', bgColor: '#fdf2f8' },
  Break:   { label: 'Break',   color: 'amber',   borderColor: '#fde047', bgColor: '#fefce8' },
  Finish:  { label: 'Finish',  color: 'purple',  borderColor: '#c4b5fd', bgColor: '#faf5ff' },
};

const zoneBadgeClass = (zone) => {
  const map = {
    Game: 'badge-success', Ready: 'badge-info', Playing: 'badge-accent',
    Listing: 'badge-secondary', Break: 'badge-warning', Finish: 'badge-neutral',
  };
  return map[zone] || 'badge-ghost';
};
</script>

<template>
  <div class="space-y-3">
    <!-- ===== GAME ZONE (Top) ===== -->
    <div
      class="game-zone-card rounded-2xl p-4 border-2 border-dashed transition-all"
      :style="{
        borderColor: (dropZoneActive === 'Team1' || dropZoneActive === 'Team2') ? '#67e8f9' : '#86efac',
        backgroundColor: (dropZoneActive === 'Team1' || dropZoneActive === 'Team2') ? '#cffafe' : '#f0fdf4'
      }"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <span class="badge badge-success badge-lg font-bold gap-1">🏸 Game</span>
          <span class="text-xs text-base-content/50">{{ totalGamePlayers }}/4</span>
        </div>
        <div class="flex items-center gap-1.5">
          <!-- Shuttle select -->
          <div class="flex items-center gap-1 bg-base-100/80 rounded-lg px-2 py-1">
            <span class="text-xs text-base-content/60">🪶</span>
            <select v-model="form.initial_shuttlecock_game" class="select select-ghost select-xs w-12 min-h-0 h-6 px-1">
              <option v-for="i in [0, 1, 2, 3]" :key="i" :value="i">{{ i }}</option>
            </select>
          </div>
          <!-- Actions -->
          <button @click="autoSetPlayers" class="btn btn-info btn-xs gap-0.5" title="Auto Balance">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/></svg>
            Auto
          </button>
          <div class="join">
            <button @click="startNewGame" class="btn btn-success btn-xs join-item" title="Start Game">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <button @click="listNewGame" class="btn btn-warning btn-xs join-item" title="List Game">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>
            <button @click="releaseAllItems" class="btn btn-error btn-xs join-item" title="Reset">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Balance indicator -->
      <div v-if="totalGamePlayers >= 3" class="flex items-center justify-center gap-2 mb-2">
        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full"
          :class="isBalanced ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'"
        >{{ isBalanced ? 'Balanced' : `Diff ${levelDiff}` }}</span>
      </div>

      <!-- Team split layout -->
      <div class="flex items-stretch gap-2 min-h-[10rem]">
        <!-- Team 1 -->
        <div class="flex-1 rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 p-2.5 flex flex-col" data-zone="Team1">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold text-accent uppercase tracking-wider">Team 1</span>
            <span v-if="dropZones.Team1.length" class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-accent/15 text-accent">Lv {{ team1Level }}</span>
          </div>
          <div class="flex flex-col gap-2 flex-1">
            <template v-for="item in dropZones.Team1" :key="item.id">
              <div
                class="player-card relative bg-base-100 rounded-xl overflow-hidden shadow-xs border border-base-200 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
                :class="{ 'ring-2 ring-amber-300 bg-amber-50': hoveredItem?.id === item.id }"
                :data-id="item.id"
                @mousedown.prevent="handleDragStart($event, item, 'Team1')"
                @touchstart.prevent="handleDragStart($event, item, 'Team1')"
              >
                <button
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-error text-error-content text-[10px] flex items-center justify-center cursor-pointer hover:bg-error/80 z-10"
                  @mousedown.stop @mouseup.stop="handleMouseUp" @touchstart.stop="handleTouchStart"
                  @click.stop="handleClick(item, 'Team1')" @touchend.stop="handleTouchEnd(item, 'Team1')"
                  @dblclick.stop="handleDoubleClick(item, 'Team1')"
                >✕</button>
                <div class="flex items-center gap-2 p-2.5">
                  <UserAvatar :src="item.avatar" :name="item.display_name || item.name" size="md" rounded="full" class="border-2 border-accent/30 shrink-0" />
                  <div class="flex flex-col min-w-0">
                    <span class="text-xs font-semibold text-base-content leading-tight truncate">{{ item.title }}</span>
                    <div class="flex items-center gap-1 mt-0.5">
                      <span class="text-[9px] px-1 py-px rounded bg-success/15 text-success font-semibold">Lv{{ item.rank_level }}</span>
                      <span class="text-[9px] px-1 py-px rounded bg-info/15 text-info font-semibold">{{ item.played }}G</span>
                    </div>
                  </div>
                </div>
                <div class="px-2 py-1 text-[9px] font-semibold text-center border-t border-base-200"
                  :class="item.current_game ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'"
                >{{ item.current_game ? `กำลังเล่น` : `รอ ${convertWaitingTimeToMinutes(item.waiting_time)} น.` }}</div>
              </div>
            </template>
            <!-- Empty slot(s) for Team 1 -->
            <div
              v-for="n in Math.max(0, 2 - dropZones.Team1.length)"
              :key="'t1-empty-' + n"
              class="rounded-xl border-2 border-dashed border-accent/20 flex items-center justify-center min-h-[4.5rem] text-accent/20"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            </div>
          </div>
        </div>

        <!-- VS divider -->
        <div class="shrink-0 flex flex-col items-center justify-center px-1">
          <span class="text-xs font-black text-base-content/20">VS</span>
        </div>

        <!-- Team 2 -->
        <div class="flex-1 rounded-xl border-2 border-dashed border-secondary/40 bg-secondary/5 p-2.5 flex flex-col" data-zone="Team2">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[10px] font-bold text-secondary uppercase tracking-wider">Team 2</span>
            <span v-if="dropZones.Team2.length" class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-secondary/15 text-secondary">Lv {{ team2Level }}</span>
          </div>
          <div class="flex flex-col gap-2 flex-1">
            <template v-for="item in dropZones.Team2" :key="item.id">
              <div
                class="player-card relative bg-base-100 rounded-xl overflow-hidden shadow-xs border border-base-200 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
                :class="{ 'ring-2 ring-amber-300 bg-amber-50': hoveredItem?.id === item.id }"
                :data-id="item.id"
                @mousedown.prevent="handleDragStart($event, item, 'Team2')"
                @touchstart.prevent="handleDragStart($event, item, 'Team2')"
              >
                <button
                  class="absolute top-1 right-1 w-5 h-5 rounded-full bg-error text-error-content text-[10px] flex items-center justify-center cursor-pointer hover:bg-error/80 z-10"
                  @mousedown.stop @mouseup.stop="handleMouseUp" @touchstart.stop="handleTouchStart"
                  @click.stop="handleClick(item, 'Team2')" @touchend.stop="handleTouchEnd(item, 'Team2')"
                  @dblclick.stop="handleDoubleClick(item, 'Team2')"
                >✕</button>
                <div class="flex items-center gap-2 p-2.5">
                  <UserAvatar :src="item.avatar" :name="item.display_name || item.name" size="md" rounded="full" class="border-2 border-secondary/30 shrink-0" />
                  <div class="flex flex-col min-w-0">
                    <span class="text-xs font-semibold text-base-content leading-tight truncate">{{ item.title }}</span>
                    <div class="flex items-center gap-1 mt-0.5">
                      <span class="text-[9px] px-1 py-px rounded bg-success/15 text-success font-semibold">Lv{{ item.rank_level }}</span>
                      <span class="text-[9px] px-1 py-px rounded bg-info/15 text-info font-semibold">{{ item.played }}G</span>
                    </div>
                  </div>
                </div>
                <div class="px-2 py-1 text-[9px] font-semibold text-center border-t border-base-200"
                  :class="item.current_game ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning'"
                >{{ item.current_game ? `กำลังเล่น` : `รอ ${convertWaitingTimeToMinutes(item.waiting_time)} น.` }}</div>
              </div>
            </template>
            <!-- Empty slot(s) for Team 2 -->
            <div
              v-for="n in Math.max(0, 2 - dropZones.Team2.length)"
              :key="'t2-empty-' + n"
              class="rounded-xl border-2 border-dashed border-secondary/20 flex items-center justify-center min-h-[4.5rem] text-secondary/20"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== OTHER ZONES ===== -->
    <template v-for="zone in ['Ready', 'Playing', 'Listing', 'Break', 'Finish']" :key="zone">
      <div
        v-if="dropZones[zone].length > 0 || zone === 'Ready'"
        class="rounded-2xl p-3 border-2 border-dashed transition-all"
        :style="{
          borderColor: dropZoneActive === zone ? '#67e8f9' : zoneConfig[zone].borderColor,
          backgroundColor: dropZoneActive === zone ? '#cffafe' : zoneConfig[zone].bgColor,
        }"
        :data-zone="zone"
      >
        <div class="flex items-center gap-2 mb-2">
          <span class="badge badge-sm font-bold" :class="zoneBadgeClass(zone)">{{ zoneConfig[zone].label }}</span>
          <span class="text-xs text-base-content/50">{{ dropZones[zone].length }}</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div
            v-for="item in dropZones[zone]"
            :key="item.id"
            class="player-card relative bg-base-100 rounded-xl overflow-hidden shadow-xs border border-base-200 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"
            :class="{ 'ring-2 ring-amber-300 bg-amber-50': hoveredItem?.id === item.id }"
            :data-id="item.id"
            @mousedown.prevent="handleDragStart($event, item, zone)"
            @touchstart.prevent="handleDragStart($event, item, zone)"
          >
            <button
              class="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-primary-content text-[10px] flex items-center justify-center cursor-pointer hover:bg-primary/80 z-10"
              @mousedown.stop @mouseup.stop="handleMouseUp" @touchstart.stop="handleTouchStart"
              @click.stop="handleClick(item, zone)" @touchend.stop="handleTouchEnd(item, zone)"
              @dblclick.stop="handleDoubleClick(item, zone)"
            >+</button>
            <div class="flex items-center gap-2 p-2.5">
              <UserAvatar :src="item.avatar" :name="item.display_name || item.name" size="md" rounded="full" class="border-2 border-base-200 shrink-0" />
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-semibold text-base-content leading-tight truncate">{{ item.title }}</span>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="text-[9px] px-1 py-px rounded bg-success/15 text-success font-medium">L{{ item.rank_level }}</span>
                  <span class="text-[9px] px-1 py-px rounded bg-info/15 text-info font-medium">{{ item.played }}G</span>
                </div>
              </div>
            </div>
            <div class="px-2 py-1 text-[9px] font-semibold text-center border-t border-base-200"
              :class="item.current_game
                ? 'bg-accent/10 text-accent'
                : (zone === 'Playing' ? 'bg-accent/10 text-accent' : 'bg-warning/10 text-warning')"
            >{{ item.current_game ? `เกม ${item.played}` : (zone === 'Playing' ? 'กำลังเล่น' : `รอ ${convertWaitingTimeToMinutes(item.waiting_time)}m`) }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- ===== DRAGGING FEEDBACK ===== -->
    <div
      v-if="isDragging"
      class="fixed pointer-events-none z-[1000] flex flex-col items-center gap-1 bg-base-100 p-2 border-2 border-emerald-400 rounded-xl shadow-xl"
      :style="{
        left: `${dragPosition.x}px`,
        top: `${dragPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: returnToOriginal ? 'all 0.3s ease' : 'none',
      }"
    >
      <UserAvatar :src="draggedItem.avatar" :name="draggedItem.display_name || draggedItem.name" size="md" rounded="full" class="border-2 border-primary" />
      <span class="text-xs font-semibold text-base-content/80">{{ draggedItem.title }}</span>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
