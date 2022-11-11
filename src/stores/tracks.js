import { defineStore } from "pinia"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where
} from "firebase/firestore"
import { db } from "../util/firebase"
import { useAuthStore } from "./auth"
import { useCompetitionsStore } from "./competitions"
import { useFriendsStore } from "./friends"

export const useTracksStore = defineStore({
  id: "tracks",
  state: () => ({
    defaultTrack: {
      competition: null,
      teams: []
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

      this.recentTracksSubscription = onSnapshot(
        query(
          collection(db, "tracks"),
          where("members", "array-contains", this.authStore.firebase.uid),
          orderBy("date", "desc"),
          limit(5)
        ),
        (snapshot) => {
          this.recentTracks = {}
          snapshot.forEach((doc) => {
            this.recentTracks[doc.id] = doc.data()
          })
        },
        (error) => {
          console.error(error)
        }
      )
    },
    async create(data) {
      const competition = this.competitionsStore.competitions[data.competition]

      const scores = data.teams
        .filter((t) => !!t.users.filter((u) => !!u).length)
        .map((t) => t.score)

      const trackToAdd = {
        competition: data.competition,
        title: competition.name,
        teams: data.teams
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

      await addDoc(collection(db, "tracks"), {
        ...trackToAdd,
        date: new Date().toISOString(),
        owner: this.authStore.firebase.uid,
        members: trackToAdd.teams.map((t) => t.users).flat()
      })
    },
    async delete(id) {
      await deleteDoc(doc(db, "tracks", id))
    }
  }
})
