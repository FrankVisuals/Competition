<script setup>
import { useModelWrapper } from "./composables/model"

const props = defineProps({
  placeholder: { type: String },
  icon: { type: String },
  modelValue: {},
  busy: { type: Boolean, default: false },
  options: {
    type: Array,
    default: () => {
      return []
    }
  }
})

const emit = defineEmits(["update:modelValue"])
const modelValue = useModelWrapper(props, emit, "modelValue")
</script>

<template>
  <div class="input select-field" :class="{ icon: !!props.icon }">
    <div class="icon">{{ props.icon }}</div>
    <select :disabled="busy" v-model="modelValue">
      <option v-for="option in options" :key="option.key" :value="option.key">
        {{ option.value }}
      </option>
    </select>
    <span class="placeholder" v-if="props.placeholder">{{
      props.placeholder
    }}</span>
  </div>
</template>

<style lang="less" scoped>
.select-field {
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

  select {
    border: none;
    background: none;
    padding: 0.75rem 1rem;
    width: 100%;
    border-right: 1rem solid transparent;
    outline: none;
    border-top: 1px solid var(--color-foreground);
    border-bottom: 1px solid var(--color-foreground);
    z-index: 2;

    &:focus-visible {
      border-bottom: 1px solid var(--color-accent);
    }
  }

  &.icon select {
    padding: 0.75rem 1rem 0.75rem 3rem;
  }

  .placeholder {
    display: block;
    right: 3rem;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    z-index: 1;
  }
}
</style>
