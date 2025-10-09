import React from "react";
import { View, Text } from "react-native";
import { useLocationTracker } from "../hooks/useLocationTracker";


export default function HomeScreen() {
  const userId = "user_123"; 
const location = useLocationTracker(userId) as
  | { latitude: number; longitude: number; timestamp: string }
  | null;
  return (
    <View style={{ padding: 20 }}>
      <Text>Your current location:</Text>
      {location ? (
        <Text>
          Lat: {location.latitude}{"\n"}
          Lng: {location.longitude}
        </Text>
      ) : (
        <Text>Getting location...</Text>
      )}
    </View>
  );
}
