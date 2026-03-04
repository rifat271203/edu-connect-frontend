import type { UserPreview } from './user'

export type NotificationType = 
  | 'friend_request'
  | 'friend_accepted'
  | 'like'
  | 'comment'
  | 'share'
  | 'mention'
  | 'follow'
  | 'system'

export interface Notification {
  id: string
  type: NotificationType
  user?: UserPreview
  content?: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export interface FriendRequest {
  id: string
  fromUser: UserPreview
  timestamp: string
  status: 'pending' | 'accepted' | 'rejected'
}
