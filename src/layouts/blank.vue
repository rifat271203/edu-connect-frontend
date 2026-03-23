<template>
  <div class="blank-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Blank layout for login/auth pages - solid dark background
</script>

<style scoped>
.blank-layout {
  min-height: 100vh;
  /* Use direct color instead of CSS variable to prevent hydration mismatch */
  background-color: #07090f;
  box-sizing: border-box;
}

/* Ensure all children use border-box */
.blank-layout,
.blank-layout * {
  box-sizing: border-box;
}

/* Prevent horizontal scroll and ensure centered content */
.blank-layout :deep(main) {
  max-width: 100%;
  overflow-x: hidden;
}
</style>
