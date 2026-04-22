<!-- src/components/classroom/WaitingRoomPanel.vue -->
<template>
  <section class="flex h-full flex-col rounded-2xl border border-dark-700/70 bg-dark-900/85">
    <header class="flex items-center justify-between border-b border-dark-700/70 px-4 py-3">
      <h3 class="text-sm font-semibold text-dark-100">Waiting Room</h3>
      <span
        v-if="waitingRoom.length > 0"
        class="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300"
      >
        {{ waitingRoom.length }}
      </span>
    </header>

    <div class="flex-1 space-y-2 overflow-y-auto p-3">
      <article
        v-for="participant in waitingRoom"
        :key="participant.socketId"
        class="flex items-center justify-between rounded-xl border border-dark-700/70 bg-dark-800/70 px-3 py-2"
      >
        <div>
          <p class="text-sm font-medium text-dark-100">{{ participant.name }}</p>
          <p class="text-xs text-dark-400">{{ participant.role }}</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/30"
            @click="$emit('admit', participant.socketId)"
          >
            Admit
          </button>
          <button
            type="button"
            class="rounded-lg border border-red-500/40 bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-100 transition hover:bg-red-500/30"
            @click="$emit('deny', participant.socketId)"
          >
            Deny
          </button>
        </div>
      </article>

      <p v-if="waitingRoom.length === 0" class="text-sm text-dark-400">No students in waiting room.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Participant } from '~/types/classroom'

defineProps<{
  waitingRoom: Participant[]
}>()

defineEmits<{
  (event: 'admit', socketId: string): void
  (event: 'deny', socketId: string): void
}>()
</script>
