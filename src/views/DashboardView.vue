<script setup>
import CentralAdd from "@/components/CentralAdd.vue"
import TrackEntry from "@/components/TrackEntry.vue"
import SelectField from "@/components/SelectField.vue"
import InfoBanner from "@/components/InfoBanner.vue"
import StatsEntry from "@/components/StatsEntry.vue"
import TrackDialog from "@/fragments/TrackDialog.vue"
import ViewTrackDialog from "@/fragments/ViewTrackDialog.vue"
import { useBusy } from "@/components/composables/busy"
import { onMounted, reactive, ref, toRaw, watch } from "vue"
import { useTracksStore } from "../stores/tracks"
import { useCompetitionsStore } from "../stores/competitions"

const trackDialog = ref(null)

const openTrackDialog = () => {
  trackDialog.value.open()
}

const viewTrackDialog = ref(null)

const openViewTrackDialog = (id, track) => {
  viewTrackDialog.value.open(id, track)
}

const tracksStore = useTracksStore()

const busy = useBusy()
const competitionsStore = useCompetitionsStore()
const statistics = reactive({
  competitionId: null
})

onMounted(async () => {
  watch(
    () => competitionsStore.competitions,
    (newData) => {
      const availableCompetitions = toRaw(newData)

      if (
        !statistics.competitionId &&
        Object.keys(availableCompetitions).length
      ) {
        statistics.competitionId = Object.values(availableCompetitions)[0].id
        tracksStore.loadStatistics(statistics.competitionId)
      }
    },
    { immediate: true }
  )
})
</script>

<template>
  <div class="view dashboard">
    <section class="recent">
      <span class="section-title">Recent Tracks</span>
      <div class="tracks">
        <TrackEntry
          v-for="(track, key) in tracksStore.recentTracks"
          :key="key"
          :track="track"
          @click="openViewTrackDialog(key, track)"
        />
      </div>
    </section>

    <section class="statistics">
      <span class="section-title">Statistics</span>

      <SelectField
        placeholder="Show for"
        v-model="statistics.competitionId"
        :busy="busy.isBusy"
        icon="⚔️"
        :options="competitionsStore.selectable"
      />

      <div class="list" v-if="tracksStore.statistics.length">
        <StatsEntry
          v-for="(entry, id) in tracksStore.statistics"
          :key="id"
          :name="entry.name"
        />
      </div>

      <InfoBanner title="No Tracks" v-else
        >There are no tracks for the selected competition.</InfoBanner
      >
    </section>

    <CentralAdd @click="openTrackDialog" />
  </div>

  <TrackDialog ref="trackDialog" />
  <ViewTrackDialog ref="viewTrackDialog" />
</template>

<style lang="less" scoped>
.tracks {
  width: 100%;

  .component.track-entry {
    border-bottom: 1px solid var(--color-border);

    &:first-child {
      border-top: 1px solid var(--color-border);
    }
  }
}

section {
  &.recent {
    background: var(--color-foreground);
    box-shadow: inset 0 -10px 10px -10px rgba(0, 0, 0, 0.1);
  }
}

.section-title {
  padding: 1.5rem 1rem;
  display: block;
  font-weight: bold;
  text-align: center;
}

.statistics {
  margin: 1rem;

  .info-banner {
    margin-top: 1rem;
  }
}
</style>
