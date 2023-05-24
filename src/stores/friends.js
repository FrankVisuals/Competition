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
        if (state.authStore.user.id === id) {
          return state.authStore.user.alias
        }

        const friend = Object.values(state.friends).find((friend) => {
          return friend.friend_id === id
        })

        if (friend) {
          return friend.alias
        }

        return "unknown"
      }
    },
    selectableNonGuestFriends: (state) => {
      return [
        {
          key: null,
          value: ""
        },
        ...Object.entries(state.friends)
          .filter(([, friend]) => {
            return !friend.profiles.is_guest
          })
          .map(([id, friend]) => {
            return {
              key: id,
              value: friend.alias
            }
          })
      ]
    },
    selectable: (state) => {
      return [
        {
          key: undefined,
          value: "🚮 Remove Selection"
        }
      ]
        .concat(
          Object.values(state.friends).map((friend) => {
            return {
              key: friend.friend_id,
              value: friend.alias
            }
          })
        )
        .concat([
          {
            key: state.authStore.user.id,
            value: `${state.authStore.user.alias} (You)`
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
            is_guest,
            user_id
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
    async getFriends() {
      if (!this.friends.length) {
        await this.refresh()
      }

      return this.friends
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
    async add(friendId, alias) {
      const { error } = await supabase.from("friends").insert({
        alias,
        friend_id: friendId,
        user_id: this.authStore.supabase.id
      })

      if (error) {
        throw error
      }

      await this.refresh()
    },
    async update(id, data) {
      const { error } = await supabase.from("friends").update(data).eq("id", id)

      if (error) {
        throw error
      }

      await this.refresh()
    },
    async transferGuestToFriend(friendId, fromProfileId, toProfileId) {
      // TODO: this must become an edge function, as the results must be checked & changed in json
      // Transactional handling required.
    },
    async delete(id) {
      const { error } = await supabase.from("friends").delete().eq("id", id)

      if (error) {
        throw error
      }

      await this.refresh()
    }
  }
})
