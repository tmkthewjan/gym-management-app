import React, { useContext, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

const FIELDS = [
  { key: "name", label: "Product Name", placeholder: "e.g. Whey Protein Gold", required: true },
  { key: "category", label: "Category", placeholder: "Protein / Vitamins / Pre_Workout / BCAAs" },
  { key: "description", label: "Description", placeholder: "Product details and benefits…", multiline: true, required: true },
  { key: "price", label: "Price (Rs)", placeholder: "e.g. 3500", numeric: true },
  { key: "stock", label: "Stock Qty", placeholder: "e.g. 100", numeric: true },
  { key: "weight", label: "Weight / Size", placeholder: "e.g. 2kg, 30 servings" },
  { key: "imageUrl", label: "Image URL (optional)", placeholder: "https://..." },
];

export default function AddSupplementScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", category: "", description: "", price: "", stock: "", weight: "", imageUrl: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.description) return Alert.alert("Validation", "Name and description are required");
    setLoading(true);
    try {
      await API.post(
        "/supplements",
        { ...form, price: Number(form.price) || 0, stock: Number(form.stock) || 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("✅ Added", "Supplement listed successfully", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Add failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>Add Supplement</Text>
      <Text style={styles.subtitle}>List a new product in the store</Text>

      {FIELDS.map(f => (
        <View key={f.key} style={styles.fieldGroup}>
          <Text style={styles.label}>
            {f.label} {f.required && <Text style={{ color: COLORS.red }}>*</Text>}
          </Text>
          <TextInput
            value={form[f.key]}
            onChangeText={v => setForm(p => ({ ...p, [f.key]: v }))}
            placeholder={f.placeholder}
            placeholderTextColor={COLORS.gray}
            keyboardType={f.numeric ? "numeric" : "default"}
            multiline={f.multiline}
            numberOfLines={f.multiline ? 3 : 1}
            style={[styles.input, f.multiline && { height: 80, textAlignVertical: "top" }]}
          />
        </View>
      ))}

      <TouchableOpacity onPress={submit} disabled={loading} style={[styles.submitBtn, loading && { opacity: 0.6 }]}>
        <Text style={styles.submitText}>{loading ? "Adding…" : "Add to Store"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20, paddingTop: 60 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: "900", letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { color: COLORS.gray, fontSize: 14, marginBottom: 28 },
  fieldGroup: { marginBottom: 16 },
  label: { color: COLORS.grayLight, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8 },
  input: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    color: COLORS.white, padding: 14, borderRadius: 12, fontSize: 15,
  },
  submitBtn: { backgroundColor: COLORS.cyan, borderRadius: 14, padding: 18, alignItems: "center", marginTop: 8 },
  submitText: { color: COLORS.white, fontWeight: "900", fontSize: 16 },
});