<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    required: true
  }
})
</script>

<template>
  <div class="component track-entry">
    <div class="left">
      <span class="competition-title">{{ props.name }}</span>
    </div>
    <div class="right">
      <span class="competition-points">{{ props.count }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component.track-entry {
  border: 1px solid var(--color-border);
  padding: 1rem 1.5rem;

  display: flex;

  .left,
  .right {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 50%;
  }

  .right {
    align-items: flex-end;
  }

  .competition-title,
  .competition-points {
    font-weight: 600;
  }

  .competition-date,
  .competition-team {
    font-size: 0.75rem;
  }
}
</style>
