<template>
  <div class="flex-1 flex items-center justify-center overflow-y-auto px-4 py-8 lg:px-10 lg:py-12 bg-white dark:bg-[#0f1115]">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="mb-6 text-center lg:mb-8">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl lg:h-14 lg:w-14 border border-brand-primary/30 bg-brand-primary/10 dark:border-brand-primary/40 dark:bg-brand-primary/20">
          <svg class="h-6 w-6 lg:h-7 lg:w-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 class="mb-2 text-base font-bold text-slate-900 lg:text-lg dark:text-white">Start your session</h2>
        <p class="text-xs leading-relaxed text-slate-500 lg:text-sm dark:text-slate-400">
          {{ description }}
        </p>
      </div>

      <!-- Quick Prompts Grid -->
      <div class="grid grid-cols-1 gap-2 lg:gap-3">
        <button
          v-for="prompt in prompts"
          :key="prompt.text"
          @click="emit('prompt', prompt.text)"
          class="group flex items-start gap-2 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-all duration-150 hover:bg-slate-100 hover:shadow-sm hover:border-brand-primary/30 lg:gap-3 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        >
          <span class="mt-0.5 flex-shrink-0 text-lg" v-html="prompt.icon" />
          <div class="min-w-0 flex-1">
            <p class="line-clamp-2 text-xs font-medium text-slate-700 lg:text-sm dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">{{ prompt.text }}</p>
            <p class="mt-1.5 font-mono text-[10px] uppercase tracking-[0.5px] text-slate-400 lg:text-xs dark:text-slate-500">{{ prompt.tag }}</p>
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
