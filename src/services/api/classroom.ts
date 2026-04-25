import { apiRequest, type ApiResponse } from './client'
import type { UserPreview } from '~/types/user'
import type { Notification as ClassroomNotification, NotificationType } from '~/types/notification'

export interface ClassroomCoursesQuery {
  page?: number
  limit?: number
  q?: string
  status?: 'active' | 'archived'
  sortBy?: 'created_at' | 'createdAt' | 'title' | 'code'
  sortOrder?: 'asc' | 'desc'
}

export interface CreateClassroomCoursePayload {
  title: string
  code: string
  description?: string
  coursePicUrl?: string
  department?: string
}

export interface UpdateClassroomCoursePayload {
  title?: string
  code?: string
  description?: string
  coursePicUrl?: string
  department?: string
  status?: string
}

export interface ClassroomCourse {
  id: string
  title: string
  code?: string
  description?: string
  coursePicUrl?: string
  department?: string
  status: string
  createdAt: string
  updatedAt?: string
  instructor: UserPreview
  enrollmentStatus?: string
  memberCount: number
}

export interface ClassroomEnrollmentRequest {
  id: string
  courseId: string
  student: UserPreview
  status: string
  message?: string
  createdAt: string
}

export interface ClassroomEnrollment {
  id: string
  status: string
  enrolledAt: string
  course: ClassroomCourse
}

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

const toId = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  return fallback
}

const toIsoTimestamp = (value: unknown): string => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  return new Date().toISOString()
}

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }

  return fallback
}

const normalizeUserPreview = (value: unknown, fallbackSeed = 'user'): UserPreview => {
  const root = asRecord(value) || {}
  const source =
    asRecord(root.user) ||
    asRecord(root.student) ||
    asRecord(root.teacher) ||
    asRecord(root.instructor) ||
    asRecord(root.member) ||
    root

  const displayName =
    (typeof source.displayName === 'string' && source.displayName) ||
    (typeof source.display_name === 'string' && source.display_name) ||
    (typeof source.name === 'string' && source.name) ||
    (typeof root.displayName === 'string' && root.displayName) ||
    (typeof root.name === 'string' && root.name) ||
    'User'

  const username =
    (typeof source.username === 'string' && source.username) ||
    (typeof source.user_name === 'string' && source.user_name) ||
    displayName.toLowerCase().replace(/\s+/g, '') ||
    fallbackSeed

  const profilePicUrl =
    (typeof source.avatar === 'string' && source.avatar) ||
    (typeof source.profilePicUrl === 'string' && source.profilePicUrl) ||
    (typeof source.profile_pic_url === 'string' && source.profile_pic_url) ||
    (typeof root.avatar === 'string' && root.avatar) ||
    ''

  const isProfilePublicRaw =
    source.isProfilePublic ??
    source.is_profile_public ??
    root.isProfilePublic ??
    root.is_profile_public

  const isProfilePublic =
    typeof isProfilePublicRaw === 'boolean'
      ? isProfilePublicRaw
      : isProfilePublicRaw === 1 || isProfilePublicRaw === '1' || isProfilePublicRaw === 'true'

  const id = toId(
    source.id || source.userId || source.user_id || root.id || root.userId || root.user_id,
    fallbackSeed,
  )

  return {
    id,
    username,
    displayName,
    avatar: profilePicUrl,
    profilePicUrl,
    isProfilePublic,
  }
}

const pickList = (payload: unknown, keys: string[]): unknown[] => {
  if (Array.isArray(payload)) {
    return payload
  }

  const root = asRecord(payload) || {}
  for (const key of keys) {
    if (Array.isArray(root[key])) {
      return root[key] as unknown[]
    }
  }

  if (Array.isArray(root.data)) {
    return root.data as unknown[]
  }

  const nestedData = asRecord(root.data)
  if (nestedData) {
    for (const key of keys) {
      if (Array.isArray(nestedData[key])) {
        return nestedData[key] as unknown[]
      }
    }
  }

  return []
}

const normalizeCourse = (value: unknown): ClassroomCourse => {
  const source = asRecord(value) || {}
  const id = toId(source.id || source.courseId || source.course_id, globalThis.crypto?.randomUUID?.() || String(Date.now()))

  const instructorSource =
    source.instructor ||
    source.teacher ||
    source.owner ||
    source.creator || {
      id: source.instructorId || source.instructor_id || source.teacherId || source.teacher_id,
      username: source.instructorUsername || source.instructor_username,
      displayName:
        source.instructorName || source.instructor_name || source.teacherName || source.teacher_name,
      avatar:
        source.instructorAvatar ||
        source.instructor_avatar ||
        source.instructorProfilePicUrl ||
        source.instructor_profile_pic_url,
    }

  const statusRaw =
    (typeof source.status === 'string' && source.status) ||
    (typeof source.courseStatus === 'string' && source.courseStatus) ||
    (typeof source.course_status === 'string' && source.course_status) ||
    ''

  const enrollmentStatusRaw =
    (typeof source.enrollmentStatus === 'string' && source.enrollmentStatus) ||
    (typeof source.enrollment_status === 'string' && source.enrollment_status) ||
    (typeof source.requestStatus === 'string' && source.requestStatus) ||
    (typeof source.request_status === 'string' && source.request_status) ||
    ''

  return {
    id,
    title:
      (typeof source.title === 'string' && source.title) ||
      (typeof source.name === 'string' && source.name) ||
      (typeof source.courseTitle === 'string' && source.courseTitle) ||
      (typeof source.course_title === 'string' && source.course_title) ||
      'Untitled Course',
    code:
      (typeof source.code === 'string' && source.code) ||
      (typeof source.courseCode === 'string' && source.courseCode) ||
      (typeof source.course_code === 'string' && source.course_code) ||
      undefined,
    description:
      (typeof source.description === 'string' && source.description) ||
      (typeof source.summary === 'string' && source.summary) ||
      (typeof source.content === 'string' && source.content) ||
      undefined,
    coursePicUrl:
      (typeof source.coursePicUrl === 'string' && source.coursePicUrl) ||
      (typeof source.course_pic_url === 'string' && source.course_pic_url) ||
      (typeof source.coverImage === 'string' && source.coverImage) ||
      (typeof source.cover_image === 'string' && source.cover_image) ||
      undefined,
    department:
      (typeof source.department === 'string' && source.department) ||
      (typeof source.subject === 'string' && source.subject) ||
      undefined,
    status: statusRaw || 'active',
    createdAt: toIsoTimestamp(source.createdAt || source.created_at || source.timestamp),
    updatedAt: toIsoTimestamp(source.updatedAt || source.updated_at || source.modifiedAt || source.modified_at),
    instructor: normalizeUserPreview(instructorSource, `teacher-${id}`),
    enrollmentStatus: enrollmentStatusRaw || undefined,
    memberCount: toNumber(
      source.memberCount ||
        source.member_count ||
        source.studentCount ||
        source.student_count ||
        source.enrollmentCount ||
        source.enrollment_count,
      0,
    ),
  }
}

const normalizeEnrollmentRequest = (value: unknown): ClassroomEnrollmentRequest => {
  const source = asRecord(value) || {}
  const requestId = toId(source.id || source.requestId || source.request_id || source.enrollment_id, String(Date.now()))
  const nestedCourse = asRecord(source.course)
  const courseId = toId(
    source.courseId || source.course_id || nestedCourse?.id || source.classroomCourseId || source.classroom_course_id
  )

  const studentSource =
    source.student ||
    source.user ||
    source.requester ||
    source.member || {
      id: source.studentId || source.student_id || source.userId || source.user_id,
      displayName:
        source.studentName ||
        source.student_name ||
        source.userName ||
        source.user_name ||
        source.displayName ||
        source.display_name ||
        source.name,
      username:
        source.studentUsername ||
        source.student_username ||
        source.username ||
        source.user_name ||
        source.student_email?.split('@')[0],
      avatar:
        source.studentAvatar ||
        source.student_avatar ||
        source.studentProfilePicUrl ||
        source.student_profile_pic_url ||
        source.avatar ||
        source.profilePicUrl ||
        source.profile_pic_url,
    }

  return {
    id: requestId,
    courseId,
    student: normalizeUserPreview(studentSource, `student-${requestId}`),
    status:
      (typeof source.status === 'string' && source.status) ||
      (typeof source.requestStatus === 'string' && source.requestStatus) ||
      (typeof source.request_status === 'string' && source.request_status) ||
      'pending',
    message:
      (typeof source.message === 'string' && source.message) ||
      (typeof source.note === 'string' && source.note) ||
      undefined,
    createdAt: toIsoTimestamp(
      source.createdAt ||
        source.created_at ||
        source.requestedAt ||
        source.requested_at ||
        source.timestamp,
    ),
  }
}

const normalizeEnrollment = (value: unknown): ClassroomEnrollment => {
  const source = asRecord(value) || {}
  const enrollmentId = toId(source.id || source.enrollmentId || source.enrollment_id, String(Date.now()))
  const courseSource = source.course || source.classroom || source.courseInfo || source.course_info || source

  return {
    id: enrollmentId,
    status:
      (typeof source.status === 'string' && source.status) ||
      (typeof source.enrollmentStatus === 'string' && source.enrollmentStatus) ||
      (typeof source.enrollment_status === 'string' && source.enrollment_status) ||
      'approved',
    enrolledAt: toIsoTimestamp(source.enrolledAt || source.enrolled_at || source.createdAt || source.created_at),
    course: normalizeCourse(courseSource),
  }
}

const buildCoursesQueryString = (query: ClassroomCoursesQuery = {}): string => {
  const params = new URLSearchParams()

  if (query.page !== undefined) params.set('page', String(query.page))
  if (query.limit !== undefined) params.set('limit', String(query.limit))
  if (query.q) params.set('q', query.q)
  if (query.status) params.set('status', query.status)
  if (query.sortBy) {
    const normalizedSortBy = query.sortBy === 'createdAt' ? 'created_at' : query.sortBy
    params.set('sortBy', normalizedSortBy)
  }
  if (query.sortOrder) params.set('sortOrder', query.sortOrder)

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

const mapCoursesResponse = (payload: unknown): ClassroomCourse[] =>
  pickList(payload, ['courses', 'items', 'results', 'data']).map(normalizeCourse)

const mapEnrollmentRequestsResponse = (payload: unknown): ClassroomEnrollmentRequest[] =>
  pickList(payload, ['enrollmentRequests', 'requests', 'items', 'results', 'data']).map(normalizeEnrollmentRequest)

const mapEnrollmentsResponse = (payload: unknown): ClassroomEnrollment[] =>
  pickList(payload, ['enrollments', 'items', 'results', 'data']).map(normalizeEnrollment)

const normalizeCourseMutationResponse = (payload: unknown): ClassroomCourse => {
  const root = asRecord(payload) || {}
  const source = asRecord(root.course) || asRecord(root.data) || root
  return normalizeCourse(source)
}

export const createClassroomCourse = async (
  payload: CreateClassroomCoursePayload,
): Promise<ApiResponse<ClassroomCourse>> => {
  const result = await apiRequest<unknown>('/api/classroom/courses', 'POST', payload)
  if (!result.success) return result as ApiResponse<ClassroomCourse>

  return {
    ...result,
    data: normalizeCourseMutationResponse(result.data),
  }
}

export const getClassroomCourses = async (
  query: ClassroomCoursesQuery = {},
): Promise<ApiResponse<ClassroomCourse[]>> => {
  const result = await apiRequest<unknown>(`/api/classroom/courses${buildCoursesQueryString(query)}`, 'GET')
  if (!result.success) return result as ApiResponse<ClassroomCourse[]>

  return {
    ...result,
    data: mapCoursesResponse(result.data),
  }
}

export const updateClassroomCourse = async (
  courseId: string,
  payload: UpdateClassroomCoursePayload,
): Promise<ApiResponse<ClassroomCourse>> => {
  const result = await apiRequest<unknown>(`/api/classroom/courses/${encodeURIComponent(courseId)}`, 'PATCH', payload)
  if (!result.success) return result as ApiResponse<ClassroomCourse>

  return {
    ...result,
    data: normalizeCourseMutationResponse(result.data),
  }
}

export const archiveClassroomCourse = async (courseId: string): Promise<ApiResponse<ClassroomCourse>> => {
  const result = await apiRequest<unknown>(`/api/classroom/courses/${encodeURIComponent(courseId)}/archive`, 'PATCH')
  if (!result.success) return result as ApiResponse<ClassroomCourse>

  return {
    ...result,
    data: normalizeCourseMutationResponse(result.data),
  }
}

export const activateClassroomCourse = async (courseId: string): Promise<ApiResponse<ClassroomCourse>> => {
  const result = await apiRequest<unknown>(`/api/classroom/courses/${encodeURIComponent(courseId)}/activate`, 'PATCH')
  if (!result.success) return result as ApiResponse<ClassroomCourse>

  return {
    ...result,
    data: normalizeCourseMutationResponse(result.data),
  }
}

export const requestCourseEnrollment = async (
  courseId: string,
  note?: string,
): Promise<ApiResponse<ClassroomEnrollmentRequest>> => {
  const trimmedNote = note?.trim()
  const payload = trimmedNote ? { note: trimmedNote, message: trimmedNote } : undefined
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/enrollment-requests`,
    'POST',
    payload,
  )

  if (!result.success) return result as ApiResponse<ClassroomEnrollmentRequest>

  return {
    ...result,
    data: normalizeEnrollmentRequest(result.data),
  }
}

export const getCourseEnrollmentRequests = async (
  courseId: string,
  status?: string,
): Promise<ApiResponse<ClassroomEnrollmentRequest[]>> => {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  const qs = params.toString() ? `?${params.toString()}` : ''
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/enrollment-requests${qs}`,
    'GET',
  )

  if (!result.success) return result as ApiResponse<ClassroomEnrollmentRequest[]>

  return {
    ...result,
    data: mapEnrollmentRequestsResponse(result.data),
  }
}

export const approveCourseEnrollmentRequest = async (
  courseId: string,
  requestId: string,
  reviewNote?: string,
): Promise<ApiResponse<ClassroomEnrollmentRequest>> => {
  const payload = reviewNote?.trim() ? { reviewNote: reviewNote.trim() } : undefined
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/enrollment-requests/${encodeURIComponent(requestId)}/approve`,
    'PATCH',
    payload,
  )

  if (!result.success) return result as ApiResponse<ClassroomEnrollmentRequest>

  return {
    ...result,
    data: normalizeEnrollmentRequest(result.data),
  }
}

export const rejectCourseEnrollmentRequest = async (
  courseId: string,
  requestId: string,
  reviewNote?: string,
): Promise<ApiResponse<ClassroomEnrollmentRequest>> => {
  const payload = reviewNote?.trim() ? { reviewNote: reviewNote.trim() } : undefined
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/enrollment-requests/${encodeURIComponent(requestId)}/reject`,
    'PATCH',
    payload,
  )

  if (!result.success) return result as ApiResponse<ClassroomEnrollmentRequest>

  return {
    ...result,
    data: normalizeEnrollmentRequest(result.data),
  }
}

const classroomNotificationTypes: NotificationType[] = [
  'friend_request',
  'friend_accepted',
  'like',
  'comment',
  'share',
  'mention',
  'follow',
  'enrollment_requested',
  'enrollment_approved',
  'enrollment_rejected',
  'system',
]

const toNotificationType = (value: unknown): NotificationType => {
  if (typeof value === 'string' && classroomNotificationTypes.includes(value as NotificationType)) {
    return value as NotificationType
  }

  return 'system'
}

const normalizeClassroomNotification = (value: unknown): ClassroomNotification => {
  const source = asRecord(value) || {}
  const actorSource =
    asRecord(source.user) ||
    asRecord(source.actor) ||
    asRecord(source.sender) ||
    asRecord(source.student) ||
    asRecord(source.teacher) ||
    source

  const courseSource =
    asRecord(source.course) ||
    asRecord(source.classroomCourse) ||
    asRecord(source.classroom_course) ||
    {}

  const id = toId(
    source.id || source.notificationId || source.notification_id || source.requestId || source.request_id,
    String(Date.now()),
  )

  const message =
    (typeof source.message === 'string' && source.message) ||
    (typeof source.title === 'string' && source.title) ||
    'Notification'

  const courseId =
    (typeof source.courseId === 'string' && source.courseId) ||
    (typeof source.course_id === 'string' && source.course_id) ||
    (typeof courseSource.id === 'string' && courseSource.id) ||
    (typeof courseSource.courseId === 'string' && courseSource.courseId) ||
    undefined

  const courseTitle =
    (typeof source.courseTitle === 'string' && source.courseTitle) ||
    (typeof source.course_title === 'string' && source.course_title) ||
    (typeof courseSource.title === 'string' && courseSource.title) ||
    (typeof courseSource.courseTitle === 'string' && courseSource.courseTitle) ||
    undefined

  const reviewNote =
    (typeof source.reviewNote === 'string' && source.reviewNote) ||
    (typeof source.review_note === 'string' && source.review_note) ||
    undefined

  const actionUrl =
    (typeof source.actionUrl === 'string' && source.actionUrl) ||
    (typeof source.action_url === 'string' && source.action_url) ||
    (courseId ? `/classroom/${encodeURIComponent(courseId)}` : undefined)

  const hasActorData = Boolean(
    source.user ||
      source.actor ||
      source.sender ||
      source.student ||
      source.teacher ||
      source.userId ||
      source.user_id ||
      source.actorId ||
      source.actor_id,
  )

  return {
    id,
    type: toNotificationType(source.type || source.notificationType || source.notification_type),
    user: hasActorData ? normalizeUserPreview(actorSource, `notification-user-${id}`) : undefined,
    content:
      (typeof source.content === 'string' && source.content) ||
      (typeof source.note === 'string' && source.note) ||
      (typeof source.description === 'string' && source.description) ||
      undefined,
    message,
    timestamp: toIsoTimestamp(source.createdAt || source.created_at || source.timestamp),
    read:
      source.read === true ||
      source.read === 1 ||
      source.read === '1' ||
      source.read === 'true' ||
      source.isRead === true ||
      source.isRead === 1 ||
      source.isRead === '1' ||
      source.isRead === 'true' ||
      source.is_read === true ||
      source.is_read === 1 ||
      source.is_read === '1' ||
      source.is_read === 'true',
    actionUrl,
    courseId,
    courseTitle,
    entityId:
      (typeof source.entityId === 'string' && source.entityId) ||
      (typeof source.entity_id === 'string' && source.entity_id) ||
      (typeof source.requestId === 'string' && source.requestId) ||
      (typeof source.request_id === 'string' && source.request_id) ||
      undefined,
    entityType:
      (typeof source.entityType === 'string' && source.entityType) ||
      (typeof source.entity_type === 'string' && source.entity_type) ||
      undefined,
    reviewNote,
  }
}

const mapClassroomNotificationsResponse = (payload: unknown): ClassroomNotification[] => {
  return pickList(payload, ['notifications', 'items', 'results', 'data']).map(normalizeClassroomNotification)
}

export const getClassroomNotifications = async (): Promise<ApiResponse<ClassroomNotification[]>> => {
  const result = await apiRequest<unknown>('/api/classroom/notifications', 'GET')
  if (!result.success) return result as ApiResponse<ClassroomNotification[]>

  return {
    ...result,
    data: mapClassroomNotificationsResponse(result.data),
  }
}

export const getMyClassroomEnrollments = async (): Promise<ApiResponse<ClassroomEnrollment[]>> => {
  const result = await apiRequest<unknown>('/api/classroom/me/enrollments', 'GET')
  if (!result.success) return result as ApiResponse<ClassroomEnrollment[]>

  return {
    ...result,
    data: mapEnrollmentsResponse(result.data),
  }
}

// --- Notices ---

export const getClassroomNotices = async (courseId: string): Promise<ApiResponse<any[]>> => {
  return await apiRequest<any[]>(`/api/classroom/courses/${encodeURIComponent(courseId)}/notices`, 'GET')
}

export const createClassroomNotice = async (courseId: string, payload: any): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/notices`, 'POST', payload)
}

export const acknowledgeNotice = async (courseId: string, noticeId: string): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/notices/${encodeURIComponent(noticeId)}/acknowledge`, 'POST')
}

// --- Notes ---

export const getSharedNotes = async (courseId: string): Promise<ApiResponse<any[]>> => {
  return await apiRequest<any[]>(`/api/classroom/courses/${encodeURIComponent(courseId)}/notes/shared`, 'GET')
}

export const uploadSharedNote = async (courseId: string, payload: any): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/notes/shared`, 'POST', payload)
}

export const getPersonalNotes = async (courseId: string): Promise<ApiResponse<any[]>> => {
  return await apiRequest<any[]>(`/api/classroom/courses/${encodeURIComponent(courseId)}/notes/personal`, 'GET')
}

export const createPersonalNote = async (courseId: string, payload: any): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/notes/personal`, 'POST', payload)
}

// --- Exams ---

export const getClassroomExams = async (courseId: string): Promise<ApiResponse<any[]>> => {
  return await apiRequest<any[]>(`/api/classroom/courses/${encodeURIComponent(courseId)}/exams`, 'GET')
}

export const createClassroomExam = async (courseId: string, payload: any): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/exams`, 'POST', payload)
}

export const startExam = async (courseId: string, examId: string): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/exams/${encodeURIComponent(examId)}/start`, 'GET')
}

export const submitExam = async (courseId: string, examId: string, payload: any): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/exams/${encodeURIComponent(examId)}/submit`, 'POST', payload)
}

export const getExamResult = async (courseId: string, examId: string): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/exams/${encodeURIComponent(examId)}/result`, 'GET')
}

// --- Assignments ---

export const getClassroomAssignments = async (courseId: string): Promise<ApiResponse<any[]>> => {
  return await apiRequest<any[]>(`/api/classroom/courses/${encodeURIComponent(courseId)}/assignments`, 'GET')
}

export const createClassroomAssignment = async (courseId: string, payload: any): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/assignments`, 'POST', payload)
}

export const getAssignmentDetails = async (courseId: string, assignmentId: string): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(assignmentId)}`, 'GET')
}

export const submitAssignment = async (courseId: string, assignmentId: string, payload: any): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/assignments/${encodeURIComponent(assignmentId)}/submit`, 'POST', payload)
}

// --- Schedule ---

export const getClassroomSchedule = async (courseId: string): Promise<ApiResponse<any[]>> => {
  return await apiRequest<any[]>(`/api/classroom/courses/${encodeURIComponent(courseId)}/schedule`, 'GET')
}

export const getUpcomingSessions = async (courseId: string): Promise<ApiResponse<any[]>> => {
  return await apiRequest<any[]>(`/api/classroom/courses/${encodeURIComponent(courseId)}/schedule/upcoming`, 'GET')
}

export const createScheduleSession = async (courseId: string, payload: any): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/schedule`, 'POST', payload)
}

// --- Progress ---

export const getMyProgress = async (courseId: string): Promise<ApiResponse<any>> => {
  return await apiRequest<any>(`/api/classroom/courses/${encodeURIComponent(courseId)}/progress/me`, 'GET')
}

// --- Course Details (single course with enrollment context) ---

export interface CourseDetailResponse {
  course: ClassroomCourse
  isEnrolled: boolean
  enrollmentStatus?: string
  materials?: unknown[]
  liveRoom?: unknown
}

export const getCourseSingleDetails = async (courseId: string): Promise<ApiResponse<CourseDetailResponse>> => {
  const result = await apiRequest<unknown>(`/api/classroom/courses/${encodeURIComponent(courseId)}`, 'GET')
  if (!result.success) return result as ApiResponse<CourseDetailResponse>

  const root = asRecord(result.data) || {}
  const courseSource = asRecord(root.course) || root
  const enrollmentStatusRaw =
    (typeof root.enrollmentStatus === 'string' && root.enrollmentStatus) ||
    (typeof root.enrollment_status === 'string' && root.enrollment_status) ||
    (typeof courseSource.enrollmentStatus === 'string' && courseSource.enrollmentStatus) ||
    ''

  const isEnrolledRaw = root.isEnrolled ?? root.is_enrolled
  const isEnrolled =
    isEnrolledRaw === true ||
    isEnrolledRaw === 1 ||
    isEnrolledRaw === '1' ||
    isEnrolledRaw === 'true' ||
    ['approved', 'active', 'enrolled'].includes(enrollmentStatusRaw.toLowerCase())

  return {
    ...result,
    data: {
      course: normalizeCourse(courseSource),
      isEnrolled,
      enrollmentStatus: enrollmentStatusRaw || undefined,
      materials: asArray(root.materials || root.resources),
      liveRoom: asRecord(root.liveRoom || root.live_room),
    },
  }
}

// --- Course Live Room ---

export interface CourseLiveRoomInfo {
  roomId: string
  courseId: string
  status: string
  participantCount: number
  startedAt?: string
  title?: string
  createdBy?: string
}

const normalizeLiveRoom = (value: unknown, courseId: string): CourseLiveRoomInfo | null => {
  const source = asRecord(value)
  if (!source) return null

  const roomId = toId(source.roomId || source.room_id || source.id)
  if (!roomId) return null

  return {
    roomId,
    courseId: toId(source.courseId || source.course_id) || courseId,
    status:
      (typeof source.status === 'string' && source.status) || 'waiting',
    participantCount: toNumber(source.participantCount || source.participant_count),
    startedAt:
      (typeof source.startedAt === 'string' && source.startedAt) ||
      (typeof source.started_at === 'string' && source.started_at) ||
      undefined,
    title: (typeof source.title === 'string' && source.title) || undefined,
    createdBy: toId(source.createdBy || source.created_by || source.teacherId || source.teacher_id) || undefined,
  }
}

export const getCourseLiveRoom = async (courseId: string): Promise<ApiResponse<CourseLiveRoomInfo | null>> => {
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/live-room`,
    'GET',
  )

  if (!result.success) {
    // 404 means no active room — not an error
    if (result.status === 404) {
      return { success: true, data: null, status: 200 }
    }
    return result as ApiResponse<CourseLiveRoomInfo | null>
  }

  const root = asRecord(result.data) || {}
  const roomSource = asRecord(root.liveRoom) || asRecord(root.room) || asRecord(root.data) || root

  return {
    ...result,
    data: normalizeLiveRoom(roomSource, courseId),
  }
}

export const createCourseLiveRoom = async (
  courseId: string,
  title?: string,
): Promise<ApiResponse<CourseLiveRoomInfo>> => {
  const payload = title?.trim() ? { title: title.trim() } : undefined
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/live-room`,
    'POST',
    payload,
  )

  if (!result.success) return result as ApiResponse<CourseLiveRoomInfo>

  const root = asRecord(result.data) || {}
  const roomSource = asRecord(root.liveRoom) || asRecord(root.room) || asRecord(root.data) || root
  const normalized = normalizeLiveRoom(roomSource, courseId)

  if (!normalized) {
    return {
      success: false,
      error: 'Live room created but response is missing room info',
      status: result.status,
    }
  }

  return { ...result, data: normalized }
}

export const deactivateCourseLiveRoom = async (courseId: string): Promise<ApiResponse<{ message: string }>> => {
  return await apiRequest<{ message: string }>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/live-room`,
    'DELETE',
  )
}

// --- Course Materials ---

export interface CourseMaterialItem {
  id: string
  courseId: string
  title: string
  description?: string
  type: string
  url?: string
  thumbnailUrl?: string
  visibility: string
  uploadedAt: string
  uploadedBy?: string
  uploadedByName?: string
  fileSize?: number
  duration?: number
  downloadCount?: number
}

const normalizeCourseMaterial = (value: unknown, courseId: string): CourseMaterialItem => {
  const source = asRecord(value) || {}

  return {
    id: toId(source.id || source.materialId || source.material_id, String(Date.now())),
    courseId: toId(source.courseId || source.course_id) || courseId,
    title:
      (typeof source.title === 'string' && source.title) ||
      (typeof source.name === 'string' && source.name) ||
      'Untitled Material',
    description:
      (typeof source.description === 'string' && source.description) || undefined,
    type:
      (typeof source.type === 'string' && source.type) ||
      (typeof source.category === 'string' && source.category) ||
      (typeof source.materialType === 'string' && source.materialType) ||
      (typeof source.material_type === 'string' && source.material_type) ||
      'document',
    url:
      (typeof source.url === 'string' && source.url) ||
      (typeof source.fileUrl === 'string' && source.fileUrl) ||
      (typeof source.file_url === 'string' && source.file_url) ||
      (typeof source.videoUrl === 'string' && source.videoUrl) ||
      (typeof source.video_url === 'string' && source.video_url) ||
      undefined,
    thumbnailUrl:
      (typeof source.thumbnailUrl === 'string' && source.thumbnailUrl) ||
      (typeof source.thumbnail_url === 'string' && source.thumbnail_url) ||
      (typeof source.thumbnail === 'string' && source.thumbnail) ||
      undefined,
    visibility:
      (typeof source.visibility === 'string' && source.visibility) ||
      'enrolled_only',
    uploadedAt: toIsoTimestamp(source.uploadedAt || source.uploaded_at || source.createdAt || source.created_at),
    uploadedBy: toId(source.uploadedBy || source.uploaded_by || source.teacherId || source.teacher_id) || undefined,
    uploadedByName:
      (typeof source.uploadedByName === 'string' && source.uploadedByName) ||
      (typeof source.uploaded_by_name === 'string' && source.uploaded_by_name) ||
      (typeof source.teacherName === 'string' && source.teacherName) ||
      undefined,
    fileSize: toNumber(source.fileSize || source.file_size, 0) || undefined,
    duration: toNumber(source.duration, 0) || undefined,
    downloadCount: toNumber(source.downloadCount || source.download_count, 0),
  }
}

export const getCourseMaterials = async (
  courseId: string,
  type?: string,
): Promise<ApiResponse<CourseMaterialItem[]>> => {
  const params = new URLSearchParams()
  if (type) params.set('type', type)
  const qs = params.toString() ? `?${params.toString()}` : ''

  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/materials${qs}`,
    'GET',
  )

  if (!result.success) return result as ApiResponse<CourseMaterialItem[]>

  const items = pickList(result.data, ['materials', 'items', 'resources', 'data'])

  return {
    ...result,
    data: items.map((item) => normalizeCourseMaterial(item, courseId)),
  }
}

export const uploadCourseMaterial = async (
  courseId: string,
  payload: {
    title: string
    description?: string
    type: string
    url: string
    visibility?: string
    thumbnailUrl?: string
    duration?: number
  },
): Promise<ApiResponse<CourseMaterialItem>> => {
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/materials`,
    'POST',
    payload,
  )

  if (!result.success) return result as ApiResponse<CourseMaterialItem>

  const root = asRecord(result.data) || {}
  const source = asRecord(root.material) || asRecord(root.data) || root

  return {
    ...result,
    data: normalizeCourseMaterial(source, courseId),
  }
}

// --- Recorded Classes ---

export const getCourseRecordedClasses = async (courseId: string): Promise<ApiResponse<CourseMaterialItem[]>> => {
  return await getCourseMaterials(courseId, 'recording')
}

// --- Public Preview ---

export const getCoursePublicPreview = async (courseId: string): Promise<ApiResponse<CourseMaterialItem[]>> => {
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/materials/public`,
    'GET',
  )

  if (!result.success) return result as ApiResponse<CourseMaterialItem[]>

  const items = pickList(result.data, ['materials', 'items', 'resources', 'data'])

  return {
    ...result,
    data: items.map((item) => normalizeCourseMaterial(item, courseId)),
  }
}

// --- Course Group Chat ---

export interface CourseGroupChatInfo {
  id: string
  courseId: string
  courseTitle: string
  memberCount: number
  lastMessageText?: string
  lastMessageAt?: string
  unreadCount: number
}

const normalizeGroupChat = (value: unknown, courseId: string): CourseGroupChatInfo => {
  const source = asRecord(value) || {}

  return {
    id: toId(source.id || source.groupId || source.group_id || source.chatId || source.chat_id, courseId),
    courseId: toId(source.courseId || source.course_id) || courseId,
    courseTitle:
      (typeof source.courseTitle === 'string' && source.courseTitle) ||
      (typeof source.course_title === 'string' && source.course_title) ||
      (typeof source.title === 'string' && source.title) ||
      'Course Chat',
    memberCount: toNumber(source.memberCount || source.member_count, 0),
    lastMessageText:
      (typeof source.lastMessageText === 'string' && source.lastMessageText) ||
      (typeof source.last_message_text === 'string' && source.last_message_text) ||
      (typeof source.lastMessage === 'string' && source.lastMessage) ||
      undefined,
    lastMessageAt:
      (typeof source.lastMessageAt === 'string' && source.lastMessageAt) ||
      (typeof source.last_message_at === 'string' && source.last_message_at) ||
      undefined,
    unreadCount: toNumber(source.unreadCount || source.unread_count, 0),
  }
}

export const getCourseGroupChat = async (courseId: string): Promise<ApiResponse<CourseGroupChatInfo>> => {
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/group-chat`,
    'GET',
  )

  if (!result.success) return result as ApiResponse<CourseGroupChatInfo>

  const root = asRecord(result.data) || {}
  const source = asRecord(root.group) || asRecord(root.chat) || asRecord(root.data) || root

  return {
    ...result,
    data: normalizeGroupChat(source, courseId),
  }
}

export interface StreamTokenResponse {
  token: string
  apiKey: string
}

export const getStreamToken = async (): Promise<ApiResponse<StreamTokenResponse>> => {
  return await apiRequest<StreamTokenResponse>('/api/stream/token', 'GET')
}

