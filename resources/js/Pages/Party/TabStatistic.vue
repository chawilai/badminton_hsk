<script setup>
import UserAvatar from "@/Components/UserAvatar.vue";
import { computed } from "vue";

const props = defineProps({
  games: { type: Array, required: true },
  party: { type: Object, required: true },
});

const isTeam1 = (team) => team === 'team1' || team === 1;
const isTeam2 = (team) => team === 'team2' || team === 2;
const hasTeam = (team) => isTeam1(team) || isTeam2(team);
const sameTeam = (t1, t2) => (isTeam1(t1) && isTeam1(t2)) || (isTeam2(t1) && isTeam2(t2));

// Only finished games count for stats
const finishedGames = computed(() => props.games.filter(g => g.status === 'finished'));

// Build member lookup from party.members
const memberMap = computed(() => {
  const map = {};
  if (props.party.members) {
    props.party.members.forEach(m => {
      map[m.user_id] = m;
    });
  }
  return map;
});

// Per-player stats
const playerStats = computed(() => {
  const stats = {};

  finishedGames.value.forEach(game => {
    if (!game.game_players || !game.game_sets?.length) return;

    // Determine game winner from sets
    let team1SetWins = 0;
    let team2SetWins = 0;
    game.game_sets.forEach(s => {
      if (s.winning_team === 'team1') team1SetWins++;
      else if (s.winning_team === 'team2') team2SetWins++;
    });
    const gameWinnerTeam = team1SetWins > team2SetWins ? 'team1' : (team2SetWins > team1SetWins ? 'team2' : null);

    game.game_players.forEach(player => {
      const uid = player.user_id;
      if (!stats[uid]) {
        stats[uid] = {
          user_id: uid,
          name: player.display_name || player.user?.name || 'Unknown',
          avatar: player.user?.avatar,
          games: 0,
          wins: 0,
          losses: 0,
          teammates: {},
          opponents: {},
        };
      }
      stats[uid].games++;

      if (gameWinnerTeam && hasTeam(player.team)) {
        if ((isTeam1(player.team) && gameWinnerTeam === 'team1') || (isTeam2(player.team) && gameWinnerTeam === 'team2')) {
          stats[uid].wins++;
        } else {
          stats[uid].losses++;
        }
      }

      // Track teammates and opponents
      game.game_players.forEach(other => {
        if (other.user_id === uid) return;
        if (hasTeam(player.team) && hasTeam(other.team)) {
          if (sameTeam(player.team, other.team)) {
            stats[uid].teammates[other.user_id] = (stats[uid].teammates[other.user_id] || 0) + 1;
          } else {
            stats[uid].opponents[other.user_id] = (stats[uid].opponents[other.user_id] || 0) + 1;
          }
        }
      });
    });
  });

  return Object.values(stats).sort((a, b) => b.games - a.games);
});

// MVP: highest win rate with min 2 games
const mvp = computed(() => {
  const eligible = playerStats.value.filter(p => p.games >= 2);
  if (!eligible.length) return null;
  return eligible.reduce((best, p) => {
    const rate = p.games > 0 ? p.wins / p.games : 0;
    const bestRate = best.games > 0 ? best.wins / best.games : 0;
    return rate > bestRate ? p : best;
  });
});

// Summary stats
const summary = computed(() => {
  const totalShuttlecocks = props.games.reduce((sum, g) => {
    return sum + (g.shuttlecocks?.reduce((s, sc) => s + sc.quantity, 0) || 0);
  }, 0);

  const durations = finishedGames.value
    .filter(g => g.game_start_date && g.game_end_date)
    .map(g => {
      const start = new Date(g.game_start_date);
      const end = new Date(g.game_end_date);
      return Math.floor((end - start) / 1000);
    })
    .filter(d => d > 0);

  const avgDuration = durations.length > 0
    ? Math.floor(durations.reduce((s, d) => s + d, 0) / durations.length)
    : 0;

  return {
    totalGames: props.games.length,
    finishedGames: finishedGames.value.length,
    totalShuttlecocks,
    avgDurationMinutes: Math.floor(avgDuration / 60),
  };
});

// Head-to-head: top pairs
const headToHead = computed(() => {
  const pairs = {};
  finishedGames.value.forEach(game => {
    if (!game.game_players) return;
    const team1Players = game.game_players.filter(p => isTeam1(p.team));
    const team2Players = game.game_players.filter(p => isTeam2(p.team));

    team1Players.forEach(p1 => {
      team2Players.forEach(p2 => {
        const key = [p1.user_id, p2.user_id].sort().join('-');
        if (!pairs[key]) {
          pairs[key] = {
            player1: { user_id: p1.user_id, name: p1.display_name || p1.user?.name, avatar: p1.user?.avatar },
            player2: { user_id: p2.user_id, name: p2.display_name || p2.user?.name, avatar: p2.user?.avatar },
            count: 0,
          };
        }
        pairs[key].count++;
      });
    });
  });

  return Object.values(pairs).sort((a, b) => b.count - a.count).slice(0, 5);
});

const winRate = (player) => {
  if (player.games === 0) return 0;
  return Math.round((player.wins / player.games) * 100);
};

const formatDuration = (minutes) => {
  if (minutes < 1) return '-';
  if (minutes >= 60) return `${Math.floor(minutes / 60)} ชม. ${minutes % 60} น.`;
  return `${minutes} น.`;
};
</script>

<template>
  <div class="space-y-4">
    <!-- Summary Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-base-100 rounded-2xl border border-base-300 p-4 text-center">
        <div class="text-2xl font-black text-primary">{{ summary.totalGames }}</div>
        <div class="text-xs text-base-content/50 mt-1">เกมทั้งหมด</div>
      </div>
      <div class="bg-base-100 rounded-2xl border border-base-300 p-4 text-center">
        <div class="text-2xl font-black text-success">{{ summary.finishedGames }}</div>
        <div class="text-xs text-base-content/50 mt-1">จบแล้ว</div>
      </div>
      <div class="bg-base-100 rounded-2xl border border-base-300 p-4 text-center">
        <div class="text-2xl font-black text-warning">{{ summary.totalShuttlecocks }}</div>
        <div class="text-xs text-base-content/50 mt-1">ลูกขนไก่</div>
      </div>
      <div class="bg-base-100 rounded-2xl border border-base-300 p-4 text-center">
        <div class="text-2xl font-black text-info">{{ formatDuration(summary.avgDurationMinutes) }}</div>
        <div class="text-xs text-base-content/50 mt-1">เวลาเฉลี่ย/เกม</div>
      </div>
    </div>

    <!-- MVP -->
    <div v-if="mvp" class="bg-gradient-to-r from-warning/10 to-warning/5 rounded-2xl border border-warning/30 p-4">
      <div class="flex items-center gap-3">
        <div class="relative">
          <UserAvatar :src="mvp.avatar" :name="mvp.name" size="xl" rounded="full" class="border-2 border-warning" />
          <span class="absolute -top-1 -right-1 text-lg">👑</span>
        </div>
        <div class="flex-1">
          <div class="text-xs font-bold text-warning uppercase tracking-wider">MVP</div>
          <div class="text-base font-bold text-base-content">{{ mvp.name }}</div>
          <div class="text-xs text-base-content/60 mt-0.5">
            {{ mvp.wins }}W {{ mvp.losses }}L · {{ winRate(mvp) }}% win rate · {{ mvp.games }} games
          </div>
        </div>
      </div>
    </div>

    <!-- Player Stats Table -->
    <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden" v-if="playerStats.length > 0">
      <div class="px-4 py-3 border-b border-base-200">
        <h3 class="text-base font-bold text-base-content m-0">สถิติผู้เล่น</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="table table-sm w-full">
          <thead>
            <tr class="text-xs text-base-content/50">
              <th class="pl-4">#</th>
              <th>ผู้เล่น</th>
              <th class="text-center">เกม</th>
              <th class="text-center">ชนะ</th>
              <th class="text-center">แพ้</th>
              <th class="text-center">Win%</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in playerStats" :key="player.user_id" class="hover">
              <td class="pl-4 text-xs text-base-content/50">{{ index + 1 }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <UserAvatar :src="player.avatar" :name="player.name" size="sm" rounded="full" />
                  <span class="text-sm font-medium text-base-content truncate max-w-[8rem]">{{ player.name }}</span>
                </div>
              </td>
              <td class="text-center text-sm font-semibold">{{ player.games }}</td>
              <td class="text-center text-sm text-success font-semibold">{{ player.wins }}</td>
              <td class="text-center text-sm text-error font-semibold">{{ player.losses }}</td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-1">
                  <div class="w-12 h-1.5 bg-base-200 rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full" :style="{ width: winRate(player) + '%' }"></div>
                  </div>
                  <span class="text-xs font-bold text-base-content/70">{{ winRate(player) }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Head-to-Head -->
    <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden" v-if="headToHead.length > 0">
      <div class="px-4 py-3 border-b border-base-200">
        <h3 class="text-base font-bold text-base-content m-0">เจอกันบ่อย (ฝั่งตรงข้าม)</h3>
      </div>
      <div class="divide-y divide-base-200">
        <div v-for="(pair, index) in headToHead" :key="index" class="flex items-center gap-3 px-4 py-2.5">
          <div class="flex items-center gap-1.5 flex-1 min-w-0">
            <UserAvatar :src="pair.player1.avatar" :name="pair.player1.name" size="sm" rounded="full" />
            <span class="text-sm text-base-content truncate">{{ (pair.player1.name || '').split(' ')[0] }}</span>
          </div>
          <div class="shrink-0 flex items-center gap-1">
            <span class="text-[10px] font-black text-base-content/30">VS</span>
            <span class="badge badge-sm badge-primary font-bold">{{ pair.count }}x</span>
          </div>
          <div class="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
            <span class="text-sm text-base-content truncate">{{ (pair.player2.name || '').split(' ')[0] }}</span>
            <UserAvatar :src="pair.player2.avatar" :name="pair.player2.name" size="sm" rounded="full" />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="finishedGames.length === 0" class="text-center py-10 bg-base-100 rounded-2xl border border-base-300">
      <span class="text-4xl">📊</span>
      <p class="text-sm text-base-content/50 mt-3 m-0">ยังไม่มีเกมที่จบ ข้อมูลสถิติจะปรากฏเมื่อมีเกมเสร็จสิ้น</p>
    </div>
  </div>
</template>
