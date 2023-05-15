<script setup>
import FriendEntry from "@/components/FriendEntry.vue"
import FriendDialog from "@/fragments/FriendDialog.vue"
import InfoBanner from "@/components/InfoBanner.vue"
import { ref } from "vue"
import { useFriendsStore } from "../stores/friends"

const friendsStore = useFriendsStore()

const frienddialog = ref(null)

const openFriendDialog = (id, guest = false) => {
  frienddialog.value.open(id, guest)
}
</script>

<template>
  <div class="view friends">
    <div class="list">
      <FriendEntry
        v-for="(friend, id) in friendsStore.friends"
        :key="id"
        :name="friend.alias"
        :guest="friend.profiles.is_guest"
        @click="openFriendDialog(id, friend.profiles.is_guest)"
      />

      <div class="actions">
        <button type="button" @click="openFriendDialog()">Add Friend 😊</button>
        <button type="button" @click="openFriendDialog(undefined, true)">
          Add Guest 🤖
        </button>
      </div>

      <p
        class="no-more-entries"
        v-if="Object.keys(friendsStore.friends).length === 0"
      >
        You did not yet add any friends.
        <button @click="openFriendDialog()">Start now</button>
      </p>

      <InfoBanner title="Friends & Guests">
        You can add other users of this app (Friends) or create guests in case
        someone does not have an account (yet). This will allow you to track all
        players. You can later merge guest accounts into real accounts in case
        someone decides to join with his/her own account.
      </InfoBanner>
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
    padding: 25px;
  }

  .actions {
    position: fixed;
    bottom: 70px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-around;

    button {
      width: auto;
      display: flex;
      align-items: center;

      svg {
        margin-right: 0.5rem;
      }
    }
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
