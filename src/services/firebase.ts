import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQ9GVXB5nPA9U39DhGgVz4sFpboLEL7og",
  authDomain: "villageveg-c710b.firebaseapp.com",
  projectId: "villageveg-c710b",
  storageBucket: "villageveg-c710b.firebasestorage.app",
  messagingSenderId: "12225088160",
  appId: "1:12225088160:web:8ec0d5c031adae91b6d7c5",
};

const app = initializeApp(firebaseConfig);

// ─── Important change here ────────────────────────────────────────
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
