<script setup>
import CentralAdd from "@/components/CentralAdd.vue"
import FriendEntry from "@/components/FriendEntry.vue"
import FriendDialog from "@/fragments/FriendDialog.vue"
import { ref } from "vue"
import { useFriendsStore } from "../stores/friends"

const friendsStore = useFriendsStore()

const frienddialog = ref(null)

const openFriendDialog = (id) => {
  frienddialog.value.open(id)
}
</script>

<template>
  <div class="view friends">
    <div class="list">
      <FriendEntry
        v-for="(friend, id) in friendsStore.friends"
        :key="id"
        :name="friend.displayName"
        :guest="friend.isGuest"
        :alias="friend.alias"
        @click="openFriendDialog(id)"
      />

      <CentralAdd @click="openFriendDialog()" />

      <p
        class="no-more-entries"
        v-if="Object.keys(friendsStore.friends).length > 0"
      >
        No more data.
      </p>

      <p class="no-more-entries" v-else>
        You did not yet add any friends.
        <button @click="openFriendDialog()">Start now</button>
      </p>
    </div>
  </div>

  <FriendDialog ref="frienddialog" />
</template>

<style lang="less" scoped>
.view.friends {
  .list {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    grid-gap: 10px;
    padding: 15px 10px;
  }

  .no-more-entries {
    text-align: center;
    width: 100%;
    padding: 2rem;
    opacity: 0.8;

    button {
      margin-top: 2rem;
    }
  }
}
</style>
