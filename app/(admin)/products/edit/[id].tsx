// app/(admin)/products/edit/[id].tsx
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  getProductById,
  updateProduct,
} from "../../../../src/services/productsService";

const units = ["kg", "g", "pcs", "bunch"];
const imageOptions = [
  "default.png",
  "beet.png",
  "carrot.png",
  "flower.png",
  "gabbage.png",
  "onion.png",
  "potato.png",
  "pumpkin.png",
  "tomato.png",
];


export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("default.png");


  useEffect(() => {
    (async () => {
      try {
        if (!id) throw new Error("Missing product id");
        const p = await getProductById(id);

        setName(p.name ?? "");
        setPrice(String(p.price ?? 0));
        setUnit(p.unit ?? "kg");
        setStock(String(p.stock ?? 0));
        setCategory(p.category ?? "");
        setDescription(p.description ?? "");
        setImage(p.image ?? "default.png");

      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "Failed to load product");
        router.replace("/(admin)/products");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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
      if (!id) throw new Error("Missing product id");

      await updateProduct(id, {
        name: name.trim(),
        price: Number(price),
        unit,
        stock: Number(stock),
        category: category.trim(),
        description: description.trim(),
        image,
      });

      Alert.alert("Success", "Product updated!");
      router.replace("/(admin)/products");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading product...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "800" }}>Edit Product</Text>

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

      <Text style={{ fontWeight: "700" }}>Product Image</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {imageOptions.map((img) => (
          <Pressable
            key={img}
            onPress={() => setImage(img)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              backgroundColor: image === img ? "#111" : "transparent",
            }}
          >
            <Text
              style={{
                color: image === img ? "#fff" : "#111",
                fontWeight: "700",
              }}
            >
              {img}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={{ color: "#64748b" }}>Selected: {image}</Text>

      <Pressable
        onPress={onSave}
        disabled={saving}
        style={{
          marginTop: 10,
          backgroundColor: saving ? "#999" : "#2563eb",
          padding: 14,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "800" }}>Update</Text>
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
