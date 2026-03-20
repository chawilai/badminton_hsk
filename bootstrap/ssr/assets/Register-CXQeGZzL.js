import { withCtx, unref, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, withModifiers, withDirectives, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./GuestLayout-DJuB14yC.js";
import { _ as _sfc_main$2 } from "./InputError-fLcttu_2.js";
import { useForm, Head, Link } from "@inertiajs/vue3";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
import "./LocaleSwitcher-BOmG4hBt.js";
const _sfc_main = {
  __name: "Register",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    const form = useForm({
      name: "",
      email: "",
      password: "",
      password_confirmation: ""
    });
    const submit = () => {
      form.post(route("register"), {
        onFinish: () => form.reset("password", "password_confirmation")
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), {
              title: unref(t)("auth.register")
            }, null, _parent2, _scopeId));
            _push2(`<div class="text-center mb-6"${_scopeId}><div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3"${_scopeId}><span class="text-3xl"${_scopeId}>🏸</span></div><h1 class="text-2xl font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(unref(t)("auth.register"))}</h1><p class="text-sm text-base-content/60 mt-1 m-0"${_scopeId}>Badminton Party</p></div><a${ssrRenderAttr("href", _ctx.route("social.login", "line"))} class="flex items-center justify-center w-full py-3 px-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] shadow-xs hover:shadow-md gap-3"${_scopeId}><svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"${_scopeId}><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(unref(t)("auth.loginWithLine"))}</span></a><div class="flex items-center gap-3 my-1"${_scopeId}><div class="flex-1 h-px bg-base-300"${_scopeId}></div><span class="text-xs text-base-content/40"${_scopeId}>${ssrInterpolate(unref(t)("auth.or"))}</span><div class="flex-1 h-px bg-base-300"${_scopeId}></div></div><form class="space-y-4"${_scopeId}><div${_scopeId}><label for="name" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("auth.name"))}</label><input id="name" type="text"${ssrRenderAttr("value", unref(form).name)} required autofocus autocomplete="name"${ssrRenderAttr("placeholder", unref(t)("auth.namePlaceholder"))} class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-1",
              message: unref(form).errors.name
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label for="email" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("auth.email"))}</label><input id="email" type="email"${ssrRenderAttr("value", unref(form).email)} required autocomplete="username" placeholder="your@email.com" class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-1",
              message: unref(form).errors.email
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label for="password" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("auth.password"))}</label><input id="password" type="password"${ssrRenderAttr("value", unref(form).password)} required autocomplete="new-password" placeholder="********" class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-1",
              message: unref(form).errors.password
            }, null, _parent2, _scopeId));
            _push2(`</div><div${_scopeId}><label for="password_confirmation" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("auth.confirmPassword"))}</label><input id="password_confirmation" type="password"${ssrRenderAttr("value", unref(form).password_confirmation)} required autocomplete="new-password" placeholder="********" class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              class: "mt-1",
              message: unref(form).errors.password_confirmation
            }, null, _parent2, _scopeId));
            _push2(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs hover:shadow-md disabled:opacity-50 text-sm"${_scopeId}>${ssrInterpolate(unref(t)("auth.register"))}</button><p class="text-center text-sm text-base-content/60 m-0"${_scopeId}>${ssrInterpolate(unref(t)("auth.hasAccount"))} `);
            _push2(ssrRenderComponent(unref(Link), {
              href: _ctx.route("login"),
              class: "text-court-600 hover:text-court-700 font-medium no-underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("auth.login"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("auth.login")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</p></form>`);
          } else {
            return [
              createVNode(unref(Head), {
                title: unref(t)("auth.register")
              }, null, 8, ["title"]),
              createVNode("div", { class: "text-center mb-6" }, [
                createVNode("div", { class: "inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3" }, [
                  createVNode("span", { class: "text-3xl" }, "🏸")
                ]),
                createVNode("h1", { class: "text-2xl font-bold text-base-content m-0" }, toDisplayString(unref(t)("auth.register")), 1),
                createVNode("p", { class: "text-sm text-base-content/60 mt-1 m-0" }, "Badminton Party")
              ]),
              createVNode("a", {
                href: _ctx.route("social.login", "line"),
                class: "flex items-center justify-center w-full py-3 px-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] shadow-xs hover:shadow-md gap-3"
              }, [
                (openBlock(), createBlock("svg", {
                  class: "w-6 h-6 fill-current",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", { d: "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" })
                ])),
                createVNode("span", null, toDisplayString(unref(t)("auth.loginWithLine")), 1)
              ], 8, ["href"]),
              createVNode("div", { class: "flex items-center gap-3 my-1" }, [
                createVNode("div", { class: "flex-1 h-px bg-base-300" }),
                createVNode("span", { class: "text-xs text-base-content/40" }, toDisplayString(unref(t)("auth.or")), 1),
                createVNode("div", { class: "flex-1 h-px bg-base-300" })
              ]),
              createVNode("form", {
                onSubmit: withModifiers(submit, ["prevent"]),
                class: "space-y-4"
              }, [
                createVNode("div", null, [
                  createVNode("label", {
                    for: "name",
                    class: "block text-sm font-medium text-base-content/80 mb-1"
                  }, toDisplayString(unref(t)("auth.name")), 1),
                  withDirectives(createVNode("input", {
                    id: "name",
                    type: "text",
                    "onUpdate:modelValue": ($event) => unref(form).name = $event,
                    required: "",
                    autofocus: "",
                    autocomplete: "name",
                    placeholder: unref(t)("auth.namePlaceholder"),
                    class: "w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all"
                  }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                    [vModelText, unref(form).name]
                  ]),
                  createVNode(_sfc_main$2, {
                    class: "mt-1",
                    message: unref(form).errors.name
                  }, null, 8, ["message"])
                ]),
                createVNode("div", null, [
                  createVNode("label", {
                    for: "email",
                    class: "block text-sm font-medium text-base-content/80 mb-1"
                  }, toDisplayString(unref(t)("auth.email")), 1),
                  withDirectives(createVNode("input", {
                    id: "email",
                    type: "email",
                    "onUpdate:modelValue": ($event) => unref(form).email = $event,
                    required: "",
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
                createVNode("div", null, [
                  createVNode("label", {
                    for: "password",
                    class: "block text-sm font-medium text-base-content/80 mb-1"
                  }, toDisplayString(unref(t)("auth.password")), 1),
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
                  }, toDisplayString(unref(t)("auth.confirmPassword")), 1),
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
                  class: "w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs hover:shadow-md disabled:opacity-50 text-sm"
                }, toDisplayString(unref(t)("auth.register")), 9, ["disabled"]),
                createVNode("p", { class: "text-center text-sm text-base-content/60 m-0" }, [
                  createTextVNode(toDisplayString(unref(t)("auth.hasAccount")) + " ", 1),
                  createVNode(unref(Link), {
                    href: _ctx.route("login"),
                    class: "text-court-600 hover:text-court-700 font-medium no-underline"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(t)("auth.login")), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
