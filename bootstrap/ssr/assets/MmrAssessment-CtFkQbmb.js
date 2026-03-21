import { ref, computed, unref, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { Head } from "@inertiajs/vue3";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import { _ as _sfc_main$1 } from "./LocaleSwitcher-DHf7bxTb.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const totalQuestions = 7;
const _sfc_main = {
  __name: "MmrAssessment",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    const currentStep = ref(0);
    const answers = ref([null, null, null, null, null, null, null]);
    const isSubmitting = ref(false);
    ref("forward");
    const questions = computed(() => [
      {
        key: "q1",
        question: t("mmr.q1"),
        options: [
          { label: t("mmr.q1a"), score: 0 },
          { label: t("mmr.q1b"), score: 2 },
          { label: t("mmr.q1c"), score: 5 },
          { label: t("mmr.q1d"), score: 7 },
          { label: t("mmr.q1e"), score: 10 }
        ]
      },
      {
        key: "q2",
        question: t("mmr.q2"),
        options: [
          { label: t("mmr.q2a"), score: 0 },
          { label: t("mmr.q2b"), score: 2 },
          { label: t("mmr.q2c"), score: 5 },
          { label: t("mmr.q2d"), score: 7 },
          { label: t("mmr.q2e"), score: 10 }
        ]
      },
      {
        key: "q3",
        question: t("mmr.q3"),
        options: [
          { label: t("mmr.q3a"), score: 0 },
          { label: t("mmr.q3b"), score: 2 },
          { label: t("mmr.q3c"), score: 5 },
          { label: t("mmr.q3d"), score: 7 },
          { label: t("mmr.q3e"), score: 10 }
        ]
      },
      {
        key: "q4",
        question: t("mmr.q4"),
        options: [
          { label: t("mmr.q4a"), score: 0 },
          { label: t("mmr.q4b"), score: 2 },
          { label: t("mmr.q4c"), score: 5 },
          { label: t("mmr.q4d"), score: 7 },
          { label: t("mmr.q4e"), score: 10 }
        ]
      },
      {
        key: "q5",
        question: t("mmr.q5"),
        options: [
          { label: t("mmr.q5a"), score: 0 },
          { label: t("mmr.q5b"), score: 2 },
          { label: t("mmr.q5c"), score: 5 },
          { label: t("mmr.q5d"), score: 7 },
          { label: t("mmr.q5e"), score: 10 }
        ]
      },
      {
        key: "q6",
        question: t("mmr.q6"),
        options: [
          { label: t("mmr.q6a"), score: 0 },
          { label: t("mmr.q6b"), score: 2 },
          { label: t("mmr.q6c"), score: 5 },
          { label: t("mmr.q6d"), score: 7 },
          { label: t("mmr.q6e"), score: 10 }
        ]
      },
      {
        key: "q7",
        question: t("mmr.q7"),
        options: [
          { label: t("mmr.q7a"), score: 0 },
          { label: t("mmr.q7b"), score: 2 },
          { label: t("mmr.q7c"), score: 5 },
          { label: t("mmr.q7d"), score: 7 },
          { label: t("mmr.q7e"), score: 10 }
        ]
      }
    ]);
    const currentQuestion = computed(() => {
      if (currentStep.value >= 1 && currentStep.value <= totalQuestions) {
        return questions.value[currentStep.value - 1];
      }
      return null;
    });
    computed(() => {
      if (currentStep.value >= 1 && currentStep.value <= totalQuestions) {
        return answers.value[currentStep.value - 1];
      }
      return null;
    });
    const canProceed = computed(() => {
      if (currentStep.value === 0) return true;
      return answers.value[currentStep.value - 1] !== null;
    });
    const isLastQuestion = computed(() => currentStep.value === totalQuestions);
    const progressPercent = computed(() => {
      if (currentStep.value === 0) return 0;
      return currentStep.value / totalQuestions * 100;
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: unref(t)("mmr.title")
      }, null, _parent));
      _push(`<div class="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-primary/5 flex flex-col" data-v-7e4a5b33><div class="fixed inset-0 overflow-hidden pointer-events-none" data-v-7e4a5b33><div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" data-v-7e4a5b33></div><div class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" data-v-7e4a5b33></div><div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" data-v-7e4a5b33></div></div>`);
      if (currentStep.value >= 1) {
        _push(`<div class="sticky top-0 z-20 bg-base-100/80 backdrop-blur-md border-b border-base-300/50" data-v-7e4a5b33><div class="max-w-lg mx-auto px-4 py-3" data-v-7e4a5b33><div class="flex items-center justify-between mb-2" data-v-7e4a5b33><span class="text-xs font-semibold text-base-content/60" data-v-7e4a5b33>${ssrInterpolate(unref(t)("mmr.question"))} ${ssrInterpolate(currentStep.value)} ${ssrInterpolate(unref(t)("mmr.of"))} ${ssrInterpolate(totalQuestions)}</span><div class="flex items-center gap-2" data-v-7e4a5b33><span class="text-xs font-bold text-primary" data-v-7e4a5b33>${ssrInterpolate(Math.round(progressPercent.value))}%</span>`);
        _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
        _push(`</div></div><div class="w-full h-2 bg-base-200 rounded-full overflow-hidden" data-v-7e4a5b33><div class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out" style="${ssrRenderStyle({ width: progressPercent.value + "%" })}" data-v-7e4a5b33></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex-1 flex items-center justify-center px-4 py-8 relative z-10" data-v-7e4a5b33><div class="w-full max-w-lg" data-v-7e4a5b33>`);
      if (currentStep.value === 0) {
        _push(`<div class="text-center animate-fade-in" data-v-7e4a5b33><div class="flex justify-end mb-4" data-v-7e4a5b33>`);
        _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
        _push(`</div><div class="mb-6" data-v-7e4a5b33><div class="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-3xl mb-4 animate-up-down" data-v-7e4a5b33><span class="text-5xl" data-v-7e4a5b33>🏸</span></div><h1 class="text-2xl font-bold text-base-content m-0" data-v-7e4a5b33>${ssrInterpolate(unref(t)("mmr.welcome"))}</h1><p class="text-sm text-base-content/60 mt-2 m-0 max-w-sm mx-auto leading-relaxed" data-v-7e4a5b33>${ssrInterpolate(unref(t)("mmr.welcomeDesc"))}</p></div><div class="grid grid-cols-3 gap-3 mb-8" data-v-7e4a5b33><div class="bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-300/50 p-3 text-center" data-v-7e4a5b33><span class="text-2xl block mb-1" data-v-7e4a5b33>7</span><span class="text-[10px] text-base-content/50 font-medium" data-v-7e4a5b33>${ssrInterpolate(unref(t)("mmr.question"))}</span></div><div class="bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-300/50 p-3 text-center" data-v-7e4a5b33><span class="text-2xl block mb-1" data-v-7e4a5b33>2</span><span class="text-[10px] text-base-content/50 font-medium" data-v-7e4a5b33>min</span></div><div class="bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-300/50 p-3 text-center" data-v-7e4a5b33><span class="text-2xl block mb-1" data-v-7e4a5b33>🎯</span><span class="text-[10px] text-base-content/50 font-medium" data-v-7e4a5b33>MMR</span></div></div><button class="w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-lg hover:shadow-xl text-base" data-v-7e4a5b33>${ssrInterpolate(unref(t)("mmr.start"))}</button></div>`);
      } else {
        _push(`<div class="animate-slide-up" data-v-7e4a5b33><div class="space-y-6" data-v-7e4a5b33><div class="text-center mb-2" data-v-7e4a5b33><div class="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-3" data-v-7e4a5b33><span class="text-xl font-black text-primary" data-v-7e4a5b33>${ssrInterpolate(currentStep.value)}</span></div><h2 class="text-lg font-bold text-base-content m-0 leading-relaxed" data-v-7e4a5b33>${ssrInterpolate((_a = currentQuestion.value) == null ? void 0 : _a.question)}</h2></div><div class="space-y-3" data-v-7e4a5b33><!--[-->`);
        ssrRenderList((_b = currentQuestion.value) == null ? void 0 : _b.options, (option, idx) => {
          _push(`<button class="${ssrRenderClass([
            answers.value[currentStep.value - 1] === option.score ? "border-primary bg-primary/10 shadow-md" : "border-base-300 bg-base-100/70 backdrop-blur-sm hover:border-primary/30 hover:bg-base-100",
            "w-full text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer active:scale-[0.98]"
          ])}" data-v-7e4a5b33><div class="flex items-center gap-4" data-v-7e4a5b33><div class="${ssrRenderClass([
            answers.value[currentStep.value - 1] === option.score ? "border-primary bg-primary" : "border-base-300",
            "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
          ])}" data-v-7e4a5b33>`);
          if (answers.value[currentStep.value - 1] === option.score) {
            _push(`<div class="w-2.5 h-2.5 rounded-full bg-primary-content" data-v-7e4a5b33></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="${ssrRenderClass([
            answers.value[currentStep.value - 1] === option.score ? "text-primary font-semibold" : "text-base-content/80",
            "text-base font-medium transition-colors"
          ])}" data-v-7e4a5b33>${ssrInterpolate(option.label)}</span></div></button>`);
        });
        _push(`<!--]--></div><div class="flex gap-3 pt-2" data-v-7e4a5b33><button class="flex-1 py-3 px-4 bg-base-200 hover:bg-base-300 text-base-content/70 font-semibold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] text-sm" data-v-7e4a5b33>${ssrInterpolate(unref(t)("mmr.prev"))}</button>`);
        if (!isLastQuestion.value) {
          _push(`<button${ssrIncludeBooleanAttr(!canProceed.value) ? " disabled" : ""} class="flex-[2] py-3 px-4 bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-md hover:shadow-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-md" data-v-7e4a5b33>${ssrInterpolate(unref(t)("mmr.next"))}</button>`);
        } else {
          _push(`<button${ssrIncludeBooleanAttr(!canProceed.value || isSubmitting.value) ? " disabled" : ""} class="flex-[2] py-3 px-4 bg-success hover:bg-success/90 text-success-content font-bold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-md hover:shadow-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed" data-v-7e4a5b33>`);
          if (isSubmitting.value) {
            _push(`<span class="inline-flex items-center gap-2" data-v-7e4a5b33><svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" data-v-7e4a5b33><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-7e4a5b33></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" data-v-7e4a5b33></path></svg> ${ssrInterpolate(unref(t)("mmr.submit"))}... </span>`);
          } else {
            _push(`<span data-v-7e4a5b33>${ssrInterpolate(unref(t)("mmr.submit"))}</span>`);
          }
          _push(`</button>`);
        }
        _push(`</div></div></div>`);
      }
      _push(`</div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MmrAssessment.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MmrAssessment = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7e4a5b33"]]);
export {
  MmrAssessment as default
};
