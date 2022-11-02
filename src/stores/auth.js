import { defineStore } from "pinia"
import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth"
import { auth } from "../util/firebase"

let resolve

const init = new Promise((r) => {
  resolve = r
})

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: null,
    initialized: false
  }),
  getters: {
    isUserLoaded() {
      return !!this.user
    }
  },
  actions: {
    async waitForInit() {
      return init
    },
    initialize(user) {
      this.user = user
      this.initialized = true
      resolve(user)
    },
    async login(user) {
      const credential = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      )

      this.user = credential.user
    },
    async register(user) {
      const credential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      )

      this.user = credential.user
    },
    async logout() {
      await signOut(auth)
      this.user = null
    },
    async delete() {
      await deleteUser(this.user)
      this.user = null
    }
  }
})
