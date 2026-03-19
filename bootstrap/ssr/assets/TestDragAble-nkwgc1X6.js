import { ref, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { Container, Draggable } from "vue-dndrop";
import { a as applyDrag, g as generateItems } from "./helpers-p1aGuTGh.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "TestDragAble",
  __ssrInlineRender: true,
  setup(__props) {
    let itemId = 0;
    const lastTap = ref(0);
    const clickTimeout = ref(null);
    function generateId() {
      return `item-${++itemId}`;
    }
    function generate(num) {
      return generateItems(5, (i) => ({
        id: generateId(),
        data: `Draggable ${num} - ${i + 1}`
      }));
    }
    const groups = ref([]);
    const flags = ref([]);
    const logs = ref({
      "get-child-payload": true,
      "should-accept-drop": true,
      "should-animate-drop": true,
      "drag-start": true,
      "drag-end": true,
      "drag-enter": true,
      "drag-leave": true,
      "drop-not-allowed": true,
      drop: true
    });
    const logPayload = ref(false);
    function getChildPayload(groupIndex, itemIndex) {
      log("get-child-payload", groupIndex, itemIndex);
      return groups.value[groupIndex][itemIndex];
    }
    function getShouldAcceptDrop(index, sourceContainerOptions, payload) {
      log("should-accept-drop", sourceContainerOptions, payload);
      return flags.value[index].drop;
    }
    function getShouldAnimateDrop(index, sourceContainerOptions, payload) {
      log("should-animate-drop", sourceContainerOptions, payload);
      return flags.value[index].animate;
    }
    function onDragStart(...args) {
      log("drag-start", ...args);
    }
    function onDragEnd(...args) {
      log("drag-end", ...args);
    }
    function onDragEnter(...args) {
      log("drag-enter", ...args);
    }
    function onDragLeave(...args) {
      log("drag-leave", ...args);
    }
    function onDrop(groupIndex, dropResult) {
      groups.value[groupIndex] = applyDrag(groups.value[groupIndex], dropResult);
      log("drop", dropResult);
    }
    function dropNotAllowed(...args) {
      log("drop-not-allowed", ...args);
    }
    function addColumn() {
      groups.value.push(generate(groups.value.length + 1));
      flags.value.push({ drop: true, animate: true });
    }
    function log(name, ...args) {
      if (logs.value[name]) {
        logPayload.value ? console.log(name, ...args) : console.log(name);
      }
    }
    const handleInteraction = (event, item, index) => {
      const currentTime = (/* @__PURE__ */ new Date()).getTime();
      const tapInterval = currentTime - lastTap.value;
      console.log(event);
      if (tapInterval < 300 && tapInterval > 0) {
        if (event.type === "touchstart") {
          console.log("Double Tap Detected");
        } else if (event.type === "click") {
          console.log("Double Click Detected");
          if (index === 0) {
            console.log(groups.value[1]);
            groups.value[1].push(item);
            let findIndex = groups.value[0].findIndex((itemtemp) => itemtemp.id === item.id);
            if (findIndex !== -1) {
              groups.value[0].splice(findIndex, 1);
            }
          } else {
            console.log(groups.value[0]);
            groups.value[0].push(item);
            let findIndex = groups.value[1].findIndex((itemtemp) => itemtemp.id === item.id);
            if (findIndex !== -1) {
              groups.value[1].splice(findIndex, 1);
            }
          }
        }
        lastTap.value = 0;
      } else {
        lastTap.value = currentTime;
        if (event.type === "touchstart") {
          console.log("Single Tap Detected");
        } else if (event.type === "click") {
          console.log("Single Click Detected");
        }
        clearTimeout(clickTimeout.value);
        clickTimeout.value = setTimeout(() => {
          lastTap.value = 0;
        }, 300);
      }
    };
    addColumn();
    addColumn();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "demo" }, _attrs))} data-v-ea137f39><div class="columns" data-v-ea137f39><!--[-->`);
      ssrRenderList(groups.value, (items, index) => {
        _push(`<div class="column" data-v-ea137f39><div class="column-actions" data-v-ea137f39><label data-v-ea137f39><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(flags.value[index].drop) ? ssrLooseContain(flags.value[index].drop, null) : flags.value[index].drop) ? " checked" : ""} data-v-ea137f39> Accept drop </label><label data-v-ea137f39><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(flags.value[index].animate) ? ssrLooseContain(flags.value[index].animate, null) : flags.value[index].animate) ? " checked" : ""} data-v-ea137f39> Animate drop </label></div>`);
        _push(ssrRenderComponent(unref(Container), {
          "data-index": index,
          "group-name": "column",
          "get-child-payload": (itemIndex) => getChildPayload(index, itemIndex),
          "should-accept-drop": (src, payload) => getShouldAcceptDrop(index, src, payload),
          "should-animate-drop": (src, payload) => getShouldAnimateDrop(index, src, payload),
          onDragStart,
          onDragEnter,
          onDragLeave,
          onDragEnd,
          onDropNotAllowed: dropNotAllowed,
          onDrop: (event) => onDrop(index, event)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<!--[-->`);
              ssrRenderList(items, (item) => {
                _push2(ssrRenderComponent(unref(Draggable), {
                  key: item.id
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`<div class="draggable-item relative" data-v-ea137f39${_scopeId2}>${ssrInterpolate(item.data)} <div class="absolute top-0 right-0 px-1 bg-green-200 border-round-xl" data-v-ea137f39${_scopeId2}> + </div></div>`);
                    } else {
                      return [
                        createVNode("div", { class: "draggable-item relative" }, [
                          createTextVNode(toDisplayString(item.data) + " ", 1),
                          createVNode("div", {
                            class: "absolute top-0 right-0 px-1 bg-green-200 border-round-xl",
                            onTouchstart: ($event) => handleInteraction($event, item, index),
                            onClick: ($event) => handleInteraction($event, item, index)
                          }, " + ", 40, ["onTouchstart", "onClick"])
                        ])
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              });
              _push2(`<!--]-->`);
            } else {
              return [
                (openBlock(true), createBlock(Fragment, null, renderList(items, (item) => {
                  return openBlock(), createBlock(unref(Draggable), {
                    key: item.id
                  }, {
                    default: withCtx(() => [
                      createVNode("div", { class: "draggable-item relative" }, [
                        createTextVNode(toDisplayString(item.data) + " ", 1),
                        createVNode("div", {
                          class: "absolute top-0 right-0 px-1 bg-green-200 border-round-xl",
                          onTouchstart: ($event) => handleInteraction($event, item, index),
                          onClick: ($event) => handleInteraction($event, item, index)
                        }, " + ", 40, ["onTouchstart", "onClick"])
                      ])
                    ]),
                    _: 2
                  }, 1024);
                }), 128))
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div><div class="controls" data-v-ea137f39><h4 class="title" data-v-ea137f39>Fired events</h4><hr data-v-ea137f39><small class="title" data-v-ea137f39>Choose which events will be used in the columns</small><div class="actions" data-v-ea137f39><!--[-->`);
      ssrRenderList(logs.value, (key, name) => {
        _push(`<label data-v-ea137f39><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(logs.value[name]) ? ssrLooseContain(logs.value[name], null) : logs.value[name]) ? " checked" : ""} data-v-ea137f39> ${ssrInterpolate(name)}</label>`);
      });
      _push(`<!--]--><hr data-v-ea137f39><label data-v-ea137f39><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(logPayload.value) ? ssrLooseContain(logPayload.value, null) : logPayload.value) ? " checked" : ""} data-v-ea137f39> Log payload </label></div><hr data-v-ea137f39><div class="buttons" data-v-ea137f39><button class="button-column remove"${ssrIncludeBooleanAttr(groups.value.length === 1) ? " disabled" : ""} data-v-ea137f39> Remove Column </button><button class="button-column add" data-v-ea137f39>Add Column</button></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/TestDragAble.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TestDragAble = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ea137f39"]]);
export {
  TestDragAble as default
};
