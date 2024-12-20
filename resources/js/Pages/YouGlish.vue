<script setup>
import OrganicLayout from "@/Layouts/OrganicLayout.vue";
// defineOptions({ layout: Layout });

import { onMounted } from "vue";

// Widget properties
const query = "我喜歡";
const lang = "chinese";
const components = "8415";
const bkgColor = "theme_light";

onMounted(() => {
    // Load the YouGlish widget script dynamically
    const script = document.createElement("script");
    script.src = "https://youglish.com/public/emb/widget.js";
    script.async = true;
    script.charset = "utf-8";
    document.body.appendChild(script);
});
</script>

<template>
    <Head title="Flip Card" />

    <OrganicLayout>
        <div class="flex justify-center items-center">
            <!-- YouGlish Widget -->
            <a
                id="yg-widget-0"
                class="youglish-widget w-96"
                :data-query="query"
                :data-lang="lang"
                :data-components="components"
                :data-bkg-color="bkgColor"
                rel="nofollow"
                href="https://youglish.com"
            >
                Visit YouGlish.com
            </a>
        </div>
    </OrganicLayout>
</template>

<style scoped></style>
