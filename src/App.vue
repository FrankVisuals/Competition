<script setup>
import { onMounted } from "vue-demi"
import { RouterView, useRouter } from "vue-router"
import GlobalNotifications from "./fragments/GlobalNotifications.vue"
import { useAuthStore } from "./stores/auth"

const authStore = useAuthStore()
const router = useRouter()

const isAuthRoute = () => {
  return router.currentRoute.value.fullPath.startsWith("/auth")
}

const isInitialRoute = () => {
  return router.currentRoute.value.name === "home"
}

onMounted(async () => {
  const user = await authStore.waitForInit()

  if (user && (isAuthRoute() || isInitialRoute())) {
    router.replace({ name: "dashboard" })
  } else if (!user && !isAuthRoute()) {
    router.replace({ name: "login" })
  }
})
</script>

<template>
  <RouterView />
  <GlobalNotifications />
</template>
