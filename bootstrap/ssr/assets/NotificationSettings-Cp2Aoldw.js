import { reactive, ref, onMounted, unref, withCtx, createBlock, openBlock, createVNode, createCommentVNode, toDisplayString, withDirectives, vModelCheckbox, Fragment, renderList, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-C4Zuyavh.js";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./useLocale-BkZfXvwr.js";
import "./LocaleSwitcher-41-e_7Js.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "NotificationSettings",
  __ssrInlineRender: true,
  props: {
    settings: { type: Object, default: () => ({}) },
    recentLogs: { type: Array, default: () => [] },
    hasLineAccount: { type: Boolean, default: false }
  },
  setup(__props) {
    const toast = useToast();
    const page = usePage();
    const props = __props;
    const form = reactive({
      enabled: props.settings.enabled ?? true,
      party_invite: props.settings.party_invite ?? true,
      party_reminder: props.settings.party_reminder ?? true,
      game_start: props.settings.game_start ?? true,
      game_result: props.settings.game_result ?? true,
      friend_request: props.settings.friend_request ?? true,
      party_member_joined: props.settings.party_member_joined ?? true
    });
    const saving = ref(false);
    const testing = ref(false);
    const notifTypes = [
      { key: "party_invite", icon: "🎉", label: "ถูกเชิญเข้าปาร์ตี้", desc: "เมื่อมีคนเชิญคุณเข้าร่วมปาร์ตี้" },
      { key: "party_reminder", icon: "⏰", label: "เตือนก่อนเล่น", desc: "แจ้งเตือนก่อนถึงเวลาเล่น" },
      { key: "game_start", icon: "🏸", label: "เกมเริ่มแล้ว", desc: "เมื่อเกมที่คุณอยู่เริ่มเล่น" },
      { key: "game_result", icon: "🏆", label: "ผลเกม", desc: "สรุปผลเกมเมื่อเล่นจบ" },
      { key: "friend_request", icon: "👋", label: "คำขอเป็นเพื่อน", desc: "เมื่อมีคนส่งคำขอเป็นเพื่อน" },
      { key: "party_member_joined", icon: "👥", label: "สมาชิกใหม่เข้าปาร์ตี้", desc: "เมื่อมีคนเข้าร่วมปาร์ตี้ของคุณ" }
    ];
    const saveSettings = () => {
      saving.value = true;
      router.patch("/notifications/settings", form, {
        preserveScroll: true,
        onSuccess: () => {
          toast.add({ severity: "success", summary: "บันทึกการตั้งค่าเรียบร้อย", life: 2e3 });
        },
        onFinish: () => {
          saving.value = false;
        }
      });
    };
    const sendTest = () => {
      testing.value = true;
      router.post("/notifications/test", {}, {
        preserveScroll: true,
        onSuccess: () => {
          var _a, _b;
          if ((_a = page.props.flash) == null ? void 0 : _a.success) {
            toast.add({ severity: "success", summary: page.props.flash.success, life: 3e3 });
          } else if ((_b = page.props.flash) == null ? void 0 : _b.error) {
            toast.add({ severity: "error", summary: page.props.flash.error, life: 3e3 });
          }
        },
        onFinish: () => {
          testing.value = false;
        }
      });
    };
    const statusIcon = (status) => {
      const map = { sent: "✅", failed: "❌", skipped: "⏭️", pending: "⏳" };
      return map[status] || "❓";
    };
    const typeIcon = (type) => {
      const map = { party_invite: "🎉", party_reminder: "⏰", game_start: "🏸", game_result: "🏆", friend_request: "👋", party_member_joined: "👥" };
      return map[type] || "🔔";
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      const day = d.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      return `${day} ${months[d.getMonth()]} ${h}:${m}`;
    };
    onMounted(() => {
      var _a;
      if ((_a = page.props.flash) == null ? void 0 : _a.success) {
        toast.add({ severity: "success", summary: page.props.flash.success, life: 3e3 });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "ตั้งค่าแจ้งเตือน" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/profile",
              class: "w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center no-underline hover:bg-base-300 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"${_scopeId2}></path></svg>`);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4 text-base-content/60",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M15 19l-7-7 7-7"
                      })
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div${_scopeId}><div class="text-lg font-bold text-base-content m-0"${_scopeId}>ตั้งค่าแจ้งเตือน</div><p class="text-xs text-base-content/50 m-0"${_scopeId}>แจ้งเตือนผ่าน LINE OA</p></div></div><div class="${ssrRenderClass([__props.hasLineAccount ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30", "rounded-xl border p-3 flex items-center gap-3"])}"${_scopeId}><span class="text-2xl"${_scopeId}>${ssrInterpolate(__props.hasLineAccount ? "✅" : "⚠️")}</span><div class="flex-1"${_scopeId}><div class="${ssrRenderClass([__props.hasLineAccount ? "text-success" : "text-warning", "text-xs font-bold"])}"${_scopeId}>${ssrInterpolate(__props.hasLineAccount ? "เชื่อมต่อ LINE แล้ว" : "ยังไม่ได้เชื่อมต่อ LINE")}</div><div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate(__props.hasLineAccount ? "พร้อมรับแจ้งเตือนผ่าน LINE OA" : "ต้องล็อกอินด้วย LINE เพื่อรับแจ้งเตือน")}</div></div></div><div class="bg-base-100 rounded-xl border border-base-300 p-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><span class="text-2xl"${_scopeId}>🔔</span><div${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>เปิดแจ้งเตือนทั้งหมด</div><div class="text-[10px] text-base-content/50"${_scopeId}>เปิด/ปิดการแจ้งเตือน LINE ทุกประเภท</div></div></div><input type="checkbox" class="toggle toggle-primary toggle-sm"${ssrIncludeBooleanAttr(Array.isArray(form.enabled) ? ssrLooseContain(form.enabled, null) : form.enabled) ? " checked" : ""}${_scopeId}></div></div>`);
            if (form.enabled) {
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden"${_scopeId}><div class="px-4 py-2.5 border-b border-base-200"${_scopeId}><div class="text-xs font-bold text-base-content/60 uppercase tracking-wide"${_scopeId}>ประเภทแจ้งเตือน</div></div><!--[-->`);
              ssrRenderList(notifTypes, (nt, idx) => {
                _push2(`<div class="${ssrRenderClass([{ "border-t border-base-200": idx > 0 }, "flex items-center justify-between px-4 py-3"])}"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><span class="text-lg"${_scopeId}>${ssrInterpolate(nt.icon)}</span><div${_scopeId}><div class="text-xs font-semibold text-base-content"${_scopeId}>${ssrInterpolate(nt.label)}</div><div class="text-[10px] text-base-content/40"${_scopeId}>${ssrInterpolate(nt.desc)}</div></div></div><input type="checkbox" class="toggle toggle-primary toggle-xs"${ssrIncludeBooleanAttr(Array.isArray(form[nt.key]) ? ssrLooseContain(form[nt.key], null) : form[nt.key]) ? " checked" : ""}${_scopeId}></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.hasLineAccount) {
              _push2(`<button${ssrIncludeBooleanAttr(testing.value || !form.enabled) ? " disabled" : ""} class="w-full h-10 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all active:scale-[0.98] bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"${_scopeId}>`);
              if (testing.value) {
                _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(testing.value ? "กำลังส่ง..." : "🧪 ทดสอบส่งแจ้งเตือน")}</button>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.recentLogs.length > 0) {
              _push2(`<div class="space-y-2"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>ประวัติแจ้งเตือน</div><!--[-->`);
              ssrRenderList(__props.recentLogs, (log) => {
                _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-start gap-3"${_scopeId}><span class="text-sm mt-0.5"${_scopeId}>${ssrInterpolate(typeIcon(log.type))}</span><div class="flex-1 min-w-0"${_scopeId}><div class="text-xs font-bold text-base-content truncate"${_scopeId}>${ssrInterpolate(log.title)}</div><div class="text-[10px] text-base-content/50 line-clamp-1"${_scopeId}>${ssrInterpolate(log.message)}</div><div class="text-[10px] text-base-content/40 mt-0.5"${_scopeId}>${ssrInterpolate(formatDate(log.created_at))}</div></div><span class="text-sm shrink-0"${_scopeId}>${ssrInterpolate(statusIcon(log.status))}</span></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  createVNode(unref(Link), {
                    href: "/profile",
                    class: "w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center no-underline hover:bg-base-300 transition-colors"
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4 text-base-content/60",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M15 19l-7-7 7-7"
                        })
                      ]))
                    ]),
                    _: 1
                  }),
                  createVNode("div", null, [
                    createVNode("div", { class: "text-lg font-bold text-base-content m-0" }, "ตั้งค่าแจ้งเตือน"),
                    createVNode("p", { class: "text-xs text-base-content/50 m-0" }, "แจ้งเตือนผ่าน LINE OA")
                  ])
                ]),
                createVNode("div", {
                  class: ["rounded-xl border p-3 flex items-center gap-3", __props.hasLineAccount ? "bg-success/10 border-success/30" : "bg-warning/10 border-warning/30"]
                }, [
                  createVNode("span", { class: "text-2xl" }, toDisplayString(__props.hasLineAccount ? "✅" : "⚠️"), 1),
                  createVNode("div", { class: "flex-1" }, [
                    createVNode("div", {
                      class: ["text-xs font-bold", __props.hasLineAccount ? "text-success" : "text-warning"]
                    }, toDisplayString(__props.hasLineAccount ? "เชื่อมต่อ LINE แล้ว" : "ยังไม่ได้เชื่อมต่อ LINE"), 3),
                    createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(__props.hasLineAccount ? "พร้อมรับแจ้งเตือนผ่าน LINE OA" : "ต้องล็อกอินด้วย LINE เพื่อรับแจ้งเตือน"), 1)
                  ])
                ], 2),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4" }, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", { class: "flex items-center gap-3" }, [
                      createVNode("span", { class: "text-2xl" }, "🔔"),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-sm font-bold text-base-content" }, "เปิดแจ้งเตือนทั้งหมด"),
                        createVNode("div", { class: "text-[10px] text-base-content/50" }, "เปิด/ปิดการแจ้งเตือน LINE ทุกประเภท")
                      ])
                    ]),
                    withDirectives(createVNode("input", {
                      type: "checkbox",
                      class: "toggle toggle-primary toggle-sm",
                      "onUpdate:modelValue": ($event) => form.enabled = $event,
                      onChange: saveSettings
                    }, null, 40, ["onUpdate:modelValue"]), [
                      [vModelCheckbox, form.enabled]
                    ])
                  ])
                ]),
                form.enabled ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-base-100 rounded-xl border border-base-300 overflow-hidden"
                }, [
                  createVNode("div", { class: "px-4 py-2.5 border-b border-base-200" }, [
                    createVNode("div", { class: "text-xs font-bold text-base-content/60 uppercase tracking-wide" }, "ประเภทแจ้งเตือน")
                  ]),
                  (openBlock(), createBlock(Fragment, null, renderList(notifTypes, (nt, idx) => {
                    return createVNode("div", {
                      key: nt.key,
                      class: ["flex items-center justify-between px-4 py-3", { "border-t border-base-200": idx > 0 }]
                    }, [
                      createVNode("div", { class: "flex items-center gap-3" }, [
                        createVNode("span", { class: "text-lg" }, toDisplayString(nt.icon), 1),
                        createVNode("div", null, [
                          createVNode("div", { class: "text-xs font-semibold text-base-content" }, toDisplayString(nt.label), 1),
                          createVNode("div", { class: "text-[10px] text-base-content/40" }, toDisplayString(nt.desc), 1)
                        ])
                      ]),
                      withDirectives(createVNode("input", {
                        type: "checkbox",
                        class: "toggle toggle-primary toggle-xs",
                        "onUpdate:modelValue": ($event) => form[nt.key] = $event,
                        onChange: saveSettings
                      }, null, 40, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, form[nt.key]]
                      ])
                    ], 2);
                  }), 64))
                ])) : createCommentVNode("", true),
                __props.hasLineAccount ? (openBlock(), createBlock("button", {
                  key: 1,
                  onClick: sendTest,
                  disabled: testing.value || !form.enabled,
                  class: "w-full h-10 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all active:scale-[0.98] bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                }, [
                  testing.value ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "loading loading-spinner loading-xs"
                  })) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(testing.value ? "กำลังส่ง..." : "🧪 ทดสอบส่งแจ้งเตือน"), 1)
                ], 8, ["disabled"])) : createCommentVNode("", true),
                __props.recentLogs.length > 0 ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "space-y-2"
                }, [
                  createVNode("div", { class: "text-sm font-bold text-base-content" }, "ประวัติแจ้งเตือน"),
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.recentLogs, (log) => {
                    return openBlock(), createBlock("div", {
                      key: log.id,
                      class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-start gap-3"
                    }, [
                      createVNode("span", { class: "text-sm mt-0.5" }, toDisplayString(typeIcon(log.type)), 1),
                      createVNode("div", { class: "flex-1 min-w-0" }, [
                        createVNode("div", { class: "text-xs font-bold text-base-content truncate" }, toDisplayString(log.title), 1),
                        createVNode("div", { class: "text-[10px] text-base-content/50 line-clamp-1" }, toDisplayString(log.message), 1),
                        createVNode("div", { class: "text-[10px] text-base-content/40 mt-0.5" }, toDisplayString(formatDate(log.created_at)), 1)
                      ]),
                      createVNode("span", { class: "text-sm shrink-0" }, toDisplayString(statusIcon(log.status)), 1)
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/NotificationSettings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
