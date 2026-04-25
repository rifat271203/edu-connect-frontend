<template>
  <div class="relative min-h-screen overflow-hidden bg-dark-950 text-dark-50">
    <!-- Decorative background elements -->
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
                {{ participants.length }} Participant{{ participants.length === 1 ? '' : 's' }}
              </span>
              <span :class="connectionBadgeClass" class="rounded-xl px-3 py-1.5 font-medium">
                {{ connectionStatus }}
              </span>
            </div>
          </div>

          <div v-if="error" class="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            {{ error }}
          </div>
        </header>

        <section class="rounded-3xl border border-surface-glass-border bg-dark-900/70 p-4 shadow-card backdrop-blur-xl md:p-5">
          <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-lg font-semibold">Participants</h2>
            <p class="text-sm text-dark-300">
              {{ participants.length > 1 ? 'Live media streams are active.' : 'Share the room link and wait for others to join.' }}
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <!-- Local Participant -->
            <MeetingVideoTile
              v-if="localParticipant"
              :stream="localParticipant.videoStream || null"
              :label="`You${localParticipant.isMuted ? ' (Muted)' : ''}`"
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
              class="flex min-h-56 flex-col items-center justify-center rounded-3xl border border-dashed border-surface-glass-border bg-dark-800/35 px-5 text-center"
            >
              <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent-light">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17 20h5V4H2v16h5m10 0v-5a3 3 0 00-3-3H10a3 3 0 00-3 3v5m10 0H7" />
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
            :disabled="isConnecting"
            @toggle-mic="toggleMic"
            @toggle-camera="toggleCamera"
            @copy-link="copyMeetingLink"
            @leave="leaveSession"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStreamVideo } from '~/composables/useStreamVideo'
import { useUserStore } from '~/stores/user'

definePageMeta({
  layout: 'blank',
})

const route = useRoute()
const roomId = computed(() => String(route.params.roomId || ''))
const { call, isConnecting, error, joinCall, leaveCall } = useStreamVideo()

const participants = computed(() => call.value?.state.participants || [])
const localParticipant = computed(() => call.value?.state.localParticipant)
const remoteParticipants = computed(() => call.value?.state.remoteParticipants || [])

const isMuted = computed(() => localParticipant.value?.isMuted || false)
const isCameraOff = computed(() => !localParticipant.value?.videoStream)

const connectionStatus = computed(() => {
  if (isConnecting.value) return 'Connecting...'
  if (error.value) return 'Error'
  if (call.value) return 'Connected'
  return 'Initializing...'
})

const connectionBadgeClass = computed(() => {
  if (error.value) return 'border border-red-500/30 bg-red-500/15 text-red-300'
  if (isConnecting.value) return 'border border-secondary-500/30 bg-secondary-500/15 text-secondary-300'
  return 'border border-accent/30 bg-accent/15 text-accent-light'
})

const toggleMic = async () => {
  if (!call.value) return
  await call.value.microphone.toggle()
}

const toggleCamera = async () => {
  if (!call.value) return
  await call.value.camera.toggle()
}

const copyMeetingLink = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
    // You could add a toast notification here
  }
}

const leaveSession = async () => {
  await leaveCall()
  navigateTo('/classroom')
}

onMounted(async () => {
  if (roomId.value) {
    await joinCall(roomId.value)
  }
})
</script>
