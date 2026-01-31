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
import { Ionicons } from "@expo/vector-icons";
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
      `Are you sure you want to delete "${name}"?\nThis action cannot be undone.`,
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
              Alert.alert("Success", "Product deleted");
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
      <Text style={styles.headerTitle}>Manage Products</Text>

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
            <Text style={styles.emptyTitle}>No products yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the + button to add your first product
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(500).delay(index * 60)}>
            <View style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>
                  Rs. {item.price} / {item.unit}
                </Text>
                <View style={styles.metaRow}>
                  <Text
                    style={[
                      styles.stockText,
                      item.stock <= 0
                        ? styles.stockOut
                        : item.stock <= 5
                          ? styles.stockLow
                          : null,
                    ]}
                  >
                    Stock: {item.stock}
                  </Text>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              </View>

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
                  <Ionicons name="pencil" size={18} color="#ffffff" />
                  <Text style={styles.buttonText}>Edit</Text>
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
                      <Ionicons name="trash" size={18} color="#ffffff" />
                      <Text style={styles.buttonText}>Delete</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
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
    backgroundColor: "#f8fafc",
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
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  productCard: {
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
  productInfo: {
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#16a34a",
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  stockText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#64748b",
  },
  stockOut: {
    color: "#ef4444",
    fontWeight: "700",
  },
  stockLow: {
    color: "#f59e0b",
    fontWeight: "700",
  },
  categoryText: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  editButtonPressed: {
    backgroundColor: "#1d4ed8",
  },
  deleteButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  deleteButtonPressed: {
    backgroundColor: "#dc2626",
  },
  deleteButtonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    backgroundColor: "#15803d",
  },
});
