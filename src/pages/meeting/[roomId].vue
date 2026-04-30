<template>
  <div class="relative min-h-screen overflow-hidden bg-[#070708] text-white">
    <!-- Immersive Background -->
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -left-48 -top-48 h-[600px] w-[600px] rounded-full bg-red-500/[0.03] blur-[120px]" />
      <div class="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-orange-500/[0.03] blur-[120px]" />
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.02),transparent_60%)]" />
    </div>

    <div class="relative z-10 flex h-screen flex-col overflow-hidden">
      <!-- Minimalist Header -->
      <header class="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div class="flex items-center gap-4">
          <div class="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.3)]">
            <span class="material-symbols-rounded text-white">school</span>
          </div>
          <div class="min-w-0">
            <h1 class="text-[15px] font-bold tracking-tight truncate">{{ courseTitle || 'Live Classroom' }}</h1>
            <p class="text-[11px] text-white/40 font-medium uppercase tracking-[0.1em]">Session in progress · {{ roomId }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex -space-x-2">
            <div v-for="i in Math.min(participants.length, 3)" :key="i" class="h-8 w-8 rounded-full border-2 border-[#070708] bg-white/5 flex items-center justify-center text-[10px] font-bold">
              {{ participants[i-1]?.name?.charAt(0) || 'P' }}
            </div>
            <div v-if="participants.length > 3" class="h-8 w-8 rounded-full border-2 border-[#070708] bg-white/10 flex items-center justify-center text-[10px] font-bold">
              +{{ participants.length - 3 }}
            </div>
          </div>
          <div class="h-8 w-px bg-white/10" />
          <span :class="connectionBadgeClass" class="rounded-full px-3 py-1 text-[11px] font-bold tracking-tight border">
            {{ connectionStatus }}
          </span>
        </div>
      </header>

      <!-- Main Video Grid -->
      <main class="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
        <div 
          class="mx-auto grid gap-6"
          :class="[
            participants.length <= 1 ? 'max-w-4xl grid-cols-1' : 
            participants.length <= 2 ? 'max-w-6xl grid-cols-1 md:grid-cols-2' :
            'max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          ]"
        >
          <!-- Local Participant -->
          <MeetingVideoTile
            v-if="localParticipant"
            :stream="localParticipant.videoStream || null"
            :label="`You (${localParticipant.name || 'User'})`"
            muted
          />

          <!-- Remote Participants -->
          <MeetingVideoTile
            v-for="participant in remoteParticipants"
            :key="participant.sessionId"
            :stream="participant.videoStream || null"
            :label="participant.name || 'Participant'"
          />

          <!-- Empty State -->
          <div
            v-if="remoteParticipants.length === 0 && !isConnecting"
            class="flex flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-white/5 bg-white/[0.02] p-12 text-center transition-all hover:bg-white/[0.04] group"
          >
            <div class="relative mb-6">
              <div class="absolute inset-0 bg-red-500/10 blur-3xl rounded-full scale-150 animate-pulse" />
              <div class="relative h-20 w-20 rounded-[28px] bg-red-500/10 flex items-center justify-center border border-red-500/10 text-red-500 group-hover:scale-110 transition-transform duration-500">
                <span class="material-symbols-rounded text-4xl">group_add</span>
              </div>
            </div>
            <h2 class="text-xl font-bold tracking-tight">Waiting for others to join</h2>
            <p class="mt-2 text-sm text-white/40 max-w-xs mx-auto">
              You're the first one here! Copy the session link and share it with your students or peers.
            </p>
            <button 
              @click="copyMeetingLink"
              class="mt-8 h-11 px-6 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 transition-transform shadow-lg"
            >
              Copy Session Link
            </button>
          </div>
        </div>
      </main>

      <!-- Fixed Controls Area -->
      <footer class="px-6 py-8 pointer-events-none">
        <div class="pointer-events-auto">
          <MeetingControls
            :is-muted="isMuted"
            :is-camera-off="isCameraOff"
            :disabled="isConnecting"
            @toggle-mic="toggleMic"
            @toggle-camera="toggleCamera"
            @copy-link="copyMeetingLink"
            @leave="leaveSession"
          />
        </div>
      </footer>
    </div>
    
    <!-- Hidden audio element for Stream Video SDK to play remote participants' audio -->
    <audio id="global-audio-element" ref="audioRef" autoplay playsinline />
  </div>
</template>

<script setup lang="ts">
import { useStreamVideo } from '~/composables/useStreamVideo'
import { useUserStore } from '~/stores/user'
import { useClassroomStore } from '~/stores/classroom'
import { useRole } from '~/composables/useRole'

definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const classroomStore = useClassroomStore()
const { isTeacher } = useRole()
const roomId = computed(() => String(route.params.roomId || ''))
const { call, isConnecting, error, joinCall, leaveCall } = useStreamVideo()

const audioRef = ref<HTMLAudioElement | null>(null)

// Use a more stable reference to participants to avoid Maximum recursive updates
const participants = ref<any[]>([])
const localParticipant = ref<any>(null)
const remoteParticipants = ref<any[]>([])

let participantsUnsubscribe: any = null

onBeforeUnmount(() => {
  if (participantsUnsubscribe) {
    participantsUnsubscribe.unsubscribe()
  }
  leaveCall() // Ensure call is left and disconnected on unmount
})

// Sync SDK state to local refs to avoid deep reactivity loops
watch(call, (newCall) => {
  if (participantsUnsubscribe) {
    participantsUnsubscribe.unsubscribe()
    participantsUnsubscribe = null
  }

  if (!newCall) {
    participants.value = []
    localParticipant.value = null
    remoteParticipants.value = []
    return
  }

  // Bind audio element if already mounted
  if (audioRef.value) {
    // Some versions use bindAudioElement, others setAudioElement
    if (typeof (newCall as any).bindAudioElement === 'function') {
      (newCall as any).bindAudioElement(audioRef.value)
    } else if (typeof (newCall as any).setAudioElement === 'function') {
      (newCall as any).setAudioElement(audioRef.value)
    }
  }

  // Initial state - use raw data to avoid reactivity overhead
  const state = newCall.state
  participants.value = [...state.participants]
  localParticipant.value = state.localParticipant
  remoteParticipants.value = [...state.remoteParticipants]

  // Watch for state changes manually to keep refs updated without deep Vue tracking
  participantsUnsubscribe = state.participants$.subscribe((p) => {
    participants.value = [...p]
    localParticipant.value = state.localParticipant
    remoteParticipants.value = [...state.remoteParticipants]
  })
}, { immediate: true })

// Ensure audio is bound robustly when mounted
onMounted(() => {
  const el = document.getElementById('global-audio-element') as HTMLAudioElement
  
  // Watch effect to bind whenever call changes
  watchEffect(() => {
    if (call.value && el) {
      const c = call.value as any
      if (typeof c.bindAudioElement === 'function') {
        c.bindAudioElement(el)
      } else if (typeof c.setAudioElement === 'function') {
        c.setAudioElement(el)
      }
    }
  })
})

const isMuted = computed(() => localParticipant.value?.isMuted ?? true)
const isCameraOff = computed(() => !localParticipant.value?.videoStream)

const courseTitle = computed(() => classroomStore.course?.title)

const connectionStatus = computed(() => {
  if (isConnecting.value) return 'Connecting'
  if (error.value) return 'Error'
  if (call.value) return 'Encrypted'
  return 'Initializing'
})

const connectionBadgeClass = computed(() => {
  if (error.value) return 'border-red-500/20 bg-red-500/10 text-red-500'
  if (isConnecting.value) return 'border-orange-500/20 bg-orange-500/10 text-orange-500'
  return 'border-green-500/20 bg-green-500/10 text-green-500'
})

const toggleMic = async () => {
  if (!call.value) return
  try {
    await call.value.microphone.toggle()
  } catch (err: any) {
    if (err.name === 'NotFoundError') {
      alert('Microphone not found. Please connect a microphone to speak.')
    } else {
      console.warn('Failed to toggle mic:', err)
    }
  }
}

const toggleCamera = async () => {
  if (!call.value) return
  try {
    await call.value.camera.toggle()
  } catch (err: any) {
    if (err.name === 'NotFoundError') {
      alert('Camera not found. Please connect a camera to turn on video.')
    } else {
      console.warn('Failed to toggle camera:', err)
    }
  }
}

const copyMeetingLink = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
  }
}

const leaveSession = async () => {
  if (isTeacher.value) {
    await classroomStore.endLiveRoom()
  }
  await leaveCall()
  navigateTo('/classroom')
}

onMounted(async () => {
  if (roomId.value) {
    // Ensure classroom store is initialized for the title etc.
    if (!classroomStore.initialized || classroomStore.courseId !== String(route.params.courseId)) {
       // We don't have courseId in the meeting route usually, but classroomStore might have it from previous page
    }
    await joinCall(roomId.value)
  }
})
</script>

<style>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
