<script setup>
import UserAvatar from "@/Components/UserAvatar.vue";
import { ref, computed, watch } from "vue";
import { router } from "@inertiajs/vue3";
import { useToast } from "@/composables/useToast";

const toast = useToast();

const props = defineProps({
  show: { type: Boolean, default: false },
  party: { type: Object, required: true },
});

const emit = defineEmits(['close']);

// Default to next week same day
const getNextWeekDate = () => {
  const d = new Date(props.party.play_date + 'T00:00:00');
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
};

const playDate = ref(getNextWeekDate());
const submitting = ref(false);

// Members from original party (only those who actually played games)
const members = ref([]);

const initMembers = () => {
  const partyMembers = props.party.members || [];
  members.value = partyMembers.map(m => ({
    user_id: m.user_id,
    name: m.display_name || m.user?.name || 'Unknown',
    avatar: m.user?.avatar,
    role: m.role,
    selected: true, // all selected by default
  }));
};

watch(() => props.show, (val) => {
  if (val) {
    playDate.value = getNextWeekDate();
    initMembers();
  }
});

const selectedCount = computed(() => members.value.filter(m => m.selected).length);

const toggleAll = () => {
  const allSelected = members.value.every(m => m.selected);
  members.value.forEach(m => m.selected = !allSelected);
};

const dayLabel = computed(() => {
  if (!playDate.value) return '';
  const d = new Date(playDate.value + 'T00:00:00');
  const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
  return `วัน${days[d.getDay()]}`;
});

const duplicateParty = () => {
  if (submitting.value) return;
  submitting.value = true;

  const memberIds = members.value.filter(m => m.selected).map(m => m.user_id);

  router.post(`/party/${props.party.id}/duplicate`, {
    play_date: playDate.value,
    member_ids: memberIds,
  }, {
    onSuccess: () => {
      toast.add({ severity: 'success', summary: 'สร้างปาร์ตี้ใหม่เรียบร้อย!', life: 3000 });
      emit('close');
    },
    onError: () => {
      toast.add({ severity: 'error', summary: 'เกิดข้อผิดพลาด', life: 3000 });
    },
    onFinish: () => {
      submitting.value = false;
    },
  });
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
    <div class="fixed inset-0 bg-black/60" @click="emit('close')"></div>

    <div class="relative bg-base-100 w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto z-10">
      <!-- Header -->
      <div class="sticky top-0 bg-base-100 px-4 py-3 border-b border-base-200 flex items-center justify-between z-10">
        <div class="text-base font-bold text-base-content">🔄 ตั้งตี้ใหม่จากก๊วนเดิม</div>
        <button @click="emit('close')" class="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center border-0 cursor-pointer hover:bg-base-300">✕</button>
      </div>

      <div class="p-4 pb-24 space-y-4">
        <!-- Party info preview -->
        <div class="bg-base-200/50 rounded-xl p-3 space-y-1">
          <div class="text-xs font-bold text-base-content">{{ party.name || party.court?.name }}</div>
          <div class="text-[10px] text-base-content/50">
            🏟️ {{ party.court?.name }} · {{ party.start_time?.substring(0,5) }}-{{ party.end_time?.substring(0,5) }} · {{ party.play_hours }} ชม.
          </div>
          <div class="text-[10px] text-base-content/50">
            💰 {{ party.cost_type === 'free' ? 'ฟรี' : party.cost_type === 'per_person' ? `รายหัว ฿${party.cost_amount}` : `หารเท่า ฿${party.cost_amount}/ชม.` }}
            {{ party.shuttlecock_cost ? ` · ลูก ฿${party.shuttlecock_cost}` : '' }}
          </div>
        </div>

        <!-- Date picker -->
        <div>
          <label class="text-xs font-semibold text-base-content mb-1 block">📅 วันเล่นใหม่</label>
          <input type="date" v-model="playDate" class="input input-bordered input-sm w-full" />
          <div v-if="dayLabel" class="text-[10px] text-primary font-medium mt-0.5">{{ dayLabel }}</div>
        </div>

        <!-- Member selection -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs font-bold text-base-content/60 uppercase">เลือกผู้เล่น ({{ selectedCount }}/{{ members.length }})</div>
            <button @click="toggleAll" class="text-[10px] text-primary font-semibold border-0 bg-transparent cursor-pointer">
              {{ members.every(m => m.selected) ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด' }}
            </button>
          </div>

          <div class="space-y-1.5">
            <div
              v-for="m in members"
              :key="m.user_id"
              @click="m.selected = !m.selected"
              class="flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all"
              :class="m.selected ? 'border-primary/40 bg-primary/5' : 'border-base-300 bg-base-100 opacity-50'"
            >
              <input type="checkbox" :checked="m.selected" class="checkbox checkbox-primary checkbox-xs" @click.stop="m.selected = !m.selected" />
              <UserAvatar :src="m.avatar" :name="m.name" size="sm" rounded="full" />
              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-base-content truncate">{{ m.name }}</div>
                <div v-if="m.role === 'Host'" class="text-[9px] text-primary font-bold">HOST</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="emit('close')"
            class="flex-1 h-10 rounded-xl text-sm font-semibold bg-base-200 text-base-content/70 border-0 cursor-pointer hover:bg-base-300 transition-colors"
          >ยกเลิก</button>
          <button
            @click="duplicateParty"
            :disabled="submitting || !playDate || selectedCount === 0"
            class="flex-1 h-10 rounded-xl text-sm font-bold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            🔄 สร้างปาร์ตี้ใหม่
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
