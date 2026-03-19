import { ref, computed, onMounted, onUnmounted, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrRenderComponent, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage } from "@inertiajs/vue3";
import { s as shuttlecockIcon } from "./shuttlecock-DGGeeBau.js";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
import "./useToast-DyaFeJ92.js";
const _sfc_main = {
  __name: "TabGame",
  __ssrInlineRender: true,
  props: {
    games: { type: Array, required: true },
    party: { type: Object, required: true },
    readyPlayers: { type: Array, default: () => [] }
  },
  emits: [
    "listGame",
    "startGame",
    "finishGame",
    "deleteGame",
    "autoAddPlayers",
    "addShuttlecock",
    "returnShuttlecock",
    "openScore"
  ],
  setup(__props, { emit: __emit }) {
    var _a;
    const page = usePage();
    const { t } = useLocale();
    const courtDialogVisible = ref(false);
    ref(null);
    const courtDialogNumber = ref("");
    ref(null);
    ref(true);
    const canEditCourt = (game) => !(game.status === "finished" && game.court_number);
    const activePlayingCourts = computed(
      () => props.games.filter((g) => g.status === "playing" && g.court_number).map((g) => g.court_number)
    );
    ref(null);
    const usedCourtNumbers = computed(() => {
      var _a2;
      const nums = /* @__PURE__ */ new Set();
      (((_a2 = props.party) == null ? void 0 : _a2.court_bookings) || []).forEach((b) => {
        if (b.court_field_number) nums.add(b.court_field_number);
      });
      props.games.forEach((g) => {
        if (g.court_number) nums.add(g.court_number);
      });
      return [...nums].sort((a, b) => a - b);
    });
    const activeFilter = ref("all");
    const statusOrder = { playing: 0, setting: 1, listing: 2, finished: 3 };
    const props = __props;
    const isTeam1 = (team) => team === "team1" || team === 1;
    const isTeam2 = (team) => team === "team2" || team === 2;
    const isUnassigned = (team) => !team || team === 0 || team === "0";
    const statusStyles = {
      setting: "bg-warning text-warning-content",
      listing: "bg-orange-500 text-white",
      playing: "bg-success text-success-content",
      finished: "bg-info text-info-content"
    };
    const gameStatusLabel = (status) => t(`game.status.${status}`) || status;
    const gameStatusClass = (status) => statusStyles[status] || "";
    const shuttlecocksTotal = (game) => {
      return game.shuttlecocks.reduce((total, sc) => total + sc.quantity, 0);
    };
    const isHost = ((_a = props.party) == null ? void 0 : _a.creator_id) === page.props.auth.user.id;
    const isPlayerInGame = (game) => {
      if (isHost) return true;
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
          return null;
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
      const diffInSeconds = Math.floor((end - start) / 1e3);
      const hours = Math.floor(diffInSeconds / 3600);
      const minutes = Math.floor(diffInSeconds % 3600 / 60);
      const seconds = diffInSeconds % 60;
      let result = "";
      if (hours > 0) result += `${hours} ชม. `;
      if (minutes > 0) result += `${minutes} น. `;
      result += `${seconds} วิ`;
      return result.trim();
    };
    const hasScore = (game) => {
      var _a2, _b;
      return game.status === "finished" && ((_b = (_a2 = game.game_sets) == null ? void 0 : _a2[0]) == null ? void 0 : _b.winning_team);
    };
    const noScore = (game) => {
      var _a2, _b;
      return game.status === "finished" && !((_b = (_a2 = game.game_sets) == null ? void 0 : _a2[0]) == null ? void 0 : _b.winning_team);
    };
    const gameWinner = (game) => {
      var _a2;
      if (!hasScore(game) || !((_a2 = game.game_sets) == null ? void 0 : _a2.length)) return null;
      let t1 = 0, t2 = 0;
      game.game_sets.forEach((s) => {
        if (s.winning_team === "team1") t1++;
        else if (s.winning_team === "team2") t2++;
      });
      if (t1 > t2) return "team1";
      if (t2 > t1) return "team2";
      return null;
    };
    const now = ref(Date.now());
    let elapsedTimer = null;
    onMounted(() => {
      elapsedTimer = setInterval(() => {
        now.value = Date.now();
      }, 1e3);
    });
    onUnmounted(() => {
      if (elapsedTimer) clearInterval(elapsedTimer);
    });
    const elapsedTime = (startDate) => {
      if (!startDate) return "0 น. 0 วิ";
      const seconds = Math.floor((now.value - new Date(startDate).getTime()) / 1e3);
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m} น. ${s} วิ`;
    };
    const sortedGames = computed(() => {
      return [...props.games].sort((a, b) => {
        var _a2, _b, _c, _d;
        const orderA = statusOrder[a.status] ?? 9;
        const orderB = statusOrder[b.status] ?? 9;
        if (orderA !== orderB) return orderA - orderB;
        if (a.status === "finished") {
          const aScored = ((_b = (_a2 = a.game_sets) == null ? void 0 : _a2[0]) == null ? void 0 : _b.winning_team) ? 1 : 0;
          const bScored = ((_d = (_c = b.game_sets) == null ? void 0 : _c[0]) == null ? void 0 : _d.winning_team) ? 1 : 0;
          if (aScored !== bScored) return aScored - bScored;
        }
        return b.id - a.id;
      });
    });
    const filteredGames = computed(() => {
      if (activeFilter.value === "all") return sortedGames.value;
      if (activeFilter.value === "no_score") return sortedGames.value.filter((g) => noScore(g));
      if (activeFilter.value === "finished") return sortedGames.value.filter((g) => hasScore(g));
      return sortedGames.value.filter((g) => g.status === activeFilter.value);
    });
    const statusCounts = computed(() => {
      const counts = { playing: 0, setting: 0, listing: 0, finished: 0, no_score: 0 };
      props.games.forEach((g) => {
        if (g.status === "finished") {
          if (hasScore(g)) counts.finished++;
          counts.no_score += noScore(g) ? 1 : 0;
        } else if (counts[g.status] !== void 0) {
          counts[g.status]++;
        }
      });
      return counts;
    });
    const filters = computed(() => [
      { key: "all", label: t("filter.all"), idle: "bg-base-200 text-base-content/70", active: "bg-base-content text-base-100" },
      { key: "playing", label: t("filter.playing"), idle: "bg-success/15 text-success", active: "bg-success text-success-content" },
      { key: "listing", label: t("filter.listing"), idle: "bg-orange-100 text-orange-600", active: "bg-orange-500 text-white" },
      { key: "no_score", label: t("filter.noScore"), idle: "bg-warning/15 text-warning", active: "bg-warning text-warning-content" },
      { key: "finished", label: t("filter.finished"), idle: "bg-info/15 text-info", active: "bg-info text-info-content" }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mb-4" }, _attrs))}><div class="flex items-center justify-between mb-3"><h2 class="text-lg font-bold text-base-content m-0">${ssrInterpolate(unref(t)("game.title"))} <span class="text-sm font-normal text-base-content/50">(${ssrInterpolate(__props.games.length)})</span></h2></div><div class="flex flex-wrap gap-1.5 mb-3"><!--[-->`);
      ssrRenderList(filters.value, (f) => {
        _push(`<button class="${ssrRenderClass([activeFilter.value === f.key ? f.active : f.idle, "px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all duration-200 flex items-center gap-1"])}">${ssrInterpolate(f.label)} <span class="text-[10px] font-bold opacity-80">${ssrInterpolate(f.key === "all" ? __props.games.length : statusCounts.value[f.key])}</span></button>`);
      });
      _push(`<!--]--></div>`);
      if (__props.games.length === 0) {
        _push(`<div class="text-center py-10 bg-base-100 rounded-2xl border border-base-300"><span class="text-4xl">🏸</span><p class="text-sm text-base-content/50 mt-3 m-0">${ssrInterpolate(unref(t)("game.noGames"))}</p></div>`);
      } else if (filteredGames.value.length === 0) {
        _push(`<div class="text-center py-8 bg-base-100 rounded-2xl border border-base-300"><p class="text-sm text-base-content/50 m-0">${ssrInterpolate(unref(t)("game.noGamesInStatus"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-3"><!--[-->`);
      ssrRenderList(filteredGames.value, (game) => {
        var _a2, _b, _c, _d, _e, _f;
        _push(`<div class="${ssrRenderClass([{
          "shadow-sm": isPlayerInGame(game),
          "border-warning/40": game.status === "setting",
          "border-orange-300": game.status === "listing",
          "border-success/40": game.status === "playing",
          "border-info/40": hasScore(game),
          "border-warning/40": noScore(game) || game.status === "setting",
          "border-orange-300": game.status === "listing",
          "border-success/40": game.status === "playing",
          "bg-warning/8": game.status === "setting",
          "bg-[#FFF3E0]": game.status === "listing",
          "bg-success/8": game.status === "playing",
          "bg-info/5": hasScore(game),
          "bg-warning/5": noScore(game)
        }, "badminton-card rounded-2xl border overflow-hidden transition-all"])}"><div class="${ssrRenderClass([{
          "bg-warning": game.status === "setting" || noScore(game),
          "bg-orange-500": game.status === "listing",
          "bg-success": game.status === "playing",
          "bg-info": hasScore(game)
        }, "h-1"])}"></div><div class="px-3 py-2.5"><div class="flex items-center justify-between mb-2"><div class="flex items-center gap-1.5"><span class="text-sm font-bold text-base-content">#${ssrInterpolate(__props.games.length - __props.games.indexOf(game))}</span><span class="${ssrRenderClass([gameStatusClass(game.status), "px-1.5 py-0.5 rounded text-[10px] font-semibold"])}">${ssrInterpolate(gameStatusLabel(game.status))}</span>`);
        if (noScore(game)) {
          _push(`<span class="px-1.5 py-0.5 bg-error/15 text-error text-[10px] font-semibold rounded">${ssrInterpolate(unref(t)("filter.noScore"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-center gap-1.5"><div class="flex items-center gap-0.5 bg-base-200 rounded-lg px-1.5 py-0.5"><button class="w-4 h-4 rounded flex items-center justify-center bg-error/10 text-error border-0 cursor-pointer text-[9px] font-bold hover:bg-error/20 transition-colors">−</button><span class="text-[10px] font-semibold text-base-content/70 px-0.5"><img${ssrRenderAttr("src", unref(shuttlecockIcon))} alt="" class="w-3 h-3 inline dark:invert-0" style="${ssrRenderStyle({ "filter": "brightness(0) saturate(100%) invert(40%)" })}"> ${ssrInterpolate(shuttlecocksTotal(game))}</span><button class="w-4 h-4 rounded flex items-center justify-center bg-primary/10 text-primary border-0 cursor-pointer text-[9px] font-bold hover:bg-primary/20 transition-colors">+</button></div></div></div><div class="flex items-center mb-2"><div class="${ssrRenderClass([gameWinner(game) === "team1" ? "bg-warning/20 rounded-lg border border-warning/40" : "", "flex-1 flex items-center justify-center gap-1.5 py-1 min-w-0 relative"])}">`);
        if (gameWinner(game) === "team1") {
          _push(`<span class="absolute -top-4 -left-2 text-2xl -rotate-[25deg]">👑</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList((_a2 = game.game_players) == null ? void 0 : _a2.filter((p) => isTeam1(p.team)), (player) => {
          var _a3, _b2, _c2;
          _push(`<div class="flex flex-col items-center gap-0.5 shrink-0">`);
          _push(ssrRenderComponent(_sfc_main$1, {
            src: (_a3 = player.user) == null ? void 0 : _a3.avatar,
            name: player.display_name || ((_b2 = player.user) == null ? void 0 : _b2.name),
            size: "md",
            rounded: "full",
            class: "border-2 border-base-100"
          }, null, _parent));
          _push(`<span class="text-[8px] text-base-content/50 max-w-[3rem] truncate text-center leading-none">${ssrInterpolate((player.display_name || ((_c2 = player.user) == null ? void 0 : _c2.name) || "").split(" ")[0])}</span></div>`);
        });
        _push(`<!--]--></div><div class="shrink-0 flex flex-col items-center px-3 gap-0.5"><button class="${ssrRenderClass([game.court_number ? canEditCourt(game) ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20" : "bg-base-200 text-base-content/50 cursor-default" : "bg-warning/15 text-warning cursor-pointer hover:bg-warning/25", "text-[9px] font-bold px-1.5 py-0.5 rounded border-0 transition-colors leading-tight"])}">${ssrInterpolate(game.court_number ? `${unref(t)("game.court")} ${game.court_number}` : unref(t)("game.setCourt"))}</button>`);
        if (game.status === "finished" && ((_b = game.game_sets) == null ? void 0 : _b.length)) {
          _push(`<!--[-->`);
          ssrRenderList(game.game_sets, (game_set) => {
            _push(`<div class="${ssrRenderClass([game_set.winning_team ? "text-base-content/80" : "text-base-content/30", "text-sm font-bold leading-snug"])}">${ssrInterpolate(game_set.winning_team ? `${game_set.team1_score}-${game_set.team2_score}` : "?-?")}</div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<span class="text-sm font-black text-base-content/20">VS</span>`);
        }
        _push(`</div><div class="${ssrRenderClass([gameWinner(game) === "team2" ? "bg-warning/20 rounded-lg border border-warning/40" : "", "flex-1 flex items-center justify-center gap-1.5 py-1 min-w-0 relative"])}">`);
        if (gameWinner(game) === "team2") {
          _push(`<span class="absolute -top-4 -right-2 text-2xl rotate-[25deg]">👑</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList((_c = game.game_players) == null ? void 0 : _c.filter((p) => isTeam2(p.team)), (player) => {
          var _a3, _b2, _c2;
          _push(`<div class="flex flex-col items-center gap-0.5 shrink-0">`);
          _push(ssrRenderComponent(_sfc_main$1, {
            src: (_a3 = player.user) == null ? void 0 : _a3.avatar,
            name: player.display_name || ((_b2 = player.user) == null ? void 0 : _b2.name),
            size: "md",
            rounded: "full",
            class: "border-2 border-base-100"
          }, null, _parent));
          _push(`<span class="text-[8px] text-base-content/50 max-w-[3rem] truncate text-center leading-none">${ssrInterpolate((player.display_name || ((_c2 = player.user) == null ? void 0 : _c2.name) || "").split(" ")[0])}</span></div>`);
        });
        _push(`<!--]--></div></div>`);
        if (((_d = game.game_players) == null ? void 0 : _d.filter((p) => isUnassigned(p.team)).length) > 0) {
          _push(`<div class="flex items-center justify-center gap-1.5 flex-wrap mb-2"><!--[-->`);
          ssrRenderList((_e = game.game_players) == null ? void 0 : _e.filter((p) => isUnassigned(p.team)), (player) => {
            var _a3, _b2, _c2;
            _push(`<div class="flex items-center gap-1">`);
            _push(ssrRenderComponent(_sfc_main$1, {
              src: (_a3 = player.user) == null ? void 0 : _a3.avatar,
              name: player.display_name || ((_b2 = player.user) == null ? void 0 : _b2.name),
              size: "xs",
              rounded: "full"
            }, null, _parent));
            _push(`<span class="text-[9px] text-base-content/50">${ssrInterpolate((player.display_name || ((_c2 = player.user) == null ? void 0 : _c2.name) || "").split(" ")[0])}</span></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (!isGameIsFull(game) && ["setting", "listing"].includes(game.status)) {
          _push(`<button class="w-full py-1.5 rounded-lg border border-dashed border-base-300 bg-transparent text-base-content/40 cursor-pointer hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all text-[10px] font-medium mb-1.5">${ssrInterpolate(unref(t)("game.addPlayers"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center justify-between pt-1.5 border-t border-base-200"><div class="flex items-center gap-1 text-[10px] text-base-content/50">`);
        if (game.status === "finished") {
          _push(`<span>${ssrInterpolate(playTime(game.game_start_date, game.game_end_date))}</span>`);
        } else if (game.status === "playing") {
          _push(`<!--[--><span class="inline-block w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span><span class="text-success font-medium">${ssrInterpolate(unref(t)("game.playing"))} (${ssrInterpolate(elapsedTime(game.game_start_date))})</span><!--]-->`);
        } else {
          _push(`<span>${ssrInterpolate(((_f = game.game_players) == null ? void 0 : _f.length) || 0)}/${ssrInterpolate(getMaxPlayers(game.game_type) || "?")} ${ssrInterpolate(unref(t)("common.players"))}</span>`);
        }
        _push(`</div><div class="flex items-center gap-1"><button style="${ssrRenderStyle(game.status === "setting" ? null : { display: "none" })}" class="btn btn-secondary btn-xs btn-sm h-6 min-h-0 text-[10px]">${ssrInterpolate(unref(t)("game.list"))}</button><button style="${ssrRenderStyle(game.status === "listing" ? null : { display: "none" })}" class="btn btn-primary btn-xs btn-sm h-6 min-h-0 text-[10px]">${ssrInterpolate(unref(t)("game.start"))}</button><button style="${ssrRenderStyle(["setting", "listing"].includes(game.status) ? null : { display: "none" })}" class="btn btn-error btn-outline btn-xs btn-sm h-6 min-h-0 text-[10px]">${ssrInterpolate(unref(t)("common.delete"))}</button><button style="${ssrRenderStyle(game.status === "playing" ? null : { display: "none" })}" class="btn btn-info btn-xs btn-sm h-6 min-h-0 text-[10px]">${ssrInterpolate(unref(t)("game.finish"))}</button>`);
        if (game.status === "finished" && isPlayerInGame(game)) {
          _push(`<button class="btn btn-success btn-xs btn-sm h-6 min-h-0 text-[10px]">${ssrInterpolate(hasScore(game) ? unref(t)("game.editScore") : unref(t)("game.score"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        if (game.status === "finished" && noScore(game) && !isPlayerInGame(game)) {
          _push(`<span class="text-[9px] text-base-content/40">${ssrInterpolate(unref(t)("game.waitingScore"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (game.status === "finished" && hasScore(game) && !isPlayerInGame(game)) {
          _push(`<span class="text-[9px] text-success/60">${ssrInterpolate(unref(t)("game.scored"))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
      });
      _push(`<!--]--></div><dialog class="${ssrRenderClass([{ "modal-open": courtDialogVisible.value }, "modal"])}"><div class="modal-box max-w-xs p-0"><div class="flex items-center justify-between px-4 pt-4 pb-2"><h3 class="text-base font-bold text-base-content m-0">🏟️ ${ssrInterpolate(unref(t)("game.courtNumber"))}</h3><button class="w-7 h-7 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors"><span class="text-base-content/60 text-sm">✕</span></button></div><div class="px-4 pb-4">`);
      if (usedCourtNumbers.value.length > 0) {
        _push(`<div class="flex flex-wrap gap-1.5 mb-3"><!--[-->`);
        ssrRenderList(usedCourtNumbers.value, (num) => {
          _push(`<button class="${ssrRenderClass([courtDialogNumber.value === num ? "bg-primary text-white" : activePlayingCourts.value.includes(num) ? "bg-error/10 text-error/50" : "bg-base-200 text-base-content/70 hover:bg-base-300", "h-8 min-w-[2rem] px-2 rounded-lg text-xs font-bold border-0 cursor-pointer transition-all active:scale-95 relative"])}">${ssrInterpolate(num)} `);
          if (activePlayingCourts.value.includes(num)) {
            _push(`<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activePlayingCourts.value.length) {
        _push(`<p class="text-[9px] text-base-content/30 m-0 mb-2"><span class="inline-block w-1.5 h-1.5 rounded-full bg-error mr-1"></span>กำลังเล่นอยู่ </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("value", courtDialogNumber.value)} type="number" min="1"${ssrRenderAttr("placeholder", unref(t)("game.courtNumber"))} class="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 text-center text-2xl font-bold text-base-content focus:border-primary focus:ring-2 focus:ring-primary/20 outline-hidden transition-all"><button${ssrIncludeBooleanAttr(!courtDialogNumber.value || courtDialogNumber.value < 1) ? " disabled" : ""} class="w-full mt-3 h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed">${ssrInterpolate(unref(t)("common.save"))}</button></div></div><form method="dialog" class="modal-backdrop"><button>close</button></form></dialog></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Party/TabGame.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
