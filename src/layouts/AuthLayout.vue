<script setup>
import { RouterLink, RouterView } from "vue-router"
import DashboardIcon from "@/icons/dashboard-icon.vue"
import TracksIcon from "@/icons/tracks-icon.vue"
import Profile from "@/icons/profile-icon.vue"

import { useCompetitionsStore } from "../stores/competitions"
import { onMounted } from "vue-demi"
import { useAuthStore } from "../stores/auth"

const competitionsStore = useCompetitionsStore()
const authStore = useAuthStore()

onMounted(() => {
  competitionsStore.reload()
})
</script>

<template>
  <div id="view-wrap" v-if="authStore.isUserLoaded">
    <RouterView />
  </div>
  <footer id="main-navigation">
    <RouterLink :to="{ name: 'dashboard' }"><DashboardIcon /></RouterLink>
    <RouterLink :to="{ name: 'competitions' }"><TracksIcon /></RouterLink>
    <RouterLink :to="{ name: 'profile' }"><Profile /></RouterLink>
  </footer>
</template>

<style scoped lang="less">
#view-wrap {
  height: 100vh;
  overflow-y: auto;
  padding-bottom: 52px;
}

#main-navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  height: 52px;
  background: var(--color-foreground);
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-top: 1px solid var(--color-border);

  a {
    display: flex;
    opacity: 0.3;

    &.router-link-exact-active {
      opacity: 1;
    }
  }
}
</style>
