// app/(admin)/orders.tsx
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Alert,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../src/services/orderService"; 
import { Order } from "../../src/types/order";

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders(); // ← new function to get ALL orders
      setOrders(data || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load orders");
    }
  };

  useEffect(() => {
    (async () => {
      await loadOrders();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const changeStatus = (orderId: string, newStatus: string) => {
    Alert.alert("Update Status", `Change order status to "${newStatus}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: async () => {
          try {
            await updateOrderStatus(orderId, newStatus);
            await loadOrders();
            Alert.alert("Success", "Order status updated");
          } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to update status");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Manage Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#16a34a"]}
          />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="shopping-bag" size={64} color="#d1d5db" />
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.duration(500).delay(index * 80)}>
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>#{item.id.slice(0, 8)}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === "delivered"
                      ? styles.delivered
                      : item.status === "placed"
                        ? styles.pending
                        : styles.processing,
                  ]}
                >
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <Text style={styles.customer}>
                Customer: {item.userId.slice(0, 8)}...
              </Text>
              <Text style={styles.total}>Total: Rs. {item.total}</Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>

              <View style={styles.actions}>
                {item.status !== "delivered" && (
                  <>
                    {item.status === "placed" && (
                      <Pressable
                        onPress={() => changeStatus(item.id, "packed")}
                        style={styles.actionBtn}
                      >
                        <Text style={styles.actionText}>Mark Packed</Text>
                      </Pressable>
                    )}
                    {item.status === "packed" && (
                      <Pressable
                        onPress={() => changeStatus(item.id, "delivered")}
                        style={styles.actionBtn}
                      >
                        <Text style={styles.actionText}>Mark Delivered</Text>
                      </Pressable>
                    )}
                  </>
                )}
              </View>
            </View>
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    padding: 20,
    paddingBottom: 12,
  },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  delivered: { backgroundColor: "#dcfce7" },
  pending: { backgroundColor: "#fef3c7" },
  processing: { backgroundColor: "#dbeafe" },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#15803d",
  },
  customer: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: "700",
    color: "#16a34a",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#16a34a15",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: {
    color: "#16a34a",
    fontWeight: "700",
    fontSize: 14,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4b5563",
    marginTop: 16,
  },
});
