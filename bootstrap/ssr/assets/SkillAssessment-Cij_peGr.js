import { ref, unref, withCtx, createVNode, createBlock, openBlock, Fragment, renderList, withDirectives, toDisplayString, vModelText, createCommentVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AppLayout-DZFboRiE.js";
import { _ as _sfc_main$2 } from "./SkillRadarChart-BAv9lBbY.js";
import "./badmintonLayout-Bmnf0xqT.js";
import "./useLocale-gpJrLIKB.js";
import "./LocaleSwitcher-BOmG4hBt.js";
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
    const isSubmitting = ref(false);
    const submit = () => {
      if (isSubmitting.value) return;
      isSubmitting.value = true;
      router.post("/skill-assessment", { skills: skills.value }, {
        onFinish: () => {
          isSubmitting.value = false;
        }
      });
    };
    const levelLabel = (val) => {
      if (val <= 2) return "เริ่มต้น";
      if (val <= 4) return "พอได้";
      if (val <= 6) return "ปานกลาง";
      if (val <= 8) return "ดี";
      return "เยี่ยม";
    };
    const levelColor = (val) => {
      if (val <= 2) return "text-base-content/40";
      if (val <= 4) return "text-info";
      if (val <= 6) return "text-success";
      if (val <= 8) return "text-warning";
      return "text-error";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "ประเมินทักษะ" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center"${_scopeId}><div class="text-4xl mb-2"${_scopeId}>🎯</div><h1 class="text-lg font-bold text-base-content m-0"${_scopeId}>ประเมินทักษะแบดมินตัน</h1><p class="text-xs text-base-content/50 mt-1 m-0"${_scopeId}>ประเมินตัวเอง 10 ด้าน เพื่อดูจุดแข็งและจุดที่ควรพัฒนา</p></div><div class="bg-base-100 rounded-2xl border border-base-300 p-4 flex justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              skills: skills.value,
              size: 300
            }, null, _parent2, _scopeId));
            _push2(`</div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"${_scopeId}><div class="px-4 py-3 border-b border-base-200"${_scopeId}><h2 class="text-base font-bold text-base-content m-0"${_scopeId}>ให้คะแนนทักษะ (1-10)</h2></div><div class="divide-y divide-base-200"${_scopeId}><!--[-->`);
            ssrRenderList(skillDefs, (skill) => {
              _push2(`<div class="px-4 py-3 space-y-1.5"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><span class="text-lg"${_scopeId}>${ssrInterpolate(skill.icon)}</span><div${_scopeId}><div class="text-sm font-semibold text-base-content"${_scopeId}>${ssrInterpolate(skill.label)}</div><div class="text-[10px] text-base-content/40"${_scopeId}>${ssrInterpolate(skill.desc)}</div></div></div><div class="text-right"${_scopeId}><span class="${ssrRenderClass([levelColor(skills.value[skill.key]), "text-xl font-black"])}"${_scopeId}>${ssrInterpolate(skills.value[skill.key])}</span><div class="${ssrRenderClass([levelColor(skills.value[skill.key]), "text-[9px]"])}"${_scopeId}>${ssrInterpolate(levelLabel(skills.value[skill.key]))}</div></div></div><input type="range" min="1" max="10"${ssrRenderAttr("value", skills.value[skill.key])} class="range range-primary range-sm w-full" step="1"${_scopeId}><div class="flex justify-between text-[8px] text-base-content/30 px-0.5"${_scopeId}><span${_scopeId}>1</span><span${_scopeId}>2</span><span${_scopeId}>3</span><span${_scopeId}>4</span><span${_scopeId}>5</span><span${_scopeId}>6</span><span${_scopeId}>7</span><span${_scopeId}>8</span><span${_scopeId}>9</span><span${_scopeId}>10</span></div></div>`);
            });
            _push2(`<!--]--></div></div><button${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="w-full py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50"${_scopeId}>`);
            if (isSubmitting.value) {
              _push2(`<span class="loading loading-spinner loading-xs mr-1"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(__props.existingSkills ? "อัพเดทผลประเมิน" : "บันทึกผลประเมิน")}</button></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center" }, [
                  createVNode("div", { class: "text-4xl mb-2" }, "🎯"),
                  createVNode("h1", { class: "text-lg font-bold text-base-content m-0" }, "ประเมินทักษะแบดมินตัน"),
                  createVNode("p", { class: "text-xs text-base-content/50 mt-1 m-0" }, "ประเมินตัวเอง 10 ด้าน เพื่อดูจุดแข็งและจุดที่ควรพัฒนา")
                ]),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 p-4 flex justify-center" }, [
                  createVNode(_sfc_main$2, {
                    skills: skills.value,
                    size: 300
                  }, null, 8, ["skills"])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200" }, [
                    createVNode("h2", { class: "text-base font-bold text-base-content m-0" }, "ให้คะแนนทักษะ (1-10)")
                  ]),
                  createVNode("div", { class: "divide-y divide-base-200" }, [
                    (openBlock(), createBlock(Fragment, null, renderList(skillDefs, (skill) => {
                      return createVNode("div", {
                        key: skill.key,
                        class: "px-4 py-3 space-y-1.5"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("span", { class: "text-lg" }, toDisplayString(skill.icon), 1),
                            createVNode("div", null, [
                              createVNode("div", { class: "text-sm font-semibold text-base-content" }, toDisplayString(skill.label), 1),
                              createVNode("div", { class: "text-[10px] text-base-content/40" }, toDisplayString(skill.desc), 1)
                            ])
                          ]),
                          createVNode("div", { class: "text-right" }, [
                            createVNode("span", {
                              class: ["text-xl font-black", levelColor(skills.value[skill.key])]
                            }, toDisplayString(skills.value[skill.key]), 3),
                            createVNode("div", {
                              class: ["text-[9px]", levelColor(skills.value[skill.key])]
                            }, toDisplayString(levelLabel(skills.value[skill.key])), 3)
                          ])
                        ]),
                        withDirectives(createVNode("input", {
                          type: "range",
                          min: "1",
                          max: "10",
                          "onUpdate:modelValue": ($event) => skills.value[skill.key] = $event,
                          class: "range range-primary range-sm w-full",
                          step: "1"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [
                            vModelText,
                            skills.value[skill.key],
                            void 0,
                            { number: true }
                          ]
                        ]),
                        createVNode("div", { class: "flex justify-between text-[8px] text-base-content/30 px-0.5" }, [
                          createVNode("span", null, "1"),
                          createVNode("span", null, "2"),
                          createVNode("span", null, "3"),
                          createVNode("span", null, "4"),
                          createVNode("span", null, "5"),
                          createVNode("span", null, "6"),
                          createVNode("span", null, "7"),
                          createVNode("span", null, "8"),
                          createVNode("span", null, "9"),
                          createVNode("span", null, "10")
                        ])
                      ]);
                    }), 64))
                  ])
                ]),
                createVNode("button", {
                  onClick: submit,
                  disabled: isSubmitting.value,
                  class: "w-full py-3 rounded-xl text-sm font-bold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50"
                }, [
                  isSubmitting.value ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "loading loading-spinner loading-xs mr-1"
                  })) : createCommentVNode("", true),
                  createTextVNode(" " + toDisplayString(__props.existingSkills ? "อัพเดทผลประเมิน" : "บันทึกผลประเมิน"), 1)
                ], 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/SkillAssessment.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
