<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h1 class="text-[32px] font-bold tracking-tight text-[var(--t1)]">Gradebook</h1>
      <p class="text-[var(--t3)]">Monitor your academic performance and feedback across all courses.</p>
    </div>

    <!-- Empty State / Placeholder -->
    <div class="rounded-[32px] border border-[var(--line)] bg-[var(--surface)] p-12 text-center">
      <div class="mx-auto w-20 h-20 rounded-[28px] bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)] mb-6">
        <span class="material-symbols-rounded text-4xl">assignment_turned_in</span>
      </div>
      <h2 class="text-xl font-bold text-[var(--t1)]">Coming Soon</h2>
      <p class="mt-2 text-[var(--t2)] max-w-sm mx-auto">
        We're working on a comprehensive grade tracking system to help you stay on top of your studies.
      </p>
      <div class="mt-8 flex justify-center">
        <UiButton variant="secondary" @click="navigateTo('/classroom')">
          Return to Classroom
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'main'
})

useHead({
  title: 'Gradebook • EduConnect'
})
</script>
