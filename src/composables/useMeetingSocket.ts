import { io } from 'socket.io-client'

type ClientSocket = ReturnType<typeof io>

interface JoinRoomPayload {
  roomId: string
  token?: string | null
}

interface OfferPayload {
  roomId: string
  toSocketId: string
  offer: RTCSessionDescriptionInit
}

interface AnswerPayload {
  roomId: string
  toSocketId: string
  answer: RTCSessionDescriptionInit
}

interface IceCandidatePayload {
  roomId: string
  toSocketId: string
  candidate: RTCIceCandidateInit
}

interface LeaveRoomPayload {
  roomId: string
  token?: string | null
}

const normalizeUrl = (value: string): string => value.replace(/\/+$/, '')

const getAuthToken = (): string | null => {
  if (!process.client) return null
  return localStorage.getItem('educonnect_token')
}

const resolveSocketUrl = (): string => {
  const runtimeConfig = useRuntimeConfig()

  const configuredUrl =
    runtimeConfig.public.socketUrl ||
    runtimeConfig.public.backendUrl ||
    process.env.NUXT_PUBLIC_SOCKET_URL ||
    process.env.NUXT_PUBLIC_BACKEND_URL ||
    'https://sincere-spontaneity-production-ab4e.up.railway.app'

  return normalizeUrl(configuredUrl)
}

export const useMeetingSocket = () => {
  const socket = shallowRef<ClientSocket | null>(null)

  const connect = (): ClientSocket | null => {
    if (!process.client) {
      return null
    }

    if (socket.value?.connected) {
      return socket.value
    }

    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }

    const token = getAuthToken()

    socket.value = io(resolveSocketUrl(), {
      transports: ['websocket'],
      autoConnect: true,
      withCredentials: true,
      auth: {
        token,
      },
    })

    return socket.value
  }

  const disconnect = () => {
    if (!socket.value) return

    socket.value.removeAllListeners()
    socket.value.disconnect()
    socket.value = null
  }

  const joinRoom = (payload: JoinRoomPayload) => {
    socket.value?.emit('join-room', {
      roomId: payload.roomId,
      meetingId: payload.roomId,
      token: payload.token ?? getAuthToken(),
    })
  }

  const emitOffer = (payload: OfferPayload) => {
    const senderSocketId = socket.value?.id

    socket.value?.emit('offer', {
      roomId: payload.roomId,
      toSocketId: payload.toSocketId,
      targetSocketId: payload.toSocketId,
      to: payload.toSocketId,
      socketId: payload.toSocketId,
      fromSocketId: senderSocketId,
      senderSocketId,
      offer: payload.offer,
      sdp: payload.offer,
    })
  }

  const emitAnswer = (payload: AnswerPayload) => {
    const senderSocketId = socket.value?.id

    socket.value?.emit('answer', {
      roomId: payload.roomId,
      toSocketId: payload.toSocketId,
      targetSocketId: payload.toSocketId,
      to: payload.toSocketId,
      socketId: payload.toSocketId,
      fromSocketId: senderSocketId,
      senderSocketId,
      answer: payload.answer,
      sdp: payload.answer,
    })
  }

  const emitIceCandidate = (payload: IceCandidatePayload) => {
    const senderSocketId = socket.value?.id

    socket.value?.emit('ice-candidate', {
      roomId: payload.roomId,
      toSocketId: payload.toSocketId,
      targetSocketId: payload.toSocketId,
      to: payload.toSocketId,
      socketId: payload.toSocketId,
      fromSocketId: senderSocketId,
      senderSocketId,
      candidate: payload.candidate,
      iceCandidate: payload.candidate,
    })
  }

  const leaveRoom = (payload: LeaveRoomPayload) => {
    socket.value?.emit('leave-room', {
      roomId: payload.roomId,
      meetingId: payload.roomId,
      token: payload.token ?? getAuthToken(),
    })
  }

  const on = (event: string, handler: (...args: unknown[]) => void) => {
    socket.value?.on(event, handler)
  }

  const off = (event: string, handler?: (...args: unknown[]) => void) => {
    if (!socket.value) return

    if (handler) {
      socket.value.off(event, handler)
      return
    }

    socket.value.off(event)
  }

  return {
    socket,
    connect,
    disconnect,
    on,
    off,
    joinRoom,
    leaveRoom,
    emitOffer,
    emitAnswer,
    emitIceCandidate,
  }
}

