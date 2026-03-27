<template>
  <div class="chemistry-message space-y-3.5 max-w-2xl">
    <!-- Tag Row with dynamic categorization -->
    <div class="flex flex-wrap gap-1.5 items-center">
      <!-- Primary Chemistry tag -->
      <span class="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all" 
            :style="{ 
              background: 'var(--gold-dim)', 
              color: 'var(--gold2)', 
              border: '1px solid rgba(212,168,67,0.3)', 
              fontFamily: 'DM Mono'
            }">
        ⚗️ Chemistry
      </span>

      <!-- Mode badge -->
      <span v-if="message.chemistrySolution?.question_mode" 
            class="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
            :style="{ 
              background: 'var(--bg3)', 
              color: 'var(--teal)', 
              border: '1px solid rgba(45,212,191,0.3)', 
              fontFamily: 'DM Mono'
            }">
        {{ questionModeLabel(message.chemistrySolution.question_mode) }}
      </span>

      <!-- Reaction type badge -->
      <span v-if="getReactionType()" 
            class="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
            :style="{ 
              background: 'var(--bg3)', 
              color: 'var(--text2)', 
              border: '1px solid var(--line)', 
              fontFamily: 'DM Mono'
            }">
        {{ reactionTypeLabel(getReactionType()) }}
      </span>

      <!-- Carbon change badge -->
      <span v-if="getCarbonChange()" 
            class="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
            :style="{ 
              background: 'var(--bg3)', 
              color: 'var(--text2)', 
              border: '1px solid var(--line)', 
              fontFamily: 'DM Mono'
            }">
        {{ carbonChangeLabel(getCarbonChange()) }}
      </span>

      <!-- Context used badge -->
      <span v-if="message.chemistrySolution?.contextUsed" 
            class="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
            :style="{ 
              background: 'var(--bg3)', 
              color: 'var(--text2)', 
              border: '1px solid var(--line)', 
              fontFamily: 'DM Mono'
            }">
        context used
      </span>
    </div>

    <!-- Overview Card with Enhanced Styling -->
    <div v-if="message.chemistrySolution?.overview" 
         class="px-6 py-5 rounded-2xl backdrop-blur-sm transition-all hover:border-opacity-60"
         :style="{ 
           background: 'linear-gradient(135deg, rgba(14,21,32,0.6) 0%, rgba(20,29,46,0.4) 100%)',
           border: '1px solid rgba(212,168,67,0.15)',
           borderLeft: '3px solid var(--gold2)'
         }">
      <!-- Overview title -->
      <div v-if="message.chemistrySolution.overview.title" class="mb-2">
        <p class="text-sm font-semibold" :style="{ color: 'var(--gold2)', fontFamily: 'DM Sans', letterSpacing: '0.3px' }">
          {{ message.chemistrySolution.overview.title }}
        </p>
      </div>
      <!-- Overview text with formatted bold -->
      <p class="text-sm leading-relaxed" 
         :style="{ 
           color: 'var(--text2)', 
           fontFamily: 'DM Sans',
           lineHeight: '1.68'
         }"
         v-html="formatBoldText(message.chemistrySolution.overview.text)">
      </p>
    </div>

    <!-- Reaction Pathway Section - Enhanced Linear Diagram -->
    <div v-if="message.chemistrySolution?.reaction_pathway?.compounds?.length" class="space-y-4">
      <div class="flex items-center gap-2">
        <span class="text-xs uppercase tracking-wider font-semibold" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
          ➔ Reaction Pathway
        </span>
      </div>
      <div class="px-8 py-6 rounded-2xl border transition-all"
           :style="{
             background: 'var(--bg2)',
             border: '1px solid rgba(212,168,67,0.25)'
           }">
        <div class="flex items-center gap-0 overflow-x-auto py-3">
          <template v-for="(compound, idx) in message.chemistrySolution.reaction_pathway.compounds" :key="'pathway-' + messageIndex + '-' + idx">
            <!-- Compound Card (non-reagent/catalyst) -->
            <div v-if="!isReagentOrCatalyst(compound)" class="flex flex-col items-center gap-2 flex-shrink-0">
              <div class="w-[100px] min-h-[100px] rounded-xl border flex items-center justify-center transition-all hover:border-opacity-80"
                   :style="{
                     background: 'var(--bg2)',
                     border: '1px solid var(--line)'
                   }">
                <MoleculeCard
                  :item="{ name: compound.name, smiles: compound.smiles || '', role: compound.role }"
                  :theme="renderTheme"
                  :svg="svgBySmiles?.get(compound.smiles || '')"
                  :error-message="errorsBySmiles?.get(compound.smiles || '')"
                  :compact="true"
                />
              </div>
            </div>

            <!-- Reagent/Catalyst Segment with Arrow -->
            <div v-else class="flex flex-col items-center px-4 py-2 flex-shrink-0">
              <div class="text-xs font-medium whitespace-nowrap px-2.5 py-1 rounded-full mb-2"
                   :style="{
                     background: 'var(--gold-dim)',
                     color: 'var(--gold2)',
                     border: '1px solid rgba(212,168,67,0.3)',
                     fontFamily: 'DM Mono'
                   }">
                {{ compound.display_formula || compound.name }}
              </div>
              <div class="w-20 h-1.5 relative rounded" :style="{ background: 'var(--gold)' }">
                <div class="absolute right-[-6px] top-[-4px] w-0 h-0 border-l-[8px] border-l-[var(--gold)] border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
              </div>
            </div>

            <!-- Arrow between main compounds (non-reagent) -->
            <div v-if="!isReagentOrCatalyst(compound) && idx < message.chemistrySolution.reaction_pathway.compounds.length - 1 && !isReagentOrCatalyst(message.chemistrySolution.reaction_pathway.compounds[idx+1])"
                 class="flex flex-col items-center px-4 py-2 flex-shrink-0">
              <div class="text-xs font-medium whitespace-nowrap px-2.5 py-1 rounded-full mb-2"
                   :style="{
                     background: 'var(--gold-dim)',
                     color: 'var(--gold2)',
                     border: '1px solid rgba(212,168,67,0.3)',
                     fontFamily: 'DM Mono'
                   }">
                {{ getArrowReagent(idx) }}
              </div>
              <div class="w-20 h-1.5 relative rounded" :style="{ background: 'var(--gold)' }">
                <div class="absolute right-[-6px] top-[-4px] w-0 h-0 border-l-[8px] border-l-[var(--gold)] border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent"></div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Step-by-Step Breakdown Section -->
    <div v-if="message.chemistrySolution?.steps?.length" class="space-y-2.5">
      <div class="flex items-center gap-2">
        <span class="text-[11px] uppercase tracking-[0.6px] font-semibold" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
          📋 Step-by-step breakdown
        </span>
      </div>
      <div class="space-y-2.5">
        <div v-for="(step, idx) in message.chemistrySolution.steps"
             :key="'step-' + messageIndex + '-' + idx"
             class="rounded-2xl border overflow-hidden transition-all"
             :class="{ 'expanded': expandedSteps[idx] }"
             :style="{ 
               background: 'var(--bg3)',
               border: expandedSteps[idx] ? '1px solid rgba(212,168,67,0.25)' : '1px solid var(--line)'
             }">
          <!-- Step Header -->
          <div class="flex items-center gap-3.5 px-5 py-4 cursor-pointer select-none"
               @click="toggleStep(idx)">
            <div class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                 :style="{ 
                   background: expandedSteps[idx] ? 'rgba(212,168,67,0.2)' : 'var(--gold-dim)',
                   color: 'var(--gold2)',
                   border: '1px solid rgba(212,168,67,0.2)',
                   boxShadow: expandedSteps[idx] ? '0 0 12px rgba(212,168,67,0.2)' : 'none'
                 }">
              <span class="text-[12px] font-medium" :style="{ fontFamily: 'DM Mono' }">
                {{ String(step.step_num || idx + 1).padStart(2, '0') }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[14px] font-semibold" :style="{ color: 'var(--text)', fontFamily: 'Syne' }">
                {{ step.title }}
              </p>
              <p v-if="step.subtitle" class="text-[12px] mt-0.5" :style="{ color: 'var(--text3)' }">
                {{ step.subtitle }}
              </p>
            </div>
            <svg class="w-4 h-4 flex-shrink-0 transition-transform duration-250"
                 :class="{ 'rotate-180': expandedSteps[idx] }"
                 :style="{ color: expandedSteps[idx] ? 'var(--gold)' : 'var(--text3)' }"
                 viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          
          <!-- Step Body (Expandable) -->
          <div class="step-body overflow-hidden transition-all duration-400"
               :style="{ maxHeight: expandedSteps[idx] ? '600px' : '0' }">
            <div class="px-5 pb-5 border-t" :style="{ borderColor: 'var(--line)' }">
              <!-- Step Description -->
              <p v-if="step.description" class="text-[13px] leading-relaxed py-4" 
                 :style="{ color: 'var(--text2)', fontFamily: 'DM Sans', lineHeight: '1.7' }">
                {{ step.description }}
              </p>

              <!-- Step Molecules -->
              <div v-if="step.molecules?.length" class="grid grid-cols-3 gap-2.5 mt-1">
                <div v-for="(molecule, molIdx) in step.molecules"
                     :key="'step-mol-' + messageIndex + '-' + idx + '-' + molIdx"
                     class="rounded-xl border p-3 flex flex-col items-center gap-2.5 transition-all hover:border-opacity-80"
                     :style="{ 
                       background: 'var(--bg2)',
                       border: '1px solid var(--line)'
                     }">
                  <div class="w-14 h-[52px] flex items-center justify-center">
                    <MoleculeCard
                      :item="{ name: molecule.name, smiles: molecule.smiles || '' }"
                      :theme="renderTheme"
                      :svg="svgBySmiles?.get(molecule.smiles || '')"
                      :error-message="errorsBySmiles?.get(molecule.smiles || '')"
                      :compact="true"
                    />
                  </div>
                  <div class="text-center">
                    <p class="text-[11px]" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
                      {{ molecule.name }}
                    </p>
                    <span v-if="molecule.role" class="text-[10px] px-1.5 py-0.5 rounded-full mt-1 inline-block" 
                          :style="{ background: 'var(--bg3)', color: 'var(--text3)', fontFamily: 'DM Mono' }">
                      {{ molecule.role }}
                    </span>
                    <p v-if="molecule.formula || molecule.display_formula" 
                       class="text-[10px] mt-1" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
                      {{ molecule.display_formula || molecule.formula }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Step Conditions -->
              <div v-if="step.conditions" class="mt-4 pt-3 border-t" :style="{ borderColor: 'rgba(212,168,67,0.1)' }">
                <p class="text-[10px]" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
                  <span class="font-semibold">Conditions:</span> {{ step.conditions }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chemical Equations Section -->
    <div v-if="message.chemistrySolution?.equations?.length" 
         class="space-y-2.5">
      <span class="text-[11px] uppercase tracking-[0.6px] font-semibold" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
        ⚛ Chemical Equations
      </span>
      <div class="space-y-2">
        <div v-for="(equation, idx) in message.chemistrySolution.equations"
             :key="'eq-' + messageIndex + '-' + idx"
             class="px-5 py-3.5 rounded-xl border transition-all hover:border-opacity-80"
             :style="{ 
               background: 'var(--bg2)',
               border: '1px solid rgba(212,168,67,0.12)',
               color: 'var(--text2)', 
               fontFamily: 'DM Mono, monospace',
               fontSize: '12px',
               lineHeight: '1.6',
               letterSpacing: '0.2px'
             }">
          {{ equation }}
        </div>
      </div>
    </div>

    <!-- Key Points / Insights Section -->
    <div v-if="message.chemistrySolution?.key_points?.length" class="space-y-2.5">
      <span class="text-[11px] uppercase tracking-[0.6px] font-semibold" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
        💡 Key Insights
      </span>
      <div class="space-y-2">
        <div v-for="(point, idx) in message.chemistrySolution.key_points"
             :key="'kp-' + messageIndex + '-' + idx"
             class="px-4 py-3 rounded-lg border-l-3 transition-all"
             :style="{ 
               background: 'rgba(212,168,67,0.08)',
               borderLeft: '3px solid var(--gold2)',
               borderRight: '1px solid rgba(212,168,67,0.1)',
               borderTop: '1px solid rgba(212,168,67,0.1)',
               borderBottom: '1px solid rgba(212,168,67,0.1)',
               color: 'var(--text2)', 
               fontFamily: 'DM Sans',
               fontSize: '13px',
               lineHeight: '1.6'
             }">
          {{ point }}
        </div>
      </div>
    </div>

    <!-- Related Concepts Section -->
    <div v-if="message.chemistrySolution?.related_concepts?.length" class="space-y-2.5">
      <span class="text-[11px] uppercase tracking-[0.6px] font-semibold" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
        🔗 Related Concepts
      </span>
      <div class="flex flex-wrap gap-2">
        <span v-for="(concept, idx) in message.chemistrySolution.related_concepts"
              :key="'concept-' + messageIndex + '-' + idx"
              class="px-3 py-1.5 rounded-full text-[11px] font-medium"
              :style="{ 
                background: 'var(--bg3)', 
                color: 'var(--text2)', 
                border: '1px solid var(--line)',
                fontFamily: 'DM Mono'
              }">
          {{ concept }}
        </span>
      </div>
    </div>

    <!-- Warning or Tip Section -->
    <div v-if="message.chemistrySolution?.warning_or_tip" 
         class="px-5 py-4 rounded-xl border"
         :style="{ 
           background: 'rgba(245,158,11,0.08)',
           border: '1px solid rgba(245,158,11,0.3)'
         }">
      <p class="text-xs leading-relaxed" 
         :style="{ color: 'var(--text2)', fontFamily: 'DM Sans', lineHeight: '1.6' }">
        <span class="font-semibold" :style="{ color: '#f59e0b' }">⚠️ Tip:</span>
        {{ message.chemistrySolution.warning_or_tip }}
      </p>
    </div>

    <!-- Resonance Section -->
    <div v-if="message.chemistrySolution?.resonance" 
         class="space-y-3 px-6 py-5 rounded-2xl border"
         :style="{ 
           background: 'linear-gradient(135deg, rgba(45,212,191,0.08) 0%, rgba(20,29,46,0.3) 100%)',
           border: '1px solid rgba(45,212,191,0.2)'
         }">
      <!-- Resonance Header -->
      <div class="border-b" :style="{ borderColor: 'rgba(45,212,191,0.2)', paddingBottom: '12px' }">
        <p class="text-sm font-semibold" :style="{ color: 'var(--teal)', fontFamily: 'DM Sans', letterSpacing: '0.3px' }">
          🔄 Resonance Structures
        </p>
      </div>

      <!-- Resonance Description -->
      <div class="space-y-2">
        <p v-if="message.chemistrySolution.resonance.target" class="text-xs" 
           :style="{ color: 'var(--text2)', fontFamily: 'DM Sans' }">
          <span class="font-semibold text-sm" :style="{ color: 'var(--teal)' }">Target:</span>
          <span class="ml-2">{{ message.chemistrySolution.resonance.target }}</span>
        </p>
        <p v-if="message.chemistrySolution.resonance.base" class="text-xs"
           :style="{ color: 'var(--text2)', fontFamily: 'DM Sans' }">
          <span class="font-semibold text-sm" :style="{ color: 'var(--teal)' }">Base:</span>
          <span class="ml-2">{{ message.chemistrySolution.resonance.base }}</span>
        </p>
        <p v-if="message.chemistrySolution.resonance.note" 
           class="text-xs italic px-3 py-2 rounded border-l-2"
           :style="{ 
             color: 'var(--text3)', 
             fontFamily: 'DM Sans',
             borderLeft: '2px solid rgba(45,212,191,0.4)',
             background: 'rgba(45,212,191,0.05)'
           }">
          {{ message.chemistrySolution.resonance.note }}
        </p>
      </div>

      <!-- Arrow Steps -->
      <ul v-if="message.chemistrySolution.resonance.arrow_steps?.length" 
          class="list-disc pl-5 space-y-1.5 text-xs"
          :style="{ color: 'var(--text2)', fontFamily: 'DM Sans' }">
        <li v-for="(step, idx) in message.chemistrySolution.resonance.arrow_steps"
            :key="'arrow-' + messageIndex + '-' + idx"
            class="leading-relaxed">
          {{ step }}
        </li>
      </ul>

      <!-- Resonance Forms -->
      <div v-if="message.chemistrySolution.resonance.forms?.length" 
           class="flex flex-wrap gap-3 mt-4 pt-3 border-t"
           :style="{ borderColor: 'rgba(45,212,191,0.2)' }">
        <MoleculeCard
          v-for="(form, idx) in message.chemistrySolution.resonance.forms"
          :key="'res-form-' + messageIndex + '-' + idx + '-' + form.smiles"
          :item="{ name: form.name, smiles: form.smiles }"
          :theme="renderTheme"
          :svg="svgBySmiles?.get(form.smiles)"
          :error-message="errorsBySmiles?.get(form.smiles)"
        />
      </div>
    </div>

    <!-- Reaction Diagram Section (Legacy support) -->
    <div v-if="hasReactionVisualization" class="space-y-2.5">
      <div class="flex items-center gap-2">
        <span class="text-[11px] uppercase tracking-[0.6px] font-semibold" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
          ➔ Reaction Diagram
        </span>
      </div>
      <div class="px-6 py-5 rounded-2xl border" 
           :style="{ 
             background: 'var(--bg2)',
             border: '1px solid rgba(212,168,67,0.15)'
           }">
        <ReactionDiagram
          :diagram="message.diagram!"
          class="w-full"
        />
      </div>
      <p v-if="message.chemistrySolution?.diagram_caption" 
         class="text-xs px-2"
         :style="{ color: 'var(--text3)', fontFamily: 'DM Sans', lineHeight: '1.5' }">
        {{ message.chemistrySolution.diagram_caption }}
      </p>
    </div>

    <!-- Mechanism Steps (Legacy support) -->
    <MechanismSteps
      v-if="message.mechanismSteps?.length && message.showMechanismSteps"
      :steps="message.mechanismSteps"
      :theme="renderTheme"
      :svg-by-smiles="svgBySmiles"
      :errors-by-smiles="errorsBySmiles"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

// Track expanded state for each step
const expandedSteps = ref<Record<number, boolean>>({})

// Initialize first step as expanded
if (props.message.chemistrySolution?.steps?.length) {
  expandedSteps.value[0] = true
}

const toggleStep = (idx: number) => {
  expandedSteps.value[idx] = !expandedSteps.value[idx]
}

const hasDiagramContent = (diagram?: ReactionDiagramData): boolean => {
  if (!diagram) return false
  return Boolean(
    diagram.reactants?.length ||
    diagram.reagents?.length ||
    diagram.products?.length
  )
}

const getReactionType = (): string | undefined => {
  // Check metadata first, then fall back to direct field
  return props.message.chemistrySolution?.metadata?.reaction_type || props.message.chemistrySolution?.reaction_type
}

const getCarbonChange = (): string | undefined => {
  // Check metadata first, then fall back to direct field
  return props.message.chemistrySolution?.metadata?.carbon_change || props.message.chemistrySolution?.carbon_change
}

const hasReactionVisualization = computed(() => {
  return Boolean(props.message.showDiagram && hasDiagramContent(props.message.diagram))
})

// Get reagent for arrow between compounds
const getArrowReagent = (idx: number): string => {
  const compounds = props.message.chemistrySolution?.reaction_pathway?.compounds
  if (!compounds || idx >= compounds.length - 1) return ''

  // Try to find a reagent or catalyst between compounds
  const nextCompound = compounds[idx + 1]
  if (nextCompound?.role === 'reagent' || nextCompound?.role === 'catalyst') {
    return nextCompound.display_formula || nextCompound.name
  }

  // Default arrow labels based on position
  const steps = props.message.chemistrySolution?.steps
  if (steps && steps[idx]) {
    return steps[idx].conditions || ''
  }

  return ''
}

// Check if compound is a reagent or catalyst (rendered inline with arrow)
const isReagentOrCatalyst = (compound: any): boolean => {
  const role = compound.role?.toLowerCase()
  return role === 'reagent' || role === 'catalyst'
}

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
  if (normalized === 'description') return '📖 Description Mode'
  if (normalized === 'conversion') return '⚛️ Conversion Mode'
  if (normalized === 'equation') return '📐 Equation Mode'
  return mode
}

// Format bold markdown text (**text**) to HTML
const formatBoldText = (text: string): string => {
  if (!text) return ''
  return text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--gold2); font-weight: 600;">$1</strong>')
}
</script>

<style scoped>
.step-body {
  transition: max-height 0.4s ease;
}
</style>
