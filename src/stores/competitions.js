import { defineStore } from "pinia"
import { db } from "../util/firebase"
import { doc, setDoc } from "firebase/firestore"

import { collection, onSnapshot } from "firebase/firestore"

export const useCompetitionsStore = defineStore({
  id: "competitions",
  state: () => ({
    competitions: [],
    defaultCompetition: {
      name: null,
      has_teams: false,
      has_points: false
    },
    subscription: null
  }),
  actions: {
    async reload() {
      if (!this.subscription) {
        this.subscription = onSnapshot(
          collection(db, "competitions"),
          (snapshot) => {
            this.competitions = []
            snapshot.forEach((doc) => {
              this.competitions.push(doc.data())
            })
          },
          (error) => {
            console.error(error)
          }
        )
      }
    },
    async create(data) {
      await setDoc(doc(db, "competitions"), data)
    }
  }
})
