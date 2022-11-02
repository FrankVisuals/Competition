<script setup>
import { useDialog } from "@/components/composables/dialog"
import InputField from "@/components/InputField.vue"
import { reactive } from "vue"
import { useCompetitionsStore } from "../stores/competitions"

const dialog = useDialog()

const competitionsStore = useCompetitionsStore()

const competition = reactive(
  JSON.parse(JSON.stringify(competitionsStore.defaultCompetition))
)

defineExpose({
  open: () => {
    Object.assign(
      competition,
      JSON.parse(JSON.stringify(competitionsStore.defaultCompetition))
    )
    dialog.open()
  }
})

const onSave = async () => {
  await competitionsStore.create(competition)
  dialog.close()
}
</script>

<template>
  <div
    class="dialog"
    :class="{
      open: dialog.data.open,
      busy: dialog.data.loading,
      closing: dialog.data.closing
    }"
  >
    <div class="dialog-content">
      <header>
        <h2>Add Competition</h2>
        <button class="close" @click="dialog.close">Close</button>
      </header>

      <form @submit.prevent="add">
        <InputField
          placeholder="Name"
          v-model="competition.name"
          :busy="dialog.loading"
        />
      </form>

      <footer>
        <button @click="onSave">Save</button>
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
}

footer {
  position: absolute;
  padding: 1rem;
  bottom: 0;
  width: 100%;
  left: 0;

  button {
    background: var(--color-accent);
    color: var(--color-background);
  }
}
</style>
