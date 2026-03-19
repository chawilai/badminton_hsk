import { resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Card = resolveComponent("Card", true);
  const _component_Button = resolveComponent("Button");
  _push(ssrRenderComponent(_component_Card, mergeProps({ class: "shadow-2 p-3 border-round-lg" }, _attrs), {
    header: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="flex justify-content-between align-items-center" data-v-9d98d338${_scopeId}><h3 class="text-lg font-bold m-0" data-v-9d98d338${_scopeId}>Card Title</h3>`);
        _push2(ssrRenderComponent(_component_Button, {
          icon: "pi pi-ellipsis-h",
          class: "p-button-rounded p-button-text"
        }, null, _parent2, _scopeId));
        _push2(`</div>`);
      } else {
        return [
          createVNode("div", { class: "flex justify-content-between align-items-center" }, [
            createVNode("h3", { class: "text-lg font-bold m-0" }, "Card Title"),
            createVNode(_component_Button, {
              icon: "pi pi-ellipsis-h",
              class: "p-button-rounded p-button-text"
            })
          ])
        ];
      }
    }),
    footer: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<div class="flex justify-content-end gap-2" data-v-9d98d338${_scopeId}>`);
        _push2(ssrRenderComponent(_component_Button, {
          label: "Cancel",
          class: "p-button-outlined p-button-danger"
        }, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_Button, {
          label: "Save",
          class: "p-button-raised p-button-success"
        }, null, _parent2, _scopeId));
        _push2(`</div>`);
      } else {
        return [
          createVNode("div", { class: "flex justify-content-end gap-2" }, [
            createVNode(_component_Button, {
              label: "Cancel",
              class: "p-button-outlined p-button-danger"
            }),
            createVNode(_component_Button, {
              label: "Save",
              class: "p-button-raised p-button-success"
            })
          ])
        ];
      }
    }),
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<p class="text-secondary mt-3 mb-3" data-v-9d98d338${_scopeId}> This is a simple card example with a header, content, and footer. Customize it as needed to fit your design. </p>`);
      } else {
        return [
          createVNode("p", { class: "text-secondary mt-3 mb-3" }, " This is a simple card example with a header, content, and footer. Customize it as needed to fit your design. ")
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Prime/Card.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Card = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-9d98d338"]]);
export {
  Card as default
};
