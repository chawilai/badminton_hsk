import { ref, onMounted, onUnmounted, unref, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-DvUwNqCw.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import "./useLocale-gpJrLIKB.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./badmintonLayout-Bmnf0xqT.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./useToast-DyaFeJ92.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Home",
  __ssrInlineRender: true,
  setup(__props) {
    var _a;
    const page = usePage();
    const user = (_a = page.props.auth) == null ? void 0 : _a.user;
    const slides = [
      {
        icon: "🏸",
        title: "จัดปาร์ตี้แบดมินตัน",
        subtitle: "สร้างปาร์ตี้ จัดเกม ลงผล ครบจบในที่เดียว",
        cta: "หาปาร์ตี้",
        href: "/party-lists",
        gradient: "from-primary/20 to-success/10"
      },
      {
        icon: "📊",
        title: "ติดตามสถิติ",
        subtitle: "ดูผลงาน Win Rate แคลอรี่ที่เผาผลาญ",
        cta: "ดูสถิติ",
        href: "/profile",
        gradient: "from-info/20 to-primary/10"
      },
      {
        icon: "💬",
        title: "แชทกับเพื่อน",
        subtitle: "คุยกับก๊วนแบด นัดเล่นได้ง่ายๆ",
        cta: "เปิดแชท",
        href: "/chat",
        gradient: "from-secondary/20 to-info/10"
      },
      {
        icon: "👥",
        title: "ระบบเพื่อน",
        subtitle: "เพิ่มเพื่อน ดูสถิติเทียบกัน",
        cta: "ดูเพื่อน",
        href: "/friends",
        gradient: "from-accent/20 to-warning/10"
      }
    ];
    const currentSlide = ref(0);
    const carouselRef = ref(null);
    let autoScrollInterval = null;
    const scrollToSlide = (index) => {
      currentSlide.value = index;
      if (carouselRef.value) {
        const slideWidth = carouselRef.value.offsetWidth;
        carouselRef.value.scrollTo({ left: slideWidth * index, behavior: "smooth" });
      }
    };
    const handleScroll = () => {
      if (carouselRef.value) {
        const slideWidth = carouselRef.value.offsetWidth;
        currentSlide.value = Math.round(carouselRef.value.scrollLeft / slideWidth);
      }
    };
    onMounted(() => {
      autoScrollInterval = setInterval(() => {
        const next = (currentSlide.value + 1) % slides.length;
        scrollToSlide(next);
      }, 5e3);
    });
    onUnmounted(() => {
      if (autoScrollInterval) clearInterval(autoScrollInterval);
    });
    const features = [
      { icon: "🎯", title: "จัดเกมอัตโนมัติ", desc: "ระบบ Auto Balance จัดทีมให้สมดุลตามเลเวล" },
      { icon: "⏱️", title: "ติดตามเวลาเล่น", desc: "นับเวลา แคลอรี่ สถิติครบถ้วน" },
      { icon: "🔔", title: "แจ้งเตือน Realtime", desc: "อัพเดทเกมทันทีผ่าน WebSocket" }
    ];
    const quickActions = [
      { icon: "🏸", label: "หาปาร์ตี้", href: "/party-lists", color: "bg-success/10 text-success" },
      { icon: "🎮", label: "ปาร์ตี้ของฉัน", href: "/my-parties", color: "bg-info/10 text-info" },
      { icon: "💬", label: "แชท", href: "/chat", color: "bg-secondary/10 text-secondary", badge: "unreadChatCount" },
      { icon: "👤", label: "โปรไฟล์", href: "/profile", color: "bg-warning/10 text-warning" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Home" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4" data-v-3ef30373${_scopeId}><div class="relative" data-v-3ef30373${_scopeId}><div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl" style="${ssrRenderStyle({ "scroll-behavior": "smooth", "-webkit-overflow-scrolling": "touch" })}" data-v-3ef30373${_scopeId}><!--[-->`);
            ssrRenderList(slides, (slide, i) => {
              _push2(`<div class="w-full shrink-0 snap-center" data-v-3ef30373${_scopeId}><div class="${ssrRenderClass([slide.gradient, "bg-gradient-to-br rounded-2xl p-6 min-h-[180px] flex flex-col justify-between"])}" data-v-3ef30373${_scopeId}><div data-v-3ef30373${_scopeId}><span class="text-4xl mb-2 block" data-v-3ef30373${_scopeId}>${ssrInterpolate(slide.icon)}</span><h2 class="text-lg font-bold text-base-content m-0 mb-1" data-v-3ef30373${_scopeId}>${ssrInterpolate(slide.title)}</h2><p class="text-xs text-base-content/60 m-0" data-v-3ef30373${_scopeId}>${ssrInterpolate(slide.subtitle)}</p></div>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: slide.href,
                class: "self-start mt-3 h-8 px-4 rounded-lg bg-primary text-white text-xs font-semibold no-underline flex items-center gap-1 hover:bg-primary/80 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(slide.cta)} →`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(slide.cta) + " →", 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div><div class="flex justify-center gap-1.5 mt-2" data-v-3ef30373${_scopeId}><!--[-->`);
            ssrRenderList(slides, (_2, i) => {
              _push2(`<button class="${ssrRenderClass([currentSlide.value === i ? "bg-primary w-5" : "bg-base-300", "w-2 h-2 rounded-full border-0 cursor-pointer transition-all"])}" data-v-3ef30373${_scopeId}></button>`);
            });
            _push2(`<!--]--></div></div>`);
            if (unref(user)) {
              _push2(`<div class="grid grid-cols-2 gap-2" data-v-3ef30373${_scopeId}><!--[-->`);
              ssrRenderList(quickActions, (action) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: action.href,
                  href: action.href,
                  class: "rounded-xl p-3 flex items-center gap-2.5 no-underline transition-all hover:scale-[0.98] active:scale-[0.96] border border-base-300 bg-base-100 relative"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="${ssrRenderClass([action.color, "w-10 h-10 rounded-xl flex items-center justify-center text-xl"])}" data-v-3ef30373${_scopeId2}>${ssrInterpolate(action.icon)}</div><span class="text-xs font-semibold text-base-content" data-v-3ef30373${_scopeId2}>${ssrInterpolate(action.label)}</span>`);
                      if (action.badge && unref(page).props[action.badge] > 0) {
                        _push3(`<span class="absolute top-2 right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold" data-v-3ef30373${_scopeId2}>${ssrInterpolate(unref(page).props[action.badge])}</span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                    } else {
                      return [
                        createVNode("div", {
                          class: ["w-10 h-10 rounded-xl flex items-center justify-center text-xl", action.color]
                        }, toDisplayString(action.icon), 3),
                        createVNode("span", { class: "text-xs font-semibold text-base-content" }, toDisplayString(action.label), 1),
                        action.badge && unref(page).props[action.badge] > 0 ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "absolute top-2 right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold"
                        }, toDisplayString(unref(page).props[action.badge]), 1)) : createCommentVNode("", true)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="bg-base-100 rounded-2xl border border-base-300 p-5 text-center" data-v-3ef30373${_scopeId}><span class="text-4xl block mb-2" data-v-3ef30373${_scopeId}>🏸</span><h2 class="text-lg font-bold text-base-content m-0 mb-1" data-v-3ef30373${_scopeId}>Badminton Party</h2><p class="text-xs text-base-content/60 m-0 mb-4" data-v-3ef30373${_scopeId}>เข้าสู่ระบบเพื่อเริ่มใช้งาน</p><div class="flex justify-center gap-2" data-v-3ef30373${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/login",
                class: "h-9 px-5 rounded-lg bg-primary text-white text-sm font-semibold no-underline flex items-center hover:bg-primary/80 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`เข้าสู่ระบบ`);
                  } else {
                    return [
                      createTextVNode("เข้าสู่ระบบ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(Link), {
                href: "/register",
                class: "h-9 px-5 rounded-lg bg-base-200 text-base-content text-sm font-semibold no-underline flex items-center hover:bg-base-300 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`สมัครสมาชิก`);
                  } else {
                    return [
                      createTextVNode("สมัครสมาชิก")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
            }
            _push2(`<div class="space-y-2" data-v-3ef30373${_scopeId}><h3 class="text-sm font-bold text-base-content/70 m-0 px-1" data-v-3ef30373${_scopeId}>คุณสมบัติ</h3><!--[-->`);
            ssrRenderList(features, (feat) => {
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3" data-v-3ef30373${_scopeId}><div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0" data-v-3ef30373${_scopeId}>${ssrInterpolate(feat.icon)}</div><div data-v-3ef30373${_scopeId}><div class="text-xs font-bold text-base-content" data-v-3ef30373${_scopeId}>${ssrInterpolate(feat.title)}</div><div class="text-[10px] text-base-content/50" data-v-3ef30373${_scopeId}>${ssrInterpolate(feat.desc)}</div></div></div>`);
            });
            _push2(`<!--]--></div><div class="relative overflow-hidden rounded-2xl border-2 border-primary/30 p-6 text-center bg-primary/10" data-v-3ef30373${_scopeId}><div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none" data-v-3ef30373${_scopeId}></div><div class="relative z-10" data-v-3ef30373${_scopeId}><span class="text-4xl block mb-3" data-v-3ef30373${_scopeId}>🏆</span><h2 class="text-xl font-black text-primary m-0 mb-1" data-v-3ef30373${_scopeId}>พร้อมตีแบดหรือยัง?</h2><p class="text-xs text-base-content/60 m-0 mb-5" data-v-3ef30373${_scopeId}>เข้าร่วมปาร์ตี้ หรือดูสถิติของคุณ</p><div class="flex flex-col gap-2 max-w-xs mx-auto" data-v-3ef30373${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/party-lists",
              class: "h-11 rounded-xl bg-primary text-primary-content text-sm font-bold no-underline flex items-center justify-center gap-2 hover:bg-primary/80 transition-all active:scale-[0.98] shadow-lg shadow-primary/30"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`🏸 หาปาร์ตี้เลย`);
                } else {
                  return [
                    createTextVNode("🏸 หาปาร์ตี้เลย")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/profile",
              class: "h-10 rounded-xl bg-base-100 text-base-content text-sm font-semibold no-underline flex items-center justify-center gap-2 hover:bg-base-200 transition-colors border border-base-300"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`📊 ดูสถิติของฉัน`);
                } else {
                  return [
                    createTextVNode("📊 ดูสถิติของฉัน")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "relative" }, [
                  createVNode("div", {
                    ref_key: "carouselRef",
                    ref: carouselRef,
                    class: "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-2xl",
                    style: { "scroll-behavior": "smooth", "-webkit-overflow-scrolling": "touch" },
                    onScroll: handleScroll
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(slides, (slide, i) => {
                      return createVNode("div", {
                        key: i,
                        class: "w-full shrink-0 snap-center"
                      }, [
                        createVNode("div", {
                          class: ["bg-gradient-to-br rounded-2xl p-6 min-h-[180px] flex flex-col justify-between", slide.gradient]
                        }, [
                          createVNode("div", null, [
                            createVNode("span", { class: "text-4xl mb-2 block" }, toDisplayString(slide.icon), 1),
                            createVNode("h2", { class: "text-lg font-bold text-base-content m-0 mb-1" }, toDisplayString(slide.title), 1),
                            createVNode("p", { class: "text-xs text-base-content/60 m-0" }, toDisplayString(slide.subtitle), 1)
                          ]),
                          createVNode(unref(Link), {
                            href: slide.href,
                            class: "self-start mt-3 h-8 px-4 rounded-lg bg-primary text-white text-xs font-semibold no-underline flex items-center gap-1 hover:bg-primary/80 transition-colors"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(slide.cta) + " →", 1)
                            ]),
                            _: 2
                          }, 1032, ["href"])
                        ], 2)
                      ]);
                    }), 64))
                  ], 544),
                  createVNode("div", { class: "flex justify-center gap-1.5 mt-2" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(slides, (_2, i) => {
                      return createVNode("button", {
                        key: i,
                        onClick: ($event) => scrollToSlide(i),
                        class: ["w-2 h-2 rounded-full border-0 cursor-pointer transition-all", currentSlide.value === i ? "bg-primary w-5" : "bg-base-300"]
                      }, null, 10, ["onClick"]);
                    }), 64))
                  ])
                ]),
                unref(user) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "grid grid-cols-2 gap-2"
                }, [
                  (openBlock(), createBlock(Fragment, null, renderList(quickActions, (action) => {
                    return createVNode(unref(Link), {
                      key: action.href,
                      href: action.href,
                      class: "rounded-xl p-3 flex items-center gap-2.5 no-underline transition-all hover:scale-[0.98] active:scale-[0.96] border border-base-300 bg-base-100 relative"
                    }, {
                      default: withCtx(() => [
                        createVNode("div", {
                          class: ["w-10 h-10 rounded-xl flex items-center justify-center text-xl", action.color]
                        }, toDisplayString(action.icon), 3),
                        createVNode("span", { class: "text-xs font-semibold text-base-content" }, toDisplayString(action.label), 1),
                        action.badge && unref(page).props[action.badge] > 0 ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "absolute top-2 right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold"
                        }, toDisplayString(unref(page).props[action.badge]), 1)) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1032, ["href"]);
                  }), 64))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "bg-base-100 rounded-2xl border border-base-300 p-5 text-center"
                }, [
                  createVNode("span", { class: "text-4xl block mb-2" }, "🏸"),
                  createVNode("h2", { class: "text-lg font-bold text-base-content m-0 mb-1" }, "Badminton Party"),
                  createVNode("p", { class: "text-xs text-base-content/60 m-0 mb-4" }, "เข้าสู่ระบบเพื่อเริ่มใช้งาน"),
                  createVNode("div", { class: "flex justify-center gap-2" }, [
                    createVNode(unref(Link), {
                      href: "/login",
                      class: "h-9 px-5 rounded-lg bg-primary text-white text-sm font-semibold no-underline flex items-center hover:bg-primary/80 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("เข้าสู่ระบบ")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Link), {
                      href: "/register",
                      class: "h-9 px-5 rounded-lg bg-base-200 text-base-content text-sm font-semibold no-underline flex items-center hover:bg-base-300 transition-colors"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("สมัครสมาชิก")
                      ]),
                      _: 1
                    })
                  ])
                ])),
                createVNode("div", { class: "space-y-2" }, [
                  createVNode("h3", { class: "text-sm font-bold text-base-content/70 m-0 px-1" }, "คุณสมบัติ"),
                  (openBlock(), createBlock(Fragment, null, renderList(features, (feat) => {
                    return createVNode("div", {
                      key: feat.title,
                      class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
                    }, [
                      createVNode("div", { class: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0" }, toDisplayString(feat.icon), 1),
                      createVNode("div", null, [
                        createVNode("div", { class: "text-xs font-bold text-base-content" }, toDisplayString(feat.title), 1),
                        createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(feat.desc), 1)
                      ])
                    ]);
                  }), 64))
                ]),
                createVNode("div", { class: "relative overflow-hidden rounded-2xl border-2 border-primary/30 p-6 text-center bg-primary/10" }, [
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none" }),
                  createVNode("div", { class: "relative z-10" }, [
                    createVNode("span", { class: "text-4xl block mb-3" }, "🏆"),
                    createVNode("h2", { class: "text-xl font-black text-primary m-0 mb-1" }, "พร้อมตีแบดหรือยัง?"),
                    createVNode("p", { class: "text-xs text-base-content/60 m-0 mb-5" }, "เข้าร่วมปาร์ตี้ หรือดูสถิติของคุณ"),
                    createVNode("div", { class: "flex flex-col gap-2 max-w-xs mx-auto" }, [
                      createVNode(unref(Link), {
                        href: "/party-lists",
                        class: "h-11 rounded-xl bg-primary text-primary-content text-sm font-bold no-underline flex items-center justify-center gap-2 hover:bg-primary/80 transition-all active:scale-[0.98] shadow-lg shadow-primary/30"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("🏸 หาปาร์ตี้เลย")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(Link), {
                        href: "/profile",
                        class: "h-10 rounded-xl bg-base-100 text-base-content text-sm font-semibold no-underline flex items-center justify-center gap-2 hover:bg-base-200 transition-colors border border-base-300"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("📊 ดูสถิติของฉัน")
                        ]),
                        _: 1
                      })
                    ])
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Home.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3ef30373"]]);
export {
  Home as default
};
