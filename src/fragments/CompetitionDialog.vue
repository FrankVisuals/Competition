<script setup>
import { useDialog } from "@/components/composables/dialog"
import InputField from "@/components/InputField.vue"
import ToggleField from "@/components/ToggleField.vue"
import InfoBanner from "@/components/InfoBanner.vue"
import { computed, reactive } from "vue"
import { useAuthStore } from "../stores/auth"
import { useCompetitionsStore } from "../stores/competitions"
import bus from "../util/bus"
import { useBusy } from "../components/composables/busy"

const dialog = useDialog()
const busy = useBusy()

const competitionsStore = useCompetitionsStore()
const authStore = useAuthStore()

const competition = reactive({
  id: null,
  data: JSON.parse(JSON.stringify(competitionsStore.defaultCompetition))
})

defineExpose({
  open: (id) => {
    competition.id = id
    Object.assign(
      competition.data,
      JSON.parse(
        JSON.stringify(
          id
            ? competitionsStore.competitions[id]
            : competitionsStore.defaultCompetition
        )
      )
    )
    dialog.open()
  }
})

const canWorkOnCompetition = computed(() => {
  return (
    !competition.data.owner || competition.data.owner === authStore.user.uid
  )
})

const canDeleteCompetition = computed(() => {
  return competition.data.owner && competition.data.owner === authStore.user.uid
})

const isInputDisabled = computed(() => {
  return !canWorkOnCompetition.value || busy.isBusy
})

const dialogTitle = computed(() => {
  if (!canWorkOnCompetition.value) {
    return "Display Competition"
  }

  if (!competition.data.owner) {
    return "Add Competition"
  }

  return "Edit Competition"
})

const onSave = async () => {
  if (competition.data.owner) {
    await busy.load(async () => {
      await competitionsStore.update(competition.id, competition.data)
    })
  } else {
    await busy.load(async () => {
      await competitionsStore.create({
        ...competition.data,
        owner: authStore.user.uid
      })
    })
  }
  dialog.close()
}

const onDelete = async () => {
  bus.emit("delete", {
    title: "Delete Competition",
    message:
      "Are you sure? If you delete this competition, you can no longer access any of the records you created for it.",
    callback: async () => {
      await competitionsStore.delete(competition.id, competition.data)
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
        <button class="close" :disabled="busy.isBusy" @click="dialog.close">
          Close
        </button>
      </header>

      <form>
        <InputField
          placeholder="Name"
          v-model="competition.data.name"
          :busy="isInputDisabled"
        />

        <ToggleField
          v-model="competition.data.has_teams"
          :label="competition.data.has_teams ? 'Has Teams' : 'No Teams'"
          :busy="isInputDisabled"
        />

        <ToggleField
          v-model="competition.data.has_points"
          :label="competition.data.has_points ? 'Has Points' : 'No Points'"
          :busy="isInputDisabled"
        />

        <ToggleField
          v-if="competition.data.has_points"
          v-model="competition.data.highest_points_win"
          :label="
            competition.data.highest_points_win
              ? 'Most Points Win'
              : 'Least Points Win'
          "
          :busy="isInputDisabled"
        />

        <InfoBanner v-if="!canWorkOnCompetition">
          You are not the owner of this competition. Therefore, you cannot edit
          it.
        </InfoBanner>
      </form>

      <footer>
        <button
          class="negative"
          :disabled="isInputDisabled"
          v-if="canDeleteCompetition"
          @click="onDelete"
        >
          Delete
        </button>
        <button :disabled="isInputDisabled" @click="onSave">Save</button>
      </footer>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "../styles/util";
.dialog();
</style>
