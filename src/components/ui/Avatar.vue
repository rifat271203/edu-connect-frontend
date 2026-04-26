<template>
  <div 
    class="relative inline-flex shrink-0 overflow-hidden" 
    :class="[sizeClasses, rounded, { 'ring-2 ring-[rgba(255,255,255,0.14)]': hasRing }]"
  >
    <img
      v-if="src && !imageError"
      :src="src"
      :alt="alt"
      class="object-cover bg-dark-700 w-full h-full"
      :class="rounded"
      @error="handleImageError"
    />
    <div
      v-else
      class="flex items-center justify-center text-white font-bold uppercase tracking-[0.02em] font-['DM_Sans'] w-full h-full"
      :class="[rounded]"
      :style="{ background: fallbackBackground }"
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
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  online?: boolean
  showOnline?: boolean
  showDot?: boolean
  hasRing?: boolean
  name?: string
  rounded?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'User avatar',
  size: 'md',
  online: false,
  showOnline: false,
  showDot: false,
  hasRing: false,
  name: '',
  rounded: 'rounded-full'
})

const imageError = ref(false)

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24 md:w-32 md:h-32'
  }
  return sizes[props.size]
})

const textSizeClasses = computed(() => {
  const sizes = {
    xs: 'text-[10px]',
    sm: 'text-xs',
    md: 'text-[13px]',
    lg: 'text-base',
    xl: 'text-xl',
    '2xl': 'text-3xl'
  }
  return sizes[props.size]
})

const fallbackPalette = ['#2d4a7a', '#3a6b4a', '#6b3a4a', '#4a3a6b', '#6b4a2d']

const colorHash = computed(() => {
  const seed = (props.name || props.alt || '').toLowerCase()
  if (!seed) return 0

  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }

  return Math.abs(hash)
})

const fallbackBackground = computed(() => fallbackPalette[colorHash.value % fallbackPalette.length])

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
