<template>
  <div class="mx-auto max-w-4xl p-4 pb-24 lg:pb-4">
    <header class="mb-6">
      <h1 class="text-2xl font-bold text-[var(--text)]">Classroom</h1>
      <p class="text-[var(--text-2)]">
        {{
          isTeacher
            ? 'Create and manage private courses for your students.'
            : 'Discover courses, request enrollment, and access your classrooms.'
        }}
      </p>
    </header>

    <UiCard class="mb-6 p-4">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-[var(--text)]">Live class meetings</h2>
          <p class="text-sm text-[var(--text-2)]">
            {{ isTeacher ? 'Start a room and share the ID with your class.' : 'Join a room using the ID shared by your teacher.' }}
          </p>
        </div>

        <div v-if="isTeacher">
          <UiButton :loading="meetingCreating" :disabled="meetingCreating" @click="handleCreateMeeting">
            {{ meetingCreating ? 'Creating...' : 'Create Room' }}
          </UiButton>
        </div>

        <div v-else class="flex items-center gap-2">
          <UiInput
            v-model="joinRoomId"
            placeholder="Enter room ID"
            class="min-w-44"
            @keydown.enter.prevent="handleJoinMeeting"
          />
          <UiButton @click="handleJoinMeeting">Join Room</UiButton>
        </div>
      </div>

      <p v-if="meetingError" class="mt-3 text-sm text-[var(--danger)]">{{ meetingError }}</p>
    </UiCard>

    <p v-if="classroomInfo" class="mb-4 text-sm text-green-400">{{ classroomInfo }}</p>
    <p v-if="classroomError" class="mb-4 text-sm text-[var(--danger)]">{{ classroomError }}</p>

    <div v-if="pageLoading" class="space-y-4">
      <UiCard v-for="i in 3" :key="`classroom-loading-${i}`" class="p-4">
        <UiSkeleton variant="text" class="mb-2 w-36" />
        <UiSkeleton variant="text" class="mb-3 w-full" />
        <UiSkeleton variant="rectangular" class="h-24" />
      </UiCard>
    </div>

    <template v-else>
      <section v-if="isTeacher" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-lg font-semibold text-[var(--text)]">Your course feed</h2>
          <div class="flex items-center gap-2">
            <UiButton @click="openCreateCourseModal">Create Course</UiButton>
            <UiButton variant="secondary" size="sm" :disabled="coursesLoading" @click="loadTeacherCourses">
              Refresh
            </UiButton>
          </div>
        </div>

        <div v-if="!teacherCourses.length" class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-2)]">
          No courses yet. Click <strong>Create Course</strong> to publish your first classroom post.
        </div>

        <div v-else class="space-y-4">
          <UiCard v-for="course in teacherCourses" :key="`teacher-course-${course.id}`" class="p-4">
            <div class="mb-3 flex items-center gap-3">
              <UiAvatar :src="course.instructor.avatar" :name="course.instructor.displayName" size="md" />
              <div class="min-w-0 flex-1">
                <p class="font-medium text-[var(--text)] truncate">{{ course.instructor.displayName }}</p>
                <p class="text-sm text-[var(--text-3)]">@{{ course.instructor.username }} · {{ formatTimestamp(course.createdAt) }}</p>
              </div>
              <UiBadge :variant="course.status === 'archived' ? 'warning' : 'success'">{{ course.status }}</UiBadge>
            </div>

            <h3 class="text-lg font-semibold text-[var(--text)]">{{ course.title }}</h3>
            <div v-if="course.coursePicUrl" class="mt-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
              <img
                :src="course.coursePicUrl"
                :alt="`${course.title} cover`"
                class="h-44 w-full object-cover"
                loading="lazy"
              />
            </div>
            <p class="mt-1 whitespace-pre-wrap text-sm text-[var(--text-2)]">{{ course.description || 'No description added yet.' }}</p>

            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-3)]">
              <span v-if="course.code" class="rounded-full bg-[var(--surface-2)] px-2 py-1">Code: {{ course.code }}</span>
              <span v-if="course.department" class="rounded-full bg-[var(--surface-2)] px-2 py-1">Dept: {{ course.department }}</span>
              <span class="rounded-full bg-[var(--surface-2)] px-2 py-1">Members: {{ course.memberCount }}</span>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <UiButton
                v-if="course.status === 'archived'"
                size="sm"
                variant="secondary"
                :disabled="courseStatusActionId === course.id"
                @click="handleActivateCourse(course.id)"
              >
                Activate
              </UiButton>
              <UiButton
                v-else
                size="sm"
                variant="secondary"
                :disabled="courseStatusActionId === course.id"
                @click="handleArchiveCourse(course.id)"
              >
                Archive
              </UiButton>

              <UiButton
                size="sm"
                variant="ghost"
                :disabled="requestsLoadingByCourse[course.id]"
                @click="toggleEnrollmentRequests(course.id)"
              >
                {{ openRequestsByCourse[course.id] ? 'Hide requests' : 'Manage requests' }}
              </UiButton>
            </div>

            <div v-if="openRequestsByCourse[course.id]" class="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
              <p v-if="requestsLoadingByCourse[course.id]" class="text-sm text-[var(--text-2)]">Loading enrollment requests...</p>

              <template v-else>
                <p v-if="!pendingRequestsForCourse(course.id).length" class="text-sm text-[var(--text-2)]">No pending enrollment requests.</p>

                <div v-else class="space-y-2">
                  <div
                    v-for="request in pendingRequestsForCourse(course.id)"
                    :key="`enrollment-request-${request.id}`"
                    class="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[var(--surface)] p-3"
                  >
                    <div class="flex items-center gap-3">
                      <UiAvatar :src="request.student.avatar" :name="request.student.displayName" size="sm" />
                      <div>
                        <p class="text-sm font-medium text-[var(--text)]">{{ request.student.displayName }}</p>
                        <p class="text-xs text-[var(--text-3)]">@{{ request.student.username }}</p>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <UiButton
                        size="sm"
                        :disabled="Boolean(enrollmentActionLoadingByRequest[request.id])"
                        @click="handleApproveRequest(course.id, request.id)"
                      >
                        Approve
                      </UiButton>
                      <UiButton
                        size="sm"
                        variant="danger"
                        :disabled="Boolean(enrollmentActionLoadingByRequest[request.id])"
                        @click="handleRejectRequest(course.id, request.id)"
                      >
                        Reject
                      </UiButton>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </UiCard>
        </div>
      </section>

      <section v-else class="space-y-6">
        <section>
          <div class="mb-3 flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-[var(--text)]">My enrolled courses</h2>
            <UiButton variant="secondary" size="sm" :disabled="enrollmentsLoading" @click="loadMyEnrollments">
              Refresh
            </UiButton>
          </div>

          <div v-if="!myEnrollments.length" class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-2)]">
            You are not enrolled in any courses yet.
          </div>

          <div v-else class="grid gap-3 md:grid-cols-2">
            <UiCard v-for="enrollment in myEnrollments" :key="`enrollment-${enrollment.id}`" class="p-4">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <h3 class="font-semibold text-[var(--text)]">{{ enrollment.course.title }}</h3>
                  <p class="mt-1 text-sm text-[var(--text-2)]">{{ enrollment.course.description || 'No description.' }}</p>
                  <p class="mt-2 text-xs text-[var(--text-3)]">
                    Teacher: {{ enrollment.course.instructor.displayName }} · {{ formatTimestamp(enrollment.enrolledAt) }}
                  </p>
                </div>
                <UiBadge variant="success">{{ enrollment.status }}</UiBadge>
              </div>
            </UiCard>
          </div>
        </section>

        <section>
          <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 class="text-lg font-semibold text-[var(--text)]">Course feed</h2>
            <div class="flex items-center gap-2">
              <UiInput v-model="discoverQuery" placeholder="Search courses" class="min-w-56" />
              <UiButton variant="secondary" size="sm" :disabled="coursesLoading" @click="loadDiscoverCourses">Refresh</UiButton>
            </div>
          </div>

          <div v-if="!filteredDiscoverCourses.length" class="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-2)]">
            No courses found with the current filters.
          </div>

          <div v-else class="space-y-4">
            <UiCard v-for="course in filteredDiscoverCourses" :key="`discover-course-${course.id}`" class="p-4">
              <div class="mb-3 flex items-center gap-3">
                <UiAvatar :src="course.instructor.avatar" :name="course.instructor.displayName" size="md" />
                <div class="min-w-0 flex-1">
                  <p class="font-medium text-[var(--text)] truncate">{{ course.instructor.displayName }}</p>
                  <p class="text-sm text-[var(--text-3)]">@{{ course.instructor.username }} · {{ formatTimestamp(course.createdAt) }}</p>
                </div>
                <UiBadge :variant="course.status === 'archived' ? 'warning' : 'accent'">{{ course.status }}</UiBadge>
              </div>

              <h3 class="text-lg font-semibold text-[var(--text)]">{{ course.title }}</h3>
              <div v-if="course.coursePicUrl" class="mt-3 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-2)]">
                <img
                  :src="course.coursePicUrl"
                  :alt="`${course.title} cover`"
                  class="h-44 w-full object-cover"
                  loading="lazy"
                />
              </div>
              <p class="mt-1 whitespace-pre-wrap text-sm text-[var(--text-2)]">{{ course.description || 'No description added yet.' }}</p>

              <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-3)]">
                <span v-if="course.code" class="rounded-full bg-[var(--surface-2)] px-2 py-1">Code: {{ course.code }}</span>
                <span v-if="course.department" class="rounded-full bg-[var(--surface-2)] px-2 py-1">Dept: {{ course.department }}</span>
                <span class="rounded-full bg-[var(--surface-2)] px-2 py-1">Members: {{ course.memberCount }}</span>
              </div>

              <div class="mt-4">
                <UiButton
                  v-if="getEnrollmentState(course) === 'enrolled'"
                  size="sm"
                  variant="secondary"
                  disabled
                >
                  Enrolled
                </UiButton>
                <UiButton
                  v-else-if="getEnrollmentState(course) === 'pending'"
                  size="sm"
                  variant="secondary"
                  disabled
                >
                  Request pending
                </UiButton>
                <UiButton
                  v-else
                  size="sm"
                  :disabled="isEnrollmentSubmitting(course.id)"
                  :loading="isEnrollmentSubmitting(course.id)"
                  @click="handleEnrollmentRequest(course.id)"
                >
                  Enroll
                </UiButton>
              </div>
            </UiCard>
          </div>
        </section>
      </section>
    </template>

    <div
      v-if="isTeacher && showCreateCourseModal"
      class="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        @click="closeCreateCourseModal"
      />

      <div class="relative w-full max-w-xl card-theme p-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-xl font-semibold text-[var(--text)]">Create Course</h3>
            <p class="mt-1 text-sm text-[var(--text-2)]">Upload a course image and publish it as a course feed post.</p>
          </div>
          <button
            type="button"
            class="btn-ghost !h-9 !w-9 !p-0"
            :disabled="creatingCourse"
            @click="closeCreateCourseModal"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mt-4 space-y-3">
          <input
            ref="coursePicInputRef"
            type="file"
            class="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            @change="onCoursePicSelected"
          />

          <div class="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <img
              v-if="coursePicPreviewUrl"
              :src="coursePicPreviewUrl"
              alt="Course preview"
              class="h-44 w-full object-cover"
            />
            <div v-else class="flex h-44 items-center justify-center text-sm text-[var(--text-3)]">
              No course image selected
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <UiButton type="button" variant="secondary" @click="openCoursePicPicker">Upload Course Image</UiButton>
            <span v-if="selectedCoursePicFile" class="max-w-[220px] truncate text-xs text-[var(--text-3)]" :title="selectedCoursePicFile.name">
              {{ selectedCoursePicFile.name }}
            </span>
            <button
              v-if="selectedCoursePicFile"
              type="button"
              class="text-xs text-[var(--danger)] hover:opacity-80"
              @click="clearSelectedCoursePic"
            >
              Remove
            </button>
          </div>

          <UiInput v-model="newCourseTitle" placeholder="Course title" />
          <UiInput v-model="newCourseCode" placeholder="Course code (required, e.g. CHEM-101)" />
          <UiInput v-model="newCourseDepartment" placeholder="Department (optional)" />
          <textarea
            v-model="newCourseDescription"
            rows="3"
            class="textarea-field w-full resize-none px-4"
            placeholder="Course description"
          />
        </div>

        <p v-if="createCourseError" class="mt-3 text-sm text-[var(--danger)]">{{ createCourseError }}</p>

        <div class="mt-6 flex justify-end gap-2">
          <UiButton variant="ghost" :disabled="creatingCourse" @click="closeCreateCourseModal">Cancel</UiButton>
          <UiButton
            :loading="creatingCourse"
            :disabled="creatingCourse || !newCourseTitle.trim() || !newCourseCode.trim()"
            @click="handleCreateCourse"
          >
            {{ creatingCourse ? 'Publishing...' : 'Publish Course' }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createMeeting } from '~/services/api/meeting'
import { uploadPostMedia } from '~/services/api/social'
import {
  activateClassroomCourse,
  approveCourseEnrollmentRequest,
  archiveClassroomCourse,
  createClassroomCourse,
  getClassroomCourses,
  getCourseEnrollmentRequests,
  getMyClassroomEnrollments,
  rejectCourseEnrollmentRequest,
  requestCourseEnrollment,
  type ClassroomCourse,
  type ClassroomEnrollment,
  type ClassroomEnrollmentRequest,
} from '~/services/api/classroom'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'main',
})

const userStore = useUserStore()

const isTeacher = computed(() => userStore.user?.role === 'teacher')

const pageLoading = ref(false)
const coursesLoading = ref(false)
const enrollmentsLoading = ref(false)
const classroomError = ref('')
const classroomInfo = ref('')

const teacherCourses = ref<ClassroomCourse[]>([])
const discoverCourses = ref<ClassroomCourse[]>([])
const myEnrollments = ref<ClassroomEnrollment[]>([])

const showCreateCourseModal = ref(false)
const newCourseTitle = ref('')
const newCourseCode = ref('')
const newCourseDepartment = ref('')
const newCourseDescription = ref('')
const creatingCourse = ref(false)
const createCourseError = ref('')
const coursePicInputRef = ref<HTMLInputElement | null>(null)
const selectedCoursePicFile = ref<File | null>(null)
const coursePicPreviewUrl = ref('')

const courseStatusActionId = ref('')

const discoverQuery = ref('')
const enrollmentSubmittingIds = ref<string[]>([])
const locallyPendingCourseIds = ref<Record<string, boolean>>({})

const openRequestsByCourse = ref<Record<string, boolean>>({})
const requestsByCourse = ref<Record<string, ClassroomEnrollmentRequest[]>>({})
const requestsLoadingByCourse = ref<Record<string, boolean>>({})
const enrollmentActionLoadingByRequest = ref<Record<string, boolean>>({})

const meetingCreating = ref(false)
const meetingError = ref('')
const joinRoomId = ref('')

const allowedCoursePicTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const maxCoursePicBytes = 10 * 1024 * 1024

const resetFeedback = () => {
  classroomError.value = ''
  classroomInfo.value = ''
}

const setClassroomError = (message: string) => {
  classroomInfo.value = ''
  classroomError.value = message
}

const formatTimestamp = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const diffMs = Date.now() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)

  if (diffSec < 60) return 'Just now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`

  return new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

const sortCoursesByCreatedAt = (courses: ClassroomCourse[]): ClassroomCourse[] =>
  [...courses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

const loadTeacherCourses = async () => {
  coursesLoading.value = true
  const result = await getClassroomCourses({ page: 1, limit: 50, sortBy: 'createdAt', sortOrder: 'desc' })
  coursesLoading.value = false

  if (!result.success || !result.data) {
    setClassroomError(result.error || 'Failed to load courses')
    return
  }

  const allCourses = sortCoursesByCreatedAt(result.data)
  const currentUserId = userStore.user?.id !== undefined ? String(userStore.user.id) : ''

  if (currentUserId) {
    const ownedCourses = allCourses.filter((course) => course.instructor.id === currentUserId)
    teacherCourses.value = ownedCourses.length ? ownedCourses : allCourses
    return
  }

  teacherCourses.value = allCourses
}

const loadDiscoverCourses = async () => {
  coursesLoading.value = true
  const result = await getClassroomCourses({ page: 1, limit: 50, status: 'active', sortBy: 'createdAt', sortOrder: 'desc' })
  coursesLoading.value = false

  if (!result.success || !result.data) {
    setClassroomError(result.error || 'Failed to load course feed')
    return
  }

  discoverCourses.value = sortCoursesByCreatedAt(result.data)
}

const loadMyEnrollments = async () => {
  enrollmentsLoading.value = true
  const result = await getMyClassroomEnrollments()
  enrollmentsLoading.value = false

  if (!result.success || !result.data) {
    setClassroomError(result.error || 'Failed to load your enrollments')
    return
  }

  myEnrollments.value = result.data
}

const initializeClassroom = async () => {
  pageLoading.value = true
  resetFeedback()

  if (isTeacher.value) {
    await loadTeacherCourses()
  } else {
    await Promise.all([loadDiscoverCourses(), loadMyEnrollments()])
  }

  pageLoading.value = false
}

const revokeCoursePicPreview = () => {
  if (coursePicPreviewUrl.value) {
    URL.revokeObjectURL(coursePicPreviewUrl.value)
    coursePicPreviewUrl.value = ''
  }
}

const clearSelectedCoursePic = () => {
  selectedCoursePicFile.value = null
  revokeCoursePicPreview()

  if (coursePicInputRef.value) {
    coursePicInputRef.value.value = ''
  }
}

const resetCreateCourseDraft = () => {
  newCourseTitle.value = ''
  newCourseCode.value = ''
  newCourseDepartment.value = ''
  newCourseDescription.value = ''
  createCourseError.value = ''
  clearSelectedCoursePic()
}

const openCreateCourseModal = () => {
  createCourseError.value = ''
  showCreateCourseModal.value = true
}

const closeCreateCourseModal = () => {
  if (creatingCourse.value) return
  showCreateCourseModal.value = false
  resetCreateCourseDraft()
}

const openCoursePicPicker = () => {
  coursePicInputRef.value?.click()
}

const onCoursePicSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  createCourseError.value = ''

  if (!allowedCoursePicTypes.has(file.type)) {
    createCourseError.value = 'Unsupported image type. Upload JPG, PNG, WEBP, or GIF.'
    clearSelectedCoursePic()
    return
  }

  if (file.size > maxCoursePicBytes) {
    createCourseError.value = 'Image is too large. Maximum size is 10MB.'
    clearSelectedCoursePic()
    return
  }

  revokeCoursePicPreview()
  selectedCoursePicFile.value = file
  coursePicPreviewUrl.value = URL.createObjectURL(file)
}

const handleCreateCourse = async () => {
  const title = newCourseTitle.value.trim()
  const code = newCourseCode.value.trim()
  if (!title || !code || creatingCourse.value) return

  creatingCourse.value = true
  createCourseError.value = ''
  resetFeedback()

  let coursePicUrl: string | undefined

  if (selectedCoursePicFile.value) {
    const uploadResult = await uploadPostMedia(selectedCoursePicFile.value)
    if (!uploadResult.success || !uploadResult.data?.mediaUrl) {
      creatingCourse.value = false
      createCourseError.value = uploadResult.error || 'Failed to upload course image'
      return
    }

    if (uploadResult.data.mediaType === 'video') {
      creatingCourse.value = false
      createCourseError.value = 'Please upload an image file for course cover.'
      return
    }

    coursePicUrl = uploadResult.data.mediaUrl
  }

  const result = await createClassroomCourse({
    title,
    code,
    description: newCourseDescription.value.trim() || undefined,
    coursePicUrl,
    department: newCourseDepartment.value.trim() || undefined,
  })

  creatingCourse.value = false

  if (!result.success || !result.data) {
    createCourseError.value = result.error || 'Failed to create course'
    return
  }

  teacherCourses.value = sortCoursesByCreatedAt([result.data, ...teacherCourses.value.filter((course) => course.id !== result.data!.id)])
  showCreateCourseModal.value = false
  resetCreateCourseDraft()
  classroomInfo.value = 'Course published successfully.'
}

const updateTeacherCourse = (updatedCourse: ClassroomCourse) => {
  teacherCourses.value = teacherCourses.value.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
}

const handleArchiveCourse = async (courseId: string) => {
  if (courseStatusActionId.value) return
  courseStatusActionId.value = courseId
  resetFeedback()

  const result = await archiveClassroomCourse(courseId)
  courseStatusActionId.value = ''

  if (!result.success || !result.data) {
    setClassroomError(result.error || 'Failed to archive course')
    return
  }

  updateTeacherCourse(result.data)
  classroomInfo.value = 'Course archived.'
}

const handleActivateCourse = async (courseId: string) => {
  if (courseStatusActionId.value) return
  courseStatusActionId.value = courseId
  resetFeedback()

  const result = await activateClassroomCourse(courseId)
  courseStatusActionId.value = ''

  if (!result.success || !result.data) {
    setClassroomError(result.error || 'Failed to activate course')
    return
  }

  updateTeacherCourse(result.data)
  classroomInfo.value = 'Course activated.'
}

const fetchEnrollmentRequests = async (courseId: string, force = false) => {
  if (requestsLoadingByCourse.value[courseId]) return
  if (!force && requestsByCourse.value[courseId]) return

  requestsLoadingByCourse.value = {
    ...requestsLoadingByCourse.value,
    [courseId]: true,
  }

  const result = await getCourseEnrollmentRequests(courseId)

  requestsLoadingByCourse.value = {
    ...requestsLoadingByCourse.value,
    [courseId]: false,
  }

  if (!result.success || !result.data) {
    setClassroomError(result.error || 'Failed to load enrollment requests')
    return
  }

  requestsByCourse.value = {
    ...requestsByCourse.value,
    [courseId]: result.data,
  }
}

const toggleEnrollmentRequests = async (courseId: string) => {
  const currentlyOpen = Boolean(openRequestsByCourse.value[courseId])

  openRequestsByCourse.value = {
    ...openRequestsByCourse.value,
    [courseId]: !currentlyOpen,
  }

  if (currentlyOpen) return

  await fetchEnrollmentRequests(courseId)
}

const pendingRequestsForCourse = (courseId: string): ClassroomEnrollmentRequest[] =>
  (requestsByCourse.value[courseId] || []).filter((request) => request.status === 'pending')

const handleApproveRequest = async (courseId: string, requestId: string) => {
  if (enrollmentActionLoadingByRequest.value[requestId]) return

  enrollmentActionLoadingByRequest.value = {
    ...enrollmentActionLoadingByRequest.value,
    [requestId]: true,
  }

  resetFeedback()
  const result = await approveCourseEnrollmentRequest(courseId, requestId)

  enrollmentActionLoadingByRequest.value = {
    ...enrollmentActionLoadingByRequest.value,
    [requestId]: false,
  }

  if (!result.success) {
    setClassroomError(result.error || 'Failed to approve enrollment request')
    return
  }

  await fetchEnrollmentRequests(courseId, true)
  await loadTeacherCourses()
  classroomInfo.value = 'Enrollment request approved.'
}

const handleRejectRequest = async (courseId: string, requestId: string) => {
  if (enrollmentActionLoadingByRequest.value[requestId]) return

  enrollmentActionLoadingByRequest.value = {
    ...enrollmentActionLoadingByRequest.value,
    [requestId]: true,
  }

  resetFeedback()
  const result = await rejectCourseEnrollmentRequest(courseId, requestId)

  enrollmentActionLoadingByRequest.value = {
    ...enrollmentActionLoadingByRequest.value,
    [requestId]: false,
  }

  if (!result.success) {
    setClassroomError(result.error || 'Failed to reject enrollment request')
    return
  }

  await fetchEnrollmentRequests(courseId, true)
  classroomInfo.value = 'Enrollment request rejected.'
}

const filteredDiscoverCourses = computed(() => {
  const query = discoverQuery.value.trim().toLowerCase()
  if (!query) return discoverCourses.value

  return discoverCourses.value.filter((course) => {
    return (
      course.title.toLowerCase().includes(query) ||
      (course.description || '').toLowerCase().includes(query) ||
      course.instructor.displayName.toLowerCase().includes(query)
    )
  })
})

const enrolledCourseIds = computed(() => {
  const ids = new Set<string>()
  myEnrollments.value.forEach((enrollment) => {
    const normalizedStatus = (enrollment.status || '').toLowerCase()
    if (['approved', 'active', 'enrolled'].includes(normalizedStatus)) {
      ids.add(enrollment.course.id)
    }
  })
  return ids
})

const getEnrollmentState = (course: ClassroomCourse): 'enrolled' | 'pending' | 'not_enrolled' => {
  const enrollmentStatus = (course.enrollmentStatus || '').toLowerCase()

  if (enrolledCourseIds.value.has(course.id) || ['approved', 'active', 'enrolled'].includes(enrollmentStatus)) {
    return 'enrolled'
  }

  if (locallyPendingCourseIds.value[course.id] || enrollmentStatus === 'pending') {
    return 'pending'
  }

  return 'not_enrolled'
}

const isEnrollmentSubmitting = (courseId: string): boolean => enrollmentSubmittingIds.value.includes(courseId)

const handleEnrollmentRequest = async (courseId: string) => {
  if (isEnrollmentSubmitting(courseId)) return

  enrollmentSubmittingIds.value = [...enrollmentSubmittingIds.value, courseId]
  resetFeedback()

  const result = await requestCourseEnrollment(courseId)

  enrollmentSubmittingIds.value = enrollmentSubmittingIds.value.filter((id) => id !== courseId)

  if (!result.success) {
    setClassroomError(result.error || 'Failed to send enrollment request')
    return
  }

  locallyPendingCourseIds.value = {
    ...locallyPendingCourseIds.value,
    [courseId]: true,
  }

  discoverCourses.value = discoverCourses.value.map((course) => {
    if (course.id !== courseId) return course
    return {
      ...course,
      enrollmentStatus: 'pending',
    }
  })

  classroomInfo.value = 'Enrollment request sent.'
}

const handleCreateMeeting = async () => {
  if (!isTeacher.value) {
    meetingError.value = 'Only teachers can create meeting rooms.'
    return
  }

  if (meetingCreating.value) return

  meetingError.value = ''
  meetingCreating.value = true

  const result = await createMeeting()
  meetingCreating.value = false

  if (!result.success || !result.data?.roomId) {
    meetingError.value = result.error || 'Unable to create meeting room'
    return
  }

  await navigateTo(`/meeting/${encodeURIComponent(result.data.roomId)}`)
}

const handleJoinMeeting = async () => {
  if (isTeacher.value) return

  const roomId = joinRoomId.value.trim()
  if (!roomId) {
    meetingError.value = 'Enter a room ID to join.'
    return
  }

  meetingError.value = ''
  await navigateTo(`/meeting/${encodeURIComponent(roomId)}`)
}

onMounted(async () => {
  await initializeClassroom()
})

onBeforeUnmount(() => {
  revokeCoursePicPreview()
})
</script>
