import { defineStore } from "pinia"
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  where,
  getDocs,
  setDoc,
  addDoc
} from "firebase/firestore"
import { db } from "../util/firebase"
import { useAuthStore } from "./auth"

export const useFriendsStore = defineStore({
  id: "friends",
  state: () => ({
    friends: [],
    defaultFriend: {
      displayName: null,
      alias: null,
      isGuest: false
    },
    subscription: null,
    authStore: null
  }),
  actions: {
    async initialize() {
      if (this.subscription) {
        return
      }

      this.authStore = useAuthStore()

      this.subscription = onSnapshot(
        query(collection(db, "users", this.authStore.user.uid, "friends")),
        (snapshot) => {
          this.friends = {}
          snapshot.forEach((doc) => {
            this.friends[doc.id] = doc.data()
          })
        },
        (error) => {
          console.error(error)
        }
      )
    },
    async find(email) {
      return await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      )
    },
    async create(id, data) {
      await setDoc(
        doc(db, "users", this.authStore.user.uid, "friends", id),
        data
      )
    },
    async add(data) {
      await addDoc(
        collection(db, "users", this.authStore.user.uid, "friends"),
        data
      )
    },
    async update(id, data) {
      await updateDoc(
        doc(db, "users", this.authStore.user.uid, "friends", id),
        data
      )
    },
    async delete(id) {
      await deleteDoc(doc(db, "users", this.authStore.user.uid, "friends", id))
    }
  }
})
