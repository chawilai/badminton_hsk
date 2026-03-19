import { ref, reactive, computed, unref, withCtx, createVNode, createBlock, createCommentVNode, toDisplayString, createTextVNode, openBlock, Fragment, renderList, withModifiers, withDirectives, vModelText, vModelSelect, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-DvUwNqCw.js";
import { usePage, Head, router } from "@inertiajs/vue3";
import { u as useLocale } from "./useLocale-gpJrLIKB.js";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import { u as useConfirm } from "./useConfirm-CffLghyV.js";
import axios from "axios";
import "./badmintonLayout-Bmnf0xqT.js";
import "./LocaleSwitcher-BOmG4hBt.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
const _sfc_main = {
  __name: "Courts",
  __ssrInlineRender: true,
  props: {
    courts: { type: Array, default: () => [] }
  },
  setup(__props) {
    const { t } = useLocale();
    const toast = useToast();
    const { confirm } = useConfirm();
    usePage();
    const showDialog = ref(false);
    const editingId = ref(null);
    const submitting = ref(false);
    const form = reactive({
      name: "",
      address: "",
      phone: "",
      field_total: 1,
      court_type: "",
      play_price: "",
      available_for_booking: true
    });
    const errors = ref({});
    const dialogTitle = computed(
      () => editingId.value ? t("courts.editCourt") : t("courts.addCourt")
    );
    const courtTypeOptions = [
      { value: "rubber", labelKey: "courts.rubber" },
      { value: "wood", labelKey: "courts.wood" },
      { value: "synthetic", labelKey: "courts.synthetic" }
    ];
    const courtTypeLabel = (type) => {
      const option = courtTypeOptions.find((o) => o.value === type);
      return option ? t(option.labelKey) : type || "-";
    };
    const openAdd = () => {
      editingId.value = null;
      resetForm();
      errors.value = {};
      showDialog.value = true;
    };
    const openEdit = (court) => {
      editingId.value = court.id;
      form.name = court.name || "";
      form.address = court.address || "";
      form.phone = court.phone || "";
      form.field_total = court.field_total || 1;
      form.court_type = court.court_type || "";
      form.play_price = court.play_price || "";
      form.available_for_booking = court.available_for_booking ?? true;
      errors.value = {};
      showDialog.value = true;
    };
    const closeDialog = () => {
      showDialog.value = false;
      editingId.value = null;
      resetForm();
      errors.value = {};
    };
    const resetForm = () => {
      form.name = "";
      form.address = "";
      form.phone = "";
      form.field_total = 1;
      form.court_type = "";
      form.play_price = "";
      form.available_for_booking = true;
    };
    const validate = () => {
      const errs = {};
      if (!form.name.trim()) {
        errs.name = t("courts.name") + " is required";
      }
      if (form.field_total < 1) {
        errs.field_total = t("courts.fieldTotal") + " min 1";
      }
      errors.value = errs;
      return Object.keys(errs).length === 0;
    };
    const submitForm = async () => {
      var _a, _b, _c, _d, _e;
      if (!validate()) return;
      submitting.value = true;
      const payload = {
        name: form.name,
        address: form.address || null,
        phone: form.phone || null,
        field_total: parseInt(form.field_total) || 1,
        court_type: form.court_type || null,
        play_price: form.play_price ? parseFloat(form.play_price) : null,
        available_for_booking: form.available_for_booking
      };
      try {
        if (editingId.value) {
          await axios.post(`/courts/${editingId.value}/update`, payload);
          toast.add({
            severity: "success",
            summary: t("courts.editCourt"),
            detail: t("common.save"),
            life: 3e3
          });
        } else {
          await axios.post("/courts", payload);
          toast.add({
            severity: "success",
            summary: t("courts.addCourt"),
            detail: t("common.save"),
            life: 3e3
          });
        }
        closeDialog();
        router.reload({ preserveScroll: true, only: ["courts"] });
      } catch (e) {
        if (((_a = e.response) == null ? void 0 : _a.status) === 422 && ((_c = (_b = e.response) == null ? void 0 : _b.data) == null ? void 0 : _c.errors)) {
          errors.value = {};
          Object.entries(e.response.data.errors).forEach(([key, msgs]) => {
            errors.value[key] = msgs[0];
          });
        } else {
          toast.add({
            severity: "error",
            summary: "Error",
            detail: ((_e = (_d = e.response) == null ? void 0 : _d.data) == null ? void 0 : _e.message) || "Something went wrong",
            life: 3e3
          });
        }
      } finally {
        submitting.value = false;
      }
    };
    const deleteCourt = (court) => {
      confirm({
        message: t("courts.deleteConfirm"),
        header: t("common.delete"),
        accept: async () => {
          var _a, _b, _c, _d, _e;
          try {
            await axios.delete(`/courts/${court.id}`);
            toast.add({
              severity: "success",
              summary: t("common.delete"),
              detail: t("common.delete"),
              life: 3e3
            });
            router.reload({ preserveScroll: true, only: ["courts"] });
          } catch (e) {
            const msg = ((_c = (_b = (_a = e.response) == null ? void 0 : _a.data) == null ? void 0 : _b.errors) == null ? void 0 : _c.court) || ((_e = (_d = e.response) == null ? void 0 : _d.data) == null ? void 0 : _e.message) || "Something went wrong";
            toast.add({
              severity: "error",
              summary: "Error",
              detail: msg,
              life: 5e3
            });
          }
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), {
        title: unref(t)("courts.title")
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-4"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><h1 class="text-base font-bold text-base-content m-0"${_scopeId}>${ssrInterpolate(unref(t)("courts.title"))}</h1><button class="btn btn-primary btn-sm gap-1"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"${_scopeId}><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"${_scopeId}></path></svg> ${ssrInterpolate(unref(t)("courts.addCourt"))}</button></div>`);
            if (__props.courts.length === 0) {
              _push2(`<div class="text-center py-12 bg-base-100 rounded-xl border border-base-300"${_scopeId}><svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"${_scopeId}></path></svg><p class="text-sm text-base-content/50 mt-3 m-0"${_scopeId}>${ssrInterpolate(unref(t)("courts.noCourts"))}</p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="space-y-3"${_scopeId}><!--[-->`);
            ssrRenderList(__props.courts, (court) => {
              _push2(`<div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"${_scopeId}><div class="flex items-start justify-between gap-2"${_scopeId}><div class="flex-1 min-w-0"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><h3 class="text-sm font-bold text-base-content m-0 truncate"${_scopeId}>${ssrInterpolate(court.name)}</h3><span class="${ssrRenderClass([court.available_for_booking ? "badge-success" : "badge-ghost", "badge badge-xs"])}"${_scopeId}>${ssrInterpolate(court.available_for_booking ? unref(t)("courts.available") : "-")}</span></div>`);
              if (court.address) {
                _push2(`<p class="text-xs text-base-content/60 mt-1 m-0 truncate"${_scopeId}>${ssrInterpolate(court.address)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="flex items-center gap-1.5 shrink-0"${_scopeId}><button class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-info/10 text-info border-0 cursor-pointer hover:bg-info/20 transition-colors"${_scopeId}>${ssrInterpolate(unref(t)("courts.editCourt"))}</button><button class="h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors"${_scopeId}>${ssrInterpolate(unref(t)("common.delete"))}</button></div></div><div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs"${_scopeId}>`);
              if (court.phone) {
                _push2(`<div class="bg-base-200/50 rounded-lg px-2.5 py-1.5"${_scopeId}><div class="text-base-content/40 text-[10px]"${_scopeId}>${ssrInterpolate(unref(t)("courts.phone"))}</div><div class="text-base-content font-medium"${_scopeId}>${ssrInterpolate(court.phone)}</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="bg-base-200/50 rounded-lg px-2.5 py-1.5"${_scopeId}><div class="text-base-content/40 text-[10px]"${_scopeId}>${ssrInterpolate(unref(t)("courts.fieldTotal"))}</div><div class="text-base-content font-medium"${_scopeId}>${ssrInterpolate(court.field_total)}</div></div>`);
              if (court.court_type) {
                _push2(`<div class="bg-base-200/50 rounded-lg px-2.5 py-1.5"${_scopeId}><div class="text-base-content/40 text-[10px]"${_scopeId}>${ssrInterpolate(unref(t)("courts.courtType"))}</div><div class="text-base-content font-medium"${_scopeId}>${ssrInterpolate(courtTypeLabel(court.court_type))}</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (court.play_price) {
                _push2(`<div class="bg-base-200/50 rounded-lg px-2.5 py-1.5"${_scopeId}><div class="text-base-content/40 text-[10px]"${_scopeId}>${ssrInterpolate(unref(t)("courts.playPrice"))}</div><div class="text-base-content font-medium"${_scopeId}>${ssrInterpolate(parseFloat(court.play_price).toLocaleString())} ฿</div></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div></div>`);
            });
            _push2(`<!--]--></div></div><dialog class="${ssrRenderClass([{ "modal-open": showDialog.value }, "modal"])}"${_scopeId}><div class="modal-box max-w-md bg-base-100"${_scopeId}><h3 class="text-base font-bold text-base-content m-0 mb-4"${_scopeId}>${ssrInterpolate(dialogTitle.value)}</h3><form class="space-y-3"${_scopeId}><div class="form-control"${_scopeId}><label class="label py-1"${_scopeId}><span class="label-text text-xs font-semibold"${_scopeId}>${ssrInterpolate(unref(t)("courts.name"))} *</span></label><input${ssrRenderAttr("value", form.name)} type="text" class="${ssrRenderClass([{ "input-error": errors.value.name }, "input input-bordered input-sm w-full"])}"${ssrRenderAttr("placeholder", unref(t)("courts.name"))}${_scopeId}>`);
            if (errors.value.name) {
              _push2(`<label class="label py-0.5"${_scopeId}><span class="label-text-alt text-error text-[10px]"${_scopeId}>${ssrInterpolate(errors.value.name)}</span></label>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="form-control"${_scopeId}><label class="label py-1"${_scopeId}><span class="label-text text-xs font-semibold"${_scopeId}>${ssrInterpolate(unref(t)("courts.address"))}</span></label><input${ssrRenderAttr("value", form.address)} type="text" class="input input-bordered input-sm w-full"${ssrRenderAttr("placeholder", unref(t)("courts.address"))}${_scopeId}></div><div class="form-control"${_scopeId}><label class="label py-1"${_scopeId}><span class="label-text text-xs font-semibold"${_scopeId}>${ssrInterpolate(unref(t)("courts.phone"))}</span></label><input${ssrRenderAttr("value", form.phone)} type="text" class="input input-bordered input-sm w-full"${ssrRenderAttr("placeholder", unref(t)("courts.phone"))}${_scopeId}></div><div class="form-control"${_scopeId}><label class="label py-1"${_scopeId}><span class="label-text text-xs font-semibold"${_scopeId}>${ssrInterpolate(unref(t)("courts.fieldTotal"))}</span></label><input${ssrRenderAttr("value", form.field_total)} type="number" min="1" class="${ssrRenderClass([{ "input-error": errors.value.field_total }, "input input-bordered input-sm w-full"])}"${_scopeId}>`);
            if (errors.value.field_total) {
              _push2(`<label class="label py-0.5"${_scopeId}><span class="label-text-alt text-error text-[10px]"${_scopeId}>${ssrInterpolate(errors.value.field_total)}</span></label>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="form-control"${_scopeId}><label class="label py-1"${_scopeId}><span class="label-text text-xs font-semibold"${_scopeId}>${ssrInterpolate(unref(t)("courts.courtType"))}</span></label><select class="select select-bordered select-sm w-full"${_scopeId}><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.court_type) ? ssrLooseContain(form.court_type, "") : ssrLooseEqual(form.court_type, "")) ? " selected" : ""}${_scopeId}>-</option><!--[-->`);
            ssrRenderList(courtTypeOptions, (opt) => {
              _push2(`<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(form.court_type) ? ssrLooseContain(form.court_type, opt.value) : ssrLooseEqual(form.court_type, opt.value)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(unref(t)(opt.labelKey))}</option>`);
            });
            _push2(`<!--]--></select></div><div class="form-control"${_scopeId}><label class="label py-1"${_scopeId}><span class="label-text text-xs font-semibold"${_scopeId}>${ssrInterpolate(unref(t)("courts.playPrice"))}</span></label><input${ssrRenderAttr("value", form.play_price)} type="number" min="0" step="0.01" class="input input-bordered input-sm w-full"${ssrRenderAttr("placeholder", unref(t)("courts.playPrice"))}${_scopeId}></div><div class="form-control"${_scopeId}><label class="label cursor-pointer py-1 justify-start gap-3"${_scopeId}><input${ssrIncludeBooleanAttr(Array.isArray(form.available_for_booking) ? ssrLooseContain(form.available_for_booking, null) : form.available_for_booking) ? " checked" : ""} type="checkbox" class="checkbox checkbox-primary checkbox-sm"${_scopeId}><span class="label-text text-xs font-semibold"${_scopeId}>${ssrInterpolate(unref(t)("courts.available"))}</span></label></div><div class="modal-action mt-4"${_scopeId}><button type="button" class="btn btn-ghost btn-sm"${_scopeId}>${ssrInterpolate(unref(t)("common.cancel"))}</button><button type="submit" class="btn btn-primary btn-sm"${ssrIncludeBooleanAttr(submitting.value) ? " disabled" : ""}${_scopeId}>`);
            if (submitting.value) {
              _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(unref(t)("common.save"))}</button></div></form></div><form method="dialog" class="modal-backdrop"${_scopeId}><button${_scopeId}>close</button></form></dialog>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-4" }, [
                createVNode("div", { class: "flex items-center justify-between" }, [
                  createVNode("h1", { class: "text-base font-bold text-base-content m-0" }, toDisplayString(unref(t)("courts.title")), 1),
                  createVNode("button", {
                    class: "btn btn-primary btn-sm gap-1",
                    onClick: openAdd
                  }, [
                    (openBlock(), createBlock("svg", {
                      xmlns: "http://www.w3.org/2000/svg",
                      class: "h-4 w-4",
                      viewBox: "0 0 20 20",
                      fill: "currentColor"
                    }, [
                      createVNode("path", {
                        "fill-rule": "evenodd",
                        d: "M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z",
                        "clip-rule": "evenodd"
                      })
                    ])),
                    createTextVNode(" " + toDisplayString(unref(t)("courts.addCourt")), 1)
                  ])
                ]),
                __props.courts.length === 0 ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "text-center py-12 bg-base-100 rounded-xl border border-base-300"
                }, [
                  (openBlock(), createBlock("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    class: "h-12 w-12 mx-auto text-base-content/20",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    stroke: "currentColor"
                  }, [
                    createVNode("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      "stroke-width": "1.5",
                      d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    })
                  ])),
                  createVNode("p", { class: "text-sm text-base-content/50 mt-3 m-0" }, toDisplayString(unref(t)("courts.noCourts")), 1)
                ])) : createCommentVNode("", true),
                createVNode("div", { class: "space-y-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.courts, (court) => {
                    return openBlock(), createBlock("div", {
                      key: court.id,
                      class: "bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"
                    }, [
                      createVNode("div", { class: "flex items-start justify-between gap-2" }, [
                        createVNode("div", { class: "flex-1 min-w-0" }, [
                          createVNode("div", { class: "flex items-center gap-2" }, [
                            createVNode("h3", { class: "text-sm font-bold text-base-content m-0 truncate" }, toDisplayString(court.name), 1),
                            createVNode("span", {
                              class: ["badge badge-xs", court.available_for_booking ? "badge-success" : "badge-ghost"]
                            }, toDisplayString(court.available_for_booking ? unref(t)("courts.available") : "-"), 3)
                          ]),
                          court.address ? (openBlock(), createBlock("p", {
                            key: 0,
                            class: "text-xs text-base-content/60 mt-1 m-0 truncate"
                          }, toDisplayString(court.address), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex items-center gap-1.5 shrink-0" }, [
                          createVNode("button", {
                            onClick: ($event) => openEdit(court),
                            class: "h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-info/10 text-info border-0 cursor-pointer hover:bg-info/20 transition-colors"
                          }, toDisplayString(unref(t)("courts.editCourt")), 9, ["onClick"]),
                          createVNode("button", {
                            onClick: ($event) => deleteCourt(court),
                            class: "h-7 px-2.5 rounded-lg text-[10px] font-semibold bg-error/10 text-error border-0 cursor-pointer hover:bg-error/20 transition-colors"
                          }, toDisplayString(unref(t)("common.delete")), 9, ["onClick"])
                        ])
                      ]),
                      createVNode("div", { class: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs" }, [
                        court.phone ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "bg-base-200/50 rounded-lg px-2.5 py-1.5"
                        }, [
                          createVNode("div", { class: "text-base-content/40 text-[10px]" }, toDisplayString(unref(t)("courts.phone")), 1),
                          createVNode("div", { class: "text-base-content font-medium" }, toDisplayString(court.phone), 1)
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "bg-base-200/50 rounded-lg px-2.5 py-1.5" }, [
                          createVNode("div", { class: "text-base-content/40 text-[10px]" }, toDisplayString(unref(t)("courts.fieldTotal")), 1),
                          createVNode("div", { class: "text-base-content font-medium" }, toDisplayString(court.field_total), 1)
                        ]),
                        court.court_type ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "bg-base-200/50 rounded-lg px-2.5 py-1.5"
                        }, [
                          createVNode("div", { class: "text-base-content/40 text-[10px]" }, toDisplayString(unref(t)("courts.courtType")), 1),
                          createVNode("div", { class: "text-base-content font-medium" }, toDisplayString(courtTypeLabel(court.court_type)), 1)
                        ])) : createCommentVNode("", true),
                        court.play_price ? (openBlock(), createBlock("div", {
                          key: 2,
                          class: "bg-base-200/50 rounded-lg px-2.5 py-1.5"
                        }, [
                          createVNode("div", { class: "text-base-content/40 text-[10px]" }, toDisplayString(unref(t)("courts.playPrice")), 1),
                          createVNode("div", { class: "text-base-content font-medium" }, toDisplayString(parseFloat(court.play_price).toLocaleString()) + " ฿", 1)
                        ])) : createCommentVNode("", true)
                      ])
                    ]);
                  }), 128))
                ])
              ]),
              createVNode("dialog", {
                class: ["modal", { "modal-open": showDialog.value }]
              }, [
                createVNode("div", { class: "modal-box max-w-md bg-base-100" }, [
                  createVNode("h3", { class: "text-base font-bold text-base-content m-0 mb-4" }, toDisplayString(dialogTitle.value), 1),
                  createVNode("form", {
                    onSubmit: withModifiers(submitForm, ["prevent"]),
                    class: "space-y-3"
                  }, [
                    createVNode("div", { class: "form-control" }, [
                      createVNode("label", { class: "label py-1" }, [
                        createVNode("span", { class: "label-text text-xs font-semibold" }, toDisplayString(unref(t)("courts.name")) + " *", 1)
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => form.name = $event,
                        type: "text",
                        class: ["input input-bordered input-sm w-full", { "input-error": errors.value.name }],
                        placeholder: unref(t)("courts.name")
                      }, null, 10, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, form.name]
                      ]),
                      errors.value.name ? (openBlock(), createBlock("label", {
                        key: 0,
                        class: "label py-0.5"
                      }, [
                        createVNode("span", { class: "label-text-alt text-error text-[10px]" }, toDisplayString(errors.value.name), 1)
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "form-control" }, [
                      createVNode("label", { class: "label py-1" }, [
                        createVNode("span", { class: "label-text text-xs font-semibold" }, toDisplayString(unref(t)("courts.address")), 1)
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => form.address = $event,
                        type: "text",
                        class: "input input-bordered input-sm w-full",
                        placeholder: unref(t)("courts.address")
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, form.address]
                      ])
                    ]),
                    createVNode("div", { class: "form-control" }, [
                      createVNode("label", { class: "label py-1" }, [
                        createVNode("span", { class: "label-text text-xs font-semibold" }, toDisplayString(unref(t)("courts.phone")), 1)
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => form.phone = $event,
                        type: "text",
                        class: "input input-bordered input-sm w-full",
                        placeholder: unref(t)("courts.phone")
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, form.phone]
                      ])
                    ]),
                    createVNode("div", { class: "form-control" }, [
                      createVNode("label", { class: "label py-1" }, [
                        createVNode("span", { class: "label-text text-xs font-semibold" }, toDisplayString(unref(t)("courts.fieldTotal")), 1)
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => form.field_total = $event,
                        type: "number",
                        min: "1",
                        class: ["input input-bordered input-sm w-full", { "input-error": errors.value.field_total }]
                      }, null, 10, ["onUpdate:modelValue"]), [
                        [
                          vModelText,
                          form.field_total,
                          void 0,
                          { number: true }
                        ]
                      ]),
                      errors.value.field_total ? (openBlock(), createBlock("label", {
                        key: 0,
                        class: "label py-0.5"
                      }, [
                        createVNode("span", { class: "label-text-alt text-error text-[10px]" }, toDisplayString(errors.value.field_total), 1)
                      ])) : createCommentVNode("", true)
                    ]),
                    createVNode("div", { class: "form-control" }, [
                      createVNode("label", { class: "label py-1" }, [
                        createVNode("span", { class: "label-text text-xs font-semibold" }, toDisplayString(unref(t)("courts.courtType")), 1)
                      ]),
                      withDirectives(createVNode("select", {
                        "onUpdate:modelValue": ($event) => form.court_type = $event,
                        class: "select select-bordered select-sm w-full"
                      }, [
                        createVNode("option", { value: "" }, "-"),
                        (openBlock(), createBlock(Fragment, null, renderList(courtTypeOptions, (opt) => {
                          return createVNode("option", {
                            key: opt.value,
                            value: opt.value
                          }, toDisplayString(unref(t)(opt.labelKey)), 9, ["value"]);
                        }), 64))
                      ], 8, ["onUpdate:modelValue"]), [
                        [vModelSelect, form.court_type]
                      ])
                    ]),
                    createVNode("div", { class: "form-control" }, [
                      createVNode("label", { class: "label py-1" }, [
                        createVNode("span", { class: "label-text text-xs font-semibold" }, toDisplayString(unref(t)("courts.playPrice")), 1)
                      ]),
                      withDirectives(createVNode("input", {
                        "onUpdate:modelValue": ($event) => form.play_price = $event,
                        type: "number",
                        min: "0",
                        step: "0.01",
                        class: "input input-bordered input-sm w-full",
                        placeholder: unref(t)("courts.playPrice")
                      }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                        [vModelText, form.play_price]
                      ])
                    ]),
                    createVNode("div", { class: "form-control" }, [
                      createVNode("label", { class: "label cursor-pointer py-1 justify-start gap-3" }, [
                        withDirectives(createVNode("input", {
                          "onUpdate:modelValue": ($event) => form.available_for_booking = $event,
                          type: "checkbox",
                          class: "checkbox checkbox-primary checkbox-sm"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelCheckbox, form.available_for_booking]
                        ]),
                        createVNode("span", { class: "label-text text-xs font-semibold" }, toDisplayString(unref(t)("courts.available")), 1)
                      ])
                    ]),
                    createVNode("div", { class: "modal-action mt-4" }, [
                      createVNode("button", {
                        type: "button",
                        class: "btn btn-ghost btn-sm",
                        onClick: closeDialog
                      }, toDisplayString(unref(t)("common.cancel")), 1),
                      createVNode("button", {
                        type: "submit",
                        class: "btn btn-primary btn-sm",
                        disabled: submitting.value
                      }, [
                        submitting.value ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "loading loading-spinner loading-xs"
                        })) : createCommentVNode("", true),
                        createTextVNode(" " + toDisplayString(unref(t)("common.save")), 1)
                      ], 8, ["disabled"])
                    ])
                  ], 32)
                ]),
                createVNode("form", {
                  method: "dialog",
                  class: "modal-backdrop",
                  onClick: closeDialog
                }, [
                  createVNode("button", null, "close")
                ])
              ], 2)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/Courts.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
