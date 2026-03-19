import { defineStore } from 'pinia'
import type { ClassroomCourseInfo, ClassroomUserRole } from '~/types/classroom-room'
import { getClassroomCourses, getMyClassroomEnrollments } from '~/services/api/classroom'
import { useUserStore } from '~/stores/user'

interface ClassroomState {
  courseId: string
  course: ClassroomCourseInfo | null
  userRole: ClassroomUserRole
  loading: boolean
  initialized: boolean
}

const normalizeRole = (raw: string | undefined): ClassroomUserRole =>
  raw === 'teacher' ? 'teacher' : 'student'

export const useClassroomStore = defineStore('classroom-room', {
  state: (): ClassroomState => ({
    courseId: '',
    course: null,
    userRole: 'student',
    loading: false,
    initialized: false,
  }),

  getters: {
    hasCourse: (state) => Boolean(state.course),
  },

  actions: {
    setCourseId(courseId: string) {
      this.courseId = courseId
    },

    reset() {
      this.course = null
      this.courseId = ''
      this.loading = false
      this.initialized = false
    },

    async initialize(courseId: string) {
      this.loading = true
      this.courseId = courseId

      const userStore = useUserStore()
      this.userRole = normalizeRole(userStore.user?.role)

      const teacherResult = await getClassroomCourses({ page: 1, limit: 200 })
      if (teacherResult.success && teacherResult.data) {
        const found = teacherResult.data.find((course) => course.id === courseId)
        if (found) {
          this.userRole = String(found.instructor.id) === String(userStore.user?.id) ? 'teacher' : this.userRole
          this.course = {
            id: found.id,
            title: found.title,
            code: found.code,
            description: found.description,
            coverImage: found.coursePicUrl,
            teacherId: String(found.instructor.id),
            teacherName: found.instructor.displayName,
            memberCount: found.memberCount,
          }
          this.initialized = true
          this.loading = false
          return true
        }
      }

      const enrollmentResult = await getMyClassroomEnrollments()
      if (enrollmentResult.success && enrollmentResult.data) {
        const enrollment = enrollmentResult.data.find((item) => item.course.id === courseId)
        if (enrollment) {
          this.userRole = 'student'
          this.course = {
            id: enrollment.course.id,
            title: enrollment.course.title,
            code: enrollment.course.code,
            description: enrollment.course.description,
            coverImage: enrollment.course.coursePicUrl,
            teacherId: String(enrollment.course.instructor.id),
            teacherName: enrollment.course.instructor.displayName,
            memberCount: enrollment.course.memberCount,
          }
          this.initialized = true
          this.loading = false
          return true
        }
      }

      this.course = null
      this.loading = false
      this.initialized = true
      return false
    },
  },
})

