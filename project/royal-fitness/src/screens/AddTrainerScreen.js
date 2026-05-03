import React, { useContext, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

const FIELDS = [
  { key: "name", label: "Full Name", placeholder: "e.g. Kasun Perera", required: true },
  { key: "email", label: "Email", placeholder: "trainer@gym.com", required: true },
  { key: "password", label: "Password", placeholder: "Min 6 characters", required: true, secure: true },
  { key: "specialization", label: "Specialization", placeholder: "e.g. Strength, Yoga, Cardio" },
  { key: "experience", label: "Experience (years)", placeholder: "e.g. 5", numeric: true },
  { key: "from", label: "Available From", placeholder: "e.g. 06:00" },
  { key: "to", label: "Available To", placeholder: "e.g. 18:00" },
  { key: "price", label: "Rate (Rs/hr)", placeholder: "e.g. 2500", numeric: true },
  { key: "certifications", label: "Certifications", placeholder: "e.g. ACE, NASM" },
  { key: "location", label: "Location", placeholder: "e.g. Main Gym Floor" },
  { key: "bio", label: "Bio", placeholder: "Short trainer description…", multiline: true },
];

export default function AddTrainerScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "", email: "", password: "", specialization: "", experience: "",
    from: "", to: "", price: "", certifications: "", location: "", bio: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.password)
      return Alert.alert("Validation", "Name, email and password are required");

    setLoading(true);
    try {
      await API.post(
        "/trainers",
        { ...form, role: "trainer", experience: Number(form.experience) || 0, price: Number(form.price) || 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("✅ Success", "Trainer added successfully", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Failed to add trainer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} label="Trainers" />
      <Text style={styles.title}>Add Trainer</Text>
      <Text style={styles.subtitle}>Register a new fitness coach</Text>

      {FIELDS.map(f => (
        <View key={f.key} style={styles.fieldGroup}>
          <Text style={styles.label}>
            {f.label} {f.required && <Text style={{ color: COLORS.red }}>*</Text>}
          </Text>
          <TextInput
            value={form[f.key]}
            onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
            placeholder={f.placeholder}
            placeholderTextColor={COLORS.gray}
            secureTextEntry={f.secure}
            keyboardType={f.numeric ? "numeric" : "default"}
            multiline={f.multiline}
            numberOfLines={f.multiline ? 3 : 1}
            style={[styles.input, f.multiline && { height: 80, textAlignVertical: "top" }]}
          />
        </View>
      ))}

      <TouchableOpacity onPress={submit} disabled={loading} style={[styles.submitBtn, loading && { opacity: 0.6 }]}>
        <Text style={styles.submitText}>{loading ? "Adding…" : "Add Trainer"}</Text>
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
  submitBtn: {
    backgroundColor: COLORS.green, borderRadius: 14, padding: 18, alignItems: "center", marginTop: 8,
  },
  submitText: { color: COLORS.white, fontWeight: "900", fontSize: 16 },
});