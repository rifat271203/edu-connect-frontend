import { defineStore } from 'pinia'
import type { ClassroomCourseInfo, ClassroomUserRole } from '~/types/classroom-room'
import type { CourseLiveRoomInfo, CourseMaterialItem, CourseGroupChatInfo } from '~/services/api/classroom'
import {
  getClassroomCourses,
  getMyClassroomEnrollments,
  getCourseLiveRoom,
  createCourseLiveRoom,
  getCourseMaterials,
  getCourseRecordedClasses,
  getCourseGroupChat,
  getCourseSingleDetails,
} from '~/services/api/classroom'
import { useUserStore } from '~/stores/user'

interface ClassroomState {
  courseId: string
  course: ClassroomCourseInfo | null
  userRole: ClassroomUserRole
  loading: boolean
  initialized: boolean
  isEnrolled: boolean
  enrollmentStatus: string

  // Live room
  liveRoom: CourseLiveRoomInfo | null
  liveRoomLoading: boolean

  // Materials
  materials: CourseMaterialItem[]
  materialsLoading: boolean

  // Recorded classes
  recordedClasses: CourseMaterialItem[]
  recordedClassesLoading: boolean

  // Group chat
  groupChat: CourseGroupChatInfo | null
  groupChatLoading: boolean
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
    isEnrolled: false,
    enrollmentStatus: '',

    liveRoom: null,
    liveRoomLoading: false,

    materials: [],
    materialsLoading: false,

    recordedClasses: [],
    recordedClassesLoading: false,

    groupChat: null,
    groupChatLoading: false,
  }),

  getters: {
    hasCourse: (state) => Boolean(state.course),

    materialsByType: (state) => (type: string) =>
      state.materials.filter((m) => m.type === type),

    notices: (state) => state.materials.filter((m) => m.type === 'notice'),
    pdfs: (state) => state.materials.filter((m) => m.type === 'pdf'),
    books: (state) => state.materials.filter((m) => m.type === 'book'),
    documents: (state) => state.materials.filter((m) => ['pdf', 'document', 'book'].includes(m.type)),
    videos: (state) => state.materials.filter((m) => ['video', 'recording'].includes(m.type)),

    hasActiveLiveRoom: (state) =>
      state.liveRoom !== null && ['waiting', 'live'].includes(state.liveRoom.status),
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
      this.isEnrolled = false
      this.enrollmentStatus = ''
      this.liveRoom = null
      this.liveRoomLoading = false
      this.materials = []
      this.materialsLoading = false
      this.recordedClasses = []
      this.recordedClassesLoading = false
      this.groupChat = null
      this.groupChatLoading = false
    },

    async initialize(courseId: string) {
      this.loading = true
      this.courseId = courseId

      const userStore = useUserStore()
      this.userRole = normalizeRole(userStore.user?.role)

      // Try to get single course details first (which includes enrollment context)
      const detailResult = await getCourseSingleDetails(courseId)
      if (detailResult.success && detailResult.data) {
        const { course, isEnrolled, enrollmentStatus } = detailResult.data
        const isOwner = String(course.instructor.id) === String(userStore.user?.id)

        this.userRole = isOwner || this.userRole === 'teacher' ? 'teacher' : this.userRole
        this.isEnrolled = isEnrolled || this.userRole === 'teacher'
        this.enrollmentStatus = enrollmentStatus || ''
        this.course = {
          id: course.id,
          title: course.title,
          code: course.code,
          description: course.description,
          coverImage: course.coursePicUrl,
          teacherId: String(course.instructor.id),
          teacherName: course.instructor.displayName,
          memberCount: course.memberCount,
        }
        this.initialized = true
        this.loading = false
        return true
      }

      // Fallback: try loading from courses list
      const teacherResult = await getClassroomCourses({ page: 1, limit: 200 })
      if (teacherResult.success && teacherResult.data) {
        const found = teacherResult.data.find((course) => course.id === courseId)
        if (found) {
          const isOwner = String(found.instructor.id) === String(userStore.user?.id)
          this.userRole = isOwner || this.userRole === 'teacher' ? 'teacher' : this.userRole
          this.isEnrolled = isOwner || this.userRole === 'teacher'
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

      // Fallback: check enrollments
      const enrollmentResult = await getMyClassroomEnrollments()
      if (enrollmentResult.success && enrollmentResult.data) {
        const enrollment = enrollmentResult.data.find((item) => item.course.id === courseId)
        if (enrollment) {
          this.userRole = 'student'
          this.isEnrolled = true
          this.enrollmentStatus = enrollment.status
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

      // Course exists but user is not enrolled (public view)
      this.course = null
      this.isEnrolled = false
      this.loading = false
      this.initialized = true
      return false
    },

    async fetchLiveRoom() {
      if (!this.courseId) return
      this.liveRoomLoading = true
      const result = await getCourseLiveRoom(this.courseId)
      this.liveRoomLoading = false

      if (result.success) {
        this.liveRoom = result.data || null
      }
    },

    async startLiveRoom(title?: string) {
      if (!this.courseId) return null
      this.liveRoomLoading = true
      const result = await createCourseLiveRoom(this.courseId, title)
      this.liveRoomLoading = false

      if (result.success && result.data) {
        this.liveRoom = result.data
        return result.data
      }
      return null
    },

    async fetchMaterials(type?: string) {
      if (!this.courseId) return
      this.materialsLoading = true
      const result = await getCourseMaterials(this.courseId, type)
      this.materialsLoading = false

      if (result.success && result.data) {
        if (type) {
          // Merge with existing, replacing items of same type
          const otherMaterials = this.materials.filter((m) => m.type !== type)
          this.materials = [...otherMaterials, ...result.data]
        } else {
          this.materials = result.data
        }
      }
    },

    async fetchRecordedClasses() {
      if (!this.courseId) return
      this.recordedClassesLoading = true
      const result = await getCourseRecordedClasses(this.courseId)
      this.recordedClassesLoading = false

      if (result.success && result.data) {
        this.recordedClasses = result.data
      }
    },

    async fetchGroupChat() {
      if (!this.courseId) return
      this.groupChatLoading = true
      const result = await getCourseGroupChat(this.courseId)
      this.groupChatLoading = false

      if (result.success && result.data) {
        this.groupChat = result.data
      }
    },

    async loadCourseData() {
      if (!this.courseId) return
      await Promise.all([
        this.fetchLiveRoom(),
        this.fetchMaterials(),
        this.fetchRecordedClasses(),
        this.fetchGroupChat(),
      ])
    },
  },
})
