import { onMounted, unref, withCtx, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, createTextVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-COXuhfhM.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import "./useLocale-gpJrLIKB.js";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import "./badmintonLayout-Bmnf0xqT.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Admin",
  __ssrInlineRender: true,
  props: {
    stats: { type: Object, default: () => ({}) },
    recentFeedbacks: { type: Array, default: () => [] }
  },
  setup(__props) {
    const toast = useToast();
    const page = usePage();
    const props = __props;
    const menuItems = [
      {
        icon: "🏟️",
        label: "จัดการสนาม",
        desc: "เพิ่ม แก้ไข ลบสนามแบดมินตัน",
        href: "/courts",
        badge: props.stats.totalCourts,
        badgeClass: "badge-info"
      },
      {
        icon: "💬",
        label: "ข้อเสนอแนะ",
        desc: "ดูความคิดเห็น แจ้งปัญหา ขอฟีเจอร์",
        href: "/admin/feedbacks",
        badge: props.stats.pendingFeedbacks,
        badgeClass: "badge-warning"
      },
      {
        icon: "👥",
        label: "ผู้ใช้งาน",
        desc: `ผู้ใช้ทั้งหมด ${props.stats.totalUsers} คน`,
        href: null,
        comingSoon: true
      },
      {
        icon: "🎉",
        label: "ปาร์ตี้",
        desc: `ปาร์ตี้ทั้งหมด ${props.stats.totalParties} รายการ`,
        href: null,
        comingSoon: true
      },
      {
        icon: "⚙️",
        label: "ตั้งค่าระบบ",
        desc: "ตั้งค่าทั่วไป ธีม การแจ้งเตือน",
        href: null,
        comingSoon: true
      }
    ];
    const typeIcon = (type) => {
      const map = { feedback: "💬", feature_request: "💡", bug_report: "🐛" };
      return map[type] || "💬";
    };
    const statusBadgeClass = (status) => {
      const map = { pending: "badge-warning", reviewed: "badge-info", resolved: "badge-success", closed: "badge-ghost" };
      return map[status] || "badge-ghost";
    };
    const statusLabel = (status) => {
      const map = { pending: "รอตรวจสอบ", reviewed: "กำลังพิจารณา", resolved: "แก้ไขแล้ว", closed: "ปิดแล้ว" };
      return map[status] || status;
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      const day = d.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${day} ${months[d.getMonth()]}`;
    };
    onMounted(() => {
      var _a;
      if ((_a = page.props.flash) == null ? void 0 : _a.success) {
        toast.add({ severity: "success", summary: page.props.flash.success, life: 3e3 });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Admin" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center"${_scopeId}><span class="text-2xl"${_scopeId}>⚙️</span></div><div${_scopeId}><div class="text-lg font-bold text-base-content m-0"${_scopeId}>Admin Panel</div><p class="text-xs text-base-content/50 m-0 mt-0.5"${_scopeId}>จัดการระบบ</p></div></div></div><div class="grid grid-cols-4 gap-2"${_scopeId}><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-primary"${_scopeId}>${ssrInterpolate(__props.stats.totalUsers)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>ผู้ใช้</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-info"${_scopeId}>${ssrInterpolate(__props.stats.totalParties)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>ปาร์ตี้</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-secondary"${_scopeId}>${ssrInterpolate(__props.stats.totalCourts)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>สนาม</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-warning"${_scopeId}>${ssrInterpolate(__props.stats.pendingFeedbacks)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>รอตรวจ</div></div></div><div class="space-y-2"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>เมนูจัดการ</div><!--[-->`);
            ssrRenderList(menuItems, (item) => {
              _push2(`<!--[-->`);
              if (item.href) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: item.href,
                  class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<span class="text-2xl"${_scopeId2}>${ssrInterpolate(item.icon)}</span><div class="flex-1"${_scopeId2}><div class="text-sm font-bold text-base-content"${_scopeId2}>${ssrInterpolate(item.label)}</div><div class="text-[10px] text-base-content/50"${_scopeId2}>${ssrInterpolate(item.desc)}</div></div>`);
                      if (item.badge) {
                        _push3(`<span class="${ssrRenderClass([item.badgeClass, "badge badge-sm"])}"${_scopeId2}>${ssrInterpolate(item.badge)}</span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`<svg class="w-4 h-4 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"${_scopeId2}></path></svg>`);
                    } else {
                      return [
                        createVNode("span", { class: "text-2xl" }, toDisplayString(item.icon), 1),
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(item.label), 1),
                          createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(item.desc), 1)
                        ]),
                        item.badge ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: ["badge badge-sm", item.badgeClass]
                        }, toDisplayString(item.badge), 3)) : createCommentVNode("", true),
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 text-base-content/30",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M9 5l7 7-7 7"
                          })
                        ]))
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 opacity-50"${_scopeId}><span class="text-2xl"${_scopeId}>${ssrInterpolate(item.icon)}</span><div class="flex-1"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>${ssrInterpolate(item.label)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate(item.desc)}</div></div><span class="badge badge-xs badge-ghost"${_scopeId}>เร็วๆ นี้</span></div>`);
              }
              _push2(`<!--]-->`);
            });
            _push2(`<!--]--></div>`);
            if (__props.recentFeedbacks.length > 0) {
              _push2(`<div class="space-y-2"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>ข้อเสนอแนะล่าสุด</div>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/admin/feedbacks",
                class: "text-xs text-primary no-underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`ดูทั้งหมด →`);
                  } else {
                    return [
                      createTextVNode("ดูทั้งหมด →")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><!--[-->`);
              ssrRenderList(__props.recentFeedbacks, (fb) => {
                var _a;
                _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-start gap-3"${_scopeId}><span class="text-lg mt-0.5"${_scopeId}>${ssrInterpolate(typeIcon(fb.type))}</span><div class="flex-1 min-w-0"${_scopeId}><div class="text-xs font-bold text-base-content truncate"${_scopeId}>${ssrInterpolate(fb.subject)}</div><div class="text-[10px] text-base-content/50 line-clamp-1"${_scopeId}>${ssrInterpolate(fb.description)}</div><div class="flex items-center gap-2 mt-1"${_scopeId}><span class="text-[10px] text-base-content/40"${_scopeId}>${ssrInterpolate((_a = fb.user) == null ? void 0 : _a.name)} · ${ssrInterpolate(formatDate(fb.created_at))}</span><span class="${ssrRenderClass([statusBadgeClass(fb.status), "badge badge-xs"])}"${_scopeId}>${ssrInterpolate(statusLabel(fb.status))}</span></div></div></div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5" }, [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode("div", { class: "w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center" }, [
                      createVNode("span", { class: "text-2xl" }, "⚙️")
                    ]),
                    createVNode("div", null, [
                      createVNode("div", { class: "text-lg font-bold text-base-content m-0" }, "Admin Panel"),
                      createVNode("p", { class: "text-xs text-base-content/50 m-0 mt-0.5" }, "จัดการระบบ")
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-4 gap-2" }, [
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-lg font-black text-primary" }, toDisplayString(__props.stats.totalUsers), 1),
                    createVNode("div", { class: "text-[9px] text-base-content/50" }, "ผู้ใช้")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-lg font-black text-info" }, toDisplayString(__props.stats.totalParties), 1),
                    createVNode("div", { class: "text-[9px] text-base-content/50" }, "ปาร์ตี้")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-lg font-black text-secondary" }, toDisplayString(__props.stats.totalCourts), 1),
                    createVNode("div", { class: "text-[9px] text-base-content/50" }, "สนาม")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-lg font-black text-warning" }, toDisplayString(__props.stats.pendingFeedbacks), 1),
                    createVNode("div", { class: "text-[9px] text-base-content/50" }, "รอตรวจ")
                  ])
                ]),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("div", { class: "text-sm font-bold text-base-content" }, "เมนูจัดการ"),
                  (openBlock(), createBlock(Fragment, null, renderList(menuItems, (item) => {
                    return openBlock(), createBlock(Fragment, {
                      key: item.label
                    }, [
                      item.href ? (openBlock(), createBlock(unref(Link), {
                        key: 0,
                        href: item.href,
                        class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
                      }, {
                        default: withCtx(() => [
                          createVNode("span", { class: "text-2xl" }, toDisplayString(item.icon), 1),
                          createVNode("div", { class: "flex-1" }, [
                            createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(item.label), 1),
                            createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(item.desc), 1)
                          ]),
                          item.badge ? (openBlock(), createBlock("span", {
                            key: 0,
                            class: ["badge badge-sm", item.badgeClass]
                          }, toDisplayString(item.badge), 3)) : createCommentVNode("", true),
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 text-base-content/30",
                            fill: "none",
                            stroke: "currentColor",
                            "stroke-width": "2",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              d: "M9 5l7 7-7 7"
                            })
                          ]))
                        ]),
                        _: 2
                      }, 1032, ["href"])) : (openBlock(), createBlock("div", {
                        key: 1,
                        class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 opacity-50"
                      }, [
                        createVNode("span", { class: "text-2xl" }, toDisplayString(item.icon), 1),
                        createVNode("div", { class: "flex-1" }, [
                          createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(item.label), 1),
                          createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(item.desc), 1)
                        ]),
                        createVNode("span", { class: "badge badge-xs badge-ghost" }, "เร็วๆ นี้")
                      ]))
                    ], 64);
                  }), 64))
                ]),
                __props.recentFeedbacks.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-2"
                }, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", { class: "text-sm font-bold text-base-content" }, "ข้อเสนอแนะล่าสุด"),
                    createVNode(unref(Link), {
                      href: "/admin/feedbacks",
                      class: "text-xs text-primary no-underline"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("ดูทั้งหมด →")
                      ]),
                      _: 1
                    })
                  ]),
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.recentFeedbacks, (fb) => {
                    var _a;
                    return openBlock(), createBlock("div", {
                      key: fb.id,
                      class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-start gap-3"
                    }, [
                      createVNode("span", { class: "text-lg mt-0.5" }, toDisplayString(typeIcon(fb.type)), 1),
                      createVNode("div", { class: "flex-1 min-w-0" }, [
                        createVNode("div", { class: "text-xs font-bold text-base-content truncate" }, toDisplayString(fb.subject), 1),
                        createVNode("div", { class: "text-[10px] text-base-content/50 line-clamp-1" }, toDisplayString(fb.description), 1),
                        createVNode("div", { class: "flex items-center gap-2 mt-1" }, [
                          createVNode("span", { class: "text-[10px] text-base-content/40" }, toDisplayString((_a = fb.user) == null ? void 0 : _a.name) + " · " + toDisplayString(formatDate(fb.created_at)), 1),
                          createVNode("span", {
                            class: ["badge badge-xs", statusBadgeClass(fb.status)]
                          }, toDisplayString(statusLabel(fb.status)), 3)
                        ])
                      ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
