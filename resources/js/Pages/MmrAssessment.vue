<script setup>
import { Head, router } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import { useLocale } from '@/composables/useLocale';
import LocaleSwitcher from '@/Components/LocaleSwitcher.vue';

const { t } = useLocale();

// Quiz state
const currentStep = ref(0); // 0 = welcome, 1-7 = questions
const answers = ref([null, null, null, null, null, null, null]); // 7 questions
const isSubmitting = ref(false);
const direction = ref('forward'); // for transition direction

// Score values for each option (a=0, b=2, c=5, d=7, e=10)
const scoreMap = [0, 2, 5, 7, 10];

// Questions config
const questions = computed(() => [
  {
    key: 'q1',
    question: t('mmr.q1'),
    options: [
      { label: t('mmr.q1a'), score: 0 },
      { label: t('mmr.q1b'), score: 2 },
      { label: t('mmr.q1c'), score: 5 },
      { label: t('mmr.q1d'), score: 7 },
      { label: t('mmr.q1e'), score: 10 },
    ],
  },
  {
    key: 'q2',
    question: t('mmr.q2'),
    options: [
      { label: t('mmr.q2a'), score: 0 },
      { label: t('mmr.q2b'), score: 2 },
      { label: t('mmr.q2c'), score: 5 },
      { label: t('mmr.q2d'), score: 7 },
      { label: t('mmr.q2e'), score: 10 },
    ],
  },
  {
    key: 'q3',
    question: t('mmr.q3'),
    options: [
      { label: t('mmr.q3a'), score: 0 },
      { label: t('mmr.q3b'), score: 2 },
      { label: t('mmr.q3c'), score: 5 },
      { label: t('mmr.q3d'), score: 7 },
      { label: t('mmr.q3e'), score: 10 },
    ],
  },
  {
    key: 'q4',
    question: t('mmr.q4'),
    options: [
      { label: t('mmr.q4a'), score: 0 },
      { label: t('mmr.q4b'), score: 2 },
      { label: t('mmr.q4c'), score: 5 },
      { label: t('mmr.q4d'), score: 7 },
      { label: t('mmr.q4e'), score: 10 },
    ],
  },
  {
    key: 'q5',
    question: t('mmr.q5'),
    options: [
      { label: t('mmr.q5a'), score: 0 },
      { label: t('mmr.q5b'), score: 2 },
      { label: t('mmr.q5c'), score: 5 },
      { label: t('mmr.q5d'), score: 7 },
      { label: t('mmr.q5e'), score: 10 },
    ],
  },
  {
    key: 'q6',
    question: t('mmr.q6'),
    options: [
      { label: t('mmr.q6a'), score: 0 },
      { label: t('mmr.q6b'), score: 2 },
      { label: t('mmr.q6c'), score: 5 },
      { label: t('mmr.q6d'), score: 7 },
      { label: t('mmr.q6e'), score: 10 },
    ],
  },
  {
    key: 'q7',
    question: t('mmr.q7'),
    options: [
      { label: t('mmr.q7a'), score: 0 },
      { label: t('mmr.q7b'), score: 2 },
      { label: t('mmr.q7c'), score: 5 },
      { label: t('mmr.q7d'), score: 7 },
      { label: t('mmr.q7e'), score: 10 },
    ],
  },
]);

const totalQuestions = 7;

const currentQuestion = computed(() => {
  if (currentStep.value >= 1 && currentStep.value <= totalQuestions) {
    return questions.value[currentStep.value - 1];
  }
  return null;
});

const currentAnswer = computed(() => {
  if (currentStep.value >= 1 && currentStep.value <= totalQuestions) {
    return answers.value[currentStep.value - 1];
  }
  return null;
});

const canProceed = computed(() => {
  if (currentStep.value === 0) return true;
  return answers.value[currentStep.value - 1] !== null;
});

const isLastQuestion = computed(() => currentStep.value === totalQuestions);

const progressPercent = computed(() => {
  if (currentStep.value === 0) return 0;
  return (currentStep.value / totalQuestions) * 100;
});

function selectAnswer(questionIndex, score) {
  answers.value[questionIndex] = score;
}

function goNext() {
  if (!canProceed.value) return;
  direction.value = 'forward';
  if (currentStep.value < totalQuestions) {
    currentStep.value++;
  }
}

function goPrev() {
  direction.value = 'backward';
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

function startQuiz() {
  direction.value = 'forward';
  currentStep.value = 1;
}

function submitAssessment() {
  if (isSubmitting.value) return;
  // Verify all questions answered
  if (answers.value.some((a) => a === null)) return;

  isSubmitting.value = true;
  router.post('/mmr-assessment', {
    answers: answers.value,
  }, {
    onFinish: () => {
      isSubmitting.value = false;
    },
  });
}
</script>

<template>
  <Head :title="t('mmr.title')" />

  <div class="min-h-screen bg-gradient-to-br from-primary/10 via-base-100 to-primary/5 flex flex-col">
    <!-- Language switcher moved into progress bar -->

    <!-- Background decoration -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl"></div>
    </div>

    <!-- Progress bar (shown during questions) -->
    <div v-if="currentStep >= 1" class="sticky top-0 z-20 bg-base-100/80 backdrop-blur-md border-b border-base-300/50">
      <div class="max-w-lg mx-auto px-4 py-3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-base-content/60">
            {{ t('mmr.question') }} {{ currentStep }} {{ t('mmr.of') }} {{ totalQuestions }}
          </span>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-primary">{{ Math.round(progressPercent) }}%</span>
            <LocaleSwitcher />
          </div>
        </div>
        <div class="w-full h-2 bg-base-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 ease-out"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
      <div class="w-full max-w-lg">

        <!-- Step 0: Welcome -->
        <transition name="quiz-fade" mode="out-in">
          <div v-if="currentStep === 0" key="welcome" class="text-center animate-fade-in">
            <div class="flex justify-end mb-4"><LocaleSwitcher /></div>
            <div class="mb-6">
              <div class="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-3xl mb-4 animate-up-down">
                <span class="text-5xl">🏸</span>
              </div>
              <h1 class="text-2xl font-bold text-base-content m-0">{{ t('mmr.welcome') }}</h1>
              <p class="text-sm text-base-content/60 mt-2 m-0 max-w-sm mx-auto leading-relaxed">
                {{ t('mmr.welcomeDesc') }}
              </p>
            </div>

            <!-- Info cards -->
            <div class="grid grid-cols-3 gap-3 mb-8">
              <div class="bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-300/50 p-3 text-center">
                <span class="text-2xl block mb-1">7</span>
                <span class="text-[10px] text-base-content/50 font-medium">{{ t('mmr.question') }}</span>
              </div>
              <div class="bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-300/50 p-3 text-center">
                <span class="text-2xl block mb-1">2</span>
                <span class="text-[10px] text-base-content/50 font-medium">min</span>
              </div>
              <div class="bg-base-100/70 backdrop-blur-sm rounded-xl border border-base-300/50 p-3 text-center">
                <span class="text-2xl block mb-1">🎯</span>
                <span class="text-[10px] text-base-content/50 font-medium">MMR</span>
              </div>
            </div>

            <button
              @click="startQuiz"
              class="w-full py-3.5 px-6 bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-lg hover:shadow-xl text-base"
            >
              {{ t('mmr.start') }}
            </button>
          </div>

          <!-- Steps 1-7: Questions -->
          <div v-else key="questions" class="animate-slide-up">
            <transition :name="direction === 'forward' ? 'slide-left' : 'slide-right'" mode="out-in">
              <div :key="currentStep" class="space-y-6">
                <!-- Question icon -->
                <div class="text-center mb-2">
                  <div class="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-3">
                    <span class="text-xl font-black text-primary">{{ currentStep }}</span>
                  </div>
                  <h2 class="text-lg font-bold text-base-content m-0 leading-relaxed">
                    {{ currentQuestion?.question }}
                  </h2>
                </div>

                <!-- Options -->
                <div class="space-y-3">
                  <button
                    v-for="(option, idx) in currentQuestion?.options"
                    :key="idx"
                    @click="selectAnswer(currentStep - 1, option.score)"
                    class="w-full text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                    :class="
                      answers[currentStep - 1] === option.score
                        ? 'border-primary bg-primary/10 shadow-md'
                        : 'border-base-300 bg-base-100/70 backdrop-blur-sm hover:border-primary/30 hover:bg-base-100'
                    "
                  >
                    <div class="flex items-center gap-4">
                      <!-- Radio indicator -->
                      <div
                        class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                        :class="
                          answers[currentStep - 1] === option.score
                            ? 'border-primary bg-primary'
                            : 'border-base-300'
                        "
                      >
                        <div
                          v-if="answers[currentStep - 1] === option.score"
                          class="w-2.5 h-2.5 rounded-full bg-primary-content"
                        ></div>
                      </div>
                      <!-- Label -->
                      <span
                        class="text-base font-medium transition-colors"
                        :class="
                          answers[currentStep - 1] === option.score
                            ? 'text-primary font-semibold'
                            : 'text-base-content/80'
                        "
                      >
                        {{ option.label }}
                      </span>
                    </div>
                  </button>
                </div>

                <!-- Navigation buttons -->
                <div class="flex gap-3 pt-2">
                  <button
                    @click="goPrev"
                    class="flex-1 py-3 px-4 bg-base-200 hover:bg-base-300 text-base-content/70 font-semibold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] text-sm"
                  >
                    {{ t('mmr.prev') }}
                  </button>

                  <!-- Next or Submit -->
                  <button
                    v-if="!isLastQuestion"
                    @click="goNext"
                    :disabled="!canProceed"
                    class="flex-[2] py-3 px-4 bg-primary hover:bg-primary/90 text-primary-content font-bold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-md hover:shadow-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-md"
                  >
                    {{ t('mmr.next') }}
                  </button>

                  <button
                    v-else
                    @click="submitAssessment"
                    :disabled="!canProceed || isSubmitting"
                    class="flex-[2] py-3 px-4 bg-success hover:bg-success/90 text-success-content font-bold rounded-xl border-0 transition-all duration-200 cursor-pointer active:scale-[0.98] shadow-md hover:shadow-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span v-if="isSubmitting" class="inline-flex items-center gap-2">
                      <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      {{ t('mmr.submit') }}...
                    </span>
                    <span v-else>{{ t('mmr.submit') }}</span>
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Quiz fade transition */
.quiz-fade-enter-active,
.quiz-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.quiz-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.quiz-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Slide left (forward) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Slide right (backward) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
