<template>
  <div class="math-renderer" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import katex from 'katex'
import 'katex/dist/katex.min.css'

type RenderMode = 'auto' | 'block' | 'inline'

const props = withDefaults(
  defineProps<{
    content: string
    mode?: RenderMode
  }>(),
  {
    mode: 'auto',
  }
)

const escapeHtml = (value: string): string => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const nlToBr = (value: string): string => value.replaceAll('\n', '<br />')

const renderKatexExpression = (expression: string, displayMode: boolean): string => {
  try {
    return katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      strict: 'warn',
      trust: false,
      output: 'html',
    })
  } catch {
    return `<span class="math-renderer__fallback">${escapeHtml(expression)}</span>`
  }
}

const stripDelimiters = (value: string): string => {
  const trimmed = value.trim()
  if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) return trimmed.slice(2, -2).trim()
  if (trimmed.startsWith('\\(') && trimmed.endsWith('\\)')) return trimmed.slice(2, -2).trim()
  return trimmed
}

const renderAutoMode = (raw: string): string => {
  const tokenRegex = /\$\$([\s\S]+?)\$\$|\\\(([\s\S]+?)\\\)/g

  if (!tokenRegex.test(raw)) {
    return `<span>${nlToBr(escapeHtml(raw))}</span>`
  }

  tokenRegex.lastIndex = 0
  let cursor = 0
  let output = ''
  let match: RegExpExecArray | null = tokenRegex.exec(raw)

  while (match) {
    const [token, blockExpr, inlineExpr] = match
    const start = match.index
    if (start > cursor) {
      const plainText = raw.slice(cursor, start)
      output += nlToBr(escapeHtml(plainText))
    }

    if (typeof blockExpr === 'string') {
      output += renderKatexExpression(blockExpr.trim(), true)
    } else if (typeof inlineExpr === 'string') {
      output += renderKatexExpression(inlineExpr.trim(), false)
    } else {
      output += escapeHtml(token)
    }

    cursor = start + token.length
    match = tokenRegex.exec(raw)
  }

  if (cursor < raw.length) {
    output += nlToBr(escapeHtml(raw.slice(cursor)))
  }

  return output
}

const renderedContent = computed(() => {
  const content = props.content ?? ''
  if (!content.trim()) return ''

  if (props.mode === 'block') {
    return renderKatexExpression(stripDelimiters(content), true)
  }

  if (props.mode === 'inline') {
    return renderKatexExpression(stripDelimiters(content), false)
  }

  return renderAutoMode(content)
})
</script>

<style scoped>
.math-renderer {
  color: inherit;
  line-height: 1.6;
  word-break: break-word;
}

.math-renderer :deep(.katex-display) {
  margin: 0.65rem 0;
  overflow-x: auto;
  overflow-y: hidden;
  padding-bottom: 0.25rem;
}

.math-renderer :deep(.katex) {
  color: inherit;
}

.math-renderer__fallback {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.9em;
}
</style>
