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
        class="block w-full px-4 py-2 text-start text-sm leading-5 text-red font-bold dark:text-gray-300 hover:bg-red-100 hover:rounded-lg dark:hover:bg-red focus:outline-none focus:bg-gray-100 dark:focus:bg-red transition duration-150 ease-in-out"
    >
        <slot />
    </Link>
</template>
