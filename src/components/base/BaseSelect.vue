<template>
  <div>
    <label v-if="label" :for="id" class="mb-1.5 block text-xs font-semibold text-[var(--text-2)]">
      {{ label }}
    </label>
    <select
      :id="id"
      :value="modelValue"
      :disabled="disabled"
      class="select-field h-11 w-full rounded-xl px-3 text-sm"
      :class="{ 'is-error': Boolean(error) }"
      @change="onChange"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="mt-1 text-xs text-[var(--danger)]">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  label: string
  value: string
}

interface Props {
  modelValue?: string
  options: SelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
  id?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  disabled: false,
  id: undefined,
  error: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

