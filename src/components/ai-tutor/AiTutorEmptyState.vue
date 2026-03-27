<template>
  <div class="flex-1 overflow-y-auto px-4 lg:px-10 py-8 lg:py-12 flex items-center justify-center" :style="{ background: 'var(--bg)' }">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <div class="text-center mb-6 lg:mb-8">
        <div class="w-12 lg:w-14 h-12 lg:h-14 rounded-xl flex items-center justify-center mx-auto mb-4" :style="{ background: 'var(--gold-dim)', border: '1px solid rgba(212,168,67,0.25)' }">
          <svg class="w-6 lg:w-7 h-6 lg:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: 'var(--gold)'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 class="text-base lg:text-lg font-bold mb-2" style="color: 'var(--text)', fontFamily: 'Syne'">Start your session</h2>
        <p class="text-xs lg:text-sm leading-relaxed" style="color: 'var(--text2)', fontFamily: 'DM Sans'">
          {{ description }}
        </p>
      </div>

      <!-- Quick Prompts Grid -->
      <div class="grid grid-cols-1 gap-2 lg:gap-3">
        <button
          v-for="prompt in prompts"
          :key="prompt.text"
          @click="emit('prompt', prompt.text)"
          class="text-left px-3 lg:px-4 py-3 rounded-[16px] border transition-all duration-150 group"
          :style="{ 
            background: 'var(--bg3)',
            borderColor: 'var(--line)',
            color: 'var(--text)'
          }"
        >
          <div class="flex items-start gap-2 lg:gap-3">
            <span class="text-lg mt-0.5 flex-shrink-0" v-html="prompt.icon" />
            <div class="min-w-0 flex-1">
              <p class="font-medium text-xs lg:text-sm line-clamp-2" style="color: 'var(--text)', fontFamily: 'DM Sans'">{{ prompt.text }}</p>
              <p class="text-[10px] lg:text-xs uppercase tracking-[0.5px] mt-1.5" style="color: 'var(--text3)', fontFamily: 'DM Mono'">{{ prompt.tag }}</p>
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
