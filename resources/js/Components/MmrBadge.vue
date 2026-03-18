<script setup>
defineProps({
  level: {
    type: Number,
    required: true,
  },
  tierName: {
    type: String,
    required: true,
  },
  tierColor: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'sm',
    validator: (val) => ['sm', 'md'].includes(val),
  },
});
</script>

<template>
  <!-- Small inline badge: "Lv.15 tierName" -->
  <span
    v-if="size === 'sm'"
    class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold leading-tight whitespace-nowrap"
    :style="{
      backgroundColor: tierColor + '20',
      color: tierColor,
    }"
  >
    <span class="font-black">Lv.{{ level }}</span>
    <span class="font-semibold">{{ tierName }}</span>
  </span>

  <!-- Medium badge: bigger with level number prominent -->
  <span
    v-else
    class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold leading-tight whitespace-nowrap shadow-md"
    :style="{
      backgroundColor: tierColor + '20',
      color: tierColor,
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: tierColor + '40',
    }"
  >
    <span
      class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-black text-white"
      :style="{ backgroundColor: tierColor }"
    >
      {{ level }}
    </span>
    <span class="font-bold text-base">{{ tierName }}</span>
  </span>
</template>
