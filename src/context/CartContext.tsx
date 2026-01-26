
import React, { createContext, useContext, useMemo, useReducer } from "react";
import { Product } from "../types/product";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  unit: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD"; product: Product; qty?: number }
  | { type: "REMOVE"; id: string }
  | { type: "INC"; id: string }
  | { type: "DEC"; id: string }
  | { type: "CLEAR" };

const initialState: CartState = { items: [] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const qtyToAdd = action.qty ?? 1;
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + qtyToAdd } : i,
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: action.product.id!,
            name: action.product.name,
            price: action.product.price,
            unit: action.product.unit,
            qty: qtyToAdd,
          },
        ],
      };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };

    case "INC":
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty + 1 } : i,
        ),
      };

    case "DEC":
      return {
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const total = useMemo(
    () => state.items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [state.items],
  );

  const value = useMemo(
    () => ({
      items: state.items,
      addToCart: (product: Product, qty?: number) =>
        dispatch({ type: "ADD", product, qty }),
      removeFromCart: (id: string) => dispatch({ type: "REMOVE", id }),
      increment: (id: string) => dispatch({ type: "INC", id }),
      decrement: (id: string) => dispatch({ type: "DEC", id }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      total,
    }),
    [state.items, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
