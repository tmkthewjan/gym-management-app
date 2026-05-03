import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { clearAuth, getToken, getUser } from "../utils/storage";
import { apiRequest } from "../utils/api";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const today = new Date().getDay();

function StatCard({ icon, label, value, unit, percent, color }: any) {
  return (
    <View style={[styles.statCard, { flex: 1 }]}>
      <View style={styles.statTop}>
        <View style={[styles.statIconBox, { backgroundColor: color + "22" }]}>
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.expandIcon}>⤢</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>

      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${percent}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

export default function Member() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  const loadMemberData = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const myBookings = await apiRequest(
        "/appointments/my",
        "GET",
        undefined,
        token
      );

      const myOrders = await apiRequest(
        "/orders/my",
        "GET",
        undefined,
        token
      );

      setBookings(Array.isArray(myBookings) ? myBookings : []);
      setOrders(Array.isArray(myOrders) ? myOrders : []);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Cannot load dashboard data");
    }
  };

  useEffect(() => {
    getUser().then(setUser);
    loadMemberData();
  }, []);

  const logout = async () => {
    await clearAuth();
    router.replace("/");
  };

  const currentDay = new Date().getDate();

  return (
    <ScrollView
      style={styles.page}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: user?.profileImage?.trim()
                ? user.profileImage
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.name}>{user?.name || "Member"}</Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={{ fontSize: 20 }}>💬</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Your Weekly Progress</Text>
          <Text style={styles.kcalBadge}>1.5K kcal</Text>
        </View>

        <View style={styles.calStrip}>
          {DAYS.map((day, i) => (
            <View
              key={day}
              style={[styles.dayCol, i === today && styles.dayColActive]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  i === today && styles.dayLabelActive,
                ]}
              >
                {day}
              </Text>
              <Text
                style={[
                  styles.dayNum,
                  i === today && styles.dayNumActive,
                ]}
              >
                {currentDay - today + i}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.row}>
        <StatCard
          icon="👟"
          label="Steps"
          value="3,466"
          unit="/ 5,000"
          percent={69}
          color="#F59E0B"
        />
        <StatCard
          icon="🌙"
          label="Sleep"
          value="6h 45m"
          unit="/ 8h 50m"
          percent={76}
          color="#3B82F6"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Booked Sessions</Text>
          <TouchableOpacity onPress={() => router.push("/trainers" as any)}>
            <Text style={styles.seeAll}>Book More</Text>
          </TouchableOpacity>
        </View>

        {bookings.length === 0 ? (
          <View style={styles.emptySmall}>
            <Text style={styles.emptySmallText}>
              No trainer sessions booked yet.
            </Text>
          </View>
        ) : (
          bookings.map((b) => (
            <View key={b._id} style={styles.bookingCard}>
              <View style={styles.bookingTop}>
                <Text style={styles.bookingTitle}>
                  💪 {b.trainer?.name || "Trainer Session"}
                </Text>
                <Text
                  style={[
                    styles.statusBadge,
                    {
                      color:
                        b.status === "Approved"
                          ? "#10B981"
                          : b.status === "Rejected"
                          ? "#EF233C"
                          : "#F59E0B",
                    },
                  ]}
                >
                  {b.status || "Pending"}
                </Text>
              </View>

              <Text style={styles.bookingMeta}>📅 Date: {b.date}</Text>
              <Text style={styles.bookingMeta}>⏰ Time: {b.time}</Text>
              <Text style={styles.bookingMeta}>
                📝 {b.note || "Training session"}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Supplement Orders</Text>
          <TouchableOpacity onPress={() => router.push("/supplements" as any)}>
            <Text style={styles.seeAll}>Buy More</Text>
          </TouchableOpacity>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptySmall}>
            <Text style={styles.emptySmallText}>
              No supplements purchased yet.
            </Text>
          </View>
        ) : (
          orders.map((o) => (
            <View key={o._id} style={styles.bookingCard}>
              <View style={styles.bookingTop}>
                <Text style={styles.bookingTitle}>
                  💊 {o.supplement?.name || "Supplement"}
                </Text>
                <Text style={[styles.statusBadge, { color: "#F59E0B" }]}>
                  {o.status || "Pending"}
                </Text>
              </View>

              <Text style={styles.bookingMeta}>Qty: {o.quantity}</Text>
              <Text style={styles.bookingMeta}>Total: Rs. {o.totalPrice}</Text>
              <Text style={styles.bookingMeta}>
                📅 {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>

        <View style={styles.menuGrid}>
          {[
            { title: "Book Trainer", icon: "💪", path: "/trainers", color: "#3B82F6" },
            { title: "Attendance", icon: "📋", path: "/attendance", color: "#10B981" },
            { title: "Supplements", icon: "💊", path: "/supplements", color: "#8B5CF6" },
            { title: "My Orders", icon: "📦", path: "/orders", color: "#F59E0B" },
            { title: "My Profile", icon: "👤", path: "/profile", color: "#EF233C" },
            { title: "Feedback", icon: "💬", path: "/feedback", color: "#EC4899" },
          ].map((item) => (
            <TouchableOpacity
              key={item.title}
              style={styles.menuCard}
              onPress={() => router.push(item.path as any)}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + "22" }]}>
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#EF233C",
  },
  greeting: { color: "#9CA3AF", fontSize: 13 },
  name: { color: "#111827", fontSize: 18, fontWeight: "900" },
  headerRight: { flexDirection: "row", gap: 8 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  section: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    padding: 20,
    marginHorizontal: 0,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { color: "#111827", fontSize: 17, fontWeight: "900" },
  kcalBadge: { color: "#9CA3AF", fontSize: 13, fontWeight: "700" },
  seeAll: { color: "#3B82F6", fontSize: 13, fontWeight: "700" },

  calStrip: { flexDirection: "row", justifyContent: "space-between" },
  dayCol: {
    alignItems: "center",
    padding: 8,
    borderRadius: 14,
    minWidth: 42,
  },
  dayColActive: { backgroundColor: "#EF233C" },
  dayLabel: { color: "#9CA3AF", fontSize: 11, fontWeight: "700" },
  dayLabelActive: { color: "#FFFFFF" },
  dayNum: { color: "#111827", fontSize: 15, fontWeight: "900", marginTop: 4 },
  dayNumActive: { color: "#FFFFFF" },

  row: { flexDirection: "row", gap: 12, marginTop: 12, marginHorizontal: 12 },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  expandIcon: { color: "#9CA3AF", fontSize: 14 },
  statLabel: { color: "#6B7280", fontSize: 12, fontWeight: "700" },
  statValue: { color: "#111827", fontSize: 22, fontWeight: "900", marginTop: 4 },
  statUnit: { color: "#9CA3AF", fontSize: 12, marginTop: 2 },
  progressBg: {
    height: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    marginTop: 12,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 3 },

  bookingCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bookingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookingTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
    flex: 1,
  },
  bookingMeta: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 7,
    fontWeight: "700",
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: "900",
  },
  emptySmall: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptySmallText: {
    color: "#9CA3AF",
    fontWeight: "800",
    textAlign: "center",
  },

  menuGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 4 },
  menuCard: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  menuTitle: {
    color: "#374151",
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },

  logoutBtn: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  logoutText: { color: "#EF233C", fontWeight: "900", fontSize: 15 },
});