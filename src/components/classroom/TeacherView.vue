<!-- src/components/classroom/TeacherView.vue -->
<template>
  <section class="min-h-screen bg-dark-950 pb-24">
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr,320px] lg:p-6">
      <div class="space-y-4">
        <div class="relative">
          <VideoTile
            :stream="localStream"
            participant-name="You"
            :is-muted="isMuted"
            :has-hand-raised="false"
            :is-local="true"
            size="large"
          />

          <div
            v-if="isRecording"
            class="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-red-500/85 px-3 py-1 text-xs font-semibold text-white"
          >
            <span class="h-2 w-2 animate-pulse rounded-full bg-white" />
            Recording
          </div>
        </div>

        <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
          <VideoTile
            v-for="participant in students"
            :key="participant.socketId"
            :stream="streamBySocketId(participant.socketId)"
            :participant-name="participant.name"
            :is-muted="participant.isMuted"
            :has-hand-raised="participant.hasHandRaised"
            :is-local="false"
            size="small"
          />
        </div>
      </div>

      <aside class="flex min-h-[420px] flex-col rounded-2xl border border-dark-700/70 bg-dark-900/85">
        <div class="flex border-b border-dark-700/70 p-2">
          <button
            type="button"
            class="flex-1 rounded-xl px-3 py-2 text-sm font-medium transition"
            :class="activePanel === 'participants' ? 'bg-dark-700 text-dark-100' : 'text-dark-300 hover:bg-dark-800'"
            @click="activePanel = 'participants'"
          >
            Participants
          </button>
          <button
            type="button"
            class="flex-1 rounded-xl px-3 py-2 text-sm font-medium transition"
            :class="activePanel === 'chat' ? 'bg-dark-700 text-dark-100' : 'text-dark-300 hover:bg-dark-800'"
            @click="activePanel = 'chat'"
          >
            Chat
          </button>
        </div>

        <div class="flex-1 p-2">
          <ParticipantPanel
            v-if="activePanel === 'participants'"
            role="teacher"
            :participants="participants"
            @mute-all="$emit('mute-all')"
            @mute-participant="handleMuteParticipant"
            @remove-participant="handleRemoveParticipant"
          />

          <ChatPanel
            v-else
            :messages="chatMessages"
            :is-open="activePanel === 'chat'"
            @send="handleSendChat"
          />
        </div>
      </aside>
    </div>

    <ControlBar
      role="teacher"
      @toggle-mute="$emit('toggle-mute')"
      @toggle-camera="$emit('toggle-camera')"
      @toggle-screen-share="$emit('toggle-screen-share')"
      @toggle-chat="activePanel = 'chat'"
      @toggle-participants="activePanel = 'participants'"
      @toggle-record="$emit('toggle-record')"
      @end-session="$emit('end-session')"
    />
  </section>
</template>

<script setup lang="ts">
import type { ChatMessage, Participant } from '~/types/classroom'

const props = defineProps<{
  localStream: MediaStream | null
  remoteStreams: Map<string, MediaStream>
  participants: Participant[]
  chatMessages: ChatMessage[]
  isMuted: boolean
  isRecording: boolean
}>()

const activePanel = ref<'participants' | 'chat'>('participants')

const students = computed(() => props.participants.filter((participant) => participant.role === 'student'))

const streamBySocketId = (socketId: string): MediaStream | null => props.remoteStreams.get(socketId) || null

const emit = defineEmits<{
  (event: 'toggle-mute'): void
  (event: 'toggle-camera'): void
  (event: 'toggle-screen-share'): void
  (event: 'toggle-record'): void
  (event: 'end-session'): void
  (event: 'send-chat', message: string): void
  (event: 'mute-all'): void
  (event: 'mute-participant', socketId: string): void
  (event: 'remove-participant', socketId: string): void
}>()

const handleMuteParticipant = (socketId: string) => {
  emit('mute-participant', socketId)
}

const handleRemoveParticipant = (socketId: string) => {
  emit('remove-participant', socketId)
}

const handleSendChat = (message: string) => {
  emit('send-chat', message)
}
</script>

