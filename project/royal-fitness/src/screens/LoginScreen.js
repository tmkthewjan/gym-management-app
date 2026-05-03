import React, { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { COLORS } from "../theme/colors";

export default function LoginScreen({ navigation, route }) {
  const selectedRole = route.params?.role || "member";
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");

  const handleLogin = async () => {
    if (!email.includes("@")) return Alert.alert("Validation", "Enter valid email");
    if (password.length < 6) return Alert.alert("Validation", "Password minimum 6 characters");

    try {
      const user = await login(email, password);

      if (user.role !== selectedRole) {
        return Alert.alert("Wrong Role", `This account is ${user.role}, not ${selectedRole}`);
      }
    } catch (error) {
      Alert.alert("Login Failed", error.response?.data?.message || "Backend not connected");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: "center", padding: 24 }}>
      <Text style={{ color: COLORS.red, fontSize: 32, fontWeight: "900", textAlign: "center" }}>
        {selectedRole.toUpperCase()} LOGIN
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor={COLORS.gray}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={input}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={COLORS.gray}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={input}
      />

      <TouchableOpacity onPress={handleLogin} style={button}>
        <Text style={buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register", { role: selectedRole })}>
        <Text style={{ color: COLORS.blue, textAlign: "center", marginTop: 20 }}>
          New user? Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const input = {
  backgroundColor: COLORS.card,
  color: COLORS.white,
  padding: 16,
  borderRadius: 14,
  marginTop: 16,
};

const button = {
  backgroundColor: COLORS.red,
  padding: 16,
  borderRadius: 14,
  marginTop: 22,
};

const buttonText = {
  color: COLORS.white,
  textAlign: "center",
  fontWeight: "800",
};