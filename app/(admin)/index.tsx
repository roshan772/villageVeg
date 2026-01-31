// app/(admin)/index.tsx
import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function AdminDashboard() {
  const router = useRouter();

  const menuItems = [
    {
      title: "Manage Products",
      subtitle: "Add, edit or remove vegetables & fruits",
      icon: "inventory-2",
      route: "/(admin)/products",
      color: "#16a34a",
    },
    {
      title: "Manage Orders",
      subtitle: "View, update status & process customer orders",
      icon: "receipt-long",
      route: "/(admin)/orders",
      color: "#2563eb",
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeInDown.duration(600)}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Village Veg Management</Text>
      </Animated.View>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <Animated.View
            key={item.title}
            entering={FadeInDown.duration(700).delay(index * 150)}
          >
            <Pressable
              onPress={() => router.push(item.route)}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${item.color}15` },
                ]}
              >
                <MaterialIcons name={item.icon} size={32} color={item.color} />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 20, paddingBottom: 40 },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 6,
  },
  headerSubtitle: { fontSize: 16, color: "#64748b", marginBottom: 32 },
  grid: { gap: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardPressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  cardSubtitle: { fontSize: 14, color: "#64748b" },
});
