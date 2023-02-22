import { defineStore } from "pinia"
import { useAuthStore } from "./auth"
import { supabase } from "../util/supabase"

export const useFriendsStore = defineStore({
  id: "friends",
  state: () => ({
    friends: [],
    authStore: null
  }),
  getters: {
    getUserName(state) {
      return (id) => {
        if (state.authStore.supabase.id === id) {
          return state.authStore.user.displayName
        }

        const friend = state.friends[id]

        if (friend) {
          return friend.displayName
        }

        return "unknown"
      }
    },
    selectable: (state) => {
      return [
        {
          key: undefined,
          value: "🚮 Remove Selection"
        }
      ]
        .concat(
          Object.entries(state.friends).map(([id, friend]) => {
            return {
              key: id,
              value: friend.alias || friend.displayName
            }
          })
        )
        .concat([
          {
            key: state.authStore.supabase.id,
            value: `${state.authStore.supabase.displayName} (You)`
          }
        ])
    }
  },
  actions: {
    async initialize() {
      this.authStore = useAuthStore()
      return this.refresh()
    },
    async refresh() {
      const { error, data } = await supabase
        .from("friends")
        .select(
          `
          id,
          friend_id,
          alias,
          profiles (
            is_guest
          )
        `
        )
        .eq("user_id", this.authStore.supabase.id)

      if (error) {
        throw error
      }

      this.friends = data.reduce((acc, friend) => {
        acc[friend.id] = friend
        return acc
      }, {})
    },
    async find(email) {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("email", email)

      if (error) {
        throw error
      }

      return data
    },
    async create(alias) {
      // 1. create the guest in the users collection
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          alias: alias,
          email: null,
          owner_id: this.authStore.supabase.id,
          is_guest: true
        })
        .select()

      if (error) {
        throw error
      }

      // 2. add the guest to the friends collection of the current user
      await supabase.from("friends").insert({
        user_id: this.authStore.supabase.id,
        friend_id: data[0].id,
        alias
      })

      // 3. refresh friends
      await this.refresh()
    },
    async add(data) {
      await supabase.from("friends").insert({
        ...data,
        user_id: this.authStore.supabase.id
      })
    },
    async update(id, data) {
      await supabase.from("friends").update(data).eq("id", id)
    },
    async delete(id) {
      await supabase.from("friends").delete().eq("id", id)
    }
  }
})
