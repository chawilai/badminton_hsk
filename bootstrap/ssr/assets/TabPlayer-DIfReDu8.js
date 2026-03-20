import { ref, unref, useSSRContext, mergeProps } from "vue";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
import "./useToast-DyaFeJ92.js";
import "./useConfirm-CffLghyV.js";
import { usePage } from "@inertiajs/vue3";
const _sfc_main$1 = {
  __name: "AddFriendButton",
  __ssrInlineRender: true,
  props: {
    userId: { type: Number, required: true },
    status: { type: String, default: null },
    friendshipId: { type: Number, default: null },
    iconOnly: { type: Boolean, default: false }
  },
  setup(__props) {
    const { t } = useLocale();
    const props = __props;
    const loading = ref(false);
    const currentStatus = ref(props.status);
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.iconOnly) {
        _push(`<!--[-->`);
        if (!currentStatus.value) {
          _push(`<button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-7 h-7 rounded-lg border-0 cursor-pointer flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 bg-success/10 text-success hover:bg-success/20" title="เพิ่มเพื่อน"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg></button>`);
        } else if (currentStatus.value === "pending_sent") {
          _push(`<span class="w-7 h-7 rounded-lg flex items-center justify-center bg-base-200 text-base-content/30" title="รอตอบรับ"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></span>`);
        } else if (currentStatus.value === "pending_received") {
          _push(`<button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-7 h-7 rounded-lg border-0 cursor-pointer flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 bg-info/10 text-info hover:bg-info/20" title="ตอบรับเพื่อน"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg></button>`);
        } else if (currentStatus.value === "accepted") {
          _push(`<span class="w-7 h-7 rounded-lg flex items-center justify-center bg-success/10 text-success" title="เพื่อนแล้ว"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!--[-->`);
        if (!currentStatus.value) {
          _push(`<button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-success/15 text-success border-0 cursor-pointer hover:bg-success/25 transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50">${ssrInterpolate(loading.value ? "..." : unref(t)("friends.addFriend"))}</button>`);
        } else if (currentStatus.value === "pending_sent") {
          _push(`<span class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-base-200 text-base-content/50 inline-flex items-center whitespace-nowrap">${ssrInterpolate(unref(t)("friends.pending"))}</span>`);
        } else if (currentStatus.value === "pending_received") {
          _push(`<button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-info/15 text-info border-0 cursor-pointer hover:bg-info/25 transition-colors active:scale-95 whitespace-nowrap disabled:opacity-50">${ssrInterpolate(loading.value ? "..." : unref(t)("friends.accept"))}</button>`);
        } else if (currentStatus.value === "accepted") {
          _push(`<span class="h-6 px-2 rounded-lg text-[10px] font-semibold bg-success/15 text-success inline-flex items-center whitespace-nowrap">${ssrInterpolate(unref(t)("friends.isFriend"))} ✓ </span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/AddFriendButton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "TabPlayer",
  __ssrInlineRender: true,
  props: {
    party: { type: Object, required: true },
    games: { type: Array, default: () => [] },
    friendshipMap: { type: Object, default: () => ({}) }
  },
  emits: ["updateDisplayName"],
  setup(__props, { emit: __emit }) {
    const { t } = useLocale();
    const page = usePage();
    const currentUserId = page.props.auth.user.id;
    const props = __props;
    const isHost = props.party.creator_id === currentUserId;
    const playedUserIds = new Set(
      props.games.flatMap((g) => (g.game_players || []).map((gp) => gp.user_id))
    );
    const canKick = (member) => {
      return isHost && !isCurrentUser(member) && !playedUserIds.has(member.user_id);
    };
    const canToggleStatus = (member) => isCurrentUser(member) || isHost;
    const isCurrentUser = (member) => member.user_id === currentUserId;
    const canLeave = (member) => {
      return isCurrentUser(member) && !isHost && !playedUserIds.has(member.user_id);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-base-100 rounded-xl border border-base-300 overflow-hidden" }, _attrs))}><div class="px-4 py-3 border-b border-base-200"><h2 class="text-base font-bold text-base-content m-0">${ssrInterpolate(unref(t)("player.title"))} <span class="text-sm font-normal text-base-content/50">(${ssrInterpolate(((_a = __props.party.members) == null ? void 0 : _a.length) || 0)})</span></h2></div><div class="divide-y divide-base-200"><!--[-->`);
      ssrRenderList(__props.party.members, (member, index) => {
        var _a2, _b, _c, _d, _e;
        _push(`<div class="flex items-center gap-2.5 px-4 py-2.5"><span class="text-xs font-bold text-base-content/40 w-5 text-center shrink-0">${ssrInterpolate(index + 1)}</span>`);
        _push(ssrRenderComponent(_sfc_main$2, {
          src: (_a2 = member.user) == null ? void 0 : _a2.avatar,
          name: member.display_name || ((_b = member.user) == null ? void 0 : _b.name),
          size: "md",
          rounded: "xl",
          class: "shrink-0"
        }, null, _parent));
        _push(`<div class="flex items-center gap-2 flex-1 min-w-0"><input type="text"${ssrRenderAttr("value", member.display_name)} class="px-2 py-1 rounded-lg border border-base-300 bg-base-200 text-sm text-base-content w-24 sm:w-32 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-hidden transition-all"${ssrRenderAttr("placeholder", unref(t)("player.displayName"))}><span class="text-[10px] text-base-content/40 truncate max-w-[5rem]">${ssrInterpolate((_c = member.user) == null ? void 0 : _c.name)}</span></div><div class="flex items-center gap-1.5 shrink-0"><span class="text-sm"${ssrRenderAttr("title", member.role === "Host" ? "Host" : "Member")}>${ssrInterpolate(member.role === "Host" ? "👑" : "👤")}</span><label class="${ssrRenderClass([[
          canToggleStatus(member) ? "hover:bg-base-200 active:scale-95" : "cursor-default",
          isCurrentUser(member) ? "" : "opacity-50"
        ], "flex items-center gap-1 px-2 py-1 rounded-lg cursor-pointer select-none transition-all"])}"><div class="${ssrRenderClass([member.game_status === "ready" ? "bg-success" : "bg-warning", "relative w-8 h-4 rounded-full transition-colors"])}"><div class="${ssrRenderClass([member.game_status === "ready" ? "left-[calc(100%-14px)]" : "left-0.5", "absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-all"])}"></div></div><span class="${ssrRenderClass([member.game_status === "ready" ? "text-success" : "text-warning", "text-[10px] font-semibold w-10"])}">${ssrInterpolate(member.game_status === "ready" ? unref(t)("playerStatus.ready") : unref(t)("playerStatus.break"))}</span></label>`);
        if (!isCurrentUser(member)) {
          _push(ssrRenderComponent(_sfc_main$1, {
            userId: member.user_id,
            status: ((_d = __props.friendshipMap[member.user_id]) == null ? void 0 : _d.status) || null,
            friendshipId: ((_e = __props.friendshipMap[member.user_id]) == null ? void 0 : _e.friendship_id) || null,
            "icon-only": ""
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (canLeave(member)) {
          _push(`<button class="w-7 h-7 rounded-lg bg-error/10 hover:bg-error/20 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95" title="ออกจากปาร์ตี้"><svg class="w-3.5 h-3.5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if (canKick(member)) {
          _push(`<button class="w-7 h-7 rounded-lg bg-error/10 hover:bg-error/20 border-0 cursor-pointer flex items-center justify-center transition-colors active:scale-95" title="ลบออกจากปาร์ตี้"><svg class="w-3.5 h-3.5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Party/TabPlayer.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
