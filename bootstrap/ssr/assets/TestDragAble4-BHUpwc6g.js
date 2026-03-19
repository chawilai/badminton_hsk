import { ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderStyle } from "vue/server-renderer";
import { reactive, ref, useSSRContext } from "vue";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "TestDragAble4",
  __ssrInlineRender: true,
  setup(__props) {
    const dropZones = reactive({
      Playing: [],
      // Start empty
      Ready: [
        { id: 1, title: "Item A" },
        { id: 2, title: "Item B" },
        { id: 3, title: "Item C" },
        { id: 4, title: "Item D" }
      ],
      Break: [
        { id: 5, title: "Item E" },
        { id: 6, title: "Item F" },
        { id: 7, title: "Item G" }
      ],
      Finish: [{ id: 8, title: "Item H" }]
    });
    reactive({});
    const errorMessage = ref("");
    ref(false);
    ref(null);
    const hoveredItem = ref(null);
    ref("");
    const dropZoneActive = ref("");
    const isDragging = ref(false);
    const dragPosition = reactive({ x: 0, y: 0 });
    const dragContent = ref("");
    const dragStyles = ref({});
    const returnToOriginal = ref(false);
    reactive({ x: 0, y: 0 });
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="p-fluid grid grid-nogutter justify-content-center gap-4" data-v-86dc7e10>${ssrInterpolate(errorMessage.value)} <div data-zone="Playing" class="${ssrRenderClass([{ "drop-zone-active": dropZoneActive.value === "Playing" }, "col-12 lg:col-3 drop-zone-playing p-card flex flex-column gap-3 shadow-lg"])}" data-v-86dc7e10><div class="flex align-items-center justify-content-between mb-3" data-v-86dc7e10><h3 class="text-lg font-bold text-primary" data-v-86dc7e10>Playing</h3><button class="w-8rem p-button p-button-danger p-button-sm rounded-full" data-v-86dc7e10><i class="pi pi-refresh" data-v-86dc7e10></i><span class="ml-2" data-v-86dc7e10>Release All</span></button></div><div class="playing-items-grid" data-v-86dc7e10><!--[-->`);
      ssrRenderList(dropZones.Playing, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = hoveredItem.value) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-86dc7e10><button class="${ssrRenderClass({
          "subtract-button": dropZones.Playing.includes(item)
        })}" data-v-86dc7e10><i class="${ssrRenderClass(dropZones.Playing.includes(item) ? "pi pi-minus" : "pi pi-plus")}" data-v-86dc7e10></i></button><img${ssrRenderAttr("src", `https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`)} alt="Avatar" class="avatar" data-v-86dc7e10><span class="text-center font-medium" data-v-86dc7e10>${ssrInterpolate(item.title)}</span></div>`);
      });
      _push(`<!--]--></div></div><div data-zone="Ready" class="${ssrRenderClass([{ "drop-zone-active": dropZoneActive.value === "Ready" }, "col-12 lg:col-3 drop-zone-ready p-card flex flex-column gap-3 shadow-md"])}" data-v-86dc7e10><h3 class="text-lg font-bold text-primary mb-3" data-v-86dc7e10>Ready</h3><div class="flex flex-wrap gap-3" data-v-86dc7e10><!--[-->`);
      ssrRenderList(dropZones.Ready, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = hoveredItem.value) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-86dc7e10><button class="add-button" data-v-86dc7e10><i class="pi pi-plus" data-v-86dc7e10></i></button><img${ssrRenderAttr("src", `https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`)} alt="Avatar" class="avatar" data-v-86dc7e10><span class="text-center font-medium" data-v-86dc7e10>${ssrInterpolate(item.title)}</span></div>`);
      });
      _push(`<!--]--></div></div><div data-zone="Break" class="${ssrRenderClass([{ "drop-zone-active": dropZoneActive.value === "Break" }, "col-12 lg:col-3 drop-zone-break p-card flex flex-column gap-3 shadow-md"])}" data-v-86dc7e10><h3 class="text-lg font-bold text-primary mb-3" data-v-86dc7e10>Break</h3><div class="flex flex-wrap gap-3" data-v-86dc7e10><!--[-->`);
      ssrRenderList(dropZones.Break, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = hoveredItem.value) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-86dc7e10><button class="add-button" data-v-86dc7e10><i class="pi pi-plus" data-v-86dc7e10></i></button><img${ssrRenderAttr("src", `https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`)} alt="Avatar" class="avatar" data-v-86dc7e10><span class="text-center font-medium" data-v-86dc7e10>${ssrInterpolate(item.title)}</span></div>`);
      });
      _push(`<!--]--></div></div><div data-zone="Finish" class="${ssrRenderClass([{ "drop-zone-active": dropZoneActive.value === "Finish" }, "col-12 lg:col-3 drop-zone-finish p-card flex flex-column gap-3 shadow-md"])}" data-v-86dc7e10><h3 class="text-lg font-bold text-primary mb-3" data-v-86dc7e10>Finish</h3><div class="flex flex-wrap gap-3" data-v-86dc7e10><!--[-->`);
      ssrRenderList(dropZones.Finish, (item) => {
        var _a;
        _push(`<div class="${ssrRenderClass([{ "hovered-item": ((_a = hoveredItem.value) == null ? void 0 : _a.id) === item.id }, "draggable-item flex flex-column align-items-center p-2 gap-2 bg-white"])}"${ssrRenderAttr("data-id", item.id)} data-v-86dc7e10><button class="add-button" data-v-86dc7e10><i class="pi pi-plus" data-v-86dc7e10></i></button><img${ssrRenderAttr("src", `https://api.dicebear.com/6.x/adventurer/svg?seed=${item.title}`)} alt="Avatar" class="avatar" data-v-86dc7e10><span class="text-center font-medium" data-v-86dc7e10>${ssrInterpolate(item.title)}</span></div>`);
      });
      _push(`<!--]--></div></div></div>`);
      if (isDragging.value) {
        _push(`<div class="drag-feedback" style="${ssrRenderStyle({
          left: `${dragPosition.x}px`,
          top: `${dragPosition.y}px`,
          ...dragStyles.value,
          transition: returnToOriginal.value ? "all 0.3s ease" : "none"
        })}" data-v-86dc7e10><img${ssrRenderAttr("src", `https://api.dicebear.com/6.x/adventurer/svg?seed=${dragContent.value}`)} alt="Dragging Avatar" class="avatar drag-avatar" data-v-86dc7e10><span class="text-center font-medium" data-v-86dc7e10>${ssrInterpolate(dragContent.value)}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/TestDragAble4.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TestDragAble4 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-86dc7e10"]]);
export {
  TestDragAble4 as default
};
