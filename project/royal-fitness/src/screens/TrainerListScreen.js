import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function TrainerListScreen({ navigation }) {
  const { token, user } = useContext(AuthContext);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "admin";

  const loadTrainers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/trainers", { headers: { Authorization: `Bearer ${token}` } });
      setTrainers(res.data);
    } catch {
      Alert.alert("Error", "Cannot load trainers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
    const unsubscribe = navigation.addListener("focus", loadTrainers);
    return unsubscribe;
  }, []);

  const deleteTrainer = (id) => {
    Alert.alert("Delete Trainer", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/trainers/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            loadTrainers();
          } catch {
            Alert.alert("Error", "Delete failed");
          }
        }
      }
    ]);
  };

  const SPECIALIZATION_COLORS = {
    "Cardio": COLORS.red, "Yoga": COLORS.purple, "Strength": COLORS.orange,
    "CrossFit": COLORS.cyan, "Nutrition": COLORS.green,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} />

      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Trainers</Text>
          <Text style={styles.subtitle}>{trainers.length} coaches available</Text>
        </View>
        {isAdmin && (
          <TouchableOpacity onPress={() => navigation.navigate("AddTrainer")} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.blue} size="large" style={{ marginTop: 40 }} />
      ) : trainers.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🏋️</Text>
          <Text style={styles.emptyText}>No trainers found</Text>
        </View>
      ) : (
        trainers.map((t) => {
          const accentColor = SPECIALIZATION_COLORS[t.specialization] || COLORS.blue;
          const initials = t.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??";
          return (
            <View key={t._id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.avatar, { backgroundColor: accentColor + "20", borderColor: accentColor + "50" }]}>
                  <Text style={[styles.avatarText, { color: accentColor }]}>{initials}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.trainerName}>{t.name}</Text>
                  <View style={[styles.specBadge, { backgroundColor: accentColor + "20", borderColor: accentColor + "40" }]}>
                    <Text style={[styles.specText, { color: accentColor }]}>{t.specialization || "General"}</Text>
                  </View>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>⭐ {t.rating || "4.5"}</Text>
                </View>
              </View>

              <View style={styles.detailsRow}>
                {t.from && t.to && (
                  <View style={styles.pill}><Text style={styles.pillText}>🕐 {t.from}–{t.to}</Text></View>
                )}
                {t.experience && (
                  <View style={styles.pill}><Text style={styles.pillText}>⚡ {t.experience}yr exp</Text></View>
                )}
                {t.price && (
                  <View style={styles.pill}><Text style={styles.pillText}>💰 Rs.{t.price}/hr</Text></View>
                )}
              </View>

              {t.bio ? <Text style={styles.bio} numberOfLines={2}>{t.bio}</Text> : null}

              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("TrainerDetail", { trainer: t })}
                  style={[styles.actionBtn, { borderColor: COLORS.blue + "50", flex: 1 }]}
                >
                  <Text style={[styles.actionBtnText, { color: COLORS.blue }]}>View Profile</Text>
                </TouchableOpacity>

                {user?.role === "member" && (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("TrainerDetail", { trainer: t, bookNow: true })}
                    style={[styles.actionBtn, { backgroundColor: COLORS.red, borderColor: COLORS.red, flex: 1 }]}
                  >
                    <Text style={[styles.actionBtnText, { color: COLORS.white }]}>Book Now</Text>
                  </TouchableOpacity>
                )}

                {isAdmin && (
                  <>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("EditTrainer", { trainer: t })}
                      style={[styles.actionBtn, { borderColor: COLORS.orange + "50" }]}
                    >
                      <Text style={[styles.actionBtnText, { color: COLORS.orange }]}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteTrainer(t._id)}
                      style={[styles.actionBtn, { borderColor: COLORS.red + "50" }]}
                    >
                      <Text style={[styles.actionBtnText, { color: COLORS.red }]}>🗑️</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20, paddingTop: 60 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: "900", letterSpacing: -0.5 },
  subtitle: { color: COLORS.gray, fontSize: 13, marginTop: 3 },
  addBtn: {
    backgroundColor: COLORS.green + "20", borderWidth: 1, borderColor: COLORS.green + "60",
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10,
  },
  addBtnText: { color: COLORS.green, fontWeight: "800", fontSize: 14 },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.gray, fontSize: 16 },
  card: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 18, padding: 18, marginBottom: 14,
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  avatar: {
    width: 54, height: 54, borderRadius: 27, borderWidth: 2,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  avatarText: { fontSize: 20, fontWeight: "900" },
  cardInfo: { flex: 1 },
  trainerName: { color: COLORS.white, fontSize: 18, fontWeight: "800", marginBottom: 6 },
  specBadge: {
    alignSelf: "flex-start", borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
  },
  specText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  ratingBadge: {
    backgroundColor: COLORS.yellow + "20", borderWidth: 1, borderColor: COLORS.yellow + "40",
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  ratingText: { color: COLORS.yellow, fontSize: 12, fontWeight: "800" },
  detailsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  pill: {
    backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  pillText: { color: COLORS.grayLight, fontSize: 12, fontWeight: "600" },
  bio: { color: COLORS.gray, fontSize: 13, lineHeight: 20, marginBottom: 14 },
  actionRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  actionBtn: {
    borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, alignItems: "center",
  },
  actionBtnText: { fontWeight: "800", fontSize: 13 },
});