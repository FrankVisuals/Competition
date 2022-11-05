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
  open: (id) => {
    friend.id = id
    Object.assign(
      friend.data,
      JSON.parse(
        JSON.stringify(
          id ? friendsStore.friends[id] : friendsStore.defaultFriend
        )
      )
    )
    dialog.open()
  }
})

const dialogTitle = computed(() => {
  if (friend.id) {
    return "Edit Friend"
  }

  return "Add Friend"
})

const onSave = async () => {
  if (friend.id) {
    await friendsStore.update(friend.id, friend.data)
  } else {
    const users = await friendsStore.find(friend.search)
    const [user] = users.docs

    if (!user) {
      bus.emit("error", `User with email "${friend.search}" not found`)
      return
    }

    await friendsStore.create(user.id, {
      isGuest: false,
      displayName: user.data().displayName,
      alias: null
    })
  }
  dialog.close()
}

const onDelete = async () => {
  bus.emit("delete", {
    title: "Remove Friend",
    message:
      "Are you sure? If you delete this friend, you can no longer track data / competitions with him.",
    callback: async () => {
      await friendsStore.delete(friend.id)
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
          v-if="!friend.id"
          placeholder="Email"
          v-model="friend.search"
          :busy="busy.isBusy"
        />

        <InputField
          v-if="!!friend.id"
          placeholder="Displayname"
          v-model="friend.data.displayName"
          :busy="true"
        />

        <InputField
          v-if="!!friend.id"
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
.dialog {
  transform: translateY(100%);
  background: transparent;
  transition: background 0.15s ease;

  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
}

.dialog-content {
  transform: translateY(100%);
  transition: transform 0.15s ease;

  width: 100%;
  background: var(--color-background);
  height: ~"calc(100% - 2rem)";
  position: absolute;
  bottom: 0;
  left: 0;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem;

  h2 {
    line-height: 1;
  }
}

.close {
  width: auto;
}

.open {
  &.dialog {
    transform: translateY(0);
    background: rgba(0, 0, 0, 0.4);
  }

  .dialog-content {
    transform: translateY(0);
  }
}

&.closing {
  &.dialog {
    background: rgba(0, 0, 0, 0);
  }

  .dialog-content {
    transform: translateY(100%);
  }
}

form {
  height: ~"calc(100% - 69px)";
  overflow-y: auto;
  padding-bottom: 8rem;

  .input + .input {
    margin-top: 1rem;
  }
}

footer {
  position: absolute;
  padding: 1rem;
  bottom: 0;
  width: 100%;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button:not(.negative) {
    background: var(--color-accent);
    color: var(--color-background);
  }

  .negative {
    width: auto;
    margin-right: 1rem;
    flex-shrink: 0;
  }
}
</style>
