import { ref, onMounted, unref, withCtx, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-DZFboRiE.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, Head, router } from "@inertiajs/vue3";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./badmintonLayout-Bmnf0xqT.js";
import "./useLocale-gpJrLIKB.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./useToast-DyaFeJ92.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "PartyHome",
  __ssrInlineRender: true,
  setup(__props) {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
    const page = usePage();
    const user = page.props.auth.user;
    const skillData = ref({
      labels: ["ความเร็ว", "พลัง", "แม่นยำ", "กลยุทธ์", "เทคนิค", "ประสบการณ์", "การลวง"],
      datasets: [{
        label: "Skills",
        data: [8, 7, 2, 8.5, 7.5, 9, 6.5],
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderColor: "#10b981",
        borderWidth: 2,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2
      }]
    });
    onMounted(() => {
      const canvas = document.getElementById("skillRadarChart");
      if (canvas) {
        new Chart(canvas.getContext("2d"), {
          type: "radar",
          data: skillData.value,
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              datalabels: {
                display: true,
                color: "#6b7280",
                font: { size: 11, weight: "bold" },
                formatter: (value) => value
              }
            },
            scales: {
              r: {
                suggestedMin: 0,
                suggestedMax: 10,
                grid: { color: "rgba(16, 185, 129, 0.1)" },
                angleLines: { color: "rgba(16, 185, 129, 0.1)" },
                pointLabels: { font: { size: 12 }, color: "#6b7280" }
              }
            }
          }
        });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Home" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
          if (_push2) {
            _push2(`<div class="space-y-4"${_scopeId}><div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden"${_scopeId}><div class="h-20 bg-gradient-to-r from-primary to-primary/80"${_scopeId}></div><div class="px-4 pb-4 -mt-10"${_scopeId}><div class="flex items-end gap-3 mb-3"${_scopeId}>`);
            _push2(ssrRenderComponent(_sfc_main$2, {
              src: (_a = unref(user)) == null ? void 0 : _a.avatar,
              name: (_b = unref(user)) == null ? void 0 : _b.name,
              size: "xl",
              rounded: "2xl",
              class: "border-4 border-base-100"
            }, null, _parent2, _scopeId));
            _push2(`<div class="pb-1"${_scopeId}><h2 class="text-lg font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate((_c = unref(user)) == null ? void 0 : _c.name)}</h2><p class="text-sm text-base-content/60 m-0"${_scopeId}>${ssrInterpolate((_d = unref(user)) == null ? void 0 : _d.email)}</p></div></div>`);
            if ((_e = unref(user)) == null ? void 0 : _e.player_motto) {
              _push2(`<p class="text-sm text-base-content/70 m-0 italic"${_scopeId}>&quot;${ssrInterpolate(unref(user).player_motto)}&quot;</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="grid grid-cols-2 gap-3"${_scopeId}><button class="badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30"${_scopeId}><div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"${_scopeId}><i class="pi pi-list text-primary"${_scopeId}></i></div><span class="text-sm font-medium text-base-content/80"${_scopeId}>Party Lists</span></button><button class="badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30"${_scopeId}><div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"${_scopeId}><i class="pi pi-play text-primary"${_scopeId}></i></div><span class="text-sm font-medium text-base-content/80"${_scopeId}>My Parties</span></button><button class="badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30"${_scopeId}><div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"${_scopeId}><i class="pi pi-comments text-primary"${_scopeId}></i></div><span class="text-sm font-medium text-base-content/80"${_scopeId}>Chat</span></button><button class="badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30"${_scopeId}><div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center"${_scopeId}><i class="pi pi-user text-primary"${_scopeId}></i></div><span class="text-sm font-medium text-base-content/80"${_scopeId}>Profile</span></button></div><div class="bg-base-100 rounded-xl border border-base-300 p-4"${_scopeId}><h3 class="text-base font-bold text-base-content m-0 mb-3"${_scopeId}>กราฟคุณสมบัติ</h3><div class="max-w-sm mx-auto"${_scopeId}><canvas id="skillRadarChart"${_scopeId}></canvas></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4" }, [
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 overflow-hidden" }, [
                  createVNode("div", { class: "h-20 bg-gradient-to-r from-primary to-primary/80" }),
                  createVNode("div", { class: "px-4 pb-4 -mt-10" }, [
                    createVNode("div", { class: "flex items-end gap-3 mb-3" }, [
                      createVNode(_sfc_main$2, {
                        src: (_f = unref(user)) == null ? void 0 : _f.avatar,
                        name: (_g = unref(user)) == null ? void 0 : _g.name,
                        size: "xl",
                        rounded: "2xl",
                        class: "border-4 border-base-100"
                      }, null, 8, ["src", "name"]),
                      createVNode("div", { class: "pb-1" }, [
                        createVNode("h2", { class: "text-lg font-bold text-base-content m-0" }, toDisplayString((_h = unref(user)) == null ? void 0 : _h.name), 1),
                        createVNode("p", { class: "text-sm text-base-content/60 m-0" }, toDisplayString((_i = unref(user)) == null ? void 0 : _i.email), 1)
                      ])
                    ]),
                    ((_j = unref(user)) == null ? void 0 : _j.player_motto) ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-sm text-base-content/70 m-0 italic"
                    }, '"' + toDisplayString(unref(user).player_motto) + '"', 1)) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-2 gap-3" }, [
                  createVNode("button", {
                    onClick: ($event) => unref(router).get("/party-lists"),
                    class: "badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30"
                  }, [
                    createVNode("div", { class: "w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center" }, [
                      createVNode("i", { class: "pi pi-list text-primary" })
                    ]),
                    createVNode("span", { class: "text-sm font-medium text-base-content/80" }, "Party Lists")
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => unref(router).get("/my-parties"),
                    class: "badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30"
                  }, [
                    createVNode("div", { class: "w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center" }, [
                      createVNode("i", { class: "pi pi-play text-primary" })
                    ]),
                    createVNode("span", { class: "text-sm font-medium text-base-content/80" }, "My Parties")
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => unref(router).get("/chat"),
                    class: "badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30"
                  }, [
                    createVNode("div", { class: "w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center" }, [
                      createVNode("i", { class: "pi pi-comments text-primary" })
                    ]),
                    createVNode("span", { class: "text-sm font-medium text-base-content/80" }, "Chat")
                  ], 8, ["onClick"]),
                  createVNode("button", {
                    onClick: ($event) => unref(router).get("/profile"),
                    class: "badminton-card flex flex-col items-center gap-2 p-4 bg-base-100 rounded-xl border border-base-300 cursor-pointer transition-all hover:border-primary/30"
                  }, [
                    createVNode("div", { class: "w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center" }, [
                      createVNode("i", { class: "pi pi-user text-primary" })
                    ]),
                    createVNode("span", { class: "text-sm font-medium text-base-content/80" }, "Profile")
                  ], 8, ["onClick"])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4" }, [
                  createVNode("h3", { class: "text-base font-bold text-base-content m-0 mb-3" }, "กราฟคุณสมบัติ"),
                  createVNode("div", { class: "max-w-sm mx-auto" }, [
                    createVNode("canvas", { id: "skillRadarChart" })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/PartyHome.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
