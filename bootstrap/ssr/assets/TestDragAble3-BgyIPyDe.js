import { ref, resolveDirective, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrGetDirectiveProps } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "TestDragAble3",
  __ssrInlineRender: true,
  setup(__props) {
    ref(0);
    ref(null);
    ref(false);
    const isHovered = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_draggable = resolveDirective("draggable");
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-e582f94d><div${ssrRenderAttrs(ssrGetDirectiveProps(_ctx, _directive_draggable, { handle: "strong" }))} data-v-e582f94d> Drag me! <strong data-v-e582f94d>Drag</strong></div><div class="${ssrRenderClass([{ "hovered": isHovered.value }, "square-box"])}" data-v-e582f94d></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/TestDragAble3.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TestDragAble3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e582f94d"]]);
export {
  TestDragAble3 as default
};
