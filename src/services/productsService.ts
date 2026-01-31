import { getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Product } from "../types/product";

const auth = getAuth();
const productCollection = collection(db, "products");

async function isAdmin(): Promise<boolean> {
  const user = auth.currentUser;
  if (!user) return false;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return false;

  return snap.data().role === "admin";
}

// READ all products
export const getProducts = async (): Promise<Product[]> => {
  const q = query(productCollection, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: (data.name as string) || "",
      price: (data.price as number) || 0,
      unit: (data.unit as string) || "kg",
      stock: (data.stock as number) || 0,
      category: (data.category as string) || "",
      description: (data.description as string) || "",

      // ✅ local image file name
      image: (data.image as string) || "default.png",

      createdAt: (data.createdAt as string) || "",
      createdBy: (data.createdBy as string) || "",
    };
  });
};

export const getProductById = async (id: string): Promise<Product> => {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Product not found");

  const data = snap.data();
  return {
    id: snap.id,
    name: data.name || "",
    price: data.price || 0,
    unit: data.unit || "kg",
    stock: data.stock || 0,
    category: data.category || "",
    description: data.description || "",

    image: data.image || "default.png",

    createdAt: data.createdAt || "",
    createdBy: data.createdBy || "",
  };
};

// CREATE (admin only)
export const addProduct = async (
  name: string,
  price: number,
  unit: string,
  stock: number,
  category: string,
  description: string = "",
  image: string = "default.png",
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  if (!(await isAdmin())) throw new Error("Unauthorized");

  await addDoc(productCollection, {
    name,
    price,
    unit,
    stock,
    category,
    description,
    image, 
    createdBy: user.uid,
    createdAt: new Date().toISOString(),
  });
};

// UPDATE (admin only)
export const updateProduct = async (
  id: string,
  updates: Partial<
    Pick<
      Product,
      "name" | "price" | "unit" | "stock" | "category" | "description" | "image"
    >
  >,
) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Product not found");

  await updateDoc(ref, updates);
};

// DELETE (admin only)
export const deleteProduct = async (id: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Product not found");

  await deleteDoc(ref);
};
