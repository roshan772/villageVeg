// src/components/ProductCard.tsx
import React from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Product } from "../types/product";

type Props = {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
  children?: React.ReactNode;
};

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
  children,
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 10, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
  };

  // Determine stock status color
  const getStockStyle = () => {
    if (product.stock <= 0) return styles.stockOut;
    if (product.stock <= 5) return styles.stockLow;
    return styles.stockOk;
  };

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        {/* Product Name */}
        <Text style={styles.name}>{product.name}</Text>

        {/* Price – most prominent after name */}
        <Text style={styles.price}>
          Rs. {product.price.toFixed(0)}{" "}
          <Text style={styles.unit}>/ {product.unit}</Text>
        </Text>

        {/* Stock & Category row */}
        <View style={styles.metaRow}>
          <Text style={[styles.stock, getStockStyle()]}>
            {product.stock <= 0
              ? "Out of stock"
              : product.stock <= 5
                ? `Only ${product.stock} left`
                : `In stock: ${product.stock}`}
          </Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>

        {/* Optional children (e.g. quantity selector, favorite icon) */}
        {children && <View style={styles.childrenContainer}>{children}</View>}

        {/* Add to Cart button – only if there's stock and callback */}
        {product.stock > 0 && onAddToCart && (
          <Pressable
            onPress={onAddToCart}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
            ]}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </Pressable>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden", // important for rounded corners + shadow
  },
  pressable: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#16a34a", // fresh green – stands out nicely
    marginBottom: 8,
  },
  unit: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stock: {
    fontSize: 13,
    fontWeight: "600",
  },
  stockOk: {
    color: "#15803d", // green
  },
  stockLow: {
    color: "#f59e0b", // orange warning
  },
  stockOut: {
    color: "#ef4444", // red
  },
  category: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
  },
  childrenContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#111827", // same dark as your login button
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonPressed: {
    backgroundColor: "#0f172a",
    opacity: 0.9,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
