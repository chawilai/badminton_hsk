<script setup></script>

<template>
    <a
        href="#"
        target="_blank"
        class="tw-fixed tw-flex tw-items-center tw-z-50 tw-bottom-0 tw-right-0 tw-px-2.5 tw-py-1.5 tw-mb-3 tw-mr-3 tw-bg-gradient-to-r tw-from-red-500 tw-to-gray-900 tw-rounded tw-text-[0.6rem] tw-text-white tw-font-medium"
    >
        <span class="tw-flex tw-items-center tw-font-bold tw-text-white">
            <!-- <span class="tw-pr-1.5 tw-rounded-full"></span> -->
            <span>
                <slot />
            </span>
        </span>
    </a>
</template>
