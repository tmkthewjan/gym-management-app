import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../theme/colors";

export default function RoleScreen({ navigation }) {
  const roles = ["member", "trainer", "supplier", "admin"];

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", padding: 24 }}>
      <Text style={{ color: COLORS.red, fontSize: 36, fontWeight: "900", textAlign: "center" }}>
        ROYAL FITNESS
      </Text>

      <Text style={{ color: COLORS.white, fontSize: 24, fontWeight: "800", textAlign: "center", marginVertical: 30 }}>
        Select Your Role
      </Text>

      {roles.map((role) => (
        <TouchableOpacity
          key={role}
          onPress={() => navigation.navigate("Login", { role })}
          style={{ backgroundColor: COLORS.card, padding: 20, borderRadius: 18, marginBottom: 15 }}
        >
          <Text style={{ color: COLORS.red, fontSize: 18, fontWeight: "800", textAlign: "center" }}>
            {role.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}