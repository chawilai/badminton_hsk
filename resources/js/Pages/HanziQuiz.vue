<script setup>
import Layout from "@/Layouts/OrganicLayout.vue";
import { Head } from "@inertiajs/vue3";
import { ref, onMounted } from "vue";
import HanziWriter from "hanzi-writer";
import HanziBox from "@/Components/HanziBox.vue"

defineOptions({ layout: Layout });

const svgElement = ref(null);

const addCircleToStartOfStrokes = () => {
    const svg = svgElement.value;
    const paths = svg.querySelectorAll("g");

    paths.forEach((path) => {
        // const startPoint = path.getPointAtLength(0);

        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        circle.setAttribute("cx", 25);
        circle.setAttribute("cy", 421);
        circle.setAttribute("r", 70); // Set radius of the circle
        circle.setAttribute("fill", "red"); // Set fill color of the circle

        paths[0].appendChild(circle);

        const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        text.textContent = 1;
        text.setAttribute("x", 25);
        text.setAttribute("y", 421);
        text.setAttribute("font-size", 130);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "white");
        text.setAttribute("dy", ".3em");
        text.setAttribute("transform", "scale(1,-1) translate(0,-842)");

        paths[0].appendChild(text);
    });
};

onMounted(() => {
    addCircleToStartOfStrokes();

    var writer = HanziWriter.create("character-target-div", "测", {
        width: 150,
        height: 150,
        showCharacter: false,
        showOutline: false,
        showHintAfterMisses: 1,
        highlightOnComplete: false,
        padding: 5,
    });
    writer.quiz();
});
</script>

<template>
    <Head title="คัดจีน (Hànzì)" />

    <div class="container text-center mx-auto flex justify-center items-center">
        <svg
            ref="svgElement"
            width="50"
            height="50"
            viewBox="0 0 50 55"
            v-show="false"
        >
            <defs>
                <clipPath id="mask-82">
                    <path
                        d="M 518 382 Q 572 385 623 389 Q 758 399 900 383 Q 928 379 935 390 Q 944 405 930 419 Q 896 452 845 475 Q 829 482 798 473 Q 723 460 480 434 Q 180 409 137 408 Q 130 408 124 408 Q 108 408 106 395 Q 105 380 127 363 Q 146 348 183 334 Q 195 330 216 338 Q 232 344 306 354 Q 400 373 518 382 Z"
                    ></path>
                </clipPath>
                <clipPath id="mask-83">
                    <path
                        d="M 518 382 Q 572 385 623 389 Q 758 399 900 383 Q 928 379 935 390 Q 944 405 930 419 Q 896 452 845 475 Q 829 482 798 473 Q 723 460 480 434 Q 180 409 137 408 Q 130 408 124 408 Q 108 408 106 395 Q 105 380 127 363 Q 146 348 183 334 Q 195 330 216 338 Q 232 344 306 354 Q 400 373 518 382 Z"
                    ></path>
                </clipPath>
                <clipPath id="mask-84">
                    <path
                        d="M 518 382 Q 572 385 623 389 Q 758 399 900 383 Q 928 379 935 390 Q 944 405 930 419 Q 896 452 845 475 Q 829 482 798 473 Q 723 460 480 434 Q 180 409 137 408 Q 130 408 124 408 Q 108 408 106 395 Q 105 380 127 363 Q 146 348 183 334 Q 195 330 216 338 Q 232 344 306 354 Q 400 373 518 382 Z"
                    ></path>
                </clipPath>
            </defs>
            <g
                transform="translate(3, 41.671875) scale(0.04296875, -0.04296875)"
            >
                <!-- <circle cx="25" cy="421" r="150" fill="red" />
                <text
                    x="25"
                    y="421"
                    font-size="150"
                    text-anchor="middle"
                    fill="white"
                    dy=".3em"
                    transform="scale(1,-1) translate(0,-842)"
                >
                    1
                </text> -->
                <g style="opacity: 1">
                    <path
                        clip-path='url("#mask-82")'
                        d="M 25 421 L 193 372 L 417 402 L 827 434 L 920 401"
                        stroke="rgba(221,221,221,1)"
                        stroke-width="200"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="miter"
                        stroke-dasharray="910.9281897070704,910.9281897070704"
                        style="opacity: 1; stroke-dashoffset: 0"
                    ></path>
                </g>
                <g style="opacity: 1">
                    <path
                        clip-path='url("#mask-83")'
                        d="M 25 421 L 193 372 L 417 402 L 827 434 L 920 401"
                        stroke="rgba(85,85,85,1)"
                        stroke-width="200"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="miter"
                        stroke-dasharray="910.9281897070704,910.9281897070704"
                        style="opacity: 1; stroke-dashoffset: 0"
                    ></path>
                </g>
                <g style="opacity: 1">
                    <path
                        clip-path='url("#mask-84")'
                        d="M 25 421 L 193 372 L 417 402 L 827 434 L 920 401"
                        stroke="rgba(170,170,255,1)"
                        stroke-width="200"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="miter"
                        stroke-dasharray="910.9281897070704,910.9281897070704"
                        style="opacity: 0; stroke-dashoffset: 0"
                    ></path>
                </g>
            </g>
        </svg>

        <!-- <div id="character-target-div"></div> -->
    </div>
    <div
        class="container text-center mx-auto flex justify-center items-center mt-20"
    >
        <HanziBox><div id="character-target-div" class="z-10"></div></HanziBox>
    </div>
</template>

<style scoped>

</style>
