<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  leader: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="component stats-entry">
    <div class="left">
      <span class="stats-name">{{ leader ? "👑 " : "" }}{{ props.name }}</span>
    </div>
    <div class="right">
      <span class="date">{{ score }} 🔥</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component.stats-entry {
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

  .friend-alias {
    font-weight: 600;
  }

  .friend-title {
    font-weight: 200;
  }
}
</style>
