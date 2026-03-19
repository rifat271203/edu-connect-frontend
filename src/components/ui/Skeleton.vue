<template>
  <div
    :class="[
      'skeleton bg-[length:200%_100%] animate-shimmer rounded-[10px]',
      variantClasses,
      { 'rounded-full': circle }
    ]"
  />
</template>

<script setup lang="ts">
interface Props {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string
  height?: string
  circle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  circle: false
})

const variantClasses = computed(() => {
  if (props.circle) return ''
  
  const variants = {
    text: 'h-4 w-full',
    circular: 'h-12 w-12',
    rectangular: 'h-32 w-full'
  }
  
  let classes = variants[props.variant]
  
  if (props.width) classes += ` w-[${props.width}]`
  if (props.height) classes += ` h-[${props.height}]`
  
  return classes
})
</script>
