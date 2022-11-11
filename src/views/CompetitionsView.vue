<script setup>
import CentralAdd from "@/components/CentralAdd.vue"
import CompetitionEntry from "@/components/CompetitionEntry.vue"
import CompetitionDialog from "@/fragments/CompetitionDialog.vue"
import { ref } from "vue"
import { useAuthStore } from "../stores/auth"
import { useCompetitionsStore } from "../stores/competitions"

const competitionsStore = useCompetitionsStore()
const authStore = useAuthStore()

const competitiondialog = ref(null)

const openCompetitionDialog = (id) => {
  competitiondialog.value.open(id)
}
</script>

<template>
  <div class="view competitions">
    <div class="list">
      <CompetitionEntry
        v-for="(competition, id) in competitionsStore.competitions"
        :key="id"
        :name="competition.name"
        :yours="competition.owner === authStore.firebase.uid"
        @click="openCompetitionDialog(id)"
      />

      <CentralAdd @click="openCompetitionDialog" />

      <p
        class="no-more-entries"
        v-if="Object.keys(competitionsStore.competitions).length > 0"
      >
        No more data.
      </p>

      <p class="no-more-entries" v-else>
        You did not yet create any competition.
        <button @click="openCompetitionDialog">Start now</button>
      </p>
    </div>
  </div>

  <CompetitionDialog ref="competitiondialog" />
</template>

<style lang="less" scoped>
.view.competitions {
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
