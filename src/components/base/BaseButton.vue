<template>
  <UiButton :type="type" :variant="variant" :size="size" :disabled="disabled" :loading="loading" :class="className">
    <template #icon-left>
      <slot name="icon-left" />
    </template>
    <slot />
    <template #icon-right>
      <slot name="icon-right" />
    </template>
  </UiButton>
</template>

<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  className: '',
})
</script>

