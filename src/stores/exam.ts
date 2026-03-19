import { defineStore } from 'pinia'
import type { ClassroomExam, ExamSubmission } from '~/types/classroom-room'

interface ExamState {
  exams: ClassroomExam[]
  currentExam: ClassroomExam | null
  currentSubmission: ExamSubmission | null
}

const now = Date.now()
const inHours = (hours: number) => new Date(now + hours * 60 * 60 * 1000).toISOString()

const seedExamSet = (courseId: string): ClassroomExam[] => [
  {
    id: `${courseId}-exam-upcoming`,
    courseId,
    title: 'Quiz 1: Atomic Structure',
    instructions: 'Answer all questions. No negative marking.',
    durationMinutes: 30,
    startAt: inHours(12),
    endAt: inHours(13),
    totalMarks: 30,
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'Who discovered the electron?',
        marks: 5,
        options: ['Rutherford', 'J.J. Thomson', 'Bohr', 'Dalton'],
        correctOptionIndex: 1,
      },
      {
        id: 'q2',
        type: 'short',
        question: 'Write the postulates of Bohr model briefly.',
        marks: 10,
      },
      {
        id: 'q3',
        type: 'long',
        question: 'Explain isotopes with examples.',
        marks: 15,
      },
    ],
  },
  {
    id: `${courseId}-exam-ongoing`,
    courseId,
    title: 'MCQ Drill: Periodic Trends',
    instructions: 'Complete within time window.',
    durationMinutes: 20,
    startAt: inHours(-0.2),
    endAt: inHours(0.8),
    totalMarks: 20,
    questions: [
      {
        id: 'q4',
        type: 'mcq',
        question: 'Atomic radius generally decreases across a period due to:',
        marks: 10,
        options: ['Decrease in electrons', 'Increase in effective nuclear charge', 'Increase in shielding', 'Decrease in protons'],
        correctOptionIndex: 1,
      },
      {
        id: 'q5',
        type: 'mcq',
        question: 'Highest electronegativity element is:',
        marks: 10,
        options: ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen'],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    id: `${courseId}-exam-past`,
    courseId,
    title: 'Practice Test: Chemical Bonding',
    instructions: 'Past exam for review.',
    durationMinutes: 45,
    startAt: inHours(-48),
    endAt: inHours(-47),
    totalMarks: 40,
    questions: [
      {
        id: 'q6',
        type: 'mcq',
        question: 'Bond formed by sharing electrons is called:',
        marks: 10,
        options: ['Ionic bond', 'Covalent bond', 'Metallic bond', 'Hydrogen bond'],
        correctOptionIndex: 1,
      },
      {
        id: 'q7',
        type: 'short',
        question: 'Define hybridization.',
        marks: 10,
      },
      {
        id: 'q8',
        type: 'long',
        question: 'Compare sigma and pi bonds.',
        marks: 20,
      },
    ],
  },
]

export const useExamStore = defineStore('classroom-exam', {
  state: (): ExamState => ({
    exams: [],
    currentExam: null,
    currentSubmission: null,
  }),

  getters: {
    examsByCourse: (state) => (courseId: string) => state.exams.filter((exam) => exam.courseId === courseId),
  },

  actions: {
    ensureCourseSeed(courseId: string) {
      if (this.exams.some((exam) => exam.courseId === courseId)) return
      this.exams = [...seedExamSet(courseId), ...this.exams]
    },

    setCurrentExam(examId: string) {
      this.currentExam = this.exams.find((exam) => exam.id === examId) || null
    },

    saveExam(exam: ClassroomExam) {
      const exists = this.exams.some((item) => item.id === exam.id)
      if (!exists) {
        this.exams = [exam, ...this.exams]
        return
      }
      this.exams = this.exams.map((item) => (item.id === exam.id ? exam : item))
    },

    deleteExam(examId: string) {
      this.exams = this.exams.filter((exam) => exam.id !== examId)
      if (this.currentExam?.id === examId) {
        this.currentExam = null
      }
    },

    setCurrentSubmission(submission: ExamSubmission | null) {
      this.currentSubmission = submission
    },
  },
})

