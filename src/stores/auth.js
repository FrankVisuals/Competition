import { defineStore } from "pinia"
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from "firebase/auth"
import { db, auth } from "../util/firebase"
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"

let resolve

const init = new Promise((r) => {
  resolve = r
})

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    user: null,
    firebase: null,
    initialized: false
  }),
  getters: {
    isUserLoaded() {
      return !!this.firebase && !!this.user
    }
  },
  actions: {
    async initialize(firebaseUser) {
      this.firebase = firebaseUser
      await this.getUser()
      this.initialized = true
      resolve(firebaseUser)
    },
    async waitForInit() {
      return init
    },
    async login(data) {
      const credential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      this.firebase = credential.user
      await this.getUser()
    },
    async register(user) {
      const credential = await createUserWithEmailAndPassword(
        auth,
        user.email,
        user.password
      )

      this.firebase = credential.user
      this.createUser()
    },
    async logout() {
      await signOut(auth)
      this.firebase = null
      this.user = null
    },
    async delete() {
      await deleteDoc(db, "users", this.firebase.uid)
      await deleteUser(this.firebase)
      this.firebase = null
      this.user = null
    },
    async resetPassword(email) {
      await sendPasswordResetEmail(auth, email)
    },
    async changePassword(current, updated) {
      const credential = EmailAuthProvider.credential(
        this.firebase.email,
        current
      )
      await reauthenticateWithCredential(this.firebase, credential)
      await updatePassword(this.firebase, updated)
    },
    async getUser() {
      if (!this.firebase?.uid) {
        return null
      }

      const user = await getDoc(doc(db, "users", this.firebase.uid))

      if (!user?.data()) {
        await this.createUser()
      } else {
        this.user = user.data()
      }
    },
    async createUser() {
      await setDoc(doc(db, "users", this.firebase.uid), {
        displayName: this.firebase.displayName,
        email: this.firebase.email
      })
      await this.getUser()
    },
    async updateUser(data) {
      await updateDoc(doc(db, "users", this.firebase.uid), data)

      Object.keys(data).forEach((key) => {
        this.user[key] = data[key]
      })
    }
  }
})
