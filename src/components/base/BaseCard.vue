<template>
  <UiCard
    :hover="hover"
    :padding="padding"
    class="rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm"
  >
    <slot />
  </UiCard>
</template>

<script setup lang="ts">
interface Props {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  hover: false,
  padding: 'md',
})
</script>

