import { defineStore } from "pinia"

import { useAuthStore } from "./auth"
import { useCompetitionsStore } from "./competitions"
import { useFriendsStore } from "./friends"
import { supabase } from "../util/supabase"

export const useTracksStore = defineStore({
  id: "tracks",
  state: () => ({
    defaultTrack: {
      competition: null,
      teams: []
    },
    statistics: {
      competition_id: null,
      entries: []
    },
    recentTracksSubscription: null,
    recentTracks: null,
    authStore: null,
    competitionStore: null,
    friendsStore: null
  }),
  actions: {
    async initialize() {
      this.authStore = useAuthStore()
      this.competitionsStore = useCompetitionsStore()
      this.friendsStore = useFriendsStore()

      await this.refresh()
    },

    async refresh() {
      const { data, error } = await supabase
        .from("tracks")
        .select("competitions(id,name), *")
        .contains("results", `[{ "users": [${this.authStore.user.id}] }]`)
        .limit(3)

      if (error) {
        throw error
      }

      this.recentTracks = data
    },

    async create(data) {
      const competition = this.competitionsStore.competitions[data.competition]

      const scores = data.teams
        .filter((t) => !!t.users.filter((u) => !!u).length)
        .map((t) => t.score)

      const trackToAdd = {
        profile_id: this.authStore.user.id,
        competition_id: data.competition,
        results: data.teams
          .filter((t) => !!t.users.filter((u) => !!u).length)
          .map((team) => {
            const mappedTeam = {
              users: team.users
                .map((user) => {
                  return user
                })
                .filter((u) => !!u),
              has_won: competition.has_points
                ? competition.highest_points_win
                  ? `${Math.max(...scores)}` === `${team.score}`
                  : `${Math.min(...scores)}` === `${team.score}`
                : !!team.has_won
            }

            if (competition.has_points) {
              mappedTeam.score = team.score
            }

            return mappedTeam
          })
      }

      const { error } = await supabase
        .from("tracks")
        .insert(trackToAdd)
        .select()

      if (error) {
        throw error
      }

      await this.refresh()
    },

    async delete(id) {
      const { error } = await supabase.from("tracks").delete().eq("id", id)

      if (error) {
        throw error
      }

      await this.refresh()
    },

    async loadStatistics(competition_id) {
      this.statistics.competition_id = competition_id
      this.statistics.entries = []

      const { data, error } = await supabase
        .from("tracks")
        .select("competitions(id,name), *")
        .eq("competition_id", competition_id)

      if (error) {
        throw error
      }

      const statistics = data.reduce((acc, entry) => {
        entry.results.forEach((team) => {
          team.users.forEach((user) => {
            if (!acc[user]) {
              acc[user] = {
                user_id: user,
                alias: this.friendsStore.getUserName(user),
                score: 1000,
                played: 0
              }
            }

            acc[user].played++
            acc[user].score += team.has_won ? 26 : -24
          })
        })
        return acc
      }, {})

      this.statistics.entries = Object.values(statistics).sort((a, b) => {
        return b.score - a.score
      })
    }
  }
})
