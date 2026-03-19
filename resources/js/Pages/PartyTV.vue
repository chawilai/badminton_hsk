<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Head, usePage, router } from "@inertiajs/vue3";
import { Realtime } from "ably";
import UserAvatar from "@/Components/UserAvatar.vue";
import { useBadmintonLayout } from "@/layout/composables/badmintonLayout";

const { initTheme } = useBadmintonLayout();
const page = usePage();

const party = computed(() => page.props.party);
const playingGames = ref(page.props.playingGames ?? []);
const listingGames = ref(page.props.listingGames ?? []);
const readyPlayers = ref(page.props.readyPlayers ?? []);
const breakPlayers = ref(page.props.breakPlayers ?? []);
const avgGameDuration = computed(() => page.props.avgGameDuration ?? 15);
const courtBookings = computed(() => party.value.court_bookings ?? []);

// Combine courts from bookings + active games (in case court_number differs from booking)
const bookedCourts = computed(() => {
  const fromBookings = courtBookings.value.map(b => b.court_field_number);
  const fromPlaying = playingGames.value.map(g => g.court_number).filter(n => n != null);
  const fromListing = listingGames.value.map(g => g.court_number).filter(n => n != null);
  const all = [...new Set([...fromBookings, ...fromPlaying, ...fromListing])];
  return all.sort((a, b) => a - b);
});

// Players in listing/setting games (assigned but waiting to start)
const listingPlayers = computed(() => {
  const players = [];
  for (const game of listingGames.value) {
    for (const gp of (game.game_players || [])) {
      players.push({
        user_id: gp.user_id,
        name: gp.user?.name,
        display_name: gp.display_name || gp.user?.name,
        avatar: gp.user?.avatar,
        game_number: game.game_number,
        game_status: game.status,
        court_number: game.court_number,
      });
    }
  }
  return players;
});

// Live clock
const now = ref(new Date());
let clockTimer = null;

// Screen rotation
const currentScreen = ref('playing');
const isLocked = ref(false);
let rotateTimer = null;

const switchScreen = (screen) => {
  currentScreen.value = screen;
  resetRotateTimer();
};

const toggleLock = () => {
  isLocked.value = !isLocked.value;
  if (isLocked.value) {
    if (rotateTimer) { clearInterval(rotateTimer); rotateTimer = null; }
  } else {
    startRotateTimer();
  }
};

const startRotateTimer = () => {
  if (rotateTimer) clearInterval(rotateTimer);
  rotateTimer = setInterval(() => {
    if (!isLocked.value) {
      currentScreen.value = currentScreen.value === 'playing' ? 'waiting' : 'playing';
    }
  }, 10000);
};

const resetRotateTimer = () => {
  if (!isLocked.value) startRotateTimer();
};

// Grid layout: NxN square grid
// 1=1x1, 2-4=2x2, 5-9=3x3, 10-16=4x4, 17-25=5x5
const gridSize = computed(() => {
  const count = bookedCourts.value.length;
  if (count <= 1) return 1;
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  if (count <= 16) return 4;
  return 5;
});

const gridCols = computed(() => gridSize.value);

const gridRows = computed(() => gridSize.value);

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gridCols.value}, 1fr)`,
  gridTemplateRows: `repeat(${gridRows.value}, 1fr)`,
}));

// Total cells for sizing calculations
const totalCells = computed(() => gridCols.value * gridRows.value);

// Font size scaling based on total courts
const courtTextSize = computed(() => {
  const count = bookedCourts.value.length;
  if (count <= 2) return 'text-2xl';
  if (count <= 4) return 'text-xl';
  if (count <= 6) return 'text-lg';
  if (count <= 8) return 'text-base';
  return 'text-sm';
});

const playerNameSize = computed(() => {
  const count = bookedCourts.value.length;
  if (count <= 2) return 'text-2xl';
  if (count <= 4) return 'text-xl';
  if (count <= 6) return 'text-lg';
  if (count <= 8) return 'text-base';
  return 'text-sm';
});

const avatarSize = computed(() => {
  const count = bookedCourts.value.length;
  if (count <= 2) return '2xl';
  if (count <= 4) return 'xl';
  if (count <= 6) return 'lg';
  if (count <= 8) return 'md';
  return 'sm';
});

// Max name length before marquee kicks in
const maxNameLen = computed(() => {
  const count = bookedCourts.value.length;
  if (count <= 2) return 16;
  if (count <= 4) return 12;
  if (count <= 6) return 10;
  return 8;
});

const displayName = (player) => player.display_name || player.user?.name || '';

// Listing games that can't show on a court card
// (no court, OR court is occupied by a playing game)
const queuedListingGames = computed(() => {
  const playingCourtSet = new Set(playingGames.value.map(g => g.court_number).filter(Boolean));
  return listingGames.value.filter(g => !g.court_number || playingCourtSet.has(g.court_number));
});

const isLongName = (player) => displayName(player).length > maxNameLen.value;

// Get game playing on a specific court
const getGameOnCourt = (courtNumber) => {
  return playingGames.value.find(g => g.court_number === courtNumber);
};

// Get listing/setting game on a specific court
const getListingGameOnCourt = (courtNumber) => {
  return listingGames.value.find(g => g.court_number === courtNumber);
};

// Elapsed time in mm:ss
const elapsedTime = (gameStartDate) => {
  if (!gameStartDate) return '00:00';
  const start = new Date(gameStartDate);
  const diff = Math.max(0, Math.floor((now.value - start) / 1000));
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// Players by team (DB stores 'team1'/'team2')
const teamPlayers = (game, team) => {
  return (game.game_players || []).filter(p => p.team === team);
};

// Sorted ready players (longest waiting first)
const sortedReadyPlayers = computed(() => {
  return [...readyPlayers.value].sort((a, b) => (b.waiting_time || 0) - (a.waiting_time || 0));
});

// Estimated wait time for a player at given position
const estimatedWait = (index) => {
  const courts = bookedCourts.value.length || 1;
  const playersPerGame = party.value.default_game_type === 'double' ? 2 : 4;
  const slotsPerRound = courts * playersPerGame;
  const roundsToWait = Math.ceil((index + 1) / slotsPerRound);
  return Math.round(avgGameDuration.value * roundsToWait);
};

// Format waiting time
const formatWaitTime = (seconds) => {
  if (!seconds || seconds < 60) return '< 1 นาที';
  const mins = Math.floor(seconds / 60);
  return `${mins} นาที`;
};

// Clock display
const clockDisplay = computed(() => {
  return now.value.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Bangkok' });
});

// ===== Ably Real-time =====
let ablyInstance = null;
let partyChannel = null;

let reloading = false;
const handlePartyEvent = (message) => {
  // Only handle actual message events (ignore state changes like [REJ])
  if (!message || !message.name) return;
  if (reloading) return;
  reloading = true;

  router.reload({
    preserveScroll: true,
    only: ['playingGames', 'listingGames', 'readyPlayers', 'breakPlayers', 'avgGameDuration'],
    onSuccess: (p) => {
      playingGames.value = p.props.playingGames ?? [];
      listingGames.value = p.props.listingGames ?? [];
      readyPlayers.value = p.props.readyPlayers ?? [];
      breakPlayers.value = p.props.breakPlayers ?? [];
    },
    onFinish: () => { reloading = false; },
  });
};

onMounted(() => {
  initTheme();

  // Clock update every second
  clockTimer = setInterval(() => { now.value = new Date(); }, 1000);

  // Screen rotation every 10 seconds
  startRotateTimer();

  // Ably subscription
  const ablyKey = page.props.ably_key;
  if (ablyKey) {
    ablyInstance = new Realtime({ key: ablyKey, clientId: `tv-${page.props.auth.user.id}`, log: { level: 0 } });
    partyChannel = ablyInstance.channels.get(`party.${party.value.id}`);
    partyChannel.subscribe(handlePartyEvent);
    // Silently handle connection errors
    ablyInstance.connection.on('failed', () => {});
    ablyInstance.connection.on('suspended', () => {});
  }
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
  if (rotateTimer) clearInterval(rotateTimer);
  if (partyChannel) { partyChannel.unsubscribe(); partyChannel.detach(); }
  if (ablyInstance) ablyInstance.close();
});
</script>

<template>
  <Head :title="`TV - ${party.name || party.court?.name || 'Party'}`" />

  <div class="w-screen h-screen bg-neutral text-neutral-content overflow-hidden flex flex-col" data-theme="badminton-dark">
    <!-- Header Bar -->
    <header class="flex items-center justify-between px-6 py-3 bg-base-300/50 shrink-0">
      <div class="flex items-center gap-3">
        <span class="text-2xl">🏸</span>
        <div>
          <div class="text-lg font-bold text-primary">{{ party.name || party.court?.name || 'Party' }}</div>
          <div class="text-xs text-base-content/50">{{ party.court?.name }} · {{ party.start_time?.substring(0,5) }} - {{ party.end_time?.substring(0,5) }}</div>
        </div>
      </div>

      <div class="flex items-center gap-6">
        <!-- Stats -->
        <div class="flex items-center gap-4 text-sm">
          <span class="text-base-content/60">👥 {{ party.members_count }} คน</span>
          <span class="text-primary">🏸 {{ playingGames.length }} เกมกำลังเล่น</span>
          <span v-if="listingPlayers.length" class="text-warning">📋 {{ listingPlayers.length }} รอลงสนาม</span>
          <span class="text-accent">⏳ {{ sortedReadyPlayers.length }} คนรอ</span>
        </div>

        <!-- Screen switch + lock -->
        <div class="flex items-center gap-2">
          <button @click="switchScreen('playing')" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-0 cursor-pointer transition-all"
            :class="currentScreen === 'playing' ? 'bg-primary/20 text-primary' : 'bg-transparent text-base-content/30 hover:text-base-content/50'">
            <div class="w-2.5 h-2.5 rounded-full transition-all" :class="currentScreen === 'playing' ? 'bg-primary scale-110' : 'bg-base-content/20'"></div>
            <span class="text-xs font-medium">สนาม</span>
          </button>
          <button @click="switchScreen('waiting')" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-0 cursor-pointer transition-all"
            :class="currentScreen === 'waiting' ? 'bg-accent/20 text-accent' : 'bg-transparent text-base-content/30 hover:text-base-content/50'">
            <div class="w-2.5 h-2.5 rounded-full transition-all" :class="currentScreen === 'waiting' ? 'bg-accent scale-110' : 'bg-base-content/20'"></div>
            <span class="text-xs font-medium">รอคิว</span>
          </button>
          <button @click="toggleLock" class="w-8 h-8 rounded-lg border-0 cursor-pointer flex items-center justify-center transition-all"
            :class="isLocked ? 'bg-error/20 text-error' : 'bg-base-content/5 text-base-content/30 hover:text-base-content/50'"
            :title="isLocked ? 'ปลดล็อก (เลื่อนอัตโนมัติ)' : 'ล็อกหน้าจอนี้'">
            <svg v-if="isLocked" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
          </button>
        </div>

        <!-- Clock -->
        <div class="text-2xl font-mono font-bold text-base-content/80 tabular-nums">{{ clockDisplay }}</div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 relative overflow-hidden">
      <!-- Playing Screen -->
      <transition name="tv-slide">
        <div v-if="currentScreen === 'playing'" key="playing" class="absolute inset-0 p-3 flex flex-col gap-2">
          <div class="grid gap-3 flex-1 min-h-0" :style="gridStyle">
            <div
              v-for="courtNum in bookedCourts"
              :key="courtNum"
              class="rounded-2xl border-2 overflow-hidden flex flex-col transition-all w-full h-full"
              :class="getGameOnCourt(courtNum) ? 'border-primary/40 bg-court-900/80' : getListingGameOnCourt(courtNum) ? 'border-warning/40 bg-warning/5' : 'border-base-content/10 bg-base-300/30'"
            >
              <!-- Court header -->
              <div class="flex items-center justify-between px-4 py-2 bg-base-300/30">
                <div class="flex items-center gap-2">
                  <span class="text-lg">🏟️</span>
                  <span :class="courtTextSize" class="font-bold text-base-content">Court {{ courtNum }}</span>
                </div>
                <template v-if="getGameOnCourt(courtNum)">
                  <div class="flex items-center gap-3">
                    <span class="text-xs text-base-content/50">Game #{{ getGameOnCourt(courtNum).game_number }}</span>
                    <div class="px-3 py-1 rounded-full bg-primary/20 text-primary font-mono font-bold tabular-nums" :class="courtTextSize">
                      {{ elapsedTime(getGameOnCourt(courtNum).game_start_date) }}
                    </div>
                  </div>
                </template>
                <template v-else-if="getListingGameOnCourt(courtNum)">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-base-content/50">Game #{{ getListingGameOnCourt(courtNum).game_number }}</span>
                    <div class="px-3 py-1 rounded-full bg-warning/20 text-warning text-xs font-bold animate-pulse">
                      {{ getListingGameOnCourt(courtNum).status === 'setting' ? '🔧 กำลังจัดคู่' : '📋 รอลงสนาม' }}
                    </div>
                  </div>
                </template>
                <span v-else class="text-sm text-success font-semibold">ว่าง</span>
              </div>

              <!-- Game content -->
              <div v-if="getGameOnCourt(courtNum)" class="flex-1 flex items-center justify-center px-6 py-3 gap-4">
                <!-- Team 1 -->
                <div class="flex-1 flex flex-col items-center gap-3">
                  <div v-for="p in teamPlayers(getGameOnCourt(courtNum), 'team1')" :key="p.user_id" class="flex items-center gap-3">
                    <UserAvatar :src="p.user?.avatar" :name="displayName(p)" :size="avatarSize" rounded="full" class="border-2 border-info/30 shrink-0" />
                    <div class="overflow-hidden" :style="{ maxWidth: maxNameLen * 1.2 + 'ch' }">
                      <span :class="[playerNameSize, isLongName(p) ? 'tv-marquee' : '']" class="font-semibold text-base-content whitespace-nowrap inline-block">{{ displayName(p) }}</span>
                    </div>
                  </div>
                </div>

                <!-- VS -->
                <div class="text-3xl font-bold text-base-content/20 shrink-0">VS</div>

                <!-- Team 2 -->
                <div class="flex-1 flex flex-col items-center gap-3">
                  <div v-for="p in teamPlayers(getGameOnCourt(courtNum), 'team2')" :key="p.user_id" class="flex items-center gap-3">
                    <div class="overflow-hidden" :style="{ maxWidth: maxNameLen * 1.2 + 'ch' }">
                      <span :class="[playerNameSize, isLongName(p) ? 'tv-marquee' : '']" class="font-semibold text-base-content whitespace-nowrap inline-block text-right">{{ displayName(p) }}</span>
                    </div>
                    <UserAvatar :src="p.user?.avatar" :name="displayName(p)" :size="avatarSize" rounded="full" class="border-2 border-error/30 shrink-0" />
                  </div>
                </div>
              </div>

              <!-- Listing game on court (waiting to start) -->
              <div v-else-if="getListingGameOnCourt(courtNum)" class="flex-1 flex items-center justify-center px-6 py-3 gap-4">
                <div class="flex-1 flex flex-col items-center gap-3">
                  <div v-for="p in teamPlayers(getListingGameOnCourt(courtNum), 'team1')" :key="p.user_id" class="flex items-center gap-3 opacity-70">
                    <UserAvatar :src="p.user?.avatar" :name="displayName(p)" :size="avatarSize" rounded="full" class="border-2 border-warning/30 shrink-0" />
                    <div class="overflow-hidden" :style="{ maxWidth: maxNameLen * 1.2 + 'ch' }">
                      <span :class="[playerNameSize, isLongName(p) ? 'tv-marquee' : '']" class="font-semibold text-base-content/70 whitespace-nowrap inline-block">{{ displayName(p) }}</span>
                    </div>
                  </div>
                </div>
                <div class="text-3xl font-bold text-warning/30 shrink-0">VS</div>
                <div class="flex-1 flex flex-col items-center gap-3">
                  <div v-for="p in teamPlayers(getListingGameOnCourt(courtNum), 'team2')" :key="p.user_id" class="flex items-center gap-3 opacity-70">
                    <div class="overflow-hidden" :style="{ maxWidth: maxNameLen * 1.2 + 'ch' }">
                      <span :class="[playerNameSize, isLongName(p) ? 'tv-marquee' : '']" class="font-semibold text-base-content/70 whitespace-nowrap inline-block text-right">{{ displayName(p) }}</span>
                    </div>
                    <UserAvatar :src="p.user?.avatar" :name="displayName(p)" :size="avatarSize" rounded="full" class="border-2 border-warning/30 shrink-0" />
                  </div>
                </div>
              </div>

              <!-- Empty court -->
              <div v-else class="flex-1 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-4xl mb-2 opacity-20">🏸</div>
                  <div class="text-base-content/30 text-sm">พร้อมใช้งาน</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Listing queue (games waiting to start, no court assigned) -->
          <div v-if="queuedListingGames.length > 0" class="shrink-0 flex items-center gap-3 px-3 py-2 bg-warning/10 rounded-xl border border-warning/20 overflow-x-auto">
            <div class="flex items-center gap-1.5 shrink-0">
              <span class="text-sm">📋</span>
              <span class="text-xs font-bold text-warning">รอเล่น</span>
            </div>
            <div v-for="game in queuedListingGames" :key="game.id"
              class="flex items-center gap-2 px-3 py-1.5 bg-warning/10 rounded-lg border border-warning/15 shrink-0">
              <span class="text-[10px] font-bold text-warning/60">#{{ game.game_number }}</span>
              <span v-if="game.court_number" class="text-[9px] font-bold text-warning/40 bg-warning/10 px-1 rounded">🏟️{{ game.court_number }}</span>
              <div class="flex items-center gap-1">
                <template v-for="p in teamPlayers(game, 'team1')" :key="'t1-'+p.user_id">
                  <UserAvatar :src="p.user?.avatar" :name="displayName(p)" size="sm" rounded="full" />
                </template>
              </div>
              <span class="text-xs text-warning/40 font-bold">vs</span>
              <div class="flex items-center gap-1">
                <template v-for="p in teamPlayers(game, 'team2')" :key="'t2-'+p.user_id">
                  <UserAvatar :src="p.user?.avatar" :name="displayName(p)" size="sm" rounded="full" />
                </template>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- Waiting Screen -->
      <transition name="tv-slide">
        <div v-if="currentScreen === 'waiting'" key="waiting" class="absolute inset-0 p-4 flex flex-col">
          <!-- Section title -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-3">
              <span class="text-2xl">⏳</span>
              <span class="text-xl font-bold text-accent">สถานะผู้เล่น</span>
            </div>
            <div class="text-sm text-base-content/40">
              เวลาเฉลี่ยต่อเกม: <span class="text-accent font-bold">{{ avgGameDuration }} นาที</span>
            </div>
          </div>

          <div class="flex-1 overflow-hidden flex flex-col gap-3">
            <!-- Group 1: Listing players (assigned to game, waiting to start) -->
            <div v-if="listingPlayers.length > 0">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm">📋</span>
                <span class="text-sm font-bold text-warning">รอลงสนาม ({{ listingPlayers.length }})</span>
              </div>
              <div class="grid grid-cols-2 gap-x-6 gap-y-1.5">
                <div
                  v-for="player in listingPlayers"
                  :key="'listing-' + player.user_id"
                  class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-warning/10 border border-warning/20"
                >
                  <div class="w-7 h-7 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                    <span class="text-xs">📋</span>
                  </div>
                  <UserAvatar :src="player.avatar" :name="player.display_name || player.name" size="md" rounded="full" />
                  <div class="flex-1 min-w-0">
                    <div class="text-base font-semibold text-base-content truncate">{{ player.display_name || player.name }}</div>
                    <div class="text-xs text-warning/70">
                      Game #{{ player.game_number }} · {{ player.court_number ? `Court ${player.court_number}` : 'รอกำหนดสนาม' }}
                    </div>
                  </div>
                  <div class="text-xs font-bold text-warning shrink-0">กำลังจะเล่น</div>
                </div>
              </div>
            </div>

            <!-- Group 2: Ready players (waiting in queue) -->
            <div v-if="sortedReadyPlayers.length > 0" class="flex-1 overflow-hidden">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm">⏳</span>
                <span class="text-sm font-bold text-accent">รอคิว ({{ sortedReadyPlayers.length }})</span>
              </div>
              <div class="grid grid-cols-2 gap-x-6 gap-y-1.5 content-start overflow-hidden">
                <div
                  v-for="(player, index) in sortedReadyPlayers"
                  :key="player.user_id"
                  class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-base-300/20 border border-base-content/5"
                >
                  <div class="w-7 h-7 rounded-full bg-base-content/10 flex items-center justify-center text-xs font-bold text-base-content/50 shrink-0">
                    {{ index + 1 }}
                  </div>
                  <UserAvatar :src="player.avatar" :name="player.display_name || player.name" size="md" rounded="full" />
                  <div class="flex-1 min-w-0">
                    <div class="text-base font-semibold text-base-content truncate">{{ player.display_name || player.name }}</div>
                    <div class="text-xs text-base-content/40">
                      เล่นแล้ว {{ player.finished_games_count }} เกม · รอ {{ formatWaitTime(player.waiting_time) }}
                    </div>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="text-xs text-base-content/30">คาดว่ารอ</div>
                    <div class="text-sm font-bold text-accent">~{{ estimatedWait(index) }} นาที</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Group 3: Break players -->
            <div v-if="breakPlayers.length > 0" class="pt-2 border-t border-base-content/10">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm">☕</span>
                <span class="text-sm font-bold text-base-content/40">พักผ่อน ({{ breakPlayers.length }})</span>
              </div>
              <div class="flex gap-3 flex-wrap">
                <div v-for="p in breakPlayers" :key="p.user_id" class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-300/20 border border-base-content/5">
                  <UserAvatar :src="p.avatar" :name="p.display_name || p.name" size="sm" rounded="full" class="opacity-50" />
                  <span class="text-sm text-base-content/40">{{ p.display_name || p.name }}</span>
                  <span class="text-[10px] text-base-content/20">☕</span>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-if="listingPlayers.length === 0 && sortedReadyPlayers.length === 0 && breakPlayers.length === 0" class="flex-1 flex items-center justify-center">
              <div class="text-center">
                <div class="text-5xl mb-3 opacity-20">🏸</div>
                <div class="text-lg text-base-content/30">ทุกคนกำลังเล่นอยู่!</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </main>
  </div>
</template>

<style scoped>
/* Slow marquee for long player names */
.tv-marquee {
  animation: tv-scroll 5s linear infinite alternate;
}
@keyframes tv-scroll {
  0%, 25% { transform: translateX(0); }
  75%, 100% { transform: translateX(calc(-100% + 8ch)); }
}

/* Court cards fill their grid cell fully */

/* Screen transition */
.tv-slide-enter-active,
.tv-slide-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.tv-slide-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.tv-slide-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}
</style>
