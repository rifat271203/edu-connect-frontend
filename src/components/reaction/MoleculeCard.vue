<template>
  <div class="molecule-card rounded-xl border p-3" :class="containerClasses">
    <div class="mx-auto flex h-full min-h-[110px] w-full items-center justify-center rounded-lg" :class="viewerClasses">
      <div
        v-if="resolvedSvg"
        class="molecule-svg"
        v-html="resolvedSvg"
      ></div>
      <p v-else-if="resolvedError" class="text-center text-xs" :class="mutedClasses">{{ resolvedError }}</p>
      <p v-else class="text-center text-xs" :class="mutedClasses">Rendering...</p>
    </div>

    <p class="mt-2 text-center text-xs font-medium leading-snug" :class="nameClasses">
      {{ item.name }}
    </p>

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
    localSvg.value = await renderSmilesToSvg(smiles, {
      width: 170,
      height: 110,
      theme: props.theme,
    })
    localError.value = ''
  } catch {
    localSvg.value = ''
    localError.value = 'Unable to render structure'
  }
}

watch(
  () => [props.item.smiles, props.theme, props.svg],
  () => {
    renderLocally()
  },
  { immediate: true }
)
</script>

<style scoped>
.molecule-card {
  width: 180px;
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

