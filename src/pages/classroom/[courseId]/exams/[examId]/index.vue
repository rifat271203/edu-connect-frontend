<template>
  <div class="space-y-4">
    <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-wide text-slate-500 dark:text-dark-300">Exam Detail</p>
          <h2 class="mt-1 text-xl font-semibold">{{ exam?.title || 'Exam' }}</h2>
          <p class="mt-1 text-sm text-slate-500 dark:text-dark-300">
            {{ formatDate(exam?.startAt) }} • {{ exam?.durationMinutes || 0 }} minutes • {{ exam?.totalMarks || 0 }} marks
          </p>
        </div>
        <BaseBadge size="sm" :variant="statusBadge">{{ status }}</BaseBadge>
      </div>
    </BaseCard>

    <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
      <h3 class="text-sm font-semibold">Instructions</h3>
      <p class="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-dark-300">{{ exam?.instructions || 'No instructions available.' }}</p>
    </BaseCard>

    <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
      <h3 class="text-sm font-semibold">Questions overview</h3>
      <ul class="mt-2 space-y-2">
        <li
          v-for="(question, index) in exam?.questions || []"
          :key="question.id"
          class="rounded-lg border border-slate-200 p-3 text-sm dark:border-dark-700"
        >
          <div class="flex items-center justify-between gap-3">
            <p class="font-medium">Q{{ index + 1 }}. {{ question.question }}</p>
            <BaseBadge size="sm" variant="neutral">{{ question.type }} • {{ question.marks }}</BaseBadge>
          </div>
        </li>
      </ul>
    </BaseCard>

    <div class="flex flex-wrap gap-2">
      <BaseButton variant="ghost" @click="navigateTo(`/classroom/${courseId}/exams`)">Back to Exams</BaseButton>
      <BaseButton v-if="!isTeacher && status === 'ongoing'" @click="navigateTo(`/classroom/${courseId}/exams/${examId}/take`)">Start Exam</BaseButton>
      <BaseButton v-if="!isTeacher && status === 'past'" variant="secondary" @click="navigateTo(`/classroom/${courseId}/exams/${examId}/result`)">View Result</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExamStore } from '~/stores/exam'
import { useClassroomStore } from '~/stores/classroom'
import { useRole } from '~/composables/useRole'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))
const examId = computed(() => String(route.params.examId || ''))

const examStore = useExamStore()
const classroomStore = useClassroomStore()
const { isTeacher } = useRole()

const exam = computed(() => examStore.examsByCourse(courseId.value).find((item) => item.id === examId.value) || null)

const status = computed(() => {
  if (!exam.value) return 'unknown'
  const start = new Date(exam.value.startAt).getTime()
  const end = new Date(exam.value.endAt).getTime()
  const now = Date.now()
  if (now < start) return 'upcoming'
  if (now <= end) return 'ongoing'
  return 'past'
})

const statusBadge = computed(() => {
  if (status.value === 'ongoing') return 'success'
  if (status.value === 'past') return 'neutral'
  return 'accent'
})

const formatDate = (value?: string) => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Exam Details`,
}))

onMounted(async () => {
  if (!exam.value) {
    await navigateTo(`/classroom/${encodeURIComponent(courseId.value)}/exams`)
  }
})
</script>

