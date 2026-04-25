<template>
  <Transition name="slide-fade">
    <div v-if="visible" class="fixed top-6 right-6 z-[100] w-full max-w-[360px]">
      <div class="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0A0A0B]/80 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
        <!-- Glow Effect -->
        <div class="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/20 blur-3xl" />
        
        <div class="relative flex items-start gap-4">
          <!-- Icon Area -->
          <div class="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
             <div class="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10" />
             <svg class="relative w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
             </svg>
             <div class="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-500 border border-red-500/20">
                <span class="h-1 w-1 rounded-full bg-red-500 animate-ping" />
                Live Now
              </span>
              <span class="text-[11px] text-white/40 font-medium">Just started</span>
            </div>
            
            <h4 class="mt-1.5 text-[15px] font-bold text-white truncate">{{ data.courseTitle }}</h4>
            <p class="text-[12px] text-white/60 truncate">Instructor: {{ data.teacherName }}</p>
            
            <div class="mt-4 flex items-center gap-2">
              <UiButton size="sm" class="flex-1 !bg-white !text-black !rounded-xl !h-9 hover:!scale-[1.02] transition-transform" @click="onJoin">
                Join Class
              </UiButton>
              <button class="h-9 w-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/60 transition-colors" @click="close">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  data: {
    courseId: number | string
    courseTitle: string
    roomId: string
    teacherName: string
  }
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 10000
})

const visible = ref(true)
const router = useRouter()

const close = () => {
  visible.value = false
}

const onJoin = () => {
  router.push(`/meeting/${props.data.roomId}?role=student`)
  close()
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.7, 0, 0.84, 0);
}

.slide-fade-enter-from {
  transform: translateX(100%) translateY(-20px) scale(0.9);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%) scale(0.9);
  opacity: 0;
}
</style>
