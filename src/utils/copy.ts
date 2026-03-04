import type { MathTutorSolution } from '~/types/aiTutor'

type CopyFeedbackType = 'success' | 'error'

type CopyOptions = {
  successMessage?: string
  errorMessage?: string
  onFeedback?: (message: string, type: CopyFeedbackType) => void
}

const emitFeedback = (message: string, type: CopyFeedbackType, options?: CopyOptions) => {
  if (options?.onFeedback) {
    options.onFeedback(message, type)
    return
  }

  const prefix = type === 'success' ? '[copy]' : '[copy:error]'
  const logger = type === 'success' ? console.log : console.error
  logger(`${prefix} ${message}`)
}

export const copyToClipboard = async (text: string, options?: CopyOptions): Promise<boolean> => {
  const safeText = text ?? ''

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(safeText)
    } else if (typeof document !== 'undefined') {
      const textarea = document.createElement('textarea')
      textarea.value = safeText
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    } else {
      throw new Error('Clipboard API is not available in this environment.')
    }

    emitFeedback(options?.successMessage || 'Copied to clipboard.', 'success', options)
    return true
  } catch {
    emitFeedback(options?.errorMessage || 'Failed to copy to clipboard.', 'error', options)
    return false
  }
}

export const buildMathSolutionMarkdown = (solution: MathTutorSolution): string => {
  const lines: string[] = ['# Math Solution', '']

  const answer = solution.answer || (solution.answerLatex ? `$$${solution.answerLatex}$$` : '')
  const steps = solution.steps || []
  const stepsLatex = solution.stepsLatex || []
  const final = solution.final || (solution.finalLatex ? `$$${solution.finalLatex}$$` : '')

  if (answer) {
    lines.push('## Answer', '', answer, '')
  }

  const totalSteps = Math.max(steps.length, stepsLatex.length)
  if (totalSteps > 0) {
    lines.push('## Steps', '')

    for (let index = 0; index < totalSteps; index += 1) {
      const latexStep = stepsLatex[index]?.trim()
      const plainStep = steps[index]?.trim()
      const stepValue = latexStep ? `$$${latexStep}$$` : (plainStep || '—')
      lines.push(`${index + 1}. ${stepValue}`)
    }

    lines.push('')
  }

  if (final) {
    lines.push('## Final', '', final, '')
  }

  if (solution.notes) {
    lines.push('## Notes', '', solution.notes, '')
  }

  if (solution.usedChunkIds?.length) {
    lines.push('## Reference Chunks', '', solution.usedChunkIds.map(id => `- ${id}`).join('\n'), '')
  }

  return lines.join('\n').trim()
}
