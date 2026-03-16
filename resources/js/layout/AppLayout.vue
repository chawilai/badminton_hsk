<script setup>
import BadmintonLayout from './BadmintonLayout.vue';
</script>

<template>
    <BadmintonLayout>
        <template #header>
            <slot name="header" />
        </template>
        <slot />
    </BadmintonLayout>
</template>
