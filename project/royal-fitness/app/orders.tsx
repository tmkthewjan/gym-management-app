import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { apiRequest } from "../utils/api";
import { getToken, getUser } from "../utils/storage";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const user = await getUser();

      if (!token) {
        Alert.alert("Login Required", "Please login again");
        return;
      }

      const endpoint =
        user?.role === "supplier" || user?.role === "admin"
          ? "/orders/supplier"
          : "/orders/my";

      const data = await apiRequest(endpoint, "GET", undefined, token);

      setOrders(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Cannot load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <ScrollView style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>My Orders</Text>
          <Text style={styles.sub}>{orders.length} orders placed</Text>
        </View>
      </View>

      {loading && (
        <ActivityIndicator color="#2563EB" size="large" style={{ marginTop: 40 }} />
      )}

      {!loading && orders.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>No orders yet</Text>
        </View>
      )}

      {orders.map((o, i) => (
        <View key={o._id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.number}>#{i + 1}</Text>

            <View style={{ flex: 1 }}>
              <Text style={styles.product}>
                {o.supplement?.name || "Supplement"}
              </Text>
              <Text style={styles.meta}>
                Qty: {o.quantity} • Rs. {o.totalPrice}
              </Text>
            </View>

            <Text style={styles.status}>{o.status || "Pending"}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F4F5FA", padding: 20 },
  header: {
    marginTop: 55,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 34, color: "#111827", marginTop: -4 },
  title: { color: "#111827", fontSize: 30, fontWeight: "900" },
  sub: { color: "#6B7280", marginTop: 4 },
  empty: {
    backgroundColor: "white",
    padding: 35,
    borderRadius: 24,
    alignItems: "center",
  },
  emptyIcon: { fontSize: 42 },
  emptyText: { color: "#6B7280", marginTop: 10, fontWeight: "800" },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 22,
    marginBottom: 14,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  number: { color: "#2563EB", fontSize: 18, fontWeight: "900" },
  product: { color: "#111827", fontSize: 17, fontWeight: "900" },
  meta: { color: "#6B7280", marginTop: 4 },
  status: { color: "#F59E0B", fontWeight: "900" },
});