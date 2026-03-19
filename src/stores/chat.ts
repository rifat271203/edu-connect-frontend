import { defineStore } from 'pinia'
import type { ClassroomChatMessage } from '~/types/classroom-room'

interface ChatState {
  messages: ClassroomChatMessage[]
  isConnected: boolean
  typingUsers: string[]
  unreadCount: number
}

const today = new Date()
const toIso = (offsetMinutes: number) => new Date(today.getTime() - offsetMinutes * 60_000).toISOString()

const initialMessages: ClassroomChatMessage[] = [
  {
    id: 'msg-1',
    courseId: 'demo',
    senderId: 'teacher-1',
    senderName: 'Dr. Rahman',
    isTeacher: true,
    content: 'Welcome everyone. Please review chapter 4 before tomorrow’s class.',
    createdAt: toIso(180),
    read: true,
  },
  {
    id: 'msg-2',
    courseId: 'demo',
    senderId: 'student-1',
    senderName: 'Nafis',
    isTeacher: false,
    content: 'Can we get a short summary PDF for chapter 4?',
    createdAt: toIso(162),
    read: true,
  },
]

export const useChatStore = defineStore('classroom-chat', {
  state: (): ChatState => ({
    messages: [...initialMessages],
    isConnected: false,
    typingUsers: [],
    unreadCount: 2,
  }),

  getters: {
    sortedMessages: (state) =>
      [...state.messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  },

  actions: {
    ensureCourseSeed(courseId: string) {
      const hasCourseMessages = this.messages.some((message) => message.courseId === courseId)
      if (hasCourseMessages) return

      const seeded = initialMessages.map((message, index) => ({
        ...message,
        id: `${courseId}-seed-msg-${index + 1}`,
        courseId,
      }))

      this.messages = [...seeded, ...this.messages]
    },

    setConnected(value: boolean) {
      this.isConnected = value
    },

    prependMessages(items: ClassroomChatMessage[]) {
      this.messages = [...items, ...this.messages]
    },

    addMessage(message: ClassroomChatMessage) {
      this.messages = [...this.messages, message]
      this.unreadCount += 1
    },

    deleteMessage(messageId: string) {
      this.messages = this.messages.filter((message) => message.id !== messageId)
    },

    setTypingUsers(users: string[]) {
      this.typingUsers = [...new Set(users)]
    },

    markAllRead() {
      this.unreadCount = 0
      this.messages = this.messages.map((message) => ({ ...message, read: true }))
    },
  },
})

