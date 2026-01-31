// app/(tabs)/orders.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext"; // ← add this
import { getOrders } from "../../src/services/orderService";
import { Order } from "../../src/types/order";

export default function OrdersScreen() {
  const { user } = useAuth(); 
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user?.uid) {
      setError("Please log in to view orders");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const data = await getOrders(user.uid); // ← pass userId
      setOrders(data || []);
    } catch (err: any) {
      console.error("Orders fetch error:", err);
      if (err.code === "failed-precondition" || err.message.includes("index")) {
        setError("Database index required. Check console for link.");
        Alert.alert(
          "Action Needed",
          "This query needs a Firestore index. Open console for link and create it.",
        );
      } else {
        setError("Failed to load orders. Please try again.");
      }
    }
  }, [user?.uid]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadOrders();
      setLoading(false);
    })();
  }, [loadOrders]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  }, [loadOrders]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>My Orders</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={onRefresh} style={styles.retryButton}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            Your past orders will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
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
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{item.id.slice(0, 8)}</Text>
                <Text
                  style={[
                    styles.orderStatus,
                    item.status === "delivered"
                      ? styles.statusDelivered
                      : item.status === "placed"
                        ? styles.statusPending
                        : styles.statusProcessing,
                  ]}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>

              <Text style={styles.orderDate}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Date not available"}
              </Text>

              <Text style={styles.orderTotal}>
                Total: Rs. {item.total.toFixed(0)}
              </Text>

              <Text style={styles.itemsLabel}>Items:</Text>
              {item.items.slice(0, 3).map((it) => (
                <Text key={it.id} style={styles.itemLine}>
                  • {it.name} × {it.qty}
                </Text>
              ))}
              {item.items.length > 3 && (
                <Text style={styles.moreItems}>
                  ...and {item.items.length - 3} more
                </Text>
              )}
            </View>
          )}
        />
      )}
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
    paddingBottom: 12,
  },
  loading: {
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDelivered: {
    backgroundColor: "#dcfce7",
    color: "#15803d",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
    color: "#b45309",
  },
  statusProcessing: {
    backgroundColor: "#dbeafe",
    color: "#2563eb",
  },
  orderDate: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 8,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 6,
  },
  itemLine: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
  },
  moreItems: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
    marginTop: 4,
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
    paddingHorizontal: 40,
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
});
