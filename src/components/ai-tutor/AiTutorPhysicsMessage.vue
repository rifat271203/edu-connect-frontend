<template>
  <div class="bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md p-4 sm:p-5 text-dark-100 shadow-sm">
    <div class="flex items-center justify-between gap-2 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-accent-light">Physics Solution</p>
      <span
        v-if="typeof message.physicsSolution?.contextUsed === 'boolean'"
        class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300"
      >
        {{ message.physicsSolution?.contextUsed ? 'Context used' : 'No context used' }}
      </span>
    </div>

    <blockquote
      v-if="message.physicsSolution?.law_or_principle"
      class="mb-3 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-200"
    >
      {{ message.physicsSolution.law_or_principle }}
    </blockquote>

    <div v-if="message.physicsSolution?.answer" class="rounded-xl border border-dark-700/70 bg-dark-950/50 p-3 sm:p-4 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Answer</p>
      <p class="text-sm text-dark-200 whitespace-pre-wrap leading-relaxed">{{ message.physicsSolution.answer }}</p>
    </div>

    <div v-if="message.physicsSolution?.given?.length" class="mb-3 rounded-xl border border-dark-700/65 bg-dark-950/35 overflow-hidden">
      <p class="text-[11px] uppercase tracking-wide text-dark-400 px-3 pt-3 mb-2">Given</p>
      <div class="overflow-x-auto">
        <table class="min-w-full text-xs">
          <thead>
            <tr class="border-y border-dark-700/70 text-dark-400">
              <th class="px-3 py-2 text-left">Symbol</th>
              <th class="px-3 py-2 text-left">Value</th>
              <th class="px-3 py-2 text-left">Unit</th>
              <th class="px-3 py-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, idx) in message.physicsSolution.given" :key="`given-${messageIndex}-${idx}`" class="border-b border-dark-700/40 text-dark-200">
              <td class="px-3 py-2">{{ item.symbol }}</td>
              <td class="px-3 py-2">{{ item.value }}</td>
              <td class="px-3 py-2">{{ item.unit }}</td>
              <td class="px-3 py-2">{{ item.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="message.physicsSolution?.formula" class="mb-3 rounded-xl border border-dark-700/65 bg-dark-950/35 p-3">
      <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Formula</p>
      <MathBlock
        :content="message.physicsSolution.formula"
        :display-mode="true"
        @click="emit('open-math-zoom', message.physicsSolution.formula)"
      />
    </div>

    <div v-if="message.physicsSolution?.steps?.length" class="mb-3">
      <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Steps</p>
      <ol class="space-y-2.5">
        <li
          v-for="(step, stepIndex) in message.physicsSolution.steps"
          :key="`physics-step-${messageIndex}-${stepIndex}`"
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

    <div v-if="message.physicsSolution?.final_answer" class="rounded-xl border border-accent/25 bg-accent/5 p-3 sm:p-4 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-accent-light/90 mb-2">Final Answer</p>
      <MathBlock
        :content="message.physicsSolution.final_answer"
        :display-mode="true"
        @click="emit('open-math-zoom', message.physicsSolution.final_answer)"
      />
    </div>

    <div
      v-if="message.physicsSolution?.diagram_hint"
      class="rounded-xl border border-sky-400/20 bg-sky-500/10 px-3 py-2 text-sm text-sky-200"
    >
      📌 {{ message.physicsSolution.diagram_hint }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/aiTutor'
import MathBlock from '~/components/math/MathBlock.vue'

defineProps<{
  message: Message
  messageIndex: number
}>()

const emit = defineEmits<{
  'open-math-zoom': [content: string]
}>()
</script>
