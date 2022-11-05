<script setup>
import { computed, ref } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"
import { useBusy } from "../components/composables/busy"
import InputField from "@/components/InputField.vue"
import ChangePasswordDialog from "../fragments/ChangePasswordDialog.vue"
import bus from "../util/bus"

const authStore = useAuthStore()
const router = useRouter()
const busy = useBusy()

const changepassworddialog = ref(null)

const user = computed(() => {
  return authStore.user
})

const onLogout = async () => {
  await authStore.logout()
  router.push({ name: "login" })
}

const onDeleteAccount = async () => {
  bus.emit("delete", {
    title: "Delete Account",
    message:
      "Do you really want to delete your account? This action cannot be undone.",
    callback: async () => {
      await authStore.delete()
      router.push({ name: "login" })
    }
  })
}

const onChangePassword = async () => {
  changepassworddialog.value.open()
}

const onChangeDisplayName = async (value) => {
  await busy.load(async () => {
    await authStore.updateUser({
      displayName: value
    })
  })
  bus.emit("info", `Displayname was updated to ${value}`)
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
    <InputField
      placeholder="Display Name"
      icon="😊"
      v-model="user.displayName"
      :busy="busy.isBusy"
      :form="true"
      @submit="onChangeDisplayName"
    />
    <h2>Actions</h2>
    <button @click="onChangePassword">Change Password</button>
    <button @click="onLogout">Logout</button>
    <h2>Danger Zone</h2>
    <button @click="onDeleteAccount" class="negative">Delete Account</button>
  </div>

  <ChangePasswordDialog ref="changepassworddialog" />
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

button + button {
  margin-top: 1rem;
}
</style>
