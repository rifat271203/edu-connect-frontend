<template>
  <div class="h-screen min-h-0 flex flex-col lg:flex-row overflow-hidden" :style="{
    '--bg': '#080c14',
    '--bg2': '#0e1520',
    '--bg3': '#141d2e',
    '--bg4': '#1a2438',
    '--line': 'rgba(255,255,255,0.07)',
    '--line2': 'rgba(255,255,255,0.12)',
    '--gold': '#d4a843',
    '--gold2': '#f0c46a',
    '--gold-dim': 'rgba(212,168,67,0.12)',
    '--gold-glow': 'rgba(212,168,67,0.25)',
    '--teal': '#2dd4bf',
    '--teal-dim': 'rgba(45,212,191,0.1)',
    '--text': '#e8eaf0',
    '--text2': '#8a93a8',
    '--text3': '#545e72'
  }" as any>
    <!-- Desktop Sidebar -->
    <AiTutorSidebar
      :chat-history="chatHistory"
      :current-chat-index="currentChatIndex"
      :selected-category="selectedCategory"
      :format-date="formatDate"
      :get-chat-preview="getChatPreview"
      @clear-all="clearAllChats"
      @new-chat="startNewChat"
      @load-chat="loadChat"
      @delete-chat="deleteChat"
      @set-category="setCategory"
    />

    <!-- Main Content -->
    <div class="flex-1 min-w-0 min-h-0 flex flex-col bg-[var(--bg)]" style="background-image: repeating-linear-gradient(0deg, rgba(212,168,67,0.03) 0px, rgba(212,168,67,0.03) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, rgba(212,168,67,0.03) 0px, rgba(212,168,67,0.03) 1px, transparent 1px, transparent 48px);">
      <!-- Mobile Header -->
      <div class="lg:hidden h-14 border-b flex items-center px-3 gap-2 flex-shrink-0" :style="{ borderColor: 'var(--line)' }">
        <!-- Back Button -->
        <button @click="handleMobileBack" class="w-9 h-9 flex items-center justify-center rounded-[8px] flex-shrink-0" :style="{ background: 'var(--bg3)', border: '1px solid', borderColor: 'var(--line)', color: 'var(--text)' }">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Mobile Subject Selector -->
        <div class="flex gap-1.5 overflow-x-auto flex-1 min-w-0">
          <button
            v-for="subject in mobileSubjects"
            :key="subject.value"
            @click="setCategory(subject.value)"
            class="px-2.5 py-1 rounded-full text-[10px] uppercase font-medium border transition-all duration-150 whitespace-nowrap flex-shrink-0"
            :style="{
              background: selectedCategory === subject.value ? subject.activeColor : subject.bgColor,
              color: selectedCategory === subject.value ? subject.textColor : subject.textColor,
              borderColor: selectedCategory === subject.value ? subject.borderColor : subject.borderColor,
              fontFamily: 'DM Mono'
            }"
          >
            {{ subject.label }}
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="isMobileSidebarOpen = !isMobileSidebarOpen" class="w-9 h-9 flex items-center justify-center rounded-[8px] flex-shrink-0" :style="{ background: 'var(--bg3)', border: '1px solid', borderColor: 'var(--line)', color: 'var(--text)' }">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Desktop Topbar -->
      <div class="hidden lg:flex h-16 border-b items-center px-7 gap-4 flex-shrink-0" :style="{ borderColor: 'var(--line)' }">
        <!-- Subject Badge -->
        <div v-if="selectedCategory" class="flex items-center gap-3 px-3.5 py-2" style="background: var(--bg3); borderRadius: '30px'; border: '1px solid'; borderColor: 'var(--line2)'; gap: '12px'">
          <div class="w-6 h-6 flex items-center justify-center rounded" :style="{ background: 'var(--gold-dim)', borderRadius: '6px' }">
            <span class="text-lg">{{ getCategoryEmoji(selectedCategory) }}</span>
          </div>
          <span class="text-[11px] uppercase tracking-[0.3px]" style="color: 'var(--text3)'">Tutor mode ·</span>
          <strong class="text-xs font-medium" style="color: 'var(--gold2)', fontFamily: 'DM Mono'">{{ selectedCategoryLabel }}</strong>
        </div>

        <!-- Center Info -->
        <div v-if="selectedCategory" class="text-xs ml-auto mr-auto" style="color: 'var(--text3)', fontFamily: 'DM Mono'">
          {{ messages.length }} messages · LaTeX on
        </div>

        <!-- Action Buttons -->
        <div class="ml-auto flex gap-2">
          <button class="w-9 h-9 flex items-center justify-center rounded-[10px]" :style="{ background: 'var(--bg3)', border: '1px solid', borderColor: 'var(--line)', color: 'var(--text3)' }" title="Save">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8H3m9 0h9" /></svg>
          </button>
          <button class="w-9 h-9 flex items-center justify-center rounded-[10px]" :style="{ background: 'var(--bg3)', border: '1px solid', borderColor: 'var(--line)', color: 'var(--text3)' }" title="Copy">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
          <button @click="clearChat" class="w-9 h-9 flex items-center justify-center rounded-[10px]" :style="{ background: 'var(--bg3)', border: '1px solid', borderColor: 'var(--line)', color: 'var(--text3)' }" title="Delete">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>

      <!-- Chat Area -->
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

      <div v-else class="flex-1 flex items-center justify-center px-4 lg:px-7 py-12">
        <div class="text-center">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" :style="{ background: 'var(--gold-dim)', border: '1px solid', borderColor: 'rgba(212,168,67,0.25)' }">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="color: 'var(--gold)'"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-3.636 6.364l-.707.707M9 19.071A9.003 9.003 0 0012 20.07m0 0a9.003 9.003 0 003 -.07" /></svg>
          </div>
          <p class="text-sm font-medium" style="color: 'var(--text)'; fontFamily: 'DM Sans'">Select a subject to start</p>
        </div>
      </div>

      <!-- Input Composer -->
      <AiTutorComposer
        v-model="inputMessage"
        :disabled="isTyping || !selectedCategory"
        :placeholder="composerPlaceholder"
        @send="sendMessage"
        @clear="clearInput"
      />
    </div>

    <!-- Mobile Sidebar Drawer -->
    <teleport v-if="isMobileSidebarOpen" to="body">
      <!-- Overlay -->
      <div
        class="fixed inset-0 bg-black/60 z-40 lg:hidden"
        @click="isMobileSidebarOpen = false"
      />
      <!-- Drawer -->
      <div class="fixed inset-y-0 left-0 w-64 flex flex-col z-50 lg:hidden border-r" :style="{ background: 'var(--bg2)', borderColor: 'var(--line)' }">
        <!-- Close Button -->
        <div class="flex items-center justify-between px-5 py-4 border-b" :style="{ borderColor: 'var(--line)' }">
          <h2 class="text-base font-bold text-white" style="fontFamily: 'Syne, sans-serif'">AI Tutor</h2>
          <button
            @click="isMobileSidebarOpen = false"
            class="w-8 h-8 flex items-center justify-center rounded-[8px]"
            :style="{ background: 'var(--bg3)', color: 'var(--text)' }"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- New Session Button -->
        <div class="px-5 py-3 border-b" :style="{ borderColor: 'var(--line)' }">
          <button
            @click="startNewChat; isMobileSidebarOpen = false"
            class="w-full px-3 py-2.5 rounded-[10px] text-sm font-medium flex items-center justify-center gap-2 transition-all duration-150"
            :style="{ 
              background: 'var(--gold-dim)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--gold2)',
              fontFamily: 'DM Sans'
            }"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New session
          </button>
        </div>

        <!-- History List -->
        <div class="flex-1 overflow-y-auto px-3 py-2 space-y-1 thin-scrollbar" style="scrollbarWidth: 'thin'">
          <!-- Group Label -->
          <div v-if="chatHistory.length > 0" class="px-2 py-3 text-[10px] uppercase font-medium tracking-[1px]" style="color: 'var(--text3)', fontFamily: 'DM Mono'">
            Recent
          </div>

          <!-- History Items -->
          <div v-for="(chat, index) in chatHistory" :key="index" class="group">
            <button
              @click="loadChat(index); isMobileSidebarOpen = false"
              class="w-full text-left px-2.5 py-2.5 rounded-[10px] transition-all duration-150 border"
              :style="{
                background: currentChatIndex === index ? 'var(--bg4)' : 'transparent',
                borderColor: currentChatIndex === index ? 'var(--line2)' : 'transparent'
              }"
            >
              <p class="text-sm font-medium truncate" style="color: 'var(--text)', fontFamily: 'DM Sans'">{{ chat.title || 'New Chat' }}</p>
              <div class="flex items-center gap-1.5 mt-1">
                <div class="w-2 h-2 rounded-full flex-shrink-0" :style="{ background: getSubjectColor(chat.category) }"></div>
                <p class="text-[11px] truncate" style="color: 'var(--text3)', fontFamily: 'DM Mono'">{{ chat.category }} · {{ formatDate(chat.timestamp) }}</p>
              </div>
            </button>
            <!-- Delete Button for Mobile -->
            <button
              @click.stop="deleteChat(index)"
              class="ml-auto mt-1 mr-2 px-2 py-1 rounded text-[10px]"
              :style="{ background: 'rgba(255,0,0,0.1)', color: 'rgba(255,100,100,0.8)', border: '1px solid rgba(255,100,100,0.2)' }"
              title="Delete chat"
            >
              Delete
            </button>
          </div>

          <!-- Empty State -->
          <div v-if="chatHistory.length === 0" class="text-center py-8 px-2">
            <p class="text-xs font-medium" style="color: 'var(--text2)', fontFamily: 'DM Sans'">No history yet</p>
            <p class="text-[11px] mt-1" style="color: 'var(--text3)', fontFamily: 'DM Mono'">Start a new session to begin</p>
          </div>
        </div>

        <!-- Footer Button -->
        <div class="px-3 py-4 border-t" :style="{ borderColor: 'var(--line)' }">
          <button
            @click="clearAllChats; isMobileSidebarOpen = false"
            class="w-full px-3 py-2 text-xs font-medium rounded-lg transition-colors"
            :style="{ 
              background: 'rgba(255,255,255,0.05)',
              color: 'var(--text3)',
              border: '1px solid var(--line)',
              fontFamily: 'DM Sans'
            }"
          >
            Clear all
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'main' })
import { useUserStore } from '~/stores/user'
import { sendChatMessage, type AIAskResponse } from '~/services/api/chat'
import { AI_TUTOR_PROMPTS_BY_CATEGORY } from '~/constants/aiTutorPrompts'
import type {
  ChatSession,
  ChemistryTutorSolution,
  MathTutorSolution,
  Message,
  PhysicsTutorSolution,
  TutorCategory,
  TutorStep,
} from '~/types/aiTutor'
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
const isMobileSidebarOpen = ref(false)

// Mobile subjects configuration
const mobileSubjects = [
  {
    value: 'physics' as TutorCategory,
    label: 'Physics',
    bgColor: 'rgba(45,212,191,0.1)',
    activeColor: 'rgba(45,212,191,0.25)',
    textColor: '#2dd4bf',
    borderColor: 'rgba(45,212,191,0.2)'
  },
  {
    value: 'chemistry' as TutorCategory,
    label: 'Chemistry',
    bgColor: 'rgba(212,168,67,0.12)',
    activeColor: 'rgba(212,168,67,0.25)',
    textColor: '#f0c46a',
    borderColor: 'rgba(212,168,67,0.25)'
  },
  {
    value: 'math' as TutorCategory,
    label: 'Math',
    bgColor: 'rgba(139,92,246,0.1)',
    activeColor: 'rgba(139,92,246,0.2)',
    textColor: '#c4b5fd',
    borderColor: 'rgba(139,92,246,0.2)'
  }
]

const getSubjectColor = (category: TutorCategory | undefined): string => {
  if (!category) return 'var(--text3)'
  const colors: Record<TutorCategory, string> = {
    physics: '#2dd4bf',
    chemistry: '#d4a843',
    math: '#c4b5fd'
  }
  return colors[category]
}

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

const getCategoryEmoji = (category: TutorCategory | null): string => {
  if (!category) return '🧪'
  const emojis: Record<TutorCategory, string> = {
    physics: '⚛️',
    chemistry: '⚗️',
    math: '∑'
  }
  return emojis[category]
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

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is string => typeof item === 'string')
    .map(item => item.trim())
    .filter(Boolean)
}

const toTutorSteps = (value: unknown): TutorStep[] => {
  if (!Array.isArray(value)) return []

  return value
    .map((item): TutorStep | null => {
      if (typeof item === 'string') {
        const work = item.trim()
        if (!work) return null
        return { title: 'Step', work }
      }

      if (!item || typeof item !== 'object') return null

      const raw = item as Record<string, unknown>
      const title = typeof raw.title === 'string' ? raw.title.trim() : ''
      const work = typeof raw.work === 'string'
        ? raw.work.trim()
        : typeof raw.step === 'string'
          ? raw.step.trim()
          : ''
      const result = typeof raw.result === 'string' ? raw.result.trim() : ''

      if (!title && !work && !result) return null

      return {
        title: title || 'Step',
        work: work || result || title,
        result: result || undefined,
      }
    })
    .filter((step): step is TutorStep => Boolean(step))
}

const toBooleanOrUndefined = (value: unknown): boolean | undefined => {
  return typeof value === 'boolean' ? value : undefined
}

const toCategory = (value: unknown): TutorCategory | undefined => {
  if (value === 'math' || value === 'physics' || value === 'chemistry') return value
  return undefined
}

const normalizeCategoryText = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim().toLowerCase()
}

const inferCategoryFromResponse = (responseData: AIAskResponse, fallback: TutorCategory): TutorCategory => {
  const subject = toCategory(responseData.subject)
  if (subject) return subject

  const category = toCategory(responseData.category)
  if (category) return category

  const categoryHint = `${normalizeCategoryText(responseData.subject)} ${normalizeCategoryText(responseData.category)}`
  if (categoryHint.includes('chem')) return 'chemistry'
  if (categoryHint.includes('organic')) return 'chemistry'
  if (categoryHint.includes('phys')) return 'physics'
  if (categoryHint.includes('math')) return 'math'

  return fallback
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
    steps: toTutorSteps(responseData.steps),
    final_answer: typeof responseData.final_answer === 'string' ? responseData.final_answer : undefined,
    graph_hint: typeof responseData.graph_hint === 'string' ? responseData.graph_hint : null,
    contextUsed: toBooleanOrUndefined(responseData.contextUsed),
  }

  if (nestedSolution) {
    if (typeof nestedSolution.answer === 'string') solution.answer = nestedSolution.answer
    if (Array.isArray(nestedSolution.steps)) solution.steps = toTutorSteps(nestedSolution.steps)
    if (typeof nestedSolution.final_answer === 'string') solution.final_answer = nestedSolution.final_answer
    if (typeof nestedSolution.graph_hint === 'string') solution.graph_hint = nestedSolution.graph_hint
    if (typeof nestedSolution.contextUsed === 'boolean') solution.contextUsed = nestedSolution.contextUsed
  }

  const hasMathContent = Boolean(
    solution.answer ||
    solution.steps?.length ||
    solution.final_answer ||
    solution.graph_hint ||
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
    firstStepPreview: (solution.steps?.[0]?.work || '').slice(0, 140),
    maxNumberedMentionsInSingleStep: Math.max(
      ...(solution.steps || []).map(step => countNumberedMentions(step.work)),
      0
    ),
    answerStepLabelCount: countStepLabels(solution.answer),
    finalStepLabelCount: countStepLabels(solution.final_answer),
    nestedKeys: nestedSolution ? Object.keys(nestedSolution) : []
  })

  return hasMathContent ? solution : undefined
}

const parsePhysicsSolution = (responseData: AIAskResponse, activeCategory: TutorCategory): PhysicsTutorSolution | undefined => {
  if (activeCategory !== 'physics') return undefined

  const answerPayload = responseData.answer
  const nestedSolution =
    typeof answerPayload === 'object' && answerPayload !== null && !Array.isArray(answerPayload)
      ? (answerPayload as Record<string, unknown>)
      : null

  const given = Array.isArray(responseData.given)
    ? responseData.given
      .map((item) => {
        const symbol = typeof item?.symbol === 'string' ? item.symbol.trim() : ''
        const value = typeof item?.value === 'string' ? item.value.trim() : ''
        const unit = typeof item?.unit === 'string' ? item.unit.trim() : ''
        const description = typeof item?.description === 'string' ? item.description.trim() : ''
        if (!symbol && !value && !unit && !description) return null
        return { symbol, value, unit, description }
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
    : []

  const solution: PhysicsTutorSolution = {
    answer: typeof answerPayload === 'string' ? answerPayload : undefined,
    given: given.length ? given : undefined,
    formula: typeof responseData.formula === 'string' ? responseData.formula : undefined,
    law_or_principle: typeof responseData.law_or_principle === 'string' ? responseData.law_or_principle : undefined,
    steps: toTutorSteps(responseData.steps),
    final_answer: typeof responseData.final_answer === 'string' ? responseData.final_answer : undefined,
    diagram_hint: typeof responseData.diagram_hint === 'string' ? responseData.diagram_hint : null,
    contextUsed: toBooleanOrUndefined(responseData.contextUsed),
  }

  if (nestedSolution) {
    if (typeof nestedSolution.answer === 'string') solution.answer = nestedSolution.answer
    if (Array.isArray(nestedSolution.steps)) solution.steps = toTutorSteps(nestedSolution.steps)
    if (typeof nestedSolution.formula === 'string') solution.formula = nestedSolution.formula
    if (typeof nestedSolution.law_or_principle === 'string') solution.law_or_principle = nestedSolution.law_or_principle
    if (typeof nestedSolution.final_answer === 'string') solution.final_answer = nestedSolution.final_answer
    if (typeof nestedSolution.diagram_hint === 'string') solution.diagram_hint = nestedSolution.diagram_hint
    if (typeof nestedSolution.contextUsed === 'boolean') solution.contextUsed = nestedSolution.contextUsed
  }

  const hasPhysicsContent = Boolean(
    solution.answer ||
    solution.given?.length ||
    solution.formula ||
    solution.law_or_principle ||
    solution.steps?.length ||
    solution.final_answer ||
    solution.diagram_hint ||
    solution.contextUsed !== undefined
  )

  return hasPhysicsContent ? solution : undefined
}

const parseChemistrySolution = (responseData: AIAskResponse, activeCategory: TutorCategory): ChemistryTutorSolution | undefined => {
  if (activeCategory !== 'chemistry') return undefined

  const answerPayload = responseData.answer
  const nestedSolution =
    typeof answerPayload === 'object' && answerPayload !== null && !Array.isArray(answerPayload)
      ? (answerPayload as Record<string, unknown>)
      : null

  const solution: ChemistryTutorSolution = {
    answer: typeof answerPayload === 'string' ? answerPayload : undefined,
    is_conversion: toBooleanOrUndefined(responseData.is_conversion),
    question_mode: typeof responseData.question_mode === 'string' ? responseData.question_mode : undefined,
    reaction_type: responseData.reaction_type,
    substrate_class: responseData.substrate_class,
    carbon_change: responseData.carbon_change,
    detected_language: responseData.detected_language,
    contextUsed: toBooleanOrUndefined(responseData.contextUsed),
    diagram: responseData.diagram,
    mechanism_steps: responseData.mechanism_steps,
    key_points: toStringArray(responseData.key_points),
    equations: toStringArray(responseData.equations),
    diagram_caption: typeof responseData.diagram_caption === 'string' ? responseData.diagram_caption : undefined,
    resonance: responseData.resonance,
    // New fields from backend response format
    overview: responseData.overview,
    tags: toStringArray(responseData.tags),
    metadata: responseData.metadata,
    reaction_pathway: responseData.reaction_pathway,
    steps: responseData.steps,
    related_concepts: toStringArray(responseData.related_concepts),
    warning_or_tip: typeof responseData.warning_or_tip === 'string' ? responseData.warning_or_tip : undefined,
  }

  if (nestedSolution) {
    if (typeof nestedSolution.answer === 'string') solution.answer = nestedSolution.answer
    if (typeof nestedSolution.is_conversion === 'boolean') solution.is_conversion = nestedSolution.is_conversion
    if (typeof nestedSolution.question_mode === 'string') solution.question_mode = nestedSolution.question_mode
    if (typeof nestedSolution.reaction_type === 'string') solution.reaction_type = nestedSolution.reaction_type as ChemistryTutorSolution['reaction_type']
    if (typeof nestedSolution.substrate_class === 'string') solution.substrate_class = nestedSolution.substrate_class as ChemistryTutorSolution['substrate_class']
    if (typeof nestedSolution.carbon_change === 'string') solution.carbon_change = nestedSolution.carbon_change as ChemistryTutorSolution['carbon_change']
    if (typeof nestedSolution.detected_language === 'string') solution.detected_language = nestedSolution.detected_language as ChemistryTutorSolution['detected_language']
    if (Array.isArray(nestedSolution.key_points)) solution.key_points = toStringArray(nestedSolution.key_points)
    if (Array.isArray(nestedSolution.equations)) solution.equations = toStringArray(nestedSolution.equations)
    if (typeof nestedSolution.diagram_caption === 'string') solution.diagram_caption = nestedSolution.diagram_caption
    if (typeof nestedSolution.contextUsed === 'boolean') solution.contextUsed = nestedSolution.contextUsed
    if (nestedSolution.resonance && typeof nestedSolution.resonance === 'object') {
      solution.resonance = nestedSolution.resonance as ChemistryTutorSolution['resonance']
    }
    // New fields from nested solution
    if (nestedSolution.overview && typeof nestedSolution.overview === 'object') {
      solution.overview = nestedSolution.overview as ChemistryTutorSolution['overview']
    }
    if (Array.isArray(nestedSolution.tags)) solution.tags = toStringArray(nestedSolution.tags)
    if (nestedSolution.metadata && typeof nestedSolution.metadata === 'object') {
      solution.metadata = nestedSolution.metadata as ChemistryTutorSolution['metadata']
    }
    if (nestedSolution.reaction_pathway && typeof nestedSolution.reaction_pathway === 'object') {
      solution.reaction_pathway = nestedSolution.reaction_pathway as ChemistryTutorSolution['reaction_pathway']
    }
    if (Array.isArray(nestedSolution.steps)) solution.steps = nestedSolution.steps as ChemistryTutorSolution['steps']
    if (Array.isArray(nestedSolution.related_concepts)) solution.related_concepts = toStringArray(nestedSolution.related_concepts)
    if (typeof nestedSolution.warning_or_tip === 'string') solution.warning_or_tip = nestedSolution.warning_or_tip
  }

  const hasChemistryContent = Boolean(
    solution.answer ||
    solution.is_conversion !== undefined ||
    solution.question_mode ||
    solution.diagram ||
    solution.mechanism_steps?.length ||
    solution.reaction_type ||
    solution.substrate_class ||
    solution.carbon_change ||
    solution.detected_language ||
    solution.key_points?.length ||
    solution.equations?.length ||
    solution.diagram_caption ||
    solution.resonance ||
    solution.contextUsed !== undefined ||
    solution.overview ||
    solution.tags?.length ||
    solution.metadata ||
    solution.reaction_pathway?.compounds?.length ||
    solution.steps?.length ||
    solution.related_concepts?.length ||
    solution.warning_or_tip
  )

  return hasChemistryContent ? solution : undefined
}

const resolveAssistantResponse = (
  responseData: AIAskResponse,
  activeCategory: TutorCategory
): {
  aiResponse: string
  resolvedCategory: TutorCategory
  mathSolution?: MathTutorSolution
  physicsSolution?: PhysicsTutorSolution
  chemistrySolution?: ChemistryTutorSolution
} => {
  const resolvedCategory = inferCategoryFromResponse(responseData, activeCategory)

  const chemistrySolution = parseChemistrySolution(responseData, resolvedCategory)
  const physicsSolution = parsePhysicsSolution(responseData, resolvedCategory)
  const mathSolution = parseMathSolution(responseData, activeCategory)

  let aiResponse = 'No response received'
  if (chemistrySolution?.answer?.trim()) {
    aiResponse = chemistrySolution.answer.trim()
  } else if (physicsSolution?.answer?.trim()) {
    aiResponse = physicsSolution.answer.trim()
  } else if (mathSolution?.answer?.trim()) {
    aiResponse = mathSolution.answer.trim()
  } else if (mathSolution?.final_answer?.trim()) {
    aiResponse = mathSolution.final_answer.trim()
  } else if (physicsSolution?.final_answer?.trim()) {
    aiResponse = physicsSolution.final_answer.trim()
  } else if (typeof responseData.answer === 'string' && responseData.answer.trim()) {
    aiResponse = responseData.answer.trim()
  }

  return {
    aiResponse,
    resolvedCategory,
    chemistrySolution,
    physicsSolution,
    mathSolution,
  }
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
    const {
      aiResponse,
      chemistrySolution,
      mathSolution,
      physicsSolution,
      resolvedCategory,
    } = resolveAssistantResponse(response.data, activeCategory)

    const hasStructuredContent = Boolean(
      chemistrySolution ||
      physicsSolution ||
      mathSolution ||
      response.data.diagram ||
      response.data.mechanism_steps?.length ||
      response.data.reaction_pathway?.compounds?.length ||
      response.data.steps?.length
    )

    logMathStepReveal('before-render-assistant-message', {
      hasStructuredContent,
      hasMathSolution: Boolean(mathSolution),
      hasPhysicsSolution: Boolean(physicsSolution),
      hasChemistrySolution: Boolean(chemistrySolution),
      aiResponseLength: aiResponse.length,
      answerStepLabelCount: countStepLabels(mathSolution?.answer),
      finalStepLabelCount: countStepLabels(mathSolution?.final_answer),
      stepsCount: mathSolution?.steps?.length || 0,
    })

    if (hasStructuredContent) {
      const shouldBypassStreaming = Boolean(mathSolution || chemistrySolution || physicsSolution)

      messages.value.push({
        role: 'assistant',
        content: shouldBypassStreaming ? aiResponse : '',
        isStreaming: shouldBypassStreaming ? false : true,
        revealedMathSteps: 0,
        mathSolution,
        chemistrySolution,
        physicsSolution,
        diagram: chemistrySolution?.diagram || response.data.diagram,
        mechanismSteps: chemistrySolution?.mechanism_steps || response.data.mechanism_steps,
        showDiagram: false,
        showMechanismSteps: false,
        subject: response.data.subject || resolvedCategory,
        category: response.data.category || resolvedCategory
      })

      if (!shouldBypassStreaming) {
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
      messages.value.push({
        role: 'assistant',
        content: '',
        isStreaming: true,
        revealedMathSteps: 0,
        mathSolution,
        physicsSolution,
        chemistrySolution,
        subject: response.data.subject || resolvedCategory,
        category: response.data.category || resolvedCategory,
      })
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

.katex { color: var(--gold) !important; font-size: 1.06em; }
.katex-display {
  margin: 0.9em 0;
  padding: 0.5em;
  background: var(--gold-dim);
  border: 1px solid var(--line-gold);
  border-radius: 0.55rem;
  overflow-x: auto;
}
.katex-display > .katex { color: var(--t1) !important; }

.ai-message {
  line-height: 1.72;
  font-size: 0.875rem;
  word-break: break-word;
  overflow-wrap: anywhere;
}
.ai-message img,
.ai-message svg,
.ai-message iframe,
.ai-message video {
  max-width: 100%;
}
.ai-message h1,
.ai-message h2,
.ai-message h3,
.ai-message h4 {
  color: var(--t1);
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
.ai-message strong { color: var(--t1); font-weight: 600; }
.ai-message em { color: var(--t2); }
.ai-message code {
  background: var(--gold-dim);
  border: 1px solid var(--line-gold);
  padding: 0.15em 0.3em;
  border-radius: 0.3rem;
  font-size: 0.84em;
}
.ai-message pre {
  background: var(--surface2);
  border: 1px solid var(--line);
  padding: 0.75em;
  border-radius: 0.45rem;
  overflow-x: auto;
  margin: 0.75em 0;
}
.ai-message pre code { background: transparent; padding: 0; font-size: 0.84em; }
.ai-message blockquote {
  border-left: 3px solid var(--gold);
  padding-left: 0.75em;
  margin-left: 0;
  color: var(--t2);
}
.ai-message hr { border: none; border-top: 1px solid var(--line); margin: 0.75em 0; }
.ai-message a { color: var(--gold); text-decoration: underline; }
.ai-message table { border-collapse: collapse; width: 100%; margin: 0.75em 0; font-size: 0.84em; }
.ai-message th,
.ai-message td { border: 1px solid var(--line); padding: 0.4em; text-align: left; }
.ai-message th { background: var(--surface3); }

@media (max-width: 640px) {
  .ai-message { font-size: 0.8125rem; line-height: 1.66; }
  .ai-message pre { padding: 0.65em; margin: 0.6em 0; }
  .ai-message table { font-size: 0.78em; }
}
</style>
