<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        class="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close modal"
        @click="handleClose"
      />
      <div class="relative w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-xl" :class="maxWidthClass">
        <div class="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h3 class="text-sm font-semibold text-[var(--text)]">{{ title }}</h3>
          <button
            type="button"
            class="rounded-md p-1 text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
            aria-label="Close"
            @click="handleClose"
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="max-h-[75vh] overflow-y-auto p-4">
          <slot />
        </div>
        <div v-if="$slots.footer" class="border-t border-[var(--border)] px-4 py-3">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const maxWidthClass = computed(() => {
  const classes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }

  return classes[props.size]
})

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

