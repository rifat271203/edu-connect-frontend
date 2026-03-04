<template>
  <div class="bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md p-4 sm:p-5 text-dark-100 shadow-sm">
    <div class="flex flex-wrap items-start justify-between gap-2.5 mb-3">
      <div>
        <p class="text-[11px] uppercase tracking-wide text-accent-light">Math Solution</p>
        <div class="flex items-center gap-1.5 mt-1 text-[11px]">
          <span
            v-if="message.mathSolution?.confidence"
            class="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent-light font-semibold uppercase"
          >
            {{ message.mathSolution.confidence }} confidence
          </span>
          <span
            v-if="typeof message.mathSolution?.contextUsed === 'boolean'"
            class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-dark-300"
          >
            {{ message.mathSolution.contextUsed ? 'Context used' : 'No context used' }}
          </span>
        </div>
      </div>
    </div>

    <p v-if="copyFeedback" class="text-[11px] text-accent-light/90 mb-3">
      {{ copyFeedback }}
    </p>

    <div v-if="showAnswer && mathAnswerContent" class="rounded-xl border border-dark-700/70 bg-dark-950/50 p-3 sm:p-4 mb-3">
      <div class="flex items-center justify-between gap-2 mb-2">
        <p class="text-[11px] uppercase tracking-wide text-dark-400">Answer</p>
        <button
          type="button"
          class="rounded-md border border-dark-600 bg-dark-800/70 px-2 py-1 text-[11px] text-dark-200 hover:bg-dark-700"
          @click="emit('copy-answer', messageIndex, message)"
        >
          Copy Answer
        </button>
      </div>

      <MathBlock
        :content="mathAnswerContent"
        :display-mode="true"
        class="text-dark-100"
        @click="emit('open-math-zoom', mathAnswerContent)"
      />
    </div>

    <div v-if="showStepsBlock && totalMathSteps" class="mb-3">
      <div class="flex items-center justify-between gap-2 mb-2">
        <p class="text-[11px] uppercase tracking-wide text-dark-400">Step-by-step</p>
        <p class="text-[11px] text-dark-400">
          {{ visibleStepCount }}/{{ totalMathSteps }} shown
        </p>
      </div>

      <ol class="space-y-2.5">
        <li
          v-for="stepIndex in visibleStepCount"
          :key="`math-step-${messageIndex}-${stepIndex}`"
          class="rounded-xl border border-dark-700/65 bg-dark-950/35"
        >
          <div class="w-full flex items-center justify-between gap-2 px-3 py-2.5">
            <div class="flex min-w-0 items-center gap-2">
              <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-accent/20 text-[11px] font-semibold text-accent-light px-1.5">
                {{ stepIndex }}
              </span>

              <p class="text-xs text-dark-300">Step {{ stepIndex }}</p>
            </div>

            <button
              type="button"
              class="rounded-md border border-dark-600 bg-dark-800/70 px-2 py-1 text-[11px] text-dark-200 hover:bg-dark-700"
              @click="emit('copy-step', messageIndex, message, stepIndex - 1)"
            >
              Copy Step
            </button>
          </div>

          <div class="px-3 pb-3 space-y-2.5">
            <p
              v-for="(line, textLineIndex) in getVisibleStepTextLines(stepIndex - 1)"
              :key="`step-text-${messageIndex}-${stepIndex}-${textLineIndex}`"
              class="text-sm text-dark-300"
            >
              {{ line }}
            </p>

            <MathBlock
              v-for="(line, mathLineIndex) in getVisibleStepMathLines(stepIndex - 1)"
              :key="`step-math-${messageIndex}-${stepIndex}-${mathLineIndex}`"
              :content="line"
              :display-mode="resolveStepDisplayMode(line)"
              class="text-dark-100"
              @click="emit('open-math-zoom', line)"
            />

            <p
              v-if="isStepTyping(stepIndex - 1)"
              class="text-[11px] text-dark-400"
            >
              Typing...
            </p>

            <p
              v-if="!getVisibleStepTextLines(stepIndex - 1).length && !getVisibleStepMathLines(stepIndex - 1).length && !isStepTyping(stepIndex - 1)"
              class="text-xs text-dark-400"
            >
              No step details available.
            </p>
          </div>
        </li>
      </ol>

      <p v-if="visibleStepCount < totalMathSteps" class="mt-2 text-[11px] text-dark-400">
        Revealing next step...
      </p>
    </div>

    <div v-if="showFinal && mathFinalContent" class="rounded-xl border border-accent/25 bg-accent/5 p-3 sm:p-4 mb-3">
      <div class="flex items-center justify-between gap-2 mb-2">
        <p class="text-[11px] uppercase tracking-wide text-accent-light/90">Final Expression</p>
        <button
          type="button"
          class="rounded-md border border-accent/35 bg-accent/10 px-2 py-1 text-[11px] text-accent-light hover:bg-accent/20"
          @click="emit('copy-final', messageIndex, message)"
        >
          Copy Final
        </button>
      </div>

      <MathBlock
        :content="mathFinalContent"
        :display-mode="true"
        class="text-dark-100"
        @click="emit('open-math-zoom', mathFinalContent)"
      />
    </div>

    <div v-if="showNotes && message.mathSolution?.notes" class="rounded-xl border border-dark-700/65 bg-dark-950/35 p-3 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-1">Notes</p>
      <div
        class="ai-message whitespace-pre-wrap text-dark-300"
        v-html="renderMarkdown(message.mathSolution.notes)"
      ></div>
    </div>

    <div v-if="showChunks && message.mathSolution?.usedChunkIds?.length" class="rounded-xl border border-dark-700/65 bg-dark-950/35 p-3 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Reference Chunks</p>
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="chunkId in message.mathSolution.usedChunkIds"
          :key="chunkId"
          type="button"
          class="rounded-full border border-dark-600 bg-dark-800/60 px-2 py-0.5 text-[11px] text-dark-300 hover:border-accent/40 hover:text-accent-light"
          @click="emit('open-chunk', chunkId)"
        >
          {{ chunkId }}
        </button>
      </div>
    </div>

    <details v-if="showVerify" class="rounded-xl border border-dark-700/65 bg-dark-950/35 p-3">
      <summary class="cursor-pointer text-[11px] uppercase tracking-wide text-dark-400 select-none">Verify</summary>
      <div class="mt-2.5 text-sm text-dark-300 space-y-2">
        <template v-if="verifyPanelState.status === 'not-verifiable'">
          <p>Not verifiable</p>
        </template>
        <template v-else-if="verifyPanelState.status === 'requires-engine'">
          <p>Verification requires expression evaluation engine (not installed).</p>
          <p class="text-xs text-dark-400">
            Planned method: sample x values where defined, compare numerical derivative
            <code class="rounded bg-dark-800/70 px-1 py-0.5">F'(x) ≈ (F(x+h)-F(x-h))/(2h)</code>
            against integrand.
          </p>
          <p class="text-xs text-dark-400">
            Candidate sample points: {{ verifyPanelState.samplePoints.join(', ') }}
          </p>
        </template>
        <template v-else>
          <p>Verification ready.</p>
        </template>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/aiTutor'
import { sanitizeMathText, splitStep, type SplitStepResult } from '~/utils/mathFormat'
import MathBlock from '~/components/math/MathBlock.vue'

type VerifyStateStatus = 'not-verifiable' | 'requires-engine' | 'ready'

type VerifyPanelState = {
  status: VerifyStateStatus
  samplePoints: number[]
}

const DEFAULT_VERIFY_POINTS = [0.3, 0.5, 0.7]

const props = withDefaults(
  defineProps<{
    message: Message
    messageIndex: number
    copyFeedback?: string
    renderMarkdown: (content: string) => string
  }>(),
  {
    copyFeedback: '',
  }
)

const emit = defineEmits<{
  'copy-answer': [messageIndex: number, message: Message]
  'copy-step': [messageIndex: number, message: Message, stepIndex: number]
  'copy-final': [messageIndex: number, message: Message]
  'open-math-zoom': [content: string]
  'open-chunk': [chunkId: string]
  'reveal-progress': []
}>()

const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const mathAnswerContent = computed(() => {
  const solution = props.message.mathSolution
  if (!solution) return ''

  return solution.answer?.trim() || solution.answerLatex?.trim() || props.message.content || ''
})

const stepContents = computed(() => {
  const solution = props.message.mathSolution
  if (!solution) return []

  const totalSteps = Math.max(solution.steps?.length || 0, solution.stepsLatex?.length || 0)
  return Array.from({ length: totalSteps }, (_, index) => {
    return solution.steps?.[index]?.trim() || solution.stepsLatex?.[index]?.trim() || ''
  })
})

const splitSteps = computed<SplitStepResult[]>(() => {
  return stepContents.value.map(step => splitStep(step))
})

const totalMathSteps = computed(() => splitSteps.value.length)

const mathFinalContent = computed(() => {
  const solution = props.message.mathSolution
  if (!solution) return ''

  return solution.final?.trim() || solution.finalLatex?.trim() || ''
})

const verifyPanelState = computed<VerifyPanelState>(() => {
  const solution = props.message.mathSolution
  if (!solution) {
    return { status: 'not-verifiable', samplePoints: [] }
  }

  if (!solution.integrandLatex || !solution.finalLatex) {
    return { status: 'not-verifiable', samplePoints: [] }
  }

  return {
    status: 'requires-engine',
    samplePoints: DEFAULT_VERIFY_POINTS,
  }
})

const resolveStepDisplayMode = (line: string): boolean => {
  const normalized = sanitizeMathText(line)
  return /(=|⇒|∫|\\int|\^|\/)/.test(normalized) || normalized.length > 36
}

const visibleStepCount = ref(0)
const visibleTextLineCountByStep = ref<Record<number, number>>({})
const visibleMathLineCountByStep = ref<Record<number, number>>({})
const isRevealing = ref(false)
const showAnswer = ref(false)
const showStepsBlock = ref(false)
const showFinal = ref(false)
const showNotes = ref(false)
const showChunks = ref(false)
const showVerify = ref(false)

let revealRunId = 0

const hydrateFullyVisible = () => {
  showAnswer.value = Boolean(mathAnswerContent.value)
  showStepsBlock.value = totalMathSteps.value > 0
  showFinal.value = Boolean(mathFinalContent.value)
  showNotes.value = Boolean(props.message.mathSolution?.notes)
  showChunks.value = Boolean(props.message.mathSolution?.usedChunkIds?.length)
  showVerify.value = true

  visibleStepCount.value = totalMathSteps.value
  visibleTextLineCountByStep.value = {}
  visibleMathLineCountByStep.value = {}

  splitSteps.value.forEach((step, index) => {
    visibleTextLineCountByStep.value[index] = step.textLines.length
    visibleMathLineCountByStep.value[index] = step.mathLines.length
  })
}

const getVisibleStepTextLines = (stepIndex: number): string[] => {
  const step = splitSteps.value[stepIndex]
  if (!step) return []

  const visibleCount = visibleTextLineCountByStep.value[stepIndex] || 0
  return step.textLines.slice(0, visibleCount)
}

const getVisibleStepMathLines = (stepIndex: number): string[] => {
  const step = splitSteps.value[stepIndex]
  if (!step) return []

  const visibleCount = visibleMathLineCountByStep.value[stepIndex] || 0
  return step.mathLines.slice(0, visibleCount)
}

const isStepTyping = (stepIndex: number): boolean => {
  const step = splitSteps.value[stepIndex]
  if (!step) return false
  if (!isRevealing.value) return false
  if (stepIndex !== visibleStepCount.value - 1) return false

  const visibleText = visibleTextLineCountByStep.value[stepIndex] || 0
  const visibleMath = visibleMathLineCountByStep.value[stepIndex] || 0

  return visibleText < step.textLines.length || visibleMath < step.mathLines.length
}

const revealStepsSequentially = async () => {
  const runId = ++revealRunId
  const totalSteps = totalMathSteps.value
  const previouslyRevealed = typeof props.message.revealedMathSteps === 'number'
    ? Math.min(Math.max(props.message.revealedMathSteps, 0), totalSteps)
    : totalSteps

  visibleStepCount.value = 0
  visibleTextLineCountByStep.value = {}
  visibleMathLineCountByStep.value = {}
  showAnswer.value = false
  showStepsBlock.value = false
  showFinal.value = false
  showNotes.value = false
  showChunks.value = false
  showVerify.value = false

  if (!totalSteps) {
    props.message.revealedMathSteps = 0
    if (mathAnswerContent.value) {
      showAnswer.value = true
      emit('reveal-progress')
      await wait(220)
    }
    if (mathFinalContent.value) {
      showFinal.value = true
      emit('reveal-progress')
      await wait(220)
    }
    if (props.message.mathSolution?.notes) {
      showNotes.value = true
      emit('reveal-progress')
      await wait(170)
    }
    if (props.message.mathSolution?.usedChunkIds?.length) {
      showChunks.value = true
      emit('reveal-progress')
      await wait(170)
    }
    showVerify.value = true
    emit('reveal-progress')
    return
  }

  if (previouslyRevealed >= totalSteps) {
    hydrateFullyVisible()
    props.message.revealedMathSteps = totalSteps
    emit('reveal-progress')
    return
  }

  for (let stepIndex = 0; stepIndex < previouslyRevealed; stepIndex += 1) {
    const step = splitSteps.value[stepIndex]
    visibleStepCount.value = stepIndex + 1
    visibleTextLineCountByStep.value[stepIndex] = step?.textLines.length || 0
    visibleMathLineCountByStep.value[stepIndex] = step?.mathLines.length || 0
  }

  if (mathAnswerContent.value) {
    showAnswer.value = true
    emit('reveal-progress')
    if (previouslyRevealed < totalSteps) {
      await wait(220)
    }
  }

  showStepsBlock.value = true
  emit('reveal-progress')

  isRevealing.value = true

  for (let stepIndex = previouslyRevealed; stepIndex < totalSteps; stepIndex += 1) {
    if (runId !== revealRunId) return

    visibleStepCount.value = stepIndex + 1
    visibleTextLineCountByStep.value[stepIndex] = 0
    visibleMathLineCountByStep.value[stepIndex] = 0
    await nextTick()
    emit('reveal-progress')
    await wait(stepIndex === 0 ? 220 : 340)

    const step = splitSteps.value[stepIndex]

    for (let textIndex = 0; textIndex < (step?.textLines.length || 0); textIndex += 1) {
      if (runId !== revealRunId) return
      visibleTextLineCountByStep.value[stepIndex] = textIndex + 1
      await nextTick()
      emit('reveal-progress')
      await wait(145)
    }

    for (let mathIndex = 0; mathIndex < (step?.mathLines.length || 0); mathIndex += 1) {
      if (runId !== revealRunId) return
      visibleMathLineCountByStep.value[stepIndex] = mathIndex + 1
      await nextTick()
      emit('reveal-progress')
      await wait(190)
    }

    if (!(step?.textLines.length || 0) && !(step?.mathLines.length || 0)) {
      await wait(120)
    }

    props.message.revealedMathSteps = stepIndex + 1
    emit('reveal-progress')
  }

  isRevealing.value = false

  if (mathFinalContent.value) {
    showFinal.value = true
    emit('reveal-progress')
    await wait(220)
  }

  if (props.message.mathSolution?.notes) {
    showNotes.value = true
    emit('reveal-progress')
    await wait(170)
  }

  if (props.message.mathSolution?.usedChunkIds?.length) {
    showChunks.value = true
    emit('reveal-progress')
    await wait(170)
  }

  showVerify.value = true
  emit('reveal-progress')

  isRevealing.value = false
}

watch(
  () => [props.message.isStreaming, props.messageIndex, stepContents.value.join('||')],
  async () => {
    if (props.message.isStreaming) return
    await revealStepsSequentially()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  revealRunId += 1
})
</script>
