<template>
  <UiInput
    :model-value="modelValue"
    :type="type"
    :label="label"
    :placeholder="placeholder"
    :hint="hint"
    :error="error"
    :disabled="disabled"
    :readonly="readonly"
    :show-password-toggle="showPasswordToggle"
    :id="id"
    @update:model-value="emit('update:modelValue', $event)"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
  >
    <template #icon-left>
      <slot name="icon-left" />
    </template>
    <template #icon-right>
      <slot name="icon-right" />
    </template>
  </UiInput>
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

withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  hint: '',
  error: '',
  disabled: false,
  readonly: false,
  showPasswordToggle: false,
  id: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()
</script>

