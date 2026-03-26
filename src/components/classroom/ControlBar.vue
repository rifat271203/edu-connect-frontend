<!-- src/components/classroom/ControlBar.vue -->
<template>
  <div class="fixed bottom-4 left-1/2 z-40 w-[min(96%,900px)] -translate-x-1/2 rounded-2xl border border-dark-700/70 bg-dark-900/90 p-3 shadow-2xl backdrop-blur">
    <div class="flex flex-wrap items-center justify-center gap-2">
      <!-- Mic Toggle -->
      <button
        class="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition"
        :class="isMuted ? 'border-red-500/40 bg-red-500/20 text-red-100 hover:bg-red-500/30' : 'border-dark-600 bg-dark-800 text-dark-100 hover:bg-dark-700'"
        type="button"
        @click="$emit('toggle-mute')"
      >
        <svg v-if="!isMuted" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
        {{ isMuted ? 'Unmute' : 'Mute' }}
      </button>

      <!-- Camera Toggle -->
      <button
        class="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition"
        :class="isCameraOff ? 'border-red-500/40 bg-red-500/20 text-red-100 hover:bg-red-500/30' : 'border-dark-600 bg-dark-800 text-dark-100 hover:bg-dark-700'"
        type="button"
        @click="$emit('toggle-camera')"
      >
        <svg v-if="!isCameraOff" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18" />
        </svg>
        {{ isCameraOff ? 'Show Camera' : 'Hide Camera' }}
      </button>

      <!-- Teacher-only controls -->
      <template v-if="role === 'teacher'">
        <!-- Screen Share Toggle -->
        <button
          class="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition"
          :class="isScreenSharing ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30' : 'border-dark-600 bg-dark-800 text-dark-100 hover:bg-dark-700'"
          type="button"
          @click="$emit('toggle-screen-share')"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ isScreenSharing ? 'Stop Share' : 'Share Screen' }}
        </button>

        <!-- Participants Button -->
        <button
          class="flex items-center gap-2 rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700"
          type="button"
          @click="$emit('toggle-participants')"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          Participants
        </button>

        <!-- Chat Button -->
        <button
          class="flex items-center gap-2 rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700"
          type="button"
          @click="$emit('toggle-chat')"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat
        </button>

        <!-- Record Button -->
        <button
          class="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition"
          :class="isRecording ? 'border-red-500/40 bg-red-500/20 text-red-100 hover:bg-red-500/30' : 'border-dark-600 bg-dark-800 text-dark-100 hover:bg-dark-700'"
          type="button"
          @click="$emit('toggle-record')"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {{ isRecording ? 'Stop Rec' : 'Record' }}
        </button>

        <!-- End Session Button -->
        <button
          class="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-100 transition hover:bg-red-500/30"
          type="button"
          @click="$emit('end-session')"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
          </svg>
          End Session
        </button>
      </template>

      <!-- Student-only controls -->
      <template v-else>
        <!-- Raise Hand Button -->
        <button
          class="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition"
          :class="handRaised ? 'border-amber-500/40 bg-amber-500/20 text-amber-100 hover:bg-amber-500/30' : 'border-dark-600 bg-dark-800 text-dark-100 hover:bg-dark-700'"
          type="button"
          @click="$emit('toggle-hand-raise')"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
          </svg>
          {{ handRaised ? 'Lower Hand' : 'Raise Hand' }}
        </button>

        <!-- Chat Button -->
        <button
          class="flex items-center gap-2 rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700"
          type="button"
          @click="$emit('toggle-chat')"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat
        </button>

        <!-- Leave Session Button -->
        <button
          class="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-100 transition hover:bg-red-500/30"
          type="button"
          @click="$emit('leave-session')"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Leave
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  role: 'teacher' | 'student'
  isMuted: boolean
  isCameraOff: boolean
  isScreenSharing: boolean
  isRecording: boolean
  handRaised: boolean
}>()

defineEmits<{
  (event: 'toggle-mute'): void
  (event: 'toggle-camera'): void
  (event: 'toggle-screen-share'): void
  (event: 'toggle-hand-raise'): void
  (event: 'toggle-chat'): void
  (event: 'toggle-participants'): void
  (event: 'toggle-record'): void
  (event: 'end-session'): void
  (event: 'leave-session'): void
}>()
</script>
