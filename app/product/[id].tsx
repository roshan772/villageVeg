// app/product/[id].tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProductById } from "../../src/services/productsService"; 
import { Product } from "../../src/types/product";

export default function ProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!id) throw new Error("Missing product id");
        const data = await getProductById(id);
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "700" }}>
          Product not found
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: "#2563eb", fontWeight: "700" }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 26, fontWeight: "900" }}>{product.name}</Text>
      <Text style={{ fontSize: 18 }}>
        Rs. {product.price} / {product.unit}
      </Text>
      <Text style={{ fontSize: 16 }}>Stock: {product.stock}</Text>
      <Text style={{ fontSize: 16 }}>Category: {product.category}</Text>

      {product.description ? (
        <Text style={{ fontSize: 16, marginTop: 8 }}>
          {product.description}
        </Text>
      ) : null}

      <Pressable
        onPress={() => router.back()}
        style={{
          marginTop: 18,
          backgroundColor: "#111",
          padding: 12,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "800" }}>Back</Text>
      </Pressable>
    </View>
  );
}
