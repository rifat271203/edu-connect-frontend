<template>
  <aside class="w-80 xl:w-88 shrink-0 border-l border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl">
    <div class="sticky top-0 h-screen overflow-y-auto scrollbar-hide p-4 space-y-6">
      <!-- Friend Requests -->
      <div v-if="friendRequests.length > 0">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-[var(--text)]">Friend Requests</h3>
          <button class="text-xs text-[var(--primary)] hover:opacity-80">See all</button>
        </div>
        
        <div class="space-y-2">
          <div 
            v-for="request in friendRequests" 
            :key="request.id"
            class="widget-card p-3 flex items-center gap-3"
          >
              <UiAvatar 
                :src="request.avatar" 
                :name="request.name" 
                size="md"
              />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-[var(--text)] truncate">{{ request.name }}</p>
                <p class="text-xs text-[var(--text-3)]">{{ request.subtitle }}</p>
              </div>
              <div class="flex gap-2">
                <UiButton size="sm" variant="primary" class="!px-3" @click="acceptFriendRequest(request.id)">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </UiButton>
                <UiButton size="sm" variant="ghost" class="!px-3" @click="rejectFriendRequest(request.id)">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </UiButton>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Notifications -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-[var(--text)]">Recent Activity</h3>
          <button class="text-xs text-[var(--primary)] hover:opacity-80" @click="notificationsStore.markAllAsRead">Mark all read</button>
        </div>
        
        <div class="widget-card p-2 space-y-1">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            role="button"
            tabindex="0"
            @click="handleNotificationClick(notification.id)"
            @keydown.enter="handleNotificationClick(notification.id)"
            @keydown.space.prevent="handleNotificationClick(notification.id)"
          >
            <UiAvatar 
              :src="notification.avatar" 
              :name="notification.name" 
              size="sm"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-[var(--text-2)]">
                <span class="font-medium text-[var(--text)]">{{ notification.name }}</span>
                {{ notification.action }}
              </p>
              <p class="text-xs text-[var(--text-3)]">{{ formatTimestamp(notification.time) }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Popular Courses -->
      <div>
        <div class="mb-3 flex items-center justify-between gap-2">
          <h3 class="text-sm font-semibold text-[var(--text)]">Popular Courses</h3>
          <button
            class="text-xs text-[var(--primary)] hover:opacity-80"
            :disabled="coursesLoading"
            @click="loadPopularCourses"
          >
            Refresh
          </button>
        </div>
        
        <div class="widget-card p-2 space-y-1">
          <div v-if="coursesLoading" class="space-y-2 p-2">
            <UiSkeleton v-for="idx in 3" :key="`popular-course-skeleton-${idx}`" variant="text" class="h-5 w-full" />
          </div>

          <p v-else-if="coursesError" class="px-2 py-3 text-xs text-red-400">{{ coursesError }}</p>

          <p v-else-if="popularCourses.length === 0" class="px-2 py-3 text-xs text-[var(--text-3)]">
            No active courses available.
          </p>

          <NuxtLink
            v-for="course in popularCourses"
            v-else
            :key="`popular-course-${course.id}`"
            to="/classroom"
            class="widget-row items-start"
          >
            <img
              v-if="course.coursePicUrl"
              :src="course.coursePicUrl"
              :alt="`${course.title} cover`"
              class="h-10 w-10 rounded-lg object-cover border border-[var(--border)]"
              loading="lazy"
            />
            <UiAvatar
              v-else
              :src="course.instructor.avatar"
              :name="course.title"
              size="sm"
            />

            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-[var(--text)] truncate">{{ course.title }}</p>
              <p class="text-xs text-[var(--text-3)] truncate">
                {{ course.code || 'No code' }} · {{ course.instructor.displayName }}
              </p>
              <p class="text-xs text-[var(--text-3)]">{{ course.memberCount }} members</p>
            </div>

            <UiBadge :variant="course.status === 'archived' ? 'warning' : 'accent'">
              {{ course.status }}
            </UiBadge>
          </NuxtLink>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="pt-4 border-t border-[var(--border)]">
        <p class="text-xs text-[var(--text-3)]">
          © 2024 EduConnect · Privacy · Terms
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getClassroomCourses, type ClassroomCourse } from '~/services/api/classroom'
import { useNotificationsStore } from '~/stores/notifications'

const notificationsStore = useNotificationsStore()
const { notifications: rawNotifications, pendingFriendRequests } = storeToRefs(notificationsStore)
const popularCourses = ref<ClassroomCourse[]>([])
const coursesLoading = ref(false)
const coursesError = ref('')

const formatTimestamp = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'Just now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`

  return new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const friendRequests = computed(() =>
  pendingFriendRequests.value.map((request) => ({
    id: request.id,
    name: request.fromUser.displayName,
    avatar: request.fromUser.avatar,
    subtitle: 'Incoming friend request',
  }))
)

const notifications = computed(() =>
  rawNotifications.value.map((item) => ({
    id: item.id,
    name: item.user?.displayName || 'System',
    avatar: item.user?.avatar || '',
    action: item.message,
    time: item.timestamp,
    read: item.read,
  }))
)

const acceptFriendRequest = async (requestId: string) => {
  await notificationsStore.acceptFriendRequest(requestId)
}

const rejectFriendRequest = async (requestId: string) => {
  await notificationsStore.rejectFriendRequest(requestId)
}

const handleNotificationClick = async (notificationId: string) => {
  await notificationsStore.markAsRead(notificationId)
}

const loadPopularCourses = async () => {
  coursesLoading.value = true
  coursesError.value = ''

  const result = await getClassroomCourses({
    page: 1,
    limit: 20,
    status: 'active',
    sortBy: 'created_at',
    sortOrder: 'desc',
  })

  coursesLoading.value = false

  if (!result.success || !result.data) {
    popularCourses.value = []
    coursesError.value = result.error || 'Failed to load popular courses'
    return
  }

  popularCourses.value = [...result.data]
    .sort((a, b) => {
      if (b.memberCount !== a.memberCount) {
        return b.memberCount - a.memberCount
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 5)
}

onMounted(async () => {
  await Promise.all([
    notificationsStore.fetchNotifications(),
    loadPopularCourses(),
  ])
})
</script>
