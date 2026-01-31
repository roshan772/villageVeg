// app/product/[id].tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../../src/context/CartContext";
import { getProductById } from "../../src/services/productsService";
import { Product } from "../../src/types/product";
import { productImages } from "../../src/utils/productImages";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.stock < quantity) {
      Alert.alert("Not enough stock", `Only ${product.stock} available`);
      return;
    }
    addToCart(product, quantity);
    Alert.alert("Added", `${quantity} × ${product.name} added to cart`);
  };

  const onPressIn = () => (buttonScale.value = withSpring(0.94));
  const onPressOut = () => (buttonScale.value = withSpring(1));

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error || "Product not found"}</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent = product.discountPercent || 0;
  const hasDiscount = discountPercent > 0;
  const originalPrice = product.originalPrice || product.price;

  // Image source with safe fallback
  const imageSource =
    product.image && productImages[product.image]
      ? productImages[product.image]
      : productImages["default.png"];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.hero}>
          {imageSource ? (
            <>
              <Image
                source={imageSource}
                style={styles.heroImage}
                resizeMode="cover"
                onLoadEnd={() => setImageLoading(false)}
              />
              {imageLoading && (
                <ActivityIndicator
                  size="large"
                  color="#16a34a"
                  style={StyleSheet.absoluteFillObject}
                />
              )}
            </>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={60} color="#d1d5db" />
              <Text style={styles.placeholderText}>No image</Text>
            </View>
          )}

          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discountPercent}%</Text>
            </View>
          )}
        </View>

        {/* Main Info */}
        <View style={styles.mainInfo}>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>
              Rs. {product.price.toFixed(0)}
              <Text style={styles.unit}> / {product.unit}</Text>
            </Text>
            {hasDiscount && (
              <Text style={styles.oldPrice}>
                Rs. {originalPrice.toFixed(0)}
              </Text>
            )}
          </View>

          <View style={styles.metaRow}>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#f59e0b" />
              <Text style={styles.ratingText}>
                {product.rating?.toFixed(1) || "4.5"} •{" "}
                {product.ratingCount || 130} ratings
              </Text>
            </View>
            <Text style={styles.sold}>
              {product.soldCount?.toLocaleString() || "1.2k"} Sold
            </Text>
          </View>

          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {isOutOfStock
                  ? "Out of Stock"
                  : isLowStock
                    ? "Low Stock"
                    : "In Stock"}
              </Text>
            </View>
            {product.freeDelivery && (
              <View style={[styles.badge, styles.freeDeliveryBadge]}>
                <Text style={styles.freeDeliveryText}>FREE DELIVERY</Text>
              </View>
            )}
          </View>

          <Text style={styles.sectionTitle}>Category</Text>
          <Text style={styles.category}>{product.category}</Text>

          {product.description && (
            <>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          )}
        </View>

        {/* Bottom padding */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Fixed Bottom Bar */}
      {!isOutOfStock && (
        <View style={styles.bottomBar}>
          <View style={styles.quantitySelector}>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyText}>-</Text>
            </Pressable>

            <Text style={styles.qtyDisplay}>{quantity}</Text>

            <Pressable
              onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyText}>+</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleAddToCart}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.addButtonPressed,
              animatedButtonStyle,
            ]}
          >
            <Text style={styles.addButtonText}>
              Add • Rs. {(product.price * quantity).toFixed(0)}
            </Text>
          </Pressable>
        </View>
      )}

      <Pressable onPress={() => router.back()} style={styles.backFab}>
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 180 },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f8fafc",
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 24,
  },
  hero: {
    height: 320,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 14,
    color: "#94a3b8",
  },
  discountBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  mainInfo: {
    padding: 20,
    backgroundColor: "#ffffff",
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: "800",
    color: "#16a34a",
  },
  unit: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  oldPrice: {
    fontSize: 18,
    color: "#94a3b8",
    textDecorationLine: "line-through",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4b5563",
  },
  sold: {
    fontSize: 14,
    color: "#64748b",
  },
  badges: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  freeDeliveryBadge: {
    backgroundColor: "#dcfce7",
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  freeDeliveryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#15803d",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginTop: 20,
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: "#64748b",
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4b5563",
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 6,
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
  qtyText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
  },
  qtyDisplay: {
    minWidth: 60,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#16a34a",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  addButton: {
    flex: 1,
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
  addButtonPressed: {
    backgroundColor: "#15803d",
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  backFab: {
    position: "absolute",
    top: 48,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    marginTop: 20,
    backgroundColor: "#111827",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  backBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
