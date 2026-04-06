<!-- src/components/classroom/ParticipantTile.vue -->
<template>
  <article
    :class="[
      tileClass,
      isSpeaking ? 'ring-2 ring-emerald-500' : 'ring-0',
    ]"
    class="relative overflow-hidden rounded-2xl border border-dark-700/70 bg-dark-900/80 transition-all"
  >
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
      <span>{{ displayName }}</span>
      <span v-if="isLocal" class="text-dark-300">(You)</span>
    </div>

    <div class="absolute right-3 top-3 flex items-center gap-2">
      <span
        v-if="isMuted"
        class="rounded-full bg-red-500/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
      >
        Muted
      </span>

      <span
        v-if="handRaised"
        class="animate-bounce rounded-full bg-amber-400/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-dark-900"
      >
        Hand
      </span>

      <span
        v-if="isCameraOff"
        class="rounded-full bg-dark-700/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
      >
        Camera Off
      </span>
    </div>
  </article>
</template>

<script setup lang="ts">
const props = defineProps<{
  userId: string
  displayName: string
  stream: MediaStream | null
  isMuted: boolean
  isCameraOff: boolean
  handRaised: boolean
  isSpeaking: boolean
  isLocal: boolean
  size?: 'large' | 'small' | 'pip'
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

// Bind stream to video element using watchEffect
watchEffect(() => {
  if (!videoRef.value) return
  videoRef.value.srcObject = props.stream
})

// Also bind on mount in case stream is already available
onMounted(() => {
  if (videoRef.value && props.stream) {
    videoRef.value.srcObject = props.stream
  }
})
</script>
