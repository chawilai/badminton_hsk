<script setup>
import { onMounted, ref } from 'vue';

const model = defineModel({
    type: String,
    required: true,
});

const input = ref(null);

onMounted(() => {
    if (input.value.hasAttribute('autofocus')) {
        input.value.focus();
    }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
    <input
        class="tw-w-full tw-px-4 tw-py-2.5 tw-rounded-xl tw-border tw-border-gray-300 dark:tw-border-court-700 tw-bg-white dark:tw-bg-court-900 tw-text-gray-900 dark:tw-text-gray-100 tw-text-sm focus:tw-border-court-500 focus:tw-ring-2 focus:tw-ring-court-500/20 tw-outline-none tw-transition-all"
        v-model="model"
        ref="input"
    />
</template>
