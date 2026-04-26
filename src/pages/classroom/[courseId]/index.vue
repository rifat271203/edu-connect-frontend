<template>
  <div class="space-y-6">
    <!-- Redirect to public view if not enrolled and not teacher -->
    <template v-if="classroomStore.initialized && !classroomStore.isEnrolled && classroomStore.userRole !== 'teacher' && !isTeacher">
      <div class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
          <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <h2 class="text-xl font-bold text-[var(--t1)]">You're not enrolled in this course</h2>
        <p class="mt-2 text-sm text-[var(--t2)] max-w-md">Request enrollment to access live classes, materials, and the course message room.</p>
        <div class="mt-6 flex gap-3">
          <UiButton @click="navigateTo(`/classroom/${courseId}/public-view`)">View Course Info</UiButton>
          <UiButton variant="ghost" @click="navigateTo('/classroom')">Back to Classroom</UiButton>
        </div>
      </div>
    </template>

    <template v-else>
      <!-- Course Header -->
      <div class="overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-r from-[rgba(196,164,100,0.08)] to-[rgba(100,149,237,0.06)]">
        <div v-if="classroomStore.course?.coverImage" class="h-36 w-full overflow-hidden">
          <img :src="classroomStore.course.coverImage" :alt="classroomStore.course.title" class="h-full w-full object-cover" />
        </div>
        <div class="p-5">
          <p class="text-[11px] uppercase tracking-[0.12em] text-[var(--gold)] font-semibold">{{ classroomStore.userRole === 'teacher' ? 'Your Course' : 'Enrolled Course' }}</p>
          <h2 class="mt-1 text-xl font-bold text-[var(--t1)]">{{ classroomStore.course?.title || 'Loading...' }}</h2>
          <p class="mt-1 text-[13px] text-[var(--t2)] flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 text-[var(--t3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Instructor: {{ classroomStore.course?.teacherName }}
          </p>
          <div class="mt-2 flex items-center gap-3 text-[12px] text-[rgba(244,241,235,0.35)]">
            <span v-if="classroomStore.course?.code" class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
              {{ classroomStore.course.code }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {{ classroomStore.course?.memberCount || 0 }} members
            </span>
          </div>
        </div>
      </div>

      <!-- Pending Enrollment Requests (Teacher Only) -->
      <div v-if="classroomStore.userRole === 'teacher'" class="mb-6 rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-[16px] font-bold text-[var(--t1)] flex items-center gap-2">
                <svg class="w-5 h-5 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                Student Enrollment Requests
              </h3>
              <UiBadge v-if="enrollmentRequests.length > 0" variant="warning">
                {{ requestStatusFilter === 'pending' ? `${enrollmentRequests.length} Pending` : `${enrollmentRequests.length} Requests` }}
              </UiBadge>
            </div>
            <p class="mt-1 text-sm text-[var(--t2)]">
              Review incoming requests, leave an optional approval note, and approve students into the course.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="filter in requestFilters"
              :key="filter.key"
              type="button"
              class="rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors"
              :class="requestStatusFilter === filter.key ? 'border-[var(--gold)]/40 bg-[var(--gold)]/12 text-[var(--gold)]' : 'border-[var(--line)] bg-[var(--surface2)] text-[var(--t3)] hover:text-[var(--t1)]'"
              @click="setRequestFilter(filter.key)"
            >
              {{ filter.label }}
            </button>
            <UiButton size="sm" variant="ghost" :disabled="requestsLoading" @click="loadEnrollmentRequests()">
              Refresh
            </UiButton>
          </div>
        </div>

        <div v-if="requestsLoading" class="mt-4 space-y-3">
          <UiSkeleton v-for="i in 2" :key="i" variant="rectangular" class="h-28 rounded-2xl" />
        </div>

        <div v-else-if="enrollmentRequests.length === 0" class="mt-4 rounded-2xl border border-dashed border-[var(--line)] py-10 text-center">
          <p class="text-sm text-[var(--t3)]">No enrollment requests in this filter.</p>
        </div>

        <div v-else class="mt-4 space-y-3">
          <div
            v-for="req in enrollmentRequests"
            :key="req.id"
            class="rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--surface)_92%,white)_0%,var(--surface)_100%)] p-4"
          >
            <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div class="flex min-w-0 items-start gap-3">
                <UiAvatar :src="req.student.avatar" :name="req.student.displayName" size="sm" />
                <div class="min-w-0">
                  <div class="flex flex-wrap items-center gap-2">
                    <p class="truncate text-[14px] font-semibold text-[var(--t1)]">{{ req.student.displayName }}</p>
                    <UiBadge
                      :variant="req.status === 'approved' ? 'approved' : req.status === 'rejected' ? 'danger' : 'pending'"
                      size="sm"
                    >
                      {{ req.status }}
                    </UiBadge>
                  </div>
                  <p class="text-[11px] text-[var(--t3)]">@{{ req.student.username }} · {{ formatTimestamp(req.createdAt) }}</p>
                  <p v-if="req.message" class="mt-3 max-w-2xl rounded-2xl border border-[var(--line)] bg-[var(--surface2)]/80 p-3 text-sm text-[var(--t2)]">
                    {{ req.message }}
                  </p>
                  <p v-else class="mt-3 text-sm text-[var(--t3)]">No note was attached to this request.</p>
                </div>
              </div>

              <div class="w-full lg:max-w-md">
                <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--t3)]">Teacher note</p>
                <textarea
                  v-model="reviewNotes[req.id]"
                  rows="3"
                  class="textarea-field mt-2 w-full rounded-2xl px-4 py-3 text-sm"
                  placeholder="Optional approval or rejection note"
                />
                <div class="mt-3 flex flex-wrap gap-2">
                  <UiButton size="sm" variant="ghost" class="!text-red-400 hover:!bg-red-400/10" :disabled="processingRequest === req.id" @click="handleReject(req.id)">
                    Reject
                  </UiButton>
                  <UiButton size="sm" class="!bg-[var(--gold)] !text-black hover:opacity-90" :loading="processingRequest === req.id" :disabled="processingRequest === req.id" @click="handleApprove(req.id)">
                    Approve
                  </UiButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3 Action Cards -->
      <div class="grid gap-4 sm:grid-cols-3">
        <!-- Join Live Class Redesigned -->
        <div
          class="group relative overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-6 transition-all duration-300 hover:border-red-500/30 hover:shadow-[0_20px_40px_rgba(239,68,68,0.05)]"
        >
          <!-- Animated Gradient Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-red-500/[0.03] to-orange-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div class="relative flex flex-col h-full">
            <div class="flex items-start justify-between">
              <div class="relative">
                <div class="w-12 h-12 rounded-[16px] bg-red-500/10 flex items-center justify-center border border-red-500/10 transition-transform group-hover:scale-110 duration-500">
                  <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <!-- Pulsing ring if live -->
                <div v-if="classroomStore.hasActiveLiveRoom" class="absolute -inset-1 rounded-[18px] border border-red-500/20 animate-pulse" />
              </div>

              <div v-if="classroomStore.hasActiveLiveRoom" class="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold tracking-wider text-red-500 border border-red-500/20">
                <span class="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                LIVE
              </div>
            </div>

            <div class="mt-5">
              <h3 class="text-[16px] font-bold text-[var(--t1)] tracking-tight">
                {{ isTeacher ? 'Live Session Management' : 'Live Classroom' }}
              </h3>
              <p class="mt-1.5 text-[12.5px] text-[var(--t3)] leading-relaxed">
                {{ classroomStore.hasActiveLiveRoom 
                  ? 'A live session is currently in progress. Join your classmates and instructor now.' 
                  : (isTeacher ? 'Start a new live session for your students. High-quality video & screen sharing.' : 'No active session right now. You will be notified when class starts.') 
                }}
              </p>
            </div>

            <div class="mt-6 flex flex-col gap-2">
              <UiButton 
                block 
                :variant="classroomStore.hasActiveLiveRoom ? 'primary' : 'secondary'"
                class="!rounded-[14px] !h-11 shadow-sm transition-all group-hover:shadow-md"
                :class="classroomStore.hasActiveLiveRoom ? '!bg-red-500 hover:!bg-red-600 !text-white border-transparent' : ''"
                @click="handleLiveClass"
              >
                <template #icon-left>
                   <span v-if="classroomStore.hasActiveLiveRoom" class="material-symbols-rounded text-lg">play_circle</span>
                   <span v-else class="material-symbols-rounded text-lg">{{ isTeacher ? 'add_circle' : 'visibility' }}</span>
                </template>
                {{ classroomStore.hasActiveLiveRoom ? 'Join Live Room' : (isTeacher ? 'Start Live Class' : 'View Schedule') }}
              </UiButton>

              <UiButton
                v-if="isTeacher && classroomStore.hasActiveLiveRoom"
                block
                variant="ghost"
                class="!rounded-[14px] !h-10 !text-red-500 hover:!bg-red-500/10 !border-red-500/20"
                :loading="classroomStore.liveRoomLoading"
                @click="classroomStore.endLiveRoom()"
              >
                <template #icon-left>
                  <span class="material-symbols-rounded text-lg">stop_circle</span>
                </template>
                End Current Session
              </UiButton>
            </div>
          </div>
        </div>

        <!-- Recorded Classes -->
        <button
          type="button"
          class="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 text-left transition-all duration-200 hover:border-[var(--blue)]/40 hover:shadow-lg hover:shadow-[var(--blue)]/5"
          @click="showRecordedClasses = !showRecordedClasses"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div class="relative">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-lg bg-[var(--blue)]/10 flex items-center justify-center">
                <svg class="w-6 h-6 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
              </div>
              <span v-if="classroomStore.recordedClasses.length" class="rounded-full bg-[var(--blue)]/10 px-2 py-0.5 text-[10px] font-semibold text-[var(--blue)]">
                {{ classroomStore.recordedClasses.length }}
              </span>
            </div>
            <h3 class="mt-3 text-[15px] font-bold text-[var(--t1)]">Recorded Classes</h3>
            <p class="mt-1 text-[12px] text-[var(--t2)]">
              {{ classroomStore.recordedClassesLoading ? 'Loading...' : `${classroomStore.recordedClasses.length} recordings available` }}
            </p>
          </div>
        </button>

        <!-- Message Room -->
        <button
          type="button"
          class="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 text-left transition-all duration-200 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5"
          @click="handleMessageRoom"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div class="relative">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <span v-if="classroomStore.groupChat?.unreadCount" class="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-400">
                {{ classroomStore.groupChat.unreadCount }} new
              </span>
            </div>
            <h3 class="mt-3 text-[15px] font-bold text-[var(--t1)]">Message Room</h3>
            <p class="mt-1 text-[12px] text-[var(--t2)]">
              {{ classroomStore.groupChatLoading ? 'Loading...' : `${classroomStore.groupChat?.memberCount || 0} members` }}
            </p>
          </div>
        </button>
      </div>

      <!-- Recorded Classes Expanded -->
      <div v-if="showRecordedClasses" class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-[16px] font-bold text-[var(--t1)] flex items-center gap-2">
            <svg class="w-5 h-5 text-[var(--blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
            Recorded Classes
          </h3>
          <button type="button" class="text-xs text-[var(--t3)] hover:text-[var(--t1)]" @click="showRecordedClasses = false">Close</button>
        </div>
        <div v-if="classroomStore.recordedClassesLoading" class="space-y-2">
          <UiSkeleton v-for="i in 3" :key="i" variant="rectangular" class="h-16 rounded-xl" />
        </div>
        <div v-else-if="!classroomStore.recordedClasses.length" class="py-8 text-center text-sm text-[var(--t2)]">No recorded classes yet.</div>
        <div v-else class="space-y-2">
          <a
            v-for="rec in classroomStore.recordedClasses"
            :key="rec.id"
            :href="rec.url"
            target="_blank"
            class="flex items-center gap-3 rounded-xl border border-[var(--line)] p-3 hover:bg-[var(--surface2)] transition-colors"
          >
            <div class="h-12 w-20 shrink-0 rounded-lg bg-[var(--surface2)] flex items-center justify-center overflow-hidden">
              <img v-if="rec.thumbnailUrl" :src="rec.thumbnailUrl" class="h-full w-full object-cover" />
              <svg v-else class="w-6 h-6 text-[var(--t3)] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[13px] font-medium text-[var(--t1)] truncate">{{ rec.title }}</p>
              <p class="text-[11px] text-[var(--t3)]">
                {{ rec.duration ? formatDuration(rec.duration) : '' }}
                {{ rec.uploadedAt ? `· ${formatDate(rec.uploadedAt)}` : '' }}
              </p>
            </div>
          </a>
        </div>
      </div>

      <!-- Class Materials -->
      <div class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
        <div class="border-b border-[var(--line)] px-5 py-3 flex items-center justify-between">
          <h3 class="text-[16px] font-bold text-[var(--t1)] flex items-center gap-2">
            <svg class="w-5 h-5 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
            Class Materials
          </h3>
          <div class="flex gap-1">
              <button
                v-for="tab in materialTabs"
                :key="tab.key"
                type="button"
                class="rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all flex items-center gap-1.5"
                :class="activeMaterialTab === tab.key ? 'bg-[var(--gold)]/20 text-[var(--gold)] shadow-sm' : 'text-[var(--t3)] hover:text-[var(--t1)] hover:bg-[var(--surface2)]'"
                @click="activeMaterialTab = tab.key"
              >
                <component :is="tab.icon" class="w-3.5 h-3.5" />
                {{ tab.label }}
              </button>
          </div>
        </div>

        <div class="p-5">
          <div v-if="classroomStore.materialsLoading" class="space-y-2">
            <UiSkeleton v-for="i in 4" :key="i" variant="rectangular" class="h-14 rounded-xl" />
          </div>
          <div v-else-if="!filteredMaterials.length" class="py-8 text-center text-sm text-[var(--t2)]">
            No {{ activeMaterialTab === 'all' ? 'materials' : activeMaterialTab }} available yet.
          </div>
          <div v-else class="space-y-2">
            <a
              v-for="mat in filteredMaterials"
              :key="mat.id"
              :href="mat.url || '#'"
              :target="mat.url ? '_blank' : undefined"
              class="flex items-center gap-3 rounded-xl border border-[var(--line)] p-3 hover:bg-[var(--surface2)] transition-colors"
            >
              <div class="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center"
                :class="{
                  'bg-red-500/10 text-red-500': mat.type === 'notice',
                  'bg-blue-500/10 text-blue-500': mat.type === 'pdf' || mat.type === 'document',
                  'bg-purple-500/10 text-purple-500': mat.type === 'book',
                  'bg-orange-500/10 text-orange-500': mat.type === 'recording' || mat.type === 'video',
                  'bg-green-500/10 text-green-500': mat.type === 'link',
                }"
              >
                <component :is="getTypeIcon(mat.type)" class="w-5 h-5" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[13px] font-medium text-[var(--t1)] truncate">{{ mat.title }}</p>
                <p class="text-[11px] text-[var(--t3)]">
                  {{ mat.type }} · {{ formatDate(mat.uploadedAt) }}
                  <span v-if="mat.uploadedByName"> · by {{ mat.uploadedByName }}</span>
                </p>
              </div>
                <svg v-if="mat.type === 'pdf' || mat.type === 'document'" class="w-4 h-4 text-[var(--t3)] hover:text-[var(--t1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useClassroomStore } from '~/stores/classroom'
import { useRole } from '~/composables/useRole'
import {
  getCourseEnrollmentRequests,
  approveCourseEnrollmentRequest,
  rejectCourseEnrollmentRequest,
  type ClassroomEnrollmentRequest,
} from '~/services/api/classroom'

definePageMeta({ layout: 'main' })

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))
const classroomStore = useClassroomStore()
const { isTeacher } = useRole()

const showRecordedClasses = ref(false)
const activeMaterialTab = ref('all')

const enrollmentRequests = ref<ClassroomEnrollmentRequest[]>([])
const processingRequest = ref<string | null>(null)
const requestsLoading = ref(false)
const requestStatusFilter = ref<'pending' | 'all'>('pending')
const reviewNotes = reactive<Record<string, string>>({})

const requestFilters = [
  { key: 'pending', label: 'Pending' },
  { key: 'all', label: 'All' },
] as const

// Simple SVG Icon Components
const IconAll = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>' }
const IconNotice = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>' }
const IconPdf = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9h1a1 1 0 110 2H9V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17h6" /></svg>' }
const IconBook = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>' }
const IconVideo = { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>' }

const materialTabs = [
  { key: 'all', label: 'All', icon: IconAll },
  { key: 'notice', label: 'Notices', icon: IconNotice },
  { key: 'pdf', label: 'PDFs', icon: IconPdf },
  { key: 'book', label: 'Books', icon: IconBook },
  { key: 'recording', label: 'Recordings', icon: IconVideo },
]

const filteredMaterials = computed(() => {
  if (activeMaterialTab.value === 'all') return classroomStore.materials
  return classroomStore.materials.filter(m => m.type === activeMaterialTab.value)
})

const getTypeIcon = (type: string) => {
  const icons: Record<string, any> = {
    notice: IconNotice,
    pdf: IconPdf,
    document: IconPdf,
    book: IconBook,
    recording: IconVideo,
    video: IconVideo,
    link: { template: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>' },
  }
  return icons[type] || IconAll
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('en-BD', { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
}

const formatTimestamp = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('en-BD', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d)
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const setRequestFilter = async (status: typeof requestStatusFilter.value) => {
  requestStatusFilter.value = status
  await loadEnrollmentRequests()
}

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Overview`,
}))

const handleLiveClass = async () => {
  if (isTeacher.value) {
    if (classroomStore.hasActiveLiveRoom && classroomStore.liveRoom) {
      await navigateTo(`/meeting/${classroomStore.liveRoom.roomId}?role=teacher`)
    } else {
      const room = await classroomStore.startLiveRoom(`${classroomStore.course?.title || 'Class'} - Live`)
      if (room) {
        await navigateTo(`/meeting/${room.roomId}?role=teacher`)
      } else {
        classroomError.value = 'Failed to start live session. Please try again.'
      }
    }
  } else {
    // Student side
    if (classroomStore.hasActiveLiveRoom && classroomStore.liveRoom) {
      await navigateTo(`/meeting/${classroomStore.liveRoom.roomId}?role=student`)
    } else {
      // Fallback: If no explicit live room is found, use course-id as the room name 
      // so students can still join the session.
      const fallbackRoomId = `course-${courseId.value}`
      await navigateTo(`/meeting/${fallbackRoomId}?role=student`)
    }
  }
}

const handleMessageRoom = () => {
  navigateTo(`/messages?group=course-${courseId.value}`)
}

const loadEnrollmentRequests = async () => {
  if (classroomStore.userRole !== 'teacher') return
  requestsLoading.value = true
  const status = requestStatusFilter.value === 'pending' ? 'pending' : undefined
  const result = await getCourseEnrollmentRequests(courseId.value, status)
  requestsLoading.value = false

  if (!result.success || !result.data) {
    return
  }

  enrollmentRequests.value = result.data
}

const handleApprove = async (requestId: string) => {
  if (processingRequest.value) return
  processingRequest.value = requestId
  const reviewNote = reviewNotes[requestId]?.trim()
  const result = await approveCourseEnrollmentRequest(courseId.value, requestId, reviewNote)
  processingRequest.value = null
  if (result.success) {
    if (requestStatusFilter.value === 'all') {
      enrollmentRequests.value = enrollmentRequests.value.map((req) =>
        req.id === requestId ? { ...req, status: result.data?.status || 'approved' } : req,
      )
    } else {
      enrollmentRequests.value = enrollmentRequests.value.filter(req => req.id !== requestId)
    }
    delete reviewNotes[requestId]
  }
}

const handleReject = async (requestId: string) => {
  if (processingRequest.value) return
  processingRequest.value = requestId
  const reviewNote = reviewNotes[requestId]?.trim()
  const result = await rejectCourseEnrollmentRequest(courseId.value, requestId, reviewNote)
  processingRequest.value = null
  if (result.success) {
    if (requestStatusFilter.value === 'all') {
      enrollmentRequests.value = enrollmentRequests.value.map((req) =>
        req.id === requestId ? { ...req, status: result.data?.status || 'rejected' } : req,
      )
    } else {
      enrollmentRequests.value = enrollmentRequests.value.filter(req => req.id !== requestId)
    }
    delete reviewNotes[requestId]
  }
}

onMounted(async () => {
  if (!classroomStore.initialized || classroomStore.courseId !== courseId.value) {
    const ok = await classroomStore.initialize(courseId.value)
    if (!ok) {
      await navigateTo('/classroom')
      return
    }
  }

  if (classroomStore.isEnrolled) {
    await classroomStore.loadCourseData()
  }

  if (classroomStore.userRole === 'teacher') {
    await loadEnrollmentRequests()
  }
})

watch(() => classroomStore.initialized, async (initialized) => {
  if (initialized && (classroomStore.isEnrolled || classroomStore.userRole === 'teacher')) {
    await classroomStore.loadCourseData()
  }
  if (initialized && classroomStore.userRole === 'teacher') {
    await loadEnrollmentRequests()
  }
})
</script>
