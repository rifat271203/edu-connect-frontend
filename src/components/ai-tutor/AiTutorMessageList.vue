<template>
  <div ref="container" class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 sm:px-4 lg:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5 pb-6 scrollbar-hide">
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

          <div
            v-if="message.isStreaming"
            class="bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md p-3.5 sm:p-4 text-dark-100 shadow-sm"
          >
            <p class="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-relaxed">{{ message.content }}</p>
          </div>

          <AiTutorChemistryMessage
            v-else-if="isChemistryMessage(message)"
            :message="message"
            :message-index="index"
            :render-theme="renderTheme"
            :svg-by-smiles="smilesSvgMap"
            :errors-by-smiles="renderErrors"
          />

          <AiTutorPhysicsMessage
            v-else-if="Boolean(message.physicsSolution)"
            :message="message"
            :message-index="index"
            @open-math-zoom="openMathZoom"
          />

          <AiTutorMathMessage
            v-else-if="Boolean(message.mathSolution)"
            :message="message"
            :message-index="index"
            @open-math-zoom="openMathZoom"
            @view-graph="openMathZoom"
          />

          <div
            v-else
            class="ai-message bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md p-3.5 sm:p-4 text-dark-100 whitespace-pre-wrap shadow-sm"
            v-html="renderMarkdown(message.content)"
          ></div>
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
            <p class="text-dark-100 whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-sm leading-relaxed">{{ message.content }}</p>
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
import { sanitizeMathText } from '~/utils/mathFormat'
import AiTutorMathMessage from '~/components/ai-tutor/AiTutorMathMessage.vue'
import AiTutorPhysicsMessage from '~/components/ai-tutor/AiTutorPhysicsMessage.vue'
import AiTutorChemistryMessage from '~/components/ai-tutor/AiTutorChemistryMessage.vue'
import MathZoomModal from '~/components/math/MathZoomModal.vue'

const props = defineProps<{
  messages: Message[]
  isTyping: boolean
  userAvatar: string
  userName: string
  renderMarkdown: (content: string) => string
}>()

const { resolvedTheme } = useTheme()
const renderTheme = computed(() => (resolvedTheme.value === 'dark' ? 'dark' : 'light'))

const container = ref<HTMLElement | null>(null)
const isMathZoomOpen = ref(false)
const activeMathZoomContent = ref('')
const smilesSvgMap = ref<Map<string, string>>(new Map())
const renderErrors = ref<Map<string, string>>(new Map())

type RawStructure = {
  smiles?: string
  smile?: string
}

type RawMechanismStep = {
  structures?: RawStructure[]
  moleculeState?: RawStructure[]
  molecule_state?: RawStructure[]
}

const subjectHint = (message: Message): string => {
  return `${message.subject || ''} ${message.category || ''}`.toLowerCase()
}

const isChemistryMessage = (message: Message): boolean => {
  const hint = subjectHint(message)
  return Boolean(
    message.chemistrySolution ||
    message.diagram ||
    message.mechanismSteps?.length ||
    hint.includes('chemistry') ||
    hint.includes('chem') ||
    hint.includes('organic')
  )
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

const resolveStepStructures = (step: unknown): RawStructure[] => {
  const raw = (step ?? {}) as RawMechanismStep
  if (Array.isArray(raw.structures)) return raw.structures
  if (Array.isArray(raw.moleculeState)) return raw.moleculeState
  if (Array.isArray(raw.molecule_state)) return raw.molecule_state
  return []
}

const getStructureSmiles = (structure: RawStructure): string => {
  return (structure.smiles ?? structure.smile ?? '').trim()
}

const allStructureSmiles = computed(() => {
  const values: string[] = []

  props.messages.forEach((message) => {
    message.diagram?.reactants.forEach(item => values.push(item.smiles))
    message.diagram?.reagents.forEach(item => values.push(item.smiles))
    message.diagram?.products.forEach(item => values.push(item.smiles))
    message.mechanismSteps?.forEach(step => {
      resolveStepStructures(step).forEach((structure) => {
        const smiles = getStructureSmiles(structure)
        if (smiles) values.push(smiles)
      })
    })
    message.chemistrySolution?.resonance?.forms?.forEach(form => {
      if (form.smiles?.trim()) values.push(form.smiles.trim())
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
  if (!container.value) return
  container.value.scrollTop = container.value.scrollHeight
}

watch(
  () => [props.messages, props.isTyping, renderTheme.value],
  async () => {
    await renderAllStructures()
    await nextTick()
    scrollToBottom()
  },
  { deep: true, immediate: true }
)

defineExpose({
  scrollToBottom,
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
