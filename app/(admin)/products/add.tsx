// app/(admin)/products/add.tsx
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { addProduct } from "../../../src/services/productsService";

const units = ["kg", "g", "pcs", "bunch", "dozen", "bundle"];

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



type FieldError = {
  name?: string;
  price?: string;
  stock?: string;
  category?: string;
  unit?: string;
};

export default function AddProductScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("default.png");


  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FieldError>({});

  const validateForm = () => {
    const newErrors: FieldError = {};

    if (!name.trim()) newErrors.name = "Product name is required";
    if (!category.trim()) newErrors.category = "Category is required";

    const p = Number(price);
    if (!price.trim() || isNaN(p) || p <= 0) {
      newErrors.price = "Enter a valid positive price";
    }

    const s = Number(stock);
    if (!stock.trim() || isNaN(s) || s < 0) {
      newErrors.stock = "Stock must be 0 or more";
    }

    if (!units.includes(unit)) newErrors.unit = "Select a unit";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSave = async () => {
    if (!validateForm()) {
      Alert.alert("Please fix the errors", "Check the highlighted fields");
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
        image,
      );

      Alert.alert("Success", "Product added successfully!");
      router.replace("/(admin)/products");
    } catch (e: any) {
      Alert.alert("Error", e?.message || "Failed to add product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View entering={FadeInDown.duration(600)}>
        <Text style={styles.title}>Add New Product</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(100)}>
        <FormField
          label="Product Name"
          value={name}
          onChangeText={setName}
          placeholder="Fresh Carrots"
          error={errors.name}
          autoCapitalize="words"
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(150)}>
        <FormField
          label="Category"
          value={category}
          onChangeText={setCategory}
          placeholder="Roots / Leafy Greens / Fruits"
          error={errors.category}
          autoCapitalize="words"
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(200)}>
        <FormField
          label="Price (Rs.)"
          value={price}
          onChangeText={setPrice}
          placeholder="250"
          keyboardType="numeric"
          error={errors.price}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(250)}>
        <FormField
          label="Stock Quantity"
          value={stock}
          onChangeText={setStock}
          placeholder="50"
          keyboardType="numeric"
          error={errors.stock}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(300)}>
        <Text style={styles.label}>Unit</Text>
        <View style={styles.unitContainer}>
          {units.map((u) => (
            <Pressable
              key={u}
              onPress={() => setUnit(u)}
              style={[
                styles.unitButton,
                unit === u && styles.unitButtonSelected,
                errors.unit && styles.unitButtonError,
              ]}
            >
              <Text
                style={[styles.unitText, unit === u && styles.unitTextSelected]}
              >
                {u}
              </Text>
            </Pressable>
          ))}
        </View>
        {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(350)}>
        <FormField
          label="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholder="Fresh, locally grown, organic carrots..."
          multiline
          numberOfLines={4}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(400)}>
        <Text style={styles.label}>Product Image</Text>
        <View style={styles.unitContainer}>
          {imageOptions.map((img) => (
            <Pressable
              key={img}
              onPress={() => setImage(img)}
              style={[
                styles.unitButton,
                image === img && styles.unitButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.unitText,
                  image === img && styles.unitTextSelected,
                ]}
              >
                {img}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={{ color: "#64748b", marginTop: 4 }}>
          Selected: {image}
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(700).delay(450)}>
        <Pressable
          onPress={onSave}
          disabled={saving}
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Add Product</Text>
          )}
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
  numberOfLines,
  autoCapitalize = "sentences",
  error,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.inputError,
        ]}
        textAlignVertical={multiline ? "top" : "auto"}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 100 : 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1e293b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },
  unitContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 8,
  },
  unitButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    minWidth: 70,
    alignItems: "center",
  },
  unitButtonSelected: {
    backgroundColor: "#16a34a",
    borderColor: "#16a34a",
  },
  unitButtonError: {
    borderColor: "#ef4444",
    borderWidth: 2,
  },
  unitText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },
  unitTextSelected: {
    color: "#ffffff",
  },
  saveButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: "#9ca3af",
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
