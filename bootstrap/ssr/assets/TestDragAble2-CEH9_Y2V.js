import { ref, resolveComponent, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "TestDragAble2",
  __ssrInlineRender: true,
  setup(__props) {
    const lastTap = ref(0);
    const clickTimeout = ref(null);
    const handleInteraction = (event) => {
      const currentTime = (/* @__PURE__ */ new Date()).getTime();
      const tapInterval = currentTime - lastTap.value;
      if (tapInterval < 300 && tapInterval > 0) {
        if (event.type === "touchstart") {
          console.log("Double Tap Detected");
        } else if (event.type === "click") {
          console.log("Double Click Detected");
        }
        lastTap.value = 0;
      } else {
        lastTap.value = currentTime;
        if (event.type === "touchstart") {
          console.log("Single Tap Detected");
        } else if (event.type === "click") {
          console.log("Single Click Detected");
        }
        clearTimeout(clickTimeout.value);
        clickTimeout.value = setTimeout(() => {
          lastTap.value = 0;
        }, 300);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Draggable = resolveComponent("Draggable");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_Draggable, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="box" data-v-cdb5bb8c${_scopeId}>Drag Me</div>`);
          } else {
            return [
              createVNode("div", { class: "box" }, "Drag Me")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Draggable, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="box touch-area" data-v-cdb5bb8c${_scopeId}> Drop </div>`);
          } else {
            return [
              createVNode("div", {
                class: "box touch-area",
                onTouchstart: handleInteraction,
                onClick: handleInteraction
              }, " Drop ", 32)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/TestDragAble2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TestDragAble2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cdb5bb8c"]]);
export {
  TestDragAble2 as default
};
