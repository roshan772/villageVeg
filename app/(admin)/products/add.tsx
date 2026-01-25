// app/(admin)/products/add.tsx
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { addProduct } from "../../../src/services/productsService";

const units = ["kg", "g", "pcs", "bunch"];

export default function AddProductScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); // keep as string for TextInput
  const [unit, setUnit] = useState("kg");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [saving, setSaving] = useState(false);

  const validate = () => {
    if (!name.trim()) return "Product name is required.";
    if (!category.trim()) return "Category is required.";
    const p = Number(price);
    if (!price.trim() || Number.isNaN(p) || p <= 0)
      return "Price must be a positive number.";
    const s = Number(stock);
    if (!stock.trim() || Number.isNaN(s) || s < 0)
      return "Stock must be 0 or more.";
    if (!units.includes(unit)) return "Invalid unit.";
    return null;
  };

  const onSave = async () => {
    const err = validate();
    if (err) {
      Alert.alert("Validation", err);
      return;
    }

    setSaving(true);
    try {
      await addProduct(
        name.trim(),
        Number(price),
        unit,
        Number(stock),
        category.trim(),
        description.trim(),
        imageUrl.trim(),
      );

      Alert.alert("Success", "Product added!");
      router.replace("/(admin)/products");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Add Product</Text>

      <Field
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Carrot"
      />
      <Field
        label="Category"
        value={category}
        onChangeText={setCategory}
        placeholder="Roots"
      />

      <Field
        label="Price (Rs.)"
        value={price}
        onChangeText={setPrice}
        placeholder="250"
        keyboardType="numeric"
      />

      <Field
        label="Stock"
        value={stock}
        onChangeText={setStock}
        placeholder="20"
        keyboardType="numeric"
      />

      {/* Simple unit picker (text buttons) */}
      <Text style={{ fontWeight: "700" }}>Unit</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        {units.map((u) => (
          <Pressable
            key={u}
            onPress={() => setUnit(u)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              backgroundColor: unit === u ? "#111" : "transparent",
            }}
          >
            <Text
              style={{ color: unit === u ? "#fff" : "#111", fontWeight: "700" }}
            >
              {u}
            </Text>
          </Pressable>
        ))}
      </View>

      <Field
        label="Description (optional)"
        value={description}
        onChangeText={setDescription}
        placeholder="Fresh and crunchy..."
        multiline
      />

      <Field
        label="Image URL (optional)"
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="https://..."
        autoCapitalize="none"
      />

      <Pressable
        onPress={onSave}
        disabled={saving}
        style={{
          marginTop: 10,
          backgroundColor: saving ? "#999" : "#16a34a",
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "800" }}>Save</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  multiline?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: "700" }}>{props.label}</Text>
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        keyboardType={props.keyboardType ?? "default"}
        multiline={props.multiline}
        autoCapitalize={props.autoCapitalize ?? "sentences"}
        style={{
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          minHeight: props.multiline ? 90 : undefined,
          textAlignVertical: props.multiline ? "top" : "auto",
        }}
      />
    </View>
  );
}
