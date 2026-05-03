import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert,
  ImageBackground, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ScrollView
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { apiRequest } from "../utils/api";
import { saveAuth } from "../utils/storage";

const ROLE_META: Record<string, { icon: string; color: string; bg: string }> = {
  member:   { icon: "🏋️", color: "#EF233C", bg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  trainer:  { icon: "💪", color: "#3B82F6", bg: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80" },
  supplier: { icon: "📦", color: "#10B981", bg: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80" },
  admin:    { icon: "👑", color: "#F59E0B", bg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80" },
};

export default function Login() {
  const params = useLocalSearchParams();
  const role = String(params.role || "member");
  const meta = ROLE_META[role] || ROLE_META.member;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email.includes("@")) return Alert.alert("Validation", "Enter valid email");
    if (password.length < 6) return Alert.alert("Validation", "Password min 6 characters");
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", "POST", { email, password });
      if (data.user.role !== role) {
        return Alert.alert("Wrong Role", `This account is registered as ${data.user.role}`);
      }
      await saveAuth(data.user);
      const routes: Record<string, string> = {
        member: "/member", trainer: "/trainer", supplier: "/supplier", admin: "/admin",
      };
      router.replace(routes[role] as any);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={{ uri: meta.bg }} style={styles.bg} resizeMode="cover">
      <StatusBar barStyle="light-content" />
      <View style={styles.overlay}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* Back */}
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.roleIcon}>{meta.icon}</Text>
              <Text style={[styles.roleBadge, { color: meta.color }]}>
                {role.toUpperCase()}
              </Text>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.sub}>Sign in to continue</Text>
            </View>

            {/* Form card */}
            <View style={styles.card}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor="#6B7280"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <Text style={[styles.label, { marginTop: 16 }]}>Password</Text>
              <TextInput
                placeholder="Min. 6 characters"
                placeholderTextColor="#6B7280"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />

              <TouchableOpacity
                style={[styles.loginBtn, { backgroundColor: meta.color, opacity: loading ? 0.7 : 1 }]}
                onPress={login}
                disabled={loading}
              >
                <Text style={styles.loginBtnText}>{loading ? "Signing in…" : "Sign In"}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => router.push({ pathname: "/register", params: { role } })}
              >
                <Text style={styles.registerText}>
                  New user? <Text style={{ color: meta.color, fontWeight: "800" }}>Create Account</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(5,7,11,0.72)" },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 20 },
  backText: { color: "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: "700" },
  header: { alignItems: "center", marginBottom: 36 },
  roleIcon: { fontSize: 56, marginBottom: 8 },
  roleBadge: { fontSize: 12, fontWeight: "900", letterSpacing: 4 },
  title: { color: "#FFFFFF", fontSize: 32, fontWeight: "900", marginTop: 8, letterSpacing: -0.5 },
  sub: { color: "rgba(255,255,255,0.5)", fontSize: 15, marginTop: 6 },
  card: {
    backgroundColor: "rgba(17,24,39,0.95)",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  label: { color: "#9CA3AF", fontSize: 13, fontWeight: "700", marginBottom: 8, letterSpacing: 0.5 },
  input: {
    backgroundColor: "#0D1117",
    color: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  loginBtn: {
    padding: 17,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 24,
  },
  loginBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  registerLink: { marginTop: 20, alignItems: "center" },
  registerText: { color: "rgba(255,255,255,0.5)", fontSize: 14 },
});
