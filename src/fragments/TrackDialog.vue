<script setup>
import { computed, reactive, watch } from "vue"
import { useDialog } from "@/components/composables/dialog"
import InputField from "@/components/InputField.vue"
import SelectField from "@/components/SelectField.vue"
import ToggleIconField from "@/components/ToggleIconField.vue"
import AwardIcon from "@/icons/award-icon.vue"
import AwardIconFilled from "@/icons/award-icon-filled.vue"
import CloseIcon from "@/icons/close-icon.vue"
import { useBusy } from "@/components/composables/busy"
import { useAuthStore } from "../stores/auth"
import { useCompetitionsStore } from "../stores/competitions"
import { useFriendsStore } from "../stores/friends"
import { useTracksStore } from "../stores/tracks"
import bus from "../util/bus"

const dialog = useDialog()
const busy = useBusy()

const authStore = useAuthStore()
const competitionsStore = useCompetitionsStore()
const friendsStore = useFriendsStore()
const tracksStore = useTracksStore()

const track = reactive({
  competition: null,
  teams: []
})

defineExpose({
  open: () => {
    track.competition = null
    track.teams = []

    dialog.open()
  }
})

const teamFactory = (initial, hasTeams) => {
  const team = {
    users: initial ? [authStore.user.id] : [null]
  }

  if (initial && hasTeams) {
    team.users.push(null)
  }

  if (competition.value?.has_points) {
    team.score = null
  } else {
    team.has_won = initial
  }

  return team
}

watch(
  () => track.competition,
  (newValue, oldValue) => {
    if (!newValue) {
      return
    }

    if (
      !oldValue ||
      competitionsStore.competitions[newValue].has_points !==
        competitionsStore.competitions[oldValue].has_points ||
      competitionsStore.competitions[newValue].has_teams !==
        competitionsStore.competitions[oldValue].has_teams
    ) {
      track.teams = []
      track.teams.push(
        teamFactory(true, competitionsStore.competitions[newValue].has_teams)
      )
      track.teams.push(teamFactory())
    }
  }
)

const checkIfNewUserNeedsToBeAdded = (teamIndex, userIndex) => {
  if (competition.value?.has_teams) {
    if (track.teams[teamIndex].users[userIndex] === undefined) {
      track.teams[teamIndex].users.splice(userIndex, 1)
    } else if (track.teams[teamIndex].users.length - 1 === userIndex) {
      track.teams[teamIndex].users.push(null)
    }
  } else {
    if (track.teams[teamIndex].users[userIndex] === undefined) {
      track.teams.splice(teamIndex, 1)
    } else if (track.teams.length - 1 === teamIndex) {
      track.teams.push(teamFactory())
    }
  }
}

const alreadyAdded = computed(() => {
  return track.teams.reduce((acc, team) => {
    team.users.forEach((u) => acc.push(u))
    return acc
  }, [])
})

const competition = computed(() => {
  if (!track.competition) {
    return null
  }

  return competitionsStore.competitions[track.competition]
})

const onAdd = async () => {
  await busy.load(async () => {
    await tracksStore.create(track)
    bus.emit("info", "Track was added.")
    dialog.close()
  })
}

const onAddTeam = () => {
  track.teams.push(teamFactory())
}

const selectableCleaned = (current) => {
  return friendsStore.selectable
    .filter((entry) => {
      return (
        entry.key === current || alreadyAdded.value.indexOf(entry.key) === -1
      )
    })
    .filter((entry) => {
      if (current) {
        return true
      }

      return entry.key !== undefined
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
        <h2>Add Track</h2>
        <button :disabled="busy.isBusy" class="close" @click="dialog.close">
          <CloseIcon />
        </button>
      </header>

      <form @submit.prevent>
        <SelectField
          placeholder="Competition"
          v-model="track.competition"
          :busy="busy.isBusy"
          icon="⚔️"
          :options="competitionsStore.selectable"
        />

        <div class="teams">
          <h3 v-if="competition">Participants</h3>
          <div class="team-container" v-for="(team, i) in track.teams" :key="i">
            <span class="team-title" v-if="competition.has_teams"
              >Team {{ i + 1 }}</span
            >
            <div class="team">
              <div class="members">
                <SelectField
                  v-for="(user, j) in team.users"
                  :key="j"
                  placeholder="Friend"
                  v-model="team.users[j]"
                  :busy="busy.isBusy"
                  icon="😊"
                  :options="selectableCleaned(team.users[j])"
                  @change="checkIfNewUserNeedsToBeAdded(i, j)"
                />
              </div>
              <InputField
                v-if="competition.has_points"
                class="score"
                placeholder="Score"
                v-model="team.score"
                :busy="
                  busy.isBusy || (team.users.length === 1 && !team.users[0])
                "
              />
              <ToggleIconField
                v-else
                class="toggle"
                v-model="team.has_won"
                :busy="
                  busy.isBusy || (team.users.length === 1 && !team.users[0])
                "
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
          <button
            class="add-team"
            type="button"
            v-if="competition?.has_teams"
            @click="onAddTeam"
          >
            Add Team
          </button>
        </div>
      </form>

      <footer>
        <button :disabled="busy.isBusy" @click="onAdd">Add Track</button>
      </footer>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import "../styles/util";
.dialog();

h3 {
  margin: 1rem 1rem 0.5rem 1rem;
}

.add-team {
  margin: 1rem auto;
  width: auto;
  display: block;
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
