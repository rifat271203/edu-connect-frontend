<!-- src/components/classroom/SessionLobby.vue -->
<template>
  <section class="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
    <header class="rounded-2xl border border-dark-700/70 bg-dark-900/85 p-4">
      <h1 class="text-xl font-semibold text-dark-100">Session Lobby</h1>
      <p class="mt-1 text-sm text-dark-300">Check your camera and microphone before joining.</p>
    </header>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[2fr,1fr]">
      <ParticipantTile
        v-if="localStream"
        user-id="local"
        display-name="You"
        :stream="localStream"
        :is-muted="isMuted"
        :is-camera-off="isCameraOff"
        :hand-raised="false"
        :is-speaking="false"
        :is-local="true"
        size="large"
      />

      <div v-else class="flex h-[48vh] min-h-[320px] items-center justify-center rounded-2xl border border-dark-700/70 bg-dark-900/80">
        <div class="text-center">
          <svg class="mx-auto h-12 w-12 text-dark-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p class="mt-2 text-sm text-dark-300">Camera preview unavailable</p>
          <p class="mt-1 text-xs text-dark-400">Please allow camera access</p>
        </div>
      </div>

      <div class="space-y-3 rounded-2xl border border-dark-700/70 bg-dark-900/85 p-4">
        <label class="block text-xs font-semibold uppercase tracking-wide text-dark-300">Camera</label>
        <select
          v-model="selectedCameraId"
          class="w-full rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100"
        >
          <option value="">Default camera</option>
          <option v-for="device in cameras" :key="device.deviceId" :value="device.deviceId">
            {{ device.label || `Camera ${device.deviceId.slice(0, 6)}` }}
          </option>
        </select>

        <label class="block pt-2 text-xs font-semibold uppercase tracking-wide text-dark-300">Microphone</label>
        <select
          v-model="selectedMicrophoneId"
          class="w-full rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100"
        >
          <option value="">Default microphone</option>
          <option v-for="device in microphones" :key="device.deviceId" :value="device.deviceId">
            {{ device.label || `Mic ${device.deviceId.slice(0, 6)}` }}
          </option>
        </select>

        <label class="block pt-2 text-xs font-semibold uppercase tracking-wide text-dark-300">Speaker</label>
        <select
          v-model="selectedSpeakerId"
          class="w-full rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100"
        >
          <option value="">Default speaker</option>
          <option v-for="device in speakers" :key="device.deviceId" :value="device.deviceId">
            {{ device.label || `Speaker ${device.deviceId.slice(0, 6)}` }}
          </option>
        </select>

        <!-- Mic Toggle -->
        <div class="flex items-center justify-between pt-2">
          <span class="text-sm text-dark-200">Microphone</span>
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="isMuted ? 'border-red-500/40 bg-red-500/20 text-red-100 hover:bg-red-500/30' : 'border-dark-600 bg-dark-800 text-dark-100 hover:bg-dark-700'"
            @click="$emit('toggle-mute')"
          >
            {{ isMuted ? 'Unmute' : 'Mute' }}
          </button>
        </div>

        <!-- Camera Toggle -->
        <div class="flex items-center justify-between">
          <span class="text-sm text-dark-200">Camera</span>
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="isCameraOff ? 'border-red-500/40 bg-red-500/20 text-red-100 hover:bg-red-500/30' : 'border-dark-600 bg-dark-800 text-dark-100 hover:bg-dark-700'"
            @click="$emit('toggle-camera')"
          >
            {{ isCameraOff ? 'Show' : 'Hide' }}
          </button>
        </div>

        <div v-if="role === 'teacher'" class="pt-3">
          <button
            type="button"
            class="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
            @click="$emit('start-session')"
          >
            Start Session
          </button>
        </div>

        <div v-else class="pt-3">
          <button
            v-if="!requestedToJoin"
            type="button"
            class="w-full rounded-xl border border-accent/40 bg-accent/20 px-4 py-2 text-sm font-semibold text-accent-light transition hover:bg-accent/30"
            @click="$emit('request-join')"
          >
            Request to Join
          </button>
          <p v-else class="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-300">
            Waiting for teacher...
          </p>
        </div>
      </div>
    </div>

    <section
      v-if="role === 'teacher'"
      class="rounded-2xl border border-dark-700/70 bg-dark-900/85 p-4"
    >
      <h2 class="text-sm font-semibold uppercase tracking-wide text-dark-300">Waiting students</h2>

      <div v-if="waitingRoom.length === 0" class="mt-3 text-sm text-dark-400">
        No students in waiting room.
      </div>

      <div v-else class="mt-3 space-y-2">
        <article
          v-for="participant in waitingRoom"
          :key="participant.socketId"
          class="flex items-center justify-between rounded-xl border border-dark-700/70 bg-dark-800/70 px-3 py-2"
        >
          <div>
            <p class="text-sm font-medium text-dark-100">{{ participant.name }}</p>
            <p class="text-xs text-dark-400">{{ participant.role }}</p>
          </div>
          <button
            type="button"
            class="rounded-lg border border-dark-600 bg-dark-700 px-3 py-1.5 text-xs text-dark-100 transition hover:bg-dark-600"
            @click="$emit('admit', participant.socketId)"
          >
            Admit
          </button>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import type { Participant } from '~/types/classroom'

const props = defineProps<{
  role: 'teacher' | 'student'
  localStream: MediaStream | null
  waitingRoom: Participant[]
  requestedToJoin: boolean
  isMuted: boolean
  isCameraOff: boolean
}>()

const cameras = ref<MediaDeviceInfo[]>([])
const microphones = ref<MediaDeviceInfo[]>([])
const speakers = ref<MediaDeviceInfo[]>([])
const selectedCameraId = ref('')
const selectedMicrophoneId = ref('')
const selectedSpeakerId = ref('')

const emit = defineEmits<{
  (event: 'change-camera', deviceId: string): void
  (event: 'change-microphone', deviceId: string): void
  (event: 'start-session'): void
  (event: 'request-join'): void
  (event: 'admit', socketId: string): void
  (event: 'toggle-mute'): void
  (event: 'toggle-camera'): void
}>()

const loadDevices = async () => {
  if (!navigator.mediaDevices?.enumerateDevices) return

  const devices = await navigator.mediaDevices.enumerateDevices()
  cameras.value = devices.filter((device) => device.kind === 'videoinput')
  microphones.value = devices.filter((device) => device.kind === 'audioinput')
  speakers.value = devices.filter((device) => device.kind === 'audiooutput')
}

watch(selectedCameraId, (value) => {
  emit('change-camera', value)
})

watch(selectedMicrophoneId, (value) => {
  emit('change-microphone', value)
})

onMounted(() => {
  void loadDevices()
  navigator.mediaDevices?.addEventListener('devicechange', loadDevices)
})

onUnmounted(() => {
  navigator.mediaDevices?.removeEventListener('devicechange', loadDevices)
})
</script>
