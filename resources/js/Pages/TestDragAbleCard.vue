<script setup>
import { ref } from "vue";
import { Container, Draggable } from "vue-dndrop";
import { applyDrag, scene as initialScene } from "../utils/helpers";

// Reactive state for the scene
const scene = ref(initialScene);

// Options for drop placeholders
const upperDropPlaceholderOptions = {
  className: "cards-drop-preview",
  animationDuration: "150",
  showOnTop: true,
};

const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true,
};

// Handle column drop
function onColumnDrop(dropResult) {
  const updatedScene = { ...scene.value };
  updatedScene.children = applyDrag(updatedScene.children, dropResult);
  scene.value = updatedScene;
}

// Handle card drop
function onCardDrop(columnId, dropResult) {
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    const updatedScene = { ...scene.value };
    const column = updatedScene.children.find((p) => p.id === columnId);
    const columnIndex = updatedScene.children.indexOf(column);

    const newColumn = { ...column };
    newColumn.children = applyDrag(newColumn.children, dropResult);
    updatedScene.children.splice(columnIndex, 1, newColumn);

    scene.value = updatedScene;
  }
}

// Get card payload for a column
function getCardPayload(columnId) {
  return (index) => {
    return scene.value.children.find((p) => p.id === columnId).children[index];
  };
}

// Logging methods
function dragStart() {
  console.log("drag started");
}

function log(...params) {
  console.log(...params);
}
</script>

<template>
  <div>
    <Container
      orientation="horizontal"
      @drop="onColumnDrop"
      drag-handle-selector=".column-drag-handle"
      @drag-start="dragStart"
      :drop-placeholder="upperDropPlaceholderOptions"
    >
      <Draggable v-for="column in scene.children" :key="column.id">
        <div :class="column.props.className">
          <div class="card-column-header">
            <span class="column-drag-handle">&#x2630;</span>
            {{ column.name }}
          </div>
          <Container
            group-name="col"
            @drop="(e) => onCardDrop(column.id, e)"
            @drag-start="(e) => log('drag start', e)"
            @drag-end="(e) => log('drag end', e)"
            :get-child-payload="getCardPayload(column.id)"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
          >
            <Draggable v-for="card in column.children" :key="card.id">
              <div :class="card.props.className" :style="card.props.style">
                <h3>Task # {{ card.number }}</h3>
                <p class="card-text">{{ card.data }}</p>
              </div>
            </Draggable>
          </Container>
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<style scoped>
.cards-drop-preview {
  background-color: rgba(0, 123, 255, 0.1);
  border: 2px dashed #007bff;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
}

.drop-preview {
  background-color: rgba(40, 167, 69, 0.1);
  border: 2px dashed #28a745;
  margin: 5px 0;
  padding: 10px;
  border-radius: 4px;
}

.card-column-header {
  background-color: #f8f9fa;
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px solid #dee2e6;
}

.card-ghost {
  background-color: rgba(0, 0, 0, 0.1);
  border: 2px dashed #6c757d;
}

.card-ghost-drop {
  background-color: rgba(255, 193, 7, 0.1);
  border: 2px dashed #ffc107;
}

.card-text {
  color: #6c757d;
}
</style>
