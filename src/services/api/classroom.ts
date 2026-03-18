import { apiRequest, type ApiResponse } from './client'
import type { UserPreview } from '~/types/user'

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
  const requestId = toId(source.id || source.requestId || source.request_id, String(Date.now()))
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
      displayName: source.studentName || source.student_name || source.userName || source.user_name,
      username: source.studentUsername || source.student_username || source.username,
      avatar:
        source.studentAvatar ||
        source.student_avatar ||
        source.studentProfilePicUrl ||
        source.student_profile_pic_url ||
        source.avatar,
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
    createdAt: toIsoTimestamp(source.createdAt || source.created_at || source.timestamp),
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
): Promise<ApiResponse<ClassroomEnrollmentRequest[]>> => {
  const result = await apiRequest<unknown>(
    `/api/classroom/courses/${encodeURIComponent(courseId)}/enrollment-requests`,
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

export const getMyClassroomEnrollments = async (): Promise<ApiResponse<ClassroomEnrollment[]>> => {
  const result = await apiRequest<unknown>('/api/classroom/me/enrollments', 'GET')
  if (!result.success) return result as ApiResponse<ClassroomEnrollment[]>

  return {
    ...result,
    data: mapEnrollmentsResponse(result.data),
  }
}

