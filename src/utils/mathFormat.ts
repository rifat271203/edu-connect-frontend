const MATH_SEGMENT_REGEX = /(=|∫|√|\^|\bln\b|\bsin\b|\bcos\b|\btan\b|\bsec\b|⇒)/i

const normalizeInlineSpace = (value: string): string => value.replace(/\s+/g, ' ').trim()

const stripOuterBrackets = (value: string): string => {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('(') && trimmed.endsWith(')')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
    (trimmed.startsWith('{') && trimmed.endsWith('}'))
  ) {
    return trimmed.slice(1, -1).trim()
  }

  return trimmed
}

const replaceSqrtCalls = (input: string): string => {
  let output = ''

  for (let cursor = 0; cursor < input.length; cursor += 1) {
    if (input[cursor] !== '√' || input[cursor + 1] !== '(') {
      output += input[cursor]
      continue
    }

    let depth = 0
    let end = -1

    for (let index = cursor + 1; index < input.length; index += 1) {
      const char = input[index]
      if (char === '(') depth += 1
      if (char === ')') {
        depth -= 1
        if (depth === 0) {
          end = index
          break
        }
      }
    }

    if (end === -1) {
      output += input[cursor]
      continue
    }

    const inner = input.slice(cursor + 2, end).trim()
    output += `\\sqrt{${inner}}`
    cursor = end
  }

  return output
}

const replaceSimpleFractions = (input: string): string => {
  const pairToken = '(?:\\([^()]+\\)|\\[[^\\]]+\\]|\\{[^}]+\\}|[A-Za-z0-9.+-]+)'
  const fractionRegex = new RegExp(`(${pairToken})\\s*/\\s*(${pairToken})`, 'g')

  return input.replace(fractionRegex, (_, numeratorRaw: string, denominatorRaw: string) => {
    const numerator = stripOuterBrackets(numeratorRaw)
    const denominator = stripOuterBrackets(denominatorRaw)

    if (!numerator || !denominator) return `${numeratorRaw}/${denominatorRaw}`
    return `\\frac{${numerator}}{${denominator}}`
  })
}

export const sanitizeMathText = (value: string): string => {
  return (value ?? '')
    .replace(/−/g, '-')
    .replace(/\u00A0/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\s*\n\s*/g, '\n')
    .trim()
}

export const toLatexApprox = (value: string): string => {
  const sanitized = sanitizeMathText(value)
  if (!sanitized) return ''

  let latex = sanitized

  latex = latex.replace(/⇒/g, '\\Rightarrow ')
  latex = latex.replace(/∫/g, '\\int ')
  latex = latex.replace(/\btan\s*\^\s*(-?1)\b/gi, '\\tan^{-1}')
  latex = latex.replace(/\btan\s*\^\s*\{\s*-?1\s*\}/gi, '\\tan^{-1}')
  latex = latex.replace(/\btan\s*\^\s*−1\b/gi, '\\tan^{-1}')

  latex = replaceSqrtCalls(latex)

  latex = latex.replace(/\bln\b/gi, '\\ln')
  latex = latex.replace(/\bsin\b/gi, '\\sin')
  latex = latex.replace(/\bcos\b/gi, '\\cos')
  latex = latex.replace(/\btan\b/gi, '\\tan')
  latex = latex.replace(/\bsec\b/gi, '\\sec')

  latex = replaceSimpleFractions(latex)

  latex = latex.replace(/\b(d[xtu])\b/g, '\\,$1')

  return latex.trim()
}

export type SplitStepResult = {
  textLines: string[]
  mathLines: string[]
}

const isMathSegment = (segment: string): boolean => MATH_SEGMENT_REGEX.test(segment)

const splitBySentence = (line: string): string[] => {
  return line
    .split(/(?<=[.;])\s+/)
    .map(part => part.trim())
    .filter(Boolean)
}

export const splitStep = (step: string): SplitStepResult => {
  const sanitized = sanitizeMathText(step)
  if (!sanitized) {
    return { textLines: [], mathLines: [] }
  }

  const textLines: string[] = []
  const mathLines: string[] = []

  const segments = sanitized
    .split('\n')
    .flatMap(splitBySentence)

  segments.forEach((segment) => {
    const colonParts = segment.split(':')

    const directiveMatch = segment.match(/^(Let|Assume|Set|Take|Define|Then)\b\s+(.+)$/i)
    if (directiveMatch?.[1] && directiveMatch?.[2] && isMathSegment(directiveMatch[2])) {
      const label = normalizeInlineSpace(directiveMatch[1])
      const mathPart = normalizeInlineSpace(directiveMatch[2])

      if (label) textLines.push(label)
      if (mathPart) mathLines.push(mathPart)
      return
    }

    if (colonParts.length === 2 && isMathSegment(colonParts[1] ?? '')) {
      const label = normalizeInlineSpace(colonParts[0] ?? '')
      const mathPart = normalizeInlineSpace(colonParts[1] ?? '')

      if (label) textLines.push(label)
      if (mathPart) mathLines.push(mathPart)
      return
    }

    if (!isMathSegment(segment)) {
      textLines.push(normalizeInlineSpace(segment))
      return
    }

    const leadingTextMatch = segment.match(/^([A-Za-z][A-Za-z\s]{0,30})\s+(.+)$/)

    if (leadingTextMatch?.[1] && leadingTextMatch?.[2] && isMathSegment(leadingTextMatch[2])) {
      const label = normalizeInlineSpace(leadingTextMatch[1].replace(/[,:\-]+$/, ''))
      const mathPart = normalizeInlineSpace(leadingTextMatch[2])

      if (label) textLines.push(label)
      if (mathPart) mathLines.push(mathPart)
      return
    }

    mathLines.push(normalizeInlineSpace(segment))
  })

  return {
    textLines: textLines.filter(Boolean),
    mathLines: mathLines.filter(Boolean),
  }
}
