<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
      @click="emit('close')"
    >
      <div
        class="w-full max-w-4xl rounded-2xl border border-dark-700 bg-dark-900 p-4 sm:p-5 shadow-2xl"
        @click.stop
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <p class="text-xs uppercase tracking-wide text-dark-400">Math Zoom</p>
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="rounded-md border border-dark-600 bg-dark-800/70 px-2.5 py-1 text-xs text-dark-200 hover:bg-dark-700"
              @click="copyEquation"
            >
              Copy
            </button>
            <button
              type="button"
              class="rounded-md border border-dark-600 bg-dark-800/70 px-2.5 py-1 text-xs text-dark-200 hover:bg-dark-700"
              @click="emit('close')"
            >
              Close
            </button>
          </div>
        </div>

        <p v-if="copyFeedback" class="mb-2 text-xs text-accent-light">{{ copyFeedback }}</p>

        <MathBlock
          :content="content"
          :display-mode="true"
          class="text-2xl sm:text-3xl leading-relaxed"
        />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import MathBlock from '~/components/math/MathBlock.vue'
import { copyToClipboard } from '~/utils/copy'

const props = defineProps<{
  open: boolean
  content: string
}>()

const emit = defineEmits<{
  close: []
}>()

const copyFeedback = ref('')

const copyEquation = async () => {
  const payload = (props.content ?? '').trim()
  if (!payload) {
    copyFeedback.value = 'No equation available to copy.'
    return
  }

  await copyToClipboard(payload, {
    successMessage: 'Equation copied.',
    errorMessage: 'Failed to copy equation.',
    onFeedback: (feedback) => {
      copyFeedback.value = feedback
    },
  })
}

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) copyFeedback.value = ''
  }
)
</script>
