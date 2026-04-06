// src/composables/useWebRTC.ts
import type { ClassroomRole } from '~/types/classroom'

interface StartSessionContext {
  roomId: string
  selfSocketId: string
  peerSocketIds?: string[]
}

interface UseWebRTCReturn {
  localStream: Ref<MediaStream | null>
  remoteStreams: Ref<Map<string, MediaStream>>
  isMuted: Ref<boolean>
  isCameraOff: Ref<boolean>
  isScreenSharing: Ref<boolean>
  startSession: (role: ClassroomRole, context: StartSessionContext) => Promise<void>
  createPeerConnection: (socketId: string) => RTCPeerConnection
  initiateOffer: (socketId: string) => Promise<void>
  handleOffer: (fromSocketId: string, offer: RTCSessionDescriptionInit) => Promise<void>
  handleAnswer: (fromSocketId: string, answer: RTCSessionDescriptionInit) => Promise<void>
  handleIceCandidate: (fromSocketId: string, candidate: RTCIceCandidateInit) => Promise<void>
  removePeer: (socketId: string) => void
  replaceTrack: (newTrack: MediaStreamTrack) => Promise<void>
  toggleMute: () => void
  toggleCamera: () => void
  startScreenShare: () => Promise<void>
  endSession: () => void
}

// Use shallowRef for MediaStream to avoid Vue reactivity breaking native browser objects
const localStream = shallowRef<MediaStream | null>(null)
const remoteStreams = shallowRef<Map<string, MediaStream>>(new Map())
const peerConnections = new Map<string, RTCPeerConnection>()
const pendingCandidates = new Map<string, RTCIceCandidateInit[]>()

const isMuted = ref(false)
const isCameraOff = ref(false)
const isScreenSharing = ref(false)

let cameraTrackBackup: MediaStreamTrack | null = null
let screenTrack: MediaStreamTrack | null = null
let currentRoomId = ''
let localSocketId = ''

const resolveToastInstance = (): unknown => {
  const nuxtApp = useNuxtApp()
  const record = nuxtApp as unknown as Record<string, unknown>

  if (typeof record.$toast !== 'undefined') {
    return record.$toast
  }

  return null
}

const useClassroomToast = () => {
  const fallback = (message: string) => {
    // eslint-disable-next-line no-console
    console.error(message)
  }

  const toastRecord = resolveToastInstance() as {
    add?: (payload: { title?: string; description?: string; color?: string }) => void
    error?: (message: string) => void
    success?: (message: string) => void
  } | null

  if (toastRecord?.add) {
    return {
      error: (message: string) => {
        toastRecord.add?.({
          title: 'Classroom',
          description: message,
          color: 'red',
        })
      },
    }
  }

  if (toastRecord?.error) {
    return {
      error: (message: string) => {
        toastRecord.error?.(message)
      },
    }
  }

  return { error: fallback }
}

const readIceConfig = (): RTCIceServer[] => {
  const config = useRuntimeConfig()
  const iceServers: RTCIceServer[] = []

  if (typeof config.public.stunUrl === 'string' && config.public.stunUrl.trim()) {
    iceServers.push({ urls: config.public.stunUrl })
  }

  if (typeof config.public.turnUrl === 'string' && config.public.turnUrl.trim()) {
    iceServers.push({
      urls: config.public.turnUrl,
      username: typeof config.public.turnUser === 'string' ? config.public.turnUser : undefined,
      credential: typeof config.public.turnPass === 'string' ? config.public.turnPass : undefined,
    })
  }

  if (!iceServers.length) {
    iceServers.push({ urls: 'stun:stun.l.google.com:19302' })
  }

  return iceServers
}

const syncTrackFlags = () => {
  const stream = localStream.value
  if (!stream) {
    isMuted.value = true
    isCameraOff.value = true
    return
  }

  const audioTracks = stream.getAudioTracks()
  const videoTracks = stream.getVideoTracks()

  isMuted.value = !audioTracks.some((track) => track.enabled)
  isCameraOff.value = !videoTracks.some((track) => track.enabled)
}

const attachLocalTracks = (pc: RTCPeerConnection) => {
  const stream = localStream.value
  if (!stream) return

  stream.getTracks().forEach((track) => {
    const hasSender = pc.getSenders().some((sender) => sender.track?.id === track.id)
    if (!hasSender) {
      pc.addTrack(track, stream)
    }
  })
}

const getReadableMediaError = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'Unable to access media devices due to an unknown error.'
  }

  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    return 'Camera or microphone permission was denied.'
  }

  if (error.name === 'NotFoundError') {
    return 'No camera or microphone device was found.'
  }

  if (error.name === 'NotReadableError') {
    return 'Camera or microphone is being used by another application.'
  }

  return error.message || 'Failed to access media devices.'
}

const createAndSendOffer = async (socketId: string) => {
  const signaling = useSignaling()
  const pc = peerConnections.get(socketId)
  if (!pc) return

  if (pc.signalingState !== 'stable') {
    return
  }

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  signaling.emit('offer', {
    roomId: currentRoomId,
    toSocketId: socketId,
    fromSocketId: localSocketId,
    offer,
  })
}

const ensurePeer = (socketId: string): RTCPeerConnection => {
  const existing = peerConnections.get(socketId)
  if (existing) return existing

  const signaling = useSignaling()
  const iceServers = readIceConfig()
  const pc = new RTCPeerConnection({ iceServers })
  peerConnections.set(socketId, pc)

  attachLocalTracks(pc)

  pc.onicecandidate = (event) => {
    if (!event.candidate) return

    signaling.emit('ice-candidate', {
      roomId: currentRoomId,
      toSocketId: socketId,
      fromSocketId: localSocketId,
      candidate: event.candidate.toJSON(),
    })
  }

  pc.ontrack = (event) => {
    const stream = event.streams[0] || new MediaStream([event.track])
    const currentStreams = new Map(remoteStreams.value)
    currentStreams.set(socketId, stream)
    remoteStreams.value = currentStreams
  }

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'closed' || pc.connectionState === 'failed') {
      const stream = remoteStreams.value.get(socketId)
      stream?.getTracks().forEach((track) => track.stop())
      const currentStreams = new Map(remoteStreams.value)
      currentStreams.delete(socketId)
      remoteStreams.value = currentStreams
      peerConnections.delete(socketId)
      pendingCandidates.delete(socketId)
    }
  }

  return pc
}

const flushPendingCandidates = async (socketId: string, pc: RTCPeerConnection) => {
  const list = pendingCandidates.get(socketId)
  if (!list?.length) return

  pendingCandidates.delete(socketId)

  for (const candidate of list) {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
    } catch {
      // Ignore broken candidates from stale peer state.
    }
  }
}

const restoreCameraAfterShareEnded = () => {
  if (!cameraTrackBackup) return

  replaceTrack(cameraTrackBackup).catch(() => {
    // If replacement fails, the session can still continue with previous track state.
  })

  screenTrack = null
  isScreenSharing.value = false
}

const cleanupAll = () => {
  peerConnections.forEach((pc) => {
    pc.onicecandidate = null
    pc.ontrack = null
    pc.onconnectionstatechange = null
    pc.close()
  })

  peerConnections.clear()
  pendingCandidates.clear()

  remoteStreams.value.forEach((stream) => {
    stream.getTracks().forEach((track) => track.stop())
  })
  remoteStreams.value = new Map()

  localStream.value?.getTracks().forEach((track) => track.stop())
  localStream.value = null

  if (screenTrack) {
    screenTrack.onended = null
    screenTrack.stop()
  }

  cameraTrackBackup = null
  screenTrack = null
  isScreenSharing.value = false
  currentRoomId = ''
  localSocketId = ''
  syncTrackFlags()
}

const startSession = async (role: ClassroomRole, context: StartSessionContext) => {
  const toast = useClassroomToast()
  const signaling = useSignaling()

  currentRoomId = context.roomId
  localSocketId = context.selfSocketId

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })

    localStream.value = stream
    cameraTrackBackup = stream.getVideoTracks()[0] || null
    syncTrackFlags()
  } catch (error) {
    toast.error(getReadableMediaError(error))
    return
  }

  if (role === 'teacher') {
    const peers = context.peerSocketIds || []
    for (const socketId of peers) {
      if (!socketId || socketId === localSocketId) continue
      ensurePeer(socketId)
      await createAndSendOffer(socketId)
    }
  }

  signaling.emit('join-room', {
    roomId: context.roomId,
    role,
    userId: useUserStore().user?.id ? String(useUserStore().user?.id) : 'anonymous',
    name: useUserStore().user?.name || 'User',
  })
}

const handleOffer = async (fromSocketId: string, offer: RTCSessionDescriptionInit) => {
  const signaling = useSignaling()
  const pc = ensurePeer(fromSocketId)

  if (pc.signalingState !== 'stable') {
    if (pc.signalingState === 'have-local-offer') {
      await pc.setLocalDescription({ type: 'rollback' })
    }
  }

  await pc.setRemoteDescription(new RTCSessionDescription(offer))
  await flushPendingCandidates(fromSocketId, pc)

  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)

  signaling.emit('answer', {
    roomId: currentRoomId,
    toSocketId: fromSocketId,
    fromSocketId: localSocketId,
    answer,
  })
}

const handleAnswer = async (fromSocketId: string, answer: RTCSessionDescriptionInit) => {
  const pc = peerConnections.get(fromSocketId)
  if (!pc) return

  await pc.setRemoteDescription(new RTCSessionDescription(answer))
  await flushPendingCandidates(fromSocketId, pc)
}

const handleIceCandidate = async (fromSocketId: string, candidate: RTCIceCandidateInit) => {
  const pc = ensurePeer(fromSocketId)

  if (!pc.remoteDescription) {
    const existing = pendingCandidates.get(fromSocketId) || []
    pendingCandidates.set(fromSocketId, [...existing, candidate])
    return
  }

  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate))
  } catch {
    // Ignore malformed candidates sent by disconnected peers.
  }
}

const removePeer = (socketId: string) => {
  const pc = peerConnections.get(socketId)
  if (pc) {
    pc.close()
  }

  peerConnections.delete(socketId)
  pendingCandidates.delete(socketId)

  const stream = remoteStreams.value.get(socketId)
  stream?.getTracks().forEach((track) => track.stop())
  const currentStreams = new Map(remoteStreams.value)
  currentStreams.delete(socketId)
  remoteStreams.value = currentStreams
}

const replaceTrack = async (newTrack: MediaStreamTrack) => {
  const stream = localStream.value
  if (!stream) return

  const oldVideoTrack = stream.getVideoTracks()[0]

  peerConnections.forEach((pc) => {
    const videoSender = pc.getSenders().find((sender) => sender.track?.kind === 'video')
    if (videoSender) {
      void videoSender.replaceTrack(newTrack)
    }
  })

  if (oldVideoTrack) {
    stream.removeTrack(oldVideoTrack)
    oldVideoTrack.stop()
  }

  stream.addTrack(newTrack)
  localStream.value = stream
  syncTrackFlags()
}

const toggleMute = () => {
  const stream = localStream.value
  if (!stream) return

  const nextMuted = !isMuted.value
  stream.getAudioTracks().forEach((track) => {
    track.enabled = !nextMuted
  })

  isMuted.value = nextMuted
}

const toggleCamera = () => {
  const stream = localStream.value
  if (!stream) return

  const nextCameraOff = !isCameraOff.value
  stream.getVideoTracks().forEach((track) => {
    track.enabled = !nextCameraOff
  })

  isCameraOff.value = nextCameraOff
}

const startScreenShare = async () => {
  const toast = useClassroomToast()

  try {
    const displayStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    })

    const nextScreenTrack = displayStream.getVideoTracks()[0]
    if (!nextScreenTrack) {
      toast.error('Screen sharing failed to start.')
      return
    }

    if (!cameraTrackBackup && localStream.value) {
      cameraTrackBackup = localStream.value.getVideoTracks()[0] || null
    }

    screenTrack = nextScreenTrack
    isScreenSharing.value = true

    nextScreenTrack.onended = () => {
      restoreCameraAfterShareEnded()
    }

    await replaceTrack(nextScreenTrack)
  } catch (error) {
    toast.error(getReadableMediaError(error))
  }
}

const endSession = () => {
  cleanupAll()
}

const initiateOffer = async (socketId: string) => {
  if (!socketId || socketId === localSocketId) return
  ensurePeer(socketId)
  await createAndSendOffer(socketId)
}

export const useWebRTC = (): UseWebRTCReturn => {
  onUnmounted(() => {
    cleanupAll()
  })

  return {
    localStream,
    remoteStreams,
    isMuted,
    isCameraOff,
    isScreenSharing,
    startSession,
    createPeerConnection: ensurePeer,
    initiateOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    removePeer,
    replaceTrack,
    toggleMute,
    toggleCamera,
    startScreenShare,
    endSession,
  }
}
