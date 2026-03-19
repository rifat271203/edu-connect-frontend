<template>
  <aside class="sidebar fixed left-0 top-0 bottom-0 w-[220px] z-30 flex flex-col">
    <!-- Logo -->
    <div class="h-[60px] px-4 border-b border-[var(--line)] flex items-center">
      <NuxtLink to="/home" class="flex items-center gap-3 group">
        <div class="w-8 h-8 rounded-lg border border-[rgba(196,164,100,0.38)] bg-[var(--surface2)] text-[var(--gold)] flex items-center justify-center transition-all duration-150 group-hover:border-[var(--gold)]">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M4.5 6.5h7v4.5h-7zM12.5 8h7v4.5h-7zM7 13.5h7v4h-7z" />
          </svg>
        </div>
        <span class="logo-wordmark text-[30px] leading-none text-[var(--t1)]">EduConnect</span>
      </NuxtLink>
    </div>

    <!-- Search Users -->
    <div class="px-4 py-4 border-b border-[var(--line)]">
      <div class="space-y-2">
        <p class="section-label">Find users</p>
        <div class="space-y-2">
          <input
            v-model="searchQuery"
            type="text"
            class="ui-input !h-9"
            placeholder="Search users"
            @keydown.enter.prevent="runUserSearch"
          />

          <div class="flex items-center gap-2">
            <select
              v-model="searchRole"
              class="select-field flex-1 !h-9"
            >
              <option value="">All roles</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            <UiButton size="sm" variant="ghost" class="!h-9" :disabled="searchLoading || !searchQuery.trim()" @click="runUserSearch">
              {{ searchLoading ? '...' : 'Search' }}
            </UiButton>
          </div>
        </div>

        <p v-if="searchError" class="mt-2 text-xs text-[rgba(239,68,68,0.9)]">{{ searchError }}</p>

        <div v-if="searchedUsers.length" class="mt-2 space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            v-for="user in searchedUsers"
            :key="user.id"
            type="button"
            class="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl border border-transparent hover:border-[var(--line)] hover:bg-[var(--surface2)] transition-all text-left"
            @click="viewPublicProfile(user.id)"
          >
            <UiAvatar :src="user.avatar" :name="user.displayName" size="sm" />
            <div class="min-w-0 flex-1">
              <p class="text-xs text-[var(--t1)] truncate">{{ user.displayName }}</p>
              <p class="mono-label text-[11px] text-[var(--t3)] truncate">@{{ user.username }}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-hide">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'sidebar-item group',
          isActive(item.path)
            ? 'is-active -ml-[2px]'
            : ''
        ]"
        @click="$emit('navigate')"
        >
        <span v-html="item.icon" class="w-[18px] h-[18px]" />
        <span class="font-medium text-[13.5px] tracking-[0]">{{ item.label }}</span>
      </NuxtLink>
    </nav>
    
    <!-- User Section -->
    <div class="p-4 border-t border-[var(--line)] bg-[var(--ink2)]">
      <div class="flex items-center gap-3">
        <UiAvatar 
          :src="userStore.user?.avatar"
          :name="userStore.user?.name || 'User'"
          size="md"
          show-online
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-[var(--t1)] truncate">
            {{ userStore.user?.name || 'User' }}
          </p>
          <p class="mono-label text-[11px] text-[var(--t3)] truncate">
            @{{ userStore.user?.username || 'user' }}
          </p>
        </div>
        <button 
          class="btn-ghost !h-9 !w-9 !p-0"
          @click="handleLogout"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'
import { searchSocial } from '~/services/api/social'

defineEmits(['navigate'])

const route = useRoute()
const userStore = useUserStore()
const searchQuery = ref('')
const searchRole = ref<'' | 'teacher' | 'student'>('')
const searchLoading = ref(false)
const searchError = ref('')
const searchedUsers = ref<{ id: string; username: string; displayName: string; avatar: string }[]>([])

const homeIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>`
const classroomIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`
const profileIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>`
const messagesIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>`
const aiTutorIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
const settingsIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`

const navItems = [
  { path: '/home', label: 'Home', icon: homeIcon },
  { path: '/classroom', label: 'Classroom', icon: classroomIcon },
  { path: '/ai-tutor', label: 'AI Tutor', icon: aiTutorIcon },
  { path: '/profile', label: 'Profile', icon: profileIcon },
  { path: '/messages', label: 'Messages', icon: messagesIcon },
  { path: '/settings', label: 'Settings', icon: settingsIcon }
]

const isActive = (path: string) => {
  return route.path === path
}

const runUserSearch = async () => {
  const q = searchQuery.value.trim()
  if (!q || searchLoading.value) return

  searchError.value = ''
  searchLoading.value = true

  const result = await searchSocial({
    q,
    role: searchRole.value || undefined,
    limit: 20,
  })

  searchLoading.value = false

  if (!result.success || !result.data) {
    searchedUsers.value = []
    searchError.value = result.error || 'Failed to search users'
    return
  }

  searchedUsers.value = result.data.users
}

const viewPublicProfile = async (userId: string) => {
  await navigateTo(`/profile/${encodeURIComponent(userId)}`)
}

const handleLogout = () => {
  userStore.logout()
}
</script>
