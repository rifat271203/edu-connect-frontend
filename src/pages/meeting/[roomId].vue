<template>
  <div class="min-h-screen bg-dark-950 px-4 py-6 text-dark-50 md:px-8">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-5">
      <header class="rounded-2xl border border-surface-glass-border bg-dark-900/70 p-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 class="text-2xl font-semibold">Meeting Room</h1>
            <p class="text-sm text-dark-300">
              Room: <span class="font-mono text-dark-100">{{ roomId }}</span>
            </p>
          </div>

          <div class="flex items-center gap-3 text-sm text-dark-200">
            <span class="rounded-lg bg-dark-800/80 px-3 py-1">
              Participants: {{ participantsCount }}
            </span>
            <span class="rounded-lg bg-dark-800/80 px-3 py-1">{{ connectionStatus }}</span>
          </div>
        </div>

        <p v-if="statusMessage" class="mt-3 text-sm text-dark-300">
          {{ statusMessage }}
        </p>
        <p v-if="errorMessage" class="mt-3 text-sm text-red-400">
          {{ errorMessage }}
        </p>
      </header>

      <div
        v-if="permissionDenied"
        class="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200"
      >
        <p class="font-medium">Camera or microphone permission was denied.</p>
        <p class="mt-1 text-red-200/90">
          Please allow access in your browser settings, then rejoin the meeting.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MeetingVideoTile
          :stream="localStream"
          :label="`You${isMuted ? ' (Muted)' : ''}${isCameraOff ? ' (Camera Off)' : ''}`"
          muted
        />

        <MeetingVideoTile
          v-for="remote in remoteParticipants"
          :key="remote.socketId"
          :stream="remote.stream"
          :label="remote.label"
        />
      </div>

      <MeetingControls
        :is-muted="isMuted"
        :is-camera-off="isCameraOff"
        :disabled="isLeaving"
        @toggle-mic="toggleMute"
        @toggle-camera="toggleCamera"
        @copy-link="copyMeetingLink"
        @leave="leaveCall"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMeetingSocket } from '~/composables/useMeetingSocket'
import { endMeeting } from '~/services/api/meeting'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'blank',
})

interface RemoteParticipant {
  socketId: string
  stream: MediaStream
  label: string
}

interface SignalingOfferPayload {
  fromSocketId?: string
  socketId?: string
  from?: string
  senderSocketId?: string
  sourceSocketId?: string
  userSocketId?: string
  offer?: RTCSessionDescriptionInit
  sdp?: RTCSessionDescriptionInit
  data?: Record<string, unknown>
}

interface SignalingAnswerPayload {
  fromSocketId?: string
  socketId?: string
  from?: string
  senderSocketId?: string
  sourceSocketId?: string
  userSocketId?: string
  answer?: RTCSessionDescriptionInit
  sdp?: RTCSessionDescriptionInit
  data?: Record<string, unknown>
}

interface SignalingIcePayload {
  fromSocketId?: string
  socketId?: string
  from?: string
  senderSocketId?: string
  sourceSocketId?: string
  userSocketId?: string
  candidate?: RTCIceCandidateInit
  iceCandidate?: RTCIceCandidateInit
  data?: Record<string, unknown>
}

const route = useRoute()
const userStore = useUserStore()
const { connect, disconnect, joinRoom, leaveRoom, emitOffer, emitAnswer, emitIceCandidate } = useMeetingSocket()

const roomId = computed(() => String(route.params.roomId || ''))
const connectionStatus = ref('Initializing...')
const statusMessage = ref('')
const errorMessage = ref('')
const permissionDenied = ref(false)
const isMuted = ref(false)
const isCameraOff = ref(false)
const isLeaving = ref(false)
const roomActive = ref(true)

const localStream = ref<MediaStream | null>(null)
const remoteStreamsBySocketId = ref<Record<string, MediaStream>>({})
const peerConnectionsBySocketId = new Map<string, RTCPeerConnection>()

const parseIceServers = (value: unknown): RTCIceServer[] => {
  if (typeof value !== 'string' || !value.trim()) {
    return [{ urls: 'stun:stun.l.google.com:19302' }]
  }

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) {
      return [{ urls: 'stun:stun.l.google.com:19302' }]
    }

    const normalized = parsed.filter((item): item is RTCIceServer => {
      if (!item || typeof item !== 'object') return false
      const record = item as Record<string, unknown>
      const urls = record.urls

      if (typeof urls === 'string') return true
      if (Array.isArray(urls) && urls.every((entry) => typeof entry === 'string')) return true

      return false
    })

    return normalized.length ? normalized : [{ urls: 'stun:stun.l.google.com:19302' }]
  } catch {
    return [{ urls: 'stun:stun.l.google.com:19302' }]
  }
}

const runtimeConfig = useRuntimeConfig()

const rtcConfig: RTCConfiguration = {
  iceServers: parseIceServers(runtimeConfig.public.iceServers),
}

const remoteParticipants = computed<RemoteParticipant[]>(() =>
  Object.entries(remoteStreamsBySocketId.value).map(([socketId, stream]) => ({
    socketId,
    stream,
    label: `Participant ${socketId.slice(0, 6)}`,
  }))
)

const participantsCount = computed(() => {
  const localParticipant = localStream.value ? 1 : 0
  return localParticipant + remoteParticipants.value.length
})

const asRecord = (payload: unknown): Record<string, unknown> =>
  payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {}

const normalizeSocketId = (payload: unknown): string => {
  if (typeof payload === 'string') return payload
  if (!payload || typeof payload !== 'object') return ''

  const source = payload as Record<string, unknown>
  const nested = asRecord(source.data)
  const direct =
    source.socketId ||
    source.fromSocketId ||
    source.from ||
    source.id ||
    source.userSocketId ||
    source.senderSocketId ||
    source.sourceSocketId ||
    nested.socketId ||
    nested.fromSocketId ||
    nested.from ||
    nested.id ||
    nested.userSocketId ||
    nested.senderSocketId ||
    nested.sourceSocketId

  if (typeof direct === 'string' || typeof direct === 'number') {
    return String(direct)
  }

  return ''
}

const normalizeSocketIdList = (payload: unknown): string[] => {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => normalizeSocketId(item) || (typeof item === 'string' ? item : ''))
      .filter(Boolean)
  }

  if (!payload || typeof payload !== 'object') return []

  const source = payload as Record<string, unknown>
  const nested = asRecord(source.data)
  const users =
    source.users ||
    source.participants ||
    source.roomUsers ||
    source.clients ||
    source.existingUsers ||
    source.peers ||
    source.socketIds ||
    source.participantSocketIds ||
    nested.users ||
    nested.participants ||
    nested.roomUsers ||
    nested.clients ||
    nested.existingUsers ||
    nested.peers ||
    nested.socketIds ||
    nested.participantSocketIds

  if (Array.isArray(users)) {
    return users
      .map((item) => normalizeSocketId(item) || (typeof item === 'string' ? item : ''))
      .filter(Boolean)
  }

  return []
}

const normalizeSessionDescription = (
  payload: unknown,
  kind: 'offer' | 'answer'
): RTCSessionDescriptionInit | null => {
  const source = asRecord(payload)
  const nested = asRecord(source.data)

  const direct = source[kind]
  if (direct && typeof direct === 'object') {
    return direct as RTCSessionDescriptionInit
  }

  const nestedDirect = nested[kind]
  if (nestedDirect && typeof nestedDirect === 'object') {
    return nestedDirect as RTCSessionDescriptionInit
  }

  const sdpPayload = source.sdp
  if (sdpPayload && typeof sdpPayload === 'object') {
    return sdpPayload as RTCSessionDescriptionInit
  }

  const nestedSdpPayload = nested.sdp
  if (nestedSdpPayload && typeof nestedSdpPayload === 'object') {
    return nestedSdpPayload as RTCSessionDescriptionInit
  }

  return null
}

const normalizeIceCandidatePayload = (payload: unknown): RTCIceCandidateInit | null => {
  const source = asRecord(payload)
  const nested = asRecord(source.data)

  if (source.candidate && typeof source.candidate === 'object') {
    return source.candidate as RTCIceCandidateInit
  }

  if (nested.candidate && typeof nested.candidate === 'object') {
    return nested.candidate as RTCIceCandidateInit
  }

  if (source.iceCandidate && typeof source.iceCandidate === 'object') {
    return source.iceCandidate as RTCIceCandidateInit
  }

  if (nested.iceCandidate && typeof nested.iceCandidate === 'object') {
    return nested.iceCandidate as RTCIceCandidateInit
  }

  return null
}

const removeRemoteStream = (socketId: string) => {
  const next = { ...remoteStreamsBySocketId.value }
  delete next[socketId]
  remoteStreamsBySocketId.value = next
}

const setRemoteStream = (socketId: string, stream: MediaStream) => {
  remoteStreamsBySocketId.value = {
    ...remoteStreamsBySocketId.value,
    [socketId]: stream,
  }
}

const closePeerConnection = (socketId: string) => {
  const pc = peerConnectionsBySocketId.get(socketId)
  if (!pc) return

  pc.ontrack = null
  pc.onicecandidate = null
  pc.onconnectionstatechange = null
  pc.close()

  peerConnectionsBySocketId.delete(socketId)
  removeRemoteStream(socketId)
}

const stopLocalMedia = () => {
  localStream.value?.getTracks().forEach((track) => track.stop())
  localStream.value = null
}

const attachLocalTracks = (pc: RTCPeerConnection) => {
  const stream = localStream.value
  if (!stream) return

  stream.getTracks().forEach((track) => {
    const alreadyAdded = pc.getSenders().some((sender) => sender.track?.id === track.id)
    if (!alreadyAdded) {
      pc.addTrack(track, stream)
    }
  })
}

const renegotiatePeer = async (socketId: string, pc: RTCPeerConnection) => {
  if (pc.signalingState !== 'stable') return

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  emitOffer({
    roomId: roomId.value,
    toSocketId: socketId,
    offer,
  })
}

const attachTracksToAllPeers = async () => {
  const entries = Array.from(peerConnectionsBySocketId.entries())

  for (const [socketId, pc] of entries) {
    attachLocalTracks(pc)
    await renegotiatePeer(socketId, pc)
  }
}

const createPeerConnection = (socketId: string): RTCPeerConnection | null => {
  if (!socketId) return null

  const existing = peerConnectionsBySocketId.get(socketId)
  if (existing) {
    return existing
  }

  const pc = new RTCPeerConnection(rtcConfig)
  peerConnectionsBySocketId.set(socketId, pc)

  attachLocalTracks(pc)

  pc.onicecandidate = (event) => {
    if (!event.candidate) return
    emitIceCandidate({
      roomId: roomId.value,
      toSocketId: socketId,
      candidate: event.candidate.toJSON(),
    })
  }

  pc.ontrack = (event) => {
    const firstStream = event.streams[0]
    if (firstStream) {
      setRemoteStream(socketId, firstStream)
      return
    }

    const fallbackStream = remoteStreamsBySocketId.value[socketId] || new MediaStream()
    fallbackStream.addTrack(event.track)
    setRemoteStream(socketId, fallbackStream)
  }

  pc.onconnectionstatechange = () => {
    if (['failed', 'disconnected', 'closed'].includes(pc.connectionState)) {
      closePeerConnection(socketId)
    }
  }

  return pc
}

const createAndSendOffer = async (socketId: string) => {
  const pc = createPeerConnection(socketId)
  if (!pc) return

  if (pc.signalingState !== 'stable') {
    return
  }

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  emitOffer({
    roomId: roomId.value,
    toSocketId: socketId,
    offer,
  })
}

const handleRoomUsers = async (payload: unknown, selfSocketId?: string) => {
  roomActive.value = true
  const users = normalizeSocketIdList(payload)

  for (const socketId of users) {
    if (!socketId || socketId === selfSocketId) continue
    await createAndSendOffer(socketId)
  }
}

const handleUserJoined = async (payload: unknown, selfSocketId?: string) => {
  const socketId = normalizeSocketId(payload)

  if (!socketId || socketId === selfSocketId) return
  await createAndSendOffer(socketId)
}

const handleOffer = async (payload: unknown) => {
  const source = (payload || {}) as SignalingOfferPayload
  const fromSocketId =
    source.fromSocketId || source.from || source.socketId || source.senderSocketId || source.sourceSocketId || source.userSocketId || ''
  const offer = normalizeSessionDescription(payload, 'offer')
  if (!fromSocketId || !offer) return

  const pc = createPeerConnection(fromSocketId)
  if (!pc) return

  if (pc.signalingState !== 'stable') {
    await pc.setLocalDescription({ type: 'rollback' })
  }

  await pc.setRemoteDescription(new RTCSessionDescription(offer))
  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)

  emitAnswer({
    roomId: roomId.value,
    toSocketId: fromSocketId,
    answer,
  })
}

const handleAnswer = async (payload: unknown) => {
  const source = (payload || {}) as SignalingAnswerPayload
  const fromSocketId =
    source.fromSocketId || source.from || source.socketId || source.senderSocketId || source.sourceSocketId || source.userSocketId || ''
  const answer = normalizeSessionDescription(payload, 'answer')

  if (!fromSocketId || !answer) return

  const pc = peerConnectionsBySocketId.get(fromSocketId)
  if (!pc) return

  await pc.setRemoteDescription(new RTCSessionDescription(answer))
}

const handleIceCandidate = async (payload: unknown) => {
  const source = (payload || {}) as SignalingIcePayload
  const fromSocketId =
    source.fromSocketId || source.from || source.socketId || source.senderSocketId || source.sourceSocketId || source.userSocketId || ''
  const candidate = normalizeIceCandidatePayload(payload)
  if (!fromSocketId || !candidate) return

  const pc = createPeerConnection(fromSocketId)
  if (!pc) return

  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate))
  } catch (error) {
    console.warn('Failed to add ICE candidate:', error)
  }
}

const handleUserLeft = (payload: unknown) => {
  const socketId = normalizeSocketId(payload)
  if (!socketId) return
  closePeerConnection(socketId)
}

const handleRoomEnded = () => {
  roomActive.value = false
  statusMessage.value = 'Meeting has ended by host.'
  connectionStatus.value = 'Meeting ended'

  Array.from(peerConnectionsBySocketId.keys()).forEach((socketId) => {
    closePeerConnection(socketId)
  })
}

const cleanupMeeting = () => {
  Array.from(peerConnectionsBySocketId.keys()).forEach((socketId) => {
    closePeerConnection(socketId)
  })

  remoteStreamsBySocketId.value = {}
  stopLocalMedia()
  disconnect()
}

const registerSocketListeners = () => {
  const socket = connect()
  if (!socket) return

  socket.on('connect', () => {
    connectionStatus.value = 'Connected'
    statusMessage.value = 'Connected to signaling server. Joining room...'

    const token = process.client ? localStorage.getItem('educonnect_token') : null
    joinRoom({
      roomId: roomId.value,
      token,
    })
  })

  socket.on('connect_error', (error: Error) => {
    connectionStatus.value = 'Connection failed'
    errorMessage.value = error.message || 'Failed to connect to meeting server'
  })

  socket.on('room-users', (payload: unknown) => {
    statusMessage.value = 'Joined room. Connecting participants...'
    handleRoomUsers(payload, socket.id).catch((error) => {
      console.error('Failed to process room users:', error)
    })
  })

  socket.on('user-joined', (payload: unknown) => {
    handleUserJoined(payload, socket.id).catch((error) => {
      console.error('Failed to handle user joined:', error)
    })
  })

  socket.on('participant-joined', (payload: unknown) => {
    handleUserJoined(payload, socket.id).catch((error) => {
      console.error('Failed to handle participant joined:', error)
    })
  })

  socket.on('new-user', (payload: unknown) => {
    handleUserJoined(payload, socket.id).catch((error) => {
      console.error('Failed to handle new user:', error)
    })
  })

  socket.on('offer', (payload: unknown) => {
    handleOffer(payload).catch((error) => {
      console.error('Failed to handle offer:', error)
    })
  })

  socket.on('answer', (payload: unknown) => {
    handleAnswer(payload).catch((error) => {
      console.error('Failed to handle answer:', error)
    })
  })

  socket.on('ice-candidate', (payload: unknown) => {
    handleIceCandidate(payload).catch((error) => {
      console.error('Failed to handle ICE candidate:', error)
    })
  })

  socket.on('user-left', (payload: unknown) => {
    handleUserLeft(payload)
  })

  socket.on('meeting-ended', () => {
    handleRoomEnded()
  })

  socket.on('room-ended', () => {
    handleRoomEnded()
  })

  socket.on('socket-error', (payload: unknown) => {
    const source = asRecord(payload)
    const nested = asRecord(source.data)
    const message =
      (typeof source.message === 'string' && source.message) ||
      (typeof source.error === 'string' && source.error) ||
      (typeof nested.message === 'string' && nested.message) ||
      (typeof nested.error === 'string' && nested.error) ||
      'Meeting signaling error'
    errorMessage.value = message
  })
}

const initLocalMedia = async () => {
  localStream.value = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })

  isMuted.value = false
  isCameraOff.value = false

  await attachTracksToAllPeers()
}

const initMeeting = async () => {
  if (!process.client) return

  if (!roomId.value) {
    errorMessage.value = 'Invalid room ID'
    return
  }

  connectionStatus.value = 'Connecting...'
  statusMessage.value = ''
  errorMessage.value = ''

  registerSocketListeners()

  connectionStatus.value = 'Requesting media access...'

  try {
    await initLocalMedia()
  } catch (error) {
    permissionDenied.value = true
    connectionStatus.value = 'Connected (no media)'
    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'Camera/microphone access was denied. You are in the room, but audio/video is disabled.'
    statusMessage.value = 'You joined the room without camera/mic access.'
    return
  }

  permissionDenied.value = false
  connectionStatus.value = 'Connected'
  statusMessage.value = `Signed in as ${userStore.user?.name || 'User'}`
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

const copyMeetingLink = async () => {
  if (!process.client) return

  const meetingUrl = `${window.location.origin}/meeting/${encodeURIComponent(roomId.value)}`

  try {
    await navigator.clipboard.writeText(meetingUrl)
    statusMessage.value = 'Meeting link copied to clipboard'
  } catch (error) {
    console.error('Failed to copy meeting link:', error)
    statusMessage.value = meetingUrl
  }
}

const leaveCall = async () => {
  if (isLeaving.value) return

  isLeaving.value = true

  const token = process.client ? localStorage.getItem('educonnect_token') : null
  leaveRoom({
    roomId: roomId.value,
    token,
  })

  if (roomId.value) {
    await endMeeting(roomId.value).catch(() => {
      // Best-effort API call before leaving.
    })
  }

  cleanupMeeting()
  connectionStatus.value = 'Disconnected'
  await navigateTo('/classroom')
}

onMounted(() => {
  initMeeting().catch((error) => {
    connectionStatus.value = 'Failed'
    errorMessage.value = error instanceof Error ? error.message : 'Unable to initialize meeting'
  })
})

onBeforeUnmount(() => {
  cleanupMeeting()
})
</script>

