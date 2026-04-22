<template>
  <div class="flex-shrink-0 bg-transparent px-6 pb-6">
    <!-- Premium Floating Glass Input Pill -->
    <div 
      class="relative mx-auto max-w-4xl w-full rounded-[30px] border border-slate-200/50 bg-white/70 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.06)] backdrop-blur-3xl transition-all duration-500 focus-within:border-brand-primary/40 focus-within:shadow-[0_20px_60px_rgba(var(--brand-primary-rgb),0.1)] dark:border-white/10 dark:bg-[#111827]/80 dark:shadow-none dark:focus-within:border-brand-primary/30"
    >
      <!-- Background subtle glow -->
      <div class="absolute -inset-px -z-10 rounded-[30px] bg-gradient-to-b from-brand-primary/5 to-transparent opacity-0 transition-opacity duration-500 focus-within:opacity-100" />

      <div class="flex items-end gap-3 px-3">
        <!-- Textarea -->
        <textarea
          ref="textareaRef"
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
          class="flex-1 resize-none min-h-[48px] max-h-52 bg-transparent py-3 text-[15px] leading-relaxed text-slate-900 focus:outline-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed thin-scrollbar font-medium"
          :disabled="disabled"
        ></textarea>

        <!-- Premium Action Button -->
        <div class="flex items-center pb-2 pr-1">
          <button
            @click="emitSend"
            :disabled="!modelValue.trim() || disabled"
            class="group relative flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-[22px] transition-all duration-300"
            :class="[
              modelValue.trim() && !disabled
                ? 'bg-brand-primary text-white shadow-[0_8px_20px_-4px_rgba(var(--brand-primary-rgb),0.4)] hover:scale-105 active:scale-95'
                : 'bg-slate-100 text-slate-300 dark:bg-white/5 dark:text-slate-700'
            ]"
            title="Send message"
          >
            <div class="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            
            <svg v-if="!disabled" class="relative z-10 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8H3m9 0h9" />
            </svg>
            <svg v-else class="relative z-10 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Minimal branding/status -->
    <p class="mt-3 text-center text-[9px] font-black uppercase tracking-[2.5px] text-slate-400/60 dark:text-slate-500/50">
      Academic Intelligence Core
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  disabled: boolean
  placeholder?: string
}>(), {
  placeholder: 'How can I help you excel today?'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send', value: string): void
  (e: 'clear'): void
}>()

const textareaRef = ref<HTMLTextAreaElement | null>(null)

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
  
  target.style.height = 'auto'
  target.style.height = `${target.scrollHeight}px`
}

const emitSend = () => {
  if (props.modelValue.trim() && !props.disabled) {
    emit('send', props.modelValue)
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  }
}

watch(() => props.modelValue, (newVal) => {
  if (newVal === '' && textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }
})
</script>

<style scoped>
.thin-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.thin-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.thin-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.dark .thin-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
}
</style>
