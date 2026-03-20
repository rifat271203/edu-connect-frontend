import type { QuickPrompt, TutorCategory } from '~/types/aiTutor'

const aiIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
const mathIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>`
const codeIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>`
const scienceIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>`
const bookIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>`
const questionIcon = `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`

export const AI_TUTOR_PROMPTS_BY_CATEGORY: Record<TutorCategory, QuickPrompt[]> = {
  physics: [
    { text: "What is Newton's second law? Explain with one real-life example.", icon: scienceIcon, tag: 'Mechanics' },
    { text: 'Derive the three equations of motion for constant acceleration.', icon: aiIcon, tag: 'Kinematics' },
    { text: 'Explain Ohm’s law and solve a simple voltage-current-resistance problem.', icon: mathIcon, tag: 'Electricity' },
    { text: 'Difference between scalar and vector quantities with examples.', icon: questionIcon, tag: 'Basics' }
  ],
  chemistry: [
    { text: 'Convert Benzene to Toluene with a detailed mechanism.', icon: mathIcon, tag: 'Chemical equations' },
    { text: 'Difference Between SN1 and SN2 Reactions.', icon: scienceIcon, tag: 'Bonding' },
    { text: 'How can I identify phenol?', icon: aiIcon, tag: 'Acids and bases' },
    { text: 'Benzene to Benzoyl Chloride', icon: questionIcon, tag: 'Thermochemistry' }
  ],
  math: [
    { text: 'Solve 2x + 5 = 15 step by step.', icon: mathIcon, tag: 'Algebra' },
    { text: 'Factorize x² - 5x + 6 and verify the answer.', icon: aiIcon, tag: 'Algebra' },
    { text: 'Find the derivative of x³ + 2x and explain each rule used.', icon: codeIcon, tag: 'Calculus' },
    { text: 'Explain the Pythagorean theorem with a simple triangle example.', icon: bookIcon, tag: 'Geometry' }
  ]
}
