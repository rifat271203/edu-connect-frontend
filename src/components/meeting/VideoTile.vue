<template>
  <div class="relative overflow-hidden rounded-2xl border border-surface-glass-border bg-black/80">
    <video
      ref="videoRef"
      autoplay
      playsinline
      class="h-full min-h-56 w-full object-cover"
      :muted="muted"
    />

    <div class="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  stream: MediaStream | null
  label: string
  muted?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  muted: false,
})

const videoRef = ref<HTMLVideoElement | null>(null)

const syncVideoElement = async () => {
  if (!videoRef.value) return

  videoRef.value.srcObject = props.stream || null

  if (!props.stream) return

  try {
    await videoRef.value.play()
  } catch {
    // Autoplay may be blocked until user interaction.
  }
}

watch(
  () => [props.stream, props.muted] as const,
  () => {
    syncVideoElement().catch(() => undefined)
  },
  { immediate: true }
)

onMounted(() => {
  syncVideoElement().catch(() => undefined)
})
</script>

