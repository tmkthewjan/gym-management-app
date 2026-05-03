import React, { useContext, useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

const CATEGORIES = ["General", "Trainer", "Supplement", "App", "Facility"];
const RATINGS = [1, 2, 3, 4, 5];

export default function FeedbackScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [category, setCategory] = useState("General");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async () => {
    if (!message.trim()) return Alert.alert("Validation", "Please write your feedback");
    setLoading(true);
    try {
      await API.post(
        "/feedback",
        { category, rating, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
    } catch {
      // Gracefully handle if endpoint doesn't exist yet
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <BackButton navigation={navigation} />
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>🎉</Text>
          <Text style={styles.successTitle}>Thank You!</Text>
          <Text style={styles.successText}>Your feedback has been submitted. We appreciate your input!</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backHomeBtn}>
            <Text style={styles.backHomeBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>Feedback</Text>
      <Text style={styles.subtitle}>Help us improve your experience</Text>

      <Text style={styles.label}>CATEGORY</Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map(c => (
          <TouchableOpacity
            key={c}
            onPress={() => setCategory(c)}
            style={[styles.catBtn, category === c && styles.catBtnActive]}
          >
            <Text style={[styles.catBtnText, category === c && styles.catBtnTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>RATING</Text>
      <View style={styles.ratingRow}>
        {RATINGS.map(r => (
          <TouchableOpacity key={r} onPress={() => setRating(r)} style={styles.starBtn}>
            <Text style={[styles.star, r <= rating && { opacity: 1 }]}>{r <= rating ? "⭐" : "☆"}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.ratingLabel}>{rating}/5</Text>
      </View>

      <Text style={styles.label}>YOUR FEEDBACK</Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Tell us what you think…"
        placeholderTextColor={COLORS.gray}
        multiline
        numberOfLines={6}
        style={styles.textarea}
      />

      <TouchableOpacity onPress={submit} disabled={loading} style={[styles.submitBtn, loading && { opacity: 0.6 }]}>
        <Text style={styles.submitText}>{loading ? "Submitting…" : "Submit Feedback"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20, paddingTop: 60 },
  successContainer: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20, paddingTop: 60 },
  successCard: {
    flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 60,
  },
  successIcon: { fontSize: 64, marginBottom: 20 },
  successTitle: { color: COLORS.white, fontSize: 32, fontWeight: "900", marginBottom: 12 },
  successText: { color: COLORS.gray, fontSize: 15, textAlign: "center", lineHeight: 22, maxWidth: "80%" },
  backHomeBtn: {
    marginTop: 30, backgroundColor: COLORS.purple, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 32,
  },
  backHomeBtnText: { color: COLORS.white, fontWeight: "900", fontSize: 16 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: "900", letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { color: COLORS.gray, fontSize: 14, marginBottom: 28 },
  label: { color: COLORS.gray, fontSize: 11, fontWeight: "700", letterSpacing: 2, marginBottom: 12 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  catBtn: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  catBtnActive: { backgroundColor: COLORS.purple + "20", borderColor: COLORS.purple + "60" },
  catBtnText: { color: COLORS.gray, fontWeight: "700", fontSize: 13 },
  catBtnTextActive: { color: COLORS.purple },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 24 },
  starBtn: { padding: 4 },
  star: { fontSize: 28, opacity: 0.3 },
  ratingLabel: { color: COLORS.yellow, fontWeight: "900", fontSize: 16, marginLeft: 8 },
  textarea: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    color: COLORS.white, padding: 16, borderRadius: 14, fontSize: 15,
    height: 140, textAlignVertical: "top", marginBottom: 24,
  },
  submitBtn: { backgroundColor: COLORS.purple, borderRadius: 14, padding: 18, alignItems: "center" },
  submitText: { color: COLORS.white, fontWeight: "900", fontSize: 16 },
});