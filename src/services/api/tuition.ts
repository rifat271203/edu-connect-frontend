import { apiRequest, type ApiResponse } from './client'

export interface TuitionPost {
  id: number
  teacher_id: number
  subject: string
  location: string
  tuition_fee: string
  details: string
  created_at: string
  teacher_name: string
  teacher_institution?: string
  profile_pic_url?: string
}

export interface TuitionCreateRequest {
  subject: string
  location: string
  tuition_fee: string
  details: string
}

export interface TuitionConnectRequest {
  id: number
  post_id: number
  student_id: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  student_name: string
  student_email: string
  student_institution?: string
  subject: string
  location?: string
  tuition_fee?: string
  teacher_name?: string
}

export interface PopularTeacher {
  id: number
  name: string
  email: string
  department?: string
  institution?: string
  profile_pic_url?: string
  total_posts: number
  total_requests: number
  approved_requests: number | string
  latest_post_at?: string
}

interface PopularTeachersResponse {
  message: string
  total: number
  teachers: PopularTeacher[]
}

export const createTuitionPost = async (data: TuitionCreateRequest): Promise<ApiResponse<{ message: string, postId: number }>> => {
  return await apiRequest<{ message: string, postId: number }>('/api/tuition/posts', 'POST', data)
}

export const getAllTuitionPosts = async (): Promise<ApiResponse<TuitionPost[]>> => {
  return await apiRequest<TuitionPost[]>('/api/tuition/posts', 'GET')
}

export const requestToConnect = async (postId: number): Promise<ApiResponse<{ message: string }>> => {
  return await apiRequest<{ message: string }>(`/api/tuition/posts/${postId}/connect`, 'POST')
}

export const getReceivedConnectRequests = async (): Promise<ApiResponse<TuitionConnectRequest[]>> => {
  return await apiRequest<TuitionConnectRequest[]>('/api/tuition/requests/received', 'GET')
}

export const getSentConnectRequests = async (): Promise<ApiResponse<TuitionConnectRequest[]>> => {
  return await apiRequest<TuitionConnectRequest[]>('/api/tuition/requests/sent', 'GET')
}

export const handleConnectRequest = async (requestId: number, status: 'approved' | 'rejected'): Promise<ApiResponse<{ message: string }>> => {
  return await apiRequest<{ message: string }>(`/api/tuition/requests/${requestId}`, 'PATCH', { status })
}

export const getPopularTeachers = async (): Promise<ApiResponse<PopularTeacher[]>> => {
  const result = await apiRequest<PopularTeachersResponse>('/api/tuition/teachers/popular', 'GET')

  if (!result.success) {
    return result as ApiResponse<PopularTeacher[]>
  }

  return {
    ...result,
    data: Array.isArray(result.data?.teachers) ? result.data.teachers : [],
  }
}
