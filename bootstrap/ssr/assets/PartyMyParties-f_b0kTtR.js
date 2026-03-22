import { computed, unref, withCtx, createVNode, createBlock, toDisplayString, openBlock, Fragment, renderList, createTextVNode, createCommentVNode, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-j6iBrT39.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, Head, router } from "@inertiajs/vue3";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./useToast-DyaFeJ92.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "PartyMyParties",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    const page = usePage();
    const rawParties = page.props.parties ?? [];
    const parties = computed(
      () => [...rawParties].sort((a, b) => {
        const aOver = a.status === "Over" ? 1 : 0;
        const bOver = b.status === "Over" ? 1 : 0;
        if (aOver !== bOver) return aOver - bOver;
        return b.play_date.localeCompare(a.play_date);
      })
    );
    page.props.auth.user;
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
      const day = d.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const days = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
      return `${days[d.getDay()]}. ${day} ${months[d.getMonth()]}`;
    };
    const statusBadgeClass = (status) => {
      switch (status) {
        case "Open":
          return "bg-primary/10 text-primary";
        case "Full":
          return "bg-warning/20 text-warning";
        case "Over":
          return "bg-error/20 text-error";
        default:
          return "bg-base-200 text-base-content/70";
      }
    };
    const statusAccentColor = (status) => {
      switch (status) {
        case "Open":
          return "bg-primary";
        case "Full":
          return "bg-warning";
        case "Over":
          return "bg-base-300";
        default:
          return "bg-base-300";
      }
    };
    const enterParty = (partyId) => {
      router.get(`/party/${partyId}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: unref(t)("nav.myParties")
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div${_scopeId}><div class="text-xl font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(unref(t)("nav.myParties"))}</div><p class="text-sm text-base-content/60 m-0 mt-0.5"${_scopeId}>${ssrInterpolate(unref(t)("partyList.joined", { count: parties.value.length }))}</p></div>`);
            if (parties.value.length > 0) {
              _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
              ssrRenderList(parties.value, (party) => {
                var _a, _b, _c, _d, _e;
                _push2(`<div class="${ssrRenderClass([party.status === "Over" ? "bg-neutral/15 border-neutral/30" : "bg-base-100 border-base-300", "badminton-card rounded-xl border overflow-hidden cursor-pointer"])}"${_scopeId}><div class="${ssrRenderClass([statusAccentColor(party.status), "h-1"])}"${_scopeId}></div><div class="p-4"${_scopeId}><div class="flex items-start justify-between gap-3 mb-3"${_scopeId}><div class="min-w-0 flex-1"${_scopeId}><div class="text-base font-semibold text-base-content m-0 truncate"${_scopeId}>${ssrInterpolate(((_a = party.court) == null ? void 0 : _a.name) || "Unknown Court")}</div><p class="text-xs text-base-content/50 m-0 mt-0.5"${_scopeId}>#${ssrInterpolate(party.id)}</p></div><span class="${ssrRenderClass([statusBadgeClass(party.status), "shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold"])}"${_scopeId}>${ssrInterpolate({ Open: "เปิดอยู่", Full: "เต็ม", Over: "จบแล้ว" }[party.status] || party.status)}</span></div><div class="grid grid-cols-3 gap-2 mb-3"${_scopeId}><div class="text-center"${_scopeId}><p class="text-[10px] text-base-content/50 m-0"${_scopeId}>📅 วันที่</p><p class="text-xs font-medium text-base-content m-0 mt-0.5"${_scopeId}>${ssrInterpolate(formatDate(party.play_date))}</p></div><div class="text-center"${_scopeId}><p class="text-[10px] text-base-content/50 m-0"${_scopeId}>⏰ เวลา</p><p class="text-xs font-medium text-base-content m-0 mt-0.5"${_scopeId}>${ssrInterpolate(((_b = party.start_time) == null ? void 0 : _b.substring(0, 5)) || "-")}-${ssrInterpolate(((_c = party.end_time) == null ? void 0 : _c.substring(0, 5)) || "-")} <span class="text-[10px] text-base-content/40"${_scopeId}>(${ssrInterpolate(party.play_hours)}h)</span></p></div><div class="text-center"${_scopeId}><p class="text-[10px] text-base-content/50 m-0"${_scopeId}>👥 ผู้เล่น</p><p class="${ssrRenderClass([party.members_count >= party.max_players ? "text-error" : "text-base-content", "text-xs font-medium m-0 mt-0.5"])}"${_scopeId}>${ssrInterpolate(party.members_count)}/${ssrInterpolate(party.max_players)}</p></div></div><div class="flex items-center justify-between pt-3 border-t border-base-200"${_scopeId}><div class="flex items-center"${_scopeId}><div class="flex -space-x-2"${_scopeId}><!--[-->`);
                ssrRenderList((_d = party.members) == null ? void 0 : _d.slice(0, 5), (member) => {
                  var _a2, _b2;
                  _push2(ssrRenderComponent(_sfc_main$2, {
                    key: member.id,
                    src: (_a2 = member.user) == null ? void 0 : _a2.avatar,
                    name: (_b2 = member.user) == null ? void 0 : _b2.name,
                    size: "sm",
                    rounded: "full",
                    class: "border-2 border-base-100"
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]--></div>`);
                if (((_e = party.members) == null ? void 0 : _e.length) > 5) {
                  _push2(`<span class="ml-1.5 text-xs text-base-content/50"${_scopeId}>+${ssrInterpolate(party.members.length - 5)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
                if (party.status !== "Over") {
                  _push2(`<button class="h-8 px-4 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary text-white hover:bg-primary/80"${_scopeId}><i class="pi pi-arrow-right mr-1 text-[10px]"${_scopeId}></i> ${ssrInterpolate(unref(t)("common.enter"))}</button>`);
                } else {
                  _push2(`<button class="h-8 px-4 rounded-lg text-xs font-medium border border-base-300 cursor-pointer transition-all active:scale-[0.97] bg-base-200 text-base-content/60 hover:bg-base-300"${_scopeId}> ดูข้อมูล </button>`);
                }
                _push2(`</div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-16"${_scopeId}><div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"${_scopeId}><span class="text-3xl"${_scopeId}>🏸</span></div><h3 class="text-lg font-semibold text-base-content m-0"${_scopeId}>${ssrInterpolate(unref(t)("partyList.noParties"))}</h3><p class="text-sm text-base-content/60 mt-1 m-0"${_scopeId}>${ssrInterpolate(unref(t)("partyList.joinFirst"))}</p><button class="btn btn-primary btn-sm mt-4"${_scopeId}> ไปหน้ารายการปาร์ตี้ </button></div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", null, [
                  createVNode("div", { class: "text-xl font-bold text-base-content m-0" }, toDisplayString(unref(t)("nav.myParties")), 1),
                  createVNode("p", { class: "text-sm text-base-content/60 m-0 mt-0.5" }, toDisplayString(unref(t)("partyList.joined", { count: parties.value.length })), 1)
                ]),
                parties.value.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-3"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(parties.value, (party) => {
                    var _a, _b, _c, _d, _e;
                    return openBlock(), createBlock("div", {
                      key: party.id,
                      class: ["badminton-card rounded-xl border overflow-hidden cursor-pointer", party.status === "Over" ? "bg-neutral/15 border-neutral/30" : "bg-base-100 border-base-300"],
                      onClick: ($event) => enterParty(party.id)
                    }, [
                      createVNode("div", {
                        class: ["h-1", statusAccentColor(party.status)]
                      }, null, 2),
                      createVNode("div", { class: "p-4" }, [
                        createVNode("div", { class: "flex items-start justify-between gap-3 mb-3" }, [
                          createVNode("div", { class: "min-w-0 flex-1" }, [
                            createVNode("div", { class: "text-base font-semibold text-base-content m-0 truncate" }, toDisplayString(((_a = party.court) == null ? void 0 : _a.name) || "Unknown Court"), 1),
                            createVNode("p", { class: "text-xs text-base-content/50 m-0 mt-0.5" }, "#" + toDisplayString(party.id), 1)
                          ]),
                          createVNode("span", {
                            class: ["shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold", statusBadgeClass(party.status)]
                          }, toDisplayString({ Open: "เปิดอยู่", Full: "เต็ม", Over: "จบแล้ว" }[party.status] || party.status), 3)
                        ]),
                        createVNode("div", { class: "grid grid-cols-3 gap-2 mb-3" }, [
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[10px] text-base-content/50 m-0" }, "📅 วันที่"),
                            createVNode("p", { class: "text-xs font-medium text-base-content m-0 mt-0.5" }, toDisplayString(formatDate(party.play_date)), 1)
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[10px] text-base-content/50 m-0" }, "⏰ เวลา"),
                            createVNode("p", { class: "text-xs font-medium text-base-content m-0 mt-0.5" }, [
                              createTextVNode(toDisplayString(((_b = party.start_time) == null ? void 0 : _b.substring(0, 5)) || "-") + "-" + toDisplayString(((_c = party.end_time) == null ? void 0 : _c.substring(0, 5)) || "-") + " ", 1),
                              createVNode("span", { class: "text-[10px] text-base-content/40" }, "(" + toDisplayString(party.play_hours) + "h)", 1)
                            ])
                          ]),
                          createVNode("div", { class: "text-center" }, [
                            createVNode("p", { class: "text-[10px] text-base-content/50 m-0" }, "👥 ผู้เล่น"),
                            createVNode("p", {
                              class: ["text-xs font-medium m-0 mt-0.5", party.members_count >= party.max_players ? "text-error" : "text-base-content"]
                            }, toDisplayString(party.members_count) + "/" + toDisplayString(party.max_players), 3)
                          ])
                        ]),
                        createVNode("div", { class: "flex items-center justify-between pt-3 border-t border-base-200" }, [
                          createVNode("div", { class: "flex items-center" }, [
                            createVNode("div", { class: "flex -space-x-2" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList((_d = party.members) == null ? void 0 : _d.slice(0, 5), (member) => {
                                var _a2, _b2;
                                return openBlock(), createBlock(_sfc_main$2, {
                                  key: member.id,
                                  src: (_a2 = member.user) == null ? void 0 : _a2.avatar,
                                  name: (_b2 = member.user) == null ? void 0 : _b2.name,
                                  size: "sm",
                                  rounded: "full",
                                  class: "border-2 border-base-100"
                                }, null, 8, ["src", "name"]);
                              }), 128))
                            ]),
                            ((_e = party.members) == null ? void 0 : _e.length) > 5 ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "ml-1.5 text-xs text-base-content/50"
                            }, "+" + toDisplayString(party.members.length - 5), 1)) : createCommentVNode("", true)
                          ]),
                          party.status !== "Over" ? (openBlock(), createBlock("button", {
                            key: 0,
                            onClick: withModifiers(($event) => enterParty(party.id), ["stop"]),
                            class: "h-8 px-4 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all active:scale-[0.97] bg-primary text-white hover:bg-primary/80"
                          }, [
                            createVNode("i", { class: "pi pi-arrow-right mr-1 text-[10px]" }),
                            createTextVNode(" " + toDisplayString(unref(t)("common.enter")), 1)
                          ], 8, ["onClick"])) : (openBlock(), createBlock("button", {
                            key: 1,
                            onClick: withModifiers(($event) => enterParty(party.id), ["stop"]),
                            class: "h-8 px-4 rounded-lg text-xs font-medium border border-base-300 cursor-pointer transition-all active:scale-[0.97] bg-base-200 text-base-content/60 hover:bg-base-300"
                          }, " ดูข้อมูล ", 8, ["onClick"]))
                        ])
                      ])
                    ], 10, ["onClick"]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center py-16"
                }, [
                  createVNode("div", { class: "w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4" }, [
                    createVNode("span", { class: "text-3xl" }, "🏸")
                  ]),
                  createVNode("h3", { class: "text-lg font-semibold text-base-content m-0" }, toDisplayString(unref(t)("partyList.noParties")), 1),
                  createVNode("p", { class: "text-sm text-base-content/60 mt-1 m-0" }, toDisplayString(unref(t)("partyList.joinFirst")), 1),
                  createVNode("button", {
                    onClick: ($event) => unref(router).get("/party-lists"),
                    class: "btn btn-primary btn-sm mt-4"
                  }, " ไปหน้ารายการปาร์ตี้ ", 8, ["onClick"])
                ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PartyMyParties.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
