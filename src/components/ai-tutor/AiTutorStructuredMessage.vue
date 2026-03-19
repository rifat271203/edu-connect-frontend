<template>
  <div class="rounded-2xl rounded-tl-md border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5 shadow-sm">
    <div class="flex flex-wrap items-center gap-2.5 mb-3">
      <span class="inline-flex items-center rounded-full border border-[var(--line-gold)] bg-[var(--gold-dim)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--gold)]">
        Tutor Response
      </span>
      <span
        v-if="typeof message.mathSolution?.contextUsed === 'boolean'"
        class="rounded-full border border-[var(--line)] bg-[var(--surface2)] px-2 py-0.5 text-[11px] text-[var(--t3)]"
      >
        {{ message.mathSolution?.contextUsed ? 'Context used' : 'No context used' }}
      </span>
    </div>

    <transition name="section-fade" mode="out-in">
      <div v-if="showTopic" class="mb-3">
        <p class="text-[11px] uppercase tracking-[0.11em] text-[var(--t3)] mb-1">Topic</p>
        <h3 class="text-lg font-semibold leading-tight text-[var(--t1)]">{{ message.richResponse?.topic }}</h3>
      </div>
    </transition>

    <transition name="section-fade" mode="out-in">
      <div v-if="showMethod" class="mb-4">
        <p class="text-[11px] uppercase tracking-[0.11em] text-[var(--t3)] mb-1">Method</p>
        <p class="text-sm leading-relaxed text-[var(--t2)]">{{ message.richResponse?.method }}</p>
      </div>
    </transition>

    <transition name="section-fade" mode="out-in">
      <div
        v-if="showMainAnswer && message.richResponse?.main_answer"
        class="mb-4 rounded-xl border border-[var(--line-gold)] bg-[var(--gold-dim)] p-3.5 sm:p-4"
      >
        <p class="text-[11px] uppercase tracking-[0.11em] text-[var(--gold)] mb-2 font-semibold">
          {{ message.richResponse.main_answer.label || 'Final Answer' }}
        </p>

        <MathRenderer
          v-if="message.richResponse.main_answer.latex"
          :content="message.richResponse.main_answer.latex"
          mode="block"
          class="text-[var(--t1)]"
        />

        <MathRenderer
          v-else-if="message.richResponse.main_answer.text"
          :content="message.richResponse.main_answer.text"
          mode="auto"
          class="text-[var(--t1)] text-sm"
        />
      </div>
    </transition>

    <div class="space-y-3">
      <transition-group name="section-fade" tag="div" class="space-y-3">
        <article
          v-for="(section, idx) in visibleSections"
          :key="section.id || `section-${messageIndex}-${idx}`"
          class="rounded-xl border border-[var(--line)] bg-[var(--surface2)] p-3.5"
        >
          <template v-if="section.type === 'step'">
            <div class="flex items-center gap-2 mb-2">
              <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full border border-[var(--line-gold)] bg-[var(--gold-dim)] px-1.5 text-[11px] font-semibold text-[var(--gold)]">
                {{ section.step || idx + 1 }}
              </span>
              <p class="text-sm font-semibold text-[var(--t1)]">{{ section.title || `Step ${section.step || idx + 1}` }}</p>
            </div>

            <MathRenderer
              v-if="section.explanation"
              :content="section.explanation"
              mode="auto"
              class="text-sm leading-relaxed text-[var(--t2)]"
            />

            <div v-if="section.equations?.length" class="mt-2.5 space-y-2">
              <div
                v-for="(equation, eqIndex) in section.equations"
                :key="`eq-${messageIndex}-${idx}-${eqIndex}`"
                class="rounded-lg border border-[var(--line-gold)] bg-[var(--gold-dim)] p-2.5"
              >
                <MathRenderer :content="equation" mode="block" class="text-[var(--t1)]" />
              </div>
            </div>

            <div v-if="section.result || section.result_latex" class="mt-2.5 rounded-lg border border-emerald-400/25 bg-emerald-500/10 p-2.5">
              <p class="text-[11px] uppercase tracking-[0.1em] text-emerald-300 mb-1">Result</p>
              <MathRenderer
                v-if="section.result_latex"
                :content="section.result_latex"
                mode="block"
                class="text-emerald-100"
              />
              <MathRenderer
                v-else-if="section.result"
                :content="section.result"
                mode="auto"
                class="text-sm text-emerald-100"
              />
            </div>
          </template>

          <template v-else-if="section.type === 'equation'">
            <p v-if="section.title" class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--t3)] mb-2">{{ section.title }}</p>
            <MathRenderer
              :content="section.latex || section.content || ''"
              mode="block"
              class="text-[var(--t1)]"
            />
          </template>

          <template v-else-if="section.type === 'bullet_points'">
            <p v-if="section.title" class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--t3)] mb-2">{{ section.title }}</p>
            <ul class="list-disc pl-5 space-y-1.5">
              <li
                v-for="(item, itemIndex) in section.items || []"
                :key="`item-${messageIndex}-${idx}-${itemIndex}`"
                class="text-sm text-[var(--t2)]"
              >
                <MathRenderer :content="item" mode="auto" />
              </li>
            </ul>
          </template>

          <template v-else-if="section.type === 'markdown'">
            <div class="ai-message text-sm text-[var(--t2)]" v-html="renderMarkdown(section.content || '')"></div>
          </template>

          <template v-else-if="section.type === 'final_answer'">
            <p class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--gold)] mb-2">Final Answer</p>
            <MathRenderer
              :content="section.latex || section.content || ''"
              mode="block"
              class="text-[var(--t1)]"
            />
          </template>

          <template v-else>
            <p v-if="section.title" class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--t3)] mb-2">{{ section.title }}</p>
            <MathRenderer
              :content="section.content || ''"
              mode="auto"
              class="text-sm leading-relaxed text-[var(--t2)]"
            />
          </template>
        </article>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Message, TutorSection } from '~/types/aiTutor'
import MathRenderer from '~/components/math/MathRenderer.vue'

const props = defineProps<{
  message: Message
  messageIndex: number
  renderMarkdown: (content: string) => string
}>()

const streamProgress = computed(() => props.message.streamProgress)

const showTopic = computed(() => {
  if (!props.message.richResponse?.topic) return false
  return Boolean(streamProgress.value?.showTopic)
})

const showMethod = computed(() => {
  if (!props.message.richResponse?.method) return false
  return Boolean(streamProgress.value?.showMethod)
})

const showMainAnswer = computed(() => {
  if (!props.message.richResponse?.main_answer) return false
  return Boolean(streamProgress.value?.showMainAnswer)
})

const visibleSections = computed<TutorSection[]>(() => {
  const sections = props.message.richResponse?.sections || []
  const revealedCount = streamProgress.value?.revealedSections ?? 0
  return sections.slice(0, Math.max(0, revealedCount))
})
</script>

<style scoped>
.section-fade-enter-active,
.section-fade-leave-active {
  transition: all 0.2s ease;
}

.section-fade-enter-from,
.section-fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
</style>
