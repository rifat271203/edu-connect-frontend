<!-- src/components/classroom/ControlBar.vue -->
<template>
  <div class="fixed bottom-4 left-1/2 z-40 w-[min(96%,900px)] -translate-x-1/2 rounded-2xl border border-dark-700/70 bg-dark-900/90 p-3 shadow-2xl backdrop-blur">
    <div class="flex flex-wrap items-center justify-center gap-2">
      <button class="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700" type="button" @click="$emit('toggle-mute')">Mute</button>
      <button class="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700" type="button" @click="$emit('toggle-camera')">Camera</button>

      <template v-if="role === 'teacher'">
        <button class="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700" type="button" @click="$emit('toggle-screen-share')">Screen Share</button>
        <button class="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700" type="button" @click="$emit('toggle-participants')">Participants</button>
        <button class="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700" type="button" @click="$emit('toggle-chat')">Chat</button>
        <button class="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700" type="button" @click="$emit('toggle-record')">Record</button>
        <button class="rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-100 transition hover:bg-red-500/30" type="button" @click="$emit('end-session')">End Session</button>
      </template>

      <template v-else>
        <button class="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700" type="button" @click="$emit('toggle-hand-raise')">Hand Raise</button>
        <button class="rounded-xl border border-dark-600 bg-dark-800 px-3 py-2 text-sm text-dark-100 transition hover:bg-dark-700" type="button" @click="$emit('toggle-chat')">Chat</button>
        <button class="rounded-xl border border-red-500/40 bg-red-500/20 px-3 py-2 text-sm text-red-100 transition hover:bg-red-500/30" type="button" @click="$emit('leave-session')">Leave</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  role: 'teacher' | 'student'
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
