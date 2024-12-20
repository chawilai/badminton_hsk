<script setup>
import { ref, computed } from 'vue';

// Properties
const outerSize = ref(150); // ขนาดสี่เหลี่ยมภายนอก
const innerSize = ref(120); // ขนาดสี่เหลี่ยมภายใน
const outerColor = ref('#AAA'); // สีขอบสี่เหลี่ยมภายนอก
const innerColor = ref('#CCC'); // สีขอบสี่เหลี่ยมภายใน
const boderSize = ref('2px')
const diagonalColor = ref('#CCC'); // สีเส้นทะแยงมุม

// ความยาวเส้นทะแยงมุม
const diagonalLength = computed(() => Math.sqrt(2) * outerSize.value * 0.97);

console.log(diagonalLength.value)
</script>

<template>
  <div
    class="relative flex items-center justify-center"
    :style="{ width: `${outerSize}px`, height: `${outerSize}px`, border: `${boderSize} solid ${outerColor}`, zIndex: 3 }"
  >
    <div
      class="absolute"
      :style="{
        width: `${innerSize}px`,
        height: `${innerSize}px`,
        border: `${boderSize} solid ${innerColor}`,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2,
      }"
    ></div>
    <div
      class="absolute"
      :style="{
        width: `${diagonalLength}px`,
        height: `${boderSize}`,
        backgroundColor: diagonalColor,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(45deg)',
        transformOrigin: 'center',
        zIndex: 1,
      }"
    ></div>
    <div
      class="absolute"
      :style="{
        width: `${diagonalLength}px`,
        height: `${boderSize}`,
        backgroundColor: diagonalColor,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-45deg)',
        transformOrigin: 'center',
        zIndex: 1,
      }"
    ></div>

    <slot />
  </div>
</template>

<style scoped>
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
</style>
