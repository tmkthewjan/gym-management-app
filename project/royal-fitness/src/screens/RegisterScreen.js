import React, { useContext, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";

export default function RegisterScreen({ navigation, route }) {
  const role = route.params?.role || "member";
  const { register } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "123456",
    role,
  });

  const handleRegister = async () => {
    if (form.name.trim().length < 3) return Alert.alert("Validation", "Name minimum 3 characters");
    if (!form.email.includes("@")) return Alert.alert("Validation", "Enter valid email");
    if (!/^0\d{9}$/.test(form.phone)) return Alert.alert("Validation", "Phone must be 10 digits and start with 0");
    if (form.password.length < 6) return Alert.alert("Validation", "Password minimum 6 characters");

    try {
      await register(form);
      Alert.alert("Success", "Account created successfully");
      navigation.navigate("Login", { role });
    } catch (error) {
      Alert.alert("Register Failed", error.response?.data?.message || "Backend error");
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg, padding: 24 }}>
      <Text style={{ color: COLORS.red, fontSize: 30, fontWeight: "900", textAlign: "center", marginTop: 70 }}>
        {role.toUpperCase()} REGISTER
      </Text>

      {["name", "email", "phone", "password"].map((field) => (
        <TextInput
          key={field}
          placeholder={field.toUpperCase()}
          placeholderTextColor={COLORS.gray}
          value={form[field]}
          secureTextEntry={field === "password"}
          autoCapitalize="none"
          onChangeText={(v) => setForm({ ...form, [field]: v })}
          style={{
            backgroundColor: COLORS.card,
            color: COLORS.white,
            padding: 16,
            borderRadius: 14,
            marginTop: 15,
          }}
        />
      ))}

      <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: COLORS.red, padding: 16, borderRadius: 14, marginTop: 25 }}>
        <Text style={{ color: COLORS.white, textAlign: "center", fontWeight: "800" }}>
          Create Account
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}