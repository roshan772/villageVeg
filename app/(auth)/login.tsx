import { useAuth } from "@/src/context/AuthContext";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";


export default function LoginScreen() {
    const { login,loading,user } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    //if already logged in, redirect to tabs
    if (user) {
        router.replace("/(tabs)");
    }
    const onSubmit = async () => {
        setError(null);
        if (!email.trim() || !password.trim()) {
            setError("Please enter email and password");
            return;
        }
        try {
          await login(email, password);
          router.replace("/(tabs)");
        } catch (e: any) {
          setError(e?.message ?? "Login failed. Try again.");
        }
    }
    return (
      <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "700", marginBottom: 6 }}>
          Login
        </Text>
        <Text style={{ marginBottom: 18 }}>Welcome back 👋</Text>

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
          placeholder="******"
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
            <Text style={{ color: "#fff", fontWeight: "700" }}>Login</Text>
          )}
        </Pressable>

        <Text style={{ marginTop: 14 }}>
          Don’t have an account?{" "}
          <Link href="/(auth)/register" style={{ fontWeight: "700" }}>
            Register
          </Link>
        </Text>
      </View>
    );


}