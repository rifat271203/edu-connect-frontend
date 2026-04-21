import { defineStore } from 'pinia'
import type { ClassroomNotice, NoticePriority } from '~/types/classroom-room'
import { useUserStore } from '~/stores/user'
import { getClassroomNotices, createClassroomNotice, acknowledgeNotice as acknowledgeNoticeApi } from '~/services/api/classroom'

interface NoticeState {
  notices: ClassroomNotice[]
  unreadCount: number
  loading: boolean
}

export const useNoticeStore = defineStore('classroom-notice', {
  state: (): NoticeState => ({
    notices: [],
    unreadCount: 0,
    loading: false,
  }),

  getters: {
    sortedNotices: (state) =>
      [...state.notices].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }),
  },

  actions: {
    async fetchNotices(courseId: string) {
      this.loading = true
      const result = await getClassroomNotices(courseId)
      this.loading = false
      if (result.success && result.data) {
        // Map API data to ClassroomNotice type if needed
        this.notices = (result.data as any[]).map(n => ({
          id: String(n.id),
          courseId: String(n.courseId),
          title: n.title,
          body: n.body,
          priority: n.priority as NoticePriority,
          pinned: Boolean(n.pinned),
          authorId: String(n.author?.id || n.authorId),
          authorName: n.author?.name || n.authorName || 'Author',
          createdAt: n.createdAt,
          acknowledgementCount: n.acknowledgements || 0,
          acknowledgedBy: Array.isArray(n.acknowledgedBy) ? n.acknowledgedBy.map(String) : [],
          attachmentUrl: n.attachmentUrl,
        }))
        
        const userStore = useUserStore()
        const uid = String(userStore.user?.id)
        this.unreadCount = this.notices.filter(n => !n.acknowledgedBy.includes(uid)).length
      }
    },

    ensureCourseSeed(courseId: string) {
       // We'll keep this for demo if API fails or as a fallback, 
       // but typically fetchNotices will be used now.
       this.fetchNotices(courseId)
    },

    noticesByCourse(courseId: string) {
      return this.sortedNotices.filter((notice) => notice.courseId === courseId)
    },

    async createNotice(courseId: string, payload: { title: string; body: string; priority: NoticePriority; pinned: boolean; attachmentUrl?: string }) {
      const result = await createClassroomNotice(courseId, payload)
      if (result.success) {
        await this.fetchNotices(courseId)
        return true
      }
      return false
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

    async acknowledge(courseId: string, noticeId: string, userId: string) {
      const result = await acknowledgeNoticeApi(courseId, noticeId)
      if (result.success) {
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
        return true
      }
      return false
    },
  },
})

