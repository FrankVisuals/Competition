<script setup>
import { useModelWrapper } from "./composables/model"

const props = defineProps({
  placeholder: { type: String },
  modelValue: { type: Boolean },
  label: { type: String },
  busy: { type: Boolean, default: false }
})

const emit = defineEmits(["update:modelValue"])
const modelValue = useModelWrapper(props, emit, "modelValue")
</script>

<template>
  <label class="input toggle-field">
    <input
      :disabled="busy"
      type="checkbox"
      :data-checked="!!modelValue"
      v-model="modelValue"
    />
    <div class="toggle"></div>
    <span>{{ label }}</span>
  </label>
</template>

<style lang="less" scoped>
.toggle-field {
  width: 100%;
  padding: 0.25rem 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  input[data-checked="true"] + .toggle::after {
    transform: translateX(14px);
  }

  .toggle {
    width: 32px;
    height: 18px;
    margin-right: 1.25rem;
    border-radius: 15px;
    background: var(--color-foreground);
    border: 1px solid var(--color-border);
    position: relative;

    &::after {
      content: "";
      width: 16px;
      height: 16px;
      border: 1px solid var(--color-border);
      background: var(--color-border);
      border-radius: 50%;
      position: absolute;
      left: 0;
      top: 0;
      transition: transform ease 0.15s;
    }
  }

  input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
}
</style>
