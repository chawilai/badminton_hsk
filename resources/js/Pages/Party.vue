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
    party_id: "1",
    game_type: "quadruple",
    status: "setting",
    initial_shuttlecock_game: 0,
});

const parties = ref([]);
const selectedParty = ref({});
const games = ref([]);
const isSidebar = ref(true);

const game_data = reactive({
    game_id: "",
    party_member_id: "",
    ready_players: [],
});

parties.value = page.props.parties;
games.value = page.props.games;

const settingGame =
    page.props.games.find((sc) => sc.status === "setting") ?? null;

const visibleGameId = ref(settingGame ? settingGame.id : null);
const game_players = ref(settingGame ? settingGame.game_players : []);

const team1Side = ref(null);
const initial_shuttlecock_party = ref(0);

const position = ref("center");

const visible = ref(false);
const setScoreGame = ref({});

const openPosition = (pos, game) => {
    setScoreGame.value = game;

    console.log(setScoreGame.value);

    position.value = pos;
    visible.value = true;
};

const thisGame =
    ref(games.value.find((sc) => sc.id == visibleGameId.value)) ?? null;

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

const gamePlayerSummary = () => {
    if (thisGame.value) {
        return ` (${game_players.value.length}/${
            thisGame.value.game_type == "quadruple" ? 4 : 2
        })`;
    }
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

                thisGame.value = games.value.find(
                    (sc) => sc.id == game_data.game_id
                );
                game_players.value = thisGame.value.game_players;
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
                visibleGameId.value = gameId;
                fetchReadyPlayer(gameId);

                thisGame.value = games.value.find((sc) => sc.id == gameId);
                game_players.value = thisGame.value.game_players;
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
    thisGame.value = games.value.find((sc) => sc.id == gameId);
    game_players.value = thisGame.value.game_players;
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

    return `playtime: ` + result.trim(); // Trim any extra space
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
                            thisGame.value = games.value.find(
                                (sc) => sc.id == gameId
                            );
                            game_players.value = thisGame.value.game_players;

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
    router.post(`/games`, data, {
        preserveScroll: true,
        headers: {
            Accept: "application/json",
        },
        onSuccess: (res) => {
            games.value = res.props.games;

            let newGame = res.props.games.find((sc) => sc.status === "setting");

            visibleGameId.value = newGame.id;

            game_players.value = newGame.game_players;

            fetchReadyPlayer(visibleGameId.value);
            thisGame.value = games.value.find((sc) => sc.id == newGame.id);
            game_players.value = thisGame.value.game_players;

            toast.add({
                severity: "success",
                summary: "Confirmed",
                detail: "The game is created.",
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
                        thisGame.value = games.value.find(
                            (sc) => sc.id == gameId
                        );
                        game_players.value = thisGame.value.game_players;

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
                        thisGame.value = games.value.find(
                            (sc) => sc.id == gameId
                        );
                        game_players.value = thisGame.value.game_players;

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

const deleteGame = (gameId) => {
    confirmPopup.require({
        target: event.target,
        message: "Do you want to delete the game ?",
        icon: "pi pi-eraser",
        accept: () => {
            router.post(
                `/games/${gameId}/delete`,
                {},
                {
                    preserveScroll: true,
                    headers: {
                        Accept: "application/json",
                    },
                    onSuccess: (res) => {
                        game_data.game_id = "";
                        games.value = res.props.games;

                        toast.add({
                            severity: "success",
                            summary: "Confirmed",
                            detail: "The game is deleted.",
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
                detail: "You have rejected deleting the game",
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
                thisGame.value = games.value.find((sc) => sc.id == gameId);
                game_players.value = thisGame.value.game_players;
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

const teamLabel = (team) => {
    if (team === "team1")
        return `<span class='px-2 py-1 bg-pink-400 text-white border-round-md'>${team}</span>`;
    if (team === "team2")
        return `<span class='px-2 py-1 bg-teal-400 text-white border-round-md'>${team}</span>`;
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
    selectedParty.value = parties.value.filter(
        (party) => party.id == partyId
    )[0];
    initial_shuttlecock_party.value =
        selectedParty.value.default_initial_shuttlecocks;

    data.initial_shuttlecock_game = initial_shuttlecock_party.value;
};

const shuttlecocksInit = (game) => {
    const initialShuttlecock = game.shuttlecocks.find(
        (sc) => sc.type === "initial"
    );
    return initialShuttlecock ? initialShuttlecock.quantity : 0;
};

const shuttlecocksTotal = (game) => {
    return game.shuttlecocks.reduce((total, sc) => total + sc.quantity, 0);
};

const addShuttlecock = (gameId) => {
    confirmPopup.require({
        target: event.target,
        message: "Are you sure you want to add 1 shuttlecock ?",
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
                            detail: "1 shuttlecock has been added to the game",
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

const returnShuttlecock = (gameId) => {
    confirmPopup.require({
        target: event.target,
        message: "Are you sure you want to return 1 shuttlecock ?",
        icon: "pi pi-history",
        accept: () => {
            router.post(
                `/games/${gameId}/return-shuttlecocks`,
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
                            detail: "1 shuttlecock has been returned",
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
                detail: "You have rejected returning shuttlecock",
                life: 3000,
            });
        },
    });
};

const isPlayerInGame = (game) => {
    if (!game || !game.game_players) return false;

    return game.game_players.some(
        (player) => player.user_id === page.props.auth.user.id
    );
};

const enterScore = (gameId) => {
    confirmPopup.require({
        target: event.target,
        message: "Are you sure you want to update the game sets?",
        icon: "pi pi-plus-circle",
        accept: () => {
            let sets = [
                {
                    set_number: 1,
                    team1_start_side: "north",
                    team2_start_side: "south",
                    team1_score: 21,
                    team2_score: 19,
                    winning_team: "team1",
                },
                {
                    set_number: 2,
                    team1_start_side: "south",
                    team2_start_side: "north",
                    team1_score: 18,
                    team2_score: 21,
                    winning_team: "team2",
                },
            ];

            router.post(
                `/games/${gameId}/update-game-sets`, // Route to update game sets
                { sets }, // Send the sets array as the request payload
                {
                    preserveScroll: true,
                    headers: {
                        Accept: "application/json",
                    },
                    onSuccess: (res) => {
                        games.value = res.props.games; // Update the games data from the response

                        console.log(res.props);

                        visible.value = false;

                        toast.add({
                            severity: "success",
                            summary: "Game Sets Updated",
                            detail: "Game sets have been successfully updated.",
                            life: 3000,
                        });
                    },
                    onError: (err) => {
                        toast.add({
                            severity: "error",
                            summary: "Error",
                            detail: "Failed to update game sets. Please try again.",
                            life: 3000,
                        });
                    },
                }
            );
        },
        reject: () => {
            toast.add({
                severity: "info",
                summary: "Cancelled",
                detail: "You cancelled updating the game sets.",
                life: 3000,
            });
        },
    });
};

// compute
const playerSortWaiting = computed(() => {
    return Array.isArray(game_data.ready_players)
        ? [...game_data.ready_players].sort(
              (a, b) => b.waiting_time - a.waiting_time
          )
        : [];
});

onMounted(() => {});
</script>

<template>
    <Head title="Party" />

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
                <!-- <div class="p-6 text-gray-900">You're logged in!</div> -->
                <ConfirmPopup></ConfirmPopup>
                <div class="card p-fluid">
                    <button type="button" @click="createGame()">
                        Create Game
                    </button>

                    <select
                        name="party_id"
                        v-model="data.party_id"
                        @change="selectParty(data.party_id)"
                    >
                        <option></option>
                        <option
                            v-for="party in parties"
                            v-text="party.id"
                        ></option>
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
                            v-text="
                                `game:${game.id} party:${game.party_id} type:${game.game_type}`
                            "
                        ></option>
                    </select>
                    <select
                        name="party_member_id"
                        v-model="game_data.party_member_id"
                    >
                        <option></option>
                        <option
                            v-for="(ready_player, index) in playerSortWaiting"
                            :value="ready_player.party_member_id"
                            v-text="
                                `${index + 1}: ${
                                    ready_player.badminton_rank
                                } | ${ready_player.age} (${
                                    ready_player.name
                                }) [played:${
                                    ready_player.finished_games_count
                                }] [Wait Time: ${readAbleTime(
                                    ready_player.waiting_time
                                )}]`
                            "
                        ></option>
                    </select>
                    <select name="team" v-model="game_data.team">
                        <option></option>
                        <option
                            v-for="team in ['team1', 'team2']"
                            v-text="team"
                        ></option>
                    </select>
                    <button type="button" @click="addPlayer()">
                        Add Player
                    </button>
                </div>
                <ul v-if="$page.props.errors">
                    <li
                        class="text-red-600"
                        v-for="error in $page.props.errors"
                        v-text="error"
                    ></li>
                </ul>

                <ul v-if="$page.props.flash.success">
                    <li
                        class="text-green-600"
                        v-for="success in $page.props.flash.success"
                        v-text="success"
                    ></li>
                </ul>

                <ul v-if="$page.props.flash.info">
                    <li
                        class="text-blue-600"
                        v-for="info in $page.props.flash.info"
                        v-text="info"
                    ></li>
                </ul>

                <div class="card p-fluid">
                    <table
                        v-if="visibleGameId"
                        class="border-1 border-gray-300 m-2"
                    >
                        <thead class="bg-green-700 text-white">
                            <tr>
                                <th colspan="6" class="px-3 py-2 text-center">
                                    Game ID : {{ visibleGameId }}
                                    <span
                                        v-html="gameStatus(thisGame.status)"
                                    ></span>
                                    {{ gamePlayerSummary() }}
                                </th>
                            </tr>
                        </thead>
                        <thead class="bg-green-700 text-white">
                            <tr>
                                <th class="px-3 py-2 text-center">Player ID</th>
                                <th class="px-3 py-2 text-center">Name</th>
                                <th class="px-3 py-2 text-center">Pic</th>
                                <th class="px-3 py-2 text-center">Team</th>
                                <!-- <th class="px-3 py-2 text-center">Gender</th> -->
                                <th class="px-3 py-2 text-center">Range</th>
                                <th class="px-3 py-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in game_players" :key="player.id">
                                <td class="px-3 py-2 text-center">
                                    {{ player.user.id }}
                                </td>
                                <td class="px-3 py-2 text-center">
                                    {{ player.user.name }}
                                </td>
                                <td class="px-3 py-2 text-center">
                                    <img
                                        :src="player.user.avatar"
                                        class="w-4rem border-round-xl"
                                        alt=""
                                    />
                                </td>
                                <td
                                    class="px-3 py-2 text-center"
                                    v-html="teamLabel(player.team)"
                                ></td>
                                <!-- <td class="px-3 py-2 text-center">
                                        {{ player.user.gender }}
                                    </td> -->
                                <td class="px-3 py-2 text-center">
                                    {{ player.user.badminton_rank_id }}
                                </td>
                                <td class="px-3 py-2 text-center">
                                    <button
                                        class="cursor-pointer ml-1 bg-red-600 text-white border-1 border-red-600 border-round-sm"
                                        @click="
                                            deletePlayer(
                                                visibleGameId,
                                                player.user.id
                                            )
                                        "
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Dialog for Set Game Score -->
                <Dialog
                    v-model:visible="visible"
                    header="บันทึกผลการแข่งขัน"
                    :style="{ width: '25rem' }"
                    :position="position"
                    :modal="true"
                    :draggable="false"
                >
                    <div
                        class="flex flex-column justify-content-center align-items-center gap-3"
                    >
                        <div>
                            <div class="p-text-secondary mb-2">Team 1</div>
                            <div class="flex flex-row gap-3">
                                <img
                                    v-for="player in setScoreGame.game_players.filter(
                                        (item) => item.team === 'team1'
                                    )"
                                    :src="player.user.avatar"
                                    class="w-4rem border-round-xl"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div>
                            <div class="p-text-secondary mb-2">Team 2</div>
                            <div class="flex flex-row gap-3">
                                <img
                                    v-for="player in setScoreGame.game_players.filter(
                                        (item) => item.team === 'team2'
                                    )"
                                    :src="player.user.avatar"
                                    class="w-4rem border-round-xl"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-content-end gap-2 mt-4">
                        <Button
                            type="button"
                            label="Cancel"
                            severity="secondary"
                            @click="(visible = false), (setScoreGame = {})"
                        ></Button>
                        <Button
                            type="button"
                            label="Save"
                            @click="enterScore(setScoreGame.id)"
                        ></Button>
                    </div>
                </Dialog>
                <!-- Dialog for Set Game Score -->

                <div class="card p-fluid">
                    <table class="">
                        <thead>
                            <tr>
                                <th
                                    class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                >
                                    ID
                                </th>
                                <!-- <th
                                        class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                    >
                                        Party ID
                                    </th> -->
                                <!-- <th
                                        class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                    >
                                        Game Type
                                    </th> -->
                                <th
                                    class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                >
                                    Players
                                </th>
                                <th
                                    class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                >
                                    Status
                                </th>
                                <!-- <th
                                        class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                    >
                                        List At
                                    </th> -->
                                <!-- <th
                                        class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                    >
                                        Played At
                                    </th> -->
                                <!-- <th
                                        class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                    >
                                        Finished At
                                    </th> -->
                                <th
                                    class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                >
                                    Detail
                                </th>
                                <!-- <th
                                        class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                    >
                                        Init
                                    </th> -->
                                <th
                                    class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                >
                                    Shuttle
                                </th>
                                <th
                                    class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                >
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="game in games"
                                :key="game.id"
                                :class="{
                                    'bg-red-200': isPlayerInGame(game),
                                }"
                            >
                                <td class="px-2 py-1">{{ game.id }}</td>
                                <!-- <td class="px-2 py-1">
                                        {{ game.party_id }}
                                    </td> -->
                                <!-- <td class="px-2 py-1">
                                        {{ game.game_type }}
                                    </td> -->
                                <td class="px-2 py-1 relative">
                                    <div
                                        class="flex flex-row align-items-center justify-content-center gap-1 z-0"
                                    >
                                        <img
                                            :src="player.user.avatar"
                                            v-for="player in game.game_players"
                                            class="w-3rem border-round-xl"
                                            alt=""
                                        />
                                    </div>
                                    <button
                                        class="absolute z-3 right-0 top-0"
                                        type="button"
                                        @click="autoAddPlayers(game.id)"
                                    >
                                        +
                                    </button>
                                </td>
                                <td
                                    class="px-2 py-1"
                                    v-html="gameStatus(game.status)"
                                ></td>
                                <!-- <td class="px-2 py-1">
                                        {{ showTime(game.game_list_date) }}
                                    </td> -->
                                <!-- <td class="px-2 py-1">
                                        {{ showTime(game.game_start_date) }}
                                    </td> -->
                                <!-- <td class="px-2 py-1">
                                        {{ showTime(game.game_end_date) }}
                                    </td> -->
                                <td class="px-2 py-1">
                                    <button @click="togglePlayers(game.id)">
                                        Show
                                    </button>
                                </td>
                                <!-- <td class="px-2 py-1">
                                        {{ shuttlecocksInit(game) }}
                                    </td> -->
                                <td class="px-2 py-1 relative text-center">
                                    {{ shuttlecocksTotal(game) }}

                                    <button
                                        class="absolute z-3 left-0 top-8 bg-red-100 border-1 border-gray-400 border-round-xl"
                                        type="button"
                                        @click="returnShuttlecock(game.id)"
                                    >
                                        -
                                    </button>
                                    <button
                                        class="absolute z-3 right-0 top-8 bg-green-100 border-1 border-gray-400 border-round-xl"
                                        type="button"
                                        @click="addShuttlecock(game.id)"
                                    >
                                        +
                                    </button>
                                </td>
                                <td class="px-2 py-1 text-center">
                                    <button
                                        class="cursor-pointer ml-1 bg-purple-400 text-white border-1 border-purple-600 border-round-sm"
                                        v-show="game.status === 'setting'"
                                        @click="listGame(game.id, $event)"
                                    >
                                        List
                                    </button>
                                    <button
                                        class="cursor-pointer ml-1 bg-green-600 text-white border-1 border-green-600 border-round-sm"
                                        v-show="game.status === 'listing'"
                                        @click="startGame(game.id)"
                                    >
                                        Start
                                    </button>
                                    <button
                                        class="cursor-pointer ml-1 bg-red-600 text-white border-1 border-red-600 border-round-sm"
                                        v-show="
                                            ['setting', 'listing'].includes(
                                                game.status
                                            )
                                        "
                                        @click="deleteGame(game.id)"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        class="cursor-pointer ml-1 bg-blue-600 text-white border-1 border-blue-600 border-round-sm"
                                        v-show="game.status === 'playing'"
                                        @click="finishGame(game.id)"
                                    >
                                        Finish
                                    </button>
                                    <div v-show="game.status === 'finished'">
                                        {{
                                            playTime(
                                                game.game_start_date,
                                                game.game_end_date
                                            )
                                        }}
                                    </div>
                                    <div
                                        v-show="
                                            game.status === 'finished' &&
                                            isPlayerInGame(game)
                                        "
                                    >
                                        <Button
                                            @click="
                                                openPosition('center', game)
                                            "
                                            icon="pi pi-bookmark"
                                            severity="blue"
                                            rounded
                                            class="mb-2 mr-2"
                                        />
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="col-12 md:col-5 xl:col-3">
                <div class="card">
                    <div class="text-900 text-xl font-semibold mb-3">
                        Account Storage
                    </div>
                    <div
                        class="flex flex-row justify-content-center"
                        style="height: 200px"
                    >
                        <!-- <Chart type="doughnut" :plugins="chartPlugins" :data="chartData" :options="chartOptions"></Chart> -->
                    </div>
                    <div class="mt-5 flex gap-3">
                        <Button
                            icon="pi pi-search"
                            class="flex-1"
                            label="Details"
                            outlined
                        ></Button>
                        <Button
                            icon="pi pi-upload"
                            class="flex-1"
                            label="Upgrade"
                        ></Button>
                    </div>
                </div>

                <div class="card">
                    <div class="text-900 text-xl font-semibold mb-3">
                        Categories
                    </div>
                    <ul class="list-none p-0 m-0">
                        <li
                            class="p-3 mb-3 flex align-items-center justify-content-between cursor-pointer border-round bg-indigo-50 text-indigo-900"
                        >
                            <div class="flex align-items-center">
                                <i class="pi pi-image text-2xl mr-3"></i>
                                <span class="ext-lg font-medium">Images</span>
                            </div>
                            <span class="text-lg font-bold">85</span>
                        </li>
                        <li
                            class="p-3 mb-3 flex align-items-center justify-content-between cursor-pointer border-round bg-purple-50 text-purple-900"
                        >
                            <div class="flex align-items-center">
                                <i class="pi pi-file text-2xl mr-3"></i>
                                <span class="ext-lg font-medium"
                                    >Documents</span
                                >
                            </div>
                            <span class="text-lg font-bold">231</span>
                        </li>
                        <li
                            class="p-3 flex align-items-center justify-content-between cursor-pointer border-round bg-teal-50 text-teal-900"
                        >
                            <div class="flex align-items-center">
                                <i class="pi pi-video text-2xl mr-3"></i>
                                <span class="ext-lg font-medium">Videos</span>
                            </div>
                            <span class="text-lg font-bold">40</span>
                        </li>
                    </ul>
                </div>

                <div class="card p-0">
                    <div class="card"></div>
                </div>
            </div>
            <div class="col-12 md:col-7 xl:col-9">
                <div class="card">
                    <div class="text-900 text-xl font-semibold mb-3">
                        Folders
                    </div>
                    <div class="grid"></div>
                </div>
                <div class="card">
                    <div class="text-900 text-xl font-semibold mb-3">
                        Recent Uploads
                    </div>
                    <!-- <DataTable :value="files" dataKey="id" paginator :rows="8">
                        <Column field="name" header="Name" sortable :headerStyle="{ minWidth: '12rem' }">
                            <template #body="{ data }">
                                <div class="flex align-items-center">
                                    <i class="text-xl text-primary mr-2" :class="data.icon"></i>
                                    <span>{{ data.name }}</span>
                                </div>
                            </template>
                        </Column>
                        <Column field="date" header="Date" headerClass="white-space-nowrap" :headerStyle="{ minWidth: '12rem' }"> </Column>
                        <Column field="fileSize" header="File Size" sortable :headerStyle="{ minWidth: '12rem' }"></Column>
                        <Column class="w-10rem">
                            <template #body>
                                <div class="text-center">
                                    <Button icon="pi pi-times" class="mr-2" severity="danger" text rounded></Button>
                                    <Button icon="pi pi-search" text rounded></Button>
                                </div>
                            </template>
                        </Column>
                    </DataTable> -->
                </div>
            </div>
        </div>

        <!-- <Crud></Crud> -->
    </AppLayout>
</template>
