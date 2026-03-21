import { onMounted, computed, ref, unref, withCtx, createBlock, createTextVNode, openBlock, createVNode, createCommentVNode, toDisplayString, withDirectives, Fragment, renderList, vShow, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-BPNdCb7L.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import { _ as _sfc_main$3 } from "./MmrBadge-cgcVUpf7.js";
import { g as getSkillLevelLabel, _ as _sfc_main$4 } from "./skillLevelDescriptions-BhqdlqaI.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Profile",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useLocale();
    const toast = useToast();
    const page = usePage();
    onMounted(() => {
      var _a;
      if ((_a = page.props.flash) == null ? void 0 : _a.success) {
        toast.add({ severity: "success", summary: page.props.flash.success, life: 3e3 });
      }
    });
    const user = computed(() => page.props.profileUser || page.props.auth.user);
    const mmrLevel = computed(() => page.props.mmrLevel);
    const stats = computed(() => page.props.stats || {});
    const recentParties = computed(() => page.props.recentParties || []);
    const recentGames = computed(() => page.props.recentGames || []);
    const skillAssessment = computed(() => page.props.skillAssessment || null);
    const skillIcons = {
      serve: "🏸",
      smash: "💥",
      clear: "🌈",
      net_play: "🕸️",
      defense: "🛡️",
      backhand: "🔄",
      deception: "🎭",
      footwork: "👟",
      speed: "⚡",
      stamina: "❤️‍🔥"
    };
    const skillLabels = {
      serve: "เสิร์ฟ",
      smash: "สแมช",
      clear: "เคลียร์",
      net_play: "หน้าเน็ต",
      defense: "เกมรับ",
      backhand: "แบ็คแฮนด์",
      deception: "ลูกหลอก",
      footwork: "ฟุตเวิร์ค",
      speed: "ความเร็ว",
      stamina: "สตามิน่า"
    };
    const topStrengths = computed(() => {
      if (!skillAssessment.value) return [];
      return Object.entries(skillAssessment.value).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([key, value]) => ({
        key,
        label: skillLabels[key],
        icon: skillIcons[key],
        value,
        levelLabel: getSkillLevelLabel(key, value, locale.value)
      }));
    });
    const filteredStats = computed(() => page.props.filteredStats || {});
    const statsPeriod = ref(page.props.statsPeriod || "month");
    const availableMonths = computed(() => page.props.availableMonths || []);
    const filterYear = ref(page.props.filterYear);
    const filterMonth = ref(page.props.filterMonth);
    const activeTab = ref("overview");
    const changePeriod = (period) => {
      statsPeriod.value = period;
      router.get("/profile", { period, year: filterYear.value, month: filterMonth.value }, {
        preserveScroll: true,
        preserveState: true,
        only: ["filteredStats", "statsPeriod"]
      });
    };
    const periodLabel = computed(() => {
      if (statsPeriod.value === "week") return "อาทิตย์นี้";
      if (statsPeriod.value === "month") return "เดือนนี้";
      return "ทั้งหมด";
    });
    const thaiMonths = ["", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const availableYears = computed(() => {
      const years = [...new Set(availableMonths.value.map((m) => m.year))];
      return years.sort((a, b) => b - a);
    });
    const monthsForSelectedYear = computed(() => {
      return availableMonths.value.filter((m) => m.year === filterYear.value).map((m) => m.month).sort((a, b) => b - a);
    });
    const changeFilter = (year, month) => {
      filterYear.value = year;
      filterMonth.value = month;
      router.get("/profile", { year, month }, {
        preserveScroll: true,
        preserveState: true,
        only: ["recentGames", "filterYear", "filterMonth"]
      });
    };
    const onYearChange = (e) => {
      const year = parseInt(e.target.value);
      const months = availableMonths.value.filter((m) => m.year === year).map((m) => m.month).sort((a, b) => b - a);
      const month = months[0] || 1;
      changeFilter(year, month);
    };
    const formatPlayTime = (seconds) => {
      if (!seconds) return "0 น.";
      const h = Math.floor(seconds / 3600);
      const m = Math.floor(seconds % 3600 / 60);
      if (h > 0) return `${h} ชม. ${m} น.`;
      return `${m} น.`;
    };
    const estimateCalories = (seconds) => Math.round(seconds / 60 * 7);
    const genderLabel = (g) => {
      const map = { male: "ชาย", female: "หญิง", other: "อื่นๆ" };
      return map[g] || "-";
    };
    const formatDate = (d) => {
      if (!d) return "-";
      return (/* @__PURE__ */ new Date(d + "T00:00:00")).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Profile" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b;
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              src: user.value.avatar,
              name: user.value.name,
              size: "2xl",
              rounded: "full",
              class: "mx-auto border-4 border-base-100 shadow-lg mb-3"
            }, null, _parent2, _scopeId));
            _push2(`<h1 class="text-lg font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(user.value.name)}</h1><p class="text-xs text-base-content/50 m-0 mt-0.5"${_scopeId}>${ssrInterpolate(user.value.email)}</p>`);
            if (user.value.id === ((_a = unref(page).props.auth.user) == null ? void 0 : _a.id)) {
              _push2(ssrRenderComponent(unref(Link), {
                href: _ctx.route("profile.edit"),
                class: "inline-flex items-center gap-1 mt-1.5 px-3 py-1 rounded-lg bg-base-content/10 text-[11px] text-base-content/60 no-underline hover:bg-base-content/20 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"${_scopeId2}></path></svg> แก้ไขโปรไฟล์ `);
                  } else {
                    return [
                      (openBlock(), createBlock("svg", {
                        class: "w-3 h-3",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        })
                      ])),
                      createTextVNode(" แก้ไขโปรไฟล์ ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="flex items-center justify-center gap-2 mt-2"${_scopeId}>`);
            if (mmrLevel.value) {
              _push2(ssrRenderComponent(_sfc_main$3, {
                level: mmrLevel.value.level,
                tierName: unref(locale) === "th" ? mmrLevel.value.name_th : mmrLevel.value.name_en,
                tierColor: mmrLevel.value.tier_color,
                size: "md"
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (user.value.gender) {
              _push2(`<span class="badge badge-sm badge-ghost"${_scopeId}>${ssrInterpolate(genderLabel(user.value.gender))}</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
            if (user.value.mmr) {
              _push2(`<div class="flex items-center justify-center gap-3 mt-2"${_scopeId}><div class="text-center"${_scopeId}><div class="text-lg font-black text-primary"${_scopeId}>${ssrInterpolate(user.value.mmr)}</div><div class="text-[9px] text-base-content/40 uppercase"${_scopeId}>MMR</div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="flex gap-1 p-1 bg-base-200 rounded-xl"${_scopeId}><!--[-->`);
            ssrRenderList([{ key: "week", label: "อาทิตย์นี้" }, { key: "month", label: "เดือนนี้" }, { key: "all", label: "ทั้งหมด" }], (p) => {
              _push2(`<button class="${ssrRenderClass([statsPeriod.value === p.key ? "bg-primary text-primary-content" : "bg-transparent text-base-content/50 hover:text-base-content", "flex-1 py-2 px-3 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"])}"${_scopeId}>${ssrInterpolate(p.label)}</button>`);
            });
            _push2(`<!--]--></div><div class="grid grid-cols-4 gap-2"${_scopeId}><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-xl font-black text-primary"${_scopeId}>${ssrInterpolate(statsPeriod.value === "all" ? stats.value.totalGames : filteredStats.value.totalGames || 0)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>เกม</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-xl font-black text-success"${_scopeId}>${ssrInterpolate(statsPeriod.value === "all" ? stats.value.gamesWon : filteredStats.value.gamesWon || 0)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>ชนะ</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-xl font-black text-warning"${_scopeId}>${ssrInterpolate(statsPeriod.value === "all" ? stats.value.winRate : filteredStats.value.winRate || 0)}%</div><div class="text-[10px] text-base-content/50"${_scopeId}>Win Rate</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-accent"${_scopeId}>${ssrInterpolate(formatPlayTime(statsPeriod.value === "all" ? stats.value.totalPlaySeconds : filteredStats.value.totalPlaySeconds))}</div><div class="text-[10px] text-base-content/50"${_scopeId}>เวลาเล่น</div></div></div>`);
            if (statsPeriod.value !== "all") {
              _push2(`<div class="grid grid-cols-3 gap-2"${_scopeId}><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-xl font-black text-info"${_scopeId}>${ssrInterpolate(stats.value.partiesJoined || 0)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>ปาร์ตี้รวม</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-xl font-black text-secondary"${_scopeId}>${ssrInterpolate(stats.value.courtsVisited || 0)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>สนาม</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-xl font-black text-primary"${_scopeId}>${ssrInterpolate(stats.value.totalGames || 0)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>เกมรวม</div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((statsPeriod.value === "all" ? stats.value.totalPlaySeconds : filteredStats.value.totalPlaySeconds) > 0) {
              _push2(`<div class="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 rounded-xl border border-orange-200/50 p-3 flex items-center justify-between"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="text-2xl"${_scopeId}>🔥</span><div${_scopeId}><div class="text-xs font-bold text-orange-600"${_scopeId}>แคลอรี่ที่เผาผลาญ</div><div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate(periodLabel.value)} · ประมาณ ~7 kcal/นาที</div></div></div><div class="text-xl font-black text-orange-600"${_scopeId}>${ssrInterpolate(estimateCalories(statsPeriod.value === "all" ? stats.value.totalPlaySeconds : filteredStats.value.totalPlaySeconds).toLocaleString())} kcal</div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (stats.value.mostPlayedWith) {
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: stats.value.mostPlayedWith.avatar,
                name: stats.value.mostPlayedWith.name,
                size: "lg",
                rounded: "full",
                class: "border-2 border-primary/30"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex-1"${_scopeId}><div class="text-[10px] font-bold text-primary uppercase tracking-wider"${_scopeId}>คู่หูขาประจำ</div><div class="text-sm font-bold text-base-content"${_scopeId}>${ssrInterpolate(stats.value.mostPlayedWith.name)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>เล่นด้วยกัน ${ssrInterpolate(stats.value.mostPlayedWith.count)} เกม</div></div><span class="text-2xl"${_scopeId}>🤝</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (skillAssessment.value) {
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-4"${_scopeId}><div class="flex items-center justify-between mb-2"${_scopeId}><div class="text-xs font-bold text-primary uppercase tracking-wider"${_scopeId}>🎯 ทักษะของคุณ</div>`);
              _push2(ssrRenderComponent(unref(Link), {
                href: "/skill-assessment",
                class: "text-[10px] text-primary font-semibold no-underline hover:underline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`ประเมินใหม่`);
                  } else {
                    return [
                      createTextVNode("ประเมินใหม่")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_sfc_main$4, {
                skills: skillAssessment.value,
                size: 280,
                class: "mx-auto"
              }, null, _parent2, _scopeId));
              _push2(`<div class="flex gap-2 mt-3 justify-center flex-wrap"${_scopeId}><!--[-->`);
              ssrRenderList(topStrengths.value, (s) => {
                _push2(`<span class="badge badge-primary badge-outline badge-sm gap-1 font-semibold"${_scopeId}>${ssrInterpolate(s.icon)} ${ssrInterpolate(s.label)} ${ssrInterpolate(s.value)} — ${ssrInterpolate(s.levelLabel)}</span>`);
              });
              _push2(`<!--]--></div><div class="text-center mt-2 text-[10px] text-base-content/40"${_scopeId}> เฉียบคมด้าน: <span class="font-bold text-primary"${_scopeId}>${ssrInterpolate(topStrengths.value.map((s) => s.label).join(", "))}</span></div></div>`);
            } else {
              _push2(ssrRenderComponent(unref(Link), {
                href: "/skill-assessment",
                class: "bg-base-100 rounded-xl border border-base-300 border-dashed p-4 text-center no-underline hover:bg-base-200 transition-colors block"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<span class="text-3xl block mb-2"${_scopeId2}>🎯</span><div class="text-sm font-bold text-base-content"${_scopeId2}>ทำแบบประเมินทักษะ</div><div class="text-[10px] text-base-content/50 mt-0.5"${_scopeId2}>ประเมินทักษะ 10 ด้าน แสดงผลเป็นกราฟเรดาร์</div>`);
                  } else {
                    return [
                      createVNode("span", { class: "text-3xl block mb-2" }, "🎯"),
                      createVNode("div", { class: "text-sm font-bold text-base-content" }, "ทำแบบประเมินทักษะ"),
                      createVNode("div", { class: "text-[10px] text-base-content/50 mt-0.5" }, "ประเมินทักษะ 10 ด้าน แสดงผลเป็นกราฟเรดาร์")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            }
            _push2(ssrRenderComponent(unref(Link), {
              href: "/friends",
              class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-2xl"${_scopeId2}>👥</span><div class="flex-1"${_scopeId2}><div class="text-sm font-bold text-base-content"${_scopeId2}>${ssrInterpolate(unref(t)("friends.title"))}</div><div class="text-[10px] text-base-content/50"${_scopeId2}>จัดการรายชื่อเพื่อน</div></div>`);
                  if (unref(page).props.pendingFriendCount > 0) {
                    _push3(`<span class="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold"${_scopeId2}>${ssrInterpolate(unref(page).props.pendingFriendCount)}</span>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<svg class="w-4 h-4 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"${_scopeId2}></path></svg>`);
                } else {
                  return [
                    createVNode("span", { class: "text-2xl" }, "👥"),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(unref(t)("friends.title")), 1),
                      createVNode("div", { class: "text-[10px] text-base-content/50" }, "จัดการรายชื่อเพื่อน")
                    ]),
                    unref(page).props.pendingFriendCount > 0 ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold"
                    }, toDisplayString(unref(page).props.pendingFriendCount), 1)) : createCommentVNode("", true),
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
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/notifications/settings",
              class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-2xl"${_scopeId2}>🔔</span><div class="flex-1"${_scopeId2}><div class="text-sm font-bold text-base-content"${_scopeId2}>ตั้งค่าแจ้งเตือน</div><div class="text-[10px] text-base-content/50"${_scopeId2}>แจ้งเตือนผ่าน LINE OA</div></div><svg class="w-4 h-4 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"${_scopeId2}></path></svg>`);
                } else {
                  return [
                    createVNode("span", { class: "text-2xl" }, "🔔"),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("div", { class: "text-sm font-bold text-base-content" }, "ตั้งค่าแจ้งเตือน"),
                      createVNode("div", { class: "text-[10px] text-base-content/50" }, "แจ้งเตือนผ่าน LINE OA")
                    ]),
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
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Link), {
              href: "/feedback",
              class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<span class="text-2xl"${_scopeId2}>💬</span><div class="flex-1"${_scopeId2}><div class="text-sm font-bold text-base-content"${_scopeId2}>${ssrInterpolate(unref(t)("feedback.title"))}</div><div class="text-[10px] text-base-content/50"${_scopeId2}>${ssrInterpolate(unref(t)("feedback.subtitle"))}</div></div><svg class="w-4 h-4 text-base-content/30" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"${_scopeId2}></path></svg>`);
                } else {
                  return [
                    createVNode("span", { class: "text-2xl" }, "💬"),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(unref(t)("feedback.title")), 1),
                      createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(unref(t)("feedback.subtitle")), 1)
                    ]),
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
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex gap-1 p-1 bg-base-200 rounded-xl"${_scopeId}><!--[-->`);
            ssrRenderList([{ key: "overview", label: "ประวัติเกม" }, { key: "parties", label: "ปาร์ตี้" }], (tab) => {
              _push2(`<button class="${ssrRenderClass([activeTab.value === tab.key ? "bg-primary text-primary-content" : "bg-transparent text-base-content/50 hover:text-base-content", "flex-1 py-2 px-3 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"])}"${_scopeId}>${ssrInterpolate(tab.label)}</button>`);
            });
            _push2(`<!--]--></div><div style="${ssrRenderStyle(activeTab.value === "overview" ? null : { display: "none" })}"${_scopeId}>`);
            if (availableMonths.value.length > 0) {
              _push2(`<div class="flex items-center gap-2 mb-3"${_scopeId}><select${ssrRenderAttr("value", filterYear.value)} class="select select-sm select-bordered bg-base-100 text-sm font-semibold min-h-0 h-8"${_scopeId}><!--[-->`);
              ssrRenderList(availableYears.value, (y) => {
                _push2(`<option${ssrRenderAttr("value", y)}${_scopeId}>${ssrInterpolate(y + 543)}</option>`);
              });
              _push2(`<!--]--></select><div class="flex gap-1 flex-1 overflow-x-auto scrollbar-hide"${_scopeId}><!--[-->`);
              ssrRenderList(monthsForSelectedYear.value, (m) => {
                _push2(`<button class="${ssrRenderClass([filterMonth.value === m ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/60 hover:bg-base-300", "px-3 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all whitespace-nowrap"])}"${_scopeId}>${ssrInterpolate(thaiMonths[m])}</button>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (recentGames.value.length === 0) {
              _push2(`<div class="text-center py-8 bg-base-100 rounded-xl border border-base-300"${_scopeId}><span class="text-3xl"${_scopeId}>🏸</span><p class="text-xs text-base-content/50 mt-2 m-0"${_scopeId}>ไม่มีเกมในเดือนนี้</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(recentGames.value, (game) => {
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"${_scopeId}><div class="${ssrRenderClass([game.won ? "bg-success/15 text-success" : game.won === false ? "bg-error/15 text-error" : "bg-base-200 text-base-content/40", "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold"])}"${_scopeId}>${ssrInterpolate(game.won ? "W" : game.won === false ? "L" : "-")}</div><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-1.5"${_scopeId}><span class="text-xs font-bold text-base-content"${_scopeId}>${ssrInterpolate(game.score || "?-?")}</span><span class="text-[10px] text-base-content/40"${_scopeId}>${ssrInterpolate(game.court_name)}</span></div><div class="flex items-center gap-1 mt-0.5"${_scopeId}><span class="text-[9px] text-base-content/50"${_scopeId}>กับ</span><div class="flex -space-x-1"${_scopeId}><!--[-->`);
              ssrRenderList(game.teammates, (tm, i) => {
                _push2(ssrRenderComponent(_sfc_main$2, {
                  key: i,
                  src: tm.avatar,
                  name: tm.name,
                  size: "xs",
                  rounded: "full",
                  class: "border border-base-100"
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div><span class="text-[9px] text-base-content/50 mx-0.5"${_scopeId}>vs</span><div class="flex -space-x-1"${_scopeId}><!--[-->`);
              ssrRenderList(game.opponents, (op, i) => {
                _push2(ssrRenderComponent(_sfc_main$2, {
                  key: i,
                  src: op.avatar,
                  name: op.name,
                  size: "xs",
                  rounded: "full",
                  class: "border border-base-100"
                }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div></div></div><div class="text-right shrink-0"${_scopeId}>`);
              if (game.mmr_change != null) {
                _push2(`<div class="${ssrRenderClass([game.mmr_change > 0 ? "text-success" : game.mmr_change < 0 ? "text-error" : "text-base-content/40", "text-xs font-bold"])}"${_scopeId}>${ssrInterpolate(game.mmr_change > 0 ? "+" : "")}${ssrInterpolate(game.mmr_change)} MMR</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="text-[10px] text-base-content/40"${_scopeId}>${ssrInterpolate(formatDate(game.play_date))}</div>`);
              if (game.duration_seconds) {
                _push2(`<div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate(formatPlayTime(game.duration_seconds))}</div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div></div><div style="${ssrRenderStyle(activeTab.value === "parties" ? null : { display: "none" })}"${_scopeId}>`);
            if (recentParties.value.length === 0) {
              _push2(`<div class="text-center py-8 bg-base-100 rounded-xl border border-base-300"${_scopeId}><span class="text-3xl"${_scopeId}>🎉</span><p class="text-xs text-base-content/50 mt-2 m-0"${_scopeId}>ยังไม่มีประวัติปาร์ตี้</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
            ssrRenderList(recentParties.value, (party) => {
              _push2(ssrRenderComponent(unref(Link), {
                key: party.id,
                href: `/party/${party.id}`,
                class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a2, _b2;
                  if (_push3) {
                    _push3(`<div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"${_scopeId2}><span class="text-sm"${_scopeId2}>🏟️</span></div><div class="flex-1 min-w-0"${_scopeId2}><div class="text-xs font-bold text-base-content truncate"${_scopeId2}>${ssrInterpolate(party.court_name)}</div><div class="text-[10px] text-base-content/50"${_scopeId2}>${ssrInterpolate(formatDate(party.play_date))} · ${ssrInterpolate((_a2 = party.start_time) == null ? void 0 : _a2.substring(0, 5))}</div></div><div class="text-right shrink-0"${_scopeId2}><div class="text-[10px] text-base-content/50"${_scopeId2}>${ssrInterpolate(party.games_count)} เกม</div><div class="text-[10px] text-base-content/40"${_scopeId2}>${ssrInterpolate(party.members_count)} คน</div></div><span class="${ssrRenderClass([{
                      "badge-success": party.status === "Open",
                      "badge-warning": party.status === "Full",
                      "badge-neutral": party.status === "Over"
                    }, "badge badge-xs"])}"${_scopeId2}>${ssrInterpolate(party.status)}</span>`);
                  } else {
                    return [
                      createVNode("div", { class: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" }, [
                        createVNode("span", { class: "text-sm" }, "🏟️")
                      ]),
                      createVNode("div", { class: "flex-1 min-w-0" }, [
                        createVNode("div", { class: "text-xs font-bold text-base-content truncate" }, toDisplayString(party.court_name), 1),
                        createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(formatDate(party.play_date)) + " · " + toDisplayString((_b2 = party.start_time) == null ? void 0 : _b2.substring(0, 5)), 1)
                      ]),
                      createVNode("div", { class: "text-right shrink-0" }, [
                        createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(party.games_count) + " เกม", 1),
                        createVNode("div", { class: "text-[10px] text-base-content/40" }, toDisplayString(party.members_count) + " คน", 1)
                      ]),
                      createVNode("span", {
                        class: ["badge badge-xs", {
                          "badge-success": party.status === "Open",
                          "badge-warning": party.status === "Full",
                          "badge-neutral": party.status === "Over"
                        }]
                      }, toDisplayString(party.status), 3)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div><div class="pt-2"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              as: "button",
              href: _ctx.route("logout"),
              method: "post",
              class: "w-full h-10 rounded-xl text-sm font-medium bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors flex items-center justify-center gap-2"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"${_scopeId2}></path></svg> ${ssrInterpolate(unref(t)("nav.logout"))}`);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      })
                    ])),
                    createTextVNode(" " + toDisplayString(unref(t)("nav.logout")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center" }, [
                  createVNode(_sfc_main$2, {
                    src: user.value.avatar,
                    name: user.value.name,
                    size: "2xl",
                    rounded: "full",
                    class: "mx-auto border-4 border-base-100 shadow-lg mb-3"
                  }, null, 8, ["src", "name"]),
                  createVNode("h1", { class: "text-lg font-bold text-base-content m-0" }, toDisplayString(user.value.name), 1),
                  createVNode("p", { class: "text-xs text-base-content/50 m-0 mt-0.5" }, toDisplayString(user.value.email), 1),
                  user.value.id === ((_b = unref(page).props.auth.user) == null ? void 0 : _b.id) ? (openBlock(), createBlock(unref(Link), {
                    key: 0,
                    href: _ctx.route("profile.edit"),
                    class: "inline-flex items-center gap-1 mt-1.5 px-3 py-1 rounded-lg bg-base-content/10 text-[11px] text-base-content/60 no-underline hover:bg-base-content/20 transition-colors"
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock("svg", {
                        class: "w-3 h-3",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        })
                      ])),
                      createTextVNode(" แก้ไขโปรไฟล์ ")
                    ]),
                    _: 1
                  }, 8, ["href"])) : createCommentVNode("", true),
                  createVNode("div", { class: "flex items-center justify-center gap-2 mt-2" }, [
                    mmrLevel.value ? (openBlock(), createBlock(_sfc_main$3, {
                      key: 0,
                      level: mmrLevel.value.level,
                      tierName: unref(locale) === "th" ? mmrLevel.value.name_th : mmrLevel.value.name_en,
                      tierColor: mmrLevel.value.tier_color,
                      size: "md"
                    }, null, 8, ["level", "tierName", "tierColor"])) : createCommentVNode("", true),
                    user.value.gender ? (openBlock(), createBlock("span", {
                      key: 1,
                      class: "badge badge-sm badge-ghost"
                    }, toDisplayString(genderLabel(user.value.gender)), 1)) : createCommentVNode("", true)
                  ]),
                  user.value.mmr ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "flex items-center justify-center gap-3 mt-2"
                  }, [
                    createVNode("div", { class: "text-center" }, [
                      createVNode("div", { class: "text-lg font-black text-primary" }, toDisplayString(user.value.mmr), 1),
                      createVNode("div", { class: "text-[9px] text-base-content/40 uppercase" }, "MMR")
                    ])
                  ])) : createCommentVNode("", true)
                ]),
                createVNode("div", { class: "flex gap-1 p-1 bg-base-200 rounded-xl" }, [
                  (openBlock(), createBlock(Fragment, null, renderList([{ key: "week", label: "อาทิตย์นี้" }, { key: "month", label: "เดือนนี้" }, { key: "all", label: "ทั้งหมด" }], (p) => {
                    return createVNode("button", {
                      key: p.key,
                      class: ["flex-1 py-2 px-3 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all", statsPeriod.value === p.key ? "bg-primary text-primary-content" : "bg-transparent text-base-content/50 hover:text-base-content"],
                      onClick: ($event) => changePeriod(p.key)
                    }, toDisplayString(p.label), 11, ["onClick"]);
                  }), 64))
                ]),
                createVNode("div", { class: "grid grid-cols-4 gap-2" }, [
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-xl font-black text-primary" }, toDisplayString(statsPeriod.value === "all" ? stats.value.totalGames : filteredStats.value.totalGames || 0), 1),
                    createVNode("div", { class: "text-[10px] text-base-content/50" }, "เกม")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-xl font-black text-success" }, toDisplayString(statsPeriod.value === "all" ? stats.value.gamesWon : filteredStats.value.gamesWon || 0), 1),
                    createVNode("div", { class: "text-[10px] text-base-content/50" }, "ชนะ")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-xl font-black text-warning" }, toDisplayString(statsPeriod.value === "all" ? stats.value.winRate : filteredStats.value.winRate || 0) + "%", 1),
                    createVNode("div", { class: "text-[10px] text-base-content/50" }, "Win Rate")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-lg font-black text-accent" }, toDisplayString(formatPlayTime(statsPeriod.value === "all" ? stats.value.totalPlaySeconds : filteredStats.value.totalPlaySeconds)), 1),
                    createVNode("div", { class: "text-[10px] text-base-content/50" }, "เวลาเล่น")
                  ])
                ]),
                statsPeriod.value !== "all" ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "grid grid-cols-3 gap-2"
                }, [
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-xl font-black text-info" }, toDisplayString(stats.value.partiesJoined || 0), 1),
                    createVNode("div", { class: "text-[10px] text-base-content/50" }, "ปาร์ตี้รวม")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-xl font-black text-secondary" }, toDisplayString(stats.value.courtsVisited || 0), 1),
                    createVNode("div", { class: "text-[10px] text-base-content/50" }, "สนาม")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-xl font-black text-primary" }, toDisplayString(stats.value.totalGames || 0), 1),
                    createVNode("div", { class: "text-[10px] text-base-content/50" }, "เกมรวม")
                  ])
                ])) : createCommentVNode("", true),
                (statsPeriod.value === "all" ? stats.value.totalPlaySeconds : filteredStats.value.totalPlaySeconds) > 0 ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/10 rounded-xl border border-orange-200/50 p-3 flex items-center justify-between"
                }, [
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("span", { class: "text-2xl" }, "🔥"),
                    createVNode("div", null, [
                      createVNode("div", { class: "text-xs font-bold text-orange-600" }, "แคลอรี่ที่เผาผลาญ"),
                      createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(periodLabel.value) + " · ประมาณ ~7 kcal/นาที", 1)
                    ])
                  ]),
                  createVNode("div", { class: "text-xl font-black text-orange-600" }, toDisplayString(estimateCalories(statsPeriod.value === "all" ? stats.value.totalPlaySeconds : filteredStats.value.totalPlaySeconds).toLocaleString()) + " kcal", 1)
                ])) : createCommentVNode("", true),
                stats.value.mostPlayedWith ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
                }, [
                  createVNode(_sfc_main$2, {
                    src: stats.value.mostPlayedWith.avatar,
                    name: stats.value.mostPlayedWith.name,
                    size: "lg",
                    rounded: "full",
                    class: "border-2 border-primary/30"
                  }, null, 8, ["src", "name"]),
                  createVNode("div", { class: "flex-1" }, [
                    createVNode("div", { class: "text-[10px] font-bold text-primary uppercase tracking-wider" }, "คู่หูขาประจำ"),
                    createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(stats.value.mostPlayedWith.name), 1),
                    createVNode("div", { class: "text-[10px] text-base-content/50" }, "เล่นด้วยกัน " + toDisplayString(stats.value.mostPlayedWith.count) + " เกม", 1)
                  ]),
                  createVNode("span", { class: "text-2xl" }, "🤝")
                ])) : createCommentVNode("", true),
                skillAssessment.value ? (openBlock(), createBlock("div", {
                  key: 3,
                  class: "bg-base-100 rounded-xl border border-base-300 p-4"
                }, [
                  createVNode("div", { class: "flex items-center justify-between mb-2" }, [
                    createVNode("div", { class: "text-xs font-bold text-primary uppercase tracking-wider" }, "🎯 ทักษะของคุณ"),
                    createVNode(unref(Link), {
                      href: "/skill-assessment",
                      class: "text-[10px] text-primary font-semibold no-underline hover:underline"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("ประเมินใหม่")
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_sfc_main$4, {
                    skills: skillAssessment.value,
                    size: 280,
                    class: "mx-auto"
                  }, null, 8, ["skills"]),
                  createVNode("div", { class: "flex gap-2 mt-3 justify-center flex-wrap" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(topStrengths.value, (s) => {
                      return openBlock(), createBlock("span", {
                        key: s.key,
                        class: "badge badge-primary badge-outline badge-sm gap-1 font-semibold"
                      }, toDisplayString(s.icon) + " " + toDisplayString(s.label) + " " + toDisplayString(s.value) + " — " + toDisplayString(s.levelLabel), 1);
                    }), 128))
                  ]),
                  createVNode("div", { class: "text-center mt-2 text-[10px] text-base-content/40" }, [
                    createTextVNode(" เฉียบคมด้าน: "),
                    createVNode("span", { class: "font-bold text-primary" }, toDisplayString(topStrengths.value.map((s) => s.label).join(", ")), 1)
                  ])
                ])) : (openBlock(), createBlock(unref(Link), {
                  key: 4,
                  href: "/skill-assessment",
                  class: "bg-base-100 rounded-xl border border-base-300 border-dashed p-4 text-center no-underline hover:bg-base-200 transition-colors block"
                }, {
                  default: withCtx(() => [
                    createVNode("span", { class: "text-3xl block mb-2" }, "🎯"),
                    createVNode("div", { class: "text-sm font-bold text-base-content" }, "ทำแบบประเมินทักษะ"),
                    createVNode("div", { class: "text-[10px] text-base-content/50 mt-0.5" }, "ประเมินทักษะ 10 ด้าน แสดงผลเป็นกราฟเรดาร์")
                  ]),
                  _: 1
                })),
                createVNode(unref(Link), {
                  href: "/friends",
                  class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
                }, {
                  default: withCtx(() => [
                    createVNode("span", { class: "text-2xl" }, "👥"),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(unref(t)("friends.title")), 1),
                      createVNode("div", { class: "text-[10px] text-base-content/50" }, "จัดการรายชื่อเพื่อน")
                    ]),
                    unref(page).props.pendingFriendCount > 0 ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-error text-white text-[10px] font-bold"
                    }, toDisplayString(unref(page).props.pendingFriendCount), 1)) : createCommentVNode("", true),
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
                  _: 1
                }),
                createVNode(unref(Link), {
                  href: "/notifications/settings",
                  class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
                }, {
                  default: withCtx(() => [
                    createVNode("span", { class: "text-2xl" }, "🔔"),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("div", { class: "text-sm font-bold text-base-content" }, "ตั้งค่าแจ้งเตือน"),
                      createVNode("div", { class: "text-[10px] text-base-content/50" }, "แจ้งเตือนผ่าน LINE OA")
                    ]),
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
                  _: 1
                }),
                createVNode(unref(Link), {
                  href: "/feedback",
                  class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
                }, {
                  default: withCtx(() => [
                    createVNode("span", { class: "text-2xl" }, "💬"),
                    createVNode("div", { class: "flex-1" }, [
                      createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(unref(t)("feedback.title")), 1),
                      createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(unref(t)("feedback.subtitle")), 1)
                    ]),
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
                  _: 1
                }),
                createVNode("div", { class: "flex gap-1 p-1 bg-base-200 rounded-xl" }, [
                  (openBlock(), createBlock(Fragment, null, renderList([{ key: "overview", label: "ประวัติเกม" }, { key: "parties", label: "ปาร์ตี้" }], (tab) => {
                    return createVNode("button", {
                      key: tab.key,
                      class: ["flex-1 py-2 px-3 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all", activeTab.value === tab.key ? "bg-primary text-primary-content" : "bg-transparent text-base-content/50 hover:text-base-content"],
                      onClick: ($event) => activeTab.value = tab.key
                    }, toDisplayString(tab.label), 11, ["onClick"]);
                  }), 64))
                ]),
                withDirectives(createVNode("div", null, [
                  availableMonths.value.length > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex items-center gap-2 mb-3"
                  }, [
                    createVNode("select", {
                      value: filterYear.value,
                      onChange: onYearChange,
                      class: "select select-sm select-bordered bg-base-100 text-sm font-semibold min-h-0 h-8"
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(availableYears.value, (y) => {
                        return openBlock(), createBlock("option", {
                          key: y,
                          value: y
                        }, toDisplayString(y + 543), 9, ["value"]);
                      }), 128))
                    ], 40, ["value"]),
                    createVNode("div", { class: "flex gap-1 flex-1 overflow-x-auto scrollbar-hide" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(monthsForSelectedYear.value, (m) => {
                        return openBlock(), createBlock("button", {
                          key: m,
                          onClick: ($event) => changeFilter(filterYear.value, m),
                          class: ["px-3 py-1 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all whitespace-nowrap", filterMonth.value === m ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/60 hover:bg-base-300"]
                        }, toDisplayString(thaiMonths[m]), 11, ["onClick"]);
                      }), 128))
                    ])
                  ])) : createCommentVNode("", true),
                  recentGames.value.length === 0 ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-center py-8 bg-base-100 rounded-xl border border-base-300"
                  }, [
                    createVNode("span", { class: "text-3xl" }, "🏸"),
                    createVNode("p", { class: "text-xs text-base-content/50 mt-2 m-0" }, "ไม่มีเกมในเดือนนี้")
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(recentGames.value, (game) => {
                      return openBlock(), createBlock("div", {
                        key: game.id,
                        class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3"
                      }, [
                        createVNode("div", {
                          class: ["w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold", game.won ? "bg-success/15 text-success" : game.won === false ? "bg-error/15 text-error" : "bg-base-200 text-base-content/40"]
                        }, toDisplayString(game.won ? "W" : game.won === false ? "L" : "-"), 3),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "flex items-center gap-1.5" }, [
                            createVNode("span", { class: "text-xs font-bold text-base-content" }, toDisplayString(game.score || "?-?"), 1),
                            createVNode("span", { class: "text-[10px] text-base-content/40" }, toDisplayString(game.court_name), 1)
                          ]),
                          createVNode("div", { class: "flex items-center gap-1 mt-0.5" }, [
                            createVNode("span", { class: "text-[9px] text-base-content/50" }, "กับ"),
                            createVNode("div", { class: "flex -space-x-1" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(game.teammates, (tm, i) => {
                                return openBlock(), createBlock(_sfc_main$2, {
                                  key: i,
                                  src: tm.avatar,
                                  name: tm.name,
                                  size: "xs",
                                  rounded: "full",
                                  class: "border border-base-100"
                                }, null, 8, ["src", "name"]);
                              }), 128))
                            ]),
                            createVNode("span", { class: "text-[9px] text-base-content/50 mx-0.5" }, "vs"),
                            createVNode("div", { class: "flex -space-x-1" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(game.opponents, (op, i) => {
                                return openBlock(), createBlock(_sfc_main$2, {
                                  key: i,
                                  src: op.avatar,
                                  name: op.name,
                                  size: "xs",
                                  rounded: "full",
                                  class: "border border-base-100"
                                }, null, 8, ["src", "name"]);
                              }), 128))
                            ])
                          ])
                        ]),
                        createVNode("div", { class: "text-right shrink-0" }, [
                          game.mmr_change != null ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: ["text-xs font-bold", game.mmr_change > 0 ? "text-success" : game.mmr_change < 0 ? "text-error" : "text-base-content/40"]
                          }, toDisplayString(game.mmr_change > 0 ? "+" : "") + toDisplayString(game.mmr_change) + " MMR", 3)) : createCommentVNode("", true),
                          createVNode("div", { class: "text-[10px] text-base-content/40" }, toDisplayString(formatDate(game.play_date)), 1),
                          game.duration_seconds ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "text-[10px] text-base-content/50"
                          }, toDisplayString(formatPlayTime(game.duration_seconds)), 1)) : createCommentVNode("", true)
                        ])
                      ]);
                    }), 128))
                  ])
                ], 512), [
                  [vShow, activeTab.value === "overview"]
                ]),
                withDirectives(createVNode("div", null, [
                  recentParties.value.length === 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-center py-8 bg-base-100 rounded-xl border border-base-300"
                  }, [
                    createVNode("span", { class: "text-3xl" }, "🎉"),
                    createVNode("p", { class: "text-xs text-base-content/50 mt-2 m-0" }, "ยังไม่มีประวัติปาร์ตี้")
                  ])) : createCommentVNode("", true),
                  createVNode("div", { class: "space-y-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(recentParties.value, (party) => {
                      return openBlock(), createBlock(unref(Link), {
                        key: party.id,
                        href: `/party/${party.id}`,
                        class: "bg-base-100 rounded-xl border border-base-300 p-3 flex items-center gap-3 no-underline hover:bg-base-200 transition-colors"
                      }, {
                        default: withCtx(() => {
                          var _a2;
                          return [
                            createVNode("div", { class: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0" }, [
                              createVNode("span", { class: "text-sm" }, "🏟️")
                            ]),
                            createVNode("div", { class: "flex-1 min-w-0" }, [
                              createVNode("div", { class: "text-xs font-bold text-base-content truncate" }, toDisplayString(party.court_name), 1),
                              createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(formatDate(party.play_date)) + " · " + toDisplayString((_a2 = party.start_time) == null ? void 0 : _a2.substring(0, 5)), 1)
                            ]),
                            createVNode("div", { class: "text-right shrink-0" }, [
                              createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(party.games_count) + " เกม", 1),
                              createVNode("div", { class: "text-[10px] text-base-content/40" }, toDisplayString(party.members_count) + " คน", 1)
                            ]),
                            createVNode("span", {
                              class: ["badge badge-xs", {
                                "badge-success": party.status === "Open",
                                "badge-warning": party.status === "Full",
                                "badge-neutral": party.status === "Over"
                              }]
                            }, toDisplayString(party.status), 3)
                          ];
                        }),
                        _: 2
                      }, 1032, ["href"]);
                    }), 128))
                  ])
                ], 512), [
                  [vShow, activeTab.value === "parties"]
                ]),
                createVNode("div", { class: "pt-2" }, [
                  createVNode(unref(Link), {
                    as: "button",
                    href: _ctx.route("logout"),
                    method: "post",
                    class: "w-full h-10 rounded-xl text-sm font-medium bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors flex items-center justify-center gap-2"
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        })
                      ])),
                      createTextVNode(" " + toDisplayString(unref(t)("nav.logout")), 1)
                    ]),
                    _: 1
                  }, 8, ["href"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
