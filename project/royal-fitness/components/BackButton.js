import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../theme/colors";

export default function BackButton({ navigation, label = "Back" }) {
  return (
    <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
      <Text style={styles.arrow}>←</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLORS.card2,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 20,
    gap: 6,
  },
  arrow: { color: COLORS.blue, fontSize: 16, fontWeight: "700" },
  label: { color: COLORS.grayLight, fontSize: 14, fontWeight: "600" },
});