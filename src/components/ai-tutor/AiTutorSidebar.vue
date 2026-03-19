<template>
  <aside class="w-[280px] shrink-0 border-l border-[var(--line)] bg-[var(--ink2)] hidden xl:block">
    <div class="sticky top-0 h-screen overflow-y-auto scrollbar-hide p-4">
      <div class="rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="section-label">Chat History</h3>
          <button
            @click="emit('clear-all')"
            class="btn-ghost !h-8 !w-8 !p-0 text-[var(--t3)] hover:!text-[rgba(239,68,68,0.9)]"
            title="Clear all chats"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <button
          @click="emit('new-chat')"
          class="w-full h-10 px-4 bg-[linear-gradient(135deg,#c4a464,#e8c882)] text-[#07090f] rounded-[10px] text-sm font-semibold hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>

        <div class="space-y-2 mt-4">
          <div
            v-for="(chat, index) in chatHistory"
            :key="index"
            class="group p-3 rounded-xl cursor-pointer transition-all duration-200 border"
            :class="currentChatIndex === index ? 'bg-[var(--gold-dim)] border-[var(--line-gold)]' : 'bg-[var(--surface2)] border-[var(--line)] hover:border-[var(--line-gold)] hover:bg-[var(--surface3)]'"
            @click="emit('load-chat', index)"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-[var(--t1)] truncate">{{ chat.title || 'New Chat' }}</p>
                <p class="mono-label text-[11px] text-[var(--t3)] mt-1 line-clamp-2">{{ getChatPreview(chat) }}</p>
                <p class="mono-label text-[10px] text-[var(--t3)] mt-1.5">{{ chat.messages.length }} messages • {{ formatDate(chat.timestamp) }}</p>
              </div>
              <button
                @click.stop="emit('delete-chat', index)"
                class="opacity-0 group-hover:opacity-100 p-1 rounded text-[var(--t3)] hover:text-[rgba(239,68,68,0.9)] hover:bg-[var(--surface3)] transition-all"
                title="Delete chat"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="chatHistory.length === 0" class="text-center py-10">
          <svg class="w-10 h-10 mx-auto text-[var(--t3)] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-xs text-[var(--t2)]">No saved chats yet</p>
          <p class="mono-label text-[11px] text-[var(--t3)] mt-1">Your conversations will appear here.</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { ChatSession } from '~/types/aiTutor'

defineProps<{
  chatHistory: ChatSession[]
  currentChatIndex: number
  formatDate: (date: Date) => string
  getChatPreview: (chat: ChatSession) => string
}>()

const emit = defineEmits<{
  (e: 'clear-all'): void
  (e: 'new-chat'): void
  (e: 'load-chat', index: number): void
  (e: 'delete-chat', index: number): void
}>()
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
