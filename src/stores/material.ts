import { defineStore } from 'pinia'
import type { ClassroomResource, PersonalNote } from '~/types/classroom-room'
import { getSharedNotes, uploadSharedNote, getPersonalNotes, createPersonalNote } from '~/services/api/classroom'

interface MaterialState {
  resources: ClassroomResource[]
  personalNotes: PersonalNote[]
  loading: boolean
}

export const useMaterialStore = defineStore('classroom-material', {
  state: (): MaterialState => ({
    resources: [],
    personalNotes: [],
    loading: false,
  }),

  getters: {
    resourcesByCourse: (state) => (courseId: string) =>
      state.resources
        .filter((resource) => resource.courseId === courseId)
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
    notesByCourse: (state) => (courseId: string) =>
      state.personalNotes
        .filter((note) => note.courseId === courseId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
  },

  actions: {
    async fetchResources(courseId: string) {
      this.loading = true
      const result = await getSharedNotes(courseId)
      this.loading = false
      if (result.success && result.data) {
        this.resources = (result.data as any[]).map(n => ({
          id: String(n.id),
          courseId,
          title: n.title,
          description: n.description,
          category: n.category as any,
          url: n.fileUrl,
          downloadCount: n.downloadCount || 0,
          uploadedAt: n.createdAt,
        }))
      }
    },

    async fetchPersonalNotes(courseId: string) {
      this.loading = true
      const result = await getPersonalNotes(courseId)
      this.loading = false
      if (result.success && result.data) {
        this.personalNotes = (result.data as any[]).map(n => ({
          id: String(n.id),
          userId: String(n.student || ''),
          courseId,
          title: n.title,
          content: n.content,
          updatedAt: n.updatedAt || n.createdAt,
        }))
      }
    },

    ensureCourseSeed(courseId: string, userId: string) {
       this.fetchResources(courseId)
       this.fetchPersonalNotes(courseId)
    },

    async saveResource(courseId: string, payload: any) {
      const result = await uploadSharedNote(courseId, payload)
      if (result.success) {
        await this.fetchResources(courseId)
        return true
      }
      return false
    },

    deleteResource(resourceId: string) {
      this.resources = this.resources.filter((resource) => resource.id !== resourceId)
    },

    async saveNote(courseId: string, payload: { title: string; content: string }) {
      const result = await createPersonalNote(courseId, payload)
      if (result.success) {
        await this.fetchPersonalNotes(courseId)
        return true
      }
      return false
    },

    deleteNote(noteId: string) {
      this.personalNotes = this.personalNotes.filter((note) => note.id !== noteId)
    },
  },
})

