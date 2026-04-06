<!-- src/pages/classroom/[roomId].vue -->
<template>
  <div class="relative min-h-screen bg-dark-950 text-dark-100">
    <SessionLobby
      v-if="sessionStore.sessionStatus === 'lobby'"
      :role="sessionRole"
      :local-stream="previewStream"
      :waiting-room="sessionStore.waitingRoom"
      :requested-to-join="requestedToJoin"
      :is-muted="isMuted"
      :is-camera-off="isCameraOff"
      @change-camera="handleChangeCamera"
      @change-microphone="handleChangeMicrophone"
      @toggle-mute="toggleMute"
      @toggle-camera="toggleCamera"
      @start-session="handleStartSession"
      @request-join="handleRequestJoin"
      @admit="handleAdmit"
    />

    <template v-else-if="sessionStore.sessionStatus === 'live'">
      <!-- Teacher View -->
      <template v-if="sessionRole === 'teacher'">
        <div class="mx-auto max-w-7xl p-4 lg:p-6">
          <ParticipantGrid
            :participants="sessionStore.participants"
            :local-stream="webrtc.localStream.value"
            :remote-streams="webrtc.remoteStreams.value"
            :local-user-id="selfSocketId"
            :local-display-name="userStore.user?.name || 'You'"
            :is-local-muted="webrtc.isMuted.value"
            :is-local-camera-off="webrtc.isCameraOff.value"
            :local-hand-raised="false"
          />
        </div>

        <!-- Sidebar -->
        <div class="fixed right-4 top-4 z-50 h-[70vh] w-[min(92vw,360px)]">
          <ChatPanel
            v-if="showChat"
            :messages="sessionStore.chatMessages"
            :is-open="showChat"
            @send="sendChat"
          />
          <WaitingRoomPanel
            v-else-if="showWaitingRoom"
            :waiting-room="sessionStore.waitingRoom"
            @admit="handleAdmit"
            @deny="handleDeny"
          />
        </div>

        <ControlBar
          role="teacher"
          :is-muted="webrtc.isMuted.value"
          :is-camera-off="webrtc.isCameraOff.value"
          :is-screen-sharing="webrtc.isScreenSharing.value"
          :is-recording="sessionStore.isRecording"
          :hand-raised="false"
          @toggle-mute="webrtc.toggleMute"
          @toggle-camera="webrtc.toggleCamera"
          @toggle-screen-share="webrtc.startScreenShare"
          @toggle-record="toggleRecord"
          @toggle-chat="showChat = !showChat; showWaitingRoom = false"
          @toggle-participants="showWaitingRoom = !showWaitingRoom; showChat = false"
          @end-session="handleEndSession"
        />
      </template>

      <!-- Student View -->
      <template v-else>
        <div class="mx-auto max-w-7xl p-4 lg:p-6">
          <ParticipantGrid
            :participants="sessionStore.participants"
            :local-stream="webrtc.localStream.value"
            :remote-streams="webrtc.remoteStreams.value"
            :local-user-id="selfSocketId"
            :local-display-name="userStore.user?.name || 'You'"
            :is-local-muted="webrtc.isMuted.value"
            :is-local-camera-off="webrtc.isCameraOff.value"
            :local-hand-raised="localHasHandRaised"
          />
        </div>

        <!-- Chat Panel -->
        <div v-if="showChat" class="fixed right-4 top-4 z-50 h-[70vh] w-[min(92vw,360px)]">
          <ChatPanel
            :messages="sessionStore.chatMessages"
            :is-open="showChat"
            @send="sendChat"
          />
        </div>

        <ControlBar
          role="student"
          :is-muted="webrtc.isMuted.value"
          :is-camera-off="webrtc.isCameraOff.value"
          :is-screen-sharing="false"
          :is-recording="false"
          :hand-raised="localHasHandRaised"
          @toggle-mute="webrtc.toggleMute"
          @toggle-camera="webrtc.toggleCamera"
          @toggle-hand-raise="toggleHandRaise"
          @toggle-chat="showChat = !showChat"
          @leave-session="handleLeaveSession"
        />
      </template>
    </template>

    <div v-else class="flex min-h-screen items-center justify-center p-6 text-center text-dark-300">
      Session is unavailable.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage, ClassroomRole, Participant } from '~/types/classroom'

definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const sessionStore = useSessionStore()
const signaling = useSignaling()
const webrtc = useWebRTC()

const roomId = computed(() => String(route.params.roomId || ''))
const sessionRole = computed<ClassroomRole>(() => (route.query.role === 'teacher' ? 'teacher' : 'student'))

const previewStream = ref<MediaStream | null>(null)
const requestedToJoin = ref(false)
const showChat = ref(false)
const showWaitingRoom = ref(false)
const localHasHandRaised = ref(false)
const startedLive = ref(false)
const isMuted = ref(false)
const isCameraOff = ref(false)

const listenerCleanups: Array<() => void> = []

const resolveToastInstance = (): unknown => {
  const nuxtApp = useNuxtApp()
  const record = nuxtApp as unknown as Record<string, unknown>

  if (typeof record.$toast !== 'undefined') {
    return record.$toast
  }

  return null
}

const useClassroomToast = () => {
  const toast = resolveToastInstance() as {
    add?: (payload: { title?: string; description?: string; color?: string }) => void
    error?: (message: string) => void
  } | null

  if (toast?.add) {
    return (message: string) => {
      toast.add?.({ title: 'Classroom', description: message, color: 'red' })
    }
  }

  if (toast?.error) {
    return (message: string) => {
      toast.error?.(message)
    }
  }

  return (message: string) => {
    // eslint-disable-next-line no-console
    console.error(message)
  }
}

const showErrorToast = useClassroomToast()

const getReadableMediaError = (error: unknown): string => {
  if (!(error instanceof Error)) return 'Failed to access camera or microphone.'
  if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
    return 'Camera or microphone permission was denied.'
  }
  if (error.name === 'NotFoundError') {
    return 'No camera or microphone device was found.'
  }
  return error.message || 'Failed to access camera or microphone.'
}

const initLobbyPreview = async (constraints?: MediaStreamConstraints) => {
  if (!navigator.mediaDevices?.getUserMedia) return

  try {
    const stream = await navigator.mediaDevices.getUserMedia(
      constraints || {
        video: true,
        audio: true,
      },
    )

    previewStream.value?.getTracks().forEach((track) => track.stop())
    previewStream.value = stream

    // Update mute/camera state based on tracks
    const audioTracks = stream.getAudioTracks()
    const videoTracks = stream.getVideoTracks()
    isMuted.value = !audioTracks.some((track) => track.enabled)
    isCameraOff.value = !videoTracks.some((track) => track.enabled)
  } catch (error) {
    showErrorToast(getReadableMediaError(error))
  }
}

const handleChangeCamera = async (deviceId: string) => {
  await initLobbyPreview({
    video: deviceId ? { deviceId: { exact: deviceId } } : true,
    audio: true,
  })
}

const handleChangeMicrophone = async (deviceId: string) => {
  await initLobbyPreview({
    video: true,
    audio: deviceId ? { deviceId: { exact: deviceId } } : true,
  })
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  previewStream.value?.getAudioTracks().forEach((track) => {
    track.enabled = !isMuted.value
  })
}

const toggleCamera = () => {
  isCameraOff.value = !isCameraOff.value
  previewStream.value?.getVideoTracks().forEach((track) => {
    track.enabled = !isCameraOff.value
  })
}

const selfSocketId = computed(() => signaling.socket.value?.id || '')

const startLive = async () => {
  if (startedLive.value || !roomId.value) return
  if (!selfSocketId.value) return

  startedLive.value = true
  previewStream.value?.getTracks().forEach((track) => track.stop())
  previewStream.value = null

  const peerIds = sessionStore.participants
    .map((participant) => participant.socketId)
    .filter((id) => id && id !== selfSocketId.value)

  await webrtc.startSession(sessionRole.value, {
    roomId: roomId.value,
    selfSocketId: selfSocketId.value,
    peerSocketIds: peerIds,
  })
}

const handleStartSession = async () => {
  sessionStore.sessionStatus = 'live'
  await startLive()
}

const handleRequestJoin = () => {
  requestedToJoin.value = true
  signaling.emit('hand-raise', {
    roomId: roomId.value,
    socketId: selfSocketId.value,
    hasHandRaised: true,
  })
}

const handleAdmit = (socketId: string) => {
  sessionStore.admitParticipant(socketId)
}

const handleDeny = (socketId: string) => {
  // Remove from waiting room
  sessionStore.waitingRoom = sessionStore.waitingRoom.filter((p) => p.socketId !== socketId)
}

const sendChat = (message: string) => {
  const trimmed = message.trim()
  if (!trimmed) return

  signaling.emit('send-chat', {
    roomId: roomId.value,
    message: trimmed,
  })

  const optimistic: ChatMessage = {
    id: crypto.randomUUID(),
    senderId: String(userStore.user?.id || selfSocketId.value),
    senderName: userStore.user?.name || 'You',
    message: trimmed,
    timestamp: new Date().toISOString(),
  }
  sessionStore.addChatMessage(optimistic)
}

const toggleHandRaise = () => {
  localHasHandRaised.value = !localHasHandRaised.value
  signaling.emit('hand-raise', {
    roomId: roomId.value,
    socketId: selfSocketId.value,
    hasHandRaised: localHasHandRaised.value,
  })
}

const toggleRecord = () => {
  sessionStore.isRecording = !sessionStore.isRecording
}

const handleEndSession = async () => {
  await sessionStore.endSession(roomId.value)
  webrtc.endSession()
  await navigateTo('/')
}

const handleLeaveSession = async () => {
  signaling.emit('leave-room', { roomId: roomId.value })
  webrtc.endSession()
  await navigateTo('/')
}

const normalizeParticipantList = (participants: Participant[]): Participant[] => participants.map((participant) => ({ ...participant }))

const bindSocketListeners = () => {
  listenerCleanups.push(
    signaling.on('participant-list', (payload) => {
      sessionStore.setParticipants(normalizeParticipantList(payload.participants || []))
      sessionStore.waitingRoom = payload.waitingRoom ? normalizeParticipantList(payload.waitingRoom) : []
    }),
  )

  listenerCleanups.push(
    signaling.on('peer-joined', async (payload) => {
      if (sessionStore.sessionStatus !== 'live') return
      if (sessionRole.value !== 'teacher') return
      if (!payload.socketId || payload.socketId === selfSocketId.value) return

      await webrtc.initiateOffer(payload.socketId)
    }),
  )

  listenerCleanups.push(
    signaling.on('offer', async (payload) => {
      if (!payload.fromSocketId || !payload.offer) return
      await webrtc.handleOffer(payload.fromSocketId, payload.offer)
    }),
  )

  listenerCleanups.push(
    signaling.on('answer', async (payload) => {
      if (!payload.fromSocketId || !payload.answer) return
      await webrtc.handleAnswer(payload.fromSocketId, payload.answer)
    }),
  )

  listenerCleanups.push(
    signaling.on('ice-candidate', async (payload) => {
      if (!payload.fromSocketId || !payload.candidate) return
      await webrtc.handleIceCandidate(payload.fromSocketId, payload.candidate)
    }),
  )

  listenerCleanups.push(
    signaling.on('chat-message', (payload) => {
      sessionStore.addChatMessage(payload.message)
    }),
  )

  listenerCleanups.push(
    signaling.on('hand-raised', (payload) => {
      sessionStore.participants = sessionStore.participants.map((participant) => {
        if (participant.socketId !== payload.socketId) return participant
        return {
          ...participant,
          hasHandRaised: payload.hasHandRaised,
        }
      })
    }),
  )

  listenerCleanups.push(
    signaling.on('force-mute', (payload) => {
      const shouldMuteSelf = payload.muteAll || payload.socketId === selfSocketId.value
      if (!shouldMuteSelf) return
      if (!webrtc.isMuted.value) {
        webrtc.toggleMute()
      }
    }),
  )

  listenerCleanups.push(
    signaling.on('admitted', async (payload) => {
      if (sessionRole.value !== 'student') return
      if (payload.socketId !== selfSocketId.value) return

      requestedToJoin.value = false
      sessionStore.sessionStatus = 'live'
      await startLive()
    }),
  )

  listenerCleanups.push(
    signaling.on('session-ended', async () => {
      sessionStore.sessionStatus = 'ended'
      webrtc.endSession()
      await router.push('/')
    }),
  )
}

const initialize = async () => {
  if (!process.client) return
  if (!roomId.value) {
    await navigateTo('/')
    return
  }

  const userId = userStore.user?.id ? String(userStore.user.id) : 'guest-user'
  const name = userStore.user?.name || 'Guest User'

  await sessionStore.fetchToken(userId, name, sessionRole.value)
  signaling.connect(true)

  bindSocketListeners()

  signaling.emit('join-room', {
    roomId: roomId.value,
    role: sessionRole.value,
    userId,
    name,
  })

  await sessionStore.joinSession(roomId.value)
  if (sessionStore.sessionStatus === 'idle') {
    sessionStore.sessionStatus = 'lobby'
  }

  if (sessionStore.sessionStatus === 'lobby') {
    await initLobbyPreview()
  }

  if (sessionStore.sessionStatus === 'live') {
    await startLive()
  }
}

onMounted(() => {
  void initialize()
})

onUnmounted(() => {
  listenerCleanups.splice(0).forEach((cleanup) => cleanup())

  previewStream.value?.getTracks().forEach((track) => track.stop())
  previewStream.value = null

  signaling.emit('leave-room', { roomId: roomId.value })
  webrtc.endSession()
})
</script>
