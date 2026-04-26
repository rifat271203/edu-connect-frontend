import { defineStore } from 'pinia'
import {
  getFriendRequests,
  getNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  respondToFriendRequest,
} from '~/services/api/social'
import { getClassroomNotifications } from '~/services/api/classroom'
import type { FriendRequestItem } from '~/services/api/social'
import type { Notification as ApiNotification, NotificationType } from '~/types/notification'

interface User {
  id: string
  username: string
  displayName: string
  avatar: string
}

interface Notification {
  id: string
  type: NotificationType
  user?: User
  content?: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  courseId?: string
  courseTitle?: string
  entityId?: string
  entityType?: string
  reviewNote?: string
}

interface FriendRequest {
  id: string
  fromUser: User
  timestamp: string
  status: 'pending' | 'accepted' | 'rejected'
}

interface NotificationsState {
  notifications: Notification[]
  friendRequests: FriendRequest[]
  loading: boolean
  unreadBadgeCount: number
}

const mapFriendRequest = (request: FriendRequestItem): FriendRequest => ({
  id: request.id,
  fromUser: {
    id: request.fromUser.id,
    username: request.fromUser.username,
    displayName: request.fromUser.displayName,
    avatar: request.fromUser.avatar,
  },
  timestamp: request.timestamp,
  status: request.status,
})

const mapNotification = (notification: ApiNotification): Notification => ({
  id: notification.id,
  type: notification.type,
  user: notification.user,
  content: notification.content,
  message: notification.message,
  timestamp: notification.timestamp,
  read: notification.read,
  actionUrl: notification.actionUrl,
  courseId: notification.courseId,
  courseTitle: notification.courseTitle,
  entityId: notification.entityId,
  entityType: notification.entityType,
  reviewNote: notification.reviewNote,
})

const mergeNotifications = (lists: Notification[][]): Notification[] => {
  const byId = new Map<string, Notification>()

  for (const list of lists) {
    for (const item of list) {
      byId.set(item.id, item)
    }
  }

  return [...byId.values()].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const extractUnreadCount = (payload: unknown): number => {
  if (!payload || typeof payload !== 'object') return 0
  const source = payload as Record<string, unknown>
  const raw = source.unreadCount ?? source.count ?? source.total ?? source.data
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string' && raw.trim() && !Number.isNaN(Number(raw))) return Number(raw)
  return 0
}

// Dummy friend requests
const dummyFriendRequests: FriendRequest[] = [
  {
    id: '1',
    fromUser: {
      id: '11',
      username: 'jessicag',
      displayName: 'Jessica Garcia',
      avatar: ''
    },
    timestamp: '2 hours ago',
    status: 'pending'
  },
  {
    id: '2',
    fromUser: {
      id: '12',
      username: 'ryanb',
      displayName: 'Ryan Brown',
      avatar: ''
    },
    timestamp: '1 day ago',
    status: 'pending'
  }
]

export const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationsState => ({
    notifications: [],
    friendRequests: [],
    loading: false,
    unreadBadgeCount: 0,
  }),
  
  getters: {
    unreadNotifications: (state) => state.notifications.filter(n => !n.read),
    unreadCount: (state) => state.unreadBadgeCount,
    pendingFriendRequests: (state) => state.friendRequests.filter(r => r.status === 'pending')
  },
  
  actions: {
    async fetchNotifications() {
      if (this.loading) return
      
      this.loading = true

      const [notificationsResult, classroomNotificationsResult, unreadCountResult, friendRequestResult] = await Promise.all([
        getNotifications(20, 0),
        getClassroomNotifications(),
        getUnreadNotificationsCount(),
        getFriendRequests(),
      ])

      const socialNotifications = notificationsResult.success && notificationsResult.data
        ? notificationsResult.data.map(mapNotification)
        : []

      const classroomNotifications = classroomNotificationsResult.success && classroomNotificationsResult.data
        ? classroomNotificationsResult.data.map(mapNotification)
        : []

      this.notifications = mergeNotifications([socialNotifications, classroomNotifications])

      if (unreadCountResult.success && unreadCountResult.data) {
        this.unreadBadgeCount =
          extractUnreadCount(unreadCountResult.data) +
          classroomNotifications.filter((notification) => !notification.read).length
      } else {
        this.unreadBadgeCount = this.notifications.filter((notification) => !notification.read).length
      }

      if (friendRequestResult.success && friendRequestResult.data) {
        this.friendRequests = friendRequestResult.data.incoming.map(mapFriendRequest)
      } else {
        this.friendRequests = [...dummyFriendRequests]
      }

      this.loading = false
    },
    
    async markAsRead(notificationId: string) {
      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        if (!notification.type.startsWith('enrollment_')) {
          const result = await markNotificationAsRead(notificationId)
          if (!result.success) {
            return
          }
        }

        notification.read = true
        this.unreadBadgeCount = Math.max(this.unreadBadgeCount - 1, 0)
      }
    },
    
    async markAllAsRead() {
      const result = await markAllNotificationsAsRead()
      if (!result.success) {
        this.notifications.forEach(n => {
          n.read = true
        })
        this.unreadBadgeCount = 0
        return
      }

      this.notifications.forEach(n => {
        n.read = true
      })
      this.unreadBadgeCount = 0
    },
    
    async acceptFriendRequest(requestId: string) {
      const result = await respondToFriendRequest(requestId, 'accepted')

      if (!result.success) {
        return
      }

      const request = this.friendRequests.find(r => r.id === requestId)
      if (request) {
        request.status = 'accepted'
      }
    },
    
    async rejectFriendRequest(requestId: string) {
      const result = await respondToFriendRequest(requestId, 'rejected')

      if (!result.success) {
        return
      }

      const request = this.friendRequests.find(r => r.id === requestId)
      if (request) {
        request.status = 'rejected'
      }
    }
  }
})
