import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
const _sfc_main = {
  __name: "MmrBadge",
  __ssrInlineRender: true,
  props: {
    level: {
      type: Number,
      required: true
    },
    tierName: {
      type: String,
      required: true
    },
    tierColor: {
      type: String,
      required: true
    },
    size: {
      type: String,
      default: "sm",
      validator: (val) => ["sm", "md"].includes(val)
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.size === "sm") {
        _push(`<span${ssrRenderAttrs(mergeProps({
          class: "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold leading-tight whitespace-nowrap",
          style: {
            backgroundColor: __props.tierColor + "20",
            color: __props.tierColor
          }
        }, _attrs))}><span class="font-black">Lv.${ssrInterpolate(__props.level)}</span><span class="font-semibold">${ssrInterpolate(__props.tierName)}</span></span>`);
      } else {
        _push(`<span${ssrRenderAttrs(mergeProps({
          class: "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold leading-tight whitespace-nowrap shadow-md",
          style: {
            backgroundColor: __props.tierColor + "20",
            color: __props.tierColor,
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: __props.tierColor + "40"
          }
        }, _attrs))}><span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black text-white" style="${ssrRenderStyle({ backgroundColor: __props.tierColor })}">${ssrInterpolate(__props.level)}</span><span class="font-bold text-base">${ssrInterpolate(__props.tierName)}</span></span>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/MmrBadge.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
