import { withCtx, unref, createVNode, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./GuestLayout-BzwsiGU-.js";
import { _ as _sfc_main$2 } from "./InputError-fLcttu_2.js";
import { useForm, Head } from "@inertiajs/vue3";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./useLocale-gpJrLIKB.js";
import "./badminton_party_no_bg-BuvWAsKl.js";
const _sfc_main = {
  __name: "ResetPassword",
  __ssrInlineRender: true,
  props: { email: { type: String, required: true }, token: { type: String, required: true } },
  setup(__props) {
    const props = __props;
    const form = useForm({ token: props.token, email: props.email, password: "", password_confirmation: "" });
    const submit = () => {
      form.post(route("password.store"), { onFinish: () => form.reset("password", "password_confirmation") });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), { title: "Reset Password" }, null, _parent2, _scopeId));
            _push2(`<div class="text-center mb-6"${_scopeId}><div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3"${_scopeId}><i class="pi pi-key text-2xl text-court-600"${_scopeId}></i></div><h1 class="text-2xl font-bold text-base-content m-0"${_scopeId}>ตั้งรหัสผ่านใหม่</h1></div><form class="space-y-4"${_scopeId}><div${_scopeId}><label for="email" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>Email</label><input id="email" type="email"${ssrRenderAttr("value", unref(form).email)} required autofocus autocomplete="username" class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-1",
              message: unref(form).errors.email
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label for="password" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>Password</label><input id="password" type="password"${ssrRenderAttr("value", unref(form).password)} required autocomplete="new-password" placeholder="********" class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-1",
              message: unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label for="password_confirmation" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>Confirm Password</label><input id="password_confirmation" type="password"${ssrRenderAttr("value", unref(form).password_confirmation)} required autocomplete="new-password" placeholder="********" class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-1",
              message: unref(form).errors.password_confirmation
            }, null, _parent2, _scopeId));
            _push2(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all cursor-pointer active:scale-[0.98] shadow-xs disabled:opacity-50 text-sm"${_scopeId}> ตั้งรหัสผ่านใหม่ </button></form>`);
          } else {
            return [
              createVNode(unref(Head), { title: "Reset Password" }),
              createVNode("div", { class: "text-center mb-6" }, [
                createVNode("div", { class: "inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3" }, [
                  createVNode("i", { class: "pi pi-key text-2xl text-court-600" })
                ]),
                createVNode("h1", { class: "text-2xl font-bold text-base-content m-0" }, "ตั้งรหัสผ่านใหม่")
              ]),
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
                    class: "w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).email]
                  ]),
                  createVNode(_sfc_main$2, {
                    class: "mt-1",
                    message: unref(form).errors.email
                  }, null, 8, ["message"])
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    for: "password",
                    class: "block text-sm font-medium text-base-content/80 mb-1"
                  }, "Password"),
                  withDirectives(createVNode("input", {
                    id: "password",
                    type: "password",
                    "onUpdate:modelValue": ($event) => unref(form).password = $event,
                    required: "",
                    autocomplete: "new-password",
                    placeholder: "********",
                    class: "w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).password]
                  ]),
                  createVNode(_sfc_main$2, {
                    class: "mt-1",
                    message: unref(form).errors.password
                  }, null, 8, ["message"])
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    for: "password_confirmation",
                    class: "block text-sm font-medium text-base-content/80 mb-1"
                  }, "Confirm Password"),
                  withDirectives(createVNode("input", {
                    id: "password_confirmation",
                    type: "password",
                    "onUpdate:modelValue": ($event) => unref(form).password_confirmation = $event,
                    required: "",
                    autocomplete: "new-password",
                    placeholder: "********",
                    class: "w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"
                  }, null, 8, ["onUpdate:modelValue"]), [
                    [vModelText, unref(form).password_confirmation]
                  ]),
                  createVNode(_sfc_main$2, {
                    class: "mt-1",
                    message: unref(form).errors.password_confirmation
                  }, null, 8, ["message"])
                ]),
                createVNode("button", {
                  type: "submit",
                  disabled: unref(form).processing,
                  class: "w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all cursor-pointer active:scale-[0.98] shadow-xs disabled:opacity-50 text-sm"
                }, " ตั้งรหัสผ่านใหม่ ", 8, ["disabled"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/ResetPassword.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
