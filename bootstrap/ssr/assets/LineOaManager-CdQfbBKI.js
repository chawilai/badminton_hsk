import { reactive, ref, onMounted, unref, withCtx, createBlock, openBlock, createVNode, toDisplayString, withDirectives, vModelDynamic, createCommentVNode, vModelText, createTextVNode, Fragment, renderList, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderList } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./AppLayout-j6iBrT39.js";
import { usePage, Head, Link, router } from "@inertiajs/vue3";
import { u as useToast } from "./useToast-DyaFeJ92.js";
import "./badmintonLayout-C3Xd2fBf.js";
import "./useLocale-QwrDLuQY.js";
import "./LocaleSwitcher-DHf7bxTb.js";
import "./UserAvatar-Dwoh2ac-.js";
import "./_plugin-vue_export-helper-1tPrXgE0.js";
import "./useConfirm-CffLghyV.js";
const _sfc_main = {
  __name: "LineOaManager",
  __ssrInlineRender: true,
  props: {
    settings: { type: Object, default: () => ({}) },
    quota: { type: Object, default: () => ({}) },
    envConfig: { type: Object, default: () => ({}) }
  },
  setup(__props) {
    const toast = useToast();
    const page = usePage();
    const props = __props;
    const form = reactive({
      channel_access_token: "",
      channel_secret: "",
      liff_id: props.settings.liff_id || "",
      line_oa_id: props.settings.line_oa_id || ""
    });
    const showToken = ref(false);
    const showSecret = ref(false);
    const saving = ref(false);
    const saveSettings = () => {
      saving.value = true;
      router.post("/lineoa-manager/update", form, {
        preserveScroll: true,
        onSuccess: () => {
          saving.value = false;
        },
        onError: () => {
          saving.value = false;
        }
      });
    };
    const richMenuItems = [
      { key: "party_lists", label: "Party Lists", icon: "🏸", defaultPath: "/party-lists" },
      { key: "party", label: "Party", icon: "🎉", defaultPath: "/my-parties" },
      { key: "chat", label: "Chat", icon: "💬", defaultPath: "/chat" },
      { key: "stats", label: "Stats", icon: "📊", defaultPath: "/profile" },
      { key: "friend_list", label: "Friend List", icon: "👥", defaultPath: "/friends" },
      { key: "rank_board", label: "Rank Board", icon: "🏆", defaultPath: "/party-lists" }
    ];
    const richMenuPaths = reactive({});
    richMenuItems.forEach((item) => {
      var _a;
      const saved = (_a = props.settings.rich_menu_config) == null ? void 0 : _a[item.key];
      richMenuPaths[item.key] = saved || item.defaultPath;
    });
    const saveRichMenu = () => {
      router.post("/lineoa-manager/update", {
        rich_menu_config: { ...richMenuPaths }
      }, { preserveScroll: true });
    };
    const testUserId = ref("");
    const sending = ref(false);
    const sendTestWelcome = () => {
      if (!testUserId.value) return;
      sending.value = true;
      router.post("/lineoa-manager/test-welcome", {
        line_user_id: testUserId.value
      }, {
        preserveScroll: true,
        onSuccess: () => {
          sending.value = false;
        },
        onError: () => {
          sending.value = false;
        }
      });
    };
    const richMenus = ref([]);
    const defaultRichMenuId = ref(null);
    const loadingMenus = ref(false);
    const fetchRichMenu = async () => {
      loadingMenus.value = true;
      try {
        const res = await fetch("/api/lineoa-richmenu");
        const data = await res.json();
        richMenus.value = data.richmenus || [];
        defaultRichMenuId.value = data.defaultRichMenuId;
      } catch (e) {
        toast.add({ severity: "error", summary: "ดึงข้อมูล Rich Menu ไม่สำเร็จ", life: 3e3 });
      }
      loadingMenus.value = false;
    };
    onMounted(() => {
      var _a, _b;
      if ((_a = page.props.flash) == null ? void 0 : _a.success) {
        toast.add({ severity: "success", summary: page.props.flash.success, life: 3e3 });
      }
      if ((_b = page.props.flash) == null ? void 0 : _b.error) {
        toast.add({ severity: "error", summary: page.props.flash.error, life: 5e3 });
      }
    });
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        toast.add({ severity: "success", summary: "คัดลอกแล้ว", life: 2e3 });
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      _push(ssrRenderComponent(unref(Head), { title: "LINE OA Manager" }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="space-y-4 pb-8"${_scopeId}><div class="bg-gradient-to-br from-[#06C755]/10 to-[#06C755]/5 rounded-2xl p-5"${_scopeId}><div class="flex items-center gap-3"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Link), {
              href: "/admin",
              class: "w-8 h-8 rounded-lg bg-base-100 flex items-center justify-center no-underline"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<svg class="w-4 h-4 text-base-content" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"${_scopeId2}></path></svg>`);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "w-4 h-4 text-base-content",
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
            _push2(`<div class="w-12 h-12 bg-[#06C755]/10 rounded-xl flex items-center justify-center"${_scopeId}><span class="text-2xl"${_scopeId}>📱</span></div><div${_scopeId}><div class="text-lg font-bold text-base-content m-0"${_scopeId}>LINE OA Manager</div><p class="text-xs text-base-content/50 m-0 mt-0.5"${_scopeId}>จัดการ LINE OA, Welcome Message, Rich Menu</p></div></div></div><div class="grid grid-cols-3 gap-2"${_scopeId}><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-primary"${_scopeId}>${ssrInterpolate(__props.quota.quota)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>โควต้า</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-warning"${_scopeId}>${ssrInterpolate(__props.quota.used)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>ใช้ไป</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-success"${_scopeId}>${ssrInterpolate(__props.quota.remaining)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>เหลือ</div></div></div><div class="bg-base-100 rounded-xl border border-base-300 p-4"${_scopeId}><div class="text-sm font-bold text-base-content mb-2"${_scopeId}>LIFF URL</div><div class="flex items-center gap-2"${_scopeId}><code class="text-xs bg-base-200 px-2 py-1 rounded-lg flex-1 break-all"${_scopeId}>${ssrInterpolate(__props.settings.liff_base_url)}</code><button class="btn btn-ghost btn-xs"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"${_scopeId}></path></svg></button></div><div class="text-[10px] text-base-content/40 mt-1"${_scopeId}>LIFF ID: ${ssrInterpolate(__props.settings.liff_id)}</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>ตั้งค่า LINE OA</div><div${_scopeId}><label class="text-xs font-medium text-base-content/70 block mb-1"${_scopeId}>Channel Access Token</label><div class="flex gap-2"${_scopeId}><input${ssrRenderAttr("type", showToken.value ? "text" : "password")}${ssrRenderDynamicModel(showToken.value ? "text" : "password", form.channel_access_token, null)}${ssrRenderAttr("placeholder", __props.settings.channel_access_token_set ? __props.settings.channel_access_token : "ใส่ token ใหม่...")} class="input input-bordered input-sm flex-1 text-xs"${_scopeId}><button class="btn btn-ghost btn-sm btn-square"${_scopeId}>`);
            if (!showToken.value) {
              _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"${_scopeId}></path><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"${_scopeId}></path></svg>`);
            } else {
              _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"${_scopeId}></path></svg>`);
            }
            _push2(`</button></div>`);
            if (__props.settings.channel_access_token_set) {
              _push2(`<div class="text-[10px] text-success mt-0.5"${_scopeId}>ตั้งค่าแล้ว (DB)</div>`);
            } else if (__props.envConfig.token_set) {
              _push2(`<div class="text-[10px] text-info mt-0.5"${_scopeId}>ใช้จาก .env</div>`);
            } else {
              _push2(`<div class="text-[10px] text-error mt-0.5"${_scopeId}>ยังไม่ได้ตั้งค่า</div>`);
            }
            _push2(`</div><div${_scopeId}><label class="text-xs font-medium text-base-content/70 block mb-1"${_scopeId}>Channel Secret</label><input${ssrRenderAttr("type", showSecret.value ? "text" : "password")}${ssrRenderDynamicModel(showSecret.value ? "text" : "password", form.channel_secret, null)}${ssrRenderAttr("placeholder", __props.settings.channel_secret_set ? __props.settings.channel_secret : "ใส่ secret ใหม่...")} class="input input-bordered input-sm w-full text-xs"${_scopeId}>`);
            if (__props.settings.channel_secret_set) {
              _push2(`<div class="text-[10px] text-success mt-0.5"${_scopeId}>ตั้งค่าแล้ว (DB)</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div${_scopeId}><label class="text-xs font-medium text-base-content/70 block mb-1"${_scopeId}>LIFF ID</label><input type="text"${ssrRenderAttr("value", form.liff_id)}${ssrRenderAttr("placeholder", __props.envConfig.liff_id)} class="input input-bordered input-sm w-full text-xs"${_scopeId}><div class="text-[10px] text-base-content/40 mt-0.5"${_scopeId}>.env default: ${ssrInterpolate(__props.envConfig.liff_id)}</div></div><div${_scopeId}><label class="text-xs font-medium text-base-content/70 block mb-1"${_scopeId}>LINE OA ID</label><input type="text"${ssrRenderAttr("value", form.line_oa_id)} placeholder="@badmintonparty" class="input input-bordered input-sm w-full text-xs"${_scopeId}></div><button${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""} class="btn btn-primary btn-sm w-full"${_scopeId}>`);
            if (saving.value) {
              _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(saving.value ? "กำลังบันทึก..." : "บันทึกการตั้งค่า")}</button></div><div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>Rich Menu LIFF URLs</div><p class="text-[10px] text-base-content/50 m-0"${_scopeId}>คัดลอก URL ไปใช้ใน LINE OA Manager → Rich Menu</p><!--[-->`);
            ssrRenderList(richMenuItems, (item) => {
              _push2(`<div class="flex items-center gap-2"${_scopeId}><span class="text-lg w-7 text-center"${_scopeId}>${ssrInterpolate(item.icon)}</span><div class="flex-1 min-w-0"${_scopeId}><div class="text-xs font-semibold text-base-content"${_scopeId}>${ssrInterpolate(item.label)}</div><div class="flex items-center gap-1"${_scopeId}><input type="text"${ssrRenderAttr("value", richMenuPaths[item.key])} class="input input-bordered input-xs flex-1 text-[10px] font-mono"${_scopeId}></div><div class="text-[10px] text-base-content/40 font-mono break-all mt-0.5"${_scopeId}>${ssrInterpolate(__props.settings.liff_base_url)}${ssrInterpolate(richMenuPaths[item.key])}</div></div><button class="btn btn-ghost btn-xs btn-square shrink-0" title="คัดลอก"${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"${_scopeId}></path></svg></button></div>`);
            });
            _push2(`<!--]--><button class="btn btn-outline btn-sm w-full"${_scopeId}>บันทึก Rich Menu Config</button></div><div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>ทดสอบ Welcome Message</div><div class="bg-[#f0fdf4] rounded-xl p-4 space-y-2"${_scopeId}><div class="text-center"${_scopeId}><img${ssrRenderAttr("src", "https://badmintonparty.com/icons/logo2.png")} class="h-12 mx-auto" alt="Logo"${_scopeId}></div><div class="text-center"${_scopeId}><div class="text-sm font-bold text-[#166534]"${_scopeId}>ยินดีต้อนรับสู่ Badminton Party!</div><div class="text-[10px] text-[#666]"${_scopeId}>ระบบจัดการปาร์ตี้แบดมินตันครบวงจร</div></div><div class="border-t border-[#166534]/10 pt-2 space-y-1"${_scopeId}><div class="text-[10px]"${_scopeId}>🏸 สร้างปาร์ตี้แบดมินตัน</div><div class="text-[10px]"${_scopeId}>👥 เข้าร่วมปาร์ตี้กับเพื่อนๆ</div><div class="text-[10px]"${_scopeId}>🎮 สร้างเกม จับคู่อัตโนมัติ</div><div class="text-[10px]"${_scopeId}>📊 บันทึก &amp; ตรวจสอบประวัติ</div></div><div class="text-center pt-2"${_scopeId}><div class="bg-[#22c55e] text-white text-xs font-bold py-2 rounded-lg"${_scopeId}>เริ่มใช้งาน Badminton Party</div><div class="text-[10px] text-[#166534] font-bold mt-1"${_scopeId}>เข้าสู่เว็บไซต์</div></div><div class="text-[10px] text-base-content/40 text-center mt-1"${_scopeId}> ปุ่มเขียวจะเปิด: ${ssrInterpolate(__props.settings.liff_base_url)}/party-lists </div></div><div${_scopeId}><label class="text-xs font-medium text-base-content/70 block mb-1"${_scopeId}>LINE User ID</label><input type="text"${ssrRenderAttr("value", testUserId.value)} placeholder="Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" class="input input-bordered input-sm w-full text-xs font-mono"${_scopeId}></div><button${ssrIncludeBooleanAttr(sending.value || !testUserId.value) ? " disabled" : ""} class="btn btn-success btn-sm w-full text-white"${_scopeId}>`);
            if (sending.value) {
              _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(sending.value ? "กำลังส่ง..." : "ส่ง Welcome Message ทดสอบ")}</button></div><div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>Rich Menu (LINE API)</div><button${ssrIncludeBooleanAttr(loadingMenus.value) ? " disabled" : ""} class="btn btn-ghost btn-xs"${_scopeId}>`);
            if (loadingMenus.value) {
              _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
            } else {
              _push2(`<span${_scopeId}>โหลด</span>`);
            }
            _push2(`</button></div>`);
            if (richMenus.value.length === 0 && !loadingMenus.value) {
              _push2(`<div class="text-xs text-base-content/40 text-center py-4"${_scopeId}> กด &quot;โหลด&quot; เพื่อดึงข้อมูล Rich Menu จาก LINE API </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(richMenus.value, (menu) => {
              var _a, _b, _c;
              _push2(`<div class="border border-base-300 rounded-lg p-3 space-y-2"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="text-xs font-bold text-base-content flex-1"${_scopeId}>${ssrInterpolate(menu.name)}</div>`);
              if (menu.richMenuId === defaultRichMenuId.value) {
                _push2(`<span class="badge badge-xs badge-success"${_scopeId}>default</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="text-[10px] text-base-content/40 font-mono break-all"${_scopeId}>ID: ${ssrInterpolate(menu.richMenuId)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate((_a = menu.size) == null ? void 0 : _a.width)}x${ssrInterpolate((_b = menu.size) == null ? void 0 : _b.height)} · ${ssrInterpolate((_c = menu.areas) == null ? void 0 : _c.length)} areas</div>`);
              if (menu.areas) {
                _push2(`<div class="space-y-1"${_scopeId}><!--[-->`);
                ssrRenderList(menu.areas, (area, i) => {
                  var _a2, _b2, _c2, _d;
                  _push2(`<div class="text-[10px] bg-base-200 rounded px-2 py-1"${_scopeId}><span class="text-base-content/50"${_scopeId}>Area ${ssrInterpolate(i + 1)}:</span>`);
                  if (((_a2 = area.action) == null ? void 0 : _a2.type) === "uri") {
                    _push2(`<span class="font-mono text-primary ml-1 break-all"${_scopeId}>${ssrInterpolate(area.action.uri)}</span>`);
                  } else {
                    _push2(`<span class="text-base-content/40 ml-1"${_scopeId}>${ssrInterpolate((_b2 = area.action) == null ? void 0 : _b2.type)}: ${ssrInterpolate(((_c2 = area.action) == null ? void 0 : _c2.text) || ((_d = area.action) == null ? void 0 : _d.label))}</span>`);
                  }
                  _push2(`</div>`);
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            });
            _push2(`<!--]--></div></div>`);
          } else {
            return [
              createVNode("div", { class: "space-y-4 pb-8" }, [
                createVNode("div", { class: "bg-gradient-to-br from-[#06C755]/10 to-[#06C755]/5 rounded-2xl p-5" }, [
                  createVNode("div", { class: "flex items-center gap-3" }, [
                    createVNode(unref(Link), {
                      href: "/admin",
                      class: "w-8 h-8 rounded-lg bg-base-100 flex items-center justify-center no-underline"
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock("svg", {
                          class: "w-4 h-4 text-base-content",
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
                    createVNode("div", { class: "w-12 h-12 bg-[#06C755]/10 rounded-xl flex items-center justify-center" }, [
                      createVNode("span", { class: "text-2xl" }, "📱")
                    ]),
                    createVNode("div", null, [
                      createVNode("div", { class: "text-lg font-bold text-base-content m-0" }, "LINE OA Manager"),
                      createVNode("p", { class: "text-xs text-base-content/50 m-0 mt-0.5" }, "จัดการ LINE OA, Welcome Message, Rich Menu")
                    ])
                  ])
                ]),
                createVNode("div", { class: "grid grid-cols-3 gap-2" }, [
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-lg font-black text-primary" }, toDisplayString(__props.quota.quota), 1),
                    createVNode("div", { class: "text-[9px] text-base-content/50" }, "โควต้า")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-lg font-black text-warning" }, toDisplayString(__props.quota.used), 1),
                    createVNode("div", { class: "text-[9px] text-base-content/50" }, "ใช้ไป")
                  ]),
                  createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-3 text-center" }, [
                    createVNode("div", { class: "text-lg font-black text-success" }, toDisplayString(__props.quota.remaining), 1),
                    createVNode("div", { class: "text-[9px] text-base-content/50" }, "เหลือ")
                  ])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4" }, [
                  createVNode("div", { class: "text-sm font-bold text-base-content mb-2" }, "LIFF URL"),
                  createVNode("div", { class: "flex items-center gap-2" }, [
                    createVNode("code", { class: "text-xs bg-base-200 px-2 py-1 rounded-lg flex-1 break-all" }, toDisplayString(__props.settings.liff_base_url), 1),
                    createVNode("button", {
                      onClick: ($event) => copyToClipboard(__props.settings.liff_base_url),
                      class: "btn btn-ghost btn-xs"
                    }, [
                      (openBlock(), createBlock("svg", {
                        class: "w-4 h-4",
                        fill: "none",
                        stroke: "currentColor",
                        "stroke-width": "2",
                        viewBox: "0 0 24 24"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        })
                      ]))
                    ], 8, ["onClick"])
                  ]),
                  createVNode("div", { class: "text-[10px] text-base-content/40 mt-1" }, "LIFF ID: " + toDisplayString(__props.settings.liff_id), 1)
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4 space-y-3" }, [
                  createVNode("div", { class: "text-sm font-bold text-base-content" }, "ตั้งค่า LINE OA"),
                  createVNode("div", null, [
                    createVNode("label", { class: "text-xs font-medium text-base-content/70 block mb-1" }, "Channel Access Token"),
                    createVNode("div", { class: "flex gap-2" }, [
                      withDirectives(createVNode("input", {
                        type: showToken.value ? "text" : "password",
                        "onUpdate:modelValue": ($event) => form.channel_access_token = $event,
                        placeholder: __props.settings.channel_access_token_set ? __props.settings.channel_access_token : "ใส่ token ใหม่...",
                        class: "input input-bordered input-sm flex-1 text-xs"
                      }, null, 8, ["type", "onUpdate:modelValue", "placeholder"]), [
                        [vModelDynamic, form.channel_access_token]
                      ]),
                      createVNode("button", {
                        onClick: ($event) => showToken.value = !showToken.value,
                        class: "btn btn-ghost btn-sm btn-square"
                      }, [
                        !showToken.value ? (openBlock(), createBlock("svg", {
                          key: 0,
                          class: "w-4 h-4",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          }),
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          })
                        ])) : (openBlock(), createBlock("svg", {
                          key: 1,
                          class: "w-4 h-4",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          })
                        ]))
                      ], 8, ["onClick"])
                    ]),
                    __props.settings.channel_access_token_set ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-[10px] text-success mt-0.5"
                    }, "ตั้งค่าแล้ว (DB)")) : __props.envConfig.token_set ? (openBlock(), createBlock("div", {
                      key: 1,
                      class: "text-[10px] text-info mt-0.5"
                    }, "ใช้จาก .env")) : (openBlock(), createBlock("div", {
                      key: 2,
                      class: "text-[10px] text-error mt-0.5"
                    }, "ยังไม่ได้ตั้งค่า"))
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "text-xs font-medium text-base-content/70 block mb-1" }, "Channel Secret"),
                    withDirectives(createVNode("input", {
                      type: showSecret.value ? "text" : "password",
                      "onUpdate:modelValue": ($event) => form.channel_secret = $event,
                      placeholder: __props.settings.channel_secret_set ? __props.settings.channel_secret : "ใส่ secret ใหม่...",
                      class: "input input-bordered input-sm w-full text-xs"
                    }, null, 8, ["type", "onUpdate:modelValue", "placeholder"]), [
                      [vModelDynamic, form.channel_secret]
                    ]),
                    __props.settings.channel_secret_set ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "text-[10px] text-success mt-0.5"
                    }, "ตั้งค่าแล้ว (DB)")) : createCommentVNode("", true)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "text-xs font-medium text-base-content/70 block mb-1" }, "LIFF ID"),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.liff_id = $event,
                      placeholder: __props.envConfig.liff_id,
                      class: "input input-bordered input-sm w-full text-xs"
                    }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                      [vModelText, form.liff_id]
                    ]),
                    createVNode("div", { class: "text-[10px] text-base-content/40 mt-0.5" }, ".env default: " + toDisplayString(__props.envConfig.liff_id), 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "text-xs font-medium text-base-content/70 block mb-1" }, "LINE OA ID"),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => form.line_oa_id = $event,
                      placeholder: "@badmintonparty",
                      class: "input input-bordered input-sm w-full text-xs"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, form.line_oa_id]
                    ])
                  ]),
                  createVNode("button", {
                    onClick: saveSettings,
                    disabled: saving.value,
                    class: "btn btn-primary btn-sm w-full"
                  }, [
                    saving.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "loading loading-spinner loading-xs"
                    })) : createCommentVNode("", true),
                    createTextVNode(" " + toDisplayString(saving.value ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"), 1)
                  ], 8, ["disabled"])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4 space-y-3" }, [
                  createVNode("div", { class: "text-sm font-bold text-base-content" }, "Rich Menu LIFF URLs"),
                  createVNode("p", { class: "text-[10px] text-base-content/50 m-0" }, "คัดลอก URL ไปใช้ใน LINE OA Manager → Rich Menu"),
                  (openBlock(), createBlock(Fragment, null, renderList(richMenuItems, (item) => {
                    return createVNode("div", {
                      key: item.key,
                      class: "flex items-center gap-2"
                    }, [
                      createVNode("span", { class: "text-lg w-7 text-center" }, toDisplayString(item.icon), 1),
                      createVNode("div", { class: "flex-1 min-w-0" }, [
                        createVNode("div", { class: "text-xs font-semibold text-base-content" }, toDisplayString(item.label), 1),
                        createVNode("div", { class: "flex items-center gap-1" }, [
                          withDirectives(createVNode("input", {
                            type: "text",
                            "onUpdate:modelValue": ($event) => richMenuPaths[item.key] = $event,
                            class: "input input-bordered input-xs flex-1 text-[10px] font-mono"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, richMenuPaths[item.key]]
                          ])
                        ]),
                        createVNode("div", { class: "text-[10px] text-base-content/40 font-mono break-all mt-0.5" }, toDisplayString(__props.settings.liff_base_url) + toDisplayString(richMenuPaths[item.key]), 1)
                      ]),
                      createVNode("button", {
                        onClick: ($event) => copyToClipboard(__props.settings.liff_base_url + richMenuPaths[item.key]),
                        class: "btn btn-ghost btn-xs btn-square shrink-0",
                        title: "คัดลอก"
                      }, [
                        (openBlock(), createBlock("svg", {
                          class: "w-3.5 h-3.5",
                          fill: "none",
                          stroke: "currentColor",
                          "stroke-width": "2",
                          viewBox: "0 0 24 24"
                        }, [
                          createVNode("path", {
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                          })
                        ]))
                      ], 8, ["onClick"])
                    ]);
                  }), 64)),
                  createVNode("button", {
                    onClick: saveRichMenu,
                    class: "btn btn-outline btn-sm w-full"
                  }, "บันทึก Rich Menu Config")
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4 space-y-3" }, [
                  createVNode("div", { class: "text-sm font-bold text-base-content" }, "ทดสอบ Welcome Message"),
                  createVNode("div", { class: "bg-[#f0fdf4] rounded-xl p-4 space-y-2" }, [
                    createVNode("div", { class: "text-center" }, [
                      createVNode("img", {
                        src: "https://badmintonparty.com/icons/logo2.png",
                        class: "h-12 mx-auto",
                        alt: "Logo"
                      })
                    ]),
                    createVNode("div", { class: "text-center" }, [
                      createVNode("div", { class: "text-sm font-bold text-[#166534]" }, "ยินดีต้อนรับสู่ Badminton Party!"),
                      createVNode("div", { class: "text-[10px] text-[#666]" }, "ระบบจัดการปาร์ตี้แบดมินตันครบวงจร")
                    ]),
                    createVNode("div", { class: "border-t border-[#166534]/10 pt-2 space-y-1" }, [
                      createVNode("div", { class: "text-[10px]" }, "🏸 สร้างปาร์ตี้แบดมินตัน"),
                      createVNode("div", { class: "text-[10px]" }, "👥 เข้าร่วมปาร์ตี้กับเพื่อนๆ"),
                      createVNode("div", { class: "text-[10px]" }, "🎮 สร้างเกม จับคู่อัตโนมัติ"),
                      createVNode("div", { class: "text-[10px]" }, "📊 บันทึก & ตรวจสอบประวัติ")
                    ]),
                    createVNode("div", { class: "text-center pt-2" }, [
                      createVNode("div", { class: "bg-[#22c55e] text-white text-xs font-bold py-2 rounded-lg" }, "เริ่มใช้งาน Badminton Party"),
                      createVNode("div", { class: "text-[10px] text-[#166534] font-bold mt-1" }, "เข้าสู่เว็บไซต์")
                    ]),
                    createVNode("div", { class: "text-[10px] text-base-content/40 text-center mt-1" }, " ปุ่มเขียวจะเปิด: " + toDisplayString(__props.settings.liff_base_url) + "/party-lists ", 1)
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "text-xs font-medium text-base-content/70 block mb-1" }, "LINE User ID"),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => testUserId.value = $event,
                      placeholder: "Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                      class: "input input-bordered input-sm w-full text-xs font-mono"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, testUserId.value]
                    ])
                  ]),
                  createVNode("button", {
                    onClick: sendTestWelcome,
                    disabled: sending.value || !testUserId.value,
                    class: "btn btn-success btn-sm w-full text-white"
                  }, [
                    sending.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "loading loading-spinner loading-xs"
                    })) : createCommentVNode("", true),
                    createTextVNode(" " + toDisplayString(sending.value ? "กำลังส่ง..." : "ส่ง Welcome Message ทดสอบ"), 1)
                  ], 8, ["disabled"])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4 space-y-3" }, [
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", { class: "text-sm font-bold text-base-content" }, "Rich Menu (LINE API)"),
                    createVNode("button", {
                      onClick: fetchRichMenu,
                      disabled: loadingMenus.value,
                      class: "btn btn-ghost btn-xs"
                    }, [
                      loadingMenus.value ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "loading loading-spinner loading-xs"
                      })) : (openBlock(), createBlock("span", { key: 1 }, "โหลด"))
                    ], 8, ["disabled"])
                  ]),
                  richMenus.value.length === 0 && !loadingMenus.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "text-xs text-base-content/40 text-center py-4"
                  }, ' กด "โหลด" เพื่อดึงข้อมูล Rich Menu จาก LINE API ')) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(richMenus.value, (menu) => {
                    var _a, _b, _c;
                    return openBlock(), createBlock("div", {
                      key: menu.richMenuId,
                      class: "border border-base-300 rounded-lg p-3 space-y-2"
                    }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("div", { class: "text-xs font-bold text-base-content flex-1" }, toDisplayString(menu.name), 1),
                        menu.richMenuId === defaultRichMenuId.value ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "badge badge-xs badge-success"
                        }, "default")) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "text-[10px] text-base-content/40 font-mono break-all" }, "ID: " + toDisplayString(menu.richMenuId), 1),
                      createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString((_a = menu.size) == null ? void 0 : _a.width) + "x" + toDisplayString((_b = menu.size) == null ? void 0 : _b.height) + " · " + toDisplayString((_c = menu.areas) == null ? void 0 : _c.length) + " areas", 1),
                      menu.areas ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "space-y-1"
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(menu.areas, (area, i) => {
                          var _a2, _b2, _c2, _d;
                          return openBlock(), createBlock("div", {
                            key: i,
                            class: "text-[10px] bg-base-200 rounded px-2 py-1"
                          }, [
                            createVNode("span", { class: "text-base-content/50" }, "Area " + toDisplayString(i + 1) + ":", 1),
                            ((_a2 = area.action) == null ? void 0 : _a2.type) === "uri" ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "font-mono text-primary ml-1 break-all"
                            }, toDisplayString(area.action.uri), 1)) : (openBlock(), createBlock("span", {
                              key: 1,
                              class: "text-base-content/40 ml-1"
                            }, toDisplayString((_b2 = area.action) == null ? void 0 : _b2.type) + ": " + toDisplayString(((_c2 = area.action) == null ? void 0 : _c2.text) || ((_d = area.action) == null ? void 0 : _d.label)), 1))
                          ]);
                        }), 128))
                      ])) : createCommentVNode("", true)
                    ]);
                  }), 128))
                ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/Pages/LineOaManager.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
