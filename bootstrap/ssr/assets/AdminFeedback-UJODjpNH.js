import { ref, computed, onMounted, unref, withCtx, createBlock, openBlock, createVNode, toDisplayString, Fragment, renderList, createTextVNode, createCommentVNode, withDirectives, withModifiers, vModelText, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-j6iBrT39.js";
import { _ as _sfc_main$2 } from "./UserAvatar-Dwoh2ac-.js";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./useLocale-QwrDLuQY.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "AdminFeedback",
  __ssrInlineRender: true,
  props: {
    feedbacks: { type: Array, default: () => [] }
  },
  setup(__props) {
    const toast = useToast();
    const page = usePage();
    const props = __props;
    const activeFilter = ref("all");
    const filters = [
      { key: "all", label: "ทั้งหมด" },
      { key: "pending", label: "รอตรวจสอบ" },
      { key: "reviewed", label: "พิจารณา" },
      { key: "resolved", label: "แก้ไขแล้ว" },
      { key: "closed", label: "ปิดแล้ว" }
    ];
    const filteredFeedbacks = computed(() => {
      if (activeFilter.value === "all") return props.feedbacks;
      return props.feedbacks.filter((fb) => fb.status === activeFilter.value);
    });
    const typeIcon = (type) => {
      const map = { feedback: "💬", feature_request: "💡", bug_report: "🐛" };
      return map[type] || "💬";
    };
    const typeLabel = (type) => {
      const map = { feedback: "ข้อเสนอแนะ", feature_request: "ขอฟีเจอร์", bug_report: "แจ้งปัญหา" };
      return map[type] || type;
    };
    const typeBadgeClass = (type) => {
      const map = { feedback: "bg-info/15 text-info", feature_request: "bg-warning/15 text-warning", bug_report: "bg-error/15 text-error" };
      return map[type] || "bg-base-200 text-base-content/60";
    };
    const statusBadgeClass = (status) => {
      const map = { pending: "badge-warning", reviewed: "badge-info", resolved: "badge-success", closed: "badge-ghost" };
      return map[status] || "badge-ghost";
    };
    const statusLabel = (status) => {
      const map = { pending: "รอตรวจสอบ", reviewed: "กำลังพิจารณา", resolved: "แก้ไขแล้ว", closed: "ปิดแล้ว" };
      return map[status] || status;
    };
    const statuses = ["pending", "reviewed", "resolved", "closed"];
    const updateStatus = (feedbackId, newStatus) => {
      router.patch(`/admin/feedbacks/${feedbackId}/status`, { status: newStatus }, {
        preserveScroll: true,
        onSuccess: () => {
          toast.add({ severity: "success", summary: "อัพเดทสถานะ + แจ้ง LINE เรียบร้อย", life: 2e3 });
        }
      });
    };
    const replyText = ref({});
    const replySubmitting = ref({});
    const submitReply = (feedbackId) => {
      var _a;
      const msg = (_a = replyText.value[feedbackId]) == null ? void 0 : _a.trim();
      if (!msg || replySubmitting.value[feedbackId]) return;
      replySubmitting.value[feedbackId] = true;
      router.post(`/admin/feedbacks/${feedbackId}/reply`, { message: msg }, {
        preserveScroll: true,
        onSuccess: () => {
          replyText.value[feedbackId] = "";
          toast.add({ severity: "success", summary: "ตอบกลับ + แจ้ง LINE เรียบร้อย", life: 2e3 });
        },
        onFinish: () => {
          replySubmitting.value[feedbackId] = false;
        }
      });
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "-";
      const d = new Date(dateStr);
      const day = d.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      return `${day} ${months[d.getMonth()]} ${hours}:${mins}`;
    };
    const expandedId = ref(null);
    const toggleExpand = (id) => {
      expandedId.value = expandedId.value === id ? null : id;
    };
    onMounted(() => {
      var _a;
      if ((_a = page.props.flash) == null ? void 0 : _a.success) {
        toast.add({ severity: "success", summary: page.props.flash.success, life: 3e3 });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "Admin - Feedback" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin",
              class: "w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center no-underline hover:bg-base-300 transition-colors"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-4 h-4 text-base-content/60" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"${_scopeId2}></path></svg>`);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4 text-base-content/60",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      viewBox: "0 0 24 24"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        d: "M15 19l-7-7 7-7"
                      })
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div${_scopeId}><div class="text-lg font-bold text-base-content m-0"${_scopeId}>ข้อเสนอแนะทั้งหมด</div><p class="text-xs text-base-content/50 m-0"${_scopeId}>${ssrInterpolate(__props.feedbacks.length)} รายการ</p></div></div><div class="flex gap-1 overflow-x-auto pb-1"${_scopeId}><!--[-->`);
            ssrRenderList(filters, (f) => {
              _push2(`<button class="${ssrRenderClass([activeFilter.value === f.key ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300", "px-3 py-1.5 rounded-lg text-[11px] font-semibold border-0 cursor-pointer transition-all whitespace-nowrap shrink-0"])}"${_scopeId}>${ssrInterpolate(f.label)} `);
              if (f.key !== "all") {
                _push2(`<span class="ml-0.5 opacity-70"${_scopeId}> (${ssrInterpolate(__props.feedbacks.filter((fb) => fb.status === f.key).length)}) </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</button>`);
            });
            _push2(`<!--]--></div>`);
            if (filteredFeedbacks.value.length > 0) {
              _push2(`<div class="space-y-2"${_scopeId}><!--[-->`);
              ssrRenderList(filteredFeedbacks.value, (fb) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                _push2(`<div class="bg-base-100 rounded-xl border border-base-300 overflow-hidden"${_scopeId}><div class="p-3 cursor-pointer hover:bg-base-200/50 transition-colors"${_scopeId}><div class="flex items-start gap-3"${_scopeId}><span class="text-lg mt-0.5"${_scopeId}>${ssrInterpolate(typeIcon(fb.type))}</span><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-1.5 mb-0.5"${_scopeId}><span class="text-xs font-bold text-base-content truncate"${_scopeId}>${ssrInterpolate(fb.subject)}</span></div><div class="flex items-center gap-2 flex-wrap"${_scopeId}><span class="${ssrRenderClass([typeBadgeClass(fb.type), "px-1.5 py-0.5 rounded text-[9px] font-bold"])}"${_scopeId}>${ssrInterpolate(typeLabel(fb.type))}</span><span class="${ssrRenderClass([statusBadgeClass(fb.status), "badge badge-xs"])}"${_scopeId}>${ssrInterpolate(statusLabel(fb.status))}</span><span class="text-[10px] text-base-content/40"${_scopeId}>${ssrInterpolate(formatDate(fb.created_at))}</span></div></div><div class="flex items-center gap-2 shrink-0"${_scopeId}>`);
                _push2(ssrRenderComponent(_sfc_main$2, {
                  src: (_a = fb.user) == null ? void 0 : _a.avatar,
                  name: (_b = fb.user) == null ? void 0 : _b.name,
                  size: "xs",
                  rounded: "full"
                }, null, _parent2, _scopeId));
                _push2(`<svg class="${ssrRenderClass([{ "rotate-180": expandedId.value === fb.id }, "w-3 h-3 text-base-content/30 transition-transform"])}" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"${_scopeId}></path></svg></div></div></div>`);
                if (expandedId.value === fb.id) {
                  _push2(`<div class="border-t border-base-200 p-3 space-y-3 bg-base-200/30"${_scopeId}><div class="flex items-center gap-2"${_scopeId}>`);
                  _push2(ssrRenderComponent(_sfc_main$2, {
                    src: (_c = fb.user) == null ? void 0 : _c.avatar,
                    name: (_d = fb.user) == null ? void 0 : _d.name,
                    size: "sm",
                    rounded: "full"
                  }, null, _parent2, _scopeId));
                  _push2(`<div${_scopeId}><div class="text-xs font-bold text-base-content"${_scopeId}>${ssrInterpolate((_e = fb.user) == null ? void 0 : _e.name)}</div><div class="text-[10px] text-base-content/40"${_scopeId}>${ssrInterpolate((_f = fb.user) == null ? void 0 : _f.email)}</div></div></div><div class="bg-base-100 rounded-lg p-3"${_scopeId}><div class="text-[10px] font-semibold text-base-content/50 mb-1 uppercase"${_scopeId}>รายละเอียด</div><p class="text-xs text-base-content m-0 whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(fb.description)}</p></div>`);
                  if (fb.screenshot_path) {
                    _push2(`<div class="bg-base-100 rounded-lg p-3"${_scopeId}><div class="text-[10px] font-semibold text-base-content/50 mb-1 uppercase"${_scopeId}>ภาพหน้าจอ</div><img${ssrRenderAttr("src", "/storage/" + fb.screenshot_path)} class="max-w-full rounded-lg border border-base-300"${_scopeId}></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  if (((_g = fb.replies) == null ? void 0 : _g.length) > 0) {
                    _push2(`<div${_scopeId}><div class="text-[10px] font-semibold text-base-content/50 mb-1.5 uppercase"${_scopeId}>การสนทนา (${ssrInterpolate(fb.replies.length)})</div><div class="space-y-2"${_scopeId}><!--[-->`);
                    ssrRenderList(fb.replies, (reply) => {
                      var _a2, _b2, _c2;
                      _push2(`<div class="${ssrRenderClass([reply.is_admin ? "bg-primary/10 ml-4" : "bg-base-100 mr-4", "rounded-lg p-2.5 flex items-start gap-2"])}"${_scopeId}>`);
                      _push2(ssrRenderComponent(_sfc_main$2, {
                        src: (_a2 = reply.user) == null ? void 0 : _a2.avatar,
                        name: (_b2 = reply.user) == null ? void 0 : _b2.name,
                        size: "xs",
                        rounded: "full",
                        class: "mt-0.5"
                      }, null, _parent2, _scopeId));
                      _push2(`<div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-1.5"${_scopeId}><span class="text-[10px] font-bold text-base-content"${_scopeId}>${ssrInterpolate((_c2 = reply.user) == null ? void 0 : _c2.name)}</span>`);
                      if (reply.is_admin) {
                        _push2(`<span class="px-1 py-0.5 rounded text-[8px] font-bold bg-primary/20 text-primary"${_scopeId}>ADMIN</span>`);
                      } else {
                        _push2(`<!---->`);
                      }
                      _push2(`<span class="text-[9px] text-base-content/30"${_scopeId}>${ssrInterpolate(formatDate(reply.created_at))}</span></div><p class="text-xs text-base-content/80 m-0 mt-0.5 whitespace-pre-wrap"${_scopeId}>${ssrInterpolate(reply.message)}</p></div></div>`);
                    });
                    _push2(`<!--]--></div></div>`);
                  } else {
                    _push2(`<!---->`);
                  }
                  _push2(`<div class="bg-base-100 rounded-lg p-3"${_scopeId}><div class="text-[10px] font-semibold text-base-content/50 mb-1.5 uppercase"${_scopeId}>ตอบกลับ</div><div class="flex gap-2"${_scopeId}><textarea rows="2" class="textarea textarea-bordered textarea-sm flex-1 text-xs" placeholder="พิมพ์คำตอบ..." maxlength="2000"${_scopeId}>${ssrInterpolate(replyText.value[fb.id])}</textarea><button${ssrIncludeBooleanAttr(!((_h = replyText.value[fb.id]) == null ? void 0 : _h.trim()) || replySubmitting.value[fb.id]) ? " disabled" : ""} class="self-end h-8 px-3 rounded-lg text-[10px] font-semibold border-0 cursor-pointer bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.97] shrink-0"${_scopeId}>`);
                  if (replySubmitting.value[fb.id]) {
                    _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
                  } else {
                    _push2(`<span${_scopeId}>ส่ง</span>`);
                  }
                  _push2(`</button></div><div class="text-[9px] text-base-content/30 mt-1"${_scopeId}>จะส่ง LINE แจ้งผู้ใช้อัตโนมัติ</div></div><div${_scopeId}><div class="text-[10px] font-semibold text-base-content/50 mb-1.5 uppercase"${_scopeId}>เปลี่ยนสถานะ</div><div class="flex gap-1.5 flex-wrap"${_scopeId}><!--[-->`);
                  ssrRenderList(statuses, (s) => {
                    _push2(`<button class="${ssrRenderClass([fb.status === s ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300", "px-2.5 py-1 rounded-lg text-[10px] font-semibold border-0 cursor-pointer transition-all active:scale-[0.97]"])}"${_scopeId}>${ssrInterpolate(statusLabel(s))}</button>`);
                  });
                  _push2(`<!--]--></div><div class="text-[9px] text-base-content/30 mt-1"${_scopeId}>จะส่ง LINE แจ้งผู้ใช้อัตโนมัติ</div></div></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`</div>`);
              });
              _push2(`<!--]--></div>`);
            } else {
              _push2(`<div class="text-center py-12 bg-base-100 rounded-xl border border-base-300"${_scopeId}><span class="text-3xl"${_scopeId}>📭</span><p class="text-xs text-base-content/50 mt-2 m-0"${_scopeId}>ไม่มีข้อเสนอแนะในหมวดนี้</p></div>`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "flex items-center gap-3" }, [
                  createVNode(unref(Link), {
                    href: "/admin",
                    class: "w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center no-underline hover:bg-base-300 transition-colors"
                  }, {
                    default: withCtx(() => [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4 text-base-content/60",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M15 19l-7-7 7-7"
                        })
                      ]))
                    ]),
                    _: 1
                  }),
                  createVNode("div", null, [
                    createVNode("div", { class: "text-lg font-bold text-base-content m-0" }, "ข้อเสนอแนะทั้งหมด"),
                    createVNode("p", { class: "text-xs text-base-content/50 m-0" }, toDisplayString(__props.feedbacks.length) + " รายการ", 1)
                  ])
                ]),
                createVNode("div", { class: "flex gap-1 overflow-x-auto pb-1" }, [
                  (openBlock(), createBlock(Fragment, null, renderList(filters, (f) => {
                    return createVNode("button", {
                      key: f.key,
                      onClick: ($event) => activeFilter.value = f.key,
                      class: ["px-3 py-1.5 rounded-lg text-[11px] font-semibold border-0 cursor-pointer transition-all whitespace-nowrap shrink-0", activeFilter.value === f.key ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300"]
                    }, [
                      createTextVNode(toDisplayString(f.label) + " ", 1),
                      f.key !== "all" ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "ml-0.5 opacity-70"
                      }, " (" + toDisplayString(__props.feedbacks.filter((fb) => fb.status === f.key).length) + ") ", 1)) : createCommentVNode("", true)
                    ], 10, ["onClick"]);
                  }), 64))
                ]),
                filteredFeedbacks.value.length > 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "space-y-2"
                }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(filteredFeedbacks.value, (fb) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return openBlock(), createBlock("div", {
                      key: fb.id,
                      class: "bg-base-100 rounded-xl border border-base-300 overflow-hidden"
                    }, [
                      createVNode("div", {
                        class: "p-3 cursor-pointer hover:bg-base-200/50 transition-colors",
                        onClick: ($event) => toggleExpand(fb.id)
                      }, [
                        createVNode("div", { class: "flex items-start gap-3" }, [
                          createVNode("span", { class: "text-lg mt-0.5" }, toDisplayString(typeIcon(fb.type)), 1),
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("div", { class: "flex items-center gap-1.5 mb-0.5" }, [
                              createVNode("span", { class: "text-xs font-bold text-base-content truncate" }, toDisplayString(fb.subject), 1)
                            ]),
                            createVNode("div", { class: "flex items-center gap-2 flex-wrap" }, [
                              createVNode("span", {
                                class: ["px-1.5 py-0.5 rounded text-[9px] font-bold", typeBadgeClass(fb.type)]
                              }, toDisplayString(typeLabel(fb.type)), 3),
                              createVNode("span", {
                                class: ["badge badge-xs", statusBadgeClass(fb.status)]
                              }, toDisplayString(statusLabel(fb.status)), 3),
                              createVNode("span", { class: "text-[10px] text-base-content/40" }, toDisplayString(formatDate(fb.created_at)), 1)
                            ])
                          ]),
                          createVNode("div", { class: "flex items-center gap-2 shrink-0" }, [
                            createVNode(_sfc_main$2, {
                              src: (_a = fb.user) == null ? void 0 : _a.avatar,
                              name: (_b = fb.user) == null ? void 0 : _b.name,
                              size: "xs",
                              rounded: "full"
                            }, null, 8, ["src", "name"]),
                            (openBlock(), createBlock("svg", {
                              class: ["w-3 h-3 text-base-content/30 transition-transform", { "rotate-180": expandedId.value === fb.id }],
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
                          ])
                        ])
                      ], 8, ["onClick"]),
                      expandedId.value === fb.id ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "border-t border-base-200 p-3 space-y-3 bg-base-200/30"
                      }, [
                        createVNode("div", { class: "flex items-center gap-2" }, [
                          createVNode(_sfc_main$2, {
                            src: (_c = fb.user) == null ? void 0 : _c.avatar,
                            name: (_d = fb.user) == null ? void 0 : _d.name,
                            size: "sm",
                            rounded: "full"
                          }, null, 8, ["src", "name"]),
                          createVNode("div", null, [
                            createVNode("div", { class: "text-xs font-bold text-base-content" }, toDisplayString((_e = fb.user) == null ? void 0 : _e.name), 1),
                            createVNode("div", { class: "text-[10px] text-base-content/40" }, toDisplayString((_f = fb.user) == null ? void 0 : _f.email), 1)
                          ])
                        ]),
                        createVNode("div", { class: "bg-base-100 rounded-lg p-3" }, [
                          createVNode("div", { class: "text-[10px] font-semibold text-base-content/50 mb-1 uppercase" }, "รายละเอียด"),
                          createVNode("p", { class: "text-xs text-base-content m-0 whitespace-pre-wrap" }, toDisplayString(fb.description), 1)
                        ]),
                        fb.screenshot_path ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "bg-base-100 rounded-lg p-3"
                        }, [
                          createVNode("div", { class: "text-[10px] font-semibold text-base-content/50 mb-1 uppercase" }, "ภาพหน้าจอ"),
                          createVNode("img", {
                            src: "/storage/" + fb.screenshot_path,
                            class: "max-w-full rounded-lg border border-base-300"
                          }, null, 8, ["src"])
                        ])) : createCommentVNode("", true),
                        ((_g = fb.replies) == null ? void 0 : _g.length) > 0 ? (openBlock(), createBlock("div", { key: 1 }, [
                          createVNode("div", { class: "text-[10px] font-semibold text-base-content/50 mb-1.5 uppercase" }, "การสนทนา (" + toDisplayString(fb.replies.length) + ")", 1),
                          createVNode("div", { class: "space-y-2" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(fb.replies, (reply) => {
                              var _a2, _b2, _c2;
                              return openBlock(), createBlock("div", {
                                key: reply.id,
                                class: ["rounded-lg p-2.5 flex items-start gap-2", reply.is_admin ? "bg-primary/10 ml-4" : "bg-base-100 mr-4"]
                              }, [
                                createVNode(_sfc_main$2, {
                                  src: (_a2 = reply.user) == null ? void 0 : _a2.avatar,
                                  name: (_b2 = reply.user) == null ? void 0 : _b2.name,
                                  size: "xs",
                                  rounded: "full",
                                  class: "mt-0.5"
                                }, null, 8, ["src", "name"]),
                                createVNode("div", { class: "flex-1 min-w-0" }, [
                                  createVNode("div", { class: "flex items-center gap-1.5" }, [
                                    createVNode("span", { class: "text-[10px] font-bold text-base-content" }, toDisplayString((_c2 = reply.user) == null ? void 0 : _c2.name), 1),
                                    reply.is_admin ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "px-1 py-0.5 rounded text-[8px] font-bold bg-primary/20 text-primary"
                                    }, "ADMIN")) : createCommentVNode("", true),
                                    createVNode("span", { class: "text-[9px] text-base-content/30" }, toDisplayString(formatDate(reply.created_at)), 1)
                                  ]),
                                  createVNode("p", { class: "text-xs text-base-content/80 m-0 mt-0.5 whitespace-pre-wrap" }, toDisplayString(reply.message), 1)
                                ])
                              ], 2);
                            }), 128))
                          ])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "bg-base-100 rounded-lg p-3" }, [
                          createVNode("div", { class: "text-[10px] font-semibold text-base-content/50 mb-1.5 uppercase" }, "ตอบกลับ"),
                          createVNode("div", { class: "flex gap-2" }, [
                            withDirectives(createVNode("textarea", {
                              "onUpdate:modelValue": ($event) => replyText.value[fb.id] = $event,
                              rows: "2",
                              class: "textarea textarea-bordered textarea-sm flex-1 text-xs",
                              placeholder: "พิมพ์คำตอบ...",
                              maxlength: "2000",
                              onClick: withModifiers(() => {
                              }, ["stop"])
                            }, null, 8, ["onUpdate:modelValue", "onClick"]), [
                              [vModelText, replyText.value[fb.id]]
                            ]),
                            createVNode("button", {
                              onClick: withModifiers(($event) => submitReply(fb.id), ["stop"]),
                              disabled: !((_h = replyText.value[fb.id]) == null ? void 0 : _h.trim()) || replySubmitting.value[fb.id],
                              class: "self-end h-8 px-3 rounded-lg text-[10px] font-semibold border-0 cursor-pointer bg-primary text-white hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.97] shrink-0"
                            }, [
                              replySubmitting.value[fb.id] ? (openBlock(), createBlock("span", {
                                key: 0,
                                class: "loading loading-spinner loading-xs"
                              })) : (openBlock(), createBlock("span", { key: 1 }, "ส่ง"))
                            ], 8, ["onClick", "disabled"])
                          ]),
                          createVNode("div", { class: "text-[9px] text-base-content/30 mt-1" }, "จะส่ง LINE แจ้งผู้ใช้อัตโนมัติ")
                        ]),
                        createVNode("div", null, [
                          createVNode("div", { class: "text-[10px] font-semibold text-base-content/50 mb-1.5 uppercase" }, "เปลี่ยนสถานะ"),
                          createVNode("div", { class: "flex gap-1.5 flex-wrap" }, [
                            (openBlock(), createBlock(Fragment, null, renderList(statuses, (s) => {
                              return createVNode("button", {
                                key: s,
                                onClick: withModifiers(($event) => updateStatus(fb.id, s), ["stop"]),
                                class: ["px-2.5 py-1 rounded-lg text-[10px] font-semibold border-0 cursor-pointer transition-all active:scale-[0.97]", fb.status === s ? "bg-primary text-white" : "bg-base-200 text-base-content/60 hover:bg-base-300"]
                              }, toDisplayString(statusLabel(s)), 11, ["onClick"]);
                            }), 64))
                          ]),
                          createVNode("div", { class: "text-[9px] text-base-content/30 mt-1" }, "จะส่ง LINE แจ้งผู้ใช้อัตโนมัติ")
                        ])
                      ])) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "text-center py-12 bg-base-100 rounded-xl border border-base-300"
                }, [
                  createVNode("span", { class: "text-3xl" }, "📭"),
                  createVNode("p", { class: "text-xs text-base-content/50 mt-2 m-0" }, "ไม่มีข้อเสนอแนะในหมวดนี้")
                ]))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/AdminFeedback.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
