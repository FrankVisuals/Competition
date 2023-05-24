<script setup>
import AddIcon from "@/icons/add-icon.vue"
const emit = defineEmits(["click"])
</script>

<template>
  <div class="central-add">
    <button @click="emit('click')"><AddIcon /></button>
  </div>
</template>

<style lang="less" scoped>
.central-add {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;

  button {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: var(--color-background);
  }
}
</style>
