import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet, StatusBar, Alert, Image } from "react-native";
import { router } from "expo-router";
import { getUser } from "../utils/storage";

const GOALS = ["Muscle Gain", "Fat Loss", "Endurance", "Flexibility", "General Fitness"];
const MEMBERSHIPS = ["Monthly", "Quarterly", "Semi-Annual", "Annual"];

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    weight: "",
    height: "",
    goal: "General Fitness",
    membership: "Monthly",
    joinDate: "",
    profileImage: "",
  });

  useEffect(() => {
    getUser().then((u) => {
      if (u) {
        setForm((prev) => ({
          ...prev,
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          profileImage: u.profileImage || "",
          joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
        }));
        setSelectedGoal(u.fitnessGoal || "General Fitness");
        setSelectedMembership(u.membershipType || "Monthly");
      }
    });
  }, []);

  const [selectedGoal, setSelectedGoal] = useState(form.goal);
  const [selectedMembership, setSelectedMembership] = useState(form.membership);

  const save = () => {
    setForm((p) => ({ ...p, goal: selectedGoal, membership: selectedMembership }));
    setEditing(false);
    Alert.alert("✅ Saved", "Your profile has been updated");
  };

  const Field = ({ label, value, key: k, icon }: any) => (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{icon} {label}</Text>
      {editing ? (
        <TextInput
          value={value}
          onChangeText={(v) => setForm((p) => ({ ...p, [k]: v }))}
          style={styles.fieldInput}
          placeholderTextColor="#9CA3AF"
        />
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => editing ? save() : setEditing(true)} style={styles.editBtn}>
          <Text style={styles.editBtnText}>{editing ? "Save" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarWrap}>
          <Image source={{ uri: form.profileImage?.trim() ? form.profileImage : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }} style={styles.avatar} />
          {editing && (
            <TouchableOpacity style={styles.cameraBtn}>
              <Text style={{ fontSize: 16 }}>📷</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.profileName}>{form.name}</Text>
        <View style={styles.memberBadge}>
          <Text style={styles.memberBadgeText}>🏅 {form.membership} Member</Text>
        </View>
        <Text style={styles.joinDate}>Member since {form.joinDate}</Text>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        {[
          { label: "Weight", value: `${form.weight} kg`, color: "#EF233C" },
          { label: "Height", value: `${form.height} cm`, color: "#3B82F6" },
          { label: "Age", value: `${form.age} yrs`, color: "#10B981" },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Personal Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        <Field label="Full Name" value={form.name} k="name" icon="👤" />
        <Field label="Email" value={form.email} k="email" icon="📧" />
        <Field label="Phone" value={form.phone} k="phone" icon="📱" />
        <Field label="Age" value={form.age} k="age" icon="🎂" />
      </View>

      {/* Body Metrics */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Body Metrics</Text>
        <Field label="Weight (kg)" value={form.weight} k="weight" icon="⚖️" />
        <Field label="Height (cm)" value={form.height} k="height" icon="📏" />
      </View>

      {/* Fitness Goal */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Fitness Goal</Text>
        <View style={styles.chipRow}>
          {GOALS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, selectedGoal === g && styles.chipActive]}
              onPress={() => editing && setSelectedGoal(g)}
              disabled={!editing}
            >
              <Text style={[styles.chipText, selectedGoal === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Membership */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Membership Plan</Text>
        <View style={styles.chipRow}>
          {MEMBERSHIPS.map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.chip, selectedMembership === m && styles.chipActive]}
              onPress={() => editing && setSelectedMembership(m)}
              disabled={!editing}
            >
              <Text style={[styles.chipText, selectedMembership === m && styles.chipTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {editing && (
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          <TouchableOpacity style={styles.saveBtn} onPress={save}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
  },
  backBtn: { padding: 4 },
  backText: { color: "#EF233C", fontSize: 16, fontWeight: "800" },
  headerTitle: { color: "#111827", fontSize: 17, fontWeight: "900" },
  editBtn: {
    backgroundColor: "#EF233C", paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 20,
  },
  editBtnText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

  avatarSection: { backgroundColor: "#FFFFFF", alignItems: "center", paddingBottom: 24, marginBottom: 12 },
  avatarWrap: { position: "relative" },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: "#EF233C" },
  cameraBtn: {
    position: "absolute", bottom: 0, right: 0,
    backgroundColor: "#FFFFFF", borderRadius: 14, padding: 5,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  profileName: { color: "#111827", fontSize: 22, fontWeight: "900", marginTop: 12 },
  memberBadge: { backgroundColor: "#FFF7ED", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginTop: 8 },
  memberBadgeText: { color: "#F59E0B", fontSize: 12, fontWeight: "800" },
  joinDate: { color: "#9CA3AF", fontSize: 12, marginTop: 6 },

  statsBar: {
    flexDirection: "row", backgroundColor: "#FFFFFF",
    marginHorizontal: 12, borderRadius: 20, padding: 16, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "900" },
  statLabel: { color: "#9CA3AF", fontSize: 11, fontWeight: "700", marginTop: 3 },

  card: {
    backgroundColor: "#FFFFFF", marginHorizontal: 12, borderRadius: 20,
    padding: 20, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  cardTitle: { color: "#111827", fontSize: 16, fontWeight: "900", marginBottom: 16 },

  field: { marginBottom: 16 },
  fieldLabel: { color: "#9CA3AF", fontSize: 12, fontWeight: "700", marginBottom: 6 },
  fieldValue: { color: "#111827", fontSize: 15, fontWeight: "700" },
  fieldInput: {
    backgroundColor: "#F9FAFB", color: "#111827",
    padding: 13, borderRadius: 12, fontSize: 14,
    borderWidth: 1, borderColor: "#E5E7EB",
  },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: "#F3F4F6", borderWidth: 1, borderColor: "#E5E7EB",
  },
  chipActive: { backgroundColor: "#FFF5F5", borderColor: "#EF233C" },
  chipText: { color: "#6B7280", fontSize: 13, fontWeight: "700" },
  chipTextActive: { color: "#EF233C" },

  saveBtn: { backgroundColor: "#EF233C", padding: 16, borderRadius: 16, alignItems: "center" },
  saveBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 15 },
  cancelBtn: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 16, alignItems: "center", borderWidth: 1, borderColor: "#E5E7EB" },
  cancelBtnText: { color: "#6B7280", fontWeight: "800", fontSize: 15 },
});
