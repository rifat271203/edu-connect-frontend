<template>
  <div class="molecule-card rounded-xl border p-4" :class="[containerClasses, compact ? 'compact' : '']">
    <div class="mx-auto flex h-full min-h-[140px] w-full items-center justify-center rounded-lg" :class="[viewerClasses, compact ? 'compact-viewer' : '']">
      <div
        v-if="resolvedSvg"
        class="molecule-svg"
        v-html="resolvedSvg"
      ></div>
      <p v-else-if="resolvedError" class="text-center text-xs" :class="mutedClasses">{{ resolvedError }}</p>
      <p v-else class="text-center text-xs" :class="mutedClasses">Rendering...</p>
    </div>

    <p class="mt-3 text-center text-sm font-medium leading-snug" :class="nameClasses">
      {{ item.name }}
    </p>

    <div v-if="roleLabel" class="mt-2 flex justify-center">
      <span
        class="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide"
        :class="roleBadgeClasses"
      >
        {{ roleLabel }}
      </span>
    </div>

    <div class="flex justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { ReactionItem } from '~/types/reactionDiagram'
import type { SmilesTheme } from '~/utils/smilesSvg'
import { renderSmilesToSvg } from '~/utils/smilesSvg'

const props = defineProps<{
  item: ReactionItem
  theme: SmilesTheme
  svg?: string
  errorMessage?: string
  compact?: boolean
}>()

const localSvg = ref('')
const localError = ref('')

const isDark = computed(() => props.theme === 'dark')

const containerClasses = computed(() =>
  isDark.value
    ? 'bg-dark-900/85 border-dark-700/80 text-dark-100'
    : 'bg-white border-slate-200 text-slate-900'
)

const viewerClasses = computed(() =>
  isDark.value
    ? 'bg-dark-950/80 border border-dark-700/70'
    : 'bg-slate-50 border border-slate-200'
)

const nameClasses = computed(() => (isDark.value ? 'text-dark-100' : 'text-slate-700'))

const mutedClasses = computed(() => (isDark.value ? 'text-dark-400' : 'text-slate-500'))

const resolvedSvg = computed(() => props.svg || localSvg.value)
const resolvedError = computed(() => props.errorMessage || localError.value)

const roleLabel = computed(() => {
  const role = props.item.role?.toLowerCase()
  if (role === 'reactant') return 'Reactant'
  if (role === 'intermediate') return 'Intermediate'
  if (role === 'product') return 'Product'
  if (role === 'reagent') return 'Reagent'
  if (role === 'catalyst') return 'Catalyst'
  return null
})

const roleBadgeClasses = computed(() => {
  const role = props.item.role?.toLowerCase()
  if (isDark.value) {
    if (role === 'reactant') return 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
    if (role === 'intermediate') return 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
    if (role === 'product') return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
    if (role === 'reagent') return 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
    if (role === 'catalyst') return 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
    return 'bg-dark-700/50 text-dark-300 border border-dark-600/50'
  } else {
    if (role === 'reactant') return 'bg-blue-100 text-blue-700 border border-blue-200'
    if (role === 'intermediate') return 'bg-amber-100 text-amber-700 border border-amber-200'
    if (role === 'product') return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    if (role === 'reagent') return 'bg-purple-100 text-purple-700 border border-purple-200'
    if (role === 'catalyst') return 'bg-rose-100 text-rose-700 border border-rose-200'
    return 'bg-slate-100 text-slate-600 border border-slate-200'
  }
})

const renderLocally = async () => {
  if (!process.client) return
  if (props.svg) {
    localSvg.value = ''
    localError.value = ''
    return
  }

  const smiles = (props.item.smiles || '').trim()
  if (!smiles) {
    localSvg.value = ''
    localError.value = 'Missing structure data'
    return
  }

  try {
    const width = props.compact ? 80 : 200
    const height = props.compact ? 70 : 140
    localSvg.value = await renderSmilesToSvg(smiles, {
      width,
      height,
      theme: props.theme,
    })
    localError.value = ''
  } catch {
    localSvg.value = ''
    localError.value = 'Unable to render structure'
  }
}

watch(
  () => [props.item.smiles, props.theme, props.svg, props.compact],
  () => {
    renderLocally()
  },
  { immediate: true }
)
</script>

<style scoped>
.molecule-card {
  width: 220px;
}

.molecule-card.compact {
  width: 100%;
  padding: 8px;
}

.molecule-card.compact .compact-viewer {
  min-height: 60px;
}

.molecule-svg {
  width: 100%;
  display: flex;
  justify-content: center;
}

.molecule-svg :deep(svg) {
  width: 100%;
  height: auto;
}
</style>
