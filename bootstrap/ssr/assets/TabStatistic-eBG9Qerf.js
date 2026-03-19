import { ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./UserAvatar-Dwoh2ac-.js";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
const _sfc_main = {
  __name: "TabStatistic",
  __ssrInlineRender: true,
  props: {
    games: { type: Array, required: true },
    party: { type: Object, required: true }
  },
  setup(__props) {
    const statsTab = ref("games");
    const { t } = useLocale();
    const pairSearch = ref("");
    const props = __props;
    const isTeam1 = (team) => team === "team1" || team === 1;
    const isTeam2 = (team) => team === "team2" || team === 2;
    const hasTeam = (team) => isTeam1(team) || isTeam2(team);
    const sameTeam = (t1, t2) => isTeam1(t1) && isTeam1(t2) || isTeam2(t1) && isTeam2(t2);
    const finishedGames = computed(() => props.games.filter((g) => g.status === "finished"));
    computed(() => {
      const map = {};
      if (props.party.members) {
        props.party.members.forEach((m) => {
          map[m.user_id] = m;
        });
      }
      return map;
    });
    const playerStats = computed(() => {
      const stats = {};
      finishedGames.value.forEach((game) => {
        var _a;
        if (!game.game_players || !((_a = game.game_sets) == null ? void 0 : _a.length)) return;
        game.game_players.forEach((player) => {
          var _a2, _b;
          const uid = player.user_id;
          if (!stats[uid]) {
            stats[uid] = {
              user_id: uid,
              name: player.display_name || ((_a2 = player.user) == null ? void 0 : _a2.name) || "Unknown",
              avatar: (_b = player.user) == null ? void 0 : _b.avatar,
              games: 0,
              sets: 0,
              wins: 0,
              losses: 0,
              totalSeconds: 0,
              teammates: {},
              opponents: {}
            };
          }
          stats[uid].games++;
          if (game.game_start_date && game.game_end_date) {
            const dur = Math.floor((new Date(game.game_end_date) - new Date(game.game_start_date)) / 1e3);
            if (dur > 0) stats[uid].totalSeconds += dur;
          }
          if (hasTeam(player.team)) {
            game.game_sets.forEach((s) => {
              if (!s.winning_team) return;
              stats[uid].sets++;
              if (isTeam1(player.team) && s.winning_team === "team1" || isTeam2(player.team) && s.winning_team === "team2") {
                stats[uid].wins++;
              } else {
                stats[uid].losses++;
              }
            });
          }
          game.game_players.forEach((other) => {
            if (other.user_id === uid) return;
            if (hasTeam(player.team) && hasTeam(other.team)) {
              if (sameTeam(player.team, other.team)) {
                stats[uid].teammates[other.user_id] = (stats[uid].teammates[other.user_id] || 0) + 1;
              } else {
                stats[uid].opponents[other.user_id] = (stats[uid].opponents[other.user_id] || 0) + 1;
              }
            }
          });
        });
      });
      return Object.values(stats).sort((a, b) => b.sets - a.sets);
    });
    const playerStatsByDuration = computed(() => {
      return [...playerStats.value].sort((a, b) => b.totalSeconds - a.totalSeconds);
    });
    const formatPlayTime = (seconds) => {
      if (!seconds) return "0 น.";
      const h = Math.floor(seconds / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      if (h > 0) return `${h} ชม. ${m} น.`;
      return `${m} น.`;
    };
    const formatAvgTime = (seconds, games) => {
      if (!games || !seconds) return "-";
      return formatPlayTime(Math.floor(seconds / games));
    };
    const estimateCalories = (seconds) => {
      if (!seconds) return 0;
      return Math.round(seconds / 60 * 7);
    };
    const mvp = computed(() => {
      const eligible = playerStats.value.filter((p) => p.sets >= 3);
      if (!eligible.length) return null;
      return eligible.reduce((best, p) => {
        const rate = p.sets > 0 ? p.wins / p.sets : 0;
        const bestRate = best.sets > 0 ? best.wins / best.sets : 0;
        return rate > bestRate ? p : best;
      });
    });
    const summary = computed(() => {
      const totalShuttlecocks = props.games.reduce((sum, g) => {
        var _a;
        return sum + (((_a = g.shuttlecocks) == null ? void 0 : _a.reduce((s, sc) => s + sc.quantity, 0)) || 0);
      }, 0);
      const durations = finishedGames.value.filter((g) => g.game_start_date && g.game_end_date).map((g) => {
        const start = new Date(g.game_start_date);
        const end = new Date(g.game_end_date);
        return Math.floor((end - start) / 1e3);
      }).filter((d) => d > 0);
      const avgDuration = durations.length > 0 ? Math.floor(durations.reduce((s, d) => s + d, 0) / durations.length) : 0;
      return {
        totalGames: props.games.length,
        finishedGames: finishedGames.value.length,
        totalShuttlecocks,
        avgDurationMinutes: Math.floor(avgDuration / 60)
      };
    });
    const headToHead = computed(() => {
      const pairs = {};
      finishedGames.value.forEach((game) => {
        if (!game.game_players) return;
        const team1Players = game.game_players.filter((p) => isTeam1(p.team));
        const team2Players = game.game_players.filter((p) => isTeam2(p.team));
        team1Players.forEach((p1) => {
          team2Players.forEach((p2) => {
            var _a, _b, _c, _d;
            const key = [p1.user_id, p2.user_id].sort().join("-");
            if (!pairs[key]) {
              pairs[key] = {
                player1: { user_id: p1.user_id, name: p1.display_name || ((_a = p1.user) == null ? void 0 : _a.name), avatar: (_b = p1.user) == null ? void 0 : _b.avatar },
                player2: { user_id: p2.user_id, name: p2.display_name || ((_c = p2.user) == null ? void 0 : _c.name), avatar: (_d = p2.user) == null ? void 0 : _d.avatar },
                count: 0
              };
            }
            pairs[key].count++;
          });
        });
      });
      return Object.values(pairs).sort((a, b) => b.count - a.count);
    });
    const teammates = computed(() => {
      const pairs = {};
      finishedGames.value.forEach((game) => {
        if (!game.game_players) return;
        const team1Players = game.game_players.filter((p) => isTeam1(p.team));
        const team2Players = game.game_players.filter((p) => isTeam2(p.team));
        [team1Players, team2Players].forEach((teamPlayers) => {
          var _a, _b, _c, _d;
          for (let i = 0; i < teamPlayers.length; i++) {
            for (let j = i + 1; j < teamPlayers.length; j++) {
              const p1 = teamPlayers[i];
              const p2 = teamPlayers[j];
              const key = [p1.user_id, p2.user_id].sort().join("-");
              if (!pairs[key]) {
                pairs[key] = {
                  player1: { user_id: p1.user_id, name: p1.display_name || ((_a = p1.user) == null ? void 0 : _a.name), avatar: (_b = p1.user) == null ? void 0 : _b.avatar },
                  player2: { user_id: p2.user_id, name: p2.display_name || ((_c = p2.user) == null ? void 0 : _c.name), avatar: (_d = p2.user) == null ? void 0 : _d.avatar },
                  count: 0
                };
              }
              pairs[key].count++;
            }
          }
        });
      });
      return Object.values(pairs).sort((a, b) => b.count - a.count);
    });
    const matchesSearch = (pair) => {
      if (!pairSearch.value.trim()) return true;
      const q = pairSearch.value.toLowerCase();
      return (pair.player1.name || "").toLowerCase().includes(q) || (pair.player2.name || "").toLowerCase().includes(q);
    };
    const filteredHeadToHead = computed(() => headToHead.value.filter(matchesSearch));
    const filteredTeammates = computed(() => teammates.value.filter(matchesSearch));
    const winRate = (player) => {
      if (player.sets === 0) return 0;
      return Math.round(player.wins / player.sets * 100);
    };
    const formatDuration = (minutes) => {
      if (minutes < 1) return "-";
      if (minutes >= 60) return `${Math.floor(minutes / 60)} ชม. ${minutes % 60} น.`;
      return `${minutes} น.`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="grid grid-cols-2 sm:grid-cols-4 gap-3"><div class="bg-base-100 rounded-2xl border border-base-300 p-4 text-center"><div class="text-2xl font-black text-primary">${ssrInterpolate(summary.value.totalGames)}</div><div class="text-xs text-base-content/50 mt-1">${ssrInterpolate(unref(t)("stats.totalGames"))}</div></div><div class="bg-base-100 rounded-2xl border border-base-300 p-4 text-center"><div class="text-2xl font-black text-success">${ssrInterpolate(summary.value.finishedGames)}</div><div class="text-xs text-base-content/50 mt-1">${ssrInterpolate(unref(t)("stats.finished"))}</div></div><div class="bg-base-100 rounded-2xl border border-base-300 p-4 text-center"><div class="text-2xl font-black text-warning">${ssrInterpolate(summary.value.totalShuttlecocks)}</div><div class="text-xs text-base-content/50 mt-1">${ssrInterpolate(unref(t)("stats.shuttlecocks"))}</div></div><div class="bg-base-100 rounded-2xl border border-base-300 p-4 text-center"><div class="text-2xl font-black text-info">${ssrInterpolate(formatDuration(summary.value.avgDurationMinutes))}</div><div class="text-xs text-base-content/50 mt-1">${ssrInterpolate(unref(t)("stats.avgTime"))}</div></div></div>`);
      if (mvp.value) {
        _push(`<div class="bg-gradient-to-r from-warning/10 to-warning/5 rounded-2xl border border-warning/30 p-4"><div class="flex items-center gap-3"><div class="relative">`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: mvp.value.avatar,
          name: mvp.value.name,
          size: "xl",
          rounded: "full",
          class: "border-2 border-warning"
        }, null, _parent));
        _push(`<span class="absolute -top-1 -right-1 text-lg">👑</span></div><div class="flex-1"><div class="text-xs font-bold text-warning uppercase tracking-wider">MVP</div><div class="text-base font-bold text-base-content">${ssrInterpolate(mvp.value.name)}</div><div class="text-xs text-base-content/60 mt-0.5">${ssrInterpolate(mvp.value.wins)}W ${ssrInterpolate(mvp.value.losses)}L · ${ssrInterpolate(winRate(mvp.value))}% · ${ssrInterpolate(mvp.value.games)} เกม ${ssrInterpolate(mvp.value.sets)} เซ็ต </div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (playerStats.value.length > 0) {
        _push(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><div class="flex items-center justify-between"><h3 class="text-base font-bold text-base-content m-0">${ssrInterpolate(unref(t)("stats.playerStats"))}</h3><div class="flex gap-1 p-0.5 bg-base-200 rounded-lg"><button class="${ssrRenderClass([statsTab.value === "games" ? "bg-primary text-white" : "bg-transparent text-base-content/50 hover:text-base-content", "px-2.5 py-1 rounded-md text-[10px] font-semibold border-0 cursor-pointer transition-all"])}">${ssrInterpolate(unref(t)("stats.tabGames"))}</button><button class="${ssrRenderClass([statsTab.value === "duration" ? "bg-primary text-white" : "bg-transparent text-base-content/50 hover:text-base-content", "px-2.5 py-1 rounded-md text-[10px] font-semibold border-0 cursor-pointer transition-all"])}">${ssrInterpolate(unref(t)("stats.tabDuration"))}</button></div></div></div><div style="${ssrRenderStyle(statsTab.value === "games" ? null : { display: "none" })}" class="overflow-x-auto"><table class="table table-sm w-full"><thead><tr class="text-xs text-base-content/50"><th class="pl-4">#</th><th>${ssrInterpolate(unref(t)("stats.player"))}</th><th class="text-center">เซ็ต</th><th class="text-center">${ssrInterpolate(unref(t)("stats.wins"))}</th><th class="text-center">${ssrInterpolate(unref(t)("stats.losses"))}</th><th class="text-center">Win%</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(playerStats.value, (player, index) => {
          _push(`<tr class="hover"><td class="pl-4 text-xs text-base-content/50">${ssrInterpolate(index + 1)}</td><td><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_sfc_main$1, {
            src: player.avatar,
            name: player.name,
            size: "sm",
            rounded: "full"
          }, null, _parent));
          _push(`<div class="min-w-0"><span class="text-sm font-medium text-base-content truncate block max-w-[7rem]">${ssrInterpolate(player.name)}</span><span class="text-[9px] text-base-content/40">${ssrInterpolate(player.games)} เกม</span></div></div></td><td class="text-center text-sm font-semibold">${ssrInterpolate(player.sets)}</td><td class="text-center text-sm text-success font-semibold">${ssrInterpolate(player.wins)}</td><td class="text-center text-sm text-error font-semibold">${ssrInterpolate(player.losses)}</td><td class="text-center"><div class="flex items-center justify-center gap-1"><div class="w-12 h-1.5 bg-base-200 rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full" style="${ssrRenderStyle({ width: winRate(player) + "%" })}"></div></div><span class="text-xs font-bold text-base-content/70">${ssrInterpolate(winRate(player))}%</span></div></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div style="${ssrRenderStyle(statsTab.value === "duration" ? null : { display: "none" })}" class="overflow-x-auto"><table class="table table-sm w-full"><thead><tr class="text-xs text-base-content/50"><th class="pl-4">#</th><th>${ssrInterpolate(unref(t)("stats.player"))}</th><th class="text-center">${ssrInterpolate(unref(t)("stats.playTime"))}</th><th class="text-center">${ssrInterpolate(unref(t)("stats.avgPerGame"))}</th><th class="text-center">เกม</th><th class="text-center">🔥 ${ssrInterpolate(unref(t)("stats.calories"))}</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(playerStatsByDuration.value, (player, index) => {
          _push(`<tr class="hover"><td class="pl-4 text-xs text-base-content/50">${ssrInterpolate(index + 1)}</td><td><div class="flex items-center gap-2">`);
          _push(ssrRenderComponent(_sfc_main$1, {
            src: player.avatar,
            name: player.name,
            size: "sm",
            rounded: "full"
          }, null, _parent));
          _push(`<span class="text-sm font-medium text-base-content truncate max-w-[8rem]">${ssrInterpolate(player.name)}</span></div></td><td class="text-center text-sm font-semibold text-primary">${ssrInterpolate(formatPlayTime(player.totalSeconds))}</td><td class="text-center text-xs text-base-content/60">${ssrInterpolate(formatAvgTime(player.totalSeconds, player.games))}</td><td class="text-center text-sm font-semibold">${ssrInterpolate(player.games)}</td><td class="text-center"><span class="text-xs font-bold text-orange-500">${ssrInterpolate(estimateCalories(player.totalSeconds))}</span><span class="text-[9px] text-base-content/40 ml-0.5">kcal</span></td></tr>`);
        });
        _push(`<!--]--></tbody></table></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (headToHead.value.length > 0 || teammates.value.length > 0) {
        _push(`<div class="mb-1"><input${ssrRenderAttr("value", pairSearch.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("common.search") + "...")} class="w-full px-3 py-2 rounded-xl border border-base-300 bg-base-100 text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-hidden transition-all"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (filteredHeadToHead.value.length > 0) {
        _push(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><h3 class="text-base font-bold text-base-content m-0">${ssrInterpolate(unref(t)("stats.headToHead"))} <span class="text-sm font-normal text-base-content/50">(${ssrInterpolate(filteredHeadToHead.value.length)})</span></h3></div><div class="divide-y divide-base-200"><!--[-->`);
        ssrRenderList(filteredHeadToHead.value, (pair, index) => {
          _push(`<div class="flex items-center gap-3 px-4 py-2.5"><div class="flex items-center gap-1.5 flex-1 min-w-0">`);
          _push(ssrRenderComponent(_sfc_main$1, {
            src: pair.player1.avatar,
            name: pair.player1.name,
            size: "sm",
            rounded: "full"
          }, null, _parent));
          _push(`<span class="text-sm text-base-content truncate">${ssrInterpolate((pair.player1.name || "").split(" ")[0])}</span></div><div class="shrink-0 flex items-center gap-1"><span class="text-[10px] font-black text-base-content/30">VS</span><span class="${ssrRenderClass([pair.count >= 4 ? "badge-error" : pair.count >= 3 ? "badge-warning" : pair.count >= 2 ? "badge-info" : "badge-ghost", "badge badge-sm font-bold"])}">${ssrInterpolate(pair.count)}x</span></div><div class="flex items-center gap-1.5 flex-1 min-w-0 justify-end"><span class="text-sm text-base-content truncate">${ssrInterpolate((pair.player2.name || "").split(" ")[0])}</span>`);
          _push(ssrRenderComponent(_sfc_main$1, {
            src: pair.player2.avatar,
            name: pair.player2.name,
            size: "sm",
            rounded: "full"
          }, null, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (filteredTeammates.value.length > 0) {
        _push(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><h3 class="text-base font-bold text-base-content m-0">${ssrInterpolate(unref(t)("stats.teammates"))} <span class="text-sm font-normal text-base-content/50">(${ssrInterpolate(filteredTeammates.value.length)})</span></h3></div><div class="divide-y divide-base-200"><!--[-->`);
        ssrRenderList(filteredTeammates.value, (pair, index) => {
          _push(`<div class="flex items-center gap-3 px-4 py-2.5"><div class="flex items-center gap-1.5 flex-1 min-w-0">`);
          _push(ssrRenderComponent(_sfc_main$1, {
            src: pair.player1.avatar,
            name: pair.player1.name,
            size: "sm",
            rounded: "full"
          }, null, _parent));
          _push(`<span class="text-sm text-base-content truncate">${ssrInterpolate((pair.player1.name || "").split(" ")[0])}</span></div><div class="shrink-0 flex items-center gap-1"><span class="text-[10px]">🤝</span><span class="${ssrRenderClass([pair.count >= 4 ? "badge-error" : pair.count >= 3 ? "badge-warning" : pair.count >= 2 ? "badge-info" : "badge-ghost", "badge badge-sm font-bold"])}">${ssrInterpolate(pair.count)}x</span></div><div class="flex items-center gap-1.5 flex-1 min-w-0 justify-end"><span class="text-sm text-base-content truncate">${ssrInterpolate((pair.player2.name || "").split(" ")[0])}</span>`);
          _push(ssrRenderComponent(_sfc_main$1, {
            src: pair.player2.avatar,
            name: pair.player2.name,
            size: "sm",
            rounded: "full"
          }, null, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (finishedGames.value.length === 0) {
        _push(`<div class="text-center py-10 bg-base-100 rounded-2xl border border-base-300"><span class="text-4xl">📊</span><p class="text-sm text-base-content/50 mt-3 m-0">${ssrInterpolate(unref(t)("stats.noGames"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Party/TabStatistic.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
