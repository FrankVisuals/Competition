import { defineStore } from "pinia"

import { supabase } from "../util/supabase"

let resolve

const init = new Promise((r) => {
  resolve = r
})

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: null,
    supabase: null,
    initialized: false
  }),
  getters: {
    isUserLoaded() {
      return !!this.supabase && !!this.user
    }
  },
  actions: {
    async initialize() {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      this.supabase = user
      await this.getUser()
      this.initialized = true
      resolve(user)
    },
    async waitForInit() {
      return init
    },
    async login(credentials) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      })

      if (error) {
        throw error
      }

      this.supabase = data.user

      await this.getUser()
    },
    async register(user) {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
      })

      if (error) {
        throw error
      }

      this.supabase = data.user

      this.createUser()
    },
    async logout() {
      await supabase.auth.signOut()
      this.supabase = null
      this.user = null
    },
    async delete() {
      /**
       * TODO: There is no delete user functionality
       * in supabase. Maybe update mail to something invalid?
       */
      this.supabase = null
      this.user = null
    },
    async resetPassword(email) {
      const { error } = supabase.auth.resetPasswordForEmail(email)

      if (error) {
        throw error
      }
    },
    async changePassword(updated) {
      const { error } = await supabase.auth.updateUser({
        password: updated
      })

      if (error) {
        throw error
      }
    },
    async getUser() {
      if (!this.supabase?.id) {
        return null
      }

      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("user_id", this.supabase.id)

      if (error) {
        throw error
      }

      if (!data?.length) {
        await this.createUser()
      } else {
        this.user = data[0]
      }
    },
    async createUser() {
      const { error } = await supabase.from("profiles").insert({
        alias: "",
        email: this.supabase.email,
        user_id: this.supabase.id
      })

      if (error) {
        throw error
      }

      await this.getUser()
    },
    async updateUser(data) {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("user_id", this.supabase.id)

      if (error) {
        throw error
      }

      Object.keys(data).forEach((key) => {
        this.user[key] = data[key]
      })
    }
  }
})
