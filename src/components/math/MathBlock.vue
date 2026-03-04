<template>
  <div
    class="math-block rounded-xl border border-dark-700/65 bg-dark-950/45 p-3 sm:p-4 overflow-x-auto cursor-zoom-in"
    role="button"
    tabindex="0"
    @click="emit('click')"
    @keydown.enter.prevent="emit('click')"
    @keydown.space.prevent="emit('click')"
  >
    <div v-if="hasKatex && renderedKatex" class="math-block__katex" v-html="renderedKatex"></div>
    <pre v-else class="math-block__fallback">{{ normalizedContent }}</pre>
  </div>
</template>

<script setup lang="ts">
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { sanitizeMathText, toLatexApprox } from '~/utils/mathFormat'

const props = withDefaults(
  defineProps<{
    content: string
    displayMode?: boolean
  }>(),
  {
    displayMode: true,
  }
)

const emit = defineEmits<{
  click: []
}>()

const normalizedContent = computed(() => sanitizeMathText(props.content ?? ''))
const approxLatex = computed(() => toLatexApprox(normalizedContent.value))

const renderedKatex = computed(() => {
  if (!normalizedContent.value) return ''

  try {
    return katex.renderToString(approxLatex.value || normalizedContent.value, {
      displayMode: props.displayMode,
      throwOnError: false,
      strict: 'warn',
      trust: false,
      output: 'html',
    })
  } catch {
    return ''
  }
})

const hasKatex = computed(() => {
  if (!normalizedContent.value || !renderedKatex.value) return false
  return !renderedKatex.value.includes('katex-error')
})
</script>

<style scoped>
.math-block__katex :deep(.katex-display) {
  margin: 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.2rem;
}

.math-block__katex :deep(.katex) {
  color: inherit;
}

.math-block__fallback {
  margin: 0;
  white-space: pre-wrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  line-height: 1.55;
  color: inherit;
}
</style>
