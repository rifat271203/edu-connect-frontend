<template>
  <div 
    class="group relative overflow-hidden rounded-[28px] border bg-[#0D0D0E] transition-all duration-500 hover:scale-[1.02] shadow-2xl"
    :class="[
      isSpeaking ? 'border-red-500 ring-2 ring-red-500/20' : 'border-white/5 hover:border-white/10'
    ]"
  >
    <!-- Background Gradient for depth -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

    <video
      ref="videoRef"
      autoplay
      playsinline
      class="h-full min-h-[220px] md:min-h-[280px] w-full object-cover transition-opacity duration-700"
      :class="[!hasVisibleVideo ? 'opacity-0' : 'opacity-100']"
      :muted="muted"
    />

    <!-- Video Off / Placeholder State -->
    <div
      v-if="!hasVisibleVideo"
      class="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0D0E] transition-all duration-500"
    >
      <div class="relative">
        <div class="absolute inset-0 bg-red-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
        <div class="relative h-20 w-20 rounded-[24px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20">
          <span class="material-symbols-rounded text-4xl">videocam_off</span>
        </div>
      </div>
      <p class="mt-4 text-sm font-bold text-white/80 tracking-tight">{{ label }}</p>
      <div class="mt-1 flex items-center gap-1.5">
        <span class="h-1.5 w-1.5 rounded-full bg-red-500/50" />
        <span class="text-[11px] font-medium text-white/40 uppercase tracking-widest">Camera Off</span>
      </div>
    </div>

    <!-- User Label & Status Overlay -->
    <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2.5">
          <div 
            v-if="isMuted" 
            class="h-7 w-7 rounded-lg bg-red-500/20 backdrop-blur-md flex items-center justify-center border border-red-500/20 text-red-500"
          >
            <span class="material-symbols-rounded text-[16px]">mic_off</span>
          </div>
          <div class="min-w-0">
            <p class="text-[14px] font-bold text-white truncate drop-shadow-md">{{ label }}</p>
          </div>
        </div>
        
        <div class="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md px-2.5 py-1 border border-white/5">
          <div class="relative h-1.5 w-1.5">
            <div class="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
            <div class="relative h-full w-full rounded-full bg-green-500" />
          </div>
          <span class="text-[10px] font-bold text-white/90 uppercase tracking-wider">Live</span>
        </div>
      </div>
    </div>

    <!-- Speaking Indicator Glow -->
    <div 
      v-if="isSpeaking" 
      class="absolute top-4 right-4 h-8 w-8 rounded-full bg-red-500/10 backdrop-blur-md border border-red-500/20 flex items-center justify-center"
    >
      <div class="flex gap-0.5 items-end h-3">
        <div class="w-0.5 bg-red-500 animate-[bounce_0.6s_infinite]" />
        <div class="w-0.5 bg-red-500 animate-[bounce_0.8s_infinite]" />
        <div class="w-0.5 bg-red-500 animate-[bounce_0.4s_infinite]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  stream: MediaStream | null
  label: string
  muted?: boolean
  isSpeaking?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  muted: false,
  isSpeaking: false
})

const videoRef = ref<HTMLVideoElement | null>(null)

const hasVisibleVideo = computed(() => {
  if (!props.stream) return false
  return props.stream.getVideoTracks().some((track) => track.enabled)
})

const isMuted = computed(() => {
  if (!props.stream) return true
  return !props.stream.getAudioTracks().some((track) => track.enabled)
})

const syncVideoElement = async () => {
  if (!videoRef.value) return

  videoRef.value.srcObject = props.stream || null

  if (!props.stream) return

  try {
    await videoRef.value.play()
  } catch {
    // Autoplay may be blocked
  }
}

watch(
  () => props.stream,
  () => {
    syncVideoElement().catch(() => undefined)
  },
  { immediate: true }
)

onMounted(() => {
  syncVideoElement().catch(() => undefined)
})
</script>

<style scoped>
@keyframes bounce {
  0%, 100% { height: 4px; }
  50% { height: 12px; }
}
</style>
