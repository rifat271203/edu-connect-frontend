<template>
  <header class="border-b border-slate-200 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#0f1115]/95">
    <div class="px-4 py-3.5 sm:py-4 lg:px-6 flex items-center gap-3">
      <button
        @click="emit('go-back')"
        class="md:hidden p-2 -ml-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white dark:hover:border-white/20"
        title="Go back"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl border border-brand-primary/30 bg-brand-primary/10 text-brand-primary dark:border-brand-primary/40 dark:bg-brand-primary/20">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M4.5 6.5h7v4.5h-7zM12.5 8h7v4.5h-7zM7 13.5h7v4h-7z" />
        </svg>
      </div>

      <div class="min-w-0">
        <h1 class="text-[22px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white">AI Tutor</h1>
        <p class="truncate text-[13px] text-slate-500 dark:text-slate-400">Structured, reliable explanations for serious study</p>
      </div>

      <div class="ml-auto hidden items-center gap-2 md:flex">
        <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {{ messageCount }} messages
        </span>
        <span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
          {{ savedChatCount }} saved chats
        </span>
      </div>

      <button
        @click="emit('clear-chat')"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
        title="Clear Chat"
      >
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  messageCount: number
  savedChatCount: number
}>()

const emit = defineEmits<{
  (e: 'go-back'): void
  (e: 'clear-chat'): void
}>()
</script>
