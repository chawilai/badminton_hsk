<script setup>
import UserAvatar from "@/Components/UserAvatar.vue";
import { usePage } from "@inertiajs/vue3";
import { ref, computed } from "vue";
import { useLocale } from "@/composables/useLocale";

const page = usePage();
const { t } = useLocale();

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

const isPlayerInGame = (game) => {
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

const sortedGames = computed(() => {
  return [...props.games].sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));
});

const filteredGames = computed(() => {
  if (activeFilter.value === 'all') return sortedGames.value;
  if (activeFilter.value === 'no_score') return sortedGames.value.filter(g => noScore(g));
  return sortedGames.value.filter(g => g.status === activeFilter.value);
});

const statusCounts = computed(() => {
  const counts = { playing: 0, setting: 0, listing: 0, finished: 0, no_score: 0 };
  props.games.forEach(g => {
    if (counts[g.status] !== undefined) counts[g.status]++;
    if (noScore(g)) counts.no_score++;
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

        <div class="p-4">
          <!-- Header: Game number + Status + Shuttlecock -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-base-content/40">{{ t('game.game') }}</span>
              <span class="text-lg font-bold text-base-content">#{{ games.length - games.indexOf(game) }}</span>
              <span class="px-2 py-1 rounded-md text-xs font-semibold" :class="gameStatusClass(game.status)">{{ gameStatusLabel(game.status) }}</span>
              <span v-if="noScore(game)" class="px-2 py-1 bg-error/15 text-error text-xs font-semibold rounded-md">{{ t('filter.noScore') }}</span>
            </div>
            <div class="flex items-center gap-1 bg-base-200 rounded-lg px-2 py-1">
              <button @click="emit('returnShuttlecock', game.id)" class="w-5 h-5 rounded flex items-center justify-center bg-error/10 text-error border-0 cursor-pointer text-[10px] font-bold hover:bg-error/20 transition-colors">−</button>
              <span class="text-xs font-semibold text-base-content/70 px-1" title="Shuttlecocks">🏸 {{ shuttlecocksTotal(game) }}</span>
              <button @click="emit('addShuttlecock', game.id)" class="w-5 h-5 rounded flex items-center justify-center bg-primary/10 text-primary border-0 cursor-pointer text-[10px] font-bold hover:bg-primary/20 transition-colors">+</button>
            </div>
          </div>

          <!-- Teams display -->
          <div class="flex items-stretch gap-2 mb-3">
            <!-- Team 1 -->
            <div class="flex-1 rounded-xl p-2.5 flex flex-col items-center relative"
              :class="gameWinner(game) === 'team1' ? 'bg-warning/10 border border-warning/30' : 'bg-base-200/60'">
              <span v-if="gameWinner(game) === 'team1'" class="absolute -top-3.5 -left-2 text-2xl -rotate-[25deg]">👑</span>
              <div class="text-[10px] font-semibold uppercase tracking-wider mb-2"
                :class="gameWinner(game) === 'team1' ? 'text-warning font-bold' : 'text-base-content/40'">Team 1</div>
              <div class="flex items-center justify-center gap-2.5 flex-1">
                <template v-for="player in game.game_players?.filter(p => isTeam1(p.team))" :key="player.id">
                  <div class="flex flex-col items-center gap-0.5">
                    <UserAvatar :src="player.user?.avatar" :name="player.display_name || player.user?.name" size="md" rounded="full" class="border-2 border-base-100" />
                    <span class="text-[9px] text-base-content/60 max-w-[4rem] truncate text-center">{{ (player.display_name || player.user?.name || '').split(' ')[0] }}</span>
                  </div>
                </template>
                <template v-if="game.game_players?.filter(p => isTeam1(p.team)).length === 0">
                  <span class="text-xs text-base-content/30 italic">ยังไม่มีผู้เล่น</span>
                </template>
              </div>
            </div>

            <!-- VS -->
            <div class="shrink-0 flex flex-col items-center justify-center px-1">
              <span class="text-[10px] font-black text-base-content/30">VS</span>
              <div v-if="game.status === 'finished' && game.game_sets?.length" class="mt-0.5">
                <div v-for="game_set in game.game_sets" :key="game_set.id" class="text-[10px] font-bold text-center leading-tight"
                  :class="game_set.winning_team ? 'text-base-content/70' : 'text-base-content/30'">
                  {{ game_set.winning_team ? `${game_set.team1_score}-${game_set.team2_score}` : '?-?' }}
                </div>
              </div>
            </div>

            <!-- Team 2 -->
            <div class="flex-1 rounded-xl p-2.5 flex flex-col items-center relative"
              :class="gameWinner(game) === 'team2' ? 'bg-warning/10 border border-warning/30' : 'bg-base-200/60'">
              <span v-if="gameWinner(game) === 'team2'" class="absolute -top-3.5 -right-2 text-2xl rotate-[25deg]">👑</span>
              <div class="text-[10px] font-semibold uppercase tracking-wider mb-2"
                :class="gameWinner(game) === 'team2' ? 'text-warning font-bold' : 'text-base-content/40'">Team 2</div>
              <div class="flex items-center justify-center gap-2.5 flex-1">
                <template v-for="player in game.game_players?.filter(p => isTeam2(p.team))" :key="player.id">
                  <div class="flex flex-col items-center gap-0.5">
                    <UserAvatar :src="player.user?.avatar" :name="player.display_name || player.user?.name" size="md" rounded="full" class="border-2 border-base-100" />
                    <span class="text-[9px] text-base-content/60 max-w-[4rem] truncate text-center">{{ (player.display_name || player.user?.name || '').split(' ')[0] }}</span>
                  </div>
                </template>
                <template v-if="game.game_players?.filter(p => isTeam2(p.team)).length === 0">
                  <span class="text-xs text-base-content/30 italic">ยังไม่มีผู้เล่น</span>
                </template>
              </div>
            </div>
          </div>

          <!-- Unassigned players (no team yet) -->
          <div v-if="game.game_players?.filter(p => isUnassigned(p.team)).length > 0" class="mb-3">
            <div class="text-[10px] font-semibold text-base-content/40 uppercase tracking-wider mb-1 text-center">{{ t('game.waitingTeam') }}</div>
            <div class="flex items-center justify-center gap-2.5 flex-wrap">
              <div v-for="player in game.game_players?.filter(p => isUnassigned(p.team))" :key="player.id" class="flex flex-col items-center gap-0.5">
                <UserAvatar :src="player.user?.avatar" :name="player.display_name || player.user?.name" size="md" rounded="full" />
                <span class="text-[9px] text-base-content/60 max-w-[4rem] truncate text-center">{{ (player.display_name || player.user?.name || '').split(' ')[0] }}</span>
              </div>
            </div>
          </div>

          <!-- Add player button -->
          <button
            v-if="!isGameIsFull(game) && ['setting', 'listing'].includes(game.status)"
            @click="emit('autoAddPlayers', game.id)"
            class="w-full py-2 rounded-xl border-2 border-dashed border-base-300 bg-transparent text-base-content/40 cursor-pointer hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all text-xs font-medium mb-3"
          >{{ t('game.addPlayers') }}</button>

          <!-- Footer: Time + Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-base-200">
            <div class="flex items-center gap-1.5 text-xs text-base-content/50">
              <template v-if="game.status === 'finished'">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>{{ playTime(game.game_start_date, game.game_end_date) }}</span>
              </template>
              <template v-else-if="game.status === 'playing'">
                <span class="inline-block w-2 h-2 rounded-full bg-success animate-pulse"></span>
                <span class="text-success font-medium">{{ t('game.playing') }}</span>
              </template>
              <template v-else>
                <span>{{ game.game_players?.length || 0 }}/{{ getMaxPlayers(game.game_type) || '?' }} คน</span>
              </template>
            </div>

            <div class="flex items-center gap-1.5">
              <button v-show="game.status === 'setting'" @click="emit('listGame', game.id, $event)" class="btn btn-secondary btn-xs">{{ t('game.list') }}</button>
              <button v-show="game.status === 'listing'" @click="emit('startGame', game.id)" class="btn btn-primary btn-xs">{{ t('game.start') }}</button>
              <button v-show="['setting', 'listing'].includes(game.status)" @click="emit('deleteGame', game.id)" class="btn btn-error btn-outline btn-xs">{{ t('common.delete') }}</button>
              <button v-show="game.status === 'playing'" @click="emit('finishGame', game.id)" class="btn btn-info btn-xs">{{ t('game.finish') }}</button>
              <button v-if="game.status === 'finished' && isPlayerInGame(game)" @click="emit('openScore', game)" class="btn btn-success btn-xs">{{ t('game.score') }}</button>
              <span v-if="game.status === 'finished' && !game.game_sets?.[0]?.winning_team && !isPlayerInGame(game)" class="text-[10px] text-base-content/40">{{ t('game.waitingScore') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
