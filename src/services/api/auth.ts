// Authentication service aligned with dedicated teacher/student auth endpoints

import { apiRequest, type ApiResponse } from './client'

export type UserRole = 'teacher' | 'student'

export interface LoginRequest {
  email: string
  password: string
  role?: UserRole
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: UserRole
  department?: string
  institution?: string
}

export interface AuthUser {
  id: string | number
  name: string
  email: string
  role?: UserRole
  username?: string
  avatar?: string
  profilePicUrl?: string
  isProfilePublic?: boolean
  department?: string
  institution?: string
  [key: string]: unknown
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

const buildAuthEndpoint = (role: UserRole, action: 'login' | 'register') => `/api/auth/${role}s/${action}`

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined

const deriveUsername = (name: string, email: string): string => {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, '')
  if (normalized) return normalized

  const emailPrefix = email.split('@')[0]?.trim().toLowerCase()
  return emailPrefix || 'user'
}

const toBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') return value
  if (value === 1 || value === '1' || value === 'true') return true
  if (value === 0 || value === '0' || value === 'false') return false
  return fallback
}

const BACKEND_UPLOAD_PREFIX = 'https://sincere-spontaneity-production-ab4e.up.railway.app/uploads/'

const toMediaUrl = (value: string | undefined | false): string | undefined => {
  if (!value) return undefined
  if (value.startsWith(BACKEND_UPLOAD_PREFIX)) {
    return '/uploads/' + value.slice(BACKEND_UPLOAD_PREFIX.length)
  }
  return value
}

const normalizeAuthResponse = (
  payload: unknown,
  tokenFromResponse?: string,
  fallback: { email: string; role?: UserRole } = { email: '' }
): AuthResponse | null => {
  const root = asRecord(payload) || {}
  const nestedUser = asRecord(root.user)
  const source = nestedUser || root

  const email =
    (typeof source.email === 'string' && source.email) ||
    (typeof root.email === 'string' && root.email) ||
    fallback.email

  const name =
    (typeof source.name === 'string' && source.name) ||
    (typeof root.name === 'string' && root.name) ||
    email.split('@')[0] ||
    'User'

  const token =
    tokenFromResponse ||
    (typeof root.token === 'string' ? root.token : undefined) ||
    (nestedUser && typeof nestedUser.token === 'string' ? nestedUser.token : undefined)

  if (!token) {
    return null
  }

  const user: AuthUser = {
    ...(source as AuthUser),
    id:
      (typeof source.id === 'string' || typeof source.id === 'number'
        ? source.id
        : typeof root.id === 'string' || typeof root.id === 'number'
          ? root.id
          : email || '0'),
    name,
    email,
    role:
      (source.role === 'teacher' || source.role === 'student'
        ? source.role
        : root.role === 'teacher' || root.role === 'student'
          ? root.role
          : fallback.role),
    username:
      (typeof source.username === 'string' && source.username) ||
      (typeof root.username === 'string' && root.username) ||
      deriveUsername(name, email),
    avatar: toMediaUrl(
      (typeof source.profilePicUrl === 'string' && source.profilePicUrl) ||
      (typeof source.profile_pic_url === 'string' && source.profile_pic_url) ||
      (typeof source.avatar === 'string' && source.avatar) ||
      (typeof root.avatar === 'string' && root.avatar) ||
      undefined
    ),
    profilePicUrl: toMediaUrl(
      (typeof source.profilePicUrl === 'string' && source.profilePicUrl) ||
      (typeof source.profile_pic_url === 'string' && source.profile_pic_url) ||
      (typeof root.profilePicUrl === 'string' && root.profilePicUrl) ||
      (typeof root.profile_pic_url === 'string' && root.profile_pic_url) ||
      undefined
    ),
    isProfilePublic: toBoolean(
      source.isProfilePublic ?? source.is_profile_public ?? root.isProfilePublic ?? root.is_profile_public,
      false
    ),
    department:
      (typeof source.department === 'string' && source.department) ||
      (typeof root.department === 'string' && root.department) ||
      undefined,
    institution:
      (typeof source.institution === 'string' && source.institution) ||
      (typeof root.institution === 'string' && root.institution) ||
      undefined,
  }

  return { token, user }
}

export const login = async (
  email: string,
  password: string,
  role: UserRole = 'student'
): Promise<ApiResponse<AuthResponse>> => {
  const result = await apiRequest<unknown>(buildAuthEndpoint(role, 'login'), 'POST', { email, password })

  if (!result.success) {
    return result as ApiResponse<AuthResponse>
  }

  const normalized = normalizeAuthResponse(result.data, result.token, { email, role })
  if (!normalized) {
    return {
      success: false,
      error: 'Authentication succeeded but response format was invalid',
      status: result.status,
    }
  }

  return {
    ...result,
    data: normalized,
    token: normalized.token,
  }
}

export const register = async (
  name: string,
  email: string,
  password: string,
  role: UserRole = 'student',
  profile: Pick<RegisterRequest, 'department' | 'institution'> = {
    department: 'General',
    institution: 'EduConnect',
  }
): Promise<ApiResponse<AuthResponse>> => {
  const body = {
    name,
    email,
    password,
    department: profile.department || 'General',
    institution: profile.institution || 'EduConnect',
  }

  const result = await apiRequest<unknown>(buildAuthEndpoint(role, 'register'), 'POST', body)

  if (!result.success) {
    return result as ApiResponse<AuthResponse>
  }

  const normalized = normalizeAuthResponse(result.data, result.token, { email, role })
  if (!normalized) {
    return {
      success: false,
      error: 'Registration succeeded but response format was invalid',
      status: result.status,
    }
  }

  return {
    ...result,
    data: normalized,
    token: normalized.token,
  }
}

export const getCurrentUser = async (): Promise<ApiResponse<AuthUser>> => {
  const result = await apiRequest<unknown>('/api/auth/me', 'GET')

  if (!result.success) {
    return result as ApiResponse<AuthUser>
  }

  const root = asRecord(result.data) || {}
  const userSource = asRecord(root.user) || root

  const email = typeof userSource.email === 'string' ? userSource.email : ''
  const name =
    (typeof userSource.name === 'string' && userSource.name) ||
    (email ? email.split('@')[0] : 'User')

  const user: AuthUser = {
    ...(userSource as AuthUser),
    id:
      typeof userSource.id === 'string' || typeof userSource.id === 'number'
        ? userSource.id
        : email || '0',
    name,
    email,
    username:
      (typeof userSource.username === 'string' && userSource.username) ||
      deriveUsername(name, email),
    avatar: toMediaUrl(
      (typeof userSource.profilePicUrl === 'string' && userSource.profilePicUrl) ||
      (typeof userSource.profile_pic_url === 'string' && userSource.profile_pic_url) ||
      (typeof userSource.avatar === 'string' && userSource.avatar) ||
      undefined
    ),
    profilePicUrl: toMediaUrl(
      (typeof userSource.profilePicUrl === 'string' && userSource.profilePicUrl) ||
      (typeof userSource.profile_pic_url === 'string' && userSource.profile_pic_url) ||
      (typeof root.profilePicUrl === 'string' && root.profilePicUrl) ||
      (typeof root.profile_pic_url === 'string' && root.profile_pic_url) ||
      undefined
    ),
    isProfilePublic: toBoolean(
      userSource.isProfilePublic ?? userSource.is_profile_public ?? root.isProfilePublic ?? root.is_profile_public,
      false
    ),
  }

  return {
    ...result,
    data: user,
  }
}

export const logout = async (): Promise<ApiResponse<void>> => {
  return {
    success: true,
    status: 200,
  }
}

export const changePassword = async (
  payload: ChangePasswordRequest,
): Promise<ApiResponse<{ message: string }>> => {
  return await apiRequest<{ message: string }>('/api/auth/password', 'PATCH', payload)
}
