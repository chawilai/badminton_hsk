import { ref, computed, unref, withCtx, createVNode, toDisplayString, withDirectives, createBlock, createCommentVNode, openBlock, Fragment, renderList, vModelSelect, vModelRadio, vModelText, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList } from "vue/server-renderer";
import { Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./AppLayout-BPNdCb7L.js";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./useToast-DyaFeJ92.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "UserSetup",
  __ssrInlineRender: true,
  props: { rankGroups: Object },
  setup(__props) {
    const { locale, toggleLocale } = useLocale();
    const form = ref({
      badminton_rank_id: null,
      gender: "",
      date_of_birth: ""
    });
    const isSubmitting = ref(false);
    const errors = ref({});
    const content = computed(() => {
      if (locale.value === "en") {
        return {
          title: "Player Setup",
          subtitle: "Tell us about yourself to get started",
          rankLabel: "Badminton Skill Level",
          rankPlaceholder: "Select your skill level",
          genderLabel: "Gender",
          genderPlaceholder: "Select gender",
          genderOptions: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" }
          ],
          dobLabel: "Date of Birth",
          submitBtn: "Start Playing",
          rankGroups: {
            "อนุบาล": "Beginner",
            "ประถมต้น": "Early Intermediate",
            "ประถมปลาย": "Late Intermediate",
            "มัธยมต้น": "Advanced (Lower)",
            "มัธยมปลาย": "Advanced (Upper)",
            "ปริญญาตรี": "Expert",
            "ปริญญาโท": "Master",
            "ปริญญาเอก": "Elite"
          }
        };
      }
      return {
        title: "ตั้งค่าผู้เล่น",
        subtitle: "บอกเราเกี่ยวกับตัวคุณเพื่อเริ่มใช้งาน",
        rankLabel: "ระดับฝีมือแบดมินตัน",
        rankPlaceholder: "เลือกระดับฝีมือ",
        genderLabel: "เพศ",
        genderPlaceholder: "เลือกเพศ",
        genderOptions: [
          { value: "male", label: "ชาย" },
          { value: "female", label: "หญิง" }
        ],
        dobLabel: "วันเกิด",
        submitBtn: "เริ่มเล่น",
        rankGroups: {
          "อนุบาล": "อนุบาล",
          "ประถมต้น": "ประถมต้น",
          "ประถมปลาย": "ประถมปลาย",
          "มัธยมต้น": "มัธยมต้น",
          "มัธยมปลาย": "มัธยมปลาย",
          "ปริญญาตรี": "ปริญญาตรี",
          "ปริญญาโท": "ปริญญาโท",
          "ปริญญาเอก": "ปริญญาเอก"
        }
      };
    });
    const isValid = computed(() => {
      return form.value.badminton_rank_id && form.value.gender && form.value.date_of_birth;
    });
    const submit = () => {
      if (!isValid.value || isSubmitting.value) return;
      isSubmitting.value = true;
      errors.value = {};
      router.post("/setup", form.value, {
        onError: (errs) => {
          errors.value = errs;
        },
        onFinish: () => {
          isSubmitting.value = false;
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: content.value.title
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center"${_scopeId}><div class="text-4xl mb-2"${_scopeId}>🏸</div><h1 class="text-lg font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(content.value.title)}</h1><p class="text-xs text-base-content/50 mt-1 m-0"${_scopeId}>${ssrInterpolate(content.value.subtitle)}</p><button class="mt-2 px-3 py-1 rounded-lg bg-base-content/10 text-[11px] text-base-content/60 border-0 cursor-pointer hover:bg-base-content/20 transition-colors"${_scopeId}>${ssrInterpolate(unref(locale) === "th" ? "🇬🇧 English" : "🇹🇭 ภาษาไทย")}</button></div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center gap-2"${_scopeId}><span class="text-base"${_scopeId}>🎯</span><div class="text-sm font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(content.value.rankLabel)}</div></div><div class="p-4"${_scopeId}><select class="${ssrRenderClass([{ "select-error": errors.value.badminton_rank_id }, "select select-bordered w-full"])}"${_scopeId}><option${ssrRenderAttr("value", null)} disabled${ssrIncludeBooleanAttr(Array.isArray(form.value.badminton_rank_id) ? ssrLooseContain(form.value.badminton_rank_id, null) : ssrLooseEqual(form.value.badminton_rank_id, null)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(content.value.rankPlaceholder)}</option><!--[-->`);
            ssrRenderList(__props.rankGroups, (ranks, groupName) => {
              _push2(`<optgroup${ssrRenderAttr("label", content.value.rankGroups[groupName] || groupName)}${_scopeId}><!--[-->`);
              ssrRenderList(ranks, (rank) => {
                _push2(`<option${ssrRenderAttr("value", rank.id)}${_scopeId}>${ssrInterpolate(rank.education_rank)} (${ssrInterpolate(rank.general_rank)}) </option>`);
              });
              _push2(`<!--]--></optgroup>`);
            });
            _push2(`<!--]--></select>`);
            if (errors.value.badminton_rank_id) {
              _push2(`<p class="text-error text-xs mt-1"${_scopeId}>${ssrInterpolate(errors.value.badminton_rank_id)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center gap-2"${_scopeId}><span class="text-base"${_scopeId}>👤</span><div class="text-sm font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(content.value.genderLabel)}</div></div><div class="p-4"${_scopeId}><div class="flex gap-3"${_scopeId}><!--[-->`);
            ssrRenderList(content.value.genderOptions, (opt) => {
              _push2(`<label class="flex-1 cursor-pointer"${_scopeId}><input type="radio"${ssrIncludeBooleanAttr(ssrLooseEqual(form.value.gender, opt.value)) ? " checked" : ""}${ssrRenderAttr("value", opt.value)} class="hidden peer"${_scopeId}><div class="${ssrRenderClass([form.value.gender === opt.value ? "border-primary bg-primary/10 text-primary" : "border-base-300 text-base-content/60", "text-center py-3 rounded-xl border-2 transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary font-semibold text-sm"])}"${_scopeId}>${ssrInterpolate(opt.value === "male" ? "♂" : "♀")} ${ssrInterpolate(opt.label)}</div></label>`);
            });
            _push2(`<!--]--></div>`);
            if (errors.value.gender) {
              _push2(`<p class="text-error text-xs mt-1"${_scopeId}>${ssrInterpolate(errors.value.gender)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden"${_scopeId}><div class="px-4 py-3 border-b border-base-200 flex items-center gap-2"${_scopeId}><span class="text-base"${_scopeId}>🎂</span><div class="text-sm font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(content.value.dobLabel)}</div></div><div class="p-4"${_scopeId}><input type="date"${ssrRenderAttr("value", form.value.date_of_birth)} class="${ssrRenderClass([{ "input-error": errors.value.date_of_birth }, "input input-bordered w-full"])}" max="2020-01-01"${_scopeId}>`);
            if (errors.value.date_of_birth) {
              _push2(`<p class="text-error text-xs mt-1"${_scopeId}>${ssrInterpolate(errors.value.date_of_birth)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="pt-2"${_scopeId}><button${ssrIncludeBooleanAttr(!isValid.value || isSubmitting.value) ? " disabled" : ""} class="${ssrRenderClass([isValid.value ? "bg-primary text-primary-content hover:bg-primary/80" : "bg-base-300 text-base-content/40", "w-full py-3 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"])}"${_scopeId}>`);
            if (isSubmitting.value) {
              _push2(`<span class="loading loading-spinner loading-xs mr-1"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` 🏸 ${ssrInterpolate(content.value.submitBtn)}</button></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 text-center" }, [
                  createVNode("div", { class: "text-4xl mb-2" }, "🏸"),
                  createVNode("h1", { class: "text-lg font-bold text-base-content m-0" }, toDisplayString(content.value.title), 1),
                  createVNode("p", { class: "text-xs text-base-content/50 mt-1 m-0" }, toDisplayString(content.value.subtitle), 1),
                  createVNode("button", {
                    onClick: unref(toggleLocale),
                    class: "mt-2 px-3 py-1 rounded-lg bg-base-content/10 text-[11px] text-base-content/60 border-0 cursor-pointer hover:bg-base-content/20 transition-colors"
                  }, toDisplayString(unref(locale) === "th" ? "🇬🇧 English" : "🇹🇭 ภาษาไทย"), 9, ["onClick"])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center gap-2" }, [
                    createVNode("span", { class: "text-base" }, "🎯"),
                    createVNode("div", { class: "text-sm font-bold text-base-content m-0" }, toDisplayString(content.value.rankLabel), 1)
                  ]),
                  createVNode("div", { class: "p-4" }, [
                    withDirectives(createVNode("select", {
                      "onUpdate:modelValue": ($event) => form.value.badminton_rank_id = $event,
                      class: ["select select-bordered w-full", { "select-error": errors.value.badminton_rank_id }]
                    }, [
                      createVNode("option", {
                        value: null,
                        disabled: ""
                      }, toDisplayString(content.value.rankPlaceholder), 1),
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.rankGroups, (ranks, groupName) => {
                        return openBlock(), createBlock("optgroup", {
                          key: groupName,
                          label: content.value.rankGroups[groupName] || groupName
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(ranks, (rank) => {
                            return openBlock(), createBlock("option", {
                              key: rank.id,
                              value: rank.id
                            }, toDisplayString(rank.education_rank) + " (" + toDisplayString(rank.general_rank) + ") ", 9, ["value"]);
                          }), 128))
                        ], 8, ["label"]);
                      }), 128))
                    ], 10, ["onUpdate:modelValue"]), [
                      [vModelSelect, form.value.badminton_rank_id]
                    ]),
                    errors.value.badminton_rank_id ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-error text-xs mt-1"
                    }, toDisplayString(errors.value.badminton_rank_id), 1)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center gap-2" }, [
                    createVNode("span", { class: "text-base" }, "👤"),
                    createVNode("div", { class: "text-sm font-bold text-base-content m-0" }, toDisplayString(content.value.genderLabel), 1)
                  ]),
                  createVNode("div", { class: "p-4" }, [
                    createVNode("div", { class: "flex gap-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(content.value.genderOptions, (opt) => {
                        return openBlock(), createBlock("label", {
                          key: opt.value,
                          class: "flex-1 cursor-pointer"
                        }, [
                          withDirectives(createVNode("input", {
                            type: "radio",
                            "onUpdate:modelValue": ($event) => form.value.gender = $event,
                            value: opt.value,
                            class: "hidden peer"
                          }, null, 8, ["onUpdate:modelValue", "value"]), [
                            [vModelRadio, form.value.gender]
                          ]),
                          createVNode("div", {
                            class: ["text-center py-3 rounded-xl border-2 transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary font-semibold text-sm", form.value.gender === opt.value ? "border-primary bg-primary/10 text-primary" : "border-base-300 text-base-content/60"]
                          }, toDisplayString(opt.value === "male" ? "♂" : "♀") + " " + toDisplayString(opt.label), 3)
                        ]);
                      }), 128))
                    ]),
                    errors.value.gender ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-error text-xs mt-1"
                    }, toDisplayString(errors.value.gender), 1)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-2xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "px-4 py-3 border-b border-base-200 flex items-center gap-2" }, [
                    createVNode("span", { class: "text-base" }, "🎂"),
                    createVNode("div", { class: "text-sm font-bold text-base-content m-0" }, toDisplayString(content.value.dobLabel), 1)
                  ]),
                  createVNode("div", { class: "p-4" }, [
                    withDirectives(createVNode("input", {
                      type: "date",
                      "onUpdate:modelValue": ($event) => form.value.date_of_birth = $event,
                      class: ["input input-bordered w-full", { "input-error": errors.value.date_of_birth }],
                      max: "2020-01-01"
                    }, null, 10, ["onUpdate:modelValue"]), [
                      [vModelText, form.value.date_of_birth]
                    ]),
                    errors.value.date_of_birth ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-error text-xs mt-1"
                    }, toDisplayString(errors.value.date_of_birth), 1)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "pt-2" }, [
                  createVNode("button", {
                    onClick: submit,
                    disabled: !isValid.value || isSubmitting.value,
                    class: ["w-full py-3 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed", isValid.value ? "bg-primary text-primary-content hover:bg-primary/80" : "bg-base-300 text-base-content/40"]
                  }, [
                    isSubmitting.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "loading loading-spinner loading-xs mr-1"
                    })) : createCommentVNode("", true),
                    createTextVNode(" 🏸 " + toDisplayString(content.value.submitBtn), 1)
                  ], 10, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/UserSetup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
