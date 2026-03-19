<template>
  <div class="space-y-5">
    <BaseCard class="overflow-hidden border-indigo-100 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white dark:border-indigo-800">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-wide text-indigo-100">Welcome back</p>
          <h2 class="mt-1 text-2xl font-semibold">{{ classroomStore.course?.title }}</h2>
          <p class="mt-1 text-sm text-indigo-100">Instructor: {{ classroomStore.course?.teacherName }}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <BaseButton v-if="isTeacher" size="sm" variant="secondary" @click="toast.info('Open notice form', 'Use Notice Board quick create')">+ Notice</BaseButton>
          <BaseButton v-if="isTeacher" size="sm" variant="secondary" @click="toast.info('Open exam form', 'Use Exams room to create exam')">+ Exam</BaseButton>
          <BaseButton v-if="isTeacher" size="sm" variant="secondary" @click="toast.info('Open schedule form', 'Use Schedule room to add session')">+ Schedule Session</BaseButton>
          <BaseButton v-if="!isTeacher" size="sm" variant="secondary" @click="navigateTo(`/classroom/${courseId}/schedule`)">View Schedule</BaseButton>
          <BaseButton v-if="!isTeacher" size="sm" variant="secondary" @click="navigateTo(`/classroom/${courseId}/progress`)">My Progress</BaseButton>
        </div>
      </div>
    </BaseCard>

    <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <BaseCard v-for="stat in stats" :key="stat.label" class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
        <p class="text-xs text-slate-500 dark:text-dark-300">{{ stat.label }}</p>
        <p class="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{{ stat.value }}</p>
      </BaseCard>
    </div>

    <div class="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
      <div class="space-y-5">
        <BaseCard>
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-semibold">Upcoming sessions</h3>
            <NuxtLink :to="`/classroom/${courseId}/schedule`" class="text-xs text-indigo-600 hover:underline dark:text-indigo-300">View all</NuxtLink>
          </div>

          <div v-if="upcomingSessions.length" class="space-y-2">
            <div
              v-for="session in upcomingSessions"
              :key="session.id"
              class="rounded-xl border border-slate-200 p-3 dark:border-dark-700"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm font-medium">{{ session.title }}</p>
                <BaseBadge size="sm" :variant="session.type === 'lab' ? 'success' : session.type === 'exam' ? 'danger' : 'accent'">
                  {{ session.type }}
                </BaseBadge>
              </div>
              <p class="mt-1 text-xs text-slate-500 dark:text-dark-300">
                {{ formatDate(session.startAt) }} • {{ formatTimeRange(session.startAt, session.endAt) }}
              </p>
            </div>
          </div>
          <div v-else class="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-dark-700 dark:text-dark-300">
            No upcoming sessions found.
          </div>
        </BaseCard>

        <BaseCard>
          <div class="mb-3 flex items-center justify-between">
            <h3 class="text-sm font-semibold">Recent notices</h3>
            <NuxtLink :to="`/classroom/${courseId}/notices`" class="text-xs text-indigo-600 hover:underline dark:text-indigo-300">Open board</NuxtLink>
          </div>

          <div v-if="recentNotices.length" class="space-y-2">
            <div v-for="notice in recentNotices" :key="notice.id" class="rounded-xl border border-slate-200 p-3 dark:border-dark-700">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium">{{ notice.title }}</p>
                <BaseBadge size="sm" :variant="priorityBadge(notice.priority)">{{ notice.priority }}</BaseBadge>
              </div>
              <p class="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-dark-300">{{ notice.body }}</p>
            </div>
          </div>
          <div v-else class="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-dark-700 dark:text-dark-300">
            No notices yet.
          </div>
        </BaseCard>
      </div>

      <BaseCard>
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-sm font-semibold">Recent activity</h3>
          <NuxtLink :to="`/classroom/${courseId}/messages`" class="text-xs text-indigo-600 hover:underline dark:text-indigo-300">Open chat</NuxtLink>
        </div>

        <div class="space-y-2">
          <div
            v-for="item in activityFeed"
            :key="item.id"
            class="rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-dark-700"
          >
            <p class="font-medium text-slate-900 dark:text-white">{{ item.title }}</p>
            <p class="line-clamp-2 text-xs text-slate-500 dark:text-dark-300">{{ item.description }}</p>
            <p class="mt-1 text-[11px] text-slate-400 dark:text-dark-400">{{ item.time }}</p>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useClassroomStore } from '~/stores/classroom'
import { useChatStore } from '~/stores/chat'
import { useNoticeStore } from '~/stores/notice'
import { useScheduleStore } from '~/stores/schedule'
import { useExamStore } from '~/stores/exam'
import { useAssignmentStore } from '~/stores/assignment'
import { useRole } from '~/composables/useRole'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))
const classroomStore = useClassroomStore()
const chatStore = useChatStore()
const noticeStore = useNoticeStore()
const scheduleStore = useScheduleStore()
const examStore = useExamStore()
const assignmentStore = useAssignmentStore()
const { isTeacher } = useRole()
const toast = useToast()

const { sortedMessages } = storeToRefs(chatStore)
const { sortedNotices } = storeToRefs(noticeStore)

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Overview`,
}))

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso))

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))

const formatTimeRange = (startAt: string, endAt: string) => `${formatTime(startAt)} - ${formatTime(endAt)}`

const upcomingSessions = computed(() =>
  scheduleStore
    .sessionsByCourse(courseId.value)
    .filter((session) => new Date(session.startAt).getTime() > Date.now())
    .slice(0, 3),
)

const recentNotices = computed(() =>
  sortedNotices.value
    .filter((notice) => notice.courseId === courseId.value)
    .slice(0, 3),
)

const recentMessages = computed(() =>
  sortedMessages.value
    .filter((message) => message.courseId === courseId.value)
    .slice(-5)
    .reverse(),
)

const recentExam = computed(() =>
  examStore
    .examsByCourse(courseId.value)
    .filter((exam) => new Date(exam.endAt).getTime() < Date.now())
    .sort((a, b) => new Date(b.endAt).getTime() - new Date(a.endAt).getTime())[0],
)

const pendingAssignments = computed(() =>
  assignmentStore
    .assignmentsByCourse(courseId.value)
    .filter((assignment) => new Date(assignment.dueAt).getTime() > Date.now()).length,
)

const stats = computed(() => [
  { label: 'Enrolled Students', value: classroomStore.course?.memberCount || 0 },
  { label: 'Total Exams', value: examStore.examsByCourse(courseId.value).length },
  { label: 'Upcoming Sessions', value: upcomingSessions.value.length },
  { label: 'Pending Assignments', value: pendingAssignments.value },
])

const activityFeed = computed(() => {
  const fromMessages = recentMessages.value.map((message) => ({
    id: `activity-msg-${message.id}`,
    title: `${message.senderName} sent a message`,
    description: message.content,
    time: formatTime(message.createdAt),
  }))

  const fromExam = recentExam.value
    ? [
        {
          id: `activity-exam-${recentExam.value.id}`,
          title: `Exam finished: ${recentExam.value.title}`,
          description: 'Results are available in exam room.',
          time: formatDate(recentExam.value.endAt),
        },
      ]
    : []

  return [...fromMessages, ...fromExam].slice(0, 5)
})

const priorityBadge = (priority: string) => {
  if (priority === 'urgent') return 'danger'
  if (priority === 'high') return 'warning'
  return 'accent'
}
</script>

