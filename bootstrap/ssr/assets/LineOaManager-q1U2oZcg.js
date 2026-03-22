import { reactive, ref, computed, onMounted, unref, withCtx, createBlock, openBlock, createVNode, toDisplayString, withDirectives, vModelDynamic, createCommentVNode, vModelText, createTextVNode, Fragment, renderList, vModelSelect, vModelCheckbox, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderStyle, ssrRenderClass, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
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
    envConfig: { type: Object, default: () => ({}) },
    lineUsers: { type: Array, default: () => [] }
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
    const wmConfig = props.settings.welcome_message_config || {};
    const welcomeForm = reactive({
      title: wmConfig.title || "ยินดีต้อนรับสู่ Badminton Party!",
      subtitle: wmConfig.subtitle || "ระบบจัดการปาร์ตี้แบดมินตันครบวงจร",
      button_label: wmConfig.button_label || "เริ่มใช้งาน Badminton Party",
      button_path: wmConfig.button_path || "/party-lists",
      header_color: wmConfig.header_color || "#f0fdf4",
      button_color: wmConfig.button_color || "#22c55e",
      features: wmConfig.features || [
        { icon: "🏸", text: "สร้างปาร์ตี้แบดมินตัน" },
        { icon: "👥", text: "เข้าร่วมปาร์ตี้กับเพื่อนๆ" },
        { icon: "🎮", text: "สร้างเกม จับคู่อัตโนมัติ Track จำนวนเกม" },
        { icon: "📊", text: "บันทึก & ตรวจสอบประวัติการเล่น" }
      ]
    });
    const savingWelcome = ref(false);
    const saveWelcome = () => {
      savingWelcome.value = true;
      router.post("/lineoa-manager/welcome-message", { ...welcomeForm }, {
        preserveScroll: true,
        onSuccess: () => {
          savingWelcome.value = false;
        },
        onError: () => {
          savingWelcome.value = false;
        }
      });
    };
    const addFeature = () => {
      if (welcomeForm.features.length < 6) {
        welcomeForm.features.push({ icon: "✨", text: "" });
      }
    };
    const removeFeature = (index) => {
      welcomeForm.features.splice(index, 1);
    };
    const selectedUserIds = ref([]);
    const userSearch = ref("");
    const sending = ref(false);
    const filteredLineUsers = computed(() => {
      if (!userSearch.value) return props.lineUsers;
      const q = userSearch.value.toLowerCase();
      return props.lineUsers.filter(
        (u) => {
          var _a, _b;
          return ((_a = u.name) == null ? void 0 : _a.toLowerCase().includes(q)) || ((_b = u.line_user_id) == null ? void 0 : _b.toLowerCase().includes(q));
        }
      );
    });
    const toggleUser = (lineUserId) => {
      const idx = selectedUserIds.value.indexOf(lineUserId);
      if (idx >= 0) {
        selectedUserIds.value.splice(idx, 1);
      } else {
        selectedUserIds.value.push(lineUserId);
      }
    };
    const selectAll = () => {
      if (selectedUserIds.value.length === filteredLineUsers.value.length) {
        selectedUserIds.value = [];
      } else {
        selectedUserIds.value = filteredLineUsers.value.map((u) => u.line_user_id);
      }
    };
    const sendTestWelcome = () => {
      if (selectedUserIds.value.length === 0) return;
      sending.value = true;
      router.post("/lineoa-manager/test-welcome", {
        line_user_ids: [...selectedUserIds.value]
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
    const showCreateMenu = ref(false);
    const creatingMenu = ref(false);
    const gridPresets = [
      { label: "2x1 (ปกติ)", cols: 2, rows: 1, width: 2500, height: 843 },
      { label: "2x2", cols: 2, rows: 2, width: 2500, height: 1686 },
      { label: "3x1", cols: 3, rows: 1, width: 2500, height: 843 },
      { label: "3x2", cols: 3, rows: 2, width: 2500, height: 1686 },
      { label: "1x1", cols: 1, rows: 1, width: 2500, height: 843 },
      { label: "2x3", cols: 2, rows: 3, width: 2500, height: 1686 }
    ];
    const newMenu = reactive({
      name: "Badminton Party Menu",
      chat_bar_text: "เมนู",
      preset: 1,
      // index into gridPresets, default 3x2
      areas: [],
      set_default: true
    });
    const selectedPreset = computed(() => gridPresets[newMenu.preset]);
    const generateAreas = () => {
      const preset = selectedPreset.value;
      const cellW = Math.floor(preset.width / preset.cols);
      const cellH = Math.floor(preset.height / preset.rows);
      const areas = [];
      for (let r = 0; r < preset.rows; r++) {
        for (let c = 0; c < preset.cols; c++) {
          const idx = r * preset.cols + c;
          const menuItem = richMenuItems[idx];
          areas.push({
            x: c * cellW,
            y: r * cellH,
            width: cellW,
            height: cellH,
            action_type: "uri",
            action_value: menuItem ? props.settings.liff_base_url + (richMenuPaths[menuItem.key] || menuItem.defaultPath) : props.settings.liff_base_url + "/party-lists",
            label: menuItem ? menuItem.label : `Area ${idx + 1}`
          });
        }
      }
      newMenu.areas = areas;
    };
    generateAreas();
    const createRichMenu = async () => {
      var _a;
      creatingMenu.value = true;
      try {
        const preset = selectedPreset.value;
        const body = {
          name: newMenu.name,
          chat_bar_text: newMenu.chat_bar_text,
          width: preset.width,
          height: preset.height,
          areas: newMenu.areas.map((a) => ({
            x: a.x,
            y: a.y,
            width: a.width,
            height: a.height,
            action_type: a.action_type,
            action_value: a.action_value
          })),
          set_default: newMenu.set_default
        };
        const res = await fetch("/api/lineoa-richmenu", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content)
          },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        if (res.ok) {
          toast.add({ severity: "success", summary: data.message || "สร้าง Rich Menu สำเร็จ", life: 3e3 });
          if (menuImage.value) {
            await uploadImageToMenu(data.richMenuId);
          }
          showCreateMenu.value = false;
          await fetchRichMenu();
        } else {
          toast.add({ severity: "error", summary: data.error || "สร้างไม่สำเร็จ", life: 5e3 });
        }
      } catch (e) {
        toast.add({ severity: "error", summary: "เกิดข้อผิดพลาด", life: 3e3 });
      }
      creatingMenu.value = false;
    };
    const menuImage = ref(null);
    const menuImagePreview = ref(null);
    const uploadingImage = ref(false);
    const onImageSelected = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      menuImage.value = file;
      menuImagePreview.value = URL.createObjectURL(file);
    };
    const uploadImageToMenu = async (richMenuId) => {
      var _a;
      if (!menuImage.value) return;
      uploadingImage.value = true;
      const formData = new FormData();
      formData.append("image", menuImage.value);
      try {
        const res = await fetch(`/api/lineoa-richmenu/${richMenuId}/image`, {
          method: "POST",
          headers: {
            "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content)
          },
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          toast.add({ severity: "success", summary: "อัพโหลดรูปสำเร็จ", life: 3e3 });
        } else {
          toast.add({ severity: "error", summary: data.error || "อัพโหลดไม่สำเร็จ", life: 5e3 });
        }
      } catch (e) {
        toast.add({ severity: "error", summary: "อัพโหลดรูปไม่สำเร็จ", life: 3e3 });
      }
      uploadingImage.value = false;
    };
    const existingMenuImage = ref(null);
    const uploadToExistingMenu = async (richMenuId) => {
      var _a;
      if (!existingMenuImage.value) return;
      uploadingImage.value = true;
      const formData = new FormData();
      formData.append("image", existingMenuImage.value);
      try {
        const res = await fetch(`/api/lineoa-richmenu/${richMenuId}/image`, {
          method: "POST",
          headers: {
            "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content)
          },
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          toast.add({ severity: "success", summary: "อัพโหลดรูปสำเร็จ", life: 3e3 });
          await fetchRichMenu();
        } else {
          toast.add({ severity: "error", summary: data.error || "อัพโหลดไม่สำเร็จ", life: 5e3 });
        }
      } catch (e) {
        toast.add({ severity: "error", summary: "อัพโหลดรูปไม่สำเร็จ", life: 3e3 });
      }
      existingMenuImage.value = null;
      uploadingImage.value = false;
    };
    const setDefault = async (richMenuId) => {
      var _a;
      try {
        const res = await fetch(`/api/lineoa-richmenu/${richMenuId}/default`, {
          method: "POST",
          headers: {
            "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content)
          }
        });
        const data = await res.json();
        if (res.ok) {
          toast.add({ severity: "success", summary: "ตั้ง default สำเร็จ", life: 3e3 });
          defaultRichMenuId.value = richMenuId;
        } else {
          toast.add({ severity: "error", summary: data.error, life: 5e3 });
        }
      } catch (e) {
        toast.add({ severity: "error", summary: "เกิดข้อผิดพลาด", life: 3e3 });
      }
    };
    const deleteMenu = async (richMenuId) => {
      var _a;
      if (!confirm("ต้องการลบ Rich Menu นี้?")) return;
      try {
        const res = await fetch(`/api/lineoa-richmenu/${richMenuId}`, {
          method: "DELETE",
          headers: {
            "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content)
          }
        });
        const data = await res.json();
        if (res.ok) {
          toast.add({ severity: "success", summary: "ลบสำเร็จ", life: 3e3 });
          richMenus.value = richMenus.value.filter((m) => m.richMenuId !== richMenuId);
        } else {
          toast.add({ severity: "error", summary: data.error, life: 5e3 });
        }
      } catch (e) {
        toast.add({ severity: "error", summary: "เกิดข้อผิดพลาด", life: 3e3 });
      }
    };
    const editingMenu = ref(null);
    const editAreas = ref([]);
    const updatingAreas = ref(false);
    const startEditAreas = (menu) => {
      editingMenu.value = menu;
      editAreas.value = menu.areas.map((area, i) => ({
        x: area.bounds.x,
        y: area.bounds.y,
        width: area.bounds.width,
        height: area.bounds.height,
        action_type: area.action.type,
        action_value: area.action.uri || area.action.text || area.action.data || "",
        label: `Area ${i + 1}`
      }));
    };
    const cancelEditAreas = () => {
      editingMenu.value = null;
      editAreas.value = [];
    };
    const updateAllAreasToLiff = () => {
      editAreas.value.forEach((area, i) => {
        if (area.action_type === "uri") {
          const menuItem = richMenuItems[i];
          if (menuItem) {
            area.action_value = props.settings.liff_base_url + (richMenuPaths[menuItem.key] || menuItem.defaultPath);
          }
        }
      });
    };
    const saveEditAreas = async () => {
      var _a;
      if (!editingMenu.value) return;
      updatingAreas.value = true;
      try {
        const res = await fetch(`/api/lineoa-richmenu/${editingMenu.value.richMenuId}/areas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": page.props.csrf_token || ((_a = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : _a.content)
          },
          body: JSON.stringify({
            areas: editAreas.value.map((a) => ({
              x: a.x,
              y: a.y,
              width: a.width,
              height: a.height,
              action_type: a.action_type,
              action_value: a.action_value
            }))
          })
        });
        const data = await res.json();
        if (res.ok) {
          toast.add({ severity: "success", summary: data.message || "อัพเดทสำเร็จ", life: 3e3 });
          cancelEditAreas();
          await fetchRichMenu();
        } else {
          toast.add({ severity: "error", summary: data.error || "อัพเดทไม่สำเร็จ", life: 5e3 });
        }
      } catch (e) {
        toast.add({ severity: "error", summary: "เกิดข้อผิดพลาด", life: 3e3 });
      }
      updatingAreas.value = false;
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
            _push2(`<div class="w-12 h-12 bg-[#06C755]/10 rounded-xl flex items-center justify-center"${_scopeId}><span class="text-2xl"${_scopeId}>📱</span></div><div${_scopeId}><div class="text-lg font-bold text-base-content m-0"${_scopeId}>LINE OA Manager</div><p class="text-xs text-base-content/50 m-0 mt-0.5"${_scopeId}>จัดการ LINE OA, Welcome Message, Rich Menu</p></div></div></div><div class="grid grid-cols-3 gap-2"${_scopeId}><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-primary"${_scopeId}>${ssrInterpolate(__props.quota.quota)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>โควต้า</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-warning"${_scopeId}>${ssrInterpolate(__props.quota.used)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>ใช้ไป</div></div><div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center"${_scopeId}><div class="text-lg font-black text-success"${_scopeId}>${ssrInterpolate(__props.quota.remaining)}</div><div class="text-[9px] text-base-content/50"${_scopeId}>เหลือ</div></div></div><div class="bg-base-100 rounded-xl border border-base-300 p-4"${_scopeId}><div class="text-sm font-bold text-base-content mb-2"${_scopeId}>LIFF URL</div><div class="flex items-center gap-2"${_scopeId}><code class="text-xs bg-base-200 px-2 py-1 rounded-lg flex-1 break-all"${_scopeId}>${ssrInterpolate(__props.settings.liff_base_url)}</code><button class="btn btn-ghost btn-xs"${_scopeId}><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"${_scopeId}></path></svg></button></div><div class="text-[10px] text-base-content/40 mt-1"${_scopeId}>LIFF ID: ${ssrInterpolate(__props.settings.liff_id)}</div></div><div class="collapse collapse-arrow bg-base-100 rounded-xl border border-base-300"${_scopeId}><input type="checkbox"${_scopeId}><div class="collapse-title text-sm font-bold text-base-content"${_scopeId}>ตั้งค่า LINE OA</div><div class="collapse-content space-y-3"${_scopeId}><div${_scopeId}><label class="text-xs font-medium text-base-content/70 block mb-1"${_scopeId}>Channel Access Token</label><div class="flex gap-2"${_scopeId}><input${ssrRenderAttr("type", showToken.value ? "text" : "password")}${ssrRenderDynamicModel(showToken.value ? "text" : "password", form.channel_access_token, null)}${ssrRenderAttr("placeholder", __props.settings.channel_access_token_set ? __props.settings.channel_access_token : "ใส่ token ใหม่...")} class="input input-bordered input-sm flex-1 text-xs"${_scopeId}><button class="btn btn-ghost btn-sm btn-square"${_scopeId}>`);
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
            _push2(` ${ssrInterpolate(saving.value ? "กำลังบันทึก..." : "บันทึกการตั้งค่า")}</button></div></div><div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>Welcome Message</div><p class="text-[10px] text-base-content/50 m-0"${_scopeId}>ข้อความต้อนรับเมื่อ user เพิ่มเพื่อน LINE OA (webhook follow event)</p><div class="space-y-2"${_scopeId}><div${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>หัวข้อ</label><input type="text"${ssrRenderAttr("value", welcomeForm.title)} class="input input-bordered input-sm w-full text-xs"${_scopeId}></div><div${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>คำอธิบาย</label><input type="text"${ssrRenderAttr("value", welcomeForm.subtitle)} class="input input-bordered input-sm w-full text-xs"${_scopeId}></div><div${_scopeId}><div class="flex items-center justify-between mb-1"${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>รายการฟีเจอร์</label><button${ssrIncludeBooleanAttr(welcomeForm.features.length >= 6) ? " disabled" : ""} class="btn btn-ghost btn-xs"${_scopeId}>+ เพิ่ม</button></div><!--[-->`);
            ssrRenderList(welcomeForm.features, (feat, idx) => {
              _push2(`<div class="flex items-center gap-1 mb-1"${_scopeId}><input type="text"${ssrRenderAttr("value", feat.icon)} class="input input-bordered input-xs w-12 text-center text-sm" maxlength="4"${_scopeId}><input type="text"${ssrRenderAttr("value", feat.text)} class="input input-bordered input-xs flex-1 text-xs" placeholder="รายละเอียด"${_scopeId}><button class="btn btn-ghost btn-xs text-error btn-square"${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"${_scopeId}></path></svg></button></div>`);
            });
            _push2(`<!--]--></div><div class="grid grid-cols-2 gap-2"${_scopeId}><div${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>ปุ่ม Label</label><input type="text"${ssrRenderAttr("value", welcomeForm.button_label)} class="input input-bordered input-xs w-full text-xs"${_scopeId}></div><div${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>ปุ่ม Path</label><input type="text"${ssrRenderAttr("value", welcomeForm.button_path)} class="input input-bordered input-xs w-full text-xs font-mono"${_scopeId}></div></div><div class="grid grid-cols-2 gap-2"${_scopeId}><div${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>สี Header</label><div class="flex gap-1 items-center"${_scopeId}><input type="color"${ssrRenderAttr("value", welcomeForm.header_color)} class="w-8 h-8 rounded cursor-pointer border-0"${_scopeId}><input type="text"${ssrRenderAttr("value", welcomeForm.header_color)} class="input input-bordered input-xs flex-1 text-xs font-mono"${_scopeId}></div></div><div${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>สีปุ่ม</label><div class="flex gap-1 items-center"${_scopeId}><input type="color"${ssrRenderAttr("value", welcomeForm.button_color)} class="w-8 h-8 rounded cursor-pointer border-0"${_scopeId}><input type="text"${ssrRenderAttr("value", welcomeForm.button_color)} class="input input-bordered input-xs flex-1 text-xs font-mono"${_scopeId}></div></div></div></div><button${ssrIncludeBooleanAttr(savingWelcome.value) ? " disabled" : ""} class="btn btn-primary btn-sm w-full"${_scopeId}>`);
            if (savingWelcome.value) {
              _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(savingWelcome.value ? "กำลังบันทึก..." : "บันทึก Welcome Message")}</button><div class="divider text-xs text-base-content/40 m-0"${_scopeId}>Preview</div><div style="${ssrRenderStyle({ backgroundColor: welcomeForm.header_color })}" class="rounded-xl p-4 space-y-2"${_scopeId}><div class="text-center"${_scopeId}><img src="https://badmintonparty.com/icons/logo2.png" class="h-12 mx-auto" alt="Logo"${_scopeId}></div><div class="text-center"${_scopeId}><div class="text-sm font-bold text-[#166534]"${_scopeId}>${ssrInterpolate(welcomeForm.title)}</div><div class="text-[10px] text-[#666]"${_scopeId}>${ssrInterpolate(welcomeForm.subtitle)}</div></div><div class="border-t border-[#166534]/10 pt-2 space-y-1"${_scopeId}><!--[-->`);
            ssrRenderList(welcomeForm.features, (feat, idx) => {
              _push2(`<div class="text-[10px]"${_scopeId}>${ssrInterpolate(feat.icon)} ${ssrInterpolate(feat.text)}</div>`);
            });
            _push2(`<!--]--></div><div class="text-center pt-2"${_scopeId}><div style="${ssrRenderStyle({ backgroundColor: welcomeForm.button_color })}" class="text-white text-xs font-bold py-2 rounded-lg"${_scopeId}>${ssrInterpolate(welcomeForm.button_label)}</div><div class="text-[10px] text-[#166534] font-bold mt-1"${_scopeId}>เข้าสู่เว็บไซต์</div></div><div class="text-[10px] text-base-content/40 text-center mt-1"${_scopeId}> ปุ่มเขียวจะเปิด: ${ssrInterpolate(__props.settings.liff_base_url)}${ssrInterpolate(welcomeForm.button_path)}</div></div><div class="divider text-xs text-base-content/40 m-0"${_scopeId}>ทดสอบ</div><div${_scopeId}><div class="flex items-center justify-between mb-1"${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>เลือกผู้รับ (${ssrInterpolate(selectedUserIds.value.length)}/${ssrInterpolate(__props.lineUsers.length)})</label><button class="btn btn-ghost btn-xs"${_scopeId}>${ssrInterpolate(selectedUserIds.value.length === filteredLineUsers.value.length && filteredLineUsers.value.length > 0 ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด")}</button></div><input type="text"${ssrRenderAttr("value", userSearch.value)} placeholder="ค้นหาชื่อ..." class="input input-bordered input-xs w-full text-xs mb-2"${_scopeId}><div class="max-h-48 overflow-y-auto space-y-1 border border-base-300 rounded-lg p-2"${_scopeId}>`);
            if (filteredLineUsers.value.length === 0) {
              _push2(`<div class="text-xs text-base-content/40 text-center py-2"${_scopeId}> ไม่พบผู้ใช้ที่เชื่อมต่อ LINE </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(filteredLineUsers.value, (user) => {
              var _a;
              _push2(`<label class="${ssrRenderClass([{ "bg-success/10": selectedUserIds.value.includes(user.line_user_id) }, "flex items-center gap-2 p-1.5 rounded-lg cursor-pointer hover:bg-base-200 transition-colors"])}"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(selectedUserIds.value.includes(user.line_user_id)) ? " checked" : ""} class="checkbox checkbox-xs checkbox-success"${_scopeId}><div class="w-7 h-7 rounded-full overflow-hidden bg-base-300 shrink-0"${_scopeId}>`);
              if (user.avatar) {
                _push2(`<img${ssrRenderAttr("src", user.avatar)} class="w-full h-full object-cover" alt=""${_scopeId}>`);
              } else {
                _push2(`<div class="w-full h-full flex items-center justify-center text-[10px] font-bold text-base-content/50"${_scopeId}>${ssrInterpolate(((_a = user.name) == null ? void 0 : _a.charAt(0)) || "?")}</div>`);
              }
              _push2(`</div><div class="flex-1 min-w-0"${_scopeId}><div class="text-xs font-semibold text-base-content truncate"${_scopeId}>${ssrInterpolate(user.name || "ไม่ระบุ")}</div><div class="text-[9px] text-base-content/40 font-mono truncate"${_scopeId}>${ssrInterpolate(user.line_user_id)}</div></div></label>`);
            });
            _push2(`<!--]--></div></div>`);
            if (__props.quota.quota > 0) {
              _push2(`<div class="flex items-center justify-between text-[10px] px-1"${_scopeId}><span class="text-base-content/50"${_scopeId}>Credit คงเหลือ</span><span class="${ssrRenderClass(__props.quota.remaining < selectedUserIds.value.length ? "text-error font-bold" : "text-success font-bold")}"${_scopeId}>${ssrInterpolate(__props.quota.remaining)} / ${ssrInterpolate(__props.quota.quota)} `);
              if (selectedUserIds.value.length > 0) {
                _push2(`<span class="text-base-content/40 font-normal"${_scopeId}> (ใช้ ${ssrInterpolate(selectedUserIds.value.length)}, เหลือ ${ssrInterpolate(__props.quota.remaining - selectedUserIds.value.length)}) </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</span></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<button${ssrIncludeBooleanAttr(sending.value || selectedUserIds.value.length === 0) ? " disabled" : ""} class="btn btn-success btn-sm w-full text-white"${_scopeId}>`);
            if (sending.value) {
              _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(` ${ssrInterpolate(sending.value ? "กำลังส่ง..." : `ส่ง Welcome Message (${selectedUserIds.value.length} คน)`)}</button></div><div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>Rich Menu LIFF Paths</div><p class="text-[10px] text-base-content/50 m-0"${_scopeId}>กำหนด path สำหรับแต่ละปุ่ม Rich Menu — ใช้สร้าง/อัพเดท Rich Menu อัตโนมัติ</p><!--[-->`);
            ssrRenderList(richMenuItems, (item) => {
              _push2(`<div class="flex items-center gap-2"${_scopeId}><span class="text-lg w-7 text-center"${_scopeId}>${ssrInterpolate(item.icon)}</span><div class="flex-1 min-w-0"${_scopeId}><div class="text-xs font-semibold text-base-content"${_scopeId}>${ssrInterpolate(item.label)}</div><input type="text"${ssrRenderAttr("value", richMenuPaths[item.key])} class="input input-bordered input-xs w-full text-[10px] font-mono"${_scopeId}><div class="text-[10px] text-base-content/40 font-mono break-all mt-0.5"${_scopeId}>${ssrInterpolate(__props.settings.liff_base_url)}${ssrInterpolate(richMenuPaths[item.key])}</div></div><button class="btn btn-ghost btn-xs btn-square shrink-0" title="คัดลอก"${_scopeId}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"${_scopeId}></path></svg></button></div>`);
            });
            _push2(`<!--]--><button class="btn btn-outline btn-sm w-full"${_scopeId}>บันทึก Rich Menu Config</button></div><div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="text-sm font-bold text-base-content"${_scopeId}>Rich Menu (LINE API)</div><div class="flex gap-1"${_scopeId}><button class="btn btn-primary btn-xs"${_scopeId}>${ssrInterpolate(showCreateMenu.value ? "ปิด" : "+ สร้างใหม่")}</button><button${ssrIncludeBooleanAttr(loadingMenus.value) ? " disabled" : ""} class="btn btn-ghost btn-xs"${_scopeId}>`);
            if (loadingMenus.value) {
              _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
            } else {
              _push2(`<span${_scopeId}>โหลด</span>`);
            }
            _push2(`</button></div></div>`);
            if (showCreateMenu.value) {
              _push2(`<div class="border border-primary/30 rounded-xl p-3 space-y-3 bg-primary/5"${_scopeId}><div class="text-xs font-bold text-primary"${_scopeId}>สร้าง Rich Menu ใหม่</div><div class="grid grid-cols-2 gap-2"${_scopeId}><div${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>ชื่อ Menu</label><input type="text"${ssrRenderAttr("value", newMenu.name)} class="input input-bordered input-xs w-full text-xs"${_scopeId}></div><div${_scopeId}><label class="text-xs font-medium text-base-content/70"${_scopeId}>Chat Bar Text</label><input type="text"${ssrRenderAttr("value", newMenu.chat_bar_text)} maxlength="14" class="input input-bordered input-xs w-full text-xs"${_scopeId}></div></div><div${_scopeId}><label class="text-xs font-medium text-base-content/70 block mb-1"${_scopeId}>Grid Layout</label><div class="flex flex-wrap gap-1"${_scopeId}><!--[-->`);
              ssrRenderList(gridPresets, (preset, idx) => {
                _push2(`<button class="${ssrRenderClass(["btn btn-xs", newMenu.preset === idx ? "btn-primary" : "btn-outline"])}"${_scopeId}>${ssrInterpolate(preset.label)}</button>`);
              });
              _push2(`<!--]--></div><div class="text-[10px] text-base-content/40 mt-1"${_scopeId}>${ssrInterpolate(selectedPreset.value.width)}x${ssrInterpolate(selectedPreset.value.height)} · ${ssrInterpolate(selectedPreset.value.cols * selectedPreset.value.rows)} areas </div></div><div class="space-y-1.5"${_scopeId}><div class="text-xs font-medium text-base-content/70"${_scopeId}>Areas</div><!--[-->`);
              ssrRenderList(newMenu.areas, (area, idx) => {
                _push2(`<div class="flex items-center gap-1"${_scopeId}><span class="text-[10px] text-base-content/40 w-5 shrink-0"${_scopeId}>${ssrInterpolate(idx + 1)}</span><select class="select select-bordered select-xs text-[10px] w-16 shrink-0"${_scopeId}><option value="uri"${ssrIncludeBooleanAttr(Array.isArray(area.action_type) ? ssrLooseContain(area.action_type, "uri") : ssrLooseEqual(area.action_type, "uri")) ? " selected" : ""}${_scopeId}>URI</option><option value="message"${ssrIncludeBooleanAttr(Array.isArray(area.action_type) ? ssrLooseContain(area.action_type, "message") : ssrLooseEqual(area.action_type, "message")) ? " selected" : ""}${_scopeId}>MSG</option></select><input type="text"${ssrRenderAttr("value", area.action_value)} class="input input-bordered input-xs flex-1 text-[10px] font-mono"${ssrRenderAttr("placeholder", area.action_type === "uri" ? "https://liff.line.me/..." : "ข้อความ")}${_scopeId}></div>`);
              });
              _push2(`<!--]--></div><div${_scopeId}><label class="text-xs font-medium text-base-content/70 block mb-1"${_scopeId}>รูป Rich Menu (PNG/JPG, max 2MB)</label><input type="file" accept="image/png,image/jpeg" class="file-input file-input-bordered file-input-xs w-full text-xs"${_scopeId}>`);
              if (menuImagePreview.value) {
                _push2(`<div class="mt-2"${_scopeId}><img${ssrRenderAttr("src", menuImagePreview.value)} class="w-full rounded-lg border border-base-300" alt="Preview"${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="text-[10px] text-base-content/40 mt-1"${_scopeId}> ขนาดแนะนำ: ${ssrInterpolate(selectedPreset.value.width)}x${ssrInterpolate(selectedPreset.value.height)}px </div></div><label class="flex items-center gap-2 cursor-pointer"${_scopeId}><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(newMenu.set_default) ? ssrLooseContain(newMenu.set_default, null) : newMenu.set_default) ? " checked" : ""} class="checkbox checkbox-xs checkbox-primary"${_scopeId}><span class="text-xs"${_scopeId}>ตั้งเป็น default Rich Menu</span></label><button${ssrIncludeBooleanAttr(creatingMenu.value) ? " disabled" : ""} class="btn btn-primary btn-sm w-full"${_scopeId}>`);
              if (creatingMenu.value) {
                _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(` ${ssrInterpolate(creatingMenu.value ? "กำลังสร้าง..." : "สร้าง Rich Menu")}</button></div>`);
            } else {
              _push2(`<!---->`);
            }
            if (richMenus.value.length === 0 && !loadingMenus.value) {
              _push2(`<div class="text-xs text-base-content/40 text-center py-4"${_scopeId}> กด &quot;โหลด&quot; เพื่อดึงข้อมูล Rich Menu จาก LINE API </div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<!--[-->`);
            ssrRenderList(richMenus.value, (menu) => {
              var _a, _b, _c, _d, _e;
              _push2(`<div class="border border-base-300 rounded-lg p-3 space-y-2"${_scopeId}><div class="flex items-center gap-2"${_scopeId}><div class="text-xs font-bold text-base-content flex-1 truncate"${_scopeId}>${ssrInterpolate(menu.name)}</div>`);
              if (menu.richMenuId === defaultRichMenuId.value) {
                _push2(`<span class="badge badge-xs badge-success"${_scopeId}>default</span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div><div class="text-[10px] text-base-content/40 font-mono break-all"${_scopeId}>ID: ${ssrInterpolate(menu.richMenuId)}</div><div class="text-[10px] text-base-content/50"${_scopeId}>${ssrInterpolate((_a = menu.size) == null ? void 0 : _a.width)}x${ssrInterpolate((_b = menu.size) == null ? void 0 : _b.height)} · ${ssrInterpolate((_c = menu.areas) == null ? void 0 : _c.length)} areas</div>`);
              if (menu.imageUrl) {
                _push2(`<div${_scopeId}><img${ssrRenderAttr("src", menu.imageUrl)} class="w-full rounded-lg border border-base-300" alt="Rich Menu"${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (((_d = editingMenu.value) == null ? void 0 : _d.richMenuId) === menu.richMenuId) {
                _push2(`<div class="border border-warning/30 rounded-lg p-2 bg-warning/5 space-y-1.5"${_scopeId}><div class="flex items-center justify-between"${_scopeId}><div class="text-xs font-bold text-warning"${_scopeId}>แก้ไข Areas</div><button class="btn btn-warning btn-xs"${_scopeId}>ใช้ LIFF URL ทั้งหมด</button></div><!--[-->`);
                ssrRenderList(editAreas.value, (area, i) => {
                  _push2(`<div class="flex items-center gap-1"${_scopeId}><span class="text-[10px] text-base-content/40 w-5 shrink-0"${_scopeId}>${ssrInterpolate(i + 1)}</span><select class="select select-bordered select-xs text-[10px] w-16 shrink-0"${_scopeId}><option value="uri"${ssrIncludeBooleanAttr(Array.isArray(area.action_type) ? ssrLooseContain(area.action_type, "uri") : ssrLooseEqual(area.action_type, "uri")) ? " selected" : ""}${_scopeId}>URI</option><option value="message"${ssrIncludeBooleanAttr(Array.isArray(area.action_type) ? ssrLooseContain(area.action_type, "message") : ssrLooseEqual(area.action_type, "message")) ? " selected" : ""}${_scopeId}>MSG</option></select><input type="text"${ssrRenderAttr("value", area.action_value)} class="input input-bordered input-xs flex-1 text-[10px] font-mono"${_scopeId}></div>`);
                });
                _push2(`<!--]--><div class="flex gap-1 mt-2"${_scopeId}><button${ssrIncludeBooleanAttr(updatingAreas.value) ? " disabled" : ""} class="btn btn-warning btn-xs flex-1"${_scopeId}>`);
                if (updatingAreas.value) {
                  _push2(`<span class="loading loading-spinner loading-xs"${_scopeId}></span>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(` ${ssrInterpolate(updatingAreas.value ? "กำลังอัพเดท..." : "บันทึก Areas")}</button><button class="btn btn-ghost btn-xs"${_scopeId}>ยกเลิก</button></div></div>`);
              } else {
                _push2(`<!--[-->`);
                if (menu.areas) {
                  _push2(`<div class="space-y-1"${_scopeId}><!--[-->`);
                  ssrRenderList(menu.areas, (area, i) => {
                    var _a2, _b2, _c2, _d2;
                    _push2(`<div class="text-[10px] bg-base-200 rounded px-2 py-1"${_scopeId}><span class="text-base-content/50"${_scopeId}>Area ${ssrInterpolate(i + 1)}:</span>`);
                    if (((_a2 = area.action) == null ? void 0 : _a2.type) === "uri") {
                      _push2(`<span class="font-mono text-primary ml-1 break-all"${_scopeId}>${ssrInterpolate(area.action.uri)}</span>`);
                    } else {
                      _push2(`<span class="text-base-content/40 ml-1"${_scopeId}>${ssrInterpolate((_b2 = area.action) == null ? void 0 : _b2.type)}: ${ssrInterpolate(((_c2 = area.action) == null ? void 0 : _c2.text) || ((_d2 = area.action) == null ? void 0 : _d2.label))}</span>`);
                    }
                    _push2(`</div>`);
                  });
                  _push2(`<!--]--></div>`);
                } else {
                  _push2(`<!---->`);
                }
                _push2(`<!--]-->`);
              }
              _push2(`<div class="flex items-center gap-1"${_scopeId}><input type="file" accept="image/png,image/jpeg" class="file-input file-input-bordered file-input-xs flex-1 text-[10px]"${_scopeId}></div><div class="flex gap-1 flex-wrap"${_scopeId}>`);
              if (menu.richMenuId !== defaultRichMenuId.value) {
                _push2(`<button class="btn btn-outline btn-xs btn-success flex-1"${_scopeId}>ตั้ง default</button>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<button class="btn btn-outline btn-xs btn-warning flex-1"${ssrIncludeBooleanAttr(((_e = editingMenu.value) == null ? void 0 : _e.richMenuId) === menu.richMenuId) ? " disabled" : ""}${_scopeId}>แก้ไข Areas</button><button class="btn btn-outline btn-xs btn-error flex-1"${_scopeId}>ลบ</button></div></div>`);
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
                createVNode("div", { class: "collapse collapse-arrow bg-base-100 rounded-xl border border-base-300" }, [
                  createVNode("input", { type: "checkbox" }),
                  createVNode("div", { class: "collapse-title text-sm font-bold text-base-content" }, "ตั้งค่า LINE OA"),
                  createVNode("div", { class: "collapse-content space-y-3" }, [
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
                  ])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4 space-y-3" }, [
                  createVNode("div", { class: "text-sm font-bold text-base-content" }, "Welcome Message"),
                  createVNode("p", { class: "text-[10px] text-base-content/50 m-0" }, "ข้อความต้อนรับเมื่อ user เพิ่มเพื่อน LINE OA (webhook follow event)"),
                  createVNode("div", { class: "space-y-2" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "หัวข้อ"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => welcomeForm.title = $event,
                        class: "input input-bordered input-sm w-full text-xs"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, welcomeForm.title]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "คำอธิบาย"),
                      withDirectives(createVNode("input", {
                        type: "text",
                        "onUpdate:modelValue": ($event) => welcomeForm.subtitle = $event,
                        class: "input input-bordered input-sm w-full text-xs"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelText, welcomeForm.subtitle]
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("div", { class: "flex items-center justify-between mb-1" }, [
                        createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "รายการฟีเจอร์"),
                        createVNode("button", {
                          onClick: addFeature,
                          disabled: welcomeForm.features.length >= 6,
                          class: "btn btn-ghost btn-xs"
                        }, "+ เพิ่ม", 8, ["disabled"])
                      ]),
                      (openBlock(true), createBlock(Fragment, null, renderList(welcomeForm.features, (feat, idx) => {
                        return openBlock(), createBlock("div", {
                          key: idx,
                          class: "flex items-center gap-1 mb-1"
                        }, [
                          withDirectives(createVNode("input", {
                            type: "text",
                            "onUpdate:modelValue": ($event) => feat.icon = $event,
                            class: "input input-bordered input-xs w-12 text-center text-sm",
                            maxlength: "4"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, feat.icon]
                          ]),
                          withDirectives(createVNode("input", {
                            type: "text",
                            "onUpdate:modelValue": ($event) => feat.text = $event,
                            class: "input input-bordered input-xs flex-1 text-xs",
                            placeholder: "รายละเอียด"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, feat.text]
                          ]),
                          createVNode("button", {
                            onClick: ($event) => removeFeature(idx),
                            class: "btn btn-ghost btn-xs text-error btn-square"
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
                                d: "M6 18L18 6M6 6l12 12"
                              })
                            ]))
                          ], 8, ["onClick"])
                        ]);
                      }), 128))
                    ]),
                    createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "ปุ่ม Label"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => welcomeForm.button_label = $event,
                          class: "input input-bordered input-xs w-full text-xs"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, welcomeForm.button_label]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "ปุ่ม Path"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => welcomeForm.button_path = $event,
                          class: "input input-bordered input-xs w-full text-xs font-mono"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, welcomeForm.button_path]
                        ])
                      ])
                    ]),
                    createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "สี Header"),
                        createVNode("div", { class: "flex gap-1 items-center" }, [
                          withDirectives(createVNode("input", {
                            type: "color",
                            "onUpdate:modelValue": ($event) => welcomeForm.header_color = $event,
                            class: "w-8 h-8 rounded cursor-pointer border-0"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, welcomeForm.header_color]
                          ]),
                          withDirectives(createVNode("input", {
                            type: "text",
                            "onUpdate:modelValue": ($event) => welcomeForm.header_color = $event,
                            class: "input input-bordered input-xs flex-1 text-xs font-mono"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, welcomeForm.header_color]
                          ])
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "สีปุ่ม"),
                        createVNode("div", { class: "flex gap-1 items-center" }, [
                          withDirectives(createVNode("input", {
                            type: "color",
                            "onUpdate:modelValue": ($event) => welcomeForm.button_color = $event,
                            class: "w-8 h-8 rounded cursor-pointer border-0"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, welcomeForm.button_color]
                          ]),
                          withDirectives(createVNode("input", {
                            type: "text",
                            "onUpdate:modelValue": ($event) => welcomeForm.button_color = $event,
                            class: "input input-bordered input-xs flex-1 text-xs font-mono"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelText, welcomeForm.button_color]
                          ])
                        ])
                      ])
                    ])
                  ]),
                  createVNode("button", {
                    onClick: saveWelcome,
                    disabled: savingWelcome.value,
                    class: "btn btn-primary btn-sm w-full"
                  }, [
                    savingWelcome.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "loading loading-spinner loading-xs"
                    })) : createCommentVNode("", true),
                    createTextVNode(" " + toDisplayString(savingWelcome.value ? "กำลังบันทึก..." : "บันทึก Welcome Message"), 1)
                  ], 8, ["disabled"]),
                  createVNode("div", { class: "divider text-xs text-base-content/40 m-0" }, "Preview"),
                  createVNode("div", {
                    style: { backgroundColor: welcomeForm.header_color },
                    class: "rounded-xl p-4 space-y-2"
                  }, [
                    createVNode("div", { class: "text-center" }, [
                      createVNode("img", {
                        src: "https://badmintonparty.com/icons/logo2.png",
                        class: "h-12 mx-auto",
                        alt: "Logo"
                      })
                    ]),
                    createVNode("div", { class: "text-center" }, [
                      createVNode("div", { class: "text-sm font-bold text-[#166534]" }, toDisplayString(welcomeForm.title), 1),
                      createVNode("div", { class: "text-[10px] text-[#666]" }, toDisplayString(welcomeForm.subtitle), 1)
                    ]),
                    createVNode("div", { class: "border-t border-[#166534]/10 pt-2 space-y-1" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(welcomeForm.features, (feat, idx) => {
                        return openBlock(), createBlock("div", {
                          key: idx,
                          class: "text-[10px]"
                        }, toDisplayString(feat.icon) + " " + toDisplayString(feat.text), 1);
                      }), 128))
                    ]),
                    createVNode("div", { class: "text-center pt-2" }, [
                      createVNode("div", {
                        style: { backgroundColor: welcomeForm.button_color },
                        class: "text-white text-xs font-bold py-2 rounded-lg"
                      }, toDisplayString(welcomeForm.button_label), 5),
                      createVNode("div", { class: "text-[10px] text-[#166534] font-bold mt-1" }, "เข้าสู่เว็บไซต์")
                    ]),
                    createVNode("div", { class: "text-[10px] text-base-content/40 text-center mt-1" }, " ปุ่มเขียวจะเปิด: " + toDisplayString(__props.settings.liff_base_url) + toDisplayString(welcomeForm.button_path), 1)
                  ], 4),
                  createVNode("div", { class: "divider text-xs text-base-content/40 m-0" }, "ทดสอบ"),
                  createVNode("div", null, [
                    createVNode("div", { class: "flex items-center justify-between mb-1" }, [
                      createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "เลือกผู้รับ (" + toDisplayString(selectedUserIds.value.length) + "/" + toDisplayString(__props.lineUsers.length) + ")", 1),
                      createVNode("button", {
                        onClick: selectAll,
                        class: "btn btn-ghost btn-xs"
                      }, toDisplayString(selectedUserIds.value.length === filteredLineUsers.value.length && filteredLineUsers.value.length > 0 ? "ยกเลิกทั้งหมด" : "เลือกทั้งหมด"), 1)
                    ]),
                    withDirectives(createVNode("input", {
                      type: "text",
                      "onUpdate:modelValue": ($event) => userSearch.value = $event,
                      placeholder: "ค้นหาชื่อ...",
                      class: "input input-bordered input-xs w-full text-xs mb-2"
                    }, null, 8, ["onUpdate:modelValue"]), [
                      [vModelText, userSearch.value]
                    ]),
                    createVNode("div", { class: "max-h-48 overflow-y-auto space-y-1 border border-base-300 rounded-lg p-2" }, [
                      filteredLineUsers.value.length === 0 ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "text-xs text-base-content/40 text-center py-2"
                      }, " ไม่พบผู้ใช้ที่เชื่อมต่อ LINE ")) : createCommentVNode("", true),
                      (openBlock(true), createBlock(Fragment, null, renderList(filteredLineUsers.value, (user) => {
                        var _a;
                        return openBlock(), createBlock("label", {
                          key: user.line_user_id,
                          class: ["flex items-center gap-2 p-1.5 rounded-lg cursor-pointer hover:bg-base-200 transition-colors", { "bg-success/10": selectedUserIds.value.includes(user.line_user_id) }]
                        }, [
                          createVNode("input", {
                            type: "checkbox",
                            checked: selectedUserIds.value.includes(user.line_user_id),
                            onChange: ($event) => toggleUser(user.line_user_id),
                            class: "checkbox checkbox-xs checkbox-success"
                          }, null, 40, ["checked", "onChange"]),
                          createVNode("div", { class: "w-7 h-7 rounded-full overflow-hidden bg-base-300 shrink-0" }, [
                            user.avatar ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: user.avatar,
                              class: "w-full h-full object-cover",
                              alt: "",
                              onError: (e) => e.target.style.display = "none"
                            }, null, 40, ["src", "onError"])) : (openBlock(), createBlock("div", {
                              key: 1,
                              class: "w-full h-full flex items-center justify-center text-[10px] font-bold text-base-content/50"
                            }, toDisplayString(((_a = user.name) == null ? void 0 : _a.charAt(0)) || "?"), 1))
                          ]),
                          createVNode("div", { class: "flex-1 min-w-0" }, [
                            createVNode("div", { class: "text-xs font-semibold text-base-content truncate" }, toDisplayString(user.name || "ไม่ระบุ"), 1),
                            createVNode("div", { class: "text-[9px] text-base-content/40 font-mono truncate" }, toDisplayString(user.line_user_id), 1)
                          ])
                        ], 2);
                      }), 128))
                    ])
                  ]),
                  __props.quota.quota > 0 ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "flex items-center justify-between text-[10px] px-1"
                  }, [
                    createVNode("span", { class: "text-base-content/50" }, "Credit คงเหลือ"),
                    createVNode("span", {
                      class: __props.quota.remaining < selectedUserIds.value.length ? "text-error font-bold" : "text-success font-bold"
                    }, [
                      createTextVNode(toDisplayString(__props.quota.remaining) + " / " + toDisplayString(__props.quota.quota) + " ", 1),
                      selectedUserIds.value.length > 0 ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-base-content/40 font-normal"
                      }, " (ใช้ " + toDisplayString(selectedUserIds.value.length) + ", เหลือ " + toDisplayString(__props.quota.remaining - selectedUserIds.value.length) + ") ", 1)) : createCommentVNode("", true)
                    ], 2)
                  ])) : createCommentVNode("", true),
                  createVNode("button", {
                    onClick: sendTestWelcome,
                    disabled: sending.value || selectedUserIds.value.length === 0,
                    class: "btn btn-success btn-sm w-full text-white"
                  }, [
                    sending.value ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "loading loading-spinner loading-xs"
                    })) : createCommentVNode("", true),
                    createTextVNode(" " + toDisplayString(sending.value ? "กำลังส่ง..." : `ส่ง Welcome Message (${selectedUserIds.value.length} คน)`), 1)
                  ], 8, ["disabled"])
                ]),
                createVNode("div", { class: "bg-base-100 rounded-xl border border-base-300 p-4 space-y-3" }, [
                  createVNode("div", { class: "text-sm font-bold text-base-content" }, "Rich Menu LIFF Paths"),
                  createVNode("p", { class: "text-[10px] text-base-content/50 m-0" }, "กำหนด path สำหรับแต่ละปุ่ม Rich Menu — ใช้สร้าง/อัพเดท Rich Menu อัตโนมัติ"),
                  (openBlock(), createBlock(Fragment, null, renderList(richMenuItems, (item) => {
                    return createVNode("div", {
                      key: item.key,
                      class: "flex items-center gap-2"
                    }, [
                      createVNode("span", { class: "text-lg w-7 text-center" }, toDisplayString(item.icon), 1),
                      createVNode("div", { class: "flex-1 min-w-0" }, [
                        createVNode("div", { class: "text-xs font-semibold text-base-content" }, toDisplayString(item.label), 1),
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => richMenuPaths[item.key] = $event,
                          class: "input input-bordered input-xs w-full text-[10px] font-mono"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, richMenuPaths[item.key]]
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
                  createVNode("div", { class: "flex items-center justify-between" }, [
                    createVNode("div", { class: "text-sm font-bold text-base-content" }, "Rich Menu (LINE API)"),
                    createVNode("div", { class: "flex gap-1" }, [
                      createVNode("button", {
                        onClick: ($event) => showCreateMenu.value = !showCreateMenu.value,
                        class: "btn btn-primary btn-xs"
                      }, toDisplayString(showCreateMenu.value ? "ปิด" : "+ สร้างใหม่"), 9, ["onClick"]),
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
                    ])
                  ]),
                  showCreateMenu.value ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "border border-primary/30 rounded-xl p-3 space-y-3 bg-primary/5"
                  }, [
                    createVNode("div", { class: "text-xs font-bold text-primary" }, "สร้าง Rich Menu ใหม่"),
                    createVNode("div", { class: "grid grid-cols-2 gap-2" }, [
                      createVNode("div", null, [
                        createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "ชื่อ Menu"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => newMenu.name = $event,
                          class: "input input-bordered input-xs w-full text-xs"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, newMenu.name]
                        ])
                      ]),
                      createVNode("div", null, [
                        createVNode("label", { class: "text-xs font-medium text-base-content/70" }, "Chat Bar Text"),
                        withDirectives(createVNode("input", {
                          type: "text",
                          "onUpdate:modelValue": ($event) => newMenu.chat_bar_text = $event,
                          maxlength: "14",
                          class: "input input-bordered input-xs w-full text-xs"
                        }, null, 8, ["onUpdate:modelValue"]), [
                          [vModelText, newMenu.chat_bar_text]
                        ])
                      ])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "text-xs font-medium text-base-content/70 block mb-1" }, "Grid Layout"),
                      createVNode("div", { class: "flex flex-wrap gap-1" }, [
                        (openBlock(), createBlock(Fragment, null, renderList(gridPresets, (preset, idx) => {
                          return createVNode("button", {
                            key: idx,
                            onClick: ($event) => {
                              newMenu.preset = idx;
                              generateAreas();
                            },
                            class: ["btn btn-xs", newMenu.preset === idx ? "btn-primary" : "btn-outline"]
                          }, toDisplayString(preset.label), 11, ["onClick"]);
                        }), 64))
                      ]),
                      createVNode("div", { class: "text-[10px] text-base-content/40 mt-1" }, toDisplayString(selectedPreset.value.width) + "x" + toDisplayString(selectedPreset.value.height) + " · " + toDisplayString(selectedPreset.value.cols * selectedPreset.value.rows) + " areas ", 1)
                    ]),
                    createVNode("div", { class: "space-y-1.5" }, [
                      createVNode("div", { class: "text-xs font-medium text-base-content/70" }, "Areas"),
                      (openBlock(true), createBlock(Fragment, null, renderList(newMenu.areas, (area, idx) => {
                        return openBlock(), createBlock("div", {
                          key: idx,
                          class: "flex items-center gap-1"
                        }, [
                          createVNode("span", { class: "text-[10px] text-base-content/40 w-5 shrink-0" }, toDisplayString(idx + 1), 1),
                          withDirectives(createVNode("select", {
                            "onUpdate:modelValue": ($event) => area.action_type = $event,
                            class: "select select-bordered select-xs text-[10px] w-16 shrink-0"
                          }, [
                            createVNode("option", { value: "uri" }, "URI"),
                            createVNode("option", { value: "message" }, "MSG")
                          ], 8, ["onUpdate:modelValue"]), [
                            [vModelSelect, area.action_type]
                          ]),
                          withDirectives(createVNode("input", {
                            type: "text",
                            "onUpdate:modelValue": ($event) => area.action_value = $event,
                            class: "input input-bordered input-xs flex-1 text-[10px] font-mono",
                            placeholder: area.action_type === "uri" ? "https://liff.line.me/..." : "ข้อความ"
                          }, null, 8, ["onUpdate:modelValue", "placeholder"]), [
                            [vModelText, area.action_value]
                          ])
                        ]);
                      }), 128))
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "text-xs font-medium text-base-content/70 block mb-1" }, "รูป Rich Menu (PNG/JPG, max 2MB)"),
                      createVNode("input", {
                        type: "file",
                        accept: "image/png,image/jpeg",
                        onChange: onImageSelected,
                        class: "file-input file-input-bordered file-input-xs w-full text-xs"
                      }, null, 32),
                      menuImagePreview.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "mt-2"
                      }, [
                        createVNode("img", {
                          src: menuImagePreview.value,
                          class: "w-full rounded-lg border border-base-300",
                          alt: "Preview"
                        }, null, 8, ["src"])
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "text-[10px] text-base-content/40 mt-1" }, " ขนาดแนะนำ: " + toDisplayString(selectedPreset.value.width) + "x" + toDisplayString(selectedPreset.value.height) + "px ", 1)
                    ]),
                    createVNode("label", { class: "flex items-center gap-2 cursor-pointer" }, [
                      withDirectives(createVNode("input", {
                        type: "checkbox",
                        "onUpdate:modelValue": ($event) => newMenu.set_default = $event,
                        class: "checkbox checkbox-xs checkbox-primary"
                      }, null, 8, ["onUpdate:modelValue"]), [
                        [vModelCheckbox, newMenu.set_default]
                      ]),
                      createVNode("span", { class: "text-xs" }, "ตั้งเป็น default Rich Menu")
                    ]),
                    createVNode("button", {
                      onClick: createRichMenu,
                      disabled: creatingMenu.value,
                      class: "btn btn-primary btn-sm w-full"
                    }, [
                      creatingMenu.value ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "loading loading-spinner loading-xs"
                      })) : createCommentVNode("", true),
                      createTextVNode(" " + toDisplayString(creatingMenu.value ? "กำลังสร้าง..." : "สร้าง Rich Menu"), 1)
                    ], 8, ["disabled"])
                  ])) : createCommentVNode("", true),
                  richMenus.value.length === 0 && !loadingMenus.value ? (openBlock(), createBlock("div", {
                    key: 1,
                    class: "text-xs text-base-content/40 text-center py-4"
                  }, ' กด "โหลด" เพื่อดึงข้อมูล Rich Menu จาก LINE API ')) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(richMenus.value, (menu) => {
                    var _a, _b, _c, _d, _e;
                    return openBlock(), createBlock("div", {
                      key: menu.richMenuId,
                      class: "border border-base-300 rounded-lg p-3 space-y-2"
                    }, [
                      createVNode("div", { class: "flex items-center gap-2" }, [
                        createVNode("div", { class: "text-xs font-bold text-base-content flex-1 truncate" }, toDisplayString(menu.name), 1),
                        menu.richMenuId === defaultRichMenuId.value ? (openBlock(), createBlock("span", {
                          key: 0,
                          class: "badge badge-xs badge-success"
                        }, "default")) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "text-[10px] text-base-content/40 font-mono break-all" }, "ID: " + toDisplayString(menu.richMenuId), 1),
                      createVNode("div", { class: "text-[10px] text-base-content/50" }, toDisplayString((_a = menu.size) == null ? void 0 : _a.width) + "x" + toDisplayString((_b = menu.size) == null ? void 0 : _b.height) + " · " + toDisplayString((_c = menu.areas) == null ? void 0 : _c.length) + " areas", 1),
                      menu.imageUrl ? (openBlock(), createBlock("div", { key: 0 }, [
                        createVNode("img", {
                          src: menu.imageUrl,
                          class: "w-full rounded-lg border border-base-300",
                          alt: "Rich Menu",
                          onError: (e) => e.target.style.display = "none"
                        }, null, 40, ["src", "onError"])
                      ])) : createCommentVNode("", true),
                      ((_d = editingMenu.value) == null ? void 0 : _d.richMenuId) === menu.richMenuId ? (openBlock(), createBlock("div", {
                        key: 1,
                        class: "border border-warning/30 rounded-lg p-2 bg-warning/5 space-y-1.5"
                      }, [
                        createVNode("div", { class: "flex items-center justify-between" }, [
                          createVNode("div", { class: "text-xs font-bold text-warning" }, "แก้ไข Areas"),
                          createVNode("button", {
                            onClick: updateAllAreasToLiff,
                            class: "btn btn-warning btn-xs"
                          }, "ใช้ LIFF URL ทั้งหมด")
                        ]),
                        (openBlock(true), createBlock(Fragment, null, renderList(editAreas.value, (area, i) => {
                          return openBlock(), createBlock("div", {
                            key: i,
                            class: "flex items-center gap-1"
                          }, [
                            createVNode("span", { class: "text-[10px] text-base-content/40 w-5 shrink-0" }, toDisplayString(i + 1), 1),
                            withDirectives(createVNode("select", {
                              "onUpdate:modelValue": ($event) => area.action_type = $event,
                              class: "select select-bordered select-xs text-[10px] w-16 shrink-0"
                            }, [
                              createVNode("option", { value: "uri" }, "URI"),
                              createVNode("option", { value: "message" }, "MSG")
                            ], 8, ["onUpdate:modelValue"]), [
                              [vModelSelect, area.action_type]
                            ]),
                            withDirectives(createVNode("input", {
                              type: "text",
                              "onUpdate:modelValue": ($event) => area.action_value = $event,
                              class: "input input-bordered input-xs flex-1 text-[10px] font-mono"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelText, area.action_value]
                            ])
                          ]);
                        }), 128)),
                        createVNode("div", { class: "flex gap-1 mt-2" }, [
                          createVNode("button", {
                            onClick: saveEditAreas,
                            disabled: updatingAreas.value,
                            class: "btn btn-warning btn-xs flex-1"
                          }, [
                            updatingAreas.value ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "loading loading-spinner loading-xs"
                            })) : createCommentVNode("", true),
                            createTextVNode(" " + toDisplayString(updatingAreas.value ? "กำลังอัพเดท..." : "บันทึก Areas"), 1)
                          ], 8, ["disabled"]),
                          createVNode("button", {
                            onClick: cancelEditAreas,
                            class: "btn btn-ghost btn-xs"
                          }, "ยกเลิก")
                        ])
                      ])) : (openBlock(), createBlock(Fragment, { key: 2 }, [
                        menu.areas ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "space-y-1"
                        }, [
                          (openBlock(true), createBlock(Fragment, null, renderList(menu.areas, (area, i) => {
                            var _a2, _b2, _c2, _d2;
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
                              }, toDisplayString((_b2 = area.action) == null ? void 0 : _b2.type) + ": " + toDisplayString(((_c2 = area.action) == null ? void 0 : _c2.text) || ((_d2 = area.action) == null ? void 0 : _d2.label)), 1))
                            ]);
                          }), 128))
                        ])) : createCommentVNode("", true)
                      ], 64)),
                      createVNode("div", { class: "flex items-center gap-1" }, [
                        createVNode("input", {
                          type: "file",
                          accept: "image/png,image/jpeg",
                          onChange: (e) => {
                            existingMenuImage.value = e.target.files[0];
                            uploadToExistingMenu(menu.richMenuId);
                          },
                          class: "file-input file-input-bordered file-input-xs flex-1 text-[10px]"
                        }, null, 40, ["onChange"])
                      ]),
                      createVNode("div", { class: "flex gap-1 flex-wrap" }, [
                        menu.richMenuId !== defaultRichMenuId.value ? (openBlock(), createBlock("button", {
                          key: 0,
                          onClick: ($event) => setDefault(menu.richMenuId),
                          class: "btn btn-outline btn-xs btn-success flex-1"
                        }, "ตั้ง default", 8, ["onClick"])) : createCommentVNode("", true),
                        createVNode("button", {
                          onClick: ($event) => startEditAreas(menu),
                          class: "btn btn-outline btn-xs btn-warning flex-1",
                          disabled: ((_e = editingMenu.value) == null ? void 0 : _e.richMenuId) === menu.richMenuId
                        }, "แก้ไข Areas", 8, ["onClick", "disabled"]),
                        createVNode("button", {
                          onClick: ($event) => deleteMenu(menu.richMenuId),
                          class: "btn btn-outline btn-xs btn-error flex-1"
                        }, "ลบ", 8, ["onClick"])
                      ])
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
