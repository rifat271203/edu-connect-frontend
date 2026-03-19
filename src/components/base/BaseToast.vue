<template>
  <Teleport to="body">
    <div class="pointer-events-none fixed right-4 top-4 z-[120] flex w-[min(92vw,360px)] flex-col gap-2">
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto overflow-hidden rounded-xl border bg-[var(--surface)] shadow-lg"
          :class="toastClass(toast.type)"
        >
          <div class="flex items-start gap-3 p-3">
            <div class="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" :class="dotClass(toast.type)" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-[var(--text)]">{{ toast.title }}</p>
              <p v-if="toast.message" class="mt-0.5 text-xs text-[var(--text-2)]">{{ toast.message }}</p>
            </div>
            <button
              type="button"
              class="rounded-md p-1 text-[var(--text-3)] transition hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
              aria-label="Dismiss notification"
              @click="remove(toast.id)"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { ToastItem } from '~/composables/useToast'

const { toasts, remove } = useToast()

const toastClass = (type: ToastItem['type']) => {
  if (type === 'success') return 'border-emerald-200/70 dark:border-emerald-900/50'
  if (type === 'error') return 'border-red-200/70 dark:border-red-900/50'
  return 'border-indigo-200/70 dark:border-indigo-900/50'
}

const dotClass = (type: ToastItem['type']) => {
  if (type === 'success') return 'bg-emerald-500'
  if (type === 'error') return 'bg-red-500'
  return 'bg-indigo-500'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>

