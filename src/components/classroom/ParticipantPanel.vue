<!-- src/components/classroom/ParticipantPanel.vue -->
<template>
  <section class="flex h-full flex-col rounded-2xl border border-dark-700/70 bg-dark-900/85">
    <header class="flex items-center justify-between border-b border-dark-700/70 px-4 py-3">
      <h3 class="text-sm font-semibold text-dark-100">Participants</h3>
      <button
        v-if="role === 'teacher'"
        type="button"
        class="rounded-lg border border-dark-600 bg-dark-800 px-2 py-1 text-xs text-dark-100 transition hover:bg-dark-700"
        @click="$emit('mute-all')"
      >
        Mute All
      </button>
    </header>

    <div class="flex-1 space-y-2 overflow-y-auto p-3">
      <article
        v-for="participant in participants"
        :key="participant.socketId"
        class="flex items-center justify-between rounded-xl border border-dark-700/70 bg-dark-800/70 px-3 py-2"
      >
        <div>
          <p class="text-sm font-medium text-dark-100">{{ participant.name }}</p>
          <div class="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-wide">
            <span class="rounded-full bg-dark-700 px-2 py-0.5 text-dark-300">{{ participant.role }}</span>
            <span v-if="participant.isMuted" class="rounded-full bg-red-500/80 px-2 py-0.5 text-white">Muted</span>
          </div>
        </div>

        <div v-if="role === 'teacher'" class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-lg border border-dark-600 bg-dark-800 px-2 py-1 text-xs text-dark-100 transition hover:bg-dark-700"
            @click="$emit('mute-participant', participant.socketId)"
          >
            Mute
          </button>
          <button
            type="button"
            class="rounded-lg border border-red-500/40 bg-red-500/20 px-2 py-1 text-xs text-red-100 transition hover:bg-red-500/30"
            @click="$emit('remove-participant', participant.socketId)"
          >
            Remove
          </button>
        </div>
      </article>

      <p v-if="participants.length === 0" class="text-sm text-dark-400">No participants found.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Participant } from '~/types/classroom'

defineProps<{
  role: 'teacher' | 'student'
  participants: Participant[]
}>()

defineEmits<{
  (event: 'mute-all'): void
  (event: 'mute-participant', socketId: string): void
  (event: 'remove-participant', socketId: string): void
}>()
</script>

