<script setup>
import { useDragDrop } from "@/composables/useDragDrop";
import { ref, watch, computed, onMounted, onUnmounted, nextTick, defineProps, defineEmits } from "vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";
import UserAvatar from "@/Components/UserAvatar.vue";

import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import { useLocale } from "@/composables/useLocale";
import shuttlecockIcon from "@/../assets/images/shuttlecock.png";

const toast = useToast();
const { confirm } = useConfirm();
const { t } = useLocale();

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

const gameMode = ref(localData.value.party?.default_game_type || "quadruple"); // "double" (1v1) or "quadruple" (2v2)
const maxPerTeam = computed(() => gameMode.value === "double" ? 1 : 2);
const maxTotal = computed(() => gameMode.value === "double" ? 2 : 4);

const form = ref({
  party_id: localData.value.party.id,
  game_type: "quadruple",
  players: [],
  team1_start_side: "north",
  initial_shuttlecock_game: 0,
  court_number: null,
  process: "playing",
});

// Courts currently in use by playing games
const activeCourts = computed(() => {
  const games = localData.value.games || [];
  return games
    .filter(g => g.status === 'playing' && g.court_number)
    .map(g => g.court_number);
});

// Quick-pick court numbers from bookings + game history
const quickCourtNumbers = computed(() => {
  const nums = new Set();
  // From party court bookings
  (localData.value.party?.court_bookings || []).forEach(b => {
    if (b.court_field_number) nums.add(b.court_field_number);
  });
  // From games in this party
  (localData.value.games || []).forEach(g => {
    if (g.court_number) nums.add(g.court_number);
  });
  return [...nums].sort((a, b) => a - b);
});

const sortOrder = ref("ASC");
const showCourtDialog = ref(false);
const courtInputRef = ref(null);
const tempCourtNumber = ref(null);

const openCourtDialog = () => {
  tempCourtNumber.value = form.value.court_number || '';
  showCourtDialog.value = true;
  nextTick(() => courtInputRef.value?.focus());
};

const pendingStartAfterCourt = ref(false);

const saveCourtFromDialog = () => {
  if (tempCourtNumber.value && tempCourtNumber.value >= 1) {
    const courtNum = parseInt(tempCourtNumber.value);

    // If starting a game, check court not already in use
    if (pendingStartAfterCourt.value && activeCourts.value.includes(courtNum)) {
      toast.add({
        severity: "error",
        summary: "คอร์ทไม่ว่าง",
        detail: `คอร์ท ${courtNum} กำลังเล่นอยู่ กรุณาเลือกคอร์ทอื่น`,
        life: 4000,
      });
      return; // Keep dialog open
    }

    form.value.court_number = courtNum;
  }
  showCourtDialog.value = false;

  // If we were waiting for court to start game, proceed now
  if (pendingStartAfterCourt.value && form.value.court_number) {
    pendingStartAfterCourt.value = false;
    startNewGame();
  } else {
    pendingStartAfterCourt.value = false;
  }
};

const sortedPlayerByGamePlayed = computed(() => {
  const players = [...formattedData.value];
  return players.sort((a, b) => {
    // Primary: fewer games first
    const gameDiff = a.played - b.played;
    if (gameDiff !== 0) return gameDiff;
    // Secondary: longer waiting first
    return (b.waiting_time || 0) - (a.waiting_time || 0);
  });
});

const formattedBreakPlayers = computed(() =>
  (localData.value.breakPlayers || []).map((item) => ({
    id: item.user_id,
    title: shortenTitle(item.display_name),
    avatar: item.avatar,
    rank_title: item.badminton_rank,
    rank_level: item.badminton_level,
    waiting_time: 0,
    played: item.finished_games_count || 0,
    current_game: null,
    current_game_number: null,
  }))
);

const formattedPlayingPlayers = computed(() =>
  (localData.value.playingPlayers || []).map((item) => ({
    id: item.user_id,
    title: shortenTitle(item.display_name),
    avatar: item.avatar,
    rank_title: item.badminton_rank,
    rank_level: item.badminton_level,
    waiting_time: item.waiting_time,
    played: (item.finished_games_count || 0) + 1,
    current_game: item.current_game,
    current_game_number: item.current_game_number,
  }))
);

// Elapsed time for playing games
const nowTime = ref(Date.now());
let elapsedTimer = null;
onMounted(() => { elapsedTimer = setInterval(() => { nowTime.value = Date.now(); }, 10000); });
onUnmounted(() => { if (elapsedTimer) clearInterval(elapsedTimer); });

const elapsedMinutes = (gameStartDate) => {
  if (!gameStartDate) return 0;
  return Math.floor((nowTime.value - new Date(gameStartDate).getTime()) / 60000);
};

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === "ASC" ? "DESC" : "ASC";
  dropZones.Ready = [...sortedPlayerByGamePlayed.value];
  // Populate Playing zone with currently playing players (avoid duplicates), sorted by game number asc
  const existingIds = new Set(dropZones.Playing.map(p => p.id));
  const newPlaying = formattedPlayingPlayers.value.filter(p => !existingIds.has(p.id));
  dropZones.Playing.push(...newPlaying);
  dropZones.Playing.sort((a, b) => (a.current_game_number || 999) - (b.current_game_number || 999));
  // Populate Break zone
  const breakIds = new Set(dropZones.Break.map(p => p.id));
  formattedBreakPlayers.value.forEach(p => {
    if (!breakIds.has(p.id)) dropZones.Break.push(p);
  });
};

// Pastel colors for game count badges (0-10+)
const gameCountColors = [
  'bg-emerald-100 text-emerald-700',  // 0
  'bg-sky-100 text-sky-700',          // 1
  'bg-violet-100 text-violet-700',    // 2
  'bg-amber-100 text-amber-700',      // 3
  'bg-rose-100 text-rose-700',        // 4
  'bg-teal-100 text-teal-700',        // 5
  'bg-indigo-100 text-indigo-700',    // 6
  'bg-orange-100 text-orange-700',    // 7
  'bg-pink-100 text-pink-700',        // 8
  'bg-cyan-100 text-cyan-700',        // 9
  'bg-fuchsia-100 text-fuchsia-700',  // 10+
];

const gameCountClass = (count) => gameCountColors[Math.min(count, 10)];

// Pastel colors for game number badges (#1-#10+)
const gameNumColors = [
  '',                                  // 0 (unused)
  'bg-sky-100 text-sky-700',          // #1
  'bg-violet-100 text-violet-700',    // #2
  'bg-amber-100 text-amber-700',      // #3
  'bg-rose-100 text-rose-700',        // #4
  'bg-teal-100 text-teal-700',        // #5
  'bg-indigo-100 text-indigo-700',    // #6
  'bg-orange-100 text-orange-700',    // #7
  'bg-pink-100 text-pink-700',        // #8
  'bg-cyan-100 text-cyan-700',        // #9
  'bg-fuchsia-100 text-fuchsia-700',  // #10+
];

const gameNumClass = (num) => gameNumColors[Math.min(num || 1, 10)];

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
  if (ready.length < maxTotal.value) {
    toast.add({ severity: "error", summary: "ล้มเหลว", detail: `ผู้เล่นพร้อมไม่พอ (${ready.length}/${maxTotal.value})`, life: 3000 });
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

  // 3) Sort by score descending, pick top N
  const total = maxTotal.value;
  const perTeam = maxPerTeam.value;
  scored.sort((a, b) => b.score - a.score);
  const picked = scored.slice(0, total);

  // 4) Find the best team split (minimize level diff)
  if (total === 2) {
    // 1v1: just split first 2
    const moveToTeam = (teamZone, player) => {
      const idx = dropZones.Ready.findIndex(p => p.id === player.id);
      if (idx > -1) {
        const [removed] = dropZones.Ready.splice(idx, 1);
        originalZones[removed.id] = 'Ready';
        dropZones[teamZone].push(removed);
      }
    };
    moveToTeam('Team1', picked[0]);
    moveToTeam('Team2', picked[1]);
  } else {
    // 2v2: try 3 combinations
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
  form.value.game_type = gameMode.value;

  if (playerCount !== maxTotal.value) {
    toast.add({
      severity: "error",
      summary: "ล้มเหลว",
      detail: `ต้องมีผู้เล่น ${maxTotal.value} คน (ตอนนี้มี ${playerCount} คน)`,
      life: 3000,
    });
    return;
  }

  // Check if any player is currently in a playing game
  const activePlayers = players.filter(p => p.current_game);
  if (activePlayers.length > 0) {
    const details = activePlayers.map(p => `(#${p.current_game?.game_number || '?'})${p.name}`).join(', ');
    toast.add({
      severity: "warn",
      summary: "มีผู้เล่นกำลังเล่นอยู่",
      detail: `${details} ยังเล่นอยู่ ไม่สามารถเริ่มเกมซ้อนได้ กรุณาใช้ "ลีส" แทน`,
      life: 5000,
    });
    return;
  }

  // Require court number before starting
  if (!form.value.court_number) {
    pendingStartAfterCourt.value = true;
    toast.add({ severity: "warn", summary: "ระบุคอร์ท", detail: "กรุณาระบุเลขคอร์ทก่อนเริ่มเกม", life: 3000 });
    openCourtDialog();
    return;
  }

  // Check if court is already in use by a playing game
  if (activeCourts.value.includes(form.value.court_number)) {
    toast.add({
      severity: "error",
      summary: "คอร์ทไม่ว่าง",
      detail: `คอร์ท ${form.value.court_number} กำลังเล่นอยู่ กรุณาเลือกคอร์ทอื่น`,
      life: 4000,
    });
    openCourtDialog();
    return;
  }

  form.value.players = players.map((player) => player.id);
  form.value.process = "playing";
  router.post(`/games/create-game`, form.value, {
    preserveScroll: true,
    headers: { Accept: "application/json" },
    onSuccess: (res) => {
      // Check flash errors (backend returns errors via flash, not validation)
      const flashErr = res.props?.flash?.error;
      if (flashErr) {
        if (flashErr.activePlayers) toast.add({ severity: "error", summary: "ล้มเหลว", detail: flashErr.activePlayers, life: 5000 });
        if (flashErr.existSettingGame) toast.add({ severity: "error", summary: "ล้มเหลว", detail: flashErr.existSettingGame, life: 3000 });
        if (flashErr.notMatchType) toast.add({ severity: "error", summary: "ล้มเหลว", detail: flashErr.notMatchType, life: 3000 });
        return;
      }
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
  form.value.game_type = gameMode.value;

  if (playerCount !== maxTotal.value) {
    toast.add({ severity: "error", summary: "ล้มเหลว", detail: `ต้องมีผู้เล่น ${maxTotal.value} คน (ตอนนี้มี ${playerCount} คน)`, life: 3000 });
    return;
  }

  form.value.players = players.map((player) => player.id);
  form.value.process = "listing";
  router.post(`/games/create-game`, form.value, {
    preserveScroll: true,
    headers: { Accept: "application/json" },
    onSuccess: (res) => {
      // Check flash errors
      const flashErr = res.props?.flash?.error;
      if (flashErr) {
        if (flashErr.activePlayers) toast.add({ severity: "warn", summary: "ลีสซ้ำ", detail: flashErr.activePlayers, life: 5000 });
        if (flashErr.existSettingGame) toast.add({ severity: "error", summary: "ล้มเหลว", detail: flashErr.existSettingGame, life: 3000 });
        if (flashErr.notMatchType) toast.add({ severity: "error", summary: "ล้มเหลว", detail: flashErr.notMatchType, life: 3000 });
        return;
      }
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
    localData.value = { ...newData };
    toggleSortOrder();
  },
  { deep: true, immediate: true }
);

onMounted(() => {
  toggleSortOrder();
});

const zoneConfig = computed(() => ({
  Game:    { label: 'Game',            cssClass: 'border-success/40 bg-success/5' },
  Ready:   { label: t('zone.ready'),   cssClass: 'border-info/40 bg-info/5' },
  Playing: { label: t('zone.playing'), cssClass: 'border-accent/40 bg-accent/5' },
  Listing: { label: t('zone.listing'), cssClass: 'border-secondary/40 bg-secondary/5' },
  Break:   { label: t('zone.break'),   cssClass: 'border-error/30 bg-error/5' },
  Finish:  { label: t('zone.finish'),  cssClass: 'border-base-content/20 bg-base-content/5' },
}));

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
      <!-- Header Row 1: Badge + Mode + Settings -->
      <div class="flex items-center justify-between mb-1.5">
        <div class="flex items-center gap-1.5">
          <span class="badge badge-success badge-sm font-bold gap-0.5">🏸 Game</span>
          <span class="text-[10px] text-base-content/50">{{ totalGamePlayers }}/{{ maxTotal }}</span>
          <!-- Mode toggle -->
          <div class="flex gap-0.5 p-0.5 bg-base-100/80 rounded-md">
            <button type="button" @click="gameMode = 'double'"
              class="px-1.5 py-0.5 rounded text-[9px] font-bold border-0 cursor-pointer transition-all"
              :class="gameMode === 'double' ? 'bg-primary text-white' : 'bg-transparent text-base-content/40 hover:text-base-content'"
            >1v1</button>
            <button type="button" @click="gameMode = 'quadruple'"
              class="px-1.5 py-0.5 rounded text-[9px] font-bold border-0 cursor-pointer transition-all"
              :class="gameMode === 'quadruple' ? 'bg-primary text-white' : 'bg-transparent text-base-content/40 hover:text-base-content'"
            >2v2</button>
          </div>
        </div>
        <div class="flex items-center gap-1">
          <button @click="openCourtDialog()"
            class="flex items-center gap-0.5 bg-base-100/80 rounded px-1.5 py-0.5 border-0 cursor-pointer hover:bg-base-200 transition-colors text-[10px] font-bold"
            :class="form.court_number ? 'text-primary' : 'text-warning'"
          >{{ form.court_number ? `🏟️ ${t('game.court')} ${form.court_number}` : `🏟️ ${t('game.setCourt')}` }}</button>
          <div class="flex items-center gap-0.5 bg-base-100/80 rounded px-1.5 py-0.5">
            <img :src="shuttlecockIcon" alt="" class="w-3 h-3 inline" style="filter: brightness(0) saturate(100%) invert(40%);" />
            <select v-model="form.initial_shuttlecock_game" class="select select-ghost select-xs w-10 min-h-0 h-5 px-0 text-[10px] font-bold">
              <option v-for="i in [0, 1, 2, 3]" :key="i" :value="i">{{ i }} ลูก</option>
            </select>
          </div>
        </div>
      </div>
      <!-- Header Row 2: Action buttons -->
      <div class="flex items-center gap-1 mb-2">
        <button @click="autoSetPlayers" class="btn btn-info btn-xs h-6 min-h-0 gap-0.5 text-[10px]">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"/></svg>
          จัดอัตโนมัติ
        </button>
        <div class="ml-auto flex items-center gap-1">
          <button @click="startNewGame" class="btn btn-success btn-xs h-6 min-h-0 gap-0.5 text-[10px]">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            เริ่มเกม
          </button>
          <button @click="listNewGame" class="btn btn-warning btn-xs h-6 min-h-0 gap-0.5 text-[10px]">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            ลีส
          </button>
          <button @click="releaseAllItems" class="btn btn-error btn-xs h-6 min-h-0 gap-0.5 text-[10px]">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            ล้าง
          </button>
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
                :class="{ 'ring-2 ring-primary bg-primary/10': hoveredItem?.id === item.id }"
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
                  <div class="flex flex-col min-w-0 flex-1">
                    <span class="text-xs font-semibold text-base-content leading-tight truncate">{{ item.title }}</span>
                    <div class="flex items-center gap-1 mt-0.5">
                      <span class="text-[9px] px-1 py-px rounded bg-success/15 text-success font-semibold">Lv{{ item.rank_level }}</span>
                      <span class="text-[9px] px-1 py-px rounded font-semibold" :class="gameCountClass(item.played)">{{ item.played }} เกม</span>
                      <span class="text-[9px] px-1 py-px rounded font-semibold ml-auto"
                        :class="item.current_game ? gameNumClass(item.current_game_number) : 'bg-warning/15 text-warning'"
                      >{{ item.current_game ? `#${item.current_game_number || '?'} · ${elapsedMinutes(item.current_game?.game_start_date)}น.` : `รอ ${convertWaitingTimeToMinutes(item.waiting_time)}น.` }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- Empty slot(s) for Team 1 -->
            <div
              v-for="n in Math.max(0, maxPerTeam - dropZones.Team1.length)"
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
                :class="{ 'ring-2 ring-primary bg-primary/10': hoveredItem?.id === item.id }"
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
                  <div class="flex flex-col min-w-0 flex-1">
                    <span class="text-xs font-semibold text-base-content leading-tight truncate">{{ item.title }}</span>
                    <div class="flex items-center gap-1 mt-0.5">
                      <span class="text-[9px] px-1 py-px rounded bg-success/15 text-success font-semibold">Lv{{ item.rank_level }}</span>
                      <span class="text-[9px] px-1 py-px rounded font-semibold" :class="gameCountClass(item.played)">{{ item.played }} เกม</span>
                      <span class="text-[9px] px-1 py-px rounded font-semibold ml-auto"
                        :class="item.current_game ? gameNumClass(item.current_game_number) : 'bg-warning/15 text-warning'"
                      >{{ item.current_game ? `#${item.current_game_number || '?'} · ${elapsedMinutes(item.current_game?.game_start_date)}น.` : `รอ ${convertWaitingTimeToMinutes(item.waiting_time)}น.` }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- Empty slot(s) for Team 2 -->
            <div
              v-for="n in Math.max(0, maxPerTeam - dropZones.Team2.length)"
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
        v-if="dropZones[zone].length > 0 || zone === 'Ready' || zone === 'Playing' || zone === 'Break'"
        class="rounded-2xl p-3 border-2 border-dashed transition-all"
        :class="dropZoneActive === zone ? 'border-info bg-info/10' : zoneConfig[zone].cssClass"
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
            :class="{ 'ring-2 ring-primary bg-primary/10': hoveredItem?.id === item.id }"
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
              <div class="flex flex-col min-w-0 flex-1">
                <span class="text-xs font-semibold text-base-content leading-tight truncate">{{ item.title }}</span>
                <div class="flex items-center gap-1 mt-0.5">
                  <span class="text-[9px] px-1 py-px rounded bg-success/15 text-success font-medium">Lv{{ item.rank_level }}</span>
                  <span class="text-[9px] px-1 py-px rounded font-medium" :class="gameCountClass(item.played)">{{ item.played }} เกม</span>
                  <span class="text-[9px] px-1 py-px rounded font-medium ml-auto"
                    :class="item.current_game ? 'bg-accent/15 text-accent' : 'bg-warning/15 text-warning'"
                  >{{ item.current_game ? `#${item.current_game_number || '?'} · ${elapsedMinutes(item.current_game?.game_start_date)}น.` : `รอ ${convertWaitingTimeToMinutes(item.waiting_time)}น.` }}</span>
                </div>
              </div>
            </div>
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
    <!-- Court Number Dialog -->
    <dialog class="modal" :class="{ 'modal-open': showCourtDialog }">
      <div class="modal-box max-w-xs p-0">
        <div class="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 class="text-base font-bold text-base-content m-0">🏟️ {{ t('game.courtNumber') }}</h3>
          <button @click="showCourtDialog = false" class="w-7 h-7 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors">
            <span class="text-base-content/60 text-sm">✕</span>
          </button>
        </div>
        <div class="px-4 pb-4 space-y-3">
          <!-- Quick-pick from bookings + history (show busy status) -->
          <div v-if="quickCourtNumbers.length" class="flex flex-wrap gap-1.5">
            <button
              v-for="num in quickCourtNumbers"
              :key="num"
              type="button"
              @click="tempCourtNumber = num"
              class="h-9 min-w-[2.5rem] px-3 rounded-lg text-sm font-bold border-0 cursor-pointer transition-all active:scale-95 relative"
              :class="tempCourtNumber === num
                ? 'bg-primary text-white'
                : activeCourts.includes(num)
                  ? 'bg-error/10 text-error/50'
                  : 'bg-base-200 text-base-content/70 hover:bg-base-300'"
            >
              {{ num }}
              <span v-if="activeCourts.includes(num)" class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-error"></span>
            </button>
          </div>
          <p v-if="activeCourts.length" class="text-[9px] text-base-content/30 m-0">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-error mr-1"></span>กำลังเล่นอยู่
          </p>
          <input
            ref="courtInputRef"
            v-model.number="tempCourtNumber"
            type="number"
            min="1"
            :placeholder="t('game.courtNumber')"
            class="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 text-center text-2xl font-bold text-base-content focus:border-primary outline-hidden transition-all"
            @keyup.enter="saveCourtFromDialog"
          />
          <button
            @click="saveCourtFromDialog"
            :disabled="!tempCourtNumber || tempCourtNumber < 1"
            class="w-full h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >{{ t('common.save') }}</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showCourtDialog = false">close</button>
      </form>
    </dialog>
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
