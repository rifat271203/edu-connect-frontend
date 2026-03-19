import type { MechanismStep, ReactionDiagramData } from '~/types/reactionDiagram'

export type TutorCategory = 'physics' | 'chemistry' | 'math'

export type ReactionType =
  | 'conversion_reaction'
  | 'aromatic_substitution'
  | 'addition_reaction'
  | 'elimination_reaction'
  | 'oxidation_reduction'
  | 'resonance_concept'
  | 'conceptual_theory'
  | 'unknown'

export type SubstrateClass =
  | 'aromatic'
  | 'alkene'
  | 'alkyne'
  | 'alcohol'
  | 'amine'
  | 'acid'
  | 'aldehyde'
  | 'ketone'
  | 'ester'
  | 'unknown'

export type CarbonChange = 'carbon_same' | 'carbon_increase' | 'carbon_decrease' | 'unknown'
export type DetectedLanguage = 'bangla' | 'english' | 'mixed'
export type ChemistryQuestionMode = 'description' | 'equation' | string

export interface TutorStep {
  title: string
  work: string
  result?: string
}

export type TutorSectionType =
  | 'text'
  | 'equation'
  | 'step'
  | 'bullet_points'
  | 'final_answer'
  | 'markdown'

export interface TutorMainAnswer {
  label?: string
  text?: string
  latex?: string
}

export interface TutorSection {
  id?: string
  type: TutorSectionType
  title?: string
  content?: string
  latex?: string
  items?: string[]
  step?: number
  explanation?: string
  equations?: string[]
  result?: string
  result_latex?: string
}

export interface TutorStructuredResponse {
  schema_version?: string
  topic?: string
  method?: string
  main_answer?: TutorMainAnswer
  sections: TutorSection[]
}

export interface TutorStreamProgress {
  showTopic: boolean
  showMethod: boolean
  showMainAnswer: boolean
  revealedSections: number
}

export interface MathTutorSolution {
  answer?: string
  steps?: TutorStep[]
  final_answer?: string
  graph_hint?: string | null
  contextUsed?: boolean
}

export interface PhysicsGivenItem {
  symbol: string
  value: string
  unit: string
  description: string
}

export interface PhysicsTutorSolution {
  answer?: string
  given?: PhysicsGivenItem[]
  formula?: string
  law_or_principle?: string
  steps?: TutorStep[]
  final_answer?: string
  diagram_hint?: string | null
  contextUsed?: boolean
}

export interface ChemistryResonanceForm {
  name: string
  smiles: string
}

export interface ChemistryResonance {
  target?: string
  base?: string
  forms?: ChemistryResonanceForm[]
  arrow_steps?: string[]
  note?: string
}

export interface ChemistryTutorSolution {
  answer?: string
  is_conversion?: boolean
  question_mode?: ChemistryQuestionMode
  reaction_type?: ReactionType
  substrate_class?: SubstrateClass
  carbon_change?: CarbonChange
  detected_language?: DetectedLanguage
  contextUsed?: boolean
  diagram?: ReactionDiagramData
  mechanism_steps?: MechanismStep[]
  key_points?: string[]
  equations?: string[]
  diagram_caption?: string
  resonance?: ChemistryResonance | null
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  revealedMathSteps?: number
  richResponse?: TutorStructuredResponse
  streamProgress?: TutorStreamProgress
  diagram?: ReactionDiagramData
  mechanismSteps?: MechanismStep[]
  mathSolution?: MathTutorSolution
  chemistrySolution?: ChemistryTutorSolution
  physicsSolution?: PhysicsTutorSolution
  showDiagram?: boolean
  showMechanismSteps?: boolean
  subject?: TutorCategory | string
  category?: TutorCategory | string
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
