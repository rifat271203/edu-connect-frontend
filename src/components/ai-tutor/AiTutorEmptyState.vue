<template>
  <div class="flex-1 overflow-y-auto px-4 lg:px-6 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8 mb-6">
        <div class="w-11 h-11 rounded-xl bg-[var(--gold-dim)] border border-[var(--line-gold)] flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 class="text-[22px] font-bold tracking-[-0.02em] text-[var(--t1)] mb-2">Start your session</h2>
        <p class="text-[13.5px] text-[var(--t2)] leading-relaxed max-w-2xl">
          {{ description }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="prompt in prompts"
          :key="prompt.text"
          @click="emit('prompt', prompt.text)"
          class="text-left rounded-xl border border-[var(--line)] bg-[var(--surface2)] p-4 hover:border-[var(--line2)] hover:bg-[var(--surface3)] transition-all duration-150 group"
        >
          <div class="flex items-start gap-3">
            <span class="text-[var(--gold)] mt-0.5" v-html="prompt.icon" />
            <div class="min-w-0">
              <p class="text-[14px] font-semibold text-[var(--t1)] transition-colors">{{ prompt.text }}</p>
              <p class="text-[11px] text-[var(--t3)] mt-1 uppercase tracking-[0.08em] font-semibold">{{ prompt.tag }}</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuickPrompt } from '~/types/aiTutor'

defineProps<{
  prompts: QuickPrompt[]
  description: string
}>()

const emit = defineEmits<{
  (e: 'prompt', text: string): void
}>()
</script>
