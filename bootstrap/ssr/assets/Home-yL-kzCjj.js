import { ref, onMounted, onUnmounted, unref, withCtx, createVNode, resolveDynamicComponent, createTextVNode, createBlock, toDisplayString, openBlock, createCommentVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderVNode, ssrRenderClass } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-j6iBrT39.js";
import { usePage, Head, Link } from "@inertiajs/vue3";
import "./useLocale-QwrDLuQY.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./LocaleSwitcher-DHf7bxTb.js";
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
        image: "/images/carousel/party-members-cartoon.jpg",
        imageLg: "/images/carousel/party-members-cartoon-lg.jpg",
        title: "สร้างปาร์ตี้ หาเพื่อนใหม่",
        subtitle: "ระบบสร้างปาร์ตี้อัจฉริยะ ค้นหาเพื่อนร่วมก๊วนที่มีระดับฝีมือใกล้เคียงกัน",
        cta: "หาปาร์ตี้",
        href: "/party-lists"
      },
      {
        image: "/images/carousel/public-private-cartoon.jpg",
        imageLg: "/images/carousel/public-private-cartoon-lg.jpg",
        title: "เข้าร่วมได้ทุกรูปแบบ",
        subtitle: "เลือกเข้าร่วมปาร์ตี้สาธารณะ หรือสร้างห้องส่วนตัวสำหรับก๊วนของคุณเอง",
        cta: "สร้างปาร์ตี้",
        href: "/party-create"
      },
      {
        image: "/images/carousel/auto-balance.jpg",
        imageLg: "/images/carousel/auto-balance-lg.jpg",
        title: "ระบบจัดเกมอัตโนมัติ",
        subtitle: "บลาลานซ์ทักษะ เกลี่ยจำนวนเกม และจัดลำดับความสำคัญให้ทุกคนสนุกเท่ากัน",
        cta: "ดูวิธีการ",
        href: "/tutorial"
      },
      {
        image: "/images/carousel/realtime-stats.jpg",
        imageLg: "/images/carousel/realtime-stats-lg.jpg",
        title: "ข้อมูลแบบ Real-time",
        subtitle: "บอกระยะเวลารอ จำนวนเกมที่เล่น และจำนวนลูกขนไก่ที่ใช้ไปแบบวินาทีต่อวินาที",
        cta: "ร่วมปาร์ตี้",
        href: "/party-lists"
      },
      {
        image: "/images/carousel/player-stats.jpg",
        imageLg: "/images/carousel/player-stats-lg.jpg",
        title: "สถิติและประวัติการเล่น",
        subtitle: "บันทึกทุกแมตซ์ วิเคราะห์ผลงาน และอัปเลเวลเพื่อพัฒนาฝีมืออย่างต่อเนื่อง",
        cta: "ดูสถิติของฉัน",
        href: "/profile"
      },
      {
        image: "/images/carousel/social-friends.jpg",
        imageLg: "/images/carousel/social-friends-lg.jpg",
        title: "สังคมแบดมินตันครบวงจร",
        subtitle: "ระบบเพื่อน แชทพูดคุย และนัดหมายการเล่นได้สะดวกทุกที่ทุกเวลา",
        cta: "ดูรายชื่อเพื่อน",
        href: "/friends"
      },
      {
        image: "/images/carousel/line-signup.jpg",
        imageLg: "/images/carousel/line-signup-lg.jpg",
        title: "สมัครง่ายผ่าน LINE",
        subtitle: "เพียงแอด LINE @badmintonparty ก็เริ่มใช้งานและรับการแจ้งเตือนได้ทันที",
        cta: "แอดไลน์",
        href: "https://line.me/R/ti/p/@badmintonparty",
        external: true
      },
      {
        image: "/images/carousel/free-badge.jpg",
        imageLg: "/images/carousel/free-badge-lg.jpg",
        title: "ใช้งานฟรี! ไม่มีค่าใช้จ่าย",
        subtitle: "ร่วมสร้างคอมมูนิตี้แบดมินตันที่สนุกและเป็นธรรมได้ฟรีวันนี้",
        cta: "เริ่มเลย",
        href: "/register"
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
      { icon: "⚖️", title: "Smart Matchmaking", desc: "บาลานซ์ทีมตาม MMR และจำนวนเกมที่เล่น" },
      { icon: "📈", title: "Performance Tracking", desc: "วิเคราะห์ฟอร์มการเล่นและสถิติรายบุคคล" },
      { icon: "💬", title: "Community & Connect", desc: "เชื่อมต่อกับก๊วนแบดผ่าน Chat และ Friend System" }
    ];
    const quickActions = [
      { icon: "🏸", label: "หาปาร์ตี้", href: "/party-lists", color: "bg-green-100 text-green-700" },
      { icon: "🎮", label: "ปาร์ตี้ของฉัน", href: "/my-parties", color: "bg-blue-100 text-blue-700" },
      { icon: "💬", label: "แชท", href: "/chat", color: "bg-purple-100 text-purple-700", badge: "unreadChatCount" },
      { icon: "👤", label: "โปรไฟล์", href: "/profile", color: "bg-orange-100 text-orange-700" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Home" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6 pb-8 bg-slate-50/50 min-h-screen" data-v-9eebb34e${_scopeId}><div class="relative group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4" data-v-9eebb34e${_scopeId}><div class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-[2.5rem] shadow-xl relative z-0 bg-white" style="${ssrRenderStyle({ "scroll-behavior": "smooth", "-webkit-overflow-scrolling": "touch" })}" data-v-9eebb34e${_scopeId}><!--[-->`);
            ssrRenderList(slides, (slide, i) => {
              _push2(`<div class="w-full shrink-0 snap-center relative aspect-[4/3] md:h-[420px] lg:h-[480px] overflow-hidden" data-v-9eebb34e${_scopeId}><picture data-v-9eebb34e${_scopeId}><source${ssrRenderAttr("srcset", slide.imageLg)} media="(min-width: 768px)" data-v-9eebb34e${_scopeId}><img${ssrRenderAttr("src", slide.image)} class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" alt="" data-v-9eebb34e${_scopeId}></picture><div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" data-v-9eebb34e${_scopeId}></div><div class="absolute inset-0 p-8 flex flex-col justify-end text-white" data-v-9eebb34e${_scopeId}><div class="animate-slide-up transform transition-all duration-500" data-v-9eebb34e${_scopeId}><h2 class="text-3xl md:text-5xl font-black mb-2 leading-tight tracking-tight" style="${ssrRenderStyle({ "text-shadow": "0 2px 8px rgba(0,0,0,0.5)" })}" data-v-9eebb34e${_scopeId}>${ssrInterpolate(slide.title)}</h2><p class="text-sm md:text-lg opacity-95 max-w-xl mb-6 font-medium leading-relaxed" style="${ssrRenderStyle({ "text-shadow": "0 1px 4px rgba(0,0,0,0.4)" })}" data-v-9eebb34e${_scopeId}>${ssrInterpolate(slide.subtitle)}</p><div class="flex items-center gap-4" data-v-9eebb34e${_scopeId}>`);
              ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(slide.external ? "a" : unref(Link)), {
                href: slide.href,
                target: slide.external ? "_blank" : null,
                class: "btn btn-primary border-none h-12 px-8 rounded-2xl text-sm font-black no-underline flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(slide.cta)} `);
                    if (!slide.external) {
                      _push3(`<span data-v-9eebb34e${_scopeId2}>→</span>`);
                    } else {
                      _push3(`<span data-v-9eebb34e${_scopeId2}>➚</span>`);
                    }
                  } else {
                    return [
                      createTextVNode(toDisplayString(slide.cta) + " ", 1),
                      !slide.external ? (openBlock(), createBlock("span", { key: 0 }, "→")) : (openBlock(), createBlock("span", { key: 1 }, "➚"))
                    ];
                  }
                }),
                _: 2
              }), _parent2, _scopeId);
              _push2(`</div></div></div></div>`);
            });
            _push2(`<!--]--></div><div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10" data-v-9eebb34e${_scopeId}><!--[-->`);
            ssrRenderList(slides, (_2, i) => {
              _push2(`<button class="${ssrRenderClass([currentSlide.value === i ? "bg-primary w-8" : "bg-white/30 backdrop-blur-md", "w-2 h-2 rounded-full border-0 cursor-pointer transition-all duration-300 shadow-sm"])}" data-v-9eebb34e${_scopeId}></button>`);
            });
            _push2(`<!--]--></div></div>`);
            if (unref(user)) {
              _push2(`<div class="grid grid-cols-2 gap-2" data-v-9eebb34e${_scopeId}><!--[-->`);
              ssrRenderList(quickActions, (action) => {
                _push2(ssrRenderComponent(unref(Link), {
                  key: action.href,
                  href: action.href,
                  class: "rounded-xl p-3 flex items-center gap-2.5 no-underline transition-all hover:scale-[0.98] active:scale-[0.96] border border-base-300 bg-base-100 relative"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="${ssrRenderClass([action.color, "w-10 h-10 rounded-xl flex items-center justify-center text-xl"])}" data-v-9eebb34e${_scopeId2}>${ssrInterpolate(action.icon)}</div><span class="text-xs font-semibold text-base-content" data-v-9eebb34e${_scopeId2}>${ssrInterpolate(action.label)}</span>`);
                      if (action.badge && unref(page).props[action.badge] > 0) {
                        _push3(`<span class="absolute top-2 right-2 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold" data-v-9eebb34e${_scopeId2}>${ssrInterpolate(unref(page).props[action.badge])}</span>`);
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
              _push2(`<div class="bg-base-100 rounded-2xl border border-base-300 p-5 text-center" data-v-9eebb34e${_scopeId}><span class="text-4xl block mb-2" data-v-9eebb34e${_scopeId}>🏸</span><h2 class="text-lg font-bold text-base-content m-0 mb-1" data-v-9eebb34e${_scopeId}>Badminton Party</h2><p class="text-xs text-base-content/60 m-0 mb-4" data-v-9eebb34e${_scopeId}>เข้าสู่ระบบเพื่อเริ่มใช้งาน</p><div class="flex justify-center gap-2" data-v-9eebb34e${_scopeId}>`);
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
            _push2(`<div class="space-y-2" data-v-9eebb34e${_scopeId}><h3 class="text-sm font-bold text-base-content/70 m-0 px-1" data-v-9eebb34e${_scopeId}>คุณสมบัติ</h3><!--[-->`);
            ssrRenderList(features, (feat) => {
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3" data-v-9eebb34e${_scopeId}><div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0" data-v-9eebb34e${_scopeId}>${ssrInterpolate(feat.icon)}</div><div data-v-9eebb34e${_scopeId}><div class="text-xs font-bold text-base-content" data-v-9eebb34e${_scopeId}>${ssrInterpolate(feat.title)}</div><div class="text-[10px] text-base-content/50" data-v-9eebb34e${_scopeId}>${ssrInterpolate(feat.desc)}</div></div></div>`);
            });
            _push2(`<!--]--></div><div class="relative overflow-hidden rounded-2xl border-2 border-primary/30 p-6 text-center bg-primary/10" data-v-9eebb34e${_scopeId}><div class="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 pointer-events-none" data-v-9eebb34e${_scopeId}></div><div class="relative z-10" data-v-9eebb34e${_scopeId}><span class="text-4xl block mb-3" data-v-9eebb34e${_scopeId}>🏆</span><h2 class="text-xl font-black text-primary m-0 mb-1" data-v-9eebb34e${_scopeId}>พร้อมตีแบดหรือยัง?</h2><p class="text-xs text-base-content/60 m-0 mb-5" data-v-9eebb34e${_scopeId}>เข้าร่วมปาร์ตี้ หรือดูสถิติของคุณ</p><div class="flex flex-col gap-2 max-w-xs mx-auto" data-v-9eebb34e${_scopeId}>`);
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
              createVNode("div", { class: "space-y-6 pb-8 bg-slate-50/50 min-h-screen" }, [
                createVNode("div", { class: "relative group max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4" }, [
                  createVNode("div", {
                    ref_key: "carouselRef",
                    ref: carouselRef,
                    class: "flex overflow-x-auto snap-x snap-mandatory scrollbar-hide rounded-[2.5rem] shadow-xl relative z-0 bg-white",
                    style: { "scroll-behavior": "smooth", "-webkit-overflow-scrolling": "touch" },
                    onScroll: handleScroll
                  }, [
                    (openBlock(), createBlock(Fragment, null, renderList(slides, (slide, i) => {
                      return createVNode("div", {
                        key: i,
                        class: "w-full shrink-0 snap-center relative aspect-[4/3] md:h-[420px] lg:h-[480px] overflow-hidden"
                      }, [
                        createVNode("picture", null, [
                          createVNode("source", {
                            srcset: slide.imageLg,
                            media: "(min-width: 768px)"
                          }, null, 8, ["srcset"]),
                          createVNode("img", {
                            src: slide.image,
                            class: "absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105",
                            alt: ""
                          }, null, 8, ["src"])
                        ]),
                        createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" }),
                        createVNode("div", { class: "absolute inset-0 p-8 flex flex-col justify-end text-white" }, [
                          createVNode("div", { class: "animate-slide-up transform transition-all duration-500" }, [
                            createVNode("h2", {
                              class: "text-3xl md:text-5xl font-black mb-2 leading-tight tracking-tight",
                              style: { "text-shadow": "0 2px 8px rgba(0,0,0,0.5)" }
                            }, toDisplayString(slide.title), 1),
                            createVNode("p", {
                              class: "text-sm md:text-lg opacity-95 max-w-xl mb-6 font-medium leading-relaxed",
                              style: { "text-shadow": "0 1px 4px rgba(0,0,0,0.4)" }
                            }, toDisplayString(slide.subtitle), 1),
                            createVNode("div", { class: "flex items-center gap-4" }, [
                              (openBlock(), createBlock(resolveDynamicComponent(slide.external ? "a" : unref(Link)), {
                                href: slide.href,
                                target: slide.external ? "_blank" : null,
                                class: "btn btn-primary border-none h-12 px-8 rounded-2xl text-sm font-black no-underline flex items-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(slide.cta) + " ", 1),
                                  !slide.external ? (openBlock(), createBlock("span", { key: 0 }, "→")) : (openBlock(), createBlock("span", { key: 1 }, "➚"))
                                ]),
                                _: 2
                              }, 1032, ["href", "target"]))
                            ])
                          ])
                        ])
                      ]);
                    }), 64))
                  ], 544),
                  createVNode("div", { class: "absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(slides, (_2, i) => {
                      return createVNode("button", {
                        key: i,
                        onClick: ($event) => scrollToSlide(i),
                        class: ["w-2 h-2 rounded-full border-0 cursor-pointer transition-all duration-300 shadow-sm", currentSlide.value === i ? "bg-primary w-8" : "bg-white/30 backdrop-blur-md"]
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
const Home = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9eebb34e"]]);
export {
  Home as default
};
