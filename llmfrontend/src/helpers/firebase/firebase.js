import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: process.env.FIREBASE_PUBLIC_APIKEY,
    authDomain: process.env.FIREBASE_PUBLIC_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PUBLIC_PROJECTID,
    storageBucket: process.env.FIREBASE_PUBLIC_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_PUBLIC_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_PUBLIC_APPID
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
