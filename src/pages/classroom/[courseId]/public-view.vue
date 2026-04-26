<template>
  <div class="mx-auto max-w-4xl p-4 pb-24 lg:pb-6">
    <button
      type="button"
      class="mb-4 flex items-center gap-1 text-[13px] text-[var(--t2)] transition-colors hover:text-[var(--t1)]"
      @click="navigateTo('/classroom')"
    >
      &larr; Back to Classroom
    </button>

    <div v-if="loading" class="space-y-4">
      <UiSkeleton variant="rectangular" class="h-48 rounded-3xl" />
      <UiSkeleton variant="text" class="w-64" />
      <UiSkeleton variant="text" class="w-full" />
    </div>

    <template v-else-if="course">
      <div class="overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        <div v-if="course.coursePicUrl" class="h-52 w-full overflow-hidden">
          <img :src="course.coursePicUrl" :alt="course.title" class="h-full w-full object-cover" />
        </div>
        <div v-else class="flex h-52 w-full items-center justify-center border-b border-[var(--line)] bg-gradient-to-br from-[var(--surface2)] via-[var(--surface)] to-[var(--surface2)]">
          <svg class="h-16 w-16 text-[var(--t3)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <div class="p-6">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div class="max-w-2xl">
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <UiBadge :variant="course.status === 'archived' ? 'warning' : 'accent'">{{ course.status }}</UiBadge>
                <span class="rounded-full border border-[var(--line)] bg-[var(--surface2)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--t3)]">
                  Classroom preview
                </span>
              </div>
              <h1 class="text-2xl font-black tracking-tight text-[var(--t1)]">{{ course.title }}</h1>
              <p v-if="course.description" class="mt-3 whitespace-pre-wrap text-[14px] leading-7 text-[var(--t2)]">
                {{ course.description }}
              </p>
            </div>

            <div class="rounded-[22px] border border-[var(--line)] bg-[var(--surface2)]/80 p-4 shadow-sm lg:w-[20rem]">
              <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--t3)]">Access status</p>
              <div class="mt-2 flex items-center gap-2">
                <UiBadge v-if="enrollState === 'enrolled'" variant="approved">Approved</UiBadge>
                <UiBadge v-else-if="enrollState === 'pending'" variant="pending">Pending review</UiBadge>
                <UiBadge v-else variant="neutral">Not enrolled</UiBadge>
              </div>
              <p class="mt-3 text-sm text-[var(--t2)]">
                {{
                  enrollState === 'enrolled'
                    ? 'You can open the full classroom, materials, messages, and live sessions.'
                    : enrollState === 'pending'
                      ? 'Your request is waiting for teacher approval.'
                      : 'Request access to unlock the full classroom.'
                }}
              </p>
              <div class="mt-4">
                <UiButton v-if="enrollState === 'enrolled'" block @click="navigateTo(`/classroom/${courseId}`)">Open classroom</UiButton>
                <UiButton v-else-if="enrollState === 'pending'" block variant="secondary" disabled>Request pending</UiButton>
                <UiButton v-else block :loading="enrolling" :disabled="enrolling" @click="handleEnroll">
                  Request access
                </UiButton>
              </div>
            </div>
          </div>

          <div class="mt-5 flex flex-wrap items-center gap-3">
            <UiAvatar :src="course.instructor.avatar" :name="course.instructor.displayName" size="md" />
            <div>
              <p class="text-[14px] font-semibold text-[var(--t1)]">{{ course.instructor.displayName }}</p>
              <p class="text-[12px] text-[rgba(244,241,235,0.35)]">@{{ course.instructor.username }} · Instructor</p>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap gap-2 text-[12px] text-[rgba(244,241,235,0.35)]">
            <span v-if="course.code" class="rounded-full bg-[var(--surface2)] px-3 py-1">{{ course.code }}</span>
            <span v-if="course.department" class="rounded-full bg-[var(--surface2)] px-3 py-1">{{ course.department }}</span>
            <span class="rounded-full bg-[var(--surface2)] px-3 py-1">{{ course.memberCount }} members</span>
          </div>

          <div v-if="enrollState !== 'enrolled'" class="mt-6 rounded-[24px] border border-[var(--line)] bg-[var(--surface2)]/70 p-5">
            <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div class="max-w-2xl">
                <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--t3)]">Optional note to teacher</p>
                <p class="mt-2 text-sm text-[var(--t2)]">
                  Add a short introduction or anything that helps the teacher understand why you want to join.
                </p>
              </div>
              <UiButton v-if="enrollState === 'pending'" variant="secondary" disabled>Request Pending</UiButton>
              <UiButton v-else :loading="enrolling" :disabled="enrolling || !canSubmitRequest" @click="handleEnroll">
                {{ enrolling ? 'Sending...' : 'Send Request' }}
              </UiButton>
            </div>

            <textarea
              v-model="requestNote"
              rows="4"
              class="textarea-field mt-4 w-full rounded-2xl px-4 py-3"
              placeholder="Example: I am currently studying the prerequisite material and would love to join."
              :disabled="enrollState === 'pending'"
            />
          </div>

          <p v-if="enrollError" class="mt-3 text-sm text-[rgba(239,68,68,0.9)]">{{ enrollError }}</p>
          <p v-if="enrollSuccess" class="mt-3 text-sm text-green-400">{{ enrollSuccess }}</p>
        </div>
      </div>

      <div v-if="publicMaterials.length" class="mt-6 rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
        <div class="mb-4 flex items-center gap-2">
          <svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 class="text-[16px] font-bold text-[var(--t1)]">Public Preview</h3>
        </div>
        <div class="space-y-3">
          <a
            v-for="mat in publicMaterials"
            :key="mat.id"
            :href="mat.url || '#'"
            target="_blank"
            class="flex items-center gap-3 rounded-2xl border border-[var(--line)] p-3 transition-colors hover:bg-[var(--surface2)]"
          >
            <div class="flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--surface2)]">
              <img v-if="mat.thumbnailUrl" :src="mat.thumbnailUrl" class="h-full w-full object-cover" />
              <svg v-else class="h-6 w-6 text-[var(--t3)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[14px] font-medium text-[var(--t1)]">{{ mat.title }}</p>
              <p v-if="mat.description" class="line-clamp-1 text-[12px] text-[var(--t2)]">{{ mat.description }}</p>
              <p class="mt-0.5 text-[11px] text-[var(--t3)]">{{ mat.type }}</p>
            </div>
          </a>
        </div>
      </div>
    </template>

    <div v-else class="py-16 text-center">
      <p class="text-lg text-[var(--t2)]">Course not found.</p>
      <UiButton variant="ghost" class="mt-4" @click="navigateTo('/classroom')">Back to Classroom</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  getCoursePublicPreview,
  getCourseSingleDetails,
  requestCourseEnrollment,
  type ClassroomCourse,
  type CourseMaterialItem,
} from '~/services/api/classroom'

definePageMeta({ layout: 'main' })

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))

const loading = ref(true)
const course = ref<ClassroomCourse | null>(null)
const enrollState = ref<'enrolled' | 'pending' | 'not_enrolled'>('not_enrolled')
const publicMaterials = ref<CourseMaterialItem[]>([])
const enrolling = ref(false)
const enrollError = ref('')
const enrollSuccess = ref('')
const requestNote = ref('')

const canSubmitRequest = computed(() => enrollState.value === 'not_enrolled' && !enrolling.value)

const loadCourse = async () => {
  loading.value = true

  const result = await getCourseSingleDetails(courseId.value)
  if (result.success && result.data) {
    course.value = result.data.course
    if (result.data.isEnrolled) {
      enrollState.value = 'enrolled'
    } else if (result.data.enrollmentStatus?.toLowerCase() === 'pending') {
      enrollState.value = 'pending'
    }
  }

  const matResult = await getCoursePublicPreview(courseId.value)
  if (matResult.success && matResult.data) {
    publicMaterials.value = matResult.data
  }

  loading.value = false
}

const handleEnroll = async () => {
  if (enrolling.value || enrollState.value !== 'not_enrolled') return

  enrolling.value = true
  enrollError.value = ''
  enrollSuccess.value = ''

  const result = await requestCourseEnrollment(courseId.value, requestNote.value)
  enrolling.value = false

  if (!result.success) {
    enrollError.value = result.error || 'Failed to send enrollment request'
    return
  }

  enrollState.value = 'pending'
  requestNote.value = ''
  enrollSuccess.value = 'Enrollment request sent successfully.'
}

useHead(() => ({
  title: `${course.value?.title || 'Course'} - Preview`,
}))

onMounted(() => loadCourse())
</script>
