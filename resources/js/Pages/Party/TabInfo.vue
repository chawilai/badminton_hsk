<script setup>
import { useLocale } from "@/composables/useLocale";

const { t } = useLocale();

const props = defineProps({
  party: { type: Object, required: true },
});
</script>

<template>
  <div class="space-y-4">
    <!-- Court Info -->
    <div class="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
      <div class="px-4 py-3 border-b border-base-200">
        <h3 class="text-base font-bold text-base-content m-0">{{ t('info.court') }}</h3>
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
        <h3 class="text-base font-bold text-base-content m-0">{{ t('info.partyDetails') }}</h3>
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
  </div>
</template>
