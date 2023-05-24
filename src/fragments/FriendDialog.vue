<script setup>
import { useDialog } from "@/components/composables/dialog"
import InputField from "@/components/InputField.vue"
import SelectField from "@/components/SelectField.vue"
import CloseIcon from "@/icons/close-icon.vue"
import { computed, reactive } from "vue"
import bus from "../util/bus"
import { useFriendsStore } from "../stores/friends"
import { useBusy } from "@/components/composables/busy"

const dialog = useDialog()
const busy = useBusy()

const friendsStore = useFriendsStore()

const friend = reactive({
  id: null,
  search: null,
  alias: null,
  guest: false
})

const transferToUser = reactive({
  id: null
})

defineExpose({
  open: (id, guest = false) => {
    friend.id = id
    friend.search = null
    friend.alias = id ? friendsStore.friends[id].alias : null
    friend.is_guest = guest
    dialog.open()
  }
})

const dialogTitle = computed(() => {
  if (friend.id) {
    if (friend.is_guest) {
      return "Edit Guest"
    }

    return "Edit Friend"
  }

  if (friend.is_guest) {
    return "Add Guest"
  }

  return "Add Friend"
})

const onSave = async () => {
  if (friend.id) {
    await busy.load(async () => {
      await updateFriend()
    })
  } else if (friend.is_guest) {
    await busy.load(async () => {
      await addGuest()
    })
  } else {
    await busy.load(async () => {
      await addExistingFriend()
    })
  }
}

const onTransfer = async () => {
  await busy.load(async () => {
    await friendsStore.transferGuestToFriend(
      this.friend.id,
      this.friend.profiles.id,
      this.transferToUser.id
    )
  })
}

const addExistingFriend = async () => {
  const [user] = await friendsStore.find(friend.search)

  if (!user) {
    bus.emit("error", `User with email "${friend.search}" not found`)
    return
  }

  if (friendsStore.friends[user.id]) {
    bus.emit("error", `User with email "${friend.search}" is already a friend`)
    return
  }

  await friendsStore.add(user.id, friend.alias || user.alias)

  bus.emit(
    "info",
    `"${user.alias}" was added with alias "${friend.alias || user.alias}"`
  )

  dialog.close()
}

const updateFriend = async () => {
  await friendsStore.update(friend.id, {
    alias: friend.alias
  })
  bus.emit("info", `"${friend.alias}" was updated`)
  dialog.close()
}

const addGuest = async () => {
  await friendsStore.create(friend.alias)

  bus.emit("info", `Guest "${friend.alias}" was added`)
  dialog.close()
}

const onDelete = async () => {
  bus.emit("delete", {
    title: "Remove Friend",
    message:
      "Are you sure? If you delete this friend, you can no longer track data / competitions with him.",
    callback: async () => {
      await busy.load(async () => {
        await friendsStore.delete(friend.id)
      })
      dialog.close()
    }
  })
}
</script>

<template>
  <div
    class="dialog"
    :class="{
      open: dialog.data.open,
      busy: busy.isBusy,
      closing: dialog.data.closing
    }"
  >
    <div class="dialog-content">
      <header>
        <h2>{{ dialogTitle }}</h2>
        <button class="close" @click="dialog.close"><CloseIcon /></button>
      </header>

      <form @submit.prevent>
        <InputField
          v-if="!friend.id && !friend.is_guest"
          placeholder="Email"
          v-model="friend.search"
          :busy="busy.isBusy"
        />

        <InputField
          placeholder="Alias"
          v-model="friend.alias"
          :busy="busy.isBusy"
        />

        <div class="transfer-guest" v-if="friend.is_guest && friend.id">
          <span class="title">Transfer Guest Account</span>
          <p>
            You can merge guest accounts you have created with the account of a
            friend in order to transfer all records you have created with the
            guest account to a real account.
          </p>
          <SelectField
            class="select-friend"
            placeholder="Friend"
            v-model="transferToUser.id"
            :busy="
              busy.isBusy || !friendsStore.selectableNonGuestFriends.length
            "
            icon="😊"
            :options="friendsStore.selectableNonGuestFriends"
          />

          <p
            class="no-friends-note"
            v-if="!friendsStore.selectableNonGuestFriends.length"
          >
            You have not yet added any non-guest friends.
          </p>
        </div>
      </form>

      <footer>
        <button
          class="negative"
          :disabled="busy.isBusy"
          v-if="friend.id"
          @click="onDelete"
        >
          Delete
        </button>
        <button
          :disabled="busy.isBusy"
          @click="onSave"
          v-if="!transferToUser.id"
        >
          {{ friend.id ? "Update" : "Add" }}
        </button>
        <button :disabled="busy.isBusy" @click="onTransfer" v-else>
          Transfer
        </button>
      </footer>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "../styles/util";
.dialog();

.dialog-content form {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1rem;
}

.transfer-guest {
  margin-top: 1rem;

  .title {
    font-weight: bold;
    display: block;
    margin-bottom: 0.5rem;
  }

  .select-friend {
    margin-top: 1rem;
  }

  .no-friends-note {
    margin-top: 1rem;
  }
}
</style>
