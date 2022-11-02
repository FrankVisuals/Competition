<script setup>
import { computed } from "vue"
import { useAuthStore } from "../stores/auth"
import InputField from "@/components/InputField.vue"
import { useRouter } from "vue-router"

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => {
  return authStore.user
})

const onLogout = async () => {
  await authStore.logout()
  router.push({ name: "login" })
}
</script>

<template>
  <div class="view profile">
    <h2>User Data</h2>
    <InputField
      placeholder="Email"
      icon="📧"
      v-model="user.email"
      :busy="true"
    />
    <h2>Actions</h2>
    <button @click="onLogout">Logout</button>
    <h2>Danger Zone</h2>
    <button class="negative">Delete Account</button>
  </div>
</template>

<style lang="less" scoped>
.view.profile {
  padding: 10px;
}

.input-field + .input-field {
  margin-top: 10px;
}

h2 {
  font-size: 18px;
  margin-bottom: 10px;

  &:not(:first-child) {
    margin-top: 30px;
  }
}
</style>
