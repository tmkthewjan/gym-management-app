import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

export default function SupplierOrdersScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/supplier", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data))
      .catch(() => Alert.alert("Error", "Cannot load orders"))
      .finally(() => setLoading(false));
  }, []);

  const total = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>Orders</Text>
      <Text style={styles.subtitle}>{orders.length} orders received</Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{orders.length}</Text>
          <Text style={styles.summaryLabel}>Total Orders</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, { color: COLORS.green }]}>Rs.{total.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Revenue</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.orange} size="large" style={{ marginTop: 30 }} />
      ) : orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      ) : (
        orders.map((o, i) => (
          <View key={o._id} style={styles.card}>
            <View style={styles.orderHeader}>
              <View style={styles.orderNumBadge}>
                <Text style={styles.orderNumText}>#{i + 1}</Text>
              </View>
              <View style={styles.orderInfo}>
                <Text style={styles.productName}>{o.supplement?.name || "Product"}</Text>
                <Text style={styles.buyerName}>by {o.member?.name || "Customer"}</Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>Rs.{o.totalPrice}</Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <View style={styles.pill}><Text style={styles.pillText}>📦 Qty: {o.quantity}</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>📅 {new Date(o.createdAt).toLocaleDateString()}</Text></View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 20, paddingTop: 60 },
  title: { color: COLORS.white, fontSize: 28, fontWeight: "900", letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { color: COLORS.gray, fontSize: 13, marginBottom: 20 },
  summaryCard: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 16, padding: 20, flexDirection: "row", marginBottom: 24,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryValue: { color: COLORS.white, fontSize: 28, fontWeight: "900", letterSpacing: -1 },
  summaryLabel: { color: COLORS.gray, fontSize: 12, marginTop: 4 },
  divider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
  empty: { alignItems: "center", paddingTop: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.gray, fontSize: 16 },
  card: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 16, padding: 16, marginBottom: 12,
  },
  orderHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  orderNumBadge: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.orange + "20", borderWidth: 1, borderColor: COLORS.orange + "40",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  orderNumText: { color: COLORS.orange, fontWeight: "900", fontSize: 13 },
  orderInfo: { flex: 1 },
  productName: { color: COLORS.white, fontSize: 15, fontWeight: "800" },
  buyerName: { color: COLORS.gray, fontSize: 12, marginTop: 2 },
  priceBadge: {
    backgroundColor: COLORS.green + "20", borderWidth: 1, borderColor: COLORS.green + "40",
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
  },
  priceText: { color: COLORS.green, fontWeight: "900", fontSize: 14 },
  orderDetails: { flexDirection: "row", gap: 10 },
  pill: {
    backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  pillText: { color: COLORS.grayLight, fontSize: 12, fontWeight: "600" },
});