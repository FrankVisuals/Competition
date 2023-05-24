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
import bus from "../util/bus"
import { useRouter } from "vue-router"

const tracksStore = useTracksStore()
const competitionsStore = useCompetitionsStore()
const router = useRouter()

const trackDialog = ref(null)

const openTrackDialog = () => {
  if (!competitionsStore.competitions.length) {
    bus.emit("confirm", {
      title: "Missing Competitions",
      message:
        "You did not yet add any competition. You must first add a competition before you can add a track.",
      button: "Go to Competitions",
      callback: () => {
        router.push({
          name: "competitions"
        })
      }
    })
  } else {
    trackDialog.value.open()
  }
}

const viewTrackDialog = ref(null)

const openViewTrackDialog = (track) => {
  viewTrackDialog.value.open(track)
}

const busy = useBusy()

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
      }
    },
    { immediate: true }
  )

  watch(
    () => statistics.competitionId,
    (id) => {
      if (id) {
        tracksStore.loadStatistics(id)
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
      <div
        class="tracks"
        v-if="
          tracksStore.recentTracks &&
          Object.keys(tracksStore.recentTracks).length
        "
      >
        <TrackEntry
          v-for="(track, key) in tracksStore.recentTracks"
          :key="key"
          :track="track"
          @click="openViewTrackDialog(track)"
        />
      </div>
      <div class="no-data" v-else>No tracks yet.</div>
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

      <div class="list" v-if="tracksStore.statistics.entries.length">
        <StatsEntry
          v-for="(entry, id) in tracksStore.statistics.entries"
          :key="id"
          :name="entry.alias"
          :score="entry.score"
          :leader="
            parseInt(Object.keys(tracksStore.statistics.entries)[0]) === id
          "
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
.dashboard {
  padding-bottom: 5rem;
}

.no-data {
  padding: 1rem;
  text-align: center;
  font-size: 12px;
}

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

  .list {
    margin-top: 1rem;

    .component.stats-entry {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
