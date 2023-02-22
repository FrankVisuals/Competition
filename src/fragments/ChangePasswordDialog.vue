<script setup>
import { useDialog } from "@/components/composables/dialog"
import InputField from "@/components/InputField.vue"
import CloseIcon from "../icons/close-icon.vue"
import { reactive } from "vue"
import { useBusy } from "../components/composables/busy"
import { useAuthStore } from "../stores/auth"
import bus from "../util/bus"

const dialog = useDialog()
const busy = useBusy()

const authStore = useAuthStore()

const user = reactive({
  check: null,
  current: null
})

defineExpose({
  open: () => {
    user.password = null
    user.check = null
    dialog.open()
  }
})

const onChange = async () => {
  if (user.password !== user.check) {
    bus.emit("error", "The passwords don't match.")
  } else {
    await busy.load(async () => {
      await authStore.changePassword(user.password)
    })
    dialog.close()
    bus.emit("info", "The password was changed.")
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
          <CloseIcon />
        </button>
      </header>

      <form @submit.prevent>
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
@import "../styles/util";
.dialog();
</style>
