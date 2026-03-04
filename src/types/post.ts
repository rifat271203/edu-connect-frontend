import type { UserPreview } from './user'

export interface Post {
  id: string
  user: UserPreview
  content: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  image?: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  timestamp: string
  tags?: string[]
}

export interface Comment {
  id: string
  user: UserPreview
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
}
