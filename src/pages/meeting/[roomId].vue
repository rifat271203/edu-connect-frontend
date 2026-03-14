<template>
  <div class="relative min-h-screen overflow-hidden bg-dark-950 text-dark-50">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      <div class="absolute -right-16 top-24 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />
      <div class="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-secondary-500/10 blur-3xl" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
    </div>

    <div class="relative z-10 px-4 py-6 md:px-8 md:py-8">
      <div class="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header class="rounded-3xl border border-surface-glass-border bg-dark-900/75 p-5 shadow-card backdrop-blur-xl md:p-6">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p class="text-xs font-medium uppercase tracking-[0.22em] text-dark-300">EduConnect Live Session</p>
              <h1 class="mt-1 text-2xl font-semibold md:text-3xl">Meeting Room</h1>
              <p class="mt-2 text-sm text-dark-300">
                Room ID:
                <span class="rounded-lg bg-dark-800/70 px-2 py-1 font-mono text-dark-100">{{ roomId }}</span>
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-sm">
              <span class="rounded-xl border border-surface-glass-border bg-dark-800/80 px-3 py-1.5 text-dark-100">
                {{ participantsCount }} Participant{{ participantsCount === 1 ? '' : 's' }}
              </span>
              <span :class="connectionBadgeClass" class="rounded-xl px-3 py-1.5 font-medium">
                {{ connectionStatus }}
              </span>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 xl:grid-cols-3">
            <div class="rounded-2xl border border-surface-glass-border bg-dark-800/60 p-3">
              <p class="text-2xs uppercase tracking-[0.18em] text-dark-400">Media</p>
              <p class="mt-1 font-medium text-dark-100">{{ mediaStatusLabel }}</p>
            </div>
            <div class="rounded-2xl border border-surface-glass-border bg-dark-800/60 p-3">
              <p class="text-2xs uppercase tracking-[0.18em] text-dark-400">Room State</p>
              <p class="mt-1 font-medium text-dark-100">{{ roomStateLabel }}</p>
            </div>
            <div class="rounded-2xl border border-surface-glass-border bg-dark-800/60 p-3 sm:col-span-2 xl:col-span-1">
              <p class="text-2xs uppercase tracking-[0.18em] text-dark-400">Tips</p>
              <p class="mt-1 text-dark-200">Use headphones for best audio quality and avoid echo.</p>
            </div>
          </div>

          <p v-if="statusMessage" class="mt-4 text-sm text-dark-300">
            {{ statusMessage }}
          </p>
          <p v-if="errorMessage" class="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {{ errorMessage }}
          </p>
          <p
            v-if="remoteMediaDiagnostic"
            class="mt-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200"
          >
            {{ remoteMediaDiagnostic }}
          </p>
        </header>

        <div
          v-if="permissionDenied"
          class="rounded-3xl border border-red-500/25 bg-red-500/10 p-5 text-sm text-red-200 backdrop-blur"
        >
          <p class="font-medium">Camera or microphone permission was denied.</p>
          <p class="mt-1 text-red-200/90">
            Please allow access in your browser settings, then rejoin the meeting.
          </p>
        </div>

        <section class="rounded-3xl border border-surface-glass-border bg-dark-900/70 p-4 shadow-card backdrop-blur-xl md:p-5">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-lg font-semibold">Participants</h2>
            <p class="text-sm text-dark-300">
              {{ remoteParticipants.length ? 'Live media streams are active.' : 'Share the room link and wait for others to join.' }}
            </p>
          </div>

          <div v-if="!permissionDenied" class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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

            <div
              v-if="remoteParticipants.length === 0"
              class="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-surface-glass-border bg-dark-800/35 px-5 text-center"
            >
              <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent-light">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.8"
                    d="M17 20h5V4H2v16h5m10 0v-5a3 3 0 00-3-3H10a3 3 0 00-3 3v5m10 0H7"
                  />
                </svg>
              </div>
              <p class="font-medium text-dark-100">Waiting for participants</p>
              <p class="mt-1 text-sm text-dark-300">Invite classmates using the copy link button below.</p>
            </div>
          </div>
        </section>

        <div class="sticky bottom-4 z-20">
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
const pendingIceCandidatesBySocketId = new Map<string, RTCIceCandidateInit[]>()
const makingOfferBySocketId = new Map<string, boolean>()
const socketListenersRegistered = ref(false)
const localSocketId = ref('')
const lastRemoteTrackAt = ref<number | null>(null)
const peerDiagnosticsBySocketId = ref<
  Record<
    string,
    {
      connectionState: RTCPeerConnectionState
      iceConnectionState: RTCIceConnectionState
      signalingState: RTCSignalingState
    }
  >
>({})

const defaultIceServers: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]

const logRtc = (event: string, details?: Record<string, unknown>) => {
  console.info('[MeetingRTC]', event, details || {})
}

const parseIceServers = (value: unknown): RTCIceServer[] => {
  if (typeof value !== 'string' || !value.trim()) {
    return defaultIceServers
  }

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) {
      return defaultIceServers
    }

    const normalized = parsed.filter((item): item is RTCIceServer => {
      if (!item || typeof item !== 'object') return false
      const record = item as Record<string, unknown>
      const urls = record.urls

      if (typeof urls === 'string') return true
      if (Array.isArray(urls) && urls.every((entry) => typeof entry === 'string')) return true

      return false
    })

    return normalized.length ? normalized : defaultIceServers
  } catch {
    return defaultIceServers
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

const connectionBadgeClass = computed(() => {
  const status = connectionStatus.value.toLowerCase()

  if (status.includes('failed') || status.includes('error')) {
    return 'border border-red-500/30 bg-red-500/15 text-red-300'
  }

  if (status.includes('connecting') || status.includes('requesting') || status.includes('initializing')) {
    return 'border border-secondary-500/30 bg-secondary-500/15 text-secondary-300'
  }

  if (status.includes('ended') || status.includes('disconnected')) {
    return 'border border-dark-600 bg-dark-800/90 text-dark-300'
  }

  return 'border border-accent/30 bg-accent/15 text-accent-light'
})

const mediaStatusLabel = computed(() => {
  if (permissionDenied.value) return 'No camera/microphone permission'
  if (!localStream.value) return 'Preparing local stream'
  if (isMuted.value && isCameraOff.value) return 'Mic muted · Camera off'
  if (isMuted.value) return 'Mic muted · Camera on'
  if (isCameraOff.value) return 'Mic on · Camera off'
  return 'Mic on · Camera on'
})

const roomStateLabel = computed(() => (roomActive.value ? 'Session in progress' : 'Session ended'))

const remoteMediaDiagnostic = computed(() => {
  if (permissionDenied.value || remoteParticipants.value.length > 0) return ''

  const peerEntries = Object.entries(peerDiagnosticsBySocketId.value)
  if (!peerEntries.length) return ''

  const maybeConnected = peerEntries.some(([, state]) => {
    return (
      ['connected', 'connecting'].includes(state.connectionState) ||
      ['connected', 'checking', 'completed'].includes(state.iceConnectionState)
    )
  })

  if (!maybeConnected) return ''

  const states = peerEntries
    .map(([socketId, state]) => {
      return `${socketId.slice(0, 6)}: pc=${state.connectionState}, ice=${state.iceConnectionState}, sig=${state.signalingState}`
    })
    .join(' · ')

  const onTrackTime = lastRemoteTrackAt.value ? new Date(lastRemoteTrackAt.value).toLocaleTimeString() : 'never'
  return `No remote media received yet. Last ontrack: ${onTrackTime}. Peer diagnostics: ${states}`
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

const normalizeSenderSocketId = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object') return ''

  const source = payload as Record<string, unknown>
  const nested = asRecord(source.data)
  const sender =
    source.fromSocketId ||
    source.from ||
    source.senderSocketId ||
    source.sourceSocketId ||
    source.userSocketId ||
    nested.fromSocketId ||
    nested.from ||
    nested.senderSocketId ||
    nested.sourceSocketId ||
    nested.userSocketId

  if (typeof sender === 'string' || typeof sender === 'number') {
    return String(sender)
  }

  return normalizeSocketId(payload)
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

const setPeerDiagnostic = (socketId: string, pc: RTCPeerConnection) => {
  peerDiagnosticsBySocketId.value = {
    ...peerDiagnosticsBySocketId.value,
    [socketId]: {
      connectionState: pc.connectionState,
      iceConnectionState: pc.iceConnectionState,
      signalingState: pc.signalingState,
    },
  }
}

const clearPeerDiagnostic = (socketId: string) => {
  if (!peerDiagnosticsBySocketId.value[socketId]) return
  const next = { ...peerDiagnosticsBySocketId.value }
  delete next[socketId]
  peerDiagnosticsBySocketId.value = next
}

const closePeerConnection = (socketId: string) => {
  const pc = peerConnectionsBySocketId.get(socketId)
  if (!pc) return

  pc.ontrack = null
  pc.onicecandidate = null
  pc.onconnectionstatechange = null
  pc.oniceconnectionstatechange = null
  pc.onsignalingstatechange = null
  pc.close()

  peerConnectionsBySocketId.delete(socketId)
  pendingIceCandidatesBySocketId.delete(socketId)
  makingOfferBySocketId.delete(socketId)
  clearPeerDiagnostic(socketId)
  removeRemoteStream(socketId)
}

const stopLocalMedia = () => {
  localStream.value?.getTracks().forEach((track) => track.stop())
  localStream.value = null
}

const syncLocalTrackState = () => {
  const stream = localStream.value
  if (!stream) {
    isMuted.value = true
    isCameraOff.value = true
    return
  }

  const audioTracks = stream.getAudioTracks()
  const videoTracks = stream.getVideoTracks()

  isMuted.value = audioTracks.length === 0 || audioTracks.every((track) => !track.enabled)
  isCameraOff.value = videoTracks.length === 0 || videoTracks.every((track) => !track.enabled)
}

const attachLocalTracks = (pc: RTCPeerConnection) => {
  const stream = localStream.value
  if (!stream) return

  const localTracks = stream.getTracks()
  logRtc('local tracks available for publishing', {
    tracks: localTracks.map((track) => ({ id: track.id, kind: track.kind, enabled: track.enabled, readyState: track.readyState })),
  })

  stream.getTracks().forEach((track) => {
    const alreadyAdded = pc.getSenders().some((sender) => sender.track?.id === track.id)
    if (!alreadyAdded) {
      pc.addTrack(track, stream)
      logRtc('local track added to peer connection', {
        trackId: track.id,
        kind: track.kind,
      })
    }
  })
}

const renegotiatePeer = async (socketId: string, pc: RTCPeerConnection) => {
  if (pc.signalingState !== 'stable') return

  makingOfferBySocketId.set(socketId, true)
  try {
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    logRtc('offer created and setLocalDescription (renegotiate)', {
      toSocketId: socketId,
      type: offer.type,
    })

    emitOffer({
      roomId: roomId.value,
      toSocketId: socketId,
      offer,
    })

    logRtc('offer sent (renegotiate)', {
      toSocketId: socketId,
    })
  } finally {
    makingOfferBySocketId.set(socketId, false)
  }
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
  setPeerDiagnostic(socketId, pc)
  logRtc('peer connection created', {
    socketId,
    iceServers: rtcConfig.iceServers,
  })

  attachLocalTracks(pc)

  pc.onicecandidate = (event) => {
    if (!event.candidate) return

    logRtc('ice candidate generated and sending', {
      toSocketId: socketId,
      candidate: event.candidate.candidate,
      sdpMid: event.candidate.sdpMid,
      sdpMLineIndex: event.candidate.sdpMLineIndex,
    })

    emitIceCandidate({
      roomId: roomId.value,
      toSocketId: socketId,
      candidate: event.candidate.toJSON(),
    })
  }

  pc.ontrack = (event) => {
    lastRemoteTrackAt.value = Date.now()
    logRtc('ontrack fired', {
      fromSocketId: socketId,
      trackId: event.track.id,
      kind: event.track.kind,
      streamCount: event.streams.length,
    })

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
    setPeerDiagnostic(socketId, pc)
    logRtc('peer connection state changed', {
      socketId,
      connectionState: pc.connectionState,
    })

    if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
      closePeerConnection(socketId)
    }
  }

  pc.oniceconnectionstatechange = () => {
    setPeerDiagnostic(socketId, pc)
    logRtc('ice connection state changed', {
      socketId,
      iceConnectionState: pc.iceConnectionState,
    })
  }

  pc.onsignalingstatechange = () => {
    setPeerDiagnostic(socketId, pc)
    logRtc('signaling state changed', {
      socketId,
      signalingState: pc.signalingState,
    })
  }

  return pc
}

const flushPendingIceCandidates = async (socketId: string, pc: RTCPeerConnection) => {
  const queued = pendingIceCandidatesBySocketId.get(socketId)
  if (!queued?.length) return

  logRtc('flushing queued ICE candidates', {
    socketId,
    queuedCount: queued.length,
  })

  pendingIceCandidatesBySocketId.delete(socketId)
  for (const candidate of queued) {
    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate))
      logRtc('queued ICE candidate applied', { socketId })
    } catch (error) {
      console.warn('Failed to apply queued ICE candidate:', error)
    }
  }
}

const isPolitePeer = (remoteSocketId: string): boolean => {
  if (!localSocketId.value) return true
  return localSocketId.value.localeCompare(remoteSocketId) < 0
}

const createAndSendOffer = async (socketId: string) => {
  const pc = createPeerConnection(socketId)
  if (!pc) return

  attachLocalTracks(pc)

  if (pc.signalingState !== 'stable') {
    logRtc('offer creation skipped: signaling not stable', {
      toSocketId: socketId,
      signalingState: pc.signalingState,
    })
    return
  }

  makingOfferBySocketId.set(socketId, true)
  try {
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    logRtc('offer created and setLocalDescription', {
      toSocketId: socketId,
      type: offer.type,
    })

    emitOffer({
      roomId: roomId.value,
      toSocketId: socketId,
      offer,
    })
    logRtc('offer sent', {
      toSocketId: socketId,
    })
  } finally {
    makingOfferBySocketId.set(socketId, false)
  }
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
  const fromSocketId = normalizeSenderSocketId(payload)
  const offer = normalizeSessionDescription(payload, 'offer')
  if (!fromSocketId || !offer) return

  logRtc('offer received', {
    fromSocketId,
    type: offer.type,
  })

  const pc = createPeerConnection(fromSocketId)
  if (!pc) return

  const offerCollision = makingOfferBySocketId.get(fromSocketId) || pc.signalingState !== 'stable'
  const polite = isPolitePeer(fromSocketId)

  if (offerCollision && !polite) {
    logRtc('offer ignored due to glare and impolite role', {
      fromSocketId,
      signalingState: pc.signalingState,
    })
    return
  }

  if (offerCollision) {
    if (pc.signalingState === 'have-local-offer') {
      logRtc('offer collision detected, rolling back local description', {
        fromSocketId,
        signalingState: pc.signalingState,
      })
      await pc.setLocalDescription({ type: 'rollback' })
    } else if (pc.signalingState !== 'stable') {
      logRtc('offer ignored due to non-roll-backable signaling state', {
        fromSocketId,
        signalingState: pc.signalingState,
      })
      return
    } else {
      logRtc('offer collision detected without rollback requirement', {
        fromSocketId,
        signalingState: pc.signalingState,
      })
    }
  }

  attachLocalTracks(pc)
  await pc.setRemoteDescription(new RTCSessionDescription(offer))
  logRtc('remote offer applied', {
    fromSocketId,
  })

  await flushPendingIceCandidates(fromSocketId, pc)

  const answer = await pc.createAnswer()
  await pc.setLocalDescription(answer)
  logRtc('answer created and setLocalDescription', {
    toSocketId: fromSocketId,
  })

  emitAnswer({
    roomId: roomId.value,
    toSocketId: fromSocketId,
    answer,
  })
  logRtc('answer sent', {
    toSocketId: fromSocketId,
  })
}

const handleAnswer = async (payload: unknown) => {
  const fromSocketId = normalizeSenderSocketId(payload)
  const answer = normalizeSessionDescription(payload, 'answer')

  if (!fromSocketId || !answer) return

  logRtc('answer received', {
    fromSocketId,
    type: answer.type,
  })

  const pc = peerConnectionsBySocketId.get(fromSocketId)
  if (!pc) return

  await pc.setRemoteDescription(new RTCSessionDescription(answer))
  logRtc('remote answer applied', {
    fromSocketId,
  })

  await flushPendingIceCandidates(fromSocketId, pc)
}

const handleIceCandidate = async (payload: unknown) => {
  const fromSocketId = normalizeSenderSocketId(payload)
  const candidate = normalizeIceCandidatePayload(payload)
  if (!fromSocketId || !candidate) return

  logRtc('ICE candidate received', {
    fromSocketId,
    candidate: candidate.candidate,
    sdpMid: candidate.sdpMid,
    sdpMLineIndex: candidate.sdpMLineIndex,
  })

  const pc = createPeerConnection(fromSocketId)
  if (!pc) return

  if (!pc.remoteDescription) {
    const queued = pendingIceCandidatesBySocketId.get(fromSocketId) || []
    pendingIceCandidatesBySocketId.set(fromSocketId, [...queued, candidate])
    logRtc('ICE candidate queued until remote description is set', {
      fromSocketId,
      queuedCount: queued.length + 1,
    })
    return
  }

  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate))
    logRtc('ICE candidate applied', {
      fromSocketId,
    })
  } catch (error) {
    console.warn('Failed to add ICE candidate:', error)
  }
}

const handleUserLeft = (payload: unknown) => {
  const socketId = normalizeSocketId(payload)
  if (!socketId) return
  logRtc('participant left', { socketId })
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
  peerDiagnosticsBySocketId.value = {}
  localSocketId.value = ''
  socketListenersRegistered.value = false
  pendingIceCandidatesBySocketId.clear()
  makingOfferBySocketId.clear()
  stopLocalMedia()
  disconnect()
}

const registerSocketListeners = () => {
  const socket = connect()
  if (!socket || socketListenersRegistered.value) return

  socketListenersRegistered.value = true

  socket.on('connect', () => {
    localSocketId.value = socket.id || ''
    logRtc('socket connected', {
      socketId: socket.id,
      roomId: roomId.value,
    })

    connectionStatus.value = 'Connected'
    statusMessage.value = 'Connected to signaling server. Joining room...'

    const token = process.client ? localStorage.getItem('educonnect_token') : null
    joinRoom({
      roomId: roomId.value,
      token,
    })
  })

  socket.on('connect_error', (error: Error) => {
    logRtc('socket connect_error', {
      message: error.message,
    })
    connectionStatus.value = 'Connection failed'
    errorMessage.value = error.message || 'Failed to connect to meeting server'
  })

  socket.on('disconnect', (reason: string) => {
    logRtc('socket disconnected', {
      reason,
    })
    connectionStatus.value = 'Disconnected'
  })

  socket.on('room-users', (payload: unknown) => {
    logRtc('room-users received', {
      users: normalizeSocketIdList(payload),
    })
    statusMessage.value = 'Joined room. Connecting participants...'
    handleRoomUsers(payload, socket.id).catch((error) => {
      console.error('Failed to process room users:', error)
    })
  })

  socket.on('user-joined', (payload: unknown) => {
    logRtc('user-joined received', {
      socketId: normalizeSocketId(payload),
    })
    handleUserJoined(payload, socket.id).catch((error) => {
      console.error('Failed to handle user joined:', error)
    })
  })

  socket.on('participant-joined', (payload: unknown) => {
    logRtc('participant-joined received', {
      socketId: normalizeSocketId(payload),
    })
    handleUserJoined(payload, socket.id).catch((error) => {
      console.error('Failed to handle participant joined:', error)
    })
  })

  socket.on('new-user', (payload: unknown) => {
    logRtc('new-user received', {
      socketId: normalizeSocketId(payload),
    })
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
    logRtc('socket-error received', {
      message,
      payload: source,
    })
    errorMessage.value = message
  })
}

const getReadableMediaError = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return 'Camera/microphone access failed due to an unknown error.'
  }

  const mediaError = error as Error & { name?: string }

  if (mediaError.name === 'NotAllowedError' || mediaError.name === 'PermissionDeniedError') {
    return 'Camera/microphone permission was denied. Allow access in browser settings and rejoin the class.'
  }

  if (mediaError.name === 'NotFoundError' || mediaError.name === 'DevicesNotFoundError') {
    return 'No microphone/camera device was found. Connect a device and try again.'
  }

  if (mediaError.name === 'NotReadableError' || mediaError.name === 'TrackStartError') {
    return 'Camera/microphone is already in use by another app. Close other apps and retry.'
  }

  return mediaError.message || 'Camera/microphone access failed.'
}

const initLocalMedia = async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('This browser does not support camera/microphone capture (getUserMedia).')
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })

  localStream.value = stream

  logRtc('local stream obtained', {
    streamId: stream.id,
    tracks: stream.getTracks().map((track) => ({
      id: track.id,
      kind: track.kind,
      enabled: track.enabled,
      readyState: track.readyState,
      label: track.label,
    })),
  })

  stream.getTracks().forEach((track) => {
    track.onended = () => {
      logRtc('local track ended', {
        trackId: track.id,
        kind: track.kind,
      })
      syncLocalTrackState()
    }
  })

  syncLocalTrackState()

  await attachTracksToAllPeers()
}

const initMeeting = async () => {
  if (!process.client) return

  if (!roomId.value) {
    errorMessage.value = 'Invalid room ID'
    return
  }

  connectionStatus.value = 'Requesting media access...'
  statusMessage.value = ''
  errorMessage.value = ''
  permissionDenied.value = false

  try {
    await initLocalMedia()
  } catch (error) {
    permissionDenied.value = true
    connectionStatus.value = 'Media blocked'
    errorMessage.value = getReadableMediaError(error)
    statusMessage.value = 'Joining room without camera/mic access.'
    logRtc('local media request failed', {
      error: error instanceof Error ? { name: error.name, message: error.message } : { message: String(error) },
    })
  }

  connectionStatus.value = 'Connecting...'
  registerSocketListeners()

  if (!permissionDenied.value) {
    statusMessage.value = `Signed in as ${userStore.user?.name || 'User'}`
  }
}

const toggleMute = () => {
  const stream = localStream.value
  if (!stream) {
    statusMessage.value = 'No local microphone stream available.'
    return
  }

  const nextMuted = !isMuted.value
  stream.getAudioTracks().forEach((track) => {
    track.enabled = !nextMuted
  })
  syncLocalTrackState()
  logRtc('microphone toggled', {
    muted: isMuted.value,
    tracks: stream.getAudioTracks().map((track) => ({ id: track.id, enabled: track.enabled })),
  })
}

const toggleCamera = () => {
  const stream = localStream.value
  if (!stream) {
    statusMessage.value = 'No local camera stream available.'
    return
  }

  const nextCameraOff = !isCameraOff.value
  stream.getVideoTracks().forEach((track) => {
    track.enabled = !nextCameraOff
  })
  syncLocalTrackState()
  logRtc('camera toggled', {
    cameraOff: isCameraOff.value,
    tracks: stream.getVideoTracks().map((track) => ({ id: track.id, enabled: track.enabled })),
  })
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

