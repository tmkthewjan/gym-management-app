import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { apiRequest } from "../utils/api";
import { getToken, getUser } from "../utils/storage";

export default function Supplements() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/supplements", "GET");
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Cannot load supplements");
    } finally {
      setLoading(false);
    }
  };

  const buyNow = async (id: string) => {
    try {
      const token = await getToken();

      if (!token) {
        return Alert.alert("Login Required", "Please login again");
      }

      await apiRequest(
        "/orders",
        "POST",
        { supplementId: id, quantity: 1 },
        token
      );

      Alert.alert("Success", "Supplement order placed");
      loadItems();
    } catch (e: any) {
      Alert.alert("Order Failed", e.message || "Order failed");
    }
  };

  useEffect(() => {
    getUser().then(setUser);
    loadItems();
  }, []);

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>Supplement Store</Text>
          <Text style={styles.sub}>{items.length} products available</Text>
        </View>
      </View>

      {loading && (
        <ActivityIndicator color="#2563EB" size="large" style={{ marginTop: 40 }} />
      )}

      {!loading && items.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💊</Text>
          <Text style={styles.emptyText}>No supplements listed</Text>
        </View>
      )}

      {items.map((s) => (
        <View key={s._id} style={styles.card}>
          <View style={styles.topRow}>
            <View style={styles.iconBox}>
              <Text style={{ fontSize: 30 }}>💊</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{s.name}</Text>
              <Text style={styles.category}>{s.category || "General"}</Text>
            </View>

            <Text style={styles.price}>Rs. {s.price}</Text>
          </View>

          <Text style={styles.desc}>
            {s.description || "Premium gym supplement product"}
          </Text>

          <Text
            style={[
              styles.stock,
              { color: s.stock > 0 ? "#22C55E" : "#EF233C" },
            ]}
          >
            {s.stock > 0 ? `In Stock (${s.stock})` : "Out of Stock"}
          </Text>

          {user?.role === "member" && (
            <TouchableOpacity
              disabled={s.stock <= 0}
              style={[
                styles.buyBtn,
                s.stock <= 0 && { backgroundColor: "#9CA3AF" },
              ]}
              onPress={() => buyNow(s._id)}
            >
              <Text style={styles.buyText}>
                {s.stock > 0 ? "Buy Now" : "Unavailable"}
              </Text>
            </TouchableOpacity>
          )}
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
    borderRadius: 26,
    marginBottom: 16,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  name: { color: "#111827", fontSize: 20, fontWeight: "900" },
  category: { color: "#6B7280", marginTop: 4 },
  price: { color: "#2563EB", fontWeight: "900", fontSize: 16 },
  desc: { color: "#6B7280", marginTop: 14, lineHeight: 20 },
  stock: { fontWeight: "900", marginTop: 12 },
  buyBtn: {
    backgroundColor: "#EF233C",
    padding: 15,
    borderRadius: 18,
    marginTop: 15,
  },
  buyText: { color: "white", textAlign: "center", fontWeight: "900" },
});