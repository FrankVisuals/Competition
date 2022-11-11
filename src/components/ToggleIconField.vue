<script setup>
import { useModelWrapper } from "./composables/model"

const props = defineProps({
  modelValue: { type: Boolean },
  busy: { type: Boolean, default: false }
})

const emit = defineEmits(["update:modelValue"])
const modelValue = useModelWrapper(props, emit, "modelValue")
</script>

<template>
  <label
    class="input toggle-icon-field"
    :class="{ active: props.modelValue, disabled: busy }"
  >
    <input
      type="checkbox"
      :disabled="busy"
      :data-checked="!!modelValue"
      v-model="modelValue"
    />

    <slot name="inactive" v-if="props.modelValue"></slot>
    <slot name="active" v-if="!props.modelValue"></slot>
  </label>
</template>

<style lang="less" scoped>
.toggle-icon-field {
  width: 100%;
  padding: 0.25rem 1rem;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::v-deep svg {
    opacity: 0.5;
    fill: var(--color-border);
  }

  &.active::v-deep {
    svg {
      opacity: 1;
      fill: #e4cc37;
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
