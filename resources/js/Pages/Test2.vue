<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { Head } from "@inertiajs/vue3";

// Initial answers

const example_arr = [
    { text: "我" },
    { text: "喜欢" },
    { text: "喝" },
    { text: "茶" },
];

const currect_arr = ["我", "喜欢", "喝", "茶"];

const answers = reactive(example_arr);

// Slots for answers (initially empty)
const answerSlots = reactive([null, null, null, null]);

// Track which slot or answers box is being dragged over
const isDragOverSlot = reactive([false, false, false, false]);
const isDragOverAnswersBox = ref(false);
const completeText = ref("");

let draggedAnswer = null;
let draggedFromIndex = null;
let draggedFromBox = null;

const handleDragStart = (answer, index, box) => {
    draggedAnswer = answer;
    draggedFromIndex = index;
    draggedFromBox = box;
};

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const handleDrop = (slotIndex) => {
    if (draggedAnswer) {
        if (answerSlots[slotIndex] !== null) {
            // If the target slot is already filled, swap the items
            if (draggedFromBox === "answers") {
                // Move the existing item in the slot back to the answers box
                answers.push(answerSlots[slotIndex]);
                // Place the dragged answer in the slot
                answerSlots[slotIndex] = draggedAnswer;
                // Remove the dragged answer from the answers box
                answers.splice(draggedFromIndex, 1);
            } else if (draggedFromBox === "slots") {
                // Swap the answers between the slots
                const temp = answerSlots[slotIndex];
                answerSlots[slotIndex] = draggedAnswer;
                answerSlots[draggedFromIndex] = temp;
            }
        } else {
            // Move the answer to an empty slot
            if (draggedFromBox === "answers") {
                answerSlots[slotIndex] = draggedAnswer;
                answers.splice(draggedFromIndex, 1);
            } else if (draggedFromBox === "slots") {
                answerSlots[slotIndex] = draggedAnswer;
                answerSlots[draggedFromIndex] = null;
            }
        }

        // Reset drag state
        resetDragState();
        isDragOverSlot[slotIndex] = false;
    }

    if (answerSlots.filter((item) => item).length === 4) {
        if (
            arraysAreEqual(
                answerSlots.map((item) => item.text),
                currect_arr
            )
        ) {
            completeText.value = "Currect !";
        } else {
            completeText.value = "Wrong !";
        }
    }
};

const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
};

const handleDropInAnswersBox = () => {
    if (draggedAnswer && draggedFromBox === "slots") {
        // Move the answer back to the answers box
        answers.push(draggedAnswer);
        answerSlots[draggedFromIndex] = null;
    }

    completeText.value = "";

    // Reset drag state
    resetDragState();
    isDragOverAnswersBox.value = false;
};

const handleDragOver = (slotIndex) => {
    isDragOverSlot[slotIndex] = true;
};

const handleDragOverAnswersBox = () => {
    isDragOverAnswersBox.value = true;
};

const allFilledAnswer = computed(() => {
    return answerSlots.filter((item) => item).length === 4;
});

const handleDragLeave = (slotIndex) => {
    isDragOverSlot[slotIndex] = false;
};

const handleDragLeaveAnswersBox = () => {
    isDragOverAnswersBox.value = false;
};

const handleDragEnd = () => {
    // Reset the drag over state for all slots and answers box
    isDragOverSlot.fill(false);
    isDragOverAnswersBox.value = false;
};

const resetDragState = () => {
    draggedAnswer = null;
    draggedFromIndex = null;
    draggedFromBox = null;
};

onMounted(() => {
    shuffleArray(answers);
});
</script>

<template>
    <Head title="Quiz"></Head>

    <!-- Initial Answers Box -->
    <div
        class="min-h-15 flex justify-center items-center mb-4"
        :class="{
            'bg-green-200': isDragOverAnswersBox,
            'bg-gray-200': !answers.length,
        }"
        @dragover.prevent="handleDragOverAnswersBox"
        @dragleave="handleDragLeaveAnswersBox"
        @drop="handleDropInAnswersBox"
    >
        <div
            class="answer"
            v-for="(answer, index) in answers"
            :key="index"
            draggable="true"
            @dragstart="handleDragStart(answer, index, 'answers')"
            @dragend="handleDragEnd"
        >
            {{ answer.text }}
        </div>
        <div v-if="!answers.length" class="placeholder">Drag answers here</div>
    </div>

    <!-- Answer Slots -->
    <div class="flex justify-center items-center gap-x-3">
        <div
            class="slot"
            v-for="(slot, index) in answerSlots"
            :key="index"
            :class="{
                'bg-green-200': isDragOverSlot[index],
                'bg-gray-200': !slot,
            }"
            @dragover.prevent="handleDragOver(index)"
            @dragleave="handleDragLeave(index)"
            @drop="handleDrop(index)"
        >
            <div
                v-if="slot"
                class="slot-content"
                :class="
                    allFilledAnswer
                        ? slot.text === currect_arr[index]
                            ? 'bg-green-300'
                            : 'bg-red-300'
                        : ''
                "
                draggable="true"
                @dragstart="handleDragStart(slot, index, 'slots')"
                @dragend="handleDragEnd"
            >
                {{ slot.text }}
            </div>
        </div>
    </div>

    <div
        class="flex justify-center items-center mx-auto mt-4 w-screen"
        :class="completeText === 'Currect !' ? 'bg-green-300' : 'bg-red-300'"
        v-text="completeText"
    ></div>
</template>

<style scoped>
.answer,
.slot {
    width: 100px;
    height: 50px;
    border: 2px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    margin-right: 10px;
    cursor: grab;
    transition: background-color 0.3s;
}

.slot.bg-gray-200 {
    background-color: #ddd;
}

.slot.bg-green-200,
.answers-box.bg-green-200 {
    background-color: #a5d6a7;
}

.placeholder {
    color: #aaa;
    text-align: center;
    font-style: italic;
    width: 100%;
}

.slot-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
