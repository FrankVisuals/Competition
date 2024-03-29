import { defineStore } from "pinia"
import { useAuthStore } from "./auth"
import { useFriendsStore } from "./friends"
import { supabase } from "../util/supabase"

export const useCompetitionsStore = defineStore({
  id: "competitions",
  state: () => ({
    competitions: [],
    defaultCompetition: {
      name: null,
      has_teams: false,
      has_points: false,
      highest_points_win: true,
      user_id: null,
      members: []
    },
    authStore: null,
    friendsStore: null
  }),
  getters: {
    selectable(state) {
      return Object.entries(state.competitions).map(([id, competition]) => {
        return {
          key: id,
          value: competition.name
        }
      })
    }
  },
  actions: {
    async initialize() {
      this.authStore = useAuthStore()
      this.friendsStore = useFriendsStore()
      return this.refresh()
    },
    async refresh() {
      const friends = await this.friendsStore.getFriends()

      const { error, data } = await supabase
        .from("competitions")
        .select()
        .in("user_id", [
          this.authStore.supabase.id,
          ...Object.values(friends)
            .filter((friend) => !!friend.profiles.user_id)
            .map((friend) => friend.profiles.user_id)
        ])

      if (error) {
        throw error
      }

      this.competitions = data.reduce((acc, entry) => {
        acc[entry.id] = entry
        return acc
      }, {})
    },
    async create(data) {
      await supabase.from("competitions").insert({
        ...data,
        user_id: this.authStore.supabase.id,
        members: [this.authStore.supabase.id]
      })
      await this.refresh()
    },
    async update(id, data) {
      await supabase.from("competitions").update(data).eq("id", id)
      await this.refresh()
    },
    async delete(id) {
      // no real deletion, but removing the owner
      await supabase.from("competitions").update({ user_id: null }).eq("id", id)
      await this.refresh()
    },
    async loadStatisticsFor(id) {
      await supabase.from("tracks").select().eq("competition_id", id)
    }
  }
})
