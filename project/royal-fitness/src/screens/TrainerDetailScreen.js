import React, { useContext, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function TrainerDetailScreen({ navigation, route }) {
  const { trainer, bookNow: autoBook } = route.params;
  const { token, user } = useContext(AuthContext);
  const [booked, setBooked] = useState(false);

  const initials = trainer.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "TR";

  const bookTrainer = async () => {
    try {
      await API.post(
        "/appointments",
        { trainer: trainer._id, date: "2026-05-10", time: "10:00", note: "Fitness training session" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBooked(true);
      Alert.alert("✅ Booked!", `Booking request sent to ${trainer.name}`);
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Booking failed");
    }
  };

  const INFO = [
    { label: "Specialization", value: trainer.specialization || "General Fitness", icon: "🎯" },
    { label: "Experience", value: trainer.experience ? `${trainer.experience} years` : "N/A", icon: "⚡" },
    { label: "Working Hours", value: trainer.from && trainer.to ? `${trainer.from} – ${trainer.to}` : "Flexible", icon: "🕐" },
    { label: "Session Rate", value: trainer.price ? `Rs. ${trainer.price}/hr` : "Contact for pricing", icon: "💰" },
    { label: "Certifications", value: trainer.certifications || "Certified Trainer", icon: "🏅" },
    { label: "Location", value: trainer.location || "Gym Floor", icon: "📍" },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} label="Trainers" />

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{trainer.name}</Text>
        <View style={styles.specBadge}>
          <Text style={styles.specText}>{trainer.specialization || "General"}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>⭐ {trainer.rating || "4.5"}</Text>
          <Text style={styles.dotSep}>•</Text>
          <Text style={styles.sessionCount}>{trainer.sessions || "50"}+ sessions</Text>
        </View>
        {trainer.bio ? <Text style={styles.bio}>{trainer.bio}</Text> : null}
      </View>

      {/* Info Grid */}
      <Text style={styles.sectionTitle}>TRAINER INFO</Text>
      <View style={styles.infoGrid}>
        {INFO.map(item => (
          <View key={item.label} style={styles.infoCard}>
            <Text style={styles.infoIcon}>{item.icon}</Text>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Book Button */}
      {user?.role === "member" && (
        booked ? (
          <View style={styles.bookedBanner}>
            <Text style={styles.bookedText}>✅ Booking request sent!</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={bookTrainer} style={styles.bookBtn} activeOpacity={0.8}>
            <Text style={styles.bookBtnText}>Book This Trainer</Text>
          </TouchableOpacity>
        )
      )}

      {/* Admin actions */}
      {user?.role === "admin" && (
        <TouchableOpacity
          onPress={() => navigation.navigate("EditTrainer", { trainer })}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnText}>✏️  Edit Trainer Profile</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20, paddingTop: 60 },
  profileCard: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 28,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.orange + "20", borderWidth: 2, borderColor: COLORS.orange + "60",
    justifyContent: "center", alignItems: "center", marginBottom: 14,
  },
  avatarText: { color: COLORS.orange, fontSize: 28, fontWeight: "900" },
  name: { color: COLORS.white, fontSize: 24, fontWeight: "900", marginBottom: 10, letterSpacing: -0.5 },
  specBadge: {
    backgroundColor: COLORS.orange + "20", borderWidth: 1, borderColor: COLORS.orange + "40",
    paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginBottom: 12,
  },
  specText: { color: COLORS.orange, fontSize: 12, fontWeight: "800", letterSpacing: 1 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  ratingText: { color: COLORS.yellow, fontWeight: "800", fontSize: 14 },
  dotSep: { color: COLORS.border, fontSize: 16 },
  sessionCount: { color: COLORS.gray, fontSize: 13 },
  bio: { color: COLORS.gray, fontSize: 14, lineHeight: 22, textAlign: "center" },
  sectionTitle: { color: COLORS.gray, fontSize: 11, fontWeight: "700", letterSpacing: 2, marginBottom: 14 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 28 },
  infoCard: {
    flex: 1, minWidth: "44%", backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 14, padding: 14,
  },
  infoIcon: { fontSize: 20, marginBottom: 8 },
  infoLabel: { color: COLORS.gray, fontSize: 11, fontWeight: "700", letterSpacing: 1, marginBottom: 4 },
  infoValue: { color: COLORS.white, fontSize: 14, fontWeight: "700" },
  bookBtn: {
    backgroundColor: COLORS.red, borderRadius: 16, padding: 18,
    alignItems: "center", marginBottom: 12,
  },
  bookBtnText: { color: COLORS.white, fontSize: 16, fontWeight: "900" },
  bookedBanner: {
    backgroundColor: COLORS.green + "20", borderWidth: 1, borderColor: COLORS.green + "50",
    borderRadius: 14, padding: 16, alignItems: "center",
  },
  bookedText: { color: COLORS.green, fontWeight: "800", fontSize: 15 },
  editBtn: {
    borderWidth: 1, borderColor: COLORS.orange + "50", borderRadius: 14, padding: 16, alignItems: "center",
  },
  editBtnText: { color: COLORS.orange, fontWeight: "800", fontSize: 15 },
});