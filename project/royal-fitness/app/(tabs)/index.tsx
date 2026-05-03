import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, StatusBar } from "react-native";
import { router } from "expo-router";

export default function GetStarted() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" }}
        style={styles.bg}
        resizeMode="cover"
      >
        {/* Dark overlay gradient via nested View */}
        <View style={styles.overlay}>
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoBlock}>
              <Text style={styles.logoIcon}>⚡</Text>
              <Text style={styles.brand}>ROYAL FITNESS</Text>
              <View style={styles.redLine} />
            </View>

            {/* Hero text */}
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Transform{"\n"}Your Body.</Text>
              <Text style={styles.heroSub}>
                Track workouts, book trainers, manage nutrition — all in one place.
              </Text>
            </View>

            {/* CTA */}
            <View style={styles.ctaBlock}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.push("/role")}
              >
                <Text style={styles.primaryBtnText}>Get Started</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => router.push({ pathname: "/login", params: { role: "member" } })}
              >
                <Text style={styles.secondaryBtnText}>I already have an account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070B" },
  bg: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5,7,11,0.55)",
    justifyContent: "flex-end",
  },
  content: { padding: 28, paddingBottom: 52 },
  logoBlock: { alignItems: "center", marginBottom: 40 },
  logoIcon: { fontSize: 42 },
  brand: {
    color: "#EF233C",
    fontSize: 13,
    letterSpacing: 6,
    fontWeight: "900",
    marginTop: 6,
  },
  redLine: { width: 40, height: 3, backgroundColor: "#EF233C", borderRadius: 2, marginTop: 8 },
  heroText: { marginBottom: 40 },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 54,
    fontWeight: "900",
    lineHeight: 58,
    letterSpacing: -1,
  },
  heroSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 16,
    marginTop: 14,
    lineHeight: 24,
  },
  ctaBlock: { gap: 14 },
  primaryBtn: {
    backgroundColor: "#EF233C",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    padding: 16,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  secondaryBtnText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    fontWeight: "700",
  },
});
