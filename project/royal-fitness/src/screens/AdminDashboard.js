import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";

export default function AdminDashboard({ navigation }) {
  const { token, user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({});

  useEffect(() => {
    API.get("/admin/dashboard", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setStats(r.data))
      .catch(() => Alert.alert("Error", "Cannot load dashboard"));
  }, []);

  const STAT_CARDS = [
    { label: "Total Users", value: stats.totalUsers || 0, color: COLORS.blue, icon: "👥" },
    { label: "Members", value: stats.totalMembers || 0, color: COLORS.cyan, icon: "🏃" },
    { label: "Trainers", value: stats.totalTrainers || 0, color: COLORS.orange, icon: "🏋️" },
    { label: "Suppliers", value: stats.totalSuppliers || 0, color: COLORS.purple, icon: "📦" },
  ];

  const MENU = [
    { title: "Manage Trainers", subtitle: "Add, edit, view all trainers", icon: "🏋️", screen: "TrainerList", color: COLORS.orange },
    { title: "Supplement Store", subtitle: "View all supplements", icon: "💊", screen: "SupplementStore", color: COLORS.cyan },
    { title: "Add Trainer", subtitle: "Register a new trainer", icon: "➕", screen: "AddTrainer", color: COLORS.green },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Panel</Text>
          <Text style={styles.name}>Welcome, {user?.name || "Admin"}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>● ADMINISTRATOR</Text></View>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>AD</Text></View>
      </View>

      <Text style={styles.sectionTitle}>OVERVIEW</Text>
      <View style={styles.statsGrid}>
        {STAT_CARDS.map(s => (
          <View key={s.label} style={[styles.statCard, { borderColor: s.color + "40" }]}>
            <Text style={styles.statIcon}>{s.icon}</Text>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>MANAGE</Text>
      {MENU.map(item => (
        <TouchableOpacity key={item.title} onPress={() => navigation.navigate(item.screen)} style={styles.card} activeOpacity={0.75}>
          <View style={[styles.iconBox, { backgroundColor: item.color + "20", borderColor: item.color + "40" }]}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.subtitle}</Text>
          </View>
          <Text style={[styles.arrow, { color: item.color }]}>›</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingTop: 65, paddingBottom: 28, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 26,
  },
  greeting: { color: COLORS.gray, fontSize: 13, fontWeight: "600", marginBottom: 4, letterSpacing: 1 },
  name: { color: COLORS.white, fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
  badge: {
    marginTop: 6, alignSelf: "flex-start", backgroundColor: COLORS.red + "20",
    borderWidth: 1, borderColor: COLORS.red + "50", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
  },
  badgeText: { color: COLORS.red, fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.red + "20", borderWidth: 2, borderColor: COLORS.red + "60",
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: COLORS.red, fontSize: 20, fontWeight: "900" },
  sectionTitle: { color: COLORS.gray, fontSize: 11, fontWeight: "700", letterSpacing: 2, marginBottom: 14 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1, minWidth: "44%", backgroundColor: COLORS.card, borderWidth: 1,
    borderRadius: 16, padding: 18, alignItems: "center",
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  statLabel: { color: COLORS.gray, fontSize: 12, fontWeight: "600", marginTop: 4 },
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