<script setup></script>

<template>
    <a
        href="#"
        target="_blank"
        class="fixed flex items-center z-50 bottom-0 right-0 px-2.5 py-1.5 mb-3 mr-3 bg-gradient-to-r from-red-500 to-gray-900 rounded text-[0.6rem] text-white font-medium"
    >
        <span class="flex items-center font-bold text-white">
            <!-- <span class="pr-1.5 rounded-full"></span> -->
            <span>
                <slot />
            </span>
        </span>
    </a>
</template>
