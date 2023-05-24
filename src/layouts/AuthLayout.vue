<script setup>
import { RouterLink, RouterView } from "vue-router"
import DashboardIcon from "@/icons/dashboard-icon.vue"
import TracksIcon from "@/icons/tracks-icon.vue"
import Profile from "@/icons/profile-icon.vue"
import Friends from "@/icons/friends-icon.vue"

import { useCompetitionsStore } from "../stores/competitions"
import { watch, ref } from "vue"
import { useAuthStore } from "../stores/auth"
import { useFriendsStore } from "../stores/friends"
import { useTracksStore } from "../stores/tracks"

const authStore = useAuthStore()
const competitionsStore = useCompetitionsStore()
const friendsStore = useFriendsStore()
const tracksStore = useTracksStore()

const allInitialized = ref(false)

watch(
  () => authStore.isUserLoaded,
  async (value) => {
    if (value) {
      await friendsStore.initialize()
      await competitionsStore.initialize()
      await tracksStore.initialize()

      allInitialized.value = true
    }
  },
  { immediate: true }
)
</script>

<template>
  <div id="view-wrap" v-if="authStore.isUserLoaded">
    <RouterView v-if="allInitialized" />
  </div>
  <footer id="main-navigation">
    <RouterLink :to="{ name: 'dashboard' }"><DashboardIcon /></RouterLink>
    <RouterLink :to="{ name: 'competitions' }"><TracksIcon /></RouterLink>
    <RouterLink :to="{ name: 'friends' }"><Friends /></RouterLink>
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
