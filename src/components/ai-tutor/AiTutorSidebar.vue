<template>
  <aside class="hidden lg:flex w-64 shrink-0 border-r flex-col" :style="{ background: 'var(--bg2)', borderColor: 'var(--line)' }">
    <!-- Header -->
    <div class="px-5 py-6 border-b flex-shrink-0" :style="{ borderColor: 'var(--line)' }">
      <h2 class="text-base font-bold text-white mb-4" style="fontFamily: 'Syne, sans-serif'">AI Tutor</h2>
      
      <!-- New Session Button -->
      <button
        @click="emit('new-chat')"
        class="w-full px-3 py-2.5 rounded-[10px] text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150"
        :style="{ 
          background: 'var(--gold-dim)',
          border: '1px solid rgba(212,168,67,0.25)',
          color: 'var(--gold2)',
          fontFamily: 'DM Sans'
        }"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New session
      </button>

      <!-- Subject Filter Pills -->
      <div class="flex flex-wrap gap-1.5 mt-4">
        <button
          v-for="subject in subjects"
          :key="subject.value"
          @click="emit('set-category', subject.value)"
          class="px-3 py-1 rounded-full text-[11px] uppercase font-medium border transition-all duration-150"
          :style="{
            background: selectedCategory === subject.value ? subject.activeColor : subject.bgColor,
            color: selectedCategory === subject.value ? subject.textColor : subject.textColor,
            borderColor: selectedCategory === subject.value ? subject.borderColor : subject.borderColor,
            filter: selectedCategory === subject.value ? 'brightness(1.3)' : 'brightness(1)',
            transform: selectedCategory === subject.value ? 'translateY(-1px)' : 'translateY(0)',
            boxShadow: selectedCategory === subject.value ? `0 0 12px ${subject.textColor}` : 'none',
            letterSpacing: '0.5px',
            fontFamily: 'DM Mono'
          }"
        >
          {{ subject.label }}
        </button>
      </div>
    </div>

    <!-- History List -->
    <div class="flex-1 overflow-y-auto px-3 py-2 space-y-1 thin-scrollbar" style="scrollbarWidth: 'thin'">
      <!-- Group Label -->
      <div v-if="chatHistory.length > 0" class="px-2 py-3 text-[10px] uppercase font-medium tracking-[1px]" style="color: 'var(--text3)', fontFamily: 'DM Mono'">
        Recent
      </div>

      <!-- History Items -->
      <div v-for="(chat, index) in chatHistory" :key="index" class="group">
        <button
          @click="emit('load-chat', index)"
          class="w-full text-left px-2.5 py-2.5 rounded-[10px] transition-all duration-150 border"
          :style="{
            background: currentChatIndex === index ? 'var(--bg4)' : 'transparent',
            borderColor: currentChatIndex === index ? 'var(--line2)' : 'transparent',
            hover: 'all 0.15s'
          }"
        >
          <p class="text-sm font-medium truncate" style="color: 'var(--text)', fontFamily: 'DM Sans'">{{ chat.title || 'New Chat' }}</p>
          <div class="flex items-center gap-1.5 mt-1">
            <div class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: getSubjectColor(chat.category) }"></div>
            <p class="text-[11px] truncate" style="color: 'var(--text3)', fontFamily: 'DM Mono'">{{ chat.category }} · {{ formatDate(chat.timestamp) }}</p>
          </div>
        </button>

        <!-- Delete Button -->
        <button
          @click.stop="emit('delete-chat', index)"
          class="opacity-0 group-hover:opacity-100 absolute right-3 top-2 p-1 rounded transition-opacity"
          :style="{ color: 'var(--text3)' }"
          title="Delete chat"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="chatHistory.length === 0" class="text-center py-8 px-2">
        <p class="text-xs font-medium" style="color: 'var(--text2)', fontFamily: 'DM Sans'">No history yet</p>
        <p class="text-[11px] mt-1" style="color: 'var(--text3)', fontFamily: 'DM Mono'">Start a new session to begin</p>
      </div>
    </div>

    <!-- Footer Button -->
    <div class="px-3 py-4 border-t flex-shrink-0" :style="{ borderColor: 'var(--line)' }">
      <button
        @click="emit('clear-all')"
        class="w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors"
        :style="{ 
          background: 'rgba(255,255,255,0.05)',
          color: 'var(--text3)',
          border: '1px solid var(--line)',
          fontFamily: 'DM Sans'
        }"
      >
        Clear all
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
  bgColor: string
  activeColor: string
  textColor: string
  borderColor: string
}

const subjects: Subject[] = [
  {
    value: 'physics',
    label: 'Physics',
    bgColor: 'rgba(45,212,191,0.1)',
    activeColor: 'rgba(45,212,191,0.25)',
    textColor: '#2dd4bf',
    borderColor: 'rgba(45,212,191,0.2)'
  },
  {
    value: 'chemistry',
    label: 'Chemistry',
    bgColor: 'rgba(212,168,67,0.12)',
    activeColor: 'rgba(212,168,67,0.25)',
    textColor: '#f0c46a',
    borderColor: 'rgba(212,168,67,0.25)'
  },
  {
    value: 'math',
    label: 'Math',
    bgColor: 'rgba(139,92,246,0.1)',
    activeColor: 'rgba(139,92,246,0.2)',
    textColor: '#c4b5fd',
    borderColor: 'rgba(139,92,246,0.2)'
  }
]

const getSubjectColor = (category: TutorCategory | undefined): string => {
  if (!category) return 'var(--text3)'
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.thin-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
