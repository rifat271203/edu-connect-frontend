<template>
  <div class="space-y-4">
    <div class="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-dark-700 dark:bg-dark-900">
      <button
        type="button"
        class="rounded-lg px-3 py-1.5 text-xs font-medium"
        :class="activeTab === 'materials' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-dark-300'"
        @click="activeTab = 'materials'"
      >
        Course Materials
      </button>
      <button
        type="button"
        class="rounded-lg px-3 py-1.5 text-xs font-medium"
        :class="activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-dark-300'"
        @click="activeTab = 'notes'"
      >
        My Notes
      </button>
    </div>

    <section v-if="activeTab === 'materials'" class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="inline-flex rounded-xl border border-slate-200 bg-white p-1 text-xs dark:border-dark-700 dark:bg-dark-900">
          <button
            v-for="item in categories"
            :key="item"
            type="button"
            class="rounded-lg px-3 py-1.5 capitalize"
            :class="materialFilter === item ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-dark-300'"
            @click="materialFilter = item"
          >
            {{ item }}
          </button>
        </div>
        <BaseButton v-if="isTeacher" @click="resourceModalOpen = true">+ Upload Resource</BaseButton>
      </div>

      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <BaseCard
          v-for="resource in filteredResources"
          :key="resource.id"
          hover
          class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900"
          @click="openPreview(resource.id)"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="text-lg">{{ categoryIcon(resource.category) }}</p>
            <BaseBadge size="sm" variant="neutral">{{ resource.category }}</BaseBadge>
          </div>
          <h3 class="mt-2 text-sm font-semibold">{{ resource.title }}</h3>
          <p class="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-dark-300">{{ resource.description }}</p>
          <div class="mt-3 text-[11px] text-slate-500 dark:text-dark-400">
            <p>Downloads: {{ resource.downloadCount }}</p>
            <p>{{ formatDate(resource.uploadedAt) }}</p>
          </div>
          <div class="mt-3 flex justify-end" v-if="isTeacher">
            <BaseButton size="sm" variant="danger" @click.stop="deleteResource(resource.id)">Delete</BaseButton>
          </div>
        </BaseCard>
      </div>

      <BaseCard
        v-if="!filteredResources.length"
        class="border-dashed border-slate-300 bg-white text-center dark:border-dark-700 dark:bg-dark-900"
      >
        <div class="py-8">
          <p class="text-4xl">📚</p>
          <p class="mt-2 text-sm font-semibold">No resources in this category</p>
          <p class="text-xs text-slate-500 dark:text-dark-300">Upload materials so learners can access them here.</p>
        </div>
      </BaseCard>
    </section>

    <section v-else class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold">{{ isTeacher ? 'Student Notes' : 'Personal Notes' }}</h2>
        <BaseButton v-if="!isTeacher" @click="createNote">+ New Note</BaseButton>
      </div>

      <div v-if="isTeacher" class="grid gap-3 md:grid-cols-2">
        <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
          <h3 class="text-sm font-semibold">Nafis Islam</h3>
          <p class="mt-1 text-xs text-slate-500 dark:text-dark-300">2 notes updated this week</p>
        </BaseCard>
        <BaseCard class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900">
          <h3 class="text-sm font-semibold">Tasnim Akter</h3>
          <p class="mt-1 text-xs text-slate-500 dark:text-dark-300">1 note updated this week</p>
        </BaseCard>
      </div>

      <div v-else class="grid gap-3 md:grid-cols-2">
        <BaseCard
          v-for="note in myNotes"
          :key="note.id"
          hover
          class="border-slate-200 bg-white dark:border-dark-700 dark:bg-dark-900"
          @click="openNoteEditor(note.id)"
        >
          <h3 class="text-sm font-semibold">{{ note.title }}</h3>
          <p class="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-dark-300">{{ note.content }}</p>
          <p class="mt-2 text-[11px] text-slate-400 dark:text-dark-400">Last edited {{ formatDate(note.updatedAt) }}</p>
        </BaseCard>
      </div>
    </section>

    <BaseModal v-model="previewOpen" title="Resource Preview" size="xl">
      <div v-if="selectedResource" class="space-y-3">
        <h3 class="text-sm font-semibold">{{ selectedResource.title }}</h3>

        <iframe
          v-if="selectedResource.category === 'pdf'"
          :src="selectedResource.url"
          class="h-[60vh] w-full rounded-xl border border-slate-200 dark:border-dark-700"
          title="PDF Preview"
        />

        <iframe
          v-else-if="selectedResource.category === 'video'"
          :src="selectedResource.url"
          class="h-[360px] w-full rounded-xl border border-slate-200 dark:border-dark-700"
          title="Video Preview"
          allowfullscreen
        />

        <a
          v-else
          :href="selectedResource.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-300"
        >
          Open Link
        </a>
      </div>
    </BaseModal>

    <BaseModal v-model="resourceModalOpen" title="Upload Resource" size="lg">
      <div class="space-y-3">
        <BaseInput v-model="resourceForm.title" placeholder="Title" :error="resourceErrors.title" />
        <textarea
          v-model="resourceForm.description"
          class="textarea-field min-h-[100px] w-full rounded-xl px-3 py-2 text-sm"
          placeholder="Description"
        />
        <BaseSelect v-model="resourceForm.category" :options="resourceCategoryOptions" placeholder="Select category" />

        <div>
          <input ref="resourceFileRef" type="file" class="hidden" @change="onResourceFileSelected">
          <BaseButton variant="secondary" @click="resourceFileRef?.click()">Choose File</BaseButton>
          <p v-if="resourceFileName" class="mt-1 text-xs text-slate-500 dark:text-dark-300">{{ resourceFileName }}</p>
          <p v-if="resourceErrors.file" class="mt-1 text-xs text-[var(--danger)]">{{ resourceErrors.file }}</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <BaseButton variant="ghost" @click="resourceModalOpen = false">Cancel</BaseButton>
          <BaseButton :loading="uploading" @click="saveResource">Save</BaseButton>
        </div>
      </template>
    </BaseModal>

    <BaseModal v-model="noteEditorOpen" title="Edit Note" size="xl">
      <div class="space-y-3" v-if="editingDraft">
        <BaseInput v-model="editingDraft.title" placeholder="Note title" />
        <div class="flex items-center justify-between">
          <p class="text-xs text-slate-500 dark:text-dark-300">Markdown editor</p>
          <button type="button" class="text-xs text-indigo-600 dark:text-indigo-300" @click="showMarkdownPreview = !showMarkdownPreview">
            {{ showMarkdownPreview ? 'Hide preview' : 'Show preview' }}
          </button>
        </div>

        <textarea
          v-model="editingDraft.content"
          class="textarea-field min-h-[220px] w-full rounded-xl px-3 py-2 text-sm"
          placeholder="Write markdown..."
        />

        <div
          v-if="showMarkdownPreview"
          class="prose prose-sm max-w-none rounded-xl border border-slate-200 p-3 dark:prose-invert dark:border-dark-700"
          v-html="markdownPreview"
        />
      </div>

      <template #footer>
        <div class="flex justify-between">
          <BaseButton variant="danger" @click="deleteNote">Delete</BaseButton>
          <div class="flex gap-2">
            <BaseButton variant="ghost" @click="noteEditorOpen = false">Cancel</BaseButton>
            <BaseButton @click="saveNote">Save</BaseButton>
          </div>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'
import { useMaterialStore } from '~/stores/material'
import { useClassroomStore } from '~/stores/classroom'
import { useUserStore } from '~/stores/user'
import { useRole } from '~/composables/useRole'
import { useFileUpload } from '~/composables/useFileUpload'
import { useToast } from '~/composables/useToast'
import type { ClassroomResource, PersonalNote } from '~/types/classroom-room'

definePageMeta({
  layout: 'classroom',
})

const route = useRoute()
const courseId = computed(() => String(route.params.courseId || ''))

const materialStore = useMaterialStore()
const classroomStore = useClassroomStore()
const userStore = useUserStore()
const { isTeacher } = useRole()
const toast = useToast()
const { upload, uploading } = useFileUpload()

useHead(() => ({
  title: `${classroomStore.course?.title || 'Classroom'} • Notes`,
}))

const currentUserId = computed(() => String(userStore.user?.id || 'student-1'))

const activeTab = ref<'materials' | 'notes'>('materials')
const materialFilter = ref<'all' | 'pdf' | 'video' | 'link' | 'document'>('all')
const categories = ['all', 'pdf', 'video', 'link', 'document'] as const

const previewOpen = ref(false)
const previewResourceId = ref('')

const resourceModalOpen = ref(false)
const resourceFileRef = ref<HTMLInputElement | null>(null)
const resourceFile = ref<File | null>(null)

const resourceForm = reactive({
  title: '',
  description: '',
  category: 'pdf',
})

const resourceErrors = reactive({
  title: '',
  file: '',
})

const noteEditorOpen = ref(false)
const noteEditorId = ref('')
const showMarkdownPreview = ref(false)

const resourceCategoryOptions = [
  { label: 'PDF', value: 'pdf' },
  { label: 'Video', value: 'video' },
  { label: 'Link', value: 'link' },
  { label: 'Document', value: 'document' },
]

const resources = computed(() => materialStore.resourcesByCourse(courseId.value))
const myNotes = computed(() => materialStore.notesByUser(currentUserId.value))

const filteredResources = computed(() =>
  materialFilter.value === 'all'
    ? resources.value
    : resources.value.filter((resource) => resource.category === materialFilter.value),
)

const selectedResource = computed(() => resources.value.find((resource) => resource.id === previewResourceId.value) || null)

const editingDraft = ref<PersonalNote | null>(null)

watch(
  () => noteEditorId.value,
  () => {
    const found = myNotes.value.find((item) => item.id === noteEditorId.value)
    editingDraft.value = found ? { ...found } : null
  },
)

const markdownPreview = computed(() => {
  if (!editingDraft.value) return ''
  return marked.parse(editingDraft.value.content || '') as string
})

const resourceFileName = computed(() => resourceFile.value?.name || '')

const categoryIcon = (category: string) => {
  if (category === 'pdf') return '📄'
  if (category === 'video') return '🎬'
  if (category === 'link') return '🔗'
  return '🗂️'
}

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-BD', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso))

const openPreview = (resourceId: string) => {
  previewResourceId.value = resourceId
  previewOpen.value = true
}

const deleteResource = (resourceId: string) => {
  materialStore.deleteResource(resourceId)
  toast.success('Resource deleted')
}

const onResourceFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement
  resourceFile.value = input.files?.[0] || null
}

const validateResource = () => {
  resourceErrors.title = resourceForm.title.trim() ? '' : 'Title is required'
  resourceErrors.file = resourceFile.value ? '' : 'File is required'
  return !resourceErrors.title && !resourceErrors.file
}

const resetResourceForm = () => {
  resourceForm.title = ''
  resourceForm.description = ''
  resourceForm.category = 'pdf'
  resourceFile.value = null
  resourceErrors.title = ''
  resourceErrors.file = ''
  if (resourceFileRef.value) {
    resourceFileRef.value.value = ''
  }
}

const saveResource = async () => {
  if (!validateResource() || !resourceFile.value) return

  const uploaded = await upload(resourceFile.value)
  if (!uploaded?.fileUrl) {
    toast.error('Upload failed')
    return
  }

  const payload: ClassroomResource = {
    id: `${courseId.value}-${Date.now()}`,
    courseId: courseId.value,
    title: resourceForm.title.trim(),
    description: resourceForm.description.trim(),
    category: resourceForm.category as 'pdf' | 'video' | 'link' | 'document',
    url: uploaded.fileUrl,
    downloadCount: 0,
    uploadedAt: new Date().toISOString(),
  }

  materialStore.saveResource(payload)
  resourceModalOpen.value = false
  resetResourceForm()
  toast.success('Resource uploaded')
}

const createNote = () => {
  const id = `${currentUserId.value}-note-${Date.now()}`
  const note: PersonalNote = {
    id,
    userId: currentUserId.value,
    title: 'Untitled note',
    content: '',
    updatedAt: new Date().toISOString(),
  }
  materialStore.saveNote(note)
  openNoteEditor(id)
}

const openNoteEditor = (noteId: string) => {
  noteEditorId.value = noteId
  const found = myNotes.value.find((item) => item.id === noteId)
  editingDraft.value = found ? { ...found } : null
  noteEditorOpen.value = true
  showMarkdownPreview.value = false
}

const saveNote = () => {
  if (!editingDraft.value) return
  materialStore.saveNote({
    ...editingDraft.value,
    title: editingDraft.value.title.trim() || 'Untitled note',
    updatedAt: new Date().toISOString(),
  })
  noteEditorOpen.value = false
  toast.success('Note saved')
}

const deleteNote = () => {
  if (!editingDraft.value) return
  materialStore.deleteNote(editingDraft.value.id)
  noteEditorOpen.value = false
  noteEditorId.value = ''
  editingDraft.value = null
  toast.success('Note deleted')
}
</script>

