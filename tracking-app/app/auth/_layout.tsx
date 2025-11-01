import React from "react";
import { Stack, router } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#001C33" },
        headerTintColor: "#E0F7FA",
        headerShadowVisible: false,
        headerTitle: "", 
        headerLeft: () => (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", marginLeft: 10 }}
            onPress={() => router.push("/")}
          >
            <Ionicons name="home-outline" size={22} color="#00C896" />
            <Text style={{ color: "#00C896", fontSize: 16, marginLeft: 4 }}>
              Home
            </Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen name="Login" />
      <Stack.Screen name="Signup" />
    </Stack>
  );
}
