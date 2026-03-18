<script setup>
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();

const props = defineProps({
  party: { type: Object, required: true },
  costSummary: { type: Object, default: () => ({}) },
});

const costTypeLabel = (type) => {
  const map = { free: 'ฟรี', per_person: 'จ่ายรายหัว', split_equal: 'หารเท่า' };
  return map[type] || '-';
};
</script>

<template>
  <div class="space-y-4">
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
  </div>
</template>
