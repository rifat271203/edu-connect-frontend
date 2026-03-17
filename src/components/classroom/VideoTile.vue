<!-- src/components/classroom/VideoTile.vue -->
<template>
  <article :class="tileClass" class="relative overflow-hidden rounded-2xl border border-dark-700/70 bg-dark-900/80">
    <video
      ref="videoRef"
      autoplay
      playsinline
      :muted="isLocal"
      class="h-full w-full object-cover"
    />

    <div v-if="!stream" class="absolute inset-0 flex items-center justify-center bg-dark-900/80 text-sm text-dark-300">
      No video
    </div>

    <div class="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
      <span>{{ participantName }}</span>
    </div>

    <div class="absolute right-3 top-3 flex items-center gap-2">
      <span
        v-if="isMuted"
        class="rounded-full bg-red-500/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
      >
        Muted
      </span>

      <span
        v-if="hasHandRaised"
        class="animate-bounce rounded-full bg-amber-400/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-dark-900"
      >
        Hand
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  stream: MediaStream | null
  participantName: string
  isMuted: boolean
  hasHandRaised: boolean
  isLocal: boolean
  size: 'large' | 'small' | 'pip'
}>()

const videoRef = ref<HTMLVideoElement | null>(null)

const tileClass = computed(() => {
  if (props.size === 'large') {
    return 'h-[48vh] min-h-[320px] w-full'
  }

  if (props.size === 'pip') {
    return 'h-40 w-56 shadow-2xl'
  }

  return 'h-52 w-full'
})

watchEffect(() => {
  if (!videoRef.value) return
  videoRef.value.srcObject = props.stream
})
</script>

