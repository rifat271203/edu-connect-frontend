export type TutorCategory = 'physics' | 'chemistry' | 'math'
import type { MechanismStep, ReactionDiagramData } from '~/types/reactionDiagram'

export interface MathTutorSolution {
  answer?: string
  answerLatex?: string
  steps?: string[]
  stepsLatex?: string[]
  final?: string
  finalLatex?: string
  integrandLatex?: string
  usedChunkIds?: string[]
  confidence?: 'low' | 'medium' | 'high'
  notes?: string
  contextUsed?: boolean
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  revealedMathSteps?: number
  diagram?: ReactionDiagramData
  mechanismSteps?: MechanismStep[]
  mathSolution?: MathTutorSolution
  showDiagram?: boolean
  showMechanismSteps?: boolean
  subject?: TutorCategory
  category?: TutorCategory
}

export interface ChatSession {
  title: string
  messages: Message[]
  timestamp: Date
  category?: TutorCategory
}

export interface QuickPrompt {
  text: string
  icon: string
  tag: string
}
