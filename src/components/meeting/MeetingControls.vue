<template>
  <div class="flex flex-col items-center gap-4">
    <div class="relative group">
      <!-- Glow effect behind the bar -->
      <div class="absolute -inset-4 bg-red-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div class="relative flex items-center gap-2 p-2 rounded-[24px] border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        <!-- Toggle Mic -->
        <button
          @click="$emit('toggle-mic')"
          :disabled="disabled"
          class="h-12 w-12 flex items-center justify-center rounded-[18px] transition-all duration-300"
          :class="[
            isMuted 
              ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          ]"
        >
          <span class="material-symbols-rounded text-2xl">
            {{ isMuted ? 'mic_off' : 'mic' }}
          </span>
        </button>

        <!-- Toggle Camera -->
        <button
          @click="$emit('toggle-camera')"
          :disabled="disabled"
          class="h-12 w-12 flex items-center justify-center rounded-[18px] transition-all duration-300"
          :class="[
            isCameraOff 
              ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          ]"
        >
          <span class="material-symbols-rounded text-2xl">
            {{ isCameraOff ? 'videocam_off' : 'videocam' }}
          </span>
        </button>

        <div class="w-px h-6 bg-white/10 mx-1" />

        <!-- Copy Link -->
        <button
          @click="$emit('copy-link')"
          :disabled="disabled"
          class="h-12 px-4 flex items-center gap-2 rounded-[18px] bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all duration-300"
        >
          <span class="material-symbols-rounded text-[20px]">content_copy</span>
          <span class="hidden md:inline text-[13px] font-bold tracking-tight">Copy Link</span>
        </button>

        <div class="w-px h-6 bg-white/10 mx-1" />

        <!-- Leave Call -->
        <button
          @click="$emit('leave')"
          :disabled="disabled"
          class="h-12 px-5 flex items-center gap-2 rounded-[18px] bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group/leave"
        >
          <span class="material-symbols-rounded text-2xl group-hover/leave:translate-x-1 transition-transform">logout</span>
          <span class="hidden md:inline text-[13px] font-bold tracking-tight">End Session</span>
        </button>
      </div>
    </div>
    
    <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20 select-none">
      Secure end-to-end encrypted session
    </p>
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
