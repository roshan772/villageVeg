// app/(auth)/register.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";

export default function RegisterScreen() {
  const { register, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
      <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 6 }}>
        Register
      </Text>
      <Text style={{ marginBottom: 18 }}>Create your account</Text>

      <Text style={{ marginBottom: 6 }}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="you@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <Text style={{ marginBottom: 6 }}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Minimum 6 characters"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 12,
          marginBottom: 12,
        }}
      />

      <Text style={{ marginBottom: 6 }}>Confirm Password</Text>
      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        placeholder="Repeat password"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderRadius: 10,
          padding: 12,
          marginBottom: 12,
        }}
      />

      {error ? (
        <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
      ) : null}

      <Pressable
        onPress={onSubmit}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#999" : "#111",
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
          marginTop: 6,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "700" }}>Register</Text>
        )}
      </Pressable>

      <Text style={{ marginTop: 14 }}>
        Already have an account?{" "}
        <Link href="/(auth)/login" style={{ fontWeight: "700" }}>
          Login
        </Link>
      </Text>
    </View>
  );
}
