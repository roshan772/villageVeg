// src/services/orderservice.ts
import { db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Order } from "../types/order";
import { CartItem } from "../context/CartContext";

const auth = getAuth();
const ordersCollection = collection(db, "orders");

// CREATE order (place order)
export const placeOrder = async (items: CartItem[], total: number) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  if (!items.length) throw new Error("Cart is empty");

  await addDoc(ordersCollection, {
    userId: user.uid,
    items,
    total,
    status: "placed",
    createdAt: new Date().toISOString(),
  });
};

// READ orders for current user
export const getOrders = async (uid: string): Promise<Order[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    ordersCollection,
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId as string,
      items: (data.items as CartItem[]) || [],
      total: (data.total as number) || 0,
      status: (data.status as "placed" | "packed" | "delivered") || "placed",
      createdAt: (data.createdAt as string) || "",
    };
  });
};

// READ single order (optional)
export const getOrderById = async (id: string): Promise<Order> => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const ref = doc(db, "orders", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Order not found");
  if (snap.data().userId !== user.uid) throw new Error("Unauthorized");

  const data = snap.data();
  return {
    id: snap.id,
    userId: data.userId || "",
    items: data.items || [],
    total: data.total || 0,
    status: data.status || "placed",
    createdAt: data.createdAt || "",
  };
};
