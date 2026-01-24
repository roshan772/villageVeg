import { getAuth } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const auth = getAuth();
const productCollection = collection(db, "products");

async function isAdmin(): Promise<boolean> {
  //snap (short for "snapshot") is the object returned by Firebase that contains the data from a specific document in your database.
  const user = auth.currentUser;
  if (!user) return false;
  const userRef = doc(db, "users", user.uid); //db: Look in my Firestore database...."users": Go into the collection (folder) named "users"...user.uid: Find the specific document (file) that has this unique ID.
  const snap = await getDoc(userRef); //When you call getDoc(userRef), Firebase goes to the "users" collection and finds the document for that specific UID. It returns the snap object.
  if (!snap.exists()) return false; //This is a built-in method. Because you are searching for a user by their ID, there is a chance that user doesn't actually exist in your database yet.
  return snap.data().role === "admin"; //Reading the letter	Pulls out the actual information (the role).
}
