<template>
  <div class="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-surface-glass-border bg-dark-900/70 p-3">
    <UiButton :variant="isMuted ? 'danger' : 'secondary'" :disabled="disabled" @click="$emit('toggle-mic')">
      {{ isMuted ? 'Unmute' : 'Mute' }}
    </UiButton>

    <UiButton :variant="isCameraOff ? 'danger' : 'secondary'" :disabled="disabled" @click="$emit('toggle-camera')">
      {{ isCameraOff ? 'Camera On' : 'Camera Off' }}
    </UiButton>

    <UiButton variant="secondary" :disabled="disabled" @click="$emit('copy-link')">
      Copy meeting link
    </UiButton>

    <UiButton variant="danger" :disabled="disabled" @click="$emit('leave')">
      Leave Call
    </UiButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isMuted: boolean
  isCameraOff: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

defineEmits<{
  (e: 'toggle-mic'): void
  (e: 'toggle-camera'): void
  (e: 'copy-link'): void
  (e: 'leave'): void
}>()
</script>

