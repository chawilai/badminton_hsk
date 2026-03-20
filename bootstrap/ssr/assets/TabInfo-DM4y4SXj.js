import { computed, ref, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
import "./useToast-DyaFeJ92.js";
import { _ as _sfc_main$1 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage } from "@inertiajs/vue3";
import "./useConfirm-CffLghyV.js";
const NOTE_TEMPLATES_KEY = "badminton_note_templates";
const _sfc_main = {
  __name: "TabInfo",
  __ssrInlineRender: true,
  props: {
    party: { type: Object, required: true },
    costSummary: { type: Object, default: () => ({}) },
    games: { type: Array, default: () => [] }
  },
  setup(__props) {
    var _a, _b;
    const { t } = useLocale();
    const page = usePage();
    const props = __props;
    const isHost = props.party.creator_id === ((_a = page.props.auth.user) == null ? void 0 : _a.id);
    const authUserId = (_b = page.props.auth.user) == null ? void 0 : _b.id;
    const myMember = computed(() => {
      var _a2;
      return (_a2 = props.party.members) == null ? void 0 : _a2.find((m) => m.user_id === authUserId);
    });
    const canLeave = computed(() => {
      if (!myMember.value) return false;
      return !props.games.some(
        (g) => {
          var _a2;
          return (_a2 = g.game_players) == null ? void 0 : _a2.some((gp) => gp.user_id === authUserId);
        }
      );
    });
    const hasPlayedGames = computed(() => props.games.some((g) => g.status === "finished" || g.status === "playing"));
    const hasOtherMembers = computed(() => {
      var _a2;
      return (((_a2 = props.party.members) == null ? void 0 : _a2.filter((m) => m.user_id !== authUserId)) || []).length > 0;
    });
    const canDeleteParty = computed(() => isHost && !hasPlayedGames.value && !hasOtherMembers.value);
    const costTypeLabel = (type) => {
      const map = { free: "ฟรี", per_person: "จ่ายรายหัว", split_equal: "หารเท่า" };
      return map[type] || "-";
    };
    const showEditDialog = ref(false);
    const editForm = ref({});
    const timeOptions = Array.from({ length: 24 }, (_, i) => ({
      name: `${String(i + 1).padStart(2, "0")}:00`
    }));
    ref(null);
    const noteTemplates = ref([]);
    const showNoteTemplateMenu = ref(false);
    const showSaveNoteTemplate = ref(false);
    const noteTemplateName = ref("");
    const confirmingDeleteIdx = ref(null);
    try {
      noteTemplates.value = JSON.parse(localStorage.getItem(NOTE_TEMPLATES_KEY) || "[]");
    } catch {
      noteTemplates.value = [];
    }
    const showEmojiPicker = ref(false);
    const showBulletPicker = ref(false);
    const showLinePicker = ref(false);
    const emojiCategories = [
      { label: "🏸 แบดมินตัน", emojis: ["🏸", "🧑‍🤝‍🧑", "🏆", "🥇", "🥈", "🥉", "🎯", "💪", "🔥", "⭐", "🤝", "👏"] },
      { label: "🏟️ สถานที่/เวลา", emojis: ["🏟️", "📅", "⏰", "🕐", "📍", "🅿️", "🚗", "🏠", "🚿", "🗓️"] },
      { label: "💰 เงิน", emojis: ["💰", "💵", "💳", "🧾", "📊", "💲", "🏦", "🔢"] },
      { label: "⚠️ กฎ/เตือน", emojis: ["⚠️", "📌", "🚫", "❌", "✅", "⭕", "❗", "📢", "🔒", "🙅", "👉", "📣"] },
      { label: "👟 อุปกรณ์", emojis: ["👟", "👕", "🎽", "🧴", "💧", "🧊", "🎒", "🩳", "🧤", "😷"] },
      { label: "😊 อื่นๆ", emojis: ["📝", "📋", "👋", "🙏", "😊", "🎉", "🔄", "➡️", "⬇️", "☎️", "📱", "🔗"] }
    ];
    const bulletStyles = [
      { label: "จุดทึบ", preview: "•", char: "• " },
      { label: "ขีด", preview: "-", char: "- " },
      { label: "ลูกศร", preview: "▸", char: "▸ " },
      { label: "ถูก", preview: "✓", char: "✓ " },
      { label: "ดาว", preview: "★", char: "★ " },
      { label: "หมายเลข", preview: "1.", char: null, numbered: true }
    ];
    const lineStyles = [
      { label: "เส้นตรง", preview: "─────", char: "───────────────" },
      { label: "จุดประ", preview: "· · · · ·", char: "· · · · · · · · · · ·" },
      { label: "ขีดประ", preview: "- - - - -", char: "- - - - - - - - - - -" },
      { label: "ดาว", preview: "★ ★ ★", char: "★ ★ ★ ★ ★" }
    ];
    const saving = ref(false);
    const inviteUrl = ref("");
    const passcode = ref(props.party.invite_passcode || "");
    const generatingLink = ref(false);
    const savingPasscode = ref(false);
    if (props.party.invite_token) {
      inviteUrl.value = `${window.location.origin}/party/${props.party.id}/invite/${props.party.invite_token}`;
    }
    const showInviteDialog = ref(false);
    const invitableUsers = ref([]);
    const selectedUserIds = ref([]);
    const inviteMessage = ref("");
    const loadingUsers = ref(false);
    const sendingInvites = ref(false);
    const userSearch = ref("");
    const lineQuota = ref({ quota: 0, used: 0, remaining: 0 });
    const quotaLoaded = ref(false);
    const filteredUsers = computed(() => {
      if (!userSearch.value) return invitableUsers.value;
      const q = userSearch.value.toLowerCase();
      return invitableUsers.value.filter((u) => {
        var _a2;
        return (_a2 = u.name) == null ? void 0 : _a2.toLowerCase().includes(q);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a2, _b2, _c, _d, _e, _f, _g, _h, _i, _j;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      if (isHost) {
        _push(`<button class="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> แก้ไขข้อมูลปาร์ตี้ </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><div class="text-base font-bold text-base-content m-0">${ssrInterpolate(unref(t)("info.court"))}</div></div><div class="p-4 space-y-2"><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.courtName"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_a2 = __props.party.court) == null ? void 0 : _a2.name) || "-")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.address"))}</span><span class="text-sm font-medium text-base-content text-right max-w-[60%]">${ssrInterpolate(((_b2 = __props.party.court) == null ? void 0 : _b2.address) || "-")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.phone"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_c = __props.party.court) == null ? void 0 : _c.phone) || "-")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.courtType"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_d = __props.party.court) == null ? void 0 : _d.court_type) || "-")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.pricePerHour"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_e = __props.party.court) == null ? void 0 : _e.play_price) ? `${__props.party.court.play_price} ฿` : "-")}</span></div></div></div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><div class="text-base font-bold text-base-content m-0">${ssrInterpolate(unref(t)("info.partyDetails"))}</div></div><div class="p-4 space-y-2"><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.playDate"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.party.play_date)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.time"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate((_f = __props.party.start_time) == null ? void 0 : _f.substring(0, 5))} - ${ssrInterpolate((_g = __props.party.end_time) == null ? void 0 : _g.substring(0, 5))}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.duration"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.party.play_hours)} ${ssrInterpolate(unref(t)("info.hoursUnit"))}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.playerCount"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(((_h = __props.party.members) == null ? void 0 : _h.length) || 0)}/${ssrInterpolate(__props.party.max_players)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.status"))}</span><span class="${ssrRenderClass([{
        "badge-success": __props.party.status === "Open",
        "badge-warning": __props.party.status === "Full",
        "badge-neutral": __props.party.status === "Over"
      }, "badge badge-sm"])}">${ssrInterpolate(__props.party.status)}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.private"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.party.is_private ? "ใช่" : "ไม่")}</span></div><div class="flex items-center justify-between"><span class="text-sm text-base-content/60">${ssrInterpolate(unref(t)("info.shuttlecocks"))}</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.party.default_initial_shuttlecocks ?? 0)} ${ssrInterpolate(unref(t)("info.shuttleUnit"))}</span></div></div></div>`);
      if ((_i = __props.party.court_bookings) == null ? void 0 : _i.length) {
        _push(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><div class="text-base font-bold text-base-content m-0">🏟️ คอร์ทที่จอง</div></div><div class="p-4 space-y-2"><div class="flex items-center justify-between mb-1"><span class="text-sm text-base-content/60">จำนวนคอร์ท</span><span class="text-sm font-medium text-base-content">${ssrInterpolate(__props.party.court_bookings.length)} คอร์ท</span></div><!--[-->`);
        ssrRenderList(__props.party.court_bookings, (booking, idx) => {
          var _a3, _b3;
          _push(`<div class="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2"><span class="text-sm font-semibold text-primary">คอร์ท ${ssrInterpolate(booking.court_field_number)}</span><span class="text-sm text-base-content/70">${ssrInterpolate((_a3 = booking.start_time) == null ? void 0 : _a3.substring(0, 5))} - ${ssrInterpolate((_b3 = booking.end_time) == null ? void 0 : _b3.substring(0, 5))}</span></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
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
        _push(`</div><div><div class="text-xs font-semibold text-base-content/60 mb-1.5">🔢 รหัสเข้าร่วม (4 หลัก)</div><div class="flex gap-2"><input type="tel"${ssrRenderAttr("value", passcode.value)} maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="0000" class="input input-bordered input-sm w-28 text-center tracking-widest font-bold"><button${ssrIncludeBooleanAttr(savingPasscode.value || !passcode.value || passcode.value.length < 4) ? " disabled" : ""} class="btn btn-primary btn-sm text-xs">บันทึก</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isHost) {
        _push(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"><div class="px-4 py-3 border-b border-base-200"><div class="text-base font-bold text-base-content m-0">📨 ส่งเทียบเชิญผ่าน LINE</div></div><div class="p-4"><p class="text-xs text-base-content/60 mb-3 m-0">เลือกผู้เล่นที่เคยเล่นด้วยเพื่อส่งเทียบเชิญเข้าร่วมปาร์ตี้นี้ผ่าน LINE OA</p><button class="w-full py-2.5 rounded-xl text-sm font-semibold bg-[#06C755] text-white border-0 cursor-pointer hover:bg-[#05b04c] transition-colors active:scale-[0.98] flex items-center justify-center gap-2"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"></path></svg> ส่งเทียบเชิญผ่าน LINE </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<dialog class="${ssrRenderClass([{ "modal-open": showInviteDialog.value }, "modal"])}"><div class="modal-box max-w-md p-0 max-h-[85vh]"><div class="flex items-center justify-between px-4 pt-4 pb-2 sticky top-0 bg-base-100 z-10"><h3 class="text-base font-bold text-base-content m-0">📨 ส่งเทียบเชิญ LINE</h3><button class="w-7 h-7 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors"><span class="text-base-content/60 text-sm">✕</span></button></div><div class="px-4 pb-4 space-y-4">`);
      if (quotaLoaded.value) {
        _push(`<div class="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2"><span class="text-xs text-base-content/60">LINE credit เดือนนี้</span><span class="${ssrRenderClass([lineQuota.value.remaining > 0 ? "text-success" : "text-error", "text-xs font-bold"])}">${ssrInterpolate(lineQuota.value.remaining)}/${ssrInterpolate(lineQuota.value.quota)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      if (quotaLoaded.value && lineQuota.value.remaining <= 0) {
        _push(`<div class="bg-error/10 border border-error/20 rounded-lg p-3 text-center"><div class="text-sm font-bold text-error">LINE credit หมดแล้ว</div><div class="text-xs text-base-content/50 mt-1">ไม่สามารถส่งเทียบเชิญผ่าน LINE ได้ ใช้ลิงก์เชิญแทน</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("value", userSearch.value)} type="text" placeholder="ค้นหาชื่อผู้เล่น..." class="input input-bordered input-sm w-full"><div><div class="flex items-center justify-between mb-2"><span class="text-xs font-semibold text-base-content/60">เลือกผู้เล่น (${ssrInterpolate(selectedUserIds.value.length)})</span>`);
      if (filteredUsers.value.length > 0) {
        _push(`<button class="text-xs font-medium text-primary border-0 bg-transparent cursor-pointer hover:underline">${ssrInterpolate(selectedUserIds.value.length === filteredUsers.value.length ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด")}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loadingUsers.value) {
        _push(`<div class="flex justify-center py-8"><span class="loading loading-spinner loading-md text-primary"></span></div>`);
      } else if (filteredUsers.value.length === 0) {
        _push(`<div class="text-center py-8"><div class="text-3xl mb-2">👥</div><div class="text-sm text-base-content/40">${ssrInterpolate(userSearch.value ? "ไม่พบผู้เล่นที่ค้นหา" : "ไม่มีผู้เล่นที่สามารถเชิญได้")}</div>`);
        if (!userSearch.value) {
          _push(`<div class="text-xs text-base-content/30 mt-1">ผู้เล่นต้องเคยอยู่ในปาร์ตี้เดียวกับคุณและมีบัญชี LINE</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-1 max-h-[35vh] overflow-y-auto"><!--[-->`);
        ssrRenderList(filteredUsers.value, (user) => {
          _push(`<div class="${ssrRenderClass([selectedUserIds.value.includes(user.id) ? "bg-primary/10 border border-primary/30" : "bg-base-200/50 hover:bg-base-200 border border-transparent", "flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors"])}"><div class="relative">`);
          _push(ssrRenderComponent(_sfc_main$1, {
            src: user.avatar,
            name: user.name,
            size: "md",
            rounded: "xl"
          }, null, _parent));
          if (selectedUserIds.value.includes(user.id)) {
            _push(`<div class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"><svg class="w-3 h-3 text-primary-content" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex-1 min-w-0"><div class="text-sm font-medium text-base-content truncate">${ssrInterpolate(user.name)}</div></div><input type="checkbox"${ssrIncludeBooleanAttr(selectedUserIds.value.includes(user.id)) ? " checked" : ""} class="checkbox checkbox-primary checkbox-sm"></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div><label class="text-xs font-semibold text-base-content/60 block mb-1.5">ข้อความเพิ่มเติม (ไม่บังคับ)</label><textarea rows="3" maxlength="500" class="textarea textarea-bordered textarea-sm w-full text-xs" placeholder="เช่น มาตีแบดกันเถอะ! สนามดี ลมเย็น 🏸">${ssrInterpolate(inviteMessage.value)}</textarea><div class="text-right text-[10px] text-base-content/30 mt-0.5">${ssrInterpolate(inviteMessage.value.length)}/500</div></div>`);
      if (quotaLoaded.value && selectedUserIds.value.length > 0 && lineQuota.value.remaining < selectedUserIds.value.length && lineQuota.value.remaining > 0) {
        _push(`<div class="text-xs text-warning text-center"> เลือก ${ssrInterpolate(selectedUserIds.value.length)} คน แต่ credit เหลือ ${ssrInterpolate(lineQuota.value.remaining)} — กรุณาลดจำนวน </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button${ssrIncludeBooleanAttr(sendingInvites.value || !selectedUserIds.value.length || lineQuota.value.remaining < selectedUserIds.value.length) ? " disabled" : ""} class="w-full py-2.5 rounded-xl text-sm font-semibold bg-[#06C755] text-white border-0 cursor-pointer hover:bg-[#05b04c] transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">`);
      if (sendingInvites.value) {
        _push(`<span class="loading loading-spinner loading-xs"></span>`);
      } else {
        _push(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>`);
      }
      _push(` ${ssrInterpolate(sendingInvites.value ? "กำลังส่ง..." : `ส่งเทียบเชิญ ${selectedUserIds.value.length ? `(${selectedUserIds.value.length} คน)` : ""}`)}</button></div></div><form method="dialog" class="modal-backdrop"><button>close</button></form></dialog>`);
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
      if (!isHost && canLeave.value) {
        _push(`<div class="pt-2"><button class="w-full py-2.5 rounded-xl text-sm font-semibold bg-error/10 text-error border border-error/20 cursor-pointer hover:bg-error/20 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> ออกจากปาร์ตี้ </button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isHost && !hasPlayedGames.value) {
        _push(`<div class="pt-2"><button class="${ssrRenderClass([canDeleteParty.value ? "bg-error/10 text-error border-error/20 hover:bg-error/20" : "bg-base-200 text-base-content/40 border-base-300", "w-full py-2.5 rounded-xl text-sm font-semibold border cursor-pointer transition-colors active:scale-[0.98] flex items-center justify-center gap-2"])}"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> ลบปาร์ตี้ </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<dialog class="${ssrRenderClass([{ "modal-open": showEditDialog.value }, "modal"])}"><div class="modal-box max-w-md p-0 max-h-[90vh]"><div class="flex items-center justify-between px-4 pt-4 pb-2 sticky top-0 bg-base-100 z-10"><h3 class="text-base font-bold text-base-content m-0">🏸 แก้ไขปาร์ตี้</h3><button class="w-7 h-7 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors"><span class="text-base-content/60 text-sm">✕</span></button></div><div class="px-4 pb-4 space-y-4 overflow-y-auto"><div><label class="text-xs font-semibold text-base-content/60 block mb-1">ชื่อปาร์ตี้</label><input${ssrRenderAttr("value", editForm.value.name)} type="text" class="input input-bordered input-sm w-full" placeholder="ชื่อปาร์ตี้ (ไม่บังคับ)"></div><div><label class="text-xs font-semibold text-base-content/60 block mb-1">วันเล่น</label><input${ssrRenderAttr("value", editForm.value.play_date)} type="date" class="input input-bordered input-sm w-full"></div><div class="grid grid-cols-2 gap-3"><div><label class="text-xs font-semibold text-base-content/60 block mb-1">จำนวนผู้เล่นสูงสุด</label><input${ssrRenderAttr("value", editForm.value.max_players)} type="number" min="1" class="input input-bordered input-sm w-full"></div><div><label class="text-xs font-semibold text-base-content/60 block mb-1">ประเภทเกม</label><select class="select select-bordered select-sm w-full"><option value="double"${ssrIncludeBooleanAttr(Array.isArray(editForm.value.default_game_type) ? ssrLooseContain(editForm.value.default_game_type, "double") : ssrLooseEqual(editForm.value.default_game_type, "double")) ? " selected" : ""}>1v1 (คู่)</option><option value="quadruple"${ssrIncludeBooleanAttr(Array.isArray(editForm.value.default_game_type) ? ssrLooseContain(editForm.value.default_game_type, "quadruple") : ssrLooseEqual(editForm.value.default_game_type, "quadruple")) ? " selected" : ""}>2v2 (สี่คน)</option></select></div></div><div><label class="text-xs font-semibold text-base-content/60 block mb-1">คอร์ทที่จอง</label><div class="space-y-2"><!--[-->`);
      ssrRenderList(editForm.value.court_bookings, (booking, idx) => {
        _push(`<div class="flex items-center gap-2 bg-base-200/50 rounded-lg p-2"><div class="flex-1 grid grid-cols-3 gap-1.5"><div><label class="text-[9px] text-base-content/40 block">คอร์ท</label><input${ssrRenderAttr("value", booking.court_field_number)} type="number" min="1" class="input input-bordered input-xs w-full" placeholder="#"></div><div><label class="text-[9px] text-base-content/40 block">เริ่ม</label><select class="select select-bordered select-xs w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(booking.start_time) ? ssrLooseContain(booking.start_time, "") : ssrLooseEqual(booking.start_time, "")) ? " selected" : ""}>-</option><!--[-->`);
        ssrRenderList(unref(timeOptions), (opt) => {
          _push(`<option${ssrRenderAttr("value", opt.name)}${ssrIncludeBooleanAttr(Array.isArray(booking.start_time) ? ssrLooseContain(booking.start_time, opt.name) : ssrLooseEqual(booking.start_time, opt.name)) ? " selected" : ""}>${ssrInterpolate(opt.name)}</option>`);
        });
        _push(`<!--]--></select></div><div><label class="text-[9px] text-base-content/40 block">สิ้นสุด</label><select class="select select-bordered select-xs w-full"><option value=""${ssrIncludeBooleanAttr(Array.isArray(booking.end_time) ? ssrLooseContain(booking.end_time, "") : ssrLooseEqual(booking.end_time, "")) ? " selected" : ""}>-</option><!--[-->`);
        ssrRenderList(unref(timeOptions), (opt) => {
          _push(`<option${ssrRenderAttr("value", opt.name)}${ssrIncludeBooleanAttr(Array.isArray(booking.end_time) ? ssrLooseContain(booking.end_time, opt.name) : ssrLooseEqual(booking.end_time, opt.name)) ? " selected" : ""}>${ssrInterpolate(opt.name)}</option>`);
        });
        _push(`<!--]--></select></div></div>`);
        if (editForm.value.court_bookings.length > 1) {
          _push(`<button class="w-6 h-6 rounded bg-error/10 text-error border-0 cursor-pointer flex items-center justify-center text-xs hover:bg-error/20">✕</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--><button class="w-full py-1.5 rounded-lg text-xs font-medium bg-base-200 text-base-content/60 border-0 cursor-pointer hover:bg-base-300 transition-colors">+ เพิ่มคอร์ท</button></div></div><div><label class="text-xs font-semibold text-base-content/60 block mb-1">ค่าใช้จ่าย</label><div class="flex gap-2 mb-2"><!--[-->`);
      ssrRenderList([{ key: "per_person", label: "จ่ายรายหัว" }, { key: "split_equal", label: "หารเท่า" }, { key: "free", label: "ฟรี" }], (ct) => {
        _push(`<button class="${ssrRenderClass([editForm.value.cost_type === ct.key ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/50", "flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"])}">${ssrInterpolate(ct.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (editForm.value.cost_type !== "free") {
        _push(`<div class="grid grid-cols-2 gap-3"><div><label class="text-[9px] text-base-content/40 block mb-0.5">${ssrInterpolate(editForm.value.cost_type === "per_person" ? "ราคา/คน (฿)" : "ค่าคอร์ทรวม (฿)")}</label><input${ssrRenderAttr("value", editForm.value.cost_amount)} type="number" min="0" class="input input-bordered input-sm w-full"></div><div><label class="text-[9px] text-base-content/40 block mb-0.5">ค่าลูกแบด/ลูก (฿)</label><input${ssrRenderAttr("value", editForm.value.shuttlecock_cost)} type="number" min="0" class="input input-bordered input-sm w-full"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2"><div class="flex items-center justify-between"><label class="text-xs font-semibold text-base-content/60">📝 หมายเหตุ / กติกา</label><div class="relative"><button type="button" class="text-[10px] font-medium text-primary border border-primary/30 bg-primary/5 rounded-lg px-2 py-1 cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1"> 📋 Template `);
      if (noteTemplates.value.length) {
        _push(`<span class="bg-primary text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center font-bold">${ssrInterpolate(noteTemplates.value.length)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button>`);
      if (showNoteTemplateMenu.value) {
        _push(`<div class="fixed inset-0 z-10"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showNoteTemplateMenu.value) {
        _push(`<div class="absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 py-1 max-h-60 overflow-y-auto">`);
        if (noteTemplates.value.length === 0) {
          _push(`<div class="px-3 py-4 text-center"><div class="text-[10px] text-base-content/30">ยังไม่มี template</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (noteTemplates.value.length > 0) {
          _push(`<!--[-->`);
          ssrRenderList(noteTemplates.value, (tmpl, i) => {
            _push(`<div class="px-3 py-2 hover:bg-base-200 transition-colors">`);
            if (confirmingDeleteIdx.value !== i) {
              _push(`<div class="flex items-center gap-2"><div class="flex-1 min-w-0 cursor-pointer"><div class="text-xs font-medium text-base-content truncate">${ssrInterpolate(tmpl.name)}</div><div class="text-[9px] text-base-content/40 truncate">${ssrInterpolate(tmpl.content.substring(0, 50))}</div></div><button type="button" class="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] text-base-content/30 hover:text-error hover:bg-error/10 border-0 bg-transparent cursor-pointer">✕</button></div>`);
            } else {
              _push(`<div class="flex items-center gap-2"><div class="flex-1 text-[10px] text-error font-medium">ลบ &quot;${ssrInterpolate(tmpl.name)}&quot; ?</div><button type="button" class="px-2 py-1 text-[10px] rounded-md bg-base-200 text-base-content/60 border-0 cursor-pointer">ยกเลิก</button><button type="button" class="px-2 py-1 text-[10px] rounded-md bg-error text-white border-0 cursor-pointer font-bold">ลบ</button></div>`);
            }
            _push(`</div>`);
          });
          _push(`<!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex items-center gap-0.5 w-full bg-base-200/50 rounded-lg p-1"><div class="flex items-center gap-0.5 flex-1"><div class="relative"><button type="button" class="${ssrRenderClass([showEmojiPicker.value ? "bg-primary/15 text-primary" : "hover:bg-base-300 bg-base-100/80", "h-7 w-8 rounded-md border-0 cursor-pointer text-sm flex items-center justify-center transition-colors active:scale-95"])}">😀</button>`);
      if (showEmojiPicker.value) {
        _push(`<div class="fixed inset-0 z-10"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showEmojiPicker.value) {
        _push(`<div class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 max-h-52 overflow-y-auto p-2 space-y-2"><!--[-->`);
        ssrRenderList(emojiCategories, (cat) => {
          _push(`<div><div class="text-[9px] font-bold text-base-content/40 uppercase mb-1">${ssrInterpolate(cat.label)}</div><div class="flex flex-wrap gap-0.5"><!--[-->`);
          ssrRenderList(cat.emojis, (e) => {
            _push(`<button type="button" class="w-8 h-8 rounded-lg hover:bg-base-200 border-0 bg-transparent cursor-pointer text-base flex items-center justify-center">${ssrInterpolate(e)}</button>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="relative"><button type="button" class="${ssrRenderClass([showBulletPicker.value ? "bg-primary/15 text-primary" : "hover:bg-base-300 bg-base-100/80 text-base-content/60", "h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95"])}"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>`);
      if (showBulletPicker.value) {
        _push(`<div class="fixed inset-0 z-10"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showBulletPicker.value) {
        _push(`<div class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-40 py-1"><!--[-->`);
        ssrRenderList(bulletStyles, (b) => {
          _push(`<button type="button" class="w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2"><span class="w-5 text-center font-bold font-mono">${ssrInterpolate(b.preview)}</span><span class="text-base-content/70">${ssrInterpolate(b.label)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="relative"><button type="button" class="${ssrRenderClass([showLinePicker.value ? "bg-primary/15 text-primary" : "hover:bg-base-300 bg-base-100/80 text-base-content/60", "h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95"])}"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3 12h18"></path></svg></button>`);
      if (showLinePicker.value) {
        _push(`<div class="fixed inset-0 z-10"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showLinePicker.value) {
        _push(`<div class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-52 py-1"><!--[-->`);
        ssrRenderList(lineStyles, (l) => {
          _push(`<button type="button" class="w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2"><span class="text-[10px] text-base-content/50 font-mono truncate w-20">${ssrInterpolate(l.preview)}</span><span class="text-base-content/70">${ssrInterpolate(l.label)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><textarea rows="5" class="textarea textarea-bordered textarea-sm w-full text-xs leading-relaxed font-mono" placeholder="เช่น
🏸 ลูกใช้ RSL เบอร์ 5
👟 ห้ามใส่รองเท้าตีนตุ๊กแก
⏰ มาก่อนเวลา 15 นาที">${ssrInterpolate(editForm.value.notes)}</textarea><div class="flex justify-end">`);
      if (!showSaveNoteTemplate.value) {
        _push(`<button type="button"${ssrIncludeBooleanAttr(!((_j = editForm.value.notes) == null ? void 0 : _j.trim())) ? " disabled" : ""} class="text-[10px] font-medium text-primary/70 hover:text-primary border-0 bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"> 💾 บันทึกเป็น Template </button>`);
      } else {
        _push(`<div class="flex items-center gap-1.5 w-full"><input type="text"${ssrRenderAttr("value", noteTemplateName.value)} placeholder="ตั้งชื่อ template..." class="input input-bordered input-xs text-xs flex-1"><button type="button" class="text-[10px] px-2 py-1 rounded-lg bg-base-200 text-base-content/60 border-0 cursor-pointer">ยกเลิก</button><button type="button"${ssrIncludeBooleanAttr(!noteTemplateName.value.trim()) ? " disabled" : ""} class="text-[10px] px-2 py-1 rounded-lg bg-primary text-white border-0 cursor-pointer disabled:opacity-30 font-bold">💾</button></div>`);
      }
      _push(`</div></div><label class="flex items-center justify-between cursor-pointer"><span class="text-xs font-semibold text-base-content/60">ปาร์ตี้ส่วนตัว</span><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(editForm.value.is_private) ? ssrLooseContain(editForm.value.is_private, null) : editForm.value.is_private) ? " checked" : ""} class="toggle toggle-sm toggle-primary"></label>`);
      if (editForm.value.is_private) {
        _push(`<div class="flex items-center gap-2 pl-2"><span class="text-[10px] text-base-content/50">🔢 รหัสเข้าร่วม</span><input type="tel"${ssrRenderAttr("value", editForm.value.invite_passcode)} maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="0000" class="input input-bordered input-xs w-20 text-center tracking-widest font-bold"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98] disabled:opacity-50">`);
      if (saving.value) {
        _push(`<span class="loading loading-spinner loading-xs mr-1"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(saving.value ? "กำลังบันทึก..." : "บันทึก")}</button></div></div><form method="dialog" class="modal-backdrop"><button>close</button></form></dialog></div>`);
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
