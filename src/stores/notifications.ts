import { defineStore } from 'pinia'
import {
  getFriendRequests,
  getNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  respondToFriendRequest,
} from '~/services/api/social'
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
})

// Dummy friend requests
const dummyFriendRequests: FriendRequest[] = [
  {
    id: '1',
    fromUser: {
      id: '11',
      username: 'jessicag',
      displayName: 'Jessica Garcia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica'
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
      avatar: 'https://api.dicebear.com/7.x//svg?seed=avataaarsryan'
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

      const [notificationsResult, unreadCountResult, friendRequestResult] = await Promise.all([
        getNotifications(20, 0),
        getUnreadNotificationsCount(),
        getFriendRequests(),
      ])

      if (notificationsResult.success && notificationsResult.data) {
        this.notifications = notificationsResult.data.map(mapNotification)
      } else {
        this.notifications = []
      }

      if (unreadCountResult.success && unreadCountResult.data) {
        this.unreadBadgeCount = unreadCountResult.data.unreadCount
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
      const result = await markNotificationAsRead(notificationId)
      if (!result.success) {
        return
      }

      const notification = this.notifications.find(n => n.id === notificationId)
      if (notification && !notification.read) {
        notification.read = true
        this.unreadBadgeCount = Math.max(this.unreadBadgeCount - 1, 0)
      }
    },
    
    async markAllAsRead() {
      const result = await markAllNotificationsAsRead()
      if (!result.success) {
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
