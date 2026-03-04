<template>
  <div class="flex-1 overflow-y-auto px-4 lg:px-6 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-2xl border border-dark-700/70 bg-dark-900/55 p-6 sm:p-8 mb-6">
        <div class="w-11 h-11 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 class="text-xl font-semibold text-dark-50 mb-2">Start your session</h2>
        <p class="text-sm text-dark-300 leading-relaxed max-w-2xl">
          {{ description }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="prompt in prompts"
          :key="prompt.text"
          @click="emit('prompt', prompt.text)"
          class="text-left rounded-xl border border-dark-700/75 bg-dark-900/55 p-4 hover:border-accent/35 hover:bg-dark-900/80 transition-all duration-200 group"
        >
          <div class="flex items-start gap-3">
            <span class="text-accent-light mt-0.5" v-html="prompt.icon" />
            <div class="min-w-0">
              <p class="text-sm font-medium text-dark-100 group-hover:text-dark-50 transition-colors">{{ prompt.text }}</p>
              <p class="text-xs text-dark-400 mt-1">{{ prompt.tag }}</p>
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
