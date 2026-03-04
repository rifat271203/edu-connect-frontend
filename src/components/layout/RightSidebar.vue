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
      
      <!-- Suggested Users -->
      <div>
        <h3 class="text-sm font-semibold text-[var(--text)] mb-3">Suggested for you</h3>
        
        <div class="widget-card p-2 space-y-1">
          <div 
            v-for="user in suggestedUsers" 
            :key="user.id"
            class="widget-row"
          >
            <UiAvatar 
              :src="user.avatar" 
              :name="user.name" 
              size="sm"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-[var(--text)] truncate">{{ user.name }}</p>
              <p class="text-xs text-[var(--text-3)]">{{ user.followers }} followers</p>
            </div>
            <UiButton size="sm" variant="ghost" class="!px-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </UiButton>
          </div>
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
import { useNotificationsStore } from '~/stores/notifications'

const notificationsStore = useNotificationsStore()
const { notifications: rawNotifications, pendingFriendRequests } = storeToRefs(notificationsStore)

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
    avatar: item.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=system',
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

onMounted(async () => {
  await notificationsStore.fetchNotifications()
})

const suggestedUsers = ref([
  {
    id: '1',
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    followers: 234
  },
  {
    id: '2',
    name: 'James Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    followers: 567
  },
  {
    id: '3',
    name: 'Sophie Kim',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie',
    followers: 891
  }
])
</script>
