import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import useLocationTracker from "../hooks/useLocationTracker";
import { router } from "expo-router";

interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  timestamp?: string;
  userId?: string;
}

export default function ExploreScreen() {
  const user = auth.currentUser;
  const userId = user?.uid ?? null;

  useLocationTracker(userId);

  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      Alert.alert("Not Logged In", "Please log in to view the map.");
      router.replace("/auth/Login");
      return;
    }

    const q = query(collection(db, "locations"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updated: LocationData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LocationData, "id">),
      }));
      setLocations(updated);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  if (!userId) return null; 

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const initialLat = locations[0]?.latitude ?? 37.78825;
  const initialLng = locations[0]?.longitude ?? -122.4324;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: initialLat,
          longitude: initialLng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {locations.map((loc) => (
          <Marker
            key={loc.id}
            coordinate={{
              latitude: loc.latitude,
              longitude: loc.longitude,
            }}
            title={`📍 ${new Date(
              loc.timestamp ?? Date.now()
            ).toLocaleString()}`}
            pinColor="blue"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
