<script setup>
import CentralAdd from "@/components/CentralAdd.vue"
import TrackEntry from "@/components/TrackEntry.vue"
import CompetitionDialog from "@/fragments/CompetitionDialog.vue"
import { ref } from "vue"
import { useCompetitionsStore } from "../stores/competitions"

const competitionsStore = useCompetitionsStore()

const competitiondialog = ref(null)

const openCompetitionDialog = () => {
  competitiondialog.value.open()
}
</script>

<template>
  <div class="view competitions">
    <div class="list">
      <TrackEntry
        v-for="(competition, i) in competitionsStore.competitions"
        :key="i"
        :name="competition.name"
        :count="0"
      />

      <CentralAdd @click="openCompetitionDialog" />

      <p
        class="no-more-entries"
        v-if="competitionsStore.competitions.length > 0"
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
