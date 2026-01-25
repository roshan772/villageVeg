// app/(admin)/_layout.tsx
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function AdminLayout() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Checking access...</Text>
      </View>
    );
  }

  // Not logged in -> login screen
  if (!user) return <Redirect href="/(auth)/login" />;

  // Logged in but not admin -> customer tabs
  if (role !== "admin") return <Redirect href="/(tabs)" />;

  // Admin allowed
  return <Stack screenOptions={{ headerShown: true, title: "Admin" }} />;
}
//This gives you “role-based route protection”