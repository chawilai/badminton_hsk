import { ref, computed, onMounted, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, withModifiers, toDisplayString, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { u as useDragDrop } from "./useDragDrop-NuEBXaBA.js";
import { _ as _sfc_main$1 } from "./AppLayout-COXuhfhM.js";
import { usePage, Head, router } from "@inertiajs/vue3";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import "./useConfirm-CffLghyV.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./badmintonLayout-Bmnf0xqT.js";
import "./useLocale-gpJrLIKB.js";
import "./LocaleSwitcher-BOmG4hBt.js";
const _sfc_main = {
  __name: "Game",
  __ssrInlineRender: true,
  setup(__props) {
    ref([]);
    const toast = useToast();
    const page = usePage();
    const {
      dropZones,
      draggedItem,
      hoveredItem,
      dropZoneActive,
      dragPosition,
      dragStyles,
      isDragging,
      returnToOriginal,
      releaseAllItems,
      handleDragStart,
      handleDoubleClick,
      handleMouseUp,
      handleTouchStart,
      handleTouchEnd,
      convertWaitingTimeToMinutes
    } = useDragDrop();
    const formattedData = computed(
      () => page.props.readyPlayers.map((item) => ({
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
    const startNewGame = () => {
      router.post(
        `/games/create-game`,
        {
          party_id: 2,
          // Dummy party ID
          game_type: "quadruple",
          // Game type: 'double' or 'quadruple'
          players: dropZones.Game.map((player) => player.id),
          // Dummy player IDs (2 players for 'double')
          team1_start_side: "north",
          // Optional, defaults to 'north'
          initial_shuttlecock_game: 1,
          // Optional, defaults to 0
          process: "playing"
          // listing, playing
        },
        {
          preserveScroll: true,
          headers: {
            Accept: "application/json"
          },
          onSuccess: (res) => {
            console.log(res.props);
            dropZones.Playing = [...dropZones.Playing, ...dropZones.Game];
            dropZones.Game = [];
            toast.add({
              severity: "success",
              summary: "Game Created",
              detail: "สร้างเกม และ เริ่มเกมเรียบร้อยแล้ว.",
              life: 3e3
            });
          },
          onError: (err) => {
            if (err.notMatchType) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "จำนวนผู้เล่นไม่ตรงกับรูปแบบของเกม",
                life: 3e3
              });
            }
            if (err.existSettingGame) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "มีเกมที่กำลังตั้งค่าอยู่ก่อนแล้ว",
                life: 3e3
              });
            }
          }
        }
      );
    };
    const listNewGame = () => {
      router.post(
        `/games/create-game`,
        {
          party_id: 2,
          // Dummy party ID
          game_type: "quadruple",
          // Game type: 'double' or 'quadruple'
          players: dropZones.Game.map((player) => player.id),
          // Dummy player IDs (2 players for 'double')
          team1_start_side: "north",
          // Optional, defaults to 'north'
          initial_shuttlecock_game: 1,
          // Optional, defaults to 0
          process: "listing"
          // listing, playing
        },
        {
          preserveScroll: true,
          headers: {
            Accept: "application/json"
          },
          onSuccess: (res) => {
            console.log(res.props);
            dropZones.Listing = [...dropZones.Listing, ...dropZones.Game];
            dropZones.Game = [];
            toast.add({
              severity: "success",
              summary: "Game Created",
              detail: "สร้างเกมแล้ว และ ลีสลงรายการรอเริ่ม.",
              life: 3e3
            });
          },
          onError: (err) => {
            if (err.notMatchType) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "จำนวนผู้เล่นไม่ตรงกับรูปแบบของเกม",
                life: 3e3
              });
            }
            if (err.existSettingGame) {
              toast.add({
                severity: "error",
                summary: "ล้มเหลว",
                detail: "มีเกมที่กำลังตั้งค่าอยู่ก่อนแล้ว",
                life: 3e3
              });
            }
          }
        }
      );
    };
    onMounted(() => {
      toggleSortOrder();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Game" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col sm:flex-row justify-center gap-4" data-v-127414d2${_scopeId}><div data-zone="Game" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Game" }, "w-full sm:w-96 h-[30rem] drop-zone-game card flex flex-col gap-3 shadow-lg"])}" data-v-127414d2${_scopeId}><div class="flex items-center justify-between mb-3" data-v-127414d2${_scopeId}><h3 class="text-lg font-bold text-primary" data-v-127414d2${_scopeId}>Game</h3><div class="flex gap-1" data-v-127414d2${_scopeId}><button class="btn btn-primary btn-sm btn-circle" data-v-127414d2${_scopeId}> ▶ </button><button class="btn btn-warning btn-sm btn-circle" data-v-127414d2${_scopeId}> ☰ </button><button class="btn btn-error btn-sm btn-circle" data-v-127414d2${_scopeId}> ↻ </button></div></div><div class="flex flex-wrap justify-evenly bg-green-100 w-full max-w-80 h-80 mx-auto p-3 gap-3 rounded-xl" data-v-127414d2${_scopeId}><!--[-->`);
            ssrRenderList(unref(dropZones).Game, (item) => {
              var _a;
              _push2(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-127414d2${_scopeId}><button class="${ssrRenderClass({
                "subtract-button": unref(dropZones).Game.includes(item)
              })}" data-v-127414d2${_scopeId}>`);
              if (unref(dropZones).Game.includes(item)) {
                _push2(`<span data-v-127414d2${_scopeId}>−</span>`);
              } else {
                _push2(`<span data-v-127414d2${_scopeId}>+</span>`);
              }
              _push2(`</button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: item.avatar,
                name: item.display_name || item.title || item.name,
                size: "xl",
                rounded: "full",
                class: "avatar"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-center font-medium" data-v-127414d2${_scopeId}>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-127414d2${_scopeId}>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
            });
            _push2(`<!--]--></div></div><div class="flex-1 flex flex-col justify-center w-full gap-3" data-v-127414d2${_scopeId}><div data-zone="Ready" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Ready" }, "w-full drop-zone-ready p-2 sm:p-3 card flex flex-col gap-3 shadow-md"])}" data-v-127414d2${_scopeId}><h3 class="text-lg font-bold text-primary mb-3" data-v-127414d2${_scopeId}>Ready</h3><div class="flex flex-wrap justify-center gap-3 sm:gap-4" data-v-127414d2${_scopeId}><!--[-->`);
            ssrRenderList(unref(dropZones).Ready, (item) => {
              var _a;
              _push2(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-127414d2${_scopeId}><button class="add-button" data-v-127414d2${_scopeId}> + </button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: item.avatar,
                name: item.display_name || item.title || item.name,
                size: "xl",
                rounded: "full",
                class: "avatar"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-center font-medium" data-v-127414d2${_scopeId}>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-127414d2${_scopeId}>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
            });
            _push2(`<!--]--></div></div><div data-zone="Playing" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Playing" }, "w-full drop-zone-playing p-3 card flex flex-col gap-3 shadow-md"])}" data-v-127414d2${_scopeId}><h3 class="text-lg font-bold text-primary mb-3" data-v-127414d2${_scopeId}>Playing</h3><div class="flex flex-wrap gap-3" data-v-127414d2${_scopeId}><!--[-->`);
            ssrRenderList(unref(dropZones).Playing, (item) => {
              var _a;
              _push2(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-127414d2${_scopeId}><button class="add-button" data-v-127414d2${_scopeId}> + </button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: item.avatar,
                name: item.display_name || item.title || item.name,
                size: "xl",
                rounded: "full",
                class: "avatar"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-center font-medium" data-v-127414d2${_scopeId}>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-127414d2${_scopeId}>${ssrInterpolate(`กำลังเล่น`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
            });
            _push2(`<!--]--></div></div><div data-zone="Listing" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Listing" }, "w-full drop-zone-listing p-3 card flex flex-col gap-3 shadow-md"])}" data-v-127414d2${_scopeId}><h3 class="text-lg font-bold text-primary mb-3" data-v-127414d2${_scopeId}>Listing</h3><div class="flex flex-wrap gap-3" data-v-127414d2${_scopeId}><!--[-->`);
            ssrRenderList(unref(dropZones).Listing, (item) => {
              var _a;
              _push2(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-127414d2${_scopeId}><button class="add-button" data-v-127414d2${_scopeId}> + </button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: item.avatar,
                name: item.display_name || item.title || item.name,
                size: "xl",
                rounded: "full",
                class: "avatar"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-center font-medium" data-v-127414d2${_scopeId}>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-127414d2${_scopeId}>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
            });
            _push2(`<!--]--></div></div><div data-zone="Break" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Break" }, "w-full drop-zone-break p-3 card flex flex-col gap-3 shadow-md"])}" data-v-127414d2${_scopeId}><h3 class="text-lg font-bold text-primary mb-3" data-v-127414d2${_scopeId}>Break</h3><div class="flex flex-wrap gap-3" data-v-127414d2${_scopeId}><!--[-->`);
            ssrRenderList(unref(dropZones).Break, (item) => {
              var _a;
              _push2(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-127414d2${_scopeId}><button class="add-button" data-v-127414d2${_scopeId}> + </button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: item.avatar,
                name: item.display_name || item.title || item.name,
                size: "xl",
                rounded: "full",
                class: "avatar"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-center font-medium" data-v-127414d2${_scopeId}>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-127414d2${_scopeId}>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
            });
            _push2(`<!--]--></div></div><div data-zone="Finish" class="${ssrRenderClass([{ "drop-zone-active": unref(dropZoneActive) === "Finish" }, "w-full drop-zone-finish p-3 card flex flex-col gap-3 shadow-md"])}" data-v-127414d2${_scopeId}><h3 class="text-lg font-bold text-primary mb-3" data-v-127414d2${_scopeId}>Finish</h3><div class="flex flex-wrap gap-3" data-v-127414d2${_scopeId}><!--[-->`);
            ssrRenderList(unref(dropZones).Finish, (item) => {
              var _a;
              _push2(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-127414d2${_scopeId}><button class="add-button" data-v-127414d2${_scopeId}> + </button>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: item.avatar,
                name: item.display_name || item.title || item.name,
                size: "xl",
                rounded: "full",
                class: "avatar"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-center font-medium" data-v-127414d2${_scopeId}>${ssrInterpolate(item.title)}</span><span class="text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs" data-v-127414d2${_scopeId}>${ssrInterpolate(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)}</span><span class="text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`${item.played} เกม`)}</span><span class="text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold" data-v-127414d2${_scopeId}>${ssrInterpolate(`LV: ${item.rank_level}`)}</span></div>`);
            });
            _push2(`<!--]--></div></div></div></div>`);
            if (unref(isDragging)) {
              _push2(`<div class="drag-feedback" style="${ssrRenderStyle({
                left: `${unref(dragPosition).x}px`,
                top: `${unref(dragPosition).y}px`,
                ...unref(dragStyles),
                transition: unref(returnToOriginal) ? "all 0.3s ease" : "none"
              })}" data-v-127414d2${_scopeId}>`);
              _push2(ssrRenderComponent(_sfc_main$2, {
                src: unref(draggedItem).avatar,
                name: unref(draggedItem).display_name || unref(draggedItem).title || unref(draggedItem).name,
                size: "xl",
                rounded: "full",
                class: "avatar drag-avatar"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-center font-medium" data-v-127414d2${_scopeId}>${ssrInterpolate(unref(draggedItem).title)}</span></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("div", { class: "flex flex-col sm:flex-row justify-center gap-4" }, [
                createVNode("div", {
                  class: ["w-full sm:w-96 h-[30rem] drop-zone-game card flex flex-col gap-3 shadow-lg", { "drop-zone-active": unref(dropZoneActive) === "Game" }],
                  "data-zone": "Game"
                }, [
                  createVNode("div", { class: "flex items-center justify-between mb-3" }, [
                    createVNode("h3", { class: "text-lg font-bold text-primary" }, "Game"),
                    createVNode("div", { class: "flex gap-1" }, [
                      createVNode("button", {
                        onClick: startNewGame,
                        class: "btn btn-primary btn-sm btn-circle"
                      }, " ▶ "),
                      createVNode("button", {
                        onClick: listNewGame,
                        class: "btn btn-warning btn-sm btn-circle"
                      }, " ☰ "),
                      createVNode("button", {
                        onClick: unref(releaseAllItems),
                        class: "btn btn-error btn-sm btn-circle"
                      }, " ↻ ", 8, ["onClick"])
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-wrap justify-evenly bg-green-100 w-full max-w-80 h-80 mx-auto p-3 gap-3 rounded-xl" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(dropZones).Game, (item) => {
                      var _a;
                      return openBlock(), createBlock("div", {
                        key: item.id,
                        class: ["draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white", { "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }],
                        "data-id": item.id,
                        onMousedown: withModifiers(($event) => unref(handleDragStart)($event, item, "Game"), ["prevent"]),
                        onTouchstart: withModifiers(($event) => unref(handleDragStart)($event, item, "Game"), ["prevent"])
                      }, [
                        createVNode("button", {
                          onMousedown: withModifiers(() => {
                          }, ["stop"]),
                          onMouseup: withModifiers(unref(handleMouseUp), ["stop"]),
                          onTouchstart: withModifiers(unref(handleTouchStart), ["stop"]),
                          onTouchend: withModifiers(($event) => unref(handleTouchEnd)(item, "Game"), ["stop"]),
                          onDblclick: withModifiers(($event) => unref(handleDoubleClick)(item, "Game"), ["stop"]),
                          class: {
                            "subtract-button": unref(dropZones).Game.includes(item)
                          }
                        }, [
                          unref(dropZones).Game.includes(item) ? (openBlock(), createBlock("span", { key: 0 }, "−")) : (openBlock(), createBlock("span", { key: 1 }, "+"))
                        ], 42, ["onMousedown", "onMouseup", "onTouchstart", "onTouchend", "onDblclick"]),
                        createVNode(_sfc_main$2, {
                          src: item.avatar,
                          name: item.display_name || item.title || item.name,
                          size: "xl",
                          rounded: "full",
                          class: "avatar"
                        }, null, 8, ["src", "name"]),
                        createVNode("span", { class: "text-center font-medium" }, toDisplayString(item.title), 1),
                        createVNode("span", {
                          class: "text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs",
                          textContent: toDisplayString(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)
                        }, null, 8, ["textContent"]),
                        createVNode("span", {
                          class: "text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold",
                          textContent: toDisplayString(`${item.played} เกม`)
                        }, null, 8, ["textContent"]),
                        createVNode("span", {
                          class: "text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold",
                          textContent: toDisplayString(`LV: ${item.rank_level}`)
                        }, null, 8, ["textContent"])
                      ], 42, ["data-id", "onMousedown", "onTouchstart"]);
                    }), 128))
                  ])
                ], 2),
                createVNode("div", { class: "flex-1 flex flex-col justify-center w-full gap-3" }, [
                  createVNode("div", {
                    class: ["w-full drop-zone-ready p-2 sm:p-3 card flex flex-col gap-3 shadow-md", { "drop-zone-active": unref(dropZoneActive) === "Ready" }],
                    "data-zone": "Ready"
                  }, [
                    createVNode("h3", { class: "text-lg font-bold text-primary mb-3" }, "Ready"),
                    createVNode("div", { class: "flex flex-wrap justify-center gap-3 sm:gap-4" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(dropZones).Ready, (item) => {
                        var _a;
                        return openBlock(), createBlock("div", {
                          key: item.id,
                          class: ["draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white", { "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }],
                          "data-id": item.id,
                          onMousedown: withModifiers(($event) => unref(handleDragStart)($event, item, "Ready"), ["prevent"]),
                          onTouchstart: withModifiers(($event) => unref(handleDragStart)($event, item, "Ready"), ["prevent"])
                        }, [
                          createVNode("button", {
                            onMousedown: withModifiers(() => {
                            }, ["stop"]),
                            onMouseup: withModifiers(unref(handleMouseUp), ["stop"]),
                            onTouchstart: withModifiers(unref(handleTouchStart), ["stop"]),
                            onTouchend: withModifiers(($event) => unref(handleTouchEnd)(item, "Ready"), ["stop"]),
                            onDblclick: withModifiers(($event) => unref(handleDoubleClick)(item, "Ready"), ["stop"]),
                            class: "add-button"
                          }, " + ", 40, ["onMousedown", "onMouseup", "onTouchstart", "onTouchend", "onDblclick"]),
                          createVNode(_sfc_main$2, {
                            src: item.avatar,
                            name: item.display_name || item.title || item.name,
                            size: "xl",
                            rounded: "full",
                            class: "avatar"
                          }, null, 8, ["src", "name"]),
                          createVNode("span", { class: "text-center font-medium" }, toDisplayString(item.title), 1),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs",
                            textContent: toDisplayString(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)
                          }, null, 8, ["textContent"]),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`${item.played} เกม`)
                          }, null, 8, ["textContent"]),
                          createVNode("span", {
                            class: "text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`LV: ${item.rank_level}`)
                          }, null, 8, ["textContent"])
                        ], 42, ["data-id", "onMousedown", "onTouchstart"]);
                      }), 128))
                    ])
                  ], 2),
                  createVNode("div", {
                    class: ["w-full drop-zone-playing p-3 card flex flex-col gap-3 shadow-md", { "drop-zone-active": unref(dropZoneActive) === "Playing" }],
                    "data-zone": "Playing"
                  }, [
                    createVNode("h3", { class: "text-lg font-bold text-primary mb-3" }, "Playing"),
                    createVNode("div", { class: "flex flex-wrap gap-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(dropZones).Playing, (item) => {
                        var _a;
                        return openBlock(), createBlock("div", {
                          key: item.id,
                          class: ["draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white", { "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }],
                          "data-id": item.id,
                          onMousedown: withModifiers(($event) => unref(handleDragStart)($event, item, "Playing"), ["prevent"]),
                          onTouchstart: withModifiers(($event) => unref(handleDragStart)($event, item, "Playing"), ["prevent"])
                        }, [
                          createVNode("button", {
                            onMousedown: withModifiers(() => {
                            }, ["stop"]),
                            onMouseup: withModifiers(unref(handleMouseUp), ["stop"]),
                            onTouchstart: withModifiers(unref(handleTouchStart), ["stop"]),
                            onTouchend: withModifiers(($event) => unref(handleTouchEnd)(item, "Playing"), ["stop"]),
                            onDblclick: withModifiers(($event) => unref(handleDoubleClick)(item, "Playing"), ["stop"]),
                            class: "add-button"
                          }, " + ", 40, ["onMousedown", "onMouseup", "onTouchstart", "onTouchend", "onDblclick"]),
                          createVNode(_sfc_main$2, {
                            src: item.avatar,
                            name: item.display_name || item.title || item.name,
                            size: "xl",
                            rounded: "full",
                            class: "avatar"
                          }, null, 8, ["src", "name"]),
                          createVNode("span", { class: "text-center font-medium" }, toDisplayString(item.title), 1),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs",
                            textContent: `กำลังเล่น`
                          }),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`${item.played} เกม`)
                          }, null, 8, ["textContent"]),
                          createVNode("span", {
                            class: "text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`LV: ${item.rank_level}`)
                          }, null, 8, ["textContent"])
                        ], 42, ["data-id", "onMousedown", "onTouchstart"]);
                      }), 128))
                    ])
                  ], 2),
                  createVNode("div", {
                    class: ["w-full drop-zone-listing p-3 card flex flex-col gap-3 shadow-md", { "drop-zone-active": unref(dropZoneActive) === "Listing" }],
                    "data-zone": "Listing"
                  }, [
                    createVNode("h3", { class: "text-lg font-bold text-primary mb-3" }, "Listing"),
                    createVNode("div", { class: "flex flex-wrap gap-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(dropZones).Listing, (item) => {
                        var _a;
                        return openBlock(), createBlock("div", {
                          key: item.id,
                          class: ["draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white", { "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }],
                          "data-id": item.id,
                          onMousedown: withModifiers(($event) => unref(handleDragStart)($event, item, "Listing"), ["prevent"]),
                          onTouchstart: withModifiers(($event) => unref(handleDragStart)($event, item, "Listing"), ["prevent"])
                        }, [
                          createVNode("button", {
                            onMousedown: withModifiers(() => {
                            }, ["stop"]),
                            onMouseup: withModifiers(unref(handleMouseUp), ["stop"]),
                            onTouchstart: withModifiers(unref(handleTouchStart), ["stop"]),
                            onTouchend: withModifiers(($event) => unref(handleTouchEnd)(item, "Listing"), ["stop"]),
                            onDblclick: withModifiers(($event) => unref(handleDoubleClick)(item, "Listing"), ["stop"]),
                            class: "add-button"
                          }, " + ", 40, ["onMousedown", "onMouseup", "onTouchstart", "onTouchend", "onDblclick"]),
                          createVNode(_sfc_main$2, {
                            src: item.avatar,
                            name: item.display_name || item.title || item.name,
                            size: "xl",
                            rounded: "full",
                            class: "avatar"
                          }, null, 8, ["src", "name"]),
                          createVNode("span", { class: "text-center font-medium" }, toDisplayString(item.title), 1),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs",
                            textContent: toDisplayString(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)
                          }, null, 8, ["textContent"]),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`${item.played} เกม`)
                          }, null, 8, ["textContent"]),
                          createVNode("span", {
                            class: "text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`LV: ${item.rank_level}`)
                          }, null, 8, ["textContent"])
                        ], 42, ["data-id", "onMousedown", "onTouchstart"]);
                      }), 128))
                    ])
                  ], 2),
                  createVNode("div", {
                    class: ["w-full drop-zone-break p-3 card flex flex-col gap-3 shadow-md", { "drop-zone-active": unref(dropZoneActive) === "Break" }],
                    "data-zone": "Break"
                  }, [
                    createVNode("h3", { class: "text-lg font-bold text-primary mb-3" }, "Break"),
                    createVNode("div", { class: "flex flex-wrap gap-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(dropZones).Break, (item) => {
                        var _a;
                        return openBlock(), createBlock("div", {
                          key: item.id,
                          class: ["draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white", { "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }],
                          "data-id": item.id,
                          onMousedown: withModifiers(($event) => unref(handleDragStart)($event, item, "Break"), ["prevent"]),
                          onTouchstart: withModifiers(($event) => unref(handleDragStart)($event, item, "Break"), ["prevent"])
                        }, [
                          createVNode("button", {
                            onMousedown: withModifiers(() => {
                            }, ["stop"]),
                            onMouseup: withModifiers(unref(handleMouseUp), ["stop"]),
                            onTouchstart: withModifiers(unref(handleTouchStart), ["stop"]),
                            onTouchend: withModifiers(($event) => unref(handleTouchEnd)(item, "Break"), ["stop"]),
                            onDblclick: withModifiers(($event) => unref(handleDoubleClick)(item, "Break"), ["stop"]),
                            class: "add-button"
                          }, " + ", 40, ["onMousedown", "onMouseup", "onTouchstart", "onTouchend", "onDblclick"]),
                          createVNode(_sfc_main$2, {
                            src: item.avatar,
                            name: item.display_name || item.title || item.name,
                            size: "xl",
                            rounded: "full",
                            class: "avatar"
                          }, null, 8, ["src", "name"]),
                          createVNode("span", { class: "text-center font-medium" }, toDisplayString(item.title), 1),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs",
                            textContent: toDisplayString(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)
                          }, null, 8, ["textContent"]),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`${item.played} เกม`)
                          }, null, 8, ["textContent"]),
                          createVNode("span", {
                            class: "text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`LV: ${item.rank_level}`)
                          }, null, 8, ["textContent"])
                        ], 42, ["data-id", "onMousedown", "onTouchstart"]);
                      }), 128))
                    ])
                  ], 2),
                  createVNode("div", {
                    class: ["w-full drop-zone-finish p-3 card flex flex-col gap-3 shadow-md", { "drop-zone-active": unref(dropZoneActive) === "Finish" }],
                    "data-zone": "Finish"
                  }, [
                    createVNode("h3", { class: "text-lg font-bold text-primary mb-3" }, "Finish"),
                    createVNode("div", { class: "flex flex-wrap gap-3" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(unref(dropZones).Finish, (item) => {
                        var _a;
                        return openBlock(), createBlock("div", {
                          key: item.id,
                          class: ["draggable-item flex flex-col w-28 h-32 items-center p-2 gap-1 bg-white", { "hovered-item": ((_a = unref(hoveredItem)) == null ? void 0 : _a.id) === item.id }],
                          "data-id": item.id,
                          onMousedown: withModifiers(($event) => unref(handleDragStart)($event, item, "Finish"), ["prevent"]),
                          onTouchstart: withModifiers(($event) => unref(handleDragStart)($event, item, "Finish"), ["prevent"])
                        }, [
                          createVNode("button", {
                            onMousedown: withModifiers(() => {
                            }, ["stop"]),
                            onMouseup: withModifiers(unref(handleMouseUp), ["stop"]),
                            onTouchstart: withModifiers(unref(handleTouchStart), ["stop"]),
                            onTouchend: withModifiers(($event) => unref(handleTouchEnd)(item, "Finish"), ["stop"]),
                            onDblclick: withModifiers(($event) => unref(handleDoubleClick)(item, "Finish"), ["stop"]),
                            class: "add-button"
                          }, " + ", 40, ["onMousedown", "onMouseup", "onTouchstart", "onTouchend", "onDblclick"]),
                          createVNode(_sfc_main$2, {
                            src: item.avatar,
                            name: item.display_name || item.title || item.name,
                            size: "xl",
                            rounded: "full",
                            class: "avatar"
                          }, null, 8, ["src", "name"]),
                          createVNode("span", { class: "text-center font-medium" }, toDisplayString(item.title), 1),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 left-0 bg-red-100 rounded-lg px-1 text-xs",
                            textContent: toDisplayString(`${unref(convertWaitingTimeToMinutes)(item.waiting_time)} นาที`)
                          }, null, 8, ["textContent"]),
                          createVNode("span", {
                            class: "text-center absolute bottom-0 right-0 bg-blue-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`${item.played} เกม`)
                          }, null, 8, ["textContent"]),
                          createVNode("span", {
                            class: "text-center absolute top-0 left-0 bg-green-100 rounded-lg px-1 text-xs font-bold",
                            textContent: toDisplayString(`LV: ${item.rank_level}`)
                          }, null, 8, ["textContent"])
                        ], 42, ["data-id", "onMousedown", "onTouchstart"]);
                      }), 128))
                    ])
                  ], 2)
                ])
              ]),
              unref(isDragging) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "drag-feedback",
                style: {
                  left: `${unref(dragPosition).x}px`,
                  top: `${unref(dragPosition).y}px`,
                  ...unref(dragStyles),
                  transition: unref(returnToOriginal) ? "all 0.3s ease" : "none"
                }
              }, [
                createVNode(_sfc_main$2, {
                  src: unref(draggedItem).avatar,
                  name: unref(draggedItem).display_name || unref(draggedItem).title || unref(draggedItem).name,
                  size: "xl",
                  rounded: "full",
                  class: "avatar drag-avatar"
                }, null, 8, ["src", "name"]),
                createVNode("span", {
                  class: "text-center font-medium",
                  textContent: toDisplayString(unref(draggedItem).title)
                }, null, 8, ["textContent"])
              ], 4)) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Game.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Game = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-127414d2"]]);
export {
  Game as default
};
