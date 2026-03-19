<script setup>
import UserAvatar from "@/Components/UserAvatar.vue";
import { usePage, router } from "@inertiajs/vue3";
import shuttlecockIcon from "@/../assets/images/shuttlecock.png";
import { ref, computed, nextTick, onMounted, onUnmounted } from "vue";
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";

const page = usePage();
const { t } = useLocale();
const toast = useToast();

// Court number dialog
const courtDialogVisible = ref(false);
const courtDialogGameId = ref(null);
const courtDialogNumber = ref('');
const courtInput = ref(null);
const courtDialogCanEdit = ref(true);

const openCourtDialog = (game) => {
  // Don't allow editing finished games that already have court number
  if (game.status === 'finished' && game.court_number) return;
  courtDialogGameId.value = game.id;

  // Default: pick first available court from bookings that isn't currently playing
  if (!game.court_number) {
    const bookingCourts = (props.party?.court_bookings || []).map(b => b.court_field_number).sort((a, b) => a - b);
    const available = bookingCourts.find(c => !activePlayingCourts.value.includes(c));
    courtDialogNumber.value = available || bookingCourts[0] || '';
  } else {
    courtDialogNumber.value = game.court_number;
  }

  courtDialogVisible.value = true;
  nextTick(() => { courtInput.value?.focus(); });
};

const saveCourtNumber = () => {
  if (!courtDialogNumber.value || courtDialogNumber.value < 1) return;
  const courtNum = parseInt(courtDialogNumber.value);

  // If starting game, check court not in use
  if (pendingStartGameId.value && activePlayingCourts.value.includes(courtNum)) {
    toast.add({
      severity: "error",
      summary: "คอร์ทไม่ว่าง",
      detail: `คอร์ท ${courtNum} กำลังเล่นอยู่ กรุณาเลือกคอร์ทอื่น`,
      life: 4000,
    });
    return;
  }

  // If pending start → skip update-court, send court_number with start directly (1 request)
  if (pendingStartGameId.value === courtDialogGameId.value) {
    const gid = courtDialogGameId.value;
    pendingStartGameId.value = null;
    courtDialogVisible.value = false;
    startGameWithCourt(gid, courtNum);
    return;
  }

  // Normal court update (no pending start)
  router.post(`/games/${courtDialogGameId.value}/update-court-number`, {
    court_number: courtNum,
  }, {
    preserveScroll: true,
    headers: { Accept: "application/json" },
    onSuccess: () => {
      const game = props.games.find(g => g.id === courtDialogGameId.value);
      if (game) game.court_number = courtNum;
      courtDialogVisible.value = false;
      toast.add({ severity: "success", summary: t('game.court'), detail: `${t('game.courtNumber')} ${courtNum}`, life: 2000 });
    },
  });
};

const canEditCourt = (game) => !(game.status === 'finished' && game.court_number);

// Courts currently in use by playing games
const activePlayingCourts = computed(() =>
  props.games.filter(g => g.status === 'playing' && g.court_number).map(g => g.court_number)
);

// Pending start: after court is set, auto-start this game
const pendingStartGameId = ref(null);

const handleStartGame = (game) => {
  // 1. Check if any player is currently in a playing game
  const playerIds = (game.game_players || []).map(p => p.user_id);
  const playingGames = props.games.filter(g => g.status === 'playing');
  const busyDetails = [];
  for (const pg of playingGames) {
    const pgNum = props.games.filter(g => g.id <= pg.id).length;
    for (const gp of (pg.game_players || [])) {
      if (playerIds.includes(gp.user_id)) {
        const name = gp.display_name || gp.user?.name || 'ผู้เล่น';
        busyDetails.push(`(#${pgNum})${name}`);
      }
    }
  }
  if (busyDetails.length > 0) {
    toast.add({
      severity: "warn",
      summary: "มีผู้เล่นกำลังเล่นอยู่",
      detail: `${busyDetails.join(', ')} ยังเล่นอยู่ ต้องจบเกมก่อนถึงจะเริ่มได้`,
      life: 5000,
    });
    return;
  }

  // 2. Check court number — if missing, open dialog to get it
  if (!game.court_number) {
    pendingStartGameId.value = game.id;
    toast.add({ severity: "warn", summary: "ระบุคอร์ท", detail: "กรุณาระบุเลขคอร์ทก่อนเริ่มเกม", life: 3000 });
    openCourtDialog(game);
    return;
  }

  // 3. Check court not in use
  if (activePlayingCourts.value.includes(game.court_number)) {
    toast.add({
      severity: "error",
      summary: "คอร์ทไม่ว่าง",
      detail: `คอร์ท ${game.court_number} กำลังเล่นอยู่ กรุณาเลือกคอร์ทอื่น`,
      life: 4000,
    });
    pendingStartGameId.value = game.id;
    openCourtDialog(game);
    return;
  }

  // All checks passed → emit to parent (court_number already set on game)
  emit('startGame', game.id);
};

// Start game with court in 1 request (called from saveCourtNumber when pending)
const startGameWithCourt = (gameId, courtNum) => {
  router.post(`/games/${gameId}/start`, { court_number: courtNum }, {
    preserveScroll: true,
    headers: { Accept: "application/json" },
    onSuccess: (res) => {
      const flashErr = res.props?.flash?.error;
      if (flashErr) {
        if (flashErr.playerPlaying) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีผู้เล่นบางคนกำลังเล่นอยู่ ต้องจบเกมก่อน", life: 5000 });
        if (flashErr.courtRequired) toast.add({ severity: "error", summary: t('game.court'), detail: t('game.courtRequired'), life: 3000 });
        if (flashErr.notInListing) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "เกมไม่ได้อยู่ในสถานะรอเล่น", life: 3000 });
      } else {
        toast.add({ severity: "success", summary: "สำเร็จ", detail: "เกมเริ่มต้นแล้ว", life: 3000 });
      }
    },
  });
};

// Collect unique court numbers used in this party
const usedCourtNumbers = computed(() => {
  const nums = new Set();
  // From party court bookings
  (props.party?.court_bookings || []).forEach(b => {
    if (b.court_field_number) nums.add(b.court_field_number);
  });
  // From game history
  props.games.forEach(g => { if (g.court_number) nums.add(g.court_number); });
  return [...nums].sort((a, b) => a - b);
});

const activeFilter = ref('all');

const statusOrder = { playing: 0, setting: 1, listing: 2, finished: 3 };

const props = defineProps({
  games: { type: Array, required: true },
  party: { type: Object, required: true },
  readyPlayers: { type: Array, default: () => [] },
});

const emit = defineEmits([
  'listGame',
  'startGame',
  'finishGame',
  'deleteGame',
  'autoAddPlayers',
  'addShuttlecock',
  'returnShuttlecock',
  'openScore',
]);

const isTeam1 = (team) => team === 'team1' || team === 1;
const isTeam2 = (team) => team === 'team2' || team === 2;
const isUnassigned = (team) => !team || team === 0 || team === '0';

const statusStyles = {
  setting: 'bg-warning text-warning-content',
  listing: 'bg-orange-500 text-white',
  playing: 'bg-success text-success-content',
  finished: 'bg-info text-info-content',
};

const gameStatusLabel = (status) => t(`game.status.${status}`) || status;
const gameStatusClass = (status) => statusStyles[status] || '';

const shuttlecocksTotal = (game) => {
  return game.shuttlecocks.reduce((total, sc) => total + sc.quantity, 0);
};

const isHost = props.party?.creator_id === page.props.auth.user.id;

const isPlayerInGame = (game) => {
  if (isHost) return true;
  if (!game || !game.game_players) return false;
  return game.game_players.some((player) => player.user_id === page.props.auth.user.id);
};

const getMaxPlayers = (gameType) => {
  switch (gameType) {
    case "double": return 2;
    case "quadruple": return 4;
    default: return null;
  }
};

const isGameIsFull = (game) => {
  if (!game || !game.game_players || !game.game_type) return false;
  const maxPlayers = getMaxPlayers(game.game_type);
  if (maxPlayers === null) return false;
  return game.game_players.length >= maxPlayers;
};

const playTime = (startDate, endDate) => {
  if (!startDate || !endDate) return "";
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffInSeconds = Math.floor((end - start) / 1000);

  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;

  let result = "";
  if (hours > 0) result += `${hours} ชม. `;
  if (minutes > 0) result += `${minutes} น. `;
  result += `${seconds} วิ`;
  return result.trim();
};

const hasScore = (game) => game.status === 'finished' && game.game_sets?.[0]?.winning_team;
const noScore = (game) => game.status === 'finished' && !game.game_sets?.[0]?.winning_team;

const gameWinner = (game) => {
  if (!hasScore(game) || !game.game_sets?.length) return null;
  let t1 = 0, t2 = 0;
  game.game_sets.forEach(s => {
    if (s.winning_team === 'team1') t1++;
    else if (s.winning_team === 'team2') t2++;
  });
  if (t1 > t2) return 'team1';
  if (t2 > t1) return 'team2';
  return null;
};

// Elapsed time for playing games (updates every second)
const now = ref(Date.now());
let elapsedTimer = null;

onMounted(() => {
  elapsedTimer = setInterval(() => { now.value = Date.now(); }, 1000);
});
onUnmounted(() => { if (elapsedTimer) clearInterval(elapsedTimer); });

const elapsedTime = (startDate) => {
  if (!startDate) return '0 น. 0 วิ';
  const seconds = Math.floor((now.value - new Date(startDate).getTime()) / 1000);
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} น. ${s} วิ`;
};

const sortedGames = computed(() => {
  return [...props.games].sort((a, b) => {
    const orderA = statusOrder[a.status] ?? 9;
    const orderB = statusOrder[b.status] ?? 9;
    if (orderA !== orderB) return orderA - orderB;
    // Within finished: "รอลงผล" (no score) above "ลงผลแล้ว" (has score)
    if (a.status === 'finished') {
      const aScored = a.game_sets?.[0]?.winning_team ? 1 : 0;
      const bScored = b.game_sets?.[0]?.winning_team ? 1 : 0;
      if (aScored !== bScored) return aScored - bScored;
    }
    // Same group: newer first
    return b.id - a.id;
  });
});

const filteredGames = computed(() => {
  if (activeFilter.value === 'all') return sortedGames.value;
  if (activeFilter.value === 'no_score') return sortedGames.value.filter(g => noScore(g));
  if (activeFilter.value === 'finished') return sortedGames.value.filter(g => hasScore(g));
  return sortedGames.value.filter(g => g.status === activeFilter.value);
});

const statusCounts = computed(() => {
  const counts = { playing: 0, setting: 0, listing: 0, finished: 0, no_score: 0 };
  props.games.forEach(g => {
    if (g.status === 'finished') {
      if (hasScore(g)) counts.finished++;
      counts.no_score += noScore(g) ? 1 : 0;
    } else if (counts[g.status] !== undefined) {
      counts[g.status]++;
    }
    // Don't double-count no_score in finished
  });
  return counts;
});

const filters = computed(() => [
  { key: 'all', label: t('filter.all'), idle: 'bg-base-200 text-base-content/70', active: 'bg-base-content text-base-100' },
  { key: 'playing', label: t('filter.playing'), idle: 'bg-success/15 text-success', active: 'bg-success text-success-content' },
  { key: 'listing', label: t('filter.listing'), idle: 'bg-orange-100 text-orange-600', active: 'bg-orange-500 text-white' },
  { key: 'no_score', label: t('filter.noScore'), idle: 'bg-warning/15 text-warning', active: 'bg-warning text-warning-content' },
  { key: 'finished', label: t('filter.finished'), idle: 'bg-info/15 text-info', active: 'bg-info text-info-content' },
]);
</script>

<template>
  <div class="mb-4">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-bold text-base-content m-0">{{ t('game.title') }} <span class="text-sm font-normal text-base-content/50">({{ games.length }})</span></h2>
    </div>

    <!-- Filter buttons -->
    <div class="flex flex-wrap gap-1.5 mb-3">
      <button
        v-for="f in filters"
        :key="f.key"
        class="px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all duration-200 flex items-center gap-1"
        :class="activeFilter === f.key ? f.active : f.idle"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
        <span class="text-[10px] font-bold opacity-80">{{ f.key === 'all' ? games.length : statusCounts[f.key] }}</span>
      </button>
    </div>

    <div v-if="games.length === 0" class="text-center py-10 bg-base-100 rounded-2xl border border-base-300">
      <span class="text-4xl">🏸</span>
      <p class="text-sm text-base-content/50 mt-3 m-0">{{ t('game.noGames') }}</p>
    </div>

    <div v-else-if="filteredGames.length === 0" class="text-center py-8 bg-base-100 rounded-2xl border border-base-300">
      <p class="text-sm text-base-content/50 m-0">{{ t('game.noGamesInStatus') }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        v-for="game in filteredGames"
        :key="game.id"
        class="badminton-card rounded-2xl border overflow-hidden transition-all"
        :class="{
          'shadow-sm': isPlayerInGame(game),
          'border-warning/40': game.status === 'setting',
          'border-orange-300': game.status === 'listing',
          'border-success/40': game.status === 'playing',
          'border-info/40': hasScore(game),
          'border-warning/40': noScore(game) || game.status === 'setting',
          'border-orange-300': game.status === 'listing',
          'border-success/40': game.status === 'playing',
          'bg-warning/8': game.status === 'setting',
          'bg-[#FFF3E0]': game.status === 'listing',
          'bg-success/8': game.status === 'playing',
          'bg-info/5': hasScore(game),
          'bg-warning/5': noScore(game),
        }"
      >
        <!-- Status bar top accent -->
        <div class="h-1"
          :class="{
            'bg-warning': game.status === 'setting' || noScore(game),
            'bg-orange-500': game.status === 'listing',
            'bg-success': game.status === 'playing',
            'bg-info': hasScore(game),
          }"
        ></div>

        <div class="px-3 py-2.5">
          <!-- Row 1: Header -->
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-1.5">
              <span class="text-sm font-bold text-base-content">#{{ games.length - games.indexOf(game) }}</span>
              <span class="px-1.5 py-0.5 rounded text-[10px] font-semibold" :class="gameStatusClass(game.status)">{{ gameStatusLabel(game.status) }}</span>
              <span v-if="noScore(game)" class="px-1.5 py-0.5 bg-error/15 text-error text-[10px] font-semibold rounded">{{ t('filter.noScore') }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <!-- Shuttlecocks -->
              <div class="flex items-center gap-0.5 bg-base-200 rounded-lg px-1.5 py-0.5">
                <button @click="emit('returnShuttlecock', game.id)" class="w-4 h-4 rounded flex items-center justify-center bg-error/10 text-error border-0 cursor-pointer text-[9px] font-bold hover:bg-error/20 transition-colors">−</button>
                <span class="text-[10px] font-semibold text-base-content/70 px-0.5"><img :src="shuttlecockIcon" alt="" class="w-3 h-3 inline dark:invert-0" style="filter: brightness(0) saturate(100%) invert(40%);" /> {{ shuttlecocksTotal(game) }}</span>
                <button @click="emit('addShuttlecock', game.id)" class="w-4 h-4 rounded flex items-center justify-center bg-primary/10 text-primary border-0 cursor-pointer text-[9px] font-bold hover:bg-primary/20 transition-colors">+</button>
              </div>
            </div>
          </div>

          <!-- Row 2: Teams — compact horizontal -->
          <div class="flex items-center mb-2">
            <!-- Team 1 -->
            <div class="flex-1 flex items-center justify-center gap-1.5 py-1 min-w-0 relative"
              :class="gameWinner(game) === 'team1' ? 'bg-warning/20 rounded-lg border border-warning/40' : ''">
              <span v-if="gameWinner(game) === 'team1'" class="absolute -top-4 -left-2 text-2xl -rotate-[25deg]">👑</span>
              <template v-for="player in game.game_players?.filter(p => isTeam1(p.team))" :key="player.id">
                <div class="flex flex-col items-center gap-0.5 shrink-0">
                  <UserAvatar :src="player.user?.avatar" :name="player.display_name || player.user?.name" size="md" rounded="full" class="border-2 border-base-100" />
                  <span class="text-[8px] text-base-content/50 max-w-[3rem] truncate text-center leading-none">{{ (player.display_name || player.user?.name || '').split(' ')[0] }}</span>
                </div>
              </template>
            </div>

            <!-- VS / Score / Court -->
            <div class="shrink-0 flex flex-col items-center px-3 gap-0.5">
              <!-- Court number -->
              <button
                @click="canEditCourt(game) ? openCourtDialog(game) : null"
                class="text-[9px] font-bold px-1.5 py-0.5 rounded border-0 transition-colors leading-tight"
                :class="game.court_number
                  ? (canEditCourt(game) ? 'bg-primary/10 text-primary cursor-pointer hover:bg-primary/20' : 'bg-base-200 text-base-content/50 cursor-default')
                  : 'bg-warning/15 text-warning cursor-pointer hover:bg-warning/25'"
              >{{ game.court_number ? `${t('game.court')} ${game.court_number}` : t('game.setCourt') }}</button>
              <!-- Score -->
              <template v-if="game.status === 'finished' && game.game_sets?.length">
                <div v-for="game_set in game.game_sets" :key="game_set.id" class="text-sm font-bold leading-snug"
                  :class="game_set.winning_team ? 'text-base-content/80' : 'text-base-content/30'">
                  {{ game_set.winning_team ? `${game_set.team1_score}-${game_set.team2_score}` : '?-?' }}
                </div>
              </template>
              <span v-else class="text-sm font-black text-base-content/20">VS</span>
            </div>

            <!-- Team 2 -->
            <div class="flex-1 flex items-center justify-center gap-1.5 py-1 min-w-0 relative"
              :class="gameWinner(game) === 'team2' ? 'bg-warning/20 rounded-lg border border-warning/40' : ''">
              <span v-if="gameWinner(game) === 'team2'" class="absolute -top-4 -right-2 text-2xl rotate-[25deg]">👑</span>
              <template v-for="player in game.game_players?.filter(p => isTeam2(p.team))" :key="player.id">
                <div class="flex flex-col items-center gap-0.5 shrink-0">
                  <UserAvatar :src="player.user?.avatar" :name="player.display_name || player.user?.name" size="md" rounded="full" class="border-2 border-base-100" />
                  <span class="text-[8px] text-base-content/50 max-w-[3rem] truncate text-center leading-none">{{ (player.display_name || player.user?.name || '').split(' ')[0] }}</span>
                </div>
              </template>
            </div>
          </div>

          <!-- Unassigned players -->
          <div v-if="game.game_players?.filter(p => isUnassigned(p.team)).length > 0" class="flex items-center justify-center gap-1.5 flex-wrap mb-2">
            <div v-for="player in game.game_players?.filter(p => isUnassigned(p.team))" :key="player.id" class="flex items-center gap-1">
              <UserAvatar :src="player.user?.avatar" :name="player.display_name || player.user?.name" size="xs" rounded="full" />
              <span class="text-[9px] text-base-content/50">{{ (player.display_name || player.user?.name || '').split(' ')[0] }}</span>
            </div>
          </div>

          <!-- Add player -->
          <button
            v-if="!isGameIsFull(game) && ['setting', 'listing'].includes(game.status)"
            @click="emit('autoAddPlayers', game.id)"
            class="w-full py-1.5 rounded-lg border border-dashed border-base-300 bg-transparent text-base-content/40 cursor-pointer hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all text-[10px] font-medium mb-1.5"
          >{{ t('game.addPlayers') }}</button>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-1.5 border-t border-base-200">
            <div class="flex items-center gap-1 text-[10px] text-base-content/50">
              <template v-if="game.status === 'finished'">
                <span>{{ playTime(game.game_start_date, game.game_end_date) }}</span>
              </template>
              <template v-else-if="game.status === 'playing'">
                <span class="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                <span class="text-success font-medium">{{ t('game.playing') }} ({{ elapsedTime(game.game_start_date) }})</span>
              </template>
              <template v-else>
                <span>{{ game.game_players?.length || 0 }}/{{ getMaxPlayers(game.game_type) || '?' }} {{ t('common.players') }}</span>
              </template>
            </div>

            <div class="flex items-center gap-1">
              <button v-show="game.status === 'setting'" @click="emit('listGame', game.id, $event)" class="btn btn-secondary btn-xs btn-sm h-6 min-h-0 text-[10px]">{{ t('game.list') }}</button>
              <button v-show="game.status === 'listing'" @click="handleStartGame(game)" class="btn btn-primary btn-xs btn-sm h-6 min-h-0 text-[10px]">{{ t('game.start') }}</button>
              <button v-show="['setting', 'listing'].includes(game.status)" @click="emit('deleteGame', game.id)" class="btn btn-error btn-outline btn-xs btn-sm h-6 min-h-0 text-[10px]">{{ t('common.delete') }}</button>
              <button v-show="game.status === 'playing'" @click="emit('finishGame', game.id)" class="btn btn-info btn-xs btn-sm h-6 min-h-0 text-[10px]">{{ t('game.finish') }}</button>
              <button v-if="game.status === 'finished' && isPlayerInGame(game)" @click="emit('openScore', game)" class="btn btn-success btn-xs btn-sm h-6 min-h-0 text-[10px]">{{ hasScore(game) ? t('game.editScore') : t('game.score') }}</button>
              <span v-if="game.status === 'finished' && noScore(game) && !isPlayerInGame(game)" class="text-[9px] text-base-content/40">{{ t('game.waitingScore') }}</span>
              <span v-if="game.status === 'finished' && hasScore(game) && !isPlayerInGame(game)" class="text-[9px] text-success/60">{{ t('game.scored') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Court Number Dialog -->
    <dialog class="modal" :class="{ 'modal-open': courtDialogVisible }">
      <div class="modal-box max-w-xs p-0">
        <div class="flex items-center justify-between px-4 pt-4 pb-2">
          <h3 class="text-base font-bold text-base-content m-0">🏟️ {{ t('game.courtNumber') }}</h3>
          <button @click="courtDialogVisible = false" class="w-7 h-7 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors">
            <span class="text-base-content/60 text-sm">✕</span>
          </button>
        </div>
        <div class="px-4 pb-4">
          <!-- Quick select from used courts (show busy status) -->
          <div v-if="usedCourtNumbers.length > 0" class="flex flex-wrap gap-1.5 mb-3">
            <button
              v-for="num in usedCourtNumbers"
              :key="num"
              @click="courtDialogNumber = num"
              class="h-8 min-w-[2rem] px-2 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all active:scale-95 relative"
              :class="courtDialogNumber === num
                ? 'bg-primary text-white'
                : activePlayingCourts.includes(num)
                  ? 'bg-error/10 text-error/50'
                  : 'bg-base-200 text-base-content/70 hover:bg-base-300'"
            >
              {{ num }}
              <span v-if="activePlayingCourts.includes(num)" class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error"></span>
            </button>
          </div>
          <p v-if="activePlayingCourts.length" class="text-[9px] text-base-content/30 m-0 mb-2">
            <span class="inline-block w-1.5 h-1.5 rounded-full bg-error mr-1"></span>กำลังเล่นอยู่
          </p>
          <input
            ref="courtInput"
            v-model.number="courtDialogNumber"
            type="number"
            min="1"
            :placeholder="t('game.courtNumber')"
            class="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 text-center text-2xl font-bold text-base-content focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden transition-all"
            @keyup.enter="saveCourtNumber"
          />
          <button
            @click="saveCourtNumber"
            :disabled="!courtDialogNumber || courtDialogNumber < 1"
            class="w-full mt-3 h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >{{ t('common.save') }}</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="courtDialogVisible = false">close</button>
      </form>
    </dialog>
  </div>
</template>
