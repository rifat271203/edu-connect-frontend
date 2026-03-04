export interface User {
  id: string
  username: string
  displayName: string
  email: string
  avatar: string
  coverImage?: string
  bio?: string
  followers: number
  following: number
  isOnline?: boolean
  createdAt?: string
}

export interface UserPreview {
  id: string
  username: string
  displayName: string
  avatar: string
}
