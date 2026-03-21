import { ref, computed, onMounted, onUnmounted, watch, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderComponent } from "vue/server-renderer";
import { u as useDragDrop } from "./useDragDrop-NuEBXaBA.js";
import "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./UserAvatar-Dwoh2ac-.js";
import "./useToast-DyaFeJ92.js";
import "./useConfirm-CffLghyV.js";
import { u as useLocale } from "./useLocale-BkZfXvwr.js";
import { s as shuttlecockIcon } from "./shuttlecock-DGGeeBau.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Game2",
  __ssrInlineRender: true,
  props: {
    data: {
      type: Object
    }
  },
  emits: ["gameCreated"],
  setup(__props, { emit: __emit }) {
    var _a;
    const { t } = useLocale();
    let props = __props;
    const localData = ref({ ...props.data });
    const {
      dropZones,
      draggedItem,
      hoveredItem,
      dropZoneActive,
      dragPosition,
      isDragging,
      returnToOriginal,
      convertWaitingTimeToMinutes
    } = useDragDrop();
    const formattedData = computed(
      () => localData.value.readyPlayers.map((item) => ({
        id: item.user_id,
        title: shortenTitle(item.display_name),
        avatar: item.avatar,
        rank_title: item.badminton_rank,
        rank_level: item.badminton_level,
        waiting_time: item.waiting_time,
        played: item.finished_games_count,
        current_game: item.current_game
      }))
    );
    const gameMode = ref(((_a = localData.value.party) == null ? void 0 : _a.default_game_type) || "quadruple");
    const maxPerTeam = computed(() => gameMode.value === "double" ? 1 : 2);
    const maxTotal = computed(() => gameMode.value === "double" ? 2 : 4);
    const form = ref({
      party_id: localData.value.party.id,
      game_type: "quadruple",
      players: [],
      team1_start_side: "north",
      initial_shuttlecock_game: 0,
      court_number: null,
      process: "playing"
    });
    const activeCourts = computed(() => {
      const games = localData.value.games || [];
      return games.filter((g) => g.status === "playing" && g.court_number).map((g) => g.court_number);
    });
    const quickCourtNumbers = computed(() => {
      var _a2;
      const nums = /* @__PURE__ */ new Set();
      (((_a2 = localData.value.party) == null ? void 0 : _a2.court_bookings) || []).forEach((b) => {
        if (b.court_field_number) nums.add(b.court_field_number);
      });
      (localData.value.games || []).forEach((g) => {
        if (g.court_number) nums.add(g.court_number);
      });
      return [...nums].sort((a, b) => a - b);
    });
    const sortOrder = ref("ASC");
    const showCourtDialog = ref(false);
    ref(null);
    const tempCourtNumber = ref(null);
    ref(false);
    const sortedPlayerByGamePlayed = computed(() => {
      const players = [...formattedData.value];
      return players.sort((a, b) => {
        const gameDiff = a.played - b.played;
        if (gameDiff !== 0) return gameDiff;
        return (b.waiting_time || 0) - (a.waiting_time || 0);
      });
    });
    const formattedBreakPlayers = computed(
      () => (localData.value.breakPlayers || []).map((item) => ({
        id: item.user_id,
        title: shortenTitle(item.display_name),
        avatar: item.avatar,
        rank_title: item.badminton_rank,
        rank_level: item.badminton_level,
        waiting_time: 0,
        played: item.finished_games_count || 0,
        current_game: null,
        current_game_number: null
      }))
    );
    const formattedPlayingPlayers = computed(
      () => (localData.value.playingPlayers || []).map((item) => ({
        id: item.user_id,
        title: shortenTitle(item.display_name),
        avatar: item.avatar,
        rank_title: item.badminton_rank,
        rank_level: item.badminton_level,
        waiting_time: item.waiting_time,
        played: (item.finished_games_count || 0) + 1,
        current_game: item.current_game,
        current_game_number: item.current_game_number
      }))
    );
    const nowTime = ref(Date.now());
    let elapsedTimer = null;
    onMounted(() => {
      elapsedTimer = setInterval(() => {
        nowTime.value = Date.now();
      }, 1e4);
    });
    onUnmounted(() => {
      if (elapsedTimer) clearInterval(elapsedTimer);
    });
    const elapsedMinutes = (gameStartDate) => {
      if (!gameStartDate) return 0;
      return Math.floor((nowTime.value - new Date(gameStartDate).getTime()) / 6e4);
    };
    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === "ASC" ? "DESC" : "ASC";
      dropZones.Ready = [...sortedPlayerByGamePlayed.value];
      dropZones.Playing = [...formattedPlayingPlayers.value].sort((a, b) => (a.current_game_number || 999) - (b.current_game_number || 999));
      dropZones.Break = [...formattedBreakPlayers.value];
    };
    const gameCountColors = [
      "bg-emerald-100 text-emerald-700",
      // 0
      "bg-sky-100 text-sky-700",
      // 1
      "bg-violet-100 text-violet-700",
      // 2
      "bg-amber-100 text-amber-700",
      // 3
      "bg-rose-100 text-rose-700",
      // 4
      "bg-teal-100 text-teal-700",
      // 5
      "bg-indigo-100 text-indigo-700",
      // 6
      "bg-orange-100 text-orange-700",
      // 7
      "bg-pink-100 text-pink-700",
      // 8
      "bg-cyan-100 text-cyan-700",
      // 9
      "bg-fuchsia-100 text-fuchsia-700"
      // 10+
    ];
    const gameCountClass = (count) => gameCountColors[Math.min(count, 10)];
    const gameNumColors = [
      "",
      // 0 (unused)
      "bg-sky-100 text-sky-700",
      // #1
      "bg-violet-100 text-violet-700",
      // #2
      "bg-amber-100 text-amber-700",
      // #3
      "bg-rose-100 text-rose-700",
      // #4
      "bg-teal-100 text-teal-700",
      // #5
      "bg-indigo-100 text-indigo-700",
      // #6
      "bg-orange-100 text-orange-700",
      // #7
      "bg-pink-100 text-pink-700",
      // #8
      "bg-cyan-100 text-cyan-700",
      // #9
      "bg-fuchsia-100 text-fuchsia-700"
      // #10+
    ];
    const gameNumClass = (num) => gameNumColors[Math.min(num || 1, 10)];
    const shortenTitle = (title, maxLength = 14) => {
      if (title.length > maxLength) {
        return `${title.slice(0, maxLength)}...`;
      }
      return title;
    };
    const totalGamePlayers = computed(() => dropZones.Team1.length + dropZones.Team2.length);
    const team1Level = computed(() => dropZones.Team1.reduce((sum, p) => sum + (p.rank_level || 0), 0));
    const team2Level = computed(() => dropZones.Team2.reduce((sum, p) => sum + (p.rank_level || 0), 0));
    const levelDiff = computed(() => Math.abs(team1Level.value - team2Level.value));
    const isBalanced = computed(() => levelDiff.value <= 3);
    watch(
      () => props.data,
      (newData) => {
        localData.value = { ...newData };
        toggleSortOrder();
      },
      { deep: true, immediate: true }
    );
    onMounted(() => {
      toggleSortOrder();
    });
    const zoneConfig = computed(() => ({
      Game: { label: "Game", cssClass: "border-success/40 bg-success/5" },
      Ready: { label: t("zone.ready"), cssClass: "border-info/40 bg-info/5" },
      Playing: { label: t("zone.playing"), cssClass: "border-accent/40 bg-accent/5" },
      Listing: { label: t("zone.listing"), cssClass: "border-secondary/40 bg-secondary/5" },
      Break: { label: t("zone.break"), cssClass: "border-error/30 bg-error/5" },
      Finish: { label: t("zone.finish"), cssClass: "border-base-content/20 bg-base-content/5" }
    }));
    const zoneBadgeClass = (zone) => {
      const map = {
        Game: "badge-success",
        Ready: "badge-info",
        Playing: "badge-accent",
        Listing: "badge-secondary",
        Break: "badge-warning",
        Finish: "badge-neutral"
      };
      return map[zone] || "badge-ghost";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))} data-v-4619d47b><div class="game-zone-card rounded-2xl p-4 border-2 border-dashed transition-all" style="${ssrRenderStyle({
        borderColor: unref(dropZoneActive) === "Team1" || unref(dropZoneActive) === "Team2" ? "#67e8f9" : "#86efac",
        backgroundColor: unref(dropZoneActive) === "Team1" || unref(dropZoneActive) === "Team2" ? "#cffafe" : "#f0fdf4"
      })}" data-v-4619d47b><div class="flex items-center justify-between mb-1.5" data-v-4619d47b><div class="flex items-center gap-1.5" data-v-4619d47b><span class="badge badge-success badge-sm font-bold gap-0.5" data-v-4619d47b>🏸 Game</span><span class="text-[10px] text-base-content/50" data-v-4619d47b>${ssrInterpolate(totalGamePlayers.value)}/${ssrInterpolate(maxTotal.value)}</span><div class="flex gap-0.5 p-0.5 bg-base-100/80 rounded-md" data-v-4619d47b><button type="button" class="${ssrRenderClass([gameMode.value === "double" ? "bg-primary text-white" : "bg-transparent text-base-content/40 hover:text-base-content", "px-1.5 py-0.5 rounded text-[9px] font-bold border-0 cursor-pointer transition-all"])}" data-v-4619d47b>1v1</button><button type="button" class="${ssrRenderClass([gameMode.value === "quadruple" ? "bg-primary text-white" : "bg-transparent text-base-content/40 hover:text-base-content", "px-1.5 py-0.5 rounded text-[9px] font-bold border-0 cursor-pointer transition-all"])}" data-v-4619d47b>2v2</button></div></div><div class="flex items-center gap-1" data-v-4619d47b><button class="${ssrRenderClass([form.value.court_number ? "text-primary" : "text-warning", "flex items-center gap-0.5 bg-base-100/80 rounded px-1.5 py-0.5 border-0 cursor-pointer hover:bg-base-200 transition-colors text-[10px] font-bold"])}" data-v-4619d47b>${ssrInterpolate(form.value.court_number ? `🏟️ ${unref(t)("game.court")} ${form.value.court_number}` : `🏟️ ${unref(t)("game.setCourt")}`)}</button><div class="flex items-center gap-0.5 bg-base-100/80 rounded px-1.5 py-0.5" data-v-4619d47b><img${ssrRenderAttr("src", unref(shuttlecockIcon))} alt="" class="w-3 h-3 inline" style="${ssrRenderStyle({ "filter": "brightness(0) saturate(100%) invert(40%)" })}" data-v-4619d47b><select class="select select-ghost select-xs w-10 min-h-0 h-5 px-0 text-[10px] font-bold" data-v-4619d47b><!--[-->`);
      ssrRenderList([0, 1, 2, 3], (i) => {
        _push(`<option${ssrRenderAttr("value", i)} data-v-4619d47b${ssrIncludeBooleanAttr(Array.isArray(form.value.initial_shuttlecock_game) ? ssrLooseContain(form.value.initial_shuttlecock_game, i) : ssrLooseEqual(form.value.initial_shuttlecock_game, i)) ? " selected" : ""}>${ssrInterpolate(i)} ลูก</option>`);
      });
      _push(`<!--]--></select></div></div></div><div class="flex items-center gap-1 mb-2" data-v-4619d47b><button class="btn btn-info btn-xs h-6 min-h-0 gap-0.5 text-[10px]" data-v-4619d47b><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-4619d47b><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" data-v-4619d47b></path></svg> จัดอัตโนมัติ </button><div class="ml-auto flex items-center gap-1" data-v-4619d47b><button class="btn btn-success btn-xs h-6 min-h-0 gap-0.5 text-[10px]" data-v-4619d47b><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor" data-v-4619d47b><path d="M8 5v14l11-7z" data-v-4619d47b></path></svg> เริ่มเกม </button><button class="btn btn-warning btn-xs h-6 min-h-0 gap-0.5 text-[10px]" data-v-4619d47b><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-4619d47b><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" data-v-4619d47b></path></svg> ลีส </button><button class="btn btn-error btn-xs h-6 min-h-0 gap-0.5 text-[10px]" data-v-4619d47b><svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-4619d47b><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" data-v-4619d47b></path></svg> ล้าง </button></div></div>`);
      if (totalGamePlayers.value >= 3) {
        _push(`<div class="flex items-center justify-center gap-2 mb-2" data-v-4619d47b><span class="${ssrRenderClass([isBalanced.value ? "bg-success/15 text-success" : "bg-warning/15 text-warning", "text-[10px] font-bold px-2 py-0.5 rounded-full"])}" data-v-4619d47b>${ssrInterpolate(isBalanced.value ? "Balanced" : `Diff ${levelDiff.value}`)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-stretch gap-2 min-h-[10rem]" data-v-4619d47b><div class="flex-1 rounded-xl border-2 border-dashed border-accent/40 bg-accent/5 p-2.5 flex flex-col" data-zone="Team1" data-v-4619d47b><div class="flex items-center justify-between mb-2" data-v-4619d47b><span class="text-[10px] font-bold text-accent uppercase tracking-wider" data-v-4619d47b>Team 1</span>`);
      if (unref(dropZones).Team1.length) {
        _push(`<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-accent/15 text-accent" data-v-4619d47b>Lv ${ssrInterpolate(team1Level.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-col gap-2 flex-1" data-v-4619d47b><!--[-->`);
      ssrRenderList(unref(dropZones).Team1, (item) => {
        var _a2, _b;
        _push(`<div class="${ssrRenderClass([{ "ring-2 ring-primary bg-primary/10": ((_a2 = unref(hoveredItem)) == null ? void 0 : _a2.id) === item.id }, "player-card relative bg-base-100 rounded-xl overflow-hidden shadow-xs border border-base-200 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"])}"${ssrRenderAttr("data-id", item.id)} data-v-4619d47b><button class="absolute top-1 right-1 w-5 h-5 rounded-full bg-error text-error-content text-[10px] flex items-center justify-center cursor-pointer hover:bg-error/80 z-10" data-v-4619d47b>✕</button><div class="flex items-center gap-2 p-2.5" data-v-4619d47b>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: item.avatar,
          name: item.display_name || item.name,
          size: "md",
          rounded: "full",
          class: "border-2 border-accent/30 shrink-0"
        }, null, _parent));
        _push(`<div class="flex flex-col min-w-0 flex-1" data-v-4619d47b><span class="text-xs font-semibold text-base-content leading-tight truncate" data-v-4619d47b>${ssrInterpolate(item.title)}</span><div class="flex items-center gap-1 mt-0.5" data-v-4619d47b><span class="text-[9px] px-1 py-px rounded bg-success/15 text-success font-semibold" data-v-4619d47b>Lv${ssrInterpolate(item.rank_level)}</span><span class="${ssrRenderClass([gameCountClass(item.played), "text-[9px] px-1 py-px rounded font-semibold"])}" data-v-4619d47b>${ssrInterpolate(item.played)} เกม</span><span class="${ssrRenderClass([item.current_game ? gameNumClass(item.current_game_number) : "bg-warning/15 text-warning", "text-[9px] px-1 py-px rounded font-semibold ml-auto"])}" data-v-4619d47b>${ssrInterpolate(item.current_game ? `#${item.current_game_number || "?"} · ${elapsedMinutes((_b = item.current_game) == null ? void 0 : _b.game_start_date)}น.` : `รอ ${unref(convertWaitingTimeToMinutes)(item.waiting_time)}น.`)}</span></div></div></div></div>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(Math.max(0, maxPerTeam.value - unref(dropZones).Team1.length), (n) => {
        _push(`<div class="rounded-xl border-2 border-dashed border-accent/20 flex items-center justify-center min-h-[4.5rem] text-accent/20" data-v-4619d47b><svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" data-v-4619d47b><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" data-v-4619d47b></path></svg></div>`);
      });
      _push(`<!--]--></div></div><div class="shrink-0 flex flex-col items-center justify-center px-1" data-v-4619d47b><span class="text-xs font-black text-base-content/20" data-v-4619d47b>VS</span></div><div class="flex-1 rounded-xl border-2 border-dashed border-secondary/40 bg-secondary/5 p-2.5 flex flex-col" data-zone="Team2" data-v-4619d47b><div class="flex items-center justify-between mb-2" data-v-4619d47b><span class="text-[10px] font-bold text-secondary uppercase tracking-wider" data-v-4619d47b>Team 2</span>`);
      if (unref(dropZones).Team2.length) {
        _push(`<span class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-secondary/15 text-secondary" data-v-4619d47b>Lv ${ssrInterpolate(team2Level.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-col gap-2 flex-1" data-v-4619d47b><!--[-->`);
      ssrRenderList(unref(dropZones).Team2, (item) => {
        var _a2, _b;
        _push(`<div class="${ssrRenderClass([{ "ring-2 ring-primary bg-primary/10": ((_a2 = unref(hoveredItem)) == null ? void 0 : _a2.id) === item.id }, "player-card relative bg-base-100 rounded-xl overflow-hidden shadow-xs border border-base-200 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"])}"${ssrRenderAttr("data-id", item.id)} data-v-4619d47b><button class="absolute top-1 right-1 w-5 h-5 rounded-full bg-error text-error-content text-[10px] flex items-center justify-center cursor-pointer hover:bg-error/80 z-10" data-v-4619d47b>✕</button><div class="flex items-center gap-2 p-2.5" data-v-4619d47b>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: item.avatar,
          name: item.display_name || item.name,
          size: "md",
          rounded: "full",
          class: "border-2 border-secondary/30 shrink-0"
        }, null, _parent));
        _push(`<div class="flex flex-col min-w-0 flex-1" data-v-4619d47b><span class="text-xs font-semibold text-base-content leading-tight truncate" data-v-4619d47b>${ssrInterpolate(item.title)}</span><div class="flex items-center gap-1 mt-0.5" data-v-4619d47b><span class="text-[9px] px-1 py-px rounded bg-success/15 text-success font-semibold" data-v-4619d47b>Lv${ssrInterpolate(item.rank_level)}</span><span class="${ssrRenderClass([gameCountClass(item.played), "text-[9px] px-1 py-px rounded font-semibold"])}" data-v-4619d47b>${ssrInterpolate(item.played)} เกม</span><span class="${ssrRenderClass([item.current_game ? gameNumClass(item.current_game_number) : "bg-warning/15 text-warning", "text-[9px] px-1 py-px rounded font-semibold ml-auto"])}" data-v-4619d47b>${ssrInterpolate(item.current_game ? `#${item.current_game_number || "?"} · ${elapsedMinutes((_b = item.current_game) == null ? void 0 : _b.game_start_date)}น.` : `รอ ${unref(convertWaitingTimeToMinutes)(item.waiting_time)}น.`)}</span></div></div></div></div>`);
      });
      _push(`<!--]--><!--[-->`);
      ssrRenderList(Math.max(0, maxPerTeam.value - unref(dropZones).Team2.length), (n) => {
        _push(`<div class="rounded-xl border-2 border-dashed border-secondary/20 flex items-center justify-center min-h-[4.5rem] text-secondary/20" data-v-4619d47b><svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" data-v-4619d47b><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" data-v-4619d47b></path></svg></div>`);
      });
      _push(`<!--]--></div></div></div></div><!--[-->`);
      ssrRenderList(["Ready", "Playing", "Listing", "Break", "Finish"], (zone) => {
        _push(`<!--[-->`);
        if (unref(dropZones)[zone].length > 0 || zone === "Ready" || zone === "Playing" || zone === "Break") {
          _push(`<div class="${ssrRenderClass([unref(dropZoneActive) === zone ? "border-info bg-info/10" : zoneConfig.value[zone].cssClass, "rounded-2xl p-3 border-2 border-dashed transition-all"])}"${ssrRenderAttr("data-zone", zone)} data-v-4619d47b><div class="flex items-center gap-2 mb-2" data-v-4619d47b><span class="${ssrRenderClass([zoneBadgeClass(zone), "badge badge-sm font-bold"])}" data-v-4619d47b>${ssrInterpolate(zoneConfig.value[zone].label)}</span><span class="text-xs text-base-content/50" data-v-4619d47b>${ssrInterpolate(unref(dropZones)[zone].length)}</span></div><div class="grid grid-cols-2 sm:grid-cols-3 gap-2" data-v-4619d47b><!--[-->`);
          ssrRenderList(unref(dropZones)[zone], (item) => {
            var _a2, _b;
            _push(`<div class="${ssrRenderClass([{ "ring-2 ring-primary bg-primary/10": ((_a2 = unref(hoveredItem)) == null ? void 0 : _a2.id) === item.id }, "player-card relative bg-base-100 rounded-xl overflow-hidden shadow-xs border border-base-200 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md"])}"${ssrRenderAttr("data-id", item.id)} data-v-4619d47b><button class="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary text-primary-content text-[10px] flex items-center justify-center cursor-pointer hover:bg-primary/80 z-10" data-v-4619d47b>+</button><div class="flex items-center gap-2 p-2.5" data-v-4619d47b>`);
            _push(ssrRenderComponent(_sfc_main$1, {
              src: item.avatar,
              name: item.display_name || item.name,
              size: "md",
              rounded: "full",
              class: "border-2 border-base-200 shrink-0"
            }, null, _parent));
            _push(`<div class="flex flex-col min-w-0 flex-1" data-v-4619d47b><span class="text-xs font-semibold text-base-content leading-tight truncate" data-v-4619d47b>${ssrInterpolate(item.title)}</span><div class="flex items-center gap-1 mt-0.5" data-v-4619d47b><span class="text-[9px] px-1 py-px rounded bg-success/15 text-success font-medium" data-v-4619d47b>Lv${ssrInterpolate(item.rank_level)}</span><span class="${ssrRenderClass([gameCountClass(item.played), "text-[9px] px-1 py-px rounded font-medium"])}" data-v-4619d47b>${ssrInterpolate(item.played)} เกม</span><span class="${ssrRenderClass([item.current_game ? "bg-accent/15 text-accent" : "bg-warning/15 text-warning", "text-[9px] px-1 py-px rounded font-medium ml-auto"])}" data-v-4619d47b>${ssrInterpolate(item.current_game ? `#${item.current_game_number || "?"} · ${elapsedMinutes((_b = item.current_game) == null ? void 0 : _b.game_start_date)}น.` : `รอ ${unref(convertWaitingTimeToMinutes)(item.waiting_time)}น.`)}</span></div></div></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]-->`);
      if (unref(isDragging)) {
        _push(`<div class="fixed pointer-events-none z-[1000] flex flex-col items-center gap-1 bg-base-100 p-2 border-2 border-emerald-400 rounded-xl shadow-xl" style="${ssrRenderStyle({
          left: `${unref(dragPosition).x}px`,
          top: `${unref(dragPosition).y}px`,
          transform: "translate(-50%, -50%)",
          transition: unref(returnToOriginal) ? "all 0.3s ease" : "none"
        })}" data-v-4619d47b>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: unref(draggedItem).avatar,
          name: unref(draggedItem).display_name || unref(draggedItem).name,
          size: "md",
          rounded: "full",
          class: "border-2 border-primary"
        }, null, _parent));
        _push(`<span class="text-xs font-semibold text-base-content/80" data-v-4619d47b>${ssrInterpolate(unref(draggedItem).title)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<dialog class="${ssrRenderClass([{ "modal-open": showCourtDialog.value }, "modal"])}" data-v-4619d47b><div class="modal-box max-w-xs p-0" data-v-4619d47b><div class="flex items-center justify-between px-4 pt-4 pb-2" data-v-4619d47b><h3 class="text-base font-bold text-base-content m-0" data-v-4619d47b>🏟️ ${ssrInterpolate(unref(t)("game.courtNumber"))}</h3><button class="w-7 h-7 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors" data-v-4619d47b><span class="text-base-content/60 text-sm" data-v-4619d47b>✕</span></button></div><div class="px-4 pb-4 space-y-3" data-v-4619d47b>`);
      if (quickCourtNumbers.value.length) {
        _push(`<div class="flex flex-wrap gap-1.5" data-v-4619d47b><!--[-->`);
        ssrRenderList(quickCourtNumbers.value, (num) => {
          _push(`<button type="button" class="${ssrRenderClass([tempCourtNumber.value === num ? "bg-primary text-white" : activeCourts.value.includes(num) ? "bg-error/10 text-error/50" : "bg-base-200 text-base-content/70 hover:bg-base-300", "h-9 min-w-[2.5rem] px-3 rounded-lg text-sm font-bold border-0 cursor-pointer transition-all active:scale-95 relative"])}" data-v-4619d47b>${ssrInterpolate(num)} `);
          if (activeCourts.value.includes(num)) {
            _push(`<span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-error" data-v-4619d47b></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeCourts.value.length) {
        _push(`<p class="text-[9px] text-base-content/30 m-0" data-v-4619d47b><span class="inline-block w-1.5 h-1.5 rounded-full bg-error mr-1" data-v-4619d47b></span>กำลังเล่นอยู่ </p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("value", tempCourtNumber.value)} type="number" min="1"${ssrRenderAttr("placeholder", unref(t)("game.courtNumber"))} class="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 text-center text-2xl font-bold text-base-content focus:border-primary outline-hidden transition-all" data-v-4619d47b><button${ssrIncludeBooleanAttr(!tempCourtNumber.value || tempCourtNumber.value < 1) ? " disabled" : ""} class="w-full h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed" data-v-4619d47b>${ssrInterpolate(unref(t)("common.save"))}</button></div></div><form method="dialog" class="modal-backdrop" data-v-4619d47b><button data-v-4619d47b>close</button></form></dialog></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Game2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Game = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4619d47b"]]);
export {
  Game as default
};
