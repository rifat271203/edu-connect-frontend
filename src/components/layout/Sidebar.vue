<template>
  <aside class="hidden md:flex flex-col w-72 fixed left-0 top-0 pt-20 h-screen dark:bg-[#09090b] bg-white border-r border-slate-200/80 dark:border-white/5 px-4 overflow-y-auto no-scrollbar">
    <div class="mt-6 space-y-8">
      <div v-for="(group, index) in menuGroups" :key="index">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] px-4 mb-3">{{ group.title }}</p>
        <nav class="space-y-1">
          <NuxtLink 
            v-for="item in group.items" 
            :key="item.path"
            :to="item.path" 
            :class="[
              'group flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
              isActive(item.path) 
                ? 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-white' 
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white'
            ]"
          >
            <div :class="[
              'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
              isActive(item.path) ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20' : 'bg-slate-100 text-slate-500 group-hover:bg-white dark:bg-white/5 dark:text-slate-400 dark:group-hover:bg-white/10 dark:group-hover:text-white'
            ]">
              <span class="material-symbols-rounded text-[18px]" :class="{ 'fill-1': isActive(item.path) }">{{ item.icon }}</span>
            </div>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
      </div>
    </div>

    <!-- Profile completion card (Placeholder from demo) -->
    <div class="mt-auto mb-8 p-4 dark:bg-white/5 bg-slate-50 rounded-2xl border border-slate-200 dark:border-white/5">
      <div class="flex justify-between items-center mb-2">
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Profile Strength</span>
        <span class="text-[10px] font-bold text-brand-primary">85%</span>
      </div>
      <div class="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
        <div class="h-full bg-brand-primary w-[85%]"></div>
      </div>
      <button @click="navigateTo('/settings')" class="w-full mt-4 py-2 text-[11px] font-bold dark:text-white text-slate-900 dark:hover:bg-white/10 hover:bg-white rounded-lg border border-slate-200 dark:border-white/10 transition-all shadow-sm">
        Complete Setup
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useUserStore } from '~/stores/user'

const route = useRoute()
const userStore = useUserStore()

const menuGroups = computed(() => {
  const role = userStore.user?.role
  const tuitionLabel = role === 'teacher' ? 'Find Student' : 'Find Tutor'
  
  return [
    {
      title: 'Discover',
      items: [
        { path: '/home', label: 'The Feed', icon: 'dynamic_feed' },
        { path: '/ai-tutor', label: 'AI Scholar', icon: 'robot_2' },
        { path: '/messages', label: 'Messages', icon: 'forum' },
      ]
    },
    {
      title: 'Academic Tools',
      items: [
        { path: '/courses', label: 'Research Library', icon: 'local_library' },
        { 
          path: '/tuition-connect', 
          label: tuitionLabel, 
          icon: 'connect_without_contact' 
        },
        { path: '/classroom', label: 'Classroom', icon: 'school' },
        { path: '/grades', label: 'Gradebook', icon: 'assignment_turned_in' },
      ]
    },
    {
      title: 'Personal',
      items: [
        { path: userStore.user ? `/profile/${userStore.user.id}` : '/profile', label: 'Profile', icon: 'person' },
        { path: '/settings', label: 'Settings', icon: 'settings' },
      ]
    }
  ]
})

const isActive = (path: string) => {
  if (path === '/home' && route.path === '/') return true
  // Match exact paths or precise sub-paths to avoid overlapping matches
  if (route.path === path) return true
  if (path !== '/home' && path !== '/profile' && route.path.startsWith(path + '/')) return true
  return false
}
</script>

<style scoped lang="scss">
.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.fill-1 {
  font-variation-settings: 'FILL' 1;
}
</style>
