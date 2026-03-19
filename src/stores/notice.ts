import { defineStore } from 'pinia'
import type { ClassroomNotice, NoticePriority } from '~/types/classroom-room'
import { useUserStore } from '~/stores/user'

interface NoticeState {
  notices: ClassroomNotice[]
  unreadCount: number
}

const now = Date.now()
const ago = (hours: number) => new Date(now - hours * 60 * 60 * 1000).toISOString()

const demoNotices: ClassroomNotice[] = [
  {
    id: 'notice-1',
    courseId: 'demo',
    title: 'Midterm preparation session',
    body: 'We will host a preparation session this Thursday at 8:00 PM. Bring your questions.',
    priority: 'high',
    pinned: true,
    authorId: 'teacher-1',
    authorName: 'Dr. Rahman',
    createdAt: ago(2),
    acknowledgementCount: 12,
    acknowledgedBy: [],
  },
  {
    id: 'notice-2',
    courseId: 'demo',
    title: 'Urgent: Lab room changed',
    body: 'Tomorrow lab will be held in Room B-204 due to maintenance.',
    priority: 'urgent',
    pinned: true,
    authorId: 'teacher-1',
    authorName: 'Dr. Rahman',
    createdAt: ago(18),
    acknowledgementCount: 8,
    acknowledgedBy: ['student-1'],
  },
  {
    id: 'notice-3',
    courseId: 'demo',
    title: 'Weekly reading material',
    body: 'Read chapter 5 and submit your reflections in notes.',
    priority: 'medium',
    pinned: false,
    authorId: 'teacher-1',
    authorName: 'Dr. Rahman',
    createdAt: ago(30),
    acknowledgementCount: 6,
    acknowledgedBy: [],
  },
]

export const useNoticeStore = defineStore('classroom-notice', {
  state: (): NoticeState => ({
    notices: [...demoNotices],
    unreadCount: 2,
  }),

  getters: {
    sortedNotices: (state) =>
      [...state.notices].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }),
  },

  actions: {
    ensureCourseSeed(courseId: string) {
      const hasCourseNotices = this.notices.some((notice) => notice.courseId === courseId)
      if (hasCourseNotices) return

      const seeded = demoNotices.map((notice, index) => ({
        ...notice,
        id: `${courseId}-seed-notice-${index + 1}`,
        courseId,
      }))

      this.notices = [...seeded, ...this.notices]
    },

    noticesByCourse(courseId: string) {
      return this.sortedNotices.filter((notice) => notice.courseId === courseId)
    },

    createNotice(courseId: string, payload: { title: string; body: string; priority: NoticePriority; pinned: boolean; attachmentUrl?: string }) {
      const userStore = useUserStore()
      const notice: ClassroomNotice = {
        id: `notice-${crypto.randomUUID()}`,
        courseId,
        title: payload.title,
        body: payload.body,
        priority: payload.priority,
        pinned: payload.pinned,
        authorId: String(userStore.user?.id || 'teacher-1'),
        authorName: userStore.user?.displayName || userStore.user?.name || 'Teacher',
        createdAt: new Date().toISOString(),
        acknowledgementCount: 0,
        acknowledgedBy: [],
        attachmentUrl: payload.attachmentUrl,
      }

      this.notices = [notice, ...this.notices]
    },

    updateNotice(noticeId: string, payload: Partial<Pick<ClassroomNotice, 'title' | 'body' | 'priority' | 'pinned' | 'attachmentUrl'>>) {
      this.notices = this.notices.map((notice) => (notice.id === noticeId ? { ...notice, ...payload } : notice))
    },

    deleteNotice(noticeId: string) {
      this.notices = this.notices.filter((notice) => notice.id !== noticeId)
    },

    togglePinned(noticeId: string) {
      this.notices = this.notices.map((notice) =>
        notice.id === noticeId
          ? {
              ...notice,
              pinned: !notice.pinned,
            }
          : notice,
      )
    },

    acknowledge(noticeId: string, userId: string) {
      this.notices = this.notices.map((notice) => {
        if (notice.id !== noticeId) return notice
        if (notice.acknowledgedBy.includes(userId)) return notice
        return {
          ...notice,
          acknowledgementCount: notice.acknowledgementCount + 1,
          acknowledgedBy: [...notice.acknowledgedBy, userId],
        }
      })
      this.unreadCount = Math.max(0, this.unreadCount - 1)
    },
  },
})

