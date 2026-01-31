// app/(tabs)/profile.tsx
import React from "react";
import {
  View,
  Text,
  Pressable,
  Alert,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, role, logout } = useAuth();

  const onLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              router.replace("/(auth)/login");
            } catch (e: any) {
              Alert.alert("Error", e?.message ?? "Logout failed");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const displayName = user?.email?.split("@")[0] || "User";

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header / Greeting */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={90} color="#16a34a" />
        </View>
        <Text style={styles.greeting}>Hello, {displayName}</Text>
        <Text style={styles.email}>{user?.email ?? "No email"}</Text>
      </Animated.View>

      {/* User Info Card */}
      <Animated.View entering={FadeInDown.duration(700).delay(100)}>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email ?? "-"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text
              style={[styles.infoValue, role === "admin" && styles.adminRole]}
            >
              {role ? role.charAt(0).toUpperCase() + role.slice(1) : "-"}
            </Text>
          </View>

          {/* You can add more fields later */}
          {/* <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>Jan 2025</Text>
          </View> */}
        </View>
      </Animated.View>

      {/* Actions */}
      <Animated.View
        entering={FadeInDown.duration(700).delay(200)}
        style={styles.actionsContainer}
      >
        {role === "admin" && (
          <Pressable
            onPress={() => router.push("/(admin)/products")}
            style={({ pressed }) => [
              styles.adminButton,
              pressed && styles.adminButtonPressed,
            ]}
          >
            <Ionicons
              name="settings-sharp"
              size={20}
              color="#ffffff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.adminButtonText}>Admin Dashboard</Text>
          </Pressable>
        )}

        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color="#ffffff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
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
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 12,
    backgroundColor: "#f0fdf4",
    borderRadius: 999,
    padding: 8,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#64748b",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  infoLabel: {
    fontSize: 15,
    color: "#64748b",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  adminRole: {
    color: "#16a34a",
    fontWeight: "700",
  },
  actionsContainer: {
    gap: 12,
  },
  adminButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
  },
  adminButtonPressed: {
    backgroundColor: "#1d4ed8",
  },
  adminButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutButtonPressed: {
    backgroundColor: "#dc2626",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
