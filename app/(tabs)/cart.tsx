// app/(tabs)/cart.tsx
import React from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { useCart } from "../../src/context/CartContext";
import { placeOrder } from "@/src/services/orderService";

export default function CartScreen() {
  const { items, increment, decrement, removeFromCart, clearCart, total } =
    useCart();

  const [placingOrder, setPlacingOrder] = React.useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;

    setPlacingOrder(true);
    try {
      await placeOrder(items, total);
      Alert.alert("Success", "Your order has been placed successfully!");
      clearCart();
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.message || "Failed to place order. Please try again.",
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleClearCart = () => {
    Alert.alert("Clear Cart", "Are you sure you want to remove all items?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: clearCart,
      },
    ]);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Your basket is empty</Text>
        <Text style={styles.emptySubtitle}>
          Add some fresh vegetables from the Farm tab
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Your Basket</Text>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(500).delay(index * 80)}>
            <View style={styles.cartItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  Rs. {item.price} / {item.unit}
                </Text>
              </View>

              <View style={styles.actionsRow}>
                <View style={styles.quantityControls}>
                  <Pressable
                    onPress={() => decrement(item.id)}
                    disabled={item.qty <= 1}
                    style={[
                      styles.qtyBtn,
                      item.qty <= 1 && styles.qtyBtnDisabled,
                    ]}
                  >
                    <Text style={styles.qtyText}>-</Text>
                  </Pressable>

                  <Text style={styles.qtyDisplay}>{item.qty}</Text>

                  <Pressable
                    onPress={() => increment(item.id)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>Rs. {total.toFixed(0)}</Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            onPress={handleClearCart}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed,
            ]}
          >
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </Pressable>

          <Pressable
            onPress={handlePlaceOrder}
            disabled={placingOrder}
            style={({ pressed }) => [
              styles.placeOrderButton,
              pressed && styles.placeOrderButtonPressed,
              placingOrder && styles.placeOrderButtonDisabled,
            ]}
          >
            {placingOrder ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.placeOrderText}>Place Order</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 160,
  },
  cartItem: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  itemInfo: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  itemPrice: {
    fontSize: 16,
    color: "#16a34a",
    fontWeight: "600",
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  qtyBtnDisabled: {
    opacity: 0.5,
  },
  qtyText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1e293b",
  },
  qtyDisplay: {
    minWidth: 50,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#16a34a",
  },
  removeBtn: {
    padding: 8,
  },
  removeText: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: 15,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16
   
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#16a34a",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  clearButtonPressed: {
    backgroundColor: "#0f172a",
  },
  clearButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  placeOrderButton: {
    flex: 2,
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  placeOrderButtonPressed: {
    backgroundColor: "#15803d",
  },
  placeOrderButtonDisabled: {
    opacity: 0.7,
  },
  placeOrderText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#f8fafc",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4b5563",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
});
