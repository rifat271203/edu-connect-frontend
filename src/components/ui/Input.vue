<template>
  <div class="relative">
    <!-- Floating label -->
    <label
      v-if="label"
      :for="inputId"
        :class="[
          'absolute left-4 transition-all duration-150 pointer-events-none',
        isFocused || modelValue
          ? 'top-2 text-[11px] font-medium text-[var(--primary)]'
          : 'top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-3)]'
      ]"
    >
      {{ label }}
    </label>
    
    <!-- Input field -->
    <div class="relative">
      <!-- Icon (left) -->
      <div
        v-if="$slots['icon-left']"
        class="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
      >
        <slot name="icon-left" />
      </div>
      
      <input
        :id="inputId"
        :type="localType"
        :value="modelValue"
        :placeholder="isFocused || !label ? placeholder : ''"
        :disabled="disabled"
        :readonly="readonly"
        :class="[
          'ui-input w-full',
          'focus:outline-none transition-all duration-150 text-[13px]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error 
            ? 'is-error' 
            : '',
          label ? 'pt-5 pb-2 px-4 !h-[52px]' : 'px-4',
          $slots['icon-left'] ? 'pl-12' : '',
          $slots['icon-right'] || showPasswordToggle ? 'pr-12' : ''
        ]"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <!-- Icon (right) / Password toggle -->
      <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <slot name="icon-right" />
        
        <!-- Password toggle -->
        <button
          v-if="showPasswordToggle && localType === 'password'"
          type="button"
          class="text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
          @click="togglePassword"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
        
        <button
          v-if="showPasswordToggle && localType === 'text'"
          type="button"
          class="text-[var(--text-3)] hover:text-[var(--text)] transition-colors"
          @click="togglePassword"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Error message -->
    <p v-if="error" class="mt-1.5 text-sm text-[var(--danger)]">
      {{ error }}
    </p>
    
    <!-- Helper text -->
    <p v-else-if="hint" class="mt-1.5 text-sm text-[var(--text-3)]">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  type?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  readonly?: boolean
  showPasswordToggle?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  showPasswordToggle: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)
const isFocused = ref(false)
const localType = ref(props.type)

const togglePassword = () => {
  localType.value = localType.value === 'password' ? 'text' : 'password'
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}
</script>
