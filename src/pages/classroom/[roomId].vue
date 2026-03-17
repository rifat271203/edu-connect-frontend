<!-- src/pages/classroom/[roomId].vue -->
<template>
  <div class="relative min-h-screen bg-dark-950 text-dark-100">
    <SessionLobby
      v-if="sessionStore.sessionStatus === 'lobby'"
      :role="sessionRole"
      :local-stream="previewStream"
      :waiting-room="sessionStore.waitingRoom"
      :requested-to-join="requestedToJoin"
      @change-camera="handleChangeCamera"
      @change-microphone="handleChangeMicrophone"
      @start-session="handleStartSession"
      @request-join="handleRequestJoin"
      @admit="handleAdmit"
    />

    <TeacherView
      v-else-if="sessionStore.sessionStatus === 'live' && sessionRole === 'teacher'"
      :local-stream="webrtc.localStream.value"
      :remote-streams="webrtc.remoteStreams.value"
      :participants="sessionStore.participants"
      :chat-messages="sessionStore.chatMessages"
      :is-muted="webrtc.isMuted.value"
      :is-recording="sessionStore.isRecording"
      @toggle-mute="webrtc.toggleMute"
      @toggle-camera="webrtc.toggleCamera"
      @toggle-screen-share="webrtc.startScreenShare"
      @toggle-record="toggleRecord"
      @send-chat="sendChat"
      @mute-all="muteAll"
      @mute-participant="muteParticipant"
      @remove-participant="removeParticipant"
      @end-session="handleEndSession"
    />

    <template v-else-if="sessionStore.sessionStatus === 'live' && sessionRole === 'student'">
      <StudentView
        :teacher-stream="teacherStream"
        :local-stream="webrtc.localStream.value"
        :teacher-muted="teacherMuted"
        :is-muted="webrtc.isMuted.value"
        :has-hand-raised="localHasHandRaised"
        @toggle-mute="webrtc.toggleMute"
        @toggle-camera="webrtc.toggleCamera"
        @toggle-hand-raise="toggleHandRaise"
        @toggle-chat="showStudentChat = !showStudentChat"
        @leave-session="handleLeaveSession"
      />

      <div v-if="showStudentChat" class="fixed right-4 top-4 z-50 h-[70vh] w-[min(92vw,360px)]">
        <ChatPanel
          :messages="sessionStore.chatMessages"
          :is-open="showStudentChat"
          @send="sendChat"
        />
      </div>
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
const showStudentChat = ref(false)
const localHasHandRaised = ref(false)
const startedLive = ref(false)

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

const selfSocketId = computed(() => signaling.socket.value?.id || '')

const teacherParticipant = computed(() => {
  const ownSocketId = selfSocketId.value
  return (
    sessionStore.participants.find((participant) => participant.role === 'teacher' && participant.socketId !== ownSocketId) ||
    sessionStore.participants.find((participant) => participant.role === 'teacher') ||
    null
  )
})

const teacherStream = computed(() => {
  if (!teacherParticipant.value) return null
  return webrtc.remoteStreams.value.get(teacherParticipant.value.socketId) || null
})

const teacherMuted = computed(() => Boolean(teacherParticipant.value?.isMuted))

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

const muteAll = () => {
  signaling.emit('hand-raise', {
    roomId: roomId.value,
    socketId: selfSocketId.value,
    hasHandRaised: false,
  })
  signaling.emit('send-chat', {
    roomId: roomId.value,
    message: 'Teacher muted all participants.',
  })
}

const muteParticipant = (socketId: string) => {
  signaling.emit('hand-raise', {
    roomId: roomId.value,
    socketId,
    hasHandRaised: false,
  })
}

const removeParticipant = (socketId: string) => {
  signaling.emit('leave-room', {
    roomId: roomId.value,
  })
  webrtc.removePeer(socketId)
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

