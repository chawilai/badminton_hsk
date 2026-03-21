import { ref, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, Fragment, renderList, createTextVNode, nextTick, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AppLayout-C4Zuyavh.js";
import { g as getSkillLevelLabel, a as getSkillLevelDesc, _ as _sfc_main$2 } from "./skillLevelDescriptions-BhqdlqaI.js";
import { u as useLocale } from "./useLocale-BkZfXvwr.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./LocaleSwitcher-41-e_7Js.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./useToast-DyaFeJ92.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "SkillAssessment",
  __ssrInlineRender: true,
  props: {
    existingSkills: { type: Object, default: null }
  },
  setup(__props) {
    const { locale } = useLocale();
    const props = __props;
    const skillDefs = [
      { key: "serve", label: "เสิร์ฟ", icon: "🏸", desc: "เสิร์ฟสั้น/ยาว ความแม่นยำ เสิร์ฟหลอก" },
      { key: "smash", label: "สแมช", icon: "💥", desc: "ความแรง เลือกมุม กระโดดสแมช" },
      { key: "clear", label: "ลูกเคลียร์", icon: "🌈", desc: "ตีลูกยาวไปหลังคอร์ท ยกลูกจากหน้าเน็ต" },
      { key: "net_play", label: "เกมหน้าเน็ต", icon: "🕸️", desc: "หยอด ตบหน้าเน็ต ไขว้ หมุนลูก" },
      { key: "defense", label: "เกมรับ", icon: "🛡️", desc: "รับสแมช ดึงหลัง คืนลูกยาก" },
      { key: "backhand", label: "แบ็คแฮนด์", icon: "🔄", desc: "เคลียร์ หยอด รับลูกฝั่ง backhand" },
      { key: "deception", label: "ลูกหลอก", icon: "🎭", desc: "หลอกทิศทาง หลอกจังหวะ เปลี่ยนมุมวินาทีสุดท้าย" },
      { key: "footwork", label: "ฟุตเวิร์ค", icon: "👟", desc: "การเคลื่อนที่ในคอร์ท ทรงตัว เข้าตีได้ทุกมุม" },
      { key: "speed", label: "ความเร็ว", icon: "⚡", desc: "ความเร็วในการเคลื่อนที่ ตอบสนองไว" },
      { key: "stamina", label: "สตามิน่า", icon: "❤️‍🔥", desc: "ความอึด เล่นได้หลายเกมไม่หมดแรง" }
    ];
    const skills = ref({});
    skillDefs.forEach((s) => {
      var _a;
      skills.value[s.key] = ((_a = props.existingSkills) == null ? void 0 : _a[s.key]) || 5;
    });
    const currentStep = ref(0);
    const showSummary = ref(false);
    const isSubmitting = ref(false);
    const contentEl = ref(null);
    const currentSkill = computed(() => skillDefs[currentStep.value]);
    const progress = computed(() => Math.round((currentStep.value + 1) / skillDefs.length * 100));
    const scrollToTop = () => {
      nextTick(() => {
        var _a;
        (_a = contentEl.value) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    const goNext = () => {
      if (currentStep.value < skillDefs.length - 1) {
        currentStep.value++;
        scrollToTop();
      } else {
        showSummary.value = true;
        scrollToTop();
      }
    };
    const goPrev = () => {
      if (showSummary.value) {
        showSummary.value = false;
      } else if (currentStep.value > 0) {
        currentStep.value--;
        scrollToTop();
      }
    };
    const goToSkill = (index) => {
      showSummary.value = false;
      currentStep.value = index;
      scrollToTop();
    };
    const selectLevel = (val) => {
      skills.value[currentSkill.value.key] = val;
    };
    const submit = () => {
      if (isSubmitting.value) return;
      isSubmitting.value = true;
      router.post("/skill-assessment", { skills: skills.value }, {
        onFinish: () => {
          isSubmitting.value = false;
        }
      });
    };
    const levelColor = (val) => {
      if (val <= 2) return "text-base-content/40";
      if (val <= 4) return "text-info";
      if (val <= 6) return "text-success";
      if (val <= 8) return "text-warning";
      return "text-error";
    };
    const levelBgColor = (val) => {
      if (val <= 2) return "bg-base-content/5 border-base-content/10";
      if (val <= 4) return "bg-info/5 border-info/20";
      if (val <= 6) return "bg-success/5 border-success/20";
      if (val <= 8) return "bg-warning/5 border-warning/20";
      return "bg-error/5 border-error/20";
    };
    const selectedBgColor = (val) => {
      if (val <= 2) return "bg-base-content/15 border-base-content/40 ring-2 ring-base-content/20";
      if (val <= 4) return "bg-info/15 border-info ring-2 ring-info/30";
      if (val <= 6) return "bg-success/15 border-success ring-2 ring-success/30";
      if (val <= 8) return "bg-warning/15 border-warning ring-2 ring-warning/30";
      return "bg-error/15 border-error ring-2 ring-error/30";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "ประเมินทักษะ" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-3 pb-4"${_scopeId}>`);
            if (!showSummary.value) {
              _push2(`<div class="bg-base-100 rounded-2xl border border-base-300 p-3"${_scopeId}><div class="flex items-center justify-between mb-2"${_scopeId}><span class="text-xs font-bold text-base-content"${_scopeId}>ทักษะที่ ${ssrInterpolate(currentStep.value + 1)}/${ssrInterpolate(skillDefs.length)}</span><span class="text-xs text-base-content/50"${_scopeId}>${ssrInterpolate(progress.value)}%</span></div><div class="w-full bg-base-200 rounded-full h-2.5"${_scopeId}><div class="bg-primary h-2.5 rounded-full transition-all duration-300" style="${ssrRenderStyle({ width: progress.value + "%" })}"${_scopeId}></div></div><div class="flex justify-between mt-2 px-0.5"${_scopeId}><!--[-->`);
              ssrRenderList(skillDefs, (skill, i) => {
                _push2(`<button class="${ssrRenderClass([i === currentStep.value ? "bg-primary text-primary-content font-bold scale-110" : i < currentStep.value ? "bg-primary/20 text-primary" : "bg-base-200 text-base-content/30", "w-7 h-7 rounded-full border-0 cursor-pointer flex items-center justify-center text-xs transition-all"])}"${_scopeId}>${ssrInterpolate(i + 1)}</button>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!showSummary.value) {
              _push2(`<div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"${_scopeId}><div class="bg-gradient-to-br from-primary/10 to-primary/5 p-5 text-center"${_scopeId}><div class="text-5xl mb-2"${_scopeId}>${ssrInterpolate(currentSkill.value.icon)}</div><h2 class="text-xl font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(currentSkill.value.label)}</h2><p class="text-sm text-base-content/50 mt-1 m-0"${_scopeId}>${ssrInterpolate(currentSkill.value.desc)}</p></div><div class="p-3 space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(10, (level) => {
                _push2(`<button class="${ssrRenderClass([skills.value[currentSkill.value.key] === level ? selectedBgColor(level) : levelBgColor(level) + " hover:opacity-80", "w-full text-left p-3 rounded-xl border cursor-pointer transition-all"])}"${_scopeId}><div class="flex items-center gap-3"${_scopeId}><div class="${ssrRenderClass([skills.value[currentSkill.value.key] === level ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/50", "w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-black text-lg"])}"${_scopeId}>${ssrInterpolate(level)}</div><div class="flex-1 min-w-0"${_scopeId}><div class="${ssrRenderClass([levelColor(level), "text-sm font-bold"])}"${_scopeId}>${ssrInterpolate(unref(getSkillLevelLabel)(currentSkill.value.key, level, unref(locale)))}</div><div class="text-xs text-base-content/50 mt-0.5"${_scopeId}>${ssrInterpolate(unref(getSkillLevelDesc)(currentSkill.value.key, level))}</div></div>`);
                if (skills.value[currentSkill.value.key] === level) {
                  _push2(`<div class="shrink-0"${_scopeId}><svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20"${_scopeId}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId}></path></svg></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div></button>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (!showSummary.value) {
              _push2(`<div class="flex gap-3"${_scopeId}>`);
              if (currentStep.value > 0) {
                _push2(`<button class="flex-1 py-3 rounded-xl text-sm font-bold bg-base-200 text-base-content border-0 cursor-pointer hover:bg-base-300 transition-all active:scale-[0.98]"${_scopeId}><svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"${_scopeId}></path></svg> ย้อนกลับ </button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<button class="flex-1 py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98]"${_scopeId}>${ssrInterpolate(currentStep.value < skillDefs.length - 1 ? "ถัดไป" : "ดูสรุป")} <svg class="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"${_scopeId}></path></svg></button></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (showSummary.value) {
              _push2(`<!--[--><div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center"${_scopeId}><div class="text-4xl mb-2"${_scopeId}>🎯</div><h1 class="text-lg font-bold text-base-content m-0"${_scopeId}>สรุปผลประเมินทักษะ</h1><p class="text-xs text-base-content/50 mt-1 m-0"${_scopeId}>กดที่ทักษะเพื่อแก้ไขคะแนน</p></div><div class="bg-base-100 rounded-2xl border border-base-300 p-4 flex justify-center"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                skills: skills.value,
                size: 300
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"${_scopeId}><div class="divide-y divide-base-200"${_scopeId}><!--[-->`);
              ssrRenderList(skillDefs, (skill, i) => {
                _push2(`<button class="w-full text-left px-4 py-3 flex items-center gap-3 bg-transparent border-0 cursor-pointer hover:bg-base-200 transition-colors"${_scopeId}><span class="text-xl"${_scopeId}>${ssrInterpolate(skill.icon)}</span><div class="flex-1 min-w-0"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>${ssrInterpolate(skill.label)}</div><div class="text-xs text-base-content/50"${_scopeId}>${ssrInterpolate(unref(getSkillLevelLabel)(skill.key, skills.value[skill.key], unref(locale)))}</div></div><span class="${ssrRenderClass([levelColor(skills.value[skill.key]), "text-2xl font-black"])}"${_scopeId}>${ssrInterpolate(skills.value[skill.key])}</span><svg class="w-4 h-4 text-base-content/30 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"${_scopeId}></path></svg></button>`);
              });
              _push2(`<!--]--></div></div><div class="flex gap-3"${_scopeId}><button class="py-3 px-5 rounded-xl text-sm font-bold bg-base-200 text-base-content border-0 cursor-pointer hover:bg-base-300 transition-all active:scale-[0.98]"${_scopeId}><svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"${_scopeId}></path></svg> แก้ไข </button><button${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="flex-1 py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50"${_scopeId}>`);
              if (isSubmitting.value) {
                _push2(`<span class="loading loading-spinner loading-xs mr-1"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(__props.existingSkills ? "อัพเดทผลประเมิน" : "บันทึกผลประเมิน")}</button></div><!--]-->`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                ref_key: "contentEl",
                ref: contentEl,
                class: "space-y-3 pb-4"
              }, [
                !showSummary.value ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "bg-base-100 rounded-2xl border border-base-300 p-3"
                }, [
                  createVNode("div", { class: "flex items-center justify-between mb-2" }, [
                    createVNode("span", { class: "text-xs font-bold text-base-content" }, "ทักษะที่ " + toDisplayString(currentStep.value + 1) + "/" + toDisplayString(skillDefs.length), 1),
                    createVNode("span", { class: "text-xs text-base-content/50" }, toDisplayString(progress.value) + "%", 1)
                  ]),
                  createVNode("div", { class: "w-full bg-base-200 rounded-full h-2.5" }, [
                    createVNode("div", {
                      class: "bg-primary h-2.5 rounded-full transition-all duration-300",
                      style: { width: progress.value + "%" }
                    }, null, 4)
                  ]),
                  createVNode("div", { class: "flex justify-between mt-2 px-0.5" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(skillDefs, (skill, i) => {
                      return createVNode("button", {
                        key: skill.key,
                        onClick: ($event) => goToSkill(i),
                        class: ["w-7 h-7 rounded-full border-0 cursor-pointer flex items-center justify-center text-xs transition-all", i === currentStep.value ? "bg-primary text-primary-content font-bold scale-110" : i < currentStep.value ? "bg-primary/20 text-primary" : "bg-base-200 text-base-content/30"]
                      }, toDisplayString(i + 1), 11, ["onClick"]);
                    }), 64))
                  ])
                ])) : createCommentVNode("", true),
                !showSummary.value ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden"
                }, [
                  createVNode("div", { class: "bg-gradient-to-br from-primary/10 to-primary/5 p-5 text-center" }, [
                    createVNode("div", { class: "text-5xl mb-2" }, toDisplayString(currentSkill.value.icon), 1),
                    createVNode("h2", { class: "text-xl font-bold text-base-content m-0" }, toDisplayString(currentSkill.value.label), 1),
                    createVNode("p", { class: "text-sm text-base-content/50 mt-1 m-0" }, toDisplayString(currentSkill.value.desc), 1)
                  ]),
                  createVNode("div", { class: "p-3 space-y-2" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(10, (level) => {
                      return createVNode("button", {
                        key: level,
                        onClick: ($event) => selectLevel(level),
                        class: ["w-full text-left p-3 rounded-xl border cursor-pointer transition-all", skills.value[currentSkill.value.key] === level ? selectedBgColor(level) : levelBgColor(level) + " hover:opacity-80"]
                      }, [
                        createVNode("div", { class: "flex items-center gap-3" }, [
                          createVNode("div", {
                            class: ["w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-black text-lg", skills.value[currentSkill.value.key] === level ? "bg-primary text-primary-content" : "bg-base-200 text-base-content/50"]
                          }, toDisplayString(level), 3),
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("div", {
                              class: ["text-sm font-bold", levelColor(level)]
                            }, toDisplayString(unref(getSkillLevelLabel)(currentSkill.value.key, level, unref(locale))), 3),
                            createVNode("div", { class: "text-xs text-base-content/50 mt-0.5" }, toDisplayString(unref(getSkillLevelDesc)(currentSkill.value.key, level)), 1)
                          ]),
                          skills.value[currentSkill.value.key] === level ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "shrink-0"
                          }, [
                            (openBlock(), createBlock("svg", {
                              class: "w-6 h-6 text-primary",
                              fill: "currentColor",
                              viewBox: "0 0 20 20"
                            }, [
                              createVNode("path", {
                                "fill-rule": "evenodd",
                                d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                "clip-rule": "evenodd"
                              })
                            ]))
                          ])) : createCommentVNode("", true)
                        ])
                      ], 10, ["onClick"]);
                    }), 64))
                  ])
                ])) : createCommentVNode("", true),
                !showSummary.value ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "flex gap-3"
                }, [
                  currentStep.value > 0 ? (openBlock(), createBlock("button", {
                    key: 0,
                    onClick: goPrev,
                    class: "flex-1 py-3 rounded-xl text-sm font-bold bg-base-200 text-base-content border-0 cursor-pointer hover:bg-base-300 transition-all active:scale-[0.98]"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4 inline mr-1",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2.5",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M15 19l-7-7 7-7"
                      })
                    ])),
                    createTextVNode(" ย้อนกลับ ")
                  ])) : createCommentVNode("", true),
                  createVNode("button", {
                    onClick: goNext,
                    class: "flex-1 py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98]"
                  }, [
                    createTextVNode(toDisplayString(currentStep.value < skillDefs.length - 1 ? "ถัดไป" : "ดูสรุป") + " ", 1),
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4 inline ml-1",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2.5",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M9 5l7 7-7 7"
                      })
                    ]))
                  ])
                ])) : createCommentVNode("", true),
                showSummary.value ? (openBlock(), createBlock(Fragment, { key: 3 }, [
                  createVNode("div", { class: "bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center" }, [
                    createVNode("div", { class: "text-4xl mb-2" }, "🎯"),
                    createVNode("h1", { class: "text-lg font-bold text-base-content m-0" }, "สรุปผลประเมินทักษะ"),
                    createVNode("p", { class: "text-xs text-base-content/50 mt-1 m-0" }, "กดที่ทักษะเพื่อแก้ไขคะแนน")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 p-4 flex justify-center" }, [
                    createVNode(_sfc_main$2, {
                      skills: skills.value,
                      size: 300
                    }, null, 8, ["skills"])
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                    createVNode("div", { class: "divide-y divide-base-200" }, [
                      (openBlock(), createBlock(Fragment, null, renderList(skillDefs, (skill, i) => {
                        return createVNode("button", {
                          key: skill.key,
                          onClick: ($event) => goToSkill(i),
                          class: "w-full text-left px-4 py-3 flex items-center gap-3 bg-transparent border-0 cursor-pointer hover:bg-base-200 transition-colors"
                        }, [
                          createVNode("span", { class: "text-xl" }, toDisplayString(skill.icon), 1),
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(skill.label), 1),
                            createVNode("div", { class: "text-xs text-base-content/50" }, toDisplayString(unref(getSkillLevelLabel)(skill.key, skills.value[skill.key], unref(locale))), 1)
                          ]),
                          createVNode("span", {
                            class: ["text-2xl font-black", levelColor(skills.value[skill.key])]
                          }, toDisplayString(skills.value[skill.key]), 3),
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 text-base-content/30 shrink-0",
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
                        ], 8, ["onClick"]);
                      }), 64))
                    ])
                  ]),
                  createVNode("div", { class: "flex gap-3" }, [
                    createVNode("button", {
                      onClick: goPrev,
                      class: "py-3 px-5 rounded-xl text-sm font-bold bg-base-200 text-base-content border-0 cursor-pointer hover:bg-base-300 transition-all active:scale-[0.98]"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4 inline mr-1",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2.5",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M15 19l-7-7 7-7"
                        })
                      ])),
                      createTextVNode(" แก้ไข ")
                    ]),
                    createVNode("button", {
                      onClick: submit,
                      disabled: isSubmitting.value,
                      class: "flex-1 py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50"
                    }, [
                      isSubmitting.value ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "loading loading-spinner loading-xs mr-1"
                      })) : createCommentVNode("", true),
                      createTextVNode(" " + toDisplayString(__props.existingSkills ? "อัพเดทผลประเมิน" : "บันทึกผลประเมิน"), 1)
                    ], 8, ["disabled"])
                  ])
                ], 64)) : createCommentVNode("", true)
              ], 512)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/SkillAssessment.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
