<script setup>
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import AppLayout from "@/layout/AppLayout.vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";
import { reactive, ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Crud from "@/Pages/Prime/Crud.vue";

const toast = useToast();
const confirmPopup = useConfirm();

const page = usePage();

const data = reactive({
  party_id: "",
  game_type: "quadruple",
  status: "setting",
  initial_shuttlecock_game: null,
});

const parties = ref([]);
const selectedParty = ref({});
const games = ref([]);
const isSidebar = ref(true);

parties.value = page.props.parties;
games.value = page.props.games;

const settingGame = page.props.games.find((sc) => sc.status === "setting") ?? null;

const visibleGameId = ref(settingGame ? settingGame.id : null);
const game_players = ref(settingGame ? settingGame.game_players : []);

const team1Side = ref(null);
const initial_shuttlecock_party = ref(0);

const game_data = reactive({
  game_id: "",
  party_member_id: "",
  ready_players: [],
});

const fetchReadyPlayer = (gameId) => {
  router.post(
    `/party_player`,
    { game_id: gameId },
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (response) => {
        const readyPlayers = response.props.response || [];
        game_data.ready_players = readyPlayers;
      },
      onError: (error) => {
        console.error("Error fetching ready players:", error);
      },
    }
  );
};

const addPlayer = () => {
  if (game_data.game_id) {
    router.post(`/games/${game_data.game_id}/add-player`, game_data, {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (res) => {
        game_data.party_member_id = "";
        games.value = res.props.games;
        fetchReadyPlayer(game_data.game_id);
        game_players.value = games.value.find(
          (sc) => sc.id == game_data.game_id
        ).game_players;
      },
    });
  }
};

const autoAddPlayers = (gameId) => {
  router.post(
    `/games/${gameId}/auto-add-players`,
    {},
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (res) => {
        game_data.game_id = gameId;
        games.value = res.props.games;
        fetchReadyPlayer(gameId);

        game_players.value = games.value.find((sc) => sc.id == gameId).game_players;
      },
    }
  );
};

const togglePlayers = (gameId) => {
  if (visibleGameId.value === gameId) {
    visibleGameId.value = null;
    return;
  }

  visibleGameId.value = gameId;
  game_players.value = games.value.find((sc) => sc.id == gameId).game_players;
};

const showTime = (dateString) => {
  if (!dateString) return "";
  return dayjs(dateString).format("HH:mm:ss"); // Format to show only the time
};

const playTime = (startDate, endDate) => {
  if (!startDate || !endDate) return ""; // Return default if either date is missing

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diffInSeconds = end.diff(start, "second"); // Get difference in seconds

  return readAbleTime(diffInSeconds);
};

const readAbleTime = (secondTime) => {
  const dur = dayjs.duration(secondTime, "seconds");

  // Construct the readable format
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  let result = "";
  if (hours > 0) result += `${hours} hour${hours > 1 ? "s" : ""} `;
  if (minutes > 0) result += `${minutes} minute${minutes > 1 ? "s" : ""} `;
  result += `${seconds} second${seconds > 1 ? "s" : ""}`;

  return result.trim(); // Trim any extra space
};

const listGame = (gameId, event) => {
  confirmPopup.require({
    target: event.target,
    message: "Are you sure you want to list the game?",
    icon: "pi pi-list",
    accept: () => {
      team1Side.value = "north";

      if (team1Side.value) {
        router.post(
          `/games/${gameId}/list`,
          { team1_start_side: team1Side.value },
          {
            preserveScroll: true,
            headers: {
              Accept: "application/json",
            },
            onSuccess: (res) => {
              game_data.game_id = gameId;
              games.value = res.props.games;
              fetchReadyPlayer(gameId);

              toast.add({
                severity: "success",
                summary: "Confirmed",
                detail: "The game is listed to the game board",
                life: 3000,
              });
            },
          }
        );
      }
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected game listing",
        life: 3000,
      });
    },
  });
};

const createGame = () => {
  confirmPopup.require({
    target: event.target,
    message: "Do you want to create the game ?",
    icon: "pi pi-microsoft",
    accept: () => {
      router.post(`/games`, data, {
        preserveScroll: true,
        headers: {
          Accept: "application/json",
        },
        onSuccess: (res) => {
          games.value = res.props.games;

          visibleGameId.value = res.props.games.find((sc) => sc.status === "setting").id;

          toast.add({
            severity: "success",
            summary: "Confirmed",
            detail: "The game is created.",
            life: 3000,
          });
        },
      });
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected creating the game",
        life: 3000,
      });
    },
  });
};

const startGame = (gameId) => {
  confirmPopup.require({
    target: event.target,
    message: "Do you want to start the game ?",
    icon: "pi pi-play",
    accept: () => {
      router.post(
        `/games/${gameId}/start`,
        { visibleGameId: data.initial_shuttlecock_game },
        {
          preserveScroll: true,
          headers: {
            Accept: "application/json",
          },
          onSuccess: (res) => {
            game_data.game_id = gameId;
            games.value = res.props.games;
            fetchReadyPlayer(gameId);

            toast.add({
              severity: "success",
              summary: "Confirmed",
              detail: "The game is started.",
              life: 3000,
            });
          },
        }
      );
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected starting the game",
        life: 3000,
      });
    },
  });
};

const finishGame = (gameId) => {
  confirmPopup.require({
    target: event.target,
    message: "Are you sure that the game is finished ?",
    icon: "pi pi-stop",
    accept: () => {
      router.post(
        `/games/${gameId}/finish`,
        {},
        {
          preserveScroll: true,
          headers: {
            Accept: "application/json",
          },
          onSuccess: (res) => {
            game_data.game_id = gameId;
            games.value = res.props.games;
            fetchReadyPlayer(gameId);

            toast.add({
              severity: "success",
              summary: "Confirmed",
              detail: "The game is finished.",
              life: 3000,
            });
          },
        }
      );
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected finishing the game",
        life: 3000,
      });
    },
  });
};

const deletePlayer = (gameId, playerId) => {
  router.post(
    `/games/${gameId}/remove-player`,
    { game_id: gameId, user_id: playerId },
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (res) => {
        game_data.game_id = gameId;
        games.value = res.props.games;
        fetchReadyPlayer(gameId);
        game_players.value = games.value.find((sc) => sc.id == gameId).game_players;
      },
    }
  );
};

const gameStatus = (status) => {
  if (status === "setting")
    return `<span class='px-2 py-1 bg-orange-400 text-white border-round-md'>${status}</span>`;
  if (status === "listing")
    return `<span class='px-2 py-1 bg-purple-400 text-white border-round-md'>${status}</span>`;
  if (status === "playing")
    return `<span class='px-2 py-1 bg-green-400 text-white border-round-md'>${status}</span>`;
  if (status === "finished")
    return `<span class='px-2 py-1 bg-blue-400 text-white border-round-md'>${status}</span>`;
};

const addPartyInitShuttleCock = (partyId) => {
  router.post(
    `/parties/${partyId}/set-party-initial-shuttlecocks`,
    { initial_shuttlecocks: initial_shuttlecock_party.value },
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (res) => {
        parties.value = res.props.parties;
        data.initial_shuttlecock_game = initial_shuttlecock_party.value;
      },
    }
  );
};

const selectParty = (partyId) => {
  selectedParty.value = parties.value.filter((party) => party.id == partyId)[0];
  initial_shuttlecock_party.value = selectedParty.value.default_initial_shuttlecocks;

  data.initial_shuttlecock_game = initial_shuttlecock_party.value;
};

const shuttlecocksInit = (game) => {
  const initialShuttlecock = game.shuttlecocks.find((sc) => sc.type === "initial");
  return initialShuttlecock ? initialShuttlecock.quantity : 0;
};

const shuttlecocksTotal = (game) => {
  return game.shuttlecocks.reduce((total, sc) => total + sc.quantity, 0);
};

const addShuttlecock = (gameId) => {
  confirmPopup.require({
    target: event.target,
    message: "Are you sure you want to add 1 Shuttlecock ?",
    icon: "pi pi-plus-circle",
    accept: () => {
      router.post(
        `/games/${gameId}/add-shuttlecock`,
        { quantity: 1 },
        {
          preserveScroll: true,
          headers: {
            Accept: "application/json",
          },
          onSuccess: (res) => {
            games.value = res.props.games;

            toast.add({
              severity: "success",
              summary: "Confirmed",
              detail: "1 Shuttlecock has been added to the game",
              life: 3000,
            });
          },
        }
      );
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected adding shuttlecock",
        life: 3000,
      });
    },
  });
};

// compute
const playerSortWaiting = computed(() => {
  return Array.isArray(game_data.ready_players)
    ? [...game_data.ready_players].sort((a, b) => b.waiting_time - a.waiting_time)
    : [];
});

onMounted(() => {});
</script>

<template>
  <Head title="Dashboard" />

  <AppLayout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Badminton Game Making
      </h2>
    </template>

    <!-- <Sidebar
            v-model:visible="isSidebar"
            position="bottom"
            class=""
            :pt="{
                closeButton: 'ml-auto',
            }"
        >
            asdfasdf
        </Sidebar> -->

    <div class="py-12">
      <div class="max-w-7xl mx-auto">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <!-- <div class="p-6 text-gray-900">You're logged in!</div> -->
          <ConfirmPopup></ConfirmPopup>
          <button type="button" @click="createGame()">Create Game</button>

          <select
            name="party_id"
            v-model="data.party_id"
            @change="selectParty(data.party_id)"
          >
            <option></option>
            <option v-for="party in parties" v-text="party.id"></option>
          </select>
          <select name="game_type" v-model="data.game_type">
            <option></option>
            <option
              v-for="game_type in ['double', 'quadruple']"
              v-text="game_type"
            ></option>
          </select>

          <input
            v-if="data.party_id"
            v-model.number="initial_shuttlecock_party"
            type="number"
            min="0"
            name="initial_shuttlecock_party"
            @blur="addPartyInitShuttleCock(data.party_id)"
          />
          <input
            v-if="data.party_id"
            v-model.number="data.initial_shuttlecock_game"
            type="number"
            min="0"
            name="initial_shuttlecock_game"
          />

          {{ selectedParty ? selectedParty.is_break_aftergame : "" }}
          <br />

          <select
            name="game_id"
            @change="fetchReadyPlayer(game_data.game_id)"
            v-model="game_data.game_id"
          >
            <option></option>
            <option
              v-for="game in games"
              :value="game.id"
              v-text="`game:${game.id} party:${game.party_id} type:${game.game_type}`"
            ></option>
          </select>
          <select name="party_member_id" v-model="game_data.party_member_id">
            <option></option>
            <option
              v-for="(ready_player, index) in playerSortWaiting"
              :value="ready_player.party_member_id"
              v-text="
                `${index + 1}: ${ready_player.badminton_rank} | ${ready_player.age} (${
                  ready_player.name
                }) [played:${
                  ready_player.finished_games_count
                }] [Wait Time: ${readAbleTime(ready_player.waiting_time)}]`
              "
            ></option>
          </select>
          <select name="team" v-model="game_data.team">
            <option></option>
            <option v-for="team in ['team1', 'team2']" v-text="team"></option>
          </select>
          <button type="button" @click="addPlayer()">Add Player</button>

          <ul v-if="$page.props.errors">
            <li
              class="text-red-600"
              v-for="error in $page.props.errors"
              v-text="error"
            ></li>
          </ul>

          <ul v-if="$page.props.flash">
            <li
              class="text-green-600"
              v-for="success in $page.props.flash"
              v-text="success"
            ></li>
          </ul>

          <table v-if="visibleGameId" class="tw-mx-auto tw-mb-3 tw-mt-2">
            <thead class="tw-bg-green-700 tw-text-white">
              <tr>
                <th class="tw-px-2 tw-py-1">Player ID</th>
                <th class="tw-px-2 tw-py-1">Name</th>
                <th class="tw-px-2 tw-py-1">Team</th>
                <th class="tw-px-2 tw-py-1">Gender</th>
                <th class="tw-px-2 tw-py-1">Range</th>
                <th class="tw-px-2 tw-py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="player in game_players" :key="player.id">
                <td class="tw-px-2 tw-py-1">
                  {{ player.user.id }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ player.user.name }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ player.team }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ player.user.gender }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ player.user.badminton_rank_id }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  <button @click="deletePlayer(visibleGameId, player.user.id)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <table class="">
            <thead>
              <tr>
                <th class="py-1 px-3 text-md text-center bg-green-500 text-white">ID</th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Party ID
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Game Type
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Players Count
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Status
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  List At
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Played At
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Finished At
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Duration
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Players Lists
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Init
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Total
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  +
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  List
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Start
                </th>
                <th
                  class="tw-py-1 tw-px-3 tw-text-md tw-text-center tw-bg-green-500 tw-text-white"
                >
                  Finish
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="game in games" :key="game.id">
                <td class="tw-px-2 tw-py-1">{{ game.id }}</td>
                <td class="tw-px-2 tw-py-1">
                  {{ game.party_id }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ game.game_type }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ game.game_players_count }}
                  <button type="button" @click="autoAddPlayers(game.id)">+</button>
                </td>
                <td class="tw-px-2 tw-py-1" v-html="gameStatus(game.status)"></td>
                <td class="tw-px-2 tw-py-1">
                  {{ showTime(game.game_list_date) }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ showTime(game.game_start_date) }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ showTime(game.game_end_date) }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ playTime(game.game_start_date, game.game_end_date) }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  <button @click="togglePlayers(game.id)">Game Detail</button>
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ shuttlecocksInit(game) }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  {{ shuttlecocksTotal(game) }}
                </td>
                <td class="tw-px-2 tw-py-1">
                  <button @click="addShuttlecock(game.id)">Add</button>
                </td>
                <td class="tw-px-2 tw-py-1">
                  <ConfirmPopup></ConfirmPopup>
                  <button @click="listGame(game.id, $event)">List</button>
                </td>
                <td class="tw-px-2 tw-py-1">
                  <button @click="startGame(game.id)">Start</button>
                </td>
                <td class="tw-px-2 tw-py-1">
                  <button @click="finishGame(game.id)">Finish</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- <Crud></Crud> -->
  </AppLayout>
</template>
