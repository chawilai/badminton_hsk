<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { Head, Link, router, usePage } from "@inertiajs/vue3";
import { ref, reactive, onMounted } from "vue";
import { useToast } from "@/composables/useToast";

const toast = useToast();
const page = usePage();

const props = defineProps({
  settings: { type: Object, default: () => ({}) },
  quota: { type: Object, default: () => ({}) },
  envConfig: { type: Object, default: () => ({}) },
});

// Settings form
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

// Rich menu config form
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

// Rich menu from LINE API
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

// Flash messages
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
      <div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3">
        <div class="text-sm font-bold text-base-content">ตั้งค่า LINE OA</div>

        <!-- Channel Access Token -->
        <div>
          <label class="text-xs font-medium text-base-content/70 block mb-1">Channel Access Token</label>
          <div class="flex gap-2">
            <input
              :type="showToken ? 'text' : 'password'"
              v-model="form.channel_access_token"
              :placeholder="settings.channel_access_token_set ? settings.channel_access_token : 'ใส่ token ใหม่...'"
              class="input input-bordered input-sm flex-1 text-xs"
            />
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
          <input
            :type="showSecret ? 'text' : 'password'"
            v-model="form.channel_secret"
            :placeholder="settings.channel_secret_set ? settings.channel_secret : 'ใส่ secret ใหม่...'"
            class="input input-bordered input-sm w-full text-xs"
          />
          <div v-if="settings.channel_secret_set" class="text-[10px] text-success mt-0.5">ตั้งค่าแล้ว (DB)</div>
        </div>

        <!-- LIFF ID -->
        <div>
          <label class="text-xs font-medium text-base-content/70 block mb-1">LIFF ID</label>
          <input
            type="text"
            v-model="form.liff_id"
            :placeholder="envConfig.liff_id"
            class="input input-bordered input-sm w-full text-xs"
          />
          <div class="text-[10px] text-base-content/40 mt-0.5">.env default: {{ envConfig.liff_id }}</div>
        </div>

        <!-- LINE OA ID -->
        <div>
          <label class="text-xs font-medium text-base-content/70 block mb-1">LINE OA ID</label>
          <input
            type="text"
            v-model="form.line_oa_id"
            placeholder="@badmintonparty"
            class="input input-bordered input-sm w-full text-xs"
          />
        </div>

        <button @click="saveSettings" :disabled="saving" class="btn btn-primary btn-sm w-full">
          <span v-if="saving" class="loading loading-spinner loading-xs"></span>
          {{ saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า' }}
        </button>
      </div>

      <!-- Rich Menu LIFF URLs -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3">
        <div class="text-sm font-bold text-base-content">Rich Menu LIFF URLs</div>
        <p class="text-[10px] text-base-content/50 m-0">คัดลอก URL ไปใช้ใน LINE OA Manager → Rich Menu</p>

        <div v-for="item in richMenuItems" :key="item.key" class="flex items-center gap-2">
          <span class="text-lg w-7 text-center">{{ item.icon }}</span>
          <div class="flex-1 min-w-0">
            <div class="text-xs font-semibold text-base-content">{{ item.label }}</div>
            <div class="flex items-center gap-1">
              <input
                type="text"
                v-model="richMenuPaths[item.key]"
                class="input input-bordered input-xs flex-1 text-[10px] font-mono"
              />
            </div>
            <div class="text-[10px] text-base-content/40 font-mono break-all mt-0.5">
              {{ settings.liff_base_url }}{{ richMenuPaths[item.key] }}
            </div>
          </div>
          <button
            @click="copyToClipboard(settings.liff_base_url + richMenuPaths[item.key])"
            class="btn btn-ghost btn-xs btn-square shrink-0"
            title="คัดลอก"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          </button>
        </div>

        <button @click="saveRichMenu" class="btn btn-outline btn-sm w-full">บันทึก Rich Menu Config</button>
      </div>

      <!-- Test Welcome Message -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3">
        <div class="text-sm font-bold text-base-content">ทดสอบ Welcome Message</div>

        <!-- Preview -->
        <div class="bg-[#f0fdf4] rounded-xl p-4 space-y-2">
          <div class="text-center">
            <img :src="'https://badmintonparty.com/icons/logo2.png'" class="h-12 mx-auto" alt="Logo" />
          </div>
          <div class="text-center">
            <div class="text-sm font-bold text-[#166534]">ยินดีต้อนรับสู่ Badminton Party!</div>
            <div class="text-[10px] text-[#666]">ระบบจัดการปาร์ตี้แบดมินตันครบวงจร</div>
          </div>
          <div class="border-t border-[#166534]/10 pt-2 space-y-1">
            <div class="text-[10px]">🏸 สร้างปาร์ตี้แบดมินตัน</div>
            <div class="text-[10px]">👥 เข้าร่วมปาร์ตี้กับเพื่อนๆ</div>
            <div class="text-[10px]">🎮 สร้างเกม จับคู่อัตโนมัติ</div>
            <div class="text-[10px]">📊 บันทึก & ตรวจสอบประวัติ</div>
          </div>
          <div class="text-center pt-2">
            <div class="bg-[#22c55e] text-white text-xs font-bold py-2 rounded-lg">เริ่มใช้งาน Badminton Party</div>
            <div class="text-[10px] text-[#166534] font-bold mt-1">เข้าสู่เว็บไซต์</div>
          </div>
          <div class="text-[10px] text-base-content/40 text-center mt-1">
            ปุ่มเขียวจะเปิด: {{ settings.liff_base_url }}/party-lists
          </div>
        </div>

        <!-- Send test -->
        <div>
          <label class="text-xs font-medium text-base-content/70 block mb-1">LINE User ID</label>
          <input
            type="text"
            v-model="testUserId"
            placeholder="Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            class="input input-bordered input-sm w-full text-xs font-mono"
          />
        </div>

        <button @click="sendTestWelcome" :disabled="sending || !testUserId" class="btn btn-success btn-sm w-full text-white">
          <span v-if="sending" class="loading loading-spinner loading-xs"></span>
          {{ sending ? 'กำลังส่ง...' : 'ส่ง Welcome Message ทดสอบ' }}
        </button>
      </div>

      <!-- Rich Menu from LINE API -->
      <div class="bg-base-100 rounded-xl border border-base-300 p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div class="text-sm font-bold text-base-content">Rich Menu (LINE API)</div>
          <button @click="fetchRichMenu" :disabled="loadingMenus" class="btn btn-ghost btn-xs">
            <span v-if="loadingMenus" class="loading loading-spinner loading-xs"></span>
            <span v-else>โหลด</span>
          </button>
        </div>

        <div v-if="richMenus.length === 0 && !loadingMenus" class="text-xs text-base-content/40 text-center py-4">
          กด "โหลด" เพื่อดึงข้อมูล Rich Menu จาก LINE API
        </div>

        <div v-for="menu in richMenus" :key="menu.richMenuId" class="border border-base-300 rounded-lg p-3 space-y-2">
          <div class="flex items-center gap-2">
            <div class="text-xs font-bold text-base-content flex-1">{{ menu.name }}</div>
            <span v-if="menu.richMenuId === defaultRichMenuId" class="badge badge-xs badge-success">default</span>
          </div>
          <div class="text-[10px] text-base-content/40 font-mono break-all">ID: {{ menu.richMenuId }}</div>
          <div class="text-[10px] text-base-content/50">{{ menu.size?.width }}x{{ menu.size?.height }} · {{ menu.areas?.length }} areas</div>

          <!-- Areas/Actions -->
          <div v-if="menu.areas" class="space-y-1">
            <div v-for="(area, i) in menu.areas" :key="i" class="text-[10px] bg-base-200 rounded px-2 py-1">
              <span class="text-base-content/50">Area {{ i + 1 }}:</span>
              <span v-if="area.action?.type === 'uri'" class="font-mono text-primary ml-1 break-all">{{ area.action.uri }}</span>
              <span v-else class="text-base-content/40 ml-1">{{ area.action?.type }}: {{ area.action?.text || area.action?.label }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AppLayout>
</template>
