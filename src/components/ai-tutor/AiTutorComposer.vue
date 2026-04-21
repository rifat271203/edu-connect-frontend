<template>
  <div class="flex-shrink-0 border-t border-slate-200 bg-white px-4 py-4 lg:px-10 lg:py-6 dark:border-white/10 dark:bg-[#0f1115]">
    <!-- Input Container -->
    <div class="flex items-end gap-3 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-2 lg:px-5 lg:py-3 dark:border-white/10 dark:bg-white/5">
      <!-- Textarea -->
      <textarea
        :value="modelValue"
        @input="onInput"
        @keydown.enter.exact.prevent="emitSend"
        @keydown.shift.enter.prevent="(e) => {
          const target = e.target as HTMLTextAreaElement
          target.value += '\n'
          onInput({ target } as any)
        }"
        :placeholder="placeholder"
        rows="1"
        maxlength="2000"
        class="flex-1 resize-none min-h-[22px] max-h-28 bg-transparent text-sm leading-relaxed text-slate-900 focus:outline-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="disabled"
      ></textarea>

      <!-- Right Section -->
      <div class="flex items-center gap-2 flex-shrink-0 lg:gap-3">
        <!-- Character Counter (hidden on mobile) -->
        <span class="hidden font-mono text-[11px] font-medium text-slate-400 lg:block dark:text-slate-500">
          {{ modelValue.length }}/2000
        </span>

        <!-- Send Button -->
        <button
          @click="emitSend"
          :disabled="!modelValue.trim() || disabled"
          class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-150"
          :class="[
            modelValue.trim() && !disabled
              ? 'bg-brand-primary text-white shadow-sm hover:bg-brand-primary/90 dark:bg-brand-primary dark:text-slate-900'
              : 'bg-slate-200 text-slate-400 dark:bg-white/10 dark:text-slate-600'
          ]"
          title="Send message"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8H3m9 0h9" />
          </svg>
        </button>
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
  if (props.modelValue.trim() && !props.disabled) {
    emit('send', props.modelValue)
  }
}
</script>
