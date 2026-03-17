<template>
  <div class="bg-dark-900/85 border border-dark-700/80 rounded-2xl rounded-tl-md p-4 sm:p-5 text-dark-100 shadow-sm">
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <p class="text-[11px] uppercase tracking-wide text-accent-light mr-1">Chemistry</p>
      <span v-if="message.chemistrySolution?.question_mode" class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300">
        {{ questionModeLabel(message.chemistrySolution.question_mode) }}
      </span>
      <span v-if="message.chemistrySolution?.reaction_type" class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300">
        {{ reactionTypeLabel(message.chemistrySolution.reaction_type) }}
      </span>
      <span v-if="message.chemistrySolution?.carbon_change" class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300">
        {{ carbonChangeLabel(message.chemistrySolution.carbon_change) }}
      </span>
      <span
        v-if="typeof message.chemistrySolution?.is_conversion === 'boolean'"
        class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300"
      >
        {{ message.chemistrySolution.is_conversion ? 'Conversion' : 'Non-conversion' }}
      </span>
      <span
        v-if="typeof message.chemistrySolution?.contextUsed === 'boolean'"
        class="rounded-full border border-dark-600 bg-dark-800/70 px-2 py-0.5 text-[11px] text-dark-300"
      >
        {{ message.chemistrySolution.contextUsed ? 'Context used' : 'No context used' }}
      </span>
    </div>

    <template v-if="isConversionFlow">
      <div v-if="message.chemistrySolution?.answer" class="rounded-xl border border-dark-700/70 bg-dark-950/50 p-3 sm:p-4 mb-3">
        <p class="text-sm text-dark-200 whitespace-pre-wrap leading-relaxed">{{ message.chemistrySolution.answer }}</p>
      </div>

      <ReactionDiagram
        v-if="hasReactionVisualization"
        :diagram="message.diagram!"
        class="mb-3"
      />

      <p v-if="message.chemistrySolution?.diagram_caption" class="mb-3 text-xs text-dark-400">
        {{ message.chemistrySolution.diagram_caption }}
      </p>

      <MechanismSteps
        v-if="message.mechanismSteps?.length && message.showMechanismSteps"
        :steps="message.mechanismSteps"
        :theme="renderTheme"
        :svg-by-smiles="svgBySmiles"
        :errors-by-smiles="errorsBySmiles"
        class="mb-3"
      />

      <div v-if="message.chemistrySolution?.key_points?.length" class="mb-3">
        <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">HSC Tips</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(point, idx) in message.chemistrySolution.key_points.slice(0, 4)"
            :key="`kp-${messageIndex}-${idx}`"
            class="inline-flex items-center rounded-full border border-amber-400/25 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-200"
          >
            {{ point }}
          </span>
        </div>
      </div>

      <div v-if="message.chemistrySolution?.resonance" class="rounded-xl border border-dark-700/65 bg-dark-950/35 p-3">
        <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Resonance</p>
        <p v-if="message.chemistrySolution.resonance.target" class="text-xs text-dark-300 mb-1">
          Target: {{ message.chemistrySolution.resonance.target }}
        </p>
        <p v-if="message.chemistrySolution.resonance.base" class="text-xs text-dark-300 mb-2">
          Base: {{ message.chemistrySolution.resonance.base }}
        </p>
        <p v-if="message.chemistrySolution.resonance.note" class="text-xs text-dark-300">
          {{ message.chemistrySolution.resonance.note }}
        </p>
        <ul v-if="message.chemistrySolution.resonance.arrow_steps?.length" class="mt-2 list-disc pl-5 text-xs text-dark-300 space-y-1">
          <li
            v-for="(step, idx) in message.chemistrySolution.resonance.arrow_steps"
            :key="`arrow-${messageIndex}-${idx}`"
          >
            {{ step }}
          </li>
        </ul>
        <div v-if="message.chemistrySolution.resonance.forms?.length" class="mt-3 flex flex-wrap gap-3">
          <MoleculeCard
            v-for="(form, idx) in message.chemistrySolution.resonance.forms"
            :key="`res-form-${messageIndex}-${idx}-${form.smiles}`"
            :item="{ name: form.name, smiles: form.smiles }"
            :theme="renderTheme"
            :svg="svgBySmiles?.get(form.smiles)"
            :error-message="errorsBySmiles?.get(form.smiles)"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <div v-if="message.chemistrySolution?.answer" class="rounded-xl border border-dark-700/70 bg-dark-950/50 p-3 sm:p-4 mb-3">
        <p class="text-sm text-dark-200 whitespace-pre-wrap leading-relaxed">{{ message.chemistrySolution.answer }}</p>
      </div>

      <div
        v-if="message.chemistrySolution?.equations?.length"
        class="rounded-xl border border-dark-700/65 bg-dark-950/35 p-3 mb-3"
      >
        <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Reaction Equation</p>
        <ul class="space-y-1.5">
          <li
            v-for="(equation, idx) in message.chemistrySolution.equations"
            :key="`eq-${messageIndex}-${idx}`"
            class="rounded-md border border-dark-700/60 bg-dark-900/60 px-2.5 py-1.5 text-xs text-dark-200 whitespace-pre-wrap"
          >
            {{ equation }}
          </li>
        </ul>
      </div>

      <ReactionDiagram
        v-if="hasReactionVisualization"
        :diagram="message.diagram!"
        class="mb-3"
      />

      <p v-if="message.chemistrySolution?.diagram_caption" class="mb-3 text-xs text-dark-400">
        {{ message.chemistrySolution.diagram_caption }}
      </p>

      <MechanismSteps
        v-if="message.mechanismSteps?.length && message.showMechanismSteps"
        :steps="message.mechanismSteps"
        :theme="renderTheme"
        :svg-by-smiles="svgBySmiles"
        :errors-by-smiles="errorsBySmiles"
        class="mb-3"
      />

      <div v-if="message.chemistrySolution?.key_points?.length" class="rounded-xl border border-dark-700/65 bg-dark-950/35 p-3">
        <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Key Points</p>
        <ul class="list-disc pl-5 space-y-1.5 text-xs text-dark-300">
          <li
            v-for="(point, idx) in message.chemistrySolution.key_points"
            :key="`point-${messageIndex}-${idx}`"
          >
            {{ point }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Message, CarbonChange, ReactionType } from '~/types/aiTutor'
import type { ReactionDiagramData } from '~/types/reactionDiagram'
import type { SmilesTheme } from '~/utils/smilesSvg'
import ReactionDiagram from '~/components/reaction/ReactionDiagram.vue'
import MechanismSteps from '~/components/reaction/MechanismSteps.vue'
import MoleculeCard from '~/components/reaction/MoleculeCard.vue'

const props = defineProps<{
  message: Message
  messageIndex: number
  renderTheme: SmilesTheme
  svgBySmiles?: Map<string, string>
  errorsBySmiles?: Map<string, string>
}>()

const hasDiagramContent = (diagram?: ReactionDiagramData): boolean => {
  if (!diagram) return false
  return Boolean(
    diagram.reactants?.length ||
    diagram.reagents?.length ||
    diagram.products?.length
  )
}

const isConversionFlow = computed(() => {
  return props.message.chemistrySolution?.is_conversion !== false
})

const hasReactionVisualization = computed(() => {
  return Boolean(props.message.showDiagram && hasDiagramContent(props.message.diagram))
})

const reactionTypeLabel = (type: ReactionType): string => {
  const labels: Record<ReactionType, string> = {
    conversion_reaction: 'Conversion reaction',
    aromatic_substitution: 'Aromatic substitution',
    addition_reaction: 'Addition reaction',
    elimination_reaction: 'Elimination reaction',
    oxidation_reduction: 'Oxidation-Reduction',
    resonance_concept: 'Resonance concept',
    conceptual_theory: 'Conceptual theory',
    unknown: 'Unknown reaction',
  }
  return labels[type] || labels.unknown
}

const carbonChangeLabel = (change: CarbonChange): string => {
  const labels: Record<CarbonChange, string> = {
    carbon_same: 'Carbon unchanged',
    carbon_increase: 'Carbon increased',
    carbon_decrease: 'Carbon decreased',
    unknown: 'Carbon change unknown',
  }
  return labels[change] || labels.unknown
}

const questionModeLabel = (mode: string): string => {
  const normalized = mode.trim().toLowerCase()
  if (normalized === 'description') return 'Description mode'
  if (normalized === 'equation') return 'Equation mode'
  return mode
}
</script>
