<script setup>
import InfoIcon from "@/icons/info-icon.vue"

const props = defineProps({
  title: {
    required: false,
    type: String
  }
})
</script>

<template>
  <div class="info-banner">
    <header>
      <InfoIcon />
      <h2 v-if="props.title">{{ title }}</h2>
    </header>

    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style lang="less" scoped>
.info-banner {
  width: 100%;
  border: 1px solid var(--color-info);
  background: var(--color-info-background);
  padding: 1rem;
  border-radius: 3px;

  header {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    margin-bottom: 0.25rem;

    h2 {
      margin: 0;
      line-height: 1;
      font-size: 16px;
      font-weight: bold;
    }

    > svg {
      flex-shrink: 0;
      margin-right: 0.75rem;
      fill: var(--color-info);
    }
  }

  main > * {
    margin: 0;
  }
}
</style>
