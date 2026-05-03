import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from "react-native";
import { router } from "expo-router";

const ROLES = [
  {
    id: "member",
    icon: "🏋️",
    title: "Member",
    desc: "Track workouts, book coaches & buy supplements",
    color: "#EF233C",
    bg: "#1A0508",
    border: "#3D0B13",
    stats: ["Workouts", "Nutrition", "Trainers"],
  },
  {
    id: "trainer",
    icon: "💪",
    title: "Trainer",
    desc: "Manage sessions, bookings & client progress",
    color: "#3B82F6",
    bg: "#050C1A",
    border: "#0B1E3D",
    stats: ["Sessions", "Requests", "Clients"],
  },
  {
    id: "supplier",
    icon: "📦",
    title: "Supplier",
    desc: "Add supplements, manage stock & track orders",
    color: "#10B981",
    bg: "#051A10",
    border: "#0B3D22",
    stats: ["Products", "Orders", "Stock"],
  },
  {
    id: "admin",
    icon: "👑",
    title: "Admin",
    desc: "Control the full gym management system",
    color: "#F59E0B",
    bg: "#1A0F05",
    border: "#3D2B0B",
    stats: ["Members", "Trainers", "Reports"],
  },
];

export default function Role() {
  return (
    <View style={styles.page}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brand}>⚡ ROYAL FITNESS</Text>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.sub}>Select how you'll use the app to get a personalized experience</Text>
        </View>

        {/* Role Cards */}
        {ROLES.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[styles.card, { backgroundColor: role.bg, borderColor: role.border }]}
            onPress={() => router.push({ pathname: "/login", params: { role: role.id } })}
            activeOpacity={0.8}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconBox, { backgroundColor: role.border }]}>
                <Text style={styles.icon}>{role.icon}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.roleTitle, { color: role.color }]}>{role.title}</Text>
                <Text style={styles.roleDesc}>{role.desc}</Text>
              </View>
              <View style={[styles.arrow, { backgroundColor: role.border }]}>
                <Text style={[styles.arrowText, { color: role.color }]}>›</Text>
              </View>
            </View>

            {/* Feature chips */}
            <View style={styles.chips}>
              {role.stats.map((s) => (
                <View key={s} style={[styles.chip, { borderColor: role.border }]}>
                  <Text style={[styles.chipText, { color: role.color }]}>{s}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.footer}>Royal Fitness © 2025</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#05070B" },
  scroll: { padding: 22, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 30 },
  brand: { color: "#EF233C", fontSize: 12, letterSpacing: 4, fontWeight: "900" },
  title: { color: "#FFFFFF", fontSize: 34, fontWeight: "900", marginTop: 10, letterSpacing: -0.5 },
  sub: { color: "#6B7280", fontSize: 15, marginTop: 8, lineHeight: 22 },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
  },
  cardTop: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  icon: { fontSize: 26 },
  cardInfo: { flex: 1 },
  roleTitle: { fontSize: 19, fontWeight: "900", letterSpacing: 0.3 },
  roleDesc: { color: "#9CA3AF", fontSize: 13, marginTop: 4, lineHeight: 18 },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  arrowText: { fontSize: 22, fontWeight: "900" },
  chips: { flexDirection: "row", gap: 8, marginTop: 16 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  footer: { color: "#374151", textAlign: "center", fontSize: 12, marginTop: 20 },
});
