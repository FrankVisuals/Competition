<script setup>
import { reactive } from "vue"

const panel = reactive({
  open: false
})
</script>

<template>
  <div class="simple-panel">
    <div class="summary">
      <div
        @click="panel.open = !panel.open"
        class="clicker opener"
        v-if="!panel.open"
      >
        <slot name="opener"></slot>
      </div>
      <div @click="panel.open = !panel.open" class="clicker closer" v-else>
        <slot name="closer"></slot>
      </div>
      <div class="summary-content">
        <slot name="summary"></slot>
      </div>
    </div>
    <div class="details" v-show="panel.open">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="less" scoped>
.simple-panel {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background: var(--color-foreground);

  .details {
    width: 100%;
  }

  .summary {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .summary-content {
      width: ~"calc(100% - 2rem)";
    }

    .clicker {
      width: 2rem;
      flex-shrink: 0;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid var(--color-background);
    }
  }
}
</style>
