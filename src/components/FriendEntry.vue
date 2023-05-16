<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  guest: {
    type: Boolean,
    required: true
  }
})
</script>

<template>
  <div class="component friend-entry">
    <div class="left">
      <span class="friend-alias"
        >{{ props.name }}
        <span class="friend-title" v-if="props.guest">(Guest)</span></span
      >
    </div>
    <div class="right">
      <span class="friend-guest" v-if="props.guest">🤖</span>
      <span class="friend-guest" v-if="!props.guest">😊</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component.friend-entry {
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
