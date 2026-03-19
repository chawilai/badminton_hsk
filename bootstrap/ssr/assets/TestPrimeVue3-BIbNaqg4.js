import { ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate } from "vue/server-renderer";
const _sfc_main = {
  __name: "TestPrimeVue3",
  __ssrInlineRender: true,
  setup(__props) {
    const readyPlayers = ref(
      Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        label: `Player ${i + 1}`
      }))
    );
    const gameSlots = ref([null, null, null, null]);
    ref(null);
    ref(null);
    ref(null);
    const hoveredSlot = ref(null);
    const isHoveringOverReady = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "drag-drop-container" }, _attrs))}><div class="${ssrRenderClass([{ "highlight": isHoveringOverReady.value }, "ready-area"])}"><h3>Ready Area</h3><div class="area"><!--[-->`);
      ssrRenderList(readyPlayers.value, (player, index) => {
        _push(`<div class="box" draggable="true">${ssrInterpolate(player.label)}</div>`);
      });
      _push(`<!--]--></div></div><div class="game-area"><h3>Game Slots</h3><div class="slots"><!--[-->`);
      ssrRenderList(gameSlots.value, (slot, index) => {
        _push(`<div class="${ssrRenderClass([{ "highlight": hoveredSlot.value === index }, "slot"])}">`);
        if (slot) {
          _push(`<div class="box" draggable="true">${ssrInterpolate(slot.label)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/TestPrimeVue3.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
