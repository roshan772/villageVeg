
import { Tabs, Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function TabsLayout() {
  const { user, role, loading } = useAuth();

  // Wait until auth state is known
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  // Not logged in -> go login
  if (!user) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="cart" options={{ title: "Cart" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />

      {/* Admin tab appears only for admins */}
      {role === "admin" ? (
        <Tabs.Screen
          name="../(admin)/products/index"
          options={{ title: "Admin" }}
        />
      ) : null}
    </Tabs>
  );
}
