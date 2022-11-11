import { defineStore } from "pinia"
import {
  addDoc,
  query,
  where,
  collection,
  onSnapshot,
  updateDoc,
  doc
} from "firebase/firestore"
import { db } from "../util/firebase"
import { useAuthStore } from "./auth"

export const useCompetitionsStore = defineStore({
  id: "competitions",
  state: () => ({
    competitions: [],
    defaultCompetition: {
      name: null,
      has_teams: false,
      has_points: false,
      highest_points_win: true,
      owner: null,
      members: []
    },
    subscription: null,
    authStore: null
  }),
  getters: {
    selectable: (state) => {
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
      if (this.subscription) {
        return
      }

      this.authStore = useAuthStore()

      this.subscription = onSnapshot(
        query(
          collection(db, "competitions"),
          where("members", "array-contains", this.authStore.firebase.uid)
        ),
        (snapshot) => {
          this.competitions = {}
          snapshot.forEach((doc) => {
            this.competitions[doc.id] = doc.data()
          })
        },
        (error) => {
          console.error(error)
        }
      )
    },
    async create(data) {
      await addDoc(collection(db, "competitions"), {
        ...data,
        owner: this.authStore.firebase.uid,
        members: [this.authStore.firebase.uid]
      })
    },
    async update(id, data) {
      await updateDoc(doc(db, "competitions", id), data)
    },
    async delete(id, { members }) {
      // no real deletion, but removing the owner
      await updateDoc(doc(db, "competitions", id), {
        owner: null,
        members: members.filter((m) => m !== this.authStore.firebase.uid)
      })
    }
  }
})
