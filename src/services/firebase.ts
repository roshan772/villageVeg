
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBQ9GVXB5nPA9U39DhGgVz4sFpboLEL7og",
  authDomain: "villageveg-c710b.firebaseapp.com",
  projectId: "villageveg-c710b",
  storageBucket: "villageveg-c710b.firebasestorage.app",
  messagingSenderId: "12225088160",
  appId: "1:12225088160:web:8ec0d5c031adae91b6d7c5",
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
