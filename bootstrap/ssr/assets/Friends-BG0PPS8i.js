import { ref, computed, onMounted, onUnmounted, unref, withCtx, createVNode, withDirectives, toDisplayString, createBlock, openBlock, Fragment, renderList, createCommentVNode, vShow, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-BqVs4mIv.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, Head, router } from "@inertiajs/vue3";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import { u as useConfirm } from "./useConfirm-CffLghyV.js";
import { Realtime } from "ably";
import axios from "axios";
import "./badmintonLayout-C3Xd2fBf.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Friends",
  __ssrInlineRender: true,
  props: {
    friends: { type: Array, default: () => [] },
    receivedRequests: { type: Array, default: () => [] },
    sentRequests: { type: Array, default: () => [] },
    ably_key: { type: String, default: null }
  },
  setup(__props) {
    const { t } = useLocale();
    const toast = useToast();
    const { confirm } = useConfirm();
    const page = usePage();
    const props = __props;
    const activeTab = ref("friends");
    const tabs = computed(() => [
      { key: "friends", label: t("friends.myFriends"), icon: "👥", count: props.friends.length },
      { key: "received", label: t("friends.received"), icon: "📥", count: props.receivedRequests.length },
      { key: "sent", label: t("friends.sent"), icon: "📤", count: props.sentRequests.length }
    ]);
    const reloadData = () => {
      router.reload({
        preserveScroll: true,
        only: ["friends", "receivedRequests", "sentRequests"]
      });
    };
    const acceptRequest = async (friendshipId) => {
      var _a, _b;
      try {
        await axios.post(`/friends/${friendshipId}/accept`);
        toast.add({
          severity: "success",
          summary: t("friends.accept"),
          detail: t("friends.requestAccepted"),
          life: 3e3
        });
        reloadData();
      } catch (e) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: ((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Something went wrong",
          life: 3e3
        });
      }
    };
    const declineRequest = async (friendshipId) => {
      var _a, _b;
      try {
        await axios.delete(`/friends/${friendshipId}`);
        toast.add({
          severity: "info",
          summary: t("friends.decline"),
          detail: t("friends.decline"),
          life: 3e3
        });
        reloadData();
      } catch (e) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: ((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Something went wrong",
          life: 3e3
        });
      }
    };
    const cancelRequest = async (friendshipId) => {
      var _a, _b;
      try {
        await axios.delete(`/friends/${friendshipId}`);
        toast.add({
          severity: "info",
          summary: t("friends.cancel"),
          detail: t("friends.cancel"),
          life: 3e3
        });
        reloadData();
      } catch (e) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: ((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Something went wrong",
          life: 3e3
        });
      }
    };
    const unfriend = (friendshipId, friendName) => {
      confirm({
        message: `${t("friends.unfriend")} ${friendName}?`,
        header: t("friends.unfriend"),
        accept: async () => {
          var _a, _b;
          try {
            await axios.delete(`/friends/${friendshipId}`);
            toast.add({
              severity: "info",
              summary: t("friends.unfriend"),
              detail: t("friends.unfriend"),
              life: 3e3
            });
            reloadData();
          } catch (e) {
            toast.add({
              severity: "error",
              summary: "Error",
              detail: ((_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Something went wrong",
              life: 3e3
            });
          }
        }
      });
    };
    const goToChat = async (friendUserId) => {
      try {
        const res = await axios.post("/chat/create", {
          user_ids: [page.props.auth.user.id, friendUserId],
          is_group: false,
          name: null
        });
        router.visit(`/chat?chatId=${res.data.chat_id}`);
      } catch (e) {
        router.visit("/chat");
      }
    };
    let ablyInstance = null;
    let friendsChannel = null;
    onMounted(() => {
      const ablyKey = props.ably_key || page.props.ably_key;
      if (ablyKey) {
        ablyInstance = new Realtime({
          key: ablyKey,
          clientId: `${page.props.auth.user.id}`
        });
        friendsChannel = ablyInstance.channels.get(
          `friends.${page.props.auth.user.id}`
        );
        friendsChannel.subscribe(() => {
          reloadData();
        });
      }
    });
    onUnmounted(() => {
      if (friendsChannel) {
        friendsChannel.unsubscribe();
        friendsChannel.detach();
      }
      if (ablyInstance) {
        ablyInstance.close();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: unref(t)("friends.title")
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h1 class="text-base font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(unref(t)("friends.title"))}</h1></div><div class="flex gap-1 p-1 bg-base-200 rounded-xl"${_scopeId}><!--[-->`);
            ssrRenderList(tabs.value, (tab) => {
              _push2(`<button class="${ssrRenderClass([
                activeTab.value === tab.key ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50 hover:text-base-content hover:bg-base-300/50",
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border-0 relative"
              ])}"${_scopeId}><span${_scopeId}>${ssrInterpolate(tab.icon)}</span><span${_scopeId}>${ssrInterpolate(tab.label)}</span><span class="${ssrRenderClass([
                tab.count > 0 ? activeTab.value === tab.key ? "bg-primary-content text-primary" : "bg-base-content/20 text-base-content/70" : "bg-base-content/10 text-base-content/30",
                "min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full text-[9px] font-bold"
              ])}"${_scopeId}>${ssrInterpolate(tab.count)}</span></button>`);
            });
            _push2(`<!--]--></div><div style="${ssrRenderStyle(activeTab.value === "friends" ? null : { display: "none" })}"${_scopeId}>`);
            if (__props.friends.length === 0) {
              _push2(`<div class="text-center py-8 bg-base-100 rounded-xl border border-base-300"${_scopeId}><span class="text-3xl"${_scopeId}>👥</span><p class="text-xs text-base-content/50 mt-2 m-0"${_scopeId}>${ssrInterpolate(unref(t)("friends.noFriends"))}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.friends, (friend) => {
              var _a, _b, _c, _d, _e;
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: (_a = friend.user) == null ? void 0 : _a.avatar,
                name: (_b = friend.user) == null ? void 0 : _b.name,
                size: "md",
                rounded: "full"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex-1 min-w-0"${_scopeId}><div class="text-sm font-bold text-base-content truncate"${_scopeId}>${ssrInterpolate((_c = friend.user) == null ? void 0 : _c.name)}</div>`);
              if ((_d = friend.user) == null ? void 0 : _d.badminton_rank) {
                _push2(`<div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate(((_e = friend.user.badminton_rank) == null ? void 0 : _e.education_rank) || `Lv${friend.user.badminton_rank_id}`)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex items-center gap-1.5 shrink-0"${_scopeId}><button class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-info/10 text-info border-0 cursor-pointer hover:bg-info/20 transition-colors"${_scopeId}>${ssrInterpolate(unref(t)("friends.chat"))}</button><button class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors"${_scopeId}>${ssrInterpolate(unref(t)("friends.unfriend"))}</button></div></div>`);
            });
            _push2(`<!--]--></div></div><div style="${ssrRenderStyle(activeTab.value === "received" ? null : { display: "none" })}"${_scopeId}>`);
            if (__props.receivedRequests.length === 0) {
              _push2(`<div class="text-center py-8 bg-base-100 rounded-xl border border-base-300"${_scopeId}><span class="text-3xl"${_scopeId}>📥</span><p class="text-xs text-base-content/50 mt-2 m-0"${_scopeId}>${ssrInterpolate(unref(t)("friends.noRequests"))}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.receivedRequests, (request) => {
              var _a, _b, _c;
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: (_a = request.sender) == null ? void 0 : _a.avatar,
                name: (_b = request.sender) == null ? void 0 : _b.name,
                size: "md",
                rounded: "full"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex-1 min-w-0"${_scopeId}><div class="text-sm font-bold text-base-content truncate"${_scopeId}>${ssrInterpolate((_c = request.sender) == null ? void 0 : _c.name)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate(unref(t)("friends.pending"))}</div></div><div class="flex items-center gap-1.5 shrink-0"${_scopeId}><button class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-success/10 text-success border-0 cursor-pointer hover:bg-success/20 transition-colors"${_scopeId}>${ssrInterpolate(unref(t)("friends.accept"))}</button><button class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors"${_scopeId}>${ssrInterpolate(unref(t)("friends.decline"))}</button></div></div>`);
            });
            _push2(`<!--]--></div></div><div style="${ssrRenderStyle(activeTab.value === "sent" ? null : { display: "none" })}"${_scopeId}>`);
            if (__props.sentRequests.length === 0) {
              _push2(`<div class="text-center py-8 bg-base-100 rounded-xl border border-base-300"${_scopeId}><span class="text-3xl"${_scopeId}>📤</span><p class="text-xs text-base-content/50 mt-2 m-0"${_scopeId}>${ssrInterpolate(unref(t)("friends.noRequests"))}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(__props.sentRequests, (request) => {
              var _a, _b, _c;
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: (_a = request.receiver) == null ? void 0 : _a.avatar,
                name: (_b = request.receiver) == null ? void 0 : _b.name,
                size: "md",
                rounded: "full"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex-1 min-w-0"${_scopeId}><div class="text-sm font-bold text-base-content truncate"${_scopeId}>${ssrInterpolate((_c = request.receiver) == null ? void 0 : _c.name)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate(unref(t)("friends.pending"))}</div></div><div class="flex items-center gap-1.5 shrink-0"${_scopeId}><button class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-warning/10 text-warning border-0 cursor-pointer hover:bg-warning/20 transition-colors"${_scopeId}>${ssrInterpolate(unref(t)("friends.cancel"))}</button></div></div>`);
            });
            _push2(`<!--]--></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("h1", { class: "text-base font-bold text-base-content m-0" }, toDisplayString(unref(t)("friends.title")), 1)
                ]),
                createVNode("div", { class: "flex gap-1 p-1 bg-base-200 rounded-xl" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(tabs.value, (tab) => {
                    return openBlock(), createBlock("button", {
                      key: tab.key,
                      class: [
                        "flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer border-0 relative",
                        activeTab.value === tab.key ? "bg-primary text-primary-content shadow-sm" : "bg-transparent text-base-content/50 hover:text-base-content hover:bg-base-300/50"
                      ],
                      onClick: ($event) => activeTab.value = tab.key
                    }, [
                      createVNode("span", null, toDisplayString(tab.icon), 1),
                      createVNode("span", null, toDisplayString(tab.label), 1),
                      createVNode("span", {
                        class: [
                          "min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full text-[9px] font-bold",
                          tab.count > 0 ? activeTab.value === tab.key ? "bg-primary-content text-primary" : "bg-base-content/20 text-base-content/70" : "bg-base-content/10 text-base-content/30"
                        ]
                      }, toDisplayString(tab.count), 3)
                    ], 10, ["onClick"]);
                  }), 128))
                ]),
                withDirectives(createVNode("div", null, [
                  __props.friends.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-8 bg-base-100 rounded-xl border border-base-300"
                  }, [
                    createVNode("span", { class: "text-3xl" }, "👥"),
                    createVNode("p", { class: "text-xs text-base-content/50 mt-2 m-0" }, toDisplayString(unref(t)("friends.noFriends")), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.friends, (friend) => {
                      var _a, _b, _c, _d, _e;
                      return openBlock(), createBlock("div", {
                        key: friend.id,
                        class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
                      }, [
                        createVNode(_sfc_main$2, {
                          src: (_a = friend.user) == null ? void 0 : _a.avatar,
                          name: (_b = friend.user) == null ? void 0 : _b.name,
                          size: "md",
                          rounded: "full"
                        }, null, 8, ["src", "name"]),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "text-sm font-bold text-base-content truncate" }, toDisplayString((_c = friend.user) == null ? void 0 : _c.name), 1),
                          ((_d = friend.user) == null ? void 0 : _d.badminton_rank) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-[10px] text-base-content/50"
                          }, toDisplayString(((_e = friend.user.badminton_rank) == null ? void 0 : _e.education_rank) || `Lv${friend.user.badminton_rank_id}`), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex items-center gap-1.5 shrink-0" }, [
                          createVNode("button", {
                            onClick: ($event) => {
                              var _a2;
                              return goToChat((_a2 = friend.user) == null ? void 0 : _a2.id);
                            },
                            class: "h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-info/10 text-info border-0 cursor-pointer hover:bg-info/20 transition-colors"
                          }, toDisplayString(unref(t)("friends.chat")), 9, ["onClick"]),
                          createVNode("button", {
                            onClick: ($event) => {
                              var _a2;
                              return unfriend(friend.id, (_a2 = friend.user) == null ? void 0 : _a2.name);
                            },
                            class: "h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors"
                          }, toDisplayString(unref(t)("friends.unfriend")), 9, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ], 512), [
                  [vShow, activeTab.value === "friends"]
                ]),
                withDirectives(createVNode("div", null, [
                  __props.receivedRequests.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-8 bg-base-100 rounded-xl border border-base-300"
                  }, [
                    createVNode("span", { class: "text-3xl" }, "📥"),
                    createVNode("p", { class: "text-xs text-base-content/50 mt-2 m-0" }, toDisplayString(unref(t)("friends.noRequests")), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.receivedRequests, (request) => {
                      var _a, _b, _c;
                      return openBlock(), createBlock("div", {
                        key: request.id,
                        class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
                      }, [
                        createVNode(_sfc_main$2, {
                          src: (_a = request.sender) == null ? void 0 : _a.avatar,
                          name: (_b = request.sender) == null ? void 0 : _b.name,
                          size: "md",
                          rounded: "full"
                        }, null, 8, ["src", "name"]),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "text-sm font-bold text-base-content truncate" }, toDisplayString((_c = request.sender) == null ? void 0 : _c.name), 1),
                          createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(unref(t)("friends.pending")), 1)
                        ]),
                        createVNode("div", { class: "flex items-center gap-1.5 shrink-0" }, [
                          createVNode("button", {
                            onClick: ($event) => acceptRequest(request.id),
                            class: "h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-success/10 text-success border-0 cursor-pointer hover:bg-success/20 transition-colors"
                          }, toDisplayString(unref(t)("friends.accept")), 9, ["onClick"]),
                          createVNode("button", {
                            onClick: ($event) => declineRequest(request.id),
                            class: "h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors"
                          }, toDisplayString(unref(t)("friends.decline")), 9, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ], 512), [
                  [vShow, activeTab.value === "received"]
                ]),
                withDirectives(createVNode("div", null, [
                  __props.sentRequests.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-8 bg-base-100 rounded-xl border border-base-300"
                  }, [
                    createVNode("span", { class: "text-3xl" }, "📤"),
                    createVNode("p", { class: "text-xs text-base-content/50 mt-2 m-0" }, toDisplayString(unref(t)("friends.noRequests")), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.sentRequests, (request) => {
                      var _a, _b, _c;
                      return openBlock(), createBlock("div", {
                        key: request.id,
                        class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
                      }, [
                        createVNode(_sfc_main$2, {
                          src: (_a = request.receiver) == null ? void 0 : _a.avatar,
                          name: (_b = request.receiver) == null ? void 0 : _b.name,
                          size: "md",
                          rounded: "full"
                        }, null, 8, ["src", "name"]),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "text-sm font-bold text-base-content truncate" }, toDisplayString((_c = request.receiver) == null ? void 0 : _c.name), 1),
                          createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(unref(t)("friends.pending")), 1)
                        ]),
                        createVNode("div", { class: "flex items-center gap-1.5 shrink-0" }, [
                          createVNode("button", {
                            onClick: ($event) => cancelRequest(request.id),
                            class: "h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-warning/10 text-warning border-0 cursor-pointer hover:bg-warning/20 transition-colors"
                          }, toDisplayString(unref(t)("friends.cancel")), 9, ["onClick"])
                        ])
                      ]);
                    }), 128))
                  ])
                ], 512), [
                  [vShow, activeTab.value === "sent"]
                ])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Friends.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
