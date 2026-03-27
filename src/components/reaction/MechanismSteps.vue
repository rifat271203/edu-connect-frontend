<template>
  <div class="reaction-diagram rounded-2xl border p-6 md:p-8" :class="surfaceClasses">
    <ClientOnly>
      <div v-for="step in steps" :key="`mechanism-${getStepNumber(step)}`" class="mb-6 last:mb-0">
        <details
          class="rounded-xl border p-4"
          :class="panelClasses"
          :open="stepIsOpen(step)"
        >
          <summary class="list-none cursor-pointer select-none">
            <div class="flex items-start gap-2">
              <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-semibold" :class="stepBadgeClasses">
                {{ getStepNumber(step) }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold" :class="titleClasses">{{ step.title }}</p>
                <p class="mt-1 text-xs" :class="descClasses">{{ step.subtitle || 'Tap to expand step details' }}</p>
              </div>
              <span class="text-xs transition-transform" :class="descClasses" :style="{ transform: stepIsOpen(step) ? 'rotate(0deg)' : 'rotate(-90deg)' }">▼</span>
            </div>
          </summary>

          <p class="mt-3 text-xs leading-relaxed" :class="descClasses">{{ step.desc }}</p>

          <!-- Reaction-style pathway for this step -->
          <div v-if="hasMolecules(step)" class="mt-4">
            <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,400px)_minmax(0,1fr)] gap-8 items-center">
              <!-- Reactants Column -->
              <div class="flex flex-wrap items-start justify-center gap-4 md:gap-5">
                <template v-for="(molecule, index) in getReactants(step)" :key="'react-' + getStepNumber(step) + '-' + index">
                  <MoleculeCard
                    :item="{ name: molecule.name, smiles: molecule.smiles || '', role: molecule.role }"
                    :theme="theme"
                    :svg="svgBySmiles?.get(molecule.smiles || '')"
                    :error-message="errorsBySmiles?.get(molecule.smiles || '')"
                  />
                  <span v-if="index < getReactants(step).length - 1" class="self-center text-2xl font-semibold" :class="mutedTextClasses">+</span>
                </template>
              </div>

              <!-- Middle Column: Reagent Chips + Conditions Box -->
              <div class="relative flex flex-col items-center justify-center min-h-[200px] px-4">
                <!-- Reagent Chips (if any) -->
                <div v-if="getReagents(step).length" class="absolute -top-2 left-1/2 -translate-x-1/2 w-full max-w-[360px] flex flex-wrap justify-center gap-2">
                  <span
                    v-for="(reagent, index) in getReagents(step)"
                    :key="'reagent-' + getStepNumber(step) + '-' + index"
                    class="inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-medium whitespace-nowrap"
                    :class="chipClasses"
                  >
                    {{ reagent.name }}
                  </span>
                </div>

                <!-- Conditions Box (with pt-6 like arrow container) -->
                <div v-if="step.conditions" class="w-full flex items-center justify-center pt-6">
                  <div class="w-full max-w-[320px] p-4 rounded-xl border text-center transition-all" :class="conditionsBoxClasses">
                    <p class="text-sm font-medium leading-relaxed" :style="{ fontFamily: 'DM Mono' }">
                      {{ step.conditions }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Products Column -->
              <div class="flex flex-wrap items-start justify-center gap-4 md:gap-5">
                <template v-for="(molecule, index) in getProducts(step)" :key="'prod-' + getStepNumber(step) + '-' + index">
                  <MoleculeCard
                    :item="{ name: molecule.name, smiles: molecule.smiles || '', role: molecule.role, type: molecule.type }"
                    :theme="theme"
                    :svg="svgBySmiles?.get(molecule.smiles || '')"
                    :error-message="errorsBySmiles?.get(molecule.smiles || '')"
                  >
                    <span
                      v-if="productBadge(molecule.type)"
                      class="mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
                      :class="badgeClasses(productBadge(molecule.type)!)"
                    >
                      {{ productBadge(molecule.type) }}
                    </span>
                  </MoleculeCard>
                  <span v-if="index < getProducts(step).length - 1" class="self-center text-2xl font-semibold" :class="mutedTextClasses">+</span>
                </template>
              </div>
            </div>
          </div>
        </details>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MoleculeCard from './MoleculeCard.vue'
import type { MechanismStep, ReactionItem } from '~/types/reactionDiagram'
import type { SmilesTheme } from '~/utils/smilesSvg'

type RawMechanismStructure = {
  name?: string
  smiles?: string
  smile?: string
  type?: string
  role?: string
}

type RawMechanismStep = {
  molecules?: RawMechanismStructure[]
  structures?: RawMechanismStructure[]
  moleculeState?: RawMechanismStructure[]
  molecule_state?: RawMechanismStructure[]
  conditions?: string
}

const props = defineProps<{
  steps: MechanismStep[]
  theme: SmilesTheme
  svgBySmiles?: Map<string, string>
  errorsBySmiles?: Map<string, string>
}>()

// Parse all structures/molecules from a step
const getAllMolecules = (step: MechanismStep): ReactionItem[] => {
  const rawStep = step as unknown as RawMechanismStep
  let structures: RawMechanismStructure[] = []

  if (Array.isArray(rawStep.molecules)) {
    structures = rawStep.molecules
  } else if (Array.isArray(rawStep.structures)) {
    structures = rawStep.structures
  } else if (Array.isArray(rawStep.moleculeState)) {
    structures = rawStep.moleculeState
  } else if (Array.isArray(rawStep.molecule_state)) {
    structures = rawStep.molecule_state
  }

  return structures
    .map((item): ReactionItem | null => {
      const smiles = (item.smiles ?? item.smile ?? '').trim()
      if (!smiles) return null
      return {
        name: item.name || 'Molecule',
        smiles,
        type: item.type,
        role: item.role,
      }
    })
    .filter((item): item is ReactionItem => item !== null)
}

// Get reactants only
const getReactants = (step: MechanismStep): ReactionItem[] => {
  return getAllMolecules(step).filter(
    item => item.role?.toLowerCase() === 'reactant'
  )
}

// Get reagents only
const getReagents = (step: MechanismStep): ReactionItem[] => {
  return getAllMolecules(step).filter(
    item => item.role?.toLowerCase() === 'reagent'
  )
}

// Get products only
const getProducts = (step: MechanismStep): ReactionItem[] => {
  return getAllMolecules(step).filter(
    item => item.role?.toLowerCase() === 'product'
  )
}

// Check if step has any molecules
const hasMolecules = (step: MechanismStep): boolean => {
  return getAllMolecules(step).length > 0
}

// Check if step has reagents
const hasReagents = (step: MechanismStep): boolean => {
  return getReagents(step).length > 0
}

// Get step number (supports both step and step_num for compatibility)
const getStepNumber = (step: MechanismStep): number => {
  return (step as any).step_num ?? step.step ?? 1
}

// Check if step is open (for arrow rotation) - first step is open by default
const stepIsOpen = (step: MechanismStep): boolean => {
  return getStepNumber(step) === 1
}

// Derived from props.theme via useTheme in parent, but we'll compute directly
const { resolvedTheme } = useTheme()

const surfaceClasses = computed(() =>
  resolvedTheme.value === 'dark'
    ? 'bg-dark-900/55 border-dark-700/70'
    : 'bg-white border-slate-200'
)

const panelClasses = computed(() =>
  props.theme === 'dark'
    ? 'border-dark-700/70 bg-dark-800/50'
    : 'border-slate-200 bg-slate-50'
)

const stepBadgeClasses = computed(() =>
  props.theme === 'dark'
    ? 'bg-accent/20 text-accent-light border border-accent/40'
    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
)

const titleClasses = computed(() => (props.theme === 'dark' ? 'text-dark-50' : 'text-slate-900'))
const descClasses = computed(() => (props.theme === 'dark' ? 'text-dark-300' : 'text-slate-600'))
const mutedTextClasses = computed(() =>
  resolvedTheme.value === 'dark' ? 'text-dark-400' : 'text-slate-500'
)

const conditionsBoxClasses = computed(() =>
  props.theme === 'dark'
    ? 'bg-accent/10 border-accent/30 text-accent-light'
    : 'bg-indigo-50 border-indigo-200 text-indigo-700'
)

const productBadge = (rawType?: string): 'possible' | 'major' | 'minor' | null => {
  if (!rawType) return null
  const normalized = rawType.toLowerCase()
  if (normalized === 'possible' || normalized === 'major' || normalized === 'minor') {
    return normalized as 'possible' | 'major' | 'minor'
  }
  return null
}

const badgeClasses = (kind: 'possible' | 'major' | 'minor') => {
  const dark = {
    major: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
    minor: 'border-amber-400/30 bg-amber-500/15 text-amber-300',
    possible: 'border-sky-400/30 bg-sky-500/15 text-sky-300',
  }
  const light = {
    major: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    minor: 'border-amber-300 bg-amber-50 text-amber-700',
    possible: 'border-sky-300 bg-sky-50 text-sky-700',
  }

  return props.theme === 'dark' ? dark[kind] : light[kind]
}
</script>

<style scoped>
.reaction-diagram :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>