<template>
  <div
    :class="[
      'ui-card relative overflow-hidden transition-all duration-150',
      hover ? 'ui-card--hoverable cursor-pointer' : '',
      paddingClasses
    ]"
  >
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  hover: false,
  padding: 'md'
})

const paddingClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'px-4 py-3.5',
    md: 'px-5 py-[18px]',
    lg: 'p-6'
  }
  return paddings[props.padding]
})
</script>
