<template>
  <UiBadge :variant="variant" :size="size" :dot="dot" :pulse="pulse">
    <slot />
  </UiBadge>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'accent' | 'success' | 'warning' | 'danger' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  pulse?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'accent',
  size: 'md',
  dot: false,
  pulse: false,
})
</script>

