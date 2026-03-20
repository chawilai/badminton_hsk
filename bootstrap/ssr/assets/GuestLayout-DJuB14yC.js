import { mergeProps, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderSlot } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./LocaleSwitcher-BOmG4hBt.js";
const badminton_party = "/icons/icon-192x192.png";
const _sfc_main = {
  __name: "GuestLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-base-200" }, _attrs))}><div class="fixed top-4 right-4 z-50">`);
      _push(ssrRenderComponent(_sfc_main$1, null, null, _parent));
      _push(`</div><div class="fixed inset-0 overflow-hidden pointer-events-none"><div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div><div class="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div></div><div class="relative z-10 mb-6 animate-fade-in">`);
      _push(ssrRenderComponent(unref(Link), { href: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="w-40 h-auto drop-shadow-lg"${ssrRenderAttr("src", badminton_party)} alt="Badminton Party"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                class: "w-40 h-auto drop-shadow-lg",
                src: badminton_party,
                alt: "Badminton Party"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="relative z-10 w-full max-w-md animate-slide-up"><div class="bg-base-100 backdrop-blur-xl rounded-2xl shadow-lg border border-base-300 p-8">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/GuestLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
