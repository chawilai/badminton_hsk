import { unref, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-COXuhfhM.js";
import { Head, Link } from "@inertiajs/vue3";
import "./badmintonLayout-Bmnf0xqT.js";
import "./useLocale-gpJrLIKB.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./useToast-DyaFeJ92.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "404",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "404" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col items-center justify-center py-20 text-center"${_scopeId}><span class="text-6xl mb-4"${_scopeId}>🏸</span><h1 class="text-4xl font-bold text-base-content mb-2"${_scopeId}>404</h1><p class="text-base-content/60 mb-6"${_scopeId}>ไม่พบหน้าที่ต้องการ</p>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/home",
              class: "h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold no-underline flex items-center hover:bg-primary/80 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` กลับหน้าหลัก `);
                } else {
                  return [
                    createTextVNode(" กลับหน้าหลัก ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col items-center justify-center py-20 text-center" }, [
                createVNode("span", { class: "text-6xl mb-4" }, "🏸"),
                createVNode("h1", { class: "text-4xl font-bold text-base-content mb-2" }, "404"),
                createVNode("p", { class: "text-base-content/60 mb-6" }, "ไม่พบหน้าที่ต้องการ"),
                createVNode(unref(Link), {
                  href: "/home",
                  class: "h-10 px-6 rounded-xl bg-primary text-white text-sm font-semibold no-underline flex items-center hover:bg-primary/80 transition-colors"
                }, {
                  default: withCtx(() => [
                    createTextVNode(" กลับหน้าหลัก ")
                  ]),
                  _: 1
                })
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/404.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
