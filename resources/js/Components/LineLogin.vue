<template>
  <button @click="loginWithLine">Login with LINE</button>
</template>

<script setup>
import { router } from '@inertiajs/vue3'

function loginWithLine() {
  router.visit('/auth/line')
}
</script>
