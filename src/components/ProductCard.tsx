// src/components/ProductCard.tsx
import React from "react";
import { Image, Pressable, Text, View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../types/product";
import { productImages } from "../utils/productImages";

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

  const discountPercent = product.discountPercent || 0;
  const hasDiscount = discountPercent > 0;
  const originalPrice = product.originalPrice || product.price;
  const rating = product.rating || 4.4;
  const ratingCount = product.ratingCount || 130;
  const soldCount = product.soldCount || 1200;
  const freeDelivery = product.freeDelivery ?? true;

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
        <View style={styles.imageContainer}>
          <Image
            source={
              productImages[product.image || "default.png"] ||
              productImages["default.png"]
            }
            style={styles.image}
            resizeMode="cover"
          />

          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercent}%</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {product.name}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>
              Rs. {product.price.toFixed(0)}
            </Text>
            {hasDiscount && (
              <Text style={styles.oldPrice}>
                Rs. {originalPrice.toFixed(0)}
              </Text>
            )}
            <Text style={styles.unit}> / {product.unit}</Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#f59e0b" />
              <Text style={styles.ratingText}>
                {rating.toFixed(1)} ({ratingCount})
              </Text>
            </View>
            <Text style={styles.soldText}>
              {soldCount.toLocaleString()} Sold
            </Text>
          </View>

          <View style={styles.stockCategoryRow}>
            <Text style={[styles.stock, getStockStyle()]}>
              {product.stock <= 0
                ? "Out of stock"
                : product.stock <= 5
                  ? `Only ${product.stock} left`
                  : `In stock`}
            </Text>
            <Text style={styles.category}>{product.category}</Text>
          </View>

          {freeDelivery && (
            <View style={styles.freeDeliveryBadge}>
              <Text style={styles.freeDeliveryText}>FREE DELIVERY</Text>
            </View>
          )}

          {children && <View style={styles.childrenContainer}>{children}</View>}

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
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  pressable: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    height: 140,
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
    lineHeight: 20,
    height: 40,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 6,
  },
  currentPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: "#16a34a",
  },
  oldPrice: {
    fontSize: 13,
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  unit: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: "#4b5563",
    fontWeight: "500",
  },
  soldText: {
    fontSize: 12,
    color: "#64748b",
  },
  stockCategoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  stock: {
    fontSize: 13,
    fontWeight: "600",
  },
  stockOk: { color: "#15803d" },
  stockLow: { color: "#f59e0b" },
  stockOut: { color: "#ef4444" },
  category: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
  },
  freeDeliveryBadge: {
    backgroundColor: "#dcfce7",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  freeDeliveryText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#15803d",
  },
  childrenContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: "#111827",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
  },
  addButtonPressed: {
    backgroundColor: "#0f172a",
    opacity: 0.9,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
