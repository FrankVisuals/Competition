<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  yours: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div class="component competition-entry">
    <div class="left">
      <span class="competition-title">{{ props.name }}</span>
    </div>
    <div class="right">
      <span class="competition-yours" :class="{ yours: yours }">{{
        props.yours ? "yours" : "member"
      }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component.competition-entry {
  border: 1px solid var(--color-border);
  padding: 1rem 1.5rem;

  display: flex;
  align-items: center;

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

  .competition-title {
    font-weight: 600;
  }

  .competition-yours {
    display: block;
    background: var(--color-warning);
    padding: 0 0.75rem;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    &.yours {
      background: var(--color-positive);
    }
  }
}
</style>
