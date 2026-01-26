// app/(tabs)/cart.tsx
import React from "react";
import { FlatList, Pressable, Text, View,Alert } from "react-native";
import { useCart } from "../../src/context/CartContext";
import { placeOrder } from "@/src/services/orderService";

export default function CartScreen() {
  const { items, increment, decrement, removeFromCart, clearCart, total } =
    useCart();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "900", marginBottom: 12 }}>
        Cart
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800" }}>{item.name}</Text>
            <Text>
              Rs. {item.price} / {item.unit}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 10,
              }}
            >
              <Pressable
                onPress={() => decrement(item.id)}
                style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}
              >
                <Text style={{ fontWeight: "900" }}>-</Text>
              </Pressable>

              <Text style={{ fontSize: 16, fontWeight: "800" }}>
                {item.qty}
              </Text>

              <Pressable
                onPress={() => increment(item.id)}
                style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}
              >
                <Text style={{ fontWeight: "900" }}>+</Text>
              </Pressable>

              <Pressable
                onPress={() => removeFromCart(item.id)}
                style={{ marginLeft: "auto" }}
              >
                <Text style={{ color: "#dc2626", fontWeight: "800" }}>
                  Remove
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {items.length > 0 ? (
        <View style={{ marginTop: 10, gap: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "900" }}>
            Total: Rs. {total}
          </Text>

          <Pressable
            onPress={clearCart}
            style={{
              backgroundColor: "#111",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>Clear Cart</Text>
          </Pressable>
          <Pressable
            onPress={async () => {
              try {
                await placeOrder(items, total);
                Alert.alert("Success", "Order placed!");
                clearCart();
              } catch (e: any) {
                Alert.alert("Error", e?.message ?? "Failed to place order");
              }
            }}
            style={{
              backgroundColor: "#16a34a",
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800" }}>
              Place Order
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
