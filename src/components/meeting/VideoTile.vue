<template>
  <div class="group relative overflow-hidden rounded-3xl border border-surface-glass-border bg-dark-900/90 shadow-card transition-all duration-300 hover:border-accent/35 hover:shadow-card-hover">
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/10 opacity-70" />

    <video
      ref="videoRef"
      autoplay
      playsinline
      class="h-full min-h-56 w-full object-cover transition duration-500 group-hover:scale-[1.01]"
      :muted="muted"
    />

    <div
      v-if="!stream || !hasVisibleVideo"
      class="absolute inset-0 flex flex-col items-center justify-center bg-dark-900/80 text-center"
    >
      <div class="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-dark-700/70 text-dark-100">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 4h2a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
      </div>
      <p class="text-sm font-medium text-dark-100">{{ label }}</p>
      <p class="mt-1 text-xs text-dark-300">
        {{ stream ? 'Video is currently off' : 'Waiting for stream...' }}
      </p>
    </div>

    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 pb-3 pt-6">
      <div class="flex items-end justify-between gap-2">
        <div>
          <p class="text-sm font-medium text-white drop-shadow">{{ label }}</p>
          <p class="text-2xs text-white/75">{{ streamStateLabel }}</p>
        </div>
        <span class="inline-flex items-center gap-1 rounded-lg bg-black/45 px-2 py-1 text-2xs text-white/90">
          <span class="h-1.5 w-1.5 rounded-full" :class="stream ? 'bg-green-400' : 'bg-dark-400'" />
          {{ stream ? 'Live' : 'Idle' }}
        </span>
      </div>
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

const hasVisibleVideo = computed(() => {
  if (!props.stream) return false
  return props.stream.getVideoTracks().some((track) => track.enabled)
})

const streamStateLabel = computed(() => {
  if (!props.stream) return 'Not connected'

  const audioTrack = props.stream.getAudioTracks()[0]
  const videoTrack = props.stream.getVideoTracks()[0]

  const audioState = audioTrack?.enabled ? 'Mic on' : 'Mic off'
  const videoState = videoTrack?.enabled ? 'Camera on' : 'Camera off'

  return `${audioState} · ${videoState}`
})

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
  () => [props.stream, props.muted, hasVisibleVideo.value] as const,
  () => {
    syncVideoElement().catch(() => undefined)
  },
  { immediate: true }
)

onMounted(() => {
  syncVideoElement().catch(() => undefined)
})
</script>

