import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import { clearAuth, getToken, getUser } from "../utils/storage";
import { apiRequest } from "../utils/api";

export default function Supplier() {
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    imageUrl: "",
  });

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const addProduct = async () => {
    if (!form.name.trim() || !form.price.trim() || !form.stock.trim()) {
      return Alert.alert("Validation", "Name, price and stock required");
    }

    try {
      const token = await getToken();

      if (!token) {
        return Alert.alert("Login Required", "Please login again");
      }

      await apiRequest(
        "/supplements",
        "POST",
        {
          name: form.name.trim(),
          category: form.category.trim() || "General",
          description: form.description.trim() || "Premium supplement",
          price: Number(form.price),
          stock: Number(form.stock),
          imageUrl: form.imageUrl.trim() || "",
        },
        token
      );

      Alert.alert("Success", "Supplement added successfully");

      setForm({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        imageUrl: "",
      });
    } catch (e: any) {
      Alert.alert("Add Failed", e.message || "Cannot add supplement");
    }
  };

  const logout = async () => {
    await clearAuth();
    router.replace("/");
  };

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Supplier Portal</Text>
          <Text style={styles.title}>{user?.name || "Supplier"}</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={{ fontSize: 26 }}>📦</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <Stat num="18" label="Products" color="#10B981" />
        <Stat num="30" label="Orders" color="#2563EB" />
        <Stat num="7" label="Low Stock" color="#EF233C" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add New Supplement</Text>

        {[
          ["name", "Supplement Name"],
          ["category", "Category"],
          ["description", "Description"],
          ["price", "Price"],
          ["stock", "Stock Quantity"],
          ["imageUrl", "Image URL"],
        ].map(([key, label]) => (
          <TextInput
            key={key}
            placeholder={label}
            placeholderTextColor="#9CA3AF"
            value={(form as any)[key]}
            onChangeText={(v) => setForm((p) => ({ ...p, [key]: v }))}
            style={styles.input}
          />
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addProduct}>
          <Text style={styles.btnText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.action}
        onPress={() => router.push("/orders" as any)}
      >
        <Text style={styles.actionText}>📦 View Orders</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={() => router.push("/supplements" as any)}
      >
        <Text style={styles.actionText}>🏪 Browse Store</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logout} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Stat({ num, label, color }: any) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statNum, { color }]}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F4F5FA", padding: 20 },
  header: {
    marginTop: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: { color: "#6B7280" },
  title: { color: "#111827", fontSize: 28, fontWeight: "900", marginTop: 4 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
  },
  statsRow: { flexDirection: "row", gap: 10, marginTop: 24 },
  stat: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  statNum: { fontSize: 24, fontWeight: "900" },
  statLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 26,
    marginTop: 20,
  },
  cardTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#F9FAFB",
    color: "#111827",
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  addBtn: {
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 16,
    marginTop: 4,
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "900" },
  action: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 20,
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionText: { color: "#111827", fontWeight: "900", fontSize: 16 },
  arrow: { color: "#2563EB", fontSize: 26 },
  logout: {
    backgroundColor: "#EF233C",
    padding: 16,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: { color: "white", textAlign: "center", fontWeight: "900" },
});