import { ref, unref, withCtx, createVNode, createBlock, openBlock, Fragment, renderList, toDisplayString, createCommentVNode, withModifiers, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-COXuhfhM.js";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import { Head } from "@inertiajs/vue3";
import "./badmintonLayout-Bmnf0xqT.js";
import "./useLocale-gpJrLIKB.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Button",
  __ssrInlineRender: true,
  setup(__props) {
    const toast = useToast();
    const visible = ref(false);
    const items = ref([
      {
        label: "Add",
        command: () => {
          toast.add({ severity: "info", summary: "Add", detail: "Data Added" });
        }
      },
      {
        label: "Update",
        command: () => {
          toast.add({ severity: "success", summary: "Update", detail: "Data Updated" });
        }
      },
      {
        label: "Delete",
        command: () => {
          toast.add({ severity: "error", summary: "Delete", detail: "Data Deleted" });
        }
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Buttons" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        header: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="font-semibold text-xl text-gray-800 leading-tight"${_scopeId}> DaisyUI Button Showcase </h2>`);
          } else {
            return [
              createVNode("h2", { class: "font-semibold text-xl text-gray-800 leading-tight" }, " DaisyUI Button Showcase ")
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="card bg-base-100 shadow p-6"${_scopeId}><h5 class="text-lg font-bold mb-4"${_scopeId}>Filled Buttons</h5><div class="flex flex-wrap gap-2"${_scopeId}><button class="btn btn-primary"${_scopeId}>Primary</button><button class="btn btn-secondary"${_scopeId}>Secondary</button><button class="btn btn-success"${_scopeId}>Success</button><button class="btn btn-info"${_scopeId}>Info</button><button class="btn btn-warning"${_scopeId}>Warning</button><button class="btn btn-error"${_scopeId}>Danger</button><button class="btn btn-neutral"${_scopeId}>Neutral</button><button class="btn btn-accent"${_scopeId}>Accent</button></div></div><div class="card bg-base-100 shadow p-6"${_scopeId}><h5 class="text-lg font-bold mb-4"${_scopeId}>Outline Buttons</h5><div class="flex flex-wrap gap-2"${_scopeId}><button class="btn btn-outline btn-primary"${_scopeId}>Primary</button><button class="btn btn-outline btn-secondary"${_scopeId}>Secondary</button><button class="btn btn-outline btn-success"${_scopeId}>Success</button><button class="btn btn-outline btn-info"${_scopeId}>Info</button><button class="btn btn-outline btn-warning"${_scopeId}>Warning</button><button class="btn btn-outline btn-error"${_scopeId}>Danger</button></div></div><div class="card bg-base-100 shadow p-6"${_scopeId}><h5 class="text-lg font-bold mb-4"${_scopeId}>Ghost &amp; Soft Buttons</h5><div class="flex flex-wrap gap-2"${_scopeId}><button class="btn btn-ghost"${_scopeId}>Ghost</button><button class="btn btn-link"${_scopeId}>Link</button><button class="btn glass"${_scopeId}>Glass</button></div></div><div class="card bg-base-100 shadow p-6"${_scopeId}><h5 class="text-lg font-bold mb-4"${_scopeId}>Button Sizes</h5><div class="flex flex-wrap gap-2 items-center"${_scopeId}><button class="btn btn-primary btn-lg"${_scopeId}>Large</button><button class="btn btn-primary"${_scopeId}>Normal</button><button class="btn btn-primary btn-sm"${_scopeId}>Small</button><button class="btn btn-primary btn-xs"${_scopeId}>Tiny</button></div></div><div class="card bg-base-100 shadow p-6"${_scopeId}><h5 class="text-lg font-bold mb-4"${_scopeId}>Button Group</h5><div class="join"${_scopeId}><button class="btn btn-primary join-item"${_scopeId}>Save</button><button class="btn btn-error join-item"${_scopeId}>Delete</button><button class="btn join-item"${_scopeId}>Cancel</button></div></div><div class="card bg-base-100 shadow p-6"${_scopeId}><h5 class="text-lg font-bold mb-4"${_scopeId}>Action Buttons</h5><div class="flex flex-wrap gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(items.value, (item) => {
              _push2(`<button class="btn btn-primary btn-sm"${_scopeId}>${ssrInterpolate(item.label)}</button>`);
            });
            _push2(`<!--]--></div></div><div class="card bg-base-100 shadow p-6"${_scopeId}><h5 class="text-lg font-bold mb-4"${_scopeId}>Drawer Demo</h5><button class="btn btn-primary"${_scopeId}>Open Drawer</button>`);
            if (visible.value) {
              _push2(`<div class="fixed inset-0 z-50 flex"${_scopeId}><div class="bg-black/50 absolute inset-0"${_scopeId}></div><div class="relative z-10 bg-base-100 w-80 h-full shadow-xl overflow-y-auto"${_scopeId}><div class="flex items-center justify-between px-4 pt-4"${_scopeId}><span class="font-semibold text-2xl text-emerald-600"${_scopeId}>Your Logo</span><button class="btn btn-sm btn-circle btn-ghost"${_scopeId}>✕</button></div><ul class="menu p-4"${_scopeId}><li${_scopeId}><a${_scopeId}>Dashboard</a></li><li${_scopeId}><a${_scopeId}>Bookmarks</a></li><li${_scopeId}><details${_scopeId}><summary${_scopeId}>Reports</summary><ul${_scopeId}><li${_scopeId}><a${_scopeId}>Revenue</a></li><li${_scopeId}><a${_scopeId}>Expenses</a></li></ul></details></li><li${_scopeId}><a${_scopeId}>Team</a></li><li${_scopeId}><a${_scopeId}>Messages <span class="badge badge-primary badge-sm"${_scopeId}>3</span></a></li><li${_scopeId}><a${_scopeId}>Calendar</a></li><li${_scopeId}><a${_scopeId}>Settings</a></li></ul><div class="mt-auto border-t border-base-300 p-4"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="avatar placeholder"${_scopeId}><div class="bg-neutral text-neutral-content rounded-full w-10"${_scopeId}><span${_scopeId}>AE</span></div></div><span class="font-bold"${_scopeId}>Amy Elsner</span></div></div></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "card bg-base-100 shadow p-6" }, [
                  createVNode("h5", { class: "text-lg font-bold mb-4" }, "Filled Buttons"),
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    createVNode("button", { class: "btn btn-primary" }, "Primary"),
                    createVNode("button", { class: "btn btn-secondary" }, "Secondary"),
                    createVNode("button", { class: "btn btn-success" }, "Success"),
                    createVNode("button", { class: "btn btn-info" }, "Info"),
                    createVNode("button", { class: "btn btn-warning" }, "Warning"),
                    createVNode("button", { class: "btn btn-error" }, "Danger"),
                    createVNode("button", { class: "btn btn-neutral" }, "Neutral"),
                    createVNode("button", { class: "btn btn-accent" }, "Accent")
                  ])
                ]),
                createVNode("div", { class: "card bg-base-100 shadow p-6" }, [
                  createVNode("h5", { class: "text-lg font-bold mb-4" }, "Outline Buttons"),
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    createVNode("button", { class: "btn btn-outline btn-primary" }, "Primary"),
                    createVNode("button", { class: "btn btn-outline btn-secondary" }, "Secondary"),
                    createVNode("button", { class: "btn btn-outline btn-success" }, "Success"),
                    createVNode("button", { class: "btn btn-outline btn-info" }, "Info"),
                    createVNode("button", { class: "btn btn-outline btn-warning" }, "Warning"),
                    createVNode("button", { class: "btn btn-outline btn-error" }, "Danger")
                  ])
                ]),
                createVNode("div", { class: "card bg-base-100 shadow p-6" }, [
                  createVNode("h5", { class: "text-lg font-bold mb-4" }, "Ghost & Soft Buttons"),
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    createVNode("button", { class: "btn btn-ghost" }, "Ghost"),
                    createVNode("button", { class: "btn btn-link" }, "Link"),
                    createVNode("button", { class: "btn glass" }, "Glass")
                  ])
                ]),
                createVNode("div", { class: "card bg-base-100 shadow p-6" }, [
                  createVNode("h5", { class: "text-lg font-bold mb-4" }, "Button Sizes"),
                  createVNode("div", { class: "flex flex-wrap gap-2 items-center" }, [
                    createVNode("button", { class: "btn btn-primary btn-lg" }, "Large"),
                    createVNode("button", { class: "btn btn-primary" }, "Normal"),
                    createVNode("button", { class: "btn btn-primary btn-sm" }, "Small"),
                    createVNode("button", { class: "btn btn-primary btn-xs" }, "Tiny")
                  ])
                ]),
                createVNode("div", { class: "card bg-base-100 shadow p-6" }, [
                  createVNode("h5", { class: "text-lg font-bold mb-4" }, "Button Group"),
                  createVNode("div", { class: "join" }, [
                    createVNode("button", { class: "btn btn-primary join-item" }, "Save"),
                    createVNode("button", { class: "btn btn-error join-item" }, "Delete"),
                    createVNode("button", { class: "btn join-item" }, "Cancel")
                  ])
                ]),
                createVNode("div", { class: "card bg-base-100 shadow p-6" }, [
                  createVNode("h5", { class: "text-lg font-bold mb-4" }, "Action Buttons"),
                  createVNode("div", { class: "flex flex-wrap gap-2" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(items.value, (item) => {
                      return openBlock(), createBlock("button", {
                        key: item.label,
                        class: "btn btn-primary btn-sm",
                        onClick: item.command
                      }, toDisplayString(item.label), 9, ["onClick"]);
                    }), 128))
                  ])
                ]),
                createVNode("div", { class: "card bg-base-100 shadow p-6" }, [
                  createVNode("h5", { class: "text-lg font-bold mb-4" }, "Drawer Demo"),
                  createVNode("button", {
                    class: "btn btn-primary",
                    onClick: ($event) => visible.value = true
                  }, "Open Drawer", 8, ["onClick"]),
                  visible.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "fixed inset-0 z-50 flex",
                    onClick: withModifiers(($event) => visible.value = false, ["self"])
                  }, [
                    createVNode("div", {
                      class: "bg-black/50 absolute inset-0",
                      onClick: ($event) => visible.value = false
                    }, null, 8, ["onClick"]),
                    createVNode("div", { class: "relative z-10 bg-base-100 w-80 h-full shadow-xl overflow-y-auto" }, [
                      createVNode("div", { class: "flex items-center justify-between px-4 pt-4" }, [
                        createVNode("span", { class: "font-semibold text-2xl text-emerald-600" }, "Your Logo"),
                        createVNode("button", {
                          class: "btn btn-sm btn-circle btn-ghost",
                          onClick: ($event) => visible.value = false
                        }, "✕", 8, ["onClick"])
                      ]),
                      createVNode("ul", { class: "menu p-4" }, [
                        createVNode("li", null, [
                          createVNode("a", null, "Dashboard")
                        ]),
                        createVNode("li", null, [
                          createVNode("a", null, "Bookmarks")
                        ]),
                        createVNode("li", null, [
                          createVNode("details", null, [
                            createVNode("summary", null, "Reports"),
                            createVNode("ul", null, [
                              createVNode("li", null, [
                                createVNode("a", null, "Revenue")
                              ]),
                              createVNode("li", null, [
                                createVNode("a", null, "Expenses")
                              ])
                            ])
                          ])
                        ]),
                        createVNode("li", null, [
                          createVNode("a", null, "Team")
                        ]),
                        createVNode("li", null, [
                          createVNode("a", null, [
                            createTextVNode("Messages "),
                            createVNode("span", { class: "badge badge-primary badge-sm" }, "3")
                          ])
                        ]),
                        createVNode("li", null, [
                          createVNode("a", null, "Calendar")
                        ]),
                        createVNode("li", null, [
                          createVNode("a", null, "Settings")
                        ])
                      ]),
                      createVNode("div", { class: "mt-auto border-t border-base-300 p-4" }, [
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode("div", { class: "avatar placeholder" }, [
                            createVNode("div", { class: "bg-neutral text-neutral-content rounded-full w-10" }, [
                              createVNode("span", null, "AE")
                            ])
                          ]),
                          createVNode("span", { class: "font-bold" }, "Amy Elsner")
                        ])
                      ])
                    ])
                  ], 8, ["onClick"])) : createCommentVNode("", true)
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Button.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
