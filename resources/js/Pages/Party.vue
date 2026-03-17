<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import Game from "@/Pages/Game2.vue";
import TabGame from "@/Pages/Party/TabGame.vue";
import TabInfo from "@/Pages/Party/TabInfo.vue";
import TabPlayer from "@/Pages/Party/TabPlayer.vue";
import TabStatistic from "@/Pages/Party/TabStatistic.vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";
import { reactive, ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useToast } from "@/composables/useToast";
import { useConfirm } from "@/composables/useConfirm";
import { useLocale } from "@/composables/useLocale";
import { Realtime } from "ably";

import crown from "@/../assets/images/crown.png";

const toast = useToast();
const { confirm } = useConfirm();
const { t } = useLocale();

const page = usePage();

const props = ref(page.props);

const data = reactive({
  game_type: "quadruple",
  status: "setting",
  initial_shuttlecock_game: 0,
});

const party = ref("");
const games = ref([]);
const visibleTop = ref(false);
const activeTab = ref("game");

const game_data = reactive({
  game_id: "",
  party_member_id: "",
  ready_คน: [],
});

party.value = page.props.party;
games.value = page.props.games;

data.party_id = party.value.id;
game_data.party_id = party.value.id;

const settingGame = page.props.games.find((sc) => sc.status === "setting") ?? null;

const visibleGameId = ref(settingGame ? settingGame.id : null);
const game_players = ref(settingGame ? settingGame.game_players : []);

const initial_shuttlecock_party = ref(0);

const visible = ref(false);
const setScoreGame = ref({});

const sets = ref([
  {
    set_number: 1,
    team1_start_side: "north",
    team2_start_side: "south",
    team1_score: 0,
    team2_score: 0,
    winning_team: null,
  },
]);

const getTeamBackground = (index, team) => {
  const set = sets.value[index];
  if (!set) return "bg-green-100";
  if (team === "team1" && set.team1_score > set.team2_score) return "bg-gold";
  if (team === "team2" && set.team2_score > set.team1_score) return "bg-gold";
  return "bg-green-100";
};

const showCrown = (index, team) => {
  const set = sets.value[index];
  if (!set) return false;
  if (team === "team1" && set.team1_score > set.team2_score) return true;
  if (team === "team2" && set.team2_score > set.team1_score) return true;
  return false;
};

const setWins = computed(() => {
  let t1 = 0, t2 = 0;
  sets.value.forEach(s => {
    if (s.team1_score > s.team2_score) t1++;
    else if (s.team2_score > s.team1_score) t2++;
  });
  return { t1, t2 };
});

const addNewSet = (overrides = {}) => {
  let newSet = {
    set_number: sets.value.length + 1,
    team1_start_side:
      sets.value.length > 0
        ? sets.value[sets.value.length - 1].team1_start_side === "south"
          ? "north"
          : "south"
        : "north",
    team2_start_side:
      sets.value.length > 0
        ? sets.value[sets.value.length - 1].team2_start_side === "south"
          ? "north"
          : "south"
        : "south",
    team1_score: 0,
    team2_score: 0,
    winning_team: null,
    ...overrides,
  };
  sets.value.push(newSet);
};

const removeNewSet = () => {
  confirm({
    message: "ลบเกมเซ็ต ?",
    header: "ยืนยัน",
    accept: () => {
      if (sets.value.length > 1) {
        toast.add({ severity: "success", summary: "ลบเกมเซ็ต", detail: `ลบรายการลงผลเกม เซ็ตที่ ${sets.value.length} แล้ว`, life: 3000 });
        sets.value.pop();
      } else {
        toast.add({ severity: "error", summary: "ลบเกมเซ็ต", detail: "เหลือรายการเดียวแล้ว", life: 3000 });
      }
    },
    reject: () => {
      toast.add({ severity: "info", summary: "ยกเลิก", detail: "ยกเลิกการลบแล้ว", life: 3000 });
    },
  });
};

const openPosition = (pos, game) => {
  setScoreGame.value = game;
  sets.value = game.game_sets;
  visible.value = true;
};

const thisGame = ref(games.value.find((sc) => sc.id == visibleGameId.value)) ?? null;

const updateDisplayName = (partyMemberId, newName, currentName) => {
  const trimmedNewName = (newName || "").trim();
  const trimmedCurrentName = (currentName || "").trim();
  if (trimmedNewName === trimmedCurrentName) return;

  router.post(
    `/party-members/${partyMemberId}/update-name`,
    { display_name: newName.trim() },
    {
      preserveScroll: true,
      headers: { Accept: "application/json" },
      onSuccess: (response) => {
        toast.add({ severity: "success", summary: "Name Updated", detail: "ตั้งค่าชื่อเรียกใน Party เรียบร้อยแล้ว.", life: 3000 });
        party.value = response.props.party;
      },
      onError: () => {
        toast.add({ severity: "error", summary: "Update Failed", detail: "ตั้งค่าชื่อเรียกไม่สำเร็จ โปรดลองอีกครั้ง.", life: 3000 });
      },
    }
  );
};

const fetchReadyPlayer = (gameId) => {
  router.post(
    `/party_player`,
    { game_id: gameId },
    {
      preserveScroll: true,
      headers: { Accept: "application/json" },
      onSuccess: (response) => {
        game_data.ready_คน = response.props.response || [];
      },
      onError: (error) => {
        console.error("Error fetching ready คน:", error);
      },
    }
  );
};

const autoAddPlayers = (gameId) => {
  router.post(
    `/games/${gameId}/auto-add-คน`,
    {},
    {
      preserveScroll: true,
      headers: { Accept: "application/json" },
      onSuccess: (res) => {
        game_data.game_id = gameId;
        games.value = res.props.games;
        visibleGameId.value = gameId;
        fetchReadyPlayer(gameId);
        thisGame.value = games.value.find((sc) => sc.id == gameId);
        game_players.value = thisGame.value.game_players;
        if (res.props.flash.success?.length > 0) {
          toast.add({ severity: "success", summary: "จัดผู้เล่น", detail: `ระบบได้จัดผู้เล่นที่เหมาะสมลงเกมแล้ว โปรดปรับเปลี่ยน`, life: 3000 });
        }
      },
      onError: (err) => {
        if (err.notInSetting) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "เกมนี้ไม่ได้อยู่ในสถานะตั้งค่า", life: 3000 });
        if (err.gameIsFull) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีผู้เล่นในเกมนี้ครบจำนวนแล้ว", life: 3000 });
      },
    }
  );
};

const listGame = (gameId) => {
  confirm({
    message: "Are you sure you want to list the game?",
    header: "List Game",
    accept: () => {
      router.post(
        `/games/${gameId}/list`,
        { team1_start_side: "north" },
        {
          preserveScroll: true,
          headers: { Accept: "application/json" },
          onSuccess: (res) => {
            game_data.game_id = gameId;
            games.value = res.props.games;
            fetchReadyPlayer(gameId);
            thisGame.value = games.value.find((sc) => sc.id == gameId);
            game_players.value = thisGame.value.game_players;
            if (res.props.flash.success?.length > 0) {
              toast.add({ severity: "success", summary: "สำเร็จ", detail: `ลีสเกมลงรายการรอเล่นแล้ว`, life: 3000 });
            }
          },
          onError: (err) => {
            if (err.notEnoughPlayers) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีผู้เล่นในเกมไม่ครบจำนวน", life: 3000 });
            if (err.notInSetting) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "ลีสเกมได้เฉพาะเกมที่อยู่ในสถานะตั้งค่า", life: 3000 });
          },
        }
      );
    },
    reject: () => {
      toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected game listing", life: 3000 });
    },
  });
};

const createGame = () => {
  router.post(`/games`, data, {
    preserveScroll: true,
    headers: { Accept: "application/json" },
    onSuccess: (res) => {
      games.value = res.props.games;
      let newGame = res.props.games.find((sc) => sc.status === "setting");
      visibleGameId.value = newGame.id;
      game_players.value = newGame.game_players;
      fetchReadyPlayer(visibleGameId.value);
      thisGame.value = games.value.find((sc) => sc.id == newGame.id);
      game_players.value = thisGame.value.game_players;
      if (res.props.flash.success?.length > 0) {
        toast.add({ severity: "success", summary: "สำเร็จ", detail: `สร้างเกมแล้วโปรดตั้งค่าเกม`, life: 3000 });
      }
    },
    onError: (err) => {
      if (err.notMatchType) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "จำนวนผู้เล่นไม่ตรงกับรูปแบบของเกม", life: 3000 });
      if (err.existSettingGame) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีเกมที่กำลังตั้งค่าอยู่ก่อนแล้ว", life: 3000 });
    },
  });
};

const startGame = (gameId) => {
  // Check if court number is set
  const game = games.value.find(g => g.id === gameId);
  if (game && !game.court_number) {
    toast.add({ severity: "error", summary: t('game.court'), detail: t('game.courtRequired'), life: 3000 });
    return;
  }

  confirm({
    message: "Do you want to start the game ?",
    header: "Start Game",
    accept: () => {
      router.post(
        `/games/${gameId}/start`,
        { visibleGameId: data.initial_shuttlecock_game },
        {
          preserveScroll: true,
          headers: { Accept: "application/json" },
          onSuccess: (res) => {
            game_data.game_id = gameId;
            games.value = res.props.games;
            fetchReadyPlayer(gameId);
            thisGame.value = games.value.find((sc) => sc.id == gameId);
            game_players.value = thisGame.value.game_players;
            if (res.props.flash.success?.length > 0) {
              toast.add({ severity: "success", summary: "สำเร็จ", detail: `เกมเริ่มต้นแล้ว`, life: 3000 });
            }
          },
          onError: (err) => {
            if (err.notInListing) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "เริ่มเกมได้เฉพาะเกมที่มีสถานะลีสรายการ", life: 3000 });
            if (err.playerPlaying) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีผู้เล่นบางคนกำลังเล่นในเกมอื่นอยู่ โปรดจบเกมนั้นก่อน", life: 3000 });
            if (err.courtRequired) toast.add({ severity: "error", summary: t('game.court'), detail: t('game.courtRequired'), life: 3000 });
          },
        }
      );
    },
    reject: () => {
      toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected starting the game", life: 3000 });
    },
  });
};

const finishGame = (gameId) => {
  confirm({
    message: "Are you sure that the game is finished ?",
    header: "Finish Game",
    accept: () => {
      router.post(
        `/games/${gameId}/finish`,
        {},
        {
          preserveScroll: true,
          headers: { Accept: "application/json" },
          onSuccess: (res) => {
            game_data.game_id = gameId;
            games.value = res.props.games;
            fetchReadyPlayer(gameId);
            thisGame.value = games.value.find((sc) => sc.id == gameId);
            game_players.value = thisGame.value.game_players;
            props.value = res.props;
            if (res.props.flash.success?.length > 0) {
              toast.add({ severity: "success", summary: "จบเกม", detail: `จบเกมเรียบร้อยแล้ว`, life: 3000 });
            }
          },
          onError: (err) => {
            if (err.notInPlaying) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "เกมต้องกำลังเล่นจึงกดจบเกมได้", life: 3000 });
          },
        }
      );
    },
    reject: () => {
      toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected finishing the game", life: 3000 });
    },
  });
};

const deleteGame = (gameId) => {
  confirm({
    message: "Do you want to delete the game ?",
    header: "Delete Game",
    accept: () => {
      router.post(
        `/games/${gameId}/delete`,
        {},
        {
          preserveScroll: true,
          headers: { Accept: "application/json" },
          onSuccess: (res) => {
            game_data.game_id = "";
            games.value = res.props.games;
            if (res.props.flash.success?.length > 0) {
              toast.add({ severity: "warn", summary: "ลบเกม", detail: `ลบเกมเรียบร้อยแล้ว`, life: 3000 });
            }
          },
          onError: (err) => {
            if (err.onlyOnSettingOrListing) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "ลบเกมได้เฉพาะขณะตั้งค่าหรือลีสเกมเท่านั้น", life: 3000 });
          },
        }
      );
    },
    reject: () => {
      toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected deleting the game", life: 3000 });
    },
  });
};

const addShuttlecock = (gameId) => {
  confirm({
    message: "Are you sure you want to add 1 shuttlecock ?",
    header: "Add Shuttlecock",
    accept: () => {
      router.post(
        `/games/${gameId}/add-shuttlecock`,
        { quantity: 1 },
        {
          preserveScroll: true,
          headers: { Accept: "application/json" },
          onSuccess: (res) => {
            games.value = res.props.games;
            toast.add({ severity: "success", summary: "Confirmed", detail: "1 shuttlecock has been added to the game", life: 3000 });
          },
          onError: (err) => {
            if (err.finishedGame) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "ไม่สามารถเพิ่มลูกขนไก่ได้หลังจบเกม", life: 3000 });
          },
        }
      );
    },
    reject: () => {
      toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected adding shuttlecock", life: 3000 });
    },
  });
};

const returnShuttlecock = (gameId) => {
  confirm({
    message: "Are you sure you want to return 1 shuttlecock ?",
    header: "Return Shuttlecock",
    accept: () => {
      router.post(
        `/games/${gameId}/return-shuttlecocks`,
        { quantity: 1 },
        {
          preserveScroll: true,
          headers: { Accept: "application/json" },
          onSuccess: (res) => {
            games.value = res.props.games;
            toast.add({ severity: "success", summary: "Confirmed", detail: "1 shuttlecock has been returned", life: 3000 });
          },
          onError: (err) => {
            if (err.shuttlecocksIsZero) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "จำนวนลูกขนไก่เป็นศูนย์แล้ว", life: 3000 });
          },
        }
      );
    },
    reject: () => {
      toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected returning shuttlecock", life: 3000 });
    },
  });
};

const enterScore = (gameId) => {
  confirm({
    message: "ยืนยัน ?",
    header: "บันทึกผลการแข่งขัน",
    accept: () => {
      sets.value.forEach((set) => {
        if (set.team1_score && set.team2_score) {
          set.winning_team = set.team1_score > set.team2_score ? "team1" : "team2";
        }
      });

      router.post(
        `/games/${gameId}/update-game-sets`,
        { sets: sets.value },
        {
          preserveScroll: true,
          headers: { Accept: "application/json" },
          onSuccess: (res) => {
            games.value = res.props.games;
            visible.value = false;
            sets.value = [{ set_number: 1, team1_start_side: "north", team2_start_side: "south", team1_score: 0, team2_score: 0, winning_team: null }];
            toast.add({ severity: "success", summary: "บันทึกผลการแข่ง", detail: "ลงผลการแข่งของท่าน เรียบร้อยแล้ว", life: 3000 });
          },
          onError: () => {
            toast.add({ severity: "error", summary: "ล้มเหลว", detail: "การลงผลล้มเหลว โปรดลองอีกครั้ง", life: 3000 });
          },
        }
      );
    },
    reject: () => {
      toast.add({ severity: "info", summary: "Cancelled", detail: "You cancelled updating the game sets.", life: 3000 });
    },
  });
};

const reloadPage = () => {
  router.get(`/party/${party.value.id}`, {}, { preserveScroll: true });
};

const partyReload = (payload) => {
  router.post(
    `/fetch-party-data`,
    { party_id: party.value.id },
    {
      preserveScroll: true,
      headers: { Accept: "application/json" },
      onSuccess: (res) => {
        props.value = res.props;
        game_data.party_member_id = "";
        games.value = res.props.games;
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  visibleTop.value = false;
};

const playerSortWaiting = computed(() => {
  return Array.isArray(game_data.ready_คน)
    ? [...game_data.ready_คน].sort((a, b) => b.waiting_time - a.waiting_time)
    : [];
});

const tabs = computed(() => [
  { key: "game", label: t('party.tabGame'), icon: "🏸" },
  { key: "info", label: t('party.tabInfo'), icon: "ℹ️" },
  { key: "player", label: t('party.tabPlayer'), icon: "👥" },
  { key: "stats", label: t('party.tabStats'), icon: "📊" },
]);

// ===== Real-time updates via Ably =====
let ablyInstance = null;
let partyChannel = null;

const handlePartyEvent = (message) => {
  // Skip events triggered by the current user
  if (message.data?.user_id === page.props.auth.user.id) return;

  // Show notification toast
  if (message.data?.message && message.data?.user_name) {
    toast.add({
      severity: 'info',
      summary: message.data.user_name,
      detail: message.data.message,
      life: 4000,
    });
  }

  // Reload page data silently
  router.reload({ preserveScroll: true, only: ['games', 'party', 'readyPlayers', 'playingPlayers', 'breakPlayers'] });
};

onMounted(() => {
  const ablyKey = page.props.ably_key;
  if (ablyKey) {
    ablyInstance = new Realtime({
      key: ablyKey,
      clientId: `${page.props.auth.user.id}`,
    });

    partyChannel = ablyInstance.channels.get(`party.${party.value.id}`);
    partyChannel.subscribe(handlePartyEvent);
  }
});

onUnmounted(() => {
  if (partyChannel) {
    partyChannel.unsubscribe();
    partyChannel.detach();
  }
  if (ablyInstance) {
    ablyInstance.close();
  }
});
</script>

<template>
  <Head title="Party" />

  <AppLayout>
    <!-- Party Header -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h1 class="text-base font-bold text-base-content m-0 leading-tight">
            {{ party.name || party.court?.name || 'Party' }} <span class="text-xs font-normal text-base-content/50">#{{ party.id }}</span>
          </h1>
          <p v-if="party.name && party.court?.name" class="text-[10px] text-base-content/40 m-0">🏟️ {{ party.court.name }}</p>
          <p class="text-xs text-base-content/60 m-0 mt-0.5">
            {{ party.play_date }} · {{ party.start_time?.substring(0,5) }} - {{ party.end_time?.substring(0,5) }} · {{ party.members?.length || 0 }}/{{ party.max_players }} {{ t('common.players') }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="reloadPage()" class="w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer">
            <span class="text-sm">↻</span>
          </button>
          <button @click="visibleTop = true" class="h-8 px-3 flex items-center gap-1 rounded-lg bg-primary hover:bg-primary/80 text-white text-xs font-medium border-0 cursor-pointer transition-colors active:scale-[0.98] whitespace-nowrap shrink-0">
            <span>+</span>
            <span>{{ t('party.newGame') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Game creation drawer -->
    <div class="drawer drawer-end" :class="{ 'drawer-open-custom': visibleTop }">
      <div v-if="visibleTop" class="fixed inset-0 bg-black/50 z-40" @click="visibleTop = false"></div>
      <div
        class="fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-lg transition-transform duration-300"
        :class="visibleTop ? 'translate-y-0' : '-translate-y-full'"
        style="max-height: 90vh;"
      >
        <div class="flex items-center gap-2 p-3 border-b border-base-300">
          <UserAvatar :src="$page.props.auth.user.avatar" :name="$page.props.auth.user.name" size="sm" rounded="full" />
          <span class="font-bold">{{ t('party.gameMaking') }}</span>
          <button class="btn btn-sm btn-ghost ml-auto" @click="visibleTop = false">✕</button>
        </div>
        <div class="overflow-y-auto" style="max-height: calc(90vh - 3.5rem);">
          <div class="p-3">
            <Game :data="$page.props" @gameCreated="partyReload" />
          </div>
        </div>
      </div>
    </div>

    <!-- Score Entry Dialog -->
    <dialog class="modal" :class="{ 'modal-open': visible }">
      <div class="modal-box w-[95vw] max-w-[28rem] p-0">
        <div class="flex items-center justify-between px-4 pt-4 pb-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span class="text-base">🏸</span>
            </div>
            <h2 class="text-base font-bold text-base-content m-0">บันทึกผลการแข่งขัน</h2>
          </div>
          <button @click="visible = false; setScoreGame = {}" class="w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors">
            <span class="text-base-content/60 text-sm">✕</span>
          </button>
        </div>

        <div class="px-4 pb-2">
          <!-- Score Summary -->
          <div class="flex items-center justify-center gap-3 mb-3 py-2">
            <span class="text-sm font-bold text-base-content/60">Team 1</span>
            <div class="flex items-center gap-1">
              <span class="text-2xl font-black" :class="setWins.t1 > setWins.t2 ? 'text-warning' : 'text-base-content/40'">{{ setWins.t1 }}</span>
              <span class="text-lg text-base-content/30 font-bold">:</span>
              <span class="text-2xl font-black" :class="setWins.t2 > setWins.t1 ? 'text-warning' : 'text-base-content/40'">{{ setWins.t2 }}</span>
            </div>
            <span class="text-sm font-bold text-base-content/60">Team 2</span>
          </div>

          <div v-for="(set, index) in sets" :key="index" class="mb-4">
            <div class="flex items-center justify-center mb-3">
              <span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                Set {{ index + 1 }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <!-- Team 1 -->
              <div class="rounded-xl p-3 text-center relative transition-colors"
                :class="showCrown(index, 'team1') ? 'bg-warning/10 border border-warning/30' : 'bg-base-200 border border-base-300'">
                <img v-show="showCrown(index, 'team1')" :src="crown" class="w-8 h-8 absolute -top-3 -left-1 -rotate-[25deg]" alt="" />
                <p class="text-[10px] text-base-content/50 font-bold uppercase tracking-wider m-0 mb-2">Team 1</p>
                <div class="flex justify-center gap-1.5 mb-3">
                  <div v-for="player in setScoreGame.game_players?.filter(p => p.team === 'team1' || p.team === 1)" :key="player.user.id" class="text-center">
                    <UserAvatar :src="player.user?.avatar" :name="player.display_name || player.user?.name" size="lg" rounded="xl" class="border-2 border-white" />
                    <p class="text-[9px] text-base-content/60 m-0 mt-0.5 truncate max-w-[3.5rem]">{{ player.display_name || player.user?.name }}</p>
                  </div>
                </div>
                <!-- Score + controls -->
                <div class="flex items-center justify-center gap-2 mb-2">
                  <button type="button" @click="set.team1_score > 0 ? set.team1_score-- : null"
                    class="w-9 h-9 rounded-lg bg-error/10 text-error border-0 cursor-pointer font-bold text-lg hover:bg-error/20 transition-colors">-</button>
                  <div class="text-3xl font-black min-w-[2.5rem]" :class="showCrown(index, 'team1') ? 'text-warning' : 'text-base-content/80'">{{ set.team1_score }}</div>
                  <button type="button" @click="set.team1_score < 30 ? set.team1_score++ : null"
                    class="w-9 h-9 rounded-lg bg-primary/10 text-primary border-0 cursor-pointer font-bold text-lg hover:bg-primary/20 transition-colors">+</button>
                </div>
                <!-- Quick buttons -->
                <div class="flex justify-center gap-1.5 mb-2">
                  <button type="button" @click="set.team1_score = 0"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors">รีเซ็ต</button>
                  <button type="button" @click="set.team1_score = 21"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors">21 แต้ม</button>
                </div>
                <!-- Slider -->
                <div class="px-1">
                  <input type="range" :min="0" :max="30" v-model.number="set.team1_score" class="range range-primary range-sm w-full" />
                </div>
              </div>

              <!-- Team 2 -->
              <div class="rounded-xl p-3 text-center relative transition-colors"
                :class="showCrown(index, 'team2') ? 'bg-warning/10 border border-warning/30' : 'bg-base-200 border border-base-300'">
                <img v-show="showCrown(index, 'team2')" :src="crown" class="w-8 h-8 absolute -top-3 -right-1 rotate-[25deg]" alt="" />
                <p class="text-[10px] text-base-content/50 font-bold uppercase tracking-wider m-0 mb-2">Team 2</p>
                <div class="flex justify-center gap-1.5 mb-3">
                  <div v-for="player in setScoreGame.game_players?.filter(p => p.team === 'team2' || p.team === 2)" :key="player.user.id" class="text-center">
                    <UserAvatar :src="player.user?.avatar" :name="player.display_name || player.user?.name" size="lg" rounded="xl" class="border-2 border-white" />
                    <p class="text-[9px] text-base-content/60 m-0 mt-0.5 truncate max-w-[3.5rem]">{{ player.display_name || player.user?.name }}</p>
                  </div>
                </div>
                <!-- Score + controls -->
                <div class="flex items-center justify-center gap-2 mb-2">
                  <button type="button" @click="set.team2_score > 0 ? set.team2_score-- : null"
                    class="w-9 h-9 rounded-lg bg-error/10 text-error border-0 cursor-pointer font-bold text-lg hover:bg-error/20 transition-colors">-</button>
                  <div class="text-3xl font-black min-w-[2.5rem]" :class="showCrown(index, 'team2') ? 'text-warning' : 'text-base-content/80'">{{ set.team2_score }}</div>
                  <button type="button" @click="set.team2_score < 30 ? set.team2_score++ : null"
                    class="w-9 h-9 rounded-lg bg-primary/10 text-primary border-0 cursor-pointer font-bold text-lg hover:bg-primary/20 transition-colors">+</button>
                </div>
                <!-- Quick buttons -->
                <div class="flex justify-center gap-1.5 mb-2">
                  <button type="button" @click="set.team2_score = 0"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors">รีเซ็ต</button>
                  <button type="button" @click="set.team2_score = 21"
                    class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors">21 แต้ม</button>
                </div>
                <!-- Slider -->
                <div class="px-1">
                  <input type="range" :min="0" :max="30" v-model.number="set.team2_score" class="range range-primary range-sm w-full" />
                </div>
              </div>
            </div>

            <div v-if="index < sets.length - 1" class="flex items-center gap-3 my-3">
              <div class="flex-1 h-px bg-base-300"></div>
              <div class="flex-1 h-px bg-base-300"></div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 px-4 pb-3">
          <button type="button" @click="addNewSet"
            class="h-8 px-4 rounded-lg text-xs font-semibold bg-primary/5 text-primary border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors">
            + เพิ่ม Set {{ sets.length + 1 }}
          </button>
          <button v-show="sets.length > 1" type="button" @click="removeNewSet"
            class="h-8 px-4 rounded-lg text-xs font-semibold bg-error/10 text-error border border-error/20 cursor-pointer hover:bg-error/20 transition-colors">
            - ลบ Set
          </button>
        </div>

        <div class="flex gap-2 px-4 pb-4">
          <button type="button" @click="visible = false; setScoreGame = {}"
            class="flex-1 h-10 rounded-xl text-sm font-medium bg-base-200 text-base-content/80 border-0 cursor-pointer hover:bg-base-300 transition-colors">
            {{ t('common.cancel') }}
          </button>
          <button type="button" @click="enterScore(setScoreGame.id)"
            class="flex-1 h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98]">
            ✓ {{ t('common.save') }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="visible = false; setScoreGame = {}">close</button>
      </form>
    </dialog>

    <!-- Tabs Navigation -->
    <div class="flex gap-1 p-1 bg-base-200 rounded-xl mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border-0"
        :class="activeTab === tab.key
          ? 'bg-primary text-primary-content shadow-sm'
          : 'bg-transparent text-base-content/50 hover:text-base-content hover:bg-base-300/50'"
        @click="activeTab = tab.key"
      >
        <span>{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab Content (v-show to preserve state) -->
    <div v-show="activeTab === 'game'">
      <TabGame
        :games="games"
        :party="party"
        :readyPlayers="game_data.ready_คน"
        @listGame="listGame"
        @startGame="startGame"
        @finishGame="finishGame"
        @deleteGame="deleteGame"
        @autoAddPlayers="autoAddPlayers"
        @addShuttlecock="addShuttlecock"
        @returnShuttlecock="returnShuttlecock"
        @openScore="(game) => openPosition('top', game)"
      />
    </div>

    <div v-show="activeTab === 'info'">
      <TabInfo :party="party" />
    </div>

    <div v-show="activeTab === 'player'">
      <TabPlayer
        :party="party"
        :friendshipMap="page.props.friendshipMap || {}"
        @updateDisplayName="updateDisplayName"
      />
    </div>

    <div v-show="activeTab === 'stats'">
      <TabStatistic :games="games" :party="party" />
    </div>
  </AppLayout>
</template>

<style scoped>
.bg-gold {
  background-color: gold;
}
</style>
