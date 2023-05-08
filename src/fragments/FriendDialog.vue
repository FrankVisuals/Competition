<script setup>
import { useDialog } from "@/components/composables/dialog"
import InputField from "@/components/InputField.vue"
import { computed, reactive } from "vue"
import bus from "../util/bus"
import { useFriendsStore } from "../stores/friends"
import { useBusy } from "../components/composables/busy"

const dialog = useDialog()
const busy = useBusy()

const friendsStore = useFriendsStore()

const friend = reactive({
  id: null,
  search: null,
  alias: null,
  guest: false
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

  await friendsStore.add({
    friend_id: user.id,
    is_guest: false,
    alias: friend.alias || user.alias
  })

  bus.emit("info", `"${user.alias}" was added`)
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
        <button class="close" @click="dialog.close">Close</button>
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
        <button :disabled="busy.isBusy" @click="onSave">
          {{ friend.id ? "Update" : "Add" }}
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
</style>
