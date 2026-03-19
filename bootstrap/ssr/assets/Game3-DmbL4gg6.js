import { ref, computed, watch, onMounted, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { u as useDragDrop } from "./useDragDrop-NuEBXaBA.js";
import "@inertiajs/vue3";
import { _ as _sfc_main$1 } from "./UserAvatar-Dwoh2ac-.js";
import "./useToast-DyaFeJ92.js";
import "./useConfirm-CffLghyV.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Game3",
  __ssrInlineRender: true,
  props: {
    data: {
      type: Object
    }
  },
  emits: ["gameCreated"],
  setup(__props, { emit: __emit }) {
    let props = __props;
    const localData = ref({ ...props.data });
    const {
      dropZones,
      draggedItem,
      hoveredItem,
      dropZoneActive,
      dragPosition,
      dragStyles,
      isDragging,
      returnToOriginal,
      convertWaitingTimeToMinutes
    } = useDragDrop();
    const formattedData = computed(
      () => localData.value.readyPlayers.map((item) => ({
        id: item.user_id,
        title: shortenTitle(item.display_name),
        avatar: item.avatar,
        rank_title: item.badminton_rank,
        rank_level: item.badminton_level,
        waiting_time: item.waiting_time,
        played: item.finished_games_count
      }))
    );
    const sortOrder = ref("DESC");
    const sortedPlayerByGamePlayed = computed(() => {
      const players = [...formattedData.value];
      return players.sort((a, b) => {
        if (sortOrder.value === "ASC") {
          return a.played - b.played;
        } else {
          return b.played - a.played;
        }
      });
    });
    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === "ASC" ? "DESC" : "ASC";
      dropZones.Ready = [...sortedPlayerByGamePlayed.value];
    };
    const shortenTitle = (title, maxLength = 10) => {
      if (title.length > maxLength) {
        return `${title.slice(0, maxLength)}...`;
      }
      return title;
    };
    watch(
      () => props.data,
      // Watch the prop
      (newData) => {
        console.log("Props data updated:", newData);
        localData.value = newData;
        toggleSortOrder();
        console.log(localData.value.readyPlayers);
      },
      { immediate: true }
      // Run immediately on initial mount
    );
    onMounted(() => {
      toggleSortOrder();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-69ecc857><div class="flex flex-col sm:flex-row justify-center gap-4" data-v-69ecc857><div data-zone="Game" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Game" }, "w-full sm:w-96 h-[30rem] drop-zone-game card flex flex-col gap-3 shadow-lg"])}" data-v-69ecc857><div class="flex items-center justify-between mb-3" data-v-69ecc857><h3 class="text-lg font-bold text-primary" data-v-69ecc857>Game</h3><div class="flex gap-1" data-v-69ecc857><button class="btn btn-primary btn-sm btn-circle" data-v-69ecc857> ▶ </button><button class="btn btn-warning btn-sm btn-circle" data-v-69ecc857> ☰ </button><button class="btn btn-error btn-sm btn-circle" data-v-69ecc857> ↻ </button></div></div><div class="flex flex-wrap justify-evenly bg-green-100 w-full max-w-80 h-80 mx-auto p-3 gap-3 rounded-xl" data-v-69ecc857><!--[-->`);
      ssrRenderList(unref(dropZones).Game, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-69ecc857><button class="${ssrRenderClass([{
          "subtract-button": unref(dropZones).Game.includes(item)
        }, "w-8 h-8"])}" data-v-69ecc857>`);
        if (unref(dropZones).Game.includes(item)) {
          _push(`<span data-v-69ecc857>−</span>`);
        } else {
          _push(`<span data-v-69ecc857>+</span>`);
        }
        _push(`</button>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: item.avatar,
          name: item.display_name || item.title || item.name,
          size: "xl",
          rounded: "full",
          class: "avatar"
        }, null, _parent));
        _push(`<span class="text-center font-medium" data-v-69ecc857>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-69ecc857>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
      });
      _push(`<!--]--></div></div><div class="flex-1 flex flex-col justify-center w-full gap-3" data-v-69ecc857><div data-zone="Ready" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Ready" }, "w-full drop-zone-ready p-1 sm:p-3 card flex flex-col gap-3 shadow-md"])}" data-v-69ecc857><h3 class="text-lg font-bold text-primary mb-3" data-v-69ecc857>Ready</h3><div class="flex flex-wrap justify-center gap-3 sm:gap-4" data-v-69ecc857><!--[-->`);
      ssrRenderList(unref(dropZones).Ready, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-69ecc857><button class="add-button w-8 h-8" data-v-69ecc857> + </button>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: item.avatar,
          name: item.display_name || item.title || item.name,
          size: "xl",
          rounded: "full",
          class: "avatar"
        }, null, _parent));
        _push(`<span class="text-center font-medium" data-v-69ecc857>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-69ecc857>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
      });
      _push(`<!--]--></div></div><div data-zone="Playing" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Playing" }, "w-full drop-zone-playing p-1 sm:p-3 card flex flex-col gap-3 shadow-md"])}" data-v-69ecc857><h3 class="text-lg font-bold text-primary mb-3" data-v-69ecc857>Playing</h3><div class="flex flex-wrap gap-3" data-v-69ecc857><!--[-->`);
      ssrRenderList(unref(dropZones).Playing, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-69ecc857><button class="add-button w-8 h-8" data-v-69ecc857> + </button>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: item.avatar,
          name: item.display_name || item.title || item.name,
          size: "xl",
          rounded: "full",
          class: "avatar"
        }, null, _parent));
        _push(`<span class="text-center font-medium" data-v-69ecc857>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-69ecc857>${ssrInterpolate(`กำลังเล่น`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
      });
      _push(`<!--]--></div></div><div data-zone="Listing" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Listing" }, "w-full drop-zone-listing p-1 sm:p-3 card flex flex-col gap-3 shadow-md"])}" data-v-69ecc857><h3 class="text-lg font-bold text-primary mb-3" data-v-69ecc857>Listing</h3><div class="flex flex-wrap gap-3" data-v-69ecc857><!--[-->`);
      ssrRenderList(unref(dropZones).Listing, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-69ecc857><button class="add-button w-8 h-8" data-v-69ecc857> + </button>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: item.avatar,
          name: item.display_name || item.title || item.name,
          size: "xl",
          rounded: "full",
          class: "avatar"
        }, null, _parent));
        _push(`<span class="text-center font-medium" data-v-69ecc857>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-69ecc857>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
      });
      _push(`<!--]--></div></div><div data-zone="Break" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Break" }, "w-full drop-zone-break p-1 sm:p-3 card flex flex-col gap-3 shadow-md"])}" data-v-69ecc857><h3 class="text-lg font-bold text-primary mb-3" data-v-69ecc857>Break</h3><div class="flex flex-wrap gap-3" data-v-69ecc857><!--[-->`);
      ssrRenderList(unref(dropZones).Break, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-69ecc857><button class="add-button w-8 h-8" data-v-69ecc857> + </button>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: item.avatar,
          name: item.display_name || item.title || item.name,
          size: "xl",
          rounded: "full",
          class: "avatar"
        }, null, _parent));
        _push(`<span class="text-center font-medium" data-v-69ecc857>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-69ecc857>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
      });
      _push(`<!--]--></div></div><div data-zone="Finish" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Finish" }, "w-full drop-zone-finish p-1 sm:p-3 card flex flex-col gap-3 shadow-md"])}" data-v-69ecc857><h3 class="text-lg font-bold text-primary mb-3" data-v-69ecc857>Finish</h3><div class="flex flex-wrap gap-3" data-v-69ecc857><!--[-->`);
      ssrRenderList(unref(dropZones).Finish, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-69ecc857><button class="add-button w-8 h-8" data-v-69ecc857> + </button>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: item.avatar,
          name: item.display_name || item.title || item.name,
          size: "xl",
          rounded: "full",
          class: "avatar"
        }, null, _parent));
        _push(`<span class="text-center font-medium" data-v-69ecc857>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-69ecc857>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-69ecc857>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
      });
      _push(`<!--]--></div></div></div></div>`);
      if (unref(isDragging)) {
        _push(`<div class="drag-feedback" style="${ssrRenderStyle({
          left: `${unref(dragPosition).x}px`,
          top: `${unref(dragPosition).y}px`,
          ...unref(dragStyles),
          transition: unref(returnToOriginal) ? "all 0.3s ease" : "none"
        })}" data-v-69ecc857>`);
        _push(ssrRenderComponent(_sfc_main$1, {
          src: unref(draggedItem).avatar,
          name: unref(draggedItem).display_name || unref(draggedItem).title || unref(draggedItem).name,
          size: "xl",
          rounded: "full",
          class: "avatar drag-avatar"
        }, null, _parent));
        _push(`<span class="text-center font-medium" data-v-69ecc857>${ssrInterpolate(unref(draggedItem).title)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Game3.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Game3 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-69ecc857"]]);
export {
  Game3 as default
};
