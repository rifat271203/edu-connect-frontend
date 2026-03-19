<template>
  <div class="space-y-4">
    <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
      <h2 class="text-lg font-semibold">{{ assignment?.title }}</h2>
      <p class="mt-2 whitespace-pre-wrap text-sm text-slate-600 dark:text-dark-300">{{ assignment?.description }}</p>
      <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-dark-300">
        <span>Due: {{ formatDate(assignment?.dueAt) }}</span>
        <span>Total Marks: {{ assignment?.totalMarks }}</span>
        <a
          v-if="assignment?.attachmentUrl"
          :href="assignment.attachmentUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-indigo-600 hover:underline dark:text-indigo-300"
        >
          Download attachment
        </a>
      </div>
    </BaseCard>

    <template v-if="isStudent">
      <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <h3 class="text-sm font-semibold">My Submission</h3>

        <template v-if="mySubmission">
          <div class="mt-3 space-y-2 text-sm">
            <p>
              File:
              <a :href="mySubmission.fileUrl" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:underline dark:text-indigo-300">
                {{ mySubmission.fileName }}
              </a>
            </p>
            <p v-if="mySubmission.comment">Comment: {{ mySubmission.comment }}</p>
            <p>Submitted at: {{ formatDate(mySubmission.submittedAt) }}</p>
            <BaseBadge v-if="mySubmission.late" size="sm" variant="danger">Late</BaseBadge>
            <div v-if="mySubmission.score !== undefined" class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/40 dark:bg-emerald-500/10">
              <p class="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Score: {{ mySubmission.score }}/{{ assignment?.totalMarks }}</p>
              <p class="mt-1 text-xs text-emerald-700/80 dark:text-emerald-300/80">Feedback: {{ mySubmission.feedback || 'No feedback yet.' }}</p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="mt-3 space-y-3">
            <div>
              <input ref="fileInputRef" type="file" class="hidden" @change="onFileSelected">
              <BaseButton variant="secondary" @click="fileInputRef?.click()">Choose file</BaseButton>
              <p v-if="selectedFileName" class="mt-1 text-xs text-slate-500 dark:text-dark-300">{{ selectedFileName }}</p>
            </div>
            <textarea
              v-model="submissionComment"
              class="textarea-field min-h-[90px] w-full rounded-xl px-3 py-2 text-sm"
              placeholder="Optional comment"
            />
            <BaseButton :loading="uploading" :disabled="!selectedFile" @click="submitAssignment">Submit Assignment</BaseButton>
          </div>
        </template>
      </BaseCard>
    </template>

    <template v-else>
      <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <h3 class="text-sm font-semibold">Submissions</h3>
        <div class="mt-3 space-y-3">
          <div
            v-for="submission in assignment?.submissions || []"
            :key="submission.studentId"
            class="rounded-xl border border-slate-200 p-3 dark:border-dark-700"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="text-sm font-semibold">{{ submission.studentName }}</p>
              <div class="flex items-center gap-2">
                <BaseBadge v-if="submission.late" size="sm" variant="danger">Late</BaseBadge>
                <a
                  :href="submission.fileUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs text-indigo-600 hover:underline dark:text-indigo-300"
                >
                  {{ submission.fileName }}
                </a>
              </div>
            </div>
            <p class="mt-1 text-xs text-slate-500 dark:text-dark-300">Submitted: {{ formatDate(submission.submittedAt) }}</p>
            <p v-if="submission.comment" class="mt-1 text-xs text-slate-500 dark:text-dark-300">Comment: {{ submission.comment }}</p>

            <div class="mt-3 grid gap-2 md:grid-cols-[120px_1fr_auto]">
              <BaseInput v-model="gradeDrafts[submission.studentId].score" type="number" placeholder="Score" />
              <BaseInput v-model="gradeDrafts[submission.studentId].feedback" placeholder="Feedback" />
              <BaseButton size="sm" @click="saveGrade(submission.studentId)">Save Grade</BaseButton>
            </div>
          </div>

          <p v-if="!(assignment?.submissions.length || 0)" class="text-xs text-slate-500 dark:text-dark-300">No submissions yet.</p>
        </div>
      </BaseCard>
    </template>

    <BaseButton variant="ghost" @click="navigateTo(`/classroom/${courseId}/assignments`)">Back to Assignments</BaseButton>
  </div>
</template>

<script setup lang="ts">
import { useAssignmentStore } from '~/stores/assignment'
import { useClassroomStore } from '~/stores/classroom'
import { useRole } from '~/composables/useRole'
import { useFileUpload } from '~/composables/useFileUpload'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))
const assignmentId = computed(() => String(route.params.assignmentId || ''))

const assignmentStore = useAssignmentStore()
const classroomStore = useClassroomStore()
const { isStudent } = useRole()
const { upload, uploading } = useFileUpload()
const toast = useToast()

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Assignment`,
}))

const assignment = computed(() => assignmentStore.assignmentsByCourse(courseId.value).find((item) => item.id === assignmentId.value) || null)

const currentStudentId = 's-1'

const mySubmission = computed(() =>
  assignment.value?.submissions.find((submission) => submission.studentId === currentStudentId) || null,
)

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const submissionComment = ref('')

const selectedFileName = computed(() => selectedFile.value?.name || '')

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  selectedFile.value = input.files?.[0] || null
}

const submitAssignment = async () => {
  if (!assignment.value || !selectedFile.value) return

  const uploaded = await upload(selectedFile.value)
  if (!uploaded?.fileUrl) {
    toast.error('Upload failed')
    return
  }

  const late = new Date(assignment.value.dueAt).getTime() < Date.now()

  assignmentStore.saveSubmission(assignment.value.id, {
    studentId: currentStudentId,
    studentName: 'Nafis Islam',
    fileUrl: uploaded.fileUrl,
    fileName: uploaded.fileName,
    comment: submissionComment.value.trim() || undefined,
    submittedAt: new Date().toISOString(),
    late,
  })

  selectedFile.value = null
  submissionComment.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
  toast.success('Assignment submitted')
}

const gradeDrafts = reactive<Record<string, { score: string; feedback: string }>>({})

const ensureGradeDraft = () => {
  const submissions = assignment.value?.submissions || []
  submissions.forEach((submission) => {
    if (!gradeDrafts[submission.studentId]) {
      gradeDrafts[submission.studentId] = {
        score: submission.score !== undefined ? String(submission.score) : '',
        feedback: submission.feedback || '',
      }
    }
  })
}

const saveGrade = (studentId: string) => {
  if (!assignment.value) return
  const submission = assignment.value.submissions.find((item) => item.studentId === studentId)
  if (!submission) return

  const draft = gradeDrafts[studentId]

  assignmentStore.saveSubmission(assignment.value.id, {
    ...submission,
    score: Number(draft.score) || 0,
    feedback: draft.feedback,
  })

  toast.success('Grade saved')
}

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

watch(
  () => assignment.value,
  () => {
    ensureGradeDraft()
  },
  { immediate: true },
)

onMounted(async () => {
  if (!assignment.value) {
    await navigateTo(`/classroom/${encodeURIComponent(courseId.value)}/assignments`)
  }
})
</script>

