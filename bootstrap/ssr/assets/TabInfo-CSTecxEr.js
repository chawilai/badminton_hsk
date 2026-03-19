import { ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
import "./useToast-DyaFeJ92.js";
import { usePage } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "TabInfo",
  __ssrInlineRender: true,
  props: {
    party: { type: Object, required: true },
    costSummary: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    var _a;
    const { t } = useLocale();
    const page = usePage();
    const props = __props;
    const isHost = props.party.creator_id === ((_a = page.props.auth.user) == null ? void 0 : _a.id);
    const costTypeLabel = (type) => {
      const map = { free: "ฟรี", per_person: "จ่ายรายหัว", split_equal: "หารเท่า" };
      return map[type] || "-";
    };
    const inviteUrl = ref("");
    const passcode = ref(props.party.invite_passcode || "");
    const generatingLink = ref(false);
    const savingPasscode = ref(false);
    if (props.party.invite_token) {
      inviteUrl.value = `${window.location.origin}/party/${props.party.id}/invite/${props.party.invite_token}`;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b, _c, _d, _e, _f, _g, _h;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><div class="text-base font-bold text-base-content m-0">${ssrInterpolate(unref(t)("info.court"))}</div></div><div class="p-4 space-y-2"><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.courtName"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_a2 = __props.party.court) == null ? void 0 : _a2.name) || "-")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.address"))}</span><span class="text-sm font-medium text-base-content text-right max-w-[60%]">${ssrInterpolate(((_b = __props.party.court) == null ? void 0 : _b.address) || "-")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.phone"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_c = __props.party.court) == null ? void 0 : _c.phone) || "-")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.courtType"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_d = __props.party.court) == null ? void 0 : _d.court_type) || "-")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.pricePerHour"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_e = __props.party.court) == null ? void 0 : _e.play_price) ? `${__props.party.court.play_price} ฿` : "-")}</span></div></div></div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><div class="text-base font-bold text-base-content m-0">${ssrInterpolate(unref(t)("info.partyDetails"))}</div></div><div class="p-4 space-y-2"><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.playDate"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.party.play_date)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.time"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate((_f = __props.party.start_time) == null ? void 0 : _f.substring(0, 5))} - ${ssrInterpolate((_g = __props.party.end_time) == null ? void 0 : _g.substring(0, 5))}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.duration"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.party.play_hours)} ${ssrInterpolate(unref(t)("info.hoursUnit"))}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.playerCount"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_h = __props.party.members) == null ? void 0 : _h.length) || 0)}/${ssrInterpolate(__props.party.max_players)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.status"))}</span><span class="${ssrRenderClass([{
        "badge-success": __props.party.status === "Open",
        "badge-warning": __props.party.status === "Full",
        "badge-neutral": __props.party.status === "Over"
      }, "badge badge-sm"])}">${ssrInterpolate(__props.party.status)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.private"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.party.is_private ? "ใช่" : "ไม่")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.shuttlecocks"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.party.default_initial_shuttlecocks ?? 0)} ${ssrInterpolate(unref(t)("info.shuttleUnit"))}</span></div></div></div>`);
      if (isHost && __props.party.is_private) {
        _push(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><div class="text-base font-bold text-base-content m-0">🔒 ตั้งค่าการเข้าร่วม</div></div><div class="p-4 space-y-4"><div><div class="text-xs font-semibold text-base-content/60 mb-1.5">🔗 ลิงก์เชิญ</div>`);
        if (inviteUrl.value) {
          _push(`<div class="flex gap-2"><input type="text"${ssrRenderAttr("value", inviteUrl.value)} readonly class="input input-bordered input-sm flex-1 text-xs"><button class="btn btn-primary btn-sm text-xs">คัดลอก</button></div>`);
        } else {
          _push(`<button${ssrIncludeBooleanAttr(generatingLink.value) ? " disabled" : ""} class="btn btn-outline btn-primary btn-sm text-xs w-full">`);
          if (generatingLink.value) {
            _push(`<span class="loading loading-spinner loading-xs"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` 🔗 สร้างลิงก์เชิญ </button>`);
        }
        _push(`</div><div><div class="text-xs font-semibold text-base-content/60 mb-1.5">🔢 รหัสเข้าร่วม (4 หลัก)</div><div class="flex gap-2"><input type="text"${ssrRenderAttr("value", passcode.value)} maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="0000" class="input input-bordered input-sm w-28 text-center tracking-widest font-bold"><button${ssrIncludeBooleanAttr(savingPasscode.value || !passcode.value || passcode.value.length < 4) ? " disabled" : ""} class="btn btn-primary btn-sm text-xs">บันทึก</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.costSummary && __props.costSummary.cost_type !== "free") {
        _push(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><div class="text-base font-bold text-base-content m-0">💰 สรุปค่าใช้จ่าย</div></div><div class="p-4 space-y-2"><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">รูปแบบ</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(costTypeLabel(__props.costSummary.cost_type))}</span></div>`);
        if (__props.costSummary.court_cost_total > 0) {
          _push(`<div class="flex items-center justify-between"><span class="text-sm text-base-content/60">ค่าคอร์ท</span><span class="text-sm font-medium text-base-content">฿${ssrInterpolate(__props.costSummary.court_cost_total.toLocaleString())}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.costSummary.shuttlecock_used > 0) {
          _push(`<div class="flex items-center justify-between"><span class="text-sm text-base-content/60">ลูกแบดใช้</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.costSummary.shuttlecock_used)} ลูก × ฿${ssrInterpolate(__props.costSummary.shuttlecock_cost_per_unit)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.costSummary.shuttlecock_cost_total > 0) {
          _push(`<div class="flex items-center justify-between"><span class="text-sm text-base-content/60">ค่าลูกแบดรวม</span><span class="text-sm font-medium text-base-content">฿${ssrInterpolate(__props.costSummary.shuttlecock_cost_total.toLocaleString())}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center justify-between"><span class="text-sm text-base-content/60">จำนวนผู้เล่น</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.costSummary.member_count)} คน</span></div><div class="border-t border-base-200 pt-2 mt-2 space-y-2"><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">รวมทั้งหมด</span><span class="text-sm font-bold text-base-content">฿${ssrInterpolate(__props.costSummary.total_cost.toLocaleString())}</span></div><div class="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2 -mx-1"><span class="text-sm font-bold text-primary">💰 ต่อคน</span><span class="text-lg font-black text-primary">฿${ssrInterpolate(Math.ceil(__props.costSummary.per_person).toLocaleString())}</span></div></div></div></div>`);
      } else if (__props.costSummary && __props.costSummary.cost_type === "free") {
        _push(`<div class="bg-success/10 rounded-2xl border border-success/20 p-4 text-center"><span class="text-2xl">🆓</span><div class="text-sm font-bold text-success mt-1">ปาร์ตี้ฟรี ไม่มีค่าใช้จ่าย</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Party/TabInfo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
