<!-- src/components/classroom/ParticipantGrid.vue -->
<template>
  <div :class="gridClass" class="grid gap-3">
    <!-- Local participant tile -->
    <ParticipantTile
      v-if="localStream"
      :user-id="localUserId"
      :display-name="localDisplayName"
      :stream="localStream"
      :is-muted="isLocalMuted"
      :is-camera-off="isLocalCameraOff"
      :hand-raised="localHandRaised"
      :is-speaking="false"
      :is-local="true"
      :size="tileSize"
    />

    <!-- Remote participant tiles -->
    <ParticipantTile
      v-for="participant in participants"
      :key="participant.socketId"
      :user-id="participant.socketId"
      :display-name="participant.name"
      :stream="getStreamForParticipant(participant.socketId)"
      :is-muted="participant.isMuted"
      :is-camera-off="participant.isCameraOff"
      :hand-raised="participant.hasHandRaised"
      :is-speaking="false"
      :is-local="false"
      :size="tileSize"
    />
  </div>
</template>

<script setup lang="ts">
import type { Participant } from '~/types/classroom'

const props = defineProps<{
  participants: Participant[]
  localStream: MediaStream | null
  remoteStreams: Map<string, MediaStream>
  localUserId: string
  localDisplayName: string
  isLocalMuted: boolean
  isLocalCameraOff: boolean
  localHandRaised: boolean
}>()

const totalParticipants = computed(() => {
  let count = props.participants.length
  if (props.localStream) count += 1
  return count
})

const gridClass = computed(() => {
  const count = totalParticipants.value

  if (count <= 1) {
    return 'grid-cols-1'
  }

  if (count === 2) {
    return 'grid-cols-1 md:grid-cols-2'
  }

  if (count <= 4) {
    return 'grid-cols-2'
  }

  return 'grid-cols-2 md:grid-cols-3'
})

const tileSize = computed(() => {
  const count = totalParticipants.value

  if (count <= 1) {
    return 'large'
  }

  if (count <= 4) {
    return 'small'
  }

  return 'small'
})

const getStreamForParticipant = (socketId: string): MediaStream | null => {
  return props.remoteStreams.get(socketId) || null
}
</script>
