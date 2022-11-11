<script setup>
import CentralAdd from "@/components/CentralAdd.vue"
import TrackEntry from "@/components/TrackEntry.vue"
import TrackDialog from "@/fragments/TrackDialog.vue"
import { ref } from "vue"
import { useTracksStore } from "../stores/tracks"

const trackDialog = ref(null)
const openTrackDialog = (id, track) => {
  trackDialog.value.open(id, track)
}

const tracksStore = useTracksStore()
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
          @click="openTrackDialog(key, track)"
        />
      </div>
    </section>

    <section class="statistics">
      <span class="section-title">Statistics</span>
    </section>

    <CentralAdd @click="openTrackDialog" />
  </div>

  <TrackDialog ref="trackDialog" />
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
</style>
