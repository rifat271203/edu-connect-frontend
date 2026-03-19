<template>
  <div class="space-y-4">
    <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-dark-300">Exam Result</p>
          <h2 class="mt-1 text-xl font-semibold">{{ exam?.title }}</h2>
        </div>
        <BaseBadge size="sm" :variant="gradeVariant">Grade {{ grade }}</BaseBadge>
      </div>

      <div class="mt-4 flex items-center gap-4">
        <div class="relative grid h-24 w-24 place-items-center rounded-full border-8 border-indigo-100 text-lg font-semibold text-indigo-700 dark:border-indigo-900/40 dark:text-indigo-300">
          {{ score }}/{{ exam?.totalMarks || 0 }}
        </div>
        <div class="text-sm text-slate-600 dark:text-dark-300">
          <p>Percentage: {{ percentage.toFixed(1) }}%</p>
          <p v-if="isUngraded">Some answers are awaiting teacher review.</p>
        </div>
      </div>
    </BaseCard>

    <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
      <h3 class="text-sm font-semibold">Question Breakdown</h3>
      <div class="mt-3 space-y-3">
        <div
          v-for="(row, index) in breakdown"
          :key="row.questionId"
          class="rounded-xl border border-slate-200 p-3 dark:border-dark-700"
        >
          <div class="flex items-start justify-between gap-3">
            <p class="text-sm font-medium">Q{{ index + 1 }}. {{ row.question }}</p>
            <BaseBadge size="sm" variant="neutral">{{ row.marksObtained }}/{{ row.totalMarks }}</BaseBadge>
          </div>
          <p class="mt-1 text-xs text-slate-500 dark:text-dark-300">Your answer: {{ row.answerPreview }}</p>
          <p v-if="row.correctAnswer" class="text-xs text-emerald-600 dark:text-emerald-300">Correct answer: {{ row.correctAnswer }}</p>
          <BaseBadge v-if="row.awaitingReview" class="mt-2" size="sm" variant="warning">Awaiting teacher review</BaseBadge>
        </div>
      </div>
    </BaseCard>

    <BaseButton variant="ghost" @click="navigateTo(`/classroom/${courseId}/exams`)">Back to Exams</BaseButton>
  </div>
</template>

<script setup lang="ts">
import { useExamStore } from '~/stores/exam'
import { useClassroomStore } from '~/stores/classroom'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))
const examId = computed(() => String(route.params.examId || ''))

const examStore = useExamStore()
const classroomStore = useClassroomStore()

const exam = computed(() => examStore.examsByCourse(courseId.value).find((item) => item.id === examId.value) || null)
const submission = computed(() => examStore.currentSubmission)

const breakdown = computed(() => {
  if (!exam.value) return []

  return exam.value.questions.map((question) => {
    const rawAnswer = submission.value?.answers[question.id]
    const answerPreview = rawAnswer === undefined || rawAnswer === '' ? 'Not answered' : String(rawAnswer)

    if (question.type === 'mcq') {
      const correctIndex = question.correctOptionIndex ?? -1
      const givenIndex = typeof rawAnswer === 'number' ? rawAnswer : Number(rawAnswer)
      const isCorrect = givenIndex === correctIndex
      const marksObtained = isCorrect ? question.marks : 0
      return {
        questionId: question.id,
        question: question.question,
        answerPreview,
        correctAnswer: question.options?.[correctIndex] || '—',
        marksObtained,
        totalMarks: question.marks,
        awaitingReview: false,
      }
    }

    return {
      questionId: question.id,
      question: question.question,
      answerPreview,
      correctAnswer: '',
      marksObtained: 0,
      totalMarks: question.marks,
      awaitingReview: true,
    }
  })
})

const score = computed(() => breakdown.value.reduce((sum, item) => sum + item.marksObtained, 0))
const percentage = computed(() => {
  if (!exam.value?.totalMarks) return 0
  return (score.value / exam.value.totalMarks) * 100
})

const grade = computed(() => {
  const p = percentage.value
  if (p >= 90) return 'A'
  if (p >= 80) return 'B'
  if (p >= 70) return 'C'
  if (p >= 60) return 'D'
  return 'F'
})

const gradeVariant = computed(() => {
  if (grade.value === 'A' || grade.value === 'B') return 'success'
  if (grade.value === 'C') return 'accent'
  if (grade.value === 'D') return 'warning'
  return 'danger'
})

const isUngraded = computed(() => breakdown.value.some((item) => item.awaitingReview))

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Exam Result`,
}))
</script>

