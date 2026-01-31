import { Tabs, Redirect } from "expo-router";
import { ActivityIndicator, View, Platform } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/src/context/CartContext";

export default function TabsLayout() {
  const { user, loading } = useAuth();
  const { items } = useCart(); 
  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#16a34a", // fresh farm green
        tabBarInactiveTintColor: "#9ca3af", // cooler gray
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e5e7eb",
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 85 : 75,
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 8,
          paddingHorizontal: 10,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11.5,
          fontWeight: "600",
          marginTop: -4,
          letterSpacing: -0.2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Farm",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "leaf" : "leaf-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Basket",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "basket" : "basket-outline"}
              size={26}
              color={color}
            />
          ),
          tabBarBadge: cartCount > 0 ? cartCount : undefined, // ← this line shows real count
          tabBarBadgeStyle: {
            backgroundColor: "#ef4444", 
            fontSize: 10,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
          },
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "receipt" : "receipt-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}