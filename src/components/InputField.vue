<script setup>
import { useModelWrapper } from "./composables/model"

const props = defineProps({
  placeholder: { type: String },
  icon: { type: String },
  type: { type: String, default: "text" },
  modelValue: {},
  busy: { type: Boolean, default: false },
  form: { type: Boolean, default: false }
})

const emit = defineEmits(["update:modelValue", "submit"])
const modelValue = useModelWrapper(props, emit, "modelValue")
</script>

<template>
  <div
    class="input input-field"
    :class="{ icon: !!props.icon, form: props.form }"
  >
    <div class="icon" v-if="!!props.icon">{{ props.icon }}</div>
    <input
      :disabled="busy"
      :type="props.type"
      :placeholder="props.placeholder"
      v-model="modelValue"
      @change="!!props.form && emit('submit', modelValue)"
    />
    <button
      class="save"
      type="button"
      v-if="props.form"
      @click="emit('submit', modelValue)"
    >
      💾
    </button>
    <span class="placeholder" v-if="props.placeholder">{{
      props.placeholder
    }}</span>
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

  .save {
    position: absolute;
    width: auto;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    border: none;
  }

  .placeholder {
    display: none;
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
  }

  input:not(:placeholder-shown) + .placeholder {
    display: block;
  }

  input:not(:placeholder-shown) + .save + .placeholder {
    display: block;
    right: 3rem;
  }
}
</style>
