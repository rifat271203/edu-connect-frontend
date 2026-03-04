import { apiRequest, type ApiResponse } from './client'

export interface MeetingInfo {
  roomId: string
  [key: string]: unknown
}

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : undefined

const toRoomId = (source: Record<string, unknown>): string => {
  const rawRoomId = source.roomId || source.room_id || source.id || source.meetingId || source.meeting_id
  return typeof rawRoomId === 'string' || typeof rawRoomId === 'number' ? String(rawRoomId) : ''
}

const normalizeMeetingInfo = (payload: unknown): MeetingInfo | null => {
  const root = asRecord(payload) || {}
  const source = asRecord(root.data) || root
  const roomId = toRoomId(source)

  if (!roomId) {
    return null
  }

  return {
    ...source,
    roomId,
  }
}

export const createMeeting = async (payload: Record<string, unknown> = {}): Promise<ApiResponse<MeetingInfo>> => {
  const result = await apiRequest<unknown>('/api/meetings/create', 'POST', payload)
  if (!result.success) return result as ApiResponse<MeetingInfo>

  const meeting = normalizeMeetingInfo(result.data)
  if (!meeting) {
    return {
      success: false,
      error: 'Meeting created but roomId is missing in response',
      status: result.status,
    }
  }

  return {
    ...result,
    data: meeting,
  }
}

export const getMeeting = async (roomId: string): Promise<ApiResponse<MeetingInfo>> => {
  const result = await apiRequest<unknown>(`/api/meetings/${encodeURIComponent(roomId)}`, 'GET')
  if (!result.success) return result as ApiResponse<MeetingInfo>

  const meeting = normalizeMeetingInfo(result.data)
  if (!meeting) {
    return {
      success: false,
      error: 'Meeting data is invalid',
      status: result.status,
    }
  }

  return {
    ...result,
    data: meeting,
  }
}

export const endMeeting = async (roomId: string): Promise<ApiResponse<MeetingInfo>> => {
  const result = await apiRequest<unknown>(`/api/meetings/${encodeURIComponent(roomId)}/end`, 'POST')
  if (!result.success) return result as ApiResponse<MeetingInfo>

  const meeting = normalizeMeetingInfo(result.data)
  if (!meeting) {
    return {
      success: false,
      error: 'Meeting ended but response is missing room info',
      status: result.status,
    }
  }

  return {
    ...result,
    data: meeting,
  }
}

