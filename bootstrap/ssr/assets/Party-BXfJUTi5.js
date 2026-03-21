import { computed, ref, watch, mergeProps, useSSRContext, reactive, onMounted, onUnmounted, unref, withCtx, createVNode, withDirectives, createBlock, createCommentVNode, createTextVNode, toDisplayString, openBlock, Fragment, renderList, vShow, vModelText } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderStyle } from "vue/server-renderer";
import { _ as _sfc_main$4 } from "./AppLayout-BPNdCb7L.js";
import { _ as _sfc_main$3 } from "./UserAvatar-Dwoh2ac-.js";
import Game from "./Game2-eQPJvbed.js";
import _sfc_main$5 from "./TabGame-DWKvZjfx.js";
import _sfc_main$6 from "./TabInfo-tm5HWKDI.js";
import _sfc_main$7 from "./TabPlayer-Cl_uewuY.js";
import _sfc_main$8 from "./TabStatistic-DlROu_vy.js";
import { usePage, Head, router } from "@inertiajs/vue3";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import axios from "axios";
import { u as useConfirm } from "./useConfirm-CffLghyV.js";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import { Realtime } from "ably";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./useDragDrop-NuEBXaBA.js";
import "./shuttlecock-DGGeeBau.js";
const _sfc_main$2 = {
  __name: "EndPartyDialog",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean, default: false },
    party: { type: Object, required: true },
    games: { type: Array, default: () => [] },
    costSummary: { type: Object, default: () => ({}) }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    var _a, _b;
    const props = __props;
    const isOver = computed(() => props.party.status === "Over");
    const courtCostPerHour = ref(props.party.cost_amount || ((_a = props.party.court) == null ? void 0 : _a.play_price) || 0);
    const playHours = ref(props.party.play_hours || 0);
    const shuttleCostPerUnit = ref(props.party.shuttlecock_cost || 0);
    const shuttlecockUsed = ref(((_b = props.costSummary) == null ? void 0 : _b.shuttlecock_used) || 0);
    const submitting = ref(false);
    const players = ref([]);
    const initPlayers = () => {
      const finishedGames = props.games.filter((g) => g.status === "finished");
      players.value = (props.party.members || []).map((m) => {
        var _a2, _b2;
        let gamesPlayed = 0;
        let totalSeconds = 0;
        finishedGames.forEach((game) => {
          var _a3;
          const gp = (_a3 = game.game_players) == null ? void 0 : _a3.find((p) => p.user_id === m.user_id);
          if (gp) {
            gamesPlayed++;
            if (game.game_start_date && game.game_end_date) {
              const dur = Math.floor((new Date(game.game_end_date) - new Date(game.game_start_date)) / 1e3);
              if (dur > 0) totalSeconds += dur;
            }
          }
        });
        return {
          user_id: m.user_id,
          name: m.display_name || ((_a2 = m.user) == null ? void 0 : _a2.name) || "Unknown",
          avatar: (_b2 = m.user) == null ? void 0 : _b2.avatar,
          games: gamesPlayed,
          totalSeconds,
          fixed: false,
          customAmount: 0
        };
      });
    };
    watch(() => props.show, (val) => {
      if (val) initPlayers();
    });
    const courtCostTotal = computed(() => courtCostPerHour.value * playHours.value);
    const shuttleCostTotal = computed(() => shuttleCostPerUnit.value * shuttlecockUsed.value);
    const totalCost = computed(() => courtCostTotal.value + shuttleCostTotal.value);
    const fixedTotal = computed(
      () => players.value.filter((p) => p.fixed).reduce((sum, p) => sum + Number(p.customAmount || 0), 0)
    );
    const unfixedPlayers = computed(() => players.value.filter((p) => !p.fixed));
    const remainingAmount = computed(() => totalCost.value - fixedTotal.value);
    const perUnfixedPerson = computed(() => {
      const count = unfixedPlayers.value.length;
      return count > 0 ? Math.max(0, remainingAmount.value / count) : 0;
    });
    const playerAmount = (p) => {
      if (p.fixed) return Math.max(0, Number(p.customAmount || 0));
      return perUnfixedPerson.value;
    };
    const totalAssigned = computed(
      () => players.value.reduce((sum, p) => sum + playerAmount(p), 0)
    );
    const formatMinutes = (seconds) => {
      if (!seconds) return "0 นาที";
      const m = Math.floor(seconds / 60);
      return `${m} นาที`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-end sm:items-center justify-center" }, _attrs))}><div class="fixed inset-0 bg-black/60"></div><div class="relative bg-base-100 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto z-10"><div class="sticky top-0 bg-base-100 px-4 py-3 border-b border-base-200 flex items-center justify-between z-10"><div class="text-base font-bold text-base-content">${ssrInterpolate(isOver.value ? "💰 สรุปค่าใช้จ่าย" : "🏁 จบปาร์ตี้ & สรุปค่าใช้จ่าย")}</div><button class="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center border-0 cursor-pointer hover:bg-base-300">✕</button></div><div class="p-4 pb-24 space-y-4"><div class="bg-base-200/50 rounded-xl p-3 space-y-3"><div class="text-xs font-bold text-base-content/60 uppercase">ค่าใช้จ่าย</div><div class="grid grid-cols-2 gap-3"><div><label class="text-[10px] text-base-content/50 mb-0.5 block">ค่าคอร์ท/ชม. (฿)</label><input type="number"${ssrRenderAttr("value", courtCostPerHour.value)} min="0" class="input input-bordered input-sm w-full"></div><div><label class="text-[10px] text-base-content/50 mb-0.5 block">จำนวนชั่วโมง</label><input type="number"${ssrRenderAttr("value", playHours.value)} min="0" step="0.5" class="input input-bordered input-sm w-full"></div><div><label class="text-[10px] text-base-content/50 mb-0.5 block">ราคาลูก/ลูก (฿)</label><input type="number"${ssrRenderAttr("value", shuttleCostPerUnit.value)} min="0" class="input input-bordered input-sm w-full"></div><div><label class="text-[10px] text-base-content/50 mb-0.5 block">ลูกแบดที่ใช้</label><input type="number"${ssrRenderAttr("value", shuttlecockUsed.value)} min="0" class="input input-bordered input-sm w-full"></div></div><div class="flex items-center justify-between pt-2 border-t border-base-300"><div class="text-xs text-base-content/50"> คอร์ท ฿${ssrInterpolate(courtCostTotal.value.toLocaleString())} + ลูกแบด ฿${ssrInterpolate(shuttleCostTotal.value.toLocaleString())}</div><div class="text-sm font-black text-primary">รวม ฿${ssrInterpolate(totalCost.value.toLocaleString())}</div></div></div><div><div class="flex items-center justify-between mb-2"><div class="text-xs font-bold text-base-content/60 uppercase">รายชื่อผู้เล่น (${ssrInterpolate(players.value.length)})</div><div class="text-[10px] text-base-content/40">กด 📌 เพื่อ fix ราคา</div></div><div class="space-y-1.5"><!--[-->`);
        ssrRenderList(players.value, (p) => {
          _push(`<div class="${ssrRenderClass([p.fixed ? "border-warning/50 bg-warning/5" : "border-base-300", "bg-base-100 rounded-xl border p-2.5 flex items-center gap-2"])}">`);
          _push(ssrRenderComponent(_sfc_main$3, {
            src: p.avatar,
            name: p.name,
            size: "sm",
            rounded: "full"
          }, null, _parent));
          _push(`<div class="flex-1 min-w-0"><div class="text-xs font-bold text-base-content truncate">${ssrInterpolate(p.name)}</div><div class="text-[9px] text-base-content/40">${ssrInterpolate(p.games)} เกม · ${ssrInterpolate(formatMinutes(p.totalSeconds))}</div></div><button class="${ssrRenderClass([p.fixed ? "bg-warning/20 text-warning" : "bg-base-200 text-base-content/30 hover:bg-base-300", "w-7 h-7 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-all text-sm"])}"${ssrRenderAttr("title", p.fixed ? "ปลด fix" : "Fix ราคา")}>📌</button><div class="w-20 shrink-0">`);
          if (p.fixed) {
            _push(`<input type="number"${ssrRenderAttr("value", p.customAmount)} min="0" class="input input-bordered input-sm w-full text-right text-xs font-bold text-warning">`);
          } else {
            _push(`<div class="text-right text-sm font-bold text-primary"> ฿${ssrInterpolate(Math.ceil(perUnfixedPerson.value).toLocaleString())}</div>`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div><div class="bg-primary/10 rounded-xl p-3 flex items-center justify-between"><div><div class="text-xs font-bold text-primary">💰 รวมทั้งหมด</div><div class="text-[10px] text-base-content/40">ส่งสรุปรายบุคคลเข้า LINE</div></div><div class="text-xl font-black text-primary">฿${ssrInterpolate(Math.ceil(totalAssigned.value).toLocaleString())}</div></div><div class="flex gap-2"><button class="flex-1 h-10 rounded-xl text-sm font-semibold bg-base-200 text-base-content/70 border-0 cursor-pointer hover:bg-base-300 transition-colors">${ssrInterpolate(isOver.value ? "ปิด" : "ยกเลิก")}</button>`);
        if (!isOver.value) {
          _push(`<button${ssrIncludeBooleanAttr(submitting.value || totalCost.value <= 0) ? " disabled" : ""} class="flex-1 h-10 rounded-xl text-sm font-bold bg-error text-white border-0 cursor-pointer hover:bg-error/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1">`);
          if (submitting.value) {
            _push(`<span class="loading loading-spinner loading-xs"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` 🏁 จบปาร์ตี้ </button>`);
        } else {
          _push(`<!---->`);
        }
        if (isOver.value) {
          _push(`<button${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""} class="flex-1 h-10 rounded-xl text-sm font-bold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1">`);
          if (submitting.value) {
            _push(`<span class="loading loading-spinner loading-xs"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` 📨 ส่งสรุปเข้า LINE </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/EndPartyDialog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "DuplicatePartyDialog",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean, default: false },
    party: { type: Object, required: true }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const getNextWeekDate = () => {
      const d = /* @__PURE__ */ new Date(props.party.play_date + "T00:00:00");
      d.setDate(d.getDate() + 7);
      return d.toISOString().split("T")[0];
    };
    const playDate = ref(getNextWeekDate());
    const submitting = ref(false);
    const members = ref([]);
    const initMembers = () => {
      const partyMembers = props.party.members || [];
      members.value = partyMembers.map((m) => {
        var _a, _b;
        return {
          user_id: m.user_id,
          name: m.display_name || ((_a = m.user) == null ? void 0 : _a.name) || "Unknown",
          avatar: (_b = m.user) == null ? void 0 : _b.avatar,
          role: m.role,
          selected: true
          // all selected by default
        };
      });
    };
    watch(() => props.show, (val) => {
      if (val) {
        playDate.value = getNextWeekDate();
        initMembers();
      }
    });
    const selectedCount = computed(() => members.value.filter((m) => m.selected).length);
    const dayLabel = computed(() => {
      if (!playDate.value) return "";
      const d = /* @__PURE__ */ new Date(playDate.value + "T00:00:00");
      const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
      return `วัน${days[d.getDay()]}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-end sm:items-center justify-center" }, _attrs))}><div class="fixed inset-0 bg-black/60"></div><div class="relative bg-base-100 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto z-10"><div class="sticky top-0 bg-base-100 px-4 py-3 border-b border-base-200 flex items-center justify-between z-10"><div class="text-base font-bold text-base-content">🔄 ตั้งตี้ใหม่จากก๊วนเดิม</div><button class="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center border-0 cursor-pointer hover:bg-base-300">✕</button></div><div class="p-4 pb-24 space-y-4"><div class="bg-base-200/50 rounded-xl p-3 space-y-1"><div class="text-xs font-bold text-base-content">${ssrInterpolate(__props.party.name || ((_a = __props.party.court) == null ? void 0 : _a.name))}</div><div class="text-[10px] text-base-content/50"> 🏟️ ${ssrInterpolate((_b = __props.party.court) == null ? void 0 : _b.name)} · ${ssrInterpolate((_c = __props.party.start_time) == null ? void 0 : _c.substring(0, 5))}-${ssrInterpolate((_d = __props.party.end_time) == null ? void 0 : _d.substring(0, 5))} · ${ssrInterpolate(__props.party.play_hours)} ชม. </div><div class="text-[10px] text-base-content/50"> 💰 ${ssrInterpolate(__props.party.cost_type === "free" ? "ฟรี" : __props.party.cost_type === "per_person" ? `รายหัว ฿${__props.party.cost_amount}` : `หารเท่า ฿${__props.party.cost_amount}/ชม.`)} ${ssrInterpolate(__props.party.shuttlecock_cost ? ` · ลูก ฿${__props.party.shuttlecock_cost}` : "")}</div></div><div><label class="text-xs font-semibold text-base-content mb-1 block">📅 วันเล่นใหม่</label><input type="date"${ssrRenderAttr("value", playDate.value)} class="input input-bordered input-sm w-full">`);
        if (dayLabel.value) {
          _push(`<div class="text-[10px] text-primary font-medium mt-0.5">${ssrInterpolate(dayLabel.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><div class="flex items-center justify-between mb-2"><div class="text-xs font-bold text-base-content/60 uppercase">เลือกผู้เล่น (${ssrInterpolate(selectedCount.value)}/${ssrInterpolate(members.value.length)})</div><button class="text-[10px] text-primary font-semibold border-0 bg-transparent cursor-pointer">${ssrInterpolate(members.value.every((m) => m.selected) ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด")}</button></div><div class="space-y-1.5"><!--[-->`);
        ssrRenderList(members.value, (m) => {
          _push(`<div class="${ssrRenderClass([m.selected ? "border-primary/40 bg-primary/5" : "border-base-300 bg-base-100 opacity-50", "flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all"])}"><input type="checkbox"${ssrIncludeBooleanAttr(m.selected) ? " checked" : ""} class="checkbox checkbox-primary checkbox-xs">`);
          _push(ssrRenderComponent(_sfc_main$3, {
            src: m.avatar,
            name: m.name,
            size: "sm",
            rounded: "full"
          }, null, _parent));
          _push(`<div class="flex-1 min-w-0"><div class="text-xs font-bold text-base-content truncate">${ssrInterpolate(m.name)}</div>`);
          if (m.role === "Host") {
            _push(`<div class="text-[9px] text-primary font-bold">HOST</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div></div><div class="flex gap-2"><button class="flex-1 h-10 rounded-xl text-sm font-semibold bg-base-200 text-base-content/70 border-0 cursor-pointer hover:bg-base-300 transition-colors">ยกเลิก</button><button${ssrIncludeBooleanAttr(submitting.value || !playDate.value || selectedCount.value === 0) ? " disabled" : ""} class="flex-1 h-10 rounded-xl text-sm font-bold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1">`);
        if (submitting.value) {
          _push(`<span class="loading loading-spinner loading-xs"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` 🔄 สร้างปาร์ตี้ใหม่ </button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/DuplicatePartyDialog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const crown = "/build/assets/crown-Mvpo2eNi.png";
const _sfc_main = {
  __name: "Party",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const { confirm } = useConfirm();
    const { t } = useLocale();
    const page = usePage();
    const props = ref(page.props);
    const data = reactive({
      game_type: "quadruple",
      status: "setting",
      initial_shuttlecock_game: 0
    });
    const party = ref("");
    const games = ref([]);
    const visibleTop = ref(false);
    const activeTab = ref("game");
    const game_data = reactive({
      game_id: "",
      party_member_id: "",
      ready_คน: []
    });
    party.value = page.props.party;
    games.value = page.props.games;
    const costSummary = page.props.costSummary || {};
    const showEndParty = ref(false);
    const showDuplicate = ref(false);
    const sharePartyLink = async () => {
      var _a, _b, _c;
      const baseUrl = window.location.origin;
      const partyName = party.value.name || ((_a = party.value.court) == null ? void 0 : _a.name) || "ปาร์ตี้";
      let token = party.value.invite_token;
      if (!token) {
        try {
          const res = await axios.post(`/party/${party.value.id}/generate-invite`);
          token = res.data.token;
          party.value.invite_token = token;
        } catch (e) {
        }
      }
      const url = token ? `${baseUrl}/party/${party.value.id}/invite/${token}` : `${baseUrl}/party/${party.value.id}`;
      const text = `🏸 ${partyName}
📅 ${party.value.play_date} ⏰ ${(_b = party.value.start_time) == null ? void 0 : _b.substring(0, 5)}-${(_c = party.value.end_time) == null ? void 0 : _c.substring(0, 5)}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: partyName, text, url });
          return;
        } catch (e) {
        }
      }
      try {
        await navigator.clipboard.writeText(`${text}
${url}`);
        toast.add({ severity: "success", summary: "คัดลอกลิงก์แล้ว", life: 2e3 });
      } catch (e) {
        toast.add({ severity: "error", summary: "คัดลอกไม่สำเร็จ", life: 2e3 });
      }
    };
    data.party_id = party.value.id;
    game_data.party_id = party.value.id;
    const settingGame = page.props.games.find((sc) => sc.status === "setting") ?? null;
    const visibleGameId = ref(settingGame ? settingGame.id : null);
    const game_players = ref(settingGame ? settingGame.game_players : []);
    ref(0);
    const visible = ref(false);
    const setScoreGame = ref({});
    const sets = ref([
      {
        set_number: 1,
        team1_start_side: "north",
        team2_start_side: "south",
        team1_score: 0,
        team2_score: 0,
        winning_team: null
      }
    ]);
    const showCrown = (index, team) => {
      const set = sets.value[index];
      if (!set) return false;
      if (team === "team1" && set.team1_score > set.team2_score) return true;
      if (team === "team2" && set.team2_score > set.team1_score) return true;
      return false;
    };
    const setWins = computed(() => {
      let t1 = 0, t2 = 0;
      sets.value.forEach((s) => {
        if (s.team1_score > s.team2_score) t1++;
        else if (s.team2_score > s.team1_score) t2++;
      });
      return { t1, t2 };
    });
    const addNewSet = (overrides = {}) => {
      let newSet = {
        set_number: sets.value.length + 1,
        team1_start_side: sets.value.length > 0 ? sets.value[sets.value.length - 1].team1_start_side === "south" ? "north" : "south" : "north",
        team2_start_side: sets.value.length > 0 ? sets.value[sets.value.length - 1].team2_start_side === "south" ? "north" : "south" : "south",
        team1_score: 0,
        team2_score: 0,
        winning_team: null,
        ...overrides
      };
      sets.value.push(newSet);
    };
    const removeNewSet = () => {
      confirm({
        message: t("confirm.deleteSet"),
        header: t("common.confirm"),
        accept: () => {
          if (sets.value.length > 1) {
            toast.add({ severity: "success", summary: "ลบเกมเซ็ต", detail: `ลบรายการลงผลเกม เซ็ตที่ ${sets.value.length} แล้ว`, life: 3e3 });
            sets.value.pop();
          } else {
            toast.add({ severity: "error", summary: "ลบเกมเซ็ต", detail: "เหลือรายการเดียวแล้ว", life: 3e3 });
          }
        },
        reject: () => {
          toast.add({ severity: "info", summary: "ยกเลิก", detail: "ยกเลิกการลบแล้ว", life: 3e3 });
        }
      });
    };
    const originalSets = ref(null);
    const openPosition = (pos, game) => {
      setScoreGame.value = game;
      originalSets.value = JSON.parse(JSON.stringify(game.game_sets));
      sets.value = JSON.parse(JSON.stringify(game.game_sets));
      visible.value = true;
    };
    const closeScoreModal = () => {
      var _a;
      if (((_a = setScoreGame.value) == null ? void 0 : _a.game_sets) && originalSets.value) {
        setScoreGame.value.game_sets = originalSets.value;
      }
      visible.value = false;
      setScoreGame.value = {};
      originalSets.value = null;
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
            toast.add({ severity: "success", summary: "Name Updated", detail: "ตั้งค่าชื่อเรียกใน Party เรียบร้อยแล้ว.", life: 3e3 });
            party.value = response.props.party;
          },
          onError: () => {
            toast.add({ severity: "error", summary: "Update Failed", detail: "ตั้งค่าชื่อเรียกไม่สำเร็จ โปรดลองอีกครั้ง.", life: 3e3 });
          }
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
          }
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
            var _a;
            game_data.game_id = gameId;
            games.value = res.props.games;
            visibleGameId.value = gameId;
            fetchReadyPlayer(gameId);
            thisGame.value = games.value.find((sc) => sc.id == gameId);
            game_players.value = thisGame.value.game_players;
            if (((_a = res.props.flash.success) == null ? void 0 : _a.length) > 0) {
              toast.add({ severity: "success", summary: "จัดผู้เล่น", detail: `ระบบได้จัดผู้เล่นที่เหมาะสมลงเกมแล้ว โปรดปรับเปลี่ยน`, life: 3e3 });
            }
          },
          onError: (err) => {
            if (err.notInSetting) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "เกมนี้ไม่ได้อยู่ในสถานะตั้งค่า", life: 3e3 });
            if (err.gameIsFull) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีผู้เล่นในเกมนี้ครบจำนวนแล้ว", life: 3e3 });
          }
        }
      );
    };
    const listGame = (gameId) => {
      confirm({
        message: t("confirm.listGame"),
        header: t("confirm.listGameHeader"),
        accept: () => {
          router.post(
            `/games/${gameId}/list`,
            { team1_start_side: "north" },
            {
              preserveScroll: true,
              headers: { Accept: "application/json" },
              onSuccess: (res) => {
                var _a;
                game_data.game_id = gameId;
                games.value = res.props.games;
                fetchReadyPlayer(gameId);
                thisGame.value = games.value.find((sc) => sc.id == gameId);
                game_players.value = thisGame.value.game_players;
                if (((_a = res.props.flash.success) == null ? void 0 : _a.length) > 0) {
                  toast.add({ severity: "success", summary: "สำเร็จ", detail: `ลีสเกมลงรายการรอเล่นแล้ว`, life: 3e3 });
                }
              },
              onError: (err) => {
                if (err.notEnoughPlayers) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีผู้เล่นในเกมไม่ครบจำนวน", life: 3e3 });
                if (err.notInSetting) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "ลีสเกมได้เฉพาะเกมที่อยู่ในสถานะตั้งค่า", life: 3e3 });
              }
            }
          );
        },
        reject: () => {
          toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected game listing", life: 3e3 });
        }
      });
    };
    const doStartGame = (gameId) => {
      router.post(
        `/games/${gameId}/start`,
        { visibleGameId: data.initial_shuttlecock_game },
        {
          preserveScroll: true,
          headers: { Accept: "application/json" },
          onSuccess: (res) => {
            var _a, _b, _c;
            const flashErr = (_b = (_a = res.props) == null ? void 0 : _a.flash) == null ? void 0 : _b.error;
            if (flashErr) {
              if (flashErr.notInListing) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "เริ่มเกมได้เฉพาะเกมที่มีสถานะลีสรายการ", life: 3e3 });
              if (flashErr.playerPlaying) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีผู้เล่นบางคนกำลังเล่นในเกมอื่นอยู่ โปรดจบเกมนั้นก่อน", life: 5e3 });
              if (flashErr.courtRequired) toast.add({ severity: "error", summary: t("game.court"), detail: t("game.courtRequired"), life: 3e3 });
              games.value = res.props.games;
              return;
            }
            game_data.game_id = gameId;
            games.value = res.props.games;
            fetchReadyPlayer(gameId);
            thisGame.value = games.value.find((sc) => sc.id == gameId);
            game_players.value = (_c = thisGame.value) == null ? void 0 : _c.game_players;
            toast.add({ severity: "success", summary: "สำเร็จ", detail: "เกมเริ่มต้นแล้ว", life: 3e3 });
          },
          onError: (err) => {
            if (err.notInListing) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "เริ่มเกมได้เฉพาะเกมที่มีสถานะลีสรายการ", life: 3e3 });
            if (err.playerPlaying) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "มีผู้เล่นบางคนกำลังเล่นในเกมอื่นอยู่ โปรดจบเกมนั้นก่อน", life: 3e3 });
            if (err.courtRequired) toast.add({ severity: "error", summary: t("game.court"), detail: t("game.courtRequired"), life: 3e3 });
          }
        }
      );
    };
    const startGame = (gameId, skipConfirm = false) => {
      if (skipConfirm) {
        doStartGame(gameId);
        return;
      }
      confirm({
        message: t("confirm.startGame"),
        header: t("confirm.startGameHeader"),
        accept: () => doStartGame(gameId)
      });
    };
    const finishGame = (gameId) => {
      confirm({
        message: t("confirm.finishGame"),
        header: t("confirm.finishGameHeader"),
        accept: () => {
          router.post(
            `/games/${gameId}/finish`,
            {},
            {
              preserveScroll: true,
              headers: { Accept: "application/json" },
              onSuccess: (res) => {
                var _a;
                game_data.game_id = gameId;
                games.value = res.props.games;
                fetchReadyPlayer(gameId);
                thisGame.value = games.value.find((sc) => sc.id == gameId);
                game_players.value = thisGame.value.game_players;
                props.value = res.props;
                if (((_a = res.props.flash.success) == null ? void 0 : _a.length) > 0) {
                  toast.add({ severity: "success", summary: "จบเกม", detail: `จบเกมเรียบร้อยแล้ว`, life: 3e3 });
                }
              },
              onError: (err) => {
                if (err.notInPlaying) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "เกมต้องกำลังเล่นจึงกดจบเกมได้", life: 3e3 });
              }
            }
          );
        },
        reject: () => {
          toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected finishing the game", life: 3e3 });
        }
      });
    };
    const deleteGame = (gameId) => {
      confirm({
        message: t("confirm.deleteGame"),
        header: t("confirm.deleteGameHeader"),
        accept: () => {
          router.post(
            `/games/${gameId}/delete`,
            {},
            {
              preserveScroll: true,
              headers: { Accept: "application/json" },
              onSuccess: (res) => {
                var _a;
                game_data.game_id = "";
                games.value = res.props.games;
                if (((_a = res.props.flash.success) == null ? void 0 : _a.length) > 0) {
                  toast.add({ severity: "warn", summary: "ลบเกม", detail: `ลบเกมเรียบร้อยแล้ว`, life: 3e3 });
                }
              },
              onError: (err) => {
                if (err.onlyOnSettingOrListing) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "ลบเกมได้เฉพาะขณะตั้งค่าหรือลีสเกมเท่านั้น", life: 3e3 });
              }
            }
          );
        },
        reject: () => {
          toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected deleting the game", life: 3e3 });
        }
      });
    };
    const addShuttlecock = (gameId) => {
      confirm({
        message: t("confirm.addShuttlecock"),
        header: t("confirm.addShuttlecockHeader"),
        accept: () => {
          router.post(
            `/games/${gameId}/add-shuttlecock`,
            { quantity: 1 },
            {
              preserveScroll: true,
              headers: { Accept: "application/json" },
              onSuccess: (res) => {
                games.value = res.props.games;
                toast.add({ severity: "success", summary: "Confirmed", detail: "1 shuttlecock has been added to the game", life: 3e3 });
              },
              onError: (err) => {
                if (err.finishedGame) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "ไม่สามารถเพิ่มลูกขนไก่ได้หลังจบเกม", life: 3e3 });
              }
            }
          );
        },
        reject: () => {
          toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected adding shuttlecock", life: 3e3 });
        }
      });
    };
    const returnShuttlecock = (gameId) => {
      confirm({
        message: t("confirm.returnShuttlecock"),
        header: t("confirm.returnShuttlecockHeader"),
        accept: () => {
          router.post(
            `/games/${gameId}/return-shuttlecocks`,
            { quantity: 1 },
            {
              preserveScroll: true,
              headers: { Accept: "application/json" },
              onSuccess: (res) => {
                games.value = res.props.games;
                toast.add({ severity: "success", summary: "Confirmed", detail: "1 shuttlecock has been returned", life: 3e3 });
              },
              onError: (err) => {
                if (err.shuttlecocksIsZero) toast.add({ severity: "error", summary: "ล้มเหลว", detail: "จำนวนลูกขนไก่เป็นศูนย์แล้ว", life: 3e3 });
              }
            }
          );
        },
        reject: () => {
          toast.add({ severity: "error", summary: "Rejected", detail: "You have rejected returning shuttlecock", life: 3e3 });
        }
      });
    };
    const enterScore = (gameId) => {
      confirm({
        message: t("confirm.saveScore"),
        header: t("confirm.saveScoreHeader"),
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
                toast.add({ severity: "success", summary: "บันทึกผลการแข่ง", detail: "ลงผลการแข่งของท่าน เรียบร้อยแล้ว", life: 3e3 });
              },
              onError: () => {
                toast.add({ severity: "error", summary: "ล้มเหลว", detail: "การลงผลล้มเหลว โปรดลองอีกครั้ง", life: 3e3 });
              }
            }
          );
        },
        reject: () => {
          toast.add({ severity: "info", summary: "Cancelled", detail: "You cancelled updating the game sets.", life: 3e3 });
        }
      });
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
            activeTab.value = "game";
          },
          onError: (err) => {
            console.log(err);
          }
        }
      );
      visibleTop.value = false;
    };
    computed(() => {
      return Array.isArray(game_data.ready_คน) ? [...game_data.ready_คน].sort((a, b) => b.waiting_time - a.waiting_time) : [];
    });
    const tabs = computed(() => {
      var _a, _b, _c;
      return [
        { key: "game", label: t("party.tabGame"), icon: "🏸", count: ((_a = games.value) == null ? void 0 : _a.length) || 0 },
        { key: "info", label: t("party.tabInfo"), icon: "ℹ️" },
        { key: "player", label: t("party.tabPlayer"), icon: "👥", count: ((_c = (_b = party.value) == null ? void 0 : _b.members) == null ? void 0 : _c.length) || 0 },
        { key: "stats", label: t("party.tabStats"), icon: "📊" }
      ];
    });
    let ablyInstance = null;
    let partyChannel = null;
    const handlePartyEvent = (message) => {
      var _a, _b, _c;
      const isOwnEvent = ((_a = message.data) == null ? void 0 : _a.user_id) === page.props.auth.user.id;
      if (!isOwnEvent && ((_b = message.data) == null ? void 0 : _b.message) && ((_c = message.data) == null ? void 0 : _c.user_name)) {
        toast.add({
          severity: "info",
          summary: message.data.user_name,
          detail: message.data.message,
          life: 4e3
        });
      }
      router.reload({
        preserveScroll: true,
        only: ["games", "party", "readyPlayers", "playingPlayers", "breakPlayers", "costSummary"],
        onSuccess: (res) => {
          games.value = res.props.games;
          party.value = res.props.party;
        }
      });
    };
    onMounted(() => {
      const ablyKey = page.props.ably_key;
      if (ablyKey) {
        ablyInstance = new Realtime({
          key: ablyKey,
          clientId: `${page.props.auth.user.id}`
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Party" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$4, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            _push2(`<div class="mb-4" data-v-7cbc89fa${_scopeId}><div class="flex items-center justify-between mb-3" data-v-7cbc89fa${_scopeId}><div data-v-7cbc89fa${_scopeId}><div class="text-base font-bold text-base-content m-0 leading-tight" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(party.value.name || ((_a = party.value.court) == null ? void 0 : _a.name) || "Party")} <span class="text-xs font-normal text-base-content/50" data-v-7cbc89fa${_scopeId}>#${ssrInterpolate(party.value.id)}</span></div>`);
            if (party.value.name && ((_b = party.value.court) == null ? void 0 : _b.name)) {
              _push2(`<p class="text-[10px] text-base-content/40 m-0" data-v-7cbc89fa${_scopeId}>🏟️ ${ssrInterpolate(party.value.court.name)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<p class="text-xs text-base-content/60 m-0 mt-0.5" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(party.value.play_date)} · ${ssrInterpolate((_c = party.value.start_time) == null ? void 0 : _c.substring(0, 5))} - ${ssrInterpolate((_d = party.value.end_time) == null ? void 0 : _d.substring(0, 5))}</p></div><div class="flex items-center gap-2" data-v-7cbc89fa${_scopeId}>`);
            if (party.value.creator_id === ((_e = unref(page).props.auth.user) == null ? void 0 : _e.id)) {
              _push2(`<button class="w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer" title="ลิงก์เชิญ" data-v-7cbc89fa${_scopeId}><span class="text-sm" data-v-7cbc89fa${_scopeId}>🔗</span></button>`);
            } else {
              _push2(`<!---->`);
            }
            if (party.value.status !== "Over") {
              _push2(`<a${ssrRenderAttr("href", `/party/${party.value.id}/tv`)} target="_blank" class="w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer" title="TV Dashboard" data-v-7cbc89fa${_scopeId}><span class="text-sm" data-v-7cbc89fa${_scopeId}>📺</span></a>`);
            } else {
              _push2(`<!---->`);
            }
            if (party.value.status === "Over") {
              _push2(`<button class="w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer" title="ตั้งตี้ใหม่" data-v-7cbc89fa${_scopeId}><span class="text-sm" data-v-7cbc89fa${_scopeId}>🔄</span></button>`);
            } else {
              _push2(`<!---->`);
            }
            if (party.value.status !== "Over") {
              _push2(`<button class="h-8 px-3 flex items-center gap-1 rounded-lg bg-error/10 hover:bg-error/20 text-error text-xs font-medium border-0 cursor-pointer transition-colors active:scale-[0.98] whitespace-nowrap shrink-0" data-v-7cbc89fa${_scopeId}><span data-v-7cbc89fa${_scopeId}>🏁</span><span data-v-7cbc89fa${_scopeId}>จบปาร์ตี้</span></button>`);
            } else {
              _push2(`<!---->`);
            }
            if (party.value.status === "Over") {
              _push2(`<button class="h-8 px-3 flex items-center gap-1 rounded-lg bg-info/10 hover:bg-info/20 text-info text-xs font-medium border-0 cursor-pointer transition-colors active:scale-[0.98] whitespace-nowrap shrink-0" data-v-7cbc89fa${_scopeId}><span data-v-7cbc89fa${_scopeId}>💰</span><span data-v-7cbc89fa${_scopeId}>สรุปค่าใช้จ่าย</span></button>`);
            } else {
              _push2(`<!---->`);
            }
            if (party.value.status !== "Over") {
              _push2(`<button class="h-8 px-3 flex items-center gap-1 rounded-lg bg-primary hover:bg-primary/80 text-white text-xs font-medium border-0 cursor-pointer transition-colors active:scale-[0.98] whitespace-nowrap shrink-0" data-v-7cbc89fa${_scopeId}><span data-v-7cbc89fa${_scopeId}>+</span><span data-v-7cbc89fa${_scopeId}>${ssrInterpolate(unref(t)("party.newGame"))}</span></button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div></div><div class="${ssrRenderClass([{ "drawer-open-custom": visibleTop.value }, "drawer drawer-end"])}" data-v-7cbc89fa${_scopeId}>`);
            if (visibleTop.value) {
              _push2(`<div class="fixed inset-0 bg-black/50 z-40" data-v-7cbc89fa${_scopeId}></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="${ssrRenderClass([visibleTop.value ? "translate-y-0" : "-translate-y-full", "fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-lg transition-transform duration-300"])}" style="${ssrRenderStyle({ "max-height": "90vh" })}" data-v-7cbc89fa${_scopeId}><div class="flex items-center gap-2 p-3 border-b border-base-300" data-v-7cbc89fa${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$3, {
              src: _ctx.$page.props.auth.user.avatar,
              name: _ctx.$page.props.auth.user.name,
              size: "sm",
              rounded: "full"
            }, null, _parent2, _scopeId));
            _push2(`<span class="font-bold" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(unref(t)("party.gameMaking"))}</span><button class="btn btn-sm btn-ghost ml-auto" data-v-7cbc89fa${_scopeId}>✕</button></div><div class="overflow-y-auto" style="${ssrRenderStyle({ "max-height": "calc(90vh - 3.5rem)" })}" data-v-7cbc89fa${_scopeId}><div class="p-3" data-v-7cbc89fa${_scopeId}>`);
            _push2(ssrRenderComponent(Game, {
              data: _ctx.$page.props,
              onGameCreated: partyReload
            }, null, _parent2, _scopeId));
            _push2(`</div></div></div></div><dialog class="${ssrRenderClass([{ "modal-open": visible.value }, "modal"])}" data-v-7cbc89fa${_scopeId}><div class="modal-box w-[95vw] max-w-[28rem] p-0" data-v-7cbc89fa${_scopeId}><div class="flex items-center justify-between px-4 pt-4 pb-2" data-v-7cbc89fa${_scopeId}><div class="flex items-center gap-2" data-v-7cbc89fa${_scopeId}><div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center" data-v-7cbc89fa${_scopeId}><span class="text-base" data-v-7cbc89fa${_scopeId}>🏸</span></div><h2 class="text-base font-bold text-base-content m-0" data-v-7cbc89fa${_scopeId}>บันทึกผลการแข่งขัน</h2></div><button class="w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors" data-v-7cbc89fa${_scopeId}><span class="text-base-content/60 text-sm" data-v-7cbc89fa${_scopeId}>✕</span></button></div><div class="px-4 pb-2" data-v-7cbc89fa${_scopeId}><div class="flex items-center justify-center gap-3 mb-3 py-2" data-v-7cbc89fa${_scopeId}><span class="text-sm font-bold text-base-content/60" data-v-7cbc89fa${_scopeId}>Team 1</span><div class="flex items-center gap-1" data-v-7cbc89fa${_scopeId}><span class="${ssrRenderClass([setWins.value.t1 > setWins.value.t2 ? "text-warning" : "text-base-content/40", "text-2xl font-black"])}" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(setWins.value.t1)}</span><span class="text-lg text-base-content/30 font-bold" data-v-7cbc89fa${_scopeId}>:</span><span class="${ssrRenderClass([setWins.value.t2 > setWins.value.t1 ? "text-warning" : "text-base-content/40", "text-2xl font-black"])}" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(setWins.value.t2)}</span></div><span class="text-sm font-bold text-base-content/60" data-v-7cbc89fa${_scopeId}>Team 2</span></div><!--[-->`);
            ssrRenderList(sets.value, (set, index) => {
              var _a2, _b2;
              _push2(`<div class="mb-4" data-v-7cbc89fa${_scopeId}><div class="flex items-center justify-center mb-3" data-v-7cbc89fa${_scopeId}><span class="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider" data-v-7cbc89fa${_scopeId}> Set ${ssrInterpolate(index + 1)}</span></div><div class="grid grid-cols-2 gap-2" data-v-7cbc89fa${_scopeId}><div class="${ssrRenderClass([showCrown(index, "team1") ? "bg-warning/10 border border-warning/30" : "bg-base-200 border border-base-300", "rounded-xl p-3 text-center relative transition-colors"])}" data-v-7cbc89fa${_scopeId}><img style="${ssrRenderStyle(showCrown(index, "team1") ? null : { display: "none" })}"${ssrRenderAttr("src", unref(crown))} class="w-8 h-8 absolute -top-3 -left-1 -rotate-[25deg]" alt="" data-v-7cbc89fa${_scopeId}><p class="text-[10px] text-base-content/50 font-bold uppercase tracking-wider m-0 mb-2" data-v-7cbc89fa${_scopeId}>Team 1</p><div class="flex justify-center gap-1.5 mb-3" data-v-7cbc89fa${_scopeId}><!--[-->`);
              ssrRenderList((_a2 = setScoreGame.value.game_players) == null ? void 0 : _a2.filter((p) => p.team === "team1" || p.team === 1), (player) => {
                var _a3, _b3, _c2;
                _push2(`<div class="text-center" data-v-7cbc89fa${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$3, {
                  src: (_a3 = player.user) == null ? void 0 : _a3.avatar,
                  name: player.display_name || ((_b3 = player.user) == null ? void 0 : _b3.name),
                  size: "lg",
                  rounded: "xl",
                  class: "border-2 border-white"
                }, null, _parent2, _scopeId));
                _push2(`<p class="text-[9px] text-base-content/60 m-0 mt-0.5 truncate max-w-[3.5rem]" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(player.display_name || ((_c2 = player.user) == null ? void 0 : _c2.name))}</p></div>`);
              });
              _push2(`<!--]--></div><div class="flex items-center justify-center gap-2 mb-2" data-v-7cbc89fa${_scopeId}><button type="button" class="w-9 h-9 rounded-lg bg-error/10 text-error border-0 cursor-pointer font-bold text-lg hover:bg-error/20 transition-colors" data-v-7cbc89fa${_scopeId}>-</button><div class="${ssrRenderClass([showCrown(index, "team1") ? "text-warning" : "text-base-content/80", "text-3xl font-black min-w-[2.5rem]"])}" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(set.team1_score)}</div><button type="button" class="w-9 h-9 rounded-lg bg-primary/10 text-primary border-0 cursor-pointer font-bold text-lg hover:bg-primary/20 transition-colors" data-v-7cbc89fa${_scopeId}>+</button></div><div class="flex justify-center gap-1.5 mb-2" data-v-7cbc89fa${_scopeId}><button type="button" class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors" data-v-7cbc89fa${_scopeId}>รีเซ็ต</button><button type="button" class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors" data-v-7cbc89fa${_scopeId}>21 แต้ม</button></div><div class="px-1" data-v-7cbc89fa${_scopeId}><input type="range"${ssrRenderAttr("min", 0)}${ssrRenderAttr("max", 30)}${ssrRenderAttr("value", set.team1_score)} class="range range-primary range-sm w-full" data-v-7cbc89fa${_scopeId}></div></div><div class="${ssrRenderClass([showCrown(index, "team2") ? "bg-warning/10 border border-warning/30" : "bg-base-200 border border-base-300", "rounded-xl p-3 text-center relative transition-colors"])}" data-v-7cbc89fa${_scopeId}><img style="${ssrRenderStyle(showCrown(index, "team2") ? null : { display: "none" })}"${ssrRenderAttr("src", unref(crown))} class="w-8 h-8 absolute -top-3 -right-1 rotate-[25deg]" alt="" data-v-7cbc89fa${_scopeId}><p class="text-[10px] text-base-content/50 font-bold uppercase tracking-wider m-0 mb-2" data-v-7cbc89fa${_scopeId}>Team 2</p><div class="flex justify-center gap-1.5 mb-3" data-v-7cbc89fa${_scopeId}><!--[-->`);
              ssrRenderList((_b2 = setScoreGame.value.game_players) == null ? void 0 : _b2.filter((p) => p.team === "team2" || p.team === 2), (player) => {
                var _a3, _b3, _c2;
                _push2(`<div class="text-center" data-v-7cbc89fa${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$3, {
                  src: (_a3 = player.user) == null ? void 0 : _a3.avatar,
                  name: player.display_name || ((_b3 = player.user) == null ? void 0 : _b3.name),
                  size: "lg",
                  rounded: "xl",
                  class: "border-2 border-white"
                }, null, _parent2, _scopeId));
                _push2(`<p class="text-[9px] text-base-content/60 m-0 mt-0.5 truncate max-w-[3.5rem]" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(player.display_name || ((_c2 = player.user) == null ? void 0 : _c2.name))}</p></div>`);
              });
              _push2(`<!--]--></div><div class="flex items-center justify-center gap-2 mb-2" data-v-7cbc89fa${_scopeId}><button type="button" class="w-9 h-9 rounded-lg bg-error/10 text-error border-0 cursor-pointer font-bold text-lg hover:bg-error/20 transition-colors" data-v-7cbc89fa${_scopeId}>-</button><div class="${ssrRenderClass([showCrown(index, "team2") ? "text-warning" : "text-base-content/80", "text-3xl font-black min-w-[2.5rem]"])}" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(set.team2_score)}</div><button type="button" class="w-9 h-9 rounded-lg bg-primary/10 text-primary border-0 cursor-pointer font-bold text-lg hover:bg-primary/20 transition-colors" data-v-7cbc89fa${_scopeId}>+</button></div><div class="flex justify-center gap-1.5 mb-2" data-v-7cbc89fa${_scopeId}><button type="button" class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors" data-v-7cbc89fa${_scopeId}>รีเซ็ต</button><button type="button" class="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors" data-v-7cbc89fa${_scopeId}>21 แต้ม</button></div><div class="px-1" data-v-7cbc89fa${_scopeId}><input type="range"${ssrRenderAttr("min", 0)}${ssrRenderAttr("max", 30)}${ssrRenderAttr("value", set.team2_score)} class="range range-primary range-sm w-full" data-v-7cbc89fa${_scopeId}></div></div></div>`);
              if (index < sets.value.length - 1) {
                _push2(`<div class="flex items-center gap-3 my-3" data-v-7cbc89fa${_scopeId}><div class="flex-1 h-px bg-base-300" data-v-7cbc89fa${_scopeId}></div><div class="flex-1 h-px bg-base-300" data-v-7cbc89fa${_scopeId}></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]--></div><div class="flex items-center justify-center gap-2 px-4 pb-3" data-v-7cbc89fa${_scopeId}><button type="button" class="h-8 px-4 rounded-lg text-xs font-semibold bg-primary/5 text-primary border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors" data-v-7cbc89fa${_scopeId}> + เพิ่ม Set ${ssrInterpolate(sets.value.length + 1)}</button><button style="${ssrRenderStyle(sets.value.length > 1 ? null : { display: "none" })}" type="button" class="h-8 px-4 rounded-lg text-xs font-semibold bg-error/10 text-error border border-error/20 cursor-pointer hover:bg-error/20 transition-colors" data-v-7cbc89fa${_scopeId}> - ลบ Set </button></div><div class="flex gap-2 px-4 pb-4" data-v-7cbc89fa${_scopeId}><button type="button" class="flex-1 h-10 rounded-xl text-sm font-medium bg-base-200 text-base-content/80 border-0 cursor-pointer hover:bg-base-300 transition-colors" data-v-7cbc89fa${_scopeId}>${ssrInterpolate(unref(t)("common.cancel"))}</button><button type="button" class="flex-1 h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98]" data-v-7cbc89fa${_scopeId}> ✓ ${ssrInterpolate(unref(t)("common.save"))}</button></div></div><form method="dialog" class="modal-backdrop" data-v-7cbc89fa${_scopeId}><button data-v-7cbc89fa${_scopeId}>close</button></form></dialog><div class="flex gap-1 p-1 bg-base-200 rounded-xl mb-4" data-v-7cbc89fa${_scopeId}><!--[-->`);
            ssrRenderList(tabs.value, (tab) => {
              _push2(`<button class="${ssrRenderClass([activeTab.value === tab.key ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50 hover:text-base-content hover:bg-base-300/50", "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border-0"])}" data-v-7cbc89fa${_scopeId}><span data-v-7cbc89fa${_scopeId}>${ssrInterpolate(tab.icon)}</span><span data-v-7cbc89fa${_scopeId}>${ssrInterpolate(tab.label)}</span>`);
              if (tab.count != null) {
                _push2(`<span class="text-[10px] opacity-70" data-v-7cbc89fa${_scopeId}>(${ssrInterpolate(tab.count)})</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</button>`);
            });
            _push2(`<!--]--></div><div style="${ssrRenderStyle(activeTab.value === "game" ? null : { display: "none" })}" data-v-7cbc89fa${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$5, {
              games: games.value,
              party: party.value,
              readyPlayers: game_data.ready_คน,
              onListGame: listGame,
              onStartGame: (gameId, skipConfirm) => startGame(gameId, skipConfirm),
              onFinishGame: finishGame,
              onDeleteGame: deleteGame,
              onAutoAddPlayers: autoAddPlayers,
              onAddShuttlecock: addShuttlecock,
              onReturnShuttlecock: returnShuttlecock,
              onOpenScore: (game) => openPosition("top", game)
            }, null, _parent2, _scopeId));
            _push2(`</div><div style="${ssrRenderStyle(activeTab.value === "info" ? null : { display: "none" })}" data-v-7cbc89fa${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$6, {
              party: party.value,
              costSummary: unref(costSummary),
              games: games.value
            }, null, _parent2, _scopeId));
            _push2(`</div><div style="${ssrRenderStyle(activeTab.value === "player" ? null : { display: "none" })}" data-v-7cbc89fa${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$7, {
              party: party.value,
              games: games.value,
              friendshipMap: unref(page).props.friendshipMap || {},
              onUpdateDisplayName: updateDisplayName
            }, null, _parent2, _scopeId));
            _push2(`</div><div style="${ssrRenderStyle(activeTab.value === "stats" ? null : { display: "none" })}" data-v-7cbc89fa${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$8, {
              games: games.value,
              party: party.value
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(_sfc_main$1, {
              show: showDuplicate.value,
              party: party.value,
              onClose: ($event) => showDuplicate.value = false
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$2, {
              show: showEndParty.value,
              party: party.value,
              games: games.value,
              costSummary: unref(costSummary),
              onClose: ($event) => showEndParty.value = false
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", { class: "mb-4" }, [
                createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                  createVNode("div", null, [
                    createVNode("div", { class: "text-base font-bold text-base-content m-0 leading-tight" }, [
                      createTextVNode(toDisplayString(party.value.name || ((_f = party.value.court) == null ? void 0 : _f.name) || "Party") + " ", 1),
                      createVNode("span", { class: "text-xs font-normal text-base-content/50" }, "#" + toDisplayString(party.value.id), 1)
                    ]),
                    party.value.name && ((_g = party.value.court) == null ? void 0 : _g.name) ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-[10px] text-base-content/40 m-0"
                    }, "🏟️ " + toDisplayString(party.value.court.name), 1)) : createCommentVNode("", true),
                    createVNode("p", { class: "text-xs text-base-content/60 m-0 mt-0.5" }, toDisplayString(party.value.play_date) + " · " + toDisplayString((_h = party.value.start_time) == null ? void 0 : _h.substring(0, 5)) + " - " + toDisplayString((_i = party.value.end_time) == null ? void 0 : _i.substring(0, 5)), 1)
                  ]),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    party.value.creator_id === ((_j = unref(page).props.auth.user) == null ? void 0 : _j.id) ? (openBlock(), createBlock("button", {
                      key: 0,
                      onClick: sharePartyLink,
                      class: "w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer",
                      title: "ลิงก์เชิญ"
                    }, [
                      createVNode("span", { class: "text-sm" }, "🔗")
                    ])) : createCommentVNode("", true),
                    party.value.status !== "Over" ? (openBlock(), createBlock("a", {
                      key: 1,
                      href: `/party/${party.value.id}/tv`,
                      target: "_blank",
                      class: "w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer",
                      title: "TV Dashboard"
                    }, [
                      createVNode("span", { class: "text-sm" }, "📺")
                    ], 8, ["href"])) : createCommentVNode("", true),
                    party.value.status === "Over" ? (openBlock(), createBlock("button", {
                      key: 2,
                      onClick: ($event) => showDuplicate.value = true,
                      class: "w-9 h-9 flex items-center justify-center rounded-lg border border-base-300 bg-base-100 text-base-content/60 hover:bg-base-200 transition-colors cursor-pointer",
                      title: "ตั้งตี้ใหม่"
                    }, [
                      createVNode("span", { class: "text-sm" }, "🔄")
                    ], 8, ["onClick"])) : createCommentVNode("", true),
                    party.value.status !== "Over" ? (openBlock(), createBlock("button", {
                      key: 3,
                      onClick: ($event) => showEndParty.value = true,
                      class: "h-8 px-3 flex items-center gap-1 rounded-lg bg-error/10 hover:bg-error/20 text-error text-xs font-medium border-0 cursor-pointer transition-colors active:scale-[0.98] whitespace-nowrap shrink-0"
                    }, [
                      createVNode("span", null, "🏁"),
                      createVNode("span", null, "จบปาร์ตี้")
                    ], 8, ["onClick"])) : createCommentVNode("", true),
                    party.value.status === "Over" ? (openBlock(), createBlock("button", {
                      key: 4,
                      onClick: ($event) => showEndParty.value = true,
                      class: "h-8 px-3 flex items-center gap-1 rounded-lg bg-info/10 hover:bg-info/20 text-info text-xs font-medium border-0 cursor-pointer transition-colors active:scale-[0.98] whitespace-nowrap shrink-0"
                    }, [
                      createVNode("span", null, "💰"),
                      createVNode("span", null, "สรุปค่าใช้จ่าย")
                    ], 8, ["onClick"])) : createCommentVNode("", true),
                    party.value.status !== "Over" ? (openBlock(), createBlock("button", {
                      key: 5,
                      onClick: ($event) => visibleTop.value = true,
                      class: "h-8 px-3 flex items-center gap-1 rounded-lg bg-primary hover:bg-primary/80 text-white text-xs font-medium border-0 cursor-pointer transition-colors active:scale-[0.98] whitespace-nowrap shrink-0"
                    }, [
                      createVNode("span", null, "+"),
                      createVNode("span", null, toDisplayString(unref(t)("party.newGame")), 1)
                    ], 8, ["onClick"])) : createCommentVNode("", true)
                  ])
                ])
              ]),
              createVNode("div", {
                class: ["drawer drawer-end", { "drawer-open-custom": visibleTop.value }]
              }, [
                visibleTop.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "fixed inset-0 bg-black/50 z-40",
                  onClick: ($event) => visibleTop.value = false
                }, null, 8, ["onClick"])) : createCommentVNode("", true),
                createVNode("div", {
                  class: ["fixed top-0 left-0 right-0 z-50 bg-base-100 shadow-lg transition-transform duration-300", visibleTop.value ? "translate-y-0" : "-translate-y-full"],
                  style: { "max-height": "90vh" }
                }, [
                  createVNode("div", { class: "flex items-center gap-2 p-3 border-b border-base-300" }, [
                    createVNode(_sfc_main$3, {
                      src: _ctx.$page.props.auth.user.avatar,
                      name: _ctx.$page.props.auth.user.name,
                      size: "sm",
                      rounded: "full"
                    }, null, 8, ["src", "name"]),
                    createVNode("span", { class: "font-bold" }, toDisplayString(unref(t)("party.gameMaking")), 1),
                    createVNode("button", {
                      class: "btn btn-sm btn-ghost ml-auto",
                      onClick: ($event) => visibleTop.value = false
                    }, "✕", 8, ["onClick"])
                  ]),
                  createVNode("div", {
                    class: "overflow-y-auto",
                    style: { "max-height": "calc(90vh - 3.5rem)" }
                  }, [
                    createVNode("div", { class: "p-3" }, [
                      createVNode(Game, {
                        data: _ctx.$page.props,
                        onGameCreated: partyReload
                      }, null, 8, ["data"])
                    ])
                  ])
                ], 2)
              ], 2),
              createVNode("dialog", {
                class: ["modal", { "modal-open": visible.value }]
              }, [
                createVNode("div", { class: "modal-box w-[95vw] max-w-[28rem] p-0" }, [
                  createVNode("div", { class: "flex items-center justify-between px-4 pt-4 pb-2" }, [
                    createVNode("div", { class: "flex items-center gap-2" }, [
                      createVNode("div", { class: "w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center" }, [
                        createVNode("span", { class: "text-base" }, "🏸")
                      ]),
                      createVNode("h2", { class: "text-base font-bold text-base-content m-0" }, "บันทึกผลการแข่งขัน")
                    ]),
                    createVNode("button", {
                      onClick: closeScoreModal,
                      class: "w-8 h-8 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors"
                    }, [
                      createVNode("span", { class: "text-base-content/60 text-sm" }, "✕")
                    ])
                  ]),
                  createVNode("div", { class: "px-4 pb-2" }, [
                    createVNode("div", { class: "flex items-center justify-center gap-3 mb-3 py-2" }, [
                      createVNode("span", { class: "text-sm font-bold text-base-content/60" }, "Team 1"),
                      createVNode("div", { class: "flex items-center gap-1" }, [
                        createVNode("span", {
                          class: ["text-2xl font-black", setWins.value.t1 > setWins.value.t2 ? "text-warning" : "text-base-content/40"]
                        }, toDisplayString(setWins.value.t1), 3),
                        createVNode("span", { class: "text-lg text-base-content/30 font-bold" }, ":"),
                        createVNode("span", {
                          class: ["text-2xl font-black", setWins.value.t2 > setWins.value.t1 ? "text-warning" : "text-base-content/40"]
                        }, toDisplayString(setWins.value.t2), 3)
                      ]),
                      createVNode("span", { class: "text-sm font-bold text-base-content/60" }, "Team 2")
                    ]),
                    (openBlock(true), createBlock(Fragment, null, renderList(sets.value, (set, index) => {
                      var _a2, _b2;
                      return openBlock(), createBlock("div", {
                        key: index,
                        class: "mb-4"
                      }, [
                        createVNode("div", { class: "flex items-center justify-center mb-3" }, [
                          createVNode("span", { class: "px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider" }, " Set " + toDisplayString(index + 1), 1)
                        ]),
                        createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                          createVNode("div", {
                            class: ["rounded-xl p-3 text-center relative transition-colors", showCrown(index, "team1") ? "bg-warning/10 border border-warning/30" : "bg-base-200 border border-base-300"]
                          }, [
                            withDirectives(createVNode("img", {
                              src: unref(crown),
                              class: "w-8 h-8 absolute -top-3 -left-1 -rotate-[25deg]",
                              alt: ""
                            }, null, 8, ["src"]), [
                              [vShow, showCrown(index, "team1")]
                            ]),
                            createVNode("p", { class: "text-[10px] text-base-content/50 font-bold uppercase tracking-wider m-0 mb-2" }, "Team 1"),
                            createVNode("div", { class: "flex justify-center gap-1.5 mb-3" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList((_a2 = setScoreGame.value.game_players) == null ? void 0 : _a2.filter((p) => p.team === "team1" || p.team === 1), (player) => {
                                var _a3, _b3, _c2;
                                return openBlock(), createBlock("div", {
                                  key: player.user.id,
                                  class: "text-center"
                                }, [
                                  createVNode(_sfc_main$3, {
                                    src: (_a3 = player.user) == null ? void 0 : _a3.avatar,
                                    name: player.display_name || ((_b3 = player.user) == null ? void 0 : _b3.name),
                                    size: "lg",
                                    rounded: "xl",
                                    class: "border-2 border-white"
                                  }, null, 8, ["src", "name"]),
                                  createVNode("p", { class: "text-[9px] text-base-content/60 m-0 mt-0.5 truncate max-w-[3.5rem]" }, toDisplayString(player.display_name || ((_c2 = player.user) == null ? void 0 : _c2.name)), 1)
                                ]);
                              }), 128))
                            ]),
                            createVNode("div", { class: "flex items-center justify-center gap-2 mb-2" }, [
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => set.team1_score > 0 ? set.team1_score-- : null,
                                class: "w-9 h-9 rounded-lg bg-error/10 text-error border-0 cursor-pointer font-bold text-lg hover:bg-error/20 transition-colors"
                              }, "-", 8, ["onClick"]),
                              createVNode("div", {
                                class: ["text-3xl font-black min-w-[2.5rem]", showCrown(index, "team1") ? "text-warning" : "text-base-content/80"]
                              }, toDisplayString(set.team1_score), 3),
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => set.team1_score < 30 ? set.team1_score++ : null,
                                class: "w-9 h-9 rounded-lg bg-primary/10 text-primary border-0 cursor-pointer font-bold text-lg hover:bg-primary/20 transition-colors"
                              }, "+", 8, ["onClick"])
                            ]),
                            createVNode("div", { class: "flex justify-center gap-1.5 mb-2" }, [
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => set.team1_score = 0,
                                class: "px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors"
                              }, "รีเซ็ต", 8, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => set.team1_score = 21,
                                class: "px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors"
                              }, "21 แต้ม", 8, ["onClick"])
                            ]),
                            createVNode("div", { class: "px-1" }, [
                              withDirectives(createVNode("input", {
                                type: "range",
                                min: 0,
                                max: 30,
                                "onUpdate:modelValue": ($event) => set.team1_score = $event,
                                class: "range range-primary range-sm w-full"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [
                                  vModelText,
                                  set.team1_score,
                                  void 0,
                                  { number: true }
                                ]
                              ])
                            ])
                          ], 2),
                          createVNode("div", {
                            class: ["rounded-xl p-3 text-center relative transition-colors", showCrown(index, "team2") ? "bg-warning/10 border border-warning/30" : "bg-base-200 border border-base-300"]
                          }, [
                            withDirectives(createVNode("img", {
                              src: unref(crown),
                              class: "w-8 h-8 absolute -top-3 -right-1 rotate-[25deg]",
                              alt: ""
                            }, null, 8, ["src"]), [
                              [vShow, showCrown(index, "team2")]
                            ]),
                            createVNode("p", { class: "text-[10px] text-base-content/50 font-bold uppercase tracking-wider m-0 mb-2" }, "Team 2"),
                            createVNode("div", { class: "flex justify-center gap-1.5 mb-3" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList((_b2 = setScoreGame.value.game_players) == null ? void 0 : _b2.filter((p) => p.team === "team2" || p.team === 2), (player) => {
                                var _a3, _b3, _c2;
                                return openBlock(), createBlock("div", {
                                  key: player.user.id,
                                  class: "text-center"
                                }, [
                                  createVNode(_sfc_main$3, {
                                    src: (_a3 = player.user) == null ? void 0 : _a3.avatar,
                                    name: player.display_name || ((_b3 = player.user) == null ? void 0 : _b3.name),
                                    size: "lg",
                                    rounded: "xl",
                                    class: "border-2 border-white"
                                  }, null, 8, ["src", "name"]),
                                  createVNode("p", { class: "text-[9px] text-base-content/60 m-0 mt-0.5 truncate max-w-[3.5rem]" }, toDisplayString(player.display_name || ((_c2 = player.user) == null ? void 0 : _c2.name)), 1)
                                ]);
                              }), 128))
                            ]),
                            createVNode("div", { class: "flex items-center justify-center gap-2 mb-2" }, [
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => set.team2_score > 0 ? set.team2_score-- : null,
                                class: "w-9 h-9 rounded-lg bg-error/10 text-error border-0 cursor-pointer font-bold text-lg hover:bg-error/20 transition-colors"
                              }, "-", 8, ["onClick"]),
                              createVNode("div", {
                                class: ["text-3xl font-black min-w-[2.5rem]", showCrown(index, "team2") ? "text-warning" : "text-base-content/80"]
                              }, toDisplayString(set.team2_score), 3),
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => set.team2_score < 30 ? set.team2_score++ : null,
                                class: "w-9 h-9 rounded-lg bg-primary/10 text-primary border-0 cursor-pointer font-bold text-lg hover:bg-primary/20 transition-colors"
                              }, "+", 8, ["onClick"])
                            ]),
                            createVNode("div", { class: "flex justify-center gap-1.5 mb-2" }, [
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => set.team2_score = 0,
                                class: "px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors"
                              }, "รีเซ็ต", 8, ["onClick"]),
                              createVNode("button", {
                                type: "button",
                                onClick: ($event) => set.team2_score = 21,
                                class: "px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-base-300 text-base-content/70 border-0 cursor-pointer hover:bg-base-300/80 transition-colors"
                              }, "21 แต้ม", 8, ["onClick"])
                            ]),
                            createVNode("div", { class: "px-1" }, [
                              withDirectives(createVNode("input", {
                                type: "range",
                                min: 0,
                                max: 30,
                                "onUpdate:modelValue": ($event) => set.team2_score = $event,
                                class: "range range-primary range-sm w-full"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [
                                  vModelText,
                                  set.team2_score,
                                  void 0,
                                  { number: true }
                                ]
                              ])
                            ])
                          ], 2)
                        ]),
                        index < sets.value.length - 1 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "flex items-center gap-3 my-3"
                        }, [
                          createVNode("div", { class: "flex-1 h-px bg-base-300" }),
                          createVNode("div", { class: "flex-1 h-px bg-base-300" })
                        ])) : createCommentVNode("", true)
                      ]);
                    }), 128))
                  ]),
                  createVNode("div", { class: "flex items-center justify-center gap-2 px-4 pb-3" }, [
                    createVNode("button", {
                      type: "button",
                      onClick: addNewSet,
                      class: "h-8 px-4 rounded-lg text-xs font-semibold bg-primary/5 text-primary border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
                    }, " + เพิ่ม Set " + toDisplayString(sets.value.length + 1), 1),
                    withDirectives(createVNode("button", {
                      type: "button",
                      onClick: removeNewSet,
                      class: "h-8 px-4 rounded-lg text-xs font-semibold bg-error/10 text-error border border-error/20 cursor-pointer hover:bg-error/20 transition-colors"
                    }, " - ลบ Set ", 512), [
                      [vShow, sets.value.length > 1]
                    ])
                  ]),
                  createVNode("div", { class: "flex gap-2 px-4 pb-4" }, [
                    createVNode("button", {
                      type: "button",
                      onClick: closeScoreModal,
                      class: "flex-1 h-10 rounded-xl text-sm font-medium bg-base-200 text-base-content/80 border-0 cursor-pointer hover:bg-base-300 transition-colors"
                    }, toDisplayString(unref(t)("common.cancel")), 1),
                    createVNode("button", {
                      type: "button",
                      onClick: ($event) => enterScore(setScoreGame.value.id),
                      class: "flex-1 h-10 rounded-xl text-sm font-semibold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98]"
                    }, " ✓ " + toDisplayString(unref(t)("common.save")), 9, ["onClick"])
                  ])
                ]),
                createVNode("form", {
                  method: "dialog",
                  class: "modal-backdrop"
                }, [
                  createVNode("button", { onClick: closeScoreModal }, "close")
                ])
              ], 2),
              createVNode("div", { class: "flex gap-1 p-1 bg-base-200 rounded-xl mb-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(tabs.value, (tab) => {
                  return openBlock(), createBlock("button", {
                    key: tab.key,
                    class: ["flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border-0", activeTab.value === tab.key ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50 hover:text-base-content hover:bg-base-300/50"],
                    onClick: ($event) => activeTab.value = tab.key
                  }, [
                    createVNode("span", null, toDisplayString(tab.icon), 1),
                    createVNode("span", null, toDisplayString(tab.label), 1),
                    tab.count != null ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-[10px] opacity-70"
                    }, "(" + toDisplayString(tab.count) + ")", 1)) : createCommentVNode("", true)
                  ], 10, ["onClick"]);
                }), 128))
              ]),
              withDirectives(createVNode("div", null, [
                createVNode(_sfc_main$5, {
                  games: games.value,
                  party: party.value,
                  readyPlayers: game_data.ready_คน,
                  onListGame: listGame,
                  onStartGame: (gameId, skipConfirm) => startGame(gameId, skipConfirm),
                  onFinishGame: finishGame,
                  onDeleteGame: deleteGame,
                  onAutoAddPlayers: autoAddPlayers,
                  onAddShuttlecock: addShuttlecock,
                  onReturnShuttlecock: returnShuttlecock,
                  onOpenScore: (game) => openPosition("top", game)
                }, null, 8, ["games", "party", "readyPlayers", "onStartGame", "onOpenScore"])
              ], 512), [
                [vShow, activeTab.value === "game"]
              ]),
              withDirectives(createVNode("div", null, [
                createVNode(_sfc_main$6, {
                  party: party.value,
                  costSummary: unref(costSummary),
                  games: games.value
                }, null, 8, ["party", "costSummary", "games"])
              ], 512), [
                [vShow, activeTab.value === "info"]
              ]),
              withDirectives(createVNode("div", null, [
                createVNode(_sfc_main$7, {
                  party: party.value,
                  games: games.value,
                  friendshipMap: unref(page).props.friendshipMap || {},
                  onUpdateDisplayName: updateDisplayName
                }, null, 8, ["party", "games", "friendshipMap"])
              ], 512), [
                [vShow, activeTab.value === "player"]
              ]),
              withDirectives(createVNode("div", null, [
                createVNode(_sfc_main$8, {
                  games: games.value,
                  party: party.value
                }, null, 8, ["games", "party"])
              ], 512), [
                [vShow, activeTab.value === "stats"]
              ]),
              createVNode(_sfc_main$1, {
                show: showDuplicate.value,
                party: party.value,
                onClose: ($event) => showDuplicate.value = false
              }, null, 8, ["show", "party", "onClose"]),
              createVNode(_sfc_main$2, {
                show: showEndParty.value,
                party: party.value,
                games: games.value,
                costSummary: unref(costSummary),
                onClose: ($event) => showEndParty.value = false
              }, null, 8, ["show", "party", "games", "costSummary", "onClose"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Party.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Party = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7cbc89fa"]]);
export {
  Party as default
};
