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
  TouchableOpacity,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, role, logout } = useAuth();

  const displayName = user?.email?.split("@")[0] || "User";
  const firstName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

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

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.charAt(0)}</Text>
          </View>
          <View style={styles.onlineDot} />
        </View>

        <Text style={styles.greeting}>Hi, {firstName}</Text>
        <Text style={styles.email}>{user?.email || "No email"}</Text>

        {role === "admin" && (
          <View style={styles.adminBadge}>
            <MaterialIcons
              name="admin-panel-settings"
              size={14}
              color="#ffffff"
            />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </Animated.View>

      {/* Account Info Card */}
      <Animated.View entering={FadeInDown.duration(700).delay(100)}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Details</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail-outline" size={20} color="#64748b" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email ?? "-"}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color="#64748b"
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Role</Text>
              <Text
                style={[
                  styles.infoValue,
                  role === "admin" && styles.adminValue,
                ]}
              >
                {role ? role.charAt(0).toUpperCase() + role.slice(1) : "-"}
              </Text>
            </View>
          </View>

          {/* Add more rows later (phone, joined date, etc.) */}
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View entering={FadeInDown.duration(700).delay(200)}>
        <View style={styles.actionsCard}>
          {role === "admin" && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/(admin)/products")}
              style={styles.actionRow}
            >
              <View
                style={[styles.actionIcon, { backgroundColor: "#2563eb15" }]}
              >
                <MaterialIcons
                  name="admin-panel-settings"
                  size={24}
                  color="#2563eb"
                />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Admin Dashboard</Text>
                <Text style={styles.actionSubtitle}>
                  Manage products & orders
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onLogout}
            style={styles.actionRow}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#ef444415" }]}>
              <Ionicons name="log-out-outline" size={24} color="#ef4444" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: "#ef4444" }]}>
                Logout
              </Text>
              <Text style={styles.actionSubtitle}>
                Sign out of your account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Footer / Version info */}
      <Animated.View
        entering={FadeInUp.duration(800).delay(300)}
        style={styles.footer}
      >
        <Text style={styles.version}>Village Veg • v1.0.0</Text>
        <Text style={styles.copyright}>© 2025 Fresh From Farm</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 100 : 80,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#16a34a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#ffffff",
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#ffffff",
  },
  onlineDot: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#22c55e",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 12,
  },
  adminBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  adminBadgeText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  adminValue: {
    color: "#16a34a",
  },
  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 4,
  },
  actionsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#ffffff",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  actionSubtitle: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    paddingBottom: 40,
  },
  version: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 4,
  },
  copyright: {
    fontSize: 12,
    color: "#cbd5e1",
  },
});
