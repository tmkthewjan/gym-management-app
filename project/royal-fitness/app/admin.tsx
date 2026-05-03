import { useEffect, useState, useCallback } from "react";
import {
  ScrollView, Text, View, TouchableOpacity, StyleSheet,
  StatusBar, Alert, Modal, TextInput, ActivityIndicator,
  RefreshControl, Image,
} from "react-native";
import { router } from "expo-router";
import { getToken, getUser, clearAuth } from "../utils/storage";
import { apiRequest } from "../utils/api";

// ─── Types ─────────────────────────────────────────────────────────────────────
type Tab = "dashboard" | "members" | "trainers" | "suppliers" | "bookings";
type Member = {
  _id: string;
  status: string;
  membershipType: string;
  fitnessGoal: string;
  user: { _id: string; name: string; email: string; phone: string; profileImage?: string };
};
type Trainer = {
  _id: string; name: string; email: string; phone: string;
  specialization: string; experience: number; available: boolean;
  from: string; to: string; photoUrl?: string;
};
type Supplier = {
  _id: string; name: string; email: string; phone: string;
  companyName: string; supplyType: string; address: string; status: string;
};
type Appointment = {
  _id: string; status: string; date: string; time: string; note?: string;
  member: { name: string; email: string };
  trainer: { name: string; specialization: string; photoUrl?: string };
};
type Stats = {
  totalUsers: number; totalMembers: number; totalTrainers: number;
  totalSuppliers: number; totalAppointments: number;
  activeMembers: number; pendingBookings: number;
};

// ─── Colour tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#0A0C10",
  card: "#111318",
  border: "#1E2128",
  red: "#EF233C",
  blue: "#3B82F6",
  green: "#10B981",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  text: "#F1F5F9",
  muted: "#6B7280",
};

// ─── Reusable helpers ──────────────────────────────────────────────────────────
const Badge = ({ label, color }: { label: string; color: string }) => (
  <View style={{
    backgroundColor: color + "22", paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99, borderWidth: 1, borderColor: color + "44",
  }}>
    <Text style={{ color, fontSize: 11, fontWeight: "800" }}>{label}</Text>
  </View>
);

const Divider = () => <View style={{ height: 1, backgroundColor: C.border }} />;

// ─── Assign Trainer Modal ──────────────────────────────────────────────────────
function AssignTrainerModal({ visible, member, trainers, token, onClose, onSuccess }: any) {
  const [selected, setSelected] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const availableTrainers: Trainer[] = trainers.filter((t: Trainer) => t.available);

  const submit = async () => {
    if (!selected) return Alert.alert("Select Trainer", "Please choose a trainer first");
    setLoading(true);
    try {
      await apiRequest(
        `/admin/members/${member._id}/assign-trainer`,
        "POST",
        { trainerId: selected, date, time, note },
        token
      );
      Alert.alert("✅ Assigned", "Trainer successfully assigned to member");
      setSelected(null);
      setNote("");
      onSuccess();
      onClose();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={m.overlay}>
        <View style={m.sheet}>
          <Text style={m.title}>Assign Trainer</Text>
          <Text style={m.sub}>Member: {member?.user?.name}</Text>

          <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
            {availableTrainers.length === 0 && (
              <Text style={{ color: C.muted, textAlign: "center", padding: 20 }}>
                No trainers available right now
              </Text>
            )}
            {availableTrainers.map((t: Trainer) => (
              <TouchableOpacity
                key={t._id}
                onPress={() => setSelected(t._id)}
                style={[m.trainerRow, selected === t._id && m.trainerRowActive]}
              >
                <Image
                  source={{ uri: t.photoUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                  style={m.trainerAvatar}
                />
                <View style={{ flex: 1 }}>
                  <Text style={m.trainerName}>{t.name}</Text>
                  <Text style={m.trainerSpec}>{t.specialization} · {t.experience}y exp</Text>
                </View>
                {selected === t._id && <Text style={{ color: C.green, fontSize: 18 }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TextInput
            value={date} onChangeText={setDate}
            placeholder="Date (YYYY-MM-DD)" placeholderTextColor={C.muted}
            style={m.input}
          />
          <TextInput
            value={time} onChangeText={setTime}
            placeholder="Time (HH:MM)" placeholderTextColor={C.muted}
            style={m.input}
          />
          <TextInput
            value={note} onChangeText={setNote}
            placeholder="Note (optional)" placeholderTextColor={C.muted}
            style={m.input}
          />

          <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
            <TouchableOpacity onPress={onClose} style={[m.btn, { flex: 1, backgroundColor: C.border }]}>
              <Text style={{ color: C.muted, fontWeight: "800" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={submit} disabled={loading} style={[m.btn, { flex: 2, backgroundColor: C.green }]}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text style={{ color: "#fff", fontWeight: "800" }}>Assign Trainer</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function Admin() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [stats, setStats] = useState<Stats | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [assignModal, setAssignModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  useEffect(() => {
    getToken().then(setToken);
    getUser().then(setAdminUser);
  }, []);

  const load = useCallback(async (t: string | null) => {
    if (!t) return;
    try {
      const [s, mem, tr, sp, ap] = await Promise.all([
        apiRequest("/admin/dashboard",    "GET", undefined, t),
        apiRequest("/admin/members",      "GET", undefined, t),
        apiRequest("/admin/trainers",     "GET", undefined, t),
        apiRequest("/admin/suppliers",    "GET", undefined, t),
        apiRequest("/admin/appointments", "GET", undefined, t),
      ]);
      setStats(s);
      setMembers(mem);
      setTrainers(tr);
      setSuppliers(sp);
      setAppointments(ap);
    } catch (e: any) {
      Alert.alert("Load Error", e.message);
    }
  }, []);

  useEffect(() => { if (token) load(token); }, [token]);

  const refresh = async () => {
    setRefreshing(true);
    await load(token);
    setRefreshing(false);
  };

  const logout = () => {
    Alert.alert("Sign Out", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out", style: "destructive", onPress: async () => {
          await clearAuth();
          router.replace("/");
        },
      },
    ]);
  };

  // ── Action helpers ────────────────────────────────────────────────────────────
  const toggleMemberStatus = async (id: string) => {
    try {
      await apiRequest(`/admin/members/${id}/toggle-status`, "PUT", undefined, token);
      load(token);
    } catch (e: any) { Alert.alert("Error", e.message); }
  };

  const deleteMember = (userId: string, name: string) => {
    Alert.alert("Delete Member", `Remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try { await apiRequest(`/admin/users/${userId}`, "DELETE", undefined, token); load(token); }
          catch (e: any) { Alert.alert("Error", e.message); }
        },
      },
    ]);
  };

  const toggleTrainer = async (id: string) => {
    try {
      await apiRequest(`/admin/trainers/${id}/toggle-availability`, "PUT", undefined, token);
      load(token);
    } catch (e: any) { Alert.alert("Error", e.message); }
  };

  const deleteTrainer = (id: string, name: string) => {
    Alert.alert("Delete Trainer", `Remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try { await apiRequest(`/admin/trainers/${id}`, "DELETE", undefined, token); load(token); }
          catch (e: any) { Alert.alert("Error", e.message); }
        },
      },
    ]);
  };

  const toggleSupplier = async (id: string) => {
    try {
      await apiRequest(`/admin/suppliers/${id}/toggle-status`, "PUT", undefined, token);
      load(token);
    } catch (e: any) { Alert.alert("Error", e.message); }
  };

  const deleteSupplier = (id: string, name: string) => {
    Alert.alert("Delete Supplier", `Remove ${name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          try { await apiRequest(`/admin/suppliers/${id}`, "DELETE", undefined, token); load(token); }
          catch (e: any) { Alert.alert("Error", e.message); }
        },
      },
    ]);
  };

  // ── Tab renderers ─────────────────────────────────────────────────────────────
  const renderDashboard = () => (
    <>
      <View style={s.heroBanner}>
        <View>
          <Text style={s.heroBadge}>ADMIN PANEL</Text>
          <Text style={s.heroName}>Royal Fitness HQ</Text>
          <Text style={s.heroSub}>Welcome back, {adminUser?.name || "Admin"}</Text>
        </View>
        <View style={s.crownBox}>
          <Text style={{ fontSize: 32 }}>👑</Text>
        </View>
      </View>

      <Text style={s.sectionTitle}>Platform Overview</Text>
      <View style={s.statsGrid}>
        {[
          { icon: "👥", label: "Total Users",     value: stats?.totalUsers,       color: C.blue   },
          { icon: "🏋️", label: "Members",          value: stats?.totalMembers,     color: C.red    },
          { icon: "💪", label: "Trainers",         value: stats?.totalTrainers,    color: C.purple },
          { icon: "📦", label: "Suppliers",        value: stats?.totalSuppliers,   color: C.green  },
          { icon: "📋", label: "Bookings",         value: stats?.totalAppointments,color: C.amber  },
          { icon: "✅", label: "Active Members",   value: stats?.activeMembers,    color: C.green  },
          { icon: "⏳", label: "Pending Bookings", value: stats?.pendingBookings,  color: C.amber  },
        ].map((st) => (
          <View key={st.label} style={[s.statCard, { borderTopColor: st.color }]}>
            <Text style={{ fontSize: 22 }}>{st.icon}</Text>
            <Text style={[s.statValue, { color: st.color }]}>{st.value ?? "—"}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </View>

      <Text style={s.sectionTitle}>Quick Actions</Text>
      <View style={s.actionList}>
        {([
          { label: "Manage Members",   icon: "🏋️", color: C.red,    tab: "members"   as Tab },
          { label: "Manage Trainers",  icon: "💪", color: C.purple, tab: "trainers"  as Tab },
          { label: "Manage Suppliers", icon: "📦", color: C.green,  tab: "suppliers" as Tab },
          { label: "All Bookings",     icon: "📋", color: C.amber,  tab: "bookings"  as Tab },
        ]).map((a) => (
          <TouchableOpacity key={a.tab} onPress={() => setTab(a.tab)} style={s.actionRow} activeOpacity={0.7}>
            <View style={[s.actionIconBox, { backgroundColor: a.color + "22" }]}>
              <Text style={{ fontSize: 22 }}>{a.icon}</Text>
            </View>
            <Text style={s.actionLabel}>{a.label}</Text>
            <View style={[s.actionArrow, { backgroundColor: a.color + "22" }]}>
              <Text style={{ color: a.color, fontSize: 20, fontWeight: "900" }}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderMembers = () => (
    <>
      <View style={s.listHeader}>
        <Text style={s.listHeaderTitle}>Members</Text>
        <Badge label={`${members.length} total`} color={C.red} />
      </View>
      {members.length === 0 && <Text style={s.empty}>No members found</Text>}
      {members.map((mem) => (
        <View key={mem._id} style={s.card}>
          <View style={s.cardTop}>
            <Image
              source={{ uri: mem.user?.profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
              style={s.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={s.cardName}>{mem.user?.name}</Text>
              <Text style={s.cardSub}>{mem.user?.email}</Text>
              <Text style={s.cardSub}>{mem.user?.phone}</Text>
            </View>
            <Badge label={mem.status} color={mem.status === "active" ? C.green : C.muted} />
          </View>
          <Divider />
          <View style={s.cardMeta}>
            <Text style={s.metaItem}>📋 {mem.membershipType}</Text>
            <Text style={s.metaItem}>🎯 {mem.fitnessGoal}</Text>
          </View>
          <Divider />
          <View style={s.actionBar}>
            <TouchableOpacity
              style={[s.barBtn, { backgroundColor: C.green + "22", borderColor: C.green + "44" }]}
              onPress={() => { setSelectedMember(mem); setAssignModal(true); }}
            >
              <Text style={{ color: C.green, fontSize: 12, fontWeight: "800" }}>💪 Assign Trainer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.barBtn, { backgroundColor: C.amber + "22", borderColor: C.amber + "44" }]}
              onPress={() => toggleMemberStatus(mem._id)}
            >
              <Text style={{ color: C.amber, fontSize: 12, fontWeight: "800" }}>
                {mem.status === "active" ? "⏸ Deactivate" : "▶ Activate"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.barBtn, { backgroundColor: C.red + "22", borderColor: C.red + "44" }]}
              onPress={() => deleteMember(mem.user._id, mem.user.name)}
            >
              <Text style={{ color: C.red, fontSize: 12, fontWeight: "800" }}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );

  const renderTrainers = () => (
    <>
      <View style={s.listHeader}>
        <Text style={s.listHeaderTitle}>Trainers</Text>
        <Badge label={`${trainers.length} total`} color={C.purple} />
      </View>
      {trainers.length === 0 && <Text style={s.empty}>No trainers found</Text>}
      {trainers.map((t) => (
        <View key={t._id} style={s.card}>
          <View style={s.cardTop}>
            <Image
              source={{ uri: t.photoUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
              style={s.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={s.cardName}>{t.name}</Text>
              <Text style={s.cardSub}>{t.email}</Text>
              <Text style={s.cardSub}>{t.specialization} · {t.experience}y exp</Text>
            </View>
            <Badge label={t.available ? "Available" : "Unavailable"} color={t.available ? C.green : C.muted} />
          </View>
          <Divider />
          <View style={s.cardMeta}>
            <Text style={s.metaItem}>🕐 {t.from} – {t.to}</Text>
            <Text style={s.metaItem}>📞 {t.phone}</Text>
          </View>
          <Divider />
          <View style={s.actionBar}>
            <TouchableOpacity
              style={[s.barBtn, { backgroundColor: C.amber + "22", borderColor: C.amber + "44" }]}
              onPress={() => toggleTrainer(t._id)}
            >
              <Text style={{ color: C.amber, fontSize: 12, fontWeight: "800" }}>
                {t.available ? "⏸ Set Unavailable" : "▶ Set Available"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.barBtn, { backgroundColor: C.red + "22", borderColor: C.red + "44" }]}
              onPress={() => deleteTrainer(t._id, t.name)}
            >
              <Text style={{ color: C.red, fontSize: 12, fontWeight: "800" }}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );

  const renderSuppliers = () => (
    <>
      <View style={s.listHeader}>
        <Text style={s.listHeaderTitle}>Suppliers</Text>
        <Badge label={`${suppliers.length} total`} color={C.green} />
      </View>
      {suppliers.length === 0 && <Text style={s.empty}>No suppliers found</Text>}
      {suppliers.map((sp) => (
        <View key={sp._id} style={s.card}>
          <View style={s.cardTop}>
            <View style={[s.iconAvatar, { backgroundColor: C.green + "22" }]}>
              <Text style={{ fontSize: 22 }}>📦</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.cardName}>{sp.name}</Text>
              <Text style={s.cardSub}>{sp.companyName}</Text>
              <Text style={s.cardSub}>{sp.email}</Text>
            </View>
            <Badge label={sp.status} color={sp.status === "active" ? C.green : C.muted} />
          </View>
          <Divider />
          <View style={s.cardMeta}>
            <Text style={s.metaItem}>🏷 {sp.supplyType}</Text>
            <Text style={s.metaItem}>📍 {sp.address}</Text>
          </View>
          <Divider />
          <View style={s.actionBar}>
            <TouchableOpacity
              style={[s.barBtn, { backgroundColor: C.amber + "22", borderColor: C.amber + "44" }]}
              onPress={() => toggleSupplier(sp._id)}
            >
              <Text style={{ color: C.amber, fontSize: 12, fontWeight: "800" }}>
                {sp.status === "active" ? "⏸ Deactivate" : "▶ Activate"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.barBtn, { backgroundColor: C.red + "22", borderColor: C.red + "44" }]}
              onPress={() => deleteSupplier(sp._id, sp.name)}
            >
              <Text style={{ color: C.red, fontSize: 12, fontWeight: "800" }}>🗑 Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </>
  );

  const renderBookings = () => (
    <>
      <View style={s.listHeader}>
        <Text style={s.listHeaderTitle}>All Bookings</Text>
        <Badge label={`${appointments.length} total`} color={C.amber} />
      </View>
      {appointments.length === 0 && <Text style={s.empty}>No appointments found</Text>}
      {appointments.map((ap) => {
        const color = ap.status === "Approved" ? C.green : ap.status === "Rejected" ? C.red : C.amber;
        return (
          <View key={ap._id} style={s.card}>
            <View style={s.cardTop}>
              <Image
                source={{ uri: ap.trainer?.photoUrl || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                style={s.avatar}
              />
              <View style={{ flex: 1 }}>
                <Text style={s.cardName}>{ap.member?.name}</Text>
                <Text style={s.cardSub}>→ Coach {ap.trainer?.name}</Text>
                <Text style={s.cardSub}>{ap.trainer?.specialization}</Text>
              </View>
              <Badge label={ap.status} color={color} />
            </View>
            <Divider />
            <View style={s.cardMeta}>
              <Text style={s.metaItem}>📅 {ap.date}</Text>
              <Text style={s.metaItem}>🕐 {ap.time}</Text>
              {ap.note ? <Text style={s.metaItem}>📝 {ap.note}</Text> : null}
            </View>
          </View>
        );
      })}
    </>
  );

  // ── Root render ───────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Top bar */}
      <View style={s.topBar}>
        {/* ── BACK BUTTON ── */}
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={{ color: C.text, fontSize: 20, fontWeight: "900" }}>‹</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={s.topBarBrand}>ROYAL FITNESS</Text>
          <Text style={s.topBarRole}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity onPress={logout} style={s.logoutBtn}>
          <Text style={{ color: C.red, fontSize: 13, fontWeight: "800" }}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Tab bar */}
      <View style={s.tabBar}>
        {([
          { key: "dashboard" as Tab, icon: "🏠", label: "Home"      },
          { key: "members"   as Tab, icon: "🏋️", label: "Members"   },
          { key: "trainers"  as Tab, icon: "💪", label: "Trainers"  },
          { key: "suppliers" as Tab, icon: "📦", label: "Suppliers" },
          { key: "bookings"  as Tab, icon: "📋", label: "Bookings"  },
        ]).map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            style={[s.tabItem, tab === t.key && s.tabItemActive]}
          >
            <Text style={{ fontSize: 16 }}>{t.icon}</Text>
            <Text style={[s.tabLabel, tab === t.key && s.tabLabelActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={C.red} />
        }
      >
        {tab === "dashboard" && renderDashboard()}
        {tab === "members"   && renderMembers()}
        {tab === "trainers"  && renderTrainers()}
        {tab === "suppliers" && renderSuppliers()}
        {tab === "bookings"  && renderBookings()}
      </ScrollView>

      {/* Assign Trainer bottom-sheet modal */}
      {selectedMember && (
        <AssignTrainerModal
          visible={assignModal}
          member={selectedMember}
          trainers={trainers}
          token={token}
          onClose={() => { setAssignModal(false); setSelectedMember(null); }}
          onSuccess={() => load(token)}
        />
      )}
    </View>
  );
}

// ─── Screen styles ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  topBar: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: C.card, paddingHorizontal: 18,
    paddingTop: 54, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  topBarBrand: { color: C.red, fontSize: 11, fontWeight: "900", letterSpacing: 3 },
  topBarRole:  { color: C.text, fontSize: 16, fontWeight: "900", marginTop: 2 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.border, justifyContent: "center", alignItems: "center",
    marginRight: 12,
  },
  logoutBtn: {
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: C.red + "22", borderRadius: 10,
    borderWidth: 1, borderColor: C.red + "44",
  },

  tabBar: { flexDirection: "row", backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  tabItem: { flex: 1, alignItems: "center", paddingVertical: 10, gap: 2 },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: C.red },
  tabLabel: { color: C.muted, fontSize: 9, fontWeight: "700" },
  tabLabelActive: { color: C.red },

  heroBanner: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: C.card, borderRadius: 20, padding: 20, marginBottom: 20,
    borderWidth: 1, borderColor: C.border,
  },
  heroBadge: { color: C.red, fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  heroName:  { color: C.text, fontSize: 22, fontWeight: "900", marginTop: 4 },
  heroSub:   { color: C.muted, fontSize: 13, marginTop: 4 },
  crownBox: {
    width: 58, height: 58, borderRadius: 18,
    backgroundColor: "#1C1A0A", justifyContent: "center", alignItems: "center",
  },

  sectionTitle: { color: C.text, fontSize: 16, fontWeight: "900", marginBottom: 12, marginTop: 4 },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  statCard: {
    width: "30%", flexGrow: 1, backgroundColor: C.card, borderRadius: 16, padding: 14,
    alignItems: "center", borderTopWidth: 3, borderWidth: 1, borderColor: C.border,
  },
  statValue: { fontSize: 22, fontWeight: "900", marginTop: 6 },
  statLabel: { color: C.muted, fontSize: 10, fontWeight: "700", marginTop: 4, textAlign: "center" },

  actionList: {
    backgroundColor: C.card, borderRadius: 20, overflow: "hidden",
    borderWidth: 1, borderColor: C.border, marginBottom: 8,
  },
  actionRow: {
    flexDirection: "row", alignItems: "center", padding: 16,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  actionIconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", marginRight: 14 },
  actionLabel:   { flex: 1, color: C.text, fontSize: 15, fontWeight: "800" },
  actionArrow:   { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center" },

  listHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  listHeaderTitle: { color: C.text, fontSize: 18, fontWeight: "900" },

  card: {
    backgroundColor: C.card, borderRadius: 18, marginBottom: 14,
    borderWidth: 1, borderColor: C.border, overflow: "hidden",
  },
  cardTop:  { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  avatar:   { width: 46, height: 46, borderRadius: 23, backgroundColor: C.border },
  iconAvatar: { width: 46, height: 46, borderRadius: 23, justifyContent: "center", alignItems: "center" },
  cardName: { color: C.text, fontSize: 15, fontWeight: "900" },
  cardSub:  { color: C.muted, fontSize: 12, marginTop: 2 },
  cardMeta: { flexDirection: "row", flexWrap: "wrap", padding: 12, gap: 10 },
  metaItem: { color: C.muted, fontSize: 12, fontWeight: "700" },

  actionBar: { flexDirection: "row", padding: 10, gap: 8, flexWrap: "wrap" },
  barBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },

  empty: { color: C.muted, textAlign: "center", paddingVertical: 40, fontSize: 14 },
});

// ─── Modal styles ──────────────────────────────────────────────────────────────
const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 40, borderTopWidth: 1, borderColor: C.border,
  },
  title: { color: C.text, fontSize: 20, fontWeight: "900", marginBottom: 4 },
  sub:   { color: C.muted, fontSize: 13, marginBottom: 16 },
  trainerRow: {
    flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 14,
    marginBottom: 8, backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, gap: 12,
  },
  trainerRowActive: { borderColor: C.green, backgroundColor: C.green + "11" },
  trainerAvatar:    { width: 40, height: 40, borderRadius: 20, backgroundColor: C.border },
  trainerName:      { color: C.text, fontSize: 14, fontWeight: "800" },
  trainerSpec:      { color: C.muted, fontSize: 12, marginTop: 2 },
  input: {
    backgroundColor: C.bg, color: C.text, borderWidth: 1, borderColor: C.border,
    borderRadius: 12, padding: 13, marginBottom: 10, fontSize: 14,
  },
  btn: { padding: 14, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});