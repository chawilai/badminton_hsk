<script setup>
import { onMounted, ref, computed, watch } from "vue";
import SignaturePad from "signature_pad";

import { useSignaturePadStore } from "@/Stores/signaturepad";
const signaturePadStore = useSignaturePadStore();

const props = defineProps({
    isActive: Boolean,
    width: { type: Number, default: 200 },
    height: { type: Number, default: 200 },
    backgroundColor: { type: String, default: "rgba(255, 255, 255, 0)" },
    penColor: { type: String, default: "#777" },
    minWidth: { type: Number, default: 1 },
    maxWidth: { type: Number, default: 6 },
    velocityFilterWeight: { type: Number, default: 0.7 },
    dotSize: { type: [Number, Boolean], default: false },
    throttle: { type: [Number], default: 16 },
    minDistance: { type: [Number], default: 5 },
    saveButtonText: { type: String, default: "Save" },
    clearButtonText: { type: String, default: "Clear" },
    canvasId: { type: String, default: "signature-pad" },
    canvasClass: { type: String, default: "bg-red-100" },
    wrapperClass: { type: String, default: "" },
    haveBtn: { type: Boolean, default: false },
    haveSave: { type: Boolean, default: false },
    haveClear: { type: Boolean, default: false },
});

const canvaData = ref([]);
const canvasRef = ref(null);
const signaturePad = ref(null);

const undo = () => {

    canvaData.value = signaturePad.value.toData();

    if (canvaData.value) {
        canvaData.value.pop(); // remove the last dot or line
        signaturePad.value.fromData(canvaData.value);
    }
};

const save = () => {
    canvaData.value = signaturePad.value.toDataURL("image/png");
    console.log(canvaData.value);
    // Send data to server instead...
    // window.open(data);
};

const clear = () => {
    signaturePad.value.clear();
};

onMounted(() => {
    signaturePad.value = new SignaturePad(
        document.getElementById(props.canvasId),
        {
            backgroundColor: props.backgroundColor,
            penColor: props.penColor,
            minWidth: props.minWidth,
            maxWidth: props.maxWidth,
            velocityFilterWeight: props.velocityFilterWeight,
            dotSize: props.dotSize,
            throttle: props.throttle,
            minDistance: props.minDistance,
        }
    );

    // default off
    signaturePad.value.off()

    signaturePad.value.addEventListener("beginStroke", () => {
        // console.log("Stroke started.");
    });

    signaturePad.value.addEventListener("endStroke", () => {
        // console.log("Stroke ended.");
        // console.log(props.canvasId)
        signaturePadStore.lastPadStroke.push(props.canvasId)
        // console.log(signaturePadStore.lastPadStroke)
        // console.log(signaturePadStore.lastPadStroke[signaturePadStore.lastPadStroke.length - 1])
    });

    signaturePad.value.addEventListener("beforeUpdateStroke", () => {
        // console.log("Before updating stroke.");
    });

    signaturePad.value.addEventListener("afterUpdateStroke", () => {
        // console.log("After updating stroke.");
    });

    signaturePadStore.registerUndo(props.canvasId, undo);
    signaturePadStore.registerClear(props.canvasId, clear);

    watch(signaturePadStore.activeRow, () => {

        console.log('change')

        let parts = props.canvasId.split('_');
        let row = parseInt(parts[1]);

        if(signaturePadStore.activeRow.includes(row)) {
            console.log(`${row}_on`)
            signaturePad.value.on()
        } else {
            signaturePad.value.clear();
            console.log(`${row}_off`)
            signaturePad.value.off()
        }

    }, { deep: true })
});
</script>

<template>
    <div
        class="w-15 h-15 border-t border-b border-r border-red first:border-l last:border-r"
        :class="wrapperClass"
    >
        <div class="wrapper">
            <canvas
                :id="canvasId"
                class="absolute left-0 top-0"
                :class="canvasClass"
                :width="width"
                :height="height"
                :style="{ width: width + 'px', height: height + 'px' }"
            ></canvas>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    position: relative;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>
