<script setup>
import { onMounted } from "vue";
import HanziWriter from "hanzi-writer";

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    hanzi: {
        type: String,
        required: true,
    },
    hanziSize: {
        type: [Number, String],
        required: false,
        default: 75
    },
    frameSize: {
        type: [Number, String],
        required: false,
        default: 80
    },
    frameColor: {
        type: String,
        required: false,
        default: '#AAA'
    },
    hanziColor: {
        type: String,
        required: false,
        default: '#777'
    },
    frameBorder: {
        type: [Number, String],
        required: false,
        default: 2
    },
});


const renderFanningStrokes = (target, strokes, frameSize = 80, hanziSize = 75, frameColor = '#AAA', hanziColor = '#777', frameBorder = 2) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.width = `${frameSize}px`;
    svg.style.height = `${frameSize}px`;
    svg.style.border = `${frameBorder}px solid ${frameColor}`;
    svg.style.borderRadius = "5px";
    // svg.style.marginRight = "3px";
    target.appendChild(svg);
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // set the transform property on the g element so the character renders at hanziSize x hanziSize
    const transformData = HanziWriter.getScalingTransform(hanziSize, hanziSize);
    group.setAttributeNS(null, "transform", transformData.transform);
    svg.appendChild(group);

    strokes.forEach(function (strokePath) {
        const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );
        path.setAttributeNS(null, "d", strokePath);
        // style the character paths
        path.style.fill = hanziColor;
        group.appendChild(path);
    });
}

const HanziStrokeList = (hanzi = "你", id = 'hanzi_stroke_id') => {
    HanziWriter.loadCharacterData(hanzi).then(function (charData) {
        const target = document.getElementById(id);
        for (let i = 0; i < charData.strokes.length; i++) {
            const strokesPortion = charData.strokes.slice(0, i + 1);
            renderFanningStrokes(target, strokesPortion, props.frameSize, props.hanziSize, props.frameColor, props.hanziColor, props.frameBorder)
        }
    });
}

onMounted(() => {
    HanziStrokeList(props.hanzi, props.id, )
});
</script>

<template>
    <div :id="id"></div>
</template>

<style scoped></style>
