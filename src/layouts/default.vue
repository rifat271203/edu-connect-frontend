<template>
  <div class="min-h-screen bg-[var(--theme-bg-base)] dark:bg-dark-950 relative overflow-hidden">
    <!-- Animated background -->
    <div class="fixed inset-0 bg-animated" />
    
    <!-- Premium gradient orbs -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <!-- Green orb - Primary -->
      <div class="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-emerald-400/70 via-green-400/65 to-teal-500/65 dark:from-theme-terracotta dark:via-accent dark:to-[#8B4D39] rounded-full blur-[140px] animate-float opacity-30 dark:opacity-20" />
      
      <!-- Blue/Accent orb - Secondary -->
      <div class="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-green-300/70 via-emerald-400/65 to-teal-500/60 dark:from-theme-terracotta dark:to-theme-darkgray rounded-full blur-[140px] animate-float-delayed opacity-25 dark:opacity-15" />
      
      <!-- Center blended gradient -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-emerald-300/25 via-green-300/15 to-transparent dark:from-theme-terracotta/20 dark:via-theme-darkgray/10 dark:to-transparent rounded-full blur-[150px] animate-pulse-glow-accent" />
      
      <!-- Accent highlight -->
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-t from-emerald-300/25 to-transparent dark:from-theme-terracotta/10 dark:to-transparent rounded-full blur-[120px]" />
    </div>
    
    <!-- Content -->
    <div class="relative z-10 min-h-screen flex items-center justify-center p-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Default layout for authentication pages
</script>
