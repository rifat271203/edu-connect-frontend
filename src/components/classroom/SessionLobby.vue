<!-- src/components/classroom/SessionLobby.vue -->
<template>
  <section class="mx-auto flex w-full max-w-6xl flex-col gap-4 p-4 md:p-6">
    <header class="rounded-2xl border border-dark-700/70 bg-dark-900/85 p-4">
      <h1 class="text-xl font-semibold text-dark-100">Session Lobby</h1>
      <p class="mt-1 text-sm text-dark-300">Check your camera and microphone before joining.</p>
    </header>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-[2fr,1fr]">
      <VideoTile
        :stream="localStream"
        participant-name="You"
        :is-muted="false"
        :has-hand-raised="false"
        :is-local="true"
        size="large"
      />

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

defineProps<{
  role: 'teacher' | 'student'
  localStream: MediaStream | null
  waitingRoom: Participant[]
  requestedToJoin: boolean
}>()

const cameras = ref<MediaDeviceInfo[]>([])
const microphones = ref<MediaDeviceInfo[]>([])
const selectedCameraId = ref('')
const selectedMicrophoneId = ref('')

const emit = defineEmits<{
  (event: 'change-camera', deviceId: string): void
  (event: 'change-microphone', deviceId: string): void
  (event: 'start-session'): void
  (event: 'request-join'): void
  (event: 'admit', socketId: string): void
}>()

const loadDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()
  cameras.value = devices.filter((device) => device.kind === 'videoinput')
  microphones.value = devices.filter((device) => device.kind === 'audioinput')
}

watch(selectedCameraId, (value) => {
  emit('change-camera', value)
})

watch(selectedMicrophoneId, (value) => {
  emit('change-microphone', value)
})

onMounted(() => {
  void loadDevices()
  navigator.mediaDevices.addEventListener('devicechange', loadDevices)
})

onUnmounted(() => {
  navigator.mediaDevices.removeEventListener('devicechange', loadDevices)
})
</script>

