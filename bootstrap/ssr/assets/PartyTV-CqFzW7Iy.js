import { computed, ref, onMounted, onUnmounted, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrRenderList } from "vue/server-renderer";
import { usePage, Head, router } from "@inertiajs/vue3";
import { Realtime } from "ably";
import { _ as _sfc_main$1 } from "./UserAvatar-Dwoh2ac-.js";
import { u as useBadmintonLayout } from "./badmintonLayout-Bmnf0xqT.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "PartyTV",
  __ssrInlineRender: true,
  setup(__props) {
    const { initTheme } = useBadmintonLayout();
    const page = usePage();
    const party = computed(() => page.props.party);
    const playingGames = ref(page.props.playingGames ?? []);
    const listingGames = ref(page.props.listingGames ?? []);
    const readyPlayers = ref(page.props.readyPlayers ?? []);
    const breakPlayers = ref(page.props.breakPlayers ?? []);
    const avgGameDuration = computed(() => page.props.avgGameDuration ?? 15);
    const courtBookings = computed(() => party.value.court_bookings ?? []);
    const bookedCourts = computed(() => {
      const fromBookings = courtBookings.value.map((b) => b.court_field_number);
      const fromPlaying = playingGames.value.map((g) => g.court_number).filter((n) => n != null);
      const fromListing = listingGames.value.map((g) => g.court_number).filter((n) => n != null);
      const all = [.../* @__PURE__ */ new Set([...fromBookings, ...fromPlaying, ...fromListing])];
      return all.sort((a, b) => a - b);
    });
    const listingPlayers = computed(() => {
      var _a, _b, _c;
      const players = [];
      for (const game of listingGames.value) {
        for (const gp of game.game_players || []) {
          players.push({
            user_id: gp.user_id,
            name: (_a = gp.user) == null ? void 0 : _a.name,
            display_name: gp.display_name || ((_b = gp.user) == null ? void 0 : _b.name),
            avatar: (_c = gp.user) == null ? void 0 : _c.avatar,
            game_number: game.game_number,
            game_status: game.status,
            court_number: game.court_number
          });
        }
      }
      return players;
    });
    const now = ref(/* @__PURE__ */ new Date());
    let clockTimer = null;
    const currentScreen = ref("playing");
    const isLocked = ref(false);
    let rotateTimer = null;
    const startRotateTimer = () => {
      if (rotateTimer) clearInterval(rotateTimer);
      rotateTimer = setInterval(() => {
        if (!isLocked.value) {
          currentScreen.value = currentScreen.value === "playing" ? "waiting" : "playing";
        }
      }, 1e4);
    };
    const gridSize = computed(() => {
      const count = bookedCourts.value.length;
      if (count <= 1) return 1;
      if (count <= 4) return 2;
      if (count <= 9) return 3;
      if (count <= 16) return 4;
      return 5;
    });
    const gridCols = computed(() => gridSize.value);
    const gridRows = computed(() => gridSize.value);
    const gridStyle = computed(() => ({
      gridTemplateColumns: `repeat(${gridCols.value}, 1fr)`,
      gridTemplateRows: `repeat(${gridRows.value}, 1fr)`
    }));
    computed(() => gridCols.value * gridRows.value);
    const courtScale = computed(() => {
      const g = gridSize.value;
      const scales = { 1: 1, 2: 0.85, 3: 0.65, 4: 0.5, 5: 0.4 };
      return scales[g] || 0.5;
    });
    const courtCssVars = computed(() => {
      const s = courtScale.value;
      return {
        "--court-name": `clamp(0.55rem, ${s * 1.6}vw, 1.8rem)`,
        "--court-vs": `clamp(0.6rem, ${s * 2}vw, 2.5rem)`,
        "--court-header": `clamp(0.6rem, ${s * 1.3}vw, 1.4rem)`,
        "--court-avatar": `clamp(2rem, ${s * 5.5}vw, 6rem)`
      };
    });
    computed(() => null);
    const maxNameLen = computed(() => {
      const count = bookedCourts.value.length;
      if (count <= 2) return 16;
      if (count <= 4) return 12;
      if (count <= 6) return 10;
      return 8;
    });
    const displayName = (player) => {
      var _a;
      return player.display_name || ((_a = player.user) == null ? void 0 : _a.name) || "";
    };
    const queuedListingGames = computed(() => {
      const playingCourtSet = new Set(playingGames.value.map((g) => g.court_number).filter(Boolean));
      return listingGames.value.filter((g) => !g.court_number || playingCourtSet.has(g.court_number));
    });
    const isLongName = (player) => displayName(player).length > maxNameLen.value;
    const getGameOnCourt = (courtNumber) => {
      return playingGames.value.find((g) => g.court_number === courtNumber);
    };
    const getListingGameOnCourt = (courtNumber) => {
      return listingGames.value.find((g) => g.court_number === courtNumber);
    };
    const elapsedTime = (gameStartDate) => {
      if (!gameStartDate) return "00:00";
      const start = new Date(gameStartDate);
      const diff = Math.max(0, Math.floor((now.value - start) / 1e3));
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;
      return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    };
    const teamPlayers = (game, team) => {
      return (game.game_players || []).filter((p) => p.team === team);
    };
    const sortedReadyPlayers = computed(() => {
      return [...readyPlayers.value].sort((a, b) => (b.waiting_time || 0) - (a.waiting_time || 0));
    });
    const estimatedMinutesUntilCourtFree = computed(() => {
      if (playingGames.value.length === 0) return 0;
      let maxElapsedMin = 0;
      for (const g of playingGames.value) {
        if (g.game_start_date) {
          const elapsed = Math.floor((now.value - new Date(g.game_start_date)) / 6e4);
          if (elapsed > maxElapsedMin) maxElapsedMin = elapsed;
        }
      }
      const remaining = Math.max(0, Math.round(avgGameDuration.value - maxElapsedMin));
      return remaining;
    });
    const formatWaitTime = (seconds) => {
      if (!seconds || seconds < 60) return "< 1 นาที";
      const mins = Math.floor(seconds / 60);
      return `${mins} นาที`;
    };
    const clockDisplay = computed(() => {
      return now.value.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Bangkok" });
    });
    let ablyInstance = null;
    let partyChannel = null;
    let reloading = false;
    const handlePartyEvent = (message) => {
      if (!message || !message.name) return;
      if (reloading) return;
      reloading = true;
      router.reload({
        preserveScroll: true,
        only: ["playingGames", "listingGames", "readyPlayers", "breakPlayers", "avgGameDuration"],
        onSuccess: (p) => {
          playingGames.value = p.props.playingGames ?? [];
          listingGames.value = p.props.listingGames ?? [];
          readyPlayers.value = p.props.readyPlayers ?? [];
          breakPlayers.value = p.props.breakPlayers ?? [];
        },
        onFinish: () => {
          reloading = false;
        }
      });
    };
    onMounted(() => {
      initTheme();
      clockTimer = setInterval(() => {
        now.value = /* @__PURE__ */ new Date();
      }, 1e3);
      startRotateTimer();
      const ablyKey = page.props.ably_key;
      if (ablyKey) {
        ablyInstance = new Realtime({ key: ablyKey, clientId: `tv-${page.props.auth.user.id}`, log: { level: 0 } });
        partyChannel = ablyInstance.channels.get(`party.${party.value.id}`);
        partyChannel.subscribe(handlePartyEvent);
        ablyInstance.connection.on("failed", () => {
        });
        ablyInstance.connection.on("suspended", () => {
        });
      }
    });
    onUnmounted(() => {
      if (clockTimer) clearInterval(clockTimer);
      if (rotateTimer) clearInterval(rotateTimer);
      if (partyChannel) {
        partyChannel.unsubscribe();
        partyChannel.detach();
      }
      if (ablyInstance) ablyInstance.close();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: `TV - ${party.value.name || ((_a = party.value.court) == null ? void 0 : _a.name) || "Party"}`
      }, null, _parent));
      _push(`<div class="w-screen h-screen bg-neutral text-neutral-content overflow-hidden flex flex-col" data-theme="badminton-dark" data-v-c2ba51b5><header class="flex items-center justify-between px-6 py-3 bg-base-300/50 shrink-0" data-v-c2ba51b5><div class="flex items-center gap-2" data-v-c2ba51b5><span class="text-2xl" data-v-c2ba51b5>🏸</span><div data-v-c2ba51b5><div class="text-lg font-bold text-primary" data-v-c2ba51b5>${ssrInterpolate(party.value.name || ((_b = party.value.court) == null ? void 0 : _b.name) || "Party")}</div><div class="text-xs text-base-content/50" data-v-c2ba51b5>${ssrInterpolate((_c = party.value.court) == null ? void 0 : _c.name)} · ${ssrInterpolate((_d = party.value.start_time) == null ? void 0 : _d.substring(0, 5))} - ${ssrInterpolate((_e = party.value.end_time) == null ? void 0 : _e.substring(0, 5))}</div></div></div><div class="flex items-center gap-6" data-v-c2ba51b5><div class="flex items-center gap-4 text-sm" data-v-c2ba51b5><span class="text-base-content/60" data-v-c2ba51b5>👥 ${ssrInterpolate(party.value.members_count)} คน</span><span class="text-primary" data-v-c2ba51b5>🏸 ${ssrInterpolate(playingGames.value.length)} เกมกำลังเล่น</span>`);
      if (listingPlayers.value.length) {
        _push(`<span class="text-warning" data-v-c2ba51b5>📋 ${ssrInterpolate(listingPlayers.value.length)} รอลงสนาม</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="text-accent" data-v-c2ba51b5>⏳ ${ssrInterpolate(sortedReadyPlayers.value.length)} คนรอ</span></div><div class="flex items-center gap-2" data-v-c2ba51b5><button class="${ssrRenderClass([currentScreen.value === "playing" ? "bg-primary/20 text-primary" : "bg-transparent text-base-content/30 hover:text-base-content/50", "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-0 cursor-pointer transition-all"])}" data-v-c2ba51b5><div class="${ssrRenderClass([currentScreen.value === "playing" ? "bg-primary scale-110" : "bg-base-content/20", "w-2.5 h-2.5 rounded-full transition-all"])}" data-v-c2ba51b5></div><span class="text-xs font-medium" data-v-c2ba51b5>สนาม</span></button><button class="${ssrRenderClass([currentScreen.value === "waiting" ? "bg-accent/20 text-accent" : "bg-transparent text-base-content/30 hover:text-base-content/50", "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border-0 cursor-pointer transition-all"])}" data-v-c2ba51b5><div class="${ssrRenderClass([currentScreen.value === "waiting" ? "bg-accent scale-110" : "bg-base-content/20", "w-2.5 h-2.5 rounded-full transition-all"])}" data-v-c2ba51b5></div><span class="text-xs font-medium" data-v-c2ba51b5>รอคิว</span></button><button class="${ssrRenderClass([isLocked.value ? "bg-error/20 text-error" : "bg-base-content/5 text-base-content/30 hover:text-base-content/50", "w-8 h-8 rounded-lg border-0 cursor-pointer flex items-center justify-center transition-all"])}"${ssrRenderAttr("title", isLocked.value ? "ปลดล็อก (เลื่อนอัตโนมัติ)" : "ล็อกหน้าจอนี้")} data-v-c2ba51b5>`);
      if (isLocked.value) {
        _push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-c2ba51b5><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" data-v-c2ba51b5></path></svg>`);
      } else {
        _push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-c2ba51b5><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" data-v-c2ba51b5></path></svg>`);
      }
      _push(`</button></div><div class="text-2xl font-mono font-bold text-base-content/80 tabular-nums" data-v-c2ba51b5>${ssrInterpolate(clockDisplay.value)}</div></div></header><main class="flex-1 relative overflow-hidden" data-v-c2ba51b5>`);
      if (currentScreen.value === "playing") {
        _push(`<div class="absolute inset-0 p-3 flex flex-col gap-2" data-v-c2ba51b5><div class="grid gap-3 flex-1 min-h-0" style="${ssrRenderStyle({ ...gridStyle.value, ...courtCssVars.value })}" data-v-c2ba51b5><!--[-->`);
        ssrRenderList(bookedCourts.value, (courtNum) => {
          _push(`<div class="${ssrRenderClass([getGameOnCourt(courtNum) ? "border-primary/40 bg-court-900/80" : getListingGameOnCourt(courtNum) ? "border-warning/40 bg-warning/5" : "border-base-content/10 bg-base-300/30", "rounded-2xl border-2 overflow-hidden flex flex-col transition-all w-full h-full"])}" data-v-c2ba51b5><div class="flex items-center justify-between px-4 py-2 bg-base-300/30" data-v-c2ba51b5><div class="flex items-center gap-2" data-v-c2ba51b5><span class="text-lg" data-v-c2ba51b5>🏟️</span><span style="${ssrRenderStyle({ "font-size": "var(--court-header)" })}" class="font-bold text-base-content" data-v-c2ba51b5>Court ${ssrInterpolate(courtNum)}</span></div>`);
          if (getGameOnCourt(courtNum)) {
            _push(`<div class="flex items-center gap-2" data-v-c2ba51b5><span class="text-xs text-base-content/50" data-v-c2ba51b5>Game #${ssrInterpolate(getGameOnCourt(courtNum).game_number)}</span><div class="px-3 py-1 rounded-full bg-primary/20 text-primary font-mono font-bold tabular-nums" style="${ssrRenderStyle({ "font-size": "var(--court-header)" })}" data-v-c2ba51b5>${ssrInterpolate(elapsedTime(getGameOnCourt(courtNum).game_start_date))}</div></div>`);
          } else if (getListingGameOnCourt(courtNum)) {
            _push(`<div class="flex items-center gap-2" data-v-c2ba51b5><span class="text-xs text-base-content/50" data-v-c2ba51b5>Game #${ssrInterpolate(getListingGameOnCourt(courtNum).game_number)}</span><div class="px-3 py-1 rounded-full bg-warning/20 text-warning text-xs font-bold animate-pulse" data-v-c2ba51b5>${ssrInterpolate(getListingGameOnCourt(courtNum).status === "setting" ? "🔧 กำลังจัดคู่" : "📋 รอลงสนาม")}</div></div>`);
          } else {
            _push(`<span class="text-sm text-success font-semibold" data-v-c2ba51b5>ว่าง</span>`);
          }
          _push(`</div>`);
          if (getGameOnCourt(courtNum)) {
            _push(`<div class="flex-1 court-match" data-v-c2ba51b5><div class="court-team" data-v-c2ba51b5><!--[-->`);
            ssrRenderList(teamPlayers(getGameOnCourt(courtNum), "team1"), (p) => {
              var _a2;
              _push(`<div class="court-player court-player-left" data-v-c2ba51b5>`);
              _push(ssrRenderComponent(_sfc_main$1, {
                src: (_a2 = p.user) == null ? void 0 : _a2.avatar,
                name: displayName(p),
                size: "lg",
                rounded: "full",
                class: "border-2 border-info/30 court-avatar shrink-0"
              }, null, _parent));
              _push(`<div class="court-name-wrap" data-v-c2ba51b5><span class="${ssrRenderClass([isLongName(p) ? "tv-marquee" : "", "court-name-text"])}" data-v-c2ba51b5>${ssrInterpolate(displayName(p))}</span></div></div>`);
            });
            _push(`<!--]--></div><div class="court-vs" data-v-c2ba51b5><span class="font-bold text-base-content/20" style="${ssrRenderStyle({ "font-size": "var(--court-vs)" })}" data-v-c2ba51b5>VS</span></div><div class="court-team" data-v-c2ba51b5><!--[-->`);
            ssrRenderList(teamPlayers(getGameOnCourt(courtNum), "team2"), (p) => {
              var _a2;
              _push(`<div class="court-player court-player-right" data-v-c2ba51b5><div class="court-name-wrap" data-v-c2ba51b5><span class="${ssrRenderClass([isLongName(p) ? "tv-marquee" : "", "court-name-text text-right"])}" data-v-c2ba51b5>${ssrInterpolate(displayName(p))}</span></div>`);
              _push(ssrRenderComponent(_sfc_main$1, {
                src: (_a2 = p.user) == null ? void 0 : _a2.avatar,
                name: displayName(p),
                size: "lg",
                rounded: "full",
                class: "border-2 border-error/30 court-avatar shrink-0"
              }, null, _parent));
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else if (getListingGameOnCourt(courtNum)) {
            _push(`<div class="flex-1 court-match opacity-70" data-v-c2ba51b5><div class="court-team" data-v-c2ba51b5><!--[-->`);
            ssrRenderList(teamPlayers(getListingGameOnCourt(courtNum), "team1"), (p) => {
              var _a2;
              _push(`<div class="court-player court-player-left" data-v-c2ba51b5>`);
              _push(ssrRenderComponent(_sfc_main$1, {
                src: (_a2 = p.user) == null ? void 0 : _a2.avatar,
                name: displayName(p),
                size: "lg",
                rounded: "full",
                class: "border-2 border-warning/30 court-avatar shrink-0"
              }, null, _parent));
              _push(`<div class="court-name-wrap" data-v-c2ba51b5><span class="${ssrRenderClass([isLongName(p) ? "tv-marquee" : "", "court-name-text"])}" data-v-c2ba51b5>${ssrInterpolate(displayName(p))}</span></div></div>`);
            });
            _push(`<!--]--></div><div class="court-vs" data-v-c2ba51b5><span class="font-bold text-warning/30" style="${ssrRenderStyle({ "font-size": "var(--court-vs)" })}" data-v-c2ba51b5>VS</span></div><div class="court-team" data-v-c2ba51b5><!--[-->`);
            ssrRenderList(teamPlayers(getListingGameOnCourt(courtNum), "team2"), (p) => {
              var _a2;
              _push(`<div class="court-player court-player-right" data-v-c2ba51b5><div class="court-name-wrap" data-v-c2ba51b5><span class="${ssrRenderClass([isLongName(p) ? "tv-marquee" : "", "court-name-text text-right"])}" data-v-c2ba51b5>${ssrInterpolate(displayName(p))}</span></div>`);
              _push(ssrRenderComponent(_sfc_main$1, {
                src: (_a2 = p.user) == null ? void 0 : _a2.avatar,
                name: displayName(p),
                size: "lg",
                rounded: "full",
                class: "border-2 border-warning/30 court-avatar shrink-0"
              }, null, _parent));
              _push(`</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<div class="flex-1 flex items-center justify-center" data-v-c2ba51b5><div class="text-center" data-v-c2ba51b5><div class="text-4xl mb-2 opacity-20" data-v-c2ba51b5>🏸</div><div class="text-base-content/30 text-sm" data-v-c2ba51b5>พร้อมใช้งาน</div></div></div>`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
        if (queuedListingGames.value.length > 0) {
          _push(`<div class="shrink-0 flex items-center gap-3 px-3 py-2 bg-warning/10 rounded-xl border border-warning/20 overflow-x-auto" data-v-c2ba51b5><div class="flex items-center gap-1.5 shrink-0" data-v-c2ba51b5><span class="text-sm" data-v-c2ba51b5>📋</span><span class="text-xs font-bold text-warning" data-v-c2ba51b5>รอเล่น</span></div><!--[-->`);
          ssrRenderList(queuedListingGames.value, (game) => {
            _push(`<div class="flex items-center gap-2 px-3 py-1.5 bg-warning/10 rounded-lg border border-warning/15 shrink-0" data-v-c2ba51b5><span class="text-[10px] font-bold text-warning/60" data-v-c2ba51b5>#${ssrInterpolate(game.game_number)}</span>`);
            if (game.court_number) {
              _push(`<span class="text-[9px] font-bold text-warning/40 bg-warning/10 px-1 rounded" data-v-c2ba51b5>🏟️${ssrInterpolate(game.court_number)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<div class="flex items-center gap-1" data-v-c2ba51b5><!--[-->`);
            ssrRenderList(teamPlayers(game, "team1"), (p) => {
              var _a2;
              _push(ssrRenderComponent(_sfc_main$1, {
                src: (_a2 = p.user) == null ? void 0 : _a2.avatar,
                name: displayName(p),
                size: "sm",
                rounded: "full"
              }, null, _parent));
            });
            _push(`<!--]--></div><span class="text-xs text-warning/40 font-bold" data-v-c2ba51b5>vs</span><div class="flex items-center gap-1" data-v-c2ba51b5><!--[-->`);
            ssrRenderList(teamPlayers(game, "team2"), (p) => {
              var _a2;
              _push(ssrRenderComponent(_sfc_main$1, {
                src: (_a2 = p.user) == null ? void 0 : _a2.avatar,
                name: displayName(p),
                size: "sm",
                rounded: "full"
              }, null, _parent));
            });
            _push(`<!--]--></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (currentScreen.value === "waiting") {
        _push(`<div class="absolute inset-0 p-4 flex flex-col" data-v-c2ba51b5><div class="flex items-center justify-between mb-3" data-v-c2ba51b5><div class="flex items-center gap-2" data-v-c2ba51b5><span class="text-2xl" data-v-c2ba51b5>⏳</span><span class="text-xl font-bold text-accent" data-v-c2ba51b5>สถานะผู้เล่น</span></div><div class="text-sm text-base-content/40" data-v-c2ba51b5> เวลาเฉลี่ยต่อเกม: <span class="text-accent font-bold" data-v-c2ba51b5>${ssrInterpolate(avgGameDuration.value)} นาที</span></div></div><div class="flex-1 overflow-hidden flex flex-col gap-3" data-v-c2ba51b5>`);
        if (listingPlayers.value.length > 0) {
          _push(`<div data-v-c2ba51b5><div class="flex items-center gap-2 mb-2" data-v-c2ba51b5><span class="text-sm" data-v-c2ba51b5>📋</span><span class="text-sm font-bold text-warning" data-v-c2ba51b5>รอลงสนาม (${ssrInterpolate(listingPlayers.value.length)})</span></div><div class="grid grid-cols-2 gap-x-6 gap-y-1.5" data-v-c2ba51b5><!--[-->`);
          ssrRenderList(listingPlayers.value, (player) => {
            _push(`<div class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-warning/10 border border-warning/20" data-v-c2ba51b5><div class="w-7 h-7 rounded-full bg-warning/20 flex items-center justify-center shrink-0" data-v-c2ba51b5><span class="text-xs" data-v-c2ba51b5>📋</span></div>`);
            _push(ssrRenderComponent(_sfc_main$1, {
              src: player.avatar,
              name: player.display_name || player.name,
              size: "md",
              rounded: "full"
            }, null, _parent));
            _push(`<div class="flex-1 min-w-0" data-v-c2ba51b5><div class="text-base font-semibold text-base-content truncate" data-v-c2ba51b5>${ssrInterpolate(player.display_name || player.name)}</div><div class="text-xs text-warning/70" data-v-c2ba51b5> Game #${ssrInterpolate(player.game_number)} · ${ssrInterpolate(player.court_number ? `Court ${player.court_number}` : "รอกำหนดสนาม")}</div></div><div class="text-right shrink-0" data-v-c2ba51b5><div class="text-xs font-bold text-warning" data-v-c2ba51b5>กำลังจะเล่น</div>`);
            if (estimatedMinutesUntilCourtFree.value > 0) {
              _push(`<div class="text-[10px] text-warning/60" data-v-c2ba51b5> ~${ssrInterpolate(estimatedMinutesUntilCourtFree.value)} นาที </div>`);
            } else {
              _push(`<div class="text-[10px] text-success/60" data-v-c2ba51b5>พร้อมเล่น</div>`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (sortedReadyPlayers.value.length > 0) {
          _push(`<div class="flex-1 overflow-hidden" data-v-c2ba51b5><div class="flex items-center gap-2 mb-2" data-v-c2ba51b5><span class="text-sm" data-v-c2ba51b5>⏳</span><span class="text-sm font-bold text-accent" data-v-c2ba51b5>รอคิว (${ssrInterpolate(sortedReadyPlayers.value.length)})</span></div><div class="grid grid-cols-2 gap-x-6 gap-y-1.5 content-start overflow-hidden" data-v-c2ba51b5><!--[-->`);
          ssrRenderList(sortedReadyPlayers.value, (player, index) => {
            _push(`<div class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-base-300/20 border border-base-content/5" data-v-c2ba51b5><div class="w-7 h-7 rounded-full bg-base-content/10 flex items-center justify-center text-xs font-bold text-base-content/50 shrink-0" data-v-c2ba51b5>${ssrInterpolate(index + 1)}</div>`);
            _push(ssrRenderComponent(_sfc_main$1, {
              src: player.avatar,
              name: player.display_name || player.name,
              size: "md",
              rounded: "full"
            }, null, _parent));
            _push(`<div class="flex-1 min-w-0" data-v-c2ba51b5><div class="text-base font-semibold text-base-content truncate" data-v-c2ba51b5>${ssrInterpolate(player.display_name || player.name)}</div><div class="text-xs text-base-content/40" data-v-c2ba51b5> เล่นแล้ว ${ssrInterpolate(player.finished_games_count)} เกม · รอ ${ssrInterpolate(formatWaitTime(player.waiting_time))}</div></div><div class="text-right shrink-0" data-v-c2ba51b5>`);
            if (player.current_game) {
              _push(`<!--[--><div class="text-xs text-warning/50" data-v-c2ba51b5>ลีสแล้ว</div><div class="text-sm font-bold text-warning" data-v-c2ba51b5>Game #${ssrInterpolate(player.current_game.game_number || "?")}</div><!--]-->`);
            } else {
              _push(`<div class="text-xs text-base-content/20" data-v-c2ba51b5>รอจัดเกม</div>`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (breakPlayers.value.length > 0) {
          _push(`<div class="pt-2 border-t border-base-content/10" data-v-c2ba51b5><div class="flex items-center gap-2 mb-2" data-v-c2ba51b5><span class="text-sm" data-v-c2ba51b5>☕</span><span class="text-sm font-bold text-base-content/40" data-v-c2ba51b5>พักผ่อน (${ssrInterpolate(breakPlayers.value.length)})</span></div><div class="flex gap-3 flex-wrap" data-v-c2ba51b5><!--[-->`);
          ssrRenderList(breakPlayers.value, (p) => {
            _push(`<div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-base-300/20 border border-base-content/5" data-v-c2ba51b5>`);
            _push(ssrRenderComponent(_sfc_main$1, {
              src: p.avatar,
              name: p.display_name || p.name,
              size: "sm",
              rounded: "full",
              class: "opacity-50"
            }, null, _parent));
            _push(`<span class="text-sm text-base-content/40" data-v-c2ba51b5>${ssrInterpolate(p.display_name || p.name)}</span><span class="text-[10px] text-base-content/20" data-v-c2ba51b5>☕</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (listingPlayers.value.length === 0 && sortedReadyPlayers.value.length === 0 && breakPlayers.value.length === 0) {
          _push(`<div class="flex-1 flex items-center justify-center" data-v-c2ba51b5><div class="text-center" data-v-c2ba51b5><div class="text-5xl mb-3 opacity-20" data-v-c2ba51b5>🏸</div><div class="text-lg text-base-content/30" data-v-c2ba51b5>ทุกคนกำลังเล่นอยู่!</div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PartyTV.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PartyTV = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c2ba51b5"]]);
export {
  PartyTV as default
};
