import { mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { Link } from "@inertiajs/vue3";
const badminton_party = "/icons/icon-192x192.png";
const _sfc_main = {
  __name: "Main",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "" }, _attrs))}><img class="absolute w-full" src="/storage/images/intersect.svg" alt=""><section class="h-auto md:h-svh font-sans bg-gradient-to-b from-gray-50 to-white"><header class="relative z-50 h-24 md:mt-0 md:translate-y-0 bg-gray-50"><div class="flex items-center w-full h-full px-6 mx-auto max-w-7xl md:px-8"><div class="relative flex items-center justify-between w-full h-auto"><div class="shrink-0"><a href="/" class="flex items-center justify-center rounded outline-hidden active:outline-hidden"><div class="relative w-12 h-12 mr-2"><img${ssrRenderAttr("src", badminton_party)} alt=""></div><span class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-gray-900">Badminton Party</span></a></div><div class="flex md:hidden"><button id="open-menu" onclick="document.getElementById(&#39;menu&#39;).classList.remove(&#39;hidden&#39;); document.getElementById(&#39;close-menu&#39;).classList.remove(&#39;hidden&#39;); this.classList.add(&#39;hidden&#39;);" type="button" class="text-gray-900"><svg class="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg></button><button id="close-menu" onclick="document.getElementById(&#39;menu&#39;).classList.add(&#39;hidden&#39;); document.getElementById(&#39;open-menu&#39;).classList.remove(&#39;hidden&#39;); this.classList.add(&#39;hidden&#39;);" type="button" class="hidden text-gray-900"><svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button></div><div id="menu" class="fixed top-0 left-0 z-20 flex-col hidden w-full h-auto translate-y-24 shadow-xs md:absolute md:inset-y-0 md:flex md:flex-row md:top-auto md:translate-y-0 md:h-full md:w-auto bg-gray-50 md:shadow-none md:bg-transparent md:items-center md:justify-center md:space-x-12 md:-translate-x-1/2 md:left-1/2">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/home",
        class: "relative flex items-center justify-center w-full h-16 px-1 text-base text-gray-900 transition-all duration-300 rounded outline-hidden cursor-pointer group md:w-auto md:h-auto md:inline-block md:hover:-rotate-3 active:ring-0 active:outline-hidden"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="relative z-20 whitespace-nowrap"${_scopeId}>Home</span><span class="absolute bottom-0 left-0 z-10 w-0 h-2 transition-all duration-300 ease-out skew-x-12 group-hover:w-full bg-red-400"${_scopeId}></span>`);
          } else {
            return [
              createVNode("span", { class: "relative z-20 whitespace-nowrap" }, "Home"),
              createVNode("span", { class: "absolute bottom-0 left-0 z-10 w-0 h-2 transition-all duration-300 ease-out skew-x-12 group-hover:w-full bg-red-400" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Link), {
        href: "#login",
        target: "_blank",
        title: "",
        class: "flex items-center justify-center h-16 px-5 text-base font-semibold leading-7 text-center text-white transition-all duration-200 duration-300 ease-out md:hidden bg-red-400 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white",
        role: "button"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`เข้าสู่ระบบ`);
          } else {
            return [
              createTextVNode("เข้าสู่ระบบ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="hidden md:flex md:items-center md:justify-center">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "#login",
        title: "",
        class: "px-5 py-2 hover:-rotate-3 transition-all ease-out duration-300 text-base font-semibold leading-7 text-gray-900 duration-200 bg-transparent border border-gray-200 rounded-md focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 hover:bg-red-500 hover:text-white sm:w-auto hover:scale-[1.01] focus:bg-red-500 focus:text-white",
        role: "button"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`เข้าสู่ระบบ`);
          } else {
            return [
              createTextVNode("เข้าสู่ระบบ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></header><div class="overflow-x-hidden">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></section><section><footer class="bg-gray-100 text-sm py-3"><div class="container mx-auto flex justify-between items-center px-4"><p>© 2024 Chawilai. All rights reserved.</p><div><a href="#" class="hover:underline">Contact Us</a></div></div></footer></section></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Layouts/Main.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
