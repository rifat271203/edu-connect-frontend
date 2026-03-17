<!-- src/components/classroom/StudentView.vue -->
<template>
  <section class="relative min-h-screen overflow-hidden bg-dark-950 pb-24">
    <VideoTile
      :stream="teacherStream"
      participant-name="Teacher"
      :is-muted="teacherMuted"
      :has-hand-raised="false"
      :is-local="false"
      size="large"
      class="h-screen"
    />

    <div
      ref="pipRef"
      class="absolute left-4 top-4 z-20 cursor-move select-none translate-x-[var(--pip-x,0px)] translate-y-[var(--pip-y,0px)]"
      @mousedown="onMouseDown"
    >
      <VideoTile
        :stream="localStream"
        participant-name="You"
        :is-muted="isMuted"
        :has-hand-raised="hasHandRaised"
        :is-local="true"
        size="pip"
      />
    </div>

    <ControlBar
      role="student"
      @toggle-mute="$emit('toggle-mute')"
      @toggle-camera="$emit('toggle-camera')"
      @toggle-hand-raise="$emit('toggle-hand-raise')"
      @toggle-chat="$emit('toggle-chat')"
      @leave-session="$emit('leave-session')"
    />
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  teacherStream: MediaStream | null
  localStream: MediaStream | null
  teacherMuted: boolean
  isMuted: boolean
  hasHandRaised: boolean
}>()

defineEmits<{
  (event: 'toggle-mute'): void
  (event: 'toggle-camera'): void
  (event: 'toggle-hand-raise'): void
  (event: 'toggle-chat'): void
  (event: 'leave-session'): void
}>()

const pipRef = ref<HTMLElement | null>(null)
const position = ref({ x: 16, y: 16 })
const dragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

const syncPipPosition = () => {
  if (!pipRef.value) return
  pipRef.value.style.setProperty('--pip-x', `${position.value.x}px`)
  pipRef.value.style.setProperty('--pip-y', `${position.value.y}px`)
}

const onMouseMove = (event: MouseEvent) => {
  if (!dragging.value) return

  const nextX = Math.max(0, event.clientX - dragOffset.value.x)
  const nextY = Math.max(0, event.clientY - dragOffset.value.y)
  position.value = { x: nextX, y: nextY }
  syncPipPosition()
}

const stopDragging = () => {
  dragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDragging)
}

const onMouseDown = (event: MouseEvent) => {
  if (!pipRef.value) return

  const rect = pipRef.value.getBoundingClientRect()
  dragging.value = true
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopDragging)
}

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopDragging)
})

onMounted(() => {
  syncPipPosition()
})
</script>

