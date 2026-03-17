<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { Head, usePage, Link, router } from "@inertiajs/vue3";
import { ref, computed } from "vue";
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();
const page = usePage();
const user = computed(() => page.props.profileUser || page.props.auth.user);
const stats = computed(() => page.props.stats || {});
const recentParties = computed(() => page.props.recentParties || []);
const recentGames = computed(() => page.props.recentGames || []);
const activeTab = ref('overview');

const formatPlayTime = (seconds) => {
  if (!seconds) return '0 น.';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h} ชม. ${m} น.`;
  return `${m} น.`;
};

const estimateCalories = (seconds) => Math.round((seconds / 60) * 7);

const genderLabel = (g) => {
  const map = { male: 'ชาย', female: 'หญิง', other: 'อื่นๆ' };
  return map[g] || '-';
};

const formatDate = (d) => {
  if (!d) return '-';
  return new Date(d + 'T00:00:00').toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
};
</script>

<template>
  <Head title="Profile" />

  <AppLayout>
    <div class="space-y-4 pb-4">
      <!-- Profile Header -->
      <div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center">
        <UserAvatar :src="user.avatar" :name="user.name" size="2xl" rounded="full" class="mx-auto border-4 border-base-100 shadow-lg mb-3" />
        <h1 class="text-lg font-bold text-base-content m-0">{{ user.name }}</h1>
        <p class="text-xs text-base-content/50 m-0 mt-0.5">{{ user.email }}</p>
        <div class="flex items-center justify-center gap-2 mt-2">
          <span v-if="user.badminton_rank" class="badge badge-sm badge-primary">{{ user.badminton_rank?.education_rank || `Lv${user.badminton_rank_id}` }}</span>
          <span v-if="user.gender" class="badge badge-sm badge-ghost">{{ genderLabel(user.gender) }}</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-primary">{{ stats.totalGames || 0 }}</div>
          <div class="text-[10px] text-base-content/50">เกมทั้งหมด</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-success">{{ stats.gamesWon || 0 }}</div>
          <div class="text-[10px] text-base-content/50">ชนะ</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-warning">{{ stats.winRate || 0 }}%</div>
          <div class="text-[10px] text-base-content/50">Win Rate</div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-info">{{ stats.partiesJoined || 0 }}</div>
          <div class="text-[10px] text-base-content/50">ปาร์ตี้</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-secondary">{{ stats.courtsVisited || 0 }}</div>
          <div class="text-[10px] text-base-content/50">สนาม</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-lg font-black text-accent">{{ formatPlayTime(stats.totalPlaySeconds) }}</div>
          <div class="text-[10px] text-base-content/50">เวลาเล่นรวม</div>
        </div>
      </div>

      <!-- Calories -->
      <div v-if="stats.totalPlaySeconds > 0" class="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 rounded-xl border border-orange-200/50 p-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🔥</span>
          <div>
            <div class="text-xs font-bold text-orange-600">แคลอรี่ที่เผาผลาญ</div>
            <div class="text-[10px] text-base-content/50">ประมาณ ~7 kcal/นาที</div>
          </div>
        </div>
        <div class="text-xl font-black text-orange-600">{{ estimateCalories(stats.totalPlaySeconds).toLocaleString() }} kcal</div>
      </div>

      <!-- Most Played With -->
      <div v-if="stats.mostPlayedWith" class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3">
        <UserAvatar :src="stats.mostPlayedWith.avatar" :name="stats.mostPlayedWith.name" size="lg" rounded="full" class="border-2 border-primary/30" />
        <div class="flex-1">
          <div class="text-[10px] font-bold text-primary uppercase tracking-wider">คู่หูขาประจำ</div>
          <div class="text-sm font-bold text-base-content">{{ stats.mostPlayedWith.name }}</div>
          <div class="text-[10px] text-base-content/50">เล่นด้วยกัน {{ stats.mostPlayedWith.count }} เกม</div>
        </div>
        <span class="text-2xl">🤝</span>
      </div>

      <!-- Friends Link -->
      <Link href="/friends" class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors">
        <span class="text-2xl">👥</span>
        <div class="flex-1">
          <div class="text-sm font-bold text-base-content">{{ t('friends.title') }}</div>
          <div class="text-[10px] text-base-content/50">จัดการรายชื่อเพื่อน</div>
        </div>
        <span v-if="page.props.pendingFriendCount > 0" class="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold">{{ page.props.pendingFriendCount }}</span>
        <svg class="w-4 h-4 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </Link>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-base-200 rounded-xl">
        <button v-for="tab in [{ key: 'overview', label: 'ประวัติเกม' }, { key: 'parties', label: 'ปาร์ตี้' }]" :key="tab.key"
          class="flex-1 py-2 px-3 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"
          :class="activeTab === tab.key ? 'bg-primary text-primary-content' : 'bg-transparent text-base-content/50 hover:text-base-content'"
          @click="activeTab = tab.key"
        >{{ tab.label }}</button>
      </div>

      <!-- Tab: Recent Games -->
      <div v-show="activeTab === 'overview'">
        <div v-if="recentGames.length === 0" class="text-center py-8 bg-base-100 rounded-xl border border-base-300">
          <span class="text-3xl">🏸</span>
          <p class="text-xs text-base-content/50 mt-2 m-0">ยังไม่มีประวัติเกม</p>
        </div>
        <div class="space-y-2">
          <div v-for="game in recentGames" :key="game.id"
            class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
          >
            <!-- Win/Loss indicator -->
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"
              :class="game.won ? 'bg-success/15 text-success' : (game.won === false ? 'bg-error/15 text-error' : 'bg-base-200 text-base-content/40')"
            >{{ game.won ? 'W' : (game.won === false ? 'L' : '-') }}</div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-base-content">{{ game.score || '?-?' }}</span>
                <span class="text-[10px] text-base-content/40">{{ game.court_name }}</span>
              </div>
              <div class="flex items-center gap-1 mt-0.5">
                <!-- Teammates -->
                <span class="text-[9px] text-base-content/50">กับ</span>
                <div class="flex -space-x-1">
                  <UserAvatar v-for="(tm, i) in game.teammates" :key="i" :src="tm.avatar" :name="tm.name" size="xs" rounded="full" class="border border-base-100" />
                </div>
                <span class="text-[9px] text-base-content/50 mx-0.5">vs</span>
                <div class="flex -space-x-1">
                  <UserAvatar v-for="(op, i) in game.opponents" :key="i" :src="op.avatar" :name="op.name" size="xs" rounded="full" class="border border-base-100" />
                </div>
              </div>
            </div>

            <!-- Duration -->
            <div class="text-right shrink-0">
              <div class="text-[10px] text-base-content/40">{{ formatDate(game.play_date) }}</div>
              <div v-if="game.duration_seconds" class="text-[10px] text-base-content/50">{{ formatPlayTime(game.duration_seconds) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Recent Parties -->
      <div v-show="activeTab === 'parties'">
        <div v-if="recentParties.length === 0" class="text-center py-8 bg-base-100 rounded-xl border border-base-300">
          <span class="text-3xl">🎉</span>
          <p class="text-xs text-base-content/50 mt-2 m-0">ยังไม่มีประวัติปาร์ตี้</p>
        </div>
        <div class="space-y-2">
          <Link v-for="party in recentParties" :key="party.id" :href="`/party/${party.id}`"
            class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
          >
            <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-sm">🏟️</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-base-content truncate">{{ party.court_name }}</div>
              <div class="text-[10px] text-base-content/50">{{ formatDate(party.play_date) }} · {{ party.start_time?.substring(0,5) }}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="text-[10px] text-base-content/50">{{ party.games_count }} เกม</div>
              <div class="text-[10px] text-base-content/40">{{ party.members_count }} คน</div>
            </div>
            <span class="badge badge-xs" :class="{
              'badge-success': party.status === 'Open',
              'badge-warning': party.status === 'Full',
              'badge-neutral': party.status === 'Over',
            }">{{ party.status }}</span>
          </Link>
        </div>
      </div>

      <!-- Logout -->
      <div class="pt-2">
        <Link
          as="button"
          :href="route('logout')"
          method="post"
          class="w-full h-10 rounded-xl text-sm font-medium bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          {{ t('nav.logout') }}
        </Link>
      </div>
    </div>
  </AppLayout>
</template>
