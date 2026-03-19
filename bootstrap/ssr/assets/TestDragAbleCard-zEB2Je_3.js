import { ref, unref, withCtx, createVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle } from "vue/server-renderer";
import { Container, Draggable } from "vue-dndrop";
import { s as scene, a as applyDrag } from "./helpers-p1aGuTGh.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "TestDragAbleCard",
  __ssrInlineRender: true,
  setup(__props) {
    const scene$1 = ref(scene);
    const upperDropPlaceholderOptions = {
      className: "cards-drop-preview",
      animationDuration: "150",
      showOnTop: true
    };
    const dropPlaceholderOptions = {
      className: "drop-preview",
      animationDuration: "150",
      showOnTop: true
    };
    function onColumnDrop(dropResult) {
      const updatedScene = { ...scene$1.value };
      updatedScene.children = applyDrag(updatedScene.children, dropResult);
      scene$1.value = updatedScene;
    }
    function onCardDrop(columnId, dropResult) {
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const updatedScene = { ...scene$1.value };
        const column = updatedScene.children.find((p) => p.id === columnId);
        const columnIndex = updatedScene.children.indexOf(column);
        const newColumn = { ...column };
        newColumn.children = applyDrag(newColumn.children, dropResult);
        updatedScene.children.splice(columnIndex, 1, newColumn);
        scene$1.value = updatedScene;
      }
    }
    function getCardPayload(columnId) {
      return (index) => {
        return scene$1.value.children.find((p) => p.id === columnId).children[index];
      };
    }
    function dragStart() {
      console.log("drag started");
    }
    function log(...params) {
      console.log(...params);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-07dc8275>`);
      _push(ssrRenderComponent(unref(Container), {
        orientation: "horizontal",
        onDrop: onColumnDrop,
        "drag-handle-selector": ".column-drag-handle",
        onDragStart: dragStart,
        "drop-placeholder": upperDropPlaceholderOptions
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(scene$1.value.children, (column) => {
              _push2(ssrRenderComponent(unref(Draggable), {
                key: column.id
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="${ssrRenderClass(column.props.className)}" data-v-07dc8275${_scopeId2}><div class="card-column-header" data-v-07dc8275${_scopeId2}><span class="column-drag-handle" data-v-07dc8275${_scopeId2}>☰</span> ${ssrInterpolate(column.name)}</div>`);
                    _push3(ssrRenderComponent(unref(Container), {
                      "group-name": "col",
                      onDrop: (e) => onCardDrop(column.id, e),
                      onDragStart: (e) => log("drag start", e),
                      onDragEnd: (e) => log("drag end", e),
                      "get-child-payload": getCardPayload(column.id),
                      "drag-class": "card-ghost",
                      "drop-class": "card-ghost-drop",
                      "drop-placeholder": dropPlaceholderOptions
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(column.children, (card) => {
                            _push4(ssrRenderComponent(unref(Draggable), {
                              key: card.id
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="${ssrRenderClass(card.props.className)}" style="${ssrRenderStyle(card.props.style)}" data-v-07dc8275${_scopeId4}><h3 data-v-07dc8275${_scopeId4}>Task # ${ssrInterpolate(card.number)}</h3><p class="card-text" data-v-07dc8275${_scopeId4}>${ssrInterpolate(card.data)}</p></div>`);
                                } else {
                                  return [
                                    createVNode("div", {
                                      class: card.props.className,
                                      style: card.props.style
                                    }, [
                                      createVNode("h3", null, "Task # " + toDisplayString(card.number), 1),
                                      createVNode("p", { class: "card-text" }, toDisplayString(card.data), 1)
                                    ], 6)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(column.children, (card) => {
                              return openBlock(), createBlock(unref(Draggable), {
                                key: card.id
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", {
                                    class: card.props.className,
                                    style: card.props.style
                                  }, [
                                    createVNode("h3", null, "Task # " + toDisplayString(card.number), 1),
                                    createVNode("p", { class: "card-text" }, toDisplayString(card.data), 1)
                                  ], 6)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    return [
                      createVNode("div", {
                        class: column.props.className
                      }, [
                        createVNode("div", { class: "card-column-header" }, [
                          createVNode("span", { class: "column-drag-handle" }, "☰"),
                          createTextVNode(" " + toDisplayString(column.name), 1)
                        ]),
                        createVNode(unref(Container), {
                          "group-name": "col",
                          onDrop: (e) => onCardDrop(column.id, e),
                          onDragStart: (e) => log("drag start", e),
                          onDragEnd: (e) => log("drag end", e),
                          "get-child-payload": getCardPayload(column.id),
                          "drag-class": "card-ghost",
                          "drop-class": "card-ghost-drop",
                          "drop-placeholder": dropPlaceholderOptions
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(column.children, (card) => {
                              return openBlock(), createBlock(unref(Draggable), {
                                key: card.id
                              }, {
                                default: withCtx(() => [
                                  createVNode("div", {
                                    class: card.props.className,
                                    style: card.props.style
                                  }, [
                                    createVNode("h3", null, "Task # " + toDisplayString(card.number), 1),
                                    createVNode("p", { class: "card-text" }, toDisplayString(card.data), 1)
                                  ], 6)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128))
                          ]),
                          _: 2
                        }, 1032, ["onDrop", "onDragStart", "onDragEnd", "get-child-payload"])
                      ], 2)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(scene$1.value.children, (column) => {
                return openBlock(), createBlock(unref(Draggable), {
                  key: column.id
                }, {
                  default: withCtx(() => [
                    createVNode("div", {
                      class: column.props.className
                    }, [
                      createVNode("div", { class: "card-column-header" }, [
                        createVNode("span", { class: "column-drag-handle" }, "☰"),
                        createTextVNode(" " + toDisplayString(column.name), 1)
                      ]),
                      createVNode(unref(Container), {
                        "group-name": "col",
                        onDrop: (e) => onCardDrop(column.id, e),
                        onDragStart: (e) => log("drag start", e),
                        onDragEnd: (e) => log("drag end", e),
                        "get-child-payload": getCardPayload(column.id),
                        "drag-class": "card-ghost",
                        "drop-class": "card-ghost-drop",
                        "drop-placeholder": dropPlaceholderOptions
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(column.children, (card) => {
                            return openBlock(), createBlock(unref(Draggable), {
                              key: card.id
                            }, {
                              default: withCtx(() => [
                                createVNode("div", {
                                  class: card.props.className,
                                  style: card.props.style
                                }, [
                                  createVNode("h3", null, "Task # " + toDisplayString(card.number), 1),
                                  createVNode("p", { class: "card-text" }, toDisplayString(card.data), 1)
                                ], 6)
                              ]),
                              _: 2
                            }, 1024);
                          }), 128))
                        ]),
                        _: 2
                      }, 1032, ["onDrop", "onDragStart", "onDragEnd", "get-child-payload"])
                    ], 2)
                  ]),
                  _: 2
                }, 1024);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/TestDragAbleCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TestDragAbleCard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-07dc8275"]]);
export {
  TestDragAbleCard as default
};
