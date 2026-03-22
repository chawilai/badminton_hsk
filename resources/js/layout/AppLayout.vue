<script setup>
import BadmintonLayout from './BadmintonLayout.vue';

defineProps({
    fullWidth: { type: Boolean, default: false },
});
</script>

<template>
    <BadmintonLayout :fullWidth="fullWidth">
        <template #header>
            <slot name="header" />
        </template>
        <slot />
    </BadmintonLayout>
</template>
