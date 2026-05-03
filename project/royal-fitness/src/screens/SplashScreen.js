import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { COLORS } from "../theme/colors";

export default function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ color: COLORS.red, fontSize: 36, fontWeight: "900" }}>
        ROYAL FITNESS
      </Text>
      <Text style={{ color: COLORS.white, marginTop: 10 }}>
        Gym Management System
      </Text>
      <ActivityIndicator color={COLORS.red} size="large" style={{ marginTop: 30 }} />
    </View>
  );
}