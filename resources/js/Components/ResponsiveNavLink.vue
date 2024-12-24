<script setup>
import { computed } from 'vue';
import { Link } from '@inertiajs/vue3';

// Define props
const props = defineProps({
    href: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: false, // Providing a default value for safety
    },
});

// Computed classes based on the `active` prop
const classes = computed(() =>
    props.active
        ? 'tw-block tw-w-full tw-ps-3 tw-pe-4 tw-py-2 tw-border-l-4 tw-border-indigo-400 dark:tw-border-indigo-600 tw-text-start tw-text-base tw-font-medium tw-text-indigo-700 dark:tw-text-indigo-300 tw-bg-indigo-50 dark:tw-bg-indigo-900/50 focus:tw-outline-none focus:tw-text-indigo-800 dark:focus:tw-text-indigo-200 focus:tw-bg-indigo-100 dark:focus:tw-bg-indigo-900 focus:tw-border-indigo-700 dark:focus:tw-border-indigo-300 tw-transition tw-duration-150 tw-ease-in-out'
        : 'tw-block tw-w-full tw-ps-3 tw-pe-4 tw-py-2 tw-border-l-4 tw-border-transparent tw-text-start tw-text-base tw-font-medium tw-text-gray-600 dark:tw-text-gray-400 hover:tw-text-gray-800 dark:hover:tw-text-gray-200 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 hover:tw-border-gray-300 dark:hover:tw-border-gray-600 focus:tw-outline-none focus:tw-text-gray-800 dark:focus:tw-text-gray-200 focus:tw-bg-gray-50 dark:focus:tw-bg-gray-700 focus:tw-border-gray-300 dark:focus:tw-border-gray-600 tw-transition tw-duration-150 tw-ease-in-out'
);
</script>

<template>
    <Link :href="href" :class="classes">
        <slot />
    </Link>
</template>
