<script setup>
import { ref } from 'vue';

const props = defineProps({
    src: { type: String, default: null },
    name: { type: String, default: '?' },
    size: { type: String, default: 'md' }, // sm=7, md=9, lg=10, xl=16, 2xl=20, 3xl=24
    rounded: { type: String, default: 'xl' }, // full, xl, 2xl
});

const failed = ref(false);

const onError = () => { failed.value = true; };

const initials = () => {
    const n = (props.name || '?').trim();
    if (!n) return '?';
    // Handle emoji-heavy names — take first non-emoji char
    const clean = n.replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u{1F900}-\u{1F9FF}]|[\u200B-\u200D\uFEFF\u2800]/gu, '').trim();
    if (clean.length === 0) return n[0] || '?';
    return clean[0].toUpperCase();
};

const bgColor = () => {
    // Deterministic color from name
    const colors = [
        'tw-bg-court-200 tw-text-court-700',
        'tw-bg-blue-200 tw-text-blue-700',
        'tw-bg-amber-200 tw-text-amber-700',
        'tw-bg-pink-200 tw-text-pink-700',
        'tw-bg-purple-200 tw-text-purple-700',
        'tw-bg-teal-200 tw-text-teal-700',
        'tw-bg-orange-200 tw-text-orange-700',
        'tw-bg-indigo-200 tw-text-indigo-700',
    ];
    let hash = 0;
    for (let i = 0; i < (props.name || '').length; i++) {
        hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const sizeClasses = {
    sm: 'tw-w-7 tw-h-7 tw-text-[9px]',
    md: 'tw-w-9 tw-h-9 tw-text-xs',
    lg: 'tw-w-10 tw-h-10 tw-text-sm',
    xl: 'tw-w-16 tw-h-16 tw-text-xl',
    '2xl': 'tw-w-20 tw-h-20 tw-text-2xl',
    '3xl': 'tw-w-24 tw-h-24 tw-text-3xl',
};

const roundedClasses = {
    full: 'tw-rounded-full',
    xl: 'tw-rounded-xl',
    '2xl': 'tw-rounded-2xl',
};
</script>

<template>
    <img
        v-if="src && !failed"
        :src="src"
        :alt="name"
        @error="onError"
        class="tw-object-cover tw-bg-gray-100 dark:tw-bg-court-800"
        :class="[sizeClasses[size] || sizeClasses.md, roundedClasses[rounded] || roundedClasses.xl]"
    />
    <div
        v-else
        class="tw-flex tw-items-center tw-justify-center tw-font-bold tw-shrink-0"
        :class="[sizeClasses[size] || sizeClasses.md, roundedClasses[rounded] || roundedClasses.xl, bgColor()]"
    >
        {{ initials() }}
    </div>
</template>
