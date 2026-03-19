<template>
  <header class="border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--ink2)_92%,transparent)] backdrop-blur-xl">
    <div class="px-4 lg:px-6 py-3.5 sm:py-4 flex items-center gap-3">
      <button
        @click="emit('go-back')"
        class="md:hidden p-2 -ml-2 rounded-lg border border-[var(--line)] bg-[var(--surface2)] text-[var(--t2)] hover:text-[var(--gold2)] hover:border-[var(--line-gold)] transition-colors"
        title="Go back"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="hidden sm:flex w-10 h-10 rounded-xl border border-[var(--line-gold)] bg-[linear-gradient(135deg,#c4a464,#e8c882)] text-[#07090f] items-center justify-center">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7" d="M4.5 6.5h7v4.5h-7zM12.5 8h7v4.5h-7zM7 13.5h7v4h-7z" />
        </svg>
      </div>

      <div class="min-w-0">
        <h1 class="font-display text-3xl leading-7 text-[var(--t1)]">AI Tutor</h1>
        <p class="text-xs text-[var(--t2)] truncate">Structured, reliable explanations for serious study</p>
      </div>

      <div class="ml-auto hidden md:flex items-center gap-2">
        <span class="px-2.5 py-1 rounded-full bg-[var(--surface2)] border border-[var(--line)] text-[11px] mono-label text-[var(--t2)]">
          {{ messageCount }} messages
        </span>
        <span class="px-2.5 py-1 rounded-full bg-[var(--surface2)] border border-[var(--line)] text-[11px] mono-label text-[var(--t2)]">
          {{ savedChatCount }} saved chats
        </span>
      </div>

      <button
        @click="emit('clear-chat')"
        class="btn-ghost !h-9 !w-9 !p-0"
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
  (e: 'go-back'): void
  (e: 'clear-chat'): void
}>()
</script>
