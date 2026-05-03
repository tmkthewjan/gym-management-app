import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { apiRequest } from "../utils/api";
import { getToken, getUser, clearAuth } from "../utils/storage";

export default function Trainer() {
  const [requests, setRequests] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  const loadRequests = async () => {
    try {
      const token = await getToken();
      const data = await apiRequest("/appointments/trainer", "GET", undefined, token);
      setRequests(Array.isArray(data) ? data : []);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Cannot load appointments");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = await getToken();
      await apiRequest(`/appointments/${id}/status`, "PUT", { status }, token);
      Alert.alert("Updated", `Appointment ${status}`);
      loadRequests();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const logout = async () => {
    await clearAuth();
    router.replace("/");
  };

  useEffect(() => {
    loadRequests();
    getUser().then(setUser);
  }, []);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === "Pending"),
    [requests]
  );

  const approvedRequests = useMemo(
    () => requests.filter((r) => r.status === "Approved"),
    [requests]
  );

  const rejectedRequests = useMemo(
    () => requests.filter((r) => r.status === "Rejected"),
    [requests]
  );

  const displayed = activeTab === "pending" ? pendingRequests : approvedRequests;

  const photo =
    user?.profileImage && user.profileImage.trim() !== ""
      ? user.profileImage
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>Coach {user?.name || "Trainer"}</Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/profile" as any)}>
          <Image source={{ uri: photo }} style={styles.avatar} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View>
          <Text style={styles.profileTitle}>Trainer Profile</Text>
          <Text style={styles.profileSub}>{user?.email || "trainer@gym.com"}</Text>
          <Text style={styles.profileSub}>Role: {user?.role || "trainer"}</Text>
        </View>
        <Text style={styles.profileIcon}>💪</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBox title="New Requests" value={pendingRequests.length} color="#2563EB" />
        <StatBox title="Approved" value={approvedRequests.length} color="#10B981" />
        <StatBox title="Rejected" value={rejectedRequests.length} color="#EF233C" />
      </View>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Appointment Alerts</Text>
        <Text style={styles.noticeText}>
          {pendingRequests.length > 0
            ? `You have ${pendingRequests.length} new appointment request(s).`
            : "No new appointment requests right now."}
        </Text>
      </View>

      <View style={styles.tabWrap}>
        <TouchableOpacity
          onPress={() => setActiveTab("pending")}
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "pending" && styles.activeTabText,
            ]}
          >
            New Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("approved")}
          style={[styles.tab, activeTab === "approved" && styles.activeTab]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "approved" && styles.activeTabText,
            ]}
          >
            Accepted
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>
        {activeTab === "pending" ? "Pending Appointments" : "Accepted Appointments"}
      </Text>

      {displayed.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            {activeTab === "pending" ? "📭" : "✅"}
          </Text>
          <Text style={styles.emptyText}>
            {activeTab === "pending"
              ? "No new appointment requests"
              : "No accepted appointments yet"}
          </Text>
        </View>
      )}

      {displayed.map((item) => (
        <View key={item._id} style={styles.requestCard}>
          <View style={styles.requestTop}>
            <Image
              source={{
                uri:
                  item.member?.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={styles.memberAvatar}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.memberName}>{item.member?.name || "Member"}</Text>
              <Text style={styles.memberEmail}>{item.member?.email || "No email"}</Text>
            </View>

            <View
              style={[
                styles.statusPill,
                item.status === "Approved"
                  ? { backgroundColor: "#DCFCE7" }
                  : { backgroundColor: "#FEF3C7" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  item.status === "Approved"
                    ? { color: "#16A34A" }
                    : { color: "#B45309" },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <View style={styles.detailBox}>
            <Text style={styles.detail}>📅 Date: {item.date}</Text>
            <Text style={styles.detail}>⏰ Time: {item.time}</Text>
            <Text style={styles.detail}>📝 Note: {item.note || "Training session"}</Text>
          </View>

          {activeTab === "pending" && (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => updateStatus(item._id, "Approved")}
              >
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => updateStatus(item._id, "Rejected")}
              >
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}

          {activeTab === "approved" && (
            <TouchableOpacity style={styles.sessionBtn}>
              <Text style={styles.sessionText}>Session Accepted</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <View style={styles.scheduleCard}>
        <Text style={styles.sectionTitle}>Today Plan</Text>

        {["Warm-up session", "Strength coaching", "Cardio guidance"].map((x, i) => (
          <View key={x} style={styles.scheduleRow}>
            <View style={styles.dot} />
            <View>
              <Text style={styles.scheduleTitle}>{x}</Text>
              <Text style={styles.scheduleTime}>{9 + i}:00 AM</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatBox({ title, value, color }: any) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F4F5FA",
    padding: 20,
  },
  header: {
    marginTop: 55,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: "#6B7280",
    fontSize: 14,
  },
  name: {
    color: "#111827",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 4,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: "#2563EB",
  },
  profileCard: {
    marginTop: 22,
    backgroundColor: "#111827",
    borderRadius: 28,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
  },
  profileSub: {
    color: "#9CA3AF",
    marginTop: 6,
  },
  profileIcon: {
    fontSize: 42,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 22,
    alignItems: "center",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "900",
  },
  statTitle: {
    color: "#6B7280",
    fontSize: 11,
    textAlign: "center",
    fontWeight: "800",
    marginTop: 5,
  },
  noticeCard: {
    backgroundColor: "#DBEAFE",
    padding: 18,
    borderRadius: 22,
    marginTop: 18,
  },
  noticeTitle: {
    color: "#1E3A8A",
    fontSize: 18,
    fontWeight: "900",
  },
  noticeText: {
    color: "#1D4ED8",
    marginTop: 6,
    fontWeight: "700",
  },
  tabWrap: {
    backgroundColor: "#FFFFFF",
    padding: 6,
    borderRadius: 20,
    flexDirection: "row",
    marginTop: 22,
  },
  tab: {
    flex: 1,
    padding: 13,
    borderRadius: 16,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#2563EB",
  },
  tabText: {
    color: "#6B7280",
    fontWeight: "900",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 24,
    marginBottom: 14,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 30,
    borderRadius: 24,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 42,
  },
  emptyText: {
    color: "#6B7280",
    fontWeight: "800",
    marginTop: 8,
  },
  requestCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 18,
    marginBottom: 15,
  },
  requestTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  memberName: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },
  memberEmail: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 3,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "900",
  },
  detailBox: {
    marginTop: 15,
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    padding: 14,
  },
  detail: {
    color: "#374151",
    marginBottom: 5,
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: "#DCFCE7",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: "#FEE2E2",
    padding: 14,
    borderRadius: 15,
    alignItems: "center",
  },
  approveText: {
    color: "#16A34A",
    fontWeight: "900",
  },
  rejectText: {
    color: "#DC2626",
    fontWeight: "900",
  },
  sessionBtn: {
    backgroundColor: "#DCFCE7",
    padding: 14,
    borderRadius: 15,
    marginTop: 15,
  },
  sessionText: {
    color: "#16A34A",
    textAlign: "center",
    fontWeight: "900",
  },
  scheduleCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 26,
    marginTop: 10,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#2563EB",
  },
  scheduleTitle: {
    color: "#111827",
    fontWeight: "900",
  },
  scheduleTime: {
    color: "#6B7280",
    marginTop: 3,
  },
  logoutBtn: {
    backgroundColor: "#EF233C",
    padding: 16,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "900",
  },
});