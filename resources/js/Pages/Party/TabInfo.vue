<script setup>
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { ref, nextTick } from "vue";
import { usePage, router } from "@inertiajs/vue3";
import axios from "axios";

const { t } = useLocale();
const toast = useToast();
const page = usePage();

const props = defineProps({
  party: { type: Object, required: true },
  costSummary: { type: Object, default: () => ({}) },
});

const isHost = props.party.creator_id === page.props.auth.user?.id;

const costTypeLabel = (type) => {
  const map = { free: 'ฟรี', per_person: 'จ่ายรายหัว', split_equal: 'หารเท่า' };
  return map[type] || '-';
};

// Edit Party
const showEditDialog = ref(false);
const editForm = ref({});

const timeOptions = Array.from({ length: 24 }, (_, i) => ({
  name: `${String(i + 1).padStart(2, '0')}:00`,
}));

const openEditDialog = () => {
  editForm.value = {
    name: props.party.name || '',
    play_date: props.party.play_date,
    max_players: props.party.max_players,
    court_id: props.party.court_id,
    default_game_type: props.party.default_game_type || 'quadruple',
    is_private: props.party.is_private || false,
    invite_passcode: props.party.invite_passcode || '',
    cost_type: props.party.cost_type || 'per_person',
    cost_amount: props.party.cost_amount,
    shuttlecock_cost: props.party.shuttlecock_cost,
    notes: props.party.notes || '',
    status: props.party.status,
    start_time: props.party.start_time?.substring(0, 5) || '',
    end_time: props.party.end_time?.substring(0, 5) || '',
    court_bookings: props.party.court_bookings?.length
      ? props.party.court_bookings.map(b => ({ court_field_number: b.court_field_number, start_time: b.start_time?.substring(0, 5) || '', end_time: b.end_time?.substring(0, 5) || '' }))
      : [{ court_field_number: null, start_time: '', end_time: '' }],
  };
  showEditDialog.value = true;
};

const addBooking = () => {
  const last = editForm.value.court_bookings[editForm.value.court_bookings.length - 1];
  editForm.value.court_bookings.push({
    court_field_number: null,
    start_time: last?.start_time || '',
    end_time: last?.end_time || '',
  });
};

const removeBooking = (index) => {
  if (editForm.value.court_bookings.length > 1) {
    editForm.value.court_bookings.splice(index, 1);
  }
};

// Notes editor
const notesTextarea = ref(null);
const NOTE_TEMPLATES_KEY = 'badminton_note_templates';
const noteTemplates = ref([]);
const showNoteTemplateMenu = ref(false);
const showSaveNoteTemplate = ref(false);
const noteTemplateName = ref('');
const confirmingDeleteIdx = ref(null);

try { noteTemplates.value = JSON.parse(localStorage.getItem(NOTE_TEMPLATES_KEY) || '[]'); } catch { noteTemplates.value = []; }
const saveNoteTemplates = () => localStorage.setItem(NOTE_TEMPLATES_KEY, JSON.stringify(noteTemplates.value));

const saveCurrentAsNoteTemplate = () => {
  const name = noteTemplateName.value.trim();
  if (!name || !editForm.value.notes?.trim()) return;
  noteTemplates.value.push({ name, content: editForm.value.notes });
  saveNoteTemplates();
  noteTemplateName.value = '';
  showSaveNoteTemplate.value = false;
};
const applyNoteTemplate = (tmpl) => { editForm.value.notes = tmpl.content; showNoteTemplateMenu.value = false; };
const deleteNoteTemplate = (index) => {
  if (confirmingDeleteIdx.value === index) { noteTemplates.value.splice(index, 1); saveNoteTemplates(); confirmingDeleteIdx.value = null; }
  else { confirmingDeleteIdx.value = index; }
};

const insertAtCursor = (text) => {
  const ta = notesTextarea.value;
  if (!ta) { editForm.value.notes = (editForm.value.notes || '') + text; return; }
  const start = ta.selectionStart, end = ta.selectionEnd;
  const val = editForm.value.notes || '';
  editForm.value.notes = val.substring(0, start) + text + val.substring(end);
  nextTick(() => { ta.selectionStart = ta.selectionEnd = start + text.length; ta.focus(); });
};

const showEmojiPicker = ref(false);
const showBulletPicker = ref(false);
const showLinePicker = ref(false);
const closeAllToolbarPopups = () => { showEmojiPicker.value = false; showBulletPicker.value = false; showLinePicker.value = false; };
const toggleToolbarPopup = (which) => {
  const map = { emoji: showEmojiPicker, bullet: showBulletPicker, line: showLinePicker };
  const wasOpen = map[which].value; closeAllToolbarPopups(); if (!wasOpen) map[which].value = true;
};

const emojiCategories = [
  { label: '🏸 แบดมินตัน', emojis: ['🏸', '🧑‍🤝‍🧑', '🏆', '🥇', '🥈', '🥉', '🎯', '💪', '🔥', '⭐', '🤝', '👏'] },
  { label: '🏟️ สถานที่/เวลา', emojis: ['🏟️', '📅', '⏰', '🕐', '📍', '🅿️', '🚗', '🏠', '🚿', '🗓️'] },
  { label: '💰 เงิน', emojis: ['💰', '💵', '💳', '🧾', '📊', '💲', '🏦', '🔢'] },
  { label: '⚠️ กฎ/เตือน', emojis: ['⚠️', '📌', '🚫', '❌', '✅', '⭕', '❗', '📢', '🔒', '🙅', '👉', '📣'] },
  { label: '👟 อุปกรณ์', emojis: ['👟', '👕', '🎽', '🧴', '💧', '🧊', '🎒', '🩳', '🧤', '😷'] },
  { label: '😊 อื่นๆ', emojis: ['📝', '📋', '👋', '🙏', '😊', '🎉', '🔄', '➡️', '⬇️', '☎️', '📱', '🔗'] },
];

const bulletStyles = [
  { label: 'จุดทึบ', preview: '•', char: '• ' },
  { label: 'ขีด', preview: '-', char: '- ' },
  { label: 'ลูกศร', preview: '▸', char: '▸ ' },
  { label: 'ถูก', preview: '✓', char: '✓ ' },
  { label: 'ดาว', preview: '★', char: '★ ' },
  { label: 'หมายเลข', preview: '1.', char: null, numbered: true },
];

const lineStyles = [
  { label: 'เส้นตรง', preview: '─────', char: '───────────────' },
  { label: 'จุดประ', preview: '· · · · ·', char: '· · · · · · · · · · ·' },
  { label: 'ขีดประ', preview: '- - - - -', char: '- - - - - - - - - - -' },
  { label: 'ดาว', preview: '★ ★ ★', char: '★ ★ ★ ★ ★' },
];

const insertBulletStyle = (style) => {
  const val = editForm.value.notes || '';
  const ta = notesTextarea.value;
  const pos = ta ? ta.selectionStart : val.length;
  const needNewline = pos > 0 && val[pos - 1] !== '\n';
  if (style.numbered) {
    const textBefore = val.substring(0, pos);
    const lines = textBefore.split('\n').reverse();
    const lastNum = lines.find(l => /^\s*\d+\./.test(l));
    const num = lastNum ? parseInt(lastNum.trim()) + 1 : 1;
    insertAtCursor((needNewline ? '\n' : '') + `${num}. `);
  } else { insertAtCursor((needNewline ? '\n' : '') + style.char); }
  showBulletPicker.value = false;
};

const insertLineStyle = (style) => {
  const val = editForm.value.notes || '';
  const ta = notesTextarea.value;
  const pos = ta ? ta.selectionStart : val.length;
  const needBefore = pos > 0 && val[pos - 1] !== '\n';
  const needAfter = pos < val.length && val[pos] !== '\n';
  insertAtCursor((needBefore ? '\n' : '') + style.char + (needAfter ? '\n' : ''));
  showLinePicker.value = false;
};

const saving = ref(false);
const saveParty = () => {
  saving.value = true;
  router.post(`/party/${props.party.id}/update`, editForm.value, {
    preserveScroll: true,
    onSuccess: () => {
      showEditDialog.value = false;
      toast.add({ severity: 'success', summary: 'บันทึกเรียบร้อย', detail: 'อัพเดทข้อมูลปาร์ตี้แล้ว', life: 3000 });
    },
    onError: (errors) => {
      toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', detail: Object.values(errors).flat().join(', '), life: 5000 });
    },
    onFinish: () => { saving.value = false; },
  });
};

// Invite system
const inviteUrl = ref('');
const passcode = ref(props.party.invite_passcode || '');
const generatingLink = ref(false);
const savingPasscode = ref(false);

const generateInviteLink = async () => {
  generatingLink.value = true;
  try {
    const res = await axios.post(`/party/${props.party.id}/generate-invite`);
    inviteUrl.value = res.data.invite_url;
  } catch (e) {
    toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 2000 });
  }
  generatingLink.value = false;
};

const copyLink = () => {
  navigator.clipboard.writeText(inviteUrl.value);
  toast.add({ severity: 'success', summary: 'คัดลอกลิงก์แล้ว', life: 2000 });
};

const savePasscode = () => {
  savingPasscode.value = true;
  router.post(`/party/${props.party.id}/set-passcode`, { passcode: passcode.value }, {
    preserveScroll: true,
    onSuccess: () => {
      toast.add({ severity: 'success', summary: 'ตั้งรหัสเรียบร้อย', life: 2000 });
    },
    onFinish: () => { savingPasscode.value = false; },
  });
};

// Init invite URL if token exists
if (props.party.invite_token) {
  inviteUrl.value = `${window.location.origin}/party/${props.party.id}/invite/${props.party.invite_token}`;
}
</script>

<template>
  <div class="space-y-4">
    <!-- Edit Button (Host only) -->
    <button
      v-if="isHost"
      @click="openEditDialog"
      class="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
      แก้ไขข้อมูลปาร์ตี้
    </button>

    <!-- Court Info -->
    <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
      <div class="px-4 py-3 border-b border-base-200">
        <div class="text-base font-bold text-base-content m-0">{{ t('info.court') }}</div>
      </div>
      <div class="p-4 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.courtName') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.court?.name || '-' }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.address') }}</span>
          <span class="text-sm font-medium text-base-content text-right max-w-[60%]">{{ party.court?.address || '-' }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.phone') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.court?.phone || '-' }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.courtType') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.court?.court_type || '-' }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.pricePerHour') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.court?.play_price ? `${party.court.play_price} ฿` : '-' }}</span>
        </div>
      </div>
    </div>

    <!-- Party Details -->
    <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
      <div class="px-4 py-3 border-b border-base-200">
        <div class="text-base font-bold text-base-content m-0">{{ t('info.partyDetails') }}</div>
      </div>
      <div class="p-4 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.playDate') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.play_date }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.time') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.start_time?.substring(0,5) }} - {{ party.end_time?.substring(0,5) }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.duration') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.play_hours }} {{ t('info.hoursUnit') }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.playerCount') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.members?.length || 0 }}/{{ party.max_players }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.status') }}</span>
          <span class="badge badge-sm"
            :class="{
              'badge-success': party.status === 'Open',
              'badge-warning': party.status === 'Full',
              'badge-neutral': party.status === 'Over',
            }"
          >{{ party.status }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.private') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.is_private ? 'ใช่' : 'ไม่' }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">{{ t('info.shuttlecocks') }}</span>
          <span class="text-sm font-medium text-base-content">{{ party.default_initial_shuttlecocks ?? 0 }} {{ t('info.shuttleUnit') }}</span>
        </div>
      </div>
    </div>

    <!-- Court Bookings -->
    <div v-if="party.court_bookings?.length" class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
      <div class="px-4 py-3 border-b border-base-200">
        <div class="text-base font-bold text-base-content m-0">🏟️ คอร์ทที่จอง</div>
      </div>
      <div class="p-4 space-y-2">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm text-base-content/60">จำนวนคอร์ท</span>
          <span class="text-sm font-medium text-base-content">{{ party.court_bookings.length }} คอร์ท</span>
        </div>
        <div
          v-for="(booking, idx) in party.court_bookings"
          :key="idx"
          class="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2"
        >
          <span class="text-sm font-semibold text-primary">คอร์ท {{ booking.court_field_number }}</span>
          <span class="text-sm text-base-content/70">{{ booking.start_time?.substring(0,5) }} - {{ booking.end_time?.substring(0,5) }}</span>
        </div>
      </div>
    </div>

    <!-- Invite Settings (Host only, private party) -->
    <div v-if="isHost && party.is_private" class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
      <div class="px-4 py-3 border-b border-base-200">
        <div class="text-base font-bold text-base-content m-0">🔒 ตั้งค่าการเข้าร่วม</div>
      </div>
      <div class="p-4 space-y-4">
        <!-- Invite Link -->
        <div>
          <div class="text-xs font-semibold text-base-content/60 mb-1.5">🔗 ลิงก์เชิญ</div>
          <div v-if="inviteUrl" class="flex gap-2">
            <input type="text" :value="inviteUrl" readonly class="input input-bordered input-sm flex-1 text-xs" />
            <button @click="copyLink" class="btn btn-primary btn-sm text-xs">คัดลอก</button>
          </div>
          <button v-else @click="generateInviteLink" :disabled="generatingLink" class="btn btn-outline btn-primary btn-sm text-xs w-full">
            <span v-if="generatingLink" class="loading loading-spinner loading-xs"></span>
            🔗 สร้างลิงก์เชิญ
          </button>
        </div>

        <!-- Passcode -->
        <div>
          <div class="text-xs font-semibold text-base-content/60 mb-1.5">🔢 รหัสเข้าร่วม (4 หลัก)</div>
          <div class="flex gap-2">
            <input type="text" v-model="passcode" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="0000" class="input input-bordered input-sm w-28 text-center tracking-widest font-bold" />
            <button @click="savePasscode" :disabled="savingPasscode || !passcode || passcode.length < 4" class="btn btn-primary btn-sm text-xs">บันทึก</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Cost Summary -->
    <div v-if="costSummary && costSummary.cost_type !== 'free'" class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
      <div class="px-4 py-3 border-b border-base-200">
        <div class="text-base font-bold text-base-content m-0">💰 สรุปค่าใช้จ่าย</div>
      </div>
      <div class="p-4 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">รูปแบบ</span>
          <span class="text-sm font-medium text-base-content">{{ costTypeLabel(costSummary.cost_type) }}</span>
        </div>
        <div v-if="costSummary.court_cost_total > 0" class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">ค่าคอร์ท</span>
          <span class="text-sm font-medium text-base-content">฿{{ costSummary.court_cost_total.toLocaleString() }}</span>
        </div>
        <div v-if="costSummary.shuttlecock_used > 0" class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">ลูกแบดใช้</span>
          <span class="text-sm font-medium text-base-content">{{ costSummary.shuttlecock_used }} ลูก × ฿{{ costSummary.shuttlecock_cost_per_unit }}</span>
        </div>
        <div v-if="costSummary.shuttlecock_cost_total > 0" class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">ค่าลูกแบดรวม</span>
          <span class="text-sm font-medium text-base-content">฿{{ costSummary.shuttlecock_cost_total.toLocaleString() }}</span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-base-content/60">จำนวนผู้เล่น</span>
          <span class="text-sm font-medium text-base-content">{{ costSummary.member_count }} คน</span>
        </div>

        <!-- Divider + Totals -->
        <div class="border-t border-base-200 pt-2 mt-2 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-sm text-base-content/60">รวมทั้งหมด</span>
            <span class="text-sm font-bold text-base-content">฿{{ costSummary.total_cost.toLocaleString() }}</span>
          </div>
          <div class="flex items-center justify-between bg-primary/10 rounded-lg px-3 py-2 -mx-1">
            <span class="text-sm font-bold text-primary">💰 ต่อคน</span>
            <span class="text-lg font-black text-primary">฿{{ Math.ceil(costSummary.per_person).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Free party notice -->
    <div v-else-if="costSummary && costSummary.cost_type === 'free'" class="bg-success/10 rounded-2xl border border-success/20 p-4 text-center">
      <span class="text-2xl">🆓</span>
      <div class="text-sm font-bold text-success mt-1">ปาร์ตี้ฟรี ไม่มีค่าใช้จ่าย</div>
    </div>

    <!-- Edit Party Dialog -->
    <dialog class="modal" :class="{ 'modal-open': showEditDialog }">
      <div class="modal-box max-w-md p-0 max-h-[90vh]">
        <div class="flex items-center justify-between px-4 pt-4 pb-2 sticky top-0 bg-base-100 z-10">
          <h3 class="text-base font-bold text-base-content m-0">🏸 แก้ไขปาร์ตี้</h3>
          <button @click="showEditDialog = false" class="w-7 h-7 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors">
            <span class="text-base-content/60 text-sm">✕</span>
          </button>
        </div>
        <div class="px-4 pb-4 space-y-4 overflow-y-auto">
          <!-- Party Name -->
          <div>
            <label class="text-xs font-semibold text-base-content/60 block mb-1">ชื่อปาร์ตี้</label>
            <input v-model="editForm.name" type="text" class="input input-bordered input-sm w-full" placeholder="ชื่อปาร์ตี้ (ไม่บังคับ)" />
          </div>

          <!-- Play Date -->
          <div>
            <label class="text-xs font-semibold text-base-content/60 block mb-1">วันเล่น</label>
            <input v-model="editForm.play_date" type="date" class="input input-bordered input-sm w-full" />
          </div>

          <!-- Max Players + Game Type -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-xs font-semibold text-base-content/60 block mb-1">จำนวนผู้เล่นสูงสุด</label>
              <input v-model.number="editForm.max_players" type="number" min="1" class="input input-bordered input-sm w-full" />
            </div>
            <div>
              <label class="text-xs font-semibold text-base-content/60 block mb-1">ประเภทเกม</label>
              <select v-model="editForm.default_game_type" class="select select-bordered select-sm w-full">
                <option value="double">1v1 (คู่)</option>
                <option value="quadruple">2v2 (สี่คน)</option>
              </select>
            </div>
          </div>

          <!-- Court Bookings -->
          <div>
            <label class="text-xs font-semibold text-base-content/60 block mb-1">คอร์ทที่จอง</label>
            <div class="space-y-2">
              <div v-for="(booking, idx) in editForm.court_bookings" :key="idx" class="flex items-center gap-2 bg-base-200/50 rounded-lg p-2">
                <div class="flex-1 grid grid-cols-3 gap-1.5">
                  <div>
                    <label class="text-[9px] text-base-content/40 block">คอร์ท</label>
                    <input v-model.number="booking.court_field_number" type="number" min="1" class="input input-bordered input-xs w-full" placeholder="#" />
                  </div>
                  <div>
                    <label class="text-[9px] text-base-content/40 block">เริ่ม</label>
                    <select v-model="booking.start_time" class="select select-bordered select-xs w-full">
                      <option value="">-</option>
                      <option v-for="opt in timeOptions" :key="opt.name" :value="opt.name">{{ opt.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-[9px] text-base-content/40 block">สิ้นสุด</label>
                    <select v-model="booking.end_time" class="select select-bordered select-xs w-full">
                      <option value="">-</option>
                      <option v-for="opt in timeOptions" :key="opt.name" :value="opt.name">{{ opt.name }}</option>
                    </select>
                  </div>
                </div>
                <button v-if="editForm.court_bookings.length > 1" @click="removeBooking(idx)" class="w-6 h-6 rounded bg-error/10 text-error border-0 cursor-pointer flex items-center justify-center text-xs hover:bg-error/20">✕</button>
              </div>
              <button @click="addBooking" class="w-full py-1.5 rounded-lg text-xs font-medium bg-base-200 text-base-content/60 border-0 cursor-pointer hover:bg-base-300 transition-colors">+ เพิ่มคอร์ท</button>
            </div>
          </div>

          <!-- Cost Settings -->
          <div>
            <label class="text-xs font-semibold text-base-content/60 block mb-1">ค่าใช้จ่าย</label>
            <div class="flex gap-2 mb-2">
              <button v-for="ct in [{ key: 'per_person', label: 'จ่ายรายหัว' }, { key: 'split_equal', label: 'หารเท่า' }, { key: 'free', label: 'ฟรี' }]" :key="ct.key"
                @click="editForm.cost_type = ct.key"
                class="flex-1 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all"
                :class="editForm.cost_type === ct.key ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/50'"
              >{{ ct.label }}</button>
            </div>
            <div v-if="editForm.cost_type !== 'free'" class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-[9px] text-base-content/40 block mb-0.5">{{ editForm.cost_type === 'per_person' ? 'ราคา/คน (฿)' : 'ค่าคอร์ทรวม (฿)' }}</label>
                <input v-model.number="editForm.cost_amount" type="number" min="0" class="input input-bordered input-sm w-full" />
              </div>
              <div>
                <label class="text-[9px] text-base-content/40 block mb-0.5">ค่าลูกแบด/ลูก (฿)</label>
                <input v-model.number="editForm.shuttlecock_cost" type="number" min="0" class="input input-bordered input-sm w-full" />
              </div>
            </div>
          </div>

          <!-- Notes with toolbar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-semibold text-base-content/60">📝 หมายเหตุ / กติกา</label>
              <div class="relative">
                <button type="button" @click="showNoteTemplateMenu = !showNoteTemplateMenu; confirmingDeleteIdx = null"
                  class="text-[10px] font-medium text-primary border border-primary/30 bg-primary/5 rounded-lg px-2 py-1 cursor-pointer hover:bg-primary/10 transition-colors flex items-center gap-1">
                  📋 Template
                  <span v-if="noteTemplates.length" class="bg-primary text-white rounded-full w-4 h-4 text-[8px] flex items-center justify-center font-bold">{{ noteTemplates.length }}</span>
                </button>
                <div v-if="showNoteTemplateMenu" class="fixed inset-0 z-10" @click="showNoteTemplateMenu = false; confirmingDeleteIdx = null"></div>
                <div v-if="showNoteTemplateMenu" class="absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 py-1 max-h-60 overflow-y-auto">
                  <div v-if="noteTemplates.length === 0" class="px-3 py-4 text-center">
                    <div class="text-[10px] text-base-content/30">ยังไม่มี template</div>
                  </div>
                  <template v-if="noteTemplates.length > 0">
                    <div v-for="(tmpl, i) in noteTemplates" :key="i" class="px-3 py-2 hover:bg-base-200 transition-colors">
                      <div v-if="confirmingDeleteIdx !== i" class="flex items-center gap-2">
                        <div @click="applyNoteTemplate(tmpl)" class="flex-1 min-w-0 cursor-pointer">
                          <div class="text-xs font-medium text-base-content truncate">{{ tmpl.name }}</div>
                          <div class="text-[9px] text-base-content/40 truncate">{{ tmpl.content.substring(0, 50) }}</div>
                        </div>
                        <button type="button" @click.stop="deleteNoteTemplate(i)" class="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[10px] text-base-content/30 hover:text-error hover:bg-error/10 border-0 bg-transparent cursor-pointer">✕</button>
                      </div>
                      <div v-else class="flex items-center gap-2">
                        <div class="flex-1 text-[10px] text-error font-medium">ลบ "{{ tmpl.name }}" ?</div>
                        <button type="button" @click.stop="confirmingDeleteIdx = null" class="px-2 py-1 text-[10px] rounded-md bg-base-200 text-base-content/60 border-0 cursor-pointer">ยกเลิก</button>
                        <button type="button" @click.stop="deleteNoteTemplate(i)" class="px-2 py-1 text-[10px] rounded-md bg-error text-white border-0 cursor-pointer font-bold">ลบ</button>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
            <!-- Toolbar -->
            <div class="flex items-center gap-0.5 w-full bg-base-200/50 rounded-lg p-1">
              <div class="flex items-center gap-0.5 flex-1">
                <div class="relative">
                  <button type="button" @click="toggleToolbarPopup('emoji')" class="h-7 w-8 rounded-md border-0 cursor-pointer text-sm flex items-center justify-center transition-colors active:scale-95" :class="showEmojiPicker ? 'bg-primary/15 text-primary' : 'hover:bg-base-300 bg-base-100/80'">😀</button>
                  <div v-if="showEmojiPicker" class="fixed inset-0 z-10" @click="showEmojiPicker = false"></div>
                  <div v-if="showEmojiPicker" class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-64 max-h-52 overflow-y-auto p-2 space-y-2">
                    <div v-for="cat in emojiCategories" :key="cat.label">
                      <div class="text-[9px] font-bold text-base-content/40 uppercase mb-1">{{ cat.label }}</div>
                      <div class="flex flex-wrap gap-0.5">
                        <button type="button" v-for="e in cat.emojis" :key="e" @click="insertAtCursor(e + ' '); showEmojiPicker = false"
                          class="w-8 h-8 rounded-lg hover:bg-base-200 border-0 bg-transparent cursor-pointer text-base flex items-center justify-center">{{ e }}</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <button type="button" @click="toggleToolbarPopup('bullet')" class="h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95" :class="showBulletPicker ? 'bg-primary/15 text-primary' : 'hover:bg-base-300 bg-base-100/80 text-base-content/60'">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
                  </button>
                  <div v-if="showBulletPicker" class="fixed inset-0 z-10" @click="showBulletPicker = false"></div>
                  <div v-if="showBulletPicker" class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-40 py-1">
                    <button type="button" v-for="b in bulletStyles" :key="b.label" @click="insertBulletStyle(b)"
                      class="w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2">
                      <span class="w-5 text-center font-bold font-mono">{{ b.preview }}</span><span class="text-base-content/70">{{ b.label }}</span>
                    </button>
                  </div>
                </div>
                <div class="relative">
                  <button type="button" @click="toggleToolbarPopup('line')" class="h-7 px-2 rounded-md border-0 cursor-pointer text-[10px] font-bold flex items-center gap-0.5 transition-colors active:scale-95" :class="showLinePicker ? 'bg-primary/15 text-primary' : 'hover:bg-base-300 bg-base-100/80 text-base-content/60'">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3 12h18"/></svg>
                  </button>
                  <div v-if="showLinePicker" class="fixed inset-0 z-10" @click="showLinePicker = false"></div>
                  <div v-if="showLinePicker" class="absolute left-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-lg z-20 w-52 py-1">
                    <button type="button" v-for="l in lineStyles" :key="l.label" @click="insertLineStyle(l)"
                      class="w-full text-left px-3 py-1.5 text-xs hover:bg-base-200 border-0 bg-transparent cursor-pointer flex items-center gap-2">
                      <span class="text-[10px] text-base-content/50 font-mono truncate w-20">{{ l.preview }}</span><span class="text-base-content/70">{{ l.label }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <textarea ref="notesTextarea" v-model="editForm.notes" rows="5"
              class="textarea textarea-bordered textarea-sm w-full text-xs leading-relaxed font-mono"
              placeholder="เช่น&#10;🏸 ลูกใช้ RSL เบอร์ 5&#10;👟 ห้ามใส่รองเท้าตีนตุ๊กแก&#10;⏰ มาก่อนเวลา 15 นาที"></textarea>
            <div class="flex justify-end">
              <template v-if="!showSaveNoteTemplate">
                <button type="button" @click="showSaveNoteTemplate = true" :disabled="!editForm.notes?.trim()"
                  class="text-[10px] font-medium text-primary/70 hover:text-primary border-0 bg-transparent cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1">
                  💾 บันทึกเป็น Template
                </button>
              </template>
              <div v-else class="flex items-center gap-1.5 w-full">
                <input type="text" v-model="noteTemplateName" placeholder="ตั้งชื่อ template..." class="input input-bordered input-xs text-xs flex-1" @keyup.enter="saveCurrentAsNoteTemplate" />
                <button type="button" @click="showSaveNoteTemplate = false; noteTemplateName = ''" class="text-[10px] px-2 py-1 rounded-lg bg-base-200 text-base-content/60 border-0 cursor-pointer">ยกเลิก</button>
                <button type="button" @click="saveCurrentAsNoteTemplate" :disabled="!noteTemplateName.trim()" class="text-[10px] px-2 py-1 rounded-lg bg-primary text-white border-0 cursor-pointer disabled:opacity-30 font-bold">💾</button>
              </div>
            </div>
          </div>

          <!-- Private Toggle + Passcode -->
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-xs font-semibold text-base-content/60">ปาร์ตี้ส่วนตัว</span>
            <input type="checkbox" v-model="editForm.is_private" class="toggle toggle-sm toggle-primary" />
          </label>
          <div v-if="editForm.is_private" class="flex items-center gap-2 pl-2">
            <span class="text-[10px] text-base-content/50">🔢 รหัสเข้าร่วม</span>
            <input type="text" v-model="editForm.invite_passcode" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="0000" class="input input-bordered input-xs w-20 text-center tracking-widest font-bold" />
          </div>

          <!-- Save Button -->
          <button @click="saveParty" :disabled="saving"
            class="w-full py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-content border-0 cursor-pointer hover:bg-primary/80 transition-colors active:scale-[0.98] disabled:opacity-50">
            <span v-if="saving" class="loading loading-spinner loading-xs mr-1"></span>
            {{ saving ? 'กำลังบันทึก...' : 'บันทึก' }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showEditDialog = false">close</button>
      </form>
    </dialog>
  </div>
</template>
