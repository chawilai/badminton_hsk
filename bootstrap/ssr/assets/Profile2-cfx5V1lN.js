import { ref, onMounted, resolveComponent, mergeProps, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Profile2",
  __ssrInlineRender: true,
  setup(__props) {
    Chart.register(...registerables);
    Chart.register(ChartDataLabels);
    const profile = ref({
      name: "John Doe",
      avatar: null,
      gender: null,
      birthday: null
    });
    const playedSummary = ref({
      totalGames: 25,
      totalParties: 10,
      skillLevel: "Advanced"
    });
    const gameHistory = ref([
      { date: "2025-01-01", opponent: "Player A", result: "Win" }
    ]);
    const partyHistory = ref([
      { partyName: "Weekend Smash", date: "2025-01-01", role: "Participant" },
      { partyName: "Holiday Bash", date: "2025-01-02", role: "Organizer" }
    ]);
    const skillData = ref({
      labels: ["ความเร็ว", "พลัง", "แม่นยำ", "กลยุทธ์", "เทคนิค", "ประสบการณ์", "การลวง"],
      datasets: [
        {
          label: "Player A Skills",
          data: [8, 7, 2, 8.5, 7.5, 9, 6.5],
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1
        }
      ]
    });
    onMounted(() => {
      const ctx = document.getElementById("skillRadarChart").getContext("2d");
      new Chart(ctx, {
        type: "radar",
        data: skillData.value,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
              // This hides the dataset group indicators
            },
            tooltip: {
              enabled: true,
              // Ensures tooltips are shown
              callbacks: {
                label: function(context) {
                  return `${context.raw}`;
                }
              }
            },
            datalabels: {
              display: true,
              // Show labels on data points
              color: "black",
              // Label color
              font: {
                size: 12,
                // Font size
                weight: "bold"
                // Font weight
              },
              formatter: (value) => value
              // Show the value directly
            }
          },
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 10
            }
          }
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Avatar = resolveComponent("Avatar");
      const _component_Button = resolveComponent("Button");
      const _component_Divider = resolveComponent("Divider");
      const _component_DataTable = resolveComponent("DataTable");
      const _component_Column = resolveComponent("Column");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-page" }, _attrs))} data-v-56caee8b><div class="profile-section" data-v-56caee8b><h2 data-v-56caee8b>Profile</h2><div class="profile-details" data-v-56caee8b><div class="avatar-section" data-v-56caee8b>`);
      if (profile.value.avatar) {
        _push(ssrRenderComponent(_component_Avatar, {
          image: profile.value.avatar,
          shape: "circle",
          size: "large"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_Avatar, {
          label: "?",
          shape: "circle",
          size: "large",
          class: "p-mr-2"
        }, null, _parent));
      }
      _push(ssrRenderComponent(_component_Button, {
        label: "Edit Avatar",
        icon: "pi pi-camera",
        class: "p-button-outlined p-mt-2"
      }, null, _parent));
      _push(`</div><div class="name-section" data-v-56caee8b><h3 data-v-56caee8b>${ssrInterpolate(profile.value.name)}</h3>`);
      _push(ssrRenderComponent(_component_Button, {
        label: "Edit Name",
        icon: "pi pi-pencil",
        class: "p-button-outlined"
      }, null, _parent));
      _push(`</div><div class="gender-section" data-v-56caee8b><p data-v-56caee8b>Gender: ${ssrInterpolate(profile.value.gender || "Not Set")}</p>`);
      _push(ssrRenderComponent(_component_Button, {
        label: "Edit Gender",
        icon: "pi pi-pencil",
        class: "p-button-outlined"
      }, null, _parent));
      _push(`</div><div class="birthday-section" data-v-56caee8b><p data-v-56caee8b>Birthday: ${ssrInterpolate(profile.value.birthday || "Not Set")}</p>`);
      _push(ssrRenderComponent(_component_Button, {
        label: "Edit Birthday",
        icon: "pi pi-pencil",
        class: "p-button-outlined"
      }, null, _parent));
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(_component_Divider, null, null, _parent));
      _push(`<div class="summary-section" data-v-56caee8b><h2 data-v-56caee8b>Played Summary</h2><div class="summary-stats" data-v-56caee8b><div class="stat-item" data-v-56caee8b><h3 data-v-56caee8b>Total Games</h3><p data-v-56caee8b>${ssrInterpolate(playedSummary.value.totalGames)}</p></div><div class="stat-item" data-v-56caee8b><h3 data-v-56caee8b>Total Parties</h3><p data-v-56caee8b>${ssrInterpolate(playedSummary.value.totalParties)}</p></div><div class="stat-item" data-v-56caee8b><h3 data-v-56caee8b>Skill Level</h3><p data-v-56caee8b>${ssrInterpolate(playedSummary.value.skillLevel)}</p></div></div><div class="card" data-v-56caee8b><div class="skill-chart w-30rem" data-v-56caee8b><h3 data-v-56caee8b>กราฟคุณสมบัติ</h3><canvas id="skillRadarChart" data-v-56caee8b></canvas></div></div></div>`);
      _push(ssrRenderComponent(_component_Divider, null, null, _parent));
      _push(`<div class="history-section" data-v-56caee8b><h2 data-v-56caee8b>Game History</h2>`);
      _push(ssrRenderComponent(_component_DataTable, {
        value: gameHistory.value,
        responsiveLayout: "scroll"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Column, {
              field: "date",
              header: "Date"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Column, {
              field: "opponent",
              header: "Opponent"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Column, {
              field: "result",
              header: "Result"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Column, {
                field: "date",
                header: "Date"
              }),
              createVNode(_component_Column, {
                field: "opponent",
                header: "Opponent"
              }),
              createVNode(_component_Column, {
                field: "result",
                header: "Result"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(_component_Divider, null, null, _parent));
      _push(`<div class="party-section" data-v-56caee8b><h2 data-v-56caee8b>Party History</h2>`);
      _push(ssrRenderComponent(_component_DataTable, {
        value: partyHistory.value,
        responsiveLayout: "scroll"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Column, {
              field: "partyName",
              header: "Party Name"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Column, {
              field: "date",
              header: "Date"
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_Column, {
              field: "role",
              header: "Role"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Column, {
                field: "partyName",
                header: "Party Name"
              }),
              createVNode(_component_Column, {
                field: "date",
                header: "Date"
              }),
              createVNode(_component_Column, {
                field: "role",
                header: "Role"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Profile2.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Profile2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-56caee8b"]]);
export {
  Profile2 as default
};
