import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveAuth = async (user: any) => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
  await AsyncStorage.setItem("token", user.token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("token");
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const clearAuth = async () => {
  await AsyncStorage.clear();
};