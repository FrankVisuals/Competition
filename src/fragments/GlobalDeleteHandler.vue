<script setup>
import { reactive } from "vue"

import bus from "../util/bus"
import { useDialog } from "../components/composables/dialog"

const dialog = useDialog()

const info = reactive({
  title: "",
  message: "",
  callback: () => {}
})

bus.on("delete", ({ title, message, callback }) => {
  info.title = title
  info.message = message
  info.callback = callback
  dialog.open()
})

const onClose = () => {
  dialog.close()
}

const onSubmit = async () => {
  await info.callback()
  onClose()
}
</script>

<template>
  <div class="global-delete-handler" :class="{ open: dialog.data.open }">
    <div class="dialog">
      <h2>{{ info.title }}</h2>
      <p>{{ info.message }}</p>
      <footer>
        <button @click="onClose()">Cancel</button>
        <button class="negative" @click="onSubmit()">Delete</button>
      </footer>
    </div>
  </div>
</template>

<style lang="less" scoped>
.global-delete-handler {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  z-index: 98;
  background: rgba(0, 0, 0, 0.8);
  height: 100%;
  display: none;

  &.open {
    display: block;
  }

  .dialog {
    width: 100%;
    background: var(--color-background);
    padding: 1.5rem;
    border-radius: 3px;

    p {
      margin-top: 1rem;
    }

    footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 2rem;

      button {
        width: auto;

        + button {
          margin-left: 1rem;
        }
      }
    }
  }
}
</style>
