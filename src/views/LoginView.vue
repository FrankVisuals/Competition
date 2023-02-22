<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import InputField from "@/components/InputField.vue"
import { useBusy } from "@/components/composables/busy"
import { useAuthStore } from "../stores/auth"

const authStore = useAuthStore()
const busy = useBusy()
const router = useRouter()

const user = ref({
  email: null,
  password: null
})

const onLogin = async () => {
  await busy.load(async () => {
    await authStore.login(user.value)
  })
  router.replace({ name: "dashboard" })
}
</script>

<template>
  <form @submit.prevent="onLogin">
    <InputField
      placeholder="Email"
      icon="📧"
      v-model="user.email"
      :busy="busy.isBusy"
    />
    <InputField
      placeholder="Password"
      icon="🔐"
      type="password"
      v-model="user.password"
      :busy="busy.isBusy"
    />
    <button :disabled="busy.isBusy">Login</button>
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
