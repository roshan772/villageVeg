// src/components/ProductCard.tsx
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Product } from "../types/product";

type Props = {
  product: Product;
  onPress?: () => void;
  children?: React.ReactNode; 
};

export default function ProductCard({ product, onPress, children }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
      }}
    >
      <Text style={{ fontSize: 16, fontWeight: "800" }}>{product.name}</Text>
      <Text>
        Rs. {product.price} / {product.unit}
      </Text>
      <Text>Stock: {product.stock}</Text>
      <Text>Category: {product.category}</Text>

      {children ? <View style={{ marginTop: 10 }}>{children}</View> : null}
    </Pressable>
  );
}
