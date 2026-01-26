// app/(auth)/register.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const { register, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    buttonOpacity.value = withTiming(1, { duration: 800 });
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonOpacity.value * 20 - 20 }],
  }));

  const onSubmit = async () => {
    setError(null);

    if (!email.trim() || !password.trim() || !confirm.trim()) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register(email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e?.message ?? "Registration failed. Try again.");
    }
  };

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
          backgroundColor: "#f8fafc",
        }}
      >
        {/* Header area – no image */}
        <Animated.View
          entering={FadeInDown.duration(900).springify().damping(14)}
          style={{ alignItems: "center", marginBottom: 48 }}
        >
          <Text
            style={{
              fontSize: 32,
              fontWeight: "800",
              color: "#1e293b",
              letterSpacing: -0.5,
            }}
          >
            Join Fresh From Farm
          </Text>
          <Text style={{ color: "#64748b", marginTop: 6, fontSize: 15 }}>
            Create account to order fresh vegetables
          </Text>
        </Animated.View>

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
              placeholder="Password (min 6 chars)"
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

          <Animated.View entering={FadeInUp.duration(600).delay(300)}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Confirm password"
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
              entering={FadeInDown.duration(400)}
              style={{ color: "#ef4444", fontWeight: "500", marginTop: 4 }}
            >
              {error}
            </Animated.Text>
          )}
        </View>

        <Animated.View style={[{ marginTop: 32 }, animatedButtonStyle]}>
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
                Create Account
              </Text>
            )}
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.duration(600).delay(500)}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 28,
            gap: 6,
          }}
        >
          <Text style={{ color: "#64748b", fontSize: 15 }}>
            Already have an account?
          </Text>
          <Link href="/(auth)/login">
            <Text
              style={{
                color: "#15803d",
                fontWeight: "600",
                fontSize: 15,
              }}
            >
              Sign in
            </Text>
          </Link>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
