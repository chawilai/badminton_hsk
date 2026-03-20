import { ref, onMounted, unref, withCtx, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, renderList, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-COXuhfhM.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, Head, router } from "@inertiajs/vue3";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import "./useLocale-gpJrLIKB.js";
import "./badmintonLayout-Bmnf0xqT.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "PartyInvitePreview",
  __ssrInlineRender: true,
  props: {
    party: { type: Object, required: true },
    members: { type: Array, default: () => [] },
    isFull: { type: Boolean, default: false }
  },
  setup(__props) {
    const toast = useToast();
    const page = usePage();
    const props = __props;
    const joining = ref(false);
    const confirmJoin = () => {
      if (joining.value) return;
      joining.value = true;
      router.post(`/party/${props.party.id}/confirm-join`, {}, {
        onSuccess: () => {
          toast.add({ severity: "success", summary: "เข้าร่วมปาร์ตี้เรียบร้อย!", life: 3e3 });
        },
        onFinish: () => {
          joining.value = false;
        }
      });
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      const d = /* @__PURE__ */ new Date(dateStr + "T00:00:00");
      const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
      const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
      return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
    };
    const costLabel = () => {
      const p = props.party;
      if (p.cost_type === "free") return "ฟรี";
      if (p.cost_type === "per_person") return `฿${p.cost_amount}/คน`;
      if (p.cost_type === "split_equal") return `หารเท่า (฿${p.cost_amount}/ชม.)`;
      return "-";
    };
    onMounted(() => {
      var _a;
      if ((_a = page.props.flash) == null ? void 0 : _a.success) {
        toast.add({ severity: "success", summary: page.props.flash.success, life: 3e3 });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "เข้าร่วมปาร์ตี้" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center"${_scopeId}><div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-3"${_scopeId}><span class="text-3xl"${_scopeId}>🏸</span></div><div class="text-lg font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(__props.party.name || ((_a = __props.party.court) == null ? void 0 : _a.name) || "ปาร์ตี้")}</div><p class="text-xs text-base-content/50 m-0 mt-1"${_scopeId}>คุณได้รับเชิญเข้าร่วมปาร์ตี้</p></div><div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-2.5"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><span class="text-sm text-base-content/60"${_scopeId}>🏟️ สนาม</span><span class="text-sm font-medium text-base-content"${_scopeId}>${ssrInterpolate(((_b = __props.party.court) == null ? void 0 : _b.name) || "-")}</span></div>`);
            if ((_c = __props.party.court) == null ? void 0 : _c.address) {
              _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="text-sm text-base-content/60"${_scopeId}>📍 ที่อยู่</span><span class="text-sm font-medium text-base-content text-right max-w-[60%]"${_scopeId}>${ssrInterpolate(__props.party.court.address)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center justify-between"${_scopeId}><span class="text-sm text-base-content/60"${_scopeId}>📅 วันเล่น</span><span class="text-sm font-medium text-base-content"${_scopeId}>${ssrInterpolate(formatDate(__props.party.play_date))}</span></div><div class="flex items-center justify-between"${_scopeId}><span class="text-sm text-base-content/60"${_scopeId}>⏰ เวลา</span><span class="text-sm font-medium text-base-content"${_scopeId}>${ssrInterpolate((_d = __props.party.start_time) == null ? void 0 : _d.substring(0, 5))}-${ssrInterpolate((_e = __props.party.end_time) == null ? void 0 : _e.substring(0, 5))} (${ssrInterpolate(__props.party.play_hours)} ชม.)</span></div><div class="flex items-center justify-between"${_scopeId}><span class="text-sm text-base-content/60"${_scopeId}>🎮 ประเภท</span><span class="text-sm font-medium text-base-content"${_scopeId}>${ssrInterpolate(__props.party.default_game_type === "double" ? "1v1 เดี่ยว" : "2v2 คู่")}</span></div><div class="flex items-center justify-between"${_scopeId}><span class="text-sm text-base-content/60"${_scopeId}>👥 ผู้เล่น</span><span class="${ssrRenderClass([__props.isFull ? "text-error" : "text-base-content", "text-sm font-medium"])}"${_scopeId}>${ssrInterpolate(__props.party.members_count)}/${ssrInterpolate(__props.party.max_players)} คน</span></div><div class="flex items-center justify-between"${_scopeId}><span class="text-sm text-base-content/60"${_scopeId}>💰 ค่าใช้จ่าย</span><span class="text-sm font-medium text-base-content"${_scopeId}>${ssrInterpolate(costLabel())}</span></div></div>`);
            if (__props.party.notes) {
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-4"${_scopeId}><div class="text-xs font-bold text-base-content/60 uppercase mb-1"${_scopeId}>📝 หมายเหตุ</div><p class="text-sm text-base-content m-0 whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(__props.party.notes)}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden"${_scopeId}><div class="px-4 py-3 border-b border-base-200"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>👥 สมาชิก (${ssrInterpolate(__props.members.length)})</div></div><div class="divide-y divide-base-200"${_scopeId}><!--[-->`);
            ssrRenderList(__props.members, (member) => {
              var _a2, _b2, _c2;
              _push2(`<div class="flex items-center gap-3 px-4 py-2.5"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: (_a2 = member.user) == null ? void 0 : _a2.avatar,
                name: (_b2 = member.user) == null ? void 0 : _b2.name,
                size: "sm",
                rounded: "full"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex-1 min-w-0"${_scopeId}><div class="text-sm font-medium text-base-content truncate"${_scopeId}>${ssrInterpolate(member.display_name || ((_c2 = member.user) == null ? void 0 : _c2.name))}</div></div>`);
              if (member.role === "Host") {
                _push2(`<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/15 text-primary"${_scopeId}>HOST</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]--></div></div><div class="pt-2"${_scopeId}>`);
            if (!__props.isFull) {
              _push2(`<button${ssrIncludeBooleanAttr(joining.value) ? " disabled" : ""} class="w-full h-12 rounded-xl text-base font-bold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"${_scopeId}>`);
              if (joining.value) {
                _push2(`<span class="loading loading-spinner loading-sm"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` 🏸 ยืนยันเข้าร่วม </button>`);
            } else {
              _push2(`<div class="w-full h-12 rounded-xl text-base font-bold bg-error/10 text-error flex items-center justify-center"${_scopeId}> ปาร์ตี้เต็มแล้ว </div>`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center" }, [
                  createVNode("div", { class: "inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-3" }, [
                    createVNode("span", { class: "text-3xl" }, "🏸")
                  ]),
                  createVNode("div", { class: "text-lg font-bold text-base-content m-0" }, toDisplayString(__props.party.name || ((_f = __props.party.court) == null ? void 0 : _f.name) || "ปาร์ตี้"), 1),
                  createVNode("p", { class: "text-xs text-base-content/50 m-0 mt-1" }, "คุณได้รับเชิญเข้าร่วมปาร์ตี้")
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4 space-y-2.5" }, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm text-base-content/60" }, "🏟️ สนาม"),
                    createVNode("span", { class: "text-sm font-medium text-base-content" }, toDisplayString(((_g = __props.party.court) == null ? void 0 : _g.name) || "-"), 1)
                  ]),
                  ((_h = __props.party.court) == null ? void 0 : _h.address) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex items-center justify-between"
                  }, [
                    createVNode("span", { class: "text-sm text-base-content/60" }, "📍 ที่อยู่"),
                    createVNode("span", { class: "text-sm font-medium text-base-content text-right max-w-[60%]" }, toDisplayString(__props.party.court.address), 1)
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm text-base-content/60" }, "📅 วันเล่น"),
                    createVNode("span", { class: "text-sm font-medium text-base-content" }, toDisplayString(formatDate(__props.party.play_date)), 1)
                  ]),
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm text-base-content/60" }, "⏰ เวลา"),
                    createVNode("span", { class: "text-sm font-medium text-base-content" }, toDisplayString((_i = __props.party.start_time) == null ? void 0 : _i.substring(0, 5)) + "-" + toDisplayString((_j = __props.party.end_time) == null ? void 0 : _j.substring(0, 5)) + " (" + toDisplayString(__props.party.play_hours) + " ชม.)", 1)
                  ]),
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm text-base-content/60" }, "🎮 ประเภท"),
                    createVNode("span", { class: "text-sm font-medium text-base-content" }, toDisplayString(__props.party.default_game_type === "double" ? "1v1 เดี่ยว" : "2v2 คู่"), 1)
                  ]),
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm text-base-content/60" }, "👥 ผู้เล่น"),
                    createVNode("span", {
                      class: ["text-sm font-medium", __props.isFull ? "text-error" : "text-base-content"]
                    }, toDisplayString(__props.party.members_count) + "/" + toDisplayString(__props.party.max_players) + " คน", 3)
                  ]),
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("span", { class: "text-sm text-base-content/60" }, "💰 ค่าใช้จ่าย"),
                    createVNode("span", { class: "text-sm font-medium text-base-content" }, toDisplayString(costLabel()), 1)
                  ])
                ]),
                __props.party.notes ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-base-100 rounded-xl border border-base-300 p-4"
                }, [
                  createVNode("div", { class: "text-xs font-bold text-base-content/60 uppercase mb-1" }, "📝 หมายเหตุ"),
                  createVNode("p", { class: "text-sm text-base-content m-0 whitespace-pre-wrap" }, toDisplayString(__props.party.notes), 1)
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200" }, [
                    createVNode("div", { class: "text-sm font-bold text-base-content" }, "👥 สมาชิก (" + toDisplayString(__props.members.length) + ")", 1)
                  ]),
                  createVNode("div", { class: "divide-y divide-base-200" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.members, (member) => {
                      var _a2, _b2, _c2;
                      return openBlock(), createBlock("div", {
                        key: member.id,
                        class: "flex items-center gap-3 px-4 py-2.5"
                      }, [
                        createVNode(_sfc_main$2, {
                          src: (_a2 = member.user) == null ? void 0 : _a2.avatar,
                          name: (_b2 = member.user) == null ? void 0 : _b2.name,
                          size: "sm",
                          rounded: "full"
                        }, null, 8, ["src", "name"]),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "text-sm font-medium text-base-content truncate" }, toDisplayString(member.display_name || ((_c2 = member.user) == null ? void 0 : _c2.name)), 1)
                        ]),
                        member.role === "Host" ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/15 text-primary"
                        }, "HOST")) : createCommentVNode("", true)
                      ]);
                    }), 128))
                  ])
                ]),
                createVNode("div", { class: "pt-2" }, [
                  !__props.isFull ? (openBlock(), createBlock("button", {
                    key: 0,
                    onClick: confirmJoin,
                    disabled: joining.value,
                    class: "w-full h-12 rounded-xl text-base font-bold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  }, [
                    joining.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "loading loading-spinner loading-sm"
                    })) : createCommentVNode("", true),
                    createTextVNode(" 🏸 ยืนยันเข้าร่วม ")
                  ], 8, ["disabled"])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "w-full h-12 rounded-xl text-base font-bold bg-error/10 text-error flex items-center justify-center"
                  }, " ปาร์ตี้เต็มแล้ว "))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PartyInvitePreview.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
