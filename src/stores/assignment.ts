import { defineStore } from 'pinia'
import type { ClassroomAssignment } from '~/types/classroom-room'

interface AssignmentState {
  assignments: ClassroomAssignment[]
  currentAssignment: ClassroomAssignment | null
}

const inHours = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()

const seedAssignments = (courseId: string): ClassroomAssignment[] => [
  {
    id: `${courseId}-assignment-1`,
    courseId,
    title: 'Assignment 3: Ionic vs Covalent',
    description: 'Write a comparative report with 3 examples each.',
    dueAt: inHours(36),
    totalMarks: 20,
    attachmentUrl: '',
    attachmentName: '',
    submissions: [
      {
        studentId: 's-1',
        studentName: 'Nafis Islam',
        fileUrl: 'https://example.com/submissions/nafis-assignment-3.pdf',
        fileName: 'nafis-assignment-3.pdf',
        comment: 'Attached my report.',
        submittedAt: inHours(-10),
        late: false,
        score: 17,
        feedback: 'Good arguments, improve diagrams.',
      },
    ],
  },
  {
    id: `${courseId}-assignment-2`,
    courseId,
    title: 'Assignment 2: Molecular Geometry',
    description: 'Solve all VSEPR worksheets.',
    dueAt: inHours(-48),
    totalMarks: 15,
    attachmentUrl: 'https://example.com/materials/vsepr-sheet.pdf',
    attachmentName: 'vsepr-sheet.pdf',
    submissions: [],
  },
]

export const useAssignmentStore = defineStore('classroom-assignment', {
  state: (): AssignmentState => ({
    assignments: [],
    currentAssignment: null,
  }),

  getters: {
    assignmentsByCourse: (state) => (courseId: string) =>
      state.assignments
        .filter((assignment) => assignment.courseId === courseId)
        .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()),
  },

  actions: {
    ensureCourseSeed(courseId: string) {
      if (this.assignments.some((assignment) => assignment.courseId === courseId)) return
      this.assignments = [...seedAssignments(courseId), ...this.assignments]
    },

    setCurrentAssignment(assignmentId: string) {
      this.currentAssignment = this.assignments.find((assignment) => assignment.id === assignmentId) || null
    },

    saveAssignment(assignment: ClassroomAssignment) {
      const exists = this.assignments.some((item) => item.id === assignment.id)
      if (!exists) {
        this.assignments = [assignment, ...this.assignments]
        return
      }
      this.assignments = this.assignments.map((item) => (item.id === assignment.id ? assignment : item))
    },

    saveSubmission(assignmentId: string, submission: ClassroomAssignment['submissions'][number]) {
      this.assignments = this.assignments.map((assignment) => {
        if (assignment.id !== assignmentId) return assignment

        const existingIndex = assignment.submissions.findIndex((item) => item.studentId === submission.studentId)
        if (existingIndex === -1) {
          return {
            ...assignment,
            submissions: [...assignment.submissions, submission],
          }
        }

        const next = [...assignment.submissions]
        next.splice(existingIndex, 1, submission)
        return {
          ...assignment,
          submissions: next,
        }
      })
    },
  },
})

