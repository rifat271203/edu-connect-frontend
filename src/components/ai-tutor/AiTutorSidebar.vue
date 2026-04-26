<template>
  <aside class="hidden lg:flex w-[320px] shrink-0 flex-col border-l border-slate-200/50 bg-[#f8fafc] dark:border-white/5 dark:bg-[#0f1115]">
    <!-- Top Action Area -->
    <div class="px-6 pt-8 pb-6">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Sessions</h2>
          <p class="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-1">Your learning history</p>
        </div>
        <button
          @click="emit('new-chat')"
          class="group relative flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-[0_10px_20px_-5px_rgba(var(--brand-primary-rgb),0.3)] transition-all hover:scale-105 active:scale-95"
        >
          <div class="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <!-- Subject Switcher - Tab Style -->
      <div class="p-1.5 flex gap-1 rounded-[20px] bg-slate-200/50 dark:bg-white/5 backdrop-blur-sm border border-slate-200/50 dark:border-white/5">
        <button
          v-for="subject in subjects"
          :key="subject.value"
          @click="emit('set-category', subject.value)"
          class="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-[14px] transition-all duration-300"
          :class="[
            selectedCategory === subject.value
              ? 'bg-white text-brand-primary shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:bg-white/10 dark:text-white'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          ]"
        >
          <span class="text-sm">{{ getCategoryEmoji(subject.value) }}</span>
          <span class="text-[9px] font-black uppercase tracking-wider">{{ subject.label }}</span>
        </button>
      </div>
    </div>

    <!-- History List - Cards with elevation -->
    <div class="flex-1 overflow-y-auto px-4 thin-scrollbar">
      <div v-if="chatHistory.length > 0" class="space-y-3 py-2">
        <div v-for="(chat, index) in chatHistory" :key="index" class="group relative">
          <button
            @click="emit('load-chat', index)"
            class="w-full relative overflow-hidden flex flex-col gap-2 rounded-[24px] p-5 text-left transition-all duration-300 border"
            :class="[
              currentChatIndex === index 
                ? 'border-brand-primary/20 bg-white shadow-[0_15px_30px_-10px_rgba(var(--brand-primary-rgb),0.1)] dark:bg-white/5 dark:border-brand-primary/30' 
                : 'border-transparent bg-transparent hover:bg-white/60 dark:hover:bg-white/[0.03]'
            ]"
          >
            <!-- Category Indicator -->
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-2">
                 <div class="w-1.5 h-1.5 rounded-full" :style="{ background: getSubjectColor(chat.category) }"></div>
                 <span class="font-mono text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{{ chat.category || 'General' }}</span>
               </div>
               <span class="text-[10px] font-medium text-slate-400">{{ formatDate(chat.timestamp) }}</span>
            </div>
            
            <p class="line-clamp-2 text-[13px] font-bold leading-snug text-slate-800 dark:text-slate-100 group-hover:text-brand-primary transition-colors">
              {{ chat.title || 'Untitled Session' }}
            </p>
          </button>

          <!-- Discrete Action -->
          <button
            @click.stop="emit('delete-chat', index)"
            class="absolute right-4 top-4 hidden h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 transition-all hover:bg-red-500 hover:text-white group-hover:flex group-hover:opacity-100 dark:bg-red-950/30 dark:hover:bg-red-500 shadow-sm"
          >
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="chatHistory.length === 0" class="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div class="w-16 h-16 rounded-[24px] bg-slate-100 flex items-center justify-center mb-6 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
          <svg class="w-8 h-8 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-[11px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[2px]">Empty Repository</p>
      </div>
    </div>

    <!-- Clear Footer -->
    <div class="p-6">
      <button
        @click="emit('clear-all')"
        class="w-full flex items-center justify-center gap-2 py-4 rounded-[20px] text-[10px] font-bold uppercase tracking-[1.5px] text-slate-400 border border-slate-200/80 transition-all hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:border-white/5 dark:hover:bg-red-500/10"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        Purge History
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { ChatSession, TutorCategory } from '~/types/aiTutor'

defineProps<{
  chatHistory: ChatSession[]
  currentChatIndex: number
  selectedCategory: TutorCategory | null
  formatDate: (date: Date) => string
  getChatPreview: (chat: ChatSession) => string
}>()

const emit = defineEmits<{
  (e: 'clear-all'): void
  (e: 'new-chat'): void
  (e: 'load-chat', index: number): void
  (e: 'delete-chat', index: number): void
  (e: 'set-category', category: TutorCategory): void
}>()

interface Subject {
  value: TutorCategory
  label: string
}

const subjects: Subject[] = [
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'math', label: 'Math' }
]

const getSubjectIcon = (category: TutorCategory): string => {
  const icons: Record<TutorCategory, string> = {
    physics: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M12 5V2"></path><path d="M12 22v-3"></path><path d="M5 12H2"></path><path d="M22 12h-3"></path><path d="M18.36 18.36l-2.12-2.12"></path><path d="M5.64 5.64l-2.12-2.12"></path><path d="M18.36 5.64l-2.12 2.12"></path><path d="M5.64 18.36l-2.12 2.12"></path></svg>`,
    chemistry: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2"></path><path d="M8.5 2h8"></path><path d="M7 16h10"></path></svg>`,
    math: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 7V4H6l10 8-10 8h12v-3"></path></svg>`
  }
  return icons[category]
}

const getCategoryEmoji = (category: TutorCategory): string => {
  const emojis: Record<TutorCategory, string> = {
    physics: '⚛️',
    chemistry: '⚗️',
    math: '∑'
  }
  return emojis[category]
}

const getSubjectColor = (category: TutorCategory | undefined): string => {
  if (!category) return '#94a3b8'
  const colors: Record<TutorCategory, string> = {
    physics: '#2dd4bf',
    chemistry: '#d4a843',
    math: '#c4b5fd'
  }
  return colors[category]
}
</script>

<style scoped>
.thin-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.thin-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.thin-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
}
.dark .thin-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
}
</style>
