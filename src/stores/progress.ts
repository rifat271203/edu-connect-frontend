import { defineStore } from 'pinia'
import type { StudentProgress, TeacherClassStats, TeacherStudentProgressRow } from '~/types/classroom-room'

interface ProgressState {
  studentProgress: Record<string, StudentProgress>
  classStats: Record<string, TeacherClassStats>
  classStudents: Record<string, TeacherStudentProgressRow[]>
}

const seedStudentProgress = (): StudentProgress => ({
  overallGrade: 84,
  attendancePercentage: 91,
  examScores: [
    { examName: 'Quiz 1', score: 24, total: 30, grade: 'B+', date: new Date(Date.now() - 7 * 86400 * 1000).toISOString() },
    { examName: 'Quiz 2', score: 27, total: 30, grade: 'A-', date: new Date(Date.now() - 2 * 86400 * 1000).toISOString() },
  ],
  assignmentScores: [
    { name: 'Assignment 1', score: 16, total: 20, feedback: 'Good structure, improve citations.', date: new Date(Date.now() - 6 * 86400 * 1000).toISOString() },
    { name: 'Assignment 2', score: 18, total: 20, feedback: 'Excellent effort.', date: new Date(Date.now() - 1 * 86400 * 1000).toISOString() },
  ],
})

const seedClassStats = (): TeacherClassStats => ({
  averageScore: 78,
  attendanceRate: 88,
  submissionRate: 81,
})

const seedStudents = (): TeacherStudentProgressRow[] => [
  { id: 's-1', name: 'Nafis Islam', avgScore: 85, attendancePercent: 93, assignmentsCompleted: 7, overallGrade: 'A-' },
  { id: 's-2', name: 'Tasnim Akter', avgScore: 79, attendancePercent: 88, assignmentsCompleted: 6, overallGrade: 'B+' },
  { id: 's-3', name: 'Rakib Hasan', avgScore: 72, attendancePercent: 82, assignmentsCompleted: 5, overallGrade: 'B' },
  { id: 's-4', name: 'Mim Rahman', avgScore: 66, attendancePercent: 76, assignmentsCompleted: 5, overallGrade: 'C+' },
]

export const useProgressStore = defineStore('classroom-progress', {
  state: (): ProgressState => ({
    studentProgress: {},
    classStats: {},
    classStudents: {},
  }),

  actions: {
    ensureCourseSeed(courseId: string) {
      if (!this.studentProgress[courseId]) {
        this.studentProgress[courseId] = seedStudentProgress()
      }

      if (!this.classStats[courseId]) {
        this.classStats[courseId] = seedClassStats()
      }

      if (!this.classStudents[courseId]) {
        this.classStudents[courseId] = seedStudents()
      }
    },
  },
})

