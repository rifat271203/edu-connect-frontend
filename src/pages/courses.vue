<template>
  <div class="mx-auto max-w-3xl px-4 py-12">
    <BaseCard class="text-center">
      <p class="text-4xl">📘</p>
      <h1 class="mt-2 text-xl font-semibold">Course Catalog</h1>
      <p class="mt-1 text-sm text-slate-500 dark:text-dark-300">
        This page is used as a safe redirect when classroom access validation fails.
      </p>
      <div class="mt-4">
        <BaseButton @click="navigateTo('/classroom')">Go to Classroom Feed</BaseButton>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main',
})

useHead({
  title: 'Courses',
})
</script>

