import { computed, withCtx, unref, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, withModifiers, useSSRContext } from "vue";
import { ssrRenderComponent, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./GuestLayout-DJuB14yC.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./useLocale-gpJrLIKB.js";
const _sfc_main = {
  __name: "VerifyEmail",
  __ssrInlineRender: true,
  props: { status: { type: String } },
  setup(__props) {
    const props = __props;
    const form = useForm({});
    const submit = () => {
      form.post(route("verification.send"));
    };
    const verificationLinkSent = computed(() => props.status === "verification-link-sent");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Email Verification" }, null, _parent2, _scopeId));
            _push2(`<div class="text-center mb-6"${_scopeId}><div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3"${_scopeId}><i class="pi pi-envelope text-2xl text-court-600"${_scopeId}></i></div><h1 class="text-2xl font-bold text-base-content m-0"${_scopeId}>ยืนยัน Email</h1><p class="text-sm text-base-content/60 mt-2 m-0"${_scopeId}>กรุณายืนยัน Email ของท่าน โดยคลิกลิงก์ที่ส่งไป ถ้ายังไม่ได้รับสามารถกดส่งใหม่ได้</p></div>`);
            if (verificationLinkSent.value) {
              _push2(`<div class="mb-4 p-3 rounded-xl bg-court-50 text-court-700 text-sm text-center"${_scopeId}> ส่งลิงก์ยืนยันไปยัง Email แล้ว </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="space-y-4"${_scopeId}><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all cursor-pointer active:scale-[0.98] shadow-xs disabled:opacity-50 text-sm"${_scopeId}> ส่งลิงก์ยืนยันอีกครั้ง </button><div class="text-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("logout"),
              method: "post",
              as: "button",
              class: "text-sm text-base-content/60 hover:text-base-content/80 no-underline bg-transparent border-0 cursor-pointer font-sans"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` ออกจากระบบ `);
                } else {
                  return [
                    createTextVNode(" ออกจากระบบ ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></form>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Email Verification" }),
              createVNode("div", { class: "text-center mb-6" }, [
                createVNode("div", { class: "inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3" }, [
                  createVNode("i", { class: "pi pi-envelope text-2xl text-court-600" })
                ]),
                createVNode("h1", { class: "text-2xl font-bold text-base-content m-0" }, "ยืนยัน Email"),
                createVNode("p", { class: "text-sm text-base-content/60 mt-2 m-0" }, "กรุณายืนยัน Email ของท่าน โดยคลิกลิงก์ที่ส่งไป ถ้ายังไม่ได้รับสามารถกดส่งใหม่ได้")
              ]),
              verificationLinkSent.value ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-4 p-3 rounded-xl bg-court-50 text-court-700 text-sm text-center"
              }, " ส่งลิงก์ยืนยันไปยัง Email แล้ว ")) : createCommentVNode("", true),
              createVNode("form", {
                onSubmit: withModifiers(submit, ["prevent"]),
                class: "space-y-4"
              }, [
                createVNode("button", {
                  type: "submit",
                  disabled: unref(form).processing,
                  class: "w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all cursor-pointer active:scale-[0.98] shadow-xs disabled:opacity-50 text-sm"
                }, " ส่งลิงก์ยืนยันอีกครั้ง ", 8, ["disabled"]),
                createVNode("div", { class: "text-center" }, [
                  createVNode(unref(Link), {
                    href: _ctx.route("logout"),
                    method: "post",
                    as: "button",
                    class: "text-sm text-base-content/60 hover:text-base-content/80 no-underline bg-transparent border-0 cursor-pointer font-sans"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" ออกจากระบบ ")
                    ]),
                    _: 1
                  }, 8, ["href"])
                ])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/VerifyEmail.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
