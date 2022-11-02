<script setup>
import { useModelWrapper } from "./composables/model"

const props = defineProps({
  placeholder: { type: String },
  icon: { type: String },
  type: { type: String, default: "text" },
  modelValue: {},
  busy: { type: Boolean, default: false }
})

const emit = defineEmits(["update:modelValue"])
const modelValue = useModelWrapper(props, emit, "modelValue")
</script>

<template>
  <div class="input input-field" :class="{ icon: !!props.icon }">
    <div class="icon" v-if="!!props.icon">{{ props.icon }}</div>
    <input
      :disabled="busy"
      :type="props.type"
      :placeholder="props.placeholder"
      v-model="modelValue"
    />
  </div>
</template>

<style lang="less" scoped>
.input-field {
  width: 100%;
  background: var(--color-foreground);
  position: relative;

  .icon {
    position: absolute;
    left: 0.75rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    width: 21px;
  }

  input {
    border: none;
    background: none;
    width: 100%;
    padding: 0.75rem 1rem;
    outline: none;
    border-top: 1px solid var(--color-foreground);
    border-bottom: 1px solid var(--color-foreground);

    &:focus-visible {
      border-bottom: 1px solid var(--color-accent);
    }
  }

  &.icon input {
    padding: 0.75rem 1rem 0.75rem 3rem;
  }
}
</style>
