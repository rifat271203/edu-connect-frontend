<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-dark-950 dark:text-white">
    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-dark-700 dark:bg-dark-900/95">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div>
          <p class="text-xs text-slate-500 dark:text-dark-300">Taking Exam</p>
          <h1 class="text-base font-semibold">{{ exam?.title }}</h1>
        </div>

        <div class="flex items-center gap-2">
          <BaseBadge :variant="isNearEnd ? 'danger' : 'accent'" size="sm">
            {{ formatted }}
          </BaseBadge>
          <BaseButton size="sm" @click="submitWithConfirm">Submit</BaseButton>
        </div>
      </div>
    </header>

    <div class="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[260px_1fr]">
      <aside class="rounded-xl border border-slate-200 bg-white p-3 dark:border-dark-700 dark:bg-dark-900">
        <div class="mb-3 flex items-center justify-between">
          <p class="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-dark-300">Questions</p>
          <button type="button" class="text-xs text-indigo-600 dark:text-indigo-300" @click="allQuestionsView = !allQuestionsView">
            {{ allQuestionsView ? 'Single view' : 'All view' }}
          </button>
        </div>

        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="(question, index) in exam?.questions || []"
            :key="question.id"
            type="button"
            class="grid h-9 place-items-center rounded-lg border text-xs font-medium"
            :class="navigatorClass(index, question.id)"
            @click="currentQuestionIndex = index"
          >
            {{ index + 1 }}
          </button>
        </div>
      </aside>

      <main class="space-y-4">
        <template v-if="allQuestionsView">
          <BaseCard
            v-for="(question, index) in exam?.questions || []"
            :key="`all-${question.id}`"
            class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold">Q{{ index + 1 }}. {{ question.question }}</p>
                <BaseBadge size="sm" variant="neutral">{{ question.marks }} marks</BaseBadge>
              </div>

              <div v-if="question.type === 'mcq'" class="space-y-2">
                <label
                  v-for="(option, optionIndex) in question.options || []"
                  :key="`${question.id}-option-${optionIndex}`"
                  class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-dark-700"
                >
                  <input
                    type="radio"
                    :name="`mcq-${question.id}`"
                    :checked="isMcqSelected(question.id, optionIndex)"
                    @change="setMcqAnswer(question.id, optionIndex)"
                  >
                  <span class="text-sm">{{ option }}</span>
                </label>
              </div>

              <textarea
                v-else
                :value="getTextAnswer(question.id)"
                :rows="question.type === 'long' ? 7 : 4"
                class="textarea-field min-h-[120px] w-full rounded-xl px-3 py-2 text-sm"
                placeholder="Type your answer..."
                @input="setTextAnswer($event, question.id)"
              />
            </div>
          </BaseCard>
        </template>

        <BaseCard v-else class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
          <template v-if="currentQuestion">
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold">
                  Q{{ currentQuestionIndex + 1 }}. {{ currentQuestion.question }}
                </p>
                <BaseBadge size="sm" variant="neutral">{{ currentQuestion.marks }} marks</BaseBadge>
              </div>

              <div v-if="currentQuestion.type === 'mcq'" class="space-y-2">
                <label
                  v-for="(option, optionIndex) in currentQuestion.options || []"
                  :key="`${currentQuestion.id}-single-option-${optionIndex}`"
                  class="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 dark:border-dark-700"
                >
                  <input
                    type="radio"
                    :name="`mcq-single-${currentQuestion.id}`"
                    :checked="isMcqSelected(currentQuestion.id, optionIndex)"
                    @change="setMcqAnswer(currentQuestion.id, optionIndex)"
                  >
                  <span class="text-sm">{{ option }}</span>
                </label>
              </div>

              <textarea
                v-else
                :value="getTextAnswer(currentQuestion.id)"
                :rows="currentQuestion.type === 'long' ? 7 : 4"
                class="textarea-field min-h-[120px] w-full rounded-xl px-3 py-2 text-sm"
                placeholder="Type your answer..."
                @input="setTextAnswer($event, currentQuestion.id)"
              />
            </div>

            <div class="mt-4 flex justify-between">
              <BaseButton
                variant="ghost"
                :disabled="currentQuestionIndex === 0"
                @click="currentQuestionIndex = Math.max(0, currentQuestionIndex - 1)"
              >
                Previous
              </BaseButton>
              <BaseButton
                variant="secondary"
                :disabled="currentQuestionIndex >= (exam?.questions.length || 1) - 1"
                @click="currentQuestionIndex = Math.min((exam?.questions.length || 1) - 1, currentQuestionIndex + 1)"
              >
                Next
              </BaseButton>
            </div>
          </template>
        </BaseCard>
      </main>
    </div>

    <BaseModal v-model="confirmSubmitOpen" title="Submit Exam">
      <p class="text-sm text-slate-600 dark:text-dark-300">Are you sure you want to submit? You cannot edit answers after submitting.</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" @click="confirmSubmitOpen = false">Cancel</BaseButton>
          <BaseButton @click="submitExam">Submit</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { useExamStore } from '~/stores/exam'
import { useClassroomStore } from '~/stores/classroom'
import { useCountdownTimer } from '~/composables/useCountdownTimer'
import { useUserStore } from '~/stores/user'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))
const examId = computed(() => String(route.params.examId || ''))

const examStore = useExamStore()
const classroomStore = useClassroomStore()
const userStore = useUserStore()
const toast = useToast()

const exam = computed(() => examStore.examsByCourse(courseId.value).find((item) => item.id === examId.value) || null)

const endTime = computed(() => exam.value?.endAt || new Date().toISOString())
const { timeLeft, formatted, isExpired } = useCountdownTimer(endTime)

const currentQuestionIndex = ref(0)
const allQuestionsView = ref(false)
const confirmSubmitOpen = ref(false)

const answers = reactive<Record<string, string | number>>({})

const currentQuestion = computed(() => exam.value?.questions[currentQuestionIndex.value] || null)
const isNearEnd = computed(() => timeLeft.value < 5 * 60 * 1000)

const isAnswered = (questionId: string) => {
  const value = answers[questionId]
  return value !== undefined && String(value).trim().length > 0
}

const navigatorClass = (index: number, questionId: string) => {
  if (index === currentQuestionIndex.value) return 'border-indigo-600 bg-indigo-600 text-white'
  if (isAnswered(questionId)) return 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
  return 'border-slate-200 text-slate-600 dark:border-dark-700 dark:text-dark-300'
}

const isMcqSelected = (questionId: string, optionIndex: number) => Number(answers[questionId]) === optionIndex
const setMcqAnswer = (questionId: string, optionIndex: number) => {
  answers[questionId] = optionIndex
}

const getTextAnswer = (questionId: string) => String(answers[questionId] || '')
const setTextAnswer = (event: Event, questionId: string) => {
  const target = event.target as HTMLTextAreaElement
  answers[questionId] = target.value
}

const submitWithConfirm = () => {
  confirmSubmitOpen.value = true
}

const submitExam = async (auto = false) => {
  if (!exam.value) return

  examStore.setCurrentSubmission({
    examId: exam.value.id,
    userId: String(userStore.user?.id || 'student-1'),
    answers: { ...answers },
    startedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    submittedAt: new Date().toISOString(),
    autoSubmitted: auto,
  })

  confirmSubmitOpen.value = false
  toast.success(auto ? 'Time is over. Exam auto-submitted.' : 'Exam submitted successfully')
  await navigateTo(`/classroom/${encodeURIComponent(courseId.value)}/exams/${encodeURIComponent(examId.value)}/result`)
}

watch(
  () => isExpired.value,
  (expired) => {
    if (!expired) return
    void submitExam(true)
  },
)

const onVisibilityChange = () => {
  if (document.visibilityState !== 'hidden') return
  toast.info('Warning', 'Switching tabs may be monitored during exam.')
}

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Take Exam`,
}))
</script>

