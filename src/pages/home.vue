<template>
  <div class="mx-auto w-full max-w-3xl p-4 pb-24 lg:pb-6">
    <!-- Header -->
    <header class="mb-6 space-y-1">
      <h1 class="font-display text-4xl text-[var(--t1)]">Home</h1>
      <p class="text-sm text-[var(--t2)]">See what your classmates are up to</p>
    </header>

    <!-- Create Post -->
    <UiCard v-if="!isGuest" class="feed-composer mb-6 !p-5">
      <div class="flex items-start gap-3">
        <UiAvatar 
          :src="userStore.user?.avatar"
          :name="userStore.user?.name || 'User'"
          size="md"
        />
        <div class="flex-1">
          <textarea
            v-model="newPostContent"
            rows="3"
            class="w-full resize-none border-0 bg-transparent p-0 text-[15px] text-[var(--t1)] placeholder:text-[var(--t3)] focus:outline-none"
            placeholder="What's on your mind?"
          />

          <div v-if="mediaPreviewUrl" class="mt-4 rounded-xl overflow-hidden border border-[var(--line)] bg-[var(--surface2)]">
            <img
              v-if="selectedMediaType === 'image'"
              :src="mediaPreviewUrl"
              alt="Selected media preview"
              class="w-full max-h-80 object-cover"
            />
            <video
              v-else
              :src="mediaPreviewUrl"
              controls
              class="w-full max-h-80 bg-black/70"
              preload="metadata"
            />
          </div>

          <input
            ref="mediaInputRef"
            type="file"
            class="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm,video/x-matroska"
            @change="handleMediaSelected"
          />

          <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-3">
            <div class="flex items-center gap-2">
              <UiButton variant="ghost" @click="openMediaPicker">
                Add photo/video
              </UiButton>
              <span v-if="selectedMediaFile" class="mono-label text-[11px] text-[var(--t3)] max-w-[200px] truncate" :title="selectedMediaFile.name">
                {{ selectedMediaFile.name }}
              </span>
              <button
                v-if="selectedMediaFile"
                type="button"
                class="mono-label text-[11px] text-[rgba(239,68,68,0.9)] hover:opacity-80 transition-colors"
                @click="clearSelectedMedia"
              >
                Remove
              </button>
            </div>

            <UiButton :disabled="creatingPost || (!newPostContent.trim() && !selectedMediaFile)" @click="handleCreatePost">
              {{ creatingPost ? 'Posting...' : 'Post' }}
            </UiButton>
          </div>
        </div>
      </div>
    </UiCard>

    <UiCard v-else class="mb-6 !p-5 text-sm text-[var(--t2)]">
      You are browsing the Educational Social Feed as a guest. Log in to create posts, like, comment, and enroll in courses.
      <NuxtLink to="/login" class="ml-1 font-semibold text-[var(--gold)] hover:text-[var(--gold2)]">Log in</NuxtLink>
    </UiCard>

    <p v-if="displayError" class="mb-4 text-sm text-[rgba(239,68,68,0.9)]">{{ displayError }}</p>

    <p v-if="classroomInfo" class="mb-4 text-sm text-green-400">{{ classroomInfo }}</p>
    <p v-if="classroomError" class="mb-4 text-sm text-[var(--danger)]">{{ classroomError }}</p>
    
    <!-- Posts Feed -->
    <div class="space-y-4">
      <template v-if="!isTeacher">
        <UiCard class="!p-5">
          <div class="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 class="font-display text-[30px] leading-8 text-[var(--t1)]">Course feed</h2>
              <p class="text-sm text-[var(--t3)]">Teacher-created courses available for enrollment</p>
            </div>
            <UiButton variant="ghost" size="sm" :disabled="classroomCoursesLoading" @click="loadClassroomFeed">
              Refresh
            </UiButton>
          </div>

          <div v-if="classroomCoursesLoading" class="space-y-3">
            <UiSkeleton variant="text" class="w-44" />
            <UiSkeleton variant="rectangular" class="h-28" />
          </div>

          <div v-else-if="!classroomCourses.length" class="text-sm text-[var(--text-2)]">
            No active courses found.
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="course in classroomCourses"
              :key="`home-course-${course.id}`"
              class="rounded-[14px] border border-[var(--line)] bg-[var(--surface)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--line-gold)]"
            >
              <div class="mb-3 flex items-center gap-3">
                <UiAvatar :src="course.instructor.avatar" :name="course.instructor.displayName" size="md" />
                <div class="min-w-0 flex-1">
                  <p class="truncate font-semibold text-[var(--t1)]">{{ course.instructor.displayName }}</p>
                  <p class="mono-label text-[11px] text-[var(--t3)]">@{{ course.instructor.username }} · {{ formatRelativeTime(course.createdAt) }}</p>
                </div>
                <UiBadge :variant="course.status === 'archived' ? 'warning' : 'active'">{{ course.status }}</UiBadge>
              </div>

              <h3 class="font-display text-[28px] leading-7 text-[var(--t1)]">{{ course.title }}</h3>
              <div v-if="course.coursePicUrl" class="mt-3 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface2)]">
                <img
                  :src="course.coursePicUrl"
                  :alt="`${course.title} cover`"
                  class="block h-auto w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p class="mt-2 whitespace-pre-wrap text-sm text-[var(--t2)]">{{ course.description || 'No description added yet.' }}</p>

              <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--t3)]">
                <span v-if="course.code" class="mono-label rounded-full bg-[var(--surface2)] px-2 py-1">Code: {{ course.code }}</span>
                <span v-if="course.department" class="mono-label rounded-full bg-[var(--surface2)] px-2 py-1">Dept: {{ course.department }}</span>
                <span class="mono-label rounded-full bg-[var(--surface2)] px-2 py-1">Members: {{ course.memberCount }}</span>
              </div>

              <div class="mt-3">
                <NuxtLink
                  v-if="isGuest"
                  to="/login"
                  class="inline-flex h-9 items-center justify-center rounded-[10px] border border-[var(--line)] bg-[var(--surface2)] px-3 text-sm font-semibold text-[var(--t1)] transition-colors hover:border-[var(--line-gold)] hover:text-[var(--gold2)]"
                >
                  Log in to enroll
                </NuxtLink>
                <UiButton
                  v-else-if="getClassroomEnrollmentState(course) === 'enrolled'"
                  size="sm"
                  variant="secondary"
                  disabled
                >
                  Enrolled
                </UiButton>
                <UiButton
                  v-else-if="getClassroomEnrollmentState(course) === 'pending'"
                  size="sm"
                  variant="secondary"
                  disabled
                >
                  Request pending
                </UiButton>
                <UiButton
                  v-else
                  size="sm"
                  :loading="isClassroomEnrollSubmitting(course.id)"
                  :disabled="isClassroomEnrollSubmitting(course.id)"
                  @click="handleClassroomEnroll(course.id)"
                >
                  Enroll
                </UiButton>
              </div>
            </div>
          </div>
        </UiCard>
      </template>

      <div
        v-for="(post, index) in posts"
        :key="post.id"
        class="animate-fade-in scroll-optimized-item"
        :style="{ animationDelay: `${index * 50}ms` }"
      >
        <FeedPostCard
          :post="post"
          :is-guest="isGuest"
          :current-user-id="String(userStore.user?.id || '')"
          :allow-delete="!isGuest"
          @like="handleLike"
          @comment="toggleCommentBox"
          @delete="handleDeletePost"
        />

        <UiCard v-if="!isGuest && isCommentBoxOpen(post.id)" class="mt-2 !p-4">
          <div class="flex items-start gap-3">
            <UiAvatar
              :src="userStore.user?.avatar"
              :name="userStore.user?.name || 'User'"
              size="sm"
            />

            <div class="flex-1">
              <textarea
                v-model="commentDrafts[post.id]"
                rows="2"
                class="textarea-field !min-h-[84px] px-3 resize-none"
                placeholder="Write a comment..."
                @keydown.enter.exact.prevent="submitComment(post.id)"
              />

              <div class="mt-2 flex items-center justify-end gap-2">
                <UiButton variant="ghost" @click="closeCommentBox(post.id)">
                  Cancel
                </UiButton>
                <UiButton
                  :disabled="isCommentSubmitting(post.id) || !getCommentDraft(post.id).trim()"
                  @click="submitComment(post.id)"
                >
                  {{ isCommentSubmitting(post.id) ? 'Posting...' : 'Comment' }}
                </UiButton>
              </div>
            </div>
          </div>
        </UiCard>
      </div>
    </div>
    
    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-4">
      <UiCard v-for="i in 3" :key="i" class="p-4">
        <div class="flex items-center gap-3 mb-4">
          <UiSkeleton variant="circular" class="w-10 h-10" />
          <div class="flex-1">
            <UiSkeleton variant="text" class="w-32 mb-2" />
            <UiSkeleton variant="text" class="w-24" />
          </div>
        </div>
        <UiSkeleton variant="rectangular" class="h-48 mb-4" />
        <UiSkeleton variant="text" class="w-full mb-2" />
        <UiSkeleton variant="text" class="w-3/4" />
      </UiCard>
    </div>
    
    <!-- Load more -->
    <div v-if="hasMore && !loading" class="text-center mt-6">
      <UiButton variant="secondary" @click="loadMore">
        Load more
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
import { usePostsStore } from '~/stores/posts'
import {
  getClassroomCourses,
  getMyClassroomEnrollments,
  requestCourseEnrollment,
  type ClassroomCourse,
  type ClassroomEnrollment,
} from '~/services/api/classroom'

const userStore = useUserStore()
const postsStore = usePostsStore()
const { posts, loading, hasMore, error } = storeToRefs(postsStore)
const isTeacher = computed(() => userStore.user?.role === 'teacher')
const isGuest = computed(() => !userStore.isAuthenticated)

const newPostContent = ref('')
const creatingPost = ref(false)
const mediaInputRef = ref<HTMLInputElement | null>(null)
const selectedMediaFile = ref<File | null>(null)
const mediaPreviewUrl = ref('')
const selectedMediaType = ref<'image' | 'video'>('image')
const localError = ref('')
const classroomInfo = ref('')
const classroomError = ref('')
const openCommentPostIds = ref<string[]>([])
const commentDrafts = ref<Record<string, string>>({})
const commentSubmittingByPost = ref<Record<string, boolean>>({})
const classroomCoursesLoading = ref(false)
const classroomCourses = ref<ClassroomCourse[]>([])
const classroomEnrollments = ref<ClassroomEnrollment[]>([])
const classroomEnrollmentSubmittingIds = ref<string[]>([])
const classroomLocallyPendingByCourse = ref<Record<string, boolean>>({})

const allowedMediaTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/x-matroska',
])

const maxMediaBytes = 50 * 1024 * 1024

const displayError = computed(() => localError.value || error.value)

const formatRelativeTime = (value: string): string => {
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

const sortByCreatedAtDesc = (items: ClassroomCourse[]): ClassroomCourse[] =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

const classroomEnrolledCourseIds = computed(() => {
  const ids = new Set<string>()
  classroomEnrollments.value.forEach((enrollment) => {
    const normalized = (enrollment.status || '').toLowerCase()
    if (['approved', 'active', 'enrolled'].includes(normalized)) {
      ids.add(enrollment.course.id)
    }
  })
  return ids
})

const getClassroomEnrollmentState = (course: ClassroomCourse): 'enrolled' | 'pending' | 'not_enrolled' => {
  const enrollmentStatus = (course.enrollmentStatus || '').toLowerCase()

  if (classroomEnrolledCourseIds.value.has(course.id) || ['approved', 'active', 'enrolled'].includes(enrollmentStatus)) {
    return 'enrolled'
  }

  if (classroomLocallyPendingByCourse.value[course.id] || enrollmentStatus === 'pending') {
    return 'pending'
  }

  return 'not_enrolled'
}

const isClassroomEnrollSubmitting = (courseId: string): boolean => classroomEnrollmentSubmittingIds.value.includes(courseId)

const loadClassroomFeed = async () => {
  if (isTeacher.value) return

  classroomCoursesLoading.value = true
  classroomError.value = ''

  const coursesResult = await getClassroomCourses({ page: 1, limit: 20, status: 'active', sortBy: 'createdAt', sortOrder: 'desc' })

  classroomCoursesLoading.value = false

  if (!coursesResult.success || !coursesResult.data) {
    classroomError.value = coursesResult.error || 'Failed to load classroom courses'
    classroomCourses.value = []
    return
  }

  classroomCourses.value = sortByCreatedAtDesc(coursesResult.data)

  if (isGuest.value) {
    classroomEnrollments.value = []
    return
  }

  const enrollmentsResult = await getMyClassroomEnrollments()

  if (!enrollmentsResult.success || !enrollmentsResult.data) {
    classroomEnrollments.value = []
    return
  }

  classroomEnrollments.value = enrollmentsResult.data
}

const handleClassroomEnroll = async (courseId: string) => {
  if (isGuest.value) {
    classroomError.value = 'Please log in to enroll in a classroom.'
    return
  }

  if (isClassroomEnrollSubmitting(courseId)) return

  classroomEnrollmentSubmittingIds.value = [...classroomEnrollmentSubmittingIds.value, courseId]
  classroomError.value = ''
  classroomInfo.value = ''

  const result = await requestCourseEnrollment(courseId)

  classroomEnrollmentSubmittingIds.value = classroomEnrollmentSubmittingIds.value.filter((id) => id !== courseId)

  if (!result.success) {
    classroomError.value = result.error || 'Failed to send enrollment request'
    return
  }

  classroomLocallyPendingByCourse.value = {
    ...classroomLocallyPendingByCourse.value,
    [courseId]: true,
  }

  classroomCourses.value = classroomCourses.value.map((course) => {
    if (course.id !== courseId) return course
    return {
      ...course,
      enrollmentStatus: 'pending',
    }
  })

  classroomInfo.value = 'Enrollment request sent.'
}

const revokePreviewUrl = () => {
  if (mediaPreviewUrl.value) {
    URL.revokeObjectURL(mediaPreviewUrl.value)
    mediaPreviewUrl.value = ''
  }
}

const clearSelectedMedia = () => {
  selectedMediaFile.value = null
  selectedMediaType.value = 'image'
  revokePreviewUrl()

  if (mediaInputRef.value) {
    mediaInputRef.value.value = ''
  }
}

const openMediaPicker = () => {
  mediaInputRef.value?.click()
}

const handleMediaSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  localError.value = ''

  if (!allowedMediaTypes.has(file.type)) {
    localError.value = 'Unsupported file type. Please upload a supported image or video.'
    clearSelectedMedia()
    return
  }

  if (file.size > maxMediaBytes) {
    localError.value = 'File is too large. Maximum allowed size is 50MB.'
    clearSelectedMedia()
    return
  }

  revokePreviewUrl()
  selectedMediaFile.value = file
  selectedMediaType.value = file.type.startsWith('video/') ? 'video' : 'image'
  mediaPreviewUrl.value = URL.createObjectURL(file)
}

const handleLike = async (postId: string) => {
  if (isGuest.value) {
    localError.value = 'Please log in to like posts.'
    return
  }

  await postsStore.toggleLike(postId)
}

const handleDeletePost = async (postId: string) => {
  if (isGuest.value) {
    localError.value = 'Please log in to delete posts.'
    return
  }

  localError.value = ''
  const result = await postsStore.deleteOwnedPost(postId)

  if (!result.success) {
    localError.value = result.error || 'Failed to delete post'
  }
}

const isCommentBoxOpen = (postId: string) => openCommentPostIds.value.includes(postId)

const toggleCommentBox = (postId: string) => {
  if (isGuest.value) {
    localError.value = 'Please log in to comment on posts.'
    return
  }

  if (isCommentBoxOpen(postId)) {
    openCommentPostIds.value = openCommentPostIds.value.filter((id) => id !== postId)
    return
  }

  openCommentPostIds.value.push(postId)
  if (commentDrafts.value[postId] === undefined) {
    commentDrafts.value[postId] = ''
  }
}

const closeCommentBox = (postId: string) => {
  openCommentPostIds.value = openCommentPostIds.value.filter((id) => id !== postId)
}

const getCommentDraft = (postId: string) => commentDrafts.value[postId] || ''

const isCommentSubmitting = (postId: string) => Boolean(commentSubmittingByPost.value[postId])

const submitComment = async (postId: string) => {
  if (isGuest.value) {
    localError.value = 'Please log in to comment on posts.'
    return
  }

  const draft = getCommentDraft(postId).trim()
  if (!draft || isCommentSubmitting(postId)) return

  localError.value = ''
  commentSubmittingByPost.value = {
    ...commentSubmittingByPost.value,
    [postId]: true,
  }

  const result = await postsStore.addCommentToPost(postId, draft)

  commentSubmittingByPost.value = {
    ...commentSubmittingByPost.value,
    [postId]: false,
  }

  if (result.success) {
    commentDrafts.value = {
      ...commentDrafts.value,
      [postId]: '',
    }
    closeCommentBox(postId)
    return
  }

  localError.value = result.error || 'Failed to add comment'
}

const handleCreatePost = async () => {
  if (isGuest.value) {
    localError.value = 'Please log in to create a post.'
    return
  }

  if (!newPostContent.value.trim() && !selectedMediaFile.value) return

  localError.value = ''
  creatingPost.value = true
  const result = await postsStore.createNewPost(newPostContent.value.trim(), selectedMediaFile.value)
  creatingPost.value = false

  if (result.success) {
    newPostContent.value = ''
    clearSelectedMedia()
  } else {
    localError.value = result.error || 'Failed to publish post'
  }
}

const loadMore = async () => {
  await postsStore.loadMore()
}

onMounted(async () => {
  await Promise.all([
    postsStore.fetchPosts(true),
    loadClassroomFeed(),
  ])
})

onBeforeUnmount(() => {
  revokePreviewUrl()
})
</script>
