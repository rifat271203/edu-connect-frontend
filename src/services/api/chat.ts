// Chat API Service
// This file contains AI chat-related API calls

import { apiRequest, type ApiResponse } from './client'
import type {
  ChemistryTutorSolution,
  MathTutorSolution,
  PhysicsTutorSolution,
  TutorMainAnswer,
  TutorSection,
  TutorStructuredResponse,
  ReactionType,
  SubstrateClass,
  TutorCategory,
} from '~/types/aiTutor'
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
  answer?: string | MathTutorSolution | PhysicsTutorSolution | ChemistryTutorSolution | TutorStructuredResponse
  response_schema?: string
  schema_version?: string
  topic?: string
  method?: string
  main_answer?: TutorMainAnswer
  sections?: TutorSection[]
  structured_response?: TutorStructuredResponse
  is_conversion?: boolean
  question_mode?: string
  steps?: Array<string | { title?: string; work?: string; result?: string }>
  final_answer?: string
  graph_hint?: string | null
  given?: Array<{ symbol?: string; value?: string; unit?: string; description?: string }>
  formula?: string
  law_or_principle?: string
  diagram_hint?: string | null
  reaction_type?: ReactionType
  substrate_class?: SubstrateClass
  carbon_change?: 'carbon_same' | 'carbon_increase' | 'carbon_decrease' | 'unknown'
  detected_language?: 'bangla' | 'english' | 'mixed'
  key_points?: string[]
  equations?: string[]
  diagram_caption?: string
  resonance?: ChemistryTutorSolution['resonance']
  contextUsed?: boolean
  diagram?: ReactionDiagramData
  mechanism_steps?: MechanismStep[]
  subject?: TutorCategory
  category?: TutorCategory
}

// Send question to AI Tutor
export const sendChatMessage = async (payload: AIAskRequest): Promise<ApiResponse<AIAskResponse>> => {
  return await apiRequest<AIAskResponse>('/api/ai/ask', 'POST', payload)
}
