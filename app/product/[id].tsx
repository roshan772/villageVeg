// app/product/[id].tsx
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
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
import { useCart } from "../../src/context/CartContext";
import { getProductById } from "../../src/services/productsService";
import { Product } from "../../src/types/product";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { addToCart } = useCart();

  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

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
    Alert.alert("Added to Cart", `${quantity} × ${product.name} added`);
  };

  const onPressIn = () => {
    buttonScale.value = withSpring(0.94, { damping: 12 });
  };

  const onPressOut = () => {
    buttonScale.value = withSpring(1, { damping: 12 });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error || "Product not found"}</Text>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>
          Rs. {product.price.toFixed(0)}{" "}
          <Text style={styles.unit}>/ {product.unit}</Text>
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(100)}>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Category</Text>
            <Text style={styles.metaValue}>{product.category}</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Stock</Text>
            <Text
              style={[
                styles.metaValue,
                isOutOfStock && styles.stockOut,
                isLowStock && styles.stockLow,
              ]}
            >
              {isOutOfStock
                ? "Out of stock"
                : isLowStock
                  ? `Only ${product.stock} left`
                  : `${product.stock} available`}
            </Text>
          </View>
        </View>
      </Animated.View>

      {product.description && (
        <Animated.View entering={FadeInDown.duration(700).delay(200)}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </Animated.View>
      )}

      {!isOutOfStock && (
        <Animated.View entering={FadeInDown.duration(700).delay(300)}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <Pressable
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              style={styles.quantityBtn}
            >
              <Text style={styles.quantityText}>-</Text>
            </Pressable>

            <Text style={styles.quantityDisplay}>{quantity}</Text>

            <Pressable
              onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              style={styles.quantityBtn}
            >
              <Text style={styles.quantityText}>+</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.duration(700).delay(400)}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Farm</Text>
        </Pressable>

        {!isOutOfStock && (
          <Pressable
            onPress={handleAddToCart}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            disabled={loading}
            style={({ pressed }) => [
              styles.addToCartButton,
              pressed && styles.addToCartButtonPressed,
              animatedButtonStyle,
            ]}
          >
            <Text style={styles.addToCartText}>
              Add {quantity} to Cart • Rs.{" "}
              {(product.price * quantity).toFixed(0)}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 100 : 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#f8fafc",
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 24,
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#16a34a",
    marginTop: 8,
  },
  unit: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748b",
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  stockOut: {
    color: "#ef4444",
  },
  stockLow: {
    color: "#f59e0b",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
    marginBottom: 24,
  },
  quantityBtn: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1e293b",
  },
  quantityDisplay: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#16a34a",
  },
  backButton: {
    backgroundColor: "#111827",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  addToCartButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addToCartButtonPressed: {
    backgroundColor: "#15803d",
  },
  addToCartText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
});
