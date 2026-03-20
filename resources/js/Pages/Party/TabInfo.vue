<script setup>
import { useLocale } from "@/composables/useLocale";
import { useToast } from "@/composables/useToast";
import { ref, nextTick, computed } from "vue";
import UserAvatar from "@/Components/UserAvatar.vue";
import { usePage, router } from "@inertiajs/vue3";
import { useConfirm } from "@/composables/useConfirm";
import axios from "axios";

const { t } = useLocale();
const toast = useToast();
const { confirm } = useConfirm();
const page = usePage();

const props = defineProps({
  party: { type: Object, required: true },
  costSummary: { type: Object, default: () => ({}) },
  games: { type: Array, default: () => [] },
});

const isHost = props.party.creator_id === page.props.auth.user?.id;
const authUserId = page.props.auth.user?.id;

// Check if current user can leave (not host + no games played)
const myMember = computed(() => props.party.members?.find(m => m.user_id === authUserId));
const canLeave = computed(() => {
  if (!myMember.value) return false;
  // Check if user has played any game in this party
  return !props.games.some(g =>
    g.game_players?.some(gp => gp.user_id === authUserId)
  );
});

// Delete party (host only)
const hasPlayedGames = computed(() => props.games.some(g => g.status === 'finished' || g.status === 'playing'));
const hasOtherMembers = computed(() => (props.party.members?.filter(m => m.user_id !== authUserId) || []).length > 0);
const canDeleteParty = computed(() => isHost && !hasPlayedGames.value && !hasOtherMembers.value);

const confirmDeleteParty = () => {
  if (hasPlayedGames.value) {
    toast.add({ severity: 'error', summary: 'ไม่สามารถลบปาร์ตี้ที่มีเกมเล่นไปแล้วได้', life: 3000 });
    return;
  }
  if (hasOtherMembers.value) {
    toast.add({ severity: 'warn', summary: 'กรุณาลบสมาชิกทั้งหมดออกก่อนจึงจะลบปาร์ตี้ได้', life: 3000 });
    return;
  }
  confirm({
    message: 'ต้องการลบปาร์ตี้นี้หรือไม่? ข้อมูลทั้งหมดจะถูกลบ',
    header: 'ลบปาร์ตี้',
    accept: () => {
      router.delete(`/party/${props.party.id}/delete`, {
        onError: (errors) => {
          toast.add({ severity: 'error', summary: Object.values(errors).flat().join(', ') || 'ไม่สามารถลบได้', life: 3000 });
        },
      });
    },
  });
};

const confirmLeave = () => {
  if (!myMember.value) return;
  confirm({
    message: 'คุณต้องการออกจากปาร์ตี้นี้หรือไม่?',
    header: 'ออกจากปาร์ตี้',
    accept: () => {
      router.post(`/party-members/${myMember.value.id}/leave`, {}, {
        onError: (errors) => {
          toast.add({ severity: 'error', summary: Object.values(errors).flat().join(', ') || 'ไม่สามารถออกได้', life: 3000 });
        },
      });
    },
  });
};

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

// LINE Invitation System
const showInviteDialog = ref(false);
const invitableUsers = ref([]);
const selectedUserIds = ref([]);
const inviteMessage = ref('');
const loadingUsers = ref(false);
const sendingInvites = ref(false);
const userSearch = ref('');
const lineQuota = ref({ quota: 0, used: 0, remaining: 0 });
const quotaLoaded = ref(false);

const filteredUsers = computed(() => {
  if (!userSearch.value) return invitableUsers.value;
  const q = userSearch.value.toLowerCase();
  return invitableUsers.value.filter(u => u.name?.toLowerCase().includes(q));
});

const openInviteDialog = async () => {
  showInviteDialog.value = true;
  selectedUserIds.value = [];
  inviteMessage.value = '';
  userSearch.value = '';
  loadingUsers.value = true;
  try {
    const [usersRes, quotaRes] = await Promise.all([
      axios.get(`/party/${props.party.id}/invitable-users`),
      axios.get('/api/line-quota'),
    ]);
    invitableUsers.value = usersRes.data;
    lineQuota.value = quotaRes.data;
    quotaLoaded.value = true;
  } catch (e) {
    toast.add({ severity: 'error', summary: 'โหลดรายชื่อไม่สำเร็จ', life: 2000 });
  }
  loadingUsers.value = false;
};

const toggleUser = (userId) => {
  const idx = selectedUserIds.value.indexOf(userId);
  if (idx >= 0) {
    selectedUserIds.value.splice(idx, 1);
  } else {
    selectedUserIds.value.push(userId);
  }
};

const selectAll = () => {
  if (selectedUserIds.value.length === filteredUsers.value.length) {
    selectedUserIds.value = [];
  } else {
    selectedUserIds.value = filteredUsers.value.map(u => u.id);
  }
};

const sendInvitations = async () => {
  if (!selectedUserIds.value.length) return;
  sendingInvites.value = true;
  try {
    const res = await axios.post(`/party/${props.party.id}/send-line-invitations`, {
      user_ids: selectedUserIds.value,
      message: inviteMessage.value || null,
    });
    const { sent, skipped, total } = res.data;
    toast.add({
      severity: sent > 0 ? 'success' : 'warn',
      summary: `ส่งเทียบเชิญแล้ว ${sent}/${total} คน`,
      detail: skipped > 0 ? `ข้าม ${skipped} คน (ไม่มี LINE หรือปิดแจ้งเตือน)` : '',
      life: 4000,
    });
    showInviteDialog.value = false;
  } catch (e) {
    toast.add({ severity: 'error', summary: 'ส่งเทียบเชิญไม่สำเร็จ', life: 3000 });
  }
  sendingInvites.value = false;
};
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
            <input type="tel" v-model="passcode" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="0000" class="input input-bordered input-sm w-28 text-center tracking-widest font-bold" @input="passcode = passcode.replace(/[^0-9]/g, '')" />
            <button @click="savePasscode" :disabled="savingPasscode || !passcode || passcode.length < 4" class="btn btn-primary btn-sm text-xs">บันทึก</button>
          </div>
        </div>
      </div>
    </div>

    <!-- LINE Invitation (Host only) -->
    <div v-if="isHost" class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
      <div class="px-4 py-3 border-b border-base-200">
        <div class="text-base font-bold text-base-content m-0">📨 ส่งเทียบเชิญผ่าน LINE</div>
      </div>
      <div class="p-4">
        <p class="text-xs text-base-content/60 mb-3 m-0">เลือกผู้เล่นที่เคยเล่นด้วยเพื่อส่งเทียบเชิญเข้าร่วมปาร์ตี้นี้ผ่าน LINE OA</p>
        <button @click="openInviteDialog"
          class="w-full py-2.5 rounded-xl text-sm font-semibold bg-[#06C755] text-white border-0 cursor-pointer hover:bg-[#05b04c] transition-colors active:scale-[0.98] flex items-center justify-center gap-2">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.271.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
          ส่งเทียบเชิญผ่าน LINE
        </button>
      </div>
    </div>

    <!-- LINE Invite Dialog -->
    <dialog class="modal" :class="{ 'modal-open': showInviteDialog }">
      <div class="modal-box max-w-md p-0 max-h-[85vh]">
        <div class="flex items-center justify-between px-4 pt-4 pb-2 sticky top-0 bg-base-100 z-10">
          <h3 class="text-base font-bold text-base-content m-0">📨 ส่งเทียบเชิญ LINE</h3>
          <button @click="showInviteDialog = false" class="w-7 h-7 rounded-lg bg-base-200 hover:bg-base-300 border-0 cursor-pointer flex items-center justify-center transition-colors">
            <span class="text-base-content/60 text-sm">✕</span>
          </button>
        </div>

        <div class="px-4 pb-4 space-y-4">
          <!-- LINE Quota -->
          <div v-if="quotaLoaded" class="flex items-center justify-between bg-base-200/50 rounded-lg px-3 py-2">
            <span class="text-xs text-base-content/60">LINE credit เดือนนี้</span>
            <span class="text-xs font-bold" :class="lineQuota.remaining > 0 ? 'text-success' : 'text-error'">
              {{ lineQuota.remaining }}/{{ lineQuota.quota }}
            </span>
          </div>
          <div v-if="quotaLoaded && lineQuota.remaining <= 0" class="bg-error/10 border border-error/20 rounded-lg p-3 text-center">
            <div class="text-sm font-bold text-error">LINE credit หมดแล้ว</div>
            <div class="text-xs text-base-content/50 mt-1">ไม่สามารถส่งเทียบเชิญผ่าน LINE ได้ ใช้ลิงก์เชิญแทน</div>
          </div>

          <!-- Search -->
          <input v-model="userSearch" type="text" placeholder="ค้นหาชื่อผู้เล่น..." class="input input-bordered input-sm w-full" />

          <!-- User List -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-semibold text-base-content/60">เลือกผู้เล่น ({{ selectedUserIds.length }})</span>
              <button v-if="filteredUsers.length > 0" @click="selectAll" class="text-xs font-medium text-primary border-0 bg-transparent cursor-pointer hover:underline">
                {{ selectedUserIds.length === filteredUsers.length ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด' }}
              </button>
            </div>

            <div v-if="loadingUsers" class="flex justify-center py-8">
              <span class="loading loading-spinner loading-md text-primary"></span>
            </div>

            <div v-else-if="filteredUsers.length === 0" class="text-center py-8">
              <div class="text-3xl mb-2">👥</div>
              <div class="text-sm text-base-content/40">{{ userSearch ? 'ไม่พบผู้เล่นที่ค้นหา' : 'ไม่มีผู้เล่นที่สามารถเชิญได้' }}</div>
              <div v-if="!userSearch" class="text-xs text-base-content/30 mt-1">ผู้เล่นต้องเคยอยู่ในปาร์ตี้เดียวกับคุณและมีบัญชี LINE</div>
            </div>

            <div v-else class="space-y-1 max-h-[35vh] overflow-y-auto">
              <div
                v-for="user in filteredUsers"
                :key="user.id"
                @click="toggleUser(user.id)"
                class="flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-colors"
                :class="selectedUserIds.includes(user.id) ? 'bg-primary/10 border border-primary/30' : 'bg-base-200/50 hover:bg-base-200 border border-transparent'"
              >
                <div class="relative">
                  <UserAvatar :src="user.avatar" :name="user.name" size="md" rounded="xl" />
                  <div v-if="selectedUserIds.includes(user.id)"
                    class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-primary-content" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-base-content truncate">{{ user.name }}</div>
                </div>
                <input type="checkbox" :checked="selectedUserIds.includes(user.id)" class="checkbox checkbox-primary checkbox-sm" @click.stop />
              </div>
            </div>
          </div>

          <!-- Message -->
          <div>
            <label class="text-xs font-semibold text-base-content/60 block mb-1.5">ข้อความเพิ่มเติม (ไม่บังคับ)</label>
            <textarea v-model="inviteMessage" rows="3" maxlength="500"
              class="textarea textarea-bordered textarea-sm w-full text-xs"
              placeholder="เช่น มาตีแบดกันเถอะ! สนามดี ลมเย็น 🏸"></textarea>
            <div class="text-right text-[10px] text-base-content/30 mt-0.5">{{ inviteMessage.length }}/500</div>
          </div>

          <!-- Quota warning -->
          <div v-if="quotaLoaded && selectedUserIds.length > 0 && lineQuota.remaining < selectedUserIds.length && lineQuota.remaining > 0"
            class="text-xs text-warning text-center">
            เลือก {{ selectedUserIds.length }} คน แต่ credit เหลือ {{ lineQuota.remaining }} — กรุณาลดจำนวน
          </div>

          <!-- Send Button -->
          <button @click="sendInvitations" :disabled="sendingInvites || !selectedUserIds.length || lineQuota.remaining < selectedUserIds.length"
            class="w-full py-2.5 rounded-xl text-sm font-semibold bg-[#06C755] text-white border-0 cursor-pointer hover:bg-[#05b04c] transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <span v-if="sendingInvites" class="loading loading-spinner loading-xs"></span>
            <template v-else>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
            </template>
            {{ sendingInvites ? 'กำลังส่ง...' : `ส่งเทียบเชิญ ${selectedUserIds.length ? `(${selectedUserIds.length} คน)` : ''}` }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="showInviteDialog = false">close</button>
      </form>
    </dialog>

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

    <!-- Leave Party (non-host, no games played) -->
    <div v-if="!isHost && canLeave" class="pt-2">
      <button @click="confirmLeave"
        class="w-full py-2.5 rounded-xl text-sm font-semibold bg-error/10 text-error border border-error/20 cursor-pointer hover:bg-error/20 transition-colors active:scale-[0.98] flex items-center justify-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        ออกจากปาร์ตี้
      </button>
    </div>

    <!-- Delete Party (host only) -->
    <div v-if="isHost && !hasPlayedGames" class="pt-2">
      <button @click="confirmDeleteParty"
        class="w-full py-2.5 rounded-xl text-sm font-semibold border cursor-pointer transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
        :class="canDeleteParty ? 'bg-error/10 text-error border-error/20 hover:bg-error/20' : 'bg-base-200 text-base-content/40 border-base-300'">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        ลบปาร์ตี้
      </button>
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
            <input type="tel" v-model="editForm.invite_passcode" maxlength="4" inputmode="numeric" pattern="[0-9]*" placeholder="0000" class="input input-bordered input-xs w-20 text-center tracking-widest font-bold" @input="editForm.invite_passcode = editForm.invite_passcode.replace(/[^0-9]/g, '')" />
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
