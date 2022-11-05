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
  data: JSON.parse(JSON.stringify(friendsStore.defaultFriend)),
  search: null
})

defineExpose({
  open: (id, guest = false) => {
    friend.id = id
    Object.assign(friend.data, {
      ...JSON.parse(
        JSON.stringify(
          id ? friendsStore.friends[id] : friendsStore.defaultFriend
        )
      ),
      isGuest: guest
    })
    dialog.open()
  }
})

const dialogTitle = computed(() => {
  if (friend.id) {
    if (friend.data.isGuest) {
      return "Edit Guest"
    }

    return "Edit Friend"
  }

  if (friend.data.isGuest) {
    return "Add Guest"
  }

  return "Add Friend"
})

const onSave = async () => {
  if (friend.id) {
    await busy.load(async () => {
      await updateFriend()
    })
  } else if (friend.data.isGuest) {
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
  const users = await friendsStore.find(friend.search)
  const [user] = users.docs

  if (!user) {
    bus.emit("error", `User with email "${friend.search}" not found`)
    return
  }

  if (friendsStore.friends[user.id]) {
    bus.emit("error", `User with email "${friend.search}" is already a friend`)
    return
  }

  await friendsStore.create(user.id, {
    isGuest: false,
    displayName: user.data().displayName,
    alias: null
  })

  bus.emit("info", `"${user.data().displayName}" was added`)
  dialog.close()
}

const updateFriend = async () => {
  await friendsStore.update(friend.id, friend.data)
  bus.emit("info", `"${friend.data.displayName}" was updated`)
  dialog.close()
}

const addGuest = async () => {
  await friendsStore.add({
    isGuest: true,
    displayName: friend.data.displayName,
    alias: null
  })

  bus.emit("info", `Guest "${friend.data.displayName}" was added`)
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
          v-if="!friend.id && !friend.data.isGuest"
          placeholder="Email"
          v-model="friend.search"
          :busy="busy.isBusy"
        />

        <InputField
          v-if="!!friend.id || friend.data.isGuest"
          placeholder="Displayname"
          v-model="friend.data.displayName"
          :busy="!friend.data.isGuest"
        />

        <InputField
          v-if="!!friend.id && !friend.data.isGuest"
          placeholder="Alias"
          v-model="friend.data.alias"
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
</style>
