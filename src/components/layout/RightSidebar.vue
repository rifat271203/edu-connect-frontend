<template>
  <aside class="hidden lg:flex flex-col w-80 fixed right-0 top-0 h-screen pt-20 p-6 space-y-10 dark:bg-[#09090b] bg-white border-l border-slate-200 dark:border-white/5 overflow-y-auto no-scrollbar">
    <!-- Live Workshops -->
    <div>
      <p class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Live Workshops</p>
      <div class="dark:bg-brand-primary/5 bg-brand-primary/5 rounded-[2rem] p-6 border border-brand-primary/20 relative overflow-hidden">
        <div class="absolute top-4 right-4 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase flex items-center gap-1">
          <span class="w-1 h-1 bg-white rounded-full animate-pulse"></span>
          LIVE
        </div>
        <h3 class="text-sm font-bold dark:text-white text-slate-900 mb-2 mt-2">Quantum Physics II</h3>
        <p class="text-[11px] text-slate-500 mb-6">Prof. S. Haque • 420 Students</p>
        <button class="w-full py-3 bg-brand-primary text-white font-bold text-xs uppercase rounded-xl shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all">
          Join Room
        </button>
      </div>
    </div>

    <!-- Footer Links -->
    <div class="mt-auto">
      <div class="flex flex-wrap gap-4 mb-4">
        <a href="#" class="text-[10px] font-bold text-slate-400 hover:text-brand-primary transition-colors">Privacy</a>
        <a href="#" class="text-[10px] font-bold text-slate-400 hover:text-brand-primary transition-colors">Safety</a>
        <a href="#" class="text-[10px] font-bold text-slate-400 hover:text-brand-primary transition-colors">Feedback</a>
      </div>
      <p class="text-[11px] text-slate-500 font-medium">© 2024 EduConnect BD Team</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
</script>

<style scoped>
.material-symbols-rounded {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
