<template>
  <div class="bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md p-4 sm:p-5 text-dark-100 shadow-sm">
    <div class="flex items-center justify-between gap-2 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-accent-light">Math Solution</p>
      <span
        v-if="typeof message.mathSolution?.contextUsed === 'boolean'"
        class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300"
      >
        {{ message.mathSolution?.contextUsed ? 'Context used' : 'No context used' }}
      </span>
    </div>

    <div v-if="message.mathSolution?.answer" class="rounded-xl border border-dark-700/70 bg-dark-950/50 p-3 sm:p-4 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Answer</p>
      <p
        v-for="(line, index) in answerLines"
        :key="`math-answer-${messageIndex}-${index}`"
        class="text-sm text-dark-200 whitespace-pre-wrap leading-relaxed"
      >
        {{ line }}
      </p>
    </div>

    <div v-if="message.mathSolution?.steps?.length" class="mb-3">
      <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Steps</p>
      <ol class="space-y-2.5">
        <li
          v-for="(step, stepIndex) in message.mathSolution.steps"
          :key="`math-step-${messageIndex}-${stepIndex}`"
          class="rounded-xl border border-dark-700/65 bg-dark-950/35 px-3 py-3"
        >
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/20 text-[11px] font-semibold text-accent-light px-1.5">
              {{ stepIndex + 1 }}
            </span>
            <p class="text-xs text-dark-300 font-semibold">{{ step.title || `Step ${stepIndex + 1}` }}</p>
          </div>

          <MathBlock
            v-if="step.work"
            :content="step.work"
            :display-mode="true"
            class="text-dark-100"
            @click="emit('open-math-zoom', step.work)"
          />

          <div
            v-if="step.result"
            class="mt-2 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300"
          >
            Result: {{ step.result }}
          </div>
        </li>
      </ol>
    </div>

    <div v-if="message.mathSolution?.final_answer" class="rounded-xl border border-accent/25 bg-accent/5 p-3 sm:p-4 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-accent-light/90 mb-2">Final Answer</p>
      <MathBlock
        :content="message.mathSolution.final_answer"
        :display-mode="true"
        class="text-dark-100"
        @click="emit('open-math-zoom', message.mathSolution.final_answer)"
      />
    </div>

    <div
      v-if="message.mathSolution?.graph_hint"
      class="rounded-xl border border-dark-700/65 bg-dark-950/35 p-3"
    >
      <button
        type="button"
        class="rounded-lg border border-dark-600 bg-dark-800/70 px-3 py-1.5 text-xs text-dark-200 hover:bg-dark-700"
        @click="emit('view-graph', message.mathSolution.graph_hint)"
      >
        View graph
      </button>
      <p class="mt-2 text-xs text-dark-400">{{ message.mathSolution.graph_hint }}</p>
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

const answerLines = computed(() => {
  return (props.message.mathSolution?.answer || '')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
})
</script>
