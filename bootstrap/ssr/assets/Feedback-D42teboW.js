import { ref, computed, onMounted, unref, withCtx, createVNode, createBlock, createCommentVNode, toDisplayString, openBlock, Fragment, renderList, withDirectives, vModelText, createTextVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-BPNdCb7L.js";
import { usePage, useForm, Head } from "@inertiajs/vue3";
import { u as useLocale } from "./useLocale-QwrDLuQY.js";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "Feedback",
  __ssrInlineRender: true,
  props: {
    myFeedbacks: { type: Array, default: () => [] }
  },
  setup(__props) {
    const { t } = useLocale();
    const toast = useToast();
    const page = usePage();
    const types = [
      { key: "feedback", icon: "💬", color: "bg-info/15 border-info" },
      { key: "feature_request", icon: "💡", color: "bg-warning/15 border-warning" },
      { key: "bug_report", icon: "🐛", color: "bg-error/15 border-error" }
    ];
    const form = useForm({
      type: "feedback",
      subject: "",
      description: "",
      screenshot: null
    });
    const previewUrl = ref(null);
    const expandedId = ref(null);
    const toggleExpand = (id) => {
      expandedId.value = expandedId.value === id ? null : id;
    };
    const isValid = computed(() => form.type && form.subject.trim() && form.description.trim());
    const subjectPlaceholder = computed(() => t("feedback.subjectPlaceholder_" + form.type));
    const descriptionPlaceholder = computed(() => t("feedback.descPlaceholder_" + form.type));
    const onFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        form.screenshot = file;
        previewUrl.value = URL.createObjectURL(file);
      }
    };
    const removeScreenshot = () => {
      form.screenshot = null;
      previewUrl.value = null;
    };
    const submitFeedback = () => {
      if (form.processing || !isValid.value) return;
      form.post("/feedback", {
        forceFormData: true,
        onSuccess: () => {
          form.reset();
          previewUrl.value = null;
          toast.add({ severity: "success", summary: t("feedback.successMessage"), life: 3e3 });
        }
      });
    };
    const typeIcon = (type) => {
      const map = { feedback: "💬", feature_request: "💡", bug_report: "🐛" };
      return map[type] || "💬";
    };
    const typeIconBg = (type) => {
      const map = {
        feedback: "bg-info/15",
        feature_request: "bg-warning/15",
        bug_report: "bg-error/15"
      };
      return map[type] || "bg-base-200";
    };
    const statusBadgeClass = (status) => {
      const map = {
        pending: "badge-warning",
        reviewed: "badge-info",
        resolved: "badge-success",
        closed: "badge-ghost"
      };
      return map[status] || "badge-ghost";
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      const day = d.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return `${day} ${months[d.getMonth()]}`;
    };
    onMounted(() => {
      var _a;
      if ((_a = page.props.flash) == null ? void 0 : _a.success) {
        toast.add({ severity: "success", summary: page.props.flash.success, life: 3e3 });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: unref(t)("feedback.title")
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="bg-gradient-to-br from-info/10 to-info/5 rounded-2xl p-5 text-center"${_scopeId}><div class="inline-flex items-center justify-center w-16 h-16 bg-info/10 rounded-2xl mb-3"${_scopeId}><span class="text-3xl"${_scopeId}>💬</span></div><div class="text-lg font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(unref(t)("feedback.title"))}</div><p class="text-xs text-base-content/50 m-0 mt-1"${_scopeId}>${ssrInterpolate(unref(t)("feedback.subtitle"))}</p></div><div class="grid grid-cols-3 gap-2"${_scopeId}><!--[-->`);
            ssrRenderList(types, (tp) => {
              _push2(`<button class="${ssrRenderClass([unref(form).type === tp.key ? tp.color + " scale-[1.02]" : "bg-base-100 border-base-300 hover:border-base-content/20", "rounded-xl border-2 p-3 text-center cursor-pointer transition-all active:scale-[0.97]"])}"${_scopeId}><span class="text-2xl block mb-1"${_scopeId}>${ssrInterpolate(tp.icon)}</span><span class="text-[10px] font-semibold text-base-content"${_scopeId}>${ssrInterpolate(unref(t)("feedback.type_" + tp.key))}</span></button>`);
            });
            _push2(`<!--]--></div><div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"${_scopeId}><div${_scopeId}><label class="text-xs font-semibold text-base-content mb-1 block"${_scopeId}>${ssrInterpolate(unref(t)("feedback.subject"))} *</label><input${ssrRenderAttr("value", unref(form).subject)} type="text" class="input input-bordered input-sm w-full"${ssrRenderAttr("placeholder", subjectPlaceholder.value)} maxlength="255"${_scopeId}>`);
            if (unref(form).errors.subject) {
              _push2(`<p class="text-[10px] text-error mt-0.5 m-0"${_scopeId}>${ssrInterpolate(unref(form).errors.subject)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="text-xs font-semibold text-base-content mb-1 block"${_scopeId}>${ssrInterpolate(unref(t)("feedback.description"))} *</label><textarea rows="5" class="textarea textarea-bordered w-full text-sm"${ssrRenderAttr("placeholder", descriptionPlaceholder.value)} maxlength="5000"${_scopeId}>${ssrInterpolate(unref(form).description)}</textarea><div class="flex items-center justify-between mt-0.5"${_scopeId}>`);
            if (unref(form).errors.description) {
              _push2(`<p class="text-[10px] text-error m-0"${_scopeId}>${ssrInterpolate(unref(form).errors.description)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="text-[10px] text-base-content/40 ml-auto"${_scopeId}>${ssrInterpolate(unref(form).description.length)}/5000</span></div></div><div${_scopeId}><div class="flex items-center justify-between mb-1"${_scopeId}><label class="text-xs font-semibold text-base-content"${_scopeId}>${ssrInterpolate(unref(t)("feedback.screenshot"))}</label><span class="text-[10px] text-base-content/40"${_scopeId}>${ssrInterpolate(unref(t)("feedback.optional"))}</span></div><input type="file" accept="image/*" class="file-input file-input-bordered file-input-sm w-full"${_scopeId}>`);
            if (previewUrl.value) {
              _push2(`<div class="mt-2 relative inline-block"${_scopeId}><img${ssrRenderAttr("src", previewUrl.value)} class="w-32 h-32 object-cover rounded-lg border border-base-300"${_scopeId}><button class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-error text-white text-[10px] flex items-center justify-center border-0 cursor-pointer"${_scopeId}>×</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (unref(form).errors.screenshot) {
              _push2(`<p class="text-[10px] text-error mt-0.5 m-0"${_scopeId}>${ssrInterpolate(unref(form).errors.screenshot)}</p>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><button${ssrIncludeBooleanAttr(unref(form).processing || !isValid.value) ? " disabled" : ""} class="w-full h-10 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all active:scale-[0.98] bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"${_scopeId}>`);
            if (unref(form).processing) {
              _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(form).processing ? unref(t)("feedback.submitting") : unref(t)("feedback.submit"))}</button></div>`);
            if (__props.myFeedbacks.length > 0) {
              _push2(`<div class="space-y-2"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>${ssrInterpolate(unref(t)("feedback.mySubmissions"))}</div><!--[-->`);
              ssrRenderList(__props.myFeedbacks, (fb) => {
                var _a, _b;
                _push2(`<div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden"${_scopeId}><div class="p-3 flex items-center gap-3 cursor-pointer hover:bg-base-200/50 transition-colors"${_scopeId}><div class="${ssrRenderClass([typeIconBg(fb.type), "w-8 h-8 rounded-lg flex items-center justify-center shrink-0"])}"${_scopeId}><span class="text-sm"${_scopeId}>${ssrInterpolate(typeIcon(fb.type))}</span></div><div class="flex-1 min-w-0"${_scopeId}><div class="text-xs font-bold text-base-content truncate"${_scopeId}>${ssrInterpolate(fb.subject)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate(formatDate(fb.created_at))}</div></div><span class="${ssrRenderClass([statusBadgeClass(fb.status), "badge badge-xs"])}"${_scopeId}>${ssrInterpolate(unref(t)("feedback.status_" + fb.status))}</span>`);
                if ((_a = fb.replies) == null ? void 0 : _a.length) {
                  _push2(`<span class="text-[9px] text-primary font-bold"${_scopeId}>${ssrInterpolate(fb.replies.length)} ตอบกลับ</span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<svg class="${ssrRenderClass([{ "rotate-180": expandedId.value === fb.id }, "w-3 h-3 text-base-content/30 transition-transform shrink-0"])}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"${_scopeId}></path></svg></div>`);
                if (expandedId.value === fb.id) {
                  _push2(`<div class="border-t border-base-200 p-3 space-y-2 bg-base-200/30"${_scopeId}><div class="bg-base-100 rounded-lg p-2.5"${_scopeId}><p class="text-xs text-base-content/80 m-0 whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(fb.description)}</p></div>`);
                  if (((_b = fb.replies) == null ? void 0 : _b.length) > 0) {
                    _push2(`<div class="space-y-1.5"${_scopeId}><!--[-->`);
                    ssrRenderList(fb.replies, (reply) => {
                      var _a2;
                      _push2(`<div class="${ssrRenderClass([reply.is_admin ? "bg-primary/10 ml-4" : "bg-base-100", "rounded-lg p-2.5 flex items-start gap-2"])}"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-1.5"${_scopeId}>`);
                      if (reply.is_admin) {
                        _push2(`<span class="px-1 py-0.5 rounded text-[8px] font-bold bg-primary/20 text-primary"${_scopeId}>ADMIN</span>`);
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(`<span class="text-[10px] font-bold text-base-content"${_scopeId}>${ssrInterpolate((_a2 = reply.user) == null ? void 0 : _a2.name)}</span><span class="text-[9px] text-base-content/30"${_scopeId}>${ssrInterpolate(formatDate(reply.created_at))}</span></div><p class="text-xs text-base-content/80 m-0 mt-0.5 whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(reply.message)}</p></div></div>`);
                    });
                    _push2(`<!--]--></div>`);
                  } else {
                    _push2(`<div class="text-center py-2"${_scopeId}><span class="text-[10px] text-base-content/40"${_scopeId}>ยังไม่มีการตอบกลับ</span></div>`);
                  }
                  _push2(`</div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "bg-gradient-to-br from-info/10 to-info/5 rounded-2xl p-5 text-center" }, [
                  createVNode("div", { class: "inline-flex items-center justify-center w-16 h-16 bg-info/10 rounded-2xl mb-3" }, [
                    createVNode("span", { class: "text-3xl" }, "💬")
                  ]),
                  createVNode("div", { class: "text-lg font-bold text-base-content m-0" }, toDisplayString(unref(t)("feedback.title")), 1),
                  createVNode("p", { class: "text-xs text-base-content/50 m-0 mt-1" }, toDisplayString(unref(t)("feedback.subtitle")), 1)
                ]),
                createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(types, (tp) => {
                    return createVNode("button", {
                      key: tp.key,
                      onClick: ($event) => unref(form).type = tp.key,
                      class: ["rounded-xl border-2 p-3 text-center cursor-pointer transition-all active:scale-[0.97]", unref(form).type === tp.key ? tp.color + " scale-[1.02]" : "bg-base-100 border-base-300 hover:border-base-content/20"]
                    }, [
                      createVNode("span", { class: "text-2xl block mb-1" }, toDisplayString(tp.icon), 1),
                      createVNode("span", { class: "text-[10px] font-semibold text-base-content" }, toDisplayString(unref(t)("feedback.type_" + tp.key)), 1)
                    ], 10, ["onClick"]);
                  }), 64))
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4 space-y-3" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "text-xs font-semibold text-base-content mb-1 block" }, toDisplayString(unref(t)("feedback.subject")) + " *", 1),
                    withDirectives(createVNode("input", {
                      "onUpdate:modelValue": ($event) => unref(form).subject = $event,
                      type: "text",
                      class: "input input-bordered input-sm w-full",
                      placeholder: subjectPlaceholder.value,
                      maxlength: "255"
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(form).subject]
                    ]),
                    unref(form).errors.subject ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-[10px] text-error mt-0.5 m-0"
                    }, toDisplayString(unref(form).errors.subject), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "text-xs font-semibold text-base-content mb-1 block" }, toDisplayString(unref(t)("feedback.description")) + " *", 1),
                    withDirectives(createVNode("textarea", {
                      "onUpdate:modelValue": ($event) => unref(form).description = $event,
                      rows: "5",
                      class: "textarea textarea-bordered w-full text-sm",
                      placeholder: descriptionPlaceholder.value,
                      maxlength: "5000"
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, unref(form).description]
                    ]),
                    createVNode("div", { class: "flex items-center justify-between mt-0.5" }, [
                      unref(form).errors.description ? (openBlock(), createBlock("p", {
                        key: 0,
                        class: "text-[10px] text-error m-0"
                      }, toDisplayString(unref(form).errors.description), 1)) : createCommentVNode("", true),
                      createVNode("span", { class: "text-[10px] text-base-content/40 ml-auto" }, toDisplayString(unref(form).description.length) + "/5000", 1)
                    ])
                  ]),
                  createVNode("div", null, [
                    createVNode("div", { class: "flex items-center justify-between mb-1" }, [
                      createVNode("label", { class: "text-xs font-semibold text-base-content" }, toDisplayString(unref(t)("feedback.screenshot")), 1),
                      createVNode("span", { class: "text-[10px] text-base-content/40" }, toDisplayString(unref(t)("feedback.optional")), 1)
                    ]),
                    createVNode("input", {
                      type: "file",
                      accept: "image/*",
                      class: "file-input file-input-bordered file-input-sm w-full",
                      onChange: onFileChange
                    }, null, 32),
                    previewUrl.value ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-2 relative inline-block"
                    }, [
                      createVNode("img", {
                        src: previewUrl.value,
                        class: "w-32 h-32 object-cover rounded-lg border border-base-300"
                      }, null, 8, ["src"]),
                      createVNode("button", {
                        onClick: removeScreenshot,
                        class: "absolute -top-2 -right-2 w-5 h-5 rounded-full bg-error text-white text-[10px] flex items-center justify-center border-0 cursor-pointer"
                      }, "×")
                    ])) : createCommentVNode("", true),
                    unref(form).errors.screenshot ? (openBlock(), createBlock("p", {
                      key: 1,
                      class: "text-[10px] text-error mt-0.5 m-0"
                    }, toDisplayString(unref(form).errors.screenshot), 1)) : createCommentVNode("", true)
                  ]),
                  createVNode("button", {
                    onClick: submitFeedback,
                    disabled: unref(form).processing || !isValid.value,
                    class: "w-full h-10 rounded-xl text-sm font-semibold border-0 cursor-pointer transition-all active:scale-[0.98] bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  }, [
                    unref(form).processing ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "loading loading-spinner loading-xs"
                    })) : createCommentVNode("", true),
                    createTextVNode(" " + toDisplayString(unref(form).processing ? unref(t)("feedback.submitting") : unref(t)("feedback.submit")), 1)
                  ], 8, ["disabled"])
                ]),
                __props.myFeedbacks.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-2"
                }, [
                  createVNode("div", { class: "text-sm font-bold text-base-content" }, toDisplayString(unref(t)("feedback.mySubmissions")), 1),
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.myFeedbacks, (fb) => {
                    var _a, _b;
                    return openBlock(), createBlock("div", {
                      key: fb.id,
                      class: "bg-base-100 rounded-xl border border-base-300 overflow-hidden"
                    }, [
                      createVNode("div", {
                        class: "p-3 flex items-center gap-3 cursor-pointer hover:bg-base-200/50 transition-colors",
                        onClick: ($event) => toggleExpand(fb.id)
                      }, [
                        createVNode("div", {
                          class: ["w-8 h-8 rounded-lg flex items-center justify-center shrink-0", typeIconBg(fb.type)]
                        }, [
                          createVNode("span", { class: "text-sm" }, toDisplayString(typeIcon(fb.type)), 1)
                        ], 2),
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "text-xs font-bold text-base-content truncate" }, toDisplayString(fb.subject), 1),
                          createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString(formatDate(fb.created_at)), 1)
                        ]),
                        createVNode("span", {
                          class: ["badge badge-xs", statusBadgeClass(fb.status)]
                        }, toDisplayString(unref(t)("feedback.status_" + fb.status)), 3),
                        ((_a = fb.replies) == null ? void 0 : _a.length) ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "text-[9px] text-primary font-bold"
                        }, toDisplayString(fb.replies.length) + " ตอบกลับ", 1)) : createCommentVNode("", true),
                        (openBlock(), createBlock("svg", {
                          class: ["w-3 h-3 text-base-content/30 transition-transform shrink-0", { "rotate-180": expandedId.value === fb.id }],
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M19 9l-7 7-7-7"
                          })
                        ], 2))
                      ], 8, ["onClick"]),
                      expandedId.value === fb.id ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "border-t border-base-200 p-3 space-y-2 bg-base-200/30"
                      }, [
                        createVNode("div", { class: "bg-base-100 rounded-lg p-2.5" }, [
                          createVNode("p", { class: "text-xs text-base-content/80 m-0 whitespace-pre-wrap" }, toDisplayString(fb.description), 1)
                        ]),
                        ((_b = fb.replies) == null ? void 0 : _b.length) > 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "space-y-1.5"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(fb.replies, (reply) => {
                            var _a2;
                            return openBlock(), createBlock("div", {
                              key: reply.id,
                              class: ["rounded-lg p-2.5 flex items-start gap-2", reply.is_admin ? "bg-primary/10 ml-4" : "bg-base-100"]
                            }, [
                              createVNode("div", { class: "flex-1 min-w-0" }, [
                                createVNode("div", { class: "flex items-center gap-1.5" }, [
                                  reply.is_admin ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "px-1 py-0.5 rounded text-[8px] font-bold bg-primary/20 text-primary"
                                  }, "ADMIN")) : createCommentVNode("", true),
                                  createVNode("span", { class: "text-[10px] font-bold text-base-content" }, toDisplayString((_a2 = reply.user) == null ? void 0 : _a2.name), 1),
                                  createVNode("span", { class: "text-[9px] text-base-content/30" }, toDisplayString(formatDate(reply.created_at)), 1)
                                ]),
                                createVNode("p", { class: "text-xs text-base-content/80 m-0 mt-0.5 whitespace-pre-wrap" }, toDisplayString(reply.message), 1)
                              ])
                            ], 2);
                          }), 128))
                        ])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "text-center py-2"
                        }, [
                          createVNode("span", { class: "text-[10px] text-base-content/40" }, "ยังไม่มีการตอบกลับ")
                        ]))
                      ])) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Feedback.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
