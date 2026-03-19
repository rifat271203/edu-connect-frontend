<template>
  <div class="bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md p-4 sm:p-5 text-dark-100 shadow-sm">
    <!-- SECTION 1: HEADER -->
    <div class="flex items-center justify-between gap-2 mb-3">
      <div class="flex flex-wrap gap-2">
        <span v-if="topic" class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300">{{ topic }}</span>
        <span v-if="method" class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300">{{ method }}</span>
        <span v-if="subject" class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300">{{ subject }}</span>
      </div>
    </div>
    <p class="italic text-dark-200">{{ message.content }}</p>

    <!-- SECTION 2: FINAL ANSWER -->
    <div v-if="finalAnswerToShow" class="rounded-xl border border-purple-200 bg-[#EEEDFE] p-3 sm:p-4 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-purple-600 mb-2">Final Answer</p>
      <p class="text-sm text-dark-200 whitespace-pre-wrap leading-relaxed font-mono">{{ finalAnswerToShow }}</p>
    </div>

    <!-- SECTION 3: SUMMARY -->
    <div v-if="summary" class="mb-3">
      <p class="text-[11px] uppercase tracking-wide text-gray-500 mb-2">Summary</p>
      <p class="text-sm text-dark-200 whitespace-pre-wrap leading-relaxed">
        {{ summary }}
      </p>
    </div>

    <!-- SECTION 4: STEPS -->
    <div class="mb-3">
      <div class="flex items-center justify-between mb-2">
        <p class="text-[11px] uppercase tracking-wide text-dark-400">working steps</p>
        <div class="flex items-center gap-2">
          <button @click="showSteps = !showSteps" class="rounded-lg border border-dark-600 bg-dark-800/70 px-3 py-1.5 text-xs text-dark-200 hover:bg-dark-700">
            {{ showSteps ? 'Hide all steps' : 'Show all steps' }}
          </button>
          <span class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300">{{ steps.length }}</span>
          <span class="text-xs text-dark-400">{{ showSteps ? '▲' : '▼' }}</span>
        </div>
      </div>
      <div v-if="showSteps" class="space-y-2.5">
        <div v-for="(step, stepIndex) in steps" :key="`math-step-${messageIndex}-${stepIndex}`" class="rounded-xl border border-dark-700/65 bg-dark-950/35 px-3 py-3">
          <div class="flex items-center gap-2 mb-2">
            <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/20 text-[11px] font-semibold text-accent-light px-1.5">
              {{ stepIndex + 1 }}
            </span>
            <p class="text-xs text-dark-300 font-semibold">{{ step.title || `Step ${stepIndex + 1}` }}</p>
          </div>
          <div v-if="step.work" class="text-dark-100 whitespace-pre-wrap">
            {{ step.work }}
          </div>
          <div v-if="step.result" class="mt-2 rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            Result: {{ step.result }}
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 5: KEY CONCEPTS -->
    <div v-if="keyPoints.length" class="mb-3">
      <p class="text-[11px] uppercase tracking-wide text-gray-500 mb-2">Key concepts</p>
      <div class="flex flex-wrap gap-2">
        <span v-for="point in keyPoints" :key="point" class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300">
          {{ point }}
        </span>
      </div>
    </div>

    <!-- SECTION 6: ACTION BUTTONS -->
    <div class="flex flex-wrap gap-2 mt-4">
      <button class="rounded-lg border border-purple-500 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-500 hover:bg-purple-500/20">
        Verify ↗
      </button>
      <button class="rounded-lg border border-purple-500 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-500 hover:bg-purple-500/20">
        Practice ↗
      </button>
      <button class="rounded-lg border border-purple-500 bg-purple-500/10 px-3 py-1.5 text-xs text-purple-500 hover:bg-purple-500/20">
        Help ↗
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Message } from '~/types/aiTutor'

const props = defineProps<{
  message: Message
  messageIndex: number
}>()

const showSteps = ref(false)

const topic = computed(() => props.message.richResponse?.topic || '')
const method = computed(() => props.message.richResponse?.method || '')
const subject = computed(() => props.message.subject || '')
const finalAnswerToShow = computed(() => {
  return props.message.mathSolution?.final_answer || props.message.mathSolution?.answer || ''
})
const summary = computed(() => {
  return props.message.richResponse?.main_answer?.text || ''
})
const steps = computed(() => props.message.mathSolution?.steps || [])
const keyPoints = computed(() => {
  const section = props.message.richResponse?.sections.find(sec => sec.type === 'bullet_points')
  return section?.items || []
})
</script>
