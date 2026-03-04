<template>
  <div class="border-t border-dark-700/60 bg-dark-950/95 backdrop-blur-xl px-4 lg:px-6 py-4">
    <div class="max-w-4xl mx-auto">
      <div class="rounded-2xl border border-dark-700/70 bg-dark-900/60 p-2.5 flex items-end gap-2">
        <div class="flex-1 relative">
          <textarea
            :value="modelValue"
            @input="onInput"
            @keydown.enter.exact.prevent="emitSend"
            :placeholder="placeholder"
            rows="1"
            maxlength="2000"
            class="w-full bg-transparent border-none rounded-xl px-2 py-2.5 pr-10 text-dark-50 placeholder:text-dark-500 focus:outline-none resize-none text-sm leading-relaxed"
            :disabled="disabled"
          ></textarea>

          <button
            v-if="modelValue.trim()"
            @click="emit('clear')"
            class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-dark-400 hover:text-dark-200 transition-colors"
            title="Clear input"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button
          @click="emitSend"
          :disabled="!modelValue.trim() || disabled"
          class="w-11 h-11 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-dark active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          title="Send message"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      <div class="flex items-center justify-between mt-2 px-1">
        <p class="text-xs text-dark-500">Enter to send • Shift+Enter for line break • LaTeX supported</p>
        <p class="text-xs text-dark-500">{{ modelValue.length }}/2000</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  disabled: boolean
  placeholder?: string
}>(), {
  placeholder: 'Ask a precise question and include context for the best answer'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send', value: string): void
  (e: 'clear'): void
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const emitSend = () => {
  emit('send', props.modelValue)
}
</script>
