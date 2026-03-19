<template>
  <div class="space-y-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-dark-700 dark:bg-dark-900">
        <button
          v-for="tab in tabs"
          :key="tab"
          type="button"
          class="rounded-lg px-3 py-1.5 text-xs font-medium capitalize"
          :class="activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-dark-300'"
          @click="activeTab = tab"
        >
          {{ tab }}
        </button>
      </div>

      <BaseButton v-if="isTeacher" @click="openCreate">+ New Notice</BaseButton>
    </div>

    <div v-if="filteredNotices.length" class="space-y-3">
      <BaseCard
        v-for="notice in filteredNotices"
        :key="notice.id"
        class="overflow-hidden border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900"
      >
        <div class="flex gap-3">
          <span class="w-1 rounded-full" :class="priorityBorder(notice.priority)" />
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-sm font-semibold">{{ notice.title }}</h3>
              <BaseBadge size="sm" :variant="priorityBadge(notice.priority)">{{ notice.priority }}</BaseBadge>
              <span v-if="notice.pinned" class="text-xs text-amber-500">📌 Pinned</span>
            </div>

            <p class="mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-dark-300">
              {{ expandedNoticeId === notice.id ? notice.body : truncate(notice.body, 160) }}
            </p>
            <button
              v-if="notice.body.length > 160"
              type="button"
              class="mt-1 text-xs text-indigo-600 hover:underline dark:text-indigo-300"
              @click="expandedNoticeId = expandedNoticeId === notice.id ? '' : notice.id"
            >
              {{ expandedNoticeId === notice.id ? 'Show less' : 'Expand' }}
            </button>

            <div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-dark-300">
              <span>By {{ notice.authorName }}</span>
              <span>•</span>
              <span>{{ formatDate(notice.createdAt) }}</span>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <BaseButton
                v-if="!isTeacher"
                size="sm"
                :variant="isAcknowledged(notice) ? 'secondary' : 'primary'"
                :disabled="isAcknowledged(notice)"
                @click="acknowledge(notice.id)"
              >
                {{ isAcknowledged(notice) ? '✓ Acknowledged' : 'Acknowledge' }}
              </BaseButton>

              <BaseBadge v-if="isTeacher" size="sm" variant="neutral">
                {{ notice.acknowledgementCount }}/{{ totalStudents }} read
              </BaseBadge>

              <template v-if="isTeacher">
                <BaseButton size="sm" variant="ghost" @click="openEdit(notice.id)">Edit</BaseButton>
                <BaseButton size="sm" variant="ghost" @click="togglePin(notice.id)">
                  {{ notice.pinned ? 'Unpin' : 'Pin' }}
                </BaseButton>
                <BaseButton size="sm" variant="danger" @click="confirmDelete(notice.id)">Delete</BaseButton>
              </template>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <BaseCard v-else class="border-dashed border-slate-300 bg-white text-center dark:border-dark-700 dark:bg-dark-900">
      <div class="py-8">
        <p class="text-4xl">📭</p>
        <p class="mt-2 text-sm font-semibold">No notices yet</p>
        <p class="text-xs text-slate-500 dark:text-dark-300">Announcements from teachers will appear here.</p>
      </div>
    </BaseCard>

    <BaseModal v-model="noticeModalOpen" :title="editingNoticeId ? 'Edit notice' : 'New notice'" size="lg">
      <div class="space-y-3">
        <BaseInput v-model="form.title" placeholder="Title" :error="errors.title" />
        <div>
          <textarea
            v-model="form.body"
            class="textarea-field min-h-[120px] w-full rounded-xl px-3 py-2 text-sm"
            placeholder="Notice body"
          />
          <p v-if="errors.body" class="mt-1 text-xs text-[var(--danger)]">{{ errors.body }}</p>
        </div>
        <BaseSelect v-model="form.priority" :options="priorityOptions" placeholder="Priority" />
        <label class="flex items-center gap-2 text-sm">
          <input v-model="form.pinned" type="checkbox">
          Pin notice
        </label>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" @click="noticeModalOpen = false">Cancel</BaseButton>
          <BaseButton @click="submitNotice">Save</BaseButton>
        </div>
      </template>
    </BaseModal>

    <BaseModal v-model="confirmDeleteOpen" title="Delete notice">
      <p class="text-sm text-slate-600 dark:text-dark-300">This action cannot be undone.</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" @click="confirmDeleteOpen = false">Cancel</BaseButton>
          <BaseButton variant="danger" @click="performDelete">Delete</BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { useNoticeStore } from '~/stores/notice'
import { useClassroomStore } from '~/stores/classroom'
import { useUserStore } from '~/stores/user'
import { useRole } from '~/composables/useRole'
import { useToast } from '~/composables/useToast'
import type { ClassroomNotice } from '~/types/classroom-room'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))

const noticeStore = useNoticeStore()
const classroomStore = useClassroomStore()
const userStore = useUserStore()
const { isTeacher } = useRole()
const toast = useToast()

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Notices`,
}))

const tabs = ['all', 'pinned', 'urgent'] as const
const activeTab = ref<(typeof tabs)[number]>('all')
const expandedNoticeId = ref('')

const noticeModalOpen = ref(false)
const confirmDeleteOpen = ref(false)
const editingNoticeId = ref('')
const deletingNoticeId = ref('')

const form = reactive({
  title: '',
  body: '',
  priority: 'medium',
  pinned: false,
})

const errors = reactive({
  title: '',
  body: '',
})

const priorityOptions = [
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const courseNotices = computed(() => noticeStore.noticesByCourse(courseId.value))

const filteredNotices = computed(() => {
  if (activeTab.value === 'all') return courseNotices.value
  if (activeTab.value === 'pinned') return courseNotices.value.filter((notice) => notice.pinned)
  return courseNotices.value.filter((notice) => notice.priority === 'urgent')
})

const totalStudents = computed(() => Math.max(1, classroomStore.course?.memberCount || 1))

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))

const truncate = (value: string, length: number) => (value.length <= length ? value : `${value.slice(0, length)}...`)

const priorityBorder = (priority: string) => {
  if (priority === 'urgent') return 'bg-red-500'
  if (priority === 'high') return 'bg-orange-500'
  if (priority === 'medium') return 'bg-blue-500'
  return 'bg-slate-400'
}

const priorityBadge = (priority: string) => {
  if (priority === 'urgent') return 'danger'
  if (priority === 'high') return 'warning'
  if (priority === 'medium') return 'accent'
  return 'neutral'
}

const isAcknowledged = (notice: ClassroomNotice) =>
  notice.acknowledgedBy.includes(String(userStore.user?.id || 'student-1'))

const acknowledge = (noticeId: string) => {
  noticeStore.acknowledge(noticeId, String(userStore.user?.id || 'student-1'))
  toast.success('Notice acknowledged')
}

const resetForm = () => {
  form.title = ''
  form.body = ''
  form.priority = 'medium'
  form.pinned = false
  errors.title = ''
  errors.body = ''
}

const openCreate = () => {
  editingNoticeId.value = ''
  resetForm()
  noticeModalOpen.value = true
}

const openEdit = (noticeId: string) => {
  const notice = courseNotices.value.find((item) => item.id === noticeId)
  if (!notice) return
  editingNoticeId.value = noticeId
  form.title = notice.title
  form.body = notice.body
  form.priority = notice.priority
  form.pinned = notice.pinned
  errors.title = ''
  errors.body = ''
  noticeModalOpen.value = true
}

const validate = () => {
  errors.title = form.title.trim() ? '' : 'Title is required'
  errors.body = form.body.trim() ? '' : 'Body is required'
  return !errors.title && !errors.body
}

const submitNotice = () => {
  if (!validate()) return

  if (editingNoticeId.value) {
    noticeStore.updateNotice(editingNoticeId.value, {
      title: form.title.trim(),
      body: form.body.trim(),
      priority: form.priority as 'urgent' | 'high' | 'medium' | 'low',
      pinned: form.pinned,
    })
    toast.success('Notice updated')
  } else {
    noticeStore.createNotice(courseId.value, {
      title: form.title.trim(),
      body: form.body.trim(),
      priority: form.priority as 'urgent' | 'high' | 'medium' | 'low',
      pinned: form.pinned,
    })
    toast.success('Notice created')
  }

  noticeModalOpen.value = false
  resetForm()
}

const togglePin = (noticeId: string) => {
  noticeStore.togglePinned(noticeId)
}

const confirmDelete = (noticeId: string) => {
  deletingNoticeId.value = noticeId
  confirmDeleteOpen.value = true
}

const performDelete = () => {
  if (!deletingNoticeId.value) return
  noticeStore.deleteNotice(deletingNoticeId.value)
  confirmDeleteOpen.value = false
  deletingNoticeId.value = ''
  toast.success('Notice deleted')
}
</script>

