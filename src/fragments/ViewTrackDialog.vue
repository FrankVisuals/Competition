<script setup>
import { computed, reactive } from "vue"
import { useDialog } from "@/components/composables/dialog"
import InputField from "@/components/InputField.vue"
import SelectField from "@/components/SelectField.vue"
import ToggleIconField from "@/components/ToggleIconField.vue"
import CloseIcon from "@/icons/close-icon.vue"
import AwardIcon from "@/icons/award-icon.vue"
import AwardIconFilled from "@/icons/award-icon-filled.vue"
import InfoBanner from "@/components/InfoBanner.vue"
import { useBusy } from "@/components/composables/busy"
import { useCompetitionsStore } from "../stores/competitions"
import { useFriendsStore } from "../stores/friends"
import { useTracksStore } from "../stores/tracks"
import bus from "../util/bus"
import { useAuthStore } from "../stores/auth"

const dialog = useDialog()
const busy = useBusy()

const competitionsStore = useCompetitionsStore()
const friendsStore = useFriendsStore()
const tracksStore = useTracksStore()
const authStore = useAuthStore()

const track = reactive({
  id: null,
  data: {}
})

defineExpose({
  open: (t) => {
    track.id = t.id

    const data = JSON.parse(JSON.stringify(t))
    data.createdBy = friendsStore.getUserName(data.profile_id)
    data.results.forEach((team) => {
      team.users = team.users.map((u) => {
        return friendsStore.getUserName(u)
      })
    })

    track.data = data

    dialog.open()
  }
})

const competition = computed(() => {
  if (!track.data.competition_id) {
    return null
  }

  return competitionsStore.competitions[track.data.competition_id]
})

const onDelete = () => {
  bus.emit("delete", {
    title: "Delete Track",
    message:
      "Do you really want to delete the track? This action cannot be undone.",
    callback: async () => {
      await busy.load(async () => {
        await tracksStore.delete(track.id)
        dialog.close()
      })
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
        <h2>View Track</h2>
        <button :disabled="busy.isBusy" class="close" @click="dialog.close">
          <CloseIcon />
        </button>
      </header>

      <form @submit.prevent>
        <SelectField
          placeholder="Competition"
          v-model="track.data.competition_id"
          :busy="true"
          icon="⚔️"
          :options="competitionsStore.selectable"
        />

        <div class="teams">
          <h3 v-if="competition">Participants</h3>
          <div
            class="team-container"
            v-for="(team, i) in track.data.results"
            :key="i"
          >
            <span class="team-title" v-if="competition.has_teams"
              >Team {{ i + 1 }}</span
            >
            <div class="team">
              <div class="members">
                <InputField
                  v-for="(user, j) in team.users"
                  :key="j"
                  :modelValue="user"
                  placeholder="Friend"
                  :busy="true"
                />
              </div>
              <InputField
                v-if="competition.has_points"
                class="score"
                placeholder="Score"
                :modelValue="team.score"
                :busy="true"
              />
              <ToggleIconField
                v-else
                class="toggle"
                :modelValue="team.has_won"
                :busy="true"
              >
                <template v-slot:active>
                  <AwardIconFilled />
                </template>
                <template v-slot:inactive>
                  <AwardIcon />
                </template>
              </ToggleIconField>
            </div>
          </div>
        </div>

        <label>Created At</label>
        <InputField
          :modelValue="new Date(track.data.created_at).toLocaleDateString()"
          placeholder="Date"
          :busy="true"
        />

        <label>Created By</label>
        <InputField
          :modelValue="track.data.createdBy"
          placeholder="User"
          :busy="true"
        />

        <div class="info-banner-wrap">
          <InfoBanner title="Editing Tracks">
            You cannot edit tracks. You can only delete them in order to
            recreate them.
          </InfoBanner>
        </div>
      </form>

      <footer>
        <button
          :disabled="busy.isBusy || track.data.profile_id !== authStore.user.id"
          @click="onDelete"
          class="negative"
        >
          Delete
        </button>
        <button :disabled="busy.isBusy" @click="dialog.close">Close</button>
      </footer>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "../styles/util";
.dialog();

h3,
form > label {
  display: block;
  margin: 1rem 1rem 0.5rem 1rem;
}

.info-banner-wrap {
  width: 100%;
  padding: 1rem;
}

.teams {
  width: 100%;

  .team-title {
    padding: 0.5rem;
    display: block;
  }

  .team {
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    background: var(--color-foreground);

    .input + .input {
      margin: 0;
    }

    .members {
      flex-grow: 1;
    }

    .score {
      width: 125px;
      border-left: 1px solid var(--color-border);
    }

    .toggle {
      width: 80px;
    }
  }
}

.team + .team {
  margin-top: 0.25rem;
}
</style>
