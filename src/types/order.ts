
import { CartItem } from "../context/CartContext";

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "placed" | "packed" | "delivered";
  createdAt: string;
}
