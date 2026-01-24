import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";
import { Product } from "../types/product";

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

//Get products
export const getProducts = async ():Promise<Product[]> =>{
    const q = query(productCollection, orderBy("createdAt","desc"));
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d)=>{
        const data = d.data()
        return {
          id: d.id,
          name: data.name as string,
          price: data.price as number,
          unit: data.unit as string,
          stock: data.stock as number,
          category: data.category as string,
          description: (data.description as string) || "",
          imageUrl: (data.imageUrl as string) || "",
          createdAt: data.createdAt as string,
          createdBy: data.createdBy as string,
        };
    })
}