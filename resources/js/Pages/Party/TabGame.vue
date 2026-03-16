<script setup>
import UserAvatar from "@/Components/UserAvatar.vue";
import { usePage } from "@inertiajs/vue3";

const page = usePage();

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

const gameStatus = (status) => {
  if (status === "setting")
    return `<span class='px-2 py-1 bg-warning text-warning-content rounded-md'>${status}</span>`;
  if (status === "listing")
    return `<span class='px-2 py-1 bg-secondary text-secondary-content rounded-md'>${status}</span>`;
  if (status === "playing")
    return `<span class='px-2 py-1 bg-success text-success-content rounded-md'>${status}</span>`;
  if (status === "finished")
    return `<span class='px-2 py-1 bg-info text-info-content rounded-md'>${status}</span>`;
};

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
</script>

<template>
  <div class="mb-4">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-bold text-base-content m-0">Games <span class="text-sm font-normal text-base-content/50">({{ games.length }})</span></h2>
    </div>

    <div v-if="games.length === 0" class="text-center py-10 bg-base-100 rounded-2xl border border-base-300">
      <span class="text-4xl">🏸</span>
      <p class="text-sm text-base-content/50 mt-3 m-0">ยังไม่มีเกม กด + New Game เพื่อเริ่มเลย!</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        v-for="(game, game_index) in games"
        :key="game.id"
        class="badminton-card bg-base-100 rounded-2xl border overflow-hidden transition-all"
        :class="isPlayerInGame(game) ? 'border-primary/40 shadow-sm' : 'border-base-300'"
      >
        <!-- Status bar top accent -->
        <div class="h-1"
          :class="{
            'bg-warning': game.status === 'setting',
            'bg-secondary': game.status === 'listing',
            'bg-success': game.status === 'playing',
            'bg-info': game.status === 'finished',
          }"
        ></div>

        <div class="p-4">
          <!-- Header: Game number + Status + Shuttlecock -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-base-content/40">GAME</span>
              <span class="text-lg font-bold text-base-content">#{{ games.length - game_index }}</span>
              <span v-html="gameStatus(game.status)"></span>
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
            <div class="flex-1 bg-base-200/60 rounded-xl p-2.5 flex flex-col items-center">
              <div class="text-[10px] font-semibold text-base-content/40 uppercase tracking-wider mb-2">Team 1</div>
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
            <div class="flex-1 bg-base-200/60 rounded-xl p-2.5 flex flex-col items-center">
              <div class="text-[10px] font-semibold text-base-content/40 uppercase tracking-wider mb-2">Team 2</div>
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
            <div class="text-[10px] font-semibold text-base-content/40 uppercase tracking-wider mb-1 text-center">รอจัดทีม</div>
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
          >+ เพิ่มผู้เล่น</button>

          <!-- Footer: Time + Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-base-200">
            <div class="flex items-center gap-1.5 text-xs text-base-content/50">
              <template v-if="game.status === 'finished'">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>{{ playTime(game.game_start_date, game.game_end_date) }}</span>
              </template>
              <template v-else-if="game.status === 'playing'">
                <span class="inline-block w-2 h-2 rounded-full bg-success animate-pulse"></span>
                <span class="text-success font-medium">กำลังเล่น</span>
              </template>
              <template v-else>
                <span>{{ game.game_players?.length || 0 }}/{{ getMaxPlayers(game.game_type) || '?' }} คน</span>
              </template>
            </div>

            <div class="flex items-center gap-1.5">
              <button v-show="game.status === 'setting'" @click="emit('listGame', game.id, $event)" class="btn btn-secondary btn-xs">List</button>
              <button v-show="game.status === 'listing'" @click="emit('startGame', game.id)" class="btn btn-primary btn-xs">Start</button>
              <button v-show="['setting', 'listing'].includes(game.status)" @click="emit('deleteGame', game.id)" class="btn btn-error btn-outline btn-xs">Delete</button>
              <button v-show="game.status === 'playing'" @click="emit('finishGame', game.id)" class="btn btn-info btn-xs">Finish</button>
              <button v-if="game.status === 'finished' && isPlayerInGame(game)" @click="emit('openScore', game)" class="btn btn-success btn-xs">ลงผล</button>
              <span v-if="game.status === 'finished' && !game.game_sets?.[0]?.winning_team && !isPlayerInGame(game)" class="text-[10px] text-base-content/40">รอลงผล</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
