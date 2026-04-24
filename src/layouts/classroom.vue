<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-dark-950 dark:text-dark-100">
    <div class="flex min-h-screen">
      <aside class="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-dark-700 dark:bg-dark-900 lg:flex lg:flex-col">
        <NuxtLink to="/classroom" class="mb-6 flex items-center gap-2 group">
          <div class="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-900 dark:text-white">Classroom</p>
            <p class="text-xs text-slate-500 dark:text-dark-300">Course workspace</p>
          </div>
        </NuxtLink>

        <nav class="space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition"
            :class="isActive(item) ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-white'"
          >
            <span class="flex items-center gap-2.5">
              <component :is="item.icon" class="w-4 h-4" />
              <span class="font-medium">{{ item.label }}</span>
            </span>
            <BaseBadge v-if="item.badge && item.badge > 0" size="sm" variant="danger">{{ item.badge }}</BaseBadge>
          </NuxtLink>
        </nav>

        <div class="mt-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-dark-700 dark:bg-dark-800/80">
          <p class="text-xs text-slate-500 dark:text-dark-300">Current role</p>
          <BaseBadge class="mt-1" :variant="isTeacher ? 'accent' : 'success'">
            {{ isTeacher ? 'Teacher' : 'Student' }}
          </BaseBadge>
        </div>
      </aside>

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-dark-700 dark:bg-dark-900/90">
          <div class="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
            <div class="flex min-w-0 items-center gap-2">
              <button
                type="button"
                class="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-lg lg:hidden dark:border-dark-700 dark:bg-dark-800"
                @click="mobileSidebarOpen = true"
              >
                ☰
              </button>
              <div class="min-w-0">
                <h1 class="truncate text-base font-semibold text-slate-900 dark:text-white">
                  {{ classroomStore.course?.title || 'Classroom' }}
                </h1>
                <p class="truncate text-xs text-slate-500 dark:text-dark-300">
                  {{ classroomStore.course?.teacherName || 'Course instructor' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <BaseBadge :variant="isTeacher ? 'accent' : 'success'">
                {{ isTeacher ? 'Teacher' : 'Student' }}
              </BaseBadge>
              <img
                v-if="classroomStore.course?.coverImage"
                :src="classroomStore.course.coverImage"
                alt="Course cover"
                class="h-10 w-16 rounded-lg border border-slate-200 object-cover dark:border-dark-700"
              >
            </div>
          </div>
        </header>

        <main class="min-h-0 flex-1 px-4 pb-24 pt-4 lg:px-6 lg:pb-6">
          <div v-if="classroomStore.loading" class="space-y-3">
            <UiSkeleton class="h-24 rounded-xl" variant="rectangular" />
            <UiSkeleton class="h-24 rounded-xl" variant="rectangular" />
            <UiSkeleton class="h-24 rounded-xl" variant="rectangular" />
          </div>
          <slot v-else />
        </main>
      </div>
    </div>

    <div v-if="mobileSidebarOpen" class="fixed inset-0 z-[90] lg:hidden">
      <button type="button" class="absolute inset-0 bg-black/50" @click="mobileSidebarOpen = false" />
      <aside class="absolute left-0 top-0 bottom-0 w-[84vw] max-w-[300px] bg-white px-4 py-5 shadow-xl dark:bg-dark-900">
        <div class="mb-5 flex items-center justify-between">
          <p class="text-sm font-semibold">Navigate</p>
          <button type="button" class="rounded-lg p-1" @click="mobileSidebarOpen = false">✕</button>
        </div>
        <nav class="space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="`mobile-${item.to}`"
            :to="item.to"
            class="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm"
            :class="isActive(item) ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'text-slate-600 dark:text-dark-300'"
            @click="mobileSidebarOpen = false"
          >
            <span class="flex items-center gap-3">
              <component :is="item.icon" class="w-5 h-5" />
              <span>{{ item.label }}</span>
            </span>
            <BaseBadge v-if="item.badge && item.badge > 0" size="sm" variant="danger">{{ item.badge }}</BaseBadge>
          </NuxtLink>
        </nav>
      </aside>
    </div>

    <nav class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden dark:border-dark-700 dark:bg-dark-900/95">
      <div class="grid grid-cols-5">
        <NuxtLink
          v-for="item in mobileTabs"
          :key="`tab-${item.to}`"
          :to="item.to"
          class="relative grid place-items-center gap-1 py-2 text-[10px]"
          :class="isActive(item) ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-dark-300'"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span>{{ item.label }}</span>
          <span
            v-if="item.badge && item.badge > 0"
            class="absolute right-5 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useClassroomStore } from '~/stores/classroom'
import { useChatStore } from '~/stores/chat'
import { useNoticeStore } from '~/stores/notice'
import { useExamStore } from '~/stores/exam'
import { useScheduleStore } from '~/stores/schedule'
import { useProgressStore } from '~/stores/progress'
import { useAssignmentStore } from '~/stores/assignment'
import { useMaterialStore } from '~/stores/material'
import { useUserStore } from '~/stores/user'

// Simple SVG Icon Components for Sidebar
const IconHome = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>' }
const IconChat = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>' }
const IconNotice = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>' }
const IconNotes = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>' }
const IconExams = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>' }
const IconSchedule = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v14a2 2 0 002 2z" /></svg>' }
const IconProgress = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>' }
const IconAssignments = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>' }

interface NavItem {
  label: string
  icon: any
  to: string
  badge?: number
}

const route = useRoute()
const userStore = useUserStore()
const classroomStore = useClassroomStore()
const chatStore = useChatStore()
const noticeStore = useNoticeStore()
const examStore = useExamStore()
const scheduleStore = useScheduleStore()
const progressStore = useProgressStore()
const assignmentStore = useAssignmentStore()
const materialStore = useMaterialStore()

const { unreadCount: chatUnread } = storeToRefs(chatStore)
const { unreadCount: noticeUnread } = storeToRefs(noticeStore)

const mobileSidebarOpen = ref(false)
const courseId = computed(() => String(route.params.courseId || ''))

const isTeacher = computed(() => classroomStore.userRole === 'teacher')

const navItems = computed<NavItem[]>(() => {
  const id = encodeURIComponent(courseId.value)

  return [
    { icon: IconHome, label: 'Overview', to: `/classroom/${id}` },
    { icon: IconChat, label: 'Messages', to: `/classroom/${id}/messages`, badge: chatUnread.value },
    { icon: IconNotice, label: 'Notices', to: `/classroom/${id}/notices`, badge: noticeUnread.value },
    { icon: IconNotes, label: 'Notes', to: `/classroom/${id}/notes` },
    { icon: IconExams, label: 'Exams', to: `/classroom/${id}/exams` },
    { icon: IconSchedule, label: 'Schedule', to: `/classroom/${id}/schedule` },
    { icon: IconProgress, label: 'Progress', to: `/classroom/${id}/progress` },
    { icon: IconAssignments, label: 'Assignments', to: `/classroom/${id}/assignments` },
  ]
})

const mobileTabs = computed<NavItem[]>(() => {
  const id = encodeURIComponent(courseId.value)
  return [
    { icon: IconHome, label: 'Home', to: `/classroom/${id}` },
    { icon: IconChat, label: 'Chat', to: `/classroom/${id}/messages`, badge: chatUnread.value },
    { icon: IconNotice, label: 'Notices', to: `/classroom/${id}/notices`, badge: noticeUnread.value },
    { icon: IconExams, label: 'Exams', to: `/classroom/${id}/exams` },
    { icon: IconAssignments, label: 'Tasks', to: `/classroom/${id}/assignments` },
  ]
})

const isActive = (item: NavItem) => route.path === item.to || route.path.startsWith(`${item.to}/`)

onMounted(async () => {
  if (!courseId.value) {
    await navigateTo('/courses')
    return
  }

  const ok = await classroomStore.initialize(courseId.value)
  if (!ok) {
    await navigateTo('/courses')
    return
  }

  const uid = String(userStore.user?.id || 'student-1')

  chatStore.ensureCourseSeed(courseId.value)
  noticeStore.ensureCourseSeed(courseId.value)
  examStore.ensureCourseSeed(courseId.value)
  scheduleStore.ensureCourseSeed(courseId.value)
  progressStore.ensureCourseSeed(courseId.value)
  assignmentStore.ensureCourseSeed(courseId.value)
  materialStore.ensureCourseSeed(courseId.value, uid)
})

watch(
  () => route.fullPath,
  () => {
    mobileSidebarOpen.value = false
  },
)
</script>

