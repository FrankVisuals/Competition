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
  getters: {
    getUserName(state) {
      return (id) => {
        if (state.authStore.firebase.uid === id) {
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
            key: state.authStore.firebase.uid,
            value: `${state.authStore.firebase.displayName} (You)`
          }
        ])
    }
  },
  actions: {
    async initialize() {
      if (this.subscription) {
        return
      }

      this.authStore = useAuthStore()

      this.subscription = onSnapshot(
        query(collection(db, "users", this.authStore.firebase.uid, "friends")),
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
    async create(data) {
      // 1. create the guest in the users collection
      const guestUser = await addDoc(collection(db, "users"), {
        ...data,
        owner: this.authStore.firebase.uid
      })

      // 2. add the guest to the friends collection of the current user
      await setDoc(
        doc(db, "users", this.authStore.firebase.uid, "friends", guestUser.id),
        data
      )
    },
    async add(data) {
      await addDoc(
        collection(db, "users", this.authStore.firebase.uid, "friends"),
        data
      )
    },
    async update(id, data) {
      await updateDoc(
        doc(db, "users", this.authStore.firebase.uid, "friends", id),
        data
      )
    },
    async delete(id) {
      await deleteDoc(
        doc(db, "users", this.authStore.firebase.uid, "friends", id)
      )
    }
  }
})
