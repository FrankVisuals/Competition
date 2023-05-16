<script setup>
import { ref } from "vue"
import InputField from "@/components/InputField.vue"
import { useBusy } from "@/components/composables/busy"
import { useAuthStore } from "../stores/auth"
import bus from "../util/bus"

const authStore = useAuthStore()
const busy = useBusy()

const user = ref({
  email: null
})

const onResetPassword = async () => {
  await busy.load(async () => {
    await authStore.resetPassword(user.value.email)
  })
  bus.emit("info", "Reset mail was sent")
}
</script>

<template>
  <form @submit.prevent="onResetPassword">
    <InputField
      placeholder="Email"
      icon="📧"
      v-model="user.email"
      :busy="busy.isBusy"
    />
    <button :disabled="busy.isBusy">Reset Password</button>
  </form>
</template>

<style lang="less" scoped>
.input-field + .input-field {
  margin-top: 15px;
}

button {
  margin-top: 15px;
}

form {
  max-width: 400px;
  margin: 0 auto;
}
</style>
