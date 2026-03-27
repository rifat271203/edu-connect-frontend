export type ReactionRole = 'possible' | 'major' | 'minor'

export interface ReactionItem {
  name: string
  smiles: string
  type?: ReactionRole | string
  role?: string
}

export interface ReactionDiagramData {
  reactants: ReactionItem[]
  reagents: ReactionItem[]
  conditions?: string | string[]
  products: ReactionItem[]
}

export interface MechanismStep {
  step: number
  title: string
  desc: string
  structures: ReactionItem[]
}
