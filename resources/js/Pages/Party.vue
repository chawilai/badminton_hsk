<script setup>
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import AppLayout from "@/layout/AppLayout.vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import Game from "@/Pages/Game2.vue";
import { Link, Head, usePage, router } from "@inertiajs/vue3";
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useConfirm } from "primevue/useconfirm";
// import Crud from "@/Pages/Prime/Crud.vue";

// import { Realtime } from 'ably';

import crown from "@/../assets/images/crown.png";

const toast = useToast();
const confirmPopup = useConfirm();

const page = usePage();

const props = ref(page.props);

const data = reactive({
  game_type: "quadruple",
  status: "setting",
  initial_shuttlecock_game: 0,
});

const party = ref("");
const selectedParty = ref({});
const games = ref([]);
const isSidebar = ref(true);
const visibleTop = ref(false);

const game_data = reactive({
  game_id: "",
  party_member_id: "",
  ready_players: [],
});

party.value = page.props.party;
games.value = page.props.games;

data.party_id = party.value.id;
game_data.party_id = party.value.id;

// console.log(games.value)

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

const updateDisplayName = (partyMemberId, newName, currentName) => {
  const trimmedNewName = (newName || "").trim();
  const trimmedCurrentName = (currentName || "").trim();

  if (trimmedNewName === trimmedCurrentName) return;

  router.post(
    `/party-members/${partyMemberId}/update-name`,
    { display_name: newName.trim() },
    {
      preserveScroll: true,
      headers: {
        Accept: "application/json",
      },
      onSuccess: (response) => {
        toast.add({
          severity: "success",
          summary: "Name Updated",
          detail: "ตั้งค่าชื่อเรียกใน Party เรียบร้อยแล้ว.",
          life: 3000,
        });

        party.value = response.props.party;
      },
      onError: (error) => {
        toast.add({
          severity: "error",
          summary: "Update Failed",
          detail: "ตั้งค่าชื่อเรียกไม่สำเร็จ โปรดลองอีกครั้ง.",
          life: 3000,
        });
      },
    }
  );
};

const setOriginalDisplayName = (member) => {
  if (!member.original_display_name) {
    member.original_display_name = member.display_name; // Store the original display name
  }
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
        party.value = res.props.party;
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
  selectedParty.value = party.value.filter((party) => party.id == partyId)[0];
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

const reloadPage = () => {
    router.get(`/party/${party.value.id}`, {}, { preserveScroll: true })
}

const partyReload = (payload) => {
  console.log("Game Created");
  console.log(payload);

  router.post(
    `/fetch-party-data`,
    {party_id: party.value.id},
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
    <!-- Party Header -->
    <div class="tw-mb-4">
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
        <div>
          <h1 class="tw-text-xl tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">
            {{ party.court?.name || 'Party' }} <span class="tw-text-base tw-font-normal tw-text-gray-400">#{{ party.id }}</span>
          </h1>
          <p class="tw-text-sm tw-text-gray-500 dark:tw-text-gray-400 tw-m-0 tw-mt-0.5">
            {{ party.play_date }} · {{ party.start_time?.substring(0,5) }} - {{ party.end_time?.substring(0,5) }} · {{ party.members?.length || 0 }}/{{ party.max_players }} players
          </p>
        </div>
        <div class="tw-flex tw-items-center tw-gap-2">
          <button @click="reloadPage()" class="tw-w-9 tw-h-9 tw-flex tw-items-center tw-justify-center tw-rounded-lg tw-border tw-border-gray-200 dark:tw-border-court-800 tw-bg-white dark:tw-bg-court-900 tw-text-gray-500 hover:tw-bg-gray-50 dark:hover:tw-bg-court-800 tw-transition-colors tw-cursor-pointer">
            <i class="pi pi-refresh tw-text-sm"></i>
          </button>
          <button @click="visibleTop = true" class="tw-h-9 tw-px-4 tw-flex tw-items-center tw-gap-2 tw-rounded-lg tw-bg-court-600 hover:tw-bg-court-700 tw-text-white tw-text-sm tw-font-medium tw-border-0 tw-cursor-pointer tw-transition-colors active:tw-scale-[0.98]">
            <i class="pi pi-plus tw-text-xs"></i>
            <span class="tw-hidden sm:tw-inline">New Game</span>
            <span class="sm:tw-hidden">New</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Game creation sidebar (kept PrimeVue) -->
    <Sidebar v-model:visible="visibleTop" position="top" style="height: auto; padding: 0px; margin: 0px">
      <template #header>
        <div class="flex align-items-center gap-2">
          <Avatar :image="$page.props.auth.user.avatar" shape="circle" />
          <span class="font-bold">Game Making</span>
        </div>
      </template>
      <ScrollPanel style="width: 100%; height: 85vh">
        <Game :data="$page.props" @gameCreated="partyReload" />
      </ScrollPanel>
    </Sidebar>
    <!-- <div class="p-6 text-gray-900">You're logged in!</div> -->
    <ConfirmPopup></ConfirmPopup>
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
    <!-- Score Entry Dialog -->
    <Dialog
      v-model:visible="visible"
      :style="{ width: '95vw', maxWidth: '28rem', padding: '0px' }"
      :position="position"
      :modal="true"
      :draggable="false"
      :showHeader="false"
      class="score-dialog"
    >
      <!-- Custom header -->
      <div class="tw-flex tw-items-center tw-justify-between tw-px-4 tw-pt-4 tw-pb-2">
        <div class="tw-flex tw-items-center tw-gap-2">
          <div class="tw-w-8 tw-h-8 tw-bg-court-100 tw-rounded-lg tw-flex tw-items-center tw-justify-center">
            <span class="tw-text-base">🏸</span>
          </div>
          <h2 class="tw-text-base tw-font-bold tw-text-gray-900 tw-m-0">บันทึกผลการแข่งขัน</h2>
        </div>
        <button @click="visible = false; setScoreGame = {}" class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-gray-100 hover:tw-bg-gray-200 tw-border-0 tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-transition-colors">
          <i class="pi pi-times tw-text-gray-500 tw-text-sm"></i>
        </button>
      </div>

      <!-- Sets -->
      <div class="tw-px-4 tw-pb-2">
        <div v-for="(set, index) in sets" :key="index" class="tw-mb-4">
          <!-- Set badge -->
          <div class="tw-flex tw-items-center tw-justify-center tw-mb-3">
            <span class="tw-px-3 tw-py-1 tw-bg-court-100 tw-text-court-700 tw-text-xs tw-font-bold tw-rounded-full tw-uppercase tw-tracking-wider">
              Set {{ index + 1 }}
            </span>
          </div>

          <!-- Two teams side by side -->
          <div class="tw-grid tw-grid-cols-2 tw-gap-2">
            <!-- Team 1 -->
            <div class="tw-rounded-xl tw-p-3 tw-text-center tw-relative tw-transition-colors"
              :class="showCrown(index, 'team1') ? 'tw-bg-amber-50 tw-border tw-border-amber-200' : 'tw-bg-gray-50 tw-border tw-border-gray-200'">
              <img v-show="showCrown(index, 'team1')" :src="crown" class="tw-w-8 tw-h-8 tw-absolute tw--top-3 tw--left-1 tw--rotate-[25deg]" alt="" />
              <p class="tw-text-[10px] tw-text-gray-400 tw-font-bold tw-uppercase tw-tracking-wider tw-m-0 tw-mb-2">Team 1</p>
              <div class="tw-flex tw-justify-center tw-gap-1 tw-mb-3">
                <div v-for="player in setScoreGame.game_players?.filter(p => p.team === 'team1')" :key="player.user.id" class="tw-text-center">
                  <UserAvatar :src="player.user.avatar" :name="player.display_name || player.user.name" size="lg" rounded="xl" class="tw-border-2 tw-border-white" />
                  <p class="tw-text-[9px] tw-text-gray-500 tw-m-0 tw-mt-0.5 tw-truncate tw-max-w-[3rem]">{{ player.display_name }}</p>
                </div>
              </div>
              <!-- Score display -->
              <div class="tw-text-3xl tw-font-black tw-m-0 tw-mb-2" :class="showCrown(index, 'team1') ? 'tw-text-amber-600' : 'tw-text-gray-700'">{{ set.team1_score }}</div>
              <!-- Score controls -->
              <div class="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-mb-2">
                <button type="button" @click="set.team1_score > 0 ? set.team1_score-- : null"
                  class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-red-100 tw-text-red-600 tw-border-0 tw-cursor-pointer tw-font-bold tw-text-base hover:tw-bg-red-200 tw-transition-colors">-</button>
                <button type="button" @click="set.team1_score < 30 ? set.team1_score++ : null"
                  class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-court-100 tw-text-court-700 tw-border-0 tw-cursor-pointer tw-font-bold tw-text-base hover:tw-bg-court-200 tw-transition-colors">+</button>
              </div>
              <!-- Quick buttons -->
              <div class="tw-flex tw-justify-center tw-gap-1">
                <button type="button" @click="set.team1_score = 0"
                  class="tw-px-2 tw-py-0.5 tw-rounded-md tw-text-[10px] tw-font-semibold tw-bg-gray-200 tw-text-gray-600 tw-border-0 tw-cursor-pointer hover:tw-bg-gray-300 tw-transition-colors">0</button>
                <button type="button" @click="set.team1_score = 21"
                  class="tw-px-2 tw-py-0.5 tw-rounded-md tw-text-[10px] tw-font-semibold tw-bg-court-500 tw-text-white tw-border-0 tw-cursor-pointer hover:tw-bg-court-600 tw-transition-colors">21</button>
              </div>
              <!-- Slider -->
              <div class="tw-mt-2 tw-px-1">
                <Slider :min="0" :max="30" v-model="set.team1_score" class="w-full" :data-set="'team1-set-' + index" />
              </div>
            </div>

            <!-- Team 2 -->
            <div class="tw-rounded-xl tw-p-3 tw-text-center tw-relative tw-transition-colors"
              :class="showCrown(index, 'team2') ? 'tw-bg-amber-50 tw-border tw-border-amber-200' : 'tw-bg-gray-50 tw-border tw-border-gray-200'">
              <img v-show="showCrown(index, 'team2')" :src="crown" class="tw-w-8 tw-h-8 tw-absolute tw--top-3 tw--right-1 tw-rotate-[25deg]" alt="" />
              <p class="tw-text-[10px] tw-text-gray-400 tw-font-bold tw-uppercase tw-tracking-wider tw-m-0 tw-mb-2">Team 2</p>
              <div class="tw-flex tw-justify-center tw-gap-1 tw-mb-3">
                <div v-for="player in setScoreGame.game_players?.filter(p => p.team === 'team2')" :key="player.user.id" class="tw-text-center">
                  <UserAvatar :src="player.user.avatar" :name="player.display_name || player.user.name" size="lg" rounded="xl" class="tw-border-2 tw-border-white" />
                  <p class="tw-text-[9px] tw-text-gray-500 tw-m-0 tw-mt-0.5 tw-truncate tw-max-w-[3rem]">{{ player.display_name }}</p>
                </div>
              </div>
              <div class="tw-text-3xl tw-font-black tw-m-0 tw-mb-2" :class="showCrown(index, 'team2') ? 'tw-text-amber-600' : 'tw-text-gray-700'">{{ set.team2_score }}</div>
              <div class="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-mb-2">
                <button type="button" @click="set.team2_score > 0 ? set.team2_score-- : null"
                  class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-red-100 tw-text-red-600 tw-border-0 tw-cursor-pointer tw-font-bold tw-text-base hover:tw-bg-red-200 tw-transition-colors">-</button>
                <button type="button" @click="set.team2_score < 30 ? set.team2_score++ : null"
                  class="tw-w-8 tw-h-8 tw-rounded-lg tw-bg-court-100 tw-text-court-700 tw-border-0 tw-cursor-pointer tw-font-bold tw-text-base hover:tw-bg-court-200 tw-transition-colors">+</button>
              </div>
              <div class="tw-flex tw-justify-center tw-gap-1">
                <button type="button" @click="set.team2_score = 0"
                  class="tw-px-2 tw-py-0.5 tw-rounded-md tw-text-[10px] tw-font-semibold tw-bg-gray-200 tw-text-gray-600 tw-border-0 tw-cursor-pointer hover:tw-bg-gray-300 tw-transition-colors">0</button>
                <button type="button" @click="set.team2_score = 21"
                  class="tw-px-2 tw-py-0.5 tw-rounded-md tw-text-[10px] tw-font-semibold tw-bg-court-500 tw-text-white tw-border-0 tw-cursor-pointer hover:tw-bg-court-600 tw-transition-colors">21</button>
              </div>
              <div class="tw-mt-2 tw-px-1">
                <Slider :min="0" :max="30" v-model="set.team2_score" class="w-full" :data-set="'team2-set-' + index" />
              </div>
            </div>
          </div>

          <!-- Divider between sets -->
          <div v-if="index < sets.length - 1" class="tw-flex tw-items-center tw-gap-3 tw-my-3">
            <div class="tw-flex-1 tw-h-px tw-bg-gray-200"></div>
            <div class="tw-flex-1 tw-h-px tw-bg-gray-200"></div>
          </div>
        </div>
      </div>

      <!-- Add/Remove Set -->
      <div class="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-px-4 tw-pb-3">
        <button type="button" @click="addNewSet"
          class="tw-h-8 tw-px-4 tw-rounded-lg tw-text-xs tw-font-semibold tw-bg-court-50 tw-text-court-700 tw-border tw-border-court-200 tw-cursor-pointer hover:tw-bg-court-100 tw-transition-colors">
          <i class="pi pi-plus tw-mr-1 tw-text-[10px]"></i> เพิ่ม Set {{ sets.length + 1 }}
        </button>
        <button v-show="sets.length > 1" type="button" @click="removeNewSet"
          class="tw-h-8 tw-px-4 tw-rounded-lg tw-text-xs tw-font-semibold tw-bg-red-50 tw-text-red-600 tw-border tw-border-red-200 tw-cursor-pointer hover:tw-bg-red-100 tw-transition-colors">
          <i class="pi pi-minus tw-mr-1 tw-text-[10px]"></i> ลบ Set
        </button>
      </div>

      <!-- Footer buttons -->
      <div class="tw-flex tw-gap-2 tw-px-4 tw-pb-4">
        <button type="button" @click="visible = false; setScoreGame = {}"
          class="tw-flex-1 tw-h-10 tw-rounded-xl tw-text-sm tw-font-medium tw-bg-gray-100 tw-text-gray-700 tw-border-0 tw-cursor-pointer hover:tw-bg-gray-200 tw-transition-colors">
          Cancel
        </button>
        <button type="button" @click="enterScore(setScoreGame.id)"
          class="tw-flex-1 tw-h-10 tw-rounded-xl tw-text-sm tw-font-semibold tw-bg-court-600 tw-text-white tw-border-0 tw-cursor-pointer hover:tw-bg-court-700 tw-transition-colors active:tw-scale-[0.98]">
          <i class="pi pi-check tw-mr-1 tw-text-xs"></i> Save
        </button>
      </div>
    </Dialog>
    <!-- Games List -->
    <div class="tw-mb-4">
      <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
        <h2 class="tw-text-lg tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">Games <span class="tw-text-sm tw-font-normal tw-text-gray-400">({{ games.length }})</span></h2>
      </div>

      <div v-if="games.length === 0" class="tw-text-center tw-py-8 tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800">
        <span class="tw-text-2xl">🏸</span>
        <p class="tw-text-sm tw-text-gray-500 tw-mt-2 tw-m-0">No games yet. Create a new game!</p>
      </div>

      <div class="tw-space-y-2">
        <div
          v-for="(game, game_index) in games"
          :key="game.id"
          class="badminton-card tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-overflow-hidden"
          :class="isPlayerInGame(game) ? 'tw-border-court-300 dark:tw-border-court-700' : 'tw-border-gray-200 dark:tw-border-court-800'"
        >
          <div class="tw-p-3">
            <!-- Row 1: Game number + Status + Shuttlecock -->
            <div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
              <div class="tw-flex tw-items-center tw-gap-2">
                <span class="tw-text-sm tw-font-bold tw-text-gray-400 dark:tw-text-gray-500">#{{ games.length - game_index }}</span>
                <span v-html="gameStatus(game.status)"></span>
              </div>
              <div class="tw-flex tw-items-center tw-gap-1.5">
                <button @click="returnShuttlecock(game.id)" class="tw-w-6 tw-h-6 tw-rounded-md tw-bg-red-50 dark:tw-bg-red-900/20 tw-text-red-500 tw-border-0 tw-cursor-pointer tw-text-xs tw-font-bold hover:tw-bg-red-100">-</button>
                <span class="tw-text-sm tw-font-medium tw-text-gray-600 dark:tw-text-gray-400" title="Shuttlecocks">🏸 {{ shuttlecocksTotal(game) }}</span>
                <button @click="addShuttlecock(game.id)" class="tw-w-6 tw-h-6 tw-rounded-md tw-bg-court-50 dark:tw-bg-court-900 tw-text-court-600 tw-border-0 tw-cursor-pointer tw-text-xs tw-font-bold hover:tw-bg-court-100">+</button>
              </div>
            </div>

            <!-- Row 2: Players -->
            <div class="tw-flex tw-items-center tw-gap-2 tw-mb-3">
              <div class="tw-flex tw-items-center tw-gap-1 tw-flex-wrap tw-flex-1">
                <UserAvatar
                  v-for="player in game.game_players"
                  :key="player.id"
                  :src="player.user.avatar"
                  :name="player.display_name || player.user.name"
                  size="lg"
                  rounded="xl"
                  class="tw-border-2 tw-border-white dark:tw-border-court-800"
                />
                <button
                  v-if="!isGameIsFull(game)"
                  @click="autoAddPlayers(game.id)"
                  class="tw-w-10 tw-h-10 tw-rounded-xl tw-border-2 tw-border-dashed tw-border-gray-300 dark:tw-border-court-700 tw-bg-transparent tw-text-gray-400 tw-cursor-pointer hover:tw-border-court-400 hover:tw-text-court-500 tw-transition-colors tw-text-lg"
                >+</button>
              </div>
            </div>

            <!-- Row 3: Actions + Score -->
            <div class="tw-flex tw-items-center tw-justify-between tw-pt-2 tw-border-t tw-border-gray-100 dark:tw-border-court-800">
              <div class="tw-flex tw-items-center tw-gap-1.5 tw-flex-wrap">
                <button v-show="game.status === 'setting'" @click="listGame(game.id, $event)" class="tw-h-7 tw-px-3 tw-rounded-md tw-text-xs tw-font-semibold tw-border-0 tw-cursor-pointer tw-bg-purple-100 dark:tw-bg-purple-900/30 tw-text-purple-700 dark:tw-text-purple-300 hover:tw-bg-purple-200 tw-transition-colors">List</button>
                <button v-show="game.status === 'listing'" @click="startGame(game.id)" class="tw-h-7 tw-px-3 tw-rounded-md tw-text-xs tw-font-semibold tw-border-0 tw-cursor-pointer tw-bg-court-100 dark:tw-bg-court-900 tw-text-court-700 dark:tw-text-court-300 hover:tw-bg-court-200 tw-transition-colors">Start</button>
                <button v-show="['setting', 'listing'].includes(game.status)" @click="deleteGame(game.id)" class="tw-h-7 tw-px-3 tw-rounded-md tw-text-xs tw-font-semibold tw-border-0 tw-cursor-pointer tw-bg-red-50 dark:tw-bg-red-900/20 tw-text-red-600 dark:tw-text-red-400 hover:tw-bg-red-100 tw-transition-colors">Delete</button>
                <button v-show="game.status === 'playing'" @click="finishGame(game.id)" class="tw-h-7 tw-px-3 tw-rounded-md tw-text-xs tw-font-semibold tw-border-0 tw-cursor-pointer tw-bg-blue-100 dark:tw-bg-blue-900/30 tw-text-blue-700 dark:tw-text-blue-300 hover:tw-bg-blue-200 tw-transition-colors">Finish</button>
                <span v-show="game.status === 'finished'" class="tw-text-xs tw-text-gray-500">{{ playTime(game.game_start_date, game.game_end_date) }}</span>
              </div>

              <!-- Score -->
              <div class="tw-flex tw-items-center tw-gap-2">
                <div v-if="game.status === 'finished'" class="tw-flex tw-items-center tw-gap-2">
                  <div class="tw-text-right">
                    <div v-if="game.game_sets && game.game_sets[0] && game.game_sets[0].winning_team" class="tw-text-[10px] tw-text-gray-400 tw-font-semibold">{{ game.game_sets.length }} set</div>
                    <div v-for="game_set in game.game_sets" :key="game_set.id" class="tw-text-xs tw-font-medium" :class="game_set.winning_team ? 'tw-text-gray-700 dark:tw-text-gray-300' : 'tw-text-gray-400'">
                      {{ game_set.winning_team ? `${game_set.team1_score} : ${game_set.team2_score}` : 'รอลงผล' }}
                    </div>
                  </div>
                  <Button v-if="isPlayerInGame(game)" @click="openPosition('top', game)" label="ลงผล" severity="success" class="tw-text-xs" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Members Section -->
    <div class="tw-bg-white dark:tw-bg-court-900/80 tw-rounded-xl tw-border tw-border-gray-200 dark:tw-border-court-800 tw-overflow-hidden tw-mb-4">
      <div class="tw-px-4 tw-py-3 tw-border-b tw-border-gray-100 dark:tw-border-court-800">
        <h2 class="tw-text-base tw-font-bold tw-text-gray-900 dark:tw-text-gray-100 tw-m-0">Players <span class="tw-text-sm tw-font-normal tw-text-gray-400">({{ party.members?.length || 0 }})</span></h2>
      </div>
      <div class="tw-divide-y tw-divide-gray-50 dark:tw-divide-court-800">
        <div
          v-for="(member, index) in party.members"
          :key="member.id"
          class="tw-flex tw-items-center tw-gap-3 tw-px-4 tw-py-2.5"
        >
          <span class="tw-text-xs tw-font-bold tw-text-gray-400 tw-w-5 tw-text-center tw-shrink-0">{{ index + 1 }}</span>
          <UserAvatar :src="member.user?.avatar" :name="member.display_name || member.user?.name" size="md" rounded="xl" class="tw-shrink-0" />
          <div class="tw-flex tw-items-center tw-gap-2 tw-flex-1 tw-min-w-0">
            <input
              type="text"
              v-model="member.display_name"
              class="tw-px-2 tw-py-1 tw-rounded-lg tw-border tw-border-gray-200 dark:tw-border-court-700 tw-bg-gray-50 dark:tw-bg-court-900 tw-text-sm tw-text-gray-900 dark:tw-text-gray-100 tw-w-24 sm:tw-w-32 focus:tw-border-court-500 focus:tw-ring-1 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all"
              placeholder="Display name"
              @blur="updateDisplayName(member.id, member.display_name, member.original_display_name)"
              @focus="setOriginalDisplayName(member)"
            />
            <span class="tw-text-xs tw-text-gray-400 tw-truncate tw-hidden sm:tw-inline">({{ member.user?.name }})</span>
          </div>
          <span class="tw-text-[10px] tw-px-1.5 tw-py-0.5 tw-rounded tw-font-medium tw-shrink-0"
            :class="member.role === 'Host' ? 'tw-bg-shuttle/20 tw-text-amber-700 dark:tw-text-amber-300' : 'tw-bg-gray-100 dark:tw-bg-court-800 tw-text-gray-500 dark:tw-text-gray-400'"
          >{{ member.role || 'Member' }}</span>
        </div>
      </div>
    </div>

    <!-- Legacy TabView kept for hidden panels -->
    <div class="card" style="display:none">
      <TabView>
        <TabPanel header="รายการผู้เล่น"></TabPanel>
        <TabPanel header="Reviews" v-if="false">
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
        <TabPanel header="Shipping and Returns" v-if="false">
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
