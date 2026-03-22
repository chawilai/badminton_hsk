<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { Head, usePage, Link, router } from "@inertiajs/vue3";
import { ref, computed, onMounted } from "vue";
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import MmrBadge from "@/Components/MmrBadge.vue";
import SkillRadarChart from "@/Components/SkillRadarChart.vue";
import { getSkillLevelLabel } from "@/data/skillLevelDescriptions";

const { t, locale } = useLocale();
const toast = useToast();
const page = usePage();

onMounted(() => {
  const msg = page.props.flash?.success;
  if (msg) {
    toast.add({ severity: 'success', summary: Array.isArray(msg) ? msg[0] : msg, life: 3000 });
  }
});
const user = computed(() => page.props.profileUser || page.props.auth.user);
const profileMissing = computed(() => (page.props.profileMissingFields || []).length);
const mmrLevel = computed(() => page.props.mmrLevel);
const stats = computed(() => page.props.stats || {});
const recentParties = computed(() => page.props.recentParties || []);
const recentGames = computed(() => page.props.recentGames || []);
const skillAssessment = computed(() => page.props.skillAssessment || null);

const skillIcons = {
  serve: '🏸', smash: '💥', clear: '🌈', net_play: '🕸️', defense: '🛡️',
  backhand: '🔄', deception: '🎭', footwork: '👟', speed: '⚡', stamina: '❤️‍🔥',
};
const skillLabels = {
  serve: 'เสิร์ฟ', smash: 'สแมช', clear: 'เคลียร์', net_play: 'หน้าเน็ต', defense: 'เกมรับ',
  backhand: 'แบ็คแฮนด์', deception: 'ลูกหลอก', footwork: 'ฟุตเวิร์ค', speed: 'ความเร็ว', stamina: 'สตามิน่า',
};
const topStrengths = computed(() => {
  if (!skillAssessment.value) return [];
  return Object.entries(skillAssessment.value)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, value]) => ({
      key,
      label: skillLabels[key],
      icon: skillIcons[key],
      value,
      levelLabel: getSkillLevelLabel(key, value, locale.value),
    }));
});
const filteredStats = computed(() => page.props.filteredStats || {});
const statsPeriod = ref(page.props.statsPeriod || 'month');
const availableMonths = computed(() => page.props.availableMonths || []);
const filterYear = ref(page.props.filterYear);
const filterMonth = ref(page.props.filterMonth);
const activeTab = ref('overview');

const changePeriod = (period) => {
  statsPeriod.value = period;
  router.get('/profile', { period, year: filterYear.value, month: filterMonth.value }, {
    preserveScroll: true,
    preserveState: true,
    only: ['filteredStats', 'statsPeriod'],
  });
};

const periodLabel = computed(() => {
  if (statsPeriod.value === 'week') return 'อาทิตย์นี้';
  if (statsPeriod.value === 'month') return 'เดือนนี้';
  return 'ทั้งหมด';
});

const thaiMonths = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const availableYears = computed(() => {
  const years = [...new Set(availableMonths.value.map(m => m.year))];
  return years.sort((a, b) => b - a);
});

const monthsForSelectedYear = computed(() => {
  return availableMonths.value
    .filter(m => m.year === filterYear.value)
    .map(m => m.month)
    .sort((a, b) => b - a);
});

const changeFilter = (year, month) => {
  filterYear.value = year;
  filterMonth.value = month;
  router.get('/profile', { year, month }, {
    preserveScroll: true,
    preserveState: true,
    only: ['recentGames', 'filterYear', 'filterMonth'],
  });
};

const onYearChange = (e) => {
  const year = parseInt(e.target.value);
  const months = availableMonths.value.filter(m => m.year === year).map(m => m.month).sort((a, b) => b - a);
  const month = months[0] || 1;
  changeFilter(year, month);
};

const onMonthChange = (e) => {
  changeFilter(filterYear.value, parseInt(e.target.value));
};

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
        <Link v-if="user.id === page.props.auth.user?.id" :href="route('profile.edit')" class="relative inline-flex items-center gap-1 mt-1.5 px-3 py-1 rounded-lg bg-base-content/10 text-[11px] text-base-content/60 no-underline hover:bg-base-content/20 transition-colors">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
          แก้ไขโปรไฟล์
          <span v-if="profileMissing > 0" class="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold leading-none ring-2 ring-base-100">{{ profileMissing }}</span>
        </Link>
        <div class="flex items-center justify-center gap-2 mt-2">
          <MmrBadge v-if="mmrLevel"
            :level="mmrLevel.level"
            :tierName="locale === 'th' ? mmrLevel.name_th : mmrLevel.name_en"
            :tierColor="mmrLevel.tier_color"
            size="md"
          />
          <span v-if="user.gender" class="badge badge-sm badge-ghost">{{ genderLabel(user.gender) }}</span>
        </div>
        <!-- MMR Score -->
        <div v-if="user.mmr" class="flex items-center justify-center gap-3 mt-2">
          <div class="text-center">
            <div class="text-lg font-black text-primary">{{ user.mmr }}</div>
            <div class="text-[9px] text-base-content/40 uppercase">MMR</div>
          </div>
        </div>
      </div>

      <!-- Period Filter -->
      <div class="flex gap-1 p-1 bg-base-200 rounded-xl">
        <button v-for="p in [{ key: 'week', label: 'อาทิตย์นี้' }, { key: 'month', label: 'เดือนนี้' }, { key: 'all', label: 'ทั้งหมด' }]" :key="p.key"
          class="flex-1 py-2 px-3 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"
          :class="statsPeriod === p.key ? 'bg-primary text-primary-content' : 'bg-transparent text-base-content/50 hover:text-base-content'"
          @click="changePeriod(p.key)"
        >{{ p.label }}</button>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-4 gap-2">
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-primary">{{ statsPeriod === 'all' ? stats.totalGames : filteredStats.totalGames || 0 }}</div>
          <div class="text-[10px] text-base-content/50">เกม</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-success">{{ statsPeriod === 'all' ? stats.gamesWon : filteredStats.gamesWon || 0 }}</div>
          <div class="text-[10px] text-base-content/50">ชนะ</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-warning">{{ statsPeriod === 'all' ? stats.winRate : filteredStats.winRate || 0 }}%</div>
          <div class="text-[10px] text-base-content/50">Win Rate</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-lg font-black text-accent">{{ formatPlayTime(statsPeriod === 'all' ? stats.totalPlaySeconds : filteredStats.totalPlaySeconds) }}</div>
          <div class="text-[10px] text-base-content/50">เวลาเล่น</div>
        </div>
      </div>

      <!-- Overall stats row (only when filtered) -->
      <div v-if="statsPeriod !== 'all'" class="grid grid-cols-3 gap-2">
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-info">{{ stats.partiesJoined || 0 }}</div>
          <div class="text-[10px] text-base-content/50">ปาร์ตี้รวม</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-secondary">{{ stats.courtsVisited || 0 }}</div>
          <div class="text-[10px] text-base-content/50">สนาม</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-xl font-black text-primary">{{ stats.totalGames || 0 }}</div>
          <div class="text-[10px] text-base-content/50">เกมรวม</div>
        </div>
      </div>

      <!-- Calories -->
      <div v-if="(statsPeriod === 'all' ? stats.totalPlaySeconds : filteredStats.totalPlaySeconds) > 0" class="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 rounded-xl border border-orange-200/50 p-3 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🔥</span>
          <div>
            <div class="text-xs font-bold text-orange-600">แคลอรี่ที่เผาผลาญ</div>
            <div class="text-[10px] text-base-content/50">{{ periodLabel }} · ประมาณ ~7 kcal/นาที</div>
          </div>
        </div>
        <div class="text-xl font-black text-orange-600">{{ estimateCalories(statsPeriod === 'all' ? stats.totalPlaySeconds : filteredStats.totalPlaySeconds).toLocaleString() }} kcal</div>
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

      <!-- Skill Radar Chart -->
      <div v-if="skillAssessment" class="bg-base-100 rounded-xl border border-base-300 p-4">
        <div class="flex items-center justify-between mb-2">
          <div class="text-xs font-bold text-primary uppercase tracking-wider">🎯 ทักษะของคุณ</div>
          <Link href="/skill-assessment" class="text-[10px] text-primary font-semibold no-underline hover:underline">ประเมินใหม่</Link>
        </div>
        <SkillRadarChart :skills="skillAssessment" :size="280" class="mx-auto" />
        <div class="flex gap-2 mt-3 justify-center flex-wrap">
          <span v-for="s in topStrengths" :key="s.key"
            class="badge badge-primary badge-outline badge-sm gap-1 font-semibold">
            {{ s.icon }} {{ s.label }} {{ s.value }} — {{ s.levelLabel }}
          </span>
        </div>
        <div class="text-center mt-2 text-[10px] text-base-content/40">
          เฉียบคมด้าน: <span class="font-bold text-primary">{{ topStrengths.map(s => s.label).join(', ') }}</span>
        </div>
      </div>
      <Link v-else href="/skill-assessment" class="bg-base-100 rounded-xl border border-base-300 border-dashed p-4 text-center no-underline hover:bg-base-200 transition-colors block">
        <span class="text-3xl block mb-2">🎯</span>
        <div class="text-sm font-bold text-base-content">ทำแบบประเมินทักษะ</div>
        <div class="text-[10px] text-base-content/50 mt-0.5">ประเมินทักษะ 10 ด้าน แสดงผลเป็นกราฟเรดาร์</div>
      </Link>

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

      <!-- Notification Settings Link -->
      <Link href="/notifications/settings" class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors">
        <span class="text-2xl">🔔</span>
        <div class="flex-1">
          <div class="text-sm font-bold text-base-content">ตั้งค่าแจ้งเตือน</div>
          <div class="text-[10px] text-base-content/50">แจ้งเตือนผ่าน LINE OA</div>
        </div>
        <svg class="w-4 h-4 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </Link>

      <!-- Feedback Link -->
      <Link href="/feedback" class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors">
        <span class="text-2xl">💬</span>
        <div class="flex-1">
          <div class="text-sm font-bold text-base-content">{{ t('feedback.title') }}</div>
          <div class="text-[10px] text-base-content/50">{{ t('feedback.subtitle') }}</div>
        </div>
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
        <!-- Year/Month Filter -->
        <div v-if="availableMonths.length > 0" class="flex items-center gap-2 mb-3">
          <select
            :value="filterYear"
            @change="onYearChange"
            class="select select-sm select-bordered bg-base-100 text-sm font-semibold min-h-0 h-8"
          >
            <option v-for="y in availableYears" :key="y" :value="y">{{ y + 543 }}</option>
          </select>
          <div class="flex gap-1 flex-1 overflow-x-auto scrollbar-hide">
            <button
              v-for="m in monthsForSelectedYear"
              :key="m"
              @click="changeFilter(filterYear, m)"
              class="px-3 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all whitespace-nowrap"
              :class="filterMonth === m
                ? 'bg-primary text-primary-content'
                : 'bg-base-200 text-base-content/60 hover:bg-base-300'"
            >{{ thaiMonths[m] }}</button>
          </div>
        </div>

        <div v-if="recentGames.length === 0" class="text-center py-8 bg-base-100 rounded-xl border border-base-300">
          <span class="text-3xl">🏸</span>
          <p class="text-xs text-base-content/50 mt-2 m-0">ไม่มีเกมในเดือนนี้</p>
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

            <!-- MMR + Duration -->
            <div class="text-right shrink-0">
              <div v-if="game.mmr_change != null" class="text-xs font-bold"
                :class="game.mmr_change > 0 ? 'text-success' : game.mmr_change < 0 ? 'text-error' : 'text-base-content/40'"
              >{{ game.mmr_change > 0 ? '+' : '' }}{{ game.mmr_change }} MMR</div>
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
