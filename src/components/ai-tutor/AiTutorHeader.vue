<template>
  <header class="border-b border-dark-700/60 bg-dark-950/90 backdrop-blur-xl">
    <div class="px-4 lg:px-6 py-4 flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-accent/15 border border-accent/35 flex items-center justify-center">
        <svg class="w-6 h-6 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <div class="min-w-0">
        <h1 class="text-base sm:text-lg font-semibold text-dark-50">AI Tutor</h1>
        <p class="text-xs text-dark-400 truncate">Structured, reliable explanations for serious study</p>
      </div>

      <div class="ml-auto hidden md:flex items-center gap-2">
        <span class="px-2.5 py-1 rounded-full bg-dark-800/80 border border-dark-700/80 text-[11px] text-dark-300">
          {{ messageCount }} messages
        </span>
        <span class="px-2.5 py-1 rounded-full bg-dark-800/80 border border-dark-700/80 text-[11px] text-dark-300">
          {{ savedChatCount }} saved chats
        </span>
      </div>

      <button
        @click="emit('clear-chat')"
        class="p-2 text-dark-400 hover:text-accent-light hover:bg-dark-800 rounded-lg transition-colors"
        title="Clear Chat"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  (e: 'clear-chat'): void
}>()
</script>
