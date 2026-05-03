import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

const STATUS_COLORS = { Pending: COLORS.yellow, Processing: COLORS.blue, Delivered: COLORS.green, Cancelled: COLORS.red };

export default function MyOrdersScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/orders/my", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setOrders(r.data))
      .catch(() => Alert.alert("Error", "Cannot load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>My Orders</Text>
      <Text style={styles.subtitle}>{orders.length} orders placed</Text>

      {loading ? (
        <ActivityIndicator color={COLORS.orange} size="large" style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>No orders yet</Text>
          <Text style={styles.emptyHint}>Visit the Supplement Store to order</Text>
        </View>
      ) : (
        orders.map((o, i) => {
          const statusColor = STATUS_COLORS[o.status] || COLORS.gray;
          return (
            <View key={o._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>#{i + 1}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{o.supplement?.name || "Supplement"}</Text>
                  <Text style={styles.productMeta}>Qty: {o.quantity} • Rs.{o.totalPrice}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusColor + "20", borderColor: statusColor + "40" }]}>
                  <Text style={[styles.statusText, { color: statusColor }]}>{o.status || "Pending"}</Text>
                </View>
              </View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>📅 {new Date(o.createdAt).toLocaleDateString()}</Text>
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
  title: { color: COLORS.white, fontSize: 28, fontWeight: "900", letterSpacing: -0.5, marginBottom: 4 },
  subtitle: { color: COLORS.gray, fontSize: 13, marginBottom: 24 },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.grayLight, fontSize: 18, fontWeight: "700" },
  emptyHint: { color: COLORS.gray, fontSize: 13, marginTop: 6 },
  card: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 16, padding: 16, marginBottom: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  numberBadge: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.orange + "20", borderWidth: 1, borderColor: COLORS.orange + "40",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  numberText: { color: COLORS.orange, fontWeight: "900", fontSize: 13 },
  productInfo: { flex: 1 },
  productName: { color: COLORS.white, fontSize: 16, fontWeight: "800" },
  productMeta: { color: COLORS.gray, fontSize: 12, marginTop: 2 },
  statusBadge: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: "800" },
  pill: {
    alignSelf: "flex-start", backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  pillText: { color: COLORS.grayLight, fontSize: 12, fontWeight: "600" },
});