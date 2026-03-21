import { ref, onMounted, onBeforeUnmount, mergeProps, unref, useSSRContext, computed, withCtx, createVNode, createBlock, createCommentVNode, createTextVNode, openBlock, toDisplayString, renderSlot } from "vue";
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderStyle, ssrRenderSlot } from "vue/server-renderer";
import { usePage, Link } from "@inertiajs/vue3";
import { u as useBadmintonLayout } from "./badmintonLayout-C3Xd2fBf.js";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import { _ as _sfc_main$8 } from "./LocaleSwitcher-DHf7bxTb.js";
import { _ as _sfc_main$9 } from "./UserAvatar-Dwoh2ac-.js";
import { t as toasts } from "./useToast-DyaFeJ92.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { c as confirmState } from "./useConfirm-CffLghyV.js";
const _sfc_main$7 = {
  __name: "LayoutSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    const { currentTheme, availableThemes } = useBadmintonLayout();
    const menuVisible = ref(false);
    const onOutsideClick = (e) => {
      if (!e.target.closest(".theme-switcher")) {
        menuVisible.value = false;
      }
    };
    onMounted(() => document.addEventListener("click", onOutsideClick));
    onBeforeUnmount(() => document.removeEventListener("click", onOutsideClick));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "theme-switcher relative" }, _attrs))}><button class="w-9 h-9 flex items-center justify-center rounded-lg text-base-content/50 hover:bg-base-200 transition-colors border-0 bg-transparent cursor-pointer"${ssrRenderAttr("title", unref(t)("theme.change"))}><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg></button>`);
      if (menuVisible.value) {
        _push(`<div class="absolute right-0 top-full mt-2 w-56 bg-base-100 rounded-2xl shadow-xl border border-base-300 py-2 z-50 animate-slide-up max-h-[70vh] overflow-y-auto"><div class="px-3 py-2 border-b border-base-200"><p class="text-xs font-bold text-base-content/40 uppercase tracking-wider m-0">${ssrInterpolate(unref(t)("theme.choose"))}</p></div><div class="py-1"><!--[-->`);
        ssrRenderList(unref(availableThemes), (theme) => {
          _push(`<button class="${ssrRenderClass([unref(currentTheme) === theme.name ? "bg-primary/10 text-primary font-semibold" : "text-base-content/70 hover:bg-base-200", "flex items-center gap-2.5 w-full px-3 py-2 text-sm border-0 bg-transparent cursor-pointer transition-colors font-sans text-left"])}"><span class="text-base w-6 text-center">${ssrInterpolate(theme.label.split(" ")[0])}</span><span class="flex-1">${ssrInterpolate(theme.label.split(" ").slice(1).join(" "))}</span><div class="flex gap-0.5"${ssrRenderAttr("data-theme", theme.name)}><span class="w-2 h-4 rounded-xs bg-primary"></span><span class="w-2 h-4 rounded-xs bg-secondary"></span><span class="w-2 h-4 rounded-xs bg-accent"></span><span class="w-2 h-4 rounded-xs bg-neutral"></span></div>`);
          if (unref(currentTheme) === theme.name) {
            _push(`<svg class="w-4 h-4 text-primary shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/LayoutSwitcher.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {
  __name: "BadmintonTopbar",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    const page = usePage();
    const unreadCount = computed(() => page.props.unreadChatCount || 0);
    const profileMenuVisible = ref(false);
    const onDocumentClick = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        profileMenuVisible.value = false;
      }
    };
    onMounted(() => document.addEventListener("click", onDocumentClick));
    onBeforeUnmount(() => document.removeEventListener("click", onDocumentClick));
    const navLinks = computed(() => [
      { label: t("nav.home"), href: "/home", icon: "home" },
      { label: t("nav.myParties"), href: "/my-parties", icon: "play" },
      { label: t("nav.chat"), href: "/chat", icon: "chat" },
      { label: t("nav.profile"), href: "/profile", icon: "user" }
    ]);
    const isActive = (href) => {
      const url = page.url;
      if (href === "/home") {
        return url === "/" || url === "/home";
      }
      return url === href || url.startsWith(href + "/");
    };
    const isAuthenticated = computed(() => {
      var _a;
      return !!((_a = page.props.auth) == null ? void 0 : _a.user);
    });
    const userAvatar = computed(() => {
      var _a, _b;
      return (_b = (_a = page.props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.avatar;
    });
    const userName = computed(() => {
      var _a, _b;
      return ((_b = (_a = page.props.auth) == null ? void 0 : _a.user) == null ? void 0 : _b.name) || "User";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "topbar-accent sticky top-0 z-50 h-14 lg:h-16 flex items-center px-4 lg:px-8 bg-base-100/80 backdrop-blur-xl border-b border-base-300" }, _attrs))}><div class="flex items-center gap-3 shrink-0">`);
      _push(ssrRenderComponent(unref(Link), {
        href: "/home",
        class: "flex items-center no-underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img src="/icons/logo2.png" alt="Badminton Party" class="h-10 lg:h-12"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: "/icons/logo2.png",
                alt: "Badminton Party",
                class: "h-10 lg:h-12"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><nav class="hidden lg:flex items-center gap-1 mx-auto"><!--[-->`);
      ssrRenderList(navLinks.value, (link) => {
        _push(ssrRenderComponent(unref(Link), {
          key: link.href,
          href: link.href,
          class: ["px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors duration-200", isActive(link.href) ? "bg-primary/10 text-primary" : "text-base-content/60 hover:bg-base-200 hover:text-base-content"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (link.icon === "home") {
                _push2(`<svg class="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"${_scopeId}></path></svg>`);
              } else if (link.icon === "play") {
                _push2(`<svg class="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg>`);
              } else if (link.icon === "chat") {
                _push2(`<span class="relative inline-block mr-1.5 -mt-0.5"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"${_scopeId}></path></svg>`);
                if (unreadCount.value > 0) {
                  _push2(`<span class="absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-1 flex items-center justify-center rounded-full bg-error text-white text-[8px] font-bold leading-none"${_scopeId}>${ssrInterpolate(unreadCount.value > 99 ? "99+" : unreadCount.value)}</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</span>`);
              } else if (link.icon === "user") {
                _push2(`<svg class="w-4 h-4 inline mr-1.5 -mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(link.label)}`);
            } else {
              return [
                link.icon === "home" ? (openBlock(), createBlock("svg", {
                  key: 0,
                  class: "w-4 h-4 inline mr-1.5 -mt-0.5",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
                  })
                ])) : link.icon === "play" ? (openBlock(), createBlock("svg", {
                  key: 1,
                  class: "w-4 h-4 inline mr-1.5 -mt-0.5",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  }),
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  })
                ])) : link.icon === "chat" ? (openBlock(), createBlock("span", {
                  key: 2,
                  class: "relative inline-block mr-1.5 -mt-0.5"
                }, [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    })
                  ])),
                  unreadCount.value > 0 ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "absolute -top-1.5 -right-2 min-w-[14px] h-3.5 px-1 flex items-center justify-center rounded-full bg-error text-white text-[8px] font-bold leading-none"
                  }, toDisplayString(unreadCount.value > 99 ? "99+" : unreadCount.value), 1)) : createCommentVNode("", true)
                ])) : link.icon === "user" ? (openBlock(), createBlock("svg", {
                  key: 3,
                  class: "w-4 h-4 inline mr-1.5 -mt-0.5",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  viewBox: "0 0 24 24"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  })
                ])) : createCommentVNode("", true),
                createTextVNode(" " + toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="flex items-center gap-2 ml-auto lg:ml-0 shrink-0">`);
      _push(ssrRenderComponent(_sfc_main$8, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$7, null, null, _parent));
      if (!isAuthenticated.value) {
        _push(ssrRenderComponent(unref(Link), {
          href: "/login",
          class: "h-8 px-4 rounded-lg bg-primary text-primary-content text-xs font-semibold no-underline flex items-center hover:bg-primary/80 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("auth.login"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("auth.login")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<div class="profile-dropdown relative"><button class="rounded-full overflow-hidden border-2 border-primary/30 cursor-pointer p-0 bg-transparent transition-all hover:border-primary">`);
        _push(ssrRenderComponent(_sfc_main$9, {
          src: userAvatar.value,
          name: userName.value,
          size: "md",
          rounded: "full"
        }, null, _parent));
        _push(`</button>`);
        if (profileMenuVisible.value) {
          _push(`<div class="absolute right-0 top-full mt-2 w-48 bg-base-100 rounded-xl shadow-lg border border-base-300 py-2 z-50 animate-slide-up"><div class="px-4 py-2 border-b border-base-200"><p class="text-sm font-medium text-base-content m-0">${ssrInterpolate(userName.value)}</p></div>`);
          _push(ssrRenderComponent(unref(Link), {
            href: "/profile",
            class: "flex items-center gap-2 px-4 py-2 text-sm text-base-content/70 hover:bg-base-200 no-underline transition-colors",
            onClick: ($event) => profileMenuVisible.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg> ${ssrInterpolate(unref(t)("nav.profile"))}`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    })
                  ])),
                  createTextVNode(" " + toDisplayString(unref(t)("nav.profile")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(Link), {
            as: "button",
            href: _ctx.route("logout"),
            method: "post",
            class: "flex items-center gap-2 px-4 py-2 text-sm text-base-content/70 hover:bg-base-200 no-underline transition-colors w-full border-0 bg-transparent text-left cursor-pointer font-sans",
            onClick: ($event) => profileMenuVisible.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"${_scopeId}></path></svg> ${ssrInterpolate(unref(t)("nav.logout"))}`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    })
                  ])),
                  createTextVNode(" " + toDisplayString(unref(t)("nav.logout")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></header>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layout/BadmintonTopbar.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = {
  __name: "BadmintonBottomNav",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    const page = usePage();
    const isAuthenticated = computed(() => {
      var _a;
      return !!((_a = page.props.auth) == null ? void 0 : _a.user);
    });
    const unreadCount = computed(() => page.props.unreadChatCount || 0);
    const tabs = computed(() => [
      { label: t("nav.home"), href: "/home", icon: "home" },
      { label: t("nav.parties"), href: "/my-parties", icon: "play" },
      { label: t("nav.chat"), href: "/chat", icon: "chat" },
      { label: t("nav.profile"), href: "/profile", icon: "user" }
    ]);
    const isActive = (href) => {
      const url = page.url;
      if (href === "/home") {
        return url === "/" || url === "/home";
      }
      return url === href || url.startsWith(href + "/");
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (isAuthenticated.value) {
        _push(`<nav${ssrRenderAttrs(mergeProps({ class: "bottom-nav-safe lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-base-100/90 backdrop-blur-xl border-t border-base-300" }, _attrs))}><div class="flex items-stretch justify-around h-16"><!--[-->`);
        ssrRenderList(tabs.value, (tab) => {
          _push(ssrRenderComponent(unref(Link), {
            key: tab.href,
            href: tab.href,
            class: ["flex flex-col items-center justify-center flex-1 min-w-[44px] min-h-[44px] no-underline transition-colors duration-200 relative", isActive(tab.href) ? "text-primary" : "text-base-content/50"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (isActive(tab.href)) {
                  _push2(`<span class="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-primary rounded-b-sm"${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
                if (tab.icon === "home") {
                  _push2(`<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"${_scopeId}></path></svg>`);
                } else if (tab.icon === "play") {
                  _push2(`<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"${_scopeId}></path></svg>`);
                } else if (tab.icon === "chat") {
                  _push2(`<div class="relative mb-1"${_scopeId}><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"${_scopeId}></path></svg>`);
                  if (unreadCount.value > 0) {
                    _push2(`<span class="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold leading-none"${_scopeId}>${ssrInterpolate(unreadCount.value > 99 ? "99+" : unreadCount.value)}</span>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`</div>`);
                } else if (tab.icon === "user") {
                  _push2(`<svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"${_scopeId}></path></svg>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<span class="text-[10px] font-medium"${_scopeId}>${ssrInterpolate(tab.label)}</span>`);
              } else {
                return [
                  isActive(tab.href) ? (openBlock(), createBlock("span", {
                    key: 0,
                    class: "absolute top-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-primary rounded-b-sm"
                  })) : createCommentVNode("", true),
                  tab.icon === "home" ? (openBlock(), createBlock("svg", {
                    key: 1,
                    class: "w-5 h-5 mb-1",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1"
                    })
                  ])) : tab.icon === "play" ? (openBlock(), createBlock("svg", {
                    key: 2,
                    class: "w-5 h-5 mb-1",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                    }),
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    })
                  ])) : tab.icon === "chat" ? (openBlock(), createBlock("div", {
                    key: 3,
                    class: "relative mb-1"
                  }, [
                    (openBlock(), createBlock("svg", {
                      class: "w-5 h-5",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      })
                    ])),
                    unreadCount.value > 0 ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-error text-white text-[9px] font-bold leading-none"
                    }, toDisplayString(unreadCount.value > 99 ? "99+" : unreadCount.value), 1)) : createCommentVNode("", true)
                  ])) : tab.icon === "user" ? (openBlock(), createBlock("svg", {
                    key: 4,
                    class: "w-5 h-5 mb-1",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    viewBox: "0 0 24 24"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    })
                  ])) : createCommentVNode("", true),
                  createVNode("span", { class: "text-[10px] font-medium" }, toDisplayString(tab.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layout/BadmintonBottomNav.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = {
  __name: "DaisyToast",
  __ssrInlineRender: true,
  setup(__props) {
    const alertClass = (severity) => {
      switch (severity) {
        case "success":
          return "alert-success";
        case "error":
          return "alert-error";
        case "warn":
        case "warning":
          return "alert-warning";
        case "contrast":
          return "alert-neutral";
        default:
          return "alert-info";
      }
    };
    const iconClass = (severity) => {
      switch (severity) {
        case "success":
          return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
        case "error":
          return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
        case "warn":
        case "warning":
          return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
        default:
          return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "toast toast-bottom toast-end z-[9999] mb-16 lg:mb-0" }, _attrs))} data-v-9fe57950><!--[-->`);
      ssrRenderList(unref(toasts), (t) => {
        _push(`<div role="alert" class="${ssrRenderClass([alertClass(t.severity), "alert shadow-lg cursor-pointer max-w-sm"])}" data-v-9fe57950><svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24" data-v-9fe57950><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"${ssrRenderAttr("d", iconClass(t.severity))} data-v-9fe57950></path></svg><div class="flex flex-col" data-v-9fe57950>`);
        if (t.summary) {
          _push(`<span class="font-bold text-sm" data-v-9fe57950>${ssrInterpolate(t.summary)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (t.detail) {
          _push(`<span class="text-xs" data-v-9fe57950>${ssrInterpolate(t.detail)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/DaisyToast.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const DaisyToast = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-9fe57950"]]);
const _sfc_main$3 = {
  __name: "DaisyConfirmDialog",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useLocale();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<dialog${ssrRenderAttrs(mergeProps({
        class: ["modal", { "modal-open": unref(confirmState).visible }]
      }, _attrs))}><div class="modal-box max-w-sm"><h3 class="font-bold text-lg">${ssrInterpolate(unref(confirmState).header)}</h3><p class="py-4">${ssrInterpolate(unref(confirmState).message)}</p><div class="modal-action"><button class="btn btn-ghost btn-sm">${ssrInterpolate(unref(t)("common.cancel"))}</button><button class="btn btn-primary btn-sm">${ssrInterpolate(unref(t)("common.confirm"))}</button></div></div><form method="dialog" class="modal-backdrop"><button>close</button></form></dialog>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/DaisyConfirmDialog.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "LevelUpDialog",
  __ssrInlineRender: true,
  setup(__props) {
    const page = usePage();
    const notification = computed(() => page.props.levelUpNotification);
    const visible = ref(false);
    const isLevelUp = computed(() => notification.value && notification.value.new_level > notification.value.old_level);
    onMounted(() => {
      if (notification.value) {
        setTimeout(() => {
          visible.value = true;
        }, 500);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<dialog${ssrRenderAttrs(mergeProps({
        class: ["modal", { "modal-open": visible.value }]
      }, _attrs))}>`);
      if (notification.value) {
        _push(`<div class="modal-box max-w-sm p-0 text-center overflow-hidden"><div class="p-6 pb-4" style="${ssrRenderStyle({ background: `linear-gradient(135deg, ${notification.value.new_tier_color}22, ${notification.value.new_tier_color}44)` })}"><div class="text-5xl mb-3 animate-bounce">${ssrInterpolate(isLevelUp.value ? "🎉" : "📉")}</div><h2 class="text-lg font-black text-base-content m-0">${ssrInterpolate(isLevelUp.value ? "เลื่อนขั้นแล้ว!" : "ระดับเปลี่ยน")}</h2></div><div class="px-6 pb-6 space-y-4"><div class="flex items-center justify-center gap-3"><div class="text-center"><div class="text-xs text-base-content/40 mb-1">เดิม</div><div class="text-sm font-bold text-base-content/50">${ssrInterpolate(notification.value.old_tier_th)}</div><div class="text-xs text-base-content/30">Lv.${ssrInterpolate(notification.value.old_level)}</div></div><div class="text-2xl">${ssrInterpolate(isLevelUp.value ? "→" : "→")}</div><div class="text-center"><div class="text-xs font-bold mb-1" style="${ssrRenderStyle({ color: notification.value.new_tier_color })}">ใหม่</div><div class="text-lg font-black" style="${ssrRenderStyle({ color: notification.value.new_tier_color })}">${ssrInterpolate(notification.value.new_tier_th)}</div><div class="text-xs" style="${ssrRenderStyle({ color: notification.value.new_tier_color })}">Lv.${ssrInterpolate(notification.value.new_level)}</div></div></div><div class="bg-base-200/50 rounded-xl py-2 px-4"><div class="text-[10px] text-base-content/40">MMR</div><div class="text-lg font-black text-base-content">${ssrInterpolate(notification.value.mmr_before)} <span class="${ssrRenderClass(isLevelUp.value ? "text-success" : "text-error")}"> → ${ssrInterpolate(notification.value.mmr_after)}</span></div></div><button class="w-full py-2.5 rounded-xl text-sm font-bold border-0 cursor-pointer transition-all active:scale-[0.98]" style="${ssrRenderStyle({ backgroundColor: notification.value.new_tier_color, color: "white" })}">${ssrInterpolate(isLevelUp.value ? "เย้! ไปต่อ" : "รับทราบ")}</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form method="dialog" class="modal-backdrop"><button>close</button></form></dialog>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Components/LevelUpDialog.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "BadmintonLayout",
  __ssrInlineRender: true,
  setup(__props) {
    const { initTheme } = useBadmintonLayout();
    usePage();
    onMounted(() => {
      initTheme();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "badminton-layout min-h-screen bg-base-200 text-base-content" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$6, null, null, _parent));
      _push(`<main class="pb-20 lg:pb-6 pt-4 px-4 lg:px-8 max-w-5xl mx-auto"><div>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></main>`);
      _push(ssrRenderComponent(_sfc_main$5, null, null, _parent));
      _push(ssrRenderComponent(DaisyToast, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$3, null, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, null, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layout/BadmintonLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "AppLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "header", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "header")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/layout/AppLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
