<script setup>
import AppLayout from "@/layout/AppLayout.vue";
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import { Head, Link, router } from "@inertiajs/vue3";

import Lottie from '@/../js/Pages/lottie/lottie.json'
import Racket from '@/../js/Pages/lottie/racket.json'
import Serve from '@/../js/Pages/lottie/serve.json'
import Hit from '@/../js/Pages/lottie/hit.json'
import Coding from '@/../js/Pages/lottie/coding.json'

const toast = useToast();

const visible = ref(false);

const items = ref([
  {
    label: "Add",
    icon: "pi pi-pencil",
    command: () => {
      toast.add({
        severity: "info",
        summary: "Add",
        detail: "Data Added",
      });
    },
  },
  {
    label: "Update",
    icon: "pi pi-refresh",
    command: () => {
      toast.add({
        severity: "success",
        summary: "Update",
        detail: "Data Updated",
      });
    },
  },
  {
    label: "Delete",
    icon: "pi pi-trash",
    command: () => {
      toast.add({
        severity: "error",
        summary: "Delete",
        detail: "Data Deleted",
      });
    },
  },
  {
    label: "Upload",
    icon: "pi pi-upload",
    command: () => {
      router.visit("/fileupload");
    },
  },
  {
    label: "Vue Website",
    icon: "pi pi-external-link",
    command: () => {
      window.location.href = "https://vuejs.org/";
    },
  },
]);

const dates = ref();
</script>

<template>
  <Head title="Welcome" />

  <AppLayout>
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">First Setup</h2>
    </template>

    <div class="grid">
        <Vue3Lottie :animationData="Lottie" :height="200" :width="200" :speed="1" />
        <Vue3Lottie :animationData="Racket" :height="200" :width="200" :speed="1" />
        <Vue3Lottie :animationData="Serve" :height="200" :width="200" :speed="1" />
        <Vue3Lottie :animationData="Hit" :height="200" :width="200" :speed="1" />
        <Vue3Lottie :animationData="Coding" :height="200" :width="200" :speed="1" />
      <div class="col-12">
        <div class="card">
          <h5>Empty Page</h5>
          <p>Use this page to start from scratch and place your custom content.</p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
