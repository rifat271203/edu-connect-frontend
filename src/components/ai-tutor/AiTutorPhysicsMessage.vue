<template>
  <div class="space-y-4 max-w-2xl">
    <!-- Tag Row -->
    <div class="flex flex-wrap gap-1.5">
      <span class="px-2.5 py-1 rounded-full text-[11px] font-medium font-mono border border-teal-200 bg-teal-100 text-teal-600 dark:border-teal-800/50 dark:bg-teal-900/30 dark:text-teal-400">
        Physics Solution
      </span>
      <span v-if="typeof message.physicsSolution?.contextUsed === 'boolean'" class="px-2.5 py-1 rounded-full text-[11px] font-medium font-mono border border-slate-200 bg-slate-100 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
        {{ message.physicsSolution?.contextUsed ? 'Context used' : 'No context' }}
      </span>
    </div>

    <!-- Law or Principle -->
    <blockquote v-if="message.physicsSolution?.law_or_principle" class="px-6 py-4 rounded-[20px] border-l-4 border-teal-400 bg-teal-50 text-teal-700 italic text-sm dark:bg-teal-900/20 dark:text-teal-400">
      {{ message.physicsSolution.law_or_principle }}
    </blockquote>

    <!-- Answer Section -->
    <div v-if="message.physicsSolution?.answer" class="px-6 py-4 rounded-[20px] border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
      <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{{ message.physicsSolution.answer }}</p>
    </div>

    <!-- Given Values Table -->
    <div v-if="message.physicsSolution?.given?.length" class="overflow-x-auto rounded-[20px] border border-slate-200 dark:border-white/10 dark:bg-white/5">
      <table class="w-full text-sm font-mono">
        <thead class="bg-slate-100 dark:bg-white/5">
          <tr class="border-b border-slate-200 dark:border-white/10">
            <th class="px-4 py-2 text-left text-xs uppercase tracking-[0.5px] text-slate-500 dark:text-slate-400">Symbol</th>
            <th class="px-4 py-2 text-left text-xs uppercase tracking-[0.5px] text-slate-500 dark:text-slate-400">Value</th>
            <th class="px-4 py-2 text-left text-xs uppercase tracking-[0.5px] text-slate-500 dark:text-slate-400">Unit</th>
            <th class="px-4 py-2 text-left text-xs uppercase tracking-[0.5px] text-slate-500 dark:text-slate-400">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in message.physicsSolution.given" :key="`given-${messageIndex}-${idx}`" class="border-b border-slate-100 text-slate-700 last:border-0 dark:border-white/5 dark:text-slate-300">
            <td class="px-4 py-2">{{ item.symbol }}</td>
            <td class="px-4 py-2">{{ item.value }}</td>
            <td class="px-4 py-2">{{ item.unit }}</td>
            <td class="px-4 py-2">{{ item.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formula -->
    <div v-if="message.physicsSolution?.formula" class="px-6 py-4 rounded-[20px] border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5">
      <p class="mb-3 text-[11px] font-medium uppercase tracking-[0.5px] font-mono text-slate-500 dark:text-slate-400">Formula</p>
      <MathBlock
        :content="message.physicsSolution.formula"
        :display-mode="true"
        class="cursor-pointer text-sm font-mono text-slate-700 hover:opacity-80 dark:text-slate-300"
        @click="emit('open-math-zoom', message.physicsSolution.formula)"
      />
    </div>

    <!-- Steps Section -->
    <div v-if="message.physicsSolution?.steps?.length" class="space-y-2">
      <p class="text-[11px] font-medium uppercase tracking-[0.5px] font-mono text-slate-500 dark:text-slate-400">Step-by-step breakdown</p>
      
      <div
        v-for="(step, stepIndex) in message.physicsSolution.steps"
        :key="`physics-step-${messageIndex}-${stepIndex}`"
        class="space-y-2 rounded-[20px] border border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/10 dark:bg-white/5"
      >
        <div class="flex items-start gap-3">
          <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded border border-brand-primary/20 bg-brand-primary/10 text-sm font-medium font-mono text-brand-primary dark:border-brand-primary/30 dark:bg-brand-primary/20">
            {{ stepIndex + 1 }}
          </div>
          <div class="flex-1">
            <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ step.title || `Step ${stepIndex + 1}` }}</p>
          </div>
        </div>

        <MathBlock
          v-if="step.work"
          :content="step.work"
          :display-mode="true"
          class="ml-10 cursor-pointer text-sm font-mono text-slate-700 hover:opacity-80 dark:text-slate-300"
          @click="emit('open-math-zoom', step.work)"
        />

        <div v-if="step.result" class="ml-10 mt-3 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-[13px] font-mono text-teal-700 dark:border-teal-800/50 dark:bg-teal-900/30 dark:text-teal-400">
          Result: {{ step.result }}
        </div>
      </div>
    </div>

    <!-- Final Answer -->
    <div v-if="message.physicsSolution?.final_answer" class="rounded-[20px] border border-brand-primary/30 bg-brand-primary/10 px-6 py-4 dark:border-brand-primary/40 dark:bg-brand-primary/20">
      <p class="mb-3 text-[11px] font-medium uppercase tracking-[0.5px] font-mono text-brand-primary">Final Answer</p>
      <MathBlock
        :content="message.physicsSolution.final_answer"
        :display-mode="true"
        class="cursor-pointer text-sm font-semibold text-brand-primary hover:opacity-80"
        @click="emit('open-math-zoom', message.physicsSolution.final_answer)"
      />
    </div>

    <!-- Diagram Hint -->
    <div v-if="message.physicsSolution?.diagram_hint" class="rounded-[20px] border border-teal-200 bg-teal-50 px-6 py-4 text-[13px] font-mono text-teal-700 italic dark:border-teal-800/50 dark:bg-teal-900/20 dark:text-teal-400">
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
