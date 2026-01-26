// app/(tabs)/orders.tsx
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  View,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { getOrders } from "../../src/services/orderService";
import { Order } from "../../src/types/order";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    (async () => {
      try {
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading orders...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "900", marginBottom: 12 }}>
        My Orders
      </Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<Text>No orders yet.</Text>}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderRadius: 12,
              padding: 12,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800" }}>
              Order: {item.id}
            </Text>
            <Text>Status: {item.status}</Text>
            <Text>Total: Rs. {item.total}</Text>
            <Text>Date: {item.createdAt.slice(0, 10)}</Text>

            <Text style={{ marginTop: 8, fontWeight: "700" }}>Items:</Text>
            {item.items.slice(0, 3).map((it) => (
              <Text key={it.id}>
                - {it.name} x{it.qty}
              </Text>
            ))}
            {item.items.length > 3 ? <Text>...more</Text> : null}
          </View>
        )}
      />
    </View>
  );
}
