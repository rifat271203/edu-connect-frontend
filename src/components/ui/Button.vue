<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-[600] text-[13.5px] leading-none transition-all duration-150',
      'focus:outline-none focus-visible:shadow-[0_0_0_3px_var(--gold-dim)]',
      'disabled:cursor-not-allowed disabled:pointer-events-none',
      sizeClasses,
      variantClasses,
      block ? 'w-full' : '',
      { 'cursor-wait': loading }
    ]"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin"
      :class="iconSizeClasses"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    
    <!-- Icon (left) -->
    <slot name="icon-left" />
    
    <!-- Content -->
    <span :class="{ 'opacity-0': loading }">
      <slot />
    </span>
    
    <!-- Icon (right) -->
    <slot name="icon-right" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  icon: false
})

const sizeClasses = computed(() => {
  if (props.icon) {
    const sizes = {
      sm: 'w-8 h-8 p-0 rounded-[10px]',
      md: 'w-10 h-10 p-0 rounded-[12px]',
      lg: 'w-12 h-12 p-0 rounded-[14px]'
    }
    return sizes[props.size]
  }
  
  const sizes = {
    sm: 'h-8 px-3 text-[13px] rounded-[8px]',
    md: 'h-10 px-4 text-[13.5px] rounded-[8px]',
    lg: 'h-10 px-5 text-[13.5px] rounded-[8px]'
  }
  return sizes[props.size]
})

const iconSizeClasses = computed(() => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger'
  }
  return variants[props.variant]
})
</script>
