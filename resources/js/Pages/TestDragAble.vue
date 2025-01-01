<script setup>
import { ref } from "vue";
import { Container, Draggable } from "vue-dndrop";
import { applyDrag, generateItems } from "../utils/helpers";

let itemId = 0;

const lastTap = ref(0);
const clickTimeout = ref(null);

function generateId() {
  return `item-${++itemId}`;
}

function generate(num) {
  return generateItems(5, (i) => ({
    id: generateId(),
    data: `Draggable ${num} - ${i + 1}`,
  }));
}

const groups = ref([]);
const flags = ref([]);
const logs = ref({
  "get-child-payload": true,
  "should-accept-drop": true,
  "should-animate-drop": true,
  "drag-start": true,
  "drag-end": true,
  "drag-enter": true,
  "drag-leave": true,
  "drop-not-allowed": true,
  drop: true,
});
const logPayload = ref(false);

function getChildPayload(groupIndex, itemIndex) {
  log("get-child-payload", groupIndex, itemIndex);
  return groups.value[groupIndex][itemIndex];
}

function getShouldAcceptDrop(index, sourceContainerOptions, payload) {
  log("should-accept-drop", sourceContainerOptions, payload);
  return flags.value[index].drop;
}

function getShouldAnimateDrop(index, sourceContainerOptions, payload) {
  log("should-animate-drop", sourceContainerOptions, payload);
  return flags.value[index].animate;
}

function onDragStart(...args) {
  log("drag-start", ...args);
}

function onDragEnd(...args) {
  log("drag-end", ...args);
}

function onDragEnter(...args) {
  log("drag-enter", ...args);
}

function onDragLeave(...args) {
  log("drag-leave", ...args);
}

function onDrop(groupIndex, dropResult) {
  groups.value[groupIndex] = applyDrag(groups.value[groupIndex], dropResult);
  log("drop", dropResult);
}

function dropNotAllowed(...args) {
  log("drop-not-allowed", ...args);
}

function addColumn() {
  groups.value.push(generate(groups.value.length + 1));
  flags.value.push({ drop: true, animate: true });

  //   console.log(groups.value)
}

function removeColumn() {
  if (groups.value.length > 1) {
    groups.value.pop();
    flags.value.pop();
  }
}

function log(name, ...args) {
  if (logs.value[name]) {
    logPayload.value ? console.log(name, ...args) : console.log(name);
  }
}

const handleInteraction = (event, item, index) => {
  const currentTime = new Date().getTime();
  const tapInterval = currentTime - lastTap.value;

  console.log(event);

  if (tapInterval < 300 && tapInterval > 0) {
    // Double tap or double click detected
    if (event.type === "touchstart") {
      console.log("Double Tap Detected");
    } else if (event.type === "click") {
      console.log("Double Click Detected");

      if (index === 0) {
        console.log(groups.value[1]);
        groups.value[1].push(item);

        let findIndex = groups.value[0].findIndex((itemtemp) => itemtemp.id === item.id);

        // Remove the item if it exists
        if (findIndex !== -1) {
          groups.value[0].splice(findIndex, 1);
        }
      } else {
        console.log(groups.value[0]);
        groups.value[0].push(item);

        let findIndex = groups.value[1].findIndex((itemtemp) => itemtemp.id === item.id);

        // Remove the item if it exists
        if (findIndex !== -1) {
          groups.value[1].splice(findIndex, 1);
        }
      }
    }
    lastTap.value = 0; // Reset
  } else {
    lastTap.value = currentTime;
    // Single tap or click detection
    if (event.type === "touchstart") {
      console.log("Single Tap Detected");
    } else if (event.type === "click") {
      console.log("Single Click Detected");
    }

    // Clear previous timeout for click
    clearTimeout(clickTimeout.value);
    clickTimeout.value = setTimeout(() => {
      lastTap.value = 0; // Reset after timeout
    }, 300); // Timeout to differentiate single and double interaction
  }
};

// Initialize with one column
addColumn();
addColumn();
</script>

<template>
  <div class="demo">
    <div class="columns">
      <div v-for="(items, index) in groups" :key="index" class="column">
        <div class="column-actions">
          <label>
            <input type="checkbox" v-model="flags[index].drop" /> Accept drop
          </label>
          <label>
            <input type="checkbox" v-model="flags[index].animate" /> Animate drop
          </label>
        </div>
        <Container
          :data-index="index"
          group-name="column"
          :get-child-payload="(itemIndex) => getChildPayload(index, itemIndex)"
          :should-accept-drop="(src, payload) => getShouldAcceptDrop(index, src, payload)"
          :should-animate-drop="
            (src, payload) => getShouldAnimateDrop(index, src, payload)
          "
          @drag-start="onDragStart"
          @drag-enter="onDragEnter"
          @drag-leave="onDragLeave"
          @drag-end="onDragEnd"
          @drop-not-allowed="dropNotAllowed"
          @drop="(event) => onDrop(index, event)"
        >
          <Draggable v-for="item in items" :key="item.id">
            <div class="draggable-item relative">
              {{ item.data }}
              <div
                class="absolute top-0 right-0 px-1 bg-green-200 border-round-xl"
                @touchstart="handleInteraction($event, item, index)"
                @click="handleInteraction($event, item, index)"
              >
                +
              </div>
            </div>
          </Draggable>
        </Container>
      </div>
    </div>

    <div class="controls">
      <h4 class="title">Fired events</h4>
      <hr />
      <small class="title">Choose which events will be used in the columns</small>
      <div class="actions">
        <label v-for="(key, name) in logs" :key="name">
          <input type="checkbox" v-model="logs[name]" /> {{ name }}
        </label>
        <hr />
        <label> <input type="checkbox" v-model="logPayload" /> Log payload </label>
      </div>
      <hr />
      <div class="buttons">
        <button
          class="button-column remove"
          @click="removeColumn"
          :disabled="groups.length === 1"
        >
          Remove Column
        </button>
        <button class="button-column add" @click="addColumn">Add Column</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  flex-direction: column;
  margin-top: 1em;
}
.controls .title {
  align-self: flex-start;
  margin: 0 1rem;
}
.controls .buttons {
  align-self: flex-end;
  margin: 1rem;
}

.controls .actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 0 1rem;
}

.hdrag-enter {
  background: red;
}

.controls > div {
  padding-top: 1em;
}

.buttons,
.column-actions {
  display: flex;
  gap: 1rem;
}

.column-actions {
  justify-content: space-evenly;
}

.buttons .button-column {
  background-color: white;
  border: 1px solid #e0e0e0;
  border-left: 5px solid #c4ebaf;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  transition: border-color 0.2s linear;
  font-family: inherit;
}

.buttons .button-column.remove {
  border-left: 5px solid #dc3545;
}

.buttons .button-column.remove:disabled {
  border-left: 5px solid #e0e0e0;
}

.buttons .button-column.add {
  border-left: 5px solid #c4ebaf;
}

label {
  display: block;
  line-height: 1.6em;
}

.columns {
  display: flex;
  gap: 0.5rem;
  justify-content: stretch;
}

.column {
  flex: 1;
  border-radius: 6px;
}

.column {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.column .dndrop-container.vertical {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  cursor: pointer;
}

.draggable-item {
  padding: 10px;
  margin-bottom: 5px;
  background-color: #e3f2fd;
  border: 1px solid #90caf9;
  border-radius: 4px;
  cursor: grab;
  transition: transform 0.2s;
}

.draggable-item:hover {
  transform: scale(1.02);
}

.drag-over {
  background-color: #ffe0b2; /* Highlight color */
  transition: background-color 0.3s ease;
}
</style>
