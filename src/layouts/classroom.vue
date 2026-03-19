<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-dark-950 dark:text-dark-100">
    <div class="flex min-h-screen">
      <aside class="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 dark:border-dark-700 dark:bg-dark-900 lg:flex lg:flex-col">
        <NuxtLink to="/classroom" class="mb-6 flex items-center gap-2">
          <div class="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm">📘</div>
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
            <span class="flex items-center gap-2">
              <span>{{ item.icon }}</span>
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
            <span class="flex items-center gap-2">
              <span>{{ item.icon }}</span>
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
          class="relative grid place-items-center gap-0.5 py-2 text-[11px]"
          :class="isActive(item) ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-dark-300'"
        >
          <span class="text-base">{{ item.icon }}</span>
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

interface NavItem {
  label: string
  icon: string
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
    { icon: '🏠', label: 'Overview', to: `/classroom/${id}` },
    { icon: '💬', label: 'Messages', to: `/classroom/${id}/messages`, badge: chatUnread.value },
    { icon: '📢', label: 'Notices', to: `/classroom/${id}/notices`, badge: noticeUnread.value },
    { icon: '📝', label: 'Notes', to: `/classroom/${id}/notes` },
    { icon: '📋', label: 'Exams', to: `/classroom/${id}/exams` },
    { icon: '🗓️', label: 'Schedule', to: `/classroom/${id}/schedule` },
    { icon: '📊', label: 'Progress', to: `/classroom/${id}/progress` },
    { icon: '🎯', label: 'Assignments', to: `/classroom/${id}/assignments` },
  ]
})

const mobileTabs = computed<NavItem[]>(() => {
  const id = encodeURIComponent(courseId.value)
  return [
    { icon: '🏠', label: 'Home', to: `/classroom/${id}` },
    { icon: '💬', label: 'Chat', to: `/classroom/${id}/messages`, badge: chatUnread.value },
    { icon: '📢', label: 'Notices', to: `/classroom/${id}/notices`, badge: noticeUnread.value },
    { icon: '📋', label: 'Exams', to: `/classroom/${id}/exams` },
    { icon: '🎯', label: 'Tasks', to: `/classroom/${id}/assignments` },
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

