<script setup>
import { confirmState, useConfirm } from "@/composables/useConfirm";

const { close } = useConfirm();

const handleAccept = () => {
    if (confirmState.accept) confirmState.accept();
    close();
};

const handleReject = () => {
    if (confirmState.reject) confirmState.reject();
    close();
};
</script>

<template>
    <dialog class="modal" :class="{ 'modal-open': confirmState.visible }">
        <div class="modal-box max-w-sm">
            <h3 class="font-bold text-lg">{{ confirmState.header }}</h3>
            <p class="py-4">{{ confirmState.message }}</p>
            <div class="modal-action">
                <button class="btn btn-ghost btn-sm" @click="handleReject">Cancel</button>
                <button class="btn btn-primary btn-sm" @click="handleAccept">Confirm</button>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="handleReject">close</button>
        </form>
    </dialog>
</template>
