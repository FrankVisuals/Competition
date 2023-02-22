<script setup>
import { computed } from "vue"
import { useAuthStore } from "../stores/auth"
import { useFriendsStore } from "../stores/friends"

const props = defineProps({
  track: {
    type: Object,
    required: true
  }
})

const friendsStore = useFriendsStore()
const authStore = useAuthStore()

const winners = computed(() => {
  return props.track.teams.reduce((acc, team) => {
    if (team.has_won) {
      acc = acc.concat(team.users)
    }

    return acc
  }, [])
})

const players = computed(() => {
  return props.track.members
    .map((id) => {
      if (authStore.supabase.id === id) {
        return {
          id,
          displayName: authStore.user.displayName
        }
      }

      return {
        id,
        displayName: friendsStore.friends[id]?.displayName || "Unknown"
      }
    })
    .map((user) => {
      if (winners.value.indexOf(user.id) > -1) {
        return `👑 ${user.displayName}`
      }

      return user.displayName
    })
})
</script>

<template>
  <div class="component track-entry">
    <div class="left">
      <span class="track-title">{{ props.track.title }}</span>
      <span class="track-players">{{ players.join(", ") }}</span>
    </div>
    <div class="right">
      <span class="track-date">{{
        new Date(props.track.date).toLocaleDateString()
      }}</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.component.track-entry {
  padding: 0.75rem 1rem;

  display: flex;
  align-items: center;

  .left,
  .right {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .left {
    flex-grow: 1;
  }

  .right {
    align-items: flex-end;
    width: 80px;
    flex-shrink: 0;
  }

  .track-title {
    font-weight: 600;
  }

  .track-date,
  .track-players {
    font-size: 12px;
  }
}
</style>
