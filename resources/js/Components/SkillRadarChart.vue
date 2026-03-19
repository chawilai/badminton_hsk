<script setup>
import { computed } from 'vue';

const props = defineProps({
  skills: { type: Object, required: true },
  size: { type: Number, default: 280 },
  showLabels: { type: Boolean, default: true },
});

const skillDefs = [
  { key: 'serve', label: 'เสิร์ฟ', icon: '🏸' },
  { key: 'smash', label: 'สแมช', icon: '💥' },
  { key: 'clear', label: 'เคลียร์', icon: '🌈' },
  { key: 'net_play', label: 'หน้าเน็ต', icon: '🕸️' },
  { key: 'defense', label: 'เกมรับ', icon: '🛡️' },
  { key: 'backhand', label: 'แบ็คแฮนด์', icon: '🔄' },
  { key: 'deception', label: 'ลูกหลอก', icon: '🎭' },
  { key: 'footwork', label: 'ฟุตเวิร์ค', icon: '👟' },
  { key: 'speed', label: 'ความเร็ว', icon: '⚡' },
  { key: 'stamina', label: 'สตามิน่า', icon: '❤️‍🔥' },
];

const N = skillDefs.length;
const cx = computed(() => props.size / 2);
const cy = computed(() => props.size / 2);
const maxR = computed(() => props.size / 2 - 36);

const getPoint = (index, value) => {
  const angle = (-90 + index * (360 / N)) * Math.PI / 180;
  const r = (value / 10) * maxR.value;
  return {
    x: cx.value + r * Math.cos(angle),
    y: cy.value + r * Math.sin(angle),
  };
};

// Grid rings (at levels 2, 4, 6, 8, 10)
const gridRings = computed(() => {
  return [2, 4, 6, 8, 10].map(level => {
    const points = Array.from({ length: N }, (_, i) => {
      const p = getPoint(i, level);
      return `${p.x},${p.y}`;
    });
    return points.join(' ');
  });
});

// Axis lines from center to edge
const axisLines = computed(() => {
  return skillDefs.map((_, i) => {
    const p = getPoint(i, 10);
    return { x1: cx.value, y1: cy.value, x2: p.x, y2: p.y };
  });
});

// Data polygon
const dataPolygon = computed(() => {
  return skillDefs.map((def, i) => {
    const val = props.skills[def.key] || 1;
    const p = getPoint(i, val);
    return `${p.x},${p.y}`;
  }).join(' ');
});

// Data points
const dataPoints = computed(() => {
  return skillDefs.map((def, i) => {
    const val = props.skills[def.key] || 1;
    return getPoint(i, val);
  });
});

// Label positions (slightly outside)
const labelPositions = computed(() => {
  return skillDefs.map((def, i) => {
    const p = getPoint(i, 11.8);
    return { ...def, x: p.x, y: p.y };
  });
});
</script>

<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="block">
    <!-- Grid rings -->
    <polygon
      v-for="(ring, i) in gridRings"
      :key="'ring-' + i"
      :points="ring"
      fill="none"
      class="stroke-base-content/10"
      stroke-width="0.5"
    />

    <!-- Axis lines -->
    <line
      v-for="(line, i) in axisLines"
      :key="'axis-' + i"
      :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2"
      class="stroke-base-content/10"
      stroke-width="0.5"
    />

    <!-- Data polygon fill -->
    <polygon
      :points="dataPolygon"
      class="fill-primary/20 stroke-primary"
      stroke-width="2"
      stroke-linejoin="round"
    />

    <!-- Data points -->
    <circle
      v-for="(p, i) in dataPoints"
      :key="'point-' + i"
      :cx="p.x" :cy="p.y"
      r="3.5"
      class="fill-primary stroke-base-100"
      stroke-width="1.5"
    />

    <!-- Labels -->
    <template v-if="showLabels">
      <text
        v-for="lbl in labelPositions"
        :key="'label-' + lbl.key"
        :x="lbl.x"
        :y="lbl.y"
        text-anchor="middle"
        dominant-baseline="central"
        class="fill-base-content/70"
        style="font-size: 10px; font-weight: 600;"
      >{{ lbl.icon }} {{ lbl.label }}</text>
    </template>
  </svg>
</template>
