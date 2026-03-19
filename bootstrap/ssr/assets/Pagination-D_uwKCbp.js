import { mergeProps, createVNode, resolveDynamicComponent, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderVNode } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
const _sfc_main = {
  __name: "Pagination",
  __ssrInlineRender: true,
  props: {
    links: {
      type: Array,
      required: true
    }
  },
  setup(__props) {
    const page = usePage();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex justify-between gap-x-2" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.links, (link, index) => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(link.url ? unref(Link) : "span"), mergeProps({
          key: link.label,
          "preserve-scroll": "",
          "preserve-state": "",
          class: ["border border-gray-2 py-1 px-3 rounded whitespace-nowrap", {
            "bg-red text-white font-bold": link.label == unref(page).props.page || !unref(page).props.page && index == 1,
            "text-gray-400 cursor-not-allowed": !link.url
          }]
        }, { ref_for: true }, link.url ? { href: link.url } : {}), null), _parent);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Shared/Pagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
