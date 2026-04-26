<template>
  <div class="space-y-4 max-w-2xl">
    <!-- Tag Row -->
    <div class="flex flex-wrap gap-1.5">
      <span class="px-2.5 py-1 rounded-full text-[11px] font-medium font-mono bg-purple-100 text-purple-600 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800/50">
        Math Solution
      </span>
      <span v-if="typeof message.mathSolution?.contextUsed === 'boolean'" class="px-2.5 py-1 rounded-full text-[11px] font-medium font-mono bg-slate-100 text-slate-600 border border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10">
        {{ message.mathSolution?.contextUsed ? 'Context used' : 'No context' }}
      </span>
    </div>

    <!-- Answer Section -->
    <div v-if="message.mathSolution?.answer" class="px-6 py-4 rounded-[20px] space-y-2 bg-slate-50 border border-slate-200 dark:bg-white/5 dark:border-white/10">
      <p class="text-[11px] uppercase tracking-[0.5px] font-medium font-mono text-slate-500 dark:text-slate-400">Answer</p>
      <p v-for="(line, index) in answerLines" :key="`math-answer-${messageIndex}-${index}`" class="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {{ line }}
      </p>
    </div>

    <!-- Steps Section -->
    <div v-if="message.mathSolution?.steps?.length" class="space-y-2">
      <p class="text-[11px] uppercase tracking-[0.5px] font-medium font-mono text-slate-500 dark:text-slate-400">Step-by-step breakdown</p>
      
      <div
        v-for="(step, stepIndex) in message.mathSolution.steps"
        :key="`math-step-${messageIndex}-${stepIndex}`"
        class="rounded-[20px] border overflow-hidden transition-all duration-300 bg-slate-50 dark:bg-white/5"
        :class="expandedStep === stepIndex ? 'border-brand-primary/30 dark:border-brand-primary/40' : 'border-slate-200 dark:border-white/10'"
      >
        <!-- Step Header -->
        <button
          @click="expandedStep = expandedStep === stepIndex ? -1 : stepIndex"
          class="w-full px-5 py-4 flex items-center gap-3.5 select-none transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
          :class="{ 'bg-brand-primary/5 dark:bg-brand-primary/10': expandedStep === stepIndex }"
        >
          <!-- Step Number Badge -->
          <div class="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 text-sm font-medium font-mono"
            :class="[
              expandedStep === stepIndex
                ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20 dark:bg-brand-primary/20 dark:border-brand-primary/30'
            ]"
          >
            {{ stepIndex + 1 }}
          </div>

          <!-- Title -->
          <div class="flex-1 text-left">
            <p class="font-semibold text-sm text-slate-900 dark:text-white">{{ step.title || `Step ${stepIndex + 1}` }}</p>
            <p v-if="!expandedStep" class="text-xs mt-0.5 font-mono text-slate-500 dark:text-slate-400">Click to expand</p>
          </div>

          <!-- Chevron -->
          <svg class="w-5 h-5 transition-transform duration-300 flex-shrink-0"
               :class="[
                 expandedStep === stepIndex ? 'text-brand-primary rotate-180' : 'text-slate-400 dark:text-slate-500 rotate-0'
               ]"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>

        <!-- Step Body -->
        <div v-if="expandedStep === stepIndex" class="border-t border-slate-200 px-5 py-4 text-slate-700 dark:border-white/10 dark:text-slate-300">
          <MathBlock
            v-if="step.work"
            :content="step.work"
            :display-mode="true"
            class="text-sm cursor-pointer hover:opacity-80"
            @click="emit('open-math-zoom', step.work)"
          />

          <div v-if="step.result" class="mt-3 px-3 py-2 rounded-lg border bg-teal-50 border-teal-200 text-teal-700 text-[13px] font-mono dark:bg-teal-900/30 dark:border-teal-800/50 dark:text-teal-400">
            Result: {{ step.result }}
          </div>
        </div>
      </div>
    </div>

    <!-- Final Answer -->
    <div v-if="message.mathSolution?.final_answer" class="px-6 py-4 rounded-[20px] border border-brand-primary/30 bg-brand-primary/10 dark:border-brand-primary/40 dark:bg-brand-primary/20">
      <p class="text-[11px] uppercase tracking-[0.5px] font-medium mb-3 font-mono text-brand-primary">Final Answer</p>
      <MathBlock
        :content="message.mathSolution.final_answer"
        :display-mode="true"
        class="text-sm cursor-pointer hover:opacity-80 text-brand-primary font-semibold"
        @click="emit('open-math-zoom', message.mathSolution.final_answer)"
      />
    </div>

    <!-- Graph Hint -->
    <div v-if="message.mathSolution?.graph_hint" class="px-6 py-4 rounded-[20px] border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
      <button
        @click="emit('view-graph', message.mathSolution.graph_hint)"
        class="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 mb-2 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-[#0f1115] dark:text-slate-300 dark:hover:bg-white/5"
      >
        View graph
      </button>
      <p class="text-xs font-mono text-slate-500 dark:text-slate-400">{{ message.mathSolution.graph_hint }}</p>
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
