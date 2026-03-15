<template>
  <div class="h-[100dvh] lg:h-screen flex bg-dark-950 text-dark-100">
    <div class="flex-1 min-w-0 flex flex-col">
      <AiTutorHeader
        :message-count="messages.length"
        :saved-chat-count="chatHistory.length"
        @go-back="handleMobileBack"
        @clear-chat="clearChat"
      />

      <div class="px-4 lg:px-6 pt-4">
        <transition name="fade-slide" mode="out-in">
          <div
            v-if="!selectedCategory"
            key="category-picker"
            class="max-w-4xl mx-auto rounded-2xl border border-dark-700/70 bg-dark-900/55 p-4 sm:p-5"
          >
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <p class="text-sm font-semibold text-dark-100">Choose your tutor category first</p>
                <p class="text-xs text-dark-400 mt-1">Select Physics, Chemistry, or Math before asking any question.</p>
              </div>
              <div class="text-xs text-dark-300">
                Current: <span class="font-semibold text-accent-light">{{ selectedCategoryLabel }}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                v-for="option in categoryOptions"
                :key="option.value"
                @click="setCategory(option.value)"
                class="rounded-xl border border-dark-700/80 bg-dark-900/45 px-3 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-dark-800/60"
              >
                <p class="text-sm font-semibold text-dark-100">{{ option.label }}</p>
                <p class="text-xs text-dark-400 mt-1">{{ option.description }}</p>
              </button>
            </div>
          </div>

          <div v-else key="category-indicator" class="max-w-4xl mx-auto flex justify-end">
            <div class="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-dark-900/80 px-3 py-2 shadow-[0_0_0_1px_rgba(233,120,96,0.08)]">
              <span class="text-[11px] uppercase tracking-wide text-dark-400">Tutor Mode</span>
              <span class="h-1 w-1 rounded-full bg-accent-light"></span>
              <span class="text-xs font-semibold text-accent-light">{{ selectedCategoryLabel }}</span>
              <button
                @click="selectedCategory = null"
                class="ml-1 rounded-full border border-dark-600 bg-dark-800/70 px-2 py-1 text-[11px] font-medium text-dark-200 transition-colors hover:border-dark-500 hover:text-dark-100"
              >
                Change
              </button>
            </div>
          </div>
        </transition>
      </div>

      <AiTutorEmptyState
        v-if="selectedCategory && messages.length === 0 && !isTyping"
        :prompts="quickPrompts"
        :description="emptyStateDescription"
        @prompt="sendMessage"
      />

      <AiTutorMessageList
        v-else-if="messages.length > 0 || isTyping"
        ref="messageListRef"
        :messages="messages"
        :is-typing="isTyping"
        :user-avatar="userAvatar"
        :user-name="userName"
        :render-markdown="renderMarkdown"
      />

      <div v-else class="flex-1 px-4 lg:px-6 py-8">
        <div class="max-w-4xl mx-auto rounded-2xl border border-dark-700/70 bg-dark-900/45 p-6 text-sm text-dark-300">
          Select one category above to activate AI Tutor.
        </div>
      </div>

      <AiTutorComposer
        v-model="inputMessage"
        :disabled="isTyping || !selectedCategory"
        :placeholder="composerPlaceholder"
        @send="sendMessage"
        @clear="clearInput"
      />
    </div>

    <AiTutorSidebar
      :chat-history="chatHistory"
      :current-chat-index="currentChatIndex"
      :format-date="formatDate"
      :get-chat-preview="getChatPreview"
      @clear-all="clearAllChats"
      @new-chat="startNewChat"
      @load-chat="loadChat"
      @delete-chat="deleteChat"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'main' })
import { useUserStore } from '~/stores/user'
import { sendChatMessage, type AIAskResponse } from '~/services/api/chat'
import { AI_TUTOR_PROMPTS_BY_CATEGORY } from '~/constants/aiTutorPrompts'
import type { ChatSession, MathTutorSolution, Message, TutorCategory } from '~/types/aiTutor'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked for better rendering
marked.setOptions({
  breaks: true,
  gfm: true
})

// Render markdown content
const renderMarkdown = (content: string): string => {
  if (!content) return ''
  const html = marked.parse(content) as string
  return DOMPurify.sanitize(html)
}

const userStore = useUserStore()
const router = useRouter()

type MessageListExpose = {
  scrollToBottom: () => void
}

const messageListRef = ref<MessageListExpose | null>(null)
const inputMessage = ref('')
const isTyping = ref(false)

const logMathStepReveal = (event: string, payload?: Record<string, unknown>) => {
  if (!import.meta.dev) return
  console.info('[math-step-reveal]', event, payload || {})
}

const userAvatar = computed(() => userStore.user?.avatar)

const userName = computed(() => userStore.user?.name || 'User')

type TutorCategoryOption = {
  value: TutorCategory
  label: string
  description: string
}

const categoryOptions: TutorCategoryOption[] = [
  { value: 'physics', label: 'Physics', description: 'Motion, force, energy, electricity and modern physics' },
  { value: 'chemistry', label: 'Chemistry', description: 'Atoms, reactions, equations, bonding and organic chemistry' },
  { value: 'math', label: 'Math', description: 'Algebra, geometry, calculus, trigonometry and problem solving' }
]

const selectedCategory = ref<TutorCategory | null>(null)

const selectedCategoryLabel = computed(() => {
  return categoryOptions.find(option => option.value === selectedCategory.value)?.label || 'Not selected'
})

const composerPlaceholder = computed(() => {
  if (!selectedCategory.value) {
    return 'Select Physics, Chemistry, or Math to start asking questions'
  }
  return `Ask any ${selectedCategoryLabel.value} question`
})

const setCategory = (category: TutorCategory) => {
  selectedCategory.value = category
}

const handleMobileBack = () => {
  if (process.client && window.history.length > 1) {
    router.back()
    return
  }

  router.push('/home')
}

const emptyStateDescription = computed(() => {
  if (selectedCategory.value === 'physics') {
    return 'Try a Physics question on motion, force, energy, electricity, or modern physics. You can start from one of these suggested questions.'
  }
  if (selectedCategory.value === 'chemistry') {
    return 'Try a Chemistry question on reactions, equations, bonding, acids-bases, or thermochemistry. You can start from one of these suggested questions.'
  }
  if (selectedCategory.value === 'math') {
    return 'Try a Math question on algebra, geometry, trigonometry, or calculus. You can start from one of these suggested questions.'
  }
  return 'Select a category first, then ask your question.'
})

// Chat History State
const chatHistory = ref<ChatSession[]>([])
const currentChatIndex = ref(-1)

// Generate title from first message
const generateTitle = (msgs: Message[]): string => {
  const firstUserMsg = msgs.find(m => m.role === 'user')
  if (firstUserMsg) {
    return firstUserMsg.content.length > 30 
      ? firstUserMsg.content.substring(0, 30) + '...'
      : firstUserMsg.content
  }
  return 'New Chat'
}

// Format date for display
const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

const getChatPreview = (chat: ChatSession): string => {
  const firstUserMessage = chat.messages.find(message => message.role === 'user')
  if (!firstUserMessage?.content) return 'No preview available'

  return firstUserMessage.content.length > 80
    ? `${firstUserMessage.content.slice(0, 80)}...`
    : firstUserMessage.content
}

// Start new chat - save current chat to history first
const startNewChat = () => {
  if (messages.value.length > 0) {
    // Save current chat to history
    const title = generateTitle(messages.value)
    chatHistory.value.unshift({
      title,
      messages: [...messages.value],
      timestamp: new Date(),
      category: selectedCategory.value || undefined
    })
  }
  // Reset to new chat
  messages.value = []
  currentChatIndex.value = -1
  selectedCategory.value = null
}

// Load a chat from history
const loadChat = (index: number) => {
  // Save current chat first if it has messages
  if (messages.value.length > 0 && currentChatIndex.value === -1) {
    const title = generateTitle(messages.value)
    chatHistory.value.unshift({
      title,
      messages: [...messages.value],
      timestamp: new Date(),
      category: selectedCategory.value || undefined
    })
  }
  // Load selected chat
  messages.value = [...chatHistory.value[index].messages]
  currentChatIndex.value = index
  selectedCategory.value = chatHistory.value[index].category || null
  nextTick(() => renderMathInMessages())
}

// Delete a chat from history
const deleteChat = (index: number) => {
  chatHistory.value.splice(index, 1)
  if (currentChatIndex.value === index) {
    currentChatIndex.value = -1
    messages.value = []
    selectedCategory.value = null
  } else if (currentChatIndex.value > index) {
    currentChatIndex.value--
  }
}

// Clear all chats
const clearAllChats = () => {
  chatHistory.value = []
  messages.value = []
  currentChatIndex.value = -1
  selectedCategory.value = null
}

// Modified clearChat to save to history
const clearChat = () => { 
  if (messages.value.length > 0) {
    const title = generateTitle(messages.value)
    chatHistory.value.unshift({
      title,
      messages: [...messages.value],
      timestamp: new Date(),
      category: selectedCategory.value || undefined
    })
  }
  messages.value = [] 
  currentChatIndex.value = -1
  selectedCategory.value = null
}

const quickPrompts = computed(() => {
  if (!selectedCategory.value) return []
  return AI_TUTOR_PROMPTS_BY_CATEGORY[selectedCategory.value]
})

const messages = ref<Message[]>([])

const toStringArray = (value: unknown): string[] | undefined => {
  if (!Array.isArray(value)) return undefined

  const normalized = value
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean)

  return normalized.length ? normalized : undefined
}

const toConfidence = (value: unknown): MathTutorSolution['confidence'] => {
  if (value === 'low' || value === 'medium' || value === 'high') return value
  return undefined
}

const countStepLabels = (value: string | undefined): number => {
  if (!value) return 0
  return value.match(/(?:^|\b)Step\s*\d+\s*:/gi)?.length || 0
}

const countNumberedMentions = (value: string | undefined): number => {
  if (!value) return 0
  return value.match(/(?:^|\n)\s*(?:Step\s*\d+\s*[:.)]|\d+\s*[.)])/gim)?.length || 0
}

const parseMathSolution = (responseData: AIAskResponse, activeCategory: TutorCategory): MathTutorSolution | undefined => {
  if (activeCategory !== 'math') return undefined

  const answerPayload = responseData.answer
  const nestedSolution =
    typeof answerPayload === 'object' && answerPayload !== null && !Array.isArray(answerPayload)
      ? (answerPayload as Record<string, unknown>)
      : null

  const solution: MathTutorSolution = {
    answer: typeof answerPayload === 'string' ? answerPayload : undefined,
    answerLatex: typeof responseData.answerLatex === 'string' ? responseData.answerLatex : undefined,
    steps: toStringArray(responseData.steps),
    stepsLatex: toStringArray(responseData.stepsLatex),
    final: typeof responseData.final === 'string' ? responseData.final : undefined,
    finalLatex: typeof responseData.finalLatex === 'string' ? responseData.finalLatex : undefined,
    integrandLatex: typeof responseData.integrandLatex === 'string' ? responseData.integrandLatex : undefined,
    usedChunkIds: toStringArray(responseData.usedChunkIds),
    confidence: toConfidence(responseData.confidence),
    notes: typeof responseData.notes === 'string' ? responseData.notes : undefined,
    contextUsed: typeof responseData.contextUsed === 'boolean' ? responseData.contextUsed : undefined
  }

  if (nestedSolution) {
    if (typeof nestedSolution.answer === 'string') solution.answer = nestedSolution.answer
    if (typeof nestedSolution.answerLatex === 'string') solution.answerLatex = nestedSolution.answerLatex
    if (Array.isArray(nestedSolution.steps)) solution.steps = toStringArray(nestedSolution.steps)
    if (Array.isArray(nestedSolution.stepsLatex)) solution.stepsLatex = toStringArray(nestedSolution.stepsLatex)
    if (typeof nestedSolution.final === 'string') solution.final = nestedSolution.final
    if (typeof nestedSolution.finalLatex === 'string') solution.finalLatex = nestedSolution.finalLatex
    if (typeof nestedSolution.integrandLatex === 'string') solution.integrandLatex = nestedSolution.integrandLatex
    if (Array.isArray(nestedSolution.usedChunkIds)) solution.usedChunkIds = toStringArray(nestedSolution.usedChunkIds)
    solution.confidence = toConfidence(nestedSolution.confidence) || solution.confidence
    if (typeof nestedSolution.notes === 'string') solution.notes = nestedSolution.notes
    if (typeof nestedSolution.contextUsed === 'boolean') solution.contextUsed = nestedSolution.contextUsed
  }

  const hasMathContent = Boolean(
    solution.answer ||
    solution.answerLatex ||
    solution.final ||
    solution.finalLatex ||
    solution.steps?.length ||
    solution.stepsLatex?.length ||
    solution.notes ||
    solution.usedChunkIds?.length ||
    solution.confidence ||
    solution.contextUsed !== undefined
  )

  logMathStepReveal('parse-math-solution', {
    hasMathContent,
    answerType: typeof responseData.answer,
    rootStepsType: Array.isArray(responseData.steps) ? 'array' : typeof responseData.steps,
    nestedStepsType: nestedSolution
      ? (Array.isArray(nestedSolution.steps) ? 'array' : typeof nestedSolution.steps)
      : 'none',
    stepsCount: solution.steps?.length || 0,
    stepsLatexCount: solution.stepsLatex?.length || 0,
    firstStepPreview: (solution.steps?.[0] || solution.stepsLatex?.[0] || '').slice(0, 140),
    maxNumberedMentionsInSingleStep: Math.max(
      ...((solution.steps || solution.stepsLatex || []).map(step => countNumberedMentions(step))),
      0
    ),
    answerStepLabelCount: countStepLabels(solution.answer),
    finalStepLabelCount: countStepLabels(solution.final),
    nestedKeys: nestedSolution ? Object.keys(nestedSolution) : []
  })

  return hasMathContent ? solution : undefined
}

const resolveAssistantResponse = (
  responseData: AIAskResponse,
  activeCategory: TutorCategory
): { aiResponse: string; mathSolution?: MathTutorSolution } => {
  const mathSolution = parseMathSolution(responseData, activeCategory)

  let aiResponse = 'No response received'
  if (mathSolution?.answer?.trim()) {
    aiResponse = mathSolution.answer.trim()
  } else if (mathSolution?.final?.trim()) {
    aiResponse = mathSolution.final.trim()
  } else if (typeof responseData.answer === 'string' && responseData.answer.trim()) {
    aiResponse = responseData.answer.trim()
  }

  return { aiResponse, mathSolution }
}

const sendMessage = async (text: string) => {
  const activeCategory = selectedCategory.value
  if (!activeCategory) return
  if (!text.trim() || isTyping.value) return
  messages.value.push({ role: 'user', content: text.trim() })
  inputMessage.value = ''
  await nextTick()
  scrollToBottom()
  isTyping.value = true

  const response = await sendChatMessage({
    question: text.trim(),
    subject: activeCategory,
    category: activeCategory
  })
  isTyping.value = false

  if (response.success && response.data) {
    const { aiResponse, mathSolution } = resolveAssistantResponse(response.data, activeCategory)
    const hasStructuredContent = Boolean(response.data.diagram || response.data.mechanism_steps?.length || mathSolution)

    logMathStepReveal('before-render-assistant-message', {
      hasStructuredContent,
      hasMathSolution: Boolean(mathSolution),
      aiResponseLength: aiResponse.length,
      answerStepLabelCount: countStepLabels(mathSolution?.answer),
      finalStepLabelCount: countStepLabels(mathSolution?.final),
      stepsCount: mathSolution?.steps?.length || 0,
      stepsLatexCount: mathSolution?.stepsLatex?.length || 0
    })

    if (hasStructuredContent) {
      const shouldBypassStreamingForMath = Boolean(mathSolution)

      messages.value.push({
        role: 'assistant',
        content: shouldBypassStreamingForMath ? aiResponse : '',
        isStreaming: shouldBypassStreamingForMath ? false : true,
        revealedMathSteps: 0,
        mathSolution,
        diagram: response.data.diagram,
        mechanismSteps: response.data.mechanism_steps,
        showDiagram: false,
        showMechanismSteps: false,
        subject: response.data.subject || activeCategory,
        category: response.data.category || activeCategory
      })

      if (!shouldBypassStreamingForMath) {
        await typeWriterEffect(aiResponse, () => {
          const lastMsg = messages.value[messages.value.length - 1]
          if (lastMsg && lastMsg.isStreaming) {
            lastMsg.content = aiResponse
            lastMsg.isStreaming = false
            nextTick(() => renderMathInMessages())
          }
        })
      } else {
        await nextTick()
        renderMathInMessages()
      }

      const lastMsg = messages.value[messages.value.length - 1]
      if (lastMsg?.role === 'assistant') {
        if (lastMsg.diagram) {
          await wait(550)
          lastMsg.showDiagram = true
          await nextTick()
          scrollToBottom()
        }

        if (lastMsg.mechanismSteps?.length) {
          await wait(550)
          lastMsg.showMechanismSteps = true
          await nextTick()
          scrollToBottom()
        }
      }
    } else {
      messages.value.push({ role: 'assistant', content: '', isStreaming: true, revealedMathSteps: 0, mathSolution })
      await typeWriterEffect(aiResponse, () => {
        const lastMsg = messages.value[messages.value.length - 1]
        if (lastMsg && lastMsg.isStreaming) {
          lastMsg.content = aiResponse
          lastMsg.isStreaming = false
          nextTick(() => renderMathInMessages())
        }
      })

    }
  } else {
    messages.value.push({ role: 'assistant', content: `Error: ${response.error || 'Failed to connect'}` })
  }
  await nextTick()
  scrollToBottom()
}

const clearInput = () => { inputMessage.value = '' }

const scrollToBottom = () => {
  messageListRef.value?.scrollToBottom()
}

const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const typeWriterEffect = async (text: string, onComplete: () => void) => {
  const words = text.split(' ')
  const lastIndex = messages.value.length - 1
  for (let i = 0; i < words.length; i++) {
    const currentMsg = messages.value[lastIndex]
    if (currentMsg && currentMsg.isStreaming) {
      currentMsg.content += (i === 0 ? '' : ' ') + words[i]
    }
    await nextTick()
    scrollToBottom()
    const word = words[i]
    let delay = 20
    if (word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) delay = 100
    else if (word.endsWith(',') || word.endsWith(';') || word.endsWith(':')) delay = 50
    await new Promise(resolve => setTimeout(resolve, delay))
  }
  onComplete()
}

const renderMathInMessages = () => {
  if (typeof window === 'undefined') return
  const loadKaTeX = async () => {
    if (!(window as any).katex) {
      await new Promise<void>((resolve) => {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js'
        s.onload = () => resolve()
        document.head.appendChild(s)
      })
      await new Promise<void>((resolve) => {
        const s = document.createElement('script')
        s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js'
        s.onload = () => resolve()
        document.head.appendChild(s)
      })
    }
    await new Promise(r => setTimeout(r, 100))
    const aiMessages = document.querySelectorAll('.ai-message')
    aiMessages.forEach((el) => {
      const element = el as HTMLElement
      if (!element.dataset.mathRendered) {
        element.dataset.mathRendered = 'true'
        const autoRender = (window as any).renderMathInElement
        if (autoRender) {
          autoRender(element, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\[', right: '\\]', display: true },
              { left: '\\(', right: '\\)', display: false }
            ],
            throwOnError: false,
            errorColor: '#ff6b6b'
          })
        }
      }
    })
  }
  loadKaTeX()
}
</script>

<style>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.22s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.katex { color: #e97860 !important; font-size: 1.06em; }
.katex-display {
  margin: 0.9em 0;
  padding: 0.5em;
  background: rgba(163, 94, 71, 0.08);
  border: 1px solid rgba(163, 94, 71, 0.15);
  border-radius: 0.55rem;
  overflow-x: auto;
}
.katex-display > .katex { color: #f0f0f5 !important; }

.ai-message {
  line-height: 1.72;
  font-size: 0.875rem;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.ai-message h1,
.ai-message h2,
.ai-message h3,
.ai-message h4 {
  color: #f0f0f5;
  font-weight: 700;
  margin-top: 0.72em;
  margin-bottom: 0.38em;
}
.ai-message h1 { font-size: 1.16em; }
.ai-message h2 { font-size: 1.08em; }
.ai-message h3 { font-size: 1em; }
.ai-message p { margin-bottom: 0.5em; }
.ai-message p:last-child { margin-bottom: 0; }
.ai-message ul,
.ai-message ol { margin-left: 1.2em; margin-bottom: 0.5em; }
.ai-message li { margin-bottom: 0.2em; }
.ai-message strong { color: #f0f0f5; font-weight: 600; }
.ai-message em { color: #d0d0d8; }
.ai-message code {
  background: rgba(163, 94, 71, 0.15);
  border: 1px solid rgba(163, 94, 71, 0.22);
  padding: 0.15em 0.3em;
  border-radius: 0.3rem;
  font-size: 0.84em;
}
.ai-message pre {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0.75em;
  border-radius: 0.45rem;
  overflow-x: auto;
  margin: 0.75em 0;
}
.ai-message pre code { background: transparent; padding: 0; font-size: 0.84em; }
.ai-message blockquote {
  border-left: 3px solid #e97860;
  padding-left: 0.75em;
  margin-left: 0;
  color: #a0a0a8;
}
.ai-message hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 0.75em 0; }
.ai-message a { color: #e97860; text-decoration: underline; }
.ai-message table { border-collapse: collapse; width: 100%; margin: 0.75em 0; font-size: 0.84em; }
.ai-message th,
.ai-message td { border: 1px solid rgba(255,255,255,0.1); padding: 0.4em; text-align: left; }
.ai-message th { background: rgba(0,0,0,0.2); }

@media (max-width: 640px) {
  .ai-message { font-size: 0.8125rem; line-height: 1.66; }
  .ai-message pre { padding: 0.65em; margin: 0.6em 0; }
  .ai-message table { font-size: 0.78em; }
}
</style>
