<template>
  <div class="space-y-4 max-w-2xl">
    <!-- Tag Row -->
    <div class="flex flex-wrap gap-1.5">
      <span class="px-2.5 py-1 rounded-full text-[11px] font-medium" :style="{ background: 'rgba(45,212,191,0.1)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.2)', fontFamily: 'DM Mono' }">
        Physics Solution
      </span>
      <span v-if="typeof message.physicsSolution?.contextUsed === 'boolean'" class="px-2.5 py-1 rounded-full text-[11px] font-medium" :style="{ background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--line)', fontFamily: 'DM Mono' }">
        {{ message.physicsSolution?.contextUsed ? 'Context used' : 'No context' }}
      </span>
    </div>

    <!-- Law or Principle -->
    <blockquote v-if="message.physicsSolution?.law_or_principle" class="px-6 py-4 rounded-[20px] border-l-3 italic" :style="{ 
      background: 'rgba(45,212,191,0.08)',
      borderColor: '#2dd4bf',
      color: '#2dd4bf',
      fontFamily: 'DM Sans',
      fontSize: '14px'
    }">
      {{ message.physicsSolution.law_or_principle }}
    </blockquote>

    <!-- Answer Section -->
    <div v-if="message.physicsSolution?.answer" class="px-6 py-4 rounded-[20px]" :style="{ background: 'var(--bg3)', border: '1px solid var(--line2)' }">
      <p class="text-sm leading-relaxed" style="color: 'var(--text2)', fontFamily: 'DM Sans'">{{ message.physicsSolution.answer }}</p>
    </div>

    <!-- Given Values Table -->
    <div v-if="message.physicsSolution?.given?.length" class="overflow-x-auto rounded-[20px] border" :style="{ background: 'var(--bg3)', borderColor: 'var(--line2)' }">
      <table class="w-full text-sm" style="fontFamily: 'DM Mono'">
        <thead>
          <tr :style="{ background: 'var(--bg2)', borderBottom: '1px solid var(--line)' }">
            <th class="px-4 py-2 text-left text-xs uppercase tracking-[0.5px]" style="color: 'var(--text3)'">Symbol</th>
            <th class="px-4 py-2 text-left text-xs uppercase tracking-[0.5px]" style="color: 'var(--text3)'">Value</th>
            <th class="px-4 py-2 text-left text-xs uppercase tracking-[0.5px]" style="color: 'var(--text3)'">Unit</th>
            <th class="px-4 py-2 text-left text-xs uppercase tracking-[0.5px]" style="color: 'var(--text3)'">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in message.physicsSolution.given" :key="`given-${messageIndex}-${idx}`" :style="{ borderBottom: '1px solid var(--line)', color: 'var(--text2)' }">
            <td class="px-4 py-2">{{ item.symbol }}</td>
            <td class="px-4 py-2">{{ item.value }}</td>
            <td class="px-4 py-2">{{ item.unit }}</td>
            <td class="px-4 py-2">{{ item.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formula -->
    <div v-if="message.physicsSolution?.formula" class="px-6 py-4 rounded-[20px]" :style="{ background: 'var(--bg3)', border: '1px solid var(--line2)' }">
      <p class="text-[11px] uppercase tracking-[0.5px] font-medium mb-3" style="color: 'var(--text3)', fontFamily: 'DM Mono'">Formula</p>
      <MathBlock
        :content="message.physicsSolution.formula"
        :display-mode="true"
        class="text-sm cursor-pointer hover:opacity-80"
        style="color: var(--text2); fontFamily: 'DM Mono'"
        @click="emit('open-math-zoom', message.physicsSolution.formula)"
      />
    </div>

    <!-- Steps Section -->
    <div v-if="message.physicsSolution?.steps?.length" class="space-y-2">
      <p class="text-[11px] uppercase tracking-[0.5px] font-medium" style="color: 'var(--text3)', fontFamily: 'DM Mono'">Step-by-step breakdown</p>
      
      <div
        v-for="(step, stepIndex) in message.physicsSolution.steps"
        :key="`physics-step-${messageIndex}-${stepIndex}`"
        class="rounded-[20px] border px-5 py-4 space-y-2"
        :style="{ background: 'var(--bg3)', border: '1px solid var(--line)' }"
      >
        <div class="flex items-start gap-3">
          <div class="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 text-sm font-medium" :style="{ 
            background: 'var(--gold-dim)',
            color: 'var(--gold2)',
            border: '1px solid rgba(212,168,67,0.2)',
            fontFamily: 'DM Mono'
          }">
            {{ stepIndex + 1 }}
          </div>
          <div class="flex-1">
            <p class="font-semibold text-sm" style="color: 'var(--text)', fontFamily: 'Syne'">{{ step.title || `Step ${stepIndex + 1}` }}</p>
          </div>
        </div>

        <MathBlock
          v-if="step.work"
          :content="step.work"
          :display-mode="true"
          class="text-sm cursor-pointer hover:opacity-80 ml-10"
          style="color: var(--text2); fontFamily: 'DM Mono'"
          @click="emit('open-math-zoom', step.work)"
        />

        <div v-if="step.result" class="ml-10 px-3 py-2 rounded-lg border" :style="{ background: 'rgba(45,212,191,0.1)', borderColor: 'rgba(45,212,191,0.2)', color: '#2dd4bf', fontSize: '13px', fontFamily: 'DM Mono' }">
          Result: {{ step.result }}
        </div>
      </div>
    </div>

    <!-- Final Answer -->
    <div v-if="message.physicsSolution?.final_answer" class="px-6 py-4 rounded-[20px] border" :style="{ background: 'var(--gold-dim)', borderColor: 'rgba(212,168,67,0.25)' }">
      <p class="text-[11px] uppercase tracking-[0.5px] font-medium mb-3" style="color: 'var(--gold2)', fontFamily: 'DM Mono'">Final Answer</p>
      <MathBlock
        :content="message.physicsSolution.final_answer"
        :display-mode="true"
        class="text-sm cursor-pointer hover:opacity-80"
        style="color: var(--gold2); fontFamily: 'Syne'"
        @click="emit('open-math-zoom', message.physicsSolution.final_answer)"
      />
    </div>

    <!-- Diagram Hint -->
    <div v-if="message.physicsSolution?.diagram_hint" class="px-6 py-4 rounded-[20px] border italic" :style="{ background: 'rgba(45,212,191,0.08)', borderColor: 'rgba(45,212,191,0.2)', color: '#2dd4bf', fontFamily: 'DM Mono', fontSize: '13px' }">
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
