import { API_BASE_URL, apiRequest, type ApiResponse } from './client'
import type { Post as FeedPost, Comment as FeedComment } from '~/types/post'
import type { UserPreview } from '~/types/user'
import type { Notification as FeedNotification, NotificationType } from '~/types/notification'

export type PostPrivacy = 'public' | 'friends' | 'private'
export type FriendRequestAction = 'accepted' | 'rejected'

export interface CreatePostRequest {
  content: string
  mediaUrl?: string
  privacy?: PostPrivacy
}

export interface UpdatePostRequest {
  content?: string
  mediaUrl?: string
  privacy?: PostPrivacy
}

export interface AddCommentRequest {
  commentText: string
  parentCommentId?: number | null
}

export interface SharePostRequest {
  caption?: string
}

export interface FriendRequestItem {
  id: string
  fromUser: UserPreview
  toUser?: UserPreview
  status: 'pending' | 'accepted' | 'rejected'
  timestamp: string
}

export interface SocialSearchResult {
  users: UserPreview[]
  posts: FeedPost[]
}

export type SocialUserRole = 'teacher' | 'student'

export interface SearchUsersForDmParams {
  q: string
  role?: SocialUserRole
  limit?: number
}

export interface DmMessage {
  id: string
  senderId: string
  receiverId: string
  messageText: string
  isRead: boolean
  createdAt: string
  readAt?: string
  sender?: UserPreview
  receiver?: UserPreview
}

export interface DmConversation {
  user: UserPreview
  lastMessageId?: string
  lastMessageText: string
  lastMessageAt: string
  unreadCount: number
}

export interface UploadMediaResponse {
  mediaUrl: string
  mediaType: 'image' | 'video'
  mimeType?: string
  size?: number
  message?: string
}

export interface NotificationsUnreadCount {
  unreadCount: number
}

export interface MyProfileSummary {
  profile: {
    id: string
    name: string
    email: string
    role?: string
    department?: string
    institution?: string
    profilePicUrl?: string
    createdAt?: string
  }
  stats: {
    postCount: number
    shareCount: number
    likeGivenCount: number
    commentCount: number
    friendCount: number
  }
}

export interface MyActivitySummary {
  posts: FeedPost[]
  shares: unknown[]
  likes: FeedPost[]
  comments: FeedComment[]
}

export interface UploadProfilePicResponse {
  profilePicUrl: string
}

export interface PublicUserProfileSummary {
  profile: {
    id: string
    name: string
    email?: string
    role?: string
    department?: string
    institution?: string
    profilePicUrl?: string
    createdAt?: string
  }
  stats: {
    postCount: number
    shareCount: number
    friendCount: number
  }
  recentPosts: FeedPost[]
}

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : [])

const getUploadErrorMessage = (payload: unknown, fallbackStatus: number): string => {
  if (typeof payload === 'string') {
    return payload
  }

  const record = asRecord(payload)
  if (record) {
    if (typeof record.message === 'string') return record.message
    if (typeof record.error === 'string') return record.error
  }

  return fallbackStatus
    ? `Request failed with status ${fallbackStatus}`
    : 'Unable to connect to server'
}

const readUploadPayload = async (response: Response): Promise<unknown> => {
  if (response.status === 204) {
    return undefined
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return await response.json()
  }

  const text = await response.text()
  return text ? { message: text } : undefined
}

const getAuthToken = (): string | null => {
  if (!process.client) {
    return null
  }

  return localStorage.getItem('educonnect_token')
}

const normalizeUploadResponse = (payload: unknown): UploadMediaResponse | null => {
  const root = asRecord(payload) || {}
  const source = asRecord(root.data) || root

  const mediaUrl =
    (typeof source.mediaUrl === 'string' && source.mediaUrl) ||
    (typeof source.media_url === 'string' && source.media_url) ||
    ''

  if (!mediaUrl) {
    return null
  }

  const rawMediaType = source.mediaType || source.media_type
  const mediaType: UploadMediaResponse['mediaType'] = rawMediaType === 'video' ? 'video' : 'image'

  return {
    mediaUrl,
    mediaType,
    mimeType:
      (typeof source.mimeType === 'string' && source.mimeType) ||
      (typeof source.mime_type === 'string' && source.mime_type) ||
      undefined,
    size: typeof source.size === 'number' ? source.size : undefined,
    message: typeof source.message === 'string' ? source.message : undefined,
  }
}

const normalizeProfilePicUploadResponse = (payload: unknown): UploadProfilePicResponse | null => {
  const root = asRecord(payload) || {}
  const source = asRecord(root.data) || root

  const profilePicUrl =
    (typeof source.profilePicUrl === 'string' && source.profilePicUrl) ||
    (typeof source.profile_pic_url === 'string' && source.profile_pic_url) ||
    (typeof source.avatar === 'string' && source.avatar) ||
    ''

  if (!profilePicUrl) {
    return null
  }

  return { profilePicUrl }
}

const toId = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return fallback
}

const toNumber = (value: unknown, fallback = 0): number =>
  typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim() && !Number.isNaN(Number(value))
      ? Number(value)
      : fallback

const toIsoTimestamp = (value: unknown): string => {
  if (typeof value === 'string' && value) return value
  return new Date().toISOString()
}

const notificationTypes: NotificationType[] = [
  'friend_request',
  'friend_accepted',
  'like',
  'comment',
  'share',
  'mention',
  'follow',
  'system',
]

const toNotificationType = (value: unknown): NotificationType => {
  if (typeof value === 'string' && notificationTypes.includes(value as NotificationType)) {
    return value as NotificationType
  }

  return 'system'
}

const normalizeUser = (value: unknown, fallbackSeed = 'user'): UserPreview => {
  const root = asRecord(value) || {}
  const nested =
    asRecord(root.user) ||
    asRecord(root.profile) ||
    asRecord(root.author) ||
    asRecord(root.sender) ||
    asRecord(root.fromUser) ||
    asRecord(root.from_user) ||
    root

  const name =
    (typeof nested.displayName === 'string' && nested.displayName) ||
    (typeof nested.display_name === 'string' && nested.display_name) ||
    (typeof nested.name === 'string' && nested.name) ||
    (typeof nested.full_name === 'string' && nested.full_name) ||
    (typeof root.displayName === 'string' && root.displayName) ||
    (typeof root.name === 'string' && root.name) ||
    'User'

  const username =
    (typeof nested.username === 'string' && nested.username) ||
    (typeof nested.user_name === 'string' && nested.user_name) ||
    (typeof root.username === 'string' && root.username) ||
    name.toLowerCase().replace(/\s+/g, '') ||
    fallbackSeed

  const avatar =
    (typeof nested.avatar === 'string' && nested.avatar) ||
    (typeof nested.profilePicUrl === 'string' && nested.profilePicUrl) ||
    (typeof nested.profile_pic_url === 'string' && nested.profile_pic_url) ||
    (typeof nested.profile_image_url === 'string' && nested.profile_image_url) ||
    (typeof nested.author_profile_pic_url === 'string' && nested.author_profile_pic_url) ||
    (typeof nested.sender_profile_pic_url === 'string' && nested.sender_profile_pic_url) ||
    (typeof root.avatar === 'string' && root.avatar) ||
    (typeof root.profilePicUrl === 'string' && root.profilePicUrl) ||
    (typeof root.profile_pic_url === 'string' && root.profile_pic_url) ||
    ''

  const id = toId(
    nested.id ||
      nested.user_id ||
      nested.userId ||
      nested.author_id ||
      nested.authorId ||
      root.id ||
      root.user_id ||
      root.userId ||
      root.author_id ||
      root.authorId,
    fallbackSeed
  )

  return {
    id,
    username,
    displayName: name,
    avatar,
  }
}

const inferMediaTypeFromUrl = (url?: string): 'image' | 'video' | undefined => {
  if (!url) return undefined

  if (/\.(mp4|mov|webm|mkv)(\?.*)?$/i.test(url)) {
    return 'video'
  }

  if (/\.(jpg|jpeg|png|webp|gif|bmp|svg|avif)(\?.*)?$/i.test(url)) {
    return 'image'
  }

  return undefined
}

const resolvePostMediaType = (source: Record<string, unknown>, mediaUrl?: string): 'image' | 'video' | undefined => {
  const explicitType = source.mediaType || source.media_type
  if (explicitType === 'image' || explicitType === 'video') {
    return explicitType
  }

  const mimeType =
    (typeof source.mimeType === 'string' && source.mimeType) ||
    (typeof source.mime_type === 'string' && source.mime_type) ||
    ''

  if (mimeType.startsWith('video/')) {
    return 'video'
  }

  if (mimeType.startsWith('image/')) {
    return 'image'
  }

  return inferMediaTypeFromUrl(mediaUrl)
}

const normalizePost = (value: unknown): FeedPost => {
  const source = asRecord(value) || {}
  const id = toId(source.id, globalThis.crypto?.randomUUID?.() || String(Date.now()))

  const fallbackAuthor =
    source.user || source.author
      ? source.user || source.author
      : {
          id: source.user_id || source.userId || source.author_id || source.authorId,
          name: source.author_name || source.authorName,
          displayName: source.author_name || source.authorName,
          username: source.author_username || source.authorUsername,
          avatar:
            source.author_profile_pic_url ||
            source.authorProfilePicUrl ||
            source.author_avatar ||
            source.authorAvatar,
        }

  const content =
    (typeof source.content === 'string' && source.content) ||
    (typeof source.text === 'string' && source.text) ||
    ''

  const mediaUrl =
    (typeof source.mediaUrl === 'string' && source.mediaUrl) ||
    (typeof source.media_url === 'string' && source.media_url) ||
    (typeof source.media === 'string' && source.media) ||
    (typeof source.image === 'string' && source.image) ||
    undefined

  const mediaType = resolvePostMediaType(source, mediaUrl)

  const likes =
    typeof source.likesCount === 'number'
      ? source.likesCount
      : typeof source.likeCount === 'number'
        ? source.likeCount
        : typeof source.like_count === 'number'
          ? source.like_count
      : typeof source.likes === 'number'
        ? source.likes
        : 0

  const comments =
    typeof source.commentsCount === 'number'
      ? source.commentsCount
      : typeof source.commentCount === 'number'
        ? source.commentCount
        : typeof source.comment_count === 'number'
          ? source.comment_count
      : typeof source.comments === 'number'
        ? source.comments
        : 0

  const shares =
    typeof source.sharesCount === 'number'
      ? source.sharesCount
      : typeof source.shareCount === 'number'
        ? source.shareCount
        : typeof source.share_count === 'number'
          ? source.share_count
      : typeof source.shares === 'number'
        ? source.shares
        : 0

  return {
    id,
    user: normalizeUser(fallbackAuthor, `user-${id}`),
    content,
    mediaUrl,
    mediaType,
    image: mediaType === 'video' ? undefined : mediaUrl,
    likes,
    comments,
    shares,
    isLiked: Boolean(source.isLiked || source.is_liked || source.likedByMe || source.liked_by_me),
    timestamp: toIsoTimestamp(source.createdAt || source.created_at || source.timestamp),
    tags: Array.isArray(source.tags) ? source.tags.filter(tag => typeof tag === 'string') as string[] : undefined,
  }
}

const normalizeComment = (value: unknown): FeedComment => {
  const source = asRecord(value) || {}
  const id = toId(source.id, String(Date.now()))

  const fallbackAuthor =
    source.user || source.author
      ? source.user || source.author
      : {
          id: source.user_id || source.userId || source.author_id || source.authorId,
          name: source.author_name || source.authorName,
          displayName: source.author_name || source.authorName,
          username: source.author_username || source.authorUsername,
          avatar:
            source.author_profile_pic_url ||
            source.authorProfilePicUrl ||
            source.author_avatar ||
            source.authorAvatar,
        }

  return {
    id,
    user: normalizeUser(fallbackAuthor, `commenter-${id}`),
    content:
      (typeof source.commentText === 'string' && source.commentText) ||
      (typeof source.content === 'string' && source.content) ||
      '',
    timestamp: toIsoTimestamp(source.createdAt || source.timestamp),
    likes: typeof source.likes === 'number' ? source.likes : 0,
    isLiked: Boolean(source.isLiked),
  }
}

const normalizeNotification = (value: unknown): FeedNotification => {
  const source = asRecord(value) || {}
  const id = toId(source.id, String(Date.now()))

  const hasActorData = Boolean(
    source.user ||
      source.actor ||
      source.sender ||
      source.fromUser ||
      source.from_user ||
      source.user_id ||
      source.actor_id ||
      source.user_name ||
      source.actor_name
  )

  const fallbackActor = {
    id: source.user_id || source.userId || source.actor_id || source.actorId,
    name: source.user_name || source.userName || source.actor_name || source.actorName,
    displayName: source.user_name || source.userName || source.actor_name || source.actorName,
    username: source.user_username || source.userUsername || source.actor_username || source.actorUsername,
    avatar: source.user_avatar || source.userAvatar || source.actor_avatar || source.actorAvatar,
  }

  const userSource = source.user || source.actor || source.sender || source.fromUser || source.from_user || fallbackActor

  return {
    id,
    type: toNotificationType(source.type || source.notificationType || source.notification_type),
    user: hasActorData ? normalizeUser(userSource, `notification-user-${id}`) : undefined,
    content:
      (typeof source.content === 'string' && source.content) ||
      (typeof source.text === 'string' && source.text) ||
      undefined,
    message:
      (typeof source.message === 'string' && source.message) ||
      (typeof source.title === 'string' && source.title) ||
      'Notification',
    timestamp: toIsoTimestamp(source.createdAt || source.created_at || source.timestamp),
    read: Boolean(source.read || source.isRead || source.is_read),
    actionUrl:
      (typeof source.actionUrl === 'string' && source.actionUrl) ||
      (typeof source.action_url === 'string' && source.action_url) ||
      (typeof source.url === 'string' && source.url) ||
      undefined,
  }
}

const mapResponseList = <T>(payload: unknown, mapper: (item: unknown) => T): T[] => {
  if (Array.isArray(payload)) {
    return payload.map(mapper)
  }

  const root = asRecord(payload) || {}
  const candidate = root.items || root.results || root.posts || root.users || root.data
  return asArray(candidate).map(mapper)
}

const mapNotificationsList = (payload: unknown): FeedNotification[] => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeNotification)
  }

  const root = asRecord(payload) || {}
  const candidate = root.items || root.results || root.notifications || root.data
  return asArray(candidate).map(normalizeNotification)
}

const normalizeMyProfile = (payload: unknown): MyProfileSummary => {
  const root = asRecord(payload) || {}
  const profileSource = asRecord(root.profile) || asRecord(root.user) || root
  const statsSource = asRecord(root.stats) || {}

  const id = toId(profileSource.id, '')
  const email = typeof profileSource.email === 'string' ? profileSource.email : ''
  const name =
    (typeof profileSource.name === 'string' && profileSource.name) ||
    (email ? email.split('@')[0] : 'User')

  return {
    profile: {
      id,
      name,
      email,
      role: typeof profileSource.role === 'string' ? profileSource.role : undefined,
      department: typeof profileSource.department === 'string' ? profileSource.department : undefined,
      institution: typeof profileSource.institution === 'string' ? profileSource.institution : undefined,
      profilePicUrl:
        (typeof profileSource.profilePicUrl === 'string' && profileSource.profilePicUrl) ||
        (typeof profileSource.profile_pic_url === 'string' && profileSource.profile_pic_url) ||
        (typeof profileSource.avatar === 'string' && profileSource.avatar) ||
        undefined,
      createdAt:
        (typeof profileSource.createdAt === 'string' && profileSource.createdAt) ||
        (typeof profileSource.created_at === 'string' && profileSource.created_at) ||
        undefined,
    },
    stats: {
      postCount: typeof statsSource.postCount === 'number' ? statsSource.postCount : typeof statsSource.post_count === 'number' ? statsSource.post_count : 0,
      shareCount: typeof statsSource.shareCount === 'number' ? statsSource.shareCount : typeof statsSource.share_count === 'number' ? statsSource.share_count : 0,
      likeGivenCount:
        typeof statsSource.likeGivenCount === 'number'
          ? statsSource.likeGivenCount
          : typeof statsSource.like_given_count === 'number'
            ? statsSource.like_given_count
            : 0,
      commentCount: typeof statsSource.commentCount === 'number' ? statsSource.commentCount : typeof statsSource.comment_count === 'number' ? statsSource.comment_count : 0,
      friendCount: typeof statsSource.friendCount === 'number' ? statsSource.friendCount : typeof statsSource.friend_count === 'number' ? statsSource.friend_count : 0,
    },
  }
}

const normalizeMyActivity = (payload: unknown): MyActivitySummary => {
  const root = asRecord(payload) || {}
  const source = asRecord(root.activity) || root

  return {
    posts: asArray(source.posts).map(normalizePost),
    shares: asArray(source.shares),
    likes: asArray(source.likes).map(normalizePost),
    comments: asArray(source.comments).map(normalizeComment),
  }
}

const normalizePublicUserProfile = (payload: unknown): PublicUserProfileSummary => {
  const root = asRecord(payload) || {}
  const profileSource = asRecord(root.profile) || {}
  const statsSource = asRecord(root.stats) || {}
  const postsSource = root.recentPosts || root.recent_posts || root.posts || []

  const id = toId(profileSource.id, '')
  const email = typeof profileSource.email === 'string' ? profileSource.email : undefined
  const name =
    (typeof profileSource.name === 'string' && profileSource.name) ||
    (email ? email.split('@')[0] : 'User')

  return {
    profile: {
      id,
      name,
      email,
      role: typeof profileSource.role === 'string' ? profileSource.role : undefined,
      department: typeof profileSource.department === 'string' ? profileSource.department : undefined,
      institution: typeof profileSource.institution === 'string' ? profileSource.institution : undefined,
      profilePicUrl:
        (typeof profileSource.profilePicUrl === 'string' && profileSource.profilePicUrl) ||
        (typeof profileSource.profile_pic_url === 'string' && profileSource.profile_pic_url) ||
        (typeof profileSource.avatar === 'string' && profileSource.avatar) ||
        undefined,
      createdAt:
        (typeof profileSource.createdAt === 'string' && profileSource.createdAt) ||
        (typeof profileSource.created_at === 'string' && profileSource.created_at) ||
        undefined,
    },
    stats: {
      postCount: typeof statsSource.postCount === 'number' ? statsSource.postCount : typeof statsSource.post_count === 'number' ? statsSource.post_count : 0,
      shareCount: typeof statsSource.shareCount === 'number' ? statsSource.shareCount : typeof statsSource.share_count === 'number' ? statsSource.share_count : 0,
      friendCount: typeof statsSource.friendCount === 'number' ? statsSource.friendCount : typeof statsSource.friend_count === 'number' ? statsSource.friend_count : 0,
    },
    recentPosts: asArray(postsSource).map(normalizePost),
  }
}

export const createPost = async (payload: CreatePostRequest): Promise<ApiResponse<FeedPost>> => {
  const result = await apiRequest<unknown>('/api/social/posts', 'POST', payload)
  if (!result.success) return result as ApiResponse<FeedPost>

  return { ...result, data: normalizePost(result.data) }
}

export const uploadPostMedia = async (file: File): Promise<ApiResponse<UploadMediaResponse>> => {
  try {
    const formData = new FormData()
    formData.append('media', file)

    const headers: HeadersInit = {}
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/api/social/upload-media`, {
      method: 'POST',
      headers,
      body: formData,
    })

    const payload = await readUploadPayload(response)

    if (!response.ok) {
      return {
        success: false,
        error: getUploadErrorMessage(payload, response.status),
        status: response.status,
      }
    }

    const data = normalizeUploadResponse(payload)
    if (!data) {
      return {
        success: false,
        error: 'Upload succeeded but media URL is missing in response',
        status: response.status,
      }
    }

    return {
      success: true,
      data,
      status: response.status,
    }
  } catch (error) {
    console.error('Upload media error:', error)
    return {
      success: false,
      error: 'Unable to upload media',
      status: 0,
    }
  }
}

export const uploadProfilePicture = async (file: File): Promise<ApiResponse<UploadProfilePicResponse>> => {
  try {
    const formData = new FormData()
    formData.append('profilePic', file)

    const headers: HeadersInit = {}
    const token = getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/api/social/me/profile-pic`, {
      method: 'POST',
      headers,
      body: formData,
    })

    const payload = await readUploadPayload(response)

    if (!response.ok) {
      return {
        success: false,
        error: getUploadErrorMessage(payload, response.status),
        status: response.status,
      }
    }

    const data = normalizeProfilePicUploadResponse(payload)
    if (!data) {
      return {
        success: false,
        error: 'Upload succeeded but profile picture URL is missing in response',
        status: response.status,
      }
    }

    return {
      success: true,
      data,
      status: response.status,
    }
  } catch (error) {
    console.error('Upload profile picture error:', error)
    return {
      success: false,
      error: 'Unable to upload profile picture',
      status: 0,
    }
  }
}

export const getFeedPosts = async (limit = 20, offset = 0): Promise<ApiResponse<FeedPost[]>> => {
  const result = await apiRequest<unknown>(`/api/social/posts?limit=${limit}&offset=${offset}`, 'GET')
  if (!result.success) return result as ApiResponse<FeedPost[]>

  return { ...result, data: mapResponseList(result.data, normalizePost) }
}

export const getPostDetails = async (postId: string): Promise<ApiResponse<FeedPost>> => {
  const result = await apiRequest<unknown>(`/api/social/posts/${postId}`, 'GET')
  if (!result.success) return result as ApiResponse<FeedPost>

  return { ...result, data: normalizePost(result.data) }
}

export const updatePost = async (postId: string, payload: UpdatePostRequest): Promise<ApiResponse<FeedPost>> => {
  const result = await apiRequest<unknown>(`/api/social/posts/${postId}`, 'PATCH', payload)
  if (!result.success) return result as ApiResponse<FeedPost>

  return { ...result, data: normalizePost(result.data) }
}

export const deletePost = async (postId: string): Promise<ApiResponse<void>> => {
  return await apiRequest<void>(`/api/social/posts/${postId}`, 'DELETE')
}

export const likePost = async (postId: string): Promise<ApiResponse<void>> => {
  return await apiRequest<void>(`/api/social/posts/${postId}/likes`, 'POST')
}

export const unlikePost = async (postId: string): Promise<ApiResponse<void>> => {
  return await apiRequest<void>(`/api/social/posts/${postId}/likes`, 'DELETE')
}

export const addComment = async (postId: string, payload: AddCommentRequest): Promise<ApiResponse<FeedComment>> => {
  const result = await apiRequest<unknown>(`/api/social/posts/${postId}/comments`, 'POST', payload)
  if (!result.success) return result as ApiResponse<FeedComment>

  return { ...result, data: normalizeComment(result.data) }
}

export const deleteComment = async (commentId: string): Promise<ApiResponse<void>> => {
  return await apiRequest<void>(`/api/social/comments/${commentId}`, 'DELETE')
}

export const sharePost = async (postId: string, payload: SharePostRequest = {}): Promise<ApiResponse<unknown>> => {
  return await apiRequest<unknown>(`/api/social/posts/${postId}/shares`, 'POST', payload)
}

export const getShares = async (): Promise<ApiResponse<unknown[]>> => {
  const result = await apiRequest<unknown>('/api/social/shares', 'GET')
  if (!result.success) return result as ApiResponse<unknown[]>

  return { ...result, data: mapResponseList(result.data, (item) => item) }
}

export const getNotifications = async (limit = 20, offset = 0): Promise<ApiResponse<FeedNotification[]>> => {
  const result = await apiRequest<unknown>(`/api/social/notifications?limit=${limit}&offset=${offset}`, 'GET')
  if (!result.success) return result as ApiResponse<FeedNotification[]>

  return { ...result, data: mapNotificationsList(result.data) }
}

export const getUnreadNotificationsCount = async (): Promise<ApiResponse<NotificationsUnreadCount>> => {
  const result = await apiRequest<unknown>('/api/social/notifications/unread-count', 'GET')
  if (!result.success) return result as ApiResponse<NotificationsUnreadCount>

  const source = asRecord(result.data) || {}
  const unreadCount =
    typeof source.unreadCount === 'number'
      ? source.unreadCount
      : typeof source.unread_count === 'number'
        ? source.unread_count
        : 0

  return {
    ...result,
    data: {
      unreadCount,
    },
  }
}

export const markNotificationAsRead = async (notificationId: string): Promise<ApiResponse<void>> => {
  return await apiRequest<void>(`/api/social/notifications/${notificationId}/read`, 'PATCH', { isRead: true })
}

export const markAllNotificationsAsRead = async (): Promise<ApiResponse<void>> => {
  return await apiRequest<void>('/api/social/notifications/read-all', 'PATCH', { isRead: true })
}

export const getMyProfile = async (): Promise<ApiResponse<MyProfileSummary>> => {
  const result = await apiRequest<unknown>('/api/social/me/profile', 'GET')
  if (!result.success) return result as ApiResponse<MyProfileSummary>

  return {
    ...result,
    data: normalizeMyProfile(result.data),
  }
}

export const getMyActivity = async (limit = 20, offset = 0): Promise<ApiResponse<MyActivitySummary>> => {
  const result = await apiRequest<unknown>(`/api/social/me/activity?limit=${limit}&offset=${offset}`, 'GET')
  if (!result.success) return result as ApiResponse<MyActivitySummary>

  return {
    ...result,
    data: normalizeMyActivity(result.data),
  }
}

export const getPublicUserProfile = async (
  userId: string | number,
  postLimit = 10,
  postOffset = 0
): Promise<ApiResponse<PublicUserProfileSummary>> => {
  const query = new URLSearchParams()
  query.set('postLimit', String(postLimit))
  query.set('postOffset', String(postOffset))

  const result = await apiRequest<unknown>(`/api/social/users/${userId}/profile?${query.toString()}`, 'GET')
  if (!result.success) return result as ApiResponse<PublicUserProfileSummary>

  return {
    ...result,
    data: normalizePublicUserProfile(result.data),
  }
}

const normalizeFriendRequest = (value: unknown): FriendRequestItem => {
  const source = asRecord(value) || {}
  const id = toId(source.id, String(Date.now()))

  const fromSource =
    source.fromUser ||
    source.sender ||
    source.requester ||
    source.from || {
      id: source.sender_id || source.senderId || source.from_user_id || source.fromUserId,
      name: source.sender_name || source.senderName,
      displayName: source.sender_name || source.senderName,
      username: source.sender_username || source.senderUsername,
      avatar:
        source.sender_profile_pic_url ||
        source.senderProfilePicUrl ||
        source.sender_avatar ||
        source.senderAvatar,
    }

  const toSource =
    source.toUser ||
    source.receiver || {
      id: source.receiver_id || source.receiverId || source.to_user_id || source.toUserId,
      name: source.receiver_name || source.receiverName,
      displayName: source.receiver_name || source.receiverName,
      username: source.receiver_username || source.receiverUsername,
      avatar:
        source.receiver_profile_pic_url ||
        source.receiverProfilePicUrl ||
        source.receiver_avatar ||
        source.receiverAvatar,
    }

  const from = normalizeUser(fromSource, `from-${id}`)
  const to = source.toUser || source.receiver ? normalizeUser(toSource, `to-${id}`) : undefined

  const rawStatus = source.status
  const status: FriendRequestItem['status'] =
    rawStatus === 'accepted' || rawStatus === 'rejected' || rawStatus === 'pending' ? rawStatus : 'pending'

  return {
    id,
    fromUser: from,
    toUser: to,
    status,
    timestamp: toIsoTimestamp(source.createdAt || source.timestamp),
  }
}

const normalizeDmMessage = (value: unknown): DmMessage => {
  const source = asRecord(value) || {}
  const id = toId(source.id, globalThis.crypto?.randomUUID?.() || String(Date.now()))

  const senderSource = source.sender || source.fromUser || source.from_user || source.author
  const receiverSource = source.receiver || source.toUser || source.to_user

  const senderId = toId(
    source.senderId || source.sender_id || source.fromUserId || source.from_user_id || (asRecord(senderSource) || {}).id,
    ''
  )

  const receiverId = toId(
    source.receiverId || source.receiver_id || source.toUserId || source.to_user_id || (asRecord(receiverSource) || {}).id,
    ''
  )

  const readAtRaw = source.readAt || source.read_at

  return {
    id,
    senderId,
    receiverId,
    messageText:
      (typeof source.messageText === 'string' && source.messageText) ||
      (typeof source.message_text === 'string' && source.message_text) ||
      (typeof source.text === 'string' && source.text) ||
      (typeof source.content === 'string' && source.content) ||
      '',
    isRead: Boolean(source.isRead || source.is_read || source.read),
    createdAt: toIsoTimestamp(source.createdAt || source.created_at || source.timestamp),
    readAt: typeof readAtRaw === 'string' && readAtRaw ? readAtRaw : undefined,
    sender: senderSource ? normalizeUser(senderSource, `sender-${id}`) : undefined,
    receiver: receiverSource ? normalizeUser(receiverSource, `receiver-${id}`) : undefined,
  }
}

const normalizeDmConversation = (value: unknown): DmConversation => {
  const source = asRecord(value) || {}
  const conversationId = toId(source.id, String(Date.now()))

  const partnerSource =
    source.user ||
    source.partner ||
    source.peer ||
    source.otherUser ||
    source.other_user || {
      id:
        source.user_id ||
        source.userId ||
        source.partner_id ||
        source.partnerId ||
        source.peer_id ||
        source.peerId ||
        source.other_user_id ||
        source.otherUserId ||
        source.friend_id ||
        source.friendId,
      name:
        source.user_name ||
        source.userName ||
        source.partner_name ||
        source.partnerName ||
        source.peer_name ||
        source.peerName ||
        source.other_user_name ||
        source.otherUserName,
      displayName:
        source.user_name ||
        source.userName ||
        source.partner_name ||
        source.partnerName ||
        source.peer_name ||
        source.peerName ||
        source.other_user_name ||
        source.otherUserName,
      avatar:
        source.user_avatar ||
        source.userAvatar ||
        source.user_profile_pic_url ||
        source.userProfilePicUrl ||
        source.partner_avatar ||
        source.partnerAvatar ||
        source.partner_profile_pic_url ||
        source.partnerProfilePicUrl,
    }

  const lastMessageRecord = asRecord(source.lastMessage) || asRecord(source.last_message) || {}

  const lastMessageText =
    (typeof source.lastMessageText === 'string' && source.lastMessageText) ||
    (typeof source.last_message_text === 'string' && source.last_message_text) ||
    (typeof source.preview === 'string' && source.preview) ||
    (typeof source.messageText === 'string' && source.messageText) ||
    (typeof source.message_text === 'string' && source.message_text) ||
    (typeof source.lastMessage === 'string' && source.lastMessage) ||
    (typeof lastMessageRecord.messageText === 'string' && lastMessageRecord.messageText) ||
    (typeof lastMessageRecord.message_text === 'string' && lastMessageRecord.message_text) ||
    (typeof lastMessageRecord.content === 'string' && lastMessageRecord.content) ||
    ''

  const lastMessageAt = toIsoTimestamp(
    source.lastMessageAt ||
      source.last_message_at ||
      source.updatedAt ||
      source.updated_at ||
      source.createdAt ||
      source.created_at ||
      source.timestamp ||
      lastMessageRecord.createdAt ||
      lastMessageRecord.created_at ||
      lastMessageRecord.timestamp
  )

  return {
    user: normalizeUser(partnerSource, `dm-user-${conversationId}`),
    lastMessageId: toId(
      source.lastMessageId || source.last_message_id || lastMessageRecord.id,
      ''
    ) || undefined,
    lastMessageText,
    lastMessageAt,
    unreadCount: toNumber(source.unreadCount || source.unread_count || source.unread, 0),
  }
}

const mapDmConversationsList = (payload: unknown): DmConversation[] => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeDmConversation)
  }

  const root = asRecord(payload) || {}
  const candidate = root.conversations || root.items || root.results || root.data
  return asArray(candidate).map(normalizeDmConversation)
}

const mapDmMessagesList = (payload: unknown): DmMessage[] => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeDmMessage)
  }

  const root = asRecord(payload) || {}
  const candidate = root.messages || root.items || root.results || root.data
  return asArray(candidate).map(normalizeDmMessage)
}

export const sendFriendRequest = async (receiverId: number | string): Promise<ApiResponse<FriendRequestItem>> => {
  const result = await apiRequest<unknown>('/api/social/friend-requests', 'POST', { receiverId })
  if (!result.success) return result as ApiResponse<FriendRequestItem>

  return { ...result, data: normalizeFriendRequest(result.data) }
}

export const getFriendRequests = async (): Promise<ApiResponse<{ incoming: FriendRequestItem[]; outgoing: FriendRequestItem[] }>> => {
  const result = await apiRequest<unknown>('/api/social/friend-requests', 'GET')
  if (!result.success) return result as ApiResponse<{ incoming: FriendRequestItem[]; outgoing: FriendRequestItem[] }>

  const root = asRecord(result.data) || {}
  const incomingRaw = root.incoming || root.received || root.requests || result.data
  const outgoingRaw = root.outgoing || root.sent || []

  return {
    ...result,
    data: {
      incoming: asArray(incomingRaw).map(normalizeFriendRequest),
      outgoing: asArray(outgoingRaw).map(normalizeFriendRequest),
    },
  }
}

export const respondToFriendRequest = async (
  requestId: string,
  action: FriendRequestAction
): Promise<ApiResponse<FriendRequestItem>> => {
  const result = await apiRequest<unknown>(`/api/social/friend-requests/${requestId}/respond`, 'PATCH', { action })
  if (!result.success) return result as ApiResponse<FriendRequestItem>

  return { ...result, data: normalizeFriendRequest(result.data) }
}

export const cancelFriendRequest = async (requestId: string): Promise<ApiResponse<void>> => {
  return await apiRequest<void>(`/api/social/friend-requests/${requestId}`, 'DELETE')
}

export const getFriends = async (): Promise<ApiResponse<UserPreview[]>> => {
  const result = await apiRequest<unknown>('/api/social/friends', 'GET')
  if (!result.success) return result as ApiResponse<UserPreview[]>

  return { ...result, data: mapResponseList(result.data, (item) => normalizeUser(item, 'friend')) }
}

export const unfriend = async (friendId: string): Promise<ApiResponse<void>> => {
  return await apiRequest<void>(`/api/social/friends/${friendId}`, 'DELETE')
}

export const searchSocial = async (params: { q: string; role?: 'teacher' | 'student'; limit?: number }): Promise<ApiResponse<SocialSearchResult>> => {
  const query = new URLSearchParams()
  query.set('q', params.q)

  if (params.role) query.set('role', params.role)
  if (params.limit) query.set('limit', String(params.limit))

  const result = await apiRequest<unknown>(`/api/social/search?${query.toString()}`, 'GET')
  if (!result.success) return result as ApiResponse<SocialSearchResult>

  const root = asRecord(result.data) || {}
  const usersRaw = root.users || root.people || []
  const postsRaw = root.posts || []

  return {
    ...result,
    data: {
      users: asArray(usersRaw).map((item) => normalizeUser(item, 'search-user')),
      posts: asArray(postsRaw).map(normalizePost),
    },
  }
}

export const searchUsersForDm = async (params: SearchUsersForDmParams): Promise<ApiResponse<UserPreview[]>> => {
  const queryValue = params.q.trim()
  if (!queryValue) {
    return {
      success: true,
      data: [],
      status: 200,
    }
  }

  const query = new URLSearchParams()
  query.set('q', queryValue)

  if (params.role) query.set('role', params.role)
  if (params.limit) query.set('limit', String(params.limit))

  const result = await apiRequest<unknown>(`/api/social/search?${query.toString()}`, 'GET')
  if (!result.success) return result as ApiResponse<UserPreview[]>

  const root = asRecord(result.data) || {}
  const usersRaw = root.users || root.people || root.results || root.items || root.data || []

  return {
    ...result,
    data: asArray(usersRaw).map((item) => normalizeUser(item, 'search-user')),
  }
}

export const getDmConversations = async (limit = 20, offset = 0): Promise<ApiResponse<DmConversation[]>> => {
  const result = await apiRequest<unknown>(`/api/social/dm/conversations?limit=${limit}&offset=${offset}`, 'GET')
  if (!result.success) return result as ApiResponse<DmConversation[]>

  return {
    ...result,
    data: mapDmConversationsList(result.data),
  }
}

export const getDmMessages = async (
  userId: string | number,
  limit = 50,
  beforeId?: string | number
): Promise<ApiResponse<DmMessage[]>> => {
  const query = new URLSearchParams()
  query.set('limit', String(limit))
  if (beforeId !== undefined && beforeId !== null && String(beforeId)) {
    query.set('beforeId', String(beforeId))
  }

  const endpoint = `/api/social/dm/messages/${encodeURIComponent(String(userId))}?${query.toString()}`
  const result = await apiRequest<unknown>(endpoint, 'GET')
  if (!result.success) return result as ApiResponse<DmMessage[]>

  return {
    ...result,
    data: mapDmMessagesList(result.data),
  }
}

export const sendDmMessage = async (payload: {
  receiverId: string | number
  messageText: string
}): Promise<ApiResponse<DmMessage>> => {
  const result = await apiRequest<unknown>('/api/social/dm/messages', 'POST', {
    receiverId: payload.receiverId,
    messageText: payload.messageText,
  })

  if (!result.success) return result as ApiResponse<DmMessage>

  return {
    ...result,
    data: normalizeDmMessage(result.data),
  }
}

export const markDmMessageRead = async (messageId: string | number): Promise<ApiResponse<void>> => {
  return await apiRequest<void>(`/api/social/dm/messages/${encodeURIComponent(String(messageId))}/read`, 'PATCH')
}

