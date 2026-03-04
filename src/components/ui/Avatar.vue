<template>
  <div 
    class="relative inline-flex shrink-0" 
    :class="[sizeClasses, { 'ring-2 ring-accent/30': hasRing }]"
  >
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      class="rounded-full object-cover bg-dark-700"
      :class="sizeClasses"
      @error="handleImageError"
    />
    <div
      v-else
      class="rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-medium"
      :class="sizeClasses"
    >
      <span :class="textSizeClasses">{{ initials }}</span>
    </div>
    
    <!-- Online indicator -->
    <span
      v-if="showOnline && online"
      class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dark-900 rounded-full"
    />
    
    <!-- Notification dot -->
    <span
      v-if="showDot"
      class="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  online?: boolean
  showOnline?: boolean
  showDot?: boolean
  hasRing?: boolean
  name?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'User avatar',
  size: 'md',
  online: false,
  showOnline: false,
  showDot: false,
  hasRing: false,
  name: ''
})

const imageError = ref(false)

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return sizes[props.size]
})

const textSizeClasses = computed(() => {
  const sizes = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl'
  }
  return sizes[props.size]
})

const initials = computed(() => {
  if (!props.name) return '?'
  const parts = props.name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return props.name.slice(0, 2).toUpperCase()
})

const handleImageError = () => {
  imageError.value = true
}
</script>
