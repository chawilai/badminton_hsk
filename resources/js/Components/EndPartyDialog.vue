<script setup>
import UserAvatar from "@/Components/UserAvatar.vue";
import { ref, reactive, computed, watch } from "vue";
import { router } from "@inertiajs/vue3";
import { useToast } from "@/composables/useToast";

const toast = useToast();

const props = defineProps({
  show: { type: Boolean, default: false },
  party: { type: Object, required: true },
  games: { type: Array, default: () => [] },
  costSummary: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['close']);

const isOver = computed(() => props.party.status === 'Over');

// Editable cost fields
const courtCostPerHour = ref(props.party.cost_amount || props.party.court?.play_price || 0);
const playHours = ref(props.party.play_hours || 0);
const shuttleCostPerUnit = ref(props.party.shuttlecock_cost || 0);
const shuttlecockUsed = ref(props.costSummary?.shuttlecock_used || 0);
const submitting = ref(false);

// Player list with fix/custom amounts
const players = ref([]);

const initPlayers = () => {
  const finishedGames = props.games.filter(g => g.status === 'finished');

  players.value = (props.party.members || []).map(m => {
    let gamesPlayed = 0;
    let totalSeconds = 0;

    finishedGames.forEach(game => {
      const gp = game.game_players?.find(p => p.user_id === m.user_id);
      if (gp) {
        gamesPlayed++;
        if (game.game_start_date && game.game_end_date) {
          const dur = Math.floor((new Date(game.game_end_date) - new Date(game.game_start_date)) / 1000);
          if (dur > 0) totalSeconds += dur;
        }
      }
    });

    return {
      user_id: m.user_id,
      name: m.display_name || m.user?.name || 'Unknown',
      avatar: m.user?.avatar,
      provider: m.user?.provider,
      games: gamesPlayed,
      totalSeconds,
      fixed: false,
      customAmount: 0,
      sendLine: m.user?.provider === 'line',
    };
  });
};

watch(() => props.show, (val) => {
  if (val) initPlayers();
});

// Cost calculations
const courtCostTotal = computed(() => courtCostPerHour.value * playHours.value);
const shuttleCostTotal = computed(() => shuttleCostPerUnit.value * shuttlecockUsed.value);
const totalCost = computed(() => courtCostTotal.value + shuttleCostTotal.value);

const fixedTotal = computed(() =>
  players.value.filter(p => p.fixed).reduce((sum, p) => sum + Number(p.customAmount || 0), 0)
);

const unfixedPlayers = computed(() => players.value.filter(p => !p.fixed));
const remainingAmount = computed(() => totalCost.value - fixedTotal.value);
const perUnfixedPerson = computed(() => {
  const count = unfixedPlayers.value.length;
  return count > 0 ? Math.max(0, remainingAmount.value / count) : 0;
});

// Display amount for each player
const playerAmount = (p) => {
  if (p.fixed) return Math.max(0, Number(p.customAmount || 0));
  return perUnfixedPerson.value;
};

// Total check
const totalAssigned = computed(() =>
  players.value.reduce((sum, p) => sum + playerAmount(p), 0)
);

const formatMinutes = (seconds) => {
  if (!seconds) return '0 นาที';
  const m = Math.floor(seconds / 60);
  return `${m} นาที`;
};

const toggleFixed = (player) => {
  player.fixed = !player.fixed;
  if (player.fixed) {
    player.customAmount = Math.ceil(perUnfixedPerson.value);
  }
};

// LINE send selection
const linePlayers = computed(() => players.value.filter(p => p.provider === 'line'));
const lineSelectedCount = computed(() => players.value.filter(p => p.sendLine).length);
const allLineSelected = computed(() => linePlayers.value.length > 0 && linePlayers.value.every(p => p.sendLine));

const toggleAllLine = () => {
  const newVal = !allLineSelected.value;
  linePlayers.value.forEach(p => p.sendLine = newVal);
};

const endParty = () => {
  if (submitting.value) return;
  submitting.value = true;

  const settlements = players.value.map(p => ({
    user_id: p.user_id,
    amount: Math.ceil(playerAmount(p)),
    fixed: p.fixed,
  }));

  router.post(`/party/${props.party.id}/end`, {
    court_cost_per_hour: courtCostPerHour.value,
    play_hours: playHours.value,
    shuttlecock_cost_per_unit: shuttleCostPerUnit.value,
    shuttlecock_used: shuttlecockUsed.value,
    total_cost: totalCost.value,
    settlements,
    send_line_to: players.value.filter(p => p.sendLine).map(p => p.user_id),
  }, {
    onSuccess: () => {
      toast.add({ severity: 'success', summary: 'จบปาร์ตี้เรียบร้อย! ส่งสรุปเข้า LINE แล้ว', life: 3000 });
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
        <div class="text-base font-bold text-base-content">{{ isOver ? '💰 สรุปค่าใช้จ่าย' : '🏁 จบปาร์ตี้ & สรุปค่าใช้จ่าย' }}</div>
        <button @click="emit('close')" class="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center border-0 cursor-pointer hover:bg-base-300">✕</button>
      </div>

      <div class="p-4 pb-24 space-y-4">
        <!-- Cost Inputs -->
        <div class="bg-base-200/50 rounded-xl p-3 space-y-3">
          <div class="text-xs font-bold text-base-content/60 uppercase">ค่าใช้จ่าย</div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] text-base-content/50 mb-0.5 block">ค่าคอร์ท/ชม. (฿)</label>
              <input type="number" v-model.number="courtCostPerHour" min="0" class="input input-bordered input-sm w-full" />
            </div>
            <div>
              <label class="text-[10px] text-base-content/50 mb-0.5 block">จำนวนชั่วโมง</label>
              <input type="number" v-model.number="playHours" min="0" step="0.5" class="input input-bordered input-sm w-full" />
            </div>
            <div>
              <label class="text-[10px] text-base-content/50 mb-0.5 block">ราคาลูก/ลูก (฿)</label>
              <input type="number" v-model.number="shuttleCostPerUnit" min="0" class="input input-bordered input-sm w-full" />
            </div>
            <div>
              <label class="text-[10px] text-base-content/50 mb-0.5 block">ลูกแบดที่ใช้</label>
              <input type="number" v-model.number="shuttlecockUsed" min="0" class="input input-bordered input-sm w-full" />
            </div>
          </div>

          <!-- Summary row -->
          <div class="flex items-center justify-between pt-2 border-t border-base-300">
            <div class="text-xs text-base-content/50">
              คอร์ท ฿{{ courtCostTotal.toLocaleString() }} + ลูกแบด ฿{{ shuttleCostTotal.toLocaleString() }}
            </div>
            <div class="text-sm font-black text-primary">รวม ฿{{ totalCost.toLocaleString() }}</div>
          </div>
        </div>

        <!-- Player Settlement List -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <div class="text-xs font-bold text-base-content/60 uppercase">รายชื่อผู้เล่น ({{ players.length }})</div>
            <div class="flex items-center gap-2">
              <div class="text-[10px] text-base-content/40">กด 📌 เพื่อ fix ราคา</div>
              <button
                v-if="linePlayers.length > 0"
                @click="toggleAllLine"
                class="text-[10px] px-2 py-0.5 rounded-full border-0 cursor-pointer transition-all"
                :class="allLineSelected ? 'bg-success/20 text-success' : 'bg-base-200 text-base-content/40 hover:bg-base-300'"
              >LINE {{ allLineSelected ? 'ALL' : `${lineSelectedCount}/${linePlayers.length}` }}</button>
            </div>
          </div>

          <div class="space-y-1.5">
            <div
              v-for="p in players"
              :key="p.user_id"
              class="bg-base-100 rounded-xl border p-2.5 flex items-center gap-2"
              :class="p.fixed ? 'border-warning/50 bg-warning/5' : 'border-base-300'"
            >
              <UserAvatar :src="p.avatar" :name="p.name" size="sm" rounded="full" />

              <div class="flex-1 min-w-0">
                <div class="text-xs font-bold text-base-content truncate">{{ p.name }}</div>
                <div class="text-[9px] text-base-content/40">{{ p.games }} เกม · {{ formatMinutes(p.totalSeconds) }}</div>
              </div>

              <!-- LINE send toggle -->
              <button
                v-if="p.provider === 'line'"
                @click="p.sendLine = !p.sendLine"
                class="w-7 h-7 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-all text-sm"
                :class="p.sendLine ? 'bg-success/20 text-success' : 'bg-base-200 text-base-content/30 hover:bg-base-300'"
                :title="p.sendLine ? 'ไม่ส่ง LINE' : 'ส่ง LINE'"
              >
                <svg v-if="p.sendLine" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>
              </button>
              <div v-else class="w-7 h-7 rounded-lg flex items-center justify-center bg-base-200/50 text-base-content/20 text-[10px]" title="ไม่มี LINE">--</div>

              <!-- Fix toggle -->
              <button
                @click="toggleFixed(p)"
                class="w-7 h-7 rounded-lg flex items-center justify-center border-0 cursor-pointer transition-all text-sm"
                :class="p.fixed ? 'bg-warning/20 text-warning' : 'bg-base-200 text-base-content/30 hover:bg-base-300'"
                :title="p.fixed ? 'ปลด fix' : 'Fix ราคา'"
              >📌</button>

              <!-- Amount -->
              <div class="w-20 shrink-0">
                <input
                  v-if="p.fixed"
                  type="number"
                  v-model.number="p.customAmount"
                  min="0"
                  class="input input-bordered input-sm w-full text-right text-xs font-bold text-warning"
                />
                <div v-else class="text-right text-sm font-bold text-primary">
                  ฿{{ Math.ceil(perUnfixedPerson).toLocaleString() }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total check -->
        <div class="bg-primary/10 rounded-xl p-3 flex items-center justify-between">
          <div>
            <div class="text-xs font-bold text-primary">💰 รวมทั้งหมด</div>
            <div class="text-[10px] text-base-content/40">ส่งสรุปรายบุคคลเข้า LINE</div>
          </div>
          <div class="text-xl font-black text-primary">฿{{ Math.ceil(totalAssigned).toLocaleString() }}</div>
        </div>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            @click="emit('close')"
            class="flex-1 h-10 rounded-xl text-sm font-semibold bg-base-200 text-base-content/70 border-0 cursor-pointer hover:bg-base-300 transition-colors"
          >{{ isOver ? 'ปิด' : 'ยกเลิก' }}</button>
          <button
            v-if="!isOver"
            @click="endParty"
            :disabled="submitting || totalCost <= 0"
            class="flex-1 h-10 rounded-xl text-sm font-bold bg-error text-white border-0 cursor-pointer hover:bg-error/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            🏁 จบปาร์ตี้
          </button>
          <button
            v-if="isOver"
            @click="endParty"
            :disabled="submitting"
            class="flex-1 h-10 rounded-xl text-sm font-bold bg-primary text-white border-0 cursor-pointer hover:bg-primary/80 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
          >
            <span v-if="submitting" class="loading loading-spinner loading-xs"></span>
            📨 ส่งสรุปเข้า LINE ({{ lineSelectedCount }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
