<script setup>
import { Link } from '@inertiajs/vue3';

defineProps({
    href: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <Link
        :href="href"
        class="tw-block tw-w-full tw-px-4 tw-py-2 tw-text-start tw-text-sm tw-leading-5 tw-text-red tw-font-bold dark:tw-text-gray-300 hover:tw-bg-red-100 hover:tw-rounded-lg dark:hover:tw-bg-red focus:tw-outline-none focus:tw-bg-gray-100 dark:focus:tw-bg-red tw-transition tw-duration-150 tw-ease-in-out"
    >
        <slot />
    </Link>
</template>
