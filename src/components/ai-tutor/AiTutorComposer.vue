<template>
  <div class="border-t flex-shrink-0 px-4 lg:px-10 py-4 lg:py-6" :style="{ background: 'var(--bg)', borderColor: 'var(--line)' }">
    <!-- Input Container -->
    <div class="rounded-[18px] border flex items-end gap-3 px-4 lg:px-5 py-2 lg:py-3" :style="{ background: 'var(--bg3)', borderColor: 'var(--line2)' }">
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
        class="flex-1 resize-none min-h-[22px] max-h-28 bg-transparent text-sm leading-relaxed focus:outline-none"
        :style="{ 
          color: 'var(--text)',
          fontFamily: 'DM Sans',
          fontSize: '14px'
        }"
        :disabled="disabled"
      ></textarea>

      <!-- Right Section -->
      <div class="flex items-center gap-2 lg:gap-3 flex-shrink-0">
        <!-- Character Counter (hidden on mobile) -->
        <span class="hidden lg:block text-[11px] font-medium" :style="{ color: 'var(--text3)', fontFamily: 'DM Mono' }">
          {{ modelValue.length }}/2000
        </span>

        <!-- Send Button -->
        <button
          @click="emitSend"
          :disabled="!modelValue.trim() || disabled"
          class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150"
          :style="{ 
            background: modelValue.trim() && !disabled ? 'var(--gold)' : 'rgba(212,168,67,0.5)',
            color: !modelValue.trim() || disabled ? 'rgba(212,168,67,0.5)' : '#080c14'
          }"
          title="Send message"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8H3m9 0h9" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Hint Row (hidden on mobile) -->
    <!-- <div class="hidden lg:flex mt-3 items-center justify-center gap-4 text-[11px]" :style="{ fontFamily: 'DM Mono', color: 'var(--text3)' }">
      <div class="flex items-center gap-2">
        <kbd class="px-1.5 py-0.5 rounded border text-[10px]" :style="{ background: 'var(--bg4)', borderColor: 'var(--line2)', color: 'var(--text2)', fontFamily: 'DM Mono' }">↵</kbd>
        <span>To send</span>
      </div>
      <span>·</span>
      <div class="flex items-center gap-2">
        <kbd class="px-1.5 py-0.5 rounded border text-[10px]" :style="{ background: 'var(--bg4)', borderColor: 'var(--line2)', color: 'var(--text2)', fontFamily: 'DM Mono' }">Shift+↵</kbd>
        <span>Line break</span>
      </div>
      <span>·</span>
      <div style="color: 'var(--gold)', opacity: 0.7; fontFamily: 'DM Mono'">⚗️ LaTeX supported</div>
    </div> -->
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

<style scoped>
textarea::placeholder {
  color: var(--text3);
}

textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
