import { ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = {
  __name: "UserAvatar",
  __ssrInlineRender: true,
  props: {
    src: { type: String, default: null },
    name: { type: String, default: "?" },
    size: { type: String, default: "md" },
    // sm=7, md=9, lg=10, xl=16, 2xl=20, 3xl=24
    rounded: { type: String, default: "xl" }
    // full, xl, 2xl
  },
  setup(__props) {
    const props = __props;
    const failed = ref(false);
    const initials = () => {
      const n = (props.name || "?").trim();
      if (!n) return "?";
      const clean = n.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u{1F900}-\u{1F9FF}]|[\u200B-\u200D\uFEFF\u2800]/gu, "").trim();
      if (clean.length === 0) return n[0] || "?";
      return clean[0].toUpperCase();
    };
    const bgColor = () => {
      const colors = [
        "bg-primary/20 text-primary",
        "bg-secondary/20 text-secondary",
        "bg-accent/20 text-accent-content",
        "bg-info/20 text-info",
        "bg-success/20 text-success",
        "bg-warning/20 text-warning-content",
        "bg-neutral/20 text-neutral-content",
        "bg-error/20 text-error"
      ];
      let hash = 0;
      for (let i = 0; i < (props.name || "").length; i++) {
        hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };
    const sizeClasses = {
      sm: "w-7 h-7 text-[9px]",
      md: "w-9 h-9 text-xs",
      lg: "w-10 h-10 text-sm",
      xl: "w-16 h-16 text-xl",
      "2xl": "w-20 h-20 text-2xl",
      "3xl": "w-24 h-24 text-3xl"
    };
    const roundedClasses = {
      full: "rounded-full",
      xl: "rounded-xl",
      "2xl": "rounded-2xl"
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.src && !failed.value) {
        _push(`<img${ssrRenderAttrs(mergeProps({
          src: __props.src,
          alt: __props.name,
          class: ["object-cover bg-base-200", [sizeClasses[__props.size] || sizeClasses.md, roundedClasses[__props.rounded] || roundedClasses.xl]]
        }, _attrs))}>`);
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["flex items-center justify-center font-bold shrink-0", [sizeClasses[__props.size] || sizeClasses.md, roundedClasses[__props.rounded] || roundedClasses.xl, bgColor()]]
        }, _attrs))}>${ssrInterpolate(initials())}</div>`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/UserAvatar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
