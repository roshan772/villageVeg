// app/(auth)/login.tsx
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";

// ─── Reanimated ────────────────────────────────
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

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

  // Redirect after login based on role (fixed version)
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    }
  }, [user]);

  const onSubmit = async () => {
    setError(null);
    try {
      await login(email, password);
      // No redirect here — handled in useEffect
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
      <ImageBackground
        source={require("../../assets/images/villagevegBackground.png")}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: "center",
          }}
        >
          {/* Header / Logo area */}
          <Animated.View
            entering={FadeInDown.duration(900).springify().damping(14)}
            style={{ alignItems: "center", marginBottom: 48 }}
          >
            {/* Local logo or fallback icon */}
            <Animated.View style={animatedLogoStyle}></Animated.View>

            <Text
              style={{
                fontSize: 36,
                fontWeight: "900",
                color: "#1e293b",
                letterSpacing: -1,
                textAlign: "center",
              }}
            >
              Fresh From Farm
            </Text>
            <Text
              style={{
                color: "#475569",
                marginTop: 8,
                fontSize: 16,
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Login to get your daily fresh vegetables
            </Text>
          </Animated.View>

          {/* Form */}
          <View style={{ gap: 20 }}>
            <Animated.View entering={FadeInUp.duration(600).delay(100)}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email address"
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#94a3b8"
                style={styles.input}
              />
            </Animated.View>

            <Animated.View entering={FadeInUp.duration(600).delay(200)}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#94a3b8"
                style={styles.input}
              />
            </Animated.View>

            {error && (
              <Animated.Text
                entering={FadeInDown.duration(400)}
                style={styles.errorText}
              >
                {error}
              </Animated.Text>
            )}
          </View>

          {/* Sign In Button */}
          <Animated.View style={[{ marginTop: 32 }, animatedButtonStyle]}>
            <Pressable
              onPress={onSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.signInButton,
                pressed && styles.signInButtonPressed,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signInText}>Sign In</Text>
              )}
            </Pressable>
          </Animated.View>

          {/* Register link */}
          <Animated.View
            entering={FadeInUp.duration(600).delay(500)}
            style={styles.registerRow}
          >
            <Text style={styles.registerText}>New to Fresh Farm?</Text>
            <Link href="/(auth)/register">
              <Text style={styles.registerLink}>Create account</Text>
            </Link>
          </Animated.View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: "rgba(211, 251, 228, 0.65)", // light overlay
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  signInButton: {
    backgroundColor: "#15803d",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#15803d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  signInButtonPressed: {
    backgroundColor: "#166534",
    transform: [{ scale: 0.97 }],
  },
  signInText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 28,
    gap: 8,
  },
  registerText: {
    color: "#475569",
    fontSize: 15,
  },
  registerLink: {
    color: "#15803d",
    fontWeight: "700",
    fontSize: 15,
  },
  errorText: {
    color: "#ef4444",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 14,
  },
});
