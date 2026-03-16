<script setup>
import { toasts, useToast } from "@/composables/useToast";

const { remove } = useToast();

const alertClass = (severity) => {
    switch (severity) {
        case "success": return "alert-success";
        case "error": return "alert-error";
        case "warn":
        case "warning": return "alert-warning";
        case "contrast": return "alert-neutral";
        default: return "alert-info";
    }
};

const iconClass = (severity) => {
    switch (severity) {
        case "success": return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
        case "error": return "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z";
        case "warn":
        case "warning": return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z";
        default: return "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
    }
};
</script>

<template>
    <div class="toast toast-top toast-end z-[9999]">
        <transition-group name="toast-slide">
            <div
                v-for="t in toasts"
                :key="t.id"
                role="alert"
                class="alert shadow-lg cursor-pointer max-w-sm"
                :class="alertClass(t.severity)"
                @click="remove(t.id)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconClass(t.severity)" />
                </svg>
                <div class="flex flex-col">
                    <span class="font-bold text-sm" v-if="t.summary">{{ t.summary }}</span>
                    <span class="text-xs" v-if="t.detail">{{ t.detail }}</span>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<style scoped>
.toast-slide-enter-active {
    transition: all 0.3s ease-out;
}
.toast-slide-leave-active {
    transition: all 0.2s ease-in;
}
.toast-slide-enter-from {
    opacity: 0;
    transform: translateX(100px);
}
.toast-slide-leave-to {
    opacity: 0;
    transform: translateX(100px);
}
</style>
