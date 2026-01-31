import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

// ─── Reanimated ────────────────────────────────
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from "react-native-reanimated";

// Optional: if you want even simpler syntax → import { MotiView } from 'moti';

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const { login, loading, user, role } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const logoScale = useSharedValue(0.3);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    buttonOpacity.value = withTiming(1, { duration: 800 });
  }, []);
  useEffect(() => {
    if (user) {
      // Wait for role to be fetched (small delay or check loading)
      if (role === "admin") {
        router.replace("/(admin)"); // ← dashboard
      } else {
        router.replace("/(tabs)");
      }
    }
  }, [user, role]); // ← add role dependency

  const onSubmit = async () => {
    setError(null);
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e?.message ?? "Login failed. Please try again.");
    }
  };

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonOpacity.value * 20 - 20 }],
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          justifyContent: "center",
          backgroundColor: "#f8fafc", // light natural bg
        }}
      >
        {/* Hero / Logo area with animation */}
        <Animated.View
          entering={FadeInDown.duration(900).springify().damping(14)}
          style={{ alignItems: "center", marginBottom: 40 }}
        >
          <Animated.Image
            source={{ uri: "https://example.com/farm-logo.png" }} // ← replace with your fresh veg / leaf / basket logo
            style={[
              { width: width * 0.38, height: width * 0.38, marginBottom: 16 },
              animatedLogoStyle,
            ]}
            resizeMode="contain"
          />

          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#1e293b",
              letterSpacing: -0.5,
            }}
          >
            Fresh From Farm
          </Text>
          <Text style={{ color: "#64748b", marginTop: 4, fontSize: 15 }}>
            Login to get your daily vegetables
          </Text>
        </Animated.View>

        {/* Form fields with stagger animation */}
        <View style={{ gap: 16 }}>
          <Animated.View entering={FadeInUp.duration(600).delay(100)}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#94a3b8"
              style={{
                borderWidth: 1.5,
                borderColor: "#e2e8f0",
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            />
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(600).delay(200)}>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#94a3b8"
              style={{
                borderWidth: 1.5,
                borderColor: "#e2e8f0",
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                backgroundColor: "white",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            />
          </Animated.View>

          {error && (
            <Animated.Text
              entering={FadeInDown}
              style={{ color: "#ef4444", fontWeight: "500", marginTop: 4 }}
            >
              {error}
            </Animated.Text>
          )}
        </View>

        {/* Animated Login Button */}
        <Animated.View style={[{ marginTop: 28 }, animatedButtonStyle]}>
          <Pressable
            onPress={onSubmit}
            disabled={loading}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? "#0f172a" : "#111827",
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: "center",
                shadowColor: "#111827",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 6,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontSize: 17,
                  fontWeight: "700",
                  letterSpacing: 0.2,
                }}
              >
                Sign In
              </Text>
            )}
          </Pressable>
        </Animated.View>

        {/* Register link */}
        <Animated.View
          entering={FadeInUp.duration(600).delay(400)}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 24,
            gap: 6,
          }}
        >
          <Text style={{ color: "#64748b", fontSize: 15 }}>
            New to Fresh Farm?
          </Text>
          <Link href="/(auth)/register">
            <Text
              style={{
                color: "#15803d",
                fontWeight: "600",
                fontSize: 15,
              }}
            >
              Create account
            </Text>
          </Link>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
