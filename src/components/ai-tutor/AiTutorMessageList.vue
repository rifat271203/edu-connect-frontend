<template>
  <div ref="container" class="flex-1 overflow-y-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 pb-6 scrollbar-hide">
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="flex"
      :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
    >
      <div v-if="message.role === 'assistant'" class="flex items-start gap-2.5 sm:gap-3 w-full max-w-[88%] sm:max-w-[80%] lg:max-w-[76%]">
        <div class="w-8 h-8 rounded-lg bg-accent/15 border border-accent/35 text-accent-light flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="min-w-0 w-full">
          <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-1">AI Tutor</p>
          <!-- {{ message.mathSolution }} -->
            <!-- {{ !message.isStreaming ? '...' : '' }} -->
          <AiTutorMathMessage
            v-if="message.mathSolution && !message.isStreaming"
            :message="message"
            :message-index="index"
            :copy-feedback="copyFeedbackByMessage[index]"
            :render-markdown="renderMarkdown"
            @copy-answer="copyMathAnswer"
            @copy-step="copyMathStep"
            @copy-final="copyMathFinal"
            @open-math-zoom="openMathZoom"
            @open-chunk="openChunkDrawer"
            @reveal-progress="onMathRevealProgress"
          />

          <div v-else>
            <div
              v-if="message.isStreaming"
              class="bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md p-3.5 sm:p-4 text-dark-100 shadow-sm"
            >
              <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ message.content }}</p>
            </div>
            <div
              v-else
              class="ai-message bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md p-3.5 sm:p-4 text-dark-100 whitespace-pre-wrap shadow-sm"
              v-html="renderMarkdown(message.content)"
            ></div>
          </div>

          <ReactionDiagram
            v-if="message.diagram && message.showDiagram"
            class="mt-3"
            :diagram="message.diagram"
          />

          <MechanismSteps
            v-if="message.mechanismSteps?.length && message.showMechanismSteps"
            :steps="message.mechanismSteps"
            :theme="renderTheme"
            :svg-by-smiles="smilesSvgMap"
            :errors-by-smiles="renderErrors"
          />
        </div>
      </div>

      <div v-else class="flex items-start gap-2.5 sm:gap-3 w-full max-w-[86%] sm:max-w-[78%] lg:max-w-[74%] flex-row-reverse">
        <UiAvatar
          :src="userAvatar"
          :name="userName"
          size="sm"
          class="flex-shrink-0"
        />
        <div class="min-w-0 w-full">
          <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-1 text-right">You</p>
          <div class="bg-dark-800/90 rounded-2xl rounded-tr-md p-3.5 sm:p-4 border border-dark-700/75 shadow-sm">
            <p class="text-dark-100 whitespace-pre-wrap text-sm leading-relaxed">{{ message.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isTyping" class="flex justify-start">
      <div class="flex items-start gap-2.5 sm:gap-3 max-w-[88%] sm:max-w-[80%] lg:max-w-[76%]">
        <div class="w-8 h-8 rounded-lg bg-accent/15 border border-accent/35 text-accent-light flex items-center justify-center">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md px-3.5 sm:px-4 py-3 shadow-sm">
          <p class="text-[11px] text-dark-400 mb-2">AI Tutor is generating a response...</p>
          <div class="flex gap-1.5">
            <span class="w-2 h-2 bg-accent-light rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-accent-light rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-accent-light rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
        </div>
      </div>
    </div>

    <ChunkDrawer
      :open="isChunkDrawerOpen"
      :chunk-id="activeChunkId"
      @close="closeChunkDrawer"
    />

    <MathZoomModal
      :open="isMathZoomOpen"
      :content="activeMathZoomContent"
      @close="closeMathZoom"
    />
  </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/aiTutor'
import { renderSmilesToSvg } from '~/utils/smilesSvg'
import { copyToClipboard } from '~/utils/copy'
import { sanitizeMathText } from '~/utils/mathFormat'
import ReactionDiagram from '~/components/reaction/ReactionDiagram.vue'
import MechanismSteps from '~/components/reaction/MechanismSteps.vue'
import MathZoomModal from '~/components/math/MathZoomModal.vue'
import ChunkDrawer from '~/components/math/ChunkDrawer.vue'
import AiTutorMathMessage from '~/components/ai-tutor/AiTutorMathMessage.vue'

const props = defineProps<{
  messages: Message[]
  isTyping: boolean
  userAvatar: string
  userName: string
  renderMarkdown: (content: string) => string
}>()

const copyFeedbackByMessage = ref<Record<number, string>>({})
const copyTimeoutByMessage = new Map<number, ReturnType<typeof setTimeout>>()
const isChunkDrawerOpen = ref(false)
const activeChunkId = ref<string | null>(null)
const isMathZoomOpen = ref(false)
const activeMathZoomContent = ref('')

const logMathUiReveal = (event: string, payload?: Record<string, unknown>) => {
  if (!import.meta.dev) return
  console.info('[math-ui-reveal]', event, payload || {})
}

const countStepLabels = (value: string): number => {
  return value.match(/(?:^|\b)Step\s*\d+\s*:/gi)?.length || 0
}

const getMathAnswerContent = (message: Message): string => {
  const solution = message.mathSolution
  if (!solution) return ''

  return solution.answer?.trim() || solution.answerLatex?.trim() || message.content || ''
}

const getMathStepCount = (message: Message): number => {
  const solution = message.mathSolution
  if (!solution) return 0

  return Math.max(solution.steps?.length || 0, solution.stepsLatex?.length || 0)
}

const getVisibleMathStepCount = (message: Message): number => {
  const totalSteps = getMathStepCount(message)
  if (!totalSteps) return 0
  if (typeof message.revealedMathSteps !== 'number') return totalSteps

  return Math.min(Math.max(message.revealedMathSteps, 0), totalSteps)
}

const getMathStepContent = (message: Message, stepIndex: number): string => {
  const solution = message.mathSolution
  if (!solution) return ''

  return solution.steps?.[stepIndex]?.trim() || solution.stepsLatex?.[stepIndex]?.trim() || ''
}

const getMathFinalContent = (message: Message): string => {
  const solution = message.mathSolution
  if (!solution) return ''

  return solution.final?.trim() || solution.finalLatex?.trim() || ''
}

const mathRevealSnapshot = computed(() => {
  return props.messages
    .map((message, index) => {
      if (message.role !== 'assistant' || !message.mathSolution) return `${index}:no-math`
      const answerContent = getMathAnswerContent(message)
      return [
        index,
        message.isStreaming ? 'streaming' : 'done',
        typeof message.revealedMathSteps === 'number' ? message.revealedMathSteps : 'na',
        getVisibleMathStepCount(message),
        getMathStepCount(message),
        countStepLabels(answerContent),
      ].join(':')
    })
    .join('|')
})

const setCopyFeedback = (messageIndex: number, message: string) => {
  copyFeedbackByMessage.value[messageIndex] = message

  const existingTimeout = copyTimeoutByMessage.get(messageIndex)
  if (existingTimeout) clearTimeout(existingTimeout)

  const timeout = setTimeout(() => {
    copyFeedbackByMessage.value[messageIndex] = ''
    copyTimeoutByMessage.delete(messageIndex)
  }, 2200)

  copyTimeoutByMessage.set(messageIndex, timeout)
}

const copyMathAnswer = async (messageIndex: number, message: Message) => {
  const answerText = getMathAnswerContent(message)
  if (!answerText) {
    setCopyFeedback(messageIndex, 'No answer available to copy.')
    return
  }

  await copyToClipboard(answerText, {
    successMessage: 'Answer copied.',
    errorMessage: 'Failed to copy answer.',
    onFeedback: feedback => setCopyFeedback(messageIndex, feedback),
  })
}

const copyMathFinal = async (messageIndex: number, message: Message) => {
  const finalText = getMathFinalContent(message)
  if (!finalText) {
    setCopyFeedback(messageIndex, 'No final expression available to copy.')
    return
  }

  await copyToClipboard(finalText, {
    successMessage: 'Final expression copied.',
    errorMessage: 'Failed to copy final expression.',
    onFeedback: feedback => setCopyFeedback(messageIndex, feedback),
  })
}

const copyMathStep = async (messageIndex: number, message: Message, stepIndex: number) => {
  const stepText = getMathStepContent(message, stepIndex)
  if (!stepText) {
    setCopyFeedback(messageIndex, 'No step content available to copy.')
    return
  }

  await copyToClipboard(stepText, {
    successMessage: `Step ${stepIndex + 1} copied.`,
    errorMessage: `Failed to copy step ${stepIndex + 1}.`,
    onFeedback: feedback => setCopyFeedback(messageIndex, feedback),
  })
}

const openMathZoom = (content: string) => {
  const normalized = sanitizeMathText(content)
  if (!normalized) return

  activeMathZoomContent.value = normalized
  isMathZoomOpen.value = true
}

const closeMathZoom = () => {
  isMathZoomOpen.value = false
}

const openChunkDrawer = (chunkId: string) => {
  activeChunkId.value = chunkId
  isChunkDrawerOpen.value = true
}

const closeChunkDrawer = () => {
  isChunkDrawerOpen.value = false
}

const onMathRevealProgress = async () => {
  await nextTick()
  scrollToBottom()
}

const { resolvedTheme } = useTheme()
const renderTheme = computed(() => (resolvedTheme.value === 'dark' ? 'dark' : 'light'))

const container = ref<HTMLElement | null>(null)
const smilesSvgMap = ref<Map<string, string>>(new Map())
const renderErrors = ref<Map<string, string>>(new Map())

type RawMechanismStructure = {
  smiles?: string
  smile?: string
}

type RawMechanismStep = {
  structures?: RawMechanismStructure[]
  moleculeState?: RawMechanismStructure[]
  molecule_state?: RawMechanismStructure[]
}

const getStepStructures = (step: unknown): RawMechanismStructure[] => {
  const raw = (step ?? {}) as RawMechanismStep

  if (Array.isArray(raw.structures)) return raw.structures
  if (Array.isArray(raw.moleculeState)) return raw.moleculeState
  if (Array.isArray(raw.molecule_state)) return raw.molecule_state

  return []
}

const getStructureSmiles = (structure: RawMechanismStructure): string => {
  return (structure.smiles ?? structure.smile ?? '').trim()
}

const allStructureSmiles = computed(() => {
  const values: string[] = []

  props.messages.forEach((message) => {
    message.diagram?.reactants.forEach(item => values.push(item.smiles))
    message.diagram?.reagents.forEach(item => values.push(item.smiles))
    message.diagram?.products.forEach(item => values.push(item.smiles))
    message.mechanismSteps?.forEach(step => {
      getStepStructures(step).forEach((structure) => {
        const smiles = getStructureSmiles(structure)
        if (smiles) values.push(smiles)
      })
    })
  })

  return Array.from(new Set(values.map(value => value.trim()).filter(Boolean)))
})

const renderAllStructures = async () => {
  if (!process.client) return

  const nextSvgMap = new Map(smilesSvgMap.value)
  const nextErrorMap = new Map(renderErrors.value)

  const tasks = allStructureSmiles.value.map(async (smiles) => {
    try {
      const svg = await renderSmilesToSvg(smiles, {
        width: 170,
        height: 110,
        theme: renderTheme.value,
      })

      nextSvgMap.set(smiles, svg)
      nextErrorMap.delete(smiles)
    } catch {
      nextSvgMap.delete(smiles)
      nextErrorMap.set(smiles, 'Unable to render structure')
    }
  })

  await Promise.all(tasks)
  smilesSvgMap.value = nextSvgMap
  renderErrors.value = nextErrorMap
}

const scrollToBottom = () => {
  if (container.value) {
    container.value.scrollTop = container.value.scrollHeight
  }
}

watch(
  () => [props.messages.length, props.isTyping, renderTheme.value],
  async () => {
    await renderAllStructures()
    await nextTick()
    scrollToBottom()
  },
  { deep: true }
)

watch(
  mathRevealSnapshot,
  () => {
    props.messages.forEach((message, index) => {
      if (message.role !== 'assistant' || !message.mathSolution) return

      const answerContent = getMathAnswerContent(message)
      logMathUiReveal('message-snapshot', {
        index,
        isStreaming: Boolean(message.isStreaming),
        revealedMathSteps: typeof message.revealedMathSteps === 'number' ? message.revealedMathSteps : null,
        visibleMathSteps: getVisibleMathStepCount(message),
        totalMathSteps: getMathStepCount(message),
        answerStepLabelCount: countStepLabels(answerContent),
        answerPreview: answerContent.slice(0, 140),
      })
    })
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  copyTimeoutByMessage.forEach(timeout => clearTimeout(timeout))
  copyTimeoutByMessage.clear()
})

defineExpose({
  scrollToBottom
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
