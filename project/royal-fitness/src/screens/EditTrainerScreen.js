import React, { useContext, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

const FIELDS = [
  { key: "name", label: "Full Name" },
  { key: "specialization", label: "Specialization" },
  { key: "experience", label: "Experience (years)", numeric: true },
  { key: "from", label: "Available From" },
  { key: "to", label: "Available To" },
  { key: "price", label: "Rate (Rs/hr)", numeric: true },
  { key: "certifications", label: "Certifications" },
  { key: "location", label: "Location" },
  { key: "bio", label: "Bio", multiline: true },
];

export default function EditTrainerScreen({ navigation, route }) {
  const { trainer } = route.params;
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: trainer.name || "",
    specialization: trainer.specialization || "",
    experience: String(trainer.experience || ""),
    from: trainer.from || "",
    to: trainer.to || "",
    price: String(trainer.price || ""),
    certifications: trainer.certifications || "",
    location: trainer.location || "",
    bio: trainer.bio || "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await API.put(
        `/trainers/${trainer._id}`,
        { ...form, experience: Number(form.experience) || 0, price: Number(form.price) || 0 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("✅ Updated", "Trainer profile updated", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>Edit Trainer</Text>
      <Text style={styles.subtitle}>Update profile for {trainer.name}</Text>

      {FIELDS.map(f => (
        <View key={f.key} style={styles.fieldGroup}>
          <Text style={styles.label}>{f.label}</Text>
          <TextInput
            value={form[f.key]}
            onChangeText={v => setForm(prev => ({ ...prev, [f.key]: v }))}
            placeholder={f.label}
            placeholderTextColor={COLORS.gray}
            keyboardType={f.numeric ? "numeric" : "default"}
            multiline={f.multiline}
            numberOfLines={f.multiline ? 3 : 1}
            style={[styles.input, f.multiline && { height: 80, textAlignVertical: "top" }]}
          />
        </View>
      ))}

      <TouchableOpacity onPress={submit} disabled={loading} style={[styles.submitBtn, loading && { opacity: 0.6 }]}>
        <Text style={styles.submitText}>{loading ? "Saving…" : "Save Changes"}</Text>
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
    backgroundColor: COLORS.blue, borderRadius: 14, padding: 18, alignItems: "center", marginTop: 8,
  },
  submitText: { color: COLORS.white, fontWeight: "900", fontSize: 16 },
});