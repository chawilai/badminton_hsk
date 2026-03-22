<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { Head, Link, router, usePage } from "@inertiajs/vue3";
import { ref, reactive, onMounted, computed } from "vue";
import { useToast } from "@/composables/useToast";

const toast = useToast();
const page = usePage();

const props = defineProps({
  settings: { type: Object, default: () => ({}) },
  quota: { type: Object, default: () => ({}) },
  envConfig: { type: Object, default: () => ({}) },
});

// ==================== Settings Form ====================
const form = reactive({
  channel_access_token: '',
  channel_secret: '',
  liff_id: props.settings.liff_id || '',
  line_oa_id: props.settings.line_oa_id || '',
});

const showToken = ref(false);
const showSecret = ref(false);
const saving = ref(false);

const saveSettings = () => {
  saving.value = true;
  router.post('/lineoa-manager/update', form, {
    preserveScroll: true,
    onSuccess: () => { saving.value = false; },
    onError: () => { saving.value = false; },
  });
};

// ==================== Rich Menu Config (local paths) ====================
const richMenuItems = [
  { key: 'party_lists', label: 'Party Lists', icon: '🏸', defaultPath: '/party-lists' },
  { key: 'party', label: 'Party', icon: '🎉', defaultPath: '/my-parties' },
  { key: 'chat', label: 'Chat', icon: '💬', defaultPath: '/chat' },
  { key: 'stats', label: 'Stats', icon: '📊', defaultPath: '/profile' },
  { key: 'friend_list', label: 'Friend List', icon: '👥', defaultPath: '/friends' },
  { key: 'rank_board', label: 'Rank Board', icon: '🏆', defaultPath: '/party-lists' },
];

const richMenuPaths = reactive({});
richMenuItems.forEach(item => {
  const saved = props.settings.rich_menu_config?.[item.key];
  richMenuPaths[item.key] = saved || item.defaultPath;
});

const saveRichMenu = () => {
  router.post('/lineoa-manager/update', {
    rich_menu_config: { ...richMenuPaths },
  }, { preserveScroll: true });
};

// ==================== Welcome Message Editor ====================
const wmConfig = props.settings.welcome_message_config || {};
const welcomeForm = reactive({
  title: wmConfig.title || 'ยินดีต้อนรับสู่ Badminton Party!',
  subtitle: wmConfig.subtitle || 'ระบบจัดการปาร์ตี้แบดมินตันครบวงจร',
  button_label: wmConfig.button_label || 'เริ่มใช้งาน Badminton Party',
  button_path: wmConfig.button_path || '/party-lists',
  header_color: wmConfig.header_color || '#f0fdf4',
  button_color: wmConfig.button_color || '#22c55e',
  features: wmConfig.features || [
    { icon: '🏸', text: 'สร้างปาร์ตี้แบดมินตัน' },
    { icon: '👥', text: 'เข้าร่วมปาร์ตี้กับเพื่อนๆ' },
    { icon: '🎮', text: 'สร้างเกม จับคู่อัตโนมัติ Track จำนวนเกม' },
    { icon: '📊', text: 'บันทึก & ตรวจสอบประวัติการเล่น' },
  ],
});

const savingWelcome = ref(false);
const saveWelcome = () => {
  savingWelcome.value = true;
  router.post('/lineoa-manager/welcome-message', { ...welcomeForm }, {
    preserveScroll: true,
    onSuccess: () => { savingWelcome.value = false; },
    onError: () => { savingWelcome.value = false; },
  });
};

const addFeature = () => {
  if (welcomeForm.features.length < 6) {
    welcomeForm.features.push({ icon: '✨', text: '' });
  }
};

const removeFeature = (index) => {
  welcomeForm.features.splice(index, 1);
};

// Test welcome message
const testUserId = ref('');
const sending = ref(false);
const sendTestWelcome = () => {
  if (!testUserId.value) return;
  sending.value = true;
  router.post('/lineoa-manager/test-welcome', {
    line_user_id: testUserId.value,
  }, {
    preserveScroll: true,
    onSuccess: () => { sending.value = false; },
    onError: () => { sending.value = false; },
  });
};

// ==================== Rich Menu from LINE API ====================
const richMenus = ref([]);
const defaultRichMenuId = ref(null);
const loadingMenus = ref(false);

const fetchRichMenu = async () => {
  loadingMenus.value = true;
  try {
    const res = await fetch('/api/lineoa-richmenu');
    const data = await res.json();
    richMenus.value = data.richmenus || [];
    defaultRichMenuId.value = data.defaultRichMenuId;
  } catch (e) {
    toast.add({ severity: 'error', summary: 'ดึงข้อมูล Rich Menu ไม่สำเร็จ', life: 3000 });
  }
  loadingMenus.value = false;
};

// ==================== Rich Menu Editor ====================
const showCreateMenu = ref(false);
const creatingMenu = ref(false);

const gridPresets = [
  { label: '2x1 (ปกติ)', cols: 2, rows: 1, width: 2500, height: 843 },
  { label: '2x2', cols: 2, rows: 2, width: 2500, height: 1686 },
  { label: '3x1', cols: 3, rows: 1, width: 2500, height: 843 },
  { label: '3x2', cols: 3, rows: 2, width: 2500, height: 1686 },
  { label: '1x1', cols: 1, rows: 1, width: 2500, height: 843 },
  { label: '2x3', cols: 2, rows: 3, width: 2500, height: 1686 },
];

const newMenu = reactive({
  name: 'Badminton Party Menu',
  chat_bar_text: 'เมนู',
  preset: 1, // index into gridPresets, default 3x2
  areas: [],
  set_default: true,
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
        action_type: 'uri',
        action_value: menuItem
          ? props.settings.liff_base_url + (richMenuPaths[menuItem.key] || menuItem.defaultPath)
          : props.settings.liff_base_url + '/party-lists',
        label: menuItem ? menuItem.label : `Area ${idx + 1}`,
      });
    }
  }
  newMenu.areas = areas;
};

// Initialize areas
generateAreas();

const createRichMenu = async () => {
  creatingMenu.value = true;
  try {
    const preset = selectedPreset.value;
    const body = {
      name: newMenu.name,
      chat_bar_text: newMenu.chat_bar_text,
      width: preset.width,
      height: preset.height,
      areas: newMenu.areas.map(a => ({
        x: a.x, y: a.y, width: a.width, height: a.height,
        action_type: a.action_type,
        action_value: a.action_value,
      })),
      set_default: newMenu.set_default,
    };

    const res = await fetch('/api/lineoa-richmenu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (res.ok) {
      toast.add({ severity: 'success', summary: data.message || 'สร้าง Rich Menu สำเร็จ', life: 3000 });

      // If we have an image to upload
      if (menuImage.value) {
        await uploadImageToMenu(data.richMenuId);
      }

      showCreateMenu.value = false;
      await fetchRichMenu();
    } else {
      toast.add({ severity: 'error', summary: data.error || 'สร้างไม่สำเร็จ', life: 5000 });
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 3000 });
  }
  creatingMenu.value = false;
};

// ==================== Rich Menu Image Upload ====================
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
  if (!menuImage.value) return;
  uploadingImage.value = true;

  const formData = new FormData();
  formData.append('image', menuImage.value);

  try {
    const res = await fetch(`/api/lineoa-richmenu/${richMenuId}/image`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content,
      },
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      toast.add({ severity: 'success', summary: 'อัพโหลดรูปสำเร็จ', life: 3000 });
    } else {
      toast.add({ severity: 'error', summary: data.error || 'อัพโหลดไม่สำเร็จ', life: 5000 });
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'อัพโหลดรูปไม่สำเร็จ', life: 3000 });
  }
  uploadingImage.value = false;
};

// Upload image to existing menu
const existingMenuImage = ref(null);
const uploadToExistingMenu = async (richMenuId) => {
  if (!existingMenuImage.value) return;
  uploadingImage.value = true;

  const formData = new FormData();
  formData.append('image', existingMenuImage.value);

  try {
    const res = await fetch(`/api/lineoa-richmenu/${richMenuId}/image`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content,
      },
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      toast.add({ severity: 'success', summary: 'อัพโหลดรูปสำเร็จ', life: 3000 });
      await fetchRichMenu();
    } else {
      toast.add({ severity: 'error', summary: data.error || 'อัพโหลดไม่สำเร็จ', life: 5000 });
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'อัพโหลดรูปไม่สำเร็จ', life: 3000 });
  }
  existingMenuImage.value = null;
  uploadingImage.value = false;
};

// ==================== Rich Menu Actions ====================
const setDefault = async (richMenuId) => {
  try {
    const res = await fetch(`/api/lineoa-richmenu/${richMenuId}/default`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content,
      },
    });
    const data = await res.json();
    if (res.ok) {
      toast.add({ severity: 'success', summary: 'ตั้ง default สำเร็จ', life: 3000 });
      defaultRichMenuId.value = richMenuId;
    } else {
      toast.add({ severity: 'error', summary: data.error, life: 5000 });
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 3000 });
  }
};

const deleteMenu = async (richMenuId) => {
  if (!confirm('ต้องการลบ Rich Menu นี้?')) return;
  try {
    const res = await fetch(`/api/lineoa-richmenu/${richMenuId}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content,
      },
    });
    const data = await res.json();
    if (res.ok) {
      toast.add({ severity: 'success', summary: 'ลบสำเร็จ', life: 3000 });
      richMenus.value = richMenus.value.filter(m => m.richMenuId !== richMenuId);
    } else {
      toast.add({ severity: 'error', summary: data.error, life: 5000 });
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 3000 });
  }
};

// ==================== Edit Rich Menu Areas ====================
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
    action_value: area.action.uri || area.action.text || area.action.data || '',
    label: `Area ${i + 1}`,
  }));
};

const cancelEditAreas = () => {
  editingMenu.value = null;
  editAreas.value = [];
};

const updateAllAreasToLiff = () => {
  editAreas.value.forEach((area, i) => {
    if (area.action_type === 'uri') {
      const menuItem = richMenuItems[i];
      if (menuItem) {
        area.action_value = props.settings.liff_base_url + (richMenuPaths[menuItem.key] || menuItem.defaultPath);
      }
    }
  });
};

const saveEditAreas = async () => {
  if (!editingMenu.value) return;
  updatingAreas.value = true;

  try {
    const res = await fetch(`/api/lineoa-richmenu/${editingMenu.value.richMenuId}/areas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content,
      },
      body: JSON.stringify({
        areas: editAreas.value.map(a => ({
          x: a.x, y: a.y, width: a.width, height: a.height,
          action_type: a.action_type,
          action_value: a.action_value,
        })),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.add({ severity: 'success', summary: data.message || 'อัพเดทสำเร็จ', life: 3000 });
      cancelEditAreas();
      await fetchRichMenu();
    } else {
      toast.add({ severity: 'error', summary: data.error || 'อัพเดทไม่สำเร็จ', life: 5000 });
    }
  } catch (e) {
    toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 3000 });
  }
  updatingAreas.value = false;
};

// ==================== Flash messages ====================
onMounted(() => {
  if (page.props.flash?.success) {
    toast.add({ severity: 'success', summary: page.props.flash.success, life: 3000 });
  }
  if (page.props.flash?.error) {
    toast.add({ severity: 'error', summary: page.props.flash.error, life: 5000 });
  }
});

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.add({ severity: 'success', summary: 'คัดลอกแล้ว', life: 2000 });
  });
};

const getCsrfToken = () => {
  return page.props.csrf_token || document.querySelector('meta[name="csrf-token"]')?.content || '';
};
</script>

<template>
  <Head title="LINE OA Manager" />

  <AppLayout>
    <div class="space-y-4 pb-8">

      <!-- Header -->
      <div class="bg-gradient-to-br from-[#06C755]/10 to-[#06C755]/5 rounded-2xl p-5">
        <div class="flex items-center gap-3">
          <Link href="/admin" class="w-8 h-8 rounded-lg bg-base-100 flex items-center justify-center no-underline">
            <svg class="w-4 h-4 text-base-content" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
          </Link>
          <div class="w-12 h-12 bg-[#06C755]/10 rounded-xl flex items-center justify-center">
            <span class="text-2xl">📱</span>
          </div>
          <div>
            <div class="text-lg font-bold text-base-content m-0">LINE OA Manager</div>
            <p class="text-xs text-base-content/50 m-0 mt-0.5">จัดการ LINE OA, Welcome Message, Rich Menu</p>
          </div>
        </div>
      </div>

      <!-- Quota Stats -->
      <div class="grid grid-cols-3 gap-2">
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-lg font-black text-primary">{{ quota.quota }}</div>
          <div class="text-[9px] text-base-content/50">โควต้า</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-lg font-black text-warning">{{ quota.used }}</div>
          <div class="text-[9px] text-base-content/50">ใช้ไป</div>
        </div>
        <div class="bg-base-100 rounded-xl border border-base-300 p-3 text-center">
          <div class="text-lg font-black text-success">{{ quota.remaining }}</div>
          <div class="text-[9px] text-base-content/50">เหลือ</div>
        </div>
      </div>

      <!-- LIFF URL Info -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4">
        <div class="text-sm font-bold text-base-content mb-2">LIFF URL</div>
        <div class="flex items-center gap-2">
          <code class="text-xs bg-base-200 px-2 py-1 rounded-lg flex-1 break-all">{{ settings.liff_base_url }}</code>
          <button @click="copyToClipboard(settings.liff_base_url)" class="btn btn-ghost btn-xs">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </button>
        </div>
        <div class="text-[10px] text-base-content/40 mt-1">LIFF ID: {{ settings.liff_id }}</div>
      </div>

      <!-- Settings -->
      <div class="collapse collapse-arrow bg-base-100 rounded-xl border border-base-300">
        <input type="checkbox" />
        <div class="collapse-title text-sm font-bold text-base-content">ตั้งค่า LINE OA</div>
        <div class="collapse-content space-y-3">
          <!-- Channel Access Token -->
          <div>
            <label class="text-xs font-medium text-base-content/70 block mb-1">Channel Access Token</label>
            <div class="flex gap-2">
              <input :type="showToken ? 'text' : 'password'" v-model="form.channel_access_token"
                :placeholder="settings.channel_access_token_set ? settings.channel_access_token : 'ใส่ token ใหม่...'"
                class="input input-bordered input-sm flex-1 text-xs" />
              <button @click="showToken = !showToken" class="btn btn-ghost btn-sm btn-square">
                <svg v-if="!showToken" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              </button>
            </div>
            <div v-if="settings.channel_access_token_set" class="text-[10px] text-success mt-0.5">ตั้งค่าแล้ว (DB)</div>
            <div v-else-if="envConfig.token_set" class="text-[10px] text-info mt-0.5">ใช้จาก .env</div>
            <div v-else class="text-[10px] text-error mt-0.5">ยังไม่ได้ตั้งค่า</div>
          </div>

          <!-- Channel Secret -->
          <div>
            <label class="text-xs font-medium text-base-content/70 block mb-1">Channel Secret</label>
            <input :type="showSecret ? 'text' : 'password'" v-model="form.channel_secret"
              :placeholder="settings.channel_secret_set ? settings.channel_secret : 'ใส่ secret ใหม่...'"
              class="input input-bordered input-sm w-full text-xs" />
            <div v-if="settings.channel_secret_set" class="text-[10px] text-success mt-0.5">ตั้งค่าแล้ว (DB)</div>
          </div>

          <!-- LIFF ID -->
          <div>
            <label class="text-xs font-medium text-base-content/70 block mb-1">LIFF ID</label>
            <input type="text" v-model="form.liff_id" :placeholder="envConfig.liff_id"
              class="input input-bordered input-sm w-full text-xs" />
            <div class="text-[10px] text-base-content/40 mt-0.5">.env default: {{ envConfig.liff_id }}</div>
          </div>

          <!-- LINE OA ID -->
          <div>
            <label class="text-xs font-medium text-base-content/70 block mb-1">LINE OA ID</label>
            <input type="text" v-model="form.line_oa_id" placeholder="@badmintonparty"
              class="input input-bordered input-sm w-full text-xs" />
          </div>

          <button @click="saveSettings" :disabled="saving" class="btn btn-primary btn-sm w-full">
            <span v-if="saving" class="loading loading-spinner loading-xs"></span>
            {{ saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
          </button>
        </div>
      </div>

      <!-- ==================== Welcome Message Editor ==================== -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3">
        <div class="text-sm font-bold text-base-content">Welcome Message</div>
        <p class="text-[10px] text-base-content/50 m-0">ข้อความต้อนรับเมื่อ user เพิ่มเพื่อน LINE OA (webhook follow event)</p>

        <!-- Editable Fields -->
        <div class="space-y-2">
          <div>
            <label class="text-xs font-medium text-base-content/70">หัวข้อ</label>
            <input type="text" v-model="welcomeForm.title" class="input input-bordered input-sm w-full text-xs" />
          </div>
          <div>
            <label class="text-xs font-medium text-base-content/70">คำอธิบาย</label>
            <input type="text" v-model="welcomeForm.subtitle" class="input input-bordered input-sm w-full text-xs" />
          </div>

          <!-- Features -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-medium text-base-content/70">รายการฟีเจอร์</label>
              <button @click="addFeature" :disabled="welcomeForm.features.length >= 6" class="btn btn-ghost btn-xs">+ เพิ่ม</button>
            </div>
            <div v-for="(feat, idx) in welcomeForm.features" :key="idx" class="flex items-center gap-1 mb-1">
              <input type="text" v-model="feat.icon" class="input input-bordered input-xs w-12 text-center text-sm" maxlength="4" />
              <input type="text" v-model="feat.text" class="input input-bordered input-xs flex-1 text-xs" placeholder="รายละเอียด" />
              <button @click="removeFeature(idx)" class="btn btn-ghost btn-xs text-error btn-square">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs font-medium text-base-content/70">ปุ่ม Label</label>
              <input type="text" v-model="welcomeForm.button_label" class="input input-bordered input-xs w-full text-xs" />
            </div>
            <div>
              <label class="text-xs font-medium text-base-content/70">ปุ่ม Path</label>
              <input type="text" v-model="welcomeForm.button_path" class="input input-bordered input-xs w-full text-xs font-mono" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs font-medium text-base-content/70">สี Header</label>
              <div class="flex gap-1 items-center">
                <input type="color" v-model="welcomeForm.header_color" class="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" v-model="welcomeForm.header_color" class="input input-bordered input-xs flex-1 text-xs font-mono" />
              </div>
            </div>
            <div>
              <label class="text-xs font-medium text-base-content/70">สีปุ่ม</label>
              <div class="flex gap-1 items-center">
                <input type="color" v-model="welcomeForm.button_color" class="w-8 h-8 rounded cursor-pointer border-0" />
                <input type="text" v-model="welcomeForm.button_color" class="input input-bordered input-xs flex-1 text-xs font-mono" />
              </div>
            </div>
          </div>
        </div>

        <button @click="saveWelcome" :disabled="savingWelcome" class="btn btn-primary btn-sm w-full">
          <span v-if="savingWelcome" class="loading loading-spinner loading-xs"></span>
          {{ savingWelcome ? 'กำลังบันทึก...' : 'บันทึก Welcome Message' }}
        </button>

        <!-- Preview -->
        <div class="divider text-xs text-base-content/40 m-0">Preview</div>
        <div :style="{ backgroundColor: welcomeForm.header_color }" class="rounded-xl p-4 space-y-2">
          <div class="text-center">
            <img src="https://badmintonparty.com/icons/logo2.png" class="h-12 mx-auto" alt="Logo" />
          </div>
          <div class="text-center">
            <div class="text-sm font-bold text-[#166534]">{{ welcomeForm.title }}</div>
            <div class="text-[10px] text-[#666]">{{ welcomeForm.subtitle }}</div>
          </div>
          <div class="border-t border-[#166534]/10 pt-2 space-y-1">
            <div v-for="(feat, idx) in welcomeForm.features" :key="idx" class="text-[10px]">
              {{ feat.icon }} {{ feat.text }}
            </div>
          </div>
          <div class="text-center pt-2">
            <div :style="{ backgroundColor: welcomeForm.button_color }" class="text-white text-xs font-bold py-2 rounded-lg">
              {{ welcomeForm.button_label }}
            </div>
            <div class="text-[10px] text-[#166534] font-bold mt-1">เข้าสู่เว็บไซต์</div>
          </div>
          <div class="text-[10px] text-base-content/40 text-center mt-1">
            ปุ่มเขียวจะเปิด: {{ settings.liff_base_url }}{{ welcomeForm.button_path }}
          </div>
        </div>

        <!-- Send test -->
        <div class="divider text-xs text-base-content/40 m-0">ทดสอบ</div>
        <div>
          <label class="text-xs font-medium text-base-content/70 block mb-1">LINE User ID</label>
          <input type="text" v-model="testUserId" placeholder="Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            class="input input-bordered input-sm w-full text-xs font-mono" />
        </div>
        <button @click="sendTestWelcome" :disabled="sending || !testUserId" class="btn btn-success btn-sm w-full text-white">
          <span v-if="sending" class="loading loading-spinner loading-xs"></span>
          {{ sending ? 'กำลังส่ง...' : 'ส่ง Welcome Message ทดสอบ' }}
        </button>
      </div>

      <!-- ==================== Rich Menu LIFF URLs ==================== -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3">
        <div class="text-sm font-bold text-base-content">Rich Menu LIFF Paths</div>
        <p class="text-[10px] text-base-content/50 m-0">กำหนด path สำหรับแต่ละปุ่ม Rich Menu — ใช้สร้าง/อัพเดท Rich Menu อัตโนมัติ</p>

        <div v-for="item in richMenuItems" :key="item.key" class="flex items-center gap-2">
          <span class="text-lg w-7 text-center">{{ item.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-base-content">{{ item.label }}</div>
            <input type="text" v-model="richMenuPaths[item.key]" class="input input-bordered input-xs w-full text-[10px] font-mono" />
            <div class="text-[10px] text-base-content/40 font-mono break-all mt-0.5">
              {{ settings.liff_base_url }}{{ richMenuPaths[item.key] }}
            </div>
          </div>
          <button @click="copyToClipboard(settings.liff_base_url + richMenuPaths[item.key])"
            class="btn btn-ghost btn-xs btn-square shrink-0" title="คัดลอก">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </button>
        </div>

        <button @click="saveRichMenu" class="btn btn-outline btn-sm w-full">บันทึก Rich Menu Config</button>
      </div>

      <!-- ==================== Rich Menu from LINE API ==================== -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="text-sm font-bold text-base-content">Rich Menu (LINE API)</div>
          <div class="flex gap-1">
            <button @click="showCreateMenu = !showCreateMenu" class="btn btn-primary btn-xs">
              {{ showCreateMenu ? 'ปิด' : '+ สร้างใหม่' }}
            </button>
            <button @click="fetchRichMenu" :disabled="loadingMenus" class="btn btn-ghost btn-xs">
              <span v-if="loadingMenus" class="loading loading-spinner loading-xs"></span>
              <span v-else>โหลด</span>
            </button>
          </div>
        </div>

        <!-- Create Rich Menu Form -->
        <div v-if="showCreateMenu" class="border border-primary/30 rounded-xl p-3 space-y-3 bg-primary/5">
          <div class="text-xs font-bold text-primary">สร้าง Rich Menu ใหม่</div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-xs font-medium text-base-content/70">ชื่อ Menu</label>
              <input type="text" v-model="newMenu.name" class="input input-bordered input-xs w-full text-xs" />
            </div>
            <div>
              <label class="text-xs font-medium text-base-content/70">Chat Bar Text</label>
              <input type="text" v-model="newMenu.chat_bar_text" maxlength="14" class="input input-bordered input-xs w-full text-xs" />
            </div>
          </div>

          <!-- Grid Preset -->
          <div>
            <label class="text-xs font-medium text-base-content/70 block mb-1">Grid Layout</label>
            <div class="flex flex-wrap gap-1">
              <button v-for="(preset, idx) in gridPresets" :key="idx"
                @click="newMenu.preset = idx; generateAreas()"
                :class="['btn btn-xs', newMenu.preset === idx ? 'btn-primary' : 'btn-outline']">
                {{ preset.label }}
              </button>
            </div>
            <div class="text-[10px] text-base-content/40 mt-1">
              {{ selectedPreset.width }}x{{ selectedPreset.height }} · {{ selectedPreset.cols * selectedPreset.rows }} areas
            </div>
          </div>

          <!-- Areas Editor -->
          <div class="space-y-1.5">
            <div class="text-xs font-medium text-base-content/70">Areas</div>
            <div v-for="(area, idx) in newMenu.areas" :key="idx" class="flex items-center gap-1">
              <span class="text-[10px] text-base-content/40 w-5 shrink-0">{{ idx + 1 }}</span>
              <select v-model="area.action_type" class="select select-bordered select-xs text-[10px] w-16 shrink-0">
                <option value="uri">URI</option>
                <option value="message">MSG</option>
              </select>
              <input type="text" v-model="area.action_value"
                class="input input-bordered input-xs flex-1 text-[10px] font-mono"
                :placeholder="area.action_type === 'uri' ? 'https://liff.line.me/...' : 'ข้อความ'" />
            </div>
          </div>

          <!-- Image Upload -->
          <div>
            <label class="text-xs font-medium text-base-content/70 block mb-1">รูป Rich Menu (PNG/JPG, max 2MB)</label>
            <input type="file" accept="image/png,image/jpeg" @change="onImageSelected" class="file-input file-input-bordered file-input-xs w-full text-xs" />
            <div v-if="menuImagePreview" class="mt-2">
              <img :src="menuImagePreview" class="w-full rounded-lg border border-base-300" alt="Preview" />
            </div>
            <div class="text-[10px] text-base-content/40 mt-1">
              ขนาดแนะนำ: {{ selectedPreset.width }}x{{ selectedPreset.height }}px
            </div>
          </div>

          <label class="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" v-model="newMenu.set_default" class="checkbox checkbox-xs checkbox-primary" />
            <span class="text-xs">ตั้งเป็น default Rich Menu</span>
          </label>

          <button @click="createRichMenu" :disabled="creatingMenu" class="btn btn-primary btn-sm w-full">
            <span v-if="creatingMenu" class="loading loading-spinner loading-xs"></span>
            {{ creatingMenu ? 'กำลังสร้าง...' : 'สร้าง Rich Menu' }}
          </button>
        </div>

        <!-- Existing Rich Menus -->
        <div v-if="richMenus.length === 0 && !loadingMenus" class="text-xs text-base-content/40 text-center py-4">
          กด "โหลด" เพื่อดึงข้อมูล Rich Menu จาก LINE API
        </div>

        <div v-for="menu in richMenus" :key="menu.richMenuId" class="border border-base-300 rounded-lg p-3 space-y-2">
          <div class="flex items-center gap-2">
            <div class="text-xs font-bold text-base-content flex-1 truncate">{{ menu.name }}</div>
            <span v-if="menu.richMenuId === defaultRichMenuId" class="badge badge-xs badge-success">default</span>
          </div>
          <div class="text-[10px] text-base-content/40 font-mono break-all">ID: {{ menu.richMenuId }}</div>
          <div class="text-[10px] text-base-content/50">{{ menu.size?.width }}x{{ menu.size?.height }} · {{ menu.areas?.length }} areas</div>

          <!-- Menu Image -->
          <div v-if="menu.imageUrl">
            <img :src="menu.imageUrl" class="w-full rounded-lg border border-base-300" alt="Rich Menu" @error="(e) => e.target.style.display='none'" />
          </div>

          <!-- Areas/Actions (view or edit mode) -->
          <template v-if="editingMenu?.richMenuId === menu.richMenuId">
            <!-- Edit Mode -->
            <div class="border border-warning/30 rounded-lg p-2 bg-warning/5 space-y-1.5">
              <div class="flex items-center justify-between">
                <div class="text-xs font-bold text-warning">แก้ไข Areas</div>
                <button @click="updateAllAreasToLiff" class="btn btn-warning btn-xs">ใช้ LIFF URL ทั้งหมด</button>
              </div>
              <div v-for="(area, i) in editAreas" :key="i" class="flex items-center gap-1">
                <span class="text-[10px] text-base-content/40 w-5 shrink-0">{{ i + 1 }}</span>
                <select v-model="area.action_type" class="select select-bordered select-xs text-[10px] w-16 shrink-0">
                  <option value="uri">URI</option>
                  <option value="message">MSG</option>
                </select>
                <input type="text" v-model="area.action_value"
                  class="input input-bordered input-xs flex-1 text-[10px] font-mono" />
              </div>
              <div class="flex gap-1 mt-2">
                <button @click="saveEditAreas" :disabled="updatingAreas" class="btn btn-warning btn-xs flex-1">
                  <span v-if="updatingAreas" class="loading loading-spinner loading-xs"></span>
                  {{ updatingAreas ? 'กำลังอัพเดท...' : 'บันทึก Areas' }}
                </button>
                <button @click="cancelEditAreas" class="btn btn-ghost btn-xs">ยกเลิก</button>
              </div>
            </div>
          </template>

          <template v-else>
            <!-- View Mode -->
            <div v-if="menu.areas" class="space-y-1">
              <div v-for="(area, i) in menu.areas" :key="i" class="text-[10px] bg-base-200 rounded px-2 py-1">
                <span class="text-base-content/50">Area {{ i + 1 }}:</span>
                <span v-if="area.action?.type === 'uri'" class="font-mono text-primary ml-1 break-all">{{ area.action.uri }}</span>
                <span v-else class="text-base-content/40 ml-1">{{ area.action?.type }}: {{ area.action?.text || area.action?.label }}</span>
              </div>
            </div>
          </template>

          <!-- Upload image to existing menu -->
          <div class="flex items-center gap-1">
            <input type="file" accept="image/png,image/jpeg"
              @change="(e) => { existingMenuImage = e.target.files[0]; uploadToExistingMenu(menu.richMenuId); }"
              class="file-input file-input-bordered file-input-xs flex-1 text-[10px]" />
          </div>

          <!-- Action buttons -->
          <div class="flex gap-1 flex-wrap">
            <button v-if="menu.richMenuId !== defaultRichMenuId" @click="setDefault(menu.richMenuId)"
              class="btn btn-outline btn-xs btn-success flex-1">ตั้ง default</button>
            <button @click="startEditAreas(menu)" class="btn btn-outline btn-xs btn-warning flex-1"
              :disabled="editingMenu?.richMenuId === menu.richMenuId">แก้ไข Areas</button>
            <button @click="deleteMenu(menu.richMenuId)" class="btn btn-outline btn-xs btn-error flex-1">ลบ</button>
          </div>
        </div>
      </div>

    </div>
  </AppLayout>
</template>
