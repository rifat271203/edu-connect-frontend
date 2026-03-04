<template>
  <transition name="chunk-drawer-fade">
    <div
      v-if="open"
      class="fixed inset-0 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-label="Reference Chunk Drawer"
    >
      <button
        type="button"
        class="absolute inset-0 bg-black/50"
        aria-label="Close reference chunk drawer"
        @click="emit('close')"
      />

      <transition name="chunk-drawer-slide">
        <aside class="absolute right-0 top-0 h-full w-full max-w-lg border-l border-dark-700/70 bg-dark-900/95 backdrop-blur p-5 sm:p-6 overflow-y-auto">
          <div class="flex items-start justify-between gap-4 mb-5">
            <div>
              <p class="text-[11px] uppercase tracking-wide text-dark-400">Reference Chunk</p>
              <p class="text-sm text-dark-200 mt-1">Inspect retrieval context used by the tutor</p>
            </div>
            <button
              type="button"
              class="rounded-lg border border-dark-600 px-2 py-1 text-xs text-dark-200 hover:bg-dark-800/70"
              @click="emit('close')"
            >
              Close
            </button>
          </div>

          <div class="rounded-xl border border-dark-700/65 bg-dark-950/45 p-4 space-y-4">
            <div>
              <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-1">Chunk ID</p>
              <p class="text-sm font-medium text-dark-100 break-all">{{ chunkId || '—' }}</p>
            </div>

            <div>
              <p class="text-[11px] uppercase tracking-wide text-dark-400 mb-2">Preview</p>

              <div v-if="isLoading" class="space-y-2">
                <div class="h-4 w-7/12 rounded skeleton"></div>
                <div class="h-3.5 w-full rounded skeleton"></div>
                <div class="h-3.5 w-[95%] rounded skeleton"></div>
                <div class="h-3.5 w-[80%] rounded skeleton"></div>
                <div class="h-24 w-full rounded skeleton mt-2"></div>
              </div>

              <div v-else-if="chunkData" class="space-y-2">
                <p v-if="chunkData.title" class="text-sm font-semibold text-accent-light">{{ chunkData.title }}</p>
                <p class="text-sm leading-relaxed whitespace-pre-wrap text-dark-200">{{ chunkData.content }}</p>
              </div>

              <p v-else class="text-sm text-dark-300">No chunk selected.</p>
            </div>
          </div>
        </aside>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
type ChunkPreview = {
  id: string
  title?: string
  content: string
}

const props = defineProps<{
  open: boolean
  chunkId: string | null
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const chunkData = ref<ChunkPreview | null>(null)
const isLoading = ref(false)

const fetchChunkById = async (chunkId: string): Promise<ChunkPreview> => {
  await new Promise(resolve => setTimeout(resolve, 450))

  return {
    id: chunkId,
    title: `Reference ${chunkId}`,
    content: `Chunk content preview for ${chunkId}...\n\nThis is a placeholder response and will be replaced with API-powered retrieval preview once backend chunk endpoints are available.`,
  }
}

watch(
  () => [props.open, props.chunkId] as const,
  async ([open, chunkId]) => {
    if (!open || !chunkId) {
      isLoading.value = false
      chunkData.value = null
      return
    }

    isLoading.value = true
    chunkData.value = null

    try {
      chunkData.value = await fetchChunkById(chunkId)
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.chunk-drawer-fade-enter-active,
.chunk-drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}

.chunk-drawer-fade-enter-from,
.chunk-drawer-fade-leave-to {
  opacity: 0;
}

.chunk-drawer-slide-enter-active,
.chunk-drawer-slide-leave-active {
  transition: transform 0.25s ease;
}

.chunk-drawer-slide-enter-from,
.chunk-drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
