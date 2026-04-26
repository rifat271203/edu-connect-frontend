<template>
  <div class="mx-auto max-w-5xl p-4 pb-24 lg:pb-6">
    <header class="mb-8 space-y-2">
      <h1 class="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[var(--t1)] to-[var(--t2)] bg-clip-text text-transparent">Classroom</h1>
      <p class="text-[13.5px] text-[rgba(244,241,235,0.5)]">
        {{
          isTeacher
            ? 'Create and manage private courses for your students.'
            : 'Discover courses, request enrollment, and access your classrooms.'
        }}
      </p>
    </header>

    <!-- Search Bar -->
    <div class="relative mb-6">
      <svg class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--t3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35m1.6-5.15a6.75 6.75 0 1 1-13.5 0 6.75 6.75 0 0 1 13.5 0Z" />
      </svg>
      <input
        v-model="searchQuery"
        placeholder="Search courses by name, instructor, or department..."
        class="ui-input w-full !h-12 !pl-12 !rounded-2xl !text-[15px] !bg-[var(--surface)] !border-[var(--line)]"
      />
    </div>

    <p v-if="classroomInfo" class="mb-4 text-sm text-green-400">{{ classroomInfo }}</p>
    <p v-if="classroomError" class="mb-4 text-sm text-[rgba(239,68,68,0.9)]">{{ classroomError }}</p>

    <div v-if="pageLoading" class="space-y-4">
      <UiCard v-for="i in 3" :key="`loading-${i}`" class="p-4">
        <UiSkeleton variant="text" class="mb-2 w-36" />
        <UiSkeleton variant="text" class="mb-3 w-full" />
        <UiSkeleton variant="rectangular" class="h-24" />
      </UiCard>
    </div>

    <template v-else>
      <!-- TEACHER VIEW -->
      <section v-if="isTeacher" class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <h2 class="text-xl font-bold tracking-tight text-[var(--t1)] flex items-center gap-2">
            <svg class="w-5 h-5 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Your Courses
          </h2>
          <div class="flex items-center gap-2">
            <UiButton @click="openCreateCourseModal">Create Course</UiButton>
            <UiButton variant="ghost" size="sm" :disabled="coursesLoading" @click="loadTeacherCourses">Refresh</UiButton>
          </div>
        </div>

        <div v-if="!filteredTeacherCourses.length" class="rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-6 text-center text-sm text-[var(--t2)]">
          {{ searchQuery.trim() ? 'No courses match your search.' : 'No courses yet. Click Create Course to publish your first classroom.' }}
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2">
          <UiCard
            v-for="course in filteredTeacherCourses"
            :key="`teacher-${course.id}`"
            class="group !p-0 overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-[var(--gold)]/30 hover:shadow-lg"
            @click="navigateTo(`/classroom/${encodeURIComponent(course.id)}`)"
          >
            <div v-if="course.coursePicUrl" class="h-32 w-full overflow-hidden bg-[var(--surface2)]">
              <img :src="course.coursePicUrl" :alt="course.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
            </div>
            <div v-else class="h-32 w-full bg-gradient-to-br from-[var(--surface2)] via-[var(--surface)] to-[var(--surface2)] flex items-center justify-center border-b border-[var(--line)]">
              <svg class="w-10 h-10 text-[var(--t3)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div class="p-4">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-semibold text-[15px] text-[var(--t1)] line-clamp-1">{{ course.title }}</h3>
                <UiBadge :variant="course.status === 'archived' ? 'warning' : 'success'" class="shrink-0">{{ course.status }}</UiBadge>
              </div>
              <p v-if="course.description" class="mt-1 text-[12px] text-[var(--t2)] line-clamp-2">{{ course.description }}</p>
              <div class="mt-3 flex items-center gap-3 text-[11px] text-[rgba(244,241,235,0.35)]">
                <span v-if="course.code" class="rounded-full bg-[var(--surface2)] px-2 py-0.5">{{ course.code }}</span>
                <span>{{ course.memberCount }} members</span>
              </div>
            </div>
          </UiCard>
        </div>
      </section>

      <!-- STUDENT VIEW -->
      <section v-else class="space-y-8">
        <!-- Enrolled Courses -->
        <section>
          <div class="mb-4 flex items-center justify-between gap-3">
            <h2 class="text-xl font-bold tracking-tight text-[var(--t1)] flex items-center gap-2">
              <svg class="w-5 h-5 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              My Enrolled Courses
            </h2>
            <UiButton variant="ghost" size="sm" :disabled="enrollmentsLoading" @click="loadMyEnrollments">Refresh</UiButton>
          </div>

          <div v-if="!filteredEnrolledCourses.length" class="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-10 text-center">
            <div class="w-16 h-16 rounded-full bg-[var(--surface2)] flex items-center justify-center mx-auto mb-4 border border-[var(--line)]">
              <svg class="w-8 h-8 text-[var(--t3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <p class="text-[15px] font-medium text-[var(--t1)]">{{ searchQuery.trim() ? 'No enrolled courses match your search.' : 'You haven\'t enrolled in any courses yet.' }}</p>
            <p v-if="!searchQuery.trim()" class="mt-1 text-sm text-[var(--t3)]">Browse the suggestions below and request enrollment.</p>
          </div>

          <div v-else class="grid gap-4 md:grid-cols-2">
            <UiCard
              v-for="enrollment in filteredEnrolledCourses"
              :key="`enrolled-${enrollment.id}`"
              class="group !p-0 overflow-hidden cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-[var(--gold)]/30 hover:shadow-lg"
              @click="navigateTo(`/classroom/${encodeURIComponent(enrollment.course.id)}`)"
            >
              <div v-if="enrollment.course.coursePicUrl" class="h-28 w-full overflow-hidden bg-[var(--surface2)]">
                <img :src="enrollment.course.coursePicUrl" :alt="enrollment.course.title" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
              </div>
              <div v-else class="h-28 w-full bg-gradient-to-br from-[var(--surface2)] via-[var(--surface)] to-[var(--surface2)] flex items-center justify-center border-b border-[var(--line)]">
                <svg class="w-10 h-10 text-[var(--t3)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div class="p-4">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-semibold text-[15px] text-[var(--t1)] line-clamp-1">{{ enrollment.course.title }}</h3>
                  <span
                    class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.08em] font-semibold shrink-0"
                    :class="
                      normalizeStatus(enrollment.status) === 'approved'
                        ? 'bg-[rgba(52,211,153,0.1)] text-[#34d399]'
                        : normalizeStatus(enrollment.status) === 'pending'
                          ? 'bg-[var(--gold-dim)] text-[var(--gold)]'
                          : 'bg-[var(--blue-dim)] text-[var(--blue)]'
                    "
                  >
                    {{ enrollment.status }}
                  </span>
                </div>
                <p class="mt-1 text-[12px] text-[var(--t2)] line-clamp-1">{{ enrollment.course.description || 'No description.' }}</p>
                <p class="mt-2 text-[11px] text-[rgba(244,241,235,0.35)] flex items-center gap-1.5">
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {{ enrollment.course.instructor.displayName }} · {{ formatTimestamp(enrollment.enrolledAt) }}
                </p>
              </div>
            </UiCard>
          </div>
        </section>

        <!-- Discover / Suggestions -->
        <section>
          <div class="mb-4 flex items-center justify-between gap-3">
            <h2 class="text-xl font-bold tracking-tight text-[var(--t1)] flex items-center gap-2">
              <svg class="w-5 h-5 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              Discover More
            </h2>
            <UiButton variant="ghost" size="sm" :disabled="coursesLoading" @click="loadDiscoverCourses">Refresh</UiButton>
          </div>

          <div v-if="!filteredDiscoverCourses.length" class="rounded-[14px] border border-dashed border-[var(--line)] bg-[var(--surface)] p-6 text-center text-sm text-[var(--t2)]">
            {{ searchQuery.trim() ? 'No courses match your search.' : 'No courses to discover right now.' }}
          </div>

          <div v-else class="space-y-4">
            <UiCard v-for="course in filteredDiscoverCourses" :key="`discover-${course.id}`" class="!p-5">
              <div class="flex flex-col sm:flex-row gap-4">
                <div v-if="course.coursePicUrl" class="h-32 sm:h-24 w-full sm:w-40 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface2)] shadow-inner">
                  <img :src="course.coursePicUrl" :alt="course.title" class="h-full w-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div v-else class="h-32 sm:h-24 w-full sm:w-40 shrink-0 rounded-xl bg-gradient-to-br from-[var(--surface2)] to-[var(--surface)] border border-[var(--line)] flex items-center justify-center">
                  <svg class="w-8 h-8 text-[var(--t3)] opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <div class="min-w-0 flex-1 flex flex-col justify-center">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <h3 class="text-[15px] font-bold text-[var(--t1)]">{{ course.title }}</h3>
                      <div class="mt-1 flex items-center gap-2 text-[12px] text-[rgba(244,241,235,0.45)]">
                        <UiAvatar :src="course.instructor.avatar" :name="course.instructor.displayName" size="sm" />
                        <span>{{ course.instructor.displayName }}</span>
                      </div>
                    </div>
                    <UiBadge :variant="course.status === 'archived' ? 'warning' : 'accent'" class="shrink-0">{{ course.status }}</UiBadge>
                  </div>
                  <p class="mt-2 text-[13px] text-[rgba(244,241,235,0.55)] line-clamp-2">{{ course.description || 'No description.' }}</p>
                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <span v-if="course.code" class="text-[11px] rounded-full bg-[var(--surface2)] px-2 py-0.5 text-[rgba(244,241,235,0.3)]">{{ course.code }}</span>
                    <span class="text-[11px] text-[rgba(244,241,235,0.3)]">{{ course.memberCount }} members</span>
                    <div class="ml-auto mt-2 sm:mt-0">
                      <UiButton v-if="getEnrollmentState(course) === 'enrolled'" size="sm" variant="secondary" disabled class="!bg-[var(--surface2)] !text-[var(--t2)] !border-[var(--line)] w-full sm:w-auto">Enrolled</UiButton>
                      <UiButton v-else-if="getEnrollmentState(course) === 'pending'" size="sm" variant="secondary" disabled class="!bg-[var(--surface2)] !text-[var(--t2)] !border-[var(--line)] w-full sm:w-auto">Request Pending</UiButton>
                      <UiButton v-else size="sm" class="!bg-[var(--gold)] !text-[#07090f] hover:brightness-110 font-semibold shadow-md shadow-[var(--gold)]/20 w-full sm:w-auto transition-all" :disabled="isEnrollmentSubmitting(course.id)" :loading="isEnrollmentSubmitting(course.id)" @click.stop="handleEnrollmentRequest(course.id)">Enroll Now</UiButton>
                    </div>
                  </div>
                </div>
              </div>
            </UiCard>
          </div>
        </section>
      </section>
    </template>

    <!-- Create Course Modal (teacher) -->
    <div v-if="isTeacher && showCreateCourseModal" class="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button type="button" class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeCreateCourseModal" />
      <div class="relative w-full max-w-xl card-theme p-6">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="text-[22px] font-bold tracking-[-0.02em] text-[var(--t1)]">Create Course</h3>
            <p class="mt-1 text-[13.5px] text-[rgba(244,241,235,0.55)]">Upload a course image and publish it.</p>
          </div>
          <button type="button" class="btn-ghost !h-9 !w-9 !p-0" :disabled="creatingCourse" @click="closeCreateCourseModal">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div class="mt-4 space-y-3">
          <input ref="coursePicInputRef" type="file" class="hidden" accept="image/jpeg,image/png,image/webp,image/gif" @change="onCoursePicSelected" />
          <div class="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <img v-if="coursePicPreviewUrl" :src="coursePicPreviewUrl" alt="Course preview" class="h-44 w-full object-cover" />
            <div v-else class="flex h-44 items-center justify-center text-sm text-[var(--text-3)]">No course image selected</div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <UiButton type="button" variant="secondary" @click="openCoursePicPicker">Upload Course Image</UiButton>
            <span v-if="selectedCoursePicFile" class="max-w-[220px] truncate text-xs text-[var(--text-3)]" :title="selectedCoursePicFile.name">{{ selectedCoursePicFile.name }}</span>
            <button v-if="selectedCoursePicFile" type="button" class="text-xs text-[var(--danger)] hover:opacity-80" @click="clearSelectedCoursePic">Remove</button>
          </div>
          <UiInput v-model="newCourseTitle" placeholder="Course title" />
          <UiInput v-model="newCourseCode" placeholder="Course code (required, e.g. CHEM-101)" />
          <UiInput v-model="newCourseDepartment" placeholder="Department (optional)" />
          <textarea v-model="newCourseDescription" rows="3" class="textarea-field w-full resize-none px-4" placeholder="Course description" />
        </div>
        <p v-if="createCourseError" class="mt-3 text-sm text-[var(--danger)]">{{ createCourseError }}</p>
        <div class="mt-6 flex justify-end gap-2">
          <UiButton variant="ghost" :disabled="creatingCourse" @click="closeCreateCourseModal">Cancel</UiButton>
          <UiButton :loading="creatingCourse" :disabled="creatingCourse || !newCourseTitle.trim() || !newCourseCode.trim()" @click="handleCreateCourse">
            {{ creatingCourse ? 'Publishing...' : 'Publish Course' }}
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

definePageMeta({ layout: 'main' })

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

const searchQuery = ref('')
const enrollmentSubmittingIds = ref<string[]>([])
const locallyPendingCourseIds = ref<Record<string, boolean>>({})

const allowedCoursePicTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const maxCoursePicBytes = 10 * 1024 * 1024

const resetFeedback = () => { classroomError.value = ''; classroomInfo.value = '' }
const setClassroomError = (msg: string) => { classroomInfo.value = ''; classroomError.value = msg }
const normalizeStatus = (s: string) => (s || '').toLowerCase()

const formatTimestamp = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000)
  if (diffSec < 60) return 'Just now'
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`
  return new Intl.DateTimeFormat('en-BD', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date)
}

const sortCourses = (courses: ClassroomCourse[]) =>
  [...courses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

const matchesSearch = (text: string) => {
  const q = searchQuery.value.trim().toLowerCase()
  return !q || text.toLowerCase().includes(q)
}

const filteredTeacherCourses = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return teacherCourses.value
  return teacherCourses.value.filter(c =>
    c.title.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q)
  )
})

const filteredEnrolledCourses = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return myEnrollments.value
  return myEnrollments.value.filter(e =>
    e.course.title.toLowerCase().includes(q) || (e.course.description || '').toLowerCase().includes(q) || e.course.instructor.displayName.toLowerCase().includes(q)
  )
})

const filteredDiscoverCourses = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return discoverCourses.value
  return discoverCourses.value.filter(c =>
    c.title.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q) || c.instructor.displayName.toLowerCase().includes(q)
  )
})

const enrolledCourseIds = computed(() => {
  const ids = new Set<string>()
  myEnrollments.value.forEach(e => {
    if (['approved', 'active', 'enrolled'].includes(normalizeStatus(e.status))) ids.add(e.course.id)
  })
  return ids
})

const getEnrollmentState = (course: ClassroomCourse): 'enrolled' | 'pending' | 'not_enrolled' => {
  const es = normalizeStatus(course.enrollmentStatus || '')
  if (enrolledCourseIds.value.has(course.id) || ['approved', 'active', 'enrolled'].includes(es)) return 'enrolled'
  if (locallyPendingCourseIds.value[course.id] || es === 'pending') return 'pending'
  return 'not_enrolled'
}

const isEnrollmentSubmitting = (courseId: string) => enrollmentSubmittingIds.value.includes(courseId)

const loadTeacherCourses = async () => {
  coursesLoading.value = true
  const result = await getClassroomCourses({ page: 1, limit: 50, sortBy: 'createdAt', sortOrder: 'desc' })
  coursesLoading.value = false
  if (!result.success || !result.data) { setClassroomError(result.error || 'Failed to load courses'); return }
  const all = sortCourses(result.data)
  const uid = userStore.user?.id !== undefined ? String(userStore.user.id) : ''
  teacherCourses.value = uid ? (all.filter(c => c.instructor.id === uid).length ? all.filter(c => c.instructor.id === uid) : all) : all
}

const loadDiscoverCourses = async () => {
  coursesLoading.value = true
  const result = await getClassroomCourses({ page: 1, limit: 50, status: 'active', sortBy: 'createdAt', sortOrder: 'desc' })
  coursesLoading.value = false
  if (!result.success || !result.data) { setClassroomError(result.error || 'Failed to load course feed'); return }
  discoverCourses.value = sortCourses(result.data)
}

const loadMyEnrollments = async () => {
  enrollmentsLoading.value = true
  const result = await getMyClassroomEnrollments()
  enrollmentsLoading.value = false
  if (!result.success || !result.data) { setClassroomError(result.error || 'Failed to load enrollments'); return }
  myEnrollments.value = result.data
}

const initializeClassroom = async () => {
  pageLoading.value = true
  resetFeedback()
  if (isTeacher.value) { await loadTeacherCourses() }
  else { await Promise.all([loadDiscoverCourses(), loadMyEnrollments()]) }
  pageLoading.value = false
}

const handleEnrollmentRequest = async (courseId: string) => {
  if (isEnrollmentSubmitting(courseId)) return
  enrollmentSubmittingIds.value = [...enrollmentSubmittingIds.value, courseId]
  resetFeedback()
  const result = await requestCourseEnrollment(courseId)
  enrollmentSubmittingIds.value = enrollmentSubmittingIds.value.filter(id => id !== courseId)
  if (!result.success) { setClassroomError(result.error || 'Failed to send enrollment request'); return }
  locallyPendingCourseIds.value = { ...locallyPendingCourseIds.value, [courseId]: true }
  discoverCourses.value = discoverCourses.value.map(c => c.id !== courseId ? c : { ...c, enrollmentStatus: 'pending' })
  classroomInfo.value = 'Enrollment request sent.'
}

// Course creation
const revokeCoursePicPreview = () => { if (coursePicPreviewUrl.value) { URL.revokeObjectURL(coursePicPreviewUrl.value); coursePicPreviewUrl.value = '' } }
const clearSelectedCoursePic = () => { selectedCoursePicFile.value = null; revokeCoursePicPreview(); if (coursePicInputRef.value) coursePicInputRef.value.value = '' }
const resetCreateCourseDraft = () => { newCourseTitle.value = ''; newCourseCode.value = ''; newCourseDepartment.value = ''; newCourseDescription.value = ''; createCourseError.value = ''; clearSelectedCoursePic() }
const openCreateCourseModal = () => { createCourseError.value = ''; showCreateCourseModal.value = true }
const closeCreateCourseModal = () => { if (creatingCourse.value) return; showCreateCourseModal.value = false; resetCreateCourseDraft() }
const openCoursePicPicker = () => { coursePicInputRef.value?.click() }

const onCoursePicSelected = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  createCourseError.value = ''
  if (!allowedCoursePicTypes.has(file.type)) { createCourseError.value = 'Unsupported image type.'; clearSelectedCoursePic(); return }
  if (file.size > maxCoursePicBytes) { createCourseError.value = 'Image too large. Max 10MB.'; clearSelectedCoursePic(); return }
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
    if (!uploadResult.success || !uploadResult.data?.mediaUrl) { creatingCourse.value = false; createCourseError.value = uploadResult.error || 'Failed to upload image'; return }
    if (uploadResult.data.mediaType === 'video') { creatingCourse.value = false; createCourseError.value = 'Please upload an image.'; return }
    coursePicUrl = uploadResult.data.mediaUrl
  }
  const result = await createClassroomCourse({ title, code, description: newCourseDescription.value.trim() || undefined, coursePicUrl, department: newCourseDepartment.value.trim() || undefined })
  creatingCourse.value = false
  if (!result.success || !result.data) { createCourseError.value = result.error || 'Failed to create course'; return }
  teacherCourses.value = sortCourses([result.data, ...teacherCourses.value.filter(c => c.id !== result.data!.id)])
  showCreateCourseModal.value = false
  resetCreateCourseDraft()
  classroomInfo.value = 'Course published successfully.'
}

onMounted(() => initializeClassroom())
onBeforeUnmount(() => revokeCoursePicPreview())
</script>
