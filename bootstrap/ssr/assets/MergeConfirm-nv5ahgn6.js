import { ref, unref, withCtx, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, renderList, withDirectives, vModelRadio, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-j6iBrT39.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { Head, router } from "@inertiajs/vue3";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./useLocale-QwrDLuQY.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "MergeConfirm",
  __ssrInlineRender: true,
  props: {
    keepUser: Object,
    mergeUser: Object,
    conflicts: { type: Array, default: () => [] },
    provider: String
  },
  setup(__props) {
    const toast = useToast();
    const props = __props;
    const hasConflicts = props.conflicts.length > 0;
    const chosenName = ref(props.keepUser.name);
    const chosenAvatar = ref(props.keepUser.avatar);
    const merging = ref(false);
    const confirmMerge = () => {
      if (hasConflicts) return;
      merging.value = true;
      router.post(route("linked-accounts.merge.confirm"), {
        name: chosenName.value,
        avatar: chosenAvatar.value
      }, {
        onSuccess: () => {
          toast.add({ severity: "success", summary: "รวมบัญชีเรียบร้อย!", life: 3e3 });
        },
        onError: () => {
          toast.add({ severity: "error", summary: "เกิดข้อผิดพลาด กรุณาลองใหม่", life: 4e3 });
          merging.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "รวมบัญชี" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl p-5 text-center"${_scopeId}><div class="text-3xl mb-2"${_scopeId}>🔗</div><h1 class="text-lg font-bold text-base-content m-0"${_scopeId}>รวมบัญชี</h1><p class="text-xs text-base-content/50 mt-1 m-0"${_scopeId}>พบบัญชีที่ใช้ ${ssrInterpolate((_a = __props.provider) == null ? void 0 : _a.toUpperCase())} เดียวกัน</p></div>`);
            if (hasConflicts) {
              _push2(`<div class="bg-error/10 rounded-2xl border border-error/30 p-4"${_scopeId}><h2 class="text-sm font-bold text-error m-0 mb-2"${_scopeId}>ไม่สามารถรวมบัญชีได้</h2><!--[-->`);
              ssrRenderList(__props.conflicts, (c) => {
                _push2(`<div class="mb-2"${_scopeId}><p class="text-sm text-error/80 m-0 font-semibold"${_scopeId}>${ssrInterpolate(c.message)}</p>`);
                if (c.details) {
                  _push2(`<ul class="text-xs text-error/60 mt-1 pl-4 m-0"${_scopeId}><!--[-->`);
                  ssrRenderList(c.details, (d) => {
                    _push2(`<li${_scopeId}>${ssrInterpolate(d.name || `ปาร์ตี้ #${d.party_id}`)} (${ssrInterpolate(d.play_date)}) </li>`);
                  });
                  _push2(`<!--]--></ul>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--><p class="text-xs text-base-content/60 mt-3 m-0"${_scopeId}> กรุณาให้หัวหน้าก๊วนลบ account ซ้ำออกจากปาร์ตี้ก่อน แล้วลองอีกครั้ง </p><a${ssrRenderAttr("href", _ctx.route("profile.edit"))} class="btn btn-sm btn-outline mt-3 no-underline"${_scopeId}>กลับไปหน้าโปรไฟล์</a></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!hasConflicts) {
              _push2(`<!--[--><div class="grid grid-cols-2 gap-3"${_scopeId}><div class="bg-base-100 rounded-2xl border border-primary/30 p-4 text-center"${_scopeId}><div class="badge badge-primary badge-sm mb-2"${_scopeId}>บัญชีปัจจุบัน</div>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: __props.keepUser.avatar,
                name: __props.keepUser.name,
                size: "xl",
                rounded: "full",
                class: "mx-auto mb-2"
              }, null, _parent2, _scopeId));
              _push2(`<div class="text-sm font-bold text-base-content truncate"${_scopeId}>${ssrInterpolate(__props.keepUser.name)}</div><div class="text-[10px] text-base-content/50 truncate"${_scopeId}>${ssrInterpolate(__props.keepUser.email)}</div>`);
              if (__props.keepUser.mmr) {
                _push2(`<div class="text-[10px] text-primary mt-1"${_scopeId}>MMR ${ssrInterpolate(__props.keepUser.mmr)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="bg-base-100 rounded-2xl border border-warning/30 p-4 text-center"${_scopeId}><div class="badge badge-warning badge-sm mb-2"${_scopeId}>บัญชีที่จะรวม</div>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: __props.mergeUser.avatar,
                name: __props.mergeUser.name,
                size: "xl",
                rounded: "full",
                class: "mx-auto mb-2"
              }, null, _parent2, _scopeId));
              _push2(`<div class="text-sm font-bold text-base-content truncate"${_scopeId}>${ssrInterpolate(__props.mergeUser.name)}</div><div class="text-[10px] text-base-content/50 truncate"${_scopeId}>${ssrInterpolate(__props.mergeUser.email)}</div>`);
              if (__props.mergeUser.mmr) {
                _push2(`<div class="text-[10px] text-primary mt-1"${_scopeId}>MMR ${ssrInterpolate(__props.mergeUser.mmr)}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"${_scopeId}><div class="px-4 py-3 border-b border-base-200"${_scopeId}><h2 class="text-sm font-bold text-base-content m-0"${_scopeId}>เลือกข้อมูลที่ต้องการใช้</h2></div><div class="p-4 space-y-4"${_scopeId}><div${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-2 block"${_scopeId}>ชื่อที่แสดง</label><div class="space-y-2"${_scopeId}><label class="${ssrRenderClass([chosenName.value === __props.keepUser.name ? "border-primary bg-primary/5" : "border-base-300", "flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all"])}"${_scopeId}><input type="radio"${ssrRenderAttr("value", __props.keepUser.name)}${ssrIncludeBooleanAttr(ssrLooseEqual(chosenName.value, __props.keepUser.name)) ? " checked" : ""} class="radio radio-primary radio-sm"${_scopeId}><span class="text-sm"${_scopeId}>${ssrInterpolate(__props.keepUser.name)}</span><span class="badge badge-ghost badge-xs ml-auto"${_scopeId}>ปัจจุบัน</span></label>`);
              if (__props.mergeUser.name !== __props.keepUser.name) {
                _push2(`<label class="${ssrRenderClass([chosenName.value === __props.mergeUser.name ? "border-primary bg-primary/5" : "border-base-300", "flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all"])}"${_scopeId}><input type="radio"${ssrRenderAttr("value", __props.mergeUser.name)}${ssrIncludeBooleanAttr(ssrLooseEqual(chosenName.value, __props.mergeUser.name)) ? " checked" : ""} class="radio radio-primary radio-sm"${_scopeId}><span class="text-sm"${_scopeId}>${ssrInterpolate(__props.mergeUser.name)}</span><span class="badge badge-ghost badge-xs ml-auto"${_scopeId}>${ssrInterpolate(__props.provider)}</span></label>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div><div${_scopeId}><label class="text-xs font-semibold text-base-content/70 mb-2 block"${_scopeId}>รูปโปรไฟล์</label><div class="flex gap-4 justify-center"${_scopeId}><label class="cursor-pointer text-center"${_scopeId}><div class="${ssrRenderClass([chosenAvatar.value === __props.keepUser.avatar ? "border-primary" : "border-transparent", "p-1 rounded-full border-2 transition-all"])}"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: __props.keepUser.avatar,
                name: __props.keepUser.name,
                size: "xl",
                rounded: "full"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="text-[10px] text-base-content/50 mt-1"${_scopeId}>ปัจจุบัน</div></label>`);
              if (__props.mergeUser.avatar && __props.mergeUser.avatar !== __props.keepUser.avatar) {
                _push2(`<label class="cursor-pointer text-center"${_scopeId}><div class="${ssrRenderClass([chosenAvatar.value === __props.mergeUser.avatar ? "border-primary" : "border-transparent", "p-1 rounded-full border-2 transition-all"])}"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  src: __props.mergeUser.avatar,
                  name: __props.mergeUser.name,
                  size: "xl",
                  rounded: "full"
                }, null, _parent2, _scopeId));
                _push2(`</div><div class="text-[10px] text-base-content/50 mt-1"${_scopeId}>${ssrInterpolate(__props.provider)}</div></label>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div></div></div><div class="bg-info/10 rounded-xl p-3"${_scopeId}><p class="text-xs text-info m-0"${_scopeId}> ข้อมูลปาร์ตี้ เกม สถิติ เพื่อน และแชททั้งหมดจะถูกรวมเข้าด้วยกัน บัญชีเก่าจะถูกลบหลังรวมสำเร็จ </p></div><div class="flex gap-3"${_scopeId}><a${ssrRenderAttr("href", _ctx.route("profile.edit"))} class="btn btn-outline flex-1 no-underline"${_scopeId}>ยกเลิก</a><button${ssrIncludeBooleanAttr(merging.value) ? " disabled" : ""} class="btn btn-primary flex-1"${_scopeId}>`);
              if (merging.value) {
                _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
              } else {
                _push2(`<span${_scopeId}>รวมบัญชี</span>`);
              }
              _push2(`</button></div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "bg-gradient-to-br from-warning/10 to-warning/5 rounded-2xl p-5 text-center" }, [
                  createVNode("div", { class: "text-3xl mb-2" }, "🔗"),
                  createVNode("h1", { class: "text-lg font-bold text-base-content m-0" }, "รวมบัญชี"),
                  createVNode("p", { class: "text-xs text-base-content/50 mt-1 m-0" }, "พบบัญชีที่ใช้ " + toDisplayString((_b = __props.provider) == null ? void 0 : _b.toUpperCase()) + " เดียวกัน", 1)
                ]),
                hasConflicts ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-error/10 rounded-2xl border border-error/30 p-4"
                }, [
                  createVNode("h2", { class: "text-sm font-bold text-error m-0 mb-2" }, "ไม่สามารถรวมบัญชีได้"),
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.conflicts, (c) => {
                    return openBlock(), createBlock("div", {
                      key: c.type,
                      class: "mb-2"
                    }, [
                      createVNode("p", { class: "text-sm text-error/80 m-0 font-semibold" }, toDisplayString(c.message), 1),
                      c.details ? (openBlock(), createBlock("ul", {
                        key: 0,
                        class: "text-xs text-error/60 mt-1 pl-4 m-0"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(c.details, (d) => {
                          return openBlock(), createBlock("li", {
                            key: d.party_id
                          }, toDisplayString(d.name || `ปาร์ตี้ #${d.party_id}`) + " (" + toDisplayString(d.play_date) + ") ", 1);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ]);
                  }), 128)),
                  createVNode("p", { class: "text-xs text-base-content/60 mt-3 m-0" }, " กรุณาให้หัวหน้าก๊วนลบ account ซ้ำออกจากปาร์ตี้ก่อน แล้วลองอีกครั้ง "),
                  createVNode("a", {
                    href: _ctx.route("profile.edit"),
                    class: "btn btn-sm btn-outline mt-3 no-underline"
                  }, "กลับไปหน้าโปรไฟล์", 8, ["href"])
                ])) : createCommentVNode("", true),
                !hasConflicts ? (openBlock(), createBlock(Fragment, { key: 1 }, [
                  createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                    createVNode("div", { class: "bg-base-100 rounded-2xl border border-primary/30 p-4 text-center" }, [
                      createVNode("div", { class: "badge badge-primary badge-sm mb-2" }, "บัญชีปัจจุบัน"),
                      createVNode(_sfc_main$2, {
                        src: __props.keepUser.avatar,
                        name: __props.keepUser.name,
                        size: "xl",
                        rounded: "full",
                        class: "mx-auto mb-2"
                      }, null, 8, ["src", "name"]),
                      createVNode("div", { class: "text-sm font-bold text-base-content truncate" }, toDisplayString(__props.keepUser.name), 1),
                      createVNode("div", { class: "text-[10px] text-base-content/50 truncate" }, toDisplayString(__props.keepUser.email), 1),
                      __props.keepUser.mmr ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-[10px] text-primary mt-1"
                      }, "MMR " + toDisplayString(__props.keepUser.mmr), 1)) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "bg-base-100 rounded-2xl border border-warning/30 p-4 text-center" }, [
                      createVNode("div", { class: "badge badge-warning badge-sm mb-2" }, "บัญชีที่จะรวม"),
                      createVNode(_sfc_main$2, {
                        src: __props.mergeUser.avatar,
                        name: __props.mergeUser.name,
                        size: "xl",
                        rounded: "full",
                        class: "mx-auto mb-2"
                      }, null, 8, ["src", "name"]),
                      createVNode("div", { class: "text-sm font-bold text-base-content truncate" }, toDisplayString(__props.mergeUser.name), 1),
                      createVNode("div", { class: "text-[10px] text-base-content/50 truncate" }, toDisplayString(__props.mergeUser.email), 1),
                      __props.mergeUser.mmr ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-[10px] text-primary mt-1"
                      }, "MMR " + toDisplayString(__props.mergeUser.mmr), 1)) : createCommentVNode("", true)
                    ])
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                    createVNode("div", { class: "px-4 py-3 border-b border-base-200" }, [
                      createVNode("h2", { class: "text-sm font-bold text-base-content m-0" }, "เลือกข้อมูลที่ต้องการใช้")
                    ]),
                    createVNode("div", { class: "p-4 space-y-4" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-2 block" }, "ชื่อที่แสดง"),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode("label", {
                            class: ["flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all", chosenName.value === __props.keepUser.name ? "border-primary bg-primary/5" : "border-base-300"]
                          }, [
                            withDirectives(createVNode("input", {
                              type: "radio",
                              value: __props.keepUser.name,
                              "onUpdate:modelValue": ($event) => chosenName.value = $event,
                              class: "radio radio-primary radio-sm"
                            }, null, 8, ["value", "onUpdate:modelValue"]), [
                              [vModelRadio, chosenName.value]
                            ]),
                            createVNode("span", { class: "text-sm" }, toDisplayString(__props.keepUser.name), 1),
                            createVNode("span", { class: "badge badge-ghost badge-xs ml-auto" }, "ปัจจุบัน")
                          ], 2),
                          __props.mergeUser.name !== __props.keepUser.name ? (openBlock(), createBlock("label", {
                            key: 0,
                            class: ["flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all", chosenName.value === __props.mergeUser.name ? "border-primary bg-primary/5" : "border-base-300"]
                          }, [
                            withDirectives(createVNode("input", {
                              type: "radio",
                              value: __props.mergeUser.name,
                              "onUpdate:modelValue": ($event) => chosenName.value = $event,
                              class: "radio radio-primary radio-sm"
                            }, null, 8, ["value", "onUpdate:modelValue"]), [
                              [vModelRadio, chosenName.value]
                            ]),
                            createVNode("span", { class: "text-sm" }, toDisplayString(__props.mergeUser.name), 1),
                            createVNode("span", { class: "badge badge-ghost badge-xs ml-auto" }, toDisplayString(__props.provider), 1)
                          ], 2)) : createCommentVNode("", true)
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "text-xs font-semibold text-base-content/70 mb-2 block" }, "รูปโปรไฟล์"),
                        createVNode("div", { class: "flex gap-4 justify-center" }, [
                          createVNode("label", {
                            class: "cursor-pointer text-center",
                            onClick: ($event) => chosenAvatar.value = __props.keepUser.avatar
                          }, [
                            createVNode("div", {
                              class: ["p-1 rounded-full border-2 transition-all", chosenAvatar.value === __props.keepUser.avatar ? "border-primary" : "border-transparent"]
                            }, [
                              createVNode(_sfc_main$2, {
                                src: __props.keepUser.avatar,
                                name: __props.keepUser.name,
                                size: "xl",
                                rounded: "full"
                              }, null, 8, ["src", "name"])
                            ], 2),
                            createVNode("div", { class: "text-[10px] text-base-content/50 mt-1" }, "ปัจจุบัน")
                          ], 8, ["onClick"]),
                          __props.mergeUser.avatar && __props.mergeUser.avatar !== __props.keepUser.avatar ? (openBlock(), createBlock("label", {
                            key: 0,
                            class: "cursor-pointer text-center",
                            onClick: ($event) => chosenAvatar.value = __props.mergeUser.avatar
                          }, [
                            createVNode("div", {
                              class: ["p-1 rounded-full border-2 transition-all", chosenAvatar.value === __props.mergeUser.avatar ? "border-primary" : "border-transparent"]
                            }, [
                              createVNode(_sfc_main$2, {
                                src: __props.mergeUser.avatar,
                                name: __props.mergeUser.name,
                                size: "xl",
                                rounded: "full"
                              }, null, 8, ["src", "name"])
                            ], 2),
                            createVNode("div", { class: "text-[10px] text-base-content/50 mt-1" }, toDisplayString(__props.provider), 1)
                          ], 8, ["onClick"])) : createCommentVNode("", true)
                        ])
                      ])
                    ])
                  ]),
                  createVNode("div", { class: "bg-info/10 rounded-xl p-3" }, [
                    createVNode("p", { class: "text-xs text-info m-0" }, " ข้อมูลปาร์ตี้ เกม สถิติ เพื่อน และแชททั้งหมดจะถูกรวมเข้าด้วยกัน บัญชีเก่าจะถูกลบหลังรวมสำเร็จ ")
                  ]),
                  createVNode("div", { class: "flex gap-3" }, [
                    createVNode("a", {
                      href: _ctx.route("profile.edit"),
                      class: "btn btn-outline flex-1 no-underline"
                    }, "ยกเลิก", 8, ["href"]),
                    createVNode("button", {
                      onClick: confirmMerge,
                      disabled: merging.value,
                      class: "btn btn-primary flex-1"
                    }, [
                      merging.value ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "loading loading-spinner loading-xs"
                      })) : (openBlock(), createBlock("span", { key: 1 }, "รวมบัญชี"))
                    ], 8, ["disabled"])
                  ])
                ], 64)) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/LinkedAccounts/MergeConfirm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
