<script setup>
import { Link } from "@inertiajs/vue3";

defineProps({
    href: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <div class="flip">
        <div
            class="front"
            style="
                background-image: url(https://images.pexels.com/photos/540518/pexels-photo-540518.jpeg?w=1260&h=750&dpr=2&auto=compress&cs=tinysrgb);
            "
        >
            <h1 class="text-shadow">MOUNTAIN</h1>
        </div>
        <div class="back">
            <h2>Angular</h2>
            <p>
                Good tools make application development quicker and easier to
                maintain than if you did everything by hand..
            </p>
        </div>
    </div>

    <div class="flip flip-vertical">
        <div
            class="front"
            style="
                background-image: url(https://images.pexels.com/photos/38136/pexels-photo-38136.jpeg?w=1260&h=750&dpr=2&auto=compress&cs=tinysrgb);
            "
        >
            <h1 class="text-shadow">FOREST</h1>
        </div>
        <div class="back">
            <h2>Angular</h2>
            <p>
                Good tools make application development quicker and easier to
                maintain than if you did everything by hand..
            </p>
        </div>
    </div>
</template>
