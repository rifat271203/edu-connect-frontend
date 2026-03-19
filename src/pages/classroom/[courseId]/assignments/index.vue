<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs dark:border-dark-700 dark:bg-dark-900">
        <button
          v-for="item in filters"
          :key="item"
          type="button"
          class="rounded-lg px-3 py-1.5 capitalize"
          :class="activeFilter === item ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-dark-300'"
          @click="activeFilter = item"
        >
          {{ item }}
        </button>
      </div>
      <BaseButton v-if="isTeacher" @click="assignmentModalOpen = true">+ Create Assignment</BaseButton>
    </div>

    <div class="space-y-3">
      <BaseCard
        v-for="assignment in filteredAssignments"
        :key="assignment.id"
        hover
        class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900"
        @click="navigateTo(`/classroom/${courseId}/assignments/${assignment.id}`)"
      >
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="text-sm font-semibold">{{ assignment.title }}</h3>
            <p class="mt-1 text-xs" :class="isOverdue(assignment) ? 'text-red-500' : 'text-slate-500 dark:text-dark-300'">
              Due: {{ formatDate(assignment.dueAt) }}
            </p>
            <p class="text-xs text-slate-500 dark:text-dark-300">Total marks: {{ assignment.totalMarks }}</p>
          </div>

          <div class="flex items-center gap-2">
            <BaseBadge size="sm" :variant="statusBadge(assignment)">{{ assignmentStatusLabel(assignment) }}</BaseBadge>
            <BaseBadge v-if="isTeacher" size="sm" variant="neutral">
              {{ assignment.submissions.length }}/{{ classroomStore.course?.memberCount || 0 }} submitted
            </BaseBadge>
          </div>
        </div>
      </BaseCard>

      <BaseCard
        v-if="!filteredAssignments.length"
        class="border-dashed border-slate-300 bg-white text-center dark:border-dark-700 dark:bg-dark-900"
      >
        <div class="py-8">
          <p class="text-4xl">🗂️</p>
          <p class="mt-2 text-sm font-semibold">No assignments in this filter</p>
          <p class="text-xs text-slate-500 dark:text-dark-300">Try another status or create a new assignment.</p>
        </div>
      </BaseCard>
    </div>

    <BaseModal v-model="assignmentModalOpen" title="Create Assignment" size="lg">
      <div class="space-y-3">
        <BaseInput v-model="form.title" placeholder="Title" :error="errors.title" />
        <textarea
          v-model="form.description"
          class="textarea-field min-h-[100px] w-full rounded-xl px-3 py-2 text-sm"
          placeholder="Description"
        />
        <div class="grid gap-3 md:grid-cols-2">
          <BaseInput v-model="form.dueAt" type="datetime-local" placeholder="Due date" :error="errors.dueAt" />
          <BaseInput v-model="form.totalMarks" type="number" placeholder="Total marks" :error="errors.totalMarks" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" @click="assignmentModalOpen = false">Cancel</BaseButton>
          <BaseButton @click="saveAssignment">Save Assignment</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { ClassroomAssignment } from '~/types/classroom-room'
import { useAssignmentStore } from '~/stores/assignment'
import { useClassroomStore } from '~/stores/classroom'
import { useRole } from '~/composables/useRole'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))

const assignmentStore = useAssignmentStore()
const classroomStore = useClassroomStore()
const { isTeacher } = useRole()
const toast = useToast()

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Assignments`,
}))

const filters = ['all', 'pending', 'submitted', 'graded', 'overdue'] as const
const activeFilter = ref<(typeof filters)[number]>('all')

const assignments = computed(() => assignmentStore.assignmentsByCourse(courseId.value))

const currentUserId = computed(() => 's-1')

const isOverdue = (assignment: ClassroomAssignment) => new Date(assignment.dueAt).getTime() < Date.now()

const ownSubmission = (assignment: ClassroomAssignment) =>
  assignment.submissions.find((submission) => submission.studentId === currentUserId.value)

const assignmentStatusLabel = (assignment: ClassroomAssignment) => {
  const submission = ownSubmission(assignment)
  if (isTeacher.value) {
    return isOverdue(assignment) ? 'overdue' : 'active'
  }
  if (submission?.score !== undefined) return 'graded'
  if (submission) return 'submitted'
  if (isOverdue(assignment)) return 'overdue'
  return 'pending'
}

const statusBadge = (assignment: ClassroomAssignment) => {
  const status = assignmentStatusLabel(assignment)
  if (status === 'graded') return 'success'
  if (status === 'submitted') return 'accent'
  if (status === 'overdue') return 'danger'
  if (status === 'active') return 'neutral'
  return 'warning'
}

const filteredAssignments = computed(() => {
  if (activeFilter.value === 'all') return assignments.value
  return assignments.value.filter((assignment) => assignmentStatusLabel(assignment) === activeFilter.value)
})

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))

const assignmentModalOpen = ref(false)
const form = reactive({
  title: '',
  description: '',
  dueAt: '',
  totalMarks: '20',
})

const errors = reactive({
  title: '',
  dueAt: '',
  totalMarks: '',
})

const toLocalInput = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60_000
  const local = new Date(date.getTime() - tzOffset)
  return local.toISOString().slice(0, 16)
}

const validate = () => {
  errors.title = form.title.trim() ? '' : 'Title is required'
  errors.dueAt = form.dueAt ? '' : 'Due date is required'
  errors.totalMarks = Number(form.totalMarks) > 0 ? '' : 'Marks must be positive'
  return !errors.title && !errors.dueAt && !errors.totalMarks
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.dueAt = toLocalInput(new Date(Date.now() + 72 * 3600 * 1000))
  form.totalMarks = '20'
  errors.title = ''
  errors.dueAt = ''
  errors.totalMarks = ''
}

const saveAssignment = () => {
  if (!validate()) return

  const payload: ClassroomAssignment = {
    id: `${courseId.value}-assignment-${Date.now()}`,
    courseId: courseId.value,
    title: form.title.trim(),
    description: form.description.trim(),
    dueAt: new Date(form.dueAt).toISOString(),
    totalMarks: Number(form.totalMarks),
    submissions: [],
  }

  assignmentStore.saveAssignment(payload)
  assignmentModalOpen.value = false
  resetForm()
  toast.success('Assignment created')
}

onMounted(() => {
  resetForm()
})
</script>

