<template>
  <header class="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/5 bg-white/60 px-6 py-3 backdrop-blur-xl dark:bg-black/40">
    <div class="flex items-center gap-12">
      <NuxtLink to="/home" class="flex items-center gap-2.5">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-primary shadow-lg shadow-brand-primary/20">
          <span class="material-symbols-rounded text-xl font-bold text-white">school</span>
        </div>
        <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">EduConnect <span class="font-medium text-brand-primary">BD</span></span>
      </NuxtLink>

      <div class="group hidden w-[400px] items-center rounded-xl border border-transparent bg-slate-100 px-4 py-2 transition-all focus-within:border-brand-primary/40 focus-within:bg-white dark:bg-white/5 dark:focus-within:bg-black md:flex">
        <span class="material-symbols-rounded mr-2 text-lg text-slate-400">search</span>
        <input
          v-model="searchQuery"
          class="w-full border-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:ring-0 dark:text-white"
          placeholder="Search for research, peers, or courses..."
          type="text"
          @keydown.enter="handleSearch"
        />
      </div>
    </div>

    <div class="flex items-center gap-3">
      <button @click="toggleTheme" class="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-slate-600 transition-all hover:bg-slate-100 dark:border-white/5 dark:text-slate-400 dark:hover:bg-white/5">
        <span class="material-symbols-rounded">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
      </button>

      <div class="mx-2 h-6 w-[1px] bg-slate-200 dark:bg-white/10"></div>

      <div ref="notificationPopoverRef" class="relative">
        <button
          type="button"
          class="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all hover:bg-slate-100 hover:text-brand-primary dark:hover:bg-white/5"
          :aria-expanded="showNotificationsPanel"
          aria-haspopup="dialog"
          @click.stop="toggleNotificationsPanel"
        >
          <span class="material-symbols-rounded">notifications</span>
          <span v-if="unreadCount > 0" class="absolute right-2.5 top-2.5 min-h-4 min-w-4 rounded-full border-2 border-white bg-brand-primary px-1 text-[9px] font-black leading-3 text-white dark:border-black">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>

        <transition name="fade-pop">
          <div
            v-if="showNotificationsPanel"
            class="absolute right-0 top-[calc(100%+0.5rem)] z-[60] w-[24rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-[0_24px_80px_rgba(15,23,42,0.18)] dark:border-white/10 dark:bg-[#0f1115]/95 dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
            @click.stop
          >
            <div class="flex items-center justify-between border-b border-slate-200/70 p-4 dark:border-white/5">
              <div>
                <h3 class="text-[13px] font-bold tracking-tight text-slate-900 dark:text-white">Recent Notifications</h3>
                <p v-if="unreadCount > 0" class="mt-0.5 text-[11px] font-medium text-slate-500">You have {{ unreadCount }} unread messages</p>
                <p v-else class="mt-0.5 text-[11px] font-medium text-slate-500">You're all caught up</p>
              </div>
              <button
                v-if="notifications.length"
                type="button"
                class="rounded-lg px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-brand-primary transition-colors hover:bg-brand-primary/10"
                @click="handleMarkAllRead"
              >
                Mark all read
              </button>
            </div>

            <div class="max-h-[24rem] overflow-y-auto no-scrollbar">
              <!-- Pending Friend Requests -->
              <div v-if="pendingFriendRequests.length" class="border-b border-slate-200/70 bg-slate-50/30 p-4 dark:border-white/5 dark:bg-white/[0.01]">
                <div class="flex items-center justify-between mb-3">
                  <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Add Bro Requests</h4>
                  <span class="flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">{{ pendingFriendRequests.length }}</span>
                </div>
                <div class="space-y-3">
                  <div v-for="request in pendingFriendRequests" :key="request.id" class="flex items-center gap-3">
                    <NuxtLink :to="`/profile/${request.fromUser.id}`" @click="closeNotificationsPanel">
                      <div class="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-white/5 dark:bg-white/10 hover:border-brand-primary/50 transition-colors">
                        <img v-if="request.fromUser.avatar" :src="request.fromUser.avatar" class="h-full w-full object-cover" />
                        <span v-else class="material-symbols-rounded flex h-full items-center justify-center text-slate-400">person</span>
                      </div>
                    </NuxtLink>
                    <div class="min-w-0 flex-1">
                      <NuxtLink :to="`/profile/${request.fromUser.id}`" @click="closeNotificationsPanel" class="hover:text-brand-primary transition-colors">
                        <p class="truncate text-xs font-bold text-slate-900 dark:text-white">{{ request.fromUser.displayName }}</p>
                      </NuxtLink>
                      <p class="text-[10px] text-slate-500">Sent you a bro request</p>
                    </div>
                    <div class="flex gap-2">
                      <button 
                        @click="notificationsStore.acceptFriendRequest(request.id)"
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white transition-all hover:bg-brand-primary/90 shadow-sm"
                        title="Accept"
                      >
                        <span class="material-symbols-rounded text-sm">check</span>
                      </button>
                      <button 
                        @click="notificationsStore.rejectFriendRequest(request.id)"
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-slate-600 transition-all hover:bg-slate-300 dark:bg-white/10 dark:text-slate-400 dark:hover:bg-white/20 shadow-sm"
                        title="Reject"
                      >
                        <span class="material-symbols-rounded text-sm">close</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Main Notifications List -->
              <div class="p-2">
                <!-- Skeleton Loading -->
                <div v-if="loading && !notifications.length" class="space-y-2 p-2">
                  <div v-for="index in 4" :key="index" class="flex animate-pulse items-start gap-3 rounded-2xl p-3">
                    <div class="h-11 w-11 rounded-2xl bg-slate-200 dark:bg-white/10"></div>
                    <div class="min-w-0 flex-1 space-y-2 pt-1">
                      <div class="h-3 w-3/4 rounded-full bg-slate-200 dark:bg-white/10"></div>
                      <div class="h-2.5 w-full rounded-full bg-slate-200 dark:bg-white/10"></div>
                      <div class="h-2.5 w-1/2 rounded-full bg-slate-200 dark:bg-white/10"></div>
                    </div>
                  </div>
                </div>

                <!-- Actual Notifications -->
                <div v-else-if="notifications.length" class="space-y-2">
                  <button
                    v-for="notification in visibleNotifications"
                    :key="notification.id"
                    type="button"
                    :class="[
                      'relative flex items-start gap-4 w-full rounded-2xl p-3 text-left transition-all cursor-pointer group hover:bg-slate-50 dark:hover:bg-white/5',
                      { 'bg-slate-50/50 dark:bg-white/[0.02]': !notification.read }
                    ]"
                    @click="handleNotificationClick(notification)"
                  >
                    <div class="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-white/5 dark:bg-white/10">
                      <img
                        v-if="notification.user?.avatar"
                        :src="notification.user.avatar"
                        :alt="notification.user.displayName"
                        class="h-full w-full object-cover"
                      />
                      <span v-else class="material-symbols-rounded text-[18px] text-slate-600 dark:text-slate-300">
                        {{ getNotificationIcon(notification.type) }}
                      </span>
                      <span
                        v-if="!notification.read"
                        class="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-primary shadow-[0_0_0_3px_rgba(255,255,255,0.75)] dark:shadow-[0_0_0_3px_rgba(9,9,11,0.9)]"
                      />
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          <p class="truncate text-xs font-bold text-slate-900 dark:text-white">{{ notification.message }}</p>
                          <p v-if="notification.content" class="mt-1 line-clamp-2 text-[10px] font-medium text-slate-500">{{ notification.content }}</p>
                        </div>
                        <span class="shrink-0 text-[10px] font-medium text-slate-400">{{ formatNotificationTime(notification.timestamp) }}</span>
                      </div>

                      <p v-if="notification.user?.displayName" class="mt-2 truncate text-[10px] font-medium text-slate-500">{{ notification.user.displayName }}</p>
                    </div>
                  </button>
                </div>

                <!-- Empty State -->
                <div v-else class="m-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center dark:border-white/10 dark:bg-white/5">
                  <p class="text-sm font-semibold text-slate-900 dark:text-white">No notifications yet</p>
                  <p class="mt-1 text-xs text-slate-500">New activity will appear here when someone interacts with your posts.</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="flex items-center gap-3 ml-2 pl-3 border-l border-slate-200 dark:border-white/10">
        <div class="hidden text-right sm:block">
          <p class="max-w-[120px] truncate text-xs font-bold text-slate-900 dark:text-white">{{ userStore.user?.name || 'User' }}</p>
          <p class="text-[10px] font-medium text-brand-primary">{{ userStore.user?.role === 'teacher' ? 'Mentor' : 'Scholar' }}</p>
        </div>
        <NuxtLink :to="`/profile/${userStore.user?.id}`">
          <UiAvatar
            :src="userStore.user?.avatar"
            :name="userStore.user?.name"
            size="md"
            class="rounded-xl"
          />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '~/stores/notifications'
import { useUserStore } from '~/stores/user'

const userStore = useUserStore()
const notificationsStore = useNotificationsStore()
const { notifications, loading, unreadCount, pendingFriendRequests } = storeToRefs(notificationsStore)
const { resolvedTheme, toggleTheme } = useTheme()

const searchQuery = ref('')
const showNotificationsPanel = ref(false)
const notificationPopoverRef = ref<HTMLElement | null>(null)
const visibleNotifications = computed(() => notifications.value.slice(0, 5))
const isDark = computed(() => resolvedTheme.value === 'dark')

const getNotificationIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    friend_request: 'person_add',
    friend_accepted: 'group_add',
    like: 'favorite',
    comment: 'chat_bubble',
    share: 'share',
    mention: 'alternate_email',
    follow: 'person',
    system: 'notifications',
  }

  return iconMap[type] || 'notifications'
}

const formatNotificationTime = (timestamp: string) => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return ''

  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000)
  const absolute = Math.abs(diffInSeconds)

  if (absolute < 60) return 'Just now'

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ]

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  for (const [unit, seconds] of units) {
    if (absolute >= seconds) {
      return formatter.format(Math.round(diffInSeconds / seconds), unit)
    }
  }

  return 'Just now'
}

const closeNotificationsPanel = () => {
  showNotificationsPanel.value = false
}

const toggleNotificationsPanel = async () => {
  showNotificationsPanel.value = !showNotificationsPanel.value
  if (showNotificationsPanel.value && !notifications.value.length && !loading.value) {
    await notificationsStore.fetchNotifications()
  }
}

const handleNotificationClick = async (notification: (typeof notifications.value)[number]) => {
  if (!notification.read) {
    await notificationsStore.markAsRead(notification.id)
  }

  closeNotificationsPanel()

  if (!notification.actionUrl) return

  if (/^https?:\/\//i.test(notification.actionUrl)) {
    window.open(notification.actionUrl, '_blank', 'noopener,noreferrer')
    return
  }

  await navigateTo(notification.actionUrl)
}

const handleMarkAllRead = async () => {
  await notificationsStore.markAllAsRead()
}

const handleSearch = () => {
  if (!searchQuery.value.trim()) return
  navigateTo(`/home?q=${encodeURIComponent(searchQuery.value.trim())}`)
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!showNotificationsPanel.value) return
  const target = event.target as Node
  if (notificationPopoverRef.value?.contains(target)) return
  closeNotificationsPanel()
}

onMounted(() => {
  if (!notifications.value.length) {
    notificationsStore.fetchNotifications()
  }

  document.addEventListener('click', handleDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<style scoped>
.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.fade-pop-enter-active,
.fade-pop-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.fade-pop-enter-from,
.fade-pop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
