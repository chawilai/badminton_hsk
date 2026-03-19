import { unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-DZFboRiE.js";
import { Head } from "@inertiajs/vue3";
import "./badmintonLayout-Bmnf0xqT.js";
import "./useLocale-gpJrLIKB.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./useToast-DyaFeJ92.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Prime",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "UI Components" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-6"${_scopeId}><div class="card bg-base-100 shadow p-4 max-w-sm animate-border rounded-md"${_scopeId}><div class="bg-base-200 mb-4 w-full text-center p-5 rounded-lg"${_scopeId}><img src="https://primefaces.org/cdn/primevue/images/landing/air-jordan.png" alt="Sneaker" class="w-40 mx-auto"${_scopeId}></div><div class="flex items-center mb-4"${_scopeId}><div class="flex flex-col"${_scopeId}><span class="block font-semibold mb-1"${_scopeId}>Sneaker</span><span class="text-gray-500 text-sm"${_scopeId}>Premium Quality</span></div><span class="font-medium text-xl ml-auto"${_scopeId}>$990</span></div><button class="btn btn-outline btn-primary w-full"${_scopeId}> Add to Cart </button></div><div class="card bg-base-100 shadow p-4 max-w-sm animate-border rounded-md"${_scopeId}><div class="flex items-center"${_scopeId}><div class="badge badge-outline mr-2"${_scopeId}>Vue</div><div class="badge badge-outline mr-2"${_scopeId}>Typescript</div><input type="checkbox" class="toggle toggle-primary ml-auto" checked${_scopeId}></div><div class="mt-5 flex justify-center"${_scopeId}><div class="join"${_scopeId}><input class="join-item btn" type="radio" name="style-options" aria-label="Styled"${_scopeId}><input class="join-item btn" type="radio" name="style-options" aria-label="Unstyled" checked${_scopeId}></div></div><div class="mt-5 pt-1 pb-2"${_scopeId}><input type="range" min="0" max="100" value="50" class="range range-primary range-sm"${_scopeId}></div></div><div class="card bg-base-100 shadow p-4 animate-border"${_scopeId}><div class="flex items-center justify-between mb-4"${_scopeId}><div class="flex gap-2"${_scopeId}><button class="btn btn-sm btn-secondary"${_scopeId}>+</button><button class="btn btn-sm btn-secondary"${_scopeId}>Print</button><button class="btn btn-sm btn-secondary"${_scopeId}>Upload</button></div><div class="relative"${_scopeId}><input type="text" placeholder="Search" class="input input-bordered input-sm w-40"${_scopeId}></div><div class="dropdown dropdown-end"${_scopeId}><button class="btn btn-sm btn-primary"${_scopeId}>Save</button></div></div><div class="divider"${_scopeId}></div><h6 class="font-bold mb-2"${_scopeId}>Filled Buttons</h6><div class="flex flex-wrap gap-2 mb-4"${_scopeId}><button class="btn btn-primary btn-sm"${_scopeId}>Primary</button><button class="btn btn-secondary btn-sm"${_scopeId}>Secondary</button><button class="btn btn-success btn-sm"${_scopeId}>Success</button><button class="btn btn-info btn-sm"${_scopeId}>Info</button><button class="btn btn-warning btn-sm"${_scopeId}>Warning</button><button class="btn btn-error btn-sm"${_scopeId}>Danger</button><button class="btn btn-neutral btn-sm"${_scopeId}>Neutral</button></div><div class="divider"${_scopeId}></div><h6 class="font-bold mb-2"${_scopeId}>Outline Buttons</h6><div class="flex flex-wrap gap-2 mb-4"${_scopeId}><button class="btn btn-outline btn-primary btn-sm"${_scopeId}>Primary</button><button class="btn btn-outline btn-secondary btn-sm"${_scopeId}>Secondary</button><button class="btn btn-outline btn-success btn-sm"${_scopeId}>Success</button><button class="btn btn-outline btn-info btn-sm"${_scopeId}>Info</button><button class="btn btn-outline btn-warning btn-sm"${_scopeId}>Warning</button><button class="btn btn-outline btn-error btn-sm"${_scopeId}>Danger</button></div><div class="divider"${_scopeId}></div><h6 class="font-bold mb-2"${_scopeId}>Button Group</h6><div class="join"${_scopeId}><button class="btn btn-info btn-sm join-item"${_scopeId}>Save</button><button class="btn btn-error btn-sm join-item"${_scopeId}>Delete</button><button class="btn btn-sm join-item"${_scopeId}>Cancel</button></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-6" }, [
                createVNode("div", { class: "card bg-base-100 shadow p-4 max-w-sm animate-border rounded-md" }, [
                  createVNode("div", { class: "bg-base-200 mb-4 w-full text-center p-5 rounded-lg" }, [
                    createVNode("img", {
                      src: "https://primefaces.org/cdn/primevue/images/landing/air-jordan.png",
                      alt: "Sneaker",
                      class: "w-40 mx-auto"
                    })
                  ]),
                  createVNode("div", { class: "flex items-center mb-4" }, [
                    createVNode("div", { class: "flex flex-col" }, [
                      createVNode("span", { class: "block font-semibold mb-1" }, "Sneaker"),
                      createVNode("span", { class: "text-gray-500 text-sm" }, "Premium Quality")
                    ]),
                    createVNode("span", { class: "font-medium text-xl ml-auto" }, "$990")
                  ]),
                  createVNode("button", { class: "btn btn-outline btn-primary w-full" }, " Add to Cart ")
                ]),
                createVNode("div", { class: "card bg-base-100 shadow p-4 max-w-sm animate-border rounded-md" }, [
                  createVNode("div", { class: "flex items-center" }, [
                    createVNode("div", { class: "badge badge-outline mr-2" }, "Vue"),
                    createVNode("div", { class: "badge badge-outline mr-2" }, "Typescript"),
                    createVNode("input", {
                      type: "checkbox",
                      class: "toggle toggle-primary ml-auto",
                      checked: ""
                    })
                  ]),
                  createVNode("div", { class: "mt-5 flex justify-center" }, [
                    createVNode("div", { class: "join" }, [
                      createVNode("input", {
                        class: "join-item btn",
                        type: "radio",
                        name: "style-options",
                        "aria-label": "Styled"
                      }),
                      createVNode("input", {
                        class: "join-item btn",
                        type: "radio",
                        name: "style-options",
                        "aria-label": "Unstyled",
                        checked: ""
                      })
                    ])
                  ]),
                  createVNode("div", { class: "mt-5 pt-1 pb-2" }, [
                    createVNode("input", {
                      type: "range",
                      min: "0",
                      max: "100",
                      value: "50",
                      class: "range range-primary range-sm"
                    })
                  ])
                ]),
                createVNode("div", { class: "card bg-base-100 shadow p-4 animate-border" }, [
                  createVNode("div", { class: "flex items-center justify-between mb-4" }, [
                    createVNode("div", { class: "flex gap-2" }, [
                      createVNode("button", { class: "btn btn-sm btn-secondary" }, "+"),
                      createVNode("button", { class: "btn btn-sm btn-secondary" }, "Print"),
                      createVNode("button", { class: "btn btn-sm btn-secondary" }, "Upload")
                    ]),
                    createVNode("div", { class: "relative" }, [
                      createVNode("input", {
                        type: "text",
                        placeholder: "Search",
                        class: "input input-bordered input-sm w-40"
                      })
                    ]),
                    createVNode("div", { class: "dropdown dropdown-end" }, [
                      createVNode("button", { class: "btn btn-sm btn-primary" }, "Save")
                    ])
                  ]),
                  createVNode("div", { class: "divider" }),
                  createVNode("h6", { class: "font-bold mb-2" }, "Filled Buttons"),
                  createVNode("div", { class: "flex flex-wrap gap-2 mb-4" }, [
                    createVNode("button", { class: "btn btn-primary btn-sm" }, "Primary"),
                    createVNode("button", { class: "btn btn-secondary btn-sm" }, "Secondary"),
                    createVNode("button", { class: "btn btn-success btn-sm" }, "Success"),
                    createVNode("button", { class: "btn btn-info btn-sm" }, "Info"),
                    createVNode("button", { class: "btn btn-warning btn-sm" }, "Warning"),
                    createVNode("button", { class: "btn btn-error btn-sm" }, "Danger"),
                    createVNode("button", { class: "btn btn-neutral btn-sm" }, "Neutral")
                  ]),
                  createVNode("div", { class: "divider" }),
                  createVNode("h6", { class: "font-bold mb-2" }, "Outline Buttons"),
                  createVNode("div", { class: "flex flex-wrap gap-2 mb-4" }, [
                    createVNode("button", { class: "btn btn-outline btn-primary btn-sm" }, "Primary"),
                    createVNode("button", { class: "btn btn-outline btn-secondary btn-sm" }, "Secondary"),
                    createVNode("button", { class: "btn btn-outline btn-success btn-sm" }, "Success"),
                    createVNode("button", { class: "btn btn-outline btn-info btn-sm" }, "Info"),
                    createVNode("button", { class: "btn btn-outline btn-warning btn-sm" }, "Warning"),
                    createVNode("button", { class: "btn btn-outline btn-error btn-sm" }, "Danger")
                  ]),
                  createVNode("div", { class: "divider" }),
                  createVNode("h6", { class: "font-bold mb-2" }, "Button Group"),
                  createVNode("div", { class: "join" }, [
                    createVNode("button", { class: "btn btn-info btn-sm join-item" }, "Save"),
                    createVNode("button", { class: "btn btn-error btn-sm join-item" }, "Delete"),
                    createVNode("button", { class: "btn btn-sm join-item" }, "Cancel")
                  ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Prime.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
