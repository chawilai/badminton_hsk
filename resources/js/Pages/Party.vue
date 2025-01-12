<script setup>
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import AppLayout from "@/layout/AppLayout.vue";
import Game from "@/Pages/Game2.vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
import Crud from "@/Pages/Prime/Crud.vue";

import crown from "@/../assets/images/crown.png";
import amyelsner from "@/../assets/demo/images/avatar/amyelsner.png";

const toast = useToast();
const confirmPopup = useConfirm();

const page = usePage();

const props = ref(page.props);

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
const visibleTop = ref(false);

const game_data = reactive({
  game_id: "",
  party_member_id: "",
  ready_players: [],
});

parties.value = page.props.parties;
games.value = page.props.games;

const settingGame = page.props.games.find((sc) => sc.status === "setting") ?? null;

const visibleGameId = ref(settingGame ? settingGame.id : null);
const game_players = ref(settingGame ? settingGame.game_players : []);

const team1Side = ref(null);
const initial_shuttlecock_party = ref(0);

const position = ref("center");

const visible = ref(false);
const setScoreGame = ref({});
const gameSet = ref({
  check: false,
});

const colorOptions = ref([
  { name: "Black", background: "bg-gray-900" },
  { name: "Orange", background: "bg-orange-500" },
  { name: "Navy", background: "bg-blue-500" },
]);

const product = ref({
  name: "",
  price: "",
  code: "",
  sku: "",
  status: "Draft",
  tags: ["Nike", "Sneaker"],
  category: "Sneakers",
  colors: [],
  stock: "Sneakers",
  inStock: true,
  description: "",
  images: [],
});

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

const selectedCategory = ref(null);
const selectedStock = ref(null);
const categoryOptions = ["Sneakers", "Apparel", "Socks"];
const fileUploaderRef = ref(null);
const uploadFiles = ref([]);
const name = ref("");
const email = ref("");
const message = ref("");
const content = ref([
  { icon: "pi pi-fw pi-phone", title: "Phone", info: "1 (833) 597-7538" },
  {
    icon: "pi pi-fw pi-map-marker",
    title: "Our Head Office",
    info: "Churchill-laan 16 II, 1052 CD, Amsterdam",
  },
  { icon: "pi pi-fw pi-print", title: "Fax", info: "3 (833) 297-1548" },
]);

const value5 = ref("");
const value10 = ref("");

const cities = ref([
  { name: "New York", code: "NY" },
  { name: "Rome", code: "RM" },
  { name: "London", code: "LDN" },
  { name: "Istanbul", code: "IST" },
  { name: "Paris", code: "PRS" },
]);

// Function to update the `data-value` for specific slider handles
const updateSliderHandleValue = () => {
  sets.value.forEach((set, index) => {
    // Update Team 1 slider handle
    const team1Handle = document.querySelector(
      `[data-set="team1-set-${index}"] .p-slider-handle`
    );
    if (team1Handle) {
      team1Handle.setAttribute("data-value", set.team1_score);
    }

    // Update Team 2 slider handle
    const team2Handle = document.querySelector(
      `[data-set="team2-set-${index}"] .p-slider-handle`
    );
    if (team2Handle) {
      team2Handle.setAttribute("data-value", set.team2_score);
    }
  });
};

// Watch for changes in `sets` and update the slider handles
watch(
  () => sets.value,
  () => {
    updateSliderHandleValue();
  },
  { deep: true }
);

const getTeamBackground = (index, team) => {
  const set = sets.value[index];
  if (!set) return "bg-green-100";

  if (team === "team1" && set.team1_score > set.team2_score) {
    return "bg-gold"; // Gold background for Team 1 win
  }

  if (team === "team2" && set.team2_score > set.team1_score) {
    return "bg-gold"; // Default green for Team 1
  }
  return "bg-green-100"; // Default green
};

const showCrown = (index, team) => {
  const set = sets.value[index];
  if (!set) return false; // Prevent errors if index is out of bounds

  if (team === "team1" && set.team1_score > set.team2_score) {
    return true; // Show crown for Team 1
  }

  if (team === "team2" && set.team2_score > set.team1_score) {
    return true; // Show crown for Team 2
  }

  return false; // Don't show the crown if scores are tied or invalid
};

const validateScore = (index, field) => {
  let value = sets.value[index][field];

  // Remove non-numeric characters
  value = value.toString().replace(/\D/g, "");

  // Ensure the value is within the range 0-30
  value = Math.max(0, Math.min(30, value));

  // Update the score
  sets.value[index][field] = value;
};

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
    ...overrides, // Merge overrides
  };

  sets.value.push(newSet);
};

const removeNewSet = () => {
  confirmPopup.require({
    target: event.target,
    message: "ลบเกมเซ็ต ?",
    icon: "pi pi-delete",
    accept: () => {
      if (sets.value.length > 1) {
        toast.add({
          severity: "success",
          summary: "ลบเกมเซ็ต",
          detail: `ลบรายการลงผลเกม เซ็ตที่ ${sets.value.length} แล้ว`,
          life: 3000,
        });

        sets.value.pop(); // Remove the last set
      } else {
        toast.add({
          severity: "error",
          summary: "ลบเกมเซ็ต",
          detail: "เหลือรายการเดียวแล้ว",
          life: 3000,
        });
      }
    },
    reject: () => {
      toast.add({
        severity: "info",
        summary: "ยกเลิก",
        detail: "ยกเลิกการลบแล้ว",
        life: 3000,
      });
    },
  });
};

const onChooseUploadFiles = () => {
  fileUploaderRef.value.choose();
};
const onSelectedFiles = (event) => {
  uploadFiles.value = event.files;
};
const onRemoveFile = (removeFile) => {
  uploadFiles.value = uploadFiles.value.filter((file) => file.name !== removeFile.name);
};

const onRemoveTags = (tag) => {
  product.value.tags = product.value.tags.filter((t) => t !== tag);
};

const toggleColor = (color) => {
  const index = product.value.colors.indexOf(color);
  if (index > -1) {
    product.value.colors.splice(index, 1);
  } else {
    product.value.colors.push(color);
  }
};

const openPosition = (pos, game) => {
  setScoreGame.value = game;

  sets.value = game.game_sets;

  position.value = pos;
  visible.value = true;
};

const thisGame = ref(games.value.find((sc) => sc.id == visibleGameId.value)) ?? null;

const updateDisplayName = (partyMemberId, newName) => {
  router.post(
    `/party-members/${partyMemberId}/update-name`,
    { display_name: newName },
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (response) => {
        toast.add({
          severity: "success",
          summary: "Name Updated",
          detail: "The player's display name has been updated successfully.",
          life: 3000,
        });

        parties.value = response.props.parties;
      },
      onError: (error) => {
        toast.add({
          severity: "error",
          summary: "Update Failed",
          detail: "Could not update the display name. Please try again.",
          life: 3000,
        });
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

        thisGame.value = games.value.find((sc) => sc.id == game_data.game_id);
        game_players.value = thisGame.value.game_players;

        if (res.props.flash.success && res.props.flash.success.length > 0) {
          toast.add({
            severity: "success",
            summary: "สำเร็จ",
            detail: `เพิ่มผู้เล่นในเกมแล้ว`,
            life: 3000,
          });
        }
      },
      onError: (err) => {
        console.log(err);
        if (err.onlyOnSetting) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "เพิ่มผู้เล่นระหว่างตั้งค่าเกมเท่านั้น",
            life: 3000,
          });
        }
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

        if (res.props.flash.success && res.props.flash.success.length > 0) {
          toast.add({
            severity: "success",
            summary: "จัดผู้เล่น",
            detail: `ระบบได้จัดผู้เล่นที่เหมาะสมลงเกมแล้ว โปรดปรับเปลี่ยน`,
            life: 3000,
          });
        }
      },
      onError: (err) => {
        if (err.notInSetting) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "เกมนี้ไม่ได้อยู่ในสถานะตั้งค่า",
            life: 3000,
          });
        }
        if (err.gameIsFull) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "มีผู้เล่นในเกมนี้ครบจำนวนแล้ว",
            life: 3000,
          });
        }
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
  if (hours > 0) result += `${hours} ชั่วโมง `;
  if (minutes > 0) result += `${minutes} นาที `;
  result += `${seconds} วินาที`;

  return `เล่น ` + result.trim(); // Trim any extra space
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
              thisGame.value = games.value.find((sc) => sc.id == gameId);
              game_players.value = thisGame.value.game_players;

              if (res.props.flash.success && res.props.flash.success.length > 0) {
                toast.add({
                  severity: "success",
                  summary: "สำเร็จ",
                  detail: `ลีสเกมลงรายการรอเล่นแล้ว`,
                  life: 3000,
                });
              }
            },
            onError: (err) => {
              if (err.notEnoughPlayers) {
                toast.add({
                  severity: "error",
                  summary: "ล้มเหลว",
                  detail: "มีผู้เล่นในเกมไม่ครบจำนวน",
                  life: 3000,
                });
              }
              if (err.notInSetting) {
                toast.add({
                  severity: "error",
                  summary: "ล้มเหลว",
                  detail: "ลีสเกมได้เฉพาะเกมที่อยู่ในสถานะตั้งค่า",
                  life: 3000,
                });
              }
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

      if (res.props.flash.success && res.props.flash.success.length > 0) {
        toast.add({
          severity: "success",
          summary: "สำเร็จ",
          detail: `สร้างเกมแล้วโปรดตั้งค่าเกม`,
          life: 3000,
        });
      }
    },
    onError: (err) => {
      if (err.notMatchType) {
        toast.add({
          severity: "error",
          summary: "ล้มเหลว",
          detail: "จำนวนผู้เล่นไม่ตรงกับรูปแบบของเกม",
          life: 3000,
        });
      }
      if (err.existSettingGame) {
        toast.add({
          severity: "error",
          summary: "ล้มเหลว",
          detail: "มีเกมที่กำลังตั้งค่าอยู่ก่อนแล้ว",
          life: 3000,
        });
      }
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
            thisGame.value = games.value.find((sc) => sc.id == gameId);
            game_players.value = thisGame.value.game_players;

            if (res.props.flash.success && res.props.flash.success.length > 0) {
              toast.add({
                severity: "success",
                summary: "สำเร็จ",
                detail: `เกมเริ่มต้นแล้ว`,
                life: 3000,
              });
            }
          },
          onError: (err) => {
            if (err.notInListing) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "เริ่มเกมได้เฉพาะเกมที่มีสถานะลีสรายการ",
                life: 3000,
              });
            }
            if (err.playerPlaying) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "มีผู้เล่นบางคนกำลังเล่นในเกมอื่นอยู่ โปรดจบเกมนั้นก่อน",
                life: 3000,
              });
            }
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
            thisGame.value = games.value.find((sc) => sc.id == gameId);
            game_players.value = thisGame.value.game_players;

            props.value = res.props;

            if (res.props.flash.success && res.props.flash.success.length > 0) {
              toast.add({
                severity: "success",
                summary: "จบเกม",
                detail: `จบเกมเรียบร้อยแล้ว`,
                life: 3000,
              });
            }
          },
          onError: (err) => {
            if (err.notInPlaying) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "เกมต้องกำลังเล่นจึงกดจบเกมได้",
                life: 3000,
              });
            }
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

            if (res.props.flash.success && res.props.flash.success.length > 0) {
              toast.add({
                severity: "warn",
                summary: "ลบเกม",
                detail: `ลบเกมเรียบร้อยแล้ว`,
                life: 3000,
              });
            }
          },
          onError: (err) => {
            if (err.onlyOnSettingOrListing) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "ลบเกมได้เฉพาะขณะตั้งค่าหรือลีสเกมเท่านั้น",
                life: 3000,
              });
            }
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

        if (res.props.flash.success && res.props.flash.success.length > 0) {
          toast.add({
            severity: "warn",
            summary: "สำเร็จ",
            detail: `ลบผู้เล่นในเกมแล้ว`,
            life: 3000,
          });
        }
      },
      onError: (err) => {
        if (err.onlyOnSettingOrListing) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "ลบได้ระหว่างตั้งค่าหรือลีสเกมก่อนเล่นเท่านั้น",
            life: 3000,
          });
        }
        if (err.noPlayerFound) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "ไม่พบผู้เล่นดังกล่าวในเกมนี้",
            life: 3000,
          });
        }
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

        if (res.props.flash.info && res.props.flash.info.length > 0) {
          toast.add({
            severity: "info",
            summary: "ค่าคงเดิม",
            detail: `จำนวนลูกขนไก่ตั้งต้น คงเดิม (${initial_shuttlecock_party.value})`,
            life: 3000,
          });
        }
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
          onError: (err) => {
            if (err.finishedGame) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "ไม่สามารถเพิ่มลูกขนไก่ได้หลังจบเกม",
                life: 3000,
              });
            }
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
          onError: (err) => {
            if (err.shuttlecocksIsZero) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "จำนวนลูกขนไก่เป็นศูนย์แล้ว",
                life: 3000,
              });
            }
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

  return game.game_players.some((player) => player.user_id === page.props.auth.user.id);
};

const getMaxPlayers = (gameType) => {
  switch (gameType) {
    case "double":
      return 2;
    case "quadruple":
      return 4;
    default:
      return null; // Invalid or undefined game type
  }
};

const isGameIsFull = (game) => {
  if (!game || !game.game_players || !game.game_type) return false;

  const maxPlayers = getMaxPlayers(game.game_type);

  if (maxPlayers === null) return false;

  return game.game_players.length >= maxPlayers;
};

const enterScore = (gameId) => {
  confirmPopup.require({
    target: event.target,
    message: "ยืนยัน ?",
    icon: "pi pi-plus-circle",
    accept: () => {
      // set winning team
      sets.value.forEach((set) => {
        if (set.team1_score && set.team2_score) {
          set.winning_team = set.team1_score > set.team2_score ? "team1" : "team2";
        }
      });

      router.post(
        `/games/${gameId}/update-game-sets`, // Route to update game sets
        { sets: sets.value }, // Send the sets array as the request payload
        {
          preserveScroll: true,
          headers: {
            Accept: "application/json",
          },
          onSuccess: (res) => {
            games.value = res.props.games; // Update the games data from the response

            visible.value = false;

            sets.value = [
              {
                set_number: 1,
                team1_start_side: "north",
                team2_start_side: "south",
                team1_score: 0,
                team2_score: 0,
                winning_team: null,
              },
            ];

            toast.add({
              severity: "success",
              summary: "บันทึกผลการแข่ง",
              detail: "ลงผลการแข่งของท่าน เรียบร้อยแล้ว",
              life: 3000,
            });
          },
          onError: (err) => {
            toast.add({
              severity: "error",
              summary: "ล้มเหลว",
              detail: "การลงผลล้มเหลว โปรดลองอีกครั้ง",
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

const partyReload = (payload) => {
  console.log("Game Created");
  console.log(payload);

  router.post(
    `/fetch-party-data`,
    {},
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (res) => {
        props.value = res.props;

        game_data.party_member_id = "";
        games.value = res.props.games;
      },
      onError: (err) => {
        console.log(err);
        if (err.onlyOnSetting) {
          toast.add({
            severity: "error",
            summary: "ล้มเหลว",
            detail: "เพิ่มผู้เล่นระหว่างตั้งค่าเกมเท่านั้น",
            life: 3000,
          });
        }
      },
    }
  );

  visibleTop.value = false;

  //   router.get("party");
};

// compute
const playerSortWaiting = computed(() => {
  return Array.isArray(game_data.ready_players)
    ? [...game_data.ready_players].sort((a, b) => b.waiting_time - a.waiting_time)
    : [];
});

onMounted(() => {
  updateSliderHandleValue();
});
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
    <div class="card mt-4">
      <Button icon="pi pi-plus" label="Create New Game" @click="visibleTop = true" />

      <Sidebar
        v-model:visible="visibleTop"
        position="top"
        style="height: auto; padding: 0px; margin: 0px"
      >
        <template #header>
          <div class="flex align-items-center gap-2">
            <Avatar :image="amyelsner" shape="circle" />
            <span class="font-bold">Game Making</span>
          </div>
        </template>
        <ScrollPanel style="width: 100%; height: 85vh">
          <Game :data="props" @gameCreated="partyReload" />
        </ScrollPanel>
      </Sidebar>
    </div>

    <!-- <div class="p-6 text-gray-900">You're logged in!</div> -->
    <ConfirmPopup></ConfirmPopup>
    <div class="card p-fluid">
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
        <option v-for="game_type in ['double', 'quadruple']" v-text="game_type"></option>
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
              ready_player.display_name
            }) [played:${ready_player.finished_games_count}] [Wait Time: ${readAbleTime(
              ready_player.waiting_time
            )}]`
          "
        ></option>
      </select>
      <select name="team" v-model="game_data.team">
        <option></option>
        <option v-for="team in ['team1', 'team2']" v-text="team"></option>
      </select>
      <button type="button" @click="addPlayer()">Add Player</button>
    </div>
    <!-- <ul v-if="$page.props.errors">
            <li
                class="text-red-600"
                v-for="error in $page.props.errors"
                v-text="error"
            ></li>
        </ul> -->

    <!-- <ul v-if="$page.props.flash.success">
          <li
            class="text-green-600"
            v-for="success in $page.props.flash.success"
            v-text="success"
          ></li>
        </ul> -->

    <!-- <ul v-if="$page.props.flash.info">
          <li
            class="text-blue-600"
            v-for="info in $page.props.flash.info"
            v-text="info"
          ></li>
        </ul> -->

    <div class="card" v-if="false">
      <Panel header="GamePlayers" toggleable>
        <div class="overflow-auto whitespace-nowrap">
          <table v-if="visibleGameId" class="border-1 border-gray-300 m-2">
            <thead class="bg-green-700 text-white">
              <tr>
                <th colspan="6" class="px-3 py-2 text-center">
                  Game ID : {{ visibleGameId }}
                  <span v-html="gameStatus(thisGame.status)"></span>
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
                  {{ player.display_name }}
                </td>
                <td class="px-3 py-2 text-center">
                  <img :src="player.user.avatar" class="w-4rem border-round-xl" alt="" />
                </td>
                <td class="px-3 py-2 text-center" v-html="teamLabel(player.team)"></td>
                <!-- <td class="px-3 py-2 text-center">
                                        {{ player.user.gender }}
                                    </td> -->
                <td class="px-3 py-2 text-center">
                  {{ player.user.badminton_rank_id }}
                </td>
                <td class="px-3 py-2 text-center">
                  <button
                    class="cursor-pointer ml-1 bg-red-600 text-white border-1 border-red-600 border-round-sm"
                    @click="deletePlayer(visibleGameId, player.user.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
    <!-- Dialog for Set Game Score -->
    <Dialog
      v-model:visible="visible"
      header="บันทึกผลการแข่งขัน"
      :style="{ width: '25rem', padding: '0px' }"
      :position="position"
      :modal="true"
      :draggable="false"
    >
      <div
        class="flex flex-column align-items-center w-full"
        v-for="(set, index) in sets"
        :key="index"
      >
        <div class="text-center text-xl font-bold bg-blue-300 border-round-lg px-2 mb-2">
          SET #{{ index + 1 }}
        </div>
        <div class="flex flex-row justify-content-center align-items-center">
          <!-- Team 1 Section -->
          <div
            :class="['p-3 border-round-xl relative', getTeamBackground(index, 'team1')]"
          >
            <img
              v-show="showCrown(index, 'team1')"
              :src="crown"
              class="w-4rem h-4rem absolute -rotate-45"
              style="top: -25px; left: -10px"
              alt=""
            />
            <div class="p-text-secondary mb-2 text-center font-bold text-md">Team 1</div>
            <div class="flex flex-row gap-1 justify-content-center mb-3">
              <div
                class="flex flex-column"
                v-for="player in setScoreGame.game_players.filter(
                  (item) => item.team === 'team1'
                )"
                :key="player.user.id"
              >
                <div
                  v-text="player.display_name"
                  class="text-xs text-gray-500 text-center"
                ></div>
                <img
                  :src="player.user.avatar"
                  class="w-4rem border-round-xl"
                  alt="Player Avatar"
                />
              </div>
            </div>
            <div class="w-full text-center">
              <div
                class="flex flex-row align-items-center justify-content-center mb-3 gap-1"
              >
                <InputText
                  v-model="set.team1_score"
                  class="w-4rem text-center"
                  @input="validateScore(index, 'team1_score')"
                />
                <div
                  class="flex flex-column align-items-center justify-content-center gap-1"
                >
                  <Button
                    class="w-2rem h-1rem text-xs flex align-items-center p-0 m-0"
                    rounded
                    type="button"
                    label="Clear"
                    severity="danger"
                    @click="set.team1_score = 0"
                  ></Button>
                  <Button
                    class="w-2rem h-1rem text-xs flex align-items-center p-0 m-0"
                    rounded
                    type="button"
                    label="21"
                    severity="success"
                    @click="set.team1_score = 21"
                  ></Button>
                </div>
              </div>
              <div class="flex flex-row align-items-center justify-content-center gap-2">
                <button
                  type="button"
                  style="width: 12px; height: 12px; margin-left: -10px"
                  class="flex align-items-center justify-content-center bg-red-400 border-none border-round-xl text-white font-bold cursor-pointer"
                  @click="set.team1_score > 0 ? set.team1_score-- : null"
                >
                  -
                </button>
                <Slider
                  :min="0"
                  :max="30"
                  v-model="set.team1_score"
                  class="w-full"
                  :data-set="'team1-set-' + index"
                />
                <button
                  type="button"
                  style="width: 12px; height: 12px; margin-right: -10px"
                  class="flex align-items-center justify-content-center bg-green-400 border-none border-round-xl text-white font-bold cursor-pointer"
                  @click="set.team1_score < 30 ? set.team1_score++ : null"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <Divider layout="vertical" />

          <!-- Team 2 Section -->
          <div
            :class="['p-3 border-round-xl relative', getTeamBackground(index, 'team2')]"
          >
            <img
              v-show="showCrown(index, 'team2')"
              :src="crown"
              class="w-4rem h-4rem absolute rotate-45"
              style="top: -25px; right: -10px"
              alt=""
            />
            <div class="p-text-secondary mb-2 text-center font-bold text-md">Team 2</div>
            <div class="flex flex-row gap-1 justify-content-center mb-3">
              <div
                class="flex flex-column"
                v-for="player in setScoreGame.game_players.filter(
                  (item) => item.team === 'team2'
                )"
                :key="player.user.id"
              >
                <div
                  v-text="player.display_name"
                  class="text-xs text-gray-500 text-center"
                ></div>
                <img
                  :src="player.user.avatar"
                  class="w-4rem border-round-xl"
                  alt="Player Avatar"
                />
              </div>
            </div>
            <div class="w-full text-center">
              <div
                class="flex flex-row align-items-center justify-content-center mb-3 gap-1"
              >
                <InputText
                  v-model="set.team2_score"
                  class="w-4rem text-center"
                  @input="validateScore(index, 'team2_score')"
                />
                <div
                  class="flex flex-column align-items-center justify-content-center gap-1"
                >
                  <Button
                    class="w-2rem h-1rem text-xs flex align-items-center p-0 m-0"
                    rounded
                    type="button"
                    label="Clear"
                    severity="danger"
                    @click="set.team2_score = 0"
                  ></Button>
                  <Button
                    class="w-2rem h-1rem text-xs flex align-items-center p-0 m-0"
                    rounded
                    type="button"
                    label="21"
                    severity="success"
                    @click="set.team2_score = 21"
                  ></Button>
                </div>
              </div>
              <div class="flex flex-row align-items-center justify-content-center gap-2">
                <button
                  type="button"
                  style="width: 12px; height: 12px; margin-left: -10px"
                  class="flex align-items-center justify-content-center bg-red-400 border-none border-round-xl text-white font-bold cursor-pointer"
                  @click="set.team2_score > 0 ? set.team2_score-- : null"
                >
                  -
                </button>
                <Slider
                  :min="0"
                  :max="30"
                  v-model="set.team2_score"
                  class="w-full"
                  :data-set="'team2-set-' + index"
                />
                <button
                  type="button"
                  style="width: 12px; height: 12px; margin-right: -10px"
                  class="flex align-items-center justify-content-center bg-green-400 border-none border-round-xl text-white font-bold cursor-pointer"
                  @click="set.team2_score < 30 ? set.team2_score++ : null"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Add <hr> Between Sets -->
        <hr class="w-full my-4 border-gray-300" />
      </div>

      <div class="flex align-items-center justify-content-center gap-2">
        <Button
          rounded
          type="button"
          :label="`เพิ่ม Set ${sets.length + 1}`"
          severity="success"
          @click="addNewSet"
          text
          raised
        ></Button>
        <Button
          v-show="sets.length > 1"
          class="w-5rem h-2rem"
          style="font-size: 0.8rem"
          rounded
          type="button"
          label="ลบ Set"
          severity="danger"
          @click="removeNewSet"
          text
          raised
        ></Button>
      </div>

      <div class="flex justify-content-end gap-2 mt-4">
        <Button
          type="button"
          label="Cancel"
          severity="secondary"
          @click="(visible = false), (setScoreGame = {})"
        ></Button>
        <Button type="button" label="Save" @click="enterScore(setScoreGame.id)"></Button>
      </div>
    </Dialog>
    <!-- Dialog for Set Game Score -->
    <div class="card">
      <Panel header="Games List" toggleable>
        <div class="overflow-auto whitespace-nowrap">
          <table class="">
            <thead>
              <tr>
                <th class="py-1 px-3 text-md text-center bg-green-500 text-white">ID</th>
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
                <th class="py-1 px-3 text-md text-center bg-green-500 text-white">
                  Players
                </th>
                <th class="py-1 px-3 text-md text-center bg-green-500 text-white">
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
                <!-- <th class="py-1 px-3 text-md text-center bg-green-500 text-white">
                  Detail
                </th> -->
                <!-- <th
                                                  class="py-1 px-3 text-md text-center bg-green-500 text-white"
                                              >
                                                  Init
                                              </th> -->
                <th class="py-1 px-3 text-md text-center bg-green-500 text-white">
                  Shuttle
                </th>
                <th class="py-1 px-3 text-md text-center bg-green-500 text-white">
                  Action
                </th>
                <th class="py-1 px-3 text-md text-center bg-green-500 text-white">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="game in games"
                :key="game.id"
                :class="{
                  'bg-teal-200': isPlayerInGame(game),
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
                    v-if="!isGameIsFull(game)"
                    class="absolute z-3 right-0 top-0"
                    type="button"
                    @click="autoAddPlayers(game.id)"
                  >
                    +
                  </button>
                </td>
                <td class="px-2 py-1" v-html="gameStatus(game.status)"></td>
                <!-- <td class="px-2 py-1">
                                                  {{ showTime(game.game_list_date) }}
                                              </td> -->
                <!-- <td class="px-2 py-1">
                                                  {{ showTime(game.game_start_date) }}
                                              </td> -->
                <!-- <td class="px-2 py-1">
                                                  {{ showTime(game.game_end_date) }}
                                              </td> -->
                <!-- <td class="px-2 py-1">
                  <button @click="togglePlayers(game.id)">Show</button>
                </td> -->
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
                    v-show="['setting', 'listing'].includes(game.status)"
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
                    {{ playTime(game.game_start_date, game.game_end_date) }}
                  </div>
                </td>
                <td class="px-2 py-1 text-center">
                  <div
                    v-if="game.status === 'finished' && isPlayerInGame(game)"
                    class="flex justify-content-center align-items-center"
                  >
                    <Button
                      @click="openPosition('top', game)"
                      label="ลงผล"
                      severity="blue"
                      style="font-size: 1rem"
                      class="w-4rem h-2rem flex justify-content-center align-items-center"
                    />
                  </div>
                  <div class="flex flex-column">
                    <div
                      v-if="
                        game.status === 'finished' &&
                        game.game_sets &&
                        game.game_sets[0] &&
                        game.game_sets[0].winning_team
                      "
                      v-html="`${game.game_sets.length} set`"
                      class="underline font-bold"
                    ></div>
                    <div
                      v-if="game.status === 'finished'"
                      v-html="
                        game_set && game_set.winning_team
                          ? `${game_set.team1_score} : ${game_set.team2_score}`
                          : `รอผู้เล่นลงผล`
                      "
                      v-for="game_set in game.game_sets"
                    ></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>

    <!-- <Crud></Crud> -->
    <hr />

    <div class="card">
      <TabView>
        <TabPanel header="Details">
          <div class="text-900 font-bold text-3xl mb-4 mt-2">รายการผู้เล่น</div>

          <div class="overflow-auto whitespace-nowrap">
            <div
              v-for="(member, index) in parties[0].members"
              :key="member.id"
              class="flex flex-column mb-3"
            >
              <div class="flex flex-row align-items-center gap-3">
                <div
                  v-text="`${index + 1}`"
                  class="text-lg font-bold text-gray-600"
                ></div>
                <img
                  :src="member.user.avatar"
                  :alt="member.display_name"
                  class="w-3rem h-3rem border-round-xl mr-2"
                />
                <input
                  type="text"
                  v-model="member.display_name"
                  class="p-inputtext w-8rem"
                  placeholder="Enter display name"
                  @blur="updateDisplayName(member.id, member.display_name)"
                />
                <button
                  class=""
                  type="button"
                  @click="updateDisplayName(member.id, member.display_name)"
                  raised
                >
                  Save
                </button>
                <div v-text="`(${member.user.name})`"></div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Reviews">
          <div class="text-900 font-bold text-3xl mb-4 mt-2">Customer Reviews</div>
          <ul class="list-none p-0 m-0">
            <li class="pb-5 border-bottom-1 surface-border">
              <span>
                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                <i class="pi pi-star-fill text-gray-500"></i>
              </span>
              <div class="text-900 font-bold text-xl my-3">Absolute Perfection!</div>
              <p class="mx-0 mt-0 mb-3 text-600 line-height-3">
                Blandit libero volutpat sed cras ornare arcu dui vivamus. Arcu dictum
                varius duis at consectetur lorem donec massa. Imperdiet proin fermentum
                leo vel orci porta non. Porttitor rhoncus dolor purus non.
              </p>
              <span class="font-medium">Darlene Robertson, 2 days ago</span>
            </li>
            <li class="py-5 border-bottom-1 surface-border">
              <span>
                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                <i class="pi pi-star-fill text-yellow-500 mr-1"></i>
                <i class="pi pi-star-fill text-yellow-500"></i>
              </span>
              <div class="text-900 font-bold text-xl my-3">Classy</div>
              <p class="mx-0 mt-0 mb-3 text-600 line-height-3">
                Venenatis cras sed felis eget. Proin nibh nisl condimentum id venenatis a
                condimentum.
              </p>
              <span class="font-medium">Kristin Watson, 2 days ago</span>
            </li>
          </ul>
        </TabPanel>
        <TabPanel header="Shipping and Returns">
          <div class="text-900 font-bold text-3xl mb-4 mt-2">Shipping Placeholder</div>
          <p class="line-height-3 text-600 p-0 mx-0 mt-0 mb-4">
            Mattis aliquam faucibus purus in massa tempor nec feugiat nisl. Justo donec
            enim diam vulputate ut pharetra. Tempus egestas sed sed risus. Feugiat sed
            lectus vestibulum mattis. Tristique nulla aliquet enim tortor at auctor urna
            nunc. Habitant morbi tristique senectus et. Facilisi nullam vehicula ipsum.
          </p>

          <div class="grid">
            <div class="col-12 md:col-6">
              <span class="text-900 block font-bold mb-3 font-bold">Shipping Costs</span>
              <ul class="py-0 pl-3 m-0 text-600 mb-3">
                <li class="mb-2">Japan - JPY 2,500.</li>
                <li class="mb-2">Europe - EUR 10</li>
                <li class="mb-2">Switzerland - CHF 10</li>
                <li class="mb-2">Canada - CAD 25</li>
                <li class="mb-2">USA - USD 20</li>
                <li class="mb-2">Australia - AUD 30</li>
                <li class="mb-2">United Kingdom - GBP 10</li>
              </ul>
            </div>
            <div class="col-12 md:col-6">
              <span class="text-900 block font-bold mb-3">Return Policy</span>
              <p class="line-height-3 text-600 p-0 m-0">
                Pharetra et ultrices neque ornare aenean euismod elementum nisi. Diam
                phasellus vestibulum lorem sed. Mattis molestie a iaculis at.
              </p>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>

    <div class="card" v-if="false">
      <span class="block text-900 font-bold text-xl mb-4">Create Product</span>
      <div class="grid grid-nogutter flex-wrap gap-3 p-fluid">
        <div class="col-12 lg:col-8">
          <div class="grid formgrid">
            <div class="col-12 field">
              <InputText type="text" placeholder="Product Name" v-model="product.name" />
            </div>
            <div class="col-12 lg:col-4 field">
              <InputText
                type="text"
                placeholder="Price"
                label="Price"
                v-model="product.price"
              />
            </div>
            <div class="col-12 lg:col-4 field">
              <InputText
                type="text"
                placeholder="Product Code"
                label="Product Code"
                v-model="product.code"
              />
            </div>
            <div class="col-12 lg:col-4 field">
              <InputText
                type="text"
                placeholder="Product SKU"
                label="SKU"
                v-model="product.sku"
              />
            </div>
            <div class="col-12">
              <Editor editorStyle="height: 320px"></Editor>
            </div>
            <div class="col-12 mt-3">
              <FileUpload
                ref="fileUploaderRef"
                id="files-fileupload"
                name="demo[]"
                accept="image/*"
                customUpload
                multiple
                auto
                class="border-1 surface-border surface-card p-0 border-round"
                :maxFileSize="1000000"
                @select="onSelectedFiles"
                :pt="{
                  buttonbar: { class: 'hidden' },
                  root: {
                    style: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  },
                }"
              >
                <template v-if="uploadFiles.length > 0" #content>
                  <div class="h-20rem m-1 border-round">
                    <div
                      v-for="file in uploadFiles"
                      :key="file.name"
                      class="w-full h-full relative border-round p-0"
                      :style="{ cursor: 'copy' }"
                    >
                      <div
                        class="remove-file-wrapper h-full relative border-3 border-transparent border-round hover:bg-primary transition-duration-100 cursor-auto"
                      >
                        <img
                          :src="file.objectURL"
                          :alt="file.name"
                          class="w-full h-full border-round"
                        />
                        <Button
                          icon="pi pi-times"
                          class="remove-button text-sm absolute justify-content-center align-items-center cursor-pointer"
                          rounded
                          :style="{
                            top: '-10px',
                            right: '-10px',
                            display: 'none',
                            width: '3rem',
                          }"
                          @click="onRemoveFile(file)"
                        ></Button>
                      </div>
                    </div>
                  </div>
                </template>
                <template #empty>
                  <div v-if="uploadFiles.length < 1" class="h-20rem m-1 border-round">
                    <div
                      @click="onChooseUploadFiles"
                      class="flex flex-column w-full h-full justify-content-center align-items-center cursor-pointer"
                      :style="{ cursor: 'copy' }"
                    >
                      <i class="pi pi-fw pi-file text-4xl text-primary"></i>
                      <span class="block font-semibold text-900 text-lg mt-3"
                        >Drop or select a cover image</span
                      >
                    </div>
                  </div>
                </template>
              </FileUpload>
            </div>
          </div>
        </div>
        <div class="flex-1 w-full lg:w-3 xl:w-4 flex flex-column row-gap-3">
          <div class="border-1 surface-border border-round">
            <span class="text-900 font-bold block border-bottom-1 surface-border p-3"
              >Publish</span
            >
            <div class="p-3">
              <div class="surface-100 py-2 px-3 flex align-items-center border-round">
                <span class="text-black-alpha-90 font-bold mr-3">Status:</span>
                <span class="text-black-alpha-60 font-semibold">Draft</span>
                <Button
                  type="button"
                  icon="pi pi-fw pi-pencil"
                  class="ml-auto"
                  text
                  rounded
                ></Button>
              </div>
            </div>
          </div>
          <div class="border-1 surface-border border-round">
            <span class="text-900 font-bold block border-bottom-1 surface-border p-3"
              >Tags</span
            >
            <div class="p-3 flex flex-wrap gap-1">
              <Chip
                v-for="(tag, i) in product.tags"
                :key="i"
                :label="tag"
                class="mr-2 py-2 px-3 text-900 font-bold surface-card border-1 surface-border"
                style="border-radius: 20px"
              >
                <span class="mr-3">{{ tag }}</span>
                <span
                  class="flex align-items-center justify-content-center border-1 surface-border bg-gray-100 border-circle cursor-pointer"
                  :style="{
                    width: '1.5rem',
                    height: '1.5rem',
                  }"
                  @click="onRemoveTags(tag)"
                >
                  <i
                    class="pi pi-fw pi-times text-black-alpha-60"
                    :style="{ fontSize: '9px' }"
                  ></i> </span
              ></Chip>
            </div>
          </div>
          <div class="border-1 surface-border border-round">
            <span class="text-900 font-bold block border-bottom-1 surface-border p-3"
              >Category</span
            >
            <div class="p-3">
              <Dropdown
                :options="categoryOptions"
                v-model="selectedCategory"
                placeholder="Select a category"
              ></Dropdown>
            </div>
          </div>

          <div class="border-1 surface-border border-round">
            <span class="text-900 font-bold block border-bottom-1 surface-border p-3"
              >Colors</span
            >
            <div class="p-3 flex">
              <div
                v-for="(color, i) in colorOptions"
                :key="i"
                class="w-2rem h-2rem mr-2 border-1 surface-border border-circle cursor-pointer flex justify-content-center align-items-center"
                :class="color.background"
                @click="toggleColor(color.name)"
              >
                <i
                  v-if="product.colors.includes(color.name)"
                  :key="i"
                  class="pi pi-check text-sm text-white z-5"
                ></i>
              </div>
            </div>
          </div>

          <div class="border-1 surface-border border-round">
            <span class="text-900 font-bold block border-bottom-1 surface-border p-3"
              >Stock</span
            >
            <div class="p-3">
              <Dropdown
                :options="categoryOptions"
                v-model="selectedStock"
                placeholder="Select stock"
              ></Dropdown>
            </div>
          </div>
          <div
            class="border-1 surface-border flex justify-content-between align-items-center px-3 border-round"
          >
            <span class="text-900 font-bold p-3">In stock</span>
            <InputSwitch v-model="product.inStock"></InputSwitch>
          </div>
          <div class="flex justify-content-between gap-3">
            <Button
              class="flex-1"
              severity="danger"
              outlined
              label="Discard"
              icon="pi pi-fw pi-trash"
            ></Button>
            <Button class="flex-1" label="Publish" icon="pi pi-fw pi-check"></Button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="false"
      class="grid card grid-nogutter"
      style="column-gap: 2rem; row-gap: 2rem"
    >
      <div class="col-12">
        <p class="text-900 font-bold">Contact Us</p>
      </div>
      <div
        class="col-12 mt-3 h-20rem border-1 surface-border p-0 w-full bg-cover border-round"
      ></div>
      <div class="col-12 mt-5">
        <div
          class="grid grid-nogutter px-2 flex-column md:flex-row"
          :style="{ columnGap: '2rem', rowGap: '2rem' }"
        >
          <div
            v-for="(item, i) in content"
            :key="i"
            class="col flex flex-column justify-content-center text-center align-items-center border-1 surface-border py-5 px-4 border-round"
          >
            <i class="pi pi-fw text-2xl text-primary" :class="item.icon"></i>
            <span class="text-900 font-bold mt-4 mb-1">{{ item.title }}</span>
            <span class="text-500">{{ item.info }}</span>
          </div>
        </div>
      </div>

      <div class="col-12 mt-5">
        <p class="text-900 font-bold">Send Us Email</p>
        <div
          class="grid flex-column md:flex-row formgrid grid-nogutter mt-6"
          :style="{ rowGap: '2rem', columnGap: '2rem' }"
        >
          <div class="field col">
            <label for="name" class="block text-primary font-bold"> Name </label>
            <IconField iconPosition="left" class="w-full" :style="{ height: '3.5rem' }">
              <InputIcon class="pi pi-user" :style="{ left: '1.5rem' }" />
              <InputText
                id="name"
                type="text"
                v-model="name"
                placeholder="Name"
                class="w-full px-7 text-900 font-semibold"
                :style="{ height: '3.5rem' }"
              />
            </IconField>
          </div>

          <div class="field col">
            <label for="email" class="block text-primary font-bold">
              Email Address
            </label>
            <IconField iconPosition="left" :style="{ height: '3.5rem' }">
              <InputIcon class="pi pi-envelope" :style="{ left: '1.5rem' }" />
              <InputText
                type="text"
                v-model="email"
                placeholder="Email"
                class="w-full px-7 text-900 font-semibold"
                :style="{ height: '3.5rem' }"
              />
            </IconField>
          </div>

          <div class="field col-12 flex flex-column">
            <label for="message" class="block text-primary font-bold"> Message </label>
            <Textarea
              id="message"
              :rows="5"
              :cols="30"
              v-model="message"
              class="text-900 font-semibold"
            />
            <Button class="ml-auto mt-3 border-round" label="Send Message"></Button>
          </div>
        </div>
      </div>
    </div>

    <div class="card" v-if="false">
      <h5>AccordionPanel</h5>
      <Accordion :activeIndex="0">
        <AccordionTab header="Header I">
          <p class="line-height-3 m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
            eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
            in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </AccordionTab>
        <AccordionTab header="Header II">
          <p class="line-height-3 m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
            doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
            veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim
            ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
            consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            Consectetur, adipisci velit, sed quia non numquam eius modi.
          </p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p class="line-height-3 m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
            praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
            excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui
            officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
            quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum
            soluta nobis est eligendi optio cumque nihil impedit quo minus.
          </p>
        </AccordionTab>
      </Accordion>
    </div>

    <div class="card" v-if="false">
      <h5>Panel</h5>
      <Panel header="Header" :toggleable="true">
        <p class="line-height-3 m-0">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Panel>
    </div>

    <div class="card" v-if="false">
      <div class="field col-12 md:col-4">
        <FloatLabel>
          <Calendar inputId="calendar" v-model="value5"></Calendar>
          <label for="calendar">Calendar</label>
        </FloatLabel>
      </div>
    </div>

    <div class="card" v-if="false">
      <div class="field col-12 md:col-4">
        <FloatLabel>
          <Dropdown
            id="dropdown"
            :options="cities"
            v-model="value10"
            optionLabel="name"
          ></Dropdown>
          <label for="dropdown">Dropdown</label>
        </FloatLabel>
      </div>
    </div>
  </AppLayout>
</template>

<style scope>
.p-slider .p-slider-handle::before {
  content: attr(data-value);
  color: #000000;
  font-size: 12px;
  font-weight: bold;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none; /* Prevent blocking interaction */
  background-color: #ffffff;
  border-radius: 50%;
  box-shadow: 0px 0.5px 0px 0px rgba(0, 0, 0, 0.08), 0px 1px 1px 0px rgba(0, 0, 0, 0.14);
}

.p-sidebar-content {
  padding: 0.8rem;
}

.p-slider .p-slider-handle:hover::before {
  transform: scale(2); /* Adjust the scale as needed */
  transition: transform 0.2s ease; /* Smooth scaling effect */
  background-color: green;
  color: #ffffff;
}

.bg-gold {
  background-color: gold;
}
</style>
