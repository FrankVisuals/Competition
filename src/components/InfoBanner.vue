<script setup></script>

<template>
  <div class="info-banner">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.info-banner {
  width: ~"calc(100% - 2rem)";
  border: 2px solid var(--color-border);
  background: var(--color-foreground);
  padding: 1rem;
  margin: 1rem;
  border-radius: 10px;

  > * {
    margin: 0;
  }
}
</style>
