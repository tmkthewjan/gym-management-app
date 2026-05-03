import React, { useContext } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";

const MENU = [
  { title: "Add Supplement", subtitle: "List a new product", icon: "➕", screen: "AddSupplement", color: COLORS.green },
  { title: "My Orders", subtitle: "View incoming orders", icon: "📦", screen: "SupplierOrders", color: COLORS.orange },
  { title: "Browse Store", subtitle: "See all supplements listed", icon: "🏪", screen: "SupplementStore", color: COLORS.cyan },
];

export default function SupplierDashboard({ navigation }) {
  const { user, logout } = useContext(AuthContext);
  const initials = user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "SU";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Supplier Portal</Text>
          <Text style={styles.name}>{user?.name || "Supplier"}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>● SUPPLIER</Text></View>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
      </View>

      <Text style={styles.sectionTitle}>ACTIONS</Text>
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
    marginTop: 6, alignSelf: "flex-start", backgroundColor: COLORS.green + "20",
    borderWidth: 1, borderColor: COLORS.green + "50", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
  },
  badgeText: { color: COLORS.green, fontSize: 10, fontWeight: "800", letterSpacing: 1.5 },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.green + "20", borderWidth: 2, borderColor: COLORS.green + "60",
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: COLORS.green, fontSize: 20, fontWeight: "900" },
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