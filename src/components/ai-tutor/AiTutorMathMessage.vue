<template>
  <div class="space-y-4 max-w-2xl">
    <!-- Tag Row -->
    <div class="flex flex-wrap gap-1.5">
      <span class="px-2.5 py-1 rounded-full text-[11px] font-medium" :style="{ background: 'rgba(139,92,246,0.1)', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.2)', fontFamily: 'DM Mono' }">
        Math Solution
      </span>
      <span v-if="typeof message.mathSolution?.contextUsed === 'boolean'" class="px-2.5 py-1 rounded-full text-[11px] font-medium" :style="{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--line)', fontFamily: 'DM Mono' }">
        {{ message.mathSolution?.contextUsed ? 'Context used' : 'No context' }}
      </span>
    </div>

    <!-- Answer Section -->
    <div v-if="message.mathSolution?.answer" class="px-6 py-4 rounded-[20px] space-y-2" :style="{ background: 'var(--bg3)', border: '1px solid var(--line2)' }">
      <p class="text-[11px] uppercase tracking-[0.5px] font-medium" style="color: 'var(--text3)', fontFamily: 'DM Mono'">Answer</p>
      <p v-for="(line, index) in answerLines" :key="`math-answer-${messageIndex}-${index}`" class="text-sm leading-relaxed" style="color: 'var(--text2)', fontFamily: 'DM Sans'">
        {{ line }}
      </p>
    </div>

    <!-- Steps Section -->
    <div v-if="message.mathSolution?.steps?.length" class="space-y-2">
      <p class="text-[11px] uppercase tracking-[0.5px] font-medium" style="color: 'var(--text3)', fontFamily: 'DM Mono'">Step-by-step breakdown</p>
      
      <div
        v-for="(step, stepIndex) in message.mathSolution.steps"
        :key="`math-step-${messageIndex}-${stepIndex}`"
        class="rounded-[20px] border overflow-hidden transition-all duration-300"
        :style="{ 
          background: 'var(--bg3)',
          border: '1px solid var(--line)',
          borderColor: expandedStep === stepIndex ? 'rgba(212,168,67,0.25)' : 'var(--line)'
        }"
      >
        <!-- Step Header -->
        <button
          @click="expandedStep = expandedStep === stepIndex ? -1 : stepIndex"
          class="w-full px-5 py-4 flex items-center gap-3.5 user-select-none transition-colors hover:bg-[var(--line)]"
          :style="{ background: expandedStep === stepIndex ? 'rgba(212,168,67,0.06)' : 'transparent' }"
        >
          <!-- Step Number Badge -->
          <div class="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 text-sm font-medium" :style="{ 
            background: expandedStep === stepIndex ? 'rgba(212,168,67,0.2)' : 'var(--gold-dim)',
            color: expandedStep === stepIndex ? 'var(--gold2)' : 'var(--gold2)',
            border: '1px solid rgba(212,168,67,0.2)',
            fontFamily: 'DM Mono'
          }">
            {{ stepIndex + 1 }}
          </div>

          <!-- Title -->
          <div class="flex-1 text-left">
            <p class="font-semibold text-sm" style="color: 'var(--text)', fontFamily: 'Syne'">{{ step.title || `Step ${stepIndex + 1}` }}</p>
            <p v-if="!expandedStep" class="text-xs mt-0.5" style="color: 'var(--text3)', fontFamily: 'DM Mono'">Click to expand</p>
          </div>

          <!-- Chevron -->
          <svg class="w-5 h-5 transition-transform duration-300 flex-shrink-0" :style="{ color: expandedStep === stepIndex ? 'var(--gold2)' : 'var(--text3)', transform: `rotate(${expandedStep === stepIndex ? 180 : 0}deg)` }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        <!-- Step Body -->
        <div v-if="expandedStep === stepIndex" class="border-t px-5 py-4" :style="{ borderColor: 'var(--line)', color: 'var(--text2)', fontFamily: 'DM Sans' }">
          <MathBlock
            v-if="step.work"
            :content="step.work"
            :display-mode="true"
            class="text-sm cursor-pointer hover:opacity-80"
            @click="emit('open-math-zoom', step.work)"
          />

          <div v-if="step.result" class="mt-3 px-3 py-2 rounded-lg border" :style="{ background: 'rgba(45,212,191,0.1)', borderColor: 'rgba(45,212,191,0.2)', color: '#2dd4bf', fontSize: '13px', fontFamily: 'DM Mono' }">
            Result: {{ step.result }}
          </div>
        </div>
      </div>
    </div>

    <!-- Final Answer -->
    <div v-if="message.mathSolution?.final_answer" class="px-6 py-4 rounded-[20px] border" :style="{ background: 'var(--gold-dim)', borderColor: 'rgba(212,168,67,0.25)' }">
      <p class="text-[11px] uppercase tracking-[0.5px] font-medium mb-3" style="color: 'var(--gold2)', fontFamily: 'DM Mono'">Final Answer</p>
      <MathBlock
        :content="message.mathSolution.final_answer"
        :display-mode="true"
        class="text-sm cursor-pointer hover:opacity-80"
        style="color: var(--gold2); fontFamily: 'Syne'"
        @click="emit('open-math-zoom', message.mathSolution.final_answer)"
      />
    </div>

    <!-- Graph Hint -->
    <div v-if="message.mathSolution?.graph_hint" class="px-6 py-4 rounded-[20px] border" :style="{ background: 'var(--bg3)', borderColor: 'var(--line2)' }">
      <button
        @click="emit('view-graph', message.mathSolution.graph_hint)"
        class="px-3 py-1.5 text-xs rounded-lg border mb-2 transition-colors"
        :style="{ background: 'var(--bg2)', borderColor: 'var(--line)', color: 'var(--text2)', fontFamily: 'DM Sans' }"
      >
        View graph
      </button>
      <p class="text-xs" style="color: 'var(--text3)', fontFamily: 'DM Mono'">{{ message.mathSolution.graph_hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/aiTutor'
import MathBlock from '~/components/math/MathBlock.vue'

const props = defineProps<{
  message: Message
  messageIndex: number
}>()

const emit = defineEmits<{
  'open-math-zoom': [content: string]
  'view-graph': [hint: string]
}>()

const expandedStep = ref(-1)

const answerLines = computed(() => {
  return (props.message.mathSolution?.answer || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
})
</script>

<style scoped>
.user-select-none {
  user-select: none;
}
</style>
