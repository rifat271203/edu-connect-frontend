// Chat API Service
// This file contains AI chat-related API calls

import { apiRequest, type ApiResponse } from './client'
import type { MathTutorSolution, TutorCategory } from '~/types/aiTutor'
import type { MechanismStep, ReactionDiagramData } from '~/types/reactionDiagram'

// Types for chat API
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIAskRequest {
  question: string
  subject: TutorCategory
  category: TutorCategory
}

export interface AIAskResponse {
  answer?: string | MathTutorSolution
  answerLatex?: string
  steps?: string[]
  stepsLatex?: string[]
  final?: string
  finalLatex?: string
  integrandLatex?: string
  usedChunkIds?: string[]
  confidence?: 'low' | 'medium' | 'high'
  notes?: string
  contextUsed: boolean
  diagram?: ReactionDiagramData
  mechanism_steps?: MechanismStep[]
  subject?: TutorCategory
  category?: TutorCategory
}

// Send question to AI Tutor
export const sendChatMessage = async (payload: AIAskRequest): Promise<ApiResponse<AIAskResponse>> => {
  return await apiRequest<AIAskResponse>('/api/ai/ask', 'POST', payload)
}
