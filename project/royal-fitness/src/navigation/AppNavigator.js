import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthContext } from "../context/AuthContext";

import SplashScreen from "../screens/SplashScreen";
import RoleScreen from "../screens/RoleScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import MemberDashboard from "../screens/MemberDashboard";
import TrainerDashboard from "../screens/TrainerDashboard";
import SupplierDashboard from "../screens/SupplierDashboard";
import AdminDashboard from "../screens/AdminDashboard";

import TrainerListScreen from "../screens/TrainerListScreen";
import TrainerDetailScreen from "../screens/TrainerDetailScreen";
import TrainerRequestsScreen from "../screens/TrainerRequestsScreen";
import AddTrainerScreen from "../screens/AddTrainerScreen";
import EditTrainerScreen from "../screens/EditTrainerScreen";

import SupplementStoreScreen from "../screens/SupplementStoreScreen";
import AddSupplementScreen from "../screens/AddSupplementScreen";
import EditSupplementScreen from "../screens/EditSupplementScreen";
import SupplierOrdersScreen from "../screens/SupplierOrdersScreen";

import MyOrdersScreen from "../screens/MyOrdersScreen";
import FeedbackScreen from "../screens/FeedbackScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
        {!user ? (
          <>
            <Stack.Screen name="Role" component={RoleScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {user.role === "member" && <Stack.Screen name="MemberDashboard" component={MemberDashboard} />}
            {user.role === "trainer" && <Stack.Screen name="TrainerDashboard" component={TrainerDashboard} />}
            {user.role === "supplier" && <Stack.Screen name="SupplierDashboard" component={SupplierDashboard} />}
            {user.role === "admin" && <Stack.Screen name="AdminDashboard" component={AdminDashboard} />}

            <Stack.Screen name="TrainerList" component={TrainerListScreen} />
            <Stack.Screen name="TrainerDetail" component={TrainerDetailScreen} />
            <Stack.Screen name="AddTrainer" component={AddTrainerScreen} />
            <Stack.Screen name="EditTrainer" component={EditTrainerScreen} />
            <Stack.Screen name="TrainerRequests" component={TrainerRequestsScreen} />

            <Stack.Screen name="SupplementStore" component={SupplementStoreScreen} />
            <Stack.Screen name="AddSupplement" component={AddSupplementScreen} />
            <Stack.Screen name="EditSupplement" component={EditSupplementScreen} />
            <Stack.Screen name="SupplierOrders" component={SupplierOrdersScreen} />

            <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
            <Stack.Screen name="Feedback" component={FeedbackScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}