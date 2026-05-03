import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

const CATEGORY_COLORS = {
  Protein: COLORS.blue, Vitamins: COLORS.green, Pre_Workout: COLORS.red,
  BCAAs: COLORS.cyan, Weight_Loss: COLORS.orange, Other: COLORS.purple,
};

export default function SupplementStoreScreen({ navigation }) {
  const { token, user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isSupplier = user?.role === "supplier";

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await API.get("/supplements", { headers: { Authorization: `Bearer ${token}` } });
      setItems(res.data);
    } catch {
      Alert.alert("Error", "Cannot load supplements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    const unsub = navigation.addListener("focus", loadItems);
    return unsub;
  }, []);

  const buyNow = async (id) => {
    try {
      await API.post("/orders", { supplementId: id, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert("✅ Ordered!", "Your supplement has been ordered");
    } catch (e) {
      Alert.alert("Error", e.response?.data?.message || "Order failed");
    }
  };

  const deleteItem = (id) => {
    Alert.alert("Delete Product", "Remove this supplement?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/supplements/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            loadItems();
          } catch {
            Alert.alert("Error", "Delete failed");
          }
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} />

      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Supplement Store</Text>
          <Text style={styles.subtitle}>{items.length} products available</Text>
        </View>
        {isSupplier && (
          <TouchableOpacity onPress={() => navigation.navigate("AddSupplement")} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={COLORS.cyan} size="large" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💊</Text>
          <Text style={styles.emptyText}>No supplements listed</Text>
        </View>
      ) : (
        items.map(s => {
          const accentColor = CATEGORY_COLORS[s.category] || COLORS.cyan;
          return (
            <View key={s._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: accentColor + "20", borderColor: accentColor + "40" }]}>
                  <Text style={styles.iconText}>💊</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.itemName}>{s.name}</Text>
                  <View style={[styles.catBadge, { backgroundColor: accentColor + "20", borderColor: accentColor + "40" }]}>
                    <Text style={[styles.catText, { color: accentColor }]}>{s.category || "General"}</Text>
                  </View>
                </View>
                <View style={styles.priceBox}>
                  <Text style={styles.priceText}>Rs.{s.price}</Text>
                </View>
              </View>

              {s.description ? <Text style={styles.desc} numberOfLines={2}>{s.description}</Text> : null}

              <View style={styles.stockRow}>
                <View style={[styles.stockBadge, { backgroundColor: s.stock > 0 ? COLORS.green + "20" : COLORS.red + "20", borderColor: s.stock > 0 ? COLORS.green + "40" : COLORS.red + "40" }]}>
                  <Text style={[styles.stockText, { color: s.stock > 0 ? COLORS.green : COLORS.red }]}>
                    {s.stock > 0 ? `${s.stock} in stock` : "Out of Stock"}
                  </Text>
                </View>
                {s.weight && <View style={styles.pill}><Text style={styles.pillText}>⚖️ {s.weight}</Text></View>}
              </View>

              <View style={styles.actionRow}>
                {user?.role === "member" && (
                  <TouchableOpacity
                    disabled={s.stock <= 0}
                    onPress={() => buyNow(s._id)}
                    style={[styles.buyBtn, s.stock <= 0 && { opacity: 0.4 }]}
                  >
                    <Text style={styles.buyBtnText}>
                      {s.stock > 0 ? "🛒 Buy Now" : "Out of Stock"}
                    </Text>
                  </TouchableOpacity>
                )}
                {isSupplier && (
                  <>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("EditSupplement", { supplement: s })}
                      style={[styles.iconActionBtn, { borderColor: COLORS.orange + "50" }]}
                    >
                      <Text style={{ color: COLORS.orange, fontSize: 15 }}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteItem(s._id)}
                      style={[styles.iconActionBtn, { borderColor: COLORS.red + "50" }]}
                    >
                      <Text style={{ color: COLORS.red, fontSize: 15 }}>🗑️</Text>
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
    backgroundColor: COLORS.cyan + "20", borderWidth: 1, borderColor: COLORS.cyan + "50",
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10,
  },
  addBtnText: { color: COLORS.cyan, fontWeight: "800", fontSize: 14 },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: COLORS.gray, fontSize: 16 },
  card: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 18, padding: 18, marginBottom: 14,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  iconBox: {
    width: 50, height: 50, borderRadius: 14, borderWidth: 1,
    justifyContent: "center", alignItems: "center", marginRight: 14,
  },
  iconText: { fontSize: 22 },
  cardInfo: { flex: 1 },
  itemName: { color: COLORS.white, fontSize: 17, fontWeight: "800", marginBottom: 6 },
  catBadge: {
    alignSelf: "flex-start", borderWidth: 1,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20,
  },
  catText: { fontSize: 11, fontWeight: "700" },
  priceBox: {
    backgroundColor: COLORS.blue + "20", borderWidth: 1, borderColor: COLORS.blue + "40",
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
  },
  priceText: { color: COLORS.blue, fontWeight: "900", fontSize: 15 },
  desc: { color: COLORS.gray, fontSize: 13, lineHeight: 20, marginBottom: 12 },
  stockRow: { flexDirection: "row", gap: 10, marginBottom: 14, flexWrap: "wrap" },
  stockBadge: {
    borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  stockText: { fontSize: 12, fontWeight: "700" },
  pill: {
    backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  pillText: { color: COLORS.grayLight, fontSize: 12, fontWeight: "600" },
  actionRow: { flexDirection: "row", gap: 10 },
  buyBtn: {
    flex: 1, backgroundColor: COLORS.red, borderRadius: 12, padding: 13, alignItems: "center",
  },
  buyBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 14 },
  iconActionBtn: {
    width: 44, height: 44, borderWidth: 1, borderRadius: 10,
    justifyContent: "center", alignItems: "center",
  },
});