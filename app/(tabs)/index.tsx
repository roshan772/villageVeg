// app/(tabs)/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getProducts } from "../../src/services/productsService";
import { Product } from "../../src/types/product";
import ProductCard from "@/src/components/ProductCard";

const tabs = ["For You", "Hot Deals", "New Arrivals", "Top Rated"];

export default function HomeScreen() {
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("For You");

  const fetchProducts = useCallback(async () => {
    try {
      setError(null);
      const data = await getProducts();
      // Optional: sort newest first globally (helps New Arrivals)
      const sorted = data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setAllProducts(sorted || []);
    } catch (err: any) {
      setError("Failed to load products. Please try again.");
      console.error("Products fetch error:", err);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    })();
  }, [fetchProducts]);

  // Filter / sort when tab or products change
  useEffect(() => {
    let filtered = [...allProducts];

    if (activeTab === "Hot Deals") {
      filtered = filtered.filter((p) => p.isHotDeal === true).slice(0, 2);
    } else if (activeTab === "New Arrivals") {
      // Already sorted newest first in fetch → just take first few
      filtered = filtered.slice(0, 6);
    } else if (activeTab === "Top Rated") {
      filtered = filtered
        .filter((p) => p.rating !== undefined)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 6);
    }
    // "For You" → show all (no filter)

    setDisplayedProducts(filtered);
  }, [activeTab, allProducts]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#64748b"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search vegetables, fruits..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={onRefresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : displayedProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === "Hot Deals"
              ? "No hot deals right now"
              : activeTab === "New Arrivals"
                ? "No new arrivals yet"
                : activeTab === "Top Rated"
                  ? "No top rated products yet"
                  : "No products available right now"}
          </Text>
          <Text style={styles.emptySubtext}>
            Please check back later or refresh
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayedProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductCard
                product={item}
                onPress={() => router.push(`/product/${item.id}`)}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#16a34a"]}
              tintColor="#16a34a"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  searchContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: "#1e293b" },
  tabScroll: { backgroundColor: "#ffffff", height: 44 },
  tabContent: { paddingHorizontal: 16, alignItems: "center" },
  tabItem: { paddingHorizontal: 16, paddingVertical: 10, marginRight: 8 },
  tabItemActive: { borderBottomWidth: 3, borderBottomColor: "#16a34a" },
  tabText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  tabTextActive: { color: "#16a34a", fontWeight: "700" },
  listContent: { paddingHorizontal: 8, paddingBottom: 24 },
  columnWrapper: { justifyContent: "space-between" },
  cardWrapper: { flex: 1, margin: 4, maxWidth: "48%" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4b5563",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: "#9ca3af",
    textAlign: "center",
  },
});
