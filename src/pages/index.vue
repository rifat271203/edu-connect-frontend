<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// Redirect to login
onMounted(() => {
  navigateTo('/login')
})
</script>
