<template>
  <div class="rounded-3xl border border-surface-glass-border bg-dark-900/85 p-3 shadow-card backdrop-blur-xl">
    <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3">
      <UiButton :variant="isMuted ? 'danger' : 'secondary'" :disabled="disabled" class="!h-11 !rounded-2xl !px-4" @click="$emit('toggle-mic')">
        <template #icon-left>
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M12 1v11m0 0a3 3 0 003-3V5a3 3 0 10-6 0v4a3 3 0 003 3zm-7 0a7 7 0 0014 0M12 19v4"
            />
          </svg>
        </template>
        {{ isMuted ? 'Unmute' : 'Mute' }}
      </UiButton>

      <UiButton :variant="isCameraOff ? 'danger' : 'secondary'" :disabled="disabled" class="!h-11 !rounded-2xl !px-4" @click="$emit('toggle-camera')">
        <template #icon-left>
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 4h2a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
            />
          </svg>
        </template>
        {{ isCameraOff ? 'Camera On' : 'Camera Off' }}
      </UiButton>

      <UiButton variant="secondary" :disabled="disabled" class="!h-11 !rounded-2xl !px-4" @click="$emit('copy-link')">
        <template #icon-left>
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M8 11h8m-8 4h5m-7 5h12a2 2 0 002-2V6a2 2 0 00-2-2H9.414a2 2 0 01-1.414-.586L6.586 2A2 2 0 005.172 1.414H4a2 2 0 00-2 2v15a2 2 0 002 2z"
            />
          </svg>
        </template>
        Copy Link
      </UiButton>

      <UiButton variant="danger" :disabled="disabled" class="!h-11 !rounded-2xl !px-5" @click="$emit('leave')">
        <template #icon-left>
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.8"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
            />
          </svg>
        </template>
        Leave Call
      </UiButton>
    </div>

    <p class="mt-2 text-center text-2xs text-dark-400">Meeting controls remain visible while you scroll.</p>
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

