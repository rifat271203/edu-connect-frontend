<template>
  <div ref="container" class="flex-1 min-h-0 overflow-y-auto px-4 lg:px-10 py-6 lg:py-8 space-y-5 lg:space-y-7 pb-6 thin-scrollbar" :style="{ background: 'var(--bg)' }">
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="flex animate-fadeUp"
      :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
      :style="{ animationDelay: message.role === 'assistant' ? `${index * 0.1}s` : '0s' }"
    >
      <!-- AI Message -->
      <div v-if="message.role === 'assistant'" class="flex gap-4 max-w-2xl">
        <!-- AI Icon -->
        <div class="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" :style="{ 
          background: 'linear-gradient(135deg, var(--gold-dim), rgba(212,168,67,0.2))',
          border: '1px solid rgba(212,168,67,0.3)'
        }">
          <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: 'var(--gold)'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-3.636 6.364l-.707-.707M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
          </svg>
        </div>

        <div class="min-w-0 flex-1">
          <!-- Label -->
          <p class="text-[10px] uppercase font-medium tracking-[0.3px] mb-2.5" style="color: 'var(--text3)', fontFamily: 'DM Mono'">AI Tutor</p>

          <!-- Content -->
          <div v-if="message.isStreaming" class="px-5 py-3.5 rounded-3xl rounded-tl-md" :style="{ background: 'var(--bg3)', border: '1px solid', borderColor: 'var(--line2)' }">
            <p class="text-sm leading-relaxed" style="color: 'var(--text)', fontFamily: 'DM Sans'">{{ message.content }}</p>
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
            class="px-5 py-3.5 rounded-3xl rounded-tl-md"
            :style="{ background: 'var(--bg3)', border: '1px solid', borderColor: 'var(--line2)' }"
            v-html="renderMarkdown(message.content)"
            style="color: var(--text); fontFamily: 'DM Sans'; fontSize: '14px'; lineHeight: 1.8"
          ></div>
        </div>
      </div>

      <!-- User Message -->
      <div v-else class="flex gap-4 max-w-xs">
        <div class="min-w-0 flex-1">
          <!-- Label -->
          <p class="text-[10px] uppercase font-medium tracking-[0.3px] mb-2.5 text-right" style="color: 'var(--text3)', fontFamily: 'DM Mono'">You</p>

          <!-- Bubble -->
          <div class="px-5 py-3.5 rounded-3xl rounded-br-md" :style="{ background: 'var(--gold)', border: '1px solid', borderColor: 'var(--gold)' }">
            <p class="text-sm leading-relaxed" style="color: '#080c14', fontFamily: 'DM Sans'">{{ message.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isTyping" class="flex justify-start animate-fadeUp">
      <div class="flex gap-4 max-w-2xl">
        <div class="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center" :style="{ 
          background: 'linear-gradient(135deg, var(--gold-dim), rgba(212,168,67,0.2))',
          border: '1px solid rgba(212,168,67,0.3)'
        }">
          <svg class="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: 'var(--gold)'">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-3.636 6.364l-.707-.707M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
          </svg>
        </div>

        <div>
          <p class="text-[10px] uppercase font-medium tracking-[0.3px] mb-2.5" style="color: 'var(--text3)', fontFamily: 'DM Mono'">AI Tutor</p>
          <div class="px-5 py-3.5 rounded-3xl rounded-tl-md flex gap-1.5 items-center" :style="{ background: 'var(--bg3)', border: '1px solid', borderColor: 'var(--line2)' }">
            <span class="w-2 h-2 bg-[var(--gold)] rounded-full animate-bounce" style="animationDelay: '0ms'"></span>
            <span class="w-2 h-2 bg-[var(--gold)] rounded-full animate-bounce" style="animationDelay: '150ms'"></span>
            <span class="w-2 h-2 bg-[var(--gold)] rounded-full animate-bounce" style="animationDelay: '300ms'"></span>
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
  const hasChemistrySolution = Boolean(message.chemistrySolution)
  return Boolean(
    hasChemistrySolution ||
    message.diagram ||
    message.mechanismSteps?.length ||
    (hasChemistrySolution && message.chemistrySolution?.reaction_pathway?.compounds?.length) ||
    (hasChemistrySolution && message.chemistrySolution?.steps?.length) ||
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
    // New fields from backend response format
    message.chemistrySolution?.reaction_pathway?.compounds?.forEach(compound => {
      if (compound.smiles?.trim()) values.push(compound.smiles.trim())
    })
    message.chemistrySolution?.steps?.forEach(step => {
      step.molecules?.forEach(molecule => {
        if (molecule.smiles?.trim()) values.push(molecule.smiles.trim())
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
        width: 200,
        height: 140,
        theme: renderTheme.value,
        compactDrawing: true,
        padding: 20,
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
.thin-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.thin-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.thin-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.thin-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeUp {
  animation: fadeUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

:deep(.ai-message) {
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 1.8;
}

:deep(.ai-message p) {
  margin-bottom: 0.8em;
  color: var(--text);
}

:deep(.ai-message p:last-child) {
  margin-bottom: 0;
}

:deep(.ai-message strong) {
  color: var(--gold2);
  font-weight: 500;
}

:deep(.ai-message code) {
  background: var(--bg2);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'DM Mono', monospace;
  font-size: 0.9em;
  color: var(--gold2);
}

:deep(.ai-message pre) {
  background: var(--bg2);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 0.8em 0;
}

:deep(.ai-message pre code) {
  background: none;
  padding: 0;
  color: var(--text);
}

:deep(.ai-message a) {
  color: var(--gold2);
  text-decoration: underline;
}

:deep(.ai-message ul) {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 0.8em 0;
}

:deep(.ai-message ol) {
  list-style-type: decimal;
  padding-left: 1.5em;
  margin: 0.8em 0;
}

:deep(.ai-message li) {
  margin-bottom: 0.4em;
  color: var(--text);
}
</style>
