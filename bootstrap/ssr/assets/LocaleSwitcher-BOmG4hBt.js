import { mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
const _sfc_main = {
  __name: "LocaleSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: "h-8 px-3 flex items-center justify-center rounded-lg bg-base-100/80 text-base-content hover:bg-base-200 transition-colors border border-base-300 cursor-pointer text-xs font-bold tracking-wide backdrop-blur-sm",
        title: unref(locale) === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"
      }, _attrs))}>${ssrInterpolate(unref(locale) === "th" ? "🌐 EN" : "🌐 TH")}</button>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/LocaleSwitcher.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
