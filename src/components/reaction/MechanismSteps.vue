<template>
  <div class="mt-4 space-y-3">
    <details
      v-for="step in steps"
      :key="`mechanism-step-${step.step}-${step.title}`"
      class="rounded-xl border p-3"
      :class="panelClasses"
      :open="step.step === 1"
    >
      <summary class="list-none cursor-pointer select-none">
        <div class="flex items-start gap-2">
          <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-[11px] font-semibold" :class="stepBadgeClasses">
            {{ step.step }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold" :class="titleClasses">{{ step.title }}</p>
            <p class="mt-1 text-xs" :class="descClasses">Tap to expand step details</p>
          </div>
          <span class="text-xs" :class="descClasses">▼</span>
        </div>
      </summary>

      <p class="mt-3 text-xs leading-relaxed" :class="descClasses">{{ step.desc }}</p>

      <div v-if="resolveStepStructures(step).length" class="mt-3 flex flex-wrap gap-3">
        <MoleculeCard
          v-for="(structure, index) in resolveStepStructures(step)"
          :key="`step-structure-${step.step}-${index}-${structure.smiles}`"
          :item="structure"
          :theme="theme"
          :svg="svgBySmiles?.get(structure.smiles)"
          :error-message="errorsBySmiles?.get(structure.smiles)"
        />
      </div>
    </details>
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
}

type RawMechanismStep = {
  structures?: RawMechanismStructure[]
  moleculeState?: RawMechanismStructure[]
  molecule_state?: RawMechanismStructure[]
}

const props = defineProps<{
  steps: MechanismStep[]
  theme: SmilesTheme
  svgBySmiles?: Map<string, string>
  errorsBySmiles?: Map<string, string>
}>()

const resolveStepStructures = (step: MechanismStep): ReactionItem[] => {
  const rawStep = step as unknown as RawMechanismStep
  const structures = Array.isArray(rawStep.structures)
    ? rawStep.structures
    : Array.isArray(rawStep.moleculeState)
      ? rawStep.moleculeState
      : Array.isArray(rawStep.molecule_state)
        ? rawStep.molecule_state
        : []

  return structures
    .map((item): ReactionItem | null => {
      const smiles = (item.smiles ?? item.smile ?? '').trim()
      if (!smiles) return null
      return {
        name: item.name || 'Molecule',
        smiles,
        type: item.type,
      }
    })
    .filter((item): item is ReactionItem => item !== null)
}

const panelClasses = computed(() =>
  props.theme === 'dark'
    ? 'border-dark-700/70 bg-dark-900/70'
    : 'border-slate-200 bg-slate-50'
)

const stepBadgeClasses = computed(() =>
  props.theme === 'dark'
    ? 'bg-accent/20 text-accent-light border border-accent/40'
    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
)

const titleClasses = computed(() => (props.theme === 'dark' ? 'text-dark-50' : 'text-slate-900'))
const descClasses = computed(() => (props.theme === 'dark' ? 'text-dark-300' : 'text-slate-600'))
</script>

