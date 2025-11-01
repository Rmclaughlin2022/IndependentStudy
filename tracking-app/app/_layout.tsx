import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,                        
        contentStyle: { backgroundColor: "#001220" } 
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="auth"   options={{ headerShown: false }} />

    </Stack>
  );
}
