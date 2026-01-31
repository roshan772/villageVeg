// app/(admin)/products/index.tsx
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  deleteProduct,
  getProducts,
} from "../../../src/services/productsService";
import { Product } from "../../../src/types/product";

export default function AdminProductsScreen() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
      Alert.alert("Error", "Failed to load products");
    }
  };

  useEffect(() => {
    (async () => {
      await loadProducts();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete Product",
      `Are you sure you want to delete "${name}"?\nThis cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeletingId(id);
            try {
              await deleteProduct(id);
              await loadProducts();
              Alert.alert("Success", "Product deleted successfully");
            } catch (e: any) {
              Alert.alert("Error", e?.message || "Failed to delete product");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manage Products</Text>
          <Text style={styles.headerSubtitle}>
            {products.length} {products.length === 1 ? "product" : "products"}
          </Text>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16a34a"]}
            tintColor="#16a34a"
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inventory-2" size={80} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to add your first product
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(500).delay(index * 80)}>
            <Pressable
              onPress={() => router.push(`/(admin)/products/edit/${item.id}`)}
              style={({ pressed }) => [
                styles.productCard,
                pressed && styles.productCardPressed,
              ]}
            >
              {/* Product Info */}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.productPrice}>
                  Rs. {item.price} / {item.unit}
                </Text>

                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.stockBadge,
                      item.stock <= 0
                        ? styles.stockOutBadge
                        : item.stock <= 5
                          ? styles.stockLowBadge
                          : styles.stockOkBadge,
                    ]}
                  >
                    <Text style={styles.stockText}>
                      {item.stock <= 0
                        ? "Out of stock"
                        : item.stock <= 5
                          ? `Low: ${item.stock}`
                          : `In stock: ${item.stock}`}
                    </Text>
                  </View>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actionButtons}>
                <Pressable
                  onPress={() =>
                    router.push(`/(admin)/products/edit/${item.id}`)
                  }
                  style={({ pressed }) => [
                    styles.editButton,
                    pressed && styles.editButtonPressed,
                  ]}
                >
                  <MaterialIcons name="edit" size={18} color="#2563eb" />
                  <Text style={styles.editText}>Edit</Text>
                </Pressable>

                <Pressable
                  onPress={() => confirmDelete(item.id, item.name)}
                  disabled={deletingId === item.id}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.deleteButtonPressed,
                    deletingId === item.id && styles.deleteButtonDisabled,
                  ]}
                >
                  {deletingId === item.id ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <MaterialIcons name="delete" size={18} color="#ef4444" />
                      <Text style={styles.deleteText}>Delete</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </Pressable>
          </Animated.View>
        )}
      />

      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push("/(admin)/products/add")}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Ionicons name="add" size={28} color="#ffffff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#64748b",
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  productCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  productCardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  productInfo: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stockBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stockOkBadge: {
    backgroundColor: "#dcfce7",
  },
  stockLowBadge: {
    backgroundColor: "#fef3c7",
  },
  stockOutBadge: {
    backgroundColor: "#fee2e2",
  },
  stockText: {
    fontSize: 13,
    fontWeight: "600",
  },
  categoryText: {
    fontSize: 13,
    color: "#64748b",
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb15",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  editButtonPressed: {
    backgroundColor: "#2563eb30",
  },
  editText: {
    color: "#2563eb",
    fontWeight: "700",
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef444415",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonPressed: {
    backgroundColor: "#ef444430",
  },
  deleteButtonDisabled: {
    opacity: 0.6,
  },
  deleteText: {
    color: "#ef4444",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4b5563",
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#9ca3af",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: Platform.OS === "ios" ? 90 : 80,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  fabPressed: {
    backgroundColor: "#15803d",
    transform: [{ scale: 0.92 }],
  },
});
