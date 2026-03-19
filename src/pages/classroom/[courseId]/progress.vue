<template>
  <div class="space-y-4">
    <template v-if="isStudent">
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
          <p class="text-xs text-slate-500 dark:text-dark-300">Overall Grade</p>
          <p class="mt-1 text-2xl font-semibold">{{ studentData?.overallGrade || 0 }}%</p>
        </BaseCard>

        <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
          <p class="text-xs text-slate-500 dark:text-dark-300">Attendance</p>
          <div class="mt-2 flex items-center gap-3">
            <div class="grid h-14 w-14 place-items-center rounded-full border-4 border-emerald-100 text-sm font-semibold text-emerald-700 dark:border-emerald-900/40 dark:text-emerald-300">
              {{ studentData?.attendancePercentage || 0 }}%
            </div>
            <p class="text-xs text-slate-500 dark:text-dark-300">Present in recent sessions</p>
          </div>
        </BaseCard>
      </div>

      <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <h3 class="text-sm font-semibold">Exam Scores</h3>
        <div class="mt-3 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-xs text-slate-500 dark:text-dark-300">
              <tr>
                <th class="pb-2">Exam</th>
                <th class="pb-2">Score</th>
                <th class="pb-2">Grade</th>
                <th class="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in studentData?.examScores || []" :key="row.examName" class="border-t border-slate-100 dark:border-dark-800">
                <td class="py-2">{{ row.examName }}</td>
                <td class="py-2">{{ row.score }}/{{ row.total }}</td>
                <td class="py-2">{{ row.grade }}</td>
                <td class="py-2">{{ formatDate(row.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <h3 class="text-sm font-semibold">Assignment Grades</h3>
        <div class="mt-3 overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-xs text-slate-500 dark:text-dark-300">
              <tr>
                <th class="pb-2">Assignment</th>
                <th class="pb-2">Score</th>
                <th class="pb-2">Feedback</th>
                <th class="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in studentData?.assignmentScores || []" :key="row.name" class="border-t border-slate-100 dark:border-dark-800">
                <td class="py-2">{{ row.name }}</td>
                <td class="py-2">{{ row.score }}/{{ row.total }}</td>
                <td class="py-2">{{ row.feedback }}</td>
                <td class="py-2">{{ formatDate(row.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>

      <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <h3 class="text-sm font-semibold">Performance Trend</h3>
        <div class="mt-3 h-36 rounded-xl border border-slate-200 p-3 dark:border-dark-700">
          <svg viewBox="0 0 300 120" class="h-full w-full">
            <polyline
              :points="trendPolyline"
              fill="none"
              stroke="#4F46E5"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </BaseCard>
    </template>

    <template v-else>
      <div class="grid gap-3 md:grid-cols-3">
        <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
          <p class="text-xs text-slate-500 dark:text-dark-300">Average Score</p>
          <p class="mt-1 text-2xl font-semibold">{{ teacherStats?.averageScore || 0 }}%</p>
        </BaseCard>
        <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
          <p class="text-xs text-slate-500 dark:text-dark-300">Attendance Rate</p>
          <p class="mt-1 text-2xl font-semibold">{{ teacherStats?.attendanceRate || 0 }}%</p>
        </BaseCard>
        <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
          <p class="text-xs text-slate-500 dark:text-dark-300">Submission Rate</p>
          <p class="mt-1 text-2xl font-semibold">{{ teacherStats?.submissionRate || 0 }}%</p>
        </BaseCard>
      </div>

      <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-semibold">Student Overview</h3>
          <div class="flex gap-2">
            <BaseButton size="sm" variant="secondary" @click="exportCsv">Export CSV</BaseButton>
            <BaseButton size="sm" @click="attendanceModalOpen = true">Mark Attendance</BaseButton>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="text-xs text-slate-500 dark:text-dark-300">
              <tr>
                <th class="pb-2"><button type="button" @click="setSort('name')">Name</button></th>
                <th class="pb-2"><button type="button" @click="setSort('avgScore')">Avg Score</button></th>
                <th class="pb-2"><button type="button" @click="setSort('attendancePercent')">Attendance %</button></th>
                <th class="pb-2"><button type="button" @click="setSort('assignmentsCompleted')">Assignments</button></th>
                <th class="pb-2"><button type="button" @click="setSort('overallGrade')">Grade</button></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="student in sortedStudents"
                :key="student.id"
                class="cursor-pointer border-t border-slate-100 hover:bg-slate-50 dark:border-dark-800 dark:hover:bg-dark-800/60"
                @click="openStudentDetail(student.id)"
              >
                <td class="py-2">{{ student.name }}</td>
                <td class="py-2">{{ student.avgScore }}</td>
                <td class="py-2">{{ student.attendancePercent }}</td>
                <td class="py-2">{{ student.assignmentsCompleted }}</td>
                <td class="py-2">{{ student.overallGrade }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </template>

    <div
      v-if="studentDetailOpen && selectedStudent"
      class="fixed inset-y-0 right-0 z-[90] w-[min(92vw,380px)] border-l border-slate-200 bg-white p-4 shadow-xl dark:border-dark-700 dark:bg-dark-900"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-semibold">Student Detail</h3>
        <button type="button" class="rounded-lg p-1" @click="studentDetailOpen = false">✕</button>
      </div>

      <div class="space-y-2 text-sm">
        <p><span class="font-medium">Name:</span> {{ selectedStudent.name }}</p>
        <p><span class="font-medium">Average Score:</span> {{ selectedStudent.avgScore }}%</p>
        <p><span class="font-medium">Attendance:</span> {{ selectedStudent.attendancePercent }}%</p>
        <p><span class="font-medium">Assignments:</span> {{ selectedStudent.assignmentsCompleted }}</p>
        <p><span class="font-medium">Overall Grade:</span> {{ selectedStudent.overallGrade }}</p>
      </div>
    </div>

    <BaseModal v-model="attendanceModalOpen" title="Mark Attendance" size="lg">
      <div class="space-y-3">
        <BaseSelect v-model="attendanceSessionId" :options="attendanceSessionOptions" placeholder="Select session" />
        <div class="space-y-2">
          <div
            v-for="student in classStudents"
            :key="`att-${student.id}`"
            class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 dark:border-dark-700"
          >
            <span class="text-sm">{{ student.name }}</span>
            <BaseSelect
              v-model="attendanceMap[student.id]"
              :options="attendanceStatusOptions"
              placeholder="Status"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" @click="attendanceModalOpen = false">Cancel</BaseButton>
          <BaseButton @click="saveAttendance">Save Attendance</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import type { TeacherStudentProgressRow } from '~/types/classroom-room'
import { useProgressStore } from '~/stores/progress'
import { useClassroomStore } from '~/stores/classroom'
import { useScheduleStore } from '~/stores/schedule'
import { useRole } from '~/composables/useRole'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))

const progressStore = useProgressStore()
const classroomStore = useClassroomStore()
const scheduleStore = useScheduleStore()
const { isStudent } = useRole()
const toast = useToast()

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Progress`,
}))

const studentData = computed(() => progressStore.studentProgress[courseId.value])
const teacherStats = computed(() => progressStore.classStats[courseId.value])
const classStudents = computed(() => progressStore.classStudents[courseId.value] || [])

const trendPolyline = computed(() => {
  const rows = studentData.value?.examScores || []
  if (!rows.length) return '20,90 280,90'

  return rows
    .map((row, index) => {
      const x = 20 + index * (260 / Math.max(1, rows.length - 1))
      const percentage = (row.score / row.total) * 100
      const y = 100 - (percentage / 100) * 80
      return `${x},${y}`
    })
    .join(' ')
})

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))

const sortKey = ref<keyof TeacherStudentProgressRow>('name')
const sortDirection = ref<'asc' | 'desc'>('asc')

const setSort = (key: keyof TeacherStudentProgressRow) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    return
  }
  sortKey.value = key
  sortDirection.value = 'asc'
}

const sortedStudents = computed(() => {
  const key = sortKey.value
  const dir = sortDirection.value === 'asc' ? 1 : -1

  return [...classStudents.value].sort((a, b) => {
    const va = a[key]
    const vb = b[key]
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * dir
    return String(va).localeCompare(String(vb)) * dir
  })
})

const studentDetailOpen = ref(false)
const selectedStudentId = ref('')

const selectedStudent = computed(() => classStudents.value.find((student) => student.id === selectedStudentId.value) || null)

const openStudentDetail = (studentId: string) => {
  selectedStudentId.value = studentId
  studentDetailOpen.value = true
}

const exportCsv = () => {
  const header = ['Name', 'Avg Score', 'Attendance %', 'Assignments Completed', 'Overall Grade']
  const rows = sortedStudents.value.map((row) => [row.name, row.avgScore, row.attendancePercent, row.assignmentsCompleted, row.overallGrade])
  const csv = [header, ...rows].map((row) => row.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `class-progress-${courseId.value}.csv`
  link.click()
  URL.revokeObjectURL(url)

  toast.success('CSV exported')
}

const attendanceModalOpen = ref(false)
const attendanceSessionId = ref('')
const attendanceMap = reactive<Record<string, string>>({})

const attendanceSessionOptions = computed(() =>
  scheduleStore.sessionsByCourse(courseId.value).map((session) => ({
    label: `${session.title} (${formatDate(session.startAt)})`,
    value: session.id,
  })),
)

const attendanceStatusOptions = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
]

const saveAttendance = () => {
  attendanceModalOpen.value = false
  toast.success('Attendance marked successfully')
}

watch(
  () => classStudents.value,
  (students) => {
    students.forEach((student) => {
      if (!attendanceMap[student.id]) {
        attendanceMap[student.id] = 'present'
      }
    })
  },
  { immediate: true },
)
</script>

