import React, { useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";

export default function TrainerDashboard({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "TR";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <View style={styles.headerText}>
          <Text style={styles.role}>TRAINER</Text>
          <Text style={styles.name}>Coach {user?.name || "Trainer"}</Text>
          {user?.specialization ? (
            <Text style={styles.spec}>{user.specialization}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.infoRow}>
        {user?.from && user?.to ? (
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>🕐 {user.from} – {user.to}</Text>
          </View>
        ) : null}
        {user?.experience ? (
          <View style={styles.infoPill}>
            <Text style={styles.infoPillText}>⚡ {user.experience} yrs exp</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.sectionTitle}>ACTIONS</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("TrainerRequests")}
        style={styles.card}
        activeOpacity={0.75}
      >
        <View style={[styles.iconBox, { backgroundColor: COLORS.orange + "20", borderColor: COLORS.orange + "40" }]}>
          <Text style={styles.icon}>📋</Text>
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Booking Requests</Text>
          <Text style={styles.cardSub}>Approve or reject member bookings</Text>
        </View>
        <Text style={[styles.arrow, { color: COLORS.orange }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("EditTrainer", { trainer: user })}
        style={styles.card}
        activeOpacity={0.75}
      >
        <View style={[styles.iconBox, { backgroundColor: COLORS.blue + "20", borderColor: COLORS.blue + "40" }]}>
          <Text style={styles.icon}>✏️</Text>
        </View>
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Edit My Profile</Text>
          <Text style={styles.cardSub}>Update specialization, hours & bio</Text>
        </View>
        <Text style={[styles.arrow, { color: COLORS.blue }]}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20 },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingTop: 65, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 16,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: COLORS.orange + "20", borderWidth: 2, borderColor: COLORS.orange + "60",
    justifyContent: "center", alignItems: "center", marginRight: 18,
  },
  avatarText: { color: COLORS.orange, fontSize: 22, fontWeight: "900" },
  headerText: { flex: 1 },
  role: { color: COLORS.orange, fontSize: 10, fontWeight: "800", letterSpacing: 2, marginBottom: 4 },
  name: { color: COLORS.white, fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  spec: { color: COLORS.gray, fontSize: 13, marginTop: 3 },
  infoRow: { flexDirection: "row", gap: 10, marginBottom: 26, flexWrap: "wrap" },
  infoPill: {
    backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  infoPillText: { color: COLORS.grayLight, fontSize: 12, fontWeight: "600" },
  sectionTitle: { color: COLORS.gray, fontSize: 11, fontWeight: "700", letterSpacing: 2, marginBottom: 14 },
  card: {
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.card,
    borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 18, marginBottom: 12,
  },
  iconBox: {
    width: 50, height: 50, borderRadius: 14, borderWidth: 1,
    justifyContent: "center", alignItems: "center", marginRight: 16,
  },
  icon: { fontSize: 22 },
  cardText: { flex: 1 },
  cardTitle: { color: COLORS.white, fontSize: 16, fontWeight: "800", marginBottom: 3 },
  cardSub: { color: COLORS.gray, fontSize: 13 },
  arrow: { fontSize: 26, fontWeight: "300" },
  logoutBtn: {
    marginTop: 20, borderWidth: 1, borderColor: COLORS.red + "60",
    backgroundColor: COLORS.red + "15", padding: 16, borderRadius: 14, alignItems: "center",
  },
  logoutText: { color: COLORS.red, fontWeight: "800", fontSize: 15 },
});