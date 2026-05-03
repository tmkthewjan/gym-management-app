import React, { useContext, useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import API from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";
import BackButton from "../components/BackButton";

const STATUS_COLORS = {
  Pending: COLORS.yellow, Approved: COLORS.green, Rejected: COLORS.red,
};

export default function TrainerRequestsScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get("/appointments/trainer", { headers: { Authorization: `Bearer ${token}` } });
      setRequests(res.data);
    } catch {
      Alert.alert("Error", "Cannot load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRequests(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/appointments/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      loadRequests();
    } catch {
      Alert.alert("Error", "Status update failed");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <BackButton navigation={navigation} />
      <Text style={styles.title}>Booking Requests</Text>
      <Text style={styles.subtitle}>{requests.length} total requests</Text>

      {loading ? (
        <ActivityIndicator color={COLORS.blue} size="large" style={{ marginTop: 40 }} />
      ) : requests.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>No booking requests yet</Text>
        </View>
      ) : (
        requests.map(r => (
          <View key={r._id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.memberInitials}>
                <Text style={styles.memberInitialsText}>
                  {r.member?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??"}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{r.member?.name || "Unknown Member"}</Text>
                <Text style={styles.memberEmail}>{r.member?.email}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: (STATUS_COLORS[r.status] || COLORS.gray) + "20", borderColor: (STATUS_COLORS[r.status] || COLORS.gray) + "50" }]}>
                <Text style={[styles.statusText, { color: STATUS_COLORS[r.status] || COLORS.gray }]}>{r.status}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.pill}><Text style={styles.pillText}>📅 {r.date}</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>🕐 {r.time}</Text></View>
            </View>

            {r.note ? <Text style={styles.note}>"{r.note}"</Text> : null}

            {r.status === "Pending" && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  onPress={() => updateStatus(r._id, "Approved")}
                  style={[styles.actionBtn, { backgroundColor: COLORS.green + "20", borderColor: COLORS.green + "50", flex: 1 }]}
                >
                  <Text style={[styles.actionBtnText, { color: COLORS.green }]}>✓ Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => updateStatus(r._id, "Rejected")}
                  style={[styles.actionBtn, { backgroundColor: COLORS.red + "20", borderColor: COLORS.red + "50", flex: 1 }]}
                >
                  <Text style={[styles.actionBtnText, { color: COLORS.red }]}>✕ Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
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
  emptyText: { color: COLORS.gray, fontSize: 16 },
  card: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 18, padding: 18, marginBottom: 14,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  memberInitials: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: COLORS.cyan + "20", borderWidth: 1, borderColor: COLORS.cyan + "50",
    justifyContent: "center", alignItems: "center", marginRight: 12,
  },
  memberInitialsText: { color: COLORS.cyan, fontSize: 16, fontWeight: "900" },
  memberInfo: { flex: 1 },
  memberName: { color: COLORS.white, fontSize: 16, fontWeight: "800" },
  memberEmail: { color: COLORS.gray, fontSize: 12, marginTop: 2 },
  statusBadge: {
    borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  detailRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  pill: {
    backgroundColor: COLORS.card2, borderWidth: 1, borderColor: COLORS.border,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  pillText: { color: COLORS.grayLight, fontSize: 12, fontWeight: "600" },
  note: { color: COLORS.gray, fontSize: 13, fontStyle: "italic", marginBottom: 14 },
  actionRow: { flexDirection: "row", gap: 10 },
  actionBtn: {
    borderWidth: 1, borderRadius: 12, paddingVertical: 12, alignItems: "center",
  },
  actionBtnText: { fontWeight: "800", fontSize: 14 },
});