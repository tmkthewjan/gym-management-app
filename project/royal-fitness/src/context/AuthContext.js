import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const userData = res.data.user;

    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await AsyncStorage.setItem("token", userData.token);

    setUser(userData);
    setToken(userData.token);

    return userData;
  };

  const register = async (data) => {
    const res = await API.post("/auth/register", data);
    return res.data;
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setToken(null);
  };

  const loadSavedUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");
      const savedToken = await AsyncStorage.getItem("token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}