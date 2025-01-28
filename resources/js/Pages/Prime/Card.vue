<template>
    <Card class="shadow-2 p-3 border-round-lg">
      <template #header>
        <div class="flex justify-content-between align-items-center">
          <h3 class="text-lg font-bold m-0">Card Title</h3>
          <Button icon="pi pi-ellipsis-h" class="p-button-rounded p-button-text"></Button>
        </div>
      </template>

      <p class="text-secondary mt-3 mb-3">
        This is a simple card example with a header, content, and footer. Customize it as needed to fit your design.
      </p>

      <template #footer>
        <div class="flex justify-content-end gap-2">
          <Button label="Cancel" class="p-button-outlined p-button-danger" />
          <Button label="Save" class="p-button-raised p-button-success" />
        </div>
      </template>
    </Card>
  </template>

  <script setup>
  </script>

  <style scoped>
  .text-secondary {
    color: #6c757d;
  }
  .border-round-lg {
    border-radius: 1rem;
  }
  </style>
