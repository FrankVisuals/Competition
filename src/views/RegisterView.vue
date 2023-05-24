<script setup>
import { ref } from "vue"
import InfoBanner from "@/components/InfoBanner.vue"
import InputField from "@/components/InputField.vue"
import { useBusy } from "@/components/composables/busy"
import { useAuthStore } from "../stores/auth"

const authStore = useAuthStore()
const busy = useBusy()

const user = ref({
  email: null,
  password: null
})

const showVerificationRequired = ref(false)

const onRegister = async () => {
  await busy.load(async () => {
    await authStore.register(user.value)
  })
  showVerificationRequired.value = true
}
</script>

<template>
  <form @submit.prevent="onRegister" v-if="!showVerificationRequired">
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
    <button :disabled="busy.isBusy">Register</button>
  </form>

  <InfoBanner v-else title="Verify your Email"
    >We've send you an email to verify your email address.</InfoBanner
  >
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
