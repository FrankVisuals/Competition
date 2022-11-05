<script setup>
import { useDialog } from "@/components/composables/dialog"
import InputField from "@/components/InputField.vue"
import { reactive } from "vue"
import { useBusy } from "../components/composables/busy"
import { useAuthStore } from "../stores/auth"
import bus from "../util/bus"

const dialog = useDialog()
const busy = useBusy()

const authStore = useAuthStore()

const user = reactive({
  password: null,
  check: null,
  current: null
})

defineExpose({
  open: () => {
    user.password = null
    user.check = null
    user.current = null
    dialog.open()
  }
})

const onChange = async () => {
  if (user.password !== user.check) {
    bus.emit("error", "The passwords don't match.")
  } else {
    await busy.load(async () => {
      await authStore.changePassword(user.current, user.password)
    })
    dialog.close()
  }
}
</script>

<template>
  <div
    class="dialog"
    :class="{
      open: dialog.data.open,
      busy: busy.isBusy,
      closing: dialog.data.closing
    }"
  >
    <div class="dialog-content">
      <header>
        <h2>Change Password</h2>
        <button :disabled="busy.isBusy" class="close" @click="dialog.close">
          Close
        </button>
      </header>

      <form>
        <InputField
          placeholder="Current Password"
          v-model="user.current"
          :busy="busy.isBusy"
          type="password"
          icon="🔐"
        />

        <InputField
          placeholder="New Password"
          v-model="user.password"
          :busy="busy.isBusy"
          type="password"
          icon="🔐"
        />

        <InputField
          placeholder="Repeat New Password"
          v-model="user.check"
          :busy="busy.isBusy"
          type="password"
          icon="🔐"
        />
      </form>

      <footer>
        <button :disabled="busy.isBusy" @click="onChange">Change</button>
      </footer>
    </div>
  </div>
</template>

<style lang="less" scoped>
.dialog {
  transform: translateY(100%);
  background: transparent;
  transition: background 0.15s ease;

  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}

.dialog-content {
  transform: translateY(100%);
  transition: transform 0.15s ease;

  width: 100%;
  background: var(--color-background);
  height: ~"calc(100% - 2rem)";
  position: absolute;
  bottom: 0;
  left: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;

  h2 {
    line-height: 1;
  }
}

.close {
  width: auto;
}

.open {
  &.dialog {
    transform: translateY(0);
    background: rgba(0, 0, 0, 0.4);
  }

  .dialog-content {
    transform: translateY(0);
  }
}

&.closing {
  &.dialog {
    background: rgba(0, 0, 0, 0);
  }

  .dialog-content {
    transform: translateY(100%);
  }
}

form {
  height: ~"calc(100% - 69px)";
  overflow-y: auto;
  padding-bottom: 8rem;

  .input + .input {
    margin-top: 1rem;
  }
}

footer {
  position: absolute;
  padding: 1rem;
  bottom: 0;
  width: 100%;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button:not(.negative) {
    background: var(--color-accent);
    color: var(--color-background);
  }

  .negative {
    width: auto;
    margin-right: 1rem;
    flex-shrink: 0;
  }
}
</style>
