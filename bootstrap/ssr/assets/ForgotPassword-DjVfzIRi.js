import { withCtx, unref, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./GuestLayout-m_k4UCMZ.js";
import { _ as _sfc_main$2 } from "./InputError-fLcttu_2.js";
import { useForm, Head } from "@inertiajs/vue3";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./useLocale-QwrDLuQY.js";
const _sfc_main = {
  __name: "ForgotPassword",
  __ssrInlineRender: true,
  props: { status: { type: String } },
  setup(__props) {
    const form = useForm({ email: "" });
    const submit = () => {
      form.post(route("password.email"));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Forgot Password" }, null, _parent2, _scopeId));
            _push2(`<div class="text-center mb-6"${_scopeId}><div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3"${_scopeId}><i class="pi pi-lock text-2xl text-court-600"${_scopeId}></i></div><h1 class="text-2xl font-bold text-base-content m-0"${_scopeId}>ลืมรหัสผ่าน</h1><p class="text-sm text-base-content/60 mt-2 m-0"${_scopeId}>ป้อน Email ที่ลงทะเบียนไว้ ท่านจะได้รับ Email เพื่อตั้งรหัสใหม่</p></div>`);
            if (__props.status) {
              _push2(`<div class="mb-4 p-3 rounded-xl bg-court-50 text-court-700 text-sm text-center"${_scopeId}>${ssrInterpolate(__props.status)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<form class="space-y-4"${_scopeId}><div${_scopeId}><label for="email" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>Email</label><input id="email" type="email"${ssrRenderAttr("value", unref(form).email)} required autofocus autocomplete="username" placeholder="your@email.com" class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-1",
              message: unref(form).errors.email
            }, null, _parent2, _scopeId));
            _push2(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all cursor-pointer active:scale-[0.98] shadow-xs disabled:opacity-50 text-sm"${_scopeId}> ส่งลิงก์ตั้งรหัสผ่านใหม่ </button></form>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Forgot Password" }),
              createVNode("div", { class: "text-center mb-6" }, [
                createVNode("div", { class: "inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3" }, [
                  createVNode("i", { class: "pi pi-lock text-2xl text-court-600" })
                ]),
                createVNode("h1", { class: "text-2xl font-bold text-base-content m-0" }, "ลืมรหัสผ่าน"),
                createVNode("p", { class: "text-sm text-base-content/60 mt-2 m-0" }, "ป้อน Email ที่ลงทะเบียนไว้ ท่านจะได้รับ Email เพื่อตั้งรหัสใหม่")
              ]),
              __props.status ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-4 p-3 rounded-xl bg-court-50 text-court-700 text-sm text-center"
              }, toDisplayString(__props.status), 1)) : createCommentVNode("", true),
              createVNode("form", {
                onSubmit: withModifiers(submit, ["prevent"]),
                class: "space-y-4"
              }, [
                createVNode("div", null, [
                  createVNode("label", {
                    for: "email",
                    class: "block text-sm font-medium text-base-content/80 mb-1"
                  }, "Email"),
                  withDirectives(createVNode("input", {
                    id: "email",
                    type: "email",
                    "onUpdate:modelValue": ($event) => unref(form).email = $event,
                    required: "",
                    autofocus: "",
                    autocomplete: "username",
                    placeholder: "your@email.com",
                    class: "w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).email]
                  ]),
                  createVNode(_sfc_main$2, {
                    class: "mt-1",
                    message: unref(form).errors.email
                  }, null, 8, ["message"])
                ]),
                createVNode("button", {
                  type: "submit",
                  disabled: unref(form).processing,
                  class: "w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all cursor-pointer active:scale-[0.98] shadow-xs disabled:opacity-50 text-sm"
                }, " ส่งลิงก์ตั้งรหัสผ่านใหม่ ", 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ForgotPassword.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
