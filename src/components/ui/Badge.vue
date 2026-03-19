<template>
  <span
    :class="[
      'inline-flex items-center justify-center font-semibold uppercase tracking-[0.1em] rounded-full',
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
  variant?: 'accent' | 'success' | 'warning' | 'danger' | 'neutral' | 'active' | 'approved' | 'pending' | 'inactive'
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
    sm: 'px-2 py-[2px] text-[10px]',
    md: 'px-2.5 py-[3px] text-[10px]',
    lg: 'px-3 py-1 text-[10px]'
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    accent: 'bg-[rgba(196,164,100,0.12)] text-[var(--gold)] border border-transparent',
    active: 'bg-[rgba(196,164,100,0.12)] text-[var(--gold)] border border-transparent',
    success: 'bg-[rgba(52,211,153,0.1)] text-[#34d399] border border-transparent',
    approved: 'bg-[rgba(52,211,153,0.1)] text-[#34d399] border border-transparent',
    warning: 'bg-[rgba(196,164,100,0.12)] text-[var(--gold)] border border-transparent',
    pending: 'bg-[rgba(196,164,100,0.12)] text-[var(--gold)] border border-transparent',
    danger: 'bg-[rgba(239,68,68,0.1)] text-[rgba(239,68,68,0.9)] border border-[rgba(239,68,68,0.3)]',
    neutral: 'bg-[var(--surface3)] text-[var(--t3)] border border-transparent',
    inactive: 'bg-[var(--surface3)] text-[var(--t3)] border border-transparent'
  }
  return variants[props.variant]
})
</script>
