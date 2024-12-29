<template>
    <div class="drag-drop-container">
      <h1 class="header">Drag & Drop Example</h1>

      <!-- Area 1 -->
      <div class="drop-area" data-area="areaOne">
        <h3>Area 1 ({{ areaOne.length }})</h3>
        <div
          v-for="(item, index) in areaOne"
          :key="item.id"
          class="draggable-item"
          v-draggable="{ axis: 'both' }"
          @start="onDragStart"
          @stop="onDragStop"
          @transformed="onTransformed(item, 'areaOne', index, $event)"
        >
          {{ item.label }}
        </div>
      </div>

      <!-- Area 2 -->
      <div class="drop-area" data-area="areaTwo">
        <h3>Area 2 ({{ areaTwo.length }})</h3>
        <div
          v-for="(item, index) in areaTwo"
          :key="item.id"
          class="draggable-item"
          v-draggable="{ axis: 'both' }"
          @start="onDragStart"
          @stop="onDragStop"
          @transformed="onTransformed(item, 'areaTwo', index, $event)"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from "vue";

  const areaOne = ref([
    { id: 1, label: "Item 1" },
    { id: 2, label: "Item 2" },
  ]);

  const areaTwo = ref([
    { id: 3, label: "Item 3" },
    { id: 4, label: "Item 4" },
  ]);

  // Stores the last known position of the draggable item
  let lastValidArea = null;

  function onDragStart(event) {
    const dragItem = event.target;
    lastValidArea = dragItem.closest(".drop-area");
  }

  function onDragStop(event) {
    const dragItem = event.target;
    const dropArea = dragItem.closest(".drop-area");

    // Revert item to last valid position if dropped outside
    if (!dropArea) {
      if (lastValidArea) {
        lastValidArea.appendChild(dragItem);
      }
    }
  }

  function onTransformed(item, areaName, index, event) {
    const dropAreas = document.querySelectorAll(".drop-area");
    const dropArea = Array.from(dropAreas).find((area) =>
      area.contains(event.target)
    );

    if (!dropArea) {
      console.log("Dropped outside a valid drop area, reverting.");
      return;
    }

    const targetAreaName = dropArea.getAttribute("data-area");

    if (areaName !== targetAreaName) {
      // Move the item to the target area
      if (targetAreaName === "areaTwo") {
        areaOne.value.splice(index, 1);
        areaTwo.value.push(item);
      } else if (targetAreaName === "areaOne") {
        areaTwo.value.splice(index, 1);
        areaOne.value.push(item);
      }
    }
  }
  </script>

  <style>
  .drag-drop-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    justify-content: space-around;
  }

  .header {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 20px;
  }

  .drop-area {
    width: 40%;
    min-height: 200px;
    border: 2px dashed #ccc;
    padding: 10px;
    border-radius: 10px;
    background: #f9f9f9;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .draggable-item {
    padding: 10px;
    background: lightblue;
    border: 1px solid #007bff;
    border-radius: 5px;
    cursor: grab;
    text-align: center;
    user-select: none;
  }
  </style>
