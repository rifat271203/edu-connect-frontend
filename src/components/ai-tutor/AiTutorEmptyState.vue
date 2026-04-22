<template>
  <div class="flex-1 flex items-center justify-center overflow-y-auto px-4 py-8 lg:px-10 lg:py-12 bg-white dark:bg-[#0b0f14]">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="mb-10 text-center lg:mb-12">
        <div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-primary/20 bg-brand-primary/5 shadow-[0_0_25px_-5px_rgba(var(--brand-primary-rgb),0.2)] dark:border-brand-primary/30 dark:bg-brand-primary/10">
          <svg class="h-8 w-8 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 class="mb-3 text-lg font-bold tracking-tight text-slate-900 lg:text-2xl dark:text-white">Start your session</h2>
        <p class="mx-auto max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {{ description }}
        </p>
      </div>

      <!-- Quick Prompts Grid with Glass Cards -->
      <div class="grid grid-cols-1 gap-3 lg:gap-4">
        <button
          v-for="prompt in prompts"
          :key="prompt.text"
          @click="emit('prompt', prompt.text)"
          class="group relative overflow-hidden flex items-start gap-4 rounded-[22px] border border-slate-200/60 bg-white/40 p-5 text-left transition-all duration-300 backdrop-blur-md hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-brand-primary/30 dark:border-white/5 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] dark:hover:border-white/10"
        >
          <!-- Subtle Gradient Hover -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-brand-primary/5 to-transparent pointer-events-none" />
          
          <span class="relative z-10 mt-0.5 flex-shrink-0 text-xl filter grayscale group-hover:grayscale-0 transition-all duration-300" v-html="prompt.icon" />
          <div class="relative z-10 min-w-0 flex-1">
            <p class="line-clamp-2 text-sm font-semibold text-slate-700 lg:text-[15px] dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-200 leading-snug">{{ prompt.text }}</p>
            <div class="mt-2.5 flex items-center gap-2">
              <span class="inline-flex h-1.5 w-1.5 rounded-full bg-brand-primary/40 group-hover:bg-brand-primary transition-colors" />
              <p class="font-mono text-[10px] uppercase tracking-[1px] font-bold text-slate-400 group-hover:text-brand-primary/70 transition-colors dark:text-slate-500">{{ prompt.tag }}</p>
            </div>
          </div>
          
          <!-- Chevron on Hover -->
          <div class="relative z-10 self-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
             <svg class="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
             </svg>
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
