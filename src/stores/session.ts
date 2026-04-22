// src/stores/session.ts
import { defineStore } from 'pinia'
import type { ChatMessage, ClassroomRole, Participant, SessionStatus } from '~/types/classroom'

interface SessionState {
  roomId: string | null
  role: ClassroomRole | null
  token: string | null
  userId: string | null
  displayName: string | null
  participants: Participant[]
  chatMessages: ChatMessage[]
  isRecording: boolean
  sessionStatus: SessionStatus
  waitingRoom: Participant[]
  localStream: MediaStream | null
  isScreenSharing: boolean
  isMuted: boolean
  isCameraOff: boolean
}

interface SessionTokenResponse {
  token: string
}

interface CreateSessionResponse {
  roomId: string
  title: string
  status?: 'waiting' | 'live' | 'ended'
  participantCount?: number
  isRecording?: boolean
}

interface SessionDetailsResponse {
  roomId: string
  title?: string
  status?: 'waiting' | 'live' | 'ended'
  participantCount?: number
  isRecording?: boolean
  participants?: Participant[]
  waitingRoom?: Participant[]
}

const parseRoomId = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null
  const source = payload as Record<string, unknown>
  const value = source.roomId || source.room_id || source.id
  return typeof value === 'string' || typeof value === 'number' ? String(value) : null
}

const parseStatus = (status?: string): SessionStatus => {
  if (status === 'waiting') return 'lobby'
  if (status === 'live') return 'live'
  if (status === 'ended') return 'ended'
  return 'idle'
}

const getApiUrl = (): string => {
  const config = useRuntimeConfig()
  const runtimeApi = config.public.apiUrl
  const runtimeBackend = config.public.backendUrl

  if (typeof runtimeApi === 'string' && runtimeApi.trim()) {
    return runtimeApi.replace(/\/+$/, '')
  }

  if (typeof runtimeBackend === 'string' && runtimeBackend.trim()) {
    return runtimeBackend.replace(/\/+$/, '')
  }

  return ''
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    roomId: null,
    role: null,
    token: null,
    userId: null,
    displayName: null,
    participants: [],
    chatMessages: [],
    isRecording: false,
    sessionStatus: 'idle',
    waitingRoom: [],
    localStream: null,
    isScreenSharing: false,
    isMuted: false,
    isCameraOff: false,
  }),

  actions: {
    async fetchToken(userId: string, name: string, role: ClassroomRole) {
      const apiUrl = getApiUrl()

      const response = await $fetch<SessionTokenResponse>(`${apiUrl}/api/v1/auth/token`, {
        method: 'POST',
        body: { userId, name, role },
      })

      this.token = response.token
      this.role = role
      this.userId = userId
      this.displayName = name
      return response.token
    },

    async createSession(title: string) {
      const apiUrl = getApiUrl()

      const response = await $fetch<CreateSessionResponse>(`${apiUrl}/api/v1/sessions`, {
        method: 'POST',
        body: { title },
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
      })

      this.roomId = response.roomId
      this.sessionStatus = parseStatus(response.status)
      this.isRecording = Boolean(response.isRecording)
      return response
    },

    async joinSession(roomId: string) {
      const apiUrl = getApiUrl()

      const response = await $fetch<SessionDetailsResponse>(`${apiUrl}/api/v1/sessions/${encodeURIComponent(roomId)}`, {
        method: 'GET',
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
      })

      this.roomId = parseRoomId(response) || roomId
      this.sessionStatus = parseStatus(response.status)
      this.isRecording = Boolean(response.isRecording)
      this.participants = Array.isArray(response.participants) ? response.participants : []
      this.waitingRoom = Array.isArray(response.waitingRoom) ? response.waitingRoom : []

      return response
    },

    async endSession(roomId: string) {
      const apiUrl = getApiUrl()

      await $fetch(`${apiUrl}/api/v1/sessions/${encodeURIComponent(roomId)}/end`, {
        method: 'POST',
        headers: this.token ? { Authorization: `Bearer ${this.token}` } : undefined,
      })

      this.sessionStatus = 'ended'
      this.isRecording = false
    },

    addChatMessage(msg: ChatMessage) {
      this.chatMessages = [...this.chatMessages, msg]
    },

    setParticipants(list: Participant[]) {
      this.participants = [...list]
    },

    admitParticipant(socketId: string) {
      const signaling = useSignaling()
      if (!this.roomId) return

      signaling.emit('admit', {
        roomId: this.roomId,
        socketId,
      })

      this.waitingRoom = this.waitingRoom.filter((participant) => participant.socketId !== socketId)
    },

    setLocalStream(stream: MediaStream | null) {
      this.localStream = stream
    },

    setIsScreenSharing(value: boolean) {
      this.isScreenSharing = value
    },

    setIsMuted(value: boolean) {
      this.isMuted = value
    },

    setIsCameraOff(value: boolean) {
      this.isCameraOff = value
    },

    updateParticipant(socketId: string, updates: Partial<Participant>) {
      this.participants = this.participants.map((participant) => {
        if (participant.socketId !== socketId) return participant
        return { ...participant, ...updates }
      })
    },

    removeParticipant(socketId: string) {
      this.participants = this.participants.filter((participant) => participant.socketId !== socketId)
    },

    clearSession() {
      this.roomId = null
      this.role = null
      this.participants = []
      this.chatMessages = []
      this.isRecording = false
      this.sessionStatus = 'idle'
      this.waitingRoom = []
      this.localStream = null
      this.isScreenSharing = false
      this.isMuted = false
      this.isCameraOff = false
    },
  },
})
