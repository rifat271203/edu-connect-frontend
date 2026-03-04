<template>
  <span
    :class="[
      'inline-flex items-center justify-center font-medium rounded-full',
      sizeClasses,
      variantClasses,
      { 'animate-pulse': pulse }
    ]"
  >
    <span v-if="dot" class="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'accent' | 'success' | 'warning' | 'danger' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  pulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'accent',
  size: 'md',
  dot: false,
  pulse: false
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-1.5 py-0.5 text-2xs',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-sm'
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    accent: 'bg-accent/20 text-accent-light',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    neutral: 'bg-dark-700 text-dark-200'
  }
  return variants[props.variant]
})
</script>
