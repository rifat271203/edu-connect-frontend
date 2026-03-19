import { defineStore } from 'pinia'
import type { ClassroomResource, PersonalNote } from '~/types/classroom-room'

interface MaterialState {
  resources: ClassroomResource[]
  personalNotes: PersonalNote[]
}

const now = Date.now()
const ago = (days: number) => new Date(now - days * 86400 * 1000).toISOString()

const seedResources = (courseId: string): ClassroomResource[] => [
  {
    id: `${courseId}-resource-1`,
    courseId,
    title: 'Chapter 4 Summary',
    description: 'PDF handout with important formulas and concepts.',
    category: 'pdf',
    url: 'https://example.com/materials/chapter-4-summary.pdf',
    downloadCount: 42,
    uploadedAt: ago(2),
  },
  {
    id: `${courseId}-resource-2`,
    courseId,
    title: 'Periodic Trends Explanation',
    description: 'Recorded class video.',
    category: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    downloadCount: 30,
    uploadedAt: ago(5),
  },
  {
    id: `${courseId}-resource-3`,
    courseId,
    title: 'External Reading',
    description: 'Reference link for deeper reading.',
    category: 'link',
    url: 'https://en.wikipedia.org/wiki/Periodic_table',
    downloadCount: 19,
    uploadedAt: ago(8),
  },
]

export const useMaterialStore = defineStore('classroom-material', {
  state: (): MaterialState => ({
    resources: [],
    personalNotes: [],
  }),

  getters: {
    resourcesByCourse: (state) => (courseId: string) =>
      state.resources
        .filter((resource) => resource.courseId === courseId)
        .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
    notesByUser: (state) => (userId: string) =>
      state.personalNotes
        .filter((note) => note.userId === userId)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
  },

  actions: {
    ensureCourseSeed(courseId: string, userId: string) {
      if (!this.resources.some((resource) => resource.courseId === courseId)) {
        this.resources = [...seedResources(courseId), ...this.resources]
      }

      if (!this.personalNotes.some((note) => note.userId === userId)) {
        this.personalNotes = [
          {
            id: `${userId}-note-1`,
            userId,
            title: 'Chapter 4 Revision',
            content: '## Key points\n- Atomic radius trend\n- Ionization energy exceptions',
            updatedAt: ago(1),
          },
          ...this.personalNotes,
        ]
      }
    },

    saveResource(resource: ClassroomResource) {
      const exists = this.resources.some((item) => item.id === resource.id)
      if (!exists) {
        this.resources = [resource, ...this.resources]
        return
      }
      this.resources = this.resources.map((item) => (item.id === resource.id ? resource : item))
    },

    deleteResource(resourceId: string) {
      this.resources = this.resources.filter((resource) => resource.id !== resourceId)
    },

    saveNote(note: PersonalNote) {
      const exists = this.personalNotes.some((item) => item.id === note.id)
      if (!exists) {
        this.personalNotes = [note, ...this.personalNotes]
        return
      }
      this.personalNotes = this.personalNotes.map((item) => (item.id === note.id ? note : item))
    },

    deleteNote(noteId: string) {
      this.personalNotes = this.personalNotes.filter((note) => note.id !== noteId)
    },
  },
})

