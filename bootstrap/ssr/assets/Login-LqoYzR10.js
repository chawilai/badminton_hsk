import { ref, onMounted, withCtx, unref, createTextVNode, toDisplayString, createVNode, createBlock, createCommentVNode, openBlock, Transition, withModifiers, withDirectives, vModelText, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./GuestLayout-m_k4UCMZ.js";
import { _ as _sfc_main$2 } from "./InputError-fLcttu_2.js";
import { usePage, useForm, router, Head, Link } from "@inertiajs/vue3";
import liff from "@line/liff";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import "./LocaleSwitcher-DHf7bxTb.js";
const _sfc_main = {
  __name: "Login",
  __ssrInlineRender: true,
  props: {
    canResetPassword: {
      type: Boolean
    },
    status: {
      type: String
    }
  },
  setup(__props) {
    const { t } = useLocale();
    const page = usePage();
    const form = useForm({
      email: "",
      password: "",
      remember: false
    });
    const showEmailForm = ref(false);
    const submit = () => {
      form.post(route("login"), {
        onFinish: () => form.reset("password")
      });
    };
    const lineLoginUrl = route("social.login", "line");
    const googleLoginUrl = route("social.login", "google");
    onMounted(() => {
      try {
        const isGuest = !page.props.auth.user;
        if (!isGuest) return;
        liff.init({ liffId: "2001165902-9zoxvoY1" }).then(() => {
          if (!liff.isInClient()) return;
          if (!liff.isLoggedIn()) {
            liff.login({ redirectUri: window.location.href });
            return;
          }
          liff.getProfile().then((profile) => {
            var _a;
            router.post(`login/lineliff`, {
              provider: "line",
              userId: profile.userId,
              displayName: profile.displayName,
              email: (_a = liff.getDecodedIDToken()) == null ? void 0 : _a.email,
              pictureUrl: profile.pictureUrl
            }, { preserveScroll: true });
          }).catch(() => {
          });
        }).catch(() => {
        });
      } catch (e) {
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Head), {
              title: unref(t)("auth.login")
            }, null, _parent2, _scopeId));
            _push2(`<div class="text-center mb-6"${_scopeId}><div class="inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3"${_scopeId}><span class="text-3xl"${_scopeId}>🏸</span></div><h1 class="text-2xl font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(unref(t)("auth.login"))}</h1><p class="text-sm text-base-content/60 mt-1 m-0"${_scopeId}>Badminton Party</p></div>`);
            if (__props.status) {
              _push2(`<div class="mb-4 p-3 rounded-xl bg-court-50 text-court-700 text-sm text-center"${_scopeId}>${ssrInterpolate(__props.status)}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<a${ssrRenderAttr("href", unref(lineLoginUrl))} class="flex items-center justify-center w-full py-3 px-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-semibold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] shadow-xs hover:shadow-md gap-3"${_scopeId}><svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"${_scopeId}><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(unref(t)("auth.loginWithLine"))}</span></a><a${ssrRenderAttr("href", unref(googleLoginUrl))} class="flex items-center justify-center w-full py-3 px-4 mt-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] shadow-xs hover:shadow-md gap-3 border border-gray-300"${_scopeId}><svg class="w-5 h-5" viewBox="0 0 24 24"${_scopeId}><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"${_scopeId}></path><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"${_scopeId}></path><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"${_scopeId}></path><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"${_scopeId}></path></svg><span${_scopeId}>${ssrInterpolate(unref(t)("auth.loginWithGoogle"))}</span></a><div class="flex items-center gap-3 my-5"${_scopeId}><div class="flex-1 h-px bg-base-300"${_scopeId}></div><span class="text-xs text-base-content/50 uppercase tracking-wider"${_scopeId}>${ssrInterpolate(unref(t)("auth.or"))}</span><div class="flex-1 h-px bg-base-300"${_scopeId}></div></div>`);
            if (!showEmailForm.value) {
              _push2(`<button class="w-full py-3 px-4 bg-base-200 hover:bg-base-200 text-base-content/80 font-medium rounded-xl border border-base-300 transition-all duration-200 cursor-pointer text-sm"${_scopeId}><i class="pi pi-envelope mr-2 text-xs"${_scopeId}></i> ${ssrInterpolate(unref(t)("auth.loginWithEmail"))}</button>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(``);
            if (showEmailForm.value) {
              _push2(`<form class="space-y-4"${_scopeId}><div${_scopeId}><label for="email" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("auth.email"))}</label><input id="email" type="email"${ssrRenderAttr("value", unref(form).email)} required autofocus autocomplete="username" class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" placeholder="your@email.com"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                class: "mt-1",
                message: unref(form).errors.email
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><label for="password" class="block text-sm font-medium text-base-content/80 mb-1"${_scopeId}>${ssrInterpolate(unref(t)("auth.password"))}</label><input id="password" type="password"${ssrRenderAttr("value", unref(form).password)} required autocomplete="current-password" class="w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all" placeholder="********"${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                class: "mt-1",
                message: unref(form).errors.password
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex items-center justify-between"${_scopeId}><label class="flex items-center gap-2 cursor-pointer"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(form).remember) ? ssrLooseContain(unref(form).remember, null) : unref(form).remember) ? " checked" : ""} class="w-4 h-4 rounded border-base-300 text-court-600 focus:ring-court-500"${_scopeId}><span class="text-sm text-base-content/70"${_scopeId}>${ssrInterpolate(unref(t)("auth.rememberMe"))}</span></label>`);
              if (__props.canResetPassword) {
                _push2(ssrRenderComponent(unref(Link), {
                  href: _ctx.route("password.request"),
                  class: "text-sm text-court-600 hover:text-court-700 no-underline transition-colors"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(t)("auth.forgotPassword"))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(t)("auth.forgotPassword")), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(form).processing) ? " disabled" : ""} class="w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"${_scopeId}>`);
              if (unref(form).processing) {
                _push2(`<span class="inline-flex items-center gap-2"${_scopeId}><i class="pi pi-spinner pi-spin text-xs"${_scopeId}></i> ${ssrInterpolate(unref(t)("auth.loggingIn"))}</span>`);
              } else {
                _push2(`<span${_scopeId}>${ssrInterpolate(unref(t)("auth.login"))}</span>`);
              }
              _push2(`</button></form>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode(unref(Head), {
                title: unref(t)("auth.login")
              }, null, 8, ["title"]),
              createVNode("div", { class: "text-center mb-6" }, [
                createVNode("div", { class: "inline-flex items-center justify-center w-14 h-14 bg-court-100 rounded-2xl mb-3" }, [
                  createVNode("span", { class: "text-3xl" }, "🏸")
                ]),
                createVNode("h1", { class: "text-2xl font-bold text-base-content m-0" }, toDisplayString(unref(t)("auth.login")), 1),
                createVNode("p", { class: "text-sm text-base-content/60 mt-1 m-0" }, "Badminton Party")
              ]),
              __props.status ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mb-4 p-3 rounded-xl bg-court-50 text-court-700 text-sm text-center"
              }, toDisplayString(__props.status), 1)) : createCommentVNode("", true),
              createVNode("a", {
                href: unref(lineLoginUrl),
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
              createVNode("a", {
                href: unref(googleLoginUrl),
                class: "flex items-center justify-center w-full py-3 px-4 mt-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl no-underline transition-all duration-200 active:scale-[0.98] shadow-xs hover:shadow-md gap-3 border border-gray-300"
              }, [
                (openBlock(), createBlock("svg", {
                  class: "w-5 h-5",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z",
                    fill: "#4285F4"
                  }),
                  createVNode("path", {
                    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                    fill: "#34A853"
                  }),
                  createVNode("path", {
                    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                    fill: "#FBBC05"
                  }),
                  createVNode("path", {
                    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                    fill: "#EA4335"
                  })
                ])),
                createVNode("span", null, toDisplayString(unref(t)("auth.loginWithGoogle")), 1)
              ], 8, ["href"]),
              createVNode("div", { class: "flex items-center gap-3 my-5" }, [
                createVNode("div", { class: "flex-1 h-px bg-base-300" }),
                createVNode("span", { class: "text-xs text-base-content/50 uppercase tracking-wider" }, toDisplayString(unref(t)("auth.or")), 1),
                createVNode("div", { class: "flex-1 h-px bg-base-300" })
              ]),
              !showEmailForm.value ? (openBlock(), createBlock("button", {
                key: 1,
                onClick: ($event) => showEmailForm.value = true,
                class: "w-full py-3 px-4 bg-base-200 hover:bg-base-200 text-base-content/80 font-medium rounded-xl border border-base-300 transition-all duration-200 cursor-pointer text-sm"
              }, [
                createVNode("i", { class: "pi pi-envelope mr-2 text-xs" }),
                createTextVNode(" " + toDisplayString(unref(t)("auth.loginWithEmail")), 1)
              ], 8, ["onClick"])) : createCommentVNode("", true),
              createVNode(Transition, { name: "page-fade" }, {
                default: withCtx(() => [
                  showEmailForm.value ? (openBlock(), createBlock("form", {
                    key: 0,
                    onSubmit: withModifiers(submit, ["prevent"]),
                    class: "space-y-4"
                  }, [
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
                        autofocus: "",
                        autocomplete: "username",
                        class: "w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all",
                        placeholder: "your@email.com"
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
                        autocomplete: "current-password",
                        class: "w-full px-4 py-2.5 rounded-xl border border-base-300 bg-base-100 text-base-content text-sm focus:border-court-500 focus:ring-2 focus:ring-court-500/20 outline-hidden transition-all",
                        placeholder: "********"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, unref(form).password]
                      ]),
                      createVNode(_sfc_main$2, {
                        class: "mt-1",
                        message: unref(form).errors.password
                      }, null, 8, ["message"])
                    ]),
                    createVNode("div", { class: "flex items-center justify-between" }, [
                      createVNode("label", { class: "flex items-center gap-2 cursor-pointer" }, [
                        withDirectives(createVNode("input", {
                          type: "checkbox",
                          "onUpdate:modelValue": ($event) => unref(form).remember = $event,
                          class: "w-4 h-4 rounded border-base-300 text-court-600 focus:ring-court-500"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, unref(form).remember]
                        ]),
                        createVNode("span", { class: "text-sm text-base-content/70" }, toDisplayString(unref(t)("auth.rememberMe")), 1)
                      ]),
                      __props.canResetPassword ? (openBlock(), createBlock(unref(Link), {
                        key: 0,
                        href: _ctx.route("password.request"),
                        class: "text-sm text-court-600 hover:text-court-700 no-underline transition-colors"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(t)("auth.forgotPassword")), 1)
                        ]),
                        _: 1
                      }, 8, ["href"])) : createCommentVNode("", true)
                    ]),
                    createVNode("button", {
                      type: "submit",
                      disabled: unref(form).processing,
                      class: "w-full py-2.5 px-4 bg-court-600 hover:bg-court-700 text-white font-semibold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-xs hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    }, [
                      unref(form).processing ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "inline-flex items-center gap-2"
                      }, [
                        createVNode("i", { class: "pi pi-spinner pi-spin text-xs" }),
                        createTextVNode(" " + toDisplayString(unref(t)("auth.loggingIn")), 1)
                      ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(unref(t)("auth.login")), 1))
                    ], 8, ["disabled"])
                  ], 32)) : createCommentVNode("", true)
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Auth/Login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
