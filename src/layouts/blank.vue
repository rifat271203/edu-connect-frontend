<template>
  <div class="blank-layout">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Blank layout for login/auth pages - solid black background
</script>

<style scoped>
.blank-layout {
  min-height: 100vh;
  background-color: rgb(var(--color-dark-950));
}
</style>
