// app/(tabs)/profile.tsx
import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, role, logout } = useAuth();

  const onLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Logout failed");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: "900" }}>Profile</Text>
      <Text>Email: {user?.email ?? "-"}</Text>
      <Text>Role: {role ?? "-"}</Text>

      {role === "admin" ? (
        <Pressable
          onPress={() => router.push("/(admin)/products")}
          style={{
            marginTop: 10,
            backgroundColor: "#2563eb",
            padding: 12,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Go to Admin</Text>
        </Pressable>
      ) : null}

      <Pressable
        onPress={onLogout}
        style={{
          marginTop: 10,
          backgroundColor: "#dc2626",
          padding: 12,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Logout</Text>
      </Pressable>
    </View>
  );
}
