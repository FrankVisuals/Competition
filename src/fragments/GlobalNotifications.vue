<script setup>
import { reactive } from "vue"

import bus from "../util/bus"

const notifications = reactive({
  list: []
})

const addMessage = (messages, severity) => {
  if (!Array.isArray(messages)) {
    messages = [messages]
  }

  messages.forEach((message) => {
    const id = Math.random() * 100000
    notifications.list.push({
      id,
      message,
      severity
    })

    setTimeout(() => {
      notifications.list = notifications.list.filter((e) => e.id !== id)
    }, 3000)
  })
}

bus.on("error", (e) => {
  addMessage(e, "error")
})

bus.on("info", (i) => {
  addMessage(i, "info")
})
</script>

<template>
  <div class="notifications">
    <div
      class="notification"
      v-for="notification in notifications.list"
      :key="notification.id"
      :class="notification.severity"
    >
      {{ notification.message }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.notifications {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  z-index: 99;

  .notification {
    padding: 0.5rem 0.75rem;

    + .notification {
      margin-top: 1rem;
    }

    &.error {
      color: var(--color-background);
      background: var(--color-negative);
    }

    &.info {
      color: var(--color-background);
      background: var(--color-positive);
    }
  }
}
</style>
