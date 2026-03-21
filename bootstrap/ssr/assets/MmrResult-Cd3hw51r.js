import { computed, ref, onMounted, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { Head, Link } from "@inertiajs/vue3";
import { u as useLocale } from "./useLocale-BkZfXvwr.js";
import { _ as _sfc_main$1 } from "./LocaleSwitcher-41-e_7Js.js";
import { _ as _sfc_main$2 } from "./MmrBadge-cgcVUpf7.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "MmrResult",
  __ssrInlineRender: true,
  props: {
    mmr: {
      type: Number,
      required: true
    },
    level: {
      type: Object,
      default: () => ({ level: 0, name_th: "-", name_en: "-", tier_color: "#A0AEC0", tier_th: "-", tier_en: "-" })
    }
  },
  setup(__props) {
    const { t, locale } = useLocale();
    const props = __props;
    const tierName = computed(() => {
      var _a, _b;
      return locale.value === "th" ? ((_a = props.level) == null ? void 0 : _a.name_th) || "-" : ((_b = props.level) == null ? void 0 : _b.name_en) || "-";
    });
    const showContent = ref(false);
    const showBadge = ref(false);
    const showStats = ref(false);
    const showButtons = ref(false);
    onMounted(() => {
      setTimeout(() => {
        showContent.value = true;
      }, 200);
      setTimeout(() => {
        showBadge.value = true;
      }, 600);
      setTimeout(() => {
        showStats.value = true;
      }, 1e3);
      setTimeout(() => {
        showButtons.value = true;
      }, 1400);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: unref(t)("mmr.resultTitle")
      }, null, _parent));
      _push(`<div class="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-accent/10 flex flex-col" data-v-b69fe8ef><div class="fixed top-4 right-4 z-50" data-v-b69fe8ef>`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div><div class="fixed inset-0 overflow-hidden pointer-events-none" data-v-b69fe8ef><div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl" data-v-b69fe8ef></div><div class="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" data-v-b69fe8ef></div><div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-success/5 rounded-full blur-3xl" data-v-b69fe8ef></div></div><div class="flex-1 flex items-center justify-center px-4 py-8 relative z-10" data-v-b69fe8ef><div class="w-full max-w-lg text-center space-y-6" data-v-b69fe8ef>`);
      if (showContent.value) {
        _push(`<div class="space-y-2" data-v-b69fe8ef><div class="text-6xl mb-2" data-v-b69fe8ef>🎉</div><h1 class="text-2xl font-black text-base-content m-0" data-v-b69fe8ef>${ssrInterpolate(unref(t)("mmr.congratulations"))}</h1><p class="text-sm text-base-content/60 m-0" data-v-b69fe8ef>${ssrInterpolate(unref(t)("mmr.readyToPlay"))}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showBadge.value) {
        _push(`<div class="space-y-4" data-v-b69fe8ef><div class="inline-flex flex-col items-center" data-v-b69fe8ef><div class="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-xl border-4 border-base-100" style="${ssrRenderStyle({ backgroundColor: __props.level.tier_color + "20", borderColor: __props.level.tier_color })}" data-v-b69fe8ef><span class="text-xs font-bold uppercase tracking-wider" style="${ssrRenderStyle({ color: __props.level.tier_color })}" data-v-b69fe8ef>${ssrInterpolate(unref(t)("mmr.yourLevel"))}</span><span class="text-5xl font-black" style="${ssrRenderStyle({ color: __props.level.tier_color })}" data-v-b69fe8ef>${ssrInterpolate(__props.level.level)}</span></div></div><div data-v-b69fe8ef>`);
        _push(ssrRenderComponent(_sfc_main$2, {
          level: __props.level.level,
          "tier-name": tierName.value,
          "tier-color": __props.level.tier_color,
          size: "md"
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showStats.value) {
        _push(`<div data-v-b69fe8ef><div class="bg-base-100/70 backdrop-blur-xl rounded-2xl border border-base-300/50 shadow-lg p-6 space-y-4" data-v-b69fe8ef><div class="flex items-center justify-between" data-v-b69fe8ef><span class="text-sm font-semibold text-base-content/60" data-v-b69fe8ef>${ssrInterpolate(unref(t)("mmr.yourMmr"))}</span><span class="text-3xl font-black text-primary" data-v-b69fe8ef>${ssrInterpolate(__props.mmr)}</span></div><div class="h-px bg-base-300/50" data-v-b69fe8ef></div><div class="flex items-center justify-between" data-v-b69fe8ef><span class="text-sm font-semibold text-base-content/60" data-v-b69fe8ef>${ssrInterpolate(unref(t)("mmr.yourLevel"))}</span><div class="flex items-center gap-2" data-v-b69fe8ef><span class="text-lg font-bold text-base-content" data-v-b69fe8ef>Lv.${ssrInterpolate(__props.level.level)}</span><span class="text-sm font-semibold" style="${ssrRenderStyle({ color: __props.level.tier_color })}" data-v-b69fe8ef>${ssrInterpolate(tierName.value)}</span></div></div><div class="bg-info/10 rounded-xl p-3 flex items-start gap-2" data-v-b69fe8ef><svg class="w-4 h-4 text-info shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-b69fe8ef><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" data-v-b69fe8ef></path></svg><span class="text-xs text-info leading-relaxed" data-v-b69fe8ef>${ssrInterpolate(unref(t)("mmr.levelWillAdjust"))}</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showButtons.value) {
        _push(`<div class="space-y-3" data-v-b69fe8ef>`);
        _push(ssrRenderComponent(unref(Link), {
          href: "/party-lists",
          class: "flex items-center justify-center w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] shadow-lg hover:shadow-xl text-base gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span data-v-b69fe8ef${_scopeId}>🏸</span> ${ssrInterpolate(unref(t)("mmr.findParty"))}`);
            } else {
              return [
                createVNode("span", null, "🏸"),
                createTextVNode(" " + toDisplayString(unref(t)("mmr.findParty")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Link), {
          href: "/profile",
          class: "flex items-center justify-center w-full py-3 px-6 bg-base-200 hover:bg-base-300 text-base-content/70 font-semibold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] text-sm gap-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-b69fe8ef${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-b69fe8ef${_scopeId}></path></svg> ${ssrInterpolate(unref(t)("mmr.viewProfile"))}`);
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
                    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  })
                ])),
                createTextVNode(" " + toDisplayString(unref(t)("mmr.viewProfile")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/MmrResult.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const MmrResult = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b69fe8ef"]]);
export {
  MmrResult as default
};
