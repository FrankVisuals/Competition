import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA2iVgT_Nkls0j4vPKObqoOumeeecqYQMY",
  authDomain: "competition-tracker-24785.firebaseapp.com",
  projectId: "competition-tracker-24785",
  storageBucket: "competition-tracker-24785.appspot.com",
  messagingSenderId: "328816121572",
  appId: "1:328816121572:web:e69b73bea812ff0965bef1"
}
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

export const auth = getAuth(app)

export default app
