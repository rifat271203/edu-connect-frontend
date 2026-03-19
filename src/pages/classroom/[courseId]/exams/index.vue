<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold">Exams</h2>
        <p class="text-xs text-slate-500 dark:text-dark-300">Upcoming, ongoing and past assessments</p>
      </div>
      <BaseButton v-if="isTeacher" @click="openCreateModal">+ Create Exam</BaseButton>
    </div>

    <section class="space-y-3">
      <h3 class="text-sm font-semibold text-slate-600 dark:text-dark-200">Upcoming</h3>
      <div v-if="upcomingExams.length" class="grid gap-3 md:grid-cols-2">
        <BaseCard
          v-for="exam in upcomingExams"
          :key="exam.id"
          class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900"
        >
          <ExamCardContent :exam="exam" />
        </BaseCard>
      </div>
      <EmptyState v-else text="No upcoming exams" />
    </section>

    <section class="space-y-3">
      <h3 class="text-sm font-semibold text-slate-600 dark:text-dark-200">Ongoing</h3>
      <div v-if="ongoingExams.length" class="grid gap-3 md:grid-cols-2">
        <BaseCard
          v-for="exam in ongoingExams"
          :key="exam.id"
          class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900"
        >
          <ExamCardContent :exam="exam" />
        </BaseCard>
      </div>
      <EmptyState v-else text="No ongoing exams" />
    </section>

    <section class="space-y-3">
      <h3 class="text-sm font-semibold text-slate-600 dark:text-dark-200">Past</h3>
      <div v-if="pastExams.length" class="grid gap-3 md:grid-cols-2">
        <BaseCard
          v-for="exam in pastExams"
          :key="exam.id"
          class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900"
        >
          <ExamCardContent :exam="exam" />
        </BaseCard>
      </div>
      <EmptyState v-else text="No past exams" />
    </section>

    <BaseModal v-model="createModalOpen" title="Create Exam" size="xl">
      <div class="space-y-3">
        <BaseInput v-model="form.title" placeholder="Exam title" :error="errors.title" />
        <div>
          <textarea
            v-model="form.instructions"
            class="textarea-field min-h-[100px] w-full rounded-xl px-3 py-2 text-sm"
            placeholder="Instructions"
          />
        </div>

        <div class="grid gap-3 md:grid-cols-3">
          <BaseInput v-model="form.durationMinutes" type="number" placeholder="Duration (minutes)" :error="errors.duration" />
          <BaseInput v-model="form.startAt" type="datetime-local" placeholder="Start time" :error="errors.startAt" />
          <BaseInput v-model="form.endAt" type="datetime-local" placeholder="End time" :error="errors.endAt" />
        </div>

        <div class="rounded-xl border border-slate-200 p-3 dark:border-dark-700">
          <div class="mb-3 flex items-center justify-between">
            <p class="text-sm font-semibold">Questions</p>
            <BaseButton size="sm" variant="secondary" @click="addQuestion">Add Question</BaseButton>
          </div>

          <div class="space-y-3">
            <div
              v-for="(question, index) in form.questions"
              :key="question.id"
              class="rounded-xl border border-slate-200 p-3 dark:border-dark-700"
            >
              <div class="mb-2 flex items-center justify-between">
                <p class="text-xs font-semibold text-slate-500 dark:text-dark-300">Question {{ index + 1 }}</p>
                <button type="button" class="text-xs text-red-500" @click="removeQuestion(question.id)">Remove</button>
              </div>

              <div class="grid gap-3 md:grid-cols-3">
                <BaseSelect v-model="question.type" :options="questionTypeOptions" placeholder="Type" />
                <BaseInput v-model="question.marks" type="number" placeholder="Marks" />
              </div>

              <textarea
                v-model="question.question"
                class="textarea-field mt-3 min-h-[80px] w-full rounded-xl px-3 py-2 text-sm"
                placeholder="Question text"
              />

              <div v-if="question.type === 'mcq'" class="mt-3 space-y-2">
                <div
                  v-for="(option, optionIndex) in question.options"
                  :key="`${question.id}-option-${optionIndex}`"
                  class="flex items-center gap-2"
                >
                  <input
                    v-model="question.correctOptionIndex"
                    type="radio"
                    :name="`correct-${question.id}`"
                    :value="optionIndex"
                  >
                  <BaseInput v-model="question.options[optionIndex]" :placeholder="`Option ${optionIndex + 1}`" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" @click="createModalOpen = false">Cancel</BaseButton>
          <BaseButton @click="saveExam">Save Exam</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { ClassroomExam, ExamQuestion } from '~/types/classroom-room'
import { useExamStore } from '~/stores/exam'
import { useClassroomStore } from '~/stores/classroom'
import { useRole } from '~/composables/useRole'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))

const examStore = useExamStore()
const classroomStore = useClassroomStore()
const { isTeacher } = useRole()
const toast = useToast()

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Exams`,
}))

const now = () => Date.now()

const courseExams = computed(() =>
  examStore
    .examsByCourse(courseId.value)
    .slice()
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()),
)

const examStatus = (exam: ClassroomExam) => {
  const start = new Date(exam.startAt).getTime()
  const end = new Date(exam.endAt).getTime()
  if (now() < start) return 'upcoming'
  if (now() <= end) return 'ongoing'
  return 'past'
}

const upcomingExams = computed(() => courseExams.value.filter((exam) => examStatus(exam) === 'upcoming'))
const ongoingExams = computed(() => courseExams.value.filter((exam) => examStatus(exam) === 'ongoing'))
const pastExams = computed(() => courseExams.value.filter((exam) => examStatus(exam) === 'past'))

interface QuestionForm {
  id: string
  type: 'mcq' | 'short' | 'long'
  question: string
  marks: string
  options: string[]
  correctOptionIndex: number
}

const createModalOpen = ref(false)
const form = reactive({
  title: '',
  instructions: '',
  durationMinutes: '30',
  startAt: '',
  endAt: '',
  questions: [] as QuestionForm[],
})

const errors = reactive({
  title: '',
  duration: '',
  startAt: '',
  endAt: '',
})

const questionTypeOptions = [
  { label: 'MCQ', value: 'mcq' },
  { label: 'Short', value: 'short' },
  { label: 'Long', value: 'long' },
]

const totalMarks = computed(() =>
  form.questions.reduce((sum, question) => sum + Number(question.marks || 0), 0),
)

const toLocalInput = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60_000
  const local = new Date(date.getTime() - tzOffset)
  return local.toISOString().slice(0, 16)
}

const resetForm = () => {
  form.title = ''
  form.instructions = ''
  form.durationMinutes = '30'
  form.startAt = toLocalInput(new Date(Date.now() + 6 * 3600 * 1000))
  form.endAt = toLocalInput(new Date(Date.now() + 7 * 3600 * 1000))
  form.questions = []
  addQuestion()
  errors.title = ''
  errors.duration = ''
  errors.startAt = ''
  errors.endAt = ''
}

const openCreateModal = () => {
  resetForm()
  createModalOpen.value = true
}

const addQuestion = () => {
  if (form.questions.length >= 50) return
  form.questions.push({
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: 'mcq',
    question: '',
    marks: '5',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
  })
}

const removeQuestion = (questionId: string) => {
  form.questions = form.questions.filter((question) => question.id !== questionId)
  if (!form.questions.length) addQuestion()
}

const validate = () => {
  errors.title = form.title.trim() ? '' : 'Title is required'
  errors.duration = Number(form.durationMinutes) > 0 ? '' : 'Duration must be positive'
  errors.startAt = form.startAt ? '' : 'Start date/time is required'
  errors.endAt = form.endAt ? '' : 'End date/time is required'

  const timeValid = new Date(form.endAt).getTime() > new Date(form.startAt).getTime()
  if (errors.startAt || errors.endAt) {
    return false
  }

  if (!timeValid) {
    errors.endAt = 'End must be later than start'
    return false
  }

  return !errors.title && !errors.duration
}

const normalizeQuestions = (): ExamQuestion[] =>
  form.questions.map((question) => ({
    id: question.id,
    type: question.type,
    question: question.question.trim() || 'Untitled question',
    marks: Number(question.marks) || 1,
    options: question.type === 'mcq' ? question.options.map((item) => item || '-') : undefined,
    correctOptionIndex: question.type === 'mcq' ? question.correctOptionIndex : undefined,
  }))

const saveExam = () => {
  if (!validate()) return

  const exam: ClassroomExam = {
    id: `${courseId.value}-exam-${Date.now()}`,
    courseId: courseId.value,
    title: form.title.trim(),
    instructions: form.instructions.trim(),
    durationMinutes: Number(form.durationMinutes),
    startAt: new Date(form.startAt).toISOString(),
    endAt: new Date(form.endAt).toISOString(),
    totalMarks: totalMarks.value,
    questions: normalizeQuestions(),
  }

  examStore.saveExam(exam)
  createModalOpen.value = false
  toast.success('Exam created successfully')
}

const toDate = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))

const statusBadge = (exam: ClassroomExam) => {
  const status = examStatus(exam)
  if (status === 'ongoing') return 'success'
  if (status === 'past') return 'neutral'
  return 'accent'
}

const openExam = async (exam: ClassroomExam) => {
  await navigateTo(`/classroom/${encodeURIComponent(courseId.value)}/exams/${encodeURIComponent(exam.id)}`)
}

const startExam = async (exam: ClassroomExam) => {
  await navigateTo(`/classroom/${encodeURIComponent(courseId.value)}/exams/${encodeURIComponent(exam.id)}/take`)
}

const viewResult = async (exam: ClassroomExam) => {
  await navigateTo(`/classroom/${encodeURIComponent(courseId.value)}/exams/${encodeURIComponent(exam.id)}/result`)
}

const handleDelete = (examId: string) => {
  examStore.deleteExam(examId)
  toast.success('Exam deleted')
}

const EmptyState = defineComponent({
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  template:
    '<div class="rounded-xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-500 dark:border-dark-700 dark:bg-dark-900 dark:text-dark-300">{{ text }}</div>',
})

const ExamCardContent = defineComponent({
  props: {
    exam: {
      type: Object as () => ClassroomExam,
      required: true,
    },
  },
  setup(props) {
    const status = computed(() => examStatus(props.exam))
    const editable = computed(() => status.value === 'upcoming')

    return {
      isTeacher,
      status,
      editable,
      toDate,
      statusBadge,
      openExam,
      startExam,
      viewResult,
      handleDelete,
    }
  },
  template: `
    <div>
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h4 class="truncate text-sm font-semibold">{{ exam.title }}</h4>
          <p class="mt-1 text-xs text-slate-500 dark:text-dark-300">{{ toDate(exam.startAt) }}</p>
        </div>
        <BaseBadge size="sm" :variant="statusBadge(exam)">{{ status }}</BaseBadge>
      </div>
      <div class="mt-2 text-xs text-slate-500 dark:text-dark-300">
        <p>Duration: {{ exam.durationMinutes }} mins</p>
        <p>Total marks: {{ exam.totalMarks }}</p>
      </div>
      <div class="mt-3 flex flex-wrap gap-2">
        <BaseButton size="sm" variant="secondary" @click="openExam(exam)">Details</BaseButton>
        <BaseButton v-if="!isTeacher && status === 'ongoing'" size="sm" @click="startExam(exam)">Start Exam</BaseButton>
        <BaseButton v-if="!isTeacher && status === 'past'" size="sm" variant="ghost" @click="viewResult(exam)">View Result</BaseButton>
        <BaseButton
          v-if="isTeacher"
          size="sm"
          variant="ghost"
          :disabled="!editable"
          @click="$emit('edit')"
        >
          Edit
        </BaseButton>
        <BaseButton
          v-if="isTeacher"
          size="sm"
          variant="danger"
          :disabled="!editable"
          @click="handleDelete(exam.id)"
        >
          Delete
        </BaseButton>
      </div>
    </div>
  `,
})
</script>

